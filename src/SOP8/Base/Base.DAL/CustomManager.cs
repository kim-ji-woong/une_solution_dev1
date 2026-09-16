using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.Manager;

namespace Base.DAL
{
    using Models;

    // 1. DBMS 타입별로 각자 특화된 Query를 사용하는 경우에 대한 처리
    // 2. 범용적이면서 특별한 Table에 속하지 않는 Query
    public class CustomManager
    {
        public static int? GetMax(IDataManager dataManager, string strFieldName, string strTableName, string strCondition, out string strErrorMessage)
        {
            string strSQL = string.Format("Select max({0}) data from {1}", strFieldName, strTableName);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " where " + strCondition;

            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                return item.data;
            }

            return 0;
        }

        public static int? GetCount(IDataManager dataManager, string strFieldName, string strTableName, string strCondition, out string strErrorMessage)
        {
            string strSQL = string.Format("Select count({0}) data from {1}", strFieldName, strTableName);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " where " + strCondition;

            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                try
                {
                    return Convert.ToInt32(item.data);
                }
                catch
                {
                    return null;
                }
            }

            return 0;
        }

        // 특정 Field의 최대길이값을 얻어온다.
        public static int GetColumnMaximumLength(IDataManager dataManager, string strTableName, string strColumnName, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strSQL = "";

            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == WebDBManager.DBType.sqlserver)
            {
                strSQL = $"SELECT CHARACTER_MAXIMUM_LENGTH len from INFORMATION_SCHEMA.COLUMNS where Table_Name = '{strTableName}' and COLUMN_NAME = '{strColumnName}'";
            }
            else if (dbType == WebDBManager.DBType.oracle)
            {
                strSQL = $"SELECT DATA_LENGTH len FROM COLS WHERE TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
            }
            else if (dbType == WebDBManager.DBType.mysql)
            {
                strSQL = $"SELECT CHARACTER_MAXIMUM_LENGTH len FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='{dataManager.GetDBManager().DbName}' AND TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
            }
            else if (dbType == WebDBManager.DBType.npgsql)
            {
                strSQL = $"SELECT CHARACTER_MAXIMUM_LENGTH len FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{strTableName}' AND COLUMN_NAME='{strColumnName}'";
            }
            else
                return -1;

            IEnumerable<dynamic> items = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (items == null)
                return -1;

            foreach (var item in items)
            {
                int? len = item.len;

                if (len == null)
                    return -1;
                else
                    return (int)len;
            }

            return -1;
        }

        // 계층형 쿼리(위에서 아래로 검색)
        public static ICollection<int> GetRecursiveQuery(IDataManager dataManager, string strTableName, string strFieldName, string strParentFieldName, string strCondition, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strSQL = "";

            List<int> results = new List<int>();

            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == WebDBManager.DBType.sqlserver)
            {
                strSQL = string.Format("with cte as (Select {0}, {1} from {2} where {3} Union All Select b.{0}, b.{1} from cte as a inner join {2} as b on b.{1} = a.{0}) select * from cte",
                    strFieldName, strParentFieldName, strTableName, strCondition);
            }
            else if (dbType == WebDBManager.DBType.oracle)
            {
                strSQL = string.Format("Select {0}, {1} from {2} start with {3} connect by prior {0} = {1}",
                    strFieldName, strParentFieldName, strTableName, strCondition);
            }
            else if (dbType == WebDBManager.DBType.mysql)
            {
                strSQL = string.Format("WITH RECURSIVE cte ({0}, {1}) AS (SELECT {0}, {1} from {2} where {3} UNION ALL SELECT a.{0}, a.{1} FROM {2} a inner join cte on a.{1} = cte.{0}) select * from cte",
                    strFieldName, strParentFieldName, strTableName, strCondition);
            }
            else if (dbType == WebDBManager.DBType.npgsql)
            {
                strSQL = string.Format("with recursive cte ({0}, {1}) as (select {0}, {1} from {2} where {3} union select b.{0}, b.{1} from cte a inner join {2} b on b.{1} = a.{0}) select * from cte",
                    strFieldName, strParentFieldName, strTableName, strCondition);
            }
            else
            {
                strErrorMessage = "알수없는 타입입니다.";
                return null;
            }

            IEnumerable<dynamic> items = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (items == null)
                return null;

            Dictionary<int, int> dicValues = new Dictionary<int, int>();

            foreach (var item in items)
            {
                var data = item as IDictionary<string, object>;
                
                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (pair.Key == strFieldName)
                    {
                        // 중복된 값이 있을수 있어서 dictionary를 사용한다.
                        if (pair.Value != null)
                            dicValues[(int)pair.Value] = (int)pair.Value;
                    }
                }
            }

            return dicValues.Values;
        }

        public static string MakePaginationQuery(IDataManager dataManager, string strSQL, int beginIndex, int? endIndex, string strOrderByField)
        {
            string strTarget = "select";
            int index = strSQL.ToLower().IndexOf(strTarget);

            if (index < 0)
                return strSQL;

            string strSubQuery = index >= 0 ? strSQL.Substring(index + strTarget.Length) : strSQL;
            string strSQL2 = "";

            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == WebDBManager.DBType.sqlserver)
            {
                strSQL2 = string.Format("Select ROW_NUMBER() over(order by {0}) as {1}, COUNT(*) over() as {2}, ", strOrderByField, Pagination.RowNoField, Pagination.TotalCountField) + strSubQuery;

                if (endIndex != null)
                    strSQL2 += string.Format(" order by {0} offset {1} rows fetch next {2} rows only", Pagination.RowNoField, beginIndex - 1, (int)endIndex - beginIndex + 1);
                else
                    strSQL2 += string.Format(" order by {0} offset {1} rows", Pagination.RowNoField, beginIndex - 1);
            }
            else if (dbType == WebDBManager.DBType.oracle)
            {
                strSQL2 = string.Format("Select rownum as {0}, count(*) over () result_count as {1}, ", Pagination.RowNoField, Pagination.TotalCountField) + strSubQuery;

                if (endIndex != null)
                {
                    int index2 = strSubQuery.ToLower().IndexOf("where");

                    if (index2 > 0)
                    {
                        strSQL2 += string.Format(" and {0} between {1} and {2}", Pagination.RowNoField, beginIndex, (int)endIndex);
                    }
                    else
                    {
                        strSQL2 += string.Format(" where {0} between {1} and {2}", Pagination.RowNoField, beginIndex, (int)endIndex);
                    }
                }
            }
            else if (dbType == WebDBManager.DBType.mysql)
            {
                int index2 = strSubQuery.ToLower().IndexOf("where");

                if (endIndex == null)
                    endIndex = beginIndex + 1000000;

                if (index2 > 0)
                {
                    strSQL2 = string.Format("Select SQL_CALC_FOUND_ROWS @rnum := @rnum + 1 as {0}, FOUND_ROWS() as {1}, ", Pagination.RowNoField, Pagination.TotalCountField) + strSubQuery.Substring(0, index2) + string.Format(", (Select @rnum := {0}) r ", beginIndex - 1);
                    strSQL2 += strSubQuery.Substring(index2) + string.Format(" limit {0}, {1}", beginIndex - 1, (int)endIndex - beginIndex + 1);
                }
                else
                {
                    strSQL2 = string.Format("Select SQL_CALC_FOUND_ROWS @rnum := @rnum + 1 as {0}, FOUND_ROWS() as {1}, ", Pagination.RowNoField, Pagination.TotalCountField) + strSubQuery + string.Format(", (Select @rnum := {0}) r limit {0}, {1}", beginIndex - 1, (int)endIndex - beginIndex + 1);
                }
            }
            else if (dbType == WebDBManager.DBType.npgsql)
            {
                if (endIndex == null)
                    endIndex = beginIndex + 1000000;

                strSQL2 = string.Format("Select ROW_NUMBER() over(order by {0}) as {1}, COUNT(*) over() as {2}, ", strOrderByField, Pagination.RowNoField, Pagination.TotalCountField) + strSubQuery;
                strSQL2 += string.Format(" limit {0} offset {1}", (int)endIndex - beginIndex + 1, beginIndex - 1);
            }

            return strSQL2;
        }

        /// <summary>
        /// 쿼리에 들어갈 bool 값을 DB type별 문자열로 변환한다.
        /// 매개변수는 bool형으로 true 또는 false이어야 한다.
        /// </summary>
        /// <param name="dataManager"></param>
        /// <param name="bValue"></param>
        /// <returns></returns>
        public static string GetBoolValue(IDataManager dataManager, bool bValue)
        {
            if (dataManager == null)
                throw new ArgumentNullException(nameof(dataManager));
            
            if (dataManager.GetDBManager().DatabaseType == WebDBManager.DBType.npgsql)
            {
                return bValue ? "true" : "false";
            }
            return bValue ? "1" : "0";
        }

        public static DateTime? GetCurrentTime(IDataManager dataManager, out string strErrorMessage)
        {
            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == WebDBManager.DBType.sqlserver)
            {
                IEnumerable<dynamic> items = dataManager.GetSelect().Select("Select convert(varchar(19), GetDate(), 120) tm", out strErrorMessage);
                return GetTime(items, ref strErrorMessage);
            }
            else if (dbType == WebDBManager.DBType.mysql)
            {
                IEnumerable<dynamic> items = dataManager.GetSelect().Select("SELECT CURRENT_TIMESTAMP() tm", out strErrorMessage);
                return GetTime(items, ref strErrorMessage);
            }
            else
                strErrorMessage = null;
            
            return DateTime.Now;
        }

        public static string ConcatFields(IDataManager dataManager, List<string> fieldNames, string delimeter)
        {
            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            int fieldCount = fieldNames.Count;
            string strFields = fieldCount > 0 ? fieldNames[0] : "";

            if (dbType == WebDBManager.DBType.sqlserver || dbType == WebDBManager.DBType.mysql)
            {
                for (int i=1;i<fieldCount;i++)
                {
                    string fieldName = fieldNames[i];
                    strFields = string.Format("concat({0}, '{1}', {2})", strFields, delimeter, fieldName);
                }
            }
            else
            {
                for (int i = 1; i < fieldCount; i++)
                {
                    string fieldName = fieldNames[i];
                    strFields += " || " + fieldName;
                }
            }

            return strFields;
        }

        // 상위 n개의 결과만 받아오는 쿼리로 변경한다.
        public static string MakeTopNQuery(IDataManager dataManager, string strSQL, int n)
        {
            WebDBManager.DBType dbType = dataManager.GetDBManager().DatabaseType;

            if (dbType == WebDBManager.DBType.sqlserver)
            {
                int index = strSQL.ToLower().IndexOf("select");

                if (index < 0)
                    return strSQL;

                string strQuery1 = strSQL.Substring(0, index + 6) + " Top(" + n.ToString() + ") ";
                string strQuery2 = strSQL.Substring(index + 6);
                return strQuery1 + strQuery2;
            }
            else if (dbType == WebDBManager.DBType.mysql ||
                dbType == WebDBManager.DBType.npgsql)
            {
                return strSQL + " LIMIT " + n.ToString();
            }
            else if (dbType == WebDBManager.DBType.oracle)
            {
                return strSQL + " FETCH FIRST " + n.ToString() + " ROWS ONLY";
            }

            return strSQL;
        }

        private static DateTime? GetTime(IEnumerable<dynamic> items, ref string strErrorMessage)
        {
            if (items == null)
                return null;

            foreach (var item in items)
            {
                DateTime tm;
                string strTime = item.tm.ToString();

                if (DateTime.TryParse(strTime, out tm))
                    return tm;
            }

            strErrorMessage = "DB로부터 현재 시간을 읽어올수 없습니다.";
            return null;
        }
    }
}
