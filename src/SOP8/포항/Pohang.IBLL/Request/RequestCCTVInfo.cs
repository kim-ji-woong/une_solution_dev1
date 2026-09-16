using System.Collections.Generic;

namespace Pohang.IBLL.Request
{
    public class RequestCCTVInfo
    {
        private List<int> m_cctvNos = new List<int>();

        public List<int> CctvNos
        {
            get { return m_cctvNos; }
            set { m_cctvNos = value; }
        }
    }
}
