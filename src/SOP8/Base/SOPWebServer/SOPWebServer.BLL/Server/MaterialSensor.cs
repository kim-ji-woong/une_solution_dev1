using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Interface;
using System.Collections.Generic;
using Base.Model.Sensor;
using dnsData.CommonCode;
using Base.Model.Spatial;

namespace SOPWebServer.BLL.Server
{
    using Process;

    class MaterialSensor : SensorServer
    {
        public MaterialSensor(IDataManager dataManager = null, string strSensorType = "")
        {
            m_dataManager = dataManager;
            m_strSensorType = strSensorType;
        }

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
                return GetAlarmMessage(sensor, sensorZone, equipZone, useSensorAlarm, isReal, out strErrorMessage);
            else
                return GetClearMessage(sensor, sensorZone, equipZone, useSensorAlarm, isReal, out strErrorMessage);
        }

        protected override string GetMessage(_ClearAlarm signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isManual, out string strErrorMessage)
        {
            strErrorMessage = null;
            return GetClearMessage(signal.Header, sensor, sensorZone, equipZone, useSensorAlarm, isManual, out strErrorMessage);
        }

        protected override string GetMessage(ManualReport signal, SensorZone sensorZone, out string strErrorMessage)
        {
            strErrorMessage = null;
            return GetManualAlarmMessage(signal, sensorZone, out strErrorMessage);
        }

