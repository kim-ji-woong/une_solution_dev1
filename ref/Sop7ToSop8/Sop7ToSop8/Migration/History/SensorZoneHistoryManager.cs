using System;
using System.Collections.Generic;
using Base.Model.History;
using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Windows.Forms;

namespace Sop7ToSop8.Migration.History
{
    using Models;

    class SensorZoneHistoryManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;
        
        private bool m_ignoreError = false;
        private string m_strIgnoreLogs = "";

        private Dictionary<int, int> m_dicSensorZoneHistoryNos = new Dictionary<int, int>();
        // Key : Sop7 SensorZone ID
        // Value : Sop8 SensorZone No
        private Dictionary<int, int> m_dicSensorZoneIDs = new Dictionary<int, int>();

        public SensorZoneHistoryManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("최근 1년간 SensorZoneHistory 데이터를 읽어옵니다.");
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

            m_client.SendStatus("최근 1년간 SensorZoneHistory 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(IDataManager dataManager, out string strErrorMessage)
        {
            // 최근 1년 이내의 이력만 받아온다.
            string strSQL = "Select ID, SensorZoneID, Data, Time, ZoneID, SensorType, DetectionStatus, SiteID, AllSensorZoneIDs, Memo from SdmsHistorySensorZone where Time >= " + GetTimeString(DateTime.Now.AddYears(-1));
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            // 자동증가 초기화
            if (dataManager.GetUpdate().Update("DBCC CHECKIDENT(" + SensorZoneHistoryEx.TableName + ", reseed, 0)", out strErrorMessage) == false)
                return false;

            // 자동증가 해제
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorZoneHistoryEx.TableName + " ON", out strErrorMessage) == false)
                return false;

            // Key : SensorZone ID
            // Value : OrgSensor ID
            Dictionary<int, int>  dicSensorZones = ReadSensorZones(out strErrorMessage);

