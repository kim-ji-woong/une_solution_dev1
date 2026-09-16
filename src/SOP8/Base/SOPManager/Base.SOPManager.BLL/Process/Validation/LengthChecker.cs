using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using Response.Resource;

namespace Base.SOPManager.BLL.Process.Validation
{
    using Resource;

    class LengthChecker
    {
        public static string CheckTextLengthError(string strErrorMessage, IDataManager dataManager)
        {
            string strBeginTag = "잘린 값:";
            string strEndTag = "문이 종료되었습니다.";

            int index1 = strErrorMessage.IndexOf(strBeginTag);

            if (index1 > 0)
            {
                int index2 = strErrorMessage.LastIndexOf(strEndTag);

                if (index2 > index1)
                {
                    string strTableName = "", strFieldName = "";

                    if (GetFieldInfo(strErrorMessage, ref strTableName, ref strFieldName))
                    {
                        string strMessage;
                        int nTextLength = CustomManager.GetColumnMaximumLength(dataManager, strTableName, strFieldName, out strMessage);

                        if (nTextLength > 0)
                        {
                            string strFieldInfo = GetFieldDescription(strTableName, strFieldName);
                            return string.Format(ID.Get<ErrorMessageFormat>("fieldLengthOver").Value(), strFieldInfo, nTextLength);
                        }
                    }
                }
            }

            return strErrorMessage;
        }

        private static bool GetFieldInfo(string strMessage, ref string strTableName, ref string strFieldName)
        {
            string strTarget1 = "dbo.";
            int index = strMessage.IndexOf(strTarget1);

            if (index > 0)
            {
                string strTarget2 = "'의 열";
                int index2 = strMessage.IndexOf(strTarget2);

                if (index2 > index)
                {
                    int index3 = strMessage.IndexOf('\'', index2 + 1);

                    if (index3 > index2)
                    {
                        int index4 = strMessage.IndexOf('\'', index3 + 1);

                        if (index4 > 0)
                        {
                            strTableName = strMessage.Substring(index + strTarget1.Length, index2 - index - strTarget1.Length);
                            strFieldName = strMessage.Substring(index3 + 1, index4 - index3 - 1);
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private static string GetFieldDescription(string strTableName, string strFieldName)
        {
            strFieldName = strFieldName.ToLower();
            strTableName = strTableName.ToLower();

            string strComponent = "Component";

            if (strTableName.EndsWith("Transmission"))
                strComponent = "상황전파 Component";
            else if (strTableName.EndsWith("annotation"))
                return "설명 Component의 내용은";
            else if (strTableName.EndsWith("arrow"))
                return "화살표의 Text는";
            else if (strTableName.EndsWith("decision"))
                strComponent = "판단 Component";
            else if (strTableName.EndsWith("endpoint"))
                strComponent = "시작/종료 Component";
            else if (strTableName.EndsWith("process"))
                strComponent = "프로세스 Component";
            else if (strTableName.EndsWith("processexternalmission"))
                strComponent = "외부실행 Process";
            else if (strTableName.EndsWith("processmission"))
                strComponent = "프로세스 Component";
            else if (strTableName.EndsWith("version"))
            {
                if (strFieldName == "versionname")
                    return "SOP 버전명은";
                else if (strFieldName == "description")
                    return "SOP 버전의 부가설명은";
            }

            if (strFieldName == "text")
            {
                return strComponent + "의 제목은";
            }
            else if (strFieldName == "missionText")
            {
                return strComponent + "의 내용은";
            }
            else if (strFieldName == "message")
            {
                return strComponent + "의 내용은";
            }
            else if (strFieldName.Contains("script"))
            {
                return strComponent + "의 수식은";
            }
            else if (strFieldName.Contains("value"))
            {
                return strComponent + "의 text는";
            }

            return strComponent + "의 데이터는";
        }
    }
}
