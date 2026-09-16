using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseRouteHistory : MessageResult
    {
        public string CardNo { get; set; }
        public string PersonName { get; set; }
        public bool? IsVisitor { get; set; }
        public string Sabun { get; set; }
        public List<RouteInfo> Histories { get; set; }
    }

    public class RouteInfo
    {
        public int SensorNo { get; set; }
        public string DoorName { get; set; }
        public int ZoneNo { get; set; }
        public string ZoneName { get; set; }
        public bool IsImportant { get; set; }

        public DateTime? EntryTime { get; set; }
        public DateTime? ExitTime { get; set; } 

        public string Key { get; set; }
    }
}
