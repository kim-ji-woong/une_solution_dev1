using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;

namespace dnsDapperDBUtil.Manager
{
    public class WebDBManager
    {
        public enum DBType { sqlserver = 0, mysql, oracle, npgsql, TypeCount };

        private DBType m_dbType = DBType.sqlserver;
        private string m_strDbHost = string.Empty;
        private string m_strDbName = string.Empty;
        private string m_strDbID = string.Empty;
        private string m_strDbPw = string.Empty;

        public DBType DatabaseType { get { return m_dbType; } set { m_dbType = value; } }
        public string DbHost { get { return m_strDbHost; } set { m_strDbHost = value; } }
        public string DbName { get { return m_strDbName; } set { m_strDbName = value; } }
        public string DbID { get { return m_strDbID; } set { m_strDbID = value; } }
        public string DbPw { get { return m_strDbPw; } set { m_strDbPw = value; } }

        private DBManager m_transactionOwner = null;
        public DBManager TransactionOwner { get { return m_transactionOwner; } }

        public WebDBManager()
        {
        }

        public WebDBManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            m_dbType = (DBType)nDbType;
            m_strDbHost = strDbHost;
            m_strDbName = strDbName;
            m_strDbID = strDbID;
            m_strDbPw = strDbPw;
        }

        public WebDBManager Clone()
        {
            WebDBManager dbMgr = new WebDBManager();
            dbMgr.m_dbType = m_dbType;
            dbMgr.m_strDbHost = m_strDbHost;
            dbMgr.m_strDbName = m_strDbName;
            dbMgr.m_strDbID = m_strDbID;
            dbMgr.m_strDbPw = m_strDbPw;

            return dbMgr;
        }

