using Microsoft.Extensions.Configuration;

namespace SOPWebServer.Config
{
    public class ExternalAccess
    {
        private string[] m_allowedIps = new string[0];

        public string[] AllowedIps
        {
            get { return m_allowedIps; }
            set { m_allowedIps = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            string[] ips = config.GetSection("ExternalAccess:AllowedIps").Get<string[]>();
            m_allowedIps = ips ?? new string[0];
        }
    }
}
