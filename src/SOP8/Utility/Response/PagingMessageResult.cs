using System;
using System.Collections.Generic;
using System.Text;

namespace Response
{
    public class PagingMessageResult : MessageResult
    {
        private int m_nTotalCount = 0;

        // 전체 아이템 개수
        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public PagingMessageResult()
            : base()
        {
        }

        public PagingMessageResult(bool success, string message)
            : base(success, message)
        {
        }
    }
}
