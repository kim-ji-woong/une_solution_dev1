using System;
using System.Collections.Generic;
using System.Text;

namespace Base.TeamEditor.IBLL.Request
{
    public class DisplayTemporary
    {
        private bool m_isNormal = true;
        public bool IsNormal
        {
            get { return m_isNormal; }
            set { m_isNormal = value; }
        }

        private int? m_nSiteNo = null;
        public int? site_sn
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }
    }
}
