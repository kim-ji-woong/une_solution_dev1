namespace Base.DAL.Models
{
    public class Pagination
    {
        private int m_nRowNo = -1;
        private int m_nTotalCount = 0;

        public int RowNo
        {
            get { return m_nRowNo; }
            set { m_nRowNo = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public static string RowNoField
        {
            get { return "rowindex"; }
        }

        public static string TotalCountField
        {
            get { return "totalcount"; }
        }

        public static int GetFieldCount()
        {
            return 2;
        }
    }
}
