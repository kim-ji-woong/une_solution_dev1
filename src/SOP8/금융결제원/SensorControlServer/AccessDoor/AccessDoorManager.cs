using Base.Model.Alarm;
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
using static dnsDataKftc.CommonCode.SdmsSensor;

namespace AccessDoor
{
    class AccessDoorManager : SensorServer
    {
        private const string KEY_DOOR = "DOOR_";
        private const string TYPE_OPEN = "opened";
        private const string TYPE_CLOSE = "closed";

        private const string EVENT_CODE_CLOSE_4002 = "4002";
        private const string EVENT_CODE_CLOSE_4402 = "4402";
        private const string EVENT_CODE_OPEN = "4401";

        private const int CODE_OPEN = 1;
        private const int CODE_CLOSE = 0;

        private const int EVENT_CLOSE = 3;
        private const int EVENT_OPEN = 4;

        private static AccessDoorManager m_processManager = null;
        private AccessManager m_accessManager = null;

        private bool m_closeApp = false;

        private string m_strServerIP = null;
        private string m_strName = null;
        private string m_strID = null;
        private string m_strPW = null;

        private FireAlarmInfo m_alarmInfo = new FireAlarmInfo(null, false);

        private List<int> m_forceAlarms = new List<int>();
        private List<int> m_longAlarms = new List<int>();

        private AccessDoorManager(string strServerIP, string strName, string strID, string strPW)
           : base("Door\\AccessDoor")
        {
            m_strServerIP = strServerIP;
            m_strName = strName;
            m_strID = strID;
            m_strPW = strPW;

            DataManager dataManager = new DataManager((int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver, m_strServerIP, m_strName, m_strID, m_strPW);

            m_accessManager = new AccessManager(this, dataManager);
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

            m_processManager.Logger.Write("AccessDoorManager Run()");

            Thread t = new Thread(() => m_processManager.CheckDoorStatusThread())
            {
                IsBackground = true
            };

            t.Start();

            while (m_processManager.m_closeApp == false)
            {
                Thread.Sleep(1000);
            }
        }

        private static AccessDoorManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");

            return new AccessDoorManager(strServerIP, strName, strID, strPW);
        }

