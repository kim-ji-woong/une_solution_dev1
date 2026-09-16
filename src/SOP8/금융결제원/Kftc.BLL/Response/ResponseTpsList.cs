using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{

    public class ResponseTpsList : MessageResult
    {
        public List<TpsData> TpsList { get; set; }
    }

    public class TpsData
    {
        public int TpsNo { get; set; }
        public string TpsName { get; set; }
    }
}
