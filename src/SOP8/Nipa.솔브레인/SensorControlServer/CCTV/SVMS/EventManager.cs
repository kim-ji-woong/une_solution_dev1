using System;
using System.Collections.Generic;
using Soulbrain.Model.History;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Alarm;
using Base.Model.Sensor;
using dnsData.CommonCode;
using Base.DAL;
using System.Configuration;

namespace SVMS
{
    class EventManager
    {
        private IDataManager m_dataManager = null;
        private SvmsManager m_owner = null;
        private int? m_svmsEventAutoCloseSeconds = null;

        public EventManager(IDataManager dataManager, SvmsManager owner)
        {
            m_dataManager = dataManager;
            m_owner = owner;
            ReadConfig();
        }

        private void ReadConfig()
        {
            string strAutoCloseSeconds = ConfigurationManager.AppSettings.Get("SvmsEventAutoCloseSeconds");
            
            if (strAutoCloseSeconds != null && strAutoCloseSeconds.Length > 0)
            {
                int seconds;

                if (int.TryParse(strAutoCloseSeconds, out seconds))
                    m_svmsEventAutoCloseSeconds = seconds;
            }
        }

        public IEnumerable<SvmsEvent> ReadEvents(out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = 0", SvmsEvent.Fields.process_yn);
            return m_dataManager.GetSelect().Select<SvmsEvent>(strCondition, out strErrorMessage);
        }

        public bool SendEvent(IEnumerable<SvmsEvent> events)
        {
            string strEventNos = null;

            foreach (SvmsEvent e in events)
            {
                var response = m_owner.SendSensorData(e.sensor_zone_sn, e.sensor_ty_code, e.alarm_yn);

                if (response.Success == false)
                {
                    string strLog = string.Format("SensorZoneNo({0}), isAlarm({1}), SendSensorAlarm Fail : {2}" + response.Message);
                    m_owner.Logger.Write(strLog);
                }

                if (strEventNos == null)
                    strEventNos = e.event_sn.ToString();
                else
                    strEventNos += "," + e.event_sn.ToString();
            }

            return FinishEvent(strEventNos);
        }

        public void CheckAutoClose()
        {
            if (m_svmsEventAutoCloseSeconds == null)
                return;

            string strCondition = string.Format("{0} = {1} and {2} in (Select {3} from {4} where {5} = {6})",
                Current.Fields.detct_ty_code, SdmsSensor.DetectType.Detect,
                Current.Fields.sensor_zone_sn,
                SensorZone.Fields.sensor_zone_sn,
                SensorZone.TableName,
                SensorZone.Fields.sensor_ty_code,
                SdmsSensor.SensorType.CCTV);

            string strErrorMessage;
            IEnumerable<Current> alarms = m_dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (alarms == null)
                return;

            DateTime? dtNow = CustomManager.GetCurrentTime(m_dataManager, out strErrorMessage);

            if (dtNow == null)
                return;

            foreach (Current alarm in alarms)
            {
                TimeSpan span = ((DateTime)dtNow) - alarm.alarm_tm;

                if (span.TotalSeconds >= (int)m_svmsEventAutoCloseSeconds)
                {
                    // 유효기간이 지났으니 강제 종료시킨다.
                    m_owner.SendSensorData(alarm.sensor_zone_sn, SdmsSensor.SensorType.CCTV, false);
                }
            }
        }

        private bool FinishEvent(string strEventNos)
        {
            if (strEventNos == null)
                return true;

            Dictionary<SvmsEvent.Fields, object> dicSets = new Dictionary<SvmsEvent.Fields, object>();
            dicSets[SvmsEvent.Fields.process_yn] = true;

            string strErrorMessage;
            string strCondition = string.Format("{0} in ({1})", SvmsEvent.Fields.event_sn, strEventNos);
            return m_dataManager.GetUpdate().Update<SvmsEvent, SvmsEvent.Fields>(dicSets, strCondition, out strErrorMessage);
        }
    }
}
