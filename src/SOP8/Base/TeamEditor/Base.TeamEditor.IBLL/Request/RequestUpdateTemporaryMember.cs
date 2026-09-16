namespace Base.TeamEditor.IBLL.Request
{
    using Models;

    public class RequestUpdateTemporaryMember
    {
        private TemporaryMemberInfo m_temporaryMemberInfo = null;

        public TemporaryMemberInfo TemporaryMemberInfo
        {
            get { return m_temporaryMemberInfo; }
            set { m_temporaryMemberInfo = value; }
        }
    }
}