        private void CheckDoorStatusThread()
        {
            m_closeApp = false;

            while (m_closeApp == false)
            {
                try
                {
                    // VIEW_DOOR_STATUS_EX 조회
                    List<DoorStatus> statuses = m_accessManager.GetDoorStatus(out string strErrMsg);
                    if (statuses == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }                    

                    // 도어 상태 업데이트
                    if (UpdateDoorStatus(statuses, out strErrMsg) == false)
                    {
                        throw new ApplicationException(strErrMsg);
                    }


                    // 출입문 닫힘 이상
                    List<DoorStatus> forceDoors = statuses.FindAll(x => (x.Status == EVENT_CODE_CLOSE_4002 || x.Status == EVENT_CODE_CLOSE_4402));

                    // 출입문 닫힘 이상 알람 해제
                    foreach (int nDeviceID in m_forceAlarms)
                    {
                        DoorStatus door = forceDoors.Find(x => x.DeviceID == nDeviceID);
                        if (door == null)
                        {
                            // SensorZoneNo 찾기
                            int? nSensorZoneNo = GetDoorSensorZoneNo(nDeviceID, EVENT_CLOSE, out strErrMsg);
                            if (nSensorZoneNo.HasValue)
                            {
                                // 알람 해제
                                if (SendSensorData(nSensorZoneNo.Value, false, out strErrMsg) == false)
                                {
                                    this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {false}, SensorZoneNo: {nSensorZoneNo.Value})");
                                }
                                else
                                {
                                    // 해제되면 리스트 제거
                                    m_forceAlarms.Remove(nDeviceID);
                                }
                            }
                            else
                            {
                                this.Logger.Write($"GetDoorSensorZoneNo Error (DeviceID: {nDeviceID}, SubTypeNo: {EVENT_CLOSE}, Message: {strErrMsg})");
                            }
                        }
                    }

                    foreach (DoorStatus forceDoor in forceDoors)
                    {
                        int nDeviceID = forceDoor.DeviceID;

                        if (m_forceAlarms.Contains(nDeviceID) == false)
                        {
                            // SensorZoneNo 찾기
                            int? nSensorZoneNo = GetDoorSensorZoneNo(nDeviceID, EVENT_CLOSE, out strErrMsg);
                            if (nSensorZoneNo.HasValue)
                            {
                                // 알람 발생
                                if (SendSensorData(nSensorZoneNo.Value, true, out strErrMsg) == false)
                                {
                                    this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {true}, SensorZoneNo: {nSensorZoneNo.Value})");
                                }
                                else
                                {
                                    // 발생되면 리스트 추가
                                    m_forceAlarms.Add(nDeviceID);
                                }
                            }
                            else
                            {
                                this.Logger.Write($"GetDoorSensorZoneNo Error (DeviceID: {nDeviceID}, SubTypeNo: {EVENT_CLOSE}, Message: {strErrMsg})");
                            }
                        }
                    }


                    // 출입문 열림 이상
                    List<DoorStatus> longDoors = statuses.FindAll(x => x.Status == EVENT_CODE_OPEN);

                    // 장시간 열림 알람 해제
                    foreach (int nDeviceID in m_longAlarms)
                    {
                        DoorStatus door = longDoors.Find(x => x.DeviceID == nDeviceID);
                        if (door == null)
                        {
                            // SensorZoneNo 찾기
                            int? nSensorZoneNo = GetDoorSensorZoneNo(nDeviceID, EVENT_OPEN, out strErrMsg);
                            if (nSensorZoneNo.HasValue)
                            {
                                // 알람 해제
                                if (SendSensorData(nSensorZoneNo.Value, false, out strErrMsg) == false)
                                {
                                    this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {false}, SensorZoneNo: {nSensorZoneNo.Value})");
                                }
                                else
                                {
                                    // 해제되면 리스트 제거
                                    m_longAlarms.Remove(nDeviceID);
                                }
                            }
                            else
                            {
                                this.Logger.Write($"GetDoorSensorZoneNo Error (DeviceID: {nDeviceID}, SubTypeNo: {EVENT_OPEN}, Message: {strErrMsg})");
                            }                            
                        }
                    }

                    foreach (DoorStatus longDoor in longDoors)
                    {
                        int nDeviceID = longDoor.DeviceID;

                        if (m_longAlarms.Contains(nDeviceID) == false)
                        {
                            // SensorZoneNo 찾기
                            int? nSensorZoneNo = GetDoorSensorZoneNo(nDeviceID, EVENT_OPEN, out strErrMsg);
                            if (nSensorZoneNo.HasValue)
                            {
                                // 알람 발생
                                if (SendSensorData(nSensorZoneNo.Value, true, out strErrMsg) == false)
                                {
                                    this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {true}, SensorZoneNo: {nSensorZoneNo.Value})");
                                }
                                else
                                {
                                    // 발생되면 리스트 추가
                                    m_longAlarms.Add(nDeviceID);
                                }
                            }
                            else
                            {
                                this.Logger.Write($"GetDoorSensorZoneNo Error (DeviceID: {nDeviceID}, SubTypeNo: {EVENT_OPEN}, Message: {strErrMsg})");
                            }
                        }
                    }





