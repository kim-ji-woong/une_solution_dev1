using Microsoft.Extensions.Configuration;

namespace SoulbrainWebAPIServer.Config
{
    public class SOPWebServer : Config
    {
        private string m_strUrl = "";

        // 초순수, 전력 URL 정보
        private string m_strUrl_Power = "";
        private string m_strUrl_Facility = "";

        public string Url
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }

        public string Url_Power
        {
            get { return m_strUrl_Power; }
            set { m_strUrl_Power = value; }
        }

        public string Url_Facility
        {
            get { return m_strUrl_Facility; }
            set { m_strUrl_Facility = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "SOPWebServer:Url", ref m_strUrl);
            ReadString(config, "SOPWebServer:Url_Power", ref m_strUrl_Power);
            ReadString(config, "SOPWebServer:Url_Facility", ref m_strUrl_Facility);
        }
    }
}