using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Spatial;
using dnsData.CommonCode;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Interface;

namespace SOPWebServer.BLL.Server
{
    using Process;

    class FireSensor : SensorServer
    {
        public FireSensor(IDataManager dataManager = null)
        {
            m_dataManager = dataManager;
            m_strSensorType = "fire";
        }

        // 센서신호에 대한 처리메시지를 얻어온다.
        protected override string GetMessage(SensorSignal signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, bool isAlarm, out string strErrorMessage)
        {
            strErrorMessage = null;

            IAgent agent = m_agentManager == null ? null : m_agentManager.GetAgent(m_strSensorType, m_dataManager);

            if (agent != null)
            {
                string strMessage = agent.GetMessage(signal, sensorZone, sensor, equipZone, useSensorAlarm, isReal, isAlarm, out strErrorMessage);

                if (strMessage != null)
                    return strMessage;
                else if (strErrorMessage != null)
                    return null;
            }

            if (isAlarm)
                return GetAlarmMessage(sensor, equipZone, useSensorAlarm, isReal);
            else
                return GetClearMessage(sensor, equipZone, useSensorAlarm, isReal);
        }

        protected override string GetMessage(_ClearAlarm signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isManual, out string strErrorMessage)
        {
            strErrorMessage = null;
            return GetClearMessage(signal.Header, sensor, equipZone, useSensorAlarm, isManual);
        }

        protected override string GetMessage(ManualReport signal, SensorZone sensorZone, out string strErrorMessage)
        {
            strErrorMessage = null;
            return GetManualAlarmMessage(signal, sensorZone, out strErrorMessage);
        }

        protected override string GetUserResetMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            if (sensorZoneHistory.reportr != null)
            {
                // 수동신고된 알람복구 메시지
                return GetManualReportClearMessage(sensorZoneHistory, out strErrorMessage);
            }
            else
            {
                SensorZone sensorZone = GetFirstSensorZone(m_dataManager, sensorZoneHistory, out strErrorMessage);

                if (sensorZone == null)
                    return null;

                bool useSensorAlarm;
                EquipmentZone equipZone;
                sensorZone = SensorManager.GetSensorZone(sensorZone.sensor_zone_sn, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

                if (sensorZone == null)
                    return null;

                Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

                if (sensor == null)
                    return null;

                return GetClearMessage(sensor, equipZone, useSensorAlarm, true);
            }
        }

        protected override string GetMalfunctionMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            SensorZone sensorZone = GetFirstSensorZone(m_dataManager, sensorZoneHistory, out strErrorMessage);

            if (sensorZone == null)
                return null;

            bool useSensorAlarm;
            EquipmentZone equipZone;
            sensorZone = SensorManager.GetSensorZone(sensorZone.sensor_zone_sn, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

            if (sensorZone == null)
                return null;

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return null;

            return GetClearMessage(Header.SENSOR_MALFUNCTION, sensor, equipZone, useSensorAlarm, false);
        }

