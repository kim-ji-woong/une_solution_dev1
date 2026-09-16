using Base.Model.Weather;

namespace Base.Weather.IBLL.Models
{
    public class CurrentEx : Current
    {
        private string m_strSiteName = "";

        public string SiteName
        {
            get { return m_strSiteName; }
            set { m_strSiteName = value; }
        }

        public CurrentEx()
        {
        }

        public CurrentEx(Current current)
        {
            this.FromCopy(current);
        }
    }
}
