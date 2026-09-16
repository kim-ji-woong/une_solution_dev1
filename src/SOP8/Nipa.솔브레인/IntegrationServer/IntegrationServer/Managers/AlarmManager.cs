using Base.Model.Alarm;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using IntegrationServer.Servers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Managers
{
    public class AlarmManager
    {
        private static AlarmManager m_instance = null;
        public static AlarmManager Instance { get { return m_instance; } }

        private ServerManager m_serverManager = null;
        private DataManager m_dataManager = null;

        private bool m_bRunThread = false;
        private bool m_bRunTimeoutThread = false;

        private Dictionary<int, AlarmInfo> m_dicCurrentAlarm = new Dictionary<int, AlarmInfo>();
        
        private Thread m_LoadThread = null;
        private Thread m_TimeoutThread = null;
        
        public Dictionary<int, AlarmInfo> DicCurrentAlarm
        {
            get { return m_dicCurrentAlarm; }
        }

        private string m_strUrl = "";

        public AlarmManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerFrontURL)
        {
            m_instance = this;
            m_serverManager = serverManager;
            m_dataManager = dataManager;

            m_strUrl = strSOPWebServerFrontURL;

            m_bRunThread = true;
            
            m_LoadThread = new Thread(LoadCurrentAlarm);
            m_TimeoutThread = new Thread(CheckTimeoutAlarm);
        }
        
        public void Start()
        {
            m_bRunThread = true;
            m_LoadThread.Start();
            m_TimeoutThread.Start();
        }

        public void Stop()
        {
            m_bRunThread = false;
            m_LoadThread.Join();
            m_TimeoutThread.Join();
        }

        public void LoadCurrentAlarm()
        {
            //string strSQL = $@"
            //    select SensorZoneHistoryID, SensorType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs
            //      from SdmsAlarmCurrent ac";

            while (m_bRunThread)
            {
                DateTime dtNow = DateTime.Now;

                //IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out string strError);
                //if (dynamics == null)
                //{
                //    Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadCurrentAlarm : " + strError);
                //    return;
                //}
                IEnumerable<Current> curs = m_dataManager.GetSelect().Select<Current>(null, out string strError);
                if (curs == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadCurrentAlarm : " + strError);
                    return;
                }

                List<Current> currents = curs.Cast<Current>().ToList();

                Dictionary<int, AlarmInfo> dicCurrentAlarm = new Dictionary<int, AlarmInfo>();

                foreach (var item in currents)
                {
                    int nSensorZoneHistoryID = item.sensor_zone_hist_sn;
                    //int nSensorType = item.SensorType;
                    DateTime dtTimeStamp = item.alarm_tm;
                    int nSopStatus = item.sop_sttus_code;
                    int nDetectionType = item.detct_ty_code;
                    int nAlarmLevel = item.alarm_level;
                    //string strAlarmSensorZoneIDs = item.AlarmSensorZoneIDs;

                    // 솔브레인 사용하지 않음
                    //if (dtTimeStamp < dtNow.AddDays(-1)) // 하루가 경과된 알람들은 종료처리한다
                    //{
                    //    TimeoutAlarm(nSensorZoneHistoryID, dtNow);
                    //    continue;
                    //}

                    if (nSensorZoneHistoryID <= 0 || /*nSensorType < 0 ||*/ dtTimeStamp == null || nAlarmLevel <= 0)
                        continue;

                    //if (strAlarmSensorZoneIDs == null || strAlarmSensorZoneIDs.Length == 0)
                    //    continue;
                    string strCondition = string.Format($"{Base.Model.History.SensorZoneDetail.Fields.sensor_zone_hist_sn} = {nSensorZoneHistoryID}");
                    IEnumerable<Base.Model.History.SensorZoneDetail> details = m_dataManager.GetSelect().Select<Base.Model.History.SensorZoneDetail>(strCondition, out strError);
                    if (details == null)
                    {
                        Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadCurrentAlarm : " + strError);
                        continue;
                    }
                    //string[] alarmSensorZoneIDs = strAlarmSensorZoneIDs.Split(',');
                    //if (alarmSensorZoneIDs.Length == 0)
                    //    continue;
                    List<Base.Model.History.SensorZoneDetail> sensorZoneDetails = details.Cast<Base.Model.History.SensorZoneDetail>().ToList();
                    if (sensorZoneDetails.Count == 0)
                        continue;

                    for (int j = 0; j < sensorZoneDetails.Count; j++)
                    {
                        //if (!int.TryParse(alarmSensorZoneIDs[j], out int nSensorZoneID))
                        //    continue;
                        int nSensorZoneID = sensorZoneDetails[j].sensor_zone_sn;

                        if (!dicCurrentAlarm.ContainsKey(nSensorZoneID))
                            dicCurrentAlarm.Add(nSensorZoneID, new AlarmInfo());

                        dicCurrentAlarm[nSensorZoneID].SensorZoneHistoryID = nSensorZoneHistoryID;
                        //dicCurrentAlarm[nSensorZoneID].SensorType = nSensorType;
                        dicCurrentAlarm[nSensorZoneID].TimeStamp = dtTimeStamp;
                        dicCurrentAlarm[nSensorZoneID].SopStatus = nSopStatus;
                        dicCurrentAlarm[nSensorZoneID].DetectionType = nDetectionType;
                        dicCurrentAlarm[nSensorZoneID].AlarmLevel = nAlarmLevel;
                        dicCurrentAlarm[nSensorZoneID].SensorZoneID = nSensorZoneID;
                    }

                }

                m_dicCurrentAlarm = dicCurrentAlarm;

                Thread.Sleep(1000);
            }
        }

        public void CheckTimeoutAlarm()
        {
            string strErrorMessage;

            while (m_bRunThread)
            {
                try
                {
                    using (var handler = new HttpClientHandler())
                    {
                        handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };

                        using (HttpClient client = new HttpClient(handler))
                        {
                            client.Timeout = new TimeSpan(0, 0, 60);

                            string url = m_strUrl;
                            
                            if (!url.EndsWith("/"))
                                url += "/";
                            
                            url += "api/ClearAlarm/CheckTimeout";
                            
                            if (url.StartsWith("http"))
                                url = url.Replace("http", "https");
                            
                            if (url.Contains("127.0.0.1"))
                                url = url.Replace("127.0.0.1", "localhost");
                            
                            var content = new StringContent("{}", Encoding.UTF8, "application/json");
                            HttpResponseMessage response = client.PostAsync(url, content)
                                .ConfigureAwait(false)
                                .GetAwaiter()
                                .GetResult();
                            
                            if (!response.IsSuccessStatusCode)
                            {
                                strErrorMessage = response.ReasonPhrase;
                                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "CheckTimeoutAlarm Error: " + strErrorMessage);
                            }
                            else
                            {
                                strErrorMessage = $"HTTP {response.StatusCode}: {response.ReasonPhrase}";
                                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "CheckTimeoutAlarm Success: " + strErrorMessage);
                            }
                            response.Dispose();
                        }
                    }
                }
                catch (Exception ex)
                {
                    strErrorMessage = ex.Message;
                    Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "CheckTimeoutAlarm : " + strErrorMessage);
                }
                
                Thread.Sleep(1000 * 60 * 60);
            }
        }


    }
}
