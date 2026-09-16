using Response;
using Base.AlarmService.IBLL.Models;

namespace Base.AlarmService.BLL
{
    using Process;

    public class ProcessManager
    {
        // isAlarm : true 이면 알람신호, false 이면 복구신호
        public MessageResult SendSensorSignal(RequestSendSensorAlarm data, bool isAlarm, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.SendSensorSignal(data, isAlarm, strSopWebServerUrl);
        }

        public MessageResult ClearAlarm(ClearAlarm data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.ClearAlarm(data, strSopWebServerUrl);
        }

        public MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl)
        {
            AlarmManager alarmManager = new AlarmManager();
            return alarmManager.ClearAllAlarm(data, strSopWebServerUrl);
        }
    }
}
