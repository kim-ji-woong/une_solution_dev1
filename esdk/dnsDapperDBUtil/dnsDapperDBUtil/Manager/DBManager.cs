using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;

namespace dnsDapperDBUtil.Manager
{
    public abstract class DBManager
    {
        //public abstract string GetConnectionString();
        //public abstract DbConnection GetConnection();
        //public abstract int InsertQuery(string query);
        //public abstract IEnumerable<T> Query<T>(string query);
        //public abstract IEnumerable<T> Query<T>(string query, object args);
        //public abstract IEnumerable<dynamic> Query(string query);
        //public abstract IEnumerable<T3> Query<T1, T2, T3>(string query, T3 t3) where T3 : Interfaces.IDataClass, new();
        public abstract bool BatchCommit(out string strErrMsg);
        public abstract bool BatchRollback(out string strErrMsg);
    }
}
