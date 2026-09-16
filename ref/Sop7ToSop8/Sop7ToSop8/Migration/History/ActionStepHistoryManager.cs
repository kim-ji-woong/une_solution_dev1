using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Sop7ToSop8.Migration.History
{
    using Models;

    class ActionStepHistoryManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public ActionStepHistoryManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("최근 1년간 ActionStepHistory 데이터를 읽어옵니다.");
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

            m_client.SendStatus("최근 1년간 ActionStepHistory 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            // 최근 1년 이내의 이력만 받아온다.
            string strSQL = "Select ID, ActionStepID, RealMode, BeginTime, EndTime, LastAccessedTime, DetectEndTime, DetectTime, Position, LastAccessedUserID, StartOption, DisasterOption, SensorZoneHistoryID, Description from SopHistoryActionStep where BeginTime >= " + GetTimeString(DateTime.Now.AddYears(-1));
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + ActionStepHistoryEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ActionStepHistoryEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                // 에러가 발생해도 무시한다.
                CreateSop8(dataManager, data, out strErrorMessage);
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + ActionStepHistoryEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        public static string GetTimeString(DateTime time)
        {
            return string.Format("'{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}'", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            ActionStepHistoryEx history = new ActionStepHistoryEx();
            history.action_step_hist_sn = data.ID;
            history.action_step_sn = data.ActionStepID;
            history.begin_time = data.BeginTime;
            history.end_time = data.EndTime;
            history.last_acces_time = data.LastAccessedTime;
            history.detct_end_time = data.DetectEndTime;
            history.detct_time = data.DetectTime;
            history.lc = data.Position;
            history.user_sn = data.LastAccessedUserID;
            history.sop_optn = data.DisasterOption;
            history.sensor_zone_hist_sn = data.SensorZoneHistoryID;
            history.descp = data.Description;

            return dataManager.GetCreate().Insert<ActionStepHistoryEx>(history, out strErrorMessage) == false;
        }
    }
}
