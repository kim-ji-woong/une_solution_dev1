using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using Newtonsoft.Json.Linq;
using Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IntegrationServer.Servers.HR.Soulbrain;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Servers
{
    public class ServerManager
    {
        private DataManager m_dataManager = null;
        private ServerSetting m_serverSetting = null;

        //private SopServerManager m_sopServerManager = null; // SOPWebServer 통신
        private Base.AlarmService.BLL.ProcessManager m_processManager = null;

        private SensorManager m_sensorManager = null;
        //private AlarmManager m_alarmManager = null;


        // Key : 서버 고유번호(SeqNo), 같은 종류의 서버가 여러개 필요할 경우 구분하기 위해 필요하다
        private Dictionary<int, IServer> m_dicServerDatas = null;

        public ServerManager(ServerSetting serverSetting)
        {
            // .net core 환경에서 ssl 접속시 예외처리
            System.Net.ServicePointManager.ServerCertificateValidationCallback += delegate (object sender,
                System.Security.Cryptography.X509Certificates.X509Certificate certificate,
                System.Security.Cryptography.X509Certificates.X509Chain chain,
                System.Net.Security.SslPolicyErrors sslPolicyErrors)
            {
                return true;
            };

            //m_sopServerManager = new SopServerManager();
            m_processManager = new Base.AlarmService.BLL.ProcessManager();

            m_dataManager = new DataManager(serverSetting.DbType, serverSetting.DbIP, serverSetting.DbName, serverSetting.DbID, serverSetting.DbPW);
            m_serverSetting = serverSetting;

            SetServer();
        }

        private void SetServer()
        {
            if (m_dicServerDatas == null)
                m_dicServerDatas = new Dictionary<int, IServer>();
            else
                m_dicServerDatas.Clear();

            if (m_serverSetting == null || m_serverSetting.ServerDatas == null)
            {
                m_dicServerDatas = null;
                return;
            }

            foreach (var item in m_serverSetting.ServerDatas)
            {
                if (!item.Use)
                    continue;

                switch (item.ServerType)
                {
                    case ServerType.Fire_Johnson:
                        if (!item.ServerProperties.ContainsKey(ServerProperty.MuxType))
                        {
                            Logger.Instance.Write(LogTypes.Error, ServerType.Fire_Johnson, item.SeqNo, "MuxType 정의 안됨");
                            continue;
                        }

                        MuxTypes muxType = (MuxTypes)Convert.ToInt32(item.ServerProperties[ServerProperty.MuxType]);
                        m_dicServerDatas[item.SeqNo] = new Fire.Johnson.JohnsonManager(this, item.SOPWebServerURL, item.SeqNo, item.SiteID, item.IP, item.Port, muxType, item.ServerAlias);
                        break;
                    case ServerType.CCTV_S1_SVMS:
                        m_dicServerDatas[item.SeqNo] = new CCTV.S1.SVMS.SvmsManager(this, m_dataManager, item.SOPWebServerURL, item.SiteID, item.SeqNo, item.ServerProperties, item.ServerAlias);
                        break;
                    case ServerType.Soulbrain_HR:
                        DataManager hrDataManager = MakeHrDataManager(item.ServerProperties, item.SeqNo);

                        if (hrDataManager == null)
                        {
                            Logger.Instance.Write(LogTypes.Error, ServerType.Soulbrain_HR, item.SeqNo, "HR DataManager 생성에 실패하였습니다.");
                            continue;
                        }
                        
                        m_dicServerDatas[item.SeqNo] = new HRManager(this, m_dataManager, hrDataManager, item.SiteID, item.SeqNo, item.ServerProperties, item.ServerAlias);
                        break;
                }
            }
        }

        private DataManager MakeHrDataManager(Dictionary<ServerProperty, object> serverProperties, int nServerSeqNo)
        {
            string strHrDbName = null;

            foreach (var item in serverProperties)
            {
                ServerProperty key = item.Key;
            
                if (item.Value == null)
                    continue;
        
                if (key == ServerProperty.HRDbName)
                {
                    strHrDbName = item.Value.ToString();
                }
            }

            if (string.IsNullOrEmpty(strHrDbName))
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.Soulbrain_HR, nServerSeqNo, "HrDbName 값이 유효하지 않습니다.");
                return null;
            }
            
            return new DataManager(m_serverSetting.DbType, m_serverSetting.DbIP, strHrDbName, m_serverSetting.DbID, m_serverSetting.DbPW);
        } 

        private List<string> JArrayToList(JArray arr)
        {
            List<string> arrDatas = new List<string>();

            foreach (var item in arr.Children())
            {
                string strValue = item.Value<string>().ToString();
                arrDatas.Add(strValue);
            }

            return arrDatas;
        }

        public bool BeginServer()
        {
            if (m_dicServerDatas == null)
                return false;

            m_sensorManager = new SensorManager(m_dataManager);
            //m_alarmManager = new AlarmManager(this, m_dataManager, m_serverSetting.SOPWebServerFrontURL);

            //List<int> sensorServerIDs = m_serverSetting.ServerDatas.Where(p => p.Use).Select(p => p.SeqNo).ToList();
            m_sensorManager.LoadData(m_serverSetting.ServerDatas);

            foreach (KeyValuePair<int, IServer> pair in m_dicServerDatas)
            {
                if (pair.Value.IsConnected == false)
                {
                    //string serverTxt = dnsSopID.ID.GetServerText(pair.Value.ServerType);
                    string serverTxt = pair.Value.ServerAlias;
                    if (serverTxt == null || serverTxt == "")
                        serverTxt = ServerType.GetServerText(pair.Value.ServerType);
                    else
                        serverTxt = ServerType.GetServerText(pair.Value.ServerType) + "_" + serverTxt;

                    pair.Value.Logger = Logger.Instance.Clone(m_serverSetting.LogPath, serverTxt);
                    pair.Value.Start();
                    pair.Value.Logger.Write(LogTypes.Info, pair.Value.ServerType, pair.Value.ServerSeqNo, "Start");
                }
            }

            return true;
        }

        public void StopServer()
        {
            if (m_dicServerDatas == null)
                return;

            m_sensorManager.Stop();
            //m_alarmManager.Stop();

            foreach (KeyValuePair<int, IServer> pair in m_dicServerDatas)
            {
                pair.Value.Stop();
                pair.Value.Logger.Close();
            }
        }

        /// <summary>
        /// 서버 연결 상태 DB 저장
        /// </summary>
        /// <param name="nServerSeqNo"></param>
        /// <param name="ServerType"></param>
        /// <param name="bState"></param>
        /// <returns></returns>
        public bool UpdateConnectState(int nServerSeqNo, int ServerType, bool bState)
        {
            string strError;

            dynamic nCount = m_dataManager.GetSelect().SelectFirst($"select count(*) cnt from OptionSDMS where PropertyName like '{ServerType}%'", out strError);
            if (nCount == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType, nServerSeqNo, strError);
                return false;
            }

            bool bResult = true;
            if (nCount.cnt == 0)
            {
                dynamic site = m_dataManager.GetSelect().SelectFirst("select id from site", out strError);
                if (site == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerType, nServerSeqNo, strError);
                    return false;
                }

                int nSiteID = site.id;
                string strSQL = $@"insert into OptionSDMS (propertyName, propertyValue, SiteID, Description) 
                                   values ()";

            }

            return bResult;
        }

        public bool SendSensorData(int nSensorZoneID, int nSensorType, bool bIsAlarm, string strSOPWebServerURL, out string strErrorMessage)
        {
            Base.AlarmService.IBLL.Models.RequestSendSensorAlarm data = new Base.AlarmService.IBLL.Models.RequestSendSensorAlarm();
            data.SensorZoneNo = nSensorZoneID;
            data.SensorType = nSensorType;

            MessageResult result = m_processManager.SendSensorSignal(data, bIsAlarm, strSOPWebServerURL);
            strErrorMessage = result.Message;
            return result.Success;
        }

        public bool SendClearAlarm(int? nSensorType, int? nSiteID, string strSOPWebServerURL, out string strErrorMessage)
        {
            Base.AlarmService.IBLL.Models.ClearAllAlarm data = new Base.AlarmService.IBLL.Models.ClearAllAlarm();
            data.SensorType = nSensorType;
            data.SiteNo = nSiteID;

            MessageResult result = m_processManager.ClearAllAlarm(data, strSOPWebServerURL);
            strErrorMessage = result.Message;
            return result.Success;
        }

        //public void SendSensorDataAsync(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, bool bIsAlarm)
        //{
        //    m_sopServerManager.SendSensorDataAsync(sopQueryManager, nSensorType, nTagID, nSensorZoneID, bIsAlarm);
        //}

        //public void SendClearAlarmAsync(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, int nClearType)
        //{
        //    m_sopServerManager.SendClearAlarmAsync(sopQueryManager, nSensorType, nTagID, nSensorZoneID, nClearType);
        //}

        //public bool SendClearPsmAlarm(SopQueryManager sopQueryManager, int nSensorZoneID)
        //{
        //    return m_sopServerManager.SendClearPsmAlarm(sopQueryManager, nSensorZoneID);
        //}

        public bool SendAllClear(int? nSiteID, string strSOPWebServerURL)
        {
            //return m_sopServerManager.SendAllClear(sopQueryManager, nSiteID);
            return true;
        }
        //public void SendAllClearAsync(SopQueryManager sopQueryManager)
        //{
        //    m_sopServerManager.SendAllClearAsync(sopQueryManager);
        //}
    }
}
