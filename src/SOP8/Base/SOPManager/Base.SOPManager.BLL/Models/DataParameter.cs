using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SOPManager.BLL.Models
{
    class DataParameter
    {
        // 전체 메시지
        private string m_strMsg = "";
        // 재난발생 시간
        private DateTime m_dtTime;
        // 재난발생 장소
        private string m_strPlace = "";
        // true이면 실제모드, false이면 훈련모드
        private bool? m_isRealMode = null;
        // true이면 평일모드, false이면 야간 및 휴일모드
        private bool? m_isNormalMode = null;
        // 다양한 재난상황 및 데이터를 표현하기 위한 변수
        // Key : 재난 데이터 이름(대소문자를 구분하지 않는다.)
        // Value : 재난 데이터
        private Dictionary<string, object> m_dicDatas = new Dictionary<string, object>();

        // 전체 메시지
        public string Message
        {
            get { return m_strMsg; }
            set { m_strMsg = value; }
        }

        // 재난발생 시간
        public DateTime Time
        {
            get { return m_dtTime; }
            set { m_dtTime = value; }
        }

        // 재난발생 장소
        public string Place
        {
            get { return m_strPlace; }
            set { m_strPlace = value; }
        }

        // true이면 실제모드, false이면 훈련모드
        public bool? RealMode
        {
            get { return m_isRealMode; }
            set { m_isRealMode = value; }
        }

        // true이면 평일모드, false이면 야간 및 휴일모드
        public bool? NormalMode
        {
            get { return m_isNormalMode; }
            set { m_isNormalMode = value; }
        }

        public int DataCount
        {
            get { return m_dicDatas.Count; }
        }

        public ICollection<string> DataKeys
        {
            get { return m_dicDatas.Keys; }
        }

        public DataParameter(string strMsg, DateTime dtTime)
        {
            m_strMsg = strMsg;
            m_dtTime = dtTime;
        }

        public DataParameter(string strMsg, DateTime dtTime, string strPlace)
        {
            m_strMsg = strMsg;
            m_dtTime = dtTime;
            m_strPlace = strPlace;
        }

        public void AddData(string strKey, object value)
        {
            m_dicDatas[strKey.ToLower()] = value;
        }

        public bool ContainsKey(string strKey)
        {
            return m_dicDatas.ContainsKey(strKey.ToLower());
        }

        public object GetData(string strKey, out bool success)
        {
            object value = null;
            success = m_dicDatas.TryGetValue(strKey.ToLower(), out value);
            return value;
        }

        public void RemoveKey(string strKey)
        {
            m_dicDatas.Remove(strKey.ToLower());
        }
    }
}
