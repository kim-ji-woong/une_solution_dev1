using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DalMaker
{
    public class DALManager
    {
        public static bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            string strFolderPath = Directory.GetCurrentDirectory() + "\\DAL";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (CodeManager.ClearSubDirectories(strFolderPath) == false)
                return false;

            MakeCreate(strNamespace, tables, dicClassNames, strFolderPath);
            MakeSelect(strNamespace, tables, dicClassNames, strFolderPath);
            MakeDelete(strNamespace, tables, dicClassNames, strFolderPath);
            MakeUpdate(strNamespace, tables, dicClassNames, strFolderPath);
            return true;
        }

        private static bool MakeUpdate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\UpdateManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System;");
            writer.WriteLine("using System.Collections;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine("using dnsDBUtil;");
            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class UpdateManager : QueryManager, IUpdate");
            writer.WriteLine("\t{");
            writer.WriteLine("\t\tprivate DataManager m_dataManager = null;");
            writer.WriteLine();

            writer.WriteLine("\t\tpublic UpdateManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dataManager = dataManager;");
            writer.WriteLine("\t\t\tm_dbManager = m_dataManager.GetDBManager() as WebDBManager;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            MakeUpdateFromCondition(writer);

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];

                MakeUpdateObject(writer, table, strClassName);
                MakeUpdateCondition(writer, table, strClassName);
                writer.WriteLine();
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeUpdateCondition(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic bool Update{0}(Dictionary<{1}.Fields, object> dicSets, Dictionary<{1}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)", table.TableName, strClassName));
            writer.WriteLine("\t\t{");

            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\tstring strCondition = \"\";");
            writer.WriteLine("\t\t\tstring strSets = \"\";");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tif (SetData<{0}.Fields>(ref strSets, dicSets, {0}.GetFieldName, {0}.TableName, ref strErrorMessage) == false)", strClassName));
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine(string.Format("\t\t\tif (SetCondition<{0}.Fields>(ref strCondition, dicConditions, {0}.GetFieldName, {0}.TableName, ref strErrorMessage) == false)", strClassName));
            writer.WriteLine("\t\t\t\treturn false;");

            writer.WriteLine();
            writer.WriteLine(string.Format("\t\t\treturn UpdateFromCondition({0}.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);", strClassName));
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeUpdateObject(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic bool Update{0}({1} obj, out string strErrorMessage)", table.TableName, strClassName));
            writer.WriteLine("\t\t{");

            writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicSets = new Dictionary<{0}.Fields, object>();", strClassName));

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey == false)
                    writer.WriteLine(string.Format("\t\t\tdicSets[{0}.Fields.{1}] = obj.{1};", strClassName, field.FieldName));
            }

            writer.WriteLine();
            writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicConditions = new Dictionary<{0}.Fields, object>();", strClassName));

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey)
                    writer.WriteLine(string.Format("\t\t\tdicConditions[{0}.Fields.{1}] = obj.{1};", strClassName, field.FieldName));
            }

            writer.WriteLine();
            writer.WriteLine(string.Format("\t\t\treturn Update{0}(dicSets, dicConditions, null, out strErrorMessage);", table.TableName));
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeUpdateFromCondition(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (strAdditionalConditions != null && strAdditionalConditions.Length > 0)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (strCondition.Length > 0)");
            writer.WriteLine("\t\t\t\t\tstrCondition += \" and \" + strAdditionalConditions;");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tstrCondition = strAdditionalConditions;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"Update {0} set {1} where {2}\", strTableName, strSets, strCondition);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (m_dbManager.GetResultData(strSQL) == null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static bool MakeDelete(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\DeleteManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System;");
            writer.WriteLine("using System.Collections;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine("using dnsDBUtil;");
            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class DeleteManager : QueryManager, IDelete");
            writer.WriteLine("\t{");
            writer.WriteLine("\t\tprivate DataManager m_dataManager = null;");
            writer.WriteLine();

            writer.WriteLine("\t\tpublic DeleteManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dataManager = dataManager;");
            writer.WriteLine("\t\t\tm_dbManager = m_dataManager.GetDBManager() as WebDBManager;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            MakeDeleteFromID(writer);
            MakeDeleteFromCondition(writer);

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                string strPrimaryFields = table.GetPrimaryFieldList();

                if (strPrimaryFields.Length > 0)
                    MakeDeletePrimary(writer, table, strClassName, strPrimaryFields);

                MakeDeleteCondition(writer, table, strClassName);
                writer.WriteLine();
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeDeleteCondition(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic bool Delete{0}(Dictionary<{1}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)", table.TableName, strClassName));
            writer.WriteLine("\t\t{");

            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\tstring strCondition = \"\";");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tif (SetCondition<{0}.Fields>(ref strCondition, dicConditions, {0}.GetFieldName, {0}.TableName, ref strErrorMessage) == false)", strClassName));
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("");
            writer.WriteLine(string.Format("\t\t\treturn DeleteFromCondition({0}.TableName, strCondition, strAdditionalConditions, out strErrorMessage);", strClassName));
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeDeletePrimary(StreamWriter writer, DBTable table, string strClassName, string strPrimaryFields)
        {
            writer.WriteLine(string.Format("\t\tpublic bool Delete{0}({1}, out string strErrorMessage)", table.TableName, strPrimaryFields));
            writer.WriteLine("\t\t{");

            List<DBField> primaryFields = table.GetPrimaryFields();

            if (primaryFields.Count == 1 && primaryFields[0].DataType == DBField.FieldType.Integer && primaryFields[0].FieldName.ToLower() == "id")
            {
                writer.WriteLine(string.Format("\t\t\treturn DeleteFromID({0}.TableName, id, out strErrorMessage);", strClassName));
            }
            else
            {
                writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicConditions = new Dictionary<{0}.Fields, object>();", strClassName));

                foreach (DBField field in primaryFields)
                {
                    string strParam = field.GetParameterString();
                    string[] tokens = strParam.Split(' ');
                    string strVariable = tokens[1].Trim();

                    writer.WriteLine(string.Format("\t\t\tdicConditions[{0}.Fields.{1}] = {2};", strClassName, field.FieldName, strVariable));
                }

                writer.WriteLine();
                writer.WriteLine(string.Format("\t\t\treturn Delete{0}(dicConditions, null, out strErrorMessage);", table.TableName));
            }

            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeDeleteFromCondition(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate bool DeleteFromCondition(string strTableName, string strCondition, string strAdditionalConditions, out string strErrorMessage)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (strAdditionalConditions != null && strAdditionalConditions.Length > 0)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (strCondition.Length > 0)");
            writer.WriteLine("\t\t\t\t\tstrCondition += \" And \" + strAdditionalConditions;");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tstrCondition = strAdditionalConditions;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"Delete from {0}\", strTableName);");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (strCondition.Length > 0)");
            writer.WriteLine("\t\t\t\tstrSQL += \" Where \" + strCondition;");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (m_dbManager.GetResultData(strSQL) == null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeDeleteFromID(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate bool DeleteFromID(string strTableName, int nID, out string strErrorMessage)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"Delete from {0} where ID = {1}\", strTableName, nID);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (m_dbManager.GetResultData(strSQL) == null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static bool MakeSelect(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\SelectManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System;");
            writer.WriteLine("using System.Collections;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine("using dnsDBUtil;");
            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class SelectManager : QueryManager, ISelect");
            writer.WriteLine("\t{");
            writer.WriteLine("\t\tprivate DataManager m_dataManager = null;");
            writer.WriteLine();

            writer.WriteLine("\t\tpublic SelectManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dataManager = dataManager;");
            writer.WriteLine("\t\t\tm_dbManager = m_dataManager.GetDBManager() as WebDBManager;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            MakeSetQuery(writer);
            MakeGetDateTimeString(writer);

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                string strPrimaryFields = table.GetPrimaryFieldList();

                if (strPrimaryFields.Length > 0)
                    MakePrimarySelect(writer, table, strClassName, strPrimaryFields);

                MakeSelectCondition(writer, table, strClassName);
                MakeSelectConditionDetail(writer, table, strClassName);
                MakeRead(writer, table, strClassName);
                writer.WriteLine();
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeSetQuery(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate void SetQuery(ref string strSQL, string strCondition, string strAdditionalConditions)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstring strOrderBy = \"\";");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (strAdditionalConditions != null && strAdditionalConditions.Length > 0)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (strCondition.Length > 0)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tif (strAdditionalConditions.Trim().ToLower().StartsWith(\"order by\"))");
            writer.WriteLine("\t\t\t\t\t\tstrOrderBy = strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\t\tstrCondition += \" and \" + strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tstrCondition = strAdditionalConditions;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeGetDateTimeString(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate string GetDateTimeString(DateTime time)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn string.Format(\"{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}\", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeRead(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tprivate {0} Read{1}(ArrayList arrResult, int index, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine(string.Format("\t\t\t{0} model = new {0}();", strClassName));
            writer.WriteLine("\t\t\tbool isNullable;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tforeach ({0}.Fields field in {0}.Fields.GetValues(typeof({0}.Fields)))", strClassName));
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\tstring strFieldName = {0}.GetFieldName(field, out isNullable);", strClassName));
            writer.WriteLine();

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (i == 0)
                    writer.WriteLine(string.Format("\t\t\t\tif (field == {0}.Fields.{1})", strClassName, field.FieldName));
                else
                    writer.WriteLine(string.Format("\t\t\t\telse if (field == {0}.Fields.{1})", strClassName, field.FieldName));

                writer.WriteLine("\t\t\t\t{");

                if (field.DataType == DBField.FieldType.Boolean)
                {
                    writer.WriteLine("\t\t\t\t\tVariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (data == null)");

                    if (field.IsNullable)
                    {
                        writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    }
                    else
                    {
                        writer.WriteLine("\t\t\t\t\t{");
                        writer.WriteLine("\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                        writer.WriteLine("\t\t\t\t\t\treturn null;");
                        writer.WriteLine("\t\t\t\t\t}");
                    }

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = data.Data == 1;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t}");
                }
                else if (field.DataType == DBField.FieldType.DateTime)
                {
                    writer.WriteLine("\t\t\t\t\tVariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (data == null)");

                    if (field.IsNullable)
                    {
                        writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    }
                    else
                    {
                        writer.WriteLine("\t\t\t\t\t{");
                        writer.WriteLine("\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                        writer.WriteLine("\t\t\t\t\t\treturn null;");
                        writer.WriteLine("\t\t\t\t\t}");
                    }

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = data.Data;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t}");
                }
                else if (field.DataType == DBField.FieldType.Double)
                {
                    writer.WriteLine("\t\t\t\t\tVariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (data == null)");

                    if (field.IsNullable)
                    {
                        writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    }
                    else
                    {
                        writer.WriteLine("\t\t\t\t\t{");
                        writer.WriteLine("\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                        writer.WriteLine("\t\t\t\t\t\treturn null;");
                        writer.WriteLine("\t\t\t\t\t}");
                    }

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = data.Data;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t}");
                }
                else if (field.DataType == DBField.FieldType.Integer)
                {
                    writer.WriteLine("\t\t\t\t\tVariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (data == null)");

                    if (field.IsNullable)
                    {
                        writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    }
                    else
                    {
                        writer.WriteLine("\t\t\t\t\t{");
                        writer.WriteLine("\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                        writer.WriteLine("\t\t\t\t\t\treturn null;");
                        writer.WriteLine("\t\t\t\t\t}");
                    }

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = data.Data;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t}");
                }
                else if (field.DataType == DBField.FieldType.Long)
                {
                    writer.WriteLine("\t\t\t\t\tstring strData = WebDBManager.GetStringField(arrResult[index]);");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (strData == null)");

                    if (field.IsNullable)
                    {
                        writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    }
                    else
                    {
                        writer.WriteLine("\t\t\t\t\t{");
                        writer.WriteLine("\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                        writer.WriteLine("\t\t\t\t\t\treturn null;");
                        writer.WriteLine("\t\t\t\t\t}");
                    }

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine("\t\t\t\t\t\tlong data;");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\t\tif (long.TryParse(strData, out data))");
                    writer.WriteLine(string.Format("\t\t\t\t\t\t\tmodel.{0} = data;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t\t{");
                    writer.WriteLine("\t\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                    writer.WriteLine("\t\t\t\t\t\t\treturn null;");
                    writer.WriteLine("\t\t\t\t\t\t}");
                    writer.WriteLine("\t\t\t\t\t}");
                }
                else if (field.DataType == DBField.FieldType.String)
                {
                    writer.WriteLine("\t\t\t\t\tstring data = WebDBManager.GetStringField(arrResult[index]);");
                    writer.WriteLine();

                    writer.WriteLine("\t\t\t\t\tif (data == null)");

                    writer.WriteLine("\t\t\t\t\t{");

                    writer.WriteLine("\t\t\t\t\t\tif (isNullable)");
                    writer.WriteLine(string.Format("\t\t\t\t\t\t\tmodel.{0} = null;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t\t{");
                    writer.WriteLine("\t\t\t\t\t\t\tstrErrorMessage = string.Format(\"{0}는 null이 될수 없습니다.\", strFieldName);");
                    writer.WriteLine("\t\t\t\t\t\t\treturn null;");
                    writer.WriteLine("\t\t\t\t\t\t}");

                    writer.WriteLine("\t\t\t\t\t}");

                    writer.WriteLine("\t\t\t\t\telse");
                    writer.WriteLine("\t\t\t\t\t{");
                    writer.WriteLine(string.Format("\t\t\t\t\t\tmodel.{0} = data;", field.FieldName));
                    writer.WriteLine("\t\t\t\t\t}");
                }
                
                writer.WriteLine("\t\t\t\t}");
            }

            writer.WriteLine();
            writer.WriteLine("\t\t\t\tindex++;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn model;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeSelectConditionDetail(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic List<{0}> Select{1}s(Dictionary<{0}.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\tint nFieldCount;");
            writer.WriteLine();

            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"select {0} from {1}\", " + string.Format("GetFieldNames<{0}.Fields>(out nFieldCount), {0}.TableName);", strClassName));
            writer.WriteLine();
            writer.WriteLine("\t\t\tstring strCondition = \"\";");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tif (SetCondition<{0}.Fields>(ref strCondition, dicConditions, {0}.GetFieldName, {0}.TableName, ref strErrorMessage) == false)", strClassName));
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine();

            writer.WriteLine("\t\t\tSetQuery(ref strSQL, strCondition, strAdditionalConditions);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (arrResult == null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tint nResultCount = arrResult.Count;");
            writer.WriteLine(string.Format("\t\t\tList<{0}> datas = new List<{0}>();", strClassName));
            writer.WriteLine();

            writer.WriteLine("\t\t\tfor (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\t{0} model = Read{1}(arrResult, i, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tif (model == null)");
            writer.WriteLine("\t\t\t\t\treturn null;");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tdatas.Add(model);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn datas;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeSelectCondition(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic List<{0}> Select{1}s(Dictionary<{0}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine(string.Format("\t\t\treturn Select{0}s(dicConditions, strAdditionalConditions, null, out strErrorMessage);", table.TableName));
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakePrimarySelect(StreamWriter writer, DBTable table, string strClassName, string strPrimaryFields)
        {
            writer.WriteLine(string.Format("\t\tpublic {0} Select{1}({2}, out string strErrorMessage)", strClassName, table.TableName, strPrimaryFields));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine("\t\t\tint nFieldCount;");
            writer.WriteLine();

            writer.Write("\t\t\tstring strSQL = string.Format(\"select {0} from {1} where ");

            List<DBField> primaryFields = table.GetPrimaryFields();
            int nPrimaryFieldCount = primaryFields.Count;

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];

                if (field.DataType == DBField.FieldType.String || field.DataType == DBField.FieldType.DateTime)
                {
                    if (i == 0)
                        writer.Write(field.FieldName + " = '{" + (i + 2).ToString() + "}' ");
                    else
                        writer.Write("and " + field.FieldName + " = '{" + (i + 2).ToString() + "}' ");
                }
                else
                {
                    if (i == 0)
                        writer.Write(field.FieldName + " = {" + (i + 2).ToString() + "} ");
                    else
                        writer.Write("and " + field.FieldName + " = {" + (i + 2).ToString() + "} ");
                }
            }

            writer.WriteLine("\", ");
            writer.WriteLine(string.Format("\t\t\t\tGetFieldNames<{0}.Fields>(out nFieldCount), {0}.TableName", strClassName));

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];

                string strParam = field.GetParameterString();
                string[] tokens = strParam.Split(' ');
                string strVariable = tokens[1].Trim();

                if (field.DataType == DBField.FieldType.DateTime)
                {
                    if (i == nPrimaryFieldCount - 1)
                        writer.WriteLine("\t\t\t\t, GetDateTimeString(" + strVariable + "));");
                    else
                        writer.WriteLine("\t\t\t\t, GetDateTimeString(" + strVariable + ")");
                }
                else
                {
                    if (i == nPrimaryFieldCount - 1)
                        writer.WriteLine("\t\t\t\t, " + strVariable + ");");
                    else
                        writer.WriteLine("\t\t\t\t, " + strVariable);
                }
            }

            writer.WriteLine();
            writer.WriteLine("\t\t\tArrayList arrResult = m_dbManager.GetResultData(strSQL);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (arrResult != null && arrResult.Count >= nFieldCount)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\t{0} model = Read{1}(arrResult, 0, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tif (model == null)");
            writer.WriteLine("\t\t\t\t\treturn null;");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn model;");
            writer.WriteLine("\t\t\t}");

            writer.WriteLine("\t\t\telse");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static bool MakeCreate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\CreateManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System;");
            writer.WriteLine("using System.Collections;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine("using dnsDBUtil;");
            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class CreateManager : QueryManager, ICreate");
            writer.WriteLine("\t{");
            writer.WriteLine("\t\tprivate DataManager m_dataManager = null;");
            writer.WriteLine("\t\tprivate const int FindCountLimit = 100;");
            writer.WriteLine();

            writer.WriteLine("\t\tpublic CreateManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dataManager = dataManager;");
            writer.WriteLine("\t\t\tm_dbManager = m_dataManager.GetDBManager() as WebDBManager;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\tprivate string GetInsertErrorMessage(string tableName)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn string.Format(\"{0} 테이블의 데이터 삽입에 실패하였습니다.\", tableName);");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\tprivate bool EqualsValue(object oldObj, object newObj)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (oldObj == null && newObj == null)");
            writer.WriteLine("\t\t\t\treturn true;");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (oldObj is DateTime)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tDateTime dt1, dt2;");
            writer.WriteLine("\t\t\t\tif (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tif (Convert.ToDateTime(oldObj).ToString(\"yyyyMMddHHmmss\") == Convert.ToDateTime(newObj).ToString(\"yyyyMMddHHmmss\"))");
            writer.WriteLine("\t\t\t\t\t\treturn true;");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tif (oldObj.ToString().Trim() == newObj.ToString().Trim())");
            writer.WriteLine("\t\t\t\t\t\treturn true;");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn false;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];

                List<DBField> primaryFields = table.GetPrimaryFields();
                int nPrimaryFieldCount = primaryFields.Count;

                if (nPrimaryFieldCount == 0)
                    MakeNoPrimaryCreate(writer, table, strClassName);
                else if (nPrimaryFieldCount == 1)
                {
                    MakeOnePrimaryCreate(writer, table, strClassName, primaryFields[0]);
                    MakeOnePrimarySame(writer, table, strClassName);
                    MakeOnePrimaryGet(writer, table, strClassName, primaryFields[0]);
                }
                else
                {
                    MakeMultiPrimaryCreate(writer, table, strClassName, primaryFields);
                    MakeMultiPrimarySame(writer, table, strClassName);
                    MakeMultiPrimaryGet(writer, table, strClassName, primaryFields);
                }
            }

            MakeIsSameTime(writer);
            MakeIsSameTime2(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeIsSameTime(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate bool IsSameTime(DateTime? time1, DateTime? time2)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (time1 == null && time2 == null)");
            writer.WriteLine("\t\t\t\treturn true;");
            writer.WriteLine("\t\t\telse if (time1 == null || time2 == null)");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn IsSameTime2((DateTime)time1, (DateTime)time2);");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeIsSameTime2(StreamWriter writer)
        {
            writer.WriteLine("\t\tprivate bool IsSameTime2(DateTime time1, DateTime time2)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (time1.Year == time2.Year &&");
            writer.WriteLine("\t\t\t\ttime1.Month == time2.Month &&");
            writer.WriteLine("\t\t\t\ttime1.Day == time2.Day &&");
            writer.WriteLine("\t\t\t\ttime1.Hour == time2.Hour &&");
            writer.WriteLine("\t\t\t\ttime1.Minute == time2.Minute &&");
            writer.WriteLine("\t\t\t\ttime1.Second == time2.Second)");
            writer.WriteLine("\t\t\t\treturn true;");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn false;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeOnePrimaryGet(StreamWriter writer, DBTable table, string strClassName, DBField primaryField)
        {
            string strParam = primaryField.GetParameterString();
            string[] tokens = strParam.Split(' ');
            string strVariable = tokens[1].Trim();

            writer.WriteLine(string.Format("\t\tprivate {0} Get{1}({0} obj, {2}, int nCount, int nLimit, out string strErrorMessage)", strClassName, table.TableName, strParam));
            writer.WriteLine("\t\t{");

            writer.WriteLine("\t\t\tbool isNullable;");
            writer.WriteLine("\t\t\tstring strCondition = string.Format(\"{0} < {1} order by {0} desc\", " + string.Format("{0}.GetFieldName({0}.Fields.{1}, out isNullable), {2});", strClassName, primaryField.FieldName, strVariable));
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tList<{0}> datas = m_dataManager.GetSelectManager().Select{1}s(null, strCondition, nCount, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (datas == null)");
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tforeach ({0} data in datas)", strClassName));
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\tif (IsSame{0}(data, obj))", table.TableName));
            writer.WriteLine("\t\t\t\t\treturn data;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\t\tif (data.{0} < {1})", primaryField.FieldName, strVariable));
            writer.WriteLine(string.Format("\t\t\t\t\t{0} = data.{1};", strVariable, primaryField.FieldName));
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (nCount < nLimit)");
            writer.WriteLine(string.Format("\t\t\t\treturn Get{0}(obj, {1}, nCount * 2, nLimit, out strErrorMessage);", table.TableName, strVariable));
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tstrErrorMessage = GetInsertErrorMessage({0}.TableName);", strClassName));
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeMultiPrimaryGet(StreamWriter writer, DBTable table, string strClassName, List<DBField> primaryFields)
        {
            writer.Write(string.Format("\t\tprivate {0} Get{1}({0} obj", strClassName, table.TableName));

            foreach (DBField field in primaryFields)
            {
                string strParam = field.GetParameterString();
                writer.Write(", " + strParam);
            }

            writer.WriteLine(", int nCount, int nLimit, out string strErrorMessage)");
            writer.WriteLine("\t\t{");

            writer.WriteLine("\t\t\tbool isNullable;");
            writer.Write("\t\t\tstring strCondition = string.Format(\"");

            int nPrimaryFieldCount = primaryFields.Count;

            for (int i=0;i<nPrimaryFieldCount;i++)
            {
                if (i > 0)
                    writer.Write("and ");

                if (i < nPrimaryFieldCount - 1)
                    writer.Write("{" + (i * 2).ToString() + "} = {" + (i * 2 + 1).ToString() + "} ");
                else
                    writer.Write("{" + (i * 2).ToString() + "} < {" + (i * 2 + 1).ToString() + "} ");
            }

            writer.Write("order by ");

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                if (i == 0)
                    writer.Write("{" + (i * 2).ToString() + "} desc");
                else
                    writer.Write(", {" + (i * 2).ToString() + "} desc");
            }

            writer.WriteLine("\",");

            DBField lastPrimaryField = primaryFields[nPrimaryFieldCount - 1];
            string strLastVariable = "";

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];
                string strParam = field.GetParameterString();
                string[] tokens = strParam.Split(' ');
                string strVariable = tokens[1].Trim();

                writer.Write(string.Format("\t\t\t\t{0}.GetFieldName({0}.Fields.{1}, out isNullable), {2}", strClassName, field.FieldName, strVariable));

                if (i == nPrimaryFieldCount - 1)
                    writer.WriteLine(");");
                else
                    writer.WriteLine(",");

                lastPrimaryField = field;
                strLastVariable = strVariable;
            }

            writer.WriteLine(string.Format("\t\t\tList<{0}> datas = m_dataManager.GetSelectManager().Select{1}s(null, strCondition, nCount, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (datas == null)");
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tforeach ({0} data in datas)", strClassName));
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\tif (IsSame{0}(data, obj))", table.TableName));
            writer.WriteLine("\t\t\t\t\treturn data;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\t\tif (data.{0} < {1})", lastPrimaryField.FieldName, strLastVariable));
            writer.WriteLine(string.Format("\t\t\t\t\t{0} = data.{1};", strLastVariable, lastPrimaryField.FieldName));
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (nCount < nLimit)");
            writer.Write(string.Format("\t\t\t\treturn Get{0}(obj", table.TableName));

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];
                string strParam = field.GetParameterString();
                string[] tokens = strParam.Split(' ');
                string strVariable = tokens[1].Trim();

                writer.Write(", " + strVariable);
            }

            writer.WriteLine(", nCount * 2, nLimit, out strErrorMessage);");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\tstrErrorMessage = GetInsertErrorMessage({0}.TableName);", strClassName));
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeOnePrimarySame(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tprivate bool IsSame{0}({1} oldObject, {1} newObject)", table.TableName, strClassName));
            writer.WriteLine("\t\t{");

            int nFieldCount = table.GetFieldCount();
            writer.Write("\t\t\tif (");

            bool isFirst = true;

            for (int i=0;i<nFieldCount;i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey)
                    continue;

                if (isFirst)
                    isFirst = false;
                else
                    writer.Write("\t\t\t\t");

                if (field.DataType == DBField.FieldType.DateTime)
                {
                    if (field.IsNullable)
                        writer.Write(string.Format("IsSameTime(oldObject.{0}, newObject.{0})", field.FieldName));
                    else
                        writer.Write(string.Format("IsSameTime2(oldObject.{0}, newObject.{0})", field.FieldName));
                }
                else
                    writer.Write(string.Format("oldObject.{0} == newObject.{0}", field.FieldName));

                if (i == nFieldCount - 1 || (i == nFieldCount - 2 && table.GetField(i + 1).IsPrimaryKey))
                    writer.WriteLine(")");
                else
                    writer.WriteLine(" &&");
            }

            writer.WriteLine("\t\t\t\treturn true;");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn false;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeMultiPrimarySame(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tprivate bool IsSame{0}({1} oldObject, {1} newObject)", table.TableName, strClassName));
            writer.WriteLine("\t\t{");

            int nFieldCount = table.GetFieldCount();

            List<DBField> normalFields = new List<DBField>();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey == false)
                    normalFields.Add(field);
            }

            int nNormalCount = normalFields.Count;

            if (nNormalCount == 0)
            {
                writer.WriteLine("\t\t\treturn true;");
                writer.WriteLine("\t\t}");
                writer.WriteLine();
            }
            else
            {
                writer.Write("\t\t\tif (");
                bool isFirst = true;

                for (int i = 0; i < nNormalCount; i++)
                {
                    DBField field = table.GetField(i);

                    if (isFirst)
                        isFirst = false;
                    else
                        writer.Write("\t\t\t\t");

                    if (field.DataType == DBField.FieldType.DateTime)
                    {
                        if (field.IsNullable)
                            writer.Write(string.Format("IsSameTime(oldObject.{0}, newObject.{0})", field.FieldName));
                        else
                            writer.Write(string.Format("IsSameTime2(oldObject.{0}, newObject.{0})", field.FieldName));
                    }
                    else
                        writer.Write(string.Format("oldObject.{0} == newObject.{0}", field.FieldName));

                    if (i == nNormalCount - 1)
                        writer.WriteLine(")");
                    else
                        writer.WriteLine(" &&");
                }

                writer.WriteLine("\t\t\t\treturn true;");
                writer.WriteLine();
                writer.WriteLine("\t\t\treturn false;");
                writer.WriteLine("\t\t}");
                writer.WriteLine();
            }
        }

        private static void MakeMultiPrimaryCreate(StreamWriter writer, DBTable table, string strClassName, List<DBField> primaryFields)
        {
            writer.WriteLine(string.Format("\t\tpublic {0} Create{1}({0} obj, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicFieldDatas = new Dictionary<{0}.Fields, object>();", strClassName));

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey == false)
                    writer.WriteLine(string.Format("\t\t\tdicFieldDatas[{0}.Fields.{1}] = obj.{1};", strClassName, field.FieldName));
            }

            writer.WriteLine();

            CreateMultiPrimarySQL(writer, table, strClassName, primaryFields);

            writer.WriteLine("\t\t\tArrayList arrResult = m_dbManager.GetResultData(strSQL);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (arrResult != null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tbool isNullable;");
            CreateMultiPrimaryCondition(writer, table, strClassName, primaryFields);

            writer.WriteLine("\t\t\t\t// 가장 마지막에 삽입된 객체를 얻어온다.");
            writer.WriteLine(string.Format("\t\t\t\t\tList<{0}> datas = m_dataManager.GetSelectManager().Select{1}s(null, strCondition, 1, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tif (datas == null || datas.Count == 0)");
            writer.WriteLine("\t\t\t\t\treturn null;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\t\tif (IsSame{0}(obj, datas[0]))", table.TableName));
            writer.WriteLine("\t\t\t\t\treturn datas[0];");
            writer.WriteLine();

            CreateMultiPrimaryGet(writer, table, primaryFields);
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\telse");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void CreateMultiPrimaryGet(StreamWriter writer, DBTable table, List<DBField> primaryFields)
        {
            writer.Write(string.Format("\t\t\t\treturn Get{0}(obj", table.TableName));

            int nPrimaryFieldCount = primaryFields.Count;

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];
                writer.Write(", datas[0].{0}", field.FieldName);
            }

            writer.WriteLine(", 2, FindCountLimit, out strErrorMessage);");
        }

        private static void CreateMultiPrimaryCondition(StreamWriter writer, DBTable table, string strClassName, List<DBField> primaryFields)
        {
            writer.Write("\t\t\t\tstring strCondition = string.Format(\"order by ");

            int nPrimaryFieldCount = primaryFields.Count;

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                if (i == 0)
                    writer.Write("{" + i.ToString() + "} desc");
                else
                    writer.Write(", {" + i.ToString() + "} desc");
            }

            writer.WriteLine("\",");

            for (int i = 0; i < nPrimaryFieldCount; i++)
            {
                DBField field = primaryFields[i];

                if (i == nPrimaryFieldCount - 1)
                    writer.WriteLine(string.Format("\t\t\t\t\t{0}.GetFieldName({0}.Fields.{1}, out isNullable));", strClassName, field.FieldName));
                else
                    writer.WriteLine(string.Format("\t\t\t\t\t{0}.GetFieldName({0}.Fields.{1}, out isNullable),", strClassName, field.FieldName));
            }

            writer.WriteLine();
        }

        private static void CreateMultiPrimarySQL(StreamWriter writer, DBTable table, string strClassName, List<DBField> primaryFields)
        {
            int nPrimaryFieldCount = primaryFields.Count;
            DBField lastPrimaryField = primaryFields[nPrimaryFieldCount - 1];

            writer.Write("\t\t\tstring strSQL = string.Format(\"Insert into {0} ({1}) values (IsNull((SELECT MAX(" + lastPrimaryField.FieldName + ") FROM {0} C where ");

            for (int i=0;i<nPrimaryFieldCount-1;i++)
            {
                DBField field = primaryFields[i];

                if (i == 0)
                    writer.Write(field.FieldName + " = {" + (i+2).ToString() + "} ");
                else
                    writer.Write("and " + field.FieldName + " = {" + (i + 2).ToString() + "} ");
            }

            writer.WriteLine("), 0) + 1, {" + (nPrimaryFieldCount + 1).ToString() + "})\",");

            writer.WriteLine(string.Format("\t\t\t\t{0}.TableName,", strClassName));
            writer.WriteLine(string.Format("\t\t\t\tGetFieldNames<{0}.Fields>(),", strClassName));

            for (int i = 0; i < nPrimaryFieldCount - 1; i++)
            {
                DBField field = primaryFields[i];
                writer.WriteLine(string.Format("\t\t\t\tobj.{0},", field.FieldName));
            }

            writer.WriteLine("\t\t\t\tGetFieldValues(dicFieldDatas));");
            writer.WriteLine();
        }

        private static void MakeOnePrimaryCreate(StreamWriter writer, DBTable table, string strClassName, DBField primaryField)
        {
            writer.WriteLine(string.Format("\t\tpublic {0} Create{1}({0} obj, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicFieldDatas = new Dictionary<{0}.Fields, object>();", strClassName));

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field.IsPrimaryKey == false)
                    writer.WriteLine(string.Format("\t\t\tdicFieldDatas[{0}.Fields.{1}] = obj.{1};", strClassName, field.FieldName));
            }

            writer.WriteLine();

            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"Insert into {0} ({1}) values (IsNull((SELECT MAX(" + primaryField.FieldName + ") FROM {0} C), 0) + 1, {2})\",");
            writer.WriteLine(string.Format("\t\t\t\t{0}.TableName,", strClassName));
            writer.WriteLine(string.Format("\t\t\t\tGetFieldNames<{0}.Fields>(),", strClassName));
            writer.WriteLine("\t\t\t\tGetFieldValues(dicFieldDatas));");
            writer.WriteLine();

            writer.WriteLine("\t\t\tArrayList arrResult = m_dbManager.GetResultData(strSQL);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (arrResult != null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tbool isNullable;");
            writer.WriteLine("\t\t\t\tstring strCondition = string.Format(\"order by {0} desc\", " + string.Format("{0}.GetFieldName({0}.Fields.{1}, out isNullable));", strClassName, primaryField.FieldName));
            writer.WriteLine();

            writer.WriteLine("\t\t\t\t// 가장 마지막에 삽입된 객체를 얻어온다.");
            writer.WriteLine(string.Format("\t\t\t\tList<{0}> datas = m_dataManager.GetSelectManager().Select{1}s(null, strCondition, 1, out strErrorMessage);", strClassName, table.TableName));
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tif (datas == null || datas.Count == 0)");
            writer.WriteLine("\t\t\t\t\treturn null;");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\t\tif (IsSame{0}(obj, datas[0]))", table.TableName));
            writer.WriteLine("\t\t\t\t\treturn datas[0];");
            writer.WriteLine();

            writer.WriteLine(string.Format("\t\t\t\treturn Get{0}(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);", table.TableName));
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\telse");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeNoPrimaryCreate(StreamWriter writer, DBTable table, string strClassName)
        {
            writer.WriteLine(string.Format("\t\tpublic {0} Create{1}({0} obj, out string strErrorMessage)", strClassName, table.TableName));
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tstrErrorMessage = null;");
            writer.WriteLine(string.Format("\t\t\tDictionary<{0}.Fields, object> dicFieldDatas = new Dictionary<{0}.Fields, object>();", strClassName));

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);
                writer.WriteLine(string.Format("\t\t\tdicFieldDatas[{0}.Fields.{1}] = obj.{1};", strClassName, field.FieldName));
            }

            writer.WriteLine();

            writer.WriteLine("\t\t\tstring strSQL = string.Format(\"Insert into {0} ({1}) values({2})\",");
            writer.WriteLine(string.Format("\t\t\t\t{0}.TableName,", strClassName));
            writer.WriteLine(string.Format("\t\t\t\tGetFieldNames<{0}.Fields>(),", strClassName));
            writer.WriteLine("\t\t\t\tGetFieldValues(dicFieldDatas));");
            writer.WriteLine();

            writer.WriteLine("\t\t\tArrayList arrResult = m_dbManager.GetResultData(strSQL);");
            writer.WriteLine();

            writer.WriteLine("\t\t\tif (arrResult != null)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine(string.Format("\t\t\t\t{0} data = new {0}();", strClassName));

            for (int i=0;i<nFieldCount;i++)
            {
                DBField field = table.GetField(i);
                writer.WriteLine(string.Format("\t\t\t\tdata.{0} = obj.{0};", field.FieldName));
            }

            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn data;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\telse");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrorMessage = m_dbManager.LastErrorMessage;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }
    }
}
