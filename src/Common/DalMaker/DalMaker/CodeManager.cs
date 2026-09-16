using System;
using System.IO;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;

namespace DalMaker
{
    public class CodeManager
    {
        public static bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            if (MakeModel(strNamespace, tables, dicClassNames) == false)
                return false;

            if (IDALManager.MakeCode(strNamespace, tables, dicClassNames) == false)
                return false;

            if (DALManager.MakeCode(strNamespace, tables, dicClassNames) == false)
                return false;
        
            return true;
        }

        protected static bool MakeModel(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            if (tables.Count == 0)
            {
                MessageBox.Show("코드를 생성할 테이블들을 선택하세요");
                return false;
            }

            string strClassName, strSubNamespace;
            string strBaseFolder = Directory.GetCurrentDirectory();
            string strFolderPath = strBaseFolder + "\\Models";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (ClearSubDirectories(strFolderPath) == false)
                return false;

            foreach (DBTable table in tables)
            {
                StreamWriter writer = MakeStream(table, strFolderPath, dicClassNames, out strSubNamespace, out strClassName);

                writer.WriteLine("using System;");
                writer.WriteLine();

                if (strSubNamespace == null)
                    writer.WriteLine(string.Format("namespace {0}.Model", strNamespace));
                else
                    writer.WriteLine(string.Format("namespace {0}.Model.{1}", strNamespace, strSubNamespace));

                writer.WriteLine("{");
                writer.WriteLine(string.Format("\tpublic class {0}", strClassName));
                writer.WriteLine("\t{");
                writer.WriteLine("\t\tpublic enum Fields { " + table.GetFieldNames() + " };");
                writer.WriteLine();

                WriteProperties(writer, table);
                WriteTableName(writer, table);
                WriteGetFieldName(writer, table);

                writer.WriteLine("\t}");
                writer.WriteLine("}");
                writer.Close();
            }

            MessageBox.Show("아래의 경로에 코드파일이 생성되었습니다.\r\n" + strBaseFolder);
            return true;
        }

        protected static StreamWriter MakeStream(DBTable table, string strFolderPath, Dictionary<DBTable, string> dicClassNames, out string strNamespace, out string strClassName)
        {
            strNamespace = null;
            string strFullName = dicClassNames[table];

            string[] tokens = strFullName.Split('.');
            int nTokenCount = tokens.Length;

            for (int i=0;i<nTokenCount-1;i++)
            {
                strFolderPath += "\\" + tokens[i];

                if (Directory.Exists(strFolderPath) == false)
                    Directory.CreateDirectory(strFolderPath);

                if (i == 0)
                    strNamespace = tokens[i];
                else
                    strNamespace += "." + tokens[i];
            }

            strClassName = tokens[nTokenCount - 1];
            string strFilePath = strFolderPath + "\\" + strClassName + ".cs";
            return new StreamWriter(strFilePath, false, Encoding.UTF8);
        }

        public static bool ClearSubDirectories(string strBaseFolder)
        {
            string[] files = Directory.GetFiles(strBaseFolder);

            try
            {
                foreach (string strFile in files)
                {
                    File.Delete(strFile);
                }
            }
            catch (Exception e)
            {
                MessageBox.Show("기존 경로의 파일을 삭제할 수 없습니다. : " + strBaseFolder);
                return false;
            }

            string[] folders = Directory.GetDirectories(strBaseFolder);

            foreach (string strFolder in folders)
            {
                if (ClearSubDirectories(strFolder) == false)
                    return false;

                Directory.Delete(strFolder);
            }

            return true;
        }

        protected static void WriteGetFieldName(StreamWriter writer, DBTable table)
        {
            writer.WriteLine("\t\tpublic static string GetFieldName(Fields field, out bool isNullable)");
            writer.WriteLine("\t\t{");

            int nFieldCount = table.GetFieldCount();
            List<DBField> nullableFields = table.GetNullableFields();
            int nNullableCount = nullableFields.Count;

            if (nNullableCount == 0)
                writer.WriteLine("\t\t\tisNullable = false;");
            else if (nNullableCount == nFieldCount)
                writer.WriteLine("\t\t\tisNullable = true;");
            else
            {
                for (int i=0;i<nNullableCount;i++)
                {
                    DBField field = nullableFields[i];

                    if (i == 0)
                        writer.Write(string.Format("\t\t\tif (field == Fields.{0}", field.FieldName));
                    else
                        writer.Write(string.Format("\t\t\t\tfield == Fields.{0}", field.FieldName));

                    if (i == nNullableCount - 1)
                        writer.WriteLine(")");
                    else
                        writer.WriteLine(" ||");
                }

                writer.WriteLine("\t\t\t\tisNullable = true;");
                writer.WriteLine("\t\t\telse");
                writer.WriteLine("\t\t\t\tisNullable = false;");

                writer.WriteLine();
            }

            writer.WriteLine("\t\t\treturn field.ToString();");
            writer.WriteLine("\t\t}");
        }

        protected static void WriteTableName(StreamWriter writer, DBTable table)
        {
            string strLine = "\t\tpublic static string TableName { get { return \"" + table.TableName + "\"; } }";
            writer.WriteLine(strLine);
            writer.WriteLine();
        }

        protected static void WriteProperties(StreamWriter writer, DBTable table)
        {
            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field == null)
                    continue;

                writer.WriteLine(string.Format("\t\tpublic {0}", field.GetPropertyLine()));
            }

            writer.WriteLine();
        }
    }
}
