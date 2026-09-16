using dnsDapperDBUtil.Manager;
using System;
using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.DAL
{
    public class QueryManager
    {
        protected WebDBManager m_dbManager = null;
        protected string GetConditions(string strConditions)
        {
            if (strConditions == null || strConditions.Length == 0)
                return string.Empty;

            strConditions = strConditions.Trim();
            if (strConditions.ToLower().StartsWith("order by"))
                return " " + strConditions;
            else
                return $" and {strConditions}";
        }

        protected string GetFieldNames<EnumType>(/*out int nFieldCount*/)
        {
            //nFieldCount = 0;
            string strFields = "";

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (strFields.Length == 0)
                    strFields = type.ToString();
                else
                    strFields += ", " + type.ToString();

                //nFieldCount++;
            }

            return strFields;
        }

        protected string SetData<DataType>(Dictionary<DataType, object> dicSets, ref Dictionary<string, object> dicSetParams)
        {
            if (dicSets?.Count > 0)
            {
                dicSetParams = new Dictionary<string, object>();

                string strSets = string.Empty;
                foreach (KeyValuePair<DataType, object> pair in dicSets)
                {
                    string strFieldName = pair.Key.ToString();
                    string strParamFieldName = "@" + pair.Key.ToString();
                    dicSetParams[strParamFieldName] = pair.Value;
                    if (strSets.Length > 0)
                        strSets += ", ";
                    strSets += string.Concat(strFieldName, "=", strParamFieldName);
                }

                return strSets;
            }

            return "";
        }
    }
}
