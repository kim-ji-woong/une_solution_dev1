using System;
using Base.SOPManager.IBLL.Request;
using Base.SOPManager.IBLL.Response;
using Response.Resource;

namespace Base.SOPManager.BLL.Process.Utility
{
    using Resource;
    using Models;

    class Parser
    {
        public static ResponseParseSpecialMessage ParseSpecialMessage(RequestParseSpecialMessage data)
        {
            string strErrorMessage;
            DateTime? time = data.GetTime(out strErrorMessage);

            if (time == null)
            {
                strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("invalidDateTimeString").Value(), data.Time);
                return new ResponseParseSpecialMessage(false, "", strErrorMessage);
            }

            DataParameter parameter = new DataParameter(data.Message, (DateTime)time);

            if (data.Location != null && data.Location.Length > 0)
                parameter.Place = data.Location;

            parameter.RealMode = data.IsRealMode;
            parameter.NormalMode = data.IsNormalMode;

            string strKey, strValue;

            foreach (string strVariable in data.Variables)
            {
                if (RequestParseSpecialMessage.GetVariableData(strVariable, out strKey, out strValue))
                {
                    parameter.AddData(strKey, strValue);
                }
            }

            string strParse = Parse(parameter);
            return new ResponseParseSpecialMessage(true, strParse, null);
        }

        static private string Parse(DataParameter param)
        {
            string strResult = "";
            int nBeginIndex = 0;

            int nLen = param.Message.Length;

            while (nBeginIndex >= 0 && nBeginIndex < nLen)
            {
                int nIndex1 = param.Message.IndexOf('{', nBeginIndex);

                if (nIndex1 < 0)
                {
                    strResult += param.Message.Substring(nBeginIndex);
                    return strResult;
                }

                int nIndex2 = param.Message.IndexOf('}', nIndex1 + 1);

                if (nIndex2 < 0)
                {
                    strResult += param.Message.Substring(nBeginIndex);
                    return strResult;
                }

                if (nIndex1 > nBeginIndex)
                    strResult += param.Message.Substring(nBeginIndex, nIndex1 - nBeginIndex);

                strResult += ChangeSpecialMessage(param.Message.Substring(nIndex1, nIndex2 - nIndex1 + 1), param, strResult);
                nBeginIndex = nIndex2 + 1;
            }

            return strResult;
        }

