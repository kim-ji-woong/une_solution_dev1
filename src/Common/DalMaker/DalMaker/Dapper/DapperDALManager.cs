using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DalMaker.Dapper
{
    public class DALManager
    {
        public static bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            /*string strFolderPath = Directory.GetCurrentDirectory() + "\\DAL";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (CodeManager.ClearSubDirectories(strFolderPath) == false)
                return false;

            MakeDataManager(strNamespace, strFolderPath);
            MakeQueryManager(strNamespace, strFolderPath);

            MakeCreate(strNamespace, tables, dicClassNames, strFolderPath);
            MakeSelect(strNamespace, tables, dicClassNames, strFolderPath);
            MakeDelete(strNamespace, tables, dicClassNames, strFolderPath);
            MakeUpdate(strNamespace, tables, dicClassNames, strFolderPath);*/
            return true;
        }

        private static void MakeDataManager(string strNamespace, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\DataManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine("using dnsDapperDBUtil.Manager;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class DataManager : IDataManager");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tprivate WebDBManager m_dbManager = null;");
            writer.WriteLine();
            writer.WriteLine("\t\tprivate InsertManager m_create = null;");
            writer.WriteLine("\t\tprivate DeleteManager m_delete = null;");
            writer.WriteLine("\t\tprivate SelectManager m_select = null;");
            writer.WriteLine("\t\tprivate UpdateManager m_update = null;");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic DataManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tSetDBConnection(nDbType, strDbHost, strDbName, strDbID, strDbPw);");
            writer.WriteLine("\t\t\tCreateAllManager();");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic WebDBManager GetDbManager()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_dbManager;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (m_dbManager == null)");
            writer.WriteLine("\t\t\t\tm_dbManager = new WebDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tprivate void CreateAllManager()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (m_create == null)");
            writer.WriteLine("\t\t\t\tm_create = new InsertManager(this);");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (m_select == null)");
            writer.WriteLine("\t\t\t\tm_select = new SelectManager(this);");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (m_delete == null)");
            writer.WriteLine("\t\t\t\tm_delete = new DeleteManager(this);");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (m_update == null)");
            writer.WriteLine("\t\t\t\tm_update = new UpdateManager(this);");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic IDelete GetDelete()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_delete;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic ISelect GetSelect()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_select;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic IUpdate GetUpdate()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_update;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic ICreate GetCreate()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_create;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic bool BatchCommit(out string strErrMsg)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_dbManager.BatchCommit(out strErrMsg);");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic bool BatchRollback(out string strErrMsg)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_dbManager.BatchRollback(out strErrMsg);");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic bool BeginBatch(out string strErrMsg)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_dbManager.BeginBatch(out strErrMsg);");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tpublic IDataManager Clone()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tDataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw);");
            writer.WriteLine("\t\t\treturn dataManager;");
            writer.WriteLine("\t\t}");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
        }

        private static void MakeQueryManager(string strNamespace, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\QueryManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using dnsDapperDBUtil.Manager;");
            writer.WriteLine("using System;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class QueryManager");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tprotected WebDBManager m_dbManager = null;");
            writer.WriteLine();

            writer.WriteLine("\t\tprotected string GetConditions(string strConditions)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (strConditions == null || strConditions.Length == 0)");
            writer.WriteLine("\t\t\t\treturn string.Empty;");
            writer.WriteLine();
            writer.WriteLine("\t\t\tstrConditions = strConditions.Trim();");
            writer.WriteLine();
            writer.WriteLine("\t\t\tif (strConditions.ToLower().StartsWith(\"order by\"))");
            writer.WriteLine("\t\t\t\treturn \" \" + strConditions;");
            writer.WriteLine("\t\t\telse");
            writer.WriteLine("\t\t\t\treturn $\" and {strConditions}\";");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tprotected string GetFieldNames<EnumType>(/*out int nFieldCount*/)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\t//nFieldCount = 0;");
            writer.WriteLine("\t\t\tstring strFields = \"\";");
            writer.WriteLine();
            writer.WriteLine("\t\t\tforeach (EnumType type in Enum.GetValues(typeof(EnumType)))");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (strFields.Length == 0)");
            writer.WriteLine("\t\t\t\t\tstrFields = type.ToString();");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tstrFields += \", \" + type.ToString();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t//nFieldCount++;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn strFields;");
            writer.WriteLine("\t\t}");

            writer.WriteLine();

            writer.WriteLine("\t\tprotected string SetData<DataType>(Dictionary<DataType, object> dicSets, ref Dictionary<string, object> dicSetParams)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tif (dicSets?.Count > 0)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tdicSetParams = new Dictionary<string, object>();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tstring strSets = string.Empty;");
            writer.WriteLine("\t\t\t\tforeach (KeyValuePair<DataType, object> pair in dicSets)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstring strFieldName = pair.Key.ToString();");
            writer.WriteLine("\t\t\t\t\tstring strParamFieldName = \"@\" + pair.Key.ToString();");
            writer.WriteLine("\t\t\t\t\tdicSetParams[strParamFieldName] = pair.Value;");
            writer.WriteLine("\t\t\t\t\tif (strSets.Length > 0)");
            writer.WriteLine("\t\t\t\t\t\tstrSets += \", \";");
            writer.WriteLine("\t\t\t\t\tstrSets += string.Concat(strFieldName, \" = \", strParamFieldName);");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn strSets;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn \"\";");
            writer.WriteLine("\t\t}");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
        }

        private static bool MakeUpdate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\UpdateManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class UpdateManager : QueryManager, IUpdate");
            writer.WriteLine("\t{");

            MakeUpdateConstructor(writer);
            MakeUpdateFirst(writer);
            MakeUpdate(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeUpdateConstructor(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic UpdateManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dbManager = dataManager.GetDbManager();");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeUpdateFirst(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tDictionary<string, object> dicSetParams = null;");
            writer.WriteLine("\t\t\t\tstring strSets = SetData<Fields>(dicSets, ref dicSetParams);");
            writer.WriteLine("\t\t\t\tif (strSets.Length == 0 || dicSetParams == null || dicSetParams.Count == 0)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstrErrMsg = \"update params 오류\";");
            writer.WriteLine("\t\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tstring strSQL = $\"update {t.GetTableName()} set {strSets} where (1=1)\";");
            writer.WriteLine("\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn m_dbManager.Excute(strSQL, dicSetParams);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = null;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeUpdate(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstring strConditions = t.GetPrimaryCondition();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tif (strAdditionalConditions != null)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstrAdditionalConditions = strAdditionalConditions.Trim();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t\tif (strAdditionalConditions.Length > 0)");
            writer.WriteLine("\t\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\t\tif (strConditions.Length == 0)");
            writer.WriteLine("\t\t\t\t\t\t\tstrConditions = strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\t\t\tstrConditions += \" and \" + strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t\t}");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tif (t.GetWriteFieldType() != null)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstring strSets = t.GetParamFieldNames();");
            writer.WriteLine("\t\t\t\t\tstring strSQL = $\"update {t.GetTableName()} set {strSets} where (1=1)\";");
            writer.WriteLine("\t\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t\treturn m_dbManager.Excute(strSQL, t, out strErrMsg);");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstrErrMsg = null;");
            writer.WriteLine("\t\t\t\t\treturn true;");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = null;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
        }

        private static bool MakeDelete(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\DeleteManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine("using System;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class DeleteManager : QueryManager, IDelete");
            writer.WriteLine("\t{");

            MakeDeleteConstructor(writer);
            MakeDelete(writer);
            MakeDeleteObject(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeDeleteConstructor(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic DeleteManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dbManager = dataManager.GetDbManager();");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeDelete(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Delete<T>(string strConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tstring strSQL = $\"delete from {t.GetTableName()} where (1=1)\";");
            writer.WriteLine("\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn m_dbManager.Excute(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeDeleteObject(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Delete<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstring strConditions = t.GetPrimaryCondition();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tif (strAdditionalConditions != null)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tstrAdditionalConditions = strAdditionalConditions.Trim();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t\tif (strAdditionalConditions.Length > 0)");
            writer.WriteLine("\t\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\t\tif (strConditions.Length == 0)");
            writer.WriteLine("\t\t\t\t\t\t\tstrConditions = strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\t\t\tstrConditions += \" and \" + strAdditionalConditions;");
            writer.WriteLine("\t\t\t\t\t}");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\tstring strSQL = $\"delete from {t.GetTableName()} where (1=1)\";");
            writer.WriteLine("\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\treturn m_dbManager.Excute(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static bool MakeCreate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\InsertManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class InsertManager : QueryManager, ICreate");
            writer.WriteLine("\t{");

            MakeCreateConstructor(writer);
            MakeInsertFirst(writer);
            MakeInsert(writer);
            MakeInsertList(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeCreateConstructor(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic InsertManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dbManager = dataManager.GetDbManager();");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeInsertFirst(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Insert<T>(T addT, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tstring strFieldNames = t.GetWriteFieldNames();");
            writer.WriteLine("\t\t\t\tstring strParamFieldNames = t.GetWriteFieldNames(true);");
            writer.WriteLine("\t\t\t\tstring strSQL = $@\"insert into {t.GetTableName()} ({strFieldNames}) values({strParamFieldNames})\";");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\treturn m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeInsert(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tstring strFieldNames = t.GetWriteFieldNames();");
            writer.WriteLine("\t\t\t\tstring strParamFieldNames = t.GetWriteFieldNames(true);");
            writer.WriteLine("\t\t\t\tstring strSQL = $@\"insert into {t.GetTableName()} ({strFieldNames}) values({strParamFieldNames})\";");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\treturn m_dbManager.Insert<T>(strSQL, addT, out nAddID, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tnAddID = -1;");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeInsertList(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic bool Insert<T>(List<T> addT, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tstring strFieldNames = t.GetWriteFieldNames();");
            writer.WriteLine("\t\t\t\tstring strParamFieldNames = t.GetWriteFieldNames(true);");
            writer.WriteLine("\t\t\t\tstring strSQL = $@\"insert into {t.GetTableName()} ({strFieldNames}) values({strParamFieldNames})\";");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\treturn m_dbManager.Insert<T>(strSQL, addT, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn false;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static bool MakeSelect(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\SelectManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using Dapper;");
            writer.WriteLine(string.Format("using {0}.IDAL;", strNamespace));
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine("using dnsDapperDBUtil.Interfaces;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine("using System.Data.Common;");
            writer.WriteLine("using System.Linq;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.DAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic class SelectManager : QueryManager, ISelect");
            writer.WriteLine("\t{");

            MakeConstructor(writer);
            MakeSelectQueryFirst(writer);
            SelectQuery(writer);
            SelectFirst(writer);
            SelectSimpleQuery(writer);
            SelectTripleQuery(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static void MakeConstructor(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic SelectManager(DataManager dataManager)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tm_dbManager = dataManager.GetDbManager();");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void MakeSelectQueryFirst(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic T SelectFirst<T>(string strConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tstring strSQL = $\"select {t.GetFieldNames()} from {t.GetTableName()} where (1=1)\";");
            writer.WriteLine("\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tt = m_dbManager.QueryFirst<T>(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t\t\treturn t;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void SelectQuery(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic IEnumerable<T> Select<T>(string strConditions, out string strErrMsg) where T : Table, new()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\ttry");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tT t = new T();");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\tstring strSQL = $\"select {table.GetFieldNames()} from {table.GetTableName()} where (1=1)\";");
            writer.WriteLine("\t\t\t\tstrSQL += GetConditions(strConditions);");
            writer.WriteLine();

            writer.WriteLine("\t\t\t\treturn m_dbManager.Query<T>(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t\tcatch (Exception e)");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tstrErrMsg = e.Message;");
            writer.WriteLine("\t\t\t\treturn null;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void SelectFirst(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic dynamic SelectFirst(string strSQL, out string strErrMsg)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn m_dbManager.QueryFirst(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void SelectSimpleQuery(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic IEnumerable<dynamic> Select(string strSQL, out string strErrMsg)");
            writer.WriteLine("\t\t{");
            
            writer.WriteLine("\t\t\treturn m_dbManager.Query(strSQL, out strErrMsg);");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void SelectTripleQuery(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic IEnumerable<T3> Select<T1, T2, T3>(string strSQL, T3 t3, out string strErrMsg) where T3 : IDataClass, new()");
            writer.WriteLine("\t\t{");

            writer.WriteLine("\t\t\treturn m_dbManager.Query<T1, T2, T3>(strSQL, t3, out strErrMsg);");
            writer.WriteLine("\t\t}");
        }
    }
}
