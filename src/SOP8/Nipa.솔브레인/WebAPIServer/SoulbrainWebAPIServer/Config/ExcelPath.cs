using Microsoft.Extensions.Configuration;

namespace SoulbrainWebAPIServer.Config
{
    public class ExcelPath : Config
    {
        private string m_strPath = "";
        
        public string Path
        {
            get { return m_strPath; }
            set { m_strPath = value; }
        }
        
        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "ExcelPath:Path", ref m_strPath);
        }
    }
}