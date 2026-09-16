using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseEquipmentType : MessageResult
    {
        public List<EquipmentTypeData> EquipmentTypes { get; set; }
    }

    public class EquipmentTypeData
    {
        public int EquipmentTypNo { get; set; }
        public string EquipmentTypName { get; set; }
    }
}
