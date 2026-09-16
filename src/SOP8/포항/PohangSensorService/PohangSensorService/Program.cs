using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.EventLog;

namespace PohangSensorService
{
    public class Program
    {
        /// <summary>
        /// main entry
        /// </summary>
        static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }
        
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseWindowsService()
                .ConfigureLogging(
                    options => options.AddFilter<EventLogLoggerProvider>(level => level >= LogLevel.Information))
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>()
                        .Configure<EventLogSettings>(config =>
                        {
                            config.LogName = "PohangSensorService";
                            config.SourceName = "PohangSensorService Source";
                        });
                });
        
    }
}
