using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOPWebServer.IBLL.Interface;
using SOPWebServer.IBLL.Models.Request;
using Base.Model.Spatial;

namespace SOPWebServer.Agent.BLL.Agent
{
    // 이동형 스캐너
    class MovingScanerAgent : IAgent
    {
        private IDataManager m_dataManager = null;

        public MovingScanerAgent(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public int GetAlarmDepth(IDataManager dataManager, SensorSignal signal, bool useSensorAlarm, SensorZone sensorZone, bool isManual)
        {
            // 이동식 스캐너 유형은 모든 알람을 심각으로 처리한다.
            return 4;
        }

        // Return 값 : null이면서 strErrorMessage도 null이면 Agent가 아닌 Agent를 호출한 곳에서 GetMessage를 처리하도록 한다.
        public string GetMessage(SensorSignal signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, bool isAlarm, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (isAlarm)
                return GetAlarmMessage(sensor, sensorZone, equipZone, useSensorAlarm, isReal, out strErrorMessage);
            else
                return GetClearMessage(sensor, sensorZone, equipZone, useSensorAlarm, isReal, out strErrorMessage);
        }

        private string GetAlarmMessage(Sensor sensor, SensorZone sensorZone, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            string strSensorTypeName = GetSensorType(sensorZone, out strErrorMessage);

            if (strSensorTypeName == null)
                return null;

            if (isReal)
                return string.Format("[{0}]에서 [{1}] 알람이 발생했습니다.", strLocation, strSensorTypeName);
            else
                return string.Format("[Test][{0}]에서 [{1}] 알람이 발생했습니다.", strLocation, strSensorTypeName);
        }

        private string GetClearMessage(Sensor sensor, SensorZone sensorZone, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            string strSensorTypeName = GetSensorType(sensorZone, out strErrorMessage);

            if (strSensorTypeName == null)
                return null;

            if (isReal)
                return string.Format("[{0}]에서 발생한 [{1}] 알람이 복구되었습니다.", strLocation, strSensorTypeName);
            else
                return string.Format("[Test][{0}]에서 발생한 [{1}] 알람이 복구되었습니다.", strLocation, strSensorTypeName);
        }

        private string GetSensorType(SensorZone sensorZone, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensorZone.sensor_sub_ty_no == null)
                return "이동형 스캐너";

            string strCondition = string.Format("{0} = {1} and {2} = {3}",
                SubType.Fields.sensor_ty_code, sensorZone.sensor_ty_code,
                SubType.Fields.sensor_sub_ty_no, (int)sensorZone.sensor_sub_ty_no);

            SubType subType = m_dataManager.GetSelect().SelectFirst<SubType>(strCondition, out strErrorMessage);

            if (subType == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return "이동형 스캐너";
            }

            return subType.sensor_sub_ty_name;
        }

        private string GetLocation(Sensor sensor, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (sensor.zone_sn == null)
                return sensor.sensor_name;

            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)sensor.zone_sn);
            Zone zone = m_dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
                return null;

            if (zone.buld_sn == null)
                return zone.disp_text;

            strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, (int)zone.buld_sn);
            Building building = m_dataManager.GetSelect().SelectFirst<Building>(strCondition, out strErrorMessage);

            if (building == null)
                return null;

            return string.Format("{0} > {1} > {2}", building.disp_text, GetZoneName(zone, building), sensor.sensor_name);
        }

        // Zone 이름이 건물 이름과 겹치는 부분이 있으면 제거한다.
        private string GetZoneName(Zone zone, Building building)
        {
            if (zone.disp_text.StartsWith(building.disp_text))
                return zone.disp_text.Substring(building.disp_text.Length).Trim();

            return zone.disp_text;
        }
    }
}
