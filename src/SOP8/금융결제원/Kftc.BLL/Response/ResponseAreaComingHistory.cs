using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseAreaComingHistory : MessageResult
    {
        public ResponseAreaComingHistory()
        {
            this.TotalComingCount = 0;
            this.TotalComingCount_Worker = 0;
            this.TotalComingCount_Visitor = 0;
            this.TotalRemainingCount = 0;
            this.TotalRemainingCount_Worker = 0;
            this.TotalRemainingCount_Visitor = 0;
        }

        public int TotalComingCount { get; set; }
        public int TotalComingCount_Worker { get; set; }
        public int TotalComingCount_Visitor { get; set; }

        public int TotalRemainingCount { get; set; }
        public int TotalRemainingCount_Worker { get; set; }
        public int TotalRemainingCount_Visitor { get; set; }

        public List<DoorInfo> DoorInfos { get; set; }
    }

    public class DoorInfo
    {
        public string DoorName { get; set; }
        //public string DoorZoneNo { get; set; }
        public int nSensorNo { get; set; }
        public int TotalComingCount { get; set; }

        public List<ComingPersonInfo> ComingPersonInfos { get; set; }
    }
}
