using Base.Model.Alarm;
using Base.Model.Common;
using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Text;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Servers.CCTV.S1.SVMS
{
    public class AlarmManager
    {
        private SvmsManager m_parentManager = null;

        // SVMS 알람발생시 몇초후에 자동종료되는가?
        private int? m_nSvmsEventAutoCloseSeconds = null;
        private DataManager m_dataManager = null;

        public AlarmManager(SvmsManager svmsManager, DataManager dataManager)
        {
            m_parentManager = svmsManager;
            m_dataManager = dataManager;

            string strCondition = $"{Option.Fields.prop_name} = 'SDMS/SVMSEventAutoCloseSeconds'";
            Option option = dataManager.GetSelect().SelectFirst<Option>(strCondition, out string strErrorMessage);
            if (option != null)
            {
                int seconds;

                if (int.TryParse(option.prop_value.Trim(), out seconds))
                {
                    if (seconds > 0)
                        m_nSvmsEventAutoCloseSeconds = seconds;
                }
            }
        }

        public void CheckAutoClose()
        {
            if (m_dataManager != null && m_nSvmsEventAutoCloseSeconds != null)
            {

                string strSQL = $@"
                        select cur.{Current.Fields.sensor_zone_hist_sn}, cur.{Current.Fields.sensor_zone_sn}, cur.{Current.Fields.detct_ty_optn_code}, cur.{Current.Fields.detct_ty_code}, cur.{Current.Fields.alarm_tm}, 
                            cur.{Current.Fields.sop_sttus_optn_code}, cur.{Current.Fields.sop_sttus_code}, cur.{Current.Fields.alarm_level}, cur.{Current.Fields.user_sn}, sz.{SensorZone.Fields.sensor_ty_code}
                        from {Current.TableName} cur
                        inner join {SensorZone.TableName} sz on sz.{SensorZone.Fields.sensor_zone_sn}=cur.{Current.Fields.sensor_zone_sn}
                        where sz.{SensorZone.Fields.sensor_ty_code} = {SensorType.CCTV} and {Current.Fields.detct_ty_code} = {DetectType.Detect}";

                string strError;
                IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
                if (dynamics == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerType.CCTV_S1_SVMS, -1, "CheckAutoClose : " + strError);
                    return;
                }

                List<CurrentAlarmData> alarms = new List<CurrentAlarmData>();

                foreach (var item in dynamics)
                {
                    int sensor_zone_hist_sn = item.sensor_zone_hist_sn;
                    int sensor_zone_sn = item.sensor_zone_sn;
                    int detct_ty_optn_code = item.detct_ty_optn_code;
                    int detct_ty_code = item.detct_ty_code;
                    DateTime alarm_tm = item.alarm_tm;
                    int sop_sttus_optn_code = item.sop_sttus_optn_code;
                    int sop_sttus_code = item.sop_sttus_code;
                    int? user_sn = item.user_sn;
                    int sensor_ty_code = item.sensor_ty_code;

                    CurrentAlarmData current = new CurrentAlarmData();
                    current.sensor_zone_hist_sn = sensor_zone_hist_sn;
                    current.sensor_zone_sn = sensor_zone_sn;
                    current.detct_ty_optn_code = detct_ty_optn_code;
                    current.detct_ty_code = detct_ty_code;
                    current.alarm_tm = alarm_tm;
                    current.sop_sttus_optn_code = sop_sttus_optn_code;
                    current.sop_sttus_code = sop_sttus_code;
                    current.user_sn = user_sn;
                    current.sensor_ty_code = sensor_ty_code;

                    alarms.Add(current);
                }

                DateTime? dtNow = GetDBTime();
                if (dtNow != null)
                {
                    foreach (CurrentAlarmData alarm in alarms)
                    {
                        TimeSpan span = ((DateTime)dtNow) - alarm.alarm_tm;

                        if (span.TotalSeconds >= m_nSvmsEventAutoCloseSeconds)
                        {
                            if (SendCloseEvent(alarm, out strError) == false)
                            {
                                m_parentManager.Logger.Write(LogTypes.Error, ServerType.CCTV_S1_SVMS, -1, "CheckAutoClose : " + strError);
                            }
                        }
                    }
                }
            }
        }

        public DateTime? GetDBTime()
        {
            string strError;
            dynamic dy = m_dataManager.GetSelect().SelectFirst("Select convert(varchar(19), GetDate(), 120) dt", out strError);
            if (dy == null)
                return DateTime.Now;

            DateTime dt = Convert.ToDateTime(dy.dt);
            return dt;
        }

        private bool SendCloseEvent(CurrentAlarmData alarm, out string strErrorMessage)
        {
            return m_parentManager.SendSensorData(alarm.sensor_ty_code, alarm.sensor_zone_sn, false, out strErrorMessage);
        }
    }

    public class CurrentAlarmData : Current
    {
        public int sensor_ty_code { get; set; }
    }
}
