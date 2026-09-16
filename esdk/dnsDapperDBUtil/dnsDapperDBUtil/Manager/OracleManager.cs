using Dapper;
using dnsDapperDBUtil.Interfaces;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Diagnostics;
using System.Text;

namespace dnsDapperDBUtil.Manager
{
    public class OracleManager : DBManager
    {
        private OracleTransaction m_transaction = null;
        public OracleTransaction Transaction { get { return m_transaction; } }
        private OracleConnection m_connection = null;

        public static string GetConnectionString(string strDbHost, string strSID, string strDbID, string strDbPw)
        {
            // db name > service name로 사용
            string strPort = "1521";
            string dataSourceFormat = @"(DESCRIPTION=(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = {0})(PORT = {1}))) (CONNECT_DATA =(SERVICE_NAME = {2})))";
            string dataSource = string.Format(dataSourceFormat, strDbHost, strPort, strSID);

            string connectionString = string.Format("Data Source={0};load balancing=false; ha events=false;User ID={1};Password={2}", dataSource, strDbID, strDbPw);
            return connectionString;
        }


        public static DbConnection GetConnection(string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner = null)
        {
            if (transactionOwner == null)
            {
                string strConnection = GetConnectionString(strDbHost, strDbName, strDbID, strDbPw);
                var conn = new OracleConnection(strConnection);
                conn.Open();
                return conn;
            }
            else
                return transactionOwner.m_connection;
        }

        public static DbTransaction GetTransaction(OracleManager transactionOwner)
        {
            if (transactionOwner == null)
                return null;

            return transactionOwner.m_transaction;
        }

