using Dapper;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace dnsDapperDBUtil.DataAccessLayer.DAL
{
    public class SelectManager : QueryManager, ISelect
    {
        public SelectManager(IDataManager dataManager)
        {
            m_dbManager = dataManager.GetDBManager();
        }

        public T SelectFirst<T>(string strConditions, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T t = new T();

                string strSQL = $"select {t.GetFieldNames()} from {t.GetTableName()} where (1=1)";
                strSQL += GetConditions(strConditions);

                t = m_dbManager.QueryFirst<T>(strSQL, out strErrMsg);
                return t;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return null;
            }
        }

        public IEnumerable<T> Select<T>(string strConditions, out string strErrMsg) where T : Table, new()
        {
            try
            {
                T table = new T();
                
                string strSQL = $"select {table.GetFieldNames()} from {table.GetTableName()} where (1=1)";
                strSQL += GetConditions(strConditions);

                return m_dbManager.Query<T>(strSQL, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return null;
            }
        }

        public List<T> SelectGeometry<T>(string strConditions, out string strErrMsg) where T : Table, new()
        {
            try
            {
                strConditions = GetConditions(strConditions);
                return m_dbManager.QueryGeometry<T>(strConditions, out strErrMsg);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return null;
            }
        }

        public dynamic SelectFirst(string strSQL, out string strErrMsg)
        {
            return m_dbManager.QueryFirst(strSQL, out strErrMsg);
        }

        public IEnumerable<dynamic> Select(string strSQL, out string strErrMsg)
        {
            return m_dbManager.Query(strSQL, out strErrMsg);
        }

        public IEnumerable<T3> Select<T1, T2, T3>(string strSQL, T3 t3, out string strErrMsg) where T3 : IDataClass, new()
        {
            return m_dbManager.Query<T1, T2, T3>(strSQL, t3, out strErrMsg);
        }

        public int GetColumnMaximumLength(string strTableName, string strColumnName, out string strErrMsg)
        {
            return m_dbManager.GetColumnMaximumLength(strTableName, strColumnName, out strErrMsg);
        }
    }
}
