using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestBuildingGroupList
    {
        private List<int> m_nSiteNos = null;
        
        public List<int> SiteNos
        {
            get { return m_nSiteNos; }
            set { m_nSiteNos = value; }
        }
    }
}