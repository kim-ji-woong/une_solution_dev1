using Dapper;
using dnsDapperDBUtil.Interfaces;
using NetTopologySuite.IO;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Diagnostics;

namespace dnsDapperDBUtil.Manager
{
    public class NpgsqlManager : DBManager
    {
        private NpgsqlTransaction m_transaction = null;
        public NpgsqlTransaction Transaction { get { return m_transaction; } }
        private NpgsqlConnection m_connection = null;
        private static readonly object s_postgresLogLock = new object();
        private const string POSTGRES_LOG_DIRECTORY = @"C:\UNE\Log\DbErrorLog";

        public static string GetConnectionString(string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            return $"HOST={strDbHost};PORT=5432;USERNAME={strDbID};PASSWORD={strDbPw};DATABASE={strDbName}";
        }


        public static DbConnection GetConnection(string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner = null)
        {
            if (transactionOwner == null)
            {
                string strConnection = GetConnectionString(strDbHost, strDbName, strDbID, strDbPw);
                var conn = new NpgsqlConnection(strConnection);
                conn.Open();
                return conn;
            }
            else
                return transactionOwner.m_connection;
        }

        public static DbTransaction GetTransaction(NpgsqlManager transactionOwner)
        {
            if (transactionOwner == null)
                return null;

            return transactionOwner.m_transaction;
        }

        private static string MapPostgresErrorMessage(PostgresException e)
        {
            string sqlState = e?.SqlState;
            if (string.IsNullOrWhiteSpace(sqlState))
                return "데이터베이스 처리 중 오류가 발생했습니다.";

            if (sqlState.StartsWith("08", StringComparison.Ordinal))
                return "데이터베이스 연결에 문제가 발생했습니다.";

            if (sqlState.StartsWith("42", StringComparison.Ordinal))
                return "시스템 처리 중 오류가 발생했습니다. 관리자에게 문의해 주세요.";

            switch (sqlState)
            {
                case "23505":
                    return "이미 등록된 데이터입니다.";
                case "23503":
                    return "연결된 데이터가 올바르지 않거나 현재 사용 중인 데이터입니다.";
                case "23502":
                    return "필수 입력값이 누락되었습니다.";
                case "22001":
                    return "입력값 길이가 허용 범위를 초과했습니다.";
                case "22P02":
                    return "입력값 형식이 올바르지 않습니다.";
                case "22003":
                    return "숫자 값이 허용 범위를 초과했습니다.";
                case "23514":
                    return "입력값이 허용 규칙을 만족하지 않습니다.";
                case "40001":
                case "40P01":
                    return "처리 중 충돌이 발생했습니다. 잠시 후 다시 시도해 주세요.";
                case "57014":
                    return "요청 처리가 취소되었거나 시간이 초과되었습니다.";
                case "28000":
                case "28P01":
                    return "데이터베이스 인증에 실패했습니다.";
                case "42501":
                    return "해당 작업을 수행할 권한이 없습니다.";
                default:
                    return "데이터베이스 처리 중 오류가 발생했습니다.";
            }
        }

        private static void WritePostgresTrace(PostgresException e, string queryLabel)
        {
            string sqlState = string.IsNullOrWhiteSpace(e?.SqlState) ? "-" : e.SqlState;
            string constraint = string.IsNullOrWhiteSpace(e?.ConstraintName) ? "-" : e.ConstraintName;
            string table = string.IsNullOrWhiteSpace(e?.TableName) ? "-" : e.TableName;
            string column = string.IsNullOrWhiteSpace(e?.ColumnName) ? "-" : e.ColumnName;
            string message = string.IsNullOrWhiteSpace(e?.MessageText) ? e?.Message : e.MessageText;
            string query = string.IsNullOrWhiteSpace(queryLabel) ? "-" : queryLabel;

            Trace.WriteLine($"PostgreSQL Error: SqlState={sqlState}, Constraint={constraint}, Table={table}, Column={column}, Message={message}, Query={query}");
            WritePostgresErrorFile(sqlState, constraint, message);
        }

