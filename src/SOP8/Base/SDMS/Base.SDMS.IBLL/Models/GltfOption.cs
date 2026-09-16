namespace Base.SDMS.IBLL.Models
{
    public class GltfOption
    {
        private string m_strModelBaseUrl = "";
        private string m_strTextureBaseUrl = "";
        private string m_strBackgroundImage = "";
        private bool m_indoorModelOnMemory = true;
        private string m_strHdrUrl = null;

        public string ModelBaseUrl
        {
            get { return m_strModelBaseUrl; }
            set { m_strModelBaseUrl = value; }
        }

        public string TextureBaseUrl
        {
            get { return m_strTextureBaseUrl; }
            set { m_strTextureBaseUrl = value; }
        }

        public string BackgroundImage
        {
            get { return m_strBackgroundImage; }
            set { m_strBackgroundImage = value; }
        }

        public bool IndoorModelOnMemory
        {
            get { return m_indoorModelOnMemory; }
            set { m_indoorModelOnMemory = value; }
        }

        public string HdrUrl
        {
            get { return m_strHdrUrl; }
            set { m_strHdrUrl = value; }
        }
    }
}