        static private string ChangeSpecialMessage(string strToken, DataParameter param, string strPrevText)
        {
            int nLen = strToken.Length;
            int nBeginIndex = GetNotEmptyIndex(strToken, 1);

            if (nBeginIndex < 0)
                return strToken;

            string strTag = "";

            bool isPositive = true;
            int nPlusIndex = GetPlusMinusIndex(strToken, ref isPositive, nBeginIndex);
            int nColonIndex = strToken.IndexOf(':', nBeginIndex);
            int nEndIndex = nLen - 1;

            for (int i = nEndIndex; i >= nBeginIndex; i--)
            {
                char ch = strToken[i];

                if (ch != ' ' && ch != '\t' && ch != '\r' && ch != '\n')
                {
                    nEndIndex = i;
                    break;
                }
            }

            if (nColonIndex >= 0)
            {
                if (nColonIndex > nBeginIndex)
                    strTag = strToken.Substring(nBeginIndex, nColonIndex - nBeginIndex);

                nBeginIndex = nColonIndex + 1;
            }
            else if (nPlusIndex >= 0)
            {
                if (nPlusIndex > nBeginIndex)
                {
                    strTag = strToken.Substring(nBeginIndex, nPlusIndex - nBeginIndex).Trim();
                }

                nBeginIndex = nPlusIndex;
            }
            else
            {
                strTag = strToken.Substring(nBeginIndex, nEndIndex - nBeginIndex);
                nBeginIndex = nBeginIndex + strTag.Length;
            }

            string strResult = "";
            string strHangulDefault = "", strHangulHasUnder = "", strHangulNoUnder = "";

            strTag = strTag.Trim();

            if (string.Compare(strTag, "time", true) == 0)
            {
                if (GetTimeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.Time))
                    return strResult;
            }
            else if (string.Compare(strTag, "location", true) == 0)
            {
                if (GetLocationString(ref strResult, nBeginIndex, nEndIndex, strToken, param.Place))
                    return strResult;
            }
            else if (string.Compare(strTag, "real_day", true) == 0 && nColonIndex >= 0)
            {
                // 실제모드 && 주간모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == true && param.NormalMode == true))
                    return strResult;
            }
            else if (string.Compare(strTag, "real_night", true) == 0 && nColonIndex >= 0)
            {
                // 실제모드 && 야간 및 휴일모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == true && param.NormalMode == false))
                    return strResult;
            }
            else if (string.Compare(strTag, "virtual_day", true) == 0 && nColonIndex >= 0)
            {
                // 훈련모드 && 주간모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == false && param.NormalMode == true))
                    return strResult;
            }
            else if (string.Compare(strTag, "virtual_night", true) == 0 && nColonIndex >= 0)
            {
                // 훈련모드 && 야간 및 휴일모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == false && param.NormalMode == false))
                    return strResult;
            }
            else if (string.Compare(strTag, "real", true) == 0 && nColonIndex >= 0)
            {
                // 실제모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == true))
                    return strResult;
            }
            else if (string.Compare(strTag, "virtual", true) == 0 && nColonIndex >= 0)
            {
                //  훈련모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.RealMode == false))
                    return strResult;
            }
            else if (string.Compare(strTag, "day", true) == 0 && nColonIndex >= 0)
            {
                // 평일모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.NormalMode == true))
                    return strResult;
            }
            else if (string.Compare(strTag, "night", true) == 0 && nColonIndex >= 0)
            {
                //  야간 및 휴일모드에서만 나오는 문자열
                if (GetModeString(ref strResult, nBeginIndex, nEndIndex, strToken, param.NormalMode == false))
                    return strResult;
            }
            else if (string.Compare(strTag, "sopmode", true) == 0)
            {
                if (GetSOPModeString(ref strResult, param.RealMode))
                    return strResult;
            }
            else if (string.Compare(strTag, "sopfullmode", true) == 0)
            {
                if (GetSOPFullModeString(ref strResult, param.RealMode))
                    return strResult;
            }
            else if (string.Compare(strTag, "psmmaterial", true) == 0)
            {
                bool success;
                object data = param.GetData("PSMMaterialType", out success);

                if (data == null)
                    return "";
                else if (data is string)
                    return (string)data;

                return "";
            }
            else if (string.Compare(strTag, "psmdistancem", true) == 0)
            {
                bool success;
                object data = param.GetData("PSMDistance", out success);

                if (data == null)
                    return "0 미터";
                else if (data is int)
                    return string.Format("{0} 미터", (int)data);

                return "0 미터";
            }
            else if (string.Compare(strTag, "psmdistancekm", true) == 0)
            {
                bool success;
                object data = param.GetData("PSMDistance", out success);

                if (data == null)
                    return "0 킬로미터";
                else if (data is int)
                {
                    int distance = (int)data;

                    if (distance >= 100)
                        return string.Format("{0:F1} 킬로미터", distance * 0.001);
                    else if (distance >= 10)
                        return string.Format("{0:F2} 킬로미터", distance * 0.001);
                    else
                        return string.Format("{0:F3} 킬로미터", distance * 0.001);
                }

                return "0 킬로미터";
            }
            else if (string.Compare(strTag, "snow_depth", true) == 0)
            {
                bool success;
                object data = param.GetData("AmountSnowFall", out success);
                string strAmountSnowFall = data == null ? "" : data.ToString();

                if (GetSnowDepthString(ref strResult, nBeginIndex, nEndIndex, strToken, strAmountSnowFall))
                    return strResult;
            }
            else if (IsHangulMethod(strTag, ref strHangulDefault, ref strHangulHasUnder, ref strHangulNoUnder))
            {
                int nResult = HasHangulUnder(strPrevText);

                if (nResult == 1)
                    return strHangulHasUnder;
                else if (nResult == 0)
                    return strHangulNoUnder;
                else
                    return strHangulDefault;
            }

