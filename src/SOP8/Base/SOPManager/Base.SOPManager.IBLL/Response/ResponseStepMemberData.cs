using Response;

namespace Base.SOPManager.IBLL.Response
{
    using Models.Component;

    public class ResponseStepMemberData : MessageResult
    {
        private StepMemberData m_stepMemberData = null;

        public StepMemberData StepMemberData
        {
            get { return m_stepMemberData; }
            set { m_stepMemberData = value; }
        }

        public ResponseStepMemberData()
            : base()
        {
        }

        public ResponseStepMemberData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
