using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseParkingHistory : PagingMessageResult
    {
        private List<ParkingData> m_histories = new List<ParkingData>();

        public List<ParkingData> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }

        public ResponseParkingHistory()
            : base()
        {
        }

        public ResponseParkingHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

}
