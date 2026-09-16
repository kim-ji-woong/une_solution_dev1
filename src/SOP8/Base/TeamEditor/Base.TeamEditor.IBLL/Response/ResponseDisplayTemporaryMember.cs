using System.Collections.Generic;
using Response;

namespace Base.TeamEditor.IBLL.Response
{
    using Models;

    public class ResponseDisplayTemporaryMember : PagingMessageResult
    {
        private List<RegularmemberTemporarymember> m_temporaryMembers = new List<RegularmemberTemporarymember>();

        public List<RegularmemberTemporarymember> TemporaryMembers
        {
            get { return m_temporaryMembers; }
            set { m_temporaryMembers = value; }
        }

        public ResponseDisplayTemporaryMember()
            : base()
        {
        }

        public ResponseDisplayTemporaryMember(bool success, string message)
            : base(success, message)
        {
        }
    }
}
