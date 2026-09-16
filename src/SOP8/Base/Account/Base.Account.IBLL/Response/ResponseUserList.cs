using System.Collections.Generic;
using Response;

namespace Base.Account.IBLL.Response
{
    using Models;

    public class ResponseUserList : PagingMessageResult
    {
        private List<AccountUser> m_users = new List<AccountUser>();

        public List<AccountUser> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public ResponseUserList()
            : base()
        {
        }

        public ResponseUserList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
