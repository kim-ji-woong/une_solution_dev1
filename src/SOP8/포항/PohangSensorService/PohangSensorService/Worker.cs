using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PohangSensorServer;

namespace PohangSensorService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        
        private ProcessManager m_processManager = new ProcessManager(Logger.Instance);

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
        }

    
        /// <summary>
        /// Start PohangSensorServer ProcessManager
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Logger.Instance.Write("서비스 시작");
            
            m_processManager.Start();
            
            return base.StartAsync(cancellationToken);
        }
    
        /// <summary>
        /// Stop PohangSensorServer ProcessManager
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Logger.Instance.Write("서비스 종료");
            
            m_processManager.Stop();
            
            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}