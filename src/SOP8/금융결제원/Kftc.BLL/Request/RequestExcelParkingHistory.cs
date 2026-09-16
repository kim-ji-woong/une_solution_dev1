using Kftc.BLL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestExcelParkingHistory
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;

        private bool? m_bCmmtktYn = null;
        private string m_strParkngNo = null;

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

        public bool? CmmtktYn
        {
            get { return m_bCmmtktYn; }
            set { m_bCmmtktYn = value; }
        }

        public string ParkngNo
        {
            get { return m_strParkngNo; }
            set { m_strParkngNo = value; }
        }
    }

    public class RequestExcelPartialParkingHistory
    {
        private List<ParkingData> m_histories = new List<ParkingData>();

        public List<ParkingData> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }
    }
}