        public static bool Excute(string query, object param, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        int nExecuteRow = connection.Execute(query, param);
                        //connection.AccessToken
                        //connection.ClientConnectionId
                    }
                }
                else
                {
                    int nExecuteRow = transactionOwner.m_connection.Execute(query, param, transactionOwner.m_transaction);
                }

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
            }

            return false;
        }

        public static bool Excute(List<QueryParamSet> querySet, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        foreach (QueryParamSet item in querySet)
                        {
                            int nExecuteRow = connection.Execute(item.SQL, item.param);
                        }

                    }
                }
                else
                {
                    foreach (QueryParamSet item in querySet)
                    {
                        int nExecuteRow = transactionOwner.m_connection.Execute(item.SQL, item.param, transactionOwner.m_transaction);
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/ querySet");
            }

            return false;
        }

        public static bool Insert<T>(string query, T t, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        int nExecuteRow = connection.Execute(query, t);
                        if (nExecuteRow > 0)
                            return true;
                    }
                }
                else
                {
                    int nExecuteRow = transactionOwner.m_connection.Execute(query, t, transactionOwner.m_transaction);
                    if (nExecuteRow > 0)
                        return true;
                }

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static bool Insert<T>(string query, T t, out int nAddID, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            nAddID = -1;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        int nExecuteRow = connection.Execute(query, t);

                        dynamic d = connection.QueryFirst<dynamic>("Select @@IDENTITY newID");
                        if (d.newID == null) // ID 자동증가 없는 테이블
                            nAddID = -1;
                        else
                            int.TryParse(Convert.ToString(d.newID), out nAddID);

                        //connection.AccessToken
                        //connection.ClientConnectionId
                    }
                }
                else
                {
                    int nExecuteRow = transactionOwner.m_connection.Execute(query, t, transactionOwner.m_transaction);
                    dynamic d = transactionOwner.m_connection.QueryFirst<dynamic>("Select @@IDENTITY newID", null, transactionOwner.m_transaction);
                    if (d.newID == null) // ID 자동증가 없는 테이블
                        nAddID = -1;
                    else
                        int.TryParse(Convert.ToString(d.newID), out nAddID);
                }

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static bool Insert<T>(string query, IEnumerable<T> t, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        int nExecuteRow = connection.Execute(query, t);
                        //connection.AccessToken
                        //connection.ClientConnectionId
                    }
                }
                else
                {
                    int nExecuteRow = transactionOwner.m_connection.Execute(query, t, transactionOwner.m_transaction);
                }

                return true;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static T QueryFirst<T>(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        return connection.QueryFirstOrDefault<T>(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.QueryFirstOrDefault<T>(query, null, transactionOwner.m_transaction);
                }
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return default(T);
            }
        }

        public static IEnumerable<T> Query<T>(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        return connection.Query<T>(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.Query<T>(query, null, transactionOwner.m_transaction);
                }
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + " / " + query);
                return null;
            }
        }

        public static IEnumerable<T> Query<T>(string query, object args, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        return connection.Query<T>(query, args);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.Query<T>(query, args, transactionOwner.m_transaction);
                }
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return null;
            }
        }

        public static dynamic QueryFirst(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        return connection.QueryFirstOrDefault<dynamic>(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.Query(query, null, transactionOwner.m_transaction);
                }
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                //Logger.Instance.Write("RunQuery : " + query);
                //Logger.Instance.Write("RunQuery Exception : " + e.Message);
                return null;
            }
        }

        public static IEnumerable<dynamic> Query(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        return connection.Query(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.Query(query, null, transactionOwner.m_transaction);
                }
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                //Logger.Instance.Write("RunQuery : " + query);
                //Logger.Instance.Write("RunQuery Exception : " + e.Message);
                return null;
            }
        }


        public static IEnumerable<T3> Query<T1, T2, T3>(string query, T3 t3, string strDbHost, string strDbName, string strDbID, string strDbPw, OracleManager transactionOwner, out string strErrMsg) where T3 : IDataClass, new()
        {
            strErrMsg = null;
            try
            {
                IEnumerable<T3> value = null;
                if (transactionOwner == null)
                {
                    using (OracleConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as OracleConnection)
                    {
                        value = connection.Query<T1, T2, T3>(query, (t1, t2) =>
                        {
                            t3 = (T3)t3.MakeDataClass();
                            t3.Binding(t1, t2);

                            return t3;
                        });
                    }
                }
                else
                {
                    value = transactionOwner.m_connection.Query<T1, T2, T3>(query, (t1, t2) =>
                    {
                        t3 = (T3)t3.MakeDataClass();
                        t3.Binding(t1, t2);

                        return t3;
                    }, null, transactionOwner.m_transaction);
                }

                return value;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                //Logger.Instance.Write("RunQuery : " + query);
                //Logger.Instance.Write("RunQuery Exception : " + e.Message);
                return null;
            }
        }

        public static OracleManager BeginTransaction(string strDBHost, string strDBName, string strDbID, string strDbPW, out string strErrMsg)
        {
            strErrMsg = null;
            string strConnection = GetConnectionString(strDBHost, strDBName, strDbID, strDbPW);

            OracleManager transactionOwner = new OracleManager();

            try
            {
                transactionOwner.m_connection = new OracleConnection(strConnection);
                transactionOwner.m_connection.Open();
                transactionOwner.m_transaction = transactionOwner.m_connection.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
                //transactionOwner.CreateTime = DateTime.Now;
                return transactionOwner;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                //Logger.Instance.Write("BeginTransaction Fail : " + strDBName);
                //strErrorMessage = e.Message;
                return null;
            }
        }

        public override bool BatchCommit(out string strErrMsg)
        {
            strErrMsg = null;
            if (m_connection == null)
            {
                //Logger.Instance.Write("BatchCommit");
                //return DBException.ErrorMessage2("DB 연결이 끊어졌거나 유효하지 않습니다.");
                return false;
            }

            if (m_transaction == null)
            {
                try
                {
                    m_connection.Close();
                }
                catch (Exception)
                {
                }

                m_connection = null;
                //Logger.Instance.Write("BatchCommit");
                //return DBException.ErrorMessage2("커밋할 Transaction이 존재하지 않습니다.");
                return false;
            }

            try
            {
                m_transaction.Commit();
                m_connection.Close();
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                //Logger.Instance.Write("BatchCommit : " + strError);
                return false;
            }
            finally
            {
                m_transaction = null;
                m_connection = null;
            }

            return true;
        }

        public override bool BatchRollback(out string strErrMsg)
        {
            strErrMsg = null;
            if (m_connection == null)
            {
                //Logger.Instance.Write("BatchRollback");
                //return DBException.ErrorMessage2("DB 연결이 끊어졌거나 유효하지 않습니다.");
                return false;
            }

            if (m_transaction == null)
            {
                try
                {
                    m_connection.Close();
                }
                catch (Exception)
                {
                }

                m_connection = null;
                //Logger.Instance.Write("BatchRollback");
                //return DBException.ErrorMessage2("롤백할 Transaction이 존재하지 않습니다.");
                return false;
            }

            try
            {
                m_transaction.Rollback();
                m_connection.Close();
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                //Logger.Instance.Write("BatchRollback : " + strError);
                return false;
            }
            finally
            {
                m_transaction = null;
                m_connection = null;
            }

            return true;
        }
    }
}
