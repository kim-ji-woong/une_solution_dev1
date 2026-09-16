using System.Collections.Generic;

namespace Base.Account.IBLL.Request
{
    using Models;

    public class SaveOption
    {
        private int m_nUserNo = -1;
        private List<UserOption> m_options = new List<UserOption>();

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
    }
}
