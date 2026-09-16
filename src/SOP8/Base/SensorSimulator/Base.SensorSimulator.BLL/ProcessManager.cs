using Response;
using Base.SensorSimulator.IBLL;
using Base.SensorSimulator.IBLL.Request;

namespace Base.SensorSimulator.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        public MessageResult SendSensorAlarm(RequestSendSensorAlarm data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.SendSensorAlarm(data, strSopWebServerUrl);
        }
    }
}
