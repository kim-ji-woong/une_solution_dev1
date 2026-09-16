using dnsSensorServer;
using Eraeseeds.Datas;
using Response;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Eraeseeds
{
    class EraeseedsManager : SensorServer
    {
        private static EraeseedsManager m_processManager = null;

        private bool m_closeApp = false;
        private bool m_isConnect = false;

        private string m_strServerIP = null;
        private int m_nPort = 0;

        private ClientProvider m_provider = null;

        private EraeseedsManager(string strServerIP, int port) 
            : base("EmergencyBell\\Eraeseeds")
        {
            m_strServerIP = strServerIP;
            m_nPort = port;

            m_provider = new ClientProvider(this);
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

            m_processManager.Logger.Write("EraeseedsManager Run()");

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

        private static EraeseedsManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // IP, Port 정보 필요
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strPort = ConfigurationManager.AppSettings.Get("Port");

            int port;

            if (int.TryParse(strPort, out port))
                return new EraeseedsManager(strServerIP, port);

            return null;
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
            m_closeApp = false;
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_closeApp == false)
            {
                try
                {
                    if (!m_provider.IsConnected)
                    {
                        lock (m_provider)
                        {
                            if (m_nPort > 0 && m_strServerIP != null && m_strServerIP != "")
                            {
                                bool result = m_provider.Connect(m_strServerIP, m_nPort);
                                this.Logger.Write("[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_provider.IsConnected);

                                if (m_isConnect == false && result == true)
                                {   // 연결 성공
                                    m_isConnect = true;
                                    this.Logger.Write("ConnectionThread() : " + m_strServerIP + ":" + m_nPort.ToString() + " / " + m_isConnect);
                                }
                                else if (m_isConnect == true && result == false)
                                {   // 연결 실패
                                    m_isConnect = false;
                                    this.Logger.Write("ConnectionThread() : " + m_strServerIP + ":" + m_nPort.ToString() + " / " + m_isConnect);
                                }
                            }
                        }
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    this.Logger.Write("ConnectionThread() Exception : " + e.Message);
                }
            }
        }

        public void ProcessData(byte cmd, byte[] bytes, int len)
        {
            SensorTag sensorTag = null;
            bool isAlarm = false;

            if (cmd == Cep5000.EventOn || cmd == Cep5000.EventOff)
            {
                isAlarm = cmd == Cep5000.EventOn;
                sensorTag = Cep5000.GetSensor(cmd, len, bytes);
            }
            else if (cmd == Cep5200.EventOn || cmd == Cep5200.EventOff || cmd == Cep5200.EventOnV2 || cmd == Cep5200.EventOffV2)
            {
                isAlarm = cmd == Cep5200.EventOn || cmd == Cep5200.EventOnV2;
                sensorTag = Cep5200.GetSensor(this.DataManager, cmd, len, bytes, this.Logger);
            }
            else if (cmd == Cep5200.EquipList || cmd == Cep5200.EquipName || cmd == Cep5200.EquipStatus)
                Cep5200.GetSensor(this.DataManager, cmd, len, bytes, this.Logger);

            if (sensorTag != null)
            {
                if (SendSensorData(sensorTag, isAlarm, out string strErrorMessage) == false)
                {
                    this.Logger.Write($"SendSensorData Error (UniqueKey: {sensorTag.UniqueKey}, SensorZoneID: {sensorTag.SensorZoneID}, isAlarm: {isAlarm}) : {strErrorMessage}");
                }
            }
                
        }

        public bool SendSensorData(SensorTag sensorTag, bool isAlarm, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(sensorTag.SensorZoneID, dnsDataKftc.CommonCode.SdmsSensor.SensorType.EmergencyBell, isAlarm);
            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }
    }

    public class SensorTag
    {
        private int m_nSensorType = 0;
        private int m_nSensorZoneID = 0;
        private int m_nSensorID = 0;
        private string m_strUniqueKey = string.Empty;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }
    }
}
