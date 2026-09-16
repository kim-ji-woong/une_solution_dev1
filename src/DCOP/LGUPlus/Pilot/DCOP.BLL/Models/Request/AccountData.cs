using System;
using System.Collections.Generic;
using System.Text;

namespace DCOP.BLL.Models.Request
{
    public class RequestAccountLevels
    {
        private int? m_nUserNo = null;

        public int? UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }

    // 사용자 신규등록에서 사용할 계정목록
    public class RequestAccountLevels2
    {
        private int m_nUserNo = -1;

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }
}
