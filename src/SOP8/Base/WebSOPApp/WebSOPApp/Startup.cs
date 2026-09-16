using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
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

            if (m_configManager.BaseSite.DBType != null)
            {
                SetBaseInjection(services);
            }
        }

        private void SetBaseInjection(IServiceCollection services)
        {
            string strDBName = m_configManager.BaseSite.DBName;
            int nDBType = (int)m_configManager.BaseSite.DBType;
            //int nSiteNo = (int)m_configManager.BaseSite.site_sn;
            string strDbID = m_configManager.BaseDB.DbID;
            string strDbHost = m_configManager.BaseDB.DbHost;
            string strDbPW = m_configManager.BaseDB.DbPw;
            string strWebServerURL = m_configManager.BaseSite.WebServerURL;

            dnsDapperDBUtil.DataAccessLayer.DAL.DataManager dataManager = new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW);

            services.AddTransient<Base.Controller.Options.ILoginOption>(service => m_configManager.BaseSite);
            services.AddTransient<Base.Controller.Options.IAlarmOption>(service => m_configManager.BaseSite);
            services.AddTransient<Base.Account.IBLL.Interface.IPasswordPolicy>(service => m_configManager.PasswordPolicy);
            services.AddTransient<Base.Account.IBLL.Interface.IUserCreator>(service => new Agent.Sample.Account.UserCreator());
            services.AddTransient<Base.Account.IBLL.IProcessManager>(service => new Base.Account.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SOPManager.IBLL.IProcessManager>(service => new Base.SOPManager.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.TeamEditor.IBLL.IProcessManager>(service => new Base.TeamEditor.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SOPSimulator.IBLL.IProcessManager>(service => new Base.SOPSimulator.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.Settings.IBLL.IProcessManager>(service => new Base.Settings.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.History.IBLL.IProcessManager>(service => new Base.History.BLL.ProcessManager(dataManager, new Base.SOPManager.BLL.ProcessManager(dataManager), new Base.SOPSimulator.BLL.ProcessManager(dataManager)));
            services.AddTransient<Base.SDMS.IBLL.IProcessManager>(service => new Base.SDMS.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.Weather.IBLL.IProcessManager>(service => new Base.Weather.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SensorSimulator.IBLL.IProcessManager>(service => new Base.SensorSimulator.BLL.ProcessManager());
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

            // 고용량 버전 모델링 파일 설정
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

            // 저용량 버전 모델링 파일 설정
            string strLightPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\gltf_light");

            if (Directory.Exists(strLightPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strLightPath),
                    RequestPath = "/resource/gltf_light",
                    ContentTypeProvider = provider
                });
            }

            // 엑셀 파일 읽기/쓰기 관련 설정 추가
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                //ResourceRootPath = "ClientApp\\public";
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //ResourceRootPath = "ClientApp\\build";
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            //var options = new StaticFileOptions
            //{
            //    ContentTypeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider()
            //};
            //((Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider)options.ContentTypeProvider).Mappings.Add(
            //    new System.Collections.Generic.KeyValuePair<string, string>(".glb", "model/gltf-buffer"));

            //app.UseStaticFiles(options);

            app.UseEndpoints(endpoints =>
            {
                // Areas 경로
                /*endpoints.MapControllerRoute(
                    name: "WebSOPApp",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");*/

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
