using System.Collections.Generic;
using Response;

namespace Base.TeamEditor.IBLL.Response
{
    using Models;

    public class ResponseTemporaryMembers : MessageResult
    {
        private List<TemporaryMemberInfo> m_temporaryMemberInfos = new List<TemporaryMemberInfo>();

        public List<TemporaryMemberInfo> TemporaryMemberInfos
        {
            get { return m_temporaryMemberInfos; }
            set { m_temporaryMemberInfos = value; }
        }

        public ResponseTemporaryMembers()
            : base()
        {
        }

        public ResponseTemporaryMembers(bool success, string message)
            : base(success, message)
        {
        }
    }
}
