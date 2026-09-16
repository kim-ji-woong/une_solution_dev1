using System;
using System.Collections.Generic;
using dnsDBUtil;

namespace SVMSServer.DAL
{
    public class QueryManager
    {
        protected DirectDBManager m_dbManager = null;

        private bool SetCondition(Dictionary<string, string> dicColumnInfo, ref string strCondition, string strTableName, string strFieldName, object data, bool isNullable, bool isCondition)
        {
            string strAnd = isCondition ? " and " : ", ";
            strFieldName = strTableName + "." + strFieldName;

            if (isNullable)
            {
                if (data == null)
                {
                    string strNull = isCondition ? " is NULL" : " = NULL";

                    if (strCondition.Length == 0)
                        strCondition = strFieldName + strNull;
                    else
                        strCondition += strAnd + strFieldName + strNull;

                    return true;
                }
            }
            else if (data == null)
                return false;

            if ((data is int) || (data is long) || (data is float) || (data is double))
            {
                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = " + data.ToString();
                else
                    strCondition += strAnd + strFieldName + " = " + data.ToString();
            }
            else if (data is bool)
            {
                bool bData = (bool)data;
                string strData = bData ? "1" : "0";

                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = " + strData;
                else
                    strCondition += strAnd + strFieldName + " = " + strData;
            }
            else if (data is DateTime)
            {
                string strData = TimeString((DateTime)data);

                if (strCondition.Length == 0)
                    strCondition = strFieldName + " = '" + strData + "'";
                else
                    strCondition += strAnd + strFieldName + " = '" + strData + "'";
            }
            else if (data is string)
            {
                string strData = ((string)data).Replace("'", "''");
                string strEqual = isCondition && IsTextType(strFieldName, dicColumnInfo) ? " like '" : " = '";

                if (strCondition.Length == 0)
                    strCondition = strFieldName + strEqual + strData + "'";
                else
                    strCondition += strAnd + strFieldName + strEqual + strData + "'";
            }
            else
                return false;

            return true;
        }

        private bool IsTextType(string strFieldName, Dictionary<string, string> dicColumnInfo)
        {
            int nIndex = strFieldName.LastIndexOf('.');

            if (nIndex > 0)
                strFieldName = strFieldName.Substring(nIndex + 1);

            string strType;

            if (dicColumnInfo.TryGetValue(strFieldName.ToLower(), out strType))
            {
                if (strType == "text" || strType == "ntext")
                    return true;
            }

            return false;
        }

        private Dictionary<string, string> GetColumnInfoDictionaryToLower(string strTableName)
        {
            var info = m_dbManager.GetColumnInfoDictionary(strTableName);
            Dictionary<string, string> dicLower = new Dictionary<string, string>();

            foreach (KeyValuePair<string, string> pair in info)
            {
                dicLower[pair.Key.ToLower()] = pair.Value.ToLower();
            }

            return dicLower;
        }

