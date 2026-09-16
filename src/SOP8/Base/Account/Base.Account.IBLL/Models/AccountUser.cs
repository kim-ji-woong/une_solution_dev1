namespace Base.Account.IBLL.Models
{
    public class AccountUser
    {
        private int m_nUserNo = -1;
        private int? m_teamNo = null;
        private string m_strTeamName = null;
        private int? m_memberNo = null;
        private string m_strMemberName = null;
        private string m_strNickName = null;
        private int? m_jobLevelNo = null;
        private string m_strJobLevel = null;
        private int? m_jobPositionNo = null;
        private string m_strJobPosition = null;
        private int? m_gradeNo = null;
        private string m_strGrade = null;
        private string m_strPhoneNumber = null;
        private string m_strEmail = null;
        private string m_strUserID = null;
        private int? m_siteNo = null;
        private string m_strMemo = null;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public int? TeamNo
        {
            get { return m_teamNo; }
            set { m_teamNo = value; }
        }

        public string TeamName
        {
            get { return m_strTeamName; }
            set { m_strTeamName = value; }
        }

        public int? MemberNo
        {
            get { return m_memberNo; }
            set { m_memberNo = value; }
        }

        public string MemberName
        {
            get { return m_strMemberName; }
            set { m_strMemberName = value; }
        }

        public string NickName
        {
            get { return m_strNickName; }
            set { m_strNickName = value; }
        }

        public int? JobLevelNo
        {
            get { return m_jobLevelNo; }
            set { m_jobLevelNo = value; }
        }

        public string JobLevel
        {
            get { return m_strJobLevel; }
            set { m_strJobLevel = value; }
        }

        public int? JobPositionNo
        {
            get { return m_jobPositionNo; }
            set { m_jobPositionNo = value; }
        }

        public string JobPosition
        {
            get { return m_strJobPosition; }
            set { m_strJobPosition = value; }
        }

        public int? GradeNo
        {
            get { return m_gradeNo; }
            set { m_gradeNo = value; }
        }

        public string Grade
        {
            get { return m_strGrade; }
            set { m_strGrade = value; }
        }

        public string PhoneNumber
        {
            get { return m_strPhoneNumber; }
            set { m_strPhoneNumber = value; }
        }

        public string Email
        {
            get { return m_strEmail; }
            set { m_strEmail = value; }
        }

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }
    }
}
