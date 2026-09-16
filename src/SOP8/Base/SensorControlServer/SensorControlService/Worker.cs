using SensorControlServer;
using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

namespace SensorControlService
{
    class Worker : BackgroundService
    {
        private Service m_service;

        public Worker()
        {
            m_service = new Service();
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            m_service.Start();
            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            if (m_service != null)
                m_service.Stop();

            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
