using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Base.History.BLL.Models
{
    class SensorAnalysisHistoryData : Table
    {
        public int SensorZoneNo { get; set; }
        public int EventCount { get; set; }
        public int AccumulationEventCount { get; set; }
        public string SensorName { get; set; }
        public string Location { get; set; }
        public int SensorType { get; set; }
        public int? SensorSubType { get; set; }
        public string SensorTypeName { get; set; }
        public string SensorSubTypeName { get; set; }
        public int MalfunctionCount { get; set; }
        public int SystemResetCount { get; set; }
        public int UserResetCount { get; set; }
        public float MalfunctionRatio { get; set; }
        public int TotalEventCount { get; set; }
        public float TotalMalfunctionRatio { get; set; }
    }
}