            return strToken;
        }

        // Return 값 : 1(한글이면서 받침으로 끝난다.)
        //             0(한글이면서 받침이 아닌것으로 끝난다.)
        //            -1(한글이 아니다.)
        static private int HasHangulUnder(string str)
        {
            str = str.Trim();

            if (str.Length == 0)
                return -1;

            int ch = 0;

            // 앞글자가 괄호나 쉼표같은 특수문자일 경우 글자가 나올때까지 탐색한다.
            for (int i = str.Length - 1; i >= 0; i--)
            {
                char _ch = str[i];

                if (_ch == '0')
                {
                    _ch = '영';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '1')
                {
                    _ch = '일';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '2')
                {
                    _ch = '이';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '3')
                {
                    _ch = '삼';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '4')
                {
                    _ch = '사';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '5')
                {
                    _ch = '오';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '6')
                {
                    _ch = '육';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '7')
                {
                    _ch = '칠';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '8')
                {
                    _ch = '팔';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch == '9')
                {
                    _ch = '구';
                    ch = (int)_ch;
                    break;
                }
                else if (_ch >= 'a' && _ch <= 'z')
                    return -1;
                else if (_ch >= 'A' && _ch <= 'Z')
                    return -1;
                else if (IsHangul(_ch))
                {
                    ch = (int)_ch;
                    break;
                }
            }

            if (IsHangul(ch))
            {
                if ((ch - 0xac00) % 28 != 0)
                    return 1;
                else
                    return 0;
            }

            return -1;
        }

        static private bool IsHangul(int ch)
        {
            return ch >= 0xac00 && ch <= 0xd7a3;
        }

        static private bool IsHangulMethod(string strTag, ref string strDefault, ref string strHasUnder, ref string strNoUnder)
        {
            if (strTag == "은는")
            {
                strDefault = "은";
                strHasUnder = "은";
                strNoUnder = "는";
            }
            else if (strTag == "는은")
            {
                strDefault = "는";
                strHasUnder = "은";
                strNoUnder = "는";
            }
            else if (strTag == "이가")
            {
                strDefault = "이";
                strHasUnder = "이";
                strNoUnder = "가";
            }
            else if (strTag == "가이")
            {
                strDefault = "가";
                strHasUnder = "이";
                strNoUnder = "가";
            }
            else if (strTag == "을를")
            {
                strDefault = "을";
                strHasUnder = "을";
                strNoUnder = "를";
            }
            else if (strTag == "를을")
            {
                strDefault = "를";
                strHasUnder = "을";
                strNoUnder = "를";
            }
            else if (strTag == "과와")
            {
                strDefault = "과";
                strHasUnder = "과";
                strNoUnder = "와";
            }
            else if (strTag == "와과")
            {
                strDefault = "와";
                strHasUnder = "과";
                strNoUnder = "와";
            }
            else
                return false;

            return true;
        }

        static public bool GetSOPFullModeString(ref string strResult, bool? isRealMode)
        {
            if (isRealMode == true)
                strResult = "실제상황";
            else if (isRealMode == false)
                strResult = "훈련상황";
            else
                return false;

            return true;
        }

        static public bool GetSOPModeString(ref string strResult, bool? isRealMode)
        {
            if (isRealMode == true)
                strResult = "실제";
            else if (isRealMode == false)
                strResult = "훈련";
            else
                return false;

            return true;
        }

        static private bool GetModeString(ref string strResult, int nBeginIndex, int nEndIndex, string strToken, bool use)
        {
            if (!use)
            {
                strResult = "";
                return true;
            }

            strResult = strToken.Substring(nBeginIndex, nEndIndex - nBeginIndex);
            return true;
        }

        static private bool GetLocationString(ref string strResult, int nBeginIndex, int nEndIndex, string strToken, string strPlace)
        {
            int nIndex = GetNotEmptyIndex(strToken, nBeginIndex, nEndIndex - 1);

            if (nIndex >= 0)
                return false;

            strResult = strPlace;
            return true;
        }

        static private bool GetSnowDepthString(ref string strResult, int nBeginIndex, int nEndIndex, string strToken, string strAmountSnowfall)
        {
            int nIndex = GetNotEmptyIndex(strToken, nBeginIndex, nEndIndex - 1);

            if (nIndex >= 0)
                return false;

            strResult = strAmountSnowfall;
            return true;
        }

        static private bool GetDefaultTimeString(ref string strResult, DateTime dtTime)
        {
            strResult = string.Format("{0}년 {1}월 {2}일 {3}시 {4}분", dtTime.Year, dtTime.Month, dtTime.Day, dtTime.Hour, dtTime.Minute);
            return true;
        }

        static private int GetPlusMinusIndex(string str, ref bool isPositive, int nBeginIndex = 0)
        {
            int nLen = str.Length;

            for (int i = nBeginIndex; i < nLen; i++)
            {
                char ch = str[i];

                if (ch == '+')
                    isPositive = true;
                else if (ch == '-')
                    isPositive = false;
                else
                    continue;

                return i;
            }

            return -1;
        }

        static private bool GetTimeString(ref string strResult, int nBeginIndex, int nEndIndex, string strToken, DateTime dtTime)
        {
            if (nEndIndex == nBeginIndex)
                return GetDefaultTimeString(ref strResult, dtTime);

            string strOption = strToken.Substring(nBeginIndex, nEndIndex - nBeginIndex).Trim();

            if (strOption.Length == 0)
                return GetDefaultTimeString(ref strResult, dtTime);

            bool useYear = true, useMonth = true, useDay = true, useHour = true, useMinute = true, useSecond = false;

            bool isPositive = true;
            int nIndex = GetPlusMinusIndex(strToken, ref isPositive);

            if (nIndex < 0)
            {
                if (!GetTimeOption(strOption, ref useYear, ref useMonth, ref useDay, ref useHour, ref useMinute, ref useSecond))
                    return false;
            }
            else
            {
                strOption = strToken.Substring(nBeginIndex, nIndex - nBeginIndex).Trim();

                if (strOption.Length > 0)
                {
                    if (!GetTimeOption(strOption, ref useYear, ref useMonth, ref useDay, ref useHour, ref useMinute, ref useSecond))
                        return false;
                }

                int nAddYear = 0, nAddMonth = 0, nAddDay = 0, nAddHour = 0, nAddMinute = 0, nAddSecond = 0;

                while (nIndex >= 0)
                {
                    nBeginIndex = GetNotEmptyIndex(strToken, nIndex + 1, nEndIndex);

                    if (nBeginIndex < 0)
                        return false;

                    int nIndex2 = GetEmptyIndex(strToken, nBeginIndex + 1, nEndIndex);

                    bool tempFlag = true;
                    int nIndex3 = GetPlusMinusIndex(strToken, ref tempFlag, nBeginIndex + 1);

                    if ((nIndex3 >= 0 && nIndex3 < nIndex2) ||
                        (nIndex3 >= 0 && nIndex2 < 0))
                        nIndex2 = nIndex3;

                    int nLastIndex = nIndex2 < 0 ? nEndIndex - 1 : nIndex2 - 1;

                    string strAddTag = strToken.Substring(nBeginIndex, nLastIndex - nBeginIndex + 1);

                    if (!SetAddTime(strAddTag, isPositive, ref nAddYear, ref nAddMonth, ref nAddDay, ref nAddHour, ref nAddMinute, ref nAddSecond))
                        return false;

                    nIndex = GetPlusMinusIndex(strToken, ref isPositive, nIndex + 1);
                }

                if (nAddYear != 0)
                    dtTime = dtTime.AddYears(nAddYear);

                if (nAddMonth != 0)
                    dtTime = dtTime.AddMonths(nAddMonth);

                if (nAddDay != 0)
                    dtTime = dtTime.AddDays(nAddDay);

                if (nAddHour != 0)
                    dtTime = dtTime.AddHours(nAddHour);

                if (nAddMinute != 0)
                    dtTime = dtTime.AddMinutes(nAddMinute);

                if (nAddSecond != 0)
                    dtTime = dtTime.AddSeconds(nAddSecond);
            }

            if (!useYear && !useMonth && !useDay && !useHour && !useMinute && !useSecond)
                return false;

            if (useYear)
                strResult = string.Format("{0}년", dtTime.Year);

            if (useMonth)
            {
                if (strResult.Length > 0)
                    strResult += string.Format(" {0}월", dtTime.Month);
                else
                    strResult = string.Format("{0}월", dtTime.Month);
            }

            if (useDay)
            {
                if (strResult.Length > 0)
                    strResult += string.Format(" {0}일", dtTime.Day);
                else
                    strResult = string.Format("{0}일", dtTime.Day);
            }

            if (useHour)
            {
                if (strResult.Length > 0)
                    strResult += string.Format(" {0}시", dtTime.Hour);
                else
                    strResult = string.Format("{0}시", dtTime.Hour);
            }

            if (useMinute)
            {
                if (strResult.Length > 0)
                    strResult += string.Format(" {0}분", dtTime.Minute);
                else
                    strResult = string.Format("{0}분", dtTime.Minute);
            }

            if (useSecond)
            {
                if (strResult.Length > 0)
                    strResult += string.Format(" {0}초", dtTime.Second);
                else
                    strResult = string.Format("{0}초", dtTime.Second);
            }

            return true;
        }

        static private bool SetAddTime(string strAddTag, bool isPositive, ref int nAddYear, ref int nAddMonth, ref int nAddDay, ref int nAddHour, ref int nAddMinute, ref int nAddSecond)
        {
            int nLen = strAddTag.Length;

            for (int i = 0; i < nLen; i++)
            {
                char ch = strAddTag[i];

                if (ch < '0' || ch > '9')
                {
                    if (i == 0)
                        return false;

                    string strNum = strAddTag.Substring(0, i);
                    int num = int.Parse(strNum);

                    string strOpt = strAddTag.Substring(i);

                    if (strOpt.Length > 1)
                        return false;

                    if (strOpt == "Y")
                    {
                        if (isPositive)
                            nAddYear += num;
                        else
                            nAddYear -= num;
                    }
                    else if (strOpt == "M")
                    {
                        if (isPositive)
                            nAddMonth += num;
                        else
                            nAddMonth -= num;
                    }
                    else if (strOpt == "D")
                    {
                        if (isPositive)
                            nAddDay += num;
                        else
                            nAddDay -= num;
                    }
                    else if (strOpt == "h")
                    {
                        if (isPositive)
                            nAddHour += num;
                        else
                            nAddHour -= num;
                    }
                    else if (strOpt == "m")
                    {
                        if (isPositive)
                            nAddMinute += num;
                        else
                            nAddMinute -= num;
                    }
                    else if (strOpt == "s")
                    {
                        if (isPositive)
                            nAddSecond += num;
                        else
                            nAddSecond -= num;
                    }
                    else
                        return false;

                    return true;
                }
            }

            return false;
        }

        static private bool GetTimeOption(string strOption, ref bool useYear, ref bool useMonth, ref bool useDay, ref bool useHour, ref bool useMinute, ref bool useSecond)
        {
            useYear = false;
            useMonth = false;
            useDay = false;
            useHour = false;
            useMinute = false;
            useSecond = false;

            int nLen = strOption.Length;

            for (int i = 0; i < nLen; i++)
            {
                char ch = strOption[i];

                if (ch == 'Y')
                    useYear = true;
                else if (ch == 'M')
                    useMonth = true;
                else if (ch == 'D')
                    useDay = true;
                else if (ch == 'h')
                    useHour = true;
                else if (ch == 'm')
                    useMinute = true;
                else if (ch == 's')
                    useSecond = true;
                else
                    return false;
            }

            return true;
        }

        static private int GetEmptyIndex(string str, int nBeginIndex, int nEndIndex = -1)
        {
            if (nEndIndex < 0)
                nEndIndex = str.Length - 1;

            for (int i = nBeginIndex; i <= nEndIndex; i++)
            {
                char ch = str[i];

                if (ch == ' ' || ch == '\t' || ch == '\r' || ch == '\n')
                    return i;
            }

            return -1;
        }

        static private int GetNotEmptyIndex(string str, int nBeginIndex, int nEndIndex = -1)
        {
            if (nEndIndex < 0)
                nEndIndex = str.Length - 1;

            for (int i = nBeginIndex; i <= nEndIndex; i++)
            {
                char ch = str[i];

                if (ch != ' ' && ch != '\t' && ch != '\r' && ch != '\n')
                    return i;
            }

            return -1;
        }

        static private int GetEmptyLastIndex(string str, int nEndIndex, int nBeginIndex = 0)
        {
            for (int i = nEndIndex; i >= nBeginIndex; i--)
            {
                char ch = str[i];

                if (ch == ' ' || ch == '\t' || ch == '\r' || ch == '\n')
                    return i;
            }

            return -1;
        }

        static private int GetNotEmptyLastIndex(string str, int nEndIndex, int nBeginIndex = 0)
        {
            for (int i = nEndIndex; i >= nBeginIndex; i--)
            {
                char ch = str[i];

                if (ch != ' ' && ch != '\t' && ch != '\r' && ch != '\n')
                    return i;
            }

            return -1;
        }
    }
}