        private static void WritePostgresErrorFile(string errorCode, string constraintName, string message)
        {
            try
            {
                lock (s_postgresLogLock)
                {
                    System.IO.Directory.CreateDirectory(POSTGRES_LOG_DIRECTORY);
                    CleanupExpiredPostgresLogFiles();

                    string fileName = DateTime.Today.ToString("yyyy-MM-dd") + ".txt";
                    string logPath = System.IO.Path.Combine(POSTGRES_LOG_DIRECTORY, fileName);
                    string normalizedConstraint = string.IsNullOrWhiteSpace(constraintName) ? "-" : constraintName;
                    string logLine = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} | {errorCode} | {normalizedConstraint} | {message}";

                    System.IO.File.AppendAllText(logPath, logLine + Environment.NewLine, new System.Text.UTF8Encoding(false));
                }
            }
            catch
            {
            }
        }

        private static void CleanupExpiredPostgresLogFiles()
        {
            DateTime cutoffDate = DateTime.Today.AddYears(-1);
            string[] logFiles = System.IO.Directory.GetFiles(POSTGRES_LOG_DIRECTORY, "*.txt", System.IO.SearchOption.TopDirectoryOnly);

            foreach (string logFile in logFiles)
            {
                string fileName = System.IO.Path.GetFileNameWithoutExtension(logFile);
                DateTime parsedDate;
                if (DateTime.TryParseExact(fileName, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out parsedDate) == false)
                    continue;

                if (parsedDate < cutoffDate)
                    System.IO.File.Delete(logFile);
            }
        }

        public static bool Excute(string query, object param, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
            }

