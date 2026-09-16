using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestGltfModelList
    {
        private List<int> m_siteNos = null;
        private int? m_userNo = null;

        public List<int> SiteNos
        {
            get { return m_siteNos; }
            set { m_siteNos = value; }
        }

        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
        }
    }
}
