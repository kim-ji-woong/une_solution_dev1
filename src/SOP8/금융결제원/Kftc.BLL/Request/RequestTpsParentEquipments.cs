using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestTpsParentEquipments
    {
        public int TpsNo { get; set; }
    }

    public class RequestTpsEquipments
    {
        public int ParentNo { get; set; }
    }
}
