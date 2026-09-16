using Response.Request;

namespace Base.Account.IBLL.Request
{
    public class RequestUserList : RequestSearchTextPage
    {
        private int? m_siteNo = null;

        private bool m_useTeamName = false;
        private bool m_useMemberName = false;
        private bool m_useNickName = false;
        private bool m_useJobLevel = false;
        private bool m_useJobPosition = false;
        private bool m_useGrade = false;
        private bool m_usePhoneNumber = false;
        private bool m_useEmail = false;
        private bool m_linkRegularMember = true;
        private int? m_sortType = null;
        private bool m_sortMethod = true;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public bool UseTeamName
        {
            get { return m_useTeamName; }
            set { m_useTeamName = value; }
        }

        public bool UseMemberName
        {
            get { return m_useMemberName; }
            set { m_useMemberName = value; }
        }

        public bool UseNickName
        {
            get { return m_useNickName; }
            set { m_useNickName = value; }
        }

        public bool UseJobLevel
        {
            get { return m_useJobLevel; }
            set { m_useJobLevel = value; }
        }

        public bool UseJobPosition
        {
            get { return m_useJobPosition; }
            set { m_useJobPosition = value; }
        }

        public bool UseGrade
        {
            get { return m_useGrade; }
            set { m_useGrade = value; }
        }

        public bool UsePhoneNumber
        {
            get { return m_usePhoneNumber; }
            set { m_usePhoneNumber = value; }
        }

        public bool UseEmail
        {
            get { return m_useEmail; }
            set { m_useEmail = value; }
        }

        // 연결된 정규조직원이 반드시 필요한가?
        public bool LinkRegularMember
        {
            get { return m_linkRegularMember; }
            set { m_linkRegularMember = value; }
        }

        // 정렬 대상 필드 구분값 (예: 0=멤버명, 1=사용자 ID, 2=등급).
        // null 이면 기존 기본 정렬(user_sn)을 사용한다.
        public int? SortType
        {
            get { return m_sortType; }
            set { m_sortType = value; }
        }

        // 정렬 방향 값.
        // true : 오름차순(ASC), false : 내림차순(DESC)
        public bool SortMethod
        {
            get { return m_sortMethod; }
            set { m_sortMethod = value; }
        }

        public RequestUserList()
        {
        }

        public RequestUserList(string strSearchText, int pageNo, int? pageRowCount, int? siteNo, bool useTeamName, bool useMemberName, bool useNickName, bool useJobLevel, bool useJobPosition, bool useGrade, bool usePhoneNumber, bool useEmail, int? sortType = null, bool sortMethod = true)
        {
            this.SearchText = strSearchText;
            this.PageNo = pageNo;
            this.PageRowCount = pageRowCount;
            this.SiteNo = siteNo;
            this.UseTeamName = useTeamName;
            this.UseMemberName = useMemberName;
            this.UseNickName = useNickName;
            this.UseJobLevel = useJobLevel;
            this.UseJobPosition = useJobPosition;
            this.UseGrade = useGrade;
            this.UsePhoneNumber = usePhoneNumber;
            this.UseEmail = useEmail;
            this.SortType = sortType;
            this.SortMethod = sortMethod;
        }
    }
}
