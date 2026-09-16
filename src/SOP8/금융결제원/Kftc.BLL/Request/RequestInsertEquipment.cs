using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestInsertEquipment
    {
        public EquipmentInsert Equipment { get; set; }
    }


    public class EquipmentInsert
    {
        public int TypeNo { get; set; }
        public string TypeName { get; set; }
        public int? ParentNo { get; set; }
        public string ParentName { get; set; }
        public string EquipmentIdenti { get; set; }
        public string EquipmentName { get; set; }
        public string ModelName { get; set; }
        public string MakerName { get; set; }
        public string Standard { get; set; }
        public string IP { get; set; }
        public string Location { get; set; }
        public string ZoneName { get; set; }
        public DateTime? ExchangeTime { get; set; }
        public string Memo { get; set; }
    }

    public class RequestEquipment
    {
        public Response.EquipmentInfo Equipment { get; set; }
    }
}
