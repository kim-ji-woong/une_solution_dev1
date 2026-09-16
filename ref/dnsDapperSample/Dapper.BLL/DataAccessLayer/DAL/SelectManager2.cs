using Dapper;
using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using DapperSample.BLL.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace DapperSample.BLL.DataAccessLayer.DAL
{
    public class SelectManager2 : SelectManager, ISelect2
    {
        public SelectManager2(IDataManager2 dataManager) : base (dataManager)
        {
            
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
