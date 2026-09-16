using System.Configuration;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil;

namespace Sop7ToSop8
{
    class ConfigManager
    {
        private DbData m_7Data = null;
        private DbData m_8Data = null;

        public DbData Sop7Data
        {
            get { return m_7Data; }
        }

        public DbData Sop8Data
        {
            get { return m_8Data; }
        }

        public bool ReadConfig(out string strErrorMessage)
        {
            m_7Data = new DbData();

            if (m_7Data.Read("Sop7", out strErrorMessage) == false)
                return false;

            m_8Data = new DbData();

            if (m_8Data.Read("Sop8", out strErrorMessage) == false)
                return false;

            return true;
        }
    }

    class DbData
    {
        private int m_nDbType = 0;
        private string m_strDbHost = "";
        private string m_strDbID = "";
        private string m_strDbPW = "";

        public int Type
        {
            get { return m_nDbType; }
            set { m_nDbType = value; }
        }

        public string Host
        {
            get { return m_strDbHost; }
            set { m_strDbHost = value; }
        }

        public string ID
        {
            get { return m_strDbID; }
            set { m_strDbID = value; }
        }

        public string PW
        {
            get { return m_strDbPW; }
            set { m_strDbPW = value; }
        }

        public bool Read(string strType, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strDbType = ConfigurationManager.AppSettings.Get(strType + "DbType");
            string strDbHost = ConfigurationManager.AppSettings.Get(strType + "DbHost");
            string strDbID = ConfigurationManager.AppSettings.Get(strType + "DbID");
            string strDbPw = ConfigurationManager.AppSettings.Get(strType + "DbPw");

            if (strDbType == null || strDbType.Trim().Length == 0)
            {
                strErrorMessage = strType + "DbType을 찾을수 없습니다.";
                return false;
            }

            if (strDbHost == null || strDbHost.Trim().Length == 0)
            {
                strErrorMessage = strType + "DbHost를 찾을수 없습니다.";
                return false;
            }
            else
                strDbHost = AES256Cipher.AES_decrypt(strDbHost);

            if (strDbID == null || strDbID.Trim().Length == 0)
            {
                strErrorMessage = strType + "DbID를 찾을수 없습니다.";
                return false;
            }
            else
                strDbID = AES256Cipher.AES_decrypt(strDbID);

            if (strDbPw == null || strDbPw.Trim().Length == 0)
            {
                strErrorMessage = strType + "DbPw를 찾을수 없습니다.";
                return false;
            }
            else
                strDbPw = AES256Cipher.AES_decrypt(strDbPw);

            int dbType;

            if (int.TryParse(strDbType.Trim(), out dbType) == false || dbType < 0)
            {
                strErrorMessage = strType + "DbType은 0 또는 그보다 큰 정수이어야만 합니다.";
                return false;
            }

            m_nDbType = dbType;
            m_strDbHost = strDbHost.Trim();
            m_strDbID = strDbID.Trim();
            m_strDbPW = strDbPw.Trim();
            return true;
        }

        public IDataManager MakeDataManager(string strDbName)
        {
            DataManager dataManager = new DataManager(m_nDbType, m_strDbHost, strDbName, m_strDbID, m_strDbPW);
            return dataManager;
        }
    }
}
