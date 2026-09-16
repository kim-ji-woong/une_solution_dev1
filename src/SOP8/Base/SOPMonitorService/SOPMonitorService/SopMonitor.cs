using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace SOPMonitorService
{
    using Process;

    class SopMonitor
    {
        private bool m_processing = false;
        private List<Database> m_databases = null;

        public SopMonitor(List<Database> databases)
        {
            m_databases = databases;
        }

        public void Start()
        {
        }

        public void Stop()
        {
        }

        public void Run(ILogger logger)
        {
            if (m_processing)
                return;

            m_processing = true;

            // 1. Timeout 기간을 초과한 SOP가 있으면 강제 종료시킨다.
            CheckTimeout(logger);

            m_processing = false;
        }

        private void CheckTimeout(ILogger logger)
        {
            string strErrorMessage;

            foreach (Database database in m_databases)
            {
                if (TimeoutManager.Run(database.DataManager, out strErrorMessage) == false)
                    logger.LogError(strErrorMessage);
            }
        }
    }
}
