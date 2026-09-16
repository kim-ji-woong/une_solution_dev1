using dnsDapperDBUtil.DataAccessLayer.DAL;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SoulbrainWebAPIServer.Managers;
using System.Collections.Generic;

namespace SoulbrainWebAPIServer
{
    public class Startup
    {
        private static Config.ConfigManager m_configManager = new Config.ConfigManager();
        private ProcessManager m_processManager = null;
        private DataManager m_dataManager = null;
        private DataManager m_wishDataManager = null;

        // 초순수, 전력 DB
        private DataManager m_dataManager_power = null;
        private DataManager m_dataManager_facility = null;
        
        public static Config.ConfigManager ConfigManager
        {
            get { return m_configManager; }
        }
        
        public Startup(IConfiguration configuration)
        {
            m_configManager.ReadConfig(configuration);
            
            Logger.Instance.Write("Startup ReadConfig");

            if (m_configManager.Database.DBType != null)
            {
                int nDBType = (int)m_configManager.Database.DBType;
                string strHost = m_configManager.Database.Host;
                string strDbName = m_configManager.Database.DbName;
                string strUserName = m_configManager.Database.UserName;
                string strPassword = m_configManager.Database.Password;
                
                m_dataManager = new DataManager(nDBType, strHost, strDbName, strUserName, strPassword);
            }
            
            if (m_configManager.WishDatabase.DBType != null)
            {
                int nDBType = (int)m_configManager.WishDatabase.DBType;
                string strHost = m_configManager.WishDatabase.Host;
                string strDbName = m_configManager.WishDatabase.DbName;
                string strUserName = m_configManager.WishDatabase.UserName;
                string strPassword = m_configManager.WishDatabase.Password;
                
                m_wishDataManager = new DataManager(nDBType, strHost, strDbName, strUserName, strPassword);
            }

            // 초순수, 전력 DB정보
            if (m_configManager.Database_Power.DBType != null)
            {
                int nDBType = (int)m_configManager.Database_Power.DBType;
                string strHost = m_configManager.Database_Power.Host;
                string strDbName = m_configManager.Database_Power.DbName;
                string strUserName = m_configManager.Database_Power.UserName;
                string strPassword = m_configManager.Database_Power.Password;
                
                m_dataManager_power = new DataManager(nDBType, strHost, strDbName, strUserName, strPassword);
            }
            if (m_configManager.Database_Facility.DBType != null)
            {
                int nDBType = (int)m_configManager.Database_Facility.DBType;
                string strHost = m_configManager.Database_Facility.Host;
                string strDbName = m_configManager.Database_Facility.DbName;
                string strUserName = m_configManager.Database_Facility.UserName;
                string strPassword = m_configManager.Database_Facility.Password;
                
                m_dataManager_facility = new DataManager(nDBType, strHost, strDbName, strUserName, strPassword);
            }
            
            if (m_dataManager != null && m_wishDataManager != null)
                m_processManager = new ProcessManager(m_dataManager, m_dataManager_power, m_dataManager_facility, m_wishDataManager, m_configManager.ExcelPath.Path, m_configManager.SOPWebServer.Url, m_configManager.SOPWebServer.Url_Power, m_configManager.SOPWebServer.Url_Facility);
            
        }
        
        public IConfiguration? Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddControllers();
            services.AddControllersWithViews();

            if (m_processManager != null)
            {
                services.AddTransient<global::SoulbrainWebAPIServer.Managers.ProcessManager>(service => m_processManager);
            }

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "SoulbrainWebAPIServer", 
                    Version = "v1", 
                    Description = "SoulbrainWebAPIServer API"
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
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                
                
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SoulbrainWebAPIServer v1"); 
                    c.RoutePrefix = string.Empty;
                    c.DocumentTitle = "Soulbrain Web API Server";
                    c.DefaultModelExpandDepth(-1);
                });
            }
            else
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Soulbrain Web API v1");
                    c.RoutePrefix = "api-docs"; // 프로덕션에서는 다른 경로 사용
                });
                
                app.Use(async (context, next) =>
                {
                    if (context.Request.Path == "/api-docs/index.html")
                    {
                        context.Response.Redirect("/api-docs", true);
                        return;
                    }
                    await next();
                });
            }

            app.UseRouting();

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}