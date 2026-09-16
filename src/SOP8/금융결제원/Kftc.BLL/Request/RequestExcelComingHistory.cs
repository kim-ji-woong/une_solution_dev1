using Kftc.BLL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestExcelComingHistory
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;

        private bool? m_IsVisitor = null;
        private int? m_DoorNo = null;
        private string m_PersonName = null;
        private bool m_IsImportArea = false;

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


        public bool? IsVisitor
        {
            get { return m_IsVisitor; }
            set { m_IsVisitor = value; }
        }

        public int? DoorNo
        {
            get { return m_DoorNo; }
            set { m_DoorNo = value; }
        }

        public string PersonName
        {
            get { return m_PersonName; }
            set { m_PersonName = value; }
        }

        public bool IsImportArea
        {
            get { return m_IsImportArea; }
            set { m_IsImportArea = value; }
        }
    }

    public class RequestExcelPartialComingHistory
    {
        private List<ComingHistory> m_histories = new List<ComingHistory>();

        public List<ComingHistory> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }
    }
}
