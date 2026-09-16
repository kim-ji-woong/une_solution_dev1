using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DalMaker
{
    public class IDALManager
    {
        public static bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            string strFolderPath = Directory.GetCurrentDirectory() + "\\IDAL";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (CodeManager.ClearSubDirectories(strFolderPath) == false)
                return false;

            MakeCreate(strNamespace, tables, dicClassNames, strFolderPath);
            MakeDelete(strNamespace, tables, dicClassNames, strFolderPath);
            MakeSelect(strNamespace, tables, dicClassNames, strFolderPath);
            MakeUpdate(strNamespace, tables, dicClassNames, strFolderPath);
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

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                
                writer.WriteLine(string.Format("\t\tbool Update{0}({1} obj, out string strErrorMessage);", table.TableName, strClassName));
                writer.WriteLine(string.Format("\t\tbool Update{0}(Dictionary<{1}.Fields, object> dicSets, Dictionary<{1}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);", table.TableName, strClassName));
                writer.WriteLine();
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static bool MakeSelect(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\ISelect.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System.Collections.Generic;");
            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface ISelect");
            writer.WriteLine("\t{");

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                string strPrimaryFields = table.GetPrimaryFieldList();

                if (strPrimaryFields.Length > 0)
                    writer.WriteLine(string.Format("\t\t{0} Select{1}({2}, out string strErrorMessage);", strClassName, table.TableName, strPrimaryFields));

                writer.WriteLine(string.Format("\t\tList<{0}> Select{1}s(Dictionary<{0}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);", strClassName, table.TableName));
                writer.WriteLine(string.Format("\t\tList<{0}> Select{1}s(Dictionary<{0}.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);", strClassName, table.TableName));
                writer.WriteLine();
            }

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

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                string strPrimaryFields = table.GetPrimaryFieldList();

                if (strPrimaryFields.Length > 0)
                    writer.WriteLine(string.Format("\t\tbool Delete{0}({1}, out string strErrorMessage);", table.TableName, strPrimaryFields));

                writer.WriteLine(string.Format("\t\tbool Delete{0}(Dictionary<{1}.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);", table.TableName, strClassName));
                writer.WriteLine();
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }

        private static bool MakeCreate(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames, string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\ICreate.cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine(string.Format("using {0}.Model;", strNamespace));
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.IDAL", strNamespace));
            writer.WriteLine("{");

            writer.WriteLine("\tpublic interface ICreate");
            writer.WriteLine("\t{");

            foreach (DBTable table in tables)
            {
                string strClassName = dicClassNames[table];
                writer.WriteLine(string.Format("\t\t{0} Create{1}({0} obj, out string strErrorMessage);", strClassName, table.TableName));
            }

            writer.WriteLine("\t}");
            writer.WriteLine("}");

            writer.Close();
            return true;
        }
    }
}