        protected override string GetUserResetMessage(Base.Model.History.SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            SensorZone sensorZone = GetFirstSensorZone(m_dataManager, sensorZoneHistory, out strErrorMessage);

            if (sensorZone == null)
                return null;

            string strMaterialName = GetMaterialName(sensorZone, out strErrorMessage);

            if (strMaterialName == null && strErrorMessage != null)
                return null;

            string strSignal = strMaterialName == null ? "신호가" : strMaterialName + " 신호가";

            if (sensorZoneHistory.reportr != null)
            {
                // 수동신고된 알람복구 메시지
                return GetManualReportClearMessage(sensorZoneHistory, sensorZone, strSignal, out strErrorMessage);
            }
            else
            {
                bool useSensorAlarm;
                EquipmentZone equipZone;
                sensorZone = SensorManager.GetSensorZone(sensorZone.sensor_zone_sn, m_dataManager, out useSensorAlarm, out equipZone, out strErrorMessage);

                if (sensorZone == null)
                    return null;

                Sensor sensor = GetSensor(sensorZone, out strErrorMessage);

                if (sensor == null)
                    return null;

                return GetClearMessage(sensor, sensorZone, equipZone, useSensorAlarm, true, out strErrorMessage, strSignal);
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

            return GetClearMessage(Header.SENSOR_MALFUNCTION, sensor, sensorZone, equipZone, useSensorAlarm, false, out strErrorMessage);
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

            return GetReportMessage(sensorZone, sensor, equipZone, useSensorAlarm, out strErrorMessage);
        }

        protected override string GetChangeAlarmDepthMessage(string strAlarmMessage, string strLocation, int prevAlarmDepth, int currentAlarmDepth)
        {
            string strMessage = null;
            string strMaterialName = GetMaterialName(strAlarmMessage);

            if (strLocation != null && strLocation.Length > 0)
            {
                if (strMaterialName != null && strMaterialName.Length > 0)
                    strMessage = string.Format("{0}에서 탐지된 {1}신호의 알람 단계가 {2}단계에서 {3}단계로 변경되었습니다", strLocation, strMaterialName, prevAlarmDepth, currentAlarmDepth);
                else
                    strMessage = string.Format("{0}에서 탐지된 신호의 알람 단계가 {1}단계에서 {2}단계로 변경되었습니다", strLocation, prevAlarmDepth, currentAlarmDepth);
            }
            else
            {
                if (strMaterialName != null && strMaterialName.Length > 0)
                    strMessage = string.Format("탐지된 {0}신호의 알람 단계가 {1}단계에서 {2}단계로 변경되었습니다.", strMaterialName, prevAlarmDepth, currentAlarmDepth);
                else
                    strMessage = string.Format("탐지된 신호의 알람 단계가 {0}단계에서 {1}단계로 변경되었습니다.", prevAlarmDepth, currentAlarmDepth);
            }

            return strMessage;
        }

        private string GetMaterialName(string strAlarmMessage)
        {
            string strTarget1 = "에서";

            int index1 = strAlarmMessage.LastIndexOf(strTarget1);
            int index2 = strAlarmMessage.LastIndexOf("신호가");

            if (index1 >= 0 && index2 > index1)
            {
                int beginIndex = index1 + strTarget1.Length;
                string strMaterialName = strAlarmMessage.Substring(beginIndex, index2 - beginIndex - 1).Trim();
                return strAlarmMessage;
            }

            return null;
        }

        // 수동신고된 알람복구 메시지
        private string GetManualReportClearMessage(Base.Model.History.SensorZone sensorZoneHistory, SensorZone sensorZone, string strSignal, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZoneHistory.zone_sn == null)
                return string.Format("수동신고된 {0} 복구되었습니다.", strSignal);

            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)sensorZoneHistory.zone_sn);
            Zone zone = m_dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_ZONE_ID);

                return null;
            }

            return string.Format("{0}에서 신고된 {1} 복구되었습니다.", zone.disp_text, strSignal);
        }

        private string GetAlarmMessage(Sensor sensor, SensorZone sensorZone, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, out string strErrorMessage)
        {
            string strMaterialName = GetMaterialName(sensorZone, out strErrorMessage);

            if (strMaterialName == null && strErrorMessage != null)
                return null;

            string strSignal = strMaterialName == null ? "신호가" : strMaterialName + " 신호가";

            if (useSensorAlarm || equipZone == null)
            {
                if (isReal)
                    return string.Format("{0}에서 {1} 탐지되었습니다.", sensor.sensor_name, strSignal);
                else
                    return string.Format("[Test] {0}에서 {1} 탐지되었습니다.", sensor.sensor_name, strSignal);
            }
            else
            {
                if (isReal)
                    return string.Format("{0}에서 {1} 탐지되었습니다.", equipZone.disp_text, strSignal);
                else
                    return string.Format("[Test] {0}에서 {1} 탐지되었습니다.", equipZone.disp_text, strSignal);
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

            if (signal.SensorSubType != null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    SubType.Fields.sensor_ty_code, signal.SensorType,
                    SubType.Fields.sensor_sub_ty_no, (int)signal.SensorSubType);

                SubType sensorSubType = m_dataManager.GetSelect().SelectFirst<SubType>(strCondition, out strErrorMessage);

                if (sensorSubType == null)
                {
                    if (strErrorMessage != null)
                        return null;
                    else
                        strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_SENSOR_SUBTYPE_ID);

                    return null;
                }

                return string.Format("{0}에서 {1} 신호발생이 접수되었습니다.", zone.disp_text, sensorSubType.sensor_sub_ty_name);
            }

            strCondition = string.Format("{0} = {1} and {2} = {3}",
                Base.Model.Common.Codes.Fields.cl_code, (int)CodeType.SensorType,
                Base.Model.Common.Codes.Fields.code, signal.SensorType);

            Base.Model.Common.Codes sensorType = m_dataManager.GetSelect().SelectFirst<Base.Model.Common.Codes>(strCondition, out strErrorMessage);

            if (sensorType == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    strErrorMessage = ErrorMessage.ToMessage(ErrorMessage.UNKNOWN_SENSOR_TYPE_ID);

                return null;
            }

            return string.Format("{0}에서 {1} 신호발생이 접수되었습니다.", zone.disp_text, sensorType.code_name);
        }

        private string GetClearMessage(Sensor sensor, SensorZone sensorZone, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, out string strErrorMessage, string strSignal = null)
        {
            strErrorMessage = null;

            if (strSignal == null)
            {
                string strMaterialName = GetMaterialName(sensorZone, out strErrorMessage);

                if (strMaterialName == null && strErrorMessage != null)
                    return null;

                strSignal = strMaterialName == null ? "신호가" : strMaterialName + " 신호가";
            }

            if (useSensorAlarm || equipZone == null)
            {
                if (isReal)
                    return string.Format("{0}에서 탐지된 {1} 복구되었습니다.", sensor.sensor_name, strSignal);
                else
                    return string.Format("[Test] {0}에서 탐지된 {1} 복구되었습니다.", sensor.sensor_name, strSignal);
            }
            else
            {
                if (isReal)
                    return string.Format("{0}에서 탐지된 {1} 복구되었습니다.", equipZone.disp_text, strSignal);
                else
                    return string.Format("[Test] {0}에서 탐지된 {1} 복구되었습니다.", equipZone.disp_text, strSignal);
            }
        }

        private string GetClearMessage(int header, Sensor sensor, SensorZone sensorZone, EquipmentZone equipZone, bool useSensorAlarm, bool isManual, out string strErrorMessage)
        {
            string strMaterialName = GetMaterialName(sensorZone, out strErrorMessage);

            if (strMaterialName == null && strErrorMessage != null)
                return null;

            string strSignal = strMaterialName == null ? "신호가" : strMaterialName + " 신호가";

            if (useSensorAlarm || equipZone == null)
            {
                if (header == Header.CLEAR_MANUAL_REPORT || header == Header.SENSOR_USER_RESET)
                    return string.Format("사용자에 의하여 {0}에서 탐지된 {1} 복구되었습니다.", sensor.sensor_name, strSignal);
                else if (header == Header.TIMEOUT)
                    return string.Format("{0}에서 탐지된 {1} TimeOut 처리되었습니다.", sensor.sensor_name, strSignal);
            }
            else
            {
                if (header == Header.CLEAR_MANUAL_REPORT || header == Header.SENSOR_USER_RESET)
                    return string.Format("사용자에 의하여 {0}에서 탐지된 {1} 복구되었습니다.", equipZone.disp_text, strSignal);
                else if (header == Header.TIMEOUT)
                    return string.Format("{0}에서 탐지된 {1} TimeOut 처리되었습니다.", equipZone.disp_text, strSignal);
            }

            return "";
        }

        private string GetReportMessage(SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, out string strErrorMessage)
        {
            string strMaterialName = GetMaterialName(sensorZone, out strErrorMessage);

            if (strMaterialName == null && strErrorMessage != null)
                return null;

            string strSignal = strMaterialName == null ? "신호가" : strMaterialName + " 신호가";

            if (useSensorAlarm || equipZone == null)
            {
                return string.Format("{0}에서 탐지된 {1} 실제 상황으로 신고되었습니다.", sensor.sensor_name, strSignal);
            }
            else
            {
                return string.Format("{0}에서 탐지된 {1} 실제 상황으로 신고되었습니다.", equipZone.disp_text, strSignal);
            }
        }

        // 같은 영역내에 존재하는 같은 타입의 SensorZone들을 얻어온다.
        protected override IEnumerable<SensorZone> GetSameEquipZoneSensorZones(SensorZone sensorZone, out string strErrorMessage)
        {
            string strCondition = "";

            if (sensorZone.sensor_sub_ty_no == null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3} and {4} is NULL and {5} = {6}",
                    SensorZone.Fields.sensor_ty_optn_code, (int)CodeType.SensorType,
                    SensorZone.Fields.sensor_ty_code, sensorZone.sensor_ty_code,
                    SensorZone.Fields.sensor_sub_ty_no,
                    SensorZone.Fields.eqp_zone_sn, sensorZone.eqp_zone_sn);
            }
            else
            {
                strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7}",
                    SensorZone.Fields.sensor_ty_optn_code, (int)CodeType.SensorType,
                    SensorZone.Fields.sensor_ty_code, sensorZone.sensor_ty_code,
                    SensorZone.Fields.sensor_sub_ty_no, sensorZone.sensor_sub_ty_no,
                    SensorZone.Fields.eqp_zone_sn, sensorZone.eqp_zone_sn);
            }

            return m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);
        }

        private string GetMaterialName(SensorZone sensorZone, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZone.sensor_sub_ty_no == null)
                return null;

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                SubType.Fields.sensor_ty_code,
                sensorZone.sensor_ty_code,
                SubType.Fields.sensor_sub_ty_no,
                (int)sensorZone.sensor_sub_ty_no);

            SubType subType = m_dataManager.GetSelect().SelectFirst<SubType>(strCondition, out strErrorMessage);

            if (subType == null)
                return null;

            return subType.sensor_sub_ty_name;
        }
    }
}
