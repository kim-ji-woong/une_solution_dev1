using Response.Request;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Request
{
    public class RequestPatrolHistory : RequestPage
    {
        private int m_nBeginYear = -1;
        private int m_nBeginMonth = -1;
        private int m_nBeginDay = -1;
        private int m_nEndYear = -1;
        private int m_nEndMonth = -1;
        private int m_nEndDay = -1;

        private string m_strCourseName = null;
        private string m_strWorkerName = null;

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

        public string CourseName
        {
            get { return m_strCourseName; }
            set { m_strCourseName = value; }
        }

        public string WorkerName
        {
            get { return m_strWorkerName; }
            set { m_strWorkerName = value; }
        }
    }
}
