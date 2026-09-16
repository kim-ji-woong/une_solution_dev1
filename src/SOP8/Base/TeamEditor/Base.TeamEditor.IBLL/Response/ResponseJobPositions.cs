using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseJobPositions : MessageResult
    {
        private List<Option> m_options = new List<Option>();

        public List<Option> Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public ResponseJobPositions()
            : base()
        {
        }

        public ResponseJobPositions(bool success, string message)
            : base(success, message)
        {
        }
    }
}
