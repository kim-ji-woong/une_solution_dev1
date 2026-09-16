using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace dnsSMS
{
    class DBManager
    {
        public static string GetCurrentTimeString(IDataManager dataManager)
        {
            string strTime = "";

            if (dataManager.GetDBManager().DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver)
            {
                string strErrorMessage;
                string strSQL = "Select convert(varchar(19), GetDate(), 120) time";
                IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (result == null)
                    return "";

                foreach (var item in result)
                {
                    strTime = item.time;
                    break;
                }
            }
            else if (dataManager.GetDBManager().DatabaseType == dnsDapperDBUtil.Manager.WebDBManager.DBType.mysql)
            {
                string strErrorMessage;
                string strSQL = "SELECT current_date() date, current_time() time";
                IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (result == null)
                    return "";

                foreach (var item in result)
                {
                    strTime = item.date + item.time;
                    break;
                }
            }
            else
            {
                DateTime dtNow = DateTime.Now;
                strTime = string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
                return strTime;
            }

            strTime = strTime.Replace("-", "");
            strTime = strTime.Replace(":", "");
            strTime = strTime.Replace(" ", "");

            int nIndex = strTime.LastIndexOf('.');

            if (nIndex >= 0)
                strTime = strTime.Substring(0, nIndex);

            return strTime;
        }
    }
}
