using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseLastComingPerson : MessageResult
    {
        public string PersonName { get; set; }
        public string DoorName { get; set; }
        public string ZoneName { get; set; }
        public bool? IsVisitor { get; set; }
        public bool? IsEnterance { get; set; }
        public DateTime? Time { get; set; }
        public bool? IsImportant { get; set; }
    }
}
