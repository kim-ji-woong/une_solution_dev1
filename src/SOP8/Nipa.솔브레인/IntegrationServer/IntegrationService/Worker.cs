using IntegrationServer;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IntegrationService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private Service m_service;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
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
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
