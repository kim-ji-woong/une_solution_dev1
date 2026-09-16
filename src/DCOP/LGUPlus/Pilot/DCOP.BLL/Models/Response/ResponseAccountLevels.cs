using System.Collections.Generic;
using DCOP.Model.Account;

namespace DCOP.BLL.Models.Response
{
    public class ResponseAccountLevels : MessageResult
    {
        private List<Level> m_levels = new List<Level>();

        public List<Level> Levels
        {
            get { return m_levels; }
            set { m_levels = value; }
        }

        public ResponseAccountLevels()
            : base()
        {
        }

        public ResponseAccountLevels(bool success, string message)
            : base(success, message)
        {
        }
    }
}
