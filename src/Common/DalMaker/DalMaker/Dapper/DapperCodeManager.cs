using System;
using System.IO;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;

namespace DalMaker.Dapper
{
    public class CodeManager : DalMaker.CodeManager
    {
        public static new bool MakeCode(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
        {
            if (MakeModel(strNamespace, tables, dicClassNames) == false)
                return false;

            if (IDALManager.MakeCode(strNamespace, tables, dicClassNames) == false)
                return false;

            if (DALManager.MakeCode(strNamespace, tables, dicClassNames) == false)
                return false;

            MessageBox.Show("아래의 경로에 코드파일이 생성되었습니다.\r\n" + Directory.GetCurrentDirectory());
            return true;
        }

        private static new bool MakeModel(string strNamespace, List<DBTable> tables, Dictionary<DBTable, string> dicClassNames)
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

            /*if (MakeTable(strNamespace) == false)
                return false;*/

            foreach (DBTable table in tables)
            {
                StreamWriter writer = MakeStream(table, strFolderPath, dicClassNames, out strSubNamespace, out strClassName);

                writer.WriteLine("using System;");
                writer.WriteLine("using dnsDapperDBUtil.DataAccessLayer.IDAL;");
                writer.WriteLine();

                if (strSubNamespace == null)
                    writer.WriteLine(string.Format("namespace {0}.Model", strNamespace));
                else
                    writer.WriteLine(string.Format("namespace {0}.Model.{1}", strNamespace, strSubNamespace));

                writer.WriteLine("{");
                writer.WriteLine(string.Format("\tpublic class {0} : Table", strClassName));
                writer.WriteLine("\t{");
                writer.WriteLine("\t\tpublic enum Fields { " + table.GetFieldNames() + " };");

                string strWriteFields = table.GetNoIdentityFieldNames();

                if (strWriteFields.Length > 0)
                    writer.WriteLine("\t\tpublic enum WriteFields { " + strWriteFields + " };");

                writer.WriteLine();

                WriteProperties(writer, table);
                WriteTableName(writer, table);
                WriteGetTableName(writer, table);
                WritePrimaryCondition(writer, table);
                WriteModelGetFieldType(writer);

                if (strWriteFields.Length > 0)
                    WriteModelGetWriteFieldType(writer);

                WriteFromCopy(writer, strClassName, table);

                writer.WriteLine("\t}");
                writer.WriteLine("}");
                writer.Close();
            }

            return true;
        }

        private static bool MakeTable(string strNamespace)
        {
            string strClassName = "Table";
            string strBaseFolder = Directory.GetCurrentDirectory();
            string strFolderPath = strBaseFolder + "\\Models";

            if (Directory.Exists(strFolderPath) == false)
                Directory.CreateDirectory(strFolderPath);

            if (ClearSubDirectories(strFolderPath) == false)
                return false;

            string strFilePath = strFolderPath + "\\" + strClassName + ".cs";
            StreamWriter writer = new StreamWriter(strFilePath, false, Encoding.UTF8);

            writer.WriteLine("using System;");
            writer.WriteLine();

            writer.WriteLine(string.Format("namespace {0}.Model", strNamespace));
            
            writer.WriteLine("{");
            writer.WriteLine(string.Format("\tpublic class {0}", strClassName));
            writer.WriteLine("\t{");

            WriteGetTableName(writer);
            WriteGetPrimaryCondition(writer);
            WriteGetFieldType(writer);
            WriteGetWriteFieldType(writer);
            WriteGetFieldNames(writer);
            WriteGetParamFieldNames(writer);

            writer.WriteLine("\t}");
            writer.WriteLine("}");
            writer.Close();

            MessageBox.Show("아래의 경로에 코드파일이 생성되었습니다.\r\n" + strBaseFolder);
            return true;
        }

