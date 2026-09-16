using Response.Request;

namespace Base.TeamEditor.IBLL.Request
{
    public class DisplayRegular
    {
        private int? m_nSiteNo = null;
        public int? site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }
    }

    public static class DisplayRegularMemberSortTypeCode
    {
        public const int RegularMemberNo = 0;
    }

    public class DisplayRegularMember : RequestSearchTextPage
    {
        private int? m_nSiteNo = null;
        private int? m_nRegularNo = null;
        private bool m_includeChildTeams = false;
        private bool m_searchTeamName = true;
        private bool m_searchJobLevel = true;
        private bool m_searchJobPosition = true;
        private bool m_searchUniqueKey = true;
        private bool m_searchPhoneNumber = true;
        private bool m_searchOfficePhoneNumber = true;
        private bool m_searchEmail = true;
        private bool m_searchJobStatus = true;
        private bool m_searchMemo = false;
        private int? m_sortType = null;
        private bool m_sortMethod = true;

        public int? site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public int? rgl_sn
        {
            get { return m_nRegularNo; }
            set { m_nRegularNo = value; }
        }

        public bool IncludeChildTeams
        {
            get { return m_includeChildTeams; }
            set { m_includeChildTeams = value; }
        }

        public bool SearchTeamName
        {
            get { return m_searchTeamName; }
            set { m_searchTeamName = value; }
        }

        public bool SearchJobLevel
        {
            get { return m_searchJobLevel; }
            set { m_searchJobLevel = value; }
        }

        public bool SearchJobPosition
        {
            get { return m_searchJobPosition; }
            set { m_searchJobPosition = value; }
        }

        public bool SearchUniqueKey
        {
            get { return m_searchUniqueKey; }
            set { m_searchUniqueKey = value; }
        }

        public bool SearchPhoneNumber
        {
            get { return m_searchPhoneNumber; }
            set { m_searchPhoneNumber = value; }
        }

        public bool SearchOfficePhoneNumber
        {
            get { return m_searchOfficePhoneNumber; }
            set { m_searchOfficePhoneNumber = value; }
        }

        public bool SearchEmail
        {
            get { return m_searchEmail; }
            set { m_searchEmail = value; }
        }

        public bool SearchJobStatus
        {
            get { return m_searchJobStatus; }
            set { m_searchJobStatus = value; }
        }

        public bool SearchMemo
        {
            get { return m_searchMemo; }
            set { m_searchMemo = value; }
        }

        public int? SortType
        {
            get { return m_sortType; }
            set { m_sortType = value; }
        }

        public bool SortMethod
        {
            get { return m_sortMethod; }
            set { m_sortMethod = value; }
        }
    }
}
