using Microsoft.Extensions.Configuration;

namespace SoulbrainWebAPIServer.Config
{
    public class Log : Config
    {
        private string m_strFolder = "";
        private int m_nLifeTime = 30;
        private string m_strFileTag = "";

        public string Folder
        {
            get { return m_strFolder; }
            set { m_strFolder = value; }
        }
        public int LifeTime
        {
            get { return m_nLifeTime; }
            set { m_nLifeTime = value; }
        }
        public string FileTag
        {
            get { return m_strFileTag; }
            set { m_strFileTag = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Log:Folder", ref m_strFolder);
            ReadString(config, "Log:FileTag", ref m_strFileTag);

            int? nTemp = null;
            ReadInt(config, "Log:LifeTime", ref nTemp);

            if (nTemp.HasValue)
                m_nLifeTime = nTemp.Value;
        }
    }
}