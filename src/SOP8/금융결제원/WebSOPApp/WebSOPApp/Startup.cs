using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
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
                SetBaseInjection(services);
            }

            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type =>
                {
                    if (type.FullName != null)
                    {
                        return type.FullName
                            .Replace("+", ".")
                            .Replace("[", "_")
                            .Replace("]", "_")
                            .Replace(",", "_")
                            .Replace("`", "_");
                    }
                    return type.Name;
                });

                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "금융결제원 API",
                    Version = "v1",
                    Description = "금융결제원 API"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            });
        }

        private void SetBaseInjection(IServiceCollection services)
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
            services.AddTransient<Base.Account.IBLL.Interface.IUserCreator>(service => new Agent.Sample.Account.UserCreator());
            services.AddTransient<Base.Account.IBLL.IProcessManager>(service => new Base.Account.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SOPManager.IBLL.IProcessManager>(service => new Base.SOPManager.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.TeamEditor.IBLL.IProcessManager>(service => new Base.TeamEditor.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SOPSimulator.IBLL.IProcessManager>(service => new Base.SOPSimulator.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.Settings.IBLL.IProcessManager>(service => new Base.Settings.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.History.IBLL.IProcessManager>(service => new Base.History.BLL.ProcessManager(dataManager, new Base.SOPManager.BLL.ProcessManager(dataManager), new Base.SOPSimulator.BLL.ProcessManager(dataManager)));
            services.AddTransient<Base.SDMS.IBLL.IProcessManager>(service => new Base.SDMS.BLL.ProcessManager(dataManager));
            services.AddTransient<Base.SensorSimulator.IBLL.IProcessManager>(service => new Base.SensorSimulator.BLL.ProcessManager());
            services.AddTransient<Base.Weather.IBLL.IProcessManager>(service => new Base.Weather.BLL.ProcessManager(dataManager));
            services.AddTransient<dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager>(service => dataManager);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Set up custom content types -associating file extension to MIME type
            var provider = new FileExtensionContentTypeProvider();
            // Add new mappings
            provider.Mappings[".glb"] = "model/gltf+binary";
            provider.Mappings[".gltf"] = "model/gltf+json";
            provider.Mappings[".hdr"] = "application/octet-stream";

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

            // HDR 모델링 파일 설정
            string strHdrPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp\\build\\resource\\hdr");
            if (Directory.Exists(strHdrPath))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(strHdrPath),
                    RequestPath = "/resource/hdr",
                    ContentTypeProvider = provider
                });
            }

            // 엑셀 파일 읽기/쓰기 관련 설정 추가
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            if (env.IsDevelopment())
            {
                //ResourceRootPath = "ClientApp\\public";
                app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "금융결제원 API");
                    c.DefaultModelExpandDepth(-1);
                });
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

    public class HideInDocsFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            foreach (var apiDescription in context.ApiDescriptions)
            {
                // replace the data to your controller name
                if (apiDescription.RelativePath.ToLower().StartsWith(context.DocumentName.ToLower()) == false)
                {
                    var route = "/" + apiDescription.RelativePath.TrimEnd('/');
                    swaggerDoc.Paths.Remove(route);
                }
            }
        }
    }
}
