using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SOPManager.IBLL.Request
{
    public class RequestParseSpecialMessage
    {
        // 전체 메시지
        private string m_strMessage = "";
        // 재난발생 시간
        private string m_strTime = "";
        // 재난발생 장소
        private string m_strLocation = "";
        // true이면 실제모드, false이면 훈련모드
        private bool? m_isRealMode = null;
        // true이면 평일모드, false이면 야간 및 휴일모드
        private bool? m_isNormalMode = null;
        // 다양한 재난상황 및 데이터를 표현하기 위한 변수 List
        // 변수 : Key + ";" + Value
        //        Key => 재난 데이터 이름(대소문자를 구분하지 않는다.)
        //        Value => 재난 데이터
        private List<string> m_variables = new List<string>();

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }

        public string Location
        {
            get { return m_strLocation; }
            set { m_strLocation = value; }
        }

        public bool? IsRealMode
        {
            get { return m_isRealMode; }
            set { m_isRealMode = value; }
        }

        public bool? IsNormalMode
        {
            get { return m_isNormalMode; }
            set { m_isNormalMode = value; }
        }

        public List<string> Variables
        {
            get { return m_variables; }
            set { m_variables = value; }
        }

        public void AddVariable(string strKey, string strValue)
        {
            m_variables.Add(strKey + ";" + strValue);
        }

        public static bool GetVariableData(string strVariable, out string strKey, out string strValue)
        {
            strKey = strValue = null;

            int nIndex = strVariable.IndexOf(';');

            if (nIndex < 0)
                return false;

            strKey = strVariable.Substring(0, nIndex).Trim();
            strValue = strVariable.Substring(nIndex + 1).Trim();
            return true;
        }

        public DateTime? GetTime(out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;
                DateTime time = Convert.ToDateTime(m_strTime);
                return time;
            }
            catch (Exception e)
            {
                strErrorMessage = string.Format("DateTime Instance를 생성할 수 없는 문자열입니다. : {0}", m_strTime);
                System.Diagnostics.Trace.WriteLine(e.Message);
            }

            return null;
        }
    }
}
