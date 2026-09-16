using Dapper;
using DapperSample.IDAL;
using DapperSample.Model;
using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace DapperSample.DAL
{
    public class SelectManager : QueryManager, ISelect
    {
        public SelectManager(DataManager dataManager)
        {
            m_dbManager = dataManager.GetDbManager();
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

        public IEnumerable<Regular> JoinRegular(out string strErrMsg)
        {
            strErrMsg = null;

            string strSQL = $@"
                select *
                  from {Regular.TableName} r
            inner join {RegularMember.TableName} m on r.{Regular.Fields.ID}=m.{RegularMember.Fields.RegularID}";

            try
            {
                DbTransaction transaction = null;
                DbConnection connection = m_dbManager.GetConnection(ref transaction);
                
                IEnumerable<Regular> datas = connection.Query<Regular, RegularMember, Regular>(strSQL, (pr, pm) =>
                {
                    if (pr.RegularMembers == null)
                        pr.RegularMembers = new List<RegularMember>();

                    pr.RegularMembers.Add(pm);
                    //pm.Regular = pr;
                    return pr;
                }, null, transaction, splitOn: "ID");

                var r2 = datas.GroupBy(p => p.ID).Select(g =>
                {
                    var groupd = g.First();
                    groupd.RegularMembers = g.Select(p => p.RegularMembers.Single()).ToList();
                    return groupd;
                });

                if (transaction == null)
                    connection.Close();

                return r2.ToList();
                
            }
            catch (Exception e)
            {
                strErrMsg = e.Message;
                return null;
            }
        }
    }
}
