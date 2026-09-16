using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.Manager;

namespace Base.DAL
{
    public class TimeManager : SelectManager
    {
        public TimeManager(IDataManager dataManager)
            : base(dataManager)
        {
        }

        public DateTime GetDBTime(out string strErrorMessage)
        {
            strErrorMessage = null;
            string strSQL = "";

            if (m_dbManager.DatabaseType == WebDBManager.DBType.sqlserver)
            {
                strSQL = "Select convert(varchar(19), GetDate(), 120) dt";
            }
            else if (m_dbManager.DatabaseType == WebDBManager.DBType.mysql)
            {
                strSQL = "SELECT Concat(current_date(), ' ', current_time()) dt";
            }
            else if (m_dbManager.DatabaseType == WebDBManager.DBType.oracle)
            {
                strSQL = "SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') dt FROM DUAL";
            }
            else if (m_dbManager.DatabaseType == WebDBManager.DBType.npgsql)
            {
                strSQL = "select now() dt";
            }
            else
                return DateTime.Now;

            dynamic dy = this.SelectFirst(strSQL, out strErrorMessage);
            if (dy == null)
                return DateTime.Now;

            DateTime dt = Convert.ToDateTime(dy.dt);
            return dt;
        }
    }
}
