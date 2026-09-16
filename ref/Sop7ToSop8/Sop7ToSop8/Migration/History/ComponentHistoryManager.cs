using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.History
{
    using Models;
    using Sop;

    class ComponentHistoryManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public ComponentHistoryManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("최근 1년간 ComponentHistory 데이터를 읽어옵니다.");
            string strErrorMessage;

            IDataManager dataManager = m_client.Sop8DataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            if (ReadSop7(dataManager, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            m_client.SendStatus("최근 1년간 ComponentHistory 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            // 최근 1년 이내의 이력만 받아온다.
            string strSQL = "Select ID, ActionStepHistoryID, ComponentID, ComponentType, Time, Status, Task, CompleteCount, ShowBoard, AccessedUserID, CheckedNotify1, CheckedNotify2, CheckedRun, CheckedComplete, Description from SopHistoryComponent where Time >= " + ActionStepHistoryManager.GetTimeString(DateTime.Now.AddYears(-1));
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            strSQL = "Select ID, ComponentHistoryID, DataIndex, Datai, Dataf, Datas, Time from SopHistoryComponentDetail where Time >= " + ActionStepHistoryManager.GetTimeString(DateTime.Now.AddYears(-1));
            IEnumerable<dynamic> arrDetailResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + ComponentHistoryEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ComponentHistoryEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                // 에러가 발생해도 무시한다.
                CreateSop8(dataManager, data, out strErrorMessage);
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ComponentHistoryEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + ComponentHistoryDetailEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ComponentHistoryDetailEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrDetailResults)
            {
                // 에러가 발생해도 무시한다.
                CreateComponentHistoryDetail(dataManager, data, out strErrorMessage);
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ComponentHistoryDetailEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            int componentNo = GetComponentNo(data.ComponentID, data.ComponentType);

            ComponentHistoryEx history = new ComponentHistoryEx();
            history.compn_hist_sn = data.ID;
            history.action_step_hist_sn = data.ActionStepHistoryID;
            history.compn_sn = componentNo;
            history.time = data.Time;
            history.sop_sttus_optn_code = (int)CodeType.SopRunStatus;
            history.sop_sttus_code = history.sop_sttus_optn_code + data.Status;
            history.compt_cnt = data.CompleteCount;
            history.user_sn = data.Position;
            history.user_sn = data.AccessedUserID;
            history.descp = data.Description;

            return dataManager.GetCreate().Insert<ComponentHistoryEx>(history, out strErrorMessage) == false;
        }

        private bool CreateComponentHistoryDetail(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            //int componentNo = GetComponentNo(data.ComponentID, data.ComponentType);

            ComponentHistoryDetailEx history = new ComponentHistoryDetailEx();
            history.compn_hist_detail_sn = data.ID;
            history.compn_hist_sn = data.ComponentHistoryID;
            history.data_no = data.DataIndex;
            history.data_intgr = data.Datai;
            history.data_float = data.Dataf;
            history.data_str = data.Datas;

            return dataManager.GetCreate().Insert<ComponentHistoryDetailEx>(history, out strErrorMessage) == false;
        }

        private int GetComponentNo(int componentID, int componentType)
        {
            if (componentType == 0)
                return ProcessManager.GetSectionNumber(componentID);
            else if (componentType == 1)
                return DecisionManager.GetSectionNumber(componentID);
            else if (componentType == 2)
                return CommentManager.GetSectionNumber(componentID);
            else if (componentType == 3)
                return EndpointManager.GetSectionNumber(componentID);
            else if (componentType == 6)
                return TransmissionManager.GetSectionNumber(componentID);

            return -1;
        }
    }
}
