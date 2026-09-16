using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace dnsPipeHelper
{
    public class ProcessManager
    {
        public static IDataManager GetDataManager()
        {
            PipeClient client = new PipeClient();
            string strDbInfo = client.GetDBInfo();

            if (strDbInfo != null)
            {
                string[] tokens = strDbInfo.Split(';');

                if (tokens.Length >= 5)
                {
                    string strDbType = tokens[0].Trim();
                    string strDbHost = tokens[1].Trim();
                    string strDbName = tokens[2].Trim();
                    string strId = tokens[3].Trim();
                    string strPw = tokens[4].Trim();

                    int dbType;

                    if (int.TryParse(strDbType, out dbType))
                    {
                        return new DataManager(dbType, strDbHost, strDbName, strId, strPw);
                    }
                }
            }

            return null;
        }

        public static string GetSOPWebServerUrl()
        {
            PipeClient client = new PipeClient();
            return client.GetSOPWebServerUrl();
        }

        public static Logger GetLogger(string strLogTag)
        {
            PipeClient client = new PipeClient();
            string strLogFolder = client.GetLogFolder();

            if (strLogFolder != Header.ResponseNull)
            {
                Logger logger = new Logger(strLogTag, strLogFolder);
                return logger;
            }

            return null;
        }

        public static int GetSiteNo()
        {
            PipeClient client = new PipeClient();
            string strSiteNo = client.GetSiteNo();

            int siteNo;

            if (int.TryParse(strSiteNo, out siteNo))
                return siteNo;

            return -1;
        }
    }
}
