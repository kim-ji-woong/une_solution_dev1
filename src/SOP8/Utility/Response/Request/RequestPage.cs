namespace Response.Request
{
    public class RequestPage
    {
        private int? m_pageRowCount = null;
        private int m_nPageNo = 1;

        // 한 페이지에 보여줄 행의 개수
        // 이 값이 null이면 전체 데이터를 리턴한다.
        public int? PageRowCount
        {
            get { return m_pageRowCount; }
            set { m_pageRowCount = value; }
        }
        
        // 1부터 시작한다.
        public int PageNo
        {
            get { return m_nPageNo; }
            set { m_nPageNo = value; }
        }

        public int? GetBeginIndex()
        {
            if (this.PageRowCount != null && this.PageRowCount > 0 && this.PageNo > 0)
            {
                return (int)this.PageRowCount * (this.PageNo - 1) + 1;
            }

            return null;
        }
    }

    public class RequestSearchTextPage : RequestPage
    {
        private string m_strSearchText = null;

        public string SearchText
        {
            get { return m_strSearchText; }
            set { m_strSearchText = value; }
        }

        public new int? GetBeginIndex()
        {
            if (this.SearchText == null || this.SearchText.Trim().Length == 0)
                return base.GetBeginIndex();

            return null;
        }
    }
}
