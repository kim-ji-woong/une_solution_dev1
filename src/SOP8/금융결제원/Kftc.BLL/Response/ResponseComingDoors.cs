using Response;
using System.Collections.Generic;

namespace Kftc.BLL.Response
{
    public class ResponseComingDoors : MessageResult
    {
        public List<DoorList> Doors { get; set; }
    }

    public class DoorList
    {
        public int DoorNo { get; set; }
        public string DoorName { get; set; }
        public bool IsArea { get; set; }
    }
}
