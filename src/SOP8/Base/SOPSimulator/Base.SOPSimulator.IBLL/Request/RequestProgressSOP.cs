namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestProgressSOP
    {
        /*public int LargeClassNo { get; set; }
        public int MiddleClassNo { get; set; }
        public int SmallClassNo { get; set; }*/
        public int? SensorZoneHistoryNo { get; set; }
        public int ActionStepNo { get; set; }
        public int? ActionStepHistoryNo { get; set; }
        public int ComponentNo { get; set; }
        public int ComponentType { get; set; }
        //public int Status { get; set; }
        public int? AccessedUserNo { get; set; }
        //public string Text { get; set; }
        public DecisionValue DecisionValue { get; set; }

        /// <summary>
        /// 현재 임무가 아닌 다른 임무의 다음버튼을 눌렀을 때 true
        /// </summary>
        //public bool Skip { get; set; }
    }

    public class DecisionValue
    {
        public int ArrowNo { get; set; }
        public string ArrowText { get; set; }
    }
}
