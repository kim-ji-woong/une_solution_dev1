using System.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace MoveToVO.Process
{
    using Models;

    class DAOManager
    {
        private string m_strRootFolder = "";
        private string m_strRootPackageName = "";

        public DAOManager(string strRootFolder)
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

            string strFilePath = VOManager.GetFilePath(strClassName, model.SmallNamespace, m_strRootFolder, "DAO.java");
            // UTF-8 without BOM
            StreamWriter writer = new StreamWriter(strFilePath, false, new UTF8Encoding(false));

            writer.WriteLine(string.Format("package {0};", GetPackage(model)));
            writer.WriteLine("");

            writer.WriteLine("import java.util.Map;");
            writer.WriteLine("import java.util.HashMap;");
            writer.WriteLine("import java.util.List;");
            writer.WriteLine("");

            writer.WriteLine("import org.apache.ibatis.session.SqlSession;");
            writer.WriteLine("import org.springframework.beans.factory.annotation.Autowired;");
            writer.WriteLine("import org.springframework.stereotype.Repository;");
            writer.WriteLine("");

            writer.WriteLine("import egovframework.base.dal.DAOParent;");
            writer.WriteLine(string.Format("import {0}.{1};", VOManager.GetPackage(model, m_strRootPackageName), strClassName));
            writer.WriteLine("import egovframework.base.generic.Holder;");
            writer.WriteLine("");

            writer.WriteLine("@Repository");
            writer.WriteLine(string.Format("public class {0}DAO extends DAOParent {{", strClassName));
            writer.WriteLine("\t@Autowired");
            writer.WriteLine("\tprivate SqlSession sqlSession;");
            writer.WriteLine("");

            MakeSelects(writer, model, strClassName);
            writer.WriteLine("");

            MakeSelect(writer, model, strClassName);
            writer.WriteLine("");

            MakeInsert(writer, model, strClassName);
            writer.WriteLine("");

            MakeUpdate(writer, model, strClassName);
            writer.WriteLine("");

            MakeDelete(writer, model, strClassName);
            writer.WriteLine("}");
            writer.Close();

            return true;
        }

        private void MakeSelects(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\tpublic List<{0}> select{1}(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, String orderBy/* = null*/, Holder<String> errorMessage) {{", strClassName, GetPlural(model.ClassName)));
            writer.WriteLine("\t\tMap<String, Object> internalParams = new HashMap<>();");
            writer.WriteLine("\t\tString strCondition = makeCondition(params, additionalConditions);");
            writer.WriteLine("");

            writer.WriteLine("\t\tif (strCondition != null)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tinternalParams.put(\"customCondition\", strCondition);");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");

            writer.WriteLine("\t\tif (orderBy != null && !orderBy.trim().isEmpty())");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tinternalParams.put(\"orderBy\", orderBy);");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\t\tList<{0}> result = null;", strClassName));
            writer.WriteLine("");

            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tresult = sqlSession.selectList(\"{0}Mapper.select{1}\", internalParams);", GetFirstLower(strClassName), GetPlural(model.ClassName)));
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("\t\treturn result;");
            writer.WriteLine("\t}");
        }

        private void MakeSelect(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\tpublic {0} select{0}(Map<String, Object> params/* = null*/, String additionalConditions/* = null*/, Holder<String> errorMessage) {{", strClassName));
            writer.WriteLine("\t\tMap<String, Object> internalParams = new HashMap<>();");
            writer.WriteLine("\t\tString strCondition = makeCondition(params, additionalConditions);");
            writer.WriteLine("");

            writer.WriteLine("\t\tif (strCondition != null)");
            writer.WriteLine("\t\t{");
            writer.WriteLine("\t\t\tinternalParams.put(\"customCondition\", strCondition);");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\t\tList<{0}> result = null;", strClassName));
            writer.WriteLine("");

            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tresult = sqlSession.selectList(\"{0}Mapper.select{1}\", internalParams);", GetFirstLower(strClassName), GetPlural(model.ClassName)));
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t\treturn null;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("\t\treturn result.isEmpty() ? null : result.get(0);");
            writer.WriteLine("\t}");
        }

        private void MakeInsert(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\tpublic boolean insert{0}({0} {1}, Holder<String> errorMessage) {{", model.ClassName, GetFirstLower(model.ClassName)));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.insert(\"{0}Mapper.insert{1}\", {0});", GetFirstLower(model.ClassName), strClassName));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\tpublic boolean insert{0}(List<{1}> {2}, Holder<String> errorMessage) {{", GetPlural(model.ClassName), model.ClassName, GetPlural(GetFirstLower(model.ClassName))));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.insert(\"{0}Mapper.insert{1}\", {2});", GetFirstLower(model.ClassName), GetPlural(strClassName), GetPlural(GetFirstLower(model.ClassName))));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
        }

        private void MakeUpdate(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\tpublic boolean update{0}({0} {1}, Holder<String> errorMessage) {{", model.ClassName, GetFirstLower(model.ClassName)));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.update(\"{0}Mapper.update{1}\", {0});", GetFirstLower(model.ClassName), strClassName));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\tpublic boolean update{0}(Map<{0}.Fields, Object> updates, String condition, Holder<String> errorMessage) {{", model.ClassName));
            writer.WriteLine("\t\tString strSets = makeSet(updates);");
            writer.WriteLine("");
            writer.WriteLine("\t\tMap<String, Object> params = new HashMap<>();");
            writer.WriteLine("\t\tparams.put(\"setStatement\", strSets);");
            writer.WriteLine("");
            writer.WriteLine("\t\tif (condition != null && !condition.trim().isEmpty()) {");
            writer.WriteLine("\t\t\tparams.put(\"customCondition\", condition);");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine(string.Format("\t\treturn update{0}(params, errorMessage);", model.ClassName));
            writer.WriteLine("\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\tpublic boolean update{0}(Map<String, Object> params, Holder<String> errorMessage) {{", model.ClassName));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.update(\"{0}Mapper.update{1}ByCondition\", params);", GetFirstLower(model.ClassName), model.ClassName));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
        }

        private void MakeDelete(StreamWriter writer, Model model, string strClassName)
        {
            writer.WriteLine(string.Format("\tpublic boolean delete{0}({0} {1}, Holder<String> errorMessage) {{", model.ClassName, GetFirstLower(model.ClassName)));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.delete(\"{0}Mapper.delete{1}\", {0});", GetFirstLower(model.ClassName), strClassName));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
            writer.WriteLine("");

            writer.WriteLine(string.Format("\tpublic boolean delete{0}(String condition, Holder<String> errorMessage) {{", model.ClassName));
            writer.WriteLine("\t\terrorMessage.value = null;");
            writer.WriteLine("");
            writer.WriteLine("\t\tMap<String, Object> params = new HashMap<>();");
            writer.WriteLine("");
            writer.WriteLine("\t\tif (condition != null && !condition.trim().isEmpty()) {");
            writer.WriteLine("\t\t\tparams.put(\"customCondition\", condition);");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\ttry {");
            writer.WriteLine(string.Format("\t\t\tsqlSession.delete(\"{0}Mapper.delete{1}ByCondition\", params);", GetFirstLower(model.ClassName), model.ClassName));
            writer.WriteLine("\t\t\treturn true;");
            writer.WriteLine("\t\t}");
            writer.WriteLine("\t\tcatch (Exception e) {");
            writer.WriteLine("\t\t\terrorMessage.value = e.getMessage();");
            writer.WriteLine("\t\t}");
            writer.WriteLine("");
            writer.WriteLine("\t\treturn false;");
            writer.WriteLine("\t}");
        }

        public static string GetPlural(string strName)
        {
            if (strName.EndsWith("y") || strName.EndsWith("Y"))
                return strName.Substring(0, strName.Length - 1) + "ies";
            else if (strName.EndsWith("s") || strName.EndsWith("S"))
                return strName + "es";

            return strName + "s";
        }

        public static string GetFirstLower(string strName)
        {
            return strName.Substring(0, 1).ToLower() + strName.Substring(1);
        }

        private string GetPackage(Model model)
        {
            string strNamespace = model.Namespace.Replace(".model.", ".dal.");

            if (m_strRootPackageName == null || m_strRootPackageName.Trim().Length == 0)
                return strNamespace;

            string strRoot = m_strRootPackageName.Trim();

            if (strRoot.EndsWith('.'))
                return strRoot + strNamespace;

            return strRoot + "." + strNamespace;
        }
    }
}
