using dnsDBUtil;

namespace SVMSServer.DAL
{
    using System.Collections;
    using System.Collections.Generic;

    public class DataManager
    {
        private TransactionDBManager m_dbManager = null;
        //private WebDBManager m_dbManager = null;

        private CreateManager m_createManager = null;
        private DeleteManager m_deleteManager = null;
        private SelectManager m_selectManager = null;
        private UpdateManager m_updateManager = null;

        private int m_nSiteID = 0;

        public int SiteID
        {
            get
            {
                return m_nSiteID;
            }
        }

        public DataManager()
        {
            SetDBConnection();

            CreateAllManager();
        }

        public DataManager(int nSiteID)
        {
            m_nSiteID = nSiteID;
            SetDBConnection();

            CreateAllManager();
        }

        public DataManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw, int nSiteID)
        {
            m_nSiteID = nSiteID;
            SetDBConnection(nDbType, strDbHost, strDbName, strDbID, strDbPw);

            CreateAllManager();
        }

        private void CreateAllManager()
        {
            if (m_createManager == null)
            {
                m_createManager = new CreateManager(this);
            }

            if (m_selectManager == null)
            {
                m_selectManager = new SelectManager(this);
            }

            if (m_deleteManager == null)
            {
                m_deleteManager = new DeleteManager(this);
            }

            if (m_updateManager == null)
            {
                m_updateManager = new UpdateManager(this);
            }
        }

        public CreateManager GetCreateManager()
        {
            if (m_createManager != null)
            {
                return m_createManager;
            }
            else
            {
                return null;
            }
        }

        public DeleteManager GetDeleteManager()
        {
            if (m_deleteManager != null)
            {
                return m_deleteManager;
            }
            else
            {
                return null;
            }
        }

        public SelectManager GetSelectManager()
        {
            if (m_selectManager != null)
            {
                return m_selectManager;
            }
            else
            {
                return null;
            }
        }

        public UpdateManager GetUpdateManager()
        {
            if (m_updateManager != null)
            {
                return m_updateManager;
            }
            else
            {
                return null;
            }
        }

        public object GetDBManager()
        {
            if (m_dbManager != null)
            {
                return m_dbManager;
            }
            else
            {
                return null;
            }
        }

        public void SetDBConnection()
        {
            if (m_dbManager == null)
            {
                m_dbManager = new TransactionDBManager();
            }
        }

        public void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            if (m_dbManager == null)
            {
                m_dbManager = new TransactionDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
            }
        }

        public bool BeginBatch()
        {
            return m_dbManager.BeginBatch();
        }

        public bool BatchCommit()
        {
            return m_dbManager.BatchCommit();
        }

        public bool BatchRollback()
        {
            return m_dbManager.BatchRollback();
        }

        public DataManager Clone()
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw, SiteID);
            return dataManager;
        }
    }

    internal class TransactionDBManager : DirectDBManager
    {
        public TransactionDBManager()
            : base()
        {
        }

        public TransactionDBManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
            : base(nDbType, strDbHost, strDbName, strDbID, strDbPw)
        {
        }

        public override ArrayList GetResultData(string strSQL, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchData(strSQL);

            return base.GetResultData(strSQL, strDBName);
        }

        public override ArrayList GetResultData(string strSQL, int nLimit, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchData(strSQL, nLimit);

            return base.GetResultData(strSQL, nLimit, strDBName);
        }

        public override ArrayList GetStoredProcedureResult(string strProcedureName, List<string> fieldNames, List<string> fieldValues, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchStoredProcedureResult(strProcedureName, fieldNames, fieldValues);

            return base.GetStoredProcedureResult(strProcedureName, fieldNames, fieldValues, strDBName);
        }
    }
}
