using DapperSample.IDAL;
using dnsDapperDBUtil.Manager;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.DAL
{
    public class DataManager : IDataManager
    {
        private WebDBManager m_dbManager = null;

        private InsertManager m_create = null;
        private DeleteManager m_delete = null;
        private SelectManager m_select = null;
        private UpdateManager m_update = null;

        public DataManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            SetDBConnection(nDbType, strDbHost, strDbName, strDbID, strDbPw);
            CreateAllManager();
        }

        public WebDBManager GetDbManager()
        {
            return m_dbManager;
        }

        public void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            if (m_dbManager == null)
                m_dbManager = new WebDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
        }

        private void CreateAllManager()
        {
            if (m_create == null)
                m_create = new InsertManager(this);

            if (m_select == null)
                m_select = new SelectManager(this);

            if (m_delete == null)
                m_delete = new DeleteManager(this);

            if (m_update == null)
                m_update = new UpdateManager(this);
        }

        public IDelete GetDelete()
        {
            return m_delete;
        }

        public ISelect GetSelect()
        {
            return m_select;
        }

        public IUpdate GetUpdate()
        {
            return m_update;
        }
        public ICreate GetCreate()
        {
            return m_create;
        }

        public bool BeginBatch(out string strErrMsg)
        {
            return m_dbManager.BeginBatch(out strErrMsg);
        }

        public bool BatchCommit(out string strErrMsg)
        {
            return m_dbManager.BatchCommit(out strErrMsg);
        }

        public bool BatchRollback(out string strErrMsg)
        {
            return m_dbManager.BatchRollback(out strErrMsg);
        }
        
        public IDataManager Clone()
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw);
            return dataManager;
        }
    }
}
