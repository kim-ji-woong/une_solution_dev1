using Response;

namespace Base.AlarmService.IBLL
{
    using Models;

    public interface IProcessManager
    {
        // isAlarm : true 이면 알람신호, false 이면 복구신호
        public MessageResult SendSensorSignal(RequestSendSensorAlarm data, bool isAlarm, string strSopWebServerUrl);
        public MessageResult ClearAlarm(ClearAlarm data, string strSopWebServerUrl);
        public MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl);
    }
}
