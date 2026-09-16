using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOPWebServer.IBLL.Interface;
using SOPWebServer.IBLL;

namespace SOPWebServer
{
    public class Startup
    {
        private static Config.ConfigManager m_configManager = new Config.ConfigManager();

        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public Startup(IConfiguration configuration)
        {
            m_configManager.ReadConfig(configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.67
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            if (m_configManager.Database.DBType != null)
            {
                string strDBName = m_configManager.Database.DBName;
                int nDBType = (int)m_configManager.Database.DBType;
                string strDbID = m_configManager.Database.DbID;
                string strDbHost = m_configManager.Database.DbHost;
                string strDbPW = m_configManager.Database.DbPw;

                IDataManager dataManager = new DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW);
                IAgentManager agentManager = new SOPWebServer.Agent.BLL.AgentManager();

                services.AddSingleton<IDataManager>(dataManager);
                services.AddTransient<IProcessManager>(service => new SOPWebServer.BLL.ProcessManager(dataManager, agentManager));
                services.AddTransient<Base.SOPSimulator.IBLL.IProcessManager>(service => new Base.SOPSimulator.BLL.ProcessManager(dataManager));
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
