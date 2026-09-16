using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoulbrainWebAPIServer.Model.UniAETModels
{
    public class RequestIngest
    {       
        public string site_id { get; set; }
        public string plant_id { get; set; }
        public string facility_id { get; set; }
        public List<IngestDetail> data { get; set; }
    }

    public class IngestDetail
    {
        public string measurement_id { get; set; }
        public string ts { get; set; }
        public double value { get; set; }
        public string unit { get; set; }
    }



    public class RequestFcltyAnalysis
    {
        public string site_id { get; set; }
        public string plant_id { get; set; }
        public string facility_id { get; set; }
        public string measurement_id { get; set; }
        public Thresholds thresholds { get; set; }
        public AnalysisDetail data { get; set; }
    }

    public class Thresholds
    {
        public Range status_0 { get; set; }
        public Range status_1 { get; set; }
        public Range status_2 { get; set; }
        public Range status_3 { get; set; }
        public Range status_4 { get; set; }
    }

    public class Range
    {
        public string range { get; set; }
    }

    public class AnalysisDetail
    {
        public string ts { get; set; }
        public double value { get; set; }
        public int status { get; set; }
        public string unit { get; set; }
    }






    public class RequestPowerAnalysis
    {
        public string site_id { get; set; }
        public string plant_id { get; set; }                
        public List<AnalysisDetailPower> data { get; set; }
    }

    public class AnalysisDetailPower
    {
        public string facility_id { get; set; }
        public string measurement_id { get; set; }
        public Thresholds thresholds { get; set; }
        public List<AnalysisDetail> series { get; set; }
    }
}
