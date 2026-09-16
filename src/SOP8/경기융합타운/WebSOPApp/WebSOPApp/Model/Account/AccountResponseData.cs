namespace WebSOPApp.Model.Account
{
    public class ResponseSiteNo : SOPManager.BLL.Models.Response.MessageResult
    {
        private int? m_siteNo = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public ResponseSiteNo()
            : base()
        {
        }

        public ResponseSiteNo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
