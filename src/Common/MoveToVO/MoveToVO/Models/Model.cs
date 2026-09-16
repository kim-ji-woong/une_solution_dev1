using System.Collections.Generic;

namespace MoveToVO.Models
{
    class Model
    {
        // Key : Column Name
        // Value : Column Type
        private Dictionary<string, string> m_dicVariables = new Dictionary<string, string>();
        private string m_strTableName = "";
        private string m_strAutoIncreaseField = null;
        //private bool m_isAutoIncrease = false;
        private string m_strNamespace = "";
        private string m_strSmallNamespace = "";
        private string m_strClassName = "";
        private List<string> m_primaryKeys = new List<string>();

        // Key : Column Name
        // Value : Column Type
        public Dictionary<string, string> Variables
        {
            get { return m_dicVariables; }
        }

        public string TableName
        {
            get { return m_strTableName; }
            set { m_strTableName = value; }
        }

        public string AutoIncreaseField
        {
            get { return m_strAutoIncreaseField; }
            set { m_strAutoIncreaseField = value; }
        }
        /*public bool IsAutoIncrease
        {
            get { return m_isAutoIncrease; }
            set { m_isAutoIncrease = value; }
        }*/

        public string Namespace
        {
            get { return m_strNamespace; }
            set { m_strNamespace = value; }
        }

        public string SmallNamespace
        {
            get { return m_strSmallNamespace; }
            set { m_strSmallNamespace = value; }
        }

        public string ClassName
        {
            get { return m_strClassName; }
            set { m_strClassName = value; }
        }

        public void AddVariable(string strColumnName, string strColumnType)
        {
            m_dicVariables[strColumnName] = strColumnType;
        }

        public string GetAllFields(bool exceptAutoIncrease = true, bool isVariable = false, string strTag = null)
        {
            string strFields = null;

            foreach (KeyValuePair<string, string> pair in m_dicVariables)
            {
                string strField = GetField(pair.Key, isVariable, strTag);
                //string strField = isVariable ? string.Format("#{{{0}}}", pair.Key) : pair.Key;

                if (strFields == null)
                {
                    if (exceptAutoIncrease)
                    {
                        if (m_strAutoIncreaseField != pair.Key)
                            strFields = strField;
                    }
                    else
                        strFields = strField;
                }
                else
                {
                    if (exceptAutoIncrease)
                    {
                        if (m_strAutoIncreaseField != pair.Key)
                            strFields += ", " + strField;
                    }
                    else
                        strFields += ", " + strField;
                }
            }

            return strFields;
        }

        private string GetField(string strField, bool isVariable, string strTag)
        {
            if (isVariable)
            {
                if (strTag == null)
                    return string.Format("#{{{0}}}", strField);
                else
                    return string.Format("#{{{0}.{1}}}", strTag, strField);
            }

            if (strTag == null)
                return strField;

            return string.Format("{0}.{1}", strTag, strField);
        }

        public void AddPrimaryKey(string strField)
        {
            m_primaryKeys.Add(strField);
        }

        public string GetPrimaryKeys()
        {
            string strPrimaryKeys = null;

            foreach (string strField in m_primaryKeys)
            {
                if (strPrimaryKeys == null)
                    strPrimaryKeys = string.Format("\"{0}\"", strField);
                else
                    strPrimaryKeys += string.Format(", \"{0}\"", strField);
            }

            if (strPrimaryKeys == null)
                return "null";

            return "{ " + strPrimaryKeys + " }";
        }

        public string MakeSetString()
        {
            string str = null;

            foreach (KeyValuePair<string, string> pair in m_dicVariables)
            {
                if (m_primaryKeys.Contains(pair.Key))
                    continue;

                if (str == null)
                    str = string.Format("{0} = #{{{0}}}", pair.Key);
                else
                    str += string.Format(", {0} = #{{{0}}}", pair.Key);
            }

            return str;
        }

        public string GetPrimaryCondition()
        {
            string str = null;

            foreach (KeyValuePair<string, string> pair in m_dicVariables)
            {
                if (m_primaryKeys.Contains(pair.Key) == false)
                    continue;

                if (str == null)
                    str = string.Format("{0} = #{{{0}}}", pair.Key);
                else
                    str += string.Format(", {0} = #{{{0}}}", pair.Key);
            }

            return str;
        }
    }
}
