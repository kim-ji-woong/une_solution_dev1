using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSensorServer;
using Kftc.Model.History;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static dnsDataKftc.CommonCode.SdmsSensor;

namespace AccessControl
{
    class AccessControlManager : SensorServer
    {
        private static AccessControlManager m_processManager = null;
        private AccessDataManager m_accessDataManager = null;

        private bool m_closeApp = false;

        private string m_strServerIP = null;
        private string m_strName = null;
        private string m_strID = null;
        private string m_strPW = null;

        private AccessControlManager(string strServerIP, string strName, string strID, string strPW)
            : base("Access\\AccessControl")
        {
            m_strServerIP = strServerIP;
            m_strName = strName;
            m_strID = strID;
            m_strPW = strPW;

            DataManager dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, m_strServerIP, m_strName, m_strID, m_strPW);

            m_accessDataManager = new AccessDataManager(this, dataManager);
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

            m_processManager.Logger.Write("AccessControlManager Run()");

            Thread t = new Thread(() => m_processManager.CheckAccessThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static AccessControlManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");

            return new AccessControlManager(strServerIP, strName, strID, strPW);
        }

        private void CheckAccessThread()
        {
            m_closeApp = false;

            while (m_closeApp == false)
            {
                try
                {
                    // 현재 출입문 센서 정보 가져오기
                    Dictionary<string, DoorInfo> doorInfos = GetDoorInfos(out string strErrMsg);
                    if (doorInfos == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 기존 출입 이력 ALARM ID 가져오기
                    int? nAlarmID = GetLastAlarmID(out strErrMsg);

                    // 기존 출입 이력 이후 신규 출입 이벤트 읽기
                    List<ComingPerson> comingPeople = m_accessDataManager.GetAccessEvents(nAlarmID, doorInfos, out strErrMsg);
                    if (comingPeople == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 신규 출입 이력 DB 적용
                    if (DataManager.GetCreate().Insert<ComingPerson>(comingPeople, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }


                }
                catch (Exception e)
                {
                    this.Logger.Write("CheckAccessThread() Exception : " + e.Message);
                }

                Thread.Sleep(500);
            }
        }

        private Dictionary<string, DoorInfo> GetDoorInfos(out string strErrMsg)
        {
            strErrMsg = "";
            Dictionary<string, DoorInfo> doorInfos = new Dictionary<string, DoorInfo>();

            try
            {
                string strSQL = string.Format(@$"SELECT {Sensor.TableName}.{Sensor.Fields.sensor_sn}, {Sensor.Fields.sensor_name}, {SensorZone.Fields.unq_key}
                                                FROM {Sensor.TableName} 
                                                INNER JOIN {SensorZone.TableName} ON {Sensor.TableName}.{Sensor.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_sn} 
                                                WHERE {SensorZone.TableName}.{Sensor.Fields.sensor_ty_code} = {SensorType.Door}");

                IEnumerable<dynamic> results = DataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    DoorInfo doorInfo = new DoorInfo();
                    doorInfo.SensorNo = result.sensor_sn;
                    doorInfo.SensorName = result.sensor_name;
                    doorInfo.DeviceID = result.unq_key;

                    doorInfos[result.unq_key] = doorInfo;
                }
            }
            catch (Exception e)
            {
                doorInfos = null;
                strErrMsg = e.Message;
            }

            return doorInfos;
        }

        private int? GetLastAlarmID(out string strErrMsg)
        {
            int? nAlarmID = null;
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT {ComingPerson.Fields.cmg_event_sn}
                                                FROM {ComingPerson.TableName} 
                                                ORDER BY {ComingPerson.Fields.cmg_event_sn} DESC");

                dynamic result = DataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                if (result == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                nAlarmID = result.cmg_event_sn;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
            }

            return nAlarmID;

        }
    }

    public class DoorInfo
    {
        public int SensorNo { get; set; }
        public string SensorName { get; set; }
        public string DeviceID { get; set; }
    }
}