        protected override string GetReportMessage(Base.Model.History.SensorZone sensorZoneHistory, SensorZone sensorZone, out string strErrorMessage)
        {
            bool useSensorAlarm;
            EquipmentZone equipZone;
            sensorZone = SensorManager.GetSensorZone(sensorZone.sensor_zone_sn, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

            if (sensorZone == null)
                return null;

            Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

            if (sensor == null)
                return null;

            return GetReportMessage(sensor, equipZone, useSensorAlarm);
        }

        protected override string GetChangeAlarmDepthMessage(string strAlarmMessage, string strLocation, int prevAlarmDepth, int currentAlarmDepth)
        {
            string strMessage = null;

            if (strLocation != null && strLocation.Length > 0)
            {
                strMessage = string.Format("{0}에서 탐지된 화재신호의 알람 단계가 {1}단계에서 {2}단계로 변경되었습니다", strLocation, prevAlarmDepth, currentAlarmDepth);
            }
            else
            {
                strMessage = string.Format("탐지된 화재신호의 알람 단계가 {0}단계에서 {1}단계로 변경되었습니다.", prevAlarmDepth, currentAlarmDepth);
            }

            return strMessage;
        }

        // 수동신고된 알람복구 메시지
        private string GetManualReportClearMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZoneHistory.zone_sn == null)
                return "수동신고된 화재신호가 복구되었습니다.";

            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)sensorZoneHistory.zone_sn);
            Zone zone = m_dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_ZONE_ID);

                return null;
            }

            return string.Format("{0}에서 신고된 화재가 복구되었습니다.", zone.disp_text);
        }

        private string GetAlarmMessage(Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal)
        {
            if (useSensorAlarm || equipZone == null)
            {
                if (isReal)
                    return string.Format("{0}에서 화재 신호가 탐지되었습니다.", sensor.sensor_name);
                else
                    return string.Format("[Test] {0}에서 화재 신호가 탐지되었습니다.", sensor.sensor_name);
            }
            else
            {
                if (isReal)
                    return string.Format("{0}에서 화재 신호가 탐지되었습니다.", equipZone.disp_text);
                else
                    return string.Format("[Test] {0}에서 화재 신호가 탐지되었습니다.", equipZone.disp_text);
            }
        }

        private string GetManualAlarmMessage(ManualReport signal, SensorZone sensorZone, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, signal.ZoneNo);
            Zone zone = m_dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_ZONE_ID);

                return null;
            }

            return string.Format("{0}에서 화재가 신고되었습니다.", zone.disp_text);
        }

        private string GetClearMessage(Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal)
        {
            if (useSensorAlarm || equipZone == null)
            {
                if (isReal)
                    return string.Format("{0}에서 탐지된 화재 신호가 복구되었습니다.", sensor.sensor_name);
                else
                    return string.Format("[Test] {0}에서 탐지된 화재 신호가 복구되었습니다.", sensor.sensor_name);
            }
            else
            {
                if (isReal)
                    return string.Format("{0}에서 탐지된 화재 신호가 복구되었습니다.", equipZone.disp_text);
                else
                    return string.Format("[Test] {0}에서 탐지된 화재 신호가 복구되었습니다.", equipZone.disp_text);
            }
        }

        private string GetClearMessage(int header, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isManual)
        {
            if (useSensorAlarm || equipZone == null)
            {
                if (header == Header.CLEAR_MANUAL_REPORT || header == Header.SENSOR_USER_RESET)
                    return string.Format("사용자에 의하여 {0}에서 탐지된 화재 신호가 복구되었습니다.", sensor.sensor_name);
                else if (header == Header.TIMEOUT)
                    return string.Format("{0}에서 탐지된 화재 신호가 TimeOut 처리되었습니다.", sensor.sensor_name);
                else if (header == Header.SENSOR_MALFUNCTION)
                {
                    if (isManual)
                    {
                        if (equipZone == null)
                            return "수동신고된 화재 신호가 잘못된 신고로 처리되었습니다.";
                        else
                            return string.Format("{0}에서 신고된 화재 신호가 잘못된 신고로 처리되었습니다.", equipZone.disp_text);
                    }
                    else
                        return string.Format("{0}에서 탐지된 화재 신호가 오작동 처리되었습니다.", sensor.sensor_name);
                }
            }
            else
            {
                if (header == Header.CLEAR_MANUAL_REPORT || header == Header.SENSOR_USER_RESET)
                    return string.Format("사용자에 의하여 {0}에서 탐지된 화재 신호가 복구되었습니다.", equipZone.disp_text);
                else if (header == Header.TIMEOUT)
                    return string.Format("{0}에서 탐지된 화재 신호가 TimeOut 처리되었습니다.", equipZone.disp_text);
                else if (header == Header.SENSOR_MALFUNCTION)
                {
                    if (isManual)
                        return string.Format("{0}에서 신고된 화재 신호가 잘못된 신고로 처리되었습니다.", equipZone.disp_text);
                    else
                        return string.Format("{0}에서 탐지된 화재 신호가 오작동 처리되었습니다.", equipZone.disp_text);
                }
            }

            return "";
        }

        private string GetReportMessage(Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm)
        {
            if (useSensorAlarm || equipZone == null)
            {
                return string.Format("{0}에서 탐지된 화재 신호가 실제 상황으로 신고되었습니다.", sensor.sensor_name);
            }
            else
            {
                return string.Format("{0}에서 탐지된 화재 신호가 실제 상황으로 신고되었습니다.", equipZone.disp_text);
            }
        }

        // 같은 영역내에 존재하는 같은 타입의 SensorZone들을 얻어온다.
        protected override IEnumerable<SensorZone> GetSameEquipZoneSensorZones(SensorZone sensorZone, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5}",
                SensorZone.Fields.sensor_ty_optn_code, (int)CodeType.SensorType,
                SensorZone.Fields.sensor_ty_code, sensorZone.sensor_ty_code,
                SensorZone.Fields.eqp_zone_sn, sensorZone.eqp_zone_sn);
            return m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);
        }
    }
}
