using Response;
using Soulbrain.Model.Facility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Soulbrain.BLL.Response
{
    public class ResponseFcltyPresvList : MessageResult
    {
        //public List<FcltyPresvInfo> FcltyPresvInfos { get; set; }
        public List<FacilityPresv> FcltyPresvInfos { get; set; }

        public ResponseFcltyPresvList()
           : base()
        {
        }

        public ResponseFcltyPresvList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FcltyPresvInfo
    {
        public string fclty_presv_name { get; set; }
        public string fclty_presv_model_name { get; set; }
        public int zone_sn { get; set; }
        public int fclty_ty_code { get; set; }
        public int? sensor_sn { get; set; }
        public int? sensor_ty_code { get; set; }
    }
}
