using Base.Model.History;
using Base.Model.Sensor;
using Base.Model.Spatial;
using dnsSensorServer;
using Response;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace SVMS
{
    public class SvmsManager : SensorServer
    {
        private static SvmsManager m_processManager = null;

        private bool m_closeApp = false;
        private EventManager m_eventManager = null;

        // 전력 서비스를 위한 옵션
        private string m_strPowerSopWebServerUrl = null;
        private List<int> m_powerZoneNos = new List<int>();
        // 초순수 서비스를 위한 옵션
        private string m_strWaterSopWebServerUrl = null;
        private List<int> m_waterZoneNos = new List<int>();

        private SvmsManager()
            : base("CCTV\\SVMS")
        {
            ReadConfig();
            m_eventManager = new EventManager(this.DataManager, this);
        }

        private void ReadConfig()
        {
            m_strPowerSopWebServerUrl = ReadSopWebServerUrl("Url2");
            m_strWaterSopWebServerUrl = ReadSopWebServerUrl("Url3");

            m_powerZoneNos = ReadZoneNos("ZoneNos2");
            m_waterZoneNos = ReadZoneNos("ZoneNos3");
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

        public static void Run()
        {
            if (m_processManager == null)
            {
                m_processManager = new SvmsManager();

                if (m_processManager == null)
                    return;
            }
            else
                return;

            m_processManager.Logger.Write("SvmsManager Run()");

            Thread t = new Thread(() => m_processManager.MonitoringThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
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

        private void MonitoringThread()
        {
            string strErrorMessage;

            m_closeApp = false;

            while (m_closeApp == false)
            {
                try
                {
                    var events = m_eventManager.ReadEvents(out strErrorMessage);

                    if (events == null)
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    else
                        m_eventManager.SendEvent(events);

                    Thread.Sleep(500);

                    if (m_closeApp)
                        break;

                    m_eventManager.CheckAutoClose();
                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    this.Logger.Write("ConnectionThread() : " + e.Message);
                }
            }
        }

        // 1. 기존의 SopWebServerUrl에 신호를 보낸다.
        // 2. 전력을 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 전력용 ZoneNo인지 확인해야 한다.)
        // 3. 초순수를 위한 별도의 SopWebServerUrl이 존재하면 그쪽으로도 신호를 보낸다.(단, 초순수용 ZoneNo인지 확인해야 한다.)
        public MessageResult SendSensorData(int sensorZoneNo, int sensorType, bool isAlarm)
        {
            // 동기 호출
            // Normal SopWebServer
            MessageResult result = SendSensorAlarm(sensorZoneNo, sensorType, isAlarm);

            // 비동기 호출
            Task.Run(() =>
            {
                int? zoneNo = GetZoneNoFromSensorZoneNo(sensorZoneNo);

                // 전력 SopWebServer
                if (CheckZoneNo(zoneNo, m_strPowerSopWebServerUrl, m_powerZoneNos))
                {
                    SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, null, null, m_strPowerSopWebServerUrl);
                }

                // 초순수 SopWebServer(비동기 호출)
                if (CheckZoneNo(zoneNo, m_strWaterSopWebServerUrl, m_waterZoneNos))
                {
                    SendSensorAlarm(sensorZoneNo, sensorType, isAlarm, null, null, m_strWaterSopWebServerUrl);
                }
            }
            );

            return result;
        }

        private bool CheckZoneNo(int? zoneNo, string strSopWebServerUrl, List<int> zoneNos)
        {
            if (zoneNo == null || strSopWebServerUrl == null || strSopWebServerUrl.Trim().Length == 0 || zoneNos == null)
                return false;

            return zoneNos.Contains((int)zoneNo);
        }

        private int? GetZoneNoFromSensorZoneNo(int sensorZoneNo)
        {
            string strSQL = string.Format("Select d.{4} ZoneNo from {0} a inner join {1} b on a.{6} = b.{7} inner join {2} c on b.{7} = c.{8} inner join {3} d on c.{5} = d.{4} and a.{9} = {10}",
                Base.Model.Sensor.SensorZone.TableName, EquipmentZone.TableName, EquipmentZoneLinkedZone.TableName, Zone.TableName,
                Zone.Fields.zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn,
                Base.Model.Sensor.SensorZone.Fields.eqp_zone_sn,
                EquipmentZone.Fields.eqp_zone_sn,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                sensorZoneNo);

            string strErrorMessage;
            dynamic result = DataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);

            if (result == null)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine("GetZoneNoFromSensorZoneNo Error : " + strErrorMessage);
                return null;
            }

            return result.ZoneNo;
        }
    }
}
