using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.DAL
{
    public class InsertManager : QueryManager, ICreate
    {
        public InsertManager(IDataManager dataManager)
        {
            m_dbManager = dataManager.GetDBManager();
        }

        public bool Insert<T>(T addT, out string strErrMsg) where T : Table
        {
            try
            {
                string strFieldNames = addT.GetWriteFieldNames();
                string strParamFieldNames = addT.GetWriteFieldNames(true, m_dbManager.DatabaseType);
                string strSQL = $@"insert into {addT.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                return m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                throw;
            }
        }

        public bool InsertGeometry<T>(T addT, out string strErrMsg) where T : Table
        {
            try
            {
                string strSQL = $"insert into {addT.GetTableName()} ({addT.GetWriteFieldNames()}) values ({addT.GetFieldDatas(m_dbManager.DatabaseType)})";
                return m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                throw;
            }
        }

        public bool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table
        {
            try
            {
                string strFieldNames = addT.GetWriteFieldNames();
                string strParamFieldNames = addT.GetWriteFieldNames(true, m_dbManager.DatabaseType);
                string strSQL = $@"insert into {addT.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                return m_dbManager.Insert<T>(strSQL, addT, out nAddID, out strErrMsg);
            }
            catch (Exception e)
            {
                nAddID = -1;
                strErrMsg = e.Message;
                return false;
            }
        }

        public bool Insert<T>(List<T> addT, out string strErrMsg) where T : Table, new()
        {
            try
            {                
                T t = new T();

                string strFieldNames = t.GetWriteFieldNames();
                string strParamFieldNames = t.GetWriteFieldNames(true, m_dbManager.DatabaseType);
                string strSQL = $@"insert into {t.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                return m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return false;
            }
        }

        public bool Insert(string strSQL, out string strErrMsg)
        {
            return m_dbManager.Excute(strSQL, out strErrMsg);
        }
    }
}
