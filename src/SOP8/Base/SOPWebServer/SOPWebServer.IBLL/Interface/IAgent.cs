using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Spatial;

namespace SOPWebServer.IBLL.Interface
{
    using Models.Request;

    public interface IAgent
    {
        int GetAlarmDepth(IDataManager dataManager, SensorSignal signal, bool useSensorAlarm, SensorZone sensorZone, bool isManual);
        // Return 값 : null이면서 strErrorMessage도 null이면 Agent가 아닌 Agent를 호출한 곳에서 GetMessage를 처리하도록 한다.
        string GetMessage(SensorSignal signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, bool isAlarm, out string strErrorMessage);
    }
}
