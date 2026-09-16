using Response.Request;

namespace Base.TeamEditor.IBLL.Request
{
    public static class DisplayTemporaryMemberSortTypeCode
    {
        public const int TemporaryMemberNo = 0;
    }

    public class DisplayTemporaryMember : RequestSearchTextPage
    {
        private int m_nTemporaryNo = -1;
        private bool m_isNormal = true;
        private bool m_includeChildTeams = false;
        private bool m_searchRegularTeamName = true;
        private bool m_searchTemporaryTeamName = true;
        private bool m_searchRegularMemberName = true;
        private bool m_searchSopName = true;
        private bool m_searchJobLevel = true;
        private bool m_searchJobPosition = true;
        private bool m_searchRole = true;
        private bool m_searchTemporaryMemo = false;
        private int? m_sortType = null;
        private bool m_sortMethod = true;

        public int tmpr_sn
        {
            get { return m_nTemporaryNo; }
            set { m_nTemporaryNo = value; }
        }

        public bool IsNormal
        {
            get { return m_isNormal; }
            set { m_isNormal = value; }
        }

        public bool IncludeChildTeams
        {
            get { return m_includeChildTeams; }
            set { m_includeChildTeams = value; }
        }

        public bool SearchRegularTeamName
        {
            get { return m_searchRegularTeamName; }
            set { m_searchRegularTeamName = value; }
        }

        public bool SearchTemporaryTeamName
        {
            get { return m_searchTemporaryTeamName; }
            set { m_searchTemporaryTeamName = value; }
        }

        public bool SearchRegularMemberName
        {
            get { return m_searchRegularMemberName; }
            set { m_searchRegularMemberName = value; }
        }

        public bool SearchSopName
        {
            get { return m_searchSopName; }
            set { m_searchSopName = value; }
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

        public bool SearchRole
        {
            get { return m_searchRole; }
            set { m_searchRole = value; }
        }

        public bool SearchTemporaryMemo
        {
            get { return m_searchTemporaryMemo; }
            set { m_searchTemporaryMemo = value; }
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
