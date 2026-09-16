namespace Base.SOPManager.IBLL.Request
{
    using Models.Component;

    public class CheckSectionData
    {
        public _SectionData SectionData { get; set; }
        public ArrowData ArrowData { get; set; }
        public int StepMemberNo { get; set; }
        public int UserNo { get; set; }
    }
}
