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

namespace AccessIntrusion
{
    public class AccessIntrusionManager : SensorServer
    {
        private static AccessIntrusionManager m_processManager = null;
        private IntrusionDataManager m_intrusionManager = null;

        private bool m_closeApp = false;

        private AccessIntrusionManager(string strServerIP, string strName, string strID, string strPW)
          : base("Intrusion\\AccessIntrusion")
        {
            m_intrusionManager = new IntrusionDataManager(this, strServerIP, strName, strID, strPW);
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

            m_processManager.Logger.Write("AccessIntrusionManager Run()");

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

        private static AccessIntrusionManager MakeInstance()
        {   // config 값 가져와서 생성자로 전달
            // IP, Port 정보 필요
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");
            string strName = ConfigurationManager.AppSettings.Get("DBName");
            string strID = ConfigurationManager.AppSettings.Get("DBID");
            string strPW = ConfigurationManager.AppSettings.Get("DBPW");

            return new AccessIntrusionManager(strServerIP, strName, strID, strPW);
        }

        private void CheckAlarmThread()
        {
            m_closeApp = false;
            Dictionary<int, SensorStatus> dicAlarms = new Dictionary<int, SensorStatus>();

            bool isFirst = true;
            string strErrMsg = null;

            while (m_closeApp == false)
            {
                try
                {
                    // 첫 실행 경우에만 현재 DB 알람 조회
                    if (isFirst)
                    {
                        // 현재 DB 침입 상태 조회
                        dicAlarms = GetCurrentAlarms(out strErrMsg);
                        if (dicAlarms == null)
                        {
                            throw new ApplicationException(strErrMsg);
                        }

                        isFirst = false;
                    }

                    // [DeviceID, SensorSn] 반환
                    Dictionary<int, int> dicSensorKey = GetSensorKeys(out strErrMsg);
                    if (dicSensorKey == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 현재 침입 상태 조회
                    Dictionary<int, SensorStatus> dicAccessAlarms = m_intrusionManager.GetAlarmIntrusions(dicSensorKey, out strErrMsg);
                    if (dicAccessAlarms == null)
                    {
                        throw new ApplicationException(strErrMsg);
                    }

                    // 기존 상태와 현재 상태 비교 후
                    foreach (KeyValuePair<int, SensorStatus> pair in dicAlarms)
                    {
                        int nSensorKey = pair.Key;

                        if (dicAccessAlarms.ContainsKey(nSensorKey) == false)
                        {   // 알람 해제
                            if (SendSensorData(nSensorKey, false, out strErrMsg))
                            {   // 알람 제거
                                dicAlarms.Remove(nSensorKey);
                            }
                            else
                            {
                                throw new ApplicationException(strErrMsg);
                            }
                        }
                    }

                    foreach (KeyValuePair<int, SensorStatus> pair in dicAccessAlarms)
                    {
                        int nSensorKey = pair.Key;

                        if (dicAlarms.ContainsKey(nSensorKey) == false)
                        {   // 알람 발생
                            if (SendSensorData(nSensorKey, true, out strErrMsg))
                            {   // 알람 추가
                                dicAlarms[nSensorKey] = pair.Value;
                            }
                            else
                            {
                                throw new ApplicationException(strErrMsg);
                            }
                        }
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    this.Logger.Write("CheckAlarmThread() Exception : " + e.Message);

                    Thread.Sleep(60000);
                }                
            }
        }

        private bool SendSensorData(int nSensorZoneID, bool isAlarm, out string strErrorMessage)
        {
            MessageResult result = SendSensorAlarm(nSensorZoneID, SensorType.Intrusion, isAlarm);
            if (result.Success)
                strErrorMessage = null;
            else
                strErrorMessage = result.Message;

            return result.Success;
        }

        public Dictionary<int, int> GetSensorKeys(out string strErrMsg)
        {
            strErrMsg = null;
            Dictionary<int, int> dicSensorKeys = new Dictionary<int, int>();

            try
            {
                string strConditions = $"{SensorZone.Fields.sensor_sn} IN (SELECT {Sensor.Fields.sensor_sn} FROM {Sensor.TableName} WHERE {Sensor.Fields.sensor_ty_code} = {SensorType.Intrusion} AND {Sensor.Fields.manual_yn} = 0)";

                IEnumerable<SensorZone> sensorZones = this.DataManager.GetSelect().Select<SensorZone>(strConditions, out strErrMsg);
                if (sensorZones == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (SensorZone sensorZone in sensorZones)
                {
                    if (int.TryParse(sensorZone.unq_key, out int nDeviceID))
                    {
                        dicSensorKeys[nDeviceID] = sensorZone.sensor_sn;
                    }
                }
            }
            catch (Exception e)
            {
                dicSensorKeys = null;
                strErrMsg = e.Message;
            }

            return dicSensorKeys;
        }

        private Dictionary<int, SensorStatus> GetCurrentAlarms(out string strErrMsg)
        {
            strErrMsg = null;
            Dictionary<int, SensorStatus> dicAlarms = new Dictionary<int, SensorStatus>();

            try
            {
                // 수동신고 제외한 현재 발생된 침입 알람 조회
                string strSQL = $@"SELECT {Current.TableName}.{Current.Fields.sensor_zone_sn}, {SensorZone.Fields.unq_key}
                                    FROM {Current.TableName}, {SensorZone.TableName}, {Sensor.TableName}
                                    WHERE {Current.TableName}.{Current.Fields.sensor_zone_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                    AND {SensorZone.TableName}.{SensorZone.Fields.sensor_sn} = {Sensor.TableName}.{Sensor.Fields.sensor_sn}
                                    AND {Sensor.TableName}.{Sensor.Fields.sensor_ty_code} = {SensorType.Intrusion}
                                    AND {Sensor.TableName}.{Sensor.Fields.manual_yn} = 0
                                ";

                string strConditions = $" SELECT {SensorZone.Fields.sensor_zone_sn} FROM {SensorZone.TableName} WHERE {SensorZone.Fields.sensor_sn} IN (SELECT {Sensor.Fields.sensor_sn} FROM {Sensor.TableName} WHERE {Sensor.Fields.sensor_ty_code} = {SensorType.Intrusion} AND {Sensor.Fields.manual_yn} = 0)";

                IEnumerable<dynamic> results = this.DataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (dynamic result in results)
                {
                    SensorStatus status = new SensorStatus();
                    status.SensorSn = result.sensor_zone_sn;
                    status.EqStatus = "-";

                    if (int.TryParse(result.unq_key, out int nDeviceID))
                    {
                        status.DeviceID = nDeviceID;
                        dicAlarms[status.SensorSn] = status;
                    }
                }
            }
            catch (Exception e)
            {
                dicAlarms = null;
                strErrMsg = e.Message;
            }

            return dicAlarms;
        }
    }
}
