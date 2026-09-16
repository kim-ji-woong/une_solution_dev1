using System.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace MoveToVO.Process
{
    using Models;

    class MapperManager
    {
        private string m_strRootFolder = "";
        private string m_strRootPackageName = "";

        public MapperManager(string strRootFolder)
        {
            m_strRootFolder = strRootFolder;
            m_strRootPackageName = ConfigurationManager.AppSettings.Get("RootPackageName");
        }

        public bool MakeFiles(List<Model> models)
        {
            // 클래스 이름 중복을 막기위한 장치
            Dictionary<string, string> dicClassNames = new Dictionary<string, string>();

            foreach (Model model in models)
            {
                MakeFile(model, dicClassNames);
            }

            return true;
        }

        private bool MakeFile(Model model, Dictionary<string, string> dicClassNames)
        {
            string strClassName = model.ClassName;

            if (dicClassNames.ContainsKey(model.ClassName))
            {
                strClassName = VOManager.GetPackageHeader(model) + strClassName;
                dicClassNames[strClassName] = model.ClassName;
            }
            else
                dicClassNames[model.ClassName] = model.ClassName;

            string strFilePath = VOManager.GetFilePath(DAOManager.GetFirstLower(strClassName), model.SmallNamespace, m_strRootFolder, "Mapper.xml");
            // UTF-8 without BOM
            StreamWriter writer = new StreamWriter(strFilePath, false, new UTF8Encoding(false));

            writer.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
            writer.WriteLine("<!DOCTYPE mapper");
            writer.WriteLine("  PUBLIC \" -//mybatis.org//DTD Mapper 3.0//EN\"");
            writer.WriteLine("  \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">");
            writer.WriteLine("");

            writer.WriteLine(string.Format("<mapper namespace=\"{0}Mapper\">", DAOManager.GetFirstLower(strClassName)));
            writer.WriteLine("");

            MakeSelect(writer, model, strClassName);
            MakeInsert(writer, model, strClassName);
            MakeUpdate(writer, model, strClassName);
            MakeDelete(writer, model, strClassName);

            writer.WriteLine("</mapper>");
            writer.Close();

            return true;
        }

        private void MakeSelect(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\t<select id=\"select{0}\" parameterType=\"map\" resultType=\"{1}.{2}\">", DAOManager.GetPlural(model.ClassName), VOManager.GetPackage(model, m_strRootPackageName), strClassName));
            writer.WriteLine(string.Format("\t\tSelect * from {0}", model.TableName));
            writer.WriteLine("\t\t<if test=\"customCondition != null and customCondition != ''\">");
            writer.WriteLine("\t\t\tWHERE ${customCondition}");
            writer.WriteLine("\t\t</if>");
            writer.WriteLine("\t\t<if test=\"orderBy != null and orderBy != ''\">");
            writer.WriteLine("\t\tORDER BY ${orderBy}");
            writer.WriteLine("\t\t</if>");
            writer.WriteLine("\t</select>");
            writer.WriteLine("");
        }

        private void MakeInsert(StreamWriter writer, Model model, string strClassName)
        {
            if (model.AutoIncreaseField == null)
            {
                writer.WriteLine(string.Format("\t<insert id=\"insert{0}\" parameterType=\"{1}.{2}\">", model.ClassName, VOManager.GetPackage(model, m_strRootPackageName), strClassName));
            }
            else
            {
                writer.WriteLine(string.Format("\t<insert id=\"insert{0}\" parameterType=\"{1}.{2}\" useGeneratedKeys=\"true\" keyProperty=\"{3}\">", model.ClassName, VOManager.GetPackage(model, m_strRootPackageName), strClassName, model.AutoIncreaseField));
            }

            writer.WriteLine(string.Format("\t\tINSERT INTO {0} ({1})", model.TableName, model.GetAllFields()));
            writer.WriteLine(string.Format("\t\tVALUES ({0})", model.GetAllFields(true, true)));
            writer.WriteLine("\t</insert>");
            writer.WriteLine("");

            if (model.AutoIncreaseField == null)
            {
                writer.WriteLine(string.Format("\t<insert id=\"insert{0}\" parameterType=\"java.util.List\">", DAOManager.GetPlural(model.ClassName)));
            }
            else
            {
                writer.WriteLine(string.Format("\t<insert id=\"insert{0}\" parameterType=\"java.util.List\" useGeneratedKeys=\"true\" keyProperty=\"{1}\">", DAOManager.GetPlural(model.ClassName), model.AutoIncreaseField));
            }

            string strObjName = DAOManager.GetFirstLower(strClassName);

            writer.WriteLine(string.Format("\t\tINSERT INTO {0} ({1})", model.TableName, model.GetAllFields()));
            writer.WriteLine("\t\tVALUES");
            writer.WriteLine(string.Format("\t\t<foreach collection=\"list\" item=\"{0}\" separator=\",\">", strObjName));
            writer.WriteLine("\t\t\t(");
            writer.WriteLine(string.Format("\t\t\t\t({0})", model.GetAllFields(true, true, strObjName)));
            writer.WriteLine("\t\t\t)");
            writer.WriteLine("\t\t</foreach>");
            writer.WriteLine("\t</insert>");
            writer.WriteLine("");
        }

        private void MakeUpdate(StreamWriter writer, Model model, string strClassName)
        {
            string strSets = model.MakeSetString();
            string strCondition = model.GetPrimaryCondition();

            if (strSets != null)
            {
                writer.WriteLine(string.Format("\t<update id=\"update{0}\" parameterType=\"{1}.{2}\">", model.ClassName, VOManager.GetPackage(model, m_strRootPackageName), strClassName));
                writer.WriteLine(string.Format("\t\tUPDATE {0}", model.TableName));
                writer.WriteLine(string.Format("\t\tSET {0}", strSets));

                if (strCondition != null)
                {
                    writer.WriteLine("\t\t<where>");
                    writer.WriteLine(string.Format("\t\t\t{0}", strCondition));
                    writer.WriteLine("\t\t</where>");
                    writer.WriteLine("\t</update>");
                    writer.WriteLine("");
                }
            }

            writer.WriteLine(string.Format("\t<update id=\"update{0}ByCondition\" parameterType=\"map\">", model.ClassName));
            writer.WriteLine(string.Format("\t\tUPDATE {0}", model.TableName));
            writer.WriteLine("\t\tSET ${setStatement}");
            writer.WriteLine("\t\t<if test=\"customCondition != null and customCondition != ''\">");
            writer.WriteLine("\t\t\tWHERE ${customCondition}");
            writer.WriteLine("\t\t</if>");
            writer.WriteLine("\t</update>");
            writer.WriteLine("");
        }

        private void MakeDelete(StreamWriter writer, Model model, string strClassName)
        {
            string strCondition = model.GetPrimaryCondition();

            writer.WriteLine(string.Format("\t<delete id=\"delete{0}\" parameterType=\"{1}.{2}\">", model.ClassName, VOManager.GetPackage(model, m_strRootPackageName), strClassName));
            writer.WriteLine(string.Format("\t\tDELETE FROM {0}", model.TableName));

            if (strCondition != null)
            {
                writer.WriteLine("\t\t<where>");
                writer.WriteLine(string.Format("\t\t\t{0}", strCondition));
                writer.WriteLine("\t\t</where>");
                writer.WriteLine("\t</delete>");
                writer.WriteLine("");
            }

            writer.WriteLine(string.Format("\t<delete id=\"delete{0}ByCondition\" parameterType=\"map\">", model.ClassName));
            writer.WriteLine(string.Format("\t\tDELETE FROM {0}", model.TableName));
            writer.WriteLine("\t\t<if test=\"customCondition != null and customCondition != ''\">");
            writer.WriteLine("\t\t\tWHERE ${customCondition}");
            writer.WriteLine("\t\t</if>");
            writer.WriteLine("\t</delete>");
            writer.WriteLine("");
        }
    }
}
