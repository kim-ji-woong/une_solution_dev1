using DapperSample.IDAL;
using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.DAL
{
    public class InsertManager : QueryManager, ICreate
    {
        public InsertManager(DataManager dataManager)
        {
            m_dbManager = dataManager.GetDbManager();
        }

        public bool Insert<T>(T addT, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T t = new T();

                string strFieldNames = t.GetWriteFieldNames();
                string strParamFieldNames = t.GetWriteFieldNames(true);
                string strSQL = $@"insert into {t.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);
                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                throw;
            }
        }

        public bool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T t = new T();

                string strFieldNames = t.GetWriteFieldNames();
                string strParamFieldNames = t.GetWriteFieldNames(true);
                string strSQL = $@"insert into {t.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                m_dbManager.Insert<T>(strSQL, addT, out nAddID, out strErrMsg);
                return true;
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
                string strParamFieldNames = t.GetWriteFieldNames(true);
                string strSQL = $@"insert into {t.GetTableName()} ({strFieldNames}) values ({strParamFieldNames})";

                return m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return false;
            }
        }
    }
}
