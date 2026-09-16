using System.Collections.Generic;
using Response;

namespace Base.Weather.IBLL.Response
{
    using Models;

    public class ResponseCurrent : MessageResult
    {
        private List<CurrentEx> m_currentWeathers = new List<CurrentEx>();

        public List<CurrentEx> CurrentWeathers
        {
            get { return m_currentWeathers; }
        }

        public ResponseCurrent()
            : base()
        {
        }

        public ResponseCurrent(bool success, string message)
            : base(success, message)
        {
        }
    }
}
