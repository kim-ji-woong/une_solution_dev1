using Base.Model.Sensor;
using Base.Model.Spatial;
using dnsSensorServer;
using Response;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace Johnson
{
    class JohnsonManager : SensorServer
    {
        private static JohnsonManager m_processManager = null;

        private bool m_closeApp = false;
        private string m_strServerIP = null;
        private int m_nPort = 0;
        private string m_strServerType = null;

        // 현재 DB에 저장된 상태값
        private bool m_dbConnectState = false;

        // 전력 서비스를 위한 옵션
        private string m_strPowerSopWebServerUrl = null;
        private List<int> m_powerZoneNos = new List<int>();
        // 초순수 서비스를 위한 옵션
        private string m_strWaterSopWebServerUrl = null;
        private List<int> m_waterZoneNos = new List<int>();

        private JohnsonProvider m_provider = null;

        private JohnsonManager(string strServerIP, int port, int muxType, string strServerType, string strPowerUrl, string strWaterUrl, List<int> powerZoneNos, List<int> waterZoneNos)
            : base("Fire\\Johnson")
        {
            m_strServerIP = strServerIP;
            m_nPort = port;
            m_strServerType = strServerType;

            m_strPowerSopWebServerUrl= strPowerUrl;
            m_powerZoneNos = powerZoneNos;
            m_strWaterSopWebServerUrl = strWaterUrl;
            m_waterZoneNos = waterZoneNos;

            m_provider = new JohnsonProvider(this, muxType);
            m_provider.LengthAdd = false;
        }

        public static void Run()
        {
            if (m_processManager == null)
            {
                m_processManager = MakeInstance();

                if (m_processManager == null)
                    return;
            }
            else
                return;

            m_processManager.Logger.Write("JohnsonManager Run()");

            Thread t = new Thread(() => m_processManager.ConnectionThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static JohnsonManager MakeInstance()
        {
            string strPowerUrl = null, strWaterUrl = null;
            List<int> powerZoneNos = null, waterZoneNos = null;
            ReadOtherServiceOptions(ref strPowerUrl, ref strWaterUrl, ref powerZoneNos, ref waterZoneNos);

            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strPort = ConfigurationManager.AppSettings.Get("Port");
            string strMuxType = ConfigurationManager.AppSettings.Get("MuxType");
            string strServerType = ConfigurationManager.AppSettings.Get("ServerType");

            int port, muxType;

            if (int.TryParse(strPort, out port) && int.TryParse(strMuxType, out muxType))
                return new JohnsonManager(strServerIP, port, muxType, strServerType, strPowerUrl, strWaterUrl, powerZoneNos, waterZoneNos);

            return null;
        }

        private static void ReadOtherServiceOptions(ref string strPowerUrl, ref string strWaterUrl, ref List<int> powerZoneNos, ref List<int> waterZoneNos)
        {
            strPowerUrl = ReadSopWebServerUrl("Url2");
            strWaterUrl = ReadSopWebServerUrl("Url3");

            powerZoneNos = ReadZoneNos("ZoneNos2");
            waterZoneNos = ReadZoneNos("ZoneNos3");
        }

        private static string ReadSopWebServerUrl(string strTag)
        {
            string strUrl = ConfigurationManager.AppSettings.Get(strTag);

            if (strUrl == null)
                return null;

            return strUrl.Trim();
        }

        private static List<int> ReadZoneNos(string strTag)
        {
            List<int> zoneNos = new List<int>();
            string strZoneNos = ConfigurationManager.AppSettings.Get(strTag);

            if (strZoneNos == null)
                return zoneNos;

            int data;
            string[] tokens = strZoneNos.Split(",");

            foreach (string strToken in tokens)
            {
                if (int.TryParse(strToken.Trim(), out data))
                    zoneNos.Add(data);
            }

            return zoneNos;
        }

        public static void Stop()
        {
            if (m_processManager != null)
            {
                m_processManager.m_closeApp = true;
                m_processManager = null;
            }
            else
                return;
        }

        private void ConnectionThread()
        {
            string strErrorMessage;

            m_closeApp = false;
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_closeApp == false)
            {
                try
                {
                    if (m_provider.IsConnected)
                    {
                        if (m_dbConnectState == false)
                        {   // 연결 상태 업데이트   
                            if (UpdateConnectionState(m_strServerType, true, out strErrorMessage))
                                m_dbConnectState = true;
                        }

                        // 10초 이상 아무 신호를 못받으면 접속이 끊어진 것으로 간주한다.
                        if (m_provider.PingCount > 10)
                        {
                            // 아무 신호나 보내본다.
                            int nResult = m_provider.Send(pingBytes, 0, 1);

                            if (nResult < 0)
                            {
                                lock (m_provider)
                                {
                                    m_provider.PingCount = 0;
                                    m_provider.Close();

                                    if (m_provider.Client.Client != null)
                                    {
                                        if (m_provider.Client.Connected)
                                            m_provider.Client.Close();

                                        System.Diagnostics.Trace.WriteLine("Close Provider1 : " + !m_provider.Client.Connected);
                                    }
                                }
                            }
                            else
                                m_provider.PingCount = 0;
                        }
                        else
                            m_provider.PingCount++;
                    }

                    if (!m_provider.IsConnected)
                    {
                        lock (m_provider)
                        {
                            if (m_nPort > 0)
                            {
                                m_provider.Connect(m_strServerIP, m_nPort);
                                this.Logger.Write("[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_provider.IsConnected);

                                if (m_provider.IsConnected == false && m_dbConnectState == true)
                                {   // 연결 상태 업데이트   
                                    if (UpdateConnectionState(m_strServerType, false, out strErrorMessage))
                                        m_dbConnectState = false;
                                }
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    this.Logger.Write("ConnectionThread() : " + e.Message);

                    Thread.Sleep(60000);
                }
            }
        }

        // 1. 기존의 SopWebServerUrl에 신호를 보낸다.
        // 2. 전력을 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 전력용 ZoneNo인지 확인해야 한다.)
        // 3. 초순수를 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 초순수용 ZoneNo인지 확인해야 한다.)
        public bool SendSensorData(SensorZone sensorZone, int sensorType, bool isAlarm, out string strErrorMessage)
        {
            // 동기 호출
            // Normal SopWebServer
            bool result = SendSensorData(sensorZone.sensor_zone_sn, sensorType, isAlarm, null, out strErrorMessage);

            // 비동기 호출
            Task.Run(() =>
                {
                    int? zoneNo = GetZoneNoFromSensorZone(sensorZone);

                    // 전력 SopWebServer
                    if (CheckZoneNo(zoneNo, m_strPowerSopWebServerUrl, m_powerZoneNos))
                    {
                        string strTemp;
                        SendSensorData(sensorZone.sensor_zone_sn, sensorType, isAlarm, m_strPowerSopWebServerUrl, out strTemp);
                    }

                    // 초순수 SopWebServer(비동기 호출)
                    if (CheckZoneNo(zoneNo, m_strWaterSopWebServerUrl, m_waterZoneNos))
                    {
                        string strTemp;
                        SendSensorData(sensorZone.sensor_zone_sn, sensorType, isAlarm, m_strWaterSopWebServerUrl, out strTemp);
                    }
                }
            );

            return result;
            /*MessageResult result = SendSensorAlarm(sensorZone.sensor_zone_sn, sensorType, isAlarm);

            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;*/
        }

        public bool SendAllClear(int? siteNo, out string strErrorMessage)
        {
            MessageResult result = ClearAllAlarm(dnsData.CommonCode.SdmsSensor.SensorType.Fire, null, siteNo);

            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }

        private bool CheckZoneNo(int? zoneNo, string strSopWebServerUrl, List<int> zoneNos)
        {
            if (zoneNo == null || strSopWebServerUrl == null || strSopWebServerUrl.Trim().Length == 0 || zoneNos == null)
                return false;

            return zoneNos.Contains((int)zoneNo);
        }

        private bool SendSensorData(int sensorZoneNo, int sensorType, bool isAlarm, string strSopWebServerUrl, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, null, null, strSopWebServerUrl);

            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }

        private int? GetZoneNoFromSensorZone(SensorZone sensorZone)
        {
            if (sensorZone.eqp_zone_sn == null)
                return null;

            string strSQL = string.Format("Select c.{3} ZoneNo from {0} a inner join {1} b on a.{5} = b.{6} inner join {2} c on b.{4} = c.{3} and a.{5} = {7}",
                EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName, Zone.TableName,
                Zone.Fields.zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn,
                EquipmentZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                (int)sensorZone.eqp_zone_sn);

            string strErrorMessage;
            dynamic result = DataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);

            if (result == null)
            {
                System.Diagnostics.Trace.WriteLine("GetZoneNoFromSensorZone Error : " + strErrorMessage);
                return null;
            }

            return result.ZoneNo;
        }
    }
}