        public virtual bool BeginBatch(out string strErrMsg)
        {
            strErrMsg = null;
            if (m_transactionOwner != null)
                return false;

            if (m_dbType == DBType.sqlserver)
                m_transactionOwner = SqlServerManager.BeginTransaction(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                m_transactionOwner = OracleManager.BeginTransaction(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                m_transactionOwner = MySqlManager.BeginTransaction(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                m_transactionOwner = NpgsqlManager.BeginTransaction(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, out strErrMsg);

            if (m_transactionOwner == null)
                return false;

            return true;
        }

        public virtual bool BatchCommit(out string strErrMsg)
        {
            strErrMsg = null;
            if (m_transactionOwner == null)
                return false;

            bool result = m_transactionOwner.BatchCommit(out strErrMsg);
            m_transactionOwner = null;
            return result;
        }

        public virtual bool BatchRollback(out string strErrMsg)
        {
            strErrMsg = null;
            if (m_transactionOwner == null)
                return false;

            bool result = m_transactionOwner.BatchRollback(out strErrMsg);
            m_transactionOwner = null;
            return result;
        }

        public bool Excute(string query, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Excute(query, null, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Excute(query, null, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Excute(query, null, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Excute(query, null, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public bool Excute(string query, object param, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Excute(query, param, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Excute(query, param, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Excute(query, param, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Excute(query, param, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public bool Excute(List<QueryParamSet> querySet, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Excute(querySet, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Excute(querySet, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Excute(querySet, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Excute(querySet, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public bool Insert<T>(string query, T t, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public bool Insert<T>(string query, T t, out int nAddID, out string strErrMsg)
        {
            strErrMsg = null;
            nAddID = -1;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Insert<T>(query, t, out nAddID, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Insert<T>(query, t, out nAddID, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Insert<T>(query, t, out nAddID, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Insert<T>(query, t, out nAddID, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public bool Insert<T>(string query, IEnumerable<T> t, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Insert<T>(query, t, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return false;
        }

        public T QueryFirst<T>(string query, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.QueryFirst<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.QueryFirst<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.QueryFirst<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.QueryFirst<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return default(T);
        }

        public IEnumerable<T> Query<T>(string query, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Query<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Query<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Query<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Query<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }

        public List<T> QueryGeometry<T>(string strConditions, out string strErrMsg) where T : DataAccessLayer.IDAL.Table, new()
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.QueryGeometry<T>(strConditions, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            //else if (m_dbType == DBType.oracle)
            //    return OracleManager.QueryGeometry<T>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.QueryGeometry<T>(strConditions, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.QueryGeometry<T>(strConditions, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }

        public IEnumerable<T> Query<T>(string query, object args, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Query<T>(query, args, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Query<T>(query, args, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Query<T>(query, args, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Query<T>(query, args, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }

        public dynamic QueryFirst(string query, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.QueryFirst<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.QueryFirst<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.QueryFirst<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.QueryFirst<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }

        public IEnumerable<dynamic> Query(string query, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Query<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Query<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Query<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Query<dynamic>(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }

        public IEnumerable<T3> Query<T1, T2, T3>(string query, T3 t3, out string strErrMsg) where T3 : IDataClass, new()
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
                return SqlServerManager.Query<T1, T2, T3>(query, t3, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.oracle)
                return OracleManager.Query<T1, T2, T3>(query, t3, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.mysql)
                return MySqlManager.Query<T1, T2, T3>(query, t3, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
            else if (m_dbType == DBType.npgsql)
                return NpgsqlManager.Query<T1, T2, T3>(query, t3, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);

            return null;
        }


        public int GetColumnMaximumLength(string strTableName, string strColumnName, out string strErrMsg)
        {
            strErrMsg = null;
            if (m_dbType == DBType.sqlserver)
            {
                string query = $"SELECT CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS where Table_Name = '{strTableName}' and COLUMN_NAME = '{strColumnName}'";
                dynamic dy = SqlServerManager.QueryFirst(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner, out strErrMsg);
                if (dy == null || dy.CHARACTER_MAXIMUM_LENGTH == null)
                    return -1;

                return (int)dy.CHARACTER_MAXIMUM_LENGTH;
            }
            else if (m_dbType == DBType.oracle)
            {
                string query = $"SELECT DATA_LENGTH FROM COLS WHERE TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
                dynamic dy = OracleManager.QueryFirst(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner, out strErrMsg);
                if (dy == null || dy.DATA_LENGTH == null)
                    return -1;

                return (int)dy.CHARACTER_MAXIMUM_LENGTH;
            }
            else if (m_dbType == DBType.mysql)
            {
                string query = $"SELECT CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='{m_strDbName}' AND TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
                dynamic dy = MySqlManager.QueryFirst(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner, out strErrMsg);
                if (dy == null || dy.CHARACTER_MAXIMUM_LENGTH == null)
                    return -1;

                return (int)dy.CHARACTER_MAXIMUM_LENGTH;
            }
            else if (m_dbType == DBType.npgsql)
            {
                string query = $"SELECT CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='{m_strDbName}' AND TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
                dynamic dy = NpgsqlManager.QueryFirst(query, m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner, out strErrMsg);
                if (dy == null || dy.CHARACTER_MAXIMUM_LENGTH == null)
                    return -1;

                return (int)dy.CHARACTER_MAXIMUM_LENGTH;
            }

            return -1;
        }

        public DbConnection GetConnection(ref DbTransaction transaction)
        {
            if (m_dbType == DBType.sqlserver)
            {
                if (m_transactionOwner != null)
                    transaction = SqlServerManager.GetTransaction((SqlServerManager)m_transactionOwner);
                return SqlServerManager.GetConnection(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (SqlServerManager)m_transactionOwner);
            }
            else if (m_dbType == DBType.oracle)
            {
                if (m_transactionOwner != null)
                    transaction = OracleManager.GetTransaction((OracleManager)m_transactionOwner);
                return OracleManager.GetConnection(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (OracleManager)m_transactionOwner);
            }
            else if (m_dbType == DBType.mysql)
            {
                if (m_transactionOwner != null)
                    transaction = MySqlManager.GetTransaction((MySqlManager)m_transactionOwner);
                return MySqlManager.GetConnection(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (MySqlManager)m_transactionOwner);
            }
            else if (m_dbType == DBType.npgsql)
            {
                if (m_transactionOwner != null)
                    transaction = NpgsqlManager.GetTransaction((NpgsqlManager)m_transactionOwner);
                return NpgsqlManager.GetConnection(m_strDbHost, m_strDbName, m_strDbID, m_strDbPw, (NpgsqlManager)m_transactionOwner);
            }

            return null;
        }
    }

    public class QueryParamSet
    {
        public string SQL { get; set; }
        public object param { get; set; }
    }
}
