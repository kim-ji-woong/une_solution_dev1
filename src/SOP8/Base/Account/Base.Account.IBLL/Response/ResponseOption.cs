using Response;
using System.Collections.Generic;

namespace Base.Account.IBLL.Response
{
    using Models;

    public class ResponseOption : MessageResult
    {
        private int m_nUserNo = -1;
        private List<UserOption> m_options = null;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public List<UserOption> Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public ResponseOption()
            : base()
        {
        }

        public ResponseOption(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }
}
