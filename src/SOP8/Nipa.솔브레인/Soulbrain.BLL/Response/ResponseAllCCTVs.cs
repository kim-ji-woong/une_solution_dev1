using Base.Model.Sensor.CCTV;
using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Soulbrain.BLL.Response
{
    public class ResponseAllCCTVs : MessageResult
    {
        private List<CCTV> m_cctvs = new List<CCTV>();

        public List<CCTV> CCTVs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ResponseAllCCTVs()
            : base()
        {
        }

        public ResponseAllCCTVs(bool success, string message)
            : base(success, message)
        {
        }
    }
}
