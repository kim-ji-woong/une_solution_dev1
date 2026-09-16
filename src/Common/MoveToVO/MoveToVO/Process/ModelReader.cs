using System.Text;
using System.Collections.Generic;
using System.IO;

namespace MoveToVO.Process
{
    using Models;

    class ModelReader
    {
        public static List<Model> ReadModels(string strFolder)
        {
            List<Model> models = new List<Model>();

            if (Directory.Exists(strFolder))
            {
                string[] files = Directory.GetFiles(strFolder);

                foreach (string file in files)
                {
                    if (file.ToLower().EndsWith(".cs"))
                    {
                        Model model = ReadModel(file);

                        if (model != null)
                            models.Add(model);
                    }
                }

                string[] folders = Directory.GetDirectories(strFolder);

                foreach (string folder in folders)
                {
                    List<Model> _models = ReadModels(folder);
                    models.AddRange(_models);
                }
            }

            return models;
        }

        private static Model ReadModel(string strPath)
        {
            StreamReader reader = new StreamReader(strPath, Encoding.UTF8);
            Model model = null;

            string strFirstField = null, strFirstWriteField = null;
            string strNamespace = null;

            bool primaryCondition = false;

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                if (model == null)
                {
                    if (strLine.StartsWith("namespace"))
                        strNamespace = ReadNamespace(strLine);
                    else if (strLine.Contains("class"))
                    {
                        if (strLine.Contains("Table"))
                        {
                            model = new Model();
                            model.Namespace = strNamespace;
                            ReadClassName(model, strLine);
                        }
                        else
                            return null;

                        continue;
                    }
                }
                else
                {
                    if (strLine.EndsWith("GetPrimaryCondition()"))
                        primaryCondition = true;
                    else
                    {
                        if (primaryCondition)
                        {
                            if (strLine.EndsWith("}"))
                                primaryCondition = false;
                            else if (strLine.Contains("string.Format"))
                                SetPrimaryKeys(model, strLine);
                        }
                        else
                        {
                            if (strLine.Contains("override") || strLine.Contains("void"))
                                continue;
                            else if (strLine.Contains("enum"))
                                CheckAutoIncrease(model, strLine, ref strFirstField, ref strFirstWriteField);
                            else if (strLine.Contains("TableName"))
                                ReadTableName(model, strLine);
                            else
                                ReadVariable(model, strLine);
                        }
                    }
                }
            }

            reader.Close();
            return model;
        }

        private static void SetPrimaryKeys(Model model, string strLine)
        {
            string strTarget = "Fields.";

            int index = strLine.IndexOf(strTarget);

            while (index > 0)
            {
                int index2 = strLine.IndexOf(',', index);

                if (index2 > index)
                {
                    string strField = strLine.Substring(index + strTarget.Length, index2 - (index + strTarget.Length));
                    model.AddPrimaryKey(strField);
                }

                index = strLine.IndexOf(strTarget, index2 + 1);
            }
        }

        private static bool ReadClassName(Model model, string strLine)
        {
            string[] tokens = strLine.Split(' ');

            if (tokens.Length < 3)
                return false;

            string strClassName = tokens[2].Trim();

            int index = strClassName.IndexOf(':');

            if (index > 0)
                strClassName = strClassName.Substring(0, index);

            model.ClassName = strClassName;
            return true;
        }

        private static string ReadNamespace(string strLine)
        {
            string[] tokens = strLine.Split(' ');

            if (tokens.Length < 2)
                return null;

            return tokens[1].Trim().ToLower();
        }

        private static void CheckAutoIncrease(Model model, string strLine, ref string strFirstField, ref string strFirstWriteField)
        {
            string[] tokens = strLine.Split(' ');
            int tokenCount = tokens.Length;

            if (tokenCount < 4)
                return;

            if (tokens[0].Trim() != "public")
                return;

            string strFirst = null;

            for (int i=3;i<tokenCount;i++)
            {
                string strToken = tokens[i].Trim();

                if (i == 3)
                {
                    if (strToken.StartsWith("{"))
                    {
                        if (strToken.Length > 1)
                        {
                            strFirst = strToken.Substring(1);
                            break;
                        }
                    }
                    else
                        return;
                }
                else
                {
                    strFirst = strToken;
                    break;
                }
            }

            if (strFirst != null)
            {
                int index = strFirst.IndexOf(',');

                if (index > 0)
                    strFirst = strFirst.Substring(0, index);
            }
            else
                return;

            string strName = tokens[2].Trim();

            if (strName == "Fields")
            {
                strFirstField = strFirst;

                if (strFirstWriteField != null)
                {
                    if (strFirstField != strFirstWriteField)
                        model.AutoIncreaseField = strFirstField;
                    //model.IsAutoIncrease = strFirstField != strFirstWriteField;
                }
            }
            else if (strName == "WriteFields")
            {
                strFirstWriteField = strFirst;

                if (strFirstField != null)
                {
                    if (strFirstField != strFirstWriteField)
                        model.AutoIncreaseField = strFirstField;
                    //model.IsAutoIncrease = strFirstField != strFirstWriteField;
                }
            }
        }

        private static void ReadVariable(Model model, string strLine)
        {
            bool nullable = false;
            if (strLine.Contains("nullable"))
            {
                strLine = strLine.Replace("/* ", "");
                strLine = strLine.Replace("nullable", "");
                strLine = strLine.Replace(" */", "");
                nullable = true;
            }
            
            string[] tokens = strLine.Split(' ');
            
            if (tokens.Length < 4)
                return;

            if (tokens[0].Trim() != "public")
                return;

            if (tokens[1].Trim() == "static")
                return;

            if (tokens[3].Trim().StartsWith("{") == false)
                return;

            model.AddVariable(tokens[2].Trim(), nullable ? "nullable " + tokens[1].Trim() : tokens[1].Trim());
        }

        private static void ReadTableName(Model model, string strLine)
        {
            int index1 = strLine.IndexOf('"');
            int index2 = strLine.LastIndexOf('"');

            if (index1 > 0 && index2 > index1)
            {
                model.TableName = strLine.Substring(index1 + 1, index2 - index1 - 1);
            }
        }
    }
}
