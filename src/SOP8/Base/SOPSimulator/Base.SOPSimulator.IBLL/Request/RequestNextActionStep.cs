namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestNextActionStep
    {
        public int LargeClassNo { get; set; }
        public int MiddleClassNo { get; set; }
        public int SmallClassNo { get; set; }
        public int? SensorZoneHistoryNo { get; set; }
        public int NextActionStepNo { get; set; }
        public int PrevActionStepNo { get; set; }
        public int AccessedUserNo { get; set; }
        public DecisionValue DecisionValue { get; set; }
    }
}
