using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace WebDCOP
{
    class Startup
    {
        private static Config.ConfigManager m_configManager = new Config.ConfigManager();
        private static string m_strResourceRootPath = "";

        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }

        public static string ResourceRootPath
        {
            get { return m_strResourceRootPath; }
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

            services.AddAuthentication(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();

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

                services.AddTransient<dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager>(service => new dnsDapperDBUtil.DataAccessLayer.DAL.DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW));
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

            string strPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\glb");

            if (Directory.Exists(strPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strPath),
                    RequestPath = "/resource/glb",
                    ContentTypeProvider = provider
                });
            }

            // 엑셀 파일 읽기/쓰기 관련 설정 추가
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                m_strResourceRootPath = "ClientApp\\public";
                app.UseDeveloperExceptionPage();
            }
            else
            {
                m_strResourceRootPath = "ClientApp\\build";
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

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
                endpoints.MapControllerRoute(
                    name: "WebDCOP",
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
