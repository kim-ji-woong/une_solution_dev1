using System;
using System.Collections.Generic;
using Base.Model.History;
using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Windows.Forms;

namespace Sop7ToSop8.Migration.History
{
    using Models;

    class SensorReactionHistoryManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;
        private SensorZoneHistoryManager m_sensorZoneHistoryManager = null;

        private bool m_ignoreError = false;
        private string m_strIgnoreLogs = "";

        public SensorReactionHistoryManager(IMigrationClient client, int sop8SiteNo, SensorZoneHistoryManager sensorZoneHistoryManager)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
            m_sensorZoneHistoryManager = sensorZoneHistoryManager;
        }

        public bool Run()
        {
            m_client.SendStatus("최근 1년간 SensorReactionHistory 데이터를 읽어옵니다.");
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

            if (m_strIgnoreLogs.Length > 0)
                m_client.SendStatus(m_strIgnoreLogs);

            m_client.SendStatus("최근 1년간 SensorReactionHistory 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            // 최근 1년 이내의 이력만 받아온다.
            string strSQL = "Select ID, SensorZoneHistoryID, ReactionType, Time, Message, Param1, Param2, Param3, Param4, Param5 from SdmsHistorySensorReaction where Time >= " + SensorZoneHistoryManager.GetTimeString(DateTime.Now.AddYears(-1));
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + SensorReactionHistoryEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorReactionHistoryEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorReactionHistoryEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorReactionHistoryEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_sensorZoneHistoryManager.IsValidSensorZoneHistoryNo(data.SensorZoneHistoryID) == false)
                return true;

            SensorReactionHistoryEx history = new SensorReactionHistoryEx();
            history.sensor_react_hist_sn = data.ID;
            history.sensor_zone_hist_sn = data.SensorZoneHistoryID;
            history.react_ty_optn_code = (int)CodeType.ReactionType;
            history.react_ty_code = history.react_ty_optn_code + data.ReactionType;
            history.tm = data.Time;
            history.mssage = data.Message;
            history.eqp_zone_sn = ToNullableInt(data.Param1);
            int? sensorZoneNo = ToNullableInt(data.Param2);
            history.alarm_level = ToNullableInt(data.Param5);

            if (sensorZoneNo != null)
            {
                int sop8SensorZoneNo = m_sensorZoneHistoryManager.GetSop8SensorZoneNo((int)sensorZoneNo);

                if (sop8SensorZoneNo > 0)
                    history.sensor_zone_sn = sop8SensorZoneNo;
            }

            return dataManager.GetCreate().Insert<SensorReactionHistoryEx>(history, out strErrorMessage);
        }

        private int? ToNullableInt(object value)
        {
            if (value == null)
                return null;

            string strValue = value.ToString().Trim();

            int data;

            if (int.TryParse(strValue, out data))
                return data;

            return null;
        }
    }
}
