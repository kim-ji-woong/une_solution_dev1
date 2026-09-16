using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseTotalDoorStatus : MessageResult
    {
        public int TotalCloseDoorCount { get; set; }
        public List<ZoneCountData> Zones { get; set; }
    }

    public class ZoneCountData
    {
        public int ZoneNo { get; set; }
        public string ZoneName { get; set; }
        public int TotalDoorCount { get; set; }
        public int CloseDoorCount { get; set; }

    }
}