        public static string TimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}",
                time.Year, time.Month, time.Day,
                time.Hour, time.Minute, time.Second);
        }

        protected delegate string GetFieldNameMethod<DataType>(DataType field, out bool isNullable);

        protected bool SetCondition<DataType>(ref string strCondition, Dictionary<DataType, object> dicConditions, GetFieldNameMethod<DataType> method, string strTableName, ref string strErrorMessage)
        {
            bool isNullable;

            if (dicConditions != null)
            {
                Dictionary<string, string> dicColumnInfo = GetColumnInfoDictionaryToLower(strTableName);

                foreach (KeyValuePair<DataType, object> pair in dicConditions)
                {
                    string strFieldName = method(pair.Key, out isNullable);

                    if (SetCondition(dicColumnInfo, ref strCondition, strTableName, strFieldName, pair.Value, isNullable, true) == false)
                    {
                        strErrorMessage = "잘못된 데이터 형식입니다.\r\n" + strTableName + "." + pair.Key.ToString();
                        return false;
                    }
                }
            }

            return true;
        }

        protected bool SetData<DataType>(ref string strSets, Dictionary<DataType, object> dicSets, GetFieldNameMethod<DataType> method, string strTableName, ref string strErrorMessage)
        {
            bool isNullable;

            if (dicSets != null)
            {
                Dictionary<string, string> dicColumnInfo = GetColumnInfoDictionaryToLower(strTableName);

                foreach (KeyValuePair<DataType, object> pair in dicSets)
                {
                    string strFieldName = method(pair.Key, out isNullable);

                    if (SetCondition(dicColumnInfo, ref strSets, strTableName, strFieldName, pair.Value, isNullable, false) == false)
                    {
                        strErrorMessage = "잘못된 데이터 형식입니다.\r\n" + strTableName + "." + pair.Key.ToString();
                        return false;
                    }
                }
            }

            return true;
        }

        protected string ListToString<DataType>(List<DataType> datas)
        {
            string str = "";

            foreach (DataType data in datas)
            {
                if (str.Length == 0)
                    str += data.ToString();
                else
                    str += ", " + data.ToString();
            }

            return str;
        }

        protected List<int> StringToIntList(string strData)
        {
            if (strData == null)
                return null;

            List<int> datas = new List<int>();

            if (strData.Length == 0)
                return datas;

            int data;
            string[] tokens = strData.Split(',');

            foreach (string strToken in tokens)
            {
                if (int.TryParse(strToken.Trim(), out data))
                    datas.Add(data);
            }

            return datas;
        }

        protected string CheckQueryString(string str)
        {
            if (str == null)
                return str;

            return str.Replace("'", "''");
        }


        protected string GetFieldNames<EnumType>(out int nFieldCount)
        {
            nFieldCount = 0;
            string strFields = "";

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (strFields.Length == 0)
                    strFields = type.ToString();
                else
                    strFields += ", " + type.ToString();

                nFieldCount++;
            }

            return strFields;
        }

        protected string RemoveField(string strFields, string strRemoveField)
        {
            if (strFields.EndsWith(strRemoveField))
            {
                return strFields.Substring(0, strFields.Length - strRemoveField.Length - 2);
            }

            string strTarget = strRemoveField + ",";
            int index = strFields.IndexOf(strTarget);

            if (index >= 0)
            {
                return strFields.Remove(index, strTarget.Length + 1);
            }

            return strFields;
        }

        protected string GetFieldNames<EnumType>(string strTableName, out int nFieldCount)
        {
            string strFields = "";
            nFieldCount = 0;

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (strFields.Length == 0)
                    strFields = strTableName + "." + type.ToString();
                else
                    strFields += ", " + strTableName + "." + type.ToString();

                nFieldCount++;
            }

            return strFields;
        }

        protected string GetFieldNames<EnumType>()
        {
            int nFieldCount;
            return GetFieldNames<EnumType>(out nFieldCount);
        }

        protected string GetFieldValues<EnumType>(Dictionary<EnumType, object> dicFieldDatas)
        {
            string strValues = "";
            object data;

            foreach (EnumType type in Enum.GetValues(typeof(EnumType)))
            {
                if (dicFieldDatas.TryGetValue(type, out data) == false)
                    continue;

                string strValue = GetValueString(data);

                if (strValues.Length == 0)
                    strValues = strValue;
                else
                    strValues += ", " + strValue;
            }

            return strValues;
        }

        private string GetValueString(object data)
        {
            if (data != null)
            {
                if ((data is int) || (data is long) || (data is float) || (data is double))
                {
                    return data.ToString();
                }
                else if (data is bool)
                {
                    bool bData = (bool)data;
                    return bData ? "1" : "0";
                }
                else if (data is DateTime)
                {
                    string strData = "'" + TimeString((DateTime)data) + "'";
                    return strData;
                }
                else if (data is string)
                {
                    string strData = "'" + ((string)data).Replace("'", "''") + "'";
                    return strData;
                }
            }

            return "NULL";
        }

        protected void SetQuery(ref string strSQL, string strCondition, string strAdditionalConditions)
        {
            string strOrderBy = "";

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                {
                    string strFirst = strAdditionalConditions.Trim().ToLower();
                    if (strFirst.StartsWith("order by") || strFirst.StartsWith("inner"))
                        strOrderBy = strAdditionalConditions;
                    else
                        strCondition += " and " + strAdditionalConditions;
                }
                else
                    strCondition = strAdditionalConditions;
            }

            if (strCondition.Length > 0)
            {
                string strFirst = strCondition.Trim().ToLower();
                if (strFirst.StartsWith("order by") || strFirst.StartsWith("inner"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;

                if (strOrderBy.Length > 0)
                    strSQL += " " + strOrderBy;
            }
        }
    }
}
