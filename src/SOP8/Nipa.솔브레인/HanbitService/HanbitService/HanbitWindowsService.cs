using System.ServiceProcess;

namespace HanbitService
{
    public class HanbitWindowsService : ServiceBase
    {
        private AlarmMonitor m_alarmMonitor;

        public HanbitWindowsService()
        {
            ServiceName = "HanbitFireAlarmService";
        }

        protected override void OnStart(string[] args)
        {
            m_alarmMonitor = new AlarmMonitor();
            m_alarmMonitor.Start();
        }

        protected override void OnStop()
        {
            m_alarmMonitor?.Stop();
        }
    }
}
