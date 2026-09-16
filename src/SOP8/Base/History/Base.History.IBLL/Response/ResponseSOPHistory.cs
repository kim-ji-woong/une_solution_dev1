using System.Collections.Generic;
using Response;

namespace Base.History.IBLL.Response
{
    using Models.SOP;

    public class ResponseSOPHistory : MessageResult
    {
        private List<SOPHistoryData> m_sopHistoryDatas = new List<SOPHistoryData>();
        private int m_nTotalCount = -1;

        public List<SOPHistoryData> SOPHistoryDatas
        {
            get { return m_sopHistoryDatas; }
            set { m_sopHistoryDatas = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseSOPHistory()
            : base()
        {
        }

        public ResponseSOPHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
