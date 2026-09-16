using Kftc.BLL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestExcelPartialPatrolHistory
    {
        private List<PatrolHistory> m_histories = new List<PatrolHistory>();

        public List<PatrolHistory> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }
    }
}
