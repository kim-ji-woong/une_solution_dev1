using Response;
using System.Collections.Generic;
using Base.Model.Account;

namespace Base.Account.IBLL.Response
{
    public class ResponseGradeList : MessageResult
    {
        private List<Grade> m_grades = new List<Grade>();

        public List<Grade> Grades
        {
            get { return m_grades; }
            set { m_grades = value; }
        }

        public ResponseGradeList()
            : base()
        {
        }

        public ResponseGradeList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