                    /* 화재에 따른 문 닫힘 알람은 없음    
                     
                    // 화재 알람 조회
                    DateTime? alarmTime = GetFireAlarmTime(out strErrMsg);
                    if (alarmTime == null && strErrMsg?.Length > 0)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 화재 상태에 따라 도어 잠김 확인 
                    if (alarmTime.HasValue && m_alarmInfo.AlarmTime == null)
                    {   // 화재 발생
                        m_alarmInfo.AlarmTime = alarmTime;

                        // 이미 화재 발생 후 5초 경과했다면 도어 잠김 경우 도어 알람 발생
                        TimeSpan difference = DateTime.Now - alarmTime.Value;
                        if (difference.TotalSeconds >= 5 && m_alarmInfo.IsDoorAlarm == false)
                        {
                            // 도어 알람 발생
                            List<DoorStatus> closeDoors = statuses.FindAll(x => x.OpenStatus == (int)DoorStatus.DOOR_STATUS.CLOSE);
                            if (closeDoors?.Count > 0)
                            {
                                // 도어 알람 발생
                                List<DoorAlarmInfo> doorAlarms = GetDoorSensorZoneNo(closeDoors, out strErrMsg);
                                if (doorAlarms == null)
                                {
                                    throw new ApplicationException(strErrMsg);
                                }
                                else if (doorAlarms.Count > 0)
                                {
                                    foreach (DoorAlarmInfo alarmInfo in doorAlarms)
                                    {
                                        if (SendSensorData(alarmInfo.SensorZoneNo, true, out strErrMsg) == false)
                                        {
                                            this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {true}, SensorZoneNo: {alarmInfo.SensorZoneNo})");
                                        }
                                    }
                                }
                            }

                            m_alarmInfo.IsDoorAlarm = true;
                        }
                    }
                    else if (m_alarmInfo.AlarmTime != null && alarmTime == null)
                    {   // 화재 알람 해제

                        // 발생 중인 도어 알람 해제
                        List<DoorAlarmInfo> doorAlarms = GetDoorAlarm(out strErrMsg);
                        if (doorAlarms == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        // 알람 해제
                        foreach (DoorAlarmInfo doorAlarm in doorAlarms)
                        {
                            if (SendSensorData(doorAlarm.SensorZoneNo, false, out strErrMsg) == false)
                            {
                                this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {false}, SensorZoneNo: {doorAlarm.SensorZoneNo})");
                            }
                        }

                        m_alarmInfo.AlarmTime = null;
                        m_alarmInfo.IsDoorAlarm = false;
                    }
                    else if (alarmTime != null && m_alarmInfo.AlarmTime != null)
                    {                        
                        if (m_alarmInfo.IsDoorAlarm == false)
                        {
                            // 화재 발생시 5초 경과 후 도어 잠김 경우 도어 알람 발생
                            TimeSpan difference = DateTime.Now - alarmTime.Value;
                            if (difference.TotalSeconds >= 5)
                            {
                                // 도어 알람 발생
                                List<DoorStatus> closeDoors = statuses.FindAll(x => x.OpenStatus == (int)DoorStatus.DOOR_STATUS.CLOSE);
                                if (closeDoors?.Count > 0)
                                {
                                    // 도어 알람 발생
                                    List<DoorAlarmInfo> doorAlarms = GetDoorSensorZoneNo(closeDoors, out strErrMsg);
                                    if (doorAlarms == null)
                                    {
                                        throw new ApplicationException(strErrMsg);
                                    }
                                    else if (doorAlarms.Count > 0)
                                    {
                                        foreach (DoorAlarmInfo alarmInfo in doorAlarms)
                                        {
                                            if (SendSensorData(alarmInfo.SensorZoneNo, true, out strErrMsg) == false)
                                            {
                                                this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {true}, SensorZoneNo: {alarmInfo.SensorZoneNo})");
                                            }
                                        }
                                    }                                    
                                }

                                m_alarmInfo.IsDoorAlarm = true;
                            }
                        }
                        else
                        {
                            // 화재 발생 5초 이후 도어 알람 중 도어가 열린 경우 알람 해제
                            TimeSpan difference = DateTime.Now - alarmTime.Value;
                            if (difference.TotalSeconds >= 5)
                            {
                                // 발생 중인 도어 확인
                                List<DoorAlarmInfo> doorAlarms = GetDoorAlarm(out strErrMsg);
                                if (doorAlarms == null)
                                {
                                    throw new ApplicationException(strErrMsg);
                                }
                                else if (doorAlarms.Count > 0)
                                {
                                    List<DoorAlarmInfo> openDoors = new List<DoorAlarmInfo>();

                                    foreach (DoorAlarmInfo doorAlarm in doorAlarms)
                                    {
                                        // Device ID 조회
                                        int? nDeviceID = GetDoorDeviceID(doorAlarm.Key, out strErrMsg);
                                        if (nDeviceID == null)
                                        {
                                            throw new ApplicationException(strErrMsg);
                                        }
                                        else
                                        {
                                            DoorStatus door = statuses.Find(x => x.DeviceID == nDeviceID && x.OpenStatus == (int)DoorStatus.DOOR_STATUS.OPEN);
                                            if (door != null)
                                            {
                                                openDoors.Add(doorAlarm);
                                            }
                                     
                                        }

                                        if (openDoors.Count > 0)
                                        {
                                            // 알람 해제
                                            foreach (DoorAlarmInfo alarm in openDoors)
                                            {
                                                if (SendSensorData(alarm.SensorZoneNo, false, out strErrMsg) == false)
                                                {
                                                    this.Logger.Write($"SendSensorAlarm Error (IsAlarm: {false}, SensorZoneNo: {doorAlarm.SensorZoneNo})");
                                                }
                                            }
                                        }
                                    }
                                }                                
                            }
                        }
                    }
                    */


                }
                catch (Exception e)
                {
                    this.Logger.Write("CheckDoorStatusThread() Exception : " + e.Message);
                }

                Thread.Sleep(300);
            }
        }

        private DateTime? GetFireAlarmTime(out string strErrMsg)
        {
            strErrMsg = "";
            DateTime? dtTime = null;

            try
            {
                string strSQL = string.Format(@$"SELECT {Current.Fields.alarm_tm}
                                                FROM {Current.TableName}, {SensorZone.TableName} 
                                                WHERE {SensorZone.Fields.sensor_ty_code} = {SensorType.Fire}
                                                ORDER BY {Current.Fields.alarm_tm}");

                dynamic result = DataManager.GetSelect().SelectFirst(strSQL, out strErrMsg);
                if (result == null && strErrMsg?.Length > 0)
                {
                    throw new ApplicationException(strErrMsg);
                }
                else if (result != null)
                {
                    dtTime = result.alarm_tm;
                }
                
            }
            catch (Exception e)
            {
                dtTime = null;
                strErrMsg = e.Message;
            }

            return dtTime;
        }

        private List<DoorAlarmInfo> GetDoorAlarm(out string strErrMsg)
        {
            strErrMsg = "";
            List<DoorAlarmInfo> doorAlarms = new List<DoorAlarmInfo>();

            try
            {
                string strSQL = string.Format(@$"SELECT {Current.TableName}.{Current.Fields.sensor_zone_sn}, {SensorZone.Fields.unq_key}
                                                FROM {Current.TableName}, {SensorZone.TableName} 
                                                WHERE {SensorZone.Fields.sensor_ty_code} = {SensorType.Door}
                                                ORDER BY {Current.Fields.alarm_tm}");

                IEnumerable<dynamic> results = DataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    DoorAlarmInfo doorAlarm = new DoorAlarmInfo();
                    doorAlarm.SensorZoneNo = result.sensor_zone_sn;
                    doorAlarm.Key = result.unq_key;

                    doorAlarms.Add(doorAlarm);
                }
            }
            catch (Exception e)
            {
                doorAlarms = null;
                strErrMsg = e.Message;
            }

            return doorAlarms;
        }

        private bool UpdateDoorStatus(List<DoorStatus> statuses, out string strErrMsg)
        {
            strErrMsg = "";
            bool bRet = false;

            try
            {
                foreach (DoorStatus doorStatus in statuses)
                {
                    string strDoorStatus = null;

                    if (doorStatus.OpenStatus == CODE_CLOSE)
                        strDoorStatus = $"'{TYPE_CLOSE}'";
                    else if (doorStatus.OpenStatus == CODE_OPEN)
                        strDoorStatus = $"'{TYPE_OPEN}'";
                    else
                        strDoorStatus = "NULL";

                    string strSQL = $"UPDATE {SensorZone.TableName} SET {SensorZone.Fields.descp} = {strDoorStatus} WHERE {SensorZone.Fields.unq_key} = '{KEY_DOOR + doorStatus.DeviceID}'";

                    if (DataManager.GetUpdate().Update(strSQL, out strErrMsg) == false)
                    {
                        this.Logger.Write("Sensor Update Error : " + strErrMsg);
                    }
                }

                bRet = true;
            }
            catch (Exception e)
            {
                bRet = false;
                strErrMsg = e.Message;
            }

            return bRet;
        }

        private int? GetDoorDeviceID(string strDeviceID, out string strErrMsg)
        {
            int? nDeviceID = null;
            strErrMsg = null;

            try
            {
                int nIdx = strDeviceID.IndexOf("_");
                if (nIdx == -1)
                {
                    throw new ApplicationException("DeviceID 값이 올바르지 않습니다.");
                }

                strDeviceID = strDeviceID.Substring(nIdx + 1);

                if (int.TryParse(strDeviceID, out int nID))
                {
                    nDeviceID = nID;
                }
            }
            catch (Exception e)
            {
                nDeviceID = null;
                strErrMsg = e.Message;
            }

            return nDeviceID;
        }

        public bool SendSensorData(int nSensorZoneID, bool isAlarm, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(nSensorZoneID, SensorType.Door, isAlarm);
            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }

        public List<DoorAlarmInfo> GetDoorSensorZoneNo(List<DoorStatus> doors, out string strErrorMessage)
        {
            List<DoorAlarmInfo> doorAlarms = new List<DoorAlarmInfo>();

            strErrorMessage = null;

            try
            {
                string strDeviceIDs = null;

                foreach (DoorStatus door in doors)
                {
                    if (strDeviceIDs == null)
                    {
                        strDeviceIDs = KEY_DOOR + door.DeviceID;
                    }
                    else
                    {
                        strDeviceIDs += "," + KEY_DOOR + door.DeviceID;
                    }
                }

                if (strDeviceIDs != null)
                {
                    string strConditions = $"{SensorZone.Fields.unq_key} IN (strDeviceIDs) AND {SensorZone.Fields.sensor_ty_code} = {SensorType.Door}";

                    IEnumerable<SensorZone> results = DataManager.GetSelect().Select<SensorZone>(strConditions, out strErrorMessage);
                    if (results == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    foreach (SensorZone sz in results)
                    {
                        string strKey = sz.unq_key;
                        int? nDeviceID = GetDoorDeviceID(strKey, out strErrorMessage);

                        if (nDeviceID.HasValue)
                        {
                            DoorStatus door = doors.Find(x => x.DeviceID == nDeviceID.Value);
                            if (door != null)
                            {
                                DoorAlarmInfo alarmInfo = new DoorAlarmInfo();
                                alarmInfo.SensorZoneNo = sz.sensor_zone_sn;
                                alarmInfo.Key = sz.unq_key;

                                doorAlarms.Add(alarmInfo);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                doorAlarms = null;
            }

            return doorAlarms;
        }

        public int? GetDoorSensorZoneNo(int nDeviceID, int nSubTypeNo, out string strErrorMessage)
        {
            strErrorMessage = null;
      
            int? nSensorZoneNo = null;

            try
            {
                string strDeviceID = KEY_DOOR + nDeviceID;
                string strConditions = $"{SensorZone.Fields.unq_key} = '{strDeviceID}_{nSubTypeNo}' AND {SensorZone.Fields.sensor_sub_ty_no} = {nSubTypeNo}";

                SensorZone result = DataManager.GetSelect().SelectFirst<SensorZone>(strConditions, out strErrorMessage);
                if (result == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                nSensorZoneNo = result.sensor_zone_sn;
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                nSensorZoneNo = null;
            }

            return nSensorZoneNo;
        }
    }



    public class FireAlarmInfo
    {
        public DateTime? AlarmTime { get; set; }
        public bool IsDoorAlarm { get; set; }

        public FireAlarmInfo(DateTime? dtAlarmTime, bool bIsDoorAlarm)
        {
            this.AlarmTime = dtAlarmTime;
            IsDoorAlarm = bIsDoorAlarm;
        }
    }

    public class DoorAlarmInfo
    {
        public int SensorZoneNo { get; set; }
        public string Key { get; set; }
    }
}
