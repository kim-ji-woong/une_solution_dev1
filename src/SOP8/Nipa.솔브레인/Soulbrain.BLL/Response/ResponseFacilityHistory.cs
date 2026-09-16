using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Soulbrain.BLL.Response
{
    public class ResponseFacilityHistory : MessageResult
    {
        public string fclty_name { get; set; }
        public List<FacilityInfo> FacilityInfos { get; set; }

        public List<MesureData> FacilityDatas { get; set; }

        public ResponseFacilityHistory()
            : base()
        {
        }

        public ResponseFacilityHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FacilityInfo
    {
        public string fclty_presv_name { get; set; }
        public string mesure_id { get; set; }
        public string TagName { get; set; }
        public bool IsAlarmFacility { get; set; }
        public string mesure_uom { get; set; }

        public double nLimit1 { get; set; }
        public double nLimit2 { get; set; }
        public double nLimit3 { get; set; }
        public double nLimit4 { get; set; }

        public double? max_y { get; set; }

        public List<FacilityHistoryData> Predicts { get; set; }
        public List<FacilityHistoryData> Mesures { get; set; }
    }

    public class FacilityHistoryData
    {
        public DateTime mesure_tm { get; set; }
        public double mesure_value { get; set; }
    }





    public class ResponsePowerHistory : MessageResult
    {
        public string fclty_name { get; set; }
        //public FacilityInfo PowerInfo { get; set; }
        public List<FacilityInfo> PowerInfos { get; set; }

        public List<MesureData> PowerDatas { get; set; }

        public ResponsePowerHistory()
            : base()
        {
        }

        public ResponsePowerHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class MesureData
    {
        public string mesure_id { get; set; }
        public double mesure_value { get; set; }
        public string mesure_uom { get; set; }
        public string TagName { get; set; }
    }

    public class ResponseFacilityMesureData : MessageResult
    {
        public string fclty_presv_name { get; set; }
        public List<MesureData> Mesures { get; set; }

        public ResponseFacilityMesureData()
            : base()
        {
        }

        public ResponseFacilityMesureData(bool success, string message)
            : base(success, message)
        {
        }
    }


    public class ResponseFcltyAnalysis : MessageResult
    {
        public string fclty_name { get; set; }
        public double nLimit1 { get; set; }
        public double nLimit2 { get; set; }
        public double nLimit3 { get; set; }
        public double nLimit4 { get; set; }
        public double max_y { get; set; }
        public List<FacilityHistoryData> Predicts { get; set; }
        public List<FacilityHistoryData> Mesures { get; set; }

        public ResponseFcltyAnalysis()
            : base()
        {
        }

        public ResponseFcltyAnalysis(bool success, string message)
            : base(success, message)
        {
        }
    }
}
