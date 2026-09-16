using System.Collections.Generic;
using Response;

namespace Base.History.IBLL.Response
{
    using Models.History;

    public class ResponseSensorDetectHistory : PagingMessageResult
    {
        private List<SensorDetectHistory> m_histories = new List<SensorDetectHistory>();

        public List<SensorDetectHistory> Histories
        {
            get { return m_histories; }
        }

        public ResponseSensorDetectHistory()
            : base()
        {
        }

        public ResponseSensorDetectHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
