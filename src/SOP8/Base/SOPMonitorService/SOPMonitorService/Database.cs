using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace SOPMonitorService
{
    class Database
    {
        private class _ConfigData
        {
            public string Host
            {
                get; set;
            }

            public string DBInfo
            {
                get; set;
            }
        }

        private IDataManager m_dataManager = null;

        public IDataManager DataManager
        {
            get { return m_dataManager; }
            set { m_dataManager = value; }
        }

        private Database(int dbType, string strHost, string strDBName, string strID, string strPW)
        {
            m_dataManager = new DataManager(dbType, strHost, strDBName, strID, strPW);
        }

        public static List<Database> ReadConfig(IConfiguration configuration)
        {
            List<Database> databases = new List<Database>();
            List<_ConfigData> datas = configuration.GetSection("Database").Get<List<_ConfigData>>();

            if (datas != null)
            {
                foreach (_ConfigData data in datas)
                {
                    if (data.Host == null || data.Host.Length == 0 || data.DBInfo == null || data.DBInfo.Length == 0)
                        continue;

                    string strInfo = dnsDapperDBUtil.AES256Cipher.AES_decrypt(data.DBInfo);
                    string[] tokens = strInfo.Split('-');

                    if (tokens.Length != 4)
                        continue;

                    string strType = tokens[0].Trim();
                    string strDBName = tokens[1].Trim();
                    string strID = tokens[2].Trim();
                    string strPW = tokens[3].Trim();

                    int dbType;

                    if (int.TryParse(strType, out dbType) == false)
                        continue;

                    Database database = new Database(dbType, data.Host, strDBName, strID, strPW);
                    databases.Add(database);
                }
            }

            return databases;
        }
    }
}
