using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestInsertParentEquip
    {
        public ParentEquipInsert Equipment { get; set; }
    }


    public class ParentEquipInsert
    {
        public int TypeNo { get; set; }
        public string TypeName { get; set; }
        public int? TpsNo { get; set; }
        public string TpsName { get; set; }
        public int? ChildCount { get; set; }
        public string EquipmentIdenti { get; set; }
        public string EquipmentName { get; set; }
        public string ModelName { get; set; }
        public string MakerName { get; set; }
        public string Standard { get; set; }
        public string IP { get; set; }
        public string Location { get; set; }

        public DateTime? ExchangeTime { get; set; }
        public string Memo { get; set; }
    }

    public class RequestParentEquipment
    {
        public Response.ParentEquipInfo Equipment { get; set; }
    }

    public class RequestDeleteParentEquipment
    {
        public List<Response.ParentEquipInfo> Equipments { get; set; }
    }
}
