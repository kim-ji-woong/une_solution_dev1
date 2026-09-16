using System;
using System.Collections.Generic;

namespace DalMaker
{
    public class DBTable : IComparable
    {
        private string m_strTableName = "";
        private Dictionary<string, DBField> m_dicDBField = new Dictionary<string, DBField>();
        private List<DBField> m_fields = new List<DBField>();

        public string TableName
        {
            get { return m_strTableName; }
            set { m_strTableName = value; }
        }

        public int GetFieldCount()
        {
            return m_fields.Count;
        }

        public List<DBField> GetNullableFields()
        {
            List<DBField> fields = new List<DBField>();

            foreach (DBField field in m_fields)
            {
                if (field.IsNullable)
                    fields.Add(field);
            }

            return fields;
        }

        public DBField GetField(int index)
        {
            if (index >= 0 && index < m_fields.Count)
                return m_fields[index];

            return null;
        }

        public void AddField(DBField field)
        {
            m_dicDBField[field.FieldName.ToLower()] = field;
            m_fields.Add(field);
        }

        public DBField GetField(string strFieldName)
        {
            DBField field;

            if (m_dicDBField.TryGetValue(strFieldName.ToLower(), out field))
                return field;

            return null;
        }

        public string GetFieldNames()
        {
            int nFieldCount = GetFieldCount();
            string strFieldNames = "";

            for (int i=0;i<nFieldCount;i++)
            {
                DBField field = GetField(i);

                if (field == null)
                    continue;

                if (strFieldNames.Length == 0)
                    strFieldNames = field.FieldName;
                else
                    strFieldNames += ", " + field.FieldName;
            }

            return strFieldNames;
        }

        public string GetNoIdentityFieldNames()
        {
            int nFieldCount = GetFieldCount();
            string strFieldNames = "";

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = GetField(i);

                if (field == null || field.IsIdentity)
                    continue;

                if (strFieldNames.Length == 0)
                    strFieldNames = field.FieldName;
                else
                    strFieldNames += ", " + field.FieldName;
            }

            return strFieldNames;
        }

        public string GetPrimaryFieldList()
        {
            int nFieldCount = GetFieldCount();
            string strFields = "";

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = GetField(i);

                if (field == null || field.IsPrimaryKey == false)
                    continue;

                if (strFields.Length == 0)
                    strFields = field.GetParameterString();
                else
                    strFields += ", " + field.GetParameterString();
            }

            return strFields;
        }

        public List<DBField> GetPrimaryFields()
        {
            int nFieldCount = GetFieldCount();
            List<DBField> primaryFields = new List<DBField>();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = GetField(i);

                if (field == null || field.IsPrimaryKey == false)
                    continue;

                primaryFields.Add(field);
            }

            return primaryFields;
        }

        public int CompareTo(object obj)
        {
            if (obj == null)
                return 1;

            DBTable table2 = (DBTable)obj;
            return string.Compare(this.m_strTableName, table2.m_strTableName);
        }
    }
}
