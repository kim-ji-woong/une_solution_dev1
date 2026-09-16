using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Windows.Forms;

namespace DalMaker
{
    public class DBManager
    {
        private DataManager m_dataManager = null;

        public DBManager(string strDBName, string strWebServerURL)
        {
            m_dataManager = new DataManager(0, "127.0.0.1", strDBName, "sa", "9449966Ab");//test 
        }

        public List<DBTable> ReadTables()
        {
            ICollection<DBTable> tables = GetTableList();

            if (tables != null)
            {
                List<DBTable> _tables = new List<DBTable>();
                _tables.AddRange(tables);
                _tables.Sort();

                return _tables;
            }

            return null;
        }

        private Dictionary<string, string> GetIdentityFields()
        {
            string strErrorMessage;
            string strSQL = "select COLUMN_NAME, TABLE_NAME from INFORMATION_SCHEMA.COLUMNS where COLUMNPROPERTY(object_id(TABLE_SCHEMA + '.' + TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 order by TABLE_NAME";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            Dictionary<string, string> dicFields = new Dictionary<string, string>();

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strFieldName = null, strTableName = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string _fieldName = pair.Key.ToLower();

                    if (_fieldName == "column_name")
                        strFieldName = (string)pair.Value;
                    else if (_fieldName == "table_name")
                        strTableName = (string)pair.Value;
                }

                if (strFieldName != null && strTableName != null)
                    dicFields[strTableName + "." + strFieldName] = strTableName + "." + strFieldName;
            }

            return dicFields;
        }

        private ICollection<DBTable> GetTableList()
        {
            Dictionary<string, string> dicIdentityFields = GetIdentityFields();

            if (dicIdentityFields == null)
                return null;

            string strErrorMessage;
            string strSQL = "SELECT Table_Name, Column_Name, Is_Nullable, Data_Type from INFORMATION_SCHEMA.COLUMNS";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            DBTable table;
            Dictionary<string, DBTable> dicTables = new Dictionary<string, DBTable>();

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strFieldName = null, strTableName = null, isNullable = null, strDataType = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string _fieldName = pair.Key.ToLower();

                    if (_fieldName == "column_name")
                        strFieldName = (string)pair.Value;
                    else if (_fieldName == "table_name")
                        strTableName = (string)pair.Value;
                    else if (_fieldName == "is_nullable")
                        isNullable = (string)pair.Value;
                    else if (_fieldName == "data_type")
                        strDataType = (string)pair.Value;
                }

                if (strFieldName != null && strTableName != null && isNullable != null && strDataType != null)
                {
                    if (dicTables.TryGetValue(strTableName.ToLower(), out table) == false)
                    {
                        table = new DBTable();
                        table.TableName = strTableName;
                        dicTables[strTableName.ToLower()] = table;
                    }

                    DBField field = new DBField();

                    field.FieldName = strFieldName;
                    field.IsNullable = isNullable.ToLower() == "yes";
                    field.FieldTypeName = strDataType;
                    field.IsIdentity = dicIdentityFields.ContainsKey(strTableName + "." + strFieldName);

                    table.AddField(field);
                }
            }

            if (SetPrimaryKey(dicTables) == false)
                return null;

            return dicTables.Values;
        }

        private bool SetPrimaryKey(Dictionary<string, DBTable> dicTables)
        {
            string strErrorMessage;
            string strSQL = "Select Table_Name, COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where CONSTRAINT_NAME like 'PK_%'";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            DBTable table;

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strFieldName = null, strTableName = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string _fieldName = pair.Key.ToLower();

                    if (_fieldName == "column_name")
                        strFieldName = (string)pair.Value;
                    else if (_fieldName == "table_name")
                        strTableName = (string)pair.Value;
                }

                if (strFieldName != null && strTableName != null)
                {
                    if (dicTables.TryGetValue(strTableName.ToLower(), out table) == false)
                        continue;

                    DBField field = table.GetField(strFieldName);

                    if (field != null)
                        field.IsPrimaryKey = true;
                }
            }

            return true;
        }
    }
}
