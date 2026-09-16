using System.Collections.Generic;

namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestCurrentHistory
    {
        public class ActionStepHistoryData
        {
            private int m_nActionStepHistoryNo = -1;
            private int? m_lastComponentHistoryNo = null;

            public int ActionStepHistoryNo
            {
                get { return m_nActionStepHistoryNo; }
                set { m_nActionStepHistoryNo = value; }
            }

            public int? LastComponentHistoryNo
            {
                get { return m_lastComponentHistoryNo; }
                set { m_lastComponentHistoryNo = value; }
            }
        }

        private int? m_siteNo = null;
        private int m_nUserNo = -1;
        private List<ActionStepHistoryData> m_actionStepHistoryDatas = new List<ActionStepHistoryData>();

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public List<ActionStepHistoryData> ActionStepHistoryDatas
        {
            get { return m_actionStepHistoryDatas; }
            set { m_actionStepHistoryDatas = value; }
        }
    }
}
