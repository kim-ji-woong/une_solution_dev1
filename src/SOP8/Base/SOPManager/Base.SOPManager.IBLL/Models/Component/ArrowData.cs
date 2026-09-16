using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class ArrowData
    {
        private Arrow m_arrow = null;
        private int m_nBeginColumnIndex = -1;
        private int m_nBeginRowIndex = -1;
        private int m_nEndColumnIndex = -1;
        private int m_nEndRowIndex = -1;
        private int m_nBeginPosition = -1;
        private int m_nEndPosition = -1;
        private string m_strText = "";
        private int m_nArrowNo = -1;

        public Arrow Arrow
        {
            get { return m_arrow; }
            set { m_arrow = value; }
        }

        public int BeginColumnIndex
        {
            get { return m_nBeginColumnIndex; }
            set { m_nBeginColumnIndex = value; }
        }

        public int BeginRowIndex
        {
            get { return m_nBeginRowIndex; }
            set { m_nBeginRowIndex = value; }
        }

        public int EndColumnIndex
        {
            get { return m_nEndColumnIndex; }
            set { m_nEndColumnIndex = value; }
        }

        public int EndRowIndex
        {
            get { return m_nEndRowIndex; }
            set { m_nEndRowIndex = value; }
        }

        public int BeginPosition
        {
            get { return m_nBeginPosition; }
            set { m_nBeginPosition = value; }
        }

        public int EndPosition
        {
            get { return m_nEndPosition; }
            set { m_nEndPosition = value; }
        }

        public string Text
        {
            get { return m_strText; }
            set { m_strText = value; }
        }

        public int ArrowNo
        {
            get { return m_nArrowNo; }
            set { m_nArrowNo = value; }
        }
    }
}
