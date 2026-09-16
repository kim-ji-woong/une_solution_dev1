using System;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using GwangyangSensorService.Api;
using GwangyangSensorService.Config;
using GwangyangSensorService.Managers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.EventLog;
using Microsoft.Extensions.Options;

namespace GwangyangSensorService
{
    public class Program
    {
        public static void Main(string[] args)
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
                    services.Configure<LogOptions>(hostContext.Configuration.GetSection("Log"));
                    services.Configure<MonitoringOptions>(hostContext.Configuration.GetSection("Monitoring"));
                    services.Configure<SiteOptions>(hostContext.Configuration.GetSection("Site"));
                    services.Configure<ApiOptions>(hostContext.Configuration.GetSection("API"));
                    services.Configure<WeatherApiOptions>(hostContext.Configuration.GetSection("WeatherAPI"));

                    services.AddSingleton(sp =>
                    {
                        var siteOptions = sp.GetRequiredService<IOptions<SiteOptions>>().Value;
                        return new DataManager(
                            siteOptions.DBType,
                            siteOptions.DbHost,
                            siteOptions.DBName,
                            siteOptions.DbID,
                            siteOptions.DbPw);
                    });
                    
                    services.AddHttpClient("SopApi")
                        .ConfigureHttpClient((sp, client) =>
                        {
                            var opt = sp.GetRequiredService<IOptions<SiteOptions>>().Value;
                            client.BaseAddress = new Uri(opt.SOPWebServerURL);
                            client.Timeout = TimeSpan.FromSeconds(10);
                        });

                    services.AddHttpClient<IApiClient, ApiClient>();
                    services.AddSingleton<SensorManager>();
                    services.AddSingleton<WeatherManager>();
                    services.AddSingleton<ProcessManager>();
                    services.AddSingleton<AlarmManager>();
                    services.AddHostedService<Worker>()
                        .Configure<EventLogSettings>(config =>
                        {
                            config.LogName = "GwangyangSensorService";
                            config.SourceName = "GwangyangSensorService Source";
                        });
                });
    }
}
