using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DalMaker.Dapper
{
    public class IDALManager
    {
        public static bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            /*string strFolderPath = Directory.GetCurrentDirectory() + "\\IDAL";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (CodeManager.ClearSubDirectories(strFolderPath) == false)
                return false;

            MakeIDataManager(strNamespace, strFolderPath);

            MakeCreate(strNamespace, tables, dicClassNames, strFolderPath);
            MakeDelete(strNamespace, tables, dicClassNames, strFolderPath);
            MakeSelect(strNamespace, tables, dicClassNames, strFolderPath);
            MakeUpdate(strNamespace, tables, dicClassNames, strFolderPath);*/
            return true;
        }

        private static void MakeIDataManager(string strNamespace, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\IDataManager.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface IDataManager");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tISelect GetSelect();");
            writer.WriteLine("\t\tIDelete GetDelete();");
            writer.WriteLine("\t\tIUpdate GetUpdate();");
            writer.WriteLine("\t\tICreate GetCreate();");

            writer.WriteLine();

            writer.WriteLine("\t\tbool BeginBatch(out string strErrMsg);");
            writer.WriteLine("\t\tbool BatchCommit(out string strErrMsg);");
            writer.WriteLine("\t\tbool BatchRollback(out string strErrMsg);");
            writer.WriteLine("\t\tIDataManager Clone();");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
        }

        private static bool MakeSelect(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\ISelect.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using dnsDapperDBUtil.Interfaces;");
            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface ISelect");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tT SelectFirst<T>(string strConditions, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tIEnumerable<T> Select<T>(string strConditions, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tdynamic SelectFirst(string strSQL, out string strErrMsg);");
            writer.WriteLine("\t\tIEnumerable<dynamic> Select(string strSQL, out string strErrMsg);");
            writer.WriteLine("\t\tIEnumerable<T3> Select<T1, T2, T3>(string strSQL, T3 t3, out string strErrMsg) where T3 : IDataClass, new();");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static bool MakeCreate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\ICreate.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface ICreate");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tbool Insert<T>(T addT, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tbool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tbool Insert<T>(List<T> t, out string strErrMsg) where T : Table, new();");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static bool MakeDelete(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\IDelete.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface IDelete");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tbool Delete<T>(string strConditions, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tbool Delete<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new();");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static bool MakeUpdate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\IUpdate.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface IUpdate");
            writer.WriteLine("\t{");

            writer.WriteLine("\t\tbool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new();");
            writer.WriteLine("\t\tbool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new();");

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }
    }
}