        private static void WriteGetFieldType(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual Type GetFieldType()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteGetWriteFieldType(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual Type GetWriteFieldType()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteGetTableName(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual string GetTableName()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn string.Empty;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteGetPrimaryCondition(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual string GetPrimaryCondition()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn string.Empty;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        protected static void WriteGetTableName(StreamWriter writer, DBTable table)
        {
            string strLine = "\t\tpublic override string GetTableName()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn TableName;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteGetFieldNames(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual string GetFieldNames<Fields>(bool bIsParam = false)";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\t//nFieldCount = 0;");
            writer.WriteLine("\t\t\tstring strFields = string.Empty;");
            writer.WriteLine();
            writer.WriteLine("\t\t\tforeach (Fields type in Enum.GetValues(typeof(Fields)))");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (bIsParam)");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tif (strFields.Length == 0)");
            writer.WriteLine("\t\t\t\t\t\tstrFields = \"@\" + type.ToString();");
            writer.WriteLine("\t\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\t\tstrFields += \", @\" + type.ToString();");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t{");
            writer.WriteLine("\t\t\t\t\tif (strFields.Length == 0)");
            writer.WriteLine("\t\t\t\t\t\tstrFields = type.ToString();");
            writer.WriteLine("\t\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\t\tstrFields += \", \" + type.ToString();");
            writer.WriteLine("\t\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t//nFieldCount++;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn strFields;");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteGetParamFieldNames(StreamWriter writer)
        {
            string strLine = "\t\tpublic virtual string GetParamFieldNames<WriteFields>()";
            writer.WriteLine(strLine);
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\t//nFieldCount = 0;");
            writer.WriteLine("\t\t\tstring strFields = \"\";");
            writer.WriteLine();
            writer.WriteLine("\t\t\tforeach (WriteFields type in Enum.GetValues(typeof(WriteFields)))");
            writer.WriteLine("\t\t\t{");
            writer.WriteLine("\t\t\t\tif (strFields.Length == 0)");
            writer.WriteLine("\t\t\t\t\tstrFields = type.ToString() + \" = @\" + type.ToString();");
            writer.WriteLine("\t\t\t\telse");
            writer.WriteLine("\t\t\t\t\tstrFields += \", \" + type.ToString() + \" = @\" + type.ToString();");
            writer.WriteLine();
            writer.WriteLine("\t\t\t\t//nFieldCount++;");
            writer.WriteLine("\t\t\t}");
            writer.WriteLine();
            writer.WriteLine("\t\t\treturn strFields;");
            writer.WriteLine("\t\t}");
        }

        private static void WritePrimaryCondition(StreamWriter writer, DBTable table)
        {
            List<DBField> primaryFields = new List<DBField>();

            int nFieldCount = table.GetFieldCount();

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = table.GetField(i);

                if (field == null)
                    continue;

                if (field.IsPrimaryKey)
                    primaryFields.Add(field);
            }

            nFieldCount = primaryFields.Count;

            if (nFieldCount == 0)
                return;

            string strFormat = "";
            string strFields = "";

            for (int i = 0; i < nFieldCount; i++)
            {
                DBField field = primaryFields[i];

                string strCondition = "";
                //string strCondition = field.FieldName + " = ";

                if (field.DataType == DBField.FieldType.DateTime || field.DataType == DBField.FieldType.String)
                    strCondition = "{" + (i * 2) + "} = '{" + (i * 2 + 1) + "}'";
                else
                    strCondition = "{" + (i * 2) + "} = {" + (i * 2 + 1) + "}";

                if (i == 0)
                {
                    strFormat = strCondition;
                    strFields = "Fields." + field.FieldName + ", " + field.FieldName;
                    //strFields = field.FieldName;
                }
                else
                {
                    strFormat += " and " + strCondition;
                    strFields += ", Fields." + field.FieldName + ", " + field.FieldName;
                    //strFields += ", " + field.FieldName;
                }
            }

            writer.WriteLine("\t\tpublic override string GetPrimaryCondition()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn string.Format(\"" + strFormat + "\", " + strFields + ");");
            writer.WriteLine("\t\t}");
            writer.WriteLine();
        }

        private static void WriteModelGetFieldType(StreamWriter writer)
        {
            writer.WriteLine("\t\tpublic override Type GetFieldType()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn typeof(Fields);");
            writer.WriteLine("\t\t}");
        }

        private static void WriteModelGetWriteFieldType(StreamWriter writer)
        {
            writer.WriteLine();
            writer.WriteLine("\t\tpublic override Type GetWriteFieldType()");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\treturn typeof(WriteFields);");
            writer.WriteLine("\t\t}");
        }

        private static void WriteFromCopy(StreamWriter writer, string strClassName, DBTable table)
        {
            writer.WriteLine();
            writer.WriteLine("\t\tpublic void FromCopy(" + strClassName + " obj)");
            writer.WriteLine("\t\t{");

            int fieldCount = table.GetFieldCount();

            for (int i=0;i<fieldCount;i++)
            {
                DBField field = table.GetField(i);
                string strLine = string.Format("\t\t\tthis.{0} = obj.{0};", field.FieldName);
                writer.WriteLine(strLine);
            }

            writer.WriteLine("\t\t}");
        }
    }
}
