using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseJobLevels : MessageResult
    {
        private List<Option> m_options = new List<Option>();

        public List<Option> Options
        {
            get { return m_options; }
            set { m_options = value; }
        }

        public ResponseJobLevels()
            : base()
        {
        }

        public ResponseJobLevels(bool success, string message)
            : base(success, message)
        {
        }
    }
}
