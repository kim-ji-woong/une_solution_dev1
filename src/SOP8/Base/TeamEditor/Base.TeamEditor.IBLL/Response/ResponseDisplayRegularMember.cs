using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Response
{
    using Models;

    public class ResponseDisplayRegularMember : PagingMessageResult
    {
        private List<RegularMemberEx> m_regularMembers = new List<RegularMemberEx>();

        public List<RegularMemberEx> RegularMembers
        {
            get { return m_regularMembers; }
            set { m_regularMembers = value; }
        }

        public ResponseDisplayRegularMember()
            : base()
        {
        }

        public ResponseDisplayRegularMember(bool success, string message)
            : base(success, message)
        {
        }
    }
}
