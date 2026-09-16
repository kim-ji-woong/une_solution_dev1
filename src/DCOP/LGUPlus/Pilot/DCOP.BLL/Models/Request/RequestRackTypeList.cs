namespace DCOP.BLL.Models.Request
{
    public class RequestRackTypeList
    {
        private int? m_companyNo = null;
        private string m_strType = null;
        private int? m_unitSize = null;
        private string m_strSearchText = null;
        private int? m_pageIndex = null;
        private int? m_pageItemCount = null;

        public int? CompanyNo
        {
            get { return m_companyNo; }
            set { m_companyNo = value; }
        }

        public string Type
        {
            get { return m_strType; }
            set { m_strType = value; }
        }

        public int? UnitSize
        {
            get { return m_unitSize; }
            set { m_unitSize = value; }
        }

        public string SearchText
        {
            get { return m_strSearchText; }
            set { m_strSearchText = value; }
        }

        public int? PageIndex
        {
            get { return m_pageIndex; }
            set { m_pageIndex = value; }
        }

        public int? PageItemCount
        {
            get { return m_pageItemCount; }
            set { m_pageItemCount = value; }
        }
    }
}
