using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;

namespace WebSOPApp
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

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("UnEPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            if (m_configManager.Site.DBType != null)
            {
                string strDBName = m_configManager.Site.DBName;
                int nDBType = (int)m_configManager.Site.DBType;
                string strDbID = m_configManager.DB.DbID;
                string strDbHost = m_configManager.DB.DbHost;
                string strDbPW = m_configManager.DB.DbPw;
                string strWebServerURL = m_configManager.Site.WebServerURL;

                dnsDapperDBUtil.DataAccessLayer.DAL.DataManager dataManager = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW);

                services.AddTransient<Base.Controller.Options.ILoginOption>(service => m_configManager.Site);
                services.AddTransient<Base.Controller.Options.IAlarmOption>(service => m_configManager.Site);
                services.AddTransient<Base.Account.IBLL.Interface.IPasswordPolicy>(service => m_configManager.PasswordPolicy);
                services.AddTransient<Base.Account.IBLL.IProcessManager>(service => new Base.Account.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.SOPManager.IBLL.IProcessManager>(service => new Base.SOPManager.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.TeamEditor.IBLL.IProcessManager>(service => new Base.TeamEditor.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.SOPSimulator.IBLL.IProcessManager>(service => new Base.SOPSimulator.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.Settings.IBLL.IProcessManager>(service => new Base.Settings.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.History.IBLL.IProcessManager>(service => new Base.History.BLL.ProcessManager(dataManager, new Base.SOPManager.BLL.ProcessManager(dataManager), new Base.SOPSimulator.BLL.ProcessManager(dataManager)));
                services.AddTransient<Base.SDMS.IBLL.IProcessManager>(service => new Base.SDMS.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.SensorSimulator.IBLL.IProcessManager>(service => new Base.SensorSimulator.BLL.ProcessManager());
                services.AddTransient<Pohang.IBLL.IProcessManager>(service => new Pohang.BLL.ProcessManager(dataManager));
                services.AddTransient<Base.Account.IBLL.Interface.IUserCreator>(service => new Agent.Pohang.Account.UserCreator());
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Set up custom content types -associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".glb"] = "model/gltf+binary";
            provider.Mappings[".gltf"] = "model/gltf+json";

            app.UseStaticFiles();

            string strPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\gltf");

            if (Directory.Exists(strPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strPath),
                    RequestPath = "/resource/gltf",
                    ContentTypeProvider = provider
                });
            }

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                // Areas 경로
                endpoints.MapControllerRoute(
                    name: "WebSOPApp",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
