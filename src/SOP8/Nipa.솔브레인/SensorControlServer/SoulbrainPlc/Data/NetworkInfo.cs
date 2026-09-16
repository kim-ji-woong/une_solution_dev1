namespace SoulbrainPlc.Data
{
    public class NetworkInfo
    {
        private string m_strNetworkFolderPath;
        private string m_strUserName;
        private string m_strPassword;
        
        public string NetworkFolderPath { get => m_strNetworkFolderPath; set => m_strNetworkFolderPath = value; }
        public string UserName { get => m_strUserName; set => m_strUserName = value; }
        public string Password { get => m_strPassword; set => m_strPassword = value; }
    }
}