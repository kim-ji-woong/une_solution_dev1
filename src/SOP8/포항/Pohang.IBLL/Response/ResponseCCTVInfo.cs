using System.Collections.Generic;
using Response;

namespace Pohang.IBLL.Response
{
    using Models;

    public class ResponseCCTVInfo : MessageResult
    {
        private List<CctvEx> m_cctvs = new List<CctvEx>();

        public List<CctvEx> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ResponseCCTVInfo()
            : base()
        {
        }

        public ResponseCCTVInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
