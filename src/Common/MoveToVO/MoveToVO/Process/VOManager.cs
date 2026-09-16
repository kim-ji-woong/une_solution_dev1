using System.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace MoveToVO.Process
{
    using Models;

    class VOManager
    {
        private string m_strRootFolder = "";
        private string m_strRootPackageName = "";

        public VOManager(string strRootFolder)
        {
            m_strRootFolder = strRootFolder;
            m_strRootPackageName = ConfigurationManager.AppSettings.Get("RootPackageName");
        }

        public bool MakeFiles(List<Model> models)
        {
            string strDotFolder = m_strRootFolder.Replace('\\', '.');
            strDotFolder = strDotFolder.Replace('/', '.');

            // 클래스 이름 중복을 막기위한 장치
            Dictionary<string, string> dicClassNames = new Dictionary<string, string>();

            foreach (Model model in models)
            {
                MakeFile(model, strDotFolder, dicClassNames);
            }

            return true;
        }

        private bool MakeFile(Model model, string strDotFolder, Dictionary<string, string> dicClassNames)
        {
            if (model.Namespace == null || model.Namespace.Length == 0)
                return false;

            string strRelativePath = GetRelativePath(model.Namespace, strDotFolder);
            model.SmallNamespace = strRelativePath;

            string strClassName = model.ClassName;

            if (dicClassNames.ContainsKey(model.ClassName))
            {
                strClassName = GetPackageHeader(model) + strClassName;
                model.ClassName = strClassName;
                dicClassNames[strClassName] = model.ClassName;
            }
            else
                dicClassNames[model.ClassName] = model.ClassName;

            string strFilePath = GetFilePath(strClassName, strRelativePath, m_strRootFolder, ".java");

            return MakeVO(model, strClassName, strFilePath);
        }

        public static string GetPackageHeader(Model model)
        {
            string[] tokens = model.SmallNamespace.Split('.');
            string strHeader = "";

            foreach (string strToken in tokens)
            {
                strHeader += GetFirstUpper(strToken);
            }

            return strHeader;
        }

        private bool MakeVO(Model model, string strClassName, string strFilePath)
        {
            // UTF-8 without BOM
            StreamWriter writer = new StreamWriter(strFilePath, false, new UTF8Encoding(false));

            writer.WriteLine("package " + GetPackage(model) + ";");
            writer.WriteLine("");
            writer.WriteLine("import lombok.*;");

            if (HasDateTime(model))
            {
                writer.WriteLine("import java.time.LocalDateTime;");
                writer.WriteLine("");
            }

            writer.WriteLine("@Data");
            writer.WriteLine("@NoArgsConstructor");
            writer.WriteLine("@AllArgsConstructor");
            writer.WriteLine("@Builder");
            writer.WriteLine(string.Format("public class {0} {{", strClassName));

            writer.Write("\tpublic enum Fields { ");
            bool isFirst = true;

            foreach (KeyValuePair<string, string> pair in model.Variables)
            {
                if (isFirst)
                {
                    writer.Write(pair.Key);
                    isFirst = false;
                }
                else
                {
                    writer.Write(", " + pair.Key);
                }
            }

            writer.WriteLine(" }");
            writer.WriteLine("");

            foreach (KeyValuePair<string, string> pair in model.Variables)
            {
                string strVariableType = GetVariableType(pair.Value);

                if (strVariableType == "String nonNull")
                {
                    strVariableType = "String";
                    writer.WriteLine("\t@NonNull");
                    writer.WriteLine("\t@Builder.Default");
                    writer.WriteLine(string.Format("\tprivate {0} {1} = {2};", strVariableType, pair.Key, "\"\""));
                }
                else if (strVariableType == "LocalDateTime nonNull")
                {
                    strVariableType = "LocalDateTime";
                    writer.WriteLine("\t@NonNull");
                    writer.WriteLine("\t@Builder.Default");
                    writer.WriteLine(string.Format("\tprivate {0} {1} = {2};", strVariableType, pair.Key, "LocalDateTime.now()"));
                }
                else
                {
                    writer.WriteLine(string.Format("\tprivate {0} {1};", strVariableType, pair.Key));
                }
                writer.WriteLine("");
            }

            writer.WriteLine(string.Format("\tpublic static final String autoIncreaseField = {0};", model.AutoIncreaseField == null ? "null" : "\"" + model.AutoIncreaseField + "\""));
            writer.WriteLine(string.Format("\tpublic static final String tableName = \"{0}\";", model.TableName));
            writer.WriteLine(string.Format("\tpublic static final String[] primaryKeys = {0};", model.GetPrimaryKeys()));
            writer.WriteLine("");

            writer.WriteLine("}");
            writer.Close();
            return true;
        }

        private bool HasDateTime(Model model)
        {
            foreach (KeyValuePair<string, string> pair in model.Variables)
            {
                if (pair.Value.Contains("DateTime"))
                    return true;
            }

            return false;
        }

        private static string GetFirstUpper(string strName)
        {
            return strName.Substring(0, 1).ToUpper() + strName.Substring(1);
        }

        private string GetVariableType(string strType)
        {
            if (strType.EndsWith("?"))
            {
                strType = strType.Substring(0, strType.Length - 1);

                if (strType == "int")
                    return "Integer";
                else if (strType == "long")
                    return "Long";
                else if (strType == "float")
                    return "Float";
                else if (strType == "double")
                    return "Double";
                else if (strType == "bool")
                    return "Boolean";
                else if (strType == "byte")
                    return "Byte";
                else if (strType == "short")
                    return "Short";
                else if (strType == "char")
                    return "Char";
                else if (strType == "DateTime")
                    return "LocalDateTime";
            }

            if (strType == "bool")
                return "boolean";
            else if (strType == "DateTime")
                return "LocalDateTime nonNull";
            else if (strType == "string")
                return "String nonNull";
            else if (strType == "nullable string")
                return "String";

            return strType;
        }

        private string GetPackage(Model model)
        {
            if (m_strRootPackageName == null || m_strRootPackageName.Trim().Length == 0)
                return model.Namespace;

            string strRoot = m_strRootPackageName.Trim();

            if (strRoot.EndsWith('.'))
                return strRoot + model.Namespace;

            return strRoot + "." + model.Namespace;
        }

        public static string GetPackage(Model model, string strRootPackageName)
        {
            if (strRootPackageName == null || strRootPackageName.Trim().Length == 0)
                return model.Namespace;

            string strRoot = strRootPackageName.Trim();

            if (strRoot.EndsWith('.'))
                return strRoot + model.Namespace;

            return strRoot + "." + model.Namespace;
        }

        public static string GetFilePath(string strClassName, string strRelativePath, string strRootFolder, string strExt)
        {
            string[] tokens = strRelativePath.Split('.');
            string strFolder = strRootFolder;

            foreach (string strToken in tokens)
            {
                if (strFolder.EndsWith('\\') || strFolder.EndsWith('/'))
                    strFolder += strToken.Trim();
                else
                    strFolder += "\\" + strToken.Trim();

                if (Directory.Exists(strFolder) == false)
                    Directory.CreateDirectory(strFolder);
            }

            string strFilePath = strFolder + "\\" + strClassName + strExt;
            return strFilePath;
        }

        private string GetRelativePath(string strNamespace, string strRootFolder)
        {
            int index = strNamespace.IndexOf('.');

            while (index > 0)
            {
                string strTarget = strNamespace.Substring(0, index);

                if (strRootFolder.EndsWith(strTarget))
                    return strNamespace.Substring(index + 1);

                index = strNamespace.IndexOf('.', index + 1);
            }

            return strNamespace;
        }
    }
}
