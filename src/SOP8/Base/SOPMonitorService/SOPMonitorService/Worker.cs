using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SOPMonitorService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private static IConfiguration m_configuration = null;
        private System.Timers.Timer m_timer = null;
        private SopMonitor m_sopMonitor = null;

        public static IConfiguration Configuration
        {
            set { m_configuration = value; }
        }

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;

            List<Database> databases = Database.ReadConfig(m_configuration);

            if (databases.Count > 0)
            {
                m_sopMonitor = new SopMonitor(databases);
            }

        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            if (m_sopMonitor != null)
                m_sopMonitor.Start();

            if (m_timer == null)
            {
                m_timer = new System.Timers.Timer(1000);
                m_timer.Elapsed += OnTimer;
                m_timer.Start();
            }

            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            if (m_sopMonitor != null)
                m_sopMonitor.Stop();

            if (m_timer != null)
            {
                m_timer.Stop();
                m_timer = null;
            }

            return base.StopAsync(cancellationToken);
        }

        private void OnTimer(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (m_sopMonitor != null)
            {
                m_sopMonitor.Run(_logger);
            }
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