            return false;
        }

        public static bool Excute(List<QueryParamSet> querySet, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, "querySet");
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/ querySet");
            }

            return false;
        }

        public static bool Insert<T>(string query, T t, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return false;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static bool Insert<T>(string query, T t, out int nAddID, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            nAddID = -1;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        int nExecuteRow = connection.Execute(query, t);

                        dynamic d = connection.QueryFirst<dynamic>("Select lastval() newid");
                        if (d.newid == null) // ID 자동증가 없는 테이블
                            nAddID = -1;
                        else
                            int.TryParse(Convert.ToString(d.newid), out nAddID);

                        //connection.AccessToken
                        //connection.ClientConnectionId
                    }
                }
                else
                {
                    int nExecuteRow = transactionOwner.m_connection.Execute(query, t, transactionOwner.m_transaction);
                    dynamic d = transactionOwner.m_connection.QueryFirst<dynamic>("Select lastval() newid", null, transactionOwner.m_transaction);
                    if (d.newid == null) // ID 자동증가 없는 테이블
                        nAddID = -1;
                    else
                        int.TryParse(Convert.ToString(d.newid), out nAddID);
                }

                return true;
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return false;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static bool Insert<T>(string query, IEnumerable<T> t, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return false;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return false;
            }
        }

        public static T QueryFirst<T>(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        return connection.QueryFirstOrDefault<T>(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.QueryFirstOrDefault<T>(query, null, transactionOwner.m_transaction);
                }
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return default(T);
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return default(T);
            }
        }

        public static IEnumerable<T> Query<T>(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        return connection.Query<T>(query);
                    } 
                }
                else
                {
                    return transactionOwner.m_connection.Query<T>(query, null, transactionOwner.m_transaction);
                }
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return null;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + " / " + query);
                return null;
            }
        }

        public static IEnumerable<T> Query<T>(string query, object args, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        return connection.Query<T>(query, args);
                    } 
                }
                else
                {
                    return transactionOwner.m_connection.Query<T>(query, args, transactionOwner.m_transaction);
                }
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return null;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + "/" + query);
                return null;
            }
        }

        public static dynamic QueryFirst(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        return connection.QueryFirstOrDefault<dynamic>(query);
                    }
                }
                else
                {
                    return transactionOwner.m_connection.Query(query, null, transactionOwner.m_transaction);
                }
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return null;
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

        public static IEnumerable<dynamic> Query(string query, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg)
        {
            strErrMsg = null;
            try
            {
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
                    {
                        return connection.Query(query);
                    } 
                }
                else
                {
                    return transactionOwner.m_connection.Query(query, null, transactionOwner.m_transaction);
                }
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return null;
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


        public static IEnumerable<T3> Query<T1, T2, T3>(string query, T3 t3, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg) where T3 : IDataClass, new()
        {
            strErrMsg = null;
            try
            {
                IEnumerable<T3> value = null;
                if (transactionOwner == null)
                {
                    using (NpgsqlConnection connection = GetConnection(strDbHost, strDbName, strDbID, strDbPw) as NpgsqlConnection)
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, query);
                return null;
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

        public static List<T> QueryGeometry<T>(string strConditions, string strDbHost, string strDbName, string strDbID, string strDbPw, NpgsqlManager transactionOwner, out string strErrMsg) where T : DataAccessLayer.IDAL.Table, new()
        {
            strErrMsg = null;
            try
            {
                T table = new T();
                string query = $"select {table.GetGeometryFieldNames(WebDBManager.DBType.npgsql)} from {table.GetTableName()} where (1=1)";
                query += strConditions;
                IEnumerable<dynamic> result = Query(query, strDbHost, strDbName, strDbID, strDbPw, transactionOwner, out strErrMsg);

                List<T> queryResult = new List<T>();
                foreach (var item in result)
                {
                    System.Collections.ArrayList arr = new System.Collections.ArrayList();
                    foreach (var type in Enum.GetValues(table.GetFieldType()))
                    {
                        string typeName = type.ToString().ToLower();
                        var data = item as IDictionary<string, object>;
                        bool bIsGeometry = false;
                        foreach (var geometryType in Enum.GetValues(table.GetGeometryFieldType()))
                        {
                            if (type.ToString() == geometryType.ToString())
                            {
                                bIsGeometry = true;
                                break;
                            }
                        }

                        if (bIsGeometry)
                        {
                            if (data[typeName] is string)
                            {
                                var wktReader = new WKTReader();
                                NetTopologySuite.Geometries.Geometry geometry = wktReader.Read(data[typeName].ToString());
                                arr.Add(geometry);
                            }
                            else
                            {
                                arr.Add(null);
                            }
                        }
                        else
                            arr.Add(data[typeName]);
                    }
                    object returnt = table.SetValue(arr);
                    queryResult.Add((T)returnt);
                }

                return queryResult;
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, "QueryGeometry");
                return null;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                Trace.WriteLine(e.Message + " / ");
                return null;
            }
        }

        /// <summary>
        /// 트랜잭션 시작
        /// </summary>
        public static NpgsqlManager BeginTransaction(string strDBHost, string strDBName, string strDbID, string strDbPW, out string strErrMsg)
        {
            strErrMsg = null;
            string strConnection = GetConnectionString(strDBHost, strDBName, strDbID, strDbPW);

            NpgsqlManager transactionOwner = new NpgsqlManager();

            try
            {
                transactionOwner.m_connection = new NpgsqlConnection(strConnection);
                transactionOwner.m_connection.Open();
                transactionOwner.m_transaction = transactionOwner.m_connection.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
                //transactionOwner.CreateTime = DateTime.Now;
                return transactionOwner;
            }
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, "BeginTransaction");
                return null;
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                //Logger.Instance.Write("BeginTransaction Fail : " + strDBName);
                //strErrorMessage = e.Message;
                return null;
            }
        }

        /// <summary>
        /// 트랜잭션 시작 후 변경 사항 커밋
        /// </summary>
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, "BatchCommit");
                return false;
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

        /// <summary>
        /// 트랜잭션 시작 후 변경 사항 롤백
        /// </summary>
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
            catch (PostgresException e)
            {
                strErrMsg = MapPostgresErrorMessage(e);
                WritePostgresTrace(e, "BatchRollback");
                return false;
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