            if (dicSensorZones == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(dataManager, data, dicSensorZones, out strErrorMessage) == false)
                {
                    // 자동증가 설정
                    string strTemp;
                    dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorZoneHistoryEx.TableName + " OFF", out strTemp);
                    return false;
                }
            }

            // 자동증가 설정
            if (dataManager.GetUpdate().Update("SET IDENTITY_INSERT " + SensorZoneHistoryEx.TableName + " OFF", out strErrorMessage) == false)
                return false;

            return true;
        }

        public static string GetTimeString(DateTime time)
        {
            return string.Format("'{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}'", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        // Key : SensorZone ID
        // Value : OrgSensor ID
        private Dictionary<int, int> ReadSensorZones(out string strErrorMessage)
        {
            string strSQL = "Select ID, OrgSensorID from SdmsSensorZone";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return null;

            Dictionary<int, int> dicSensorZones = new Dictionary<int, int>();

            foreach (var data in arrResults)
            {
                if (data.OrgSensorID != null)
                    dicSensorZones[data.ID] = data.OrgSensorID;
            }

            return dicSensorZones;
        }

        private bool CreateSop8(IDataManager dataManager, dynamic data, Dictionary<int, int> dicSensorZones, out string strErrorMessage)
        {
            SensorZoneHistoryEx history = new SensorZoneHistoryEx();
            history.sensor_zone_hist_sn = data.ID;
            history.tm = data.Time;
            history.zone_sn = data.ZoneID;
            history.sensor_ty_optn_code = (int)CodeType.SensorType;
            history.sensor_ty_code = GetSensorTypeCode(history, data.SensorType);
            history.memo = data.Memo;
            history.site_sn = m_nSop8SiteNo;

            if (data.DetectionStatus != null)
            {
                history.detct_sttus_optn_code = (int)CodeType.DetectStatus;
                history.detct_sttus_code = history.detct_sttus_optn_code + data.DetectionStatus;
            }

            if (dataManager.GetCreate().Insert<SensorZoneHistoryEx>(history, out strErrorMessage) == false)
                return false;

            m_dicSensorZoneHistoryNos[history.sensor_zone_hist_sn] = history.sensor_zone_hist_sn;

            if (data.AllSensorZoneIDs != null)
            {
                int sensorZoneID;
                string[] tokens = data.AllSensorZoneIDs.Trim().Split(',');

                foreach (string strSensorZoneID in tokens)
                {
                    if (int.TryParse(strSensorZoneID, out sensorZoneID))
                    {
                        int sop8SensorZoneNo = Sensor.SensorManager.ConvertSensorZoneID(sensorZoneID, data.SensorType, dicSensorZones);

                        if (sop8SensorZoneNo < 0)
                        {
                            strErrorMessage = string.Format("확인할 수 없는 SensorZone ID입니다. SensorZoneHistoryID({0}), SensorZoneID({1})", history.sensor_zone_hist_sn, sensorZoneID);

                            if (m_ignoreError == false)
                                m_client.SendStatus(strErrorMessage);
                            else
                                AddIgnoreLog(strErrorMessage);

                            if (m_ignoreError == false)
                            {
                                DialogResult result = m_client.CheckInterrupt();

                                if (result == DialogResult.No)
                                {
                                    strErrorMessage = "작업이 중단됩니다.";
                                    return false;
                                }
                                else
                                {
                                    if (result == DialogResult.Cancel)
                                        m_ignoreError = true;

                                    strErrorMessage = null;
                                }
                            }
                        }

                        if (sop8SensorZoneNo > 0)
                        {
                            m_dicSensorZoneIDs[sensorZoneID] = sop8SensorZoneNo;

                            if (CreateSensorZoneHistoryDetail(dataManager, history, sop8SensorZoneNo, sensorZoneID, out strErrorMessage) == false)
                                return false;
                        }
                    }
                }
            }

            return true;
        }

        private void AddIgnoreLog(string strErrorMessage)
        {
            if (m_strIgnoreLogs.Length == 0)
                m_strIgnoreLogs = strErrorMessage;
            else
                m_strIgnoreLogs += "\r\n" + strErrorMessage;
        }

        private bool CreateSensorZoneHistoryDetail(IDataManager dataManager, SensorZoneHistoryEx history, int sensorZoneNo, int sop7SensorZoneID, out string strErrorMessage)
        {
            SensorZoneDetail sensorZoneHistoryDetail = new SensorZoneDetail();
            sensorZoneHistoryDetail.sensor_zone_hist_sn = history.sensor_zone_hist_sn;
            sensorZoneHistoryDetail.sensor_zone_sn = sensorZoneNo;
            sensorZoneHistoryDetail.tm = history.tm;

            if (dataManager.GetCreate().Insert<SensorZoneDetail>(sensorZoneHistoryDetail, out strErrorMessage) == false)
            {
                strErrorMessage += string.Format("\r\nSensorZoneHistoryID({0}), SensorZoneID({1})", sensorZoneHistoryDetail.sensor_zone_hist_sn, sop7SensorZoneID);

                if (m_ignoreError == false)
                    m_client.SendStatus(strErrorMessage);
                else
                    AddIgnoreLog(strErrorMessage);

                if (m_ignoreError == false)
                {
                    DialogResult result = m_client.CheckInterrupt();

                    if (result == DialogResult.No)
                    {
                        strErrorMessage = "작업이 중단됩니다.";
                        return false;
                    }
                    else
                    {
                        if (result == DialogResult.Cancel)
                            m_ignoreError = true;

                        strErrorMessage = null;
                    }
                }
            }

            return true;
        }

        private int GetSensorTypeCode(SensorZoneHistoryEx history, int sensorType)
        {
            if (sensorType >= 900 && sensorType <= 906)
            {
                return SdmsSensor.SensorType.CCTV;
            }

            return history.sensor_ty_optn_code + sensorType;
        }

        public bool IsValidSensorZoneHistoryNo(int sensorZoneHistoryNo)
        {
            return m_dicSensorZoneHistoryNos.ContainsKey(sensorZoneHistoryNo);
        }

        public int GetSop8SensorZoneNo(int sop7SensorZoneID)
        {
            int sensorZoneNo;

            if (m_dicSensorZoneIDs.TryGetValue(sop7SensorZoneID, out sensorZoneNo))
                return sensorZoneNo;

            return -1;
        }
    }
}
