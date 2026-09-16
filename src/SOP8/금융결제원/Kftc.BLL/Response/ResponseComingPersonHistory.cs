using Kftc.Model.History;
using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseComingPersonHistory : PagingMessageResult
    {
        private List<ComingHistory> m_comingHistories = new List<ComingHistory>();

        public List<ComingHistory> Histories
        {
            get { return m_comingHistories; }
            set { m_comingHistories = value; }
        }

        public ResponseComingPersonHistory()
            : base()
        {
        }

        public ResponseComingPersonHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ComingHistory
    {
        public string PersonName { get; set; }
        public string DoorName { get; set; }
        public bool IsVisitor { get; set; }
        public bool IsEnterance { get; set; }
        public string TeamName { get; set; }
        public string PositionName { get; set; }
        public DateTime Time { get; set; }
    }
}
