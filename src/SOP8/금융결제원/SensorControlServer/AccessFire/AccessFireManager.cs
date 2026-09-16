using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSensorServer;
using Response;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AccessFire
{
    class AccessFireManager : SensorServer
    {
        private static AccessFireManager m_processManager = null;
        private DataManager m_dataManager = null;

        private bool m_closeApp = false;

        private string m_strServerIP = null;
        //private int m_nPort = 0;
        private string m_strName = null;
        private string m_strID = null;
        private string m_strPW = null;

        private const string FIRE_KEY = "FireSensor";

        private AccessFireManager(string strServerIP, /*int port,*/ string strName, string strID, string strPW)
            : base("Fire\\AccessFire")
        {
            m_strServerIP = strServerIP;
            //m_nPort = port;
            m_strName = strName;
            m_strID = strID;
            m_strPW = strPW;

            m_dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, m_strServerIP, m_strName, m_strID, m_strPW);
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

            m_processManager.Logger.Write("AccessFireManager Run()");

            Thread t = new Thread(() => m_processManager.CheckAlarmThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static AccessFireManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // IP, Port 정보 필요
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            //string strPort = ConfigurationManager.AppSettings.Get("Port");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");

            //int port;

            //if (int.TryParse(strPort, out port))
            //    return new AccessFireManager(strServerIP, port, strID, strPW);

            //return null;
            return new AccessFireManager(strServerIP, strName, strID, strPW);
        }

        private void CheckAlarmThread()
        {
            m_closeApp = false;

            bool bFireStatus = false;

            while (m_closeApp == false)
            {
                try
                {
                    // 현재 화재 상태 조회
                    if (SelectFireStatus(out bool bIsFire, out string strErrorMessage))
                    {
                        // 기존 상태와 현재 상태 비교 후
                        if (bFireStatus != bIsFire)
                        {
                            SensorZone sensorZone = this.FindSensorZone(FIRE_KEY, out strErrorMessage);

                            // 화재 알람 발생 및 해제
                            if (SendSensorData(sensorZone.sensor_zone_sn, bIsFire, out strErrorMessage))
                            {
                                bFireStatus = bIsFire;
                                
                                if (bIsFire)
                                    this.Logger.Write("화재 알람 발생");
                                else
                                    this.Logger.Write("화재 알람 해제");
                            }
                            else
                            {
                                throw new ApplicationException(strErrorMessage);
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    this.Logger.Write("CheckAlarmThread() Exception : " + e.Message);
                }

                Thread.Sleep(1000);
            }
        }

        private bool SelectFireStatus(out bool bIsFire, out string strErrorMessage)
        {
            bIsFire = false;
            strErrorMessage = null;

            try
            {
                string strSQL = $"SELECT COUNT(*) as fire_cnt FROM View_Main_Status_Ex where EqStatus like '%2000' and DeviceName like '%명동%'";

                dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                if (result == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                int fire_cnt = result.fire_cnt;
                if (fire_cnt > 0)
                {
                    bIsFire = true;
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        public bool SendSensorData(int nSensorZoneID, bool isAlarm, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(nSensorZoneID, dnsDataKftc.CommonCode.SdmsSensor.SensorType.Fire, isAlarm);
            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }
    }
}
