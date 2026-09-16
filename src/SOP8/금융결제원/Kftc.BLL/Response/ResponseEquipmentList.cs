using Kftc.Model.Facility;
using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseEquipmentList : MessageResult
    {
        public List<EquipmentInfo> EquipmentList { get; set; }
    }

    public class EquipmentInfo
    {
        public int EquipmentNo { get; set; }
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

    public class ResponseEquipment : MessageResult
    {
        public EquipmentInfo Equipment { get; set; }
    }
}
