using Response;

namespace Base.SensorSimulator.IBLL
{
    using Request;

    public interface IProcessManager
    {
        public MessageResult SendSensorAlarm(RequestSendSensorAlarm data, string strSopWebServerUrl);
    }
}
