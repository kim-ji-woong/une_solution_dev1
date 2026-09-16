using System.Collections.Generic;
using Response;

namespace Base.History.IBLL.Response
{
    using Models.SOP;

    public class ResponseSOPComponentHistory : MessageResult
    {
        private List<SOPHistoryComponentData> m_sopComponentHistoryDatas = new List<SOPHistoryComponentData>();
        public List<SOPHistoryComponentData> SopComponentHistoryDatas
        {
            get { return m_sopComponentHistoryDatas; }
            set { m_sopComponentHistoryDatas = value; }
        }

        public ResponseSOPComponentHistory()
            : base()
        {
        }

        public ResponseSOPComponentHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
