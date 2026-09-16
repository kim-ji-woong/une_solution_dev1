using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Component;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class ArrowManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public ArrowManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("SOP 화살표 데이터를 읽어옵니다.");
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

            m_client.SendStatus("SOP 화살표 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            string strSQL = "Select ID, Text, BeginComponentID, BeginComponentPosition, EndComponentID, EndComponentPosition, StepMemberID from SopComponentArrow";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + Arrow.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Arrow.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Arrow.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + Arrow.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            strErrorMessage = null;
            int beginComponentNo = GetComponentNo(data.BeginComponentID);
            int endComponentNo = GetComponentNo(data.EndComponentID);

            if (beginComponentNo < 0 || endComponentNo < 0)
                return false;

            ArrowEx arrow = new ArrowEx();
            arrow.arrw_sn = data.ID;
            arrow.contents = data.Text;
            arrow.lc_optn_code = (int)CodeType.ArrowPosition;
            arrow.begin_compn_sn = beginComponentNo;
            arrow.begin_arrw_lc_code = GetArrowPosition(data.BeginComponentPosition);
            arrow.end_compn_sn = endComponentNo;
            arrow.end_arrw_lc_code = GetArrowPosition(data.EndComponentPosition);
            arrow.step_memb_sn = data.StepMemberID;

            return dataManager.GetCreate().Insert<ArrowEx>(arrow, out strErrorMessage);
        }

        private int GetComponentNo(int componentID)
        {
            int componentType = (int)(componentID >> 24);

            if (componentType == 0)
                return ProcessManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 1)
                return DecisionManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 2)
                return CommentManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 3)
                return EndpointManager.GetSectionNumber(componentID & 0x00ffffff);
            else if (componentType == 6)
                return TransmissionManager.GetSectionNumber(componentID & 0x00ffffff);

            return -1;
        }

        private int GetArrowPosition(int pos)
        {
            return (int)CodeType.ArrowPosition + pos;
        }
    }
}
