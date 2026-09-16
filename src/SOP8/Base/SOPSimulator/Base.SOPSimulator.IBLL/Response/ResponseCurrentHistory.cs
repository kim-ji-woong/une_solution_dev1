using System.Collections.Generic;
using Response;

namespace Base.SOPSimulator.IBLL.Response
{
    using Models;

    public class ResponseCurrentHistory : MessageResult
    {
        private bool m_isChanged = false;
        public bool IsChanged
        {
            get { return m_isChanged; }
            set { m_isChanged = value; }
        }

        private List<ActionStepHistoryDataEx> m_actionStepHistoryDatas = new List<ActionStepHistoryDataEx>();
        public List<ActionStepHistoryDataEx> ActionStepHistoryDatas
        {
            get { return m_actionStepHistoryDatas; }
            set { m_actionStepHistoryDatas = value; }
        }

        private int? m_lastAccessActionStepHistoryNo = null;
        public int? LastAccessActionStepHistoryNo
        {
            get { return m_lastAccessActionStepHistoryNo; }
            set { m_lastAccessActionStepHistoryNo = value; }
        }

        public ResponseCurrentHistory()
            : base()
        {
        }

        public ResponseCurrentHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
