using System;
using System.Collections.Generic;
using System.Text;

namespace DCOP.BLL.Models.Request
{
    public class RequestData
    {
        private CheckLoginSession m_checkLoginSession = null;
        private RequestAccountLevels m_requestAccountLevels = null;
        // 사용자 신규등록 화면에서 사용
        private RequestAccountLevels2 m_requestAccountLevels2 = null;
        private RequestSearchUserList m_requestSearchUserList = null;

        public CheckLoginSession CheckLoginSession
        {
            get { return m_checkLoginSession; }
            set { m_checkLoginSession = value; }
        }

        public RequestAccountLevels RequestAccountLevels
        {
            get { return m_requestAccountLevels; }
            set { m_requestAccountLevels = value; }
        }

        public RequestAccountLevels2 RequestAccountLevels2
        {
            get { return m_requestAccountLevels2; }
            set { m_requestAccountLevels2 = value; }
        }

        public RequestSearchUserList RequestSearchUserList
        {
            get { return m_requestSearchUserList; }
            set { m_requestSearchUserList = value; }
        }
    }

    public class LoginData
    {
        private string m_strValue = "";
        private string m_strKey = "";

        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        public string Key
        {
            get { return m_strKey; }
            set { m_strKey = value; }
        }
    }

    public class RequestLoginKey
    {
        private long? num = null;
        private string m_strUserID = null;

        public long? Num
        {
            get { return num; }
            set { num = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }
    }

    public class CheckLoginSession
    {
        private int m_nUserNo = -1;
        private string m_strSessionKey = "";


        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public string SessionKey
        {
            get { return m_strSessionKey; }
            set { m_strSessionKey = value; }
        }
    }

    public class RequestSearchUserList
    {
        private int? m_siteNo = null;
        private int m_nUserNo = -1;
        private int? m_levelNo = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public int? LevelNo
        {
            get { return m_levelNo; }
            set { m_levelNo = value; }
        }
    }

    public class RequestCurrentWeather
    {
        private int m_nDataCenterNo = 0;

        public int DataCenterNo
        {
            get { return m_nDataCenterNo; }
            set { m_nDataCenterNo = value; }
        }
    }
}
