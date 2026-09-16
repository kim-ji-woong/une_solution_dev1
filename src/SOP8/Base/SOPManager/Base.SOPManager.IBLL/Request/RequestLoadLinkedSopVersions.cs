using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Request
{
    public class RequestLoadLinkedSopVersions
    {
        private int m_nSiteNo = -1;
        private List<int> m_versionNos = null;

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public List<int> VersionNos
        {
            get { return m_versionNos; }
            set { m_versionNos = value; }
        }
    }
}
