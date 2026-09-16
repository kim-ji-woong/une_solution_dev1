using System.Collections.Generic;

namespace DCOP.BLL.Models.Response
{
    using Account;

    public class ResponseAccountUserDataList : MessageResult
    {
        private List<AccountUser2> m_users = new List<AccountUser2>();

        public List<AccountUser2> Users
        {
            get { return m_users; }
            set { m_users = value; }
        }

        public ResponseAccountUserDataList()
            : base()
        {
        }

        public ResponseAccountUserDataList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
