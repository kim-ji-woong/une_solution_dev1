using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseComingHistory : MessageResult
    {
        public int TotalComingCount { get; set; }
        public int TotalComingCount_Worker { get; set; }
        public int TotalComingCount_Visitor { get; set; }

        public int TotalRemainingCount { get; set; }
        public int TotalRemainingCount_Worker { get; set; }
        public int TotalRemainingCount_Visitor { get; set; }

        public List<ComingPersonDateInfo> ComingPersonInfos { get; set; }

        public ResponseComingHistory()
            : base()
        {
        }

        public ResponseComingHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ComingPersonInfo
    {
        public string PersonName { get; set; }
        public string DoorName { get; set; }
        public bool IsVisitor { get; set; }
        public bool IsEnterance { get; set; }
        public string CardNo { get; set; }

        public bool BuildingEnterance { get; set; }
    }

    public class ComingPersonDateInfo : ComingPersonInfo
    {
        public DateTime? Time { get; set; }
    }
}
