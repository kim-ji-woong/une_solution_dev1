using Kftc.Model.History;
using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponsePatrolHistory : PagingMessageResult
    {
        private List<PatrolHistory> m_histories = new List<PatrolHistory>();

        public List<PatrolHistory> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }

        public ResponsePatrolHistory()
            : base()
        {
        }

        public ResponsePatrolHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class PatrolHistory
    {
        public string CourseName { get; set; }
        public string WorkerName { get; set; }
        public string PlaceName { get; set; }
        public DateTime PatrolTime { get; set; }
        public List<PatrolCourseHistory> CourseHistories { get; set; }
    }

    public class PatrolCourseHistory
    {
        public string CourseName { get; set; }
        public string WorkerName { get; set; }
        public string PlaceName { get; set; }
        public DateTime PatrolTime { get; set; }
    }
}
