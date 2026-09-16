using System.Collections.Generic;
using Response;
using Base.Model.Common;

namespace Base.Account.IBLL.Response
{
    public class ResponseSite : MessageResult
    {
        private List<Site> m_sites = new List<Site>();
        private bool m_useMultiSite = false;

        public List<Site> Sites
        {
            get { return m_sites; }
            set { m_sites = value; }
        }

        public bool UseMultiSite
        {
            get { return m_useMultiSite; }
            set { m_useMultiSite = value; }
        }

        public ResponseSite()
            : base()
        {
        }

        public ResponseSite(bool success, string message)
            : base(success, message)
        {
        }
    }
}
