using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseCourseList : MessageResult
    {
        public List<string> CourseList { get; set; }

        public ResponseCourseList()
            : base()
        {
        }

        public ResponseCourseList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
