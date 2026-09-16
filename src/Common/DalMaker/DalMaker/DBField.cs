namespace DalMaker
{
    public class DBField
    {
        public enum FieldType { Integer = 0, Long, String, Boolean, DateTime, Double };

        private string m_strFieldName = "";
        private bool m_isNullable = false;
        private string m_strFieldTypeName = "";
        private FieldType m_fieldType = FieldType.Integer;
        private bool m_isPrimaryKey = false;
        // 자동증가 여부
        private bool m_isIdentity = false;

        public string FieldName
        {
            get { return m_strFieldName; }
            set { m_strFieldName = value; }
        }

        public bool IsNullable
        {
            get { return m_isNullable; }
            set { m_isNullable = value; }
        }

        public string FieldTypeName
        {
            get { return m_strFieldTypeName; }
            set
            {
                m_strFieldTypeName = value;
                SetFieldType();
            }
        }

        public FieldType DataType
        {
            get { return m_fieldType; }
            set { m_fieldType = value; }
        }

        public bool IsPrimaryKey
        {
            get { return m_isPrimaryKey; }
            set { m_isPrimaryKey = value; }
        }

        // 자동증가 여부
        public bool IsIdentity
        {
            get { return m_isIdentity; }
            set { m_isIdentity = value; }
        }

        public string GetPropertyLine()
        {
            string strProperty = GetTypeString();
            strProperty += " " + m_strFieldName + " { get; set; }";
            return strProperty;
        }

        public string GetParameterString()
        {
            string strType = GetTypeString();

            int len = m_strFieldName.Length;

            if (len <= 2)
                return strType + " " + m_strFieldName.ToLower();

            string strFirst = m_strFieldName.Substring(0, 1);
            return strType + " " + strFirst.ToLower() + m_strFieldName.Substring(1);
        }

        private string GetTypeString()
        {
            string strType = "";

            if (m_fieldType == FieldType.Integer)
                strType = "int";
            else if (m_fieldType == FieldType.Long)
                strType = "long";
            else if (m_fieldType == FieldType.String)
                strType = "string";
            else if (m_fieldType == FieldType.Boolean)
                strType = "bool";
            else if (m_fieldType == FieldType.Double)
                strType = "double";
            else if (m_fieldType == FieldType.DateTime)
                strType = "DateTime";

            if (m_isNullable)
            {
                if (m_fieldType == FieldType.String)
                    strType += "/* nullable */";
                else
                    strType += "?";
            }

            return strType;
        }

        private void SetFieldType()
        {
            string strFieldTypeName = m_strFieldTypeName.ToLower();

            if (strFieldTypeName == "bigint")
                m_fieldType = FieldType.Long;
            else if (strFieldTypeName.Contains("int"))
                m_fieldType = FieldType.Integer;
            else if (strFieldTypeName.Contains("decimal") ||
                strFieldTypeName == "float" ||
                strFieldTypeName == "real")
                m_fieldType = FieldType.Double;
            else if (strFieldTypeName == "bit")
                m_fieldType = FieldType.Boolean;
            else if (strFieldTypeName.Contains("char") ||
                strFieldTypeName.Contains("text"))
                m_fieldType = FieldType.String;
            else if (strFieldTypeName.Contains("date") ||
                strFieldTypeName.Contains("time"))
                m_fieldType = FieldType.DateTime;
        }
    }
}
