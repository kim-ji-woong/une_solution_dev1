namespace Base.SOPSimulator.IBLL.Request
{
    /// <summary>
    /// 임무 체크할 때 사용
    /// </summary>
    public class RequestProgressMission
    {
        public int ActionStepHistoryNo { get; set; }
        public int ActionStepNo { get; set; }
        public int ComponentNo { get; set; }
        public int ComponentType { get; set; }
        public int DataIndex { get; set; }
        public int ComponentStatus { get; set; }
        public int? AccessedUserNo { get; set; }
        public bool Checked { get; set; }
    }
}
