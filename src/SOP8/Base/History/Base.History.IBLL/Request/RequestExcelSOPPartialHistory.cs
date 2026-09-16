using System.Collections.Generic;

namespace Base.History.IBLL.Request
{
    public class RequestExcelSOPPartialHistory
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;
        private string m_strDisasterCategoryName = null;
        private string m_strActionStepName = null;
        private List<int> m_actionStepHistoryNos = new List<int>();
        private string m_strSubjectName = null;

        public int BeginYear
        {
            get { return m_nBeginYear; }
            set { m_nBeginYear = value; }
        }

        public int BeginMonth
        {
            get { return m_nBeginMonth; }
            set { m_nBeginMonth = value; }
        }

        public int BeginDay
        {
            get { return m_nBeginDay; }
            set { m_nBeginDay = value; }
        }

        public int EndYear
        {
            get { return m_nEndYear; }
            set { m_nEndYear = value; }
        }

        public int EndMonth
        {
            get { return m_nEndMonth; }
            set { m_nEndMonth = value; }
        }

        public int EndDay
        {
            get { return m_nEndDay; }
            set { m_nEndDay = value; }
        }

        // null이면 전체
        public string DisasterCategoryName
        {
            get { return m_strDisasterCategoryName; }
            set { m_strDisasterCategoryName = value; }
        }

        // null이면 전체
        public string ActionStepName
        {
            get { return m_strActionStepName; }
            set { m_strActionStepName = value; }
        }

        public List<int> ActionStepHistoryNos
        {
            get { return m_actionStepHistoryNos; }
            set { m_actionStepHistoryNos = value; }
        }

        public string SubjectName
        {
            get { return m_strSubjectName; }
            set { m_strSubjectName = value; }
        }
    }
}
