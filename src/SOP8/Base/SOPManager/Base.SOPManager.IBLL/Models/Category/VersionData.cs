using Base.Model.Sop.Category;

namespace Base.SOPManager.IBLL.Models.Category
{
    public class VersionData
    {
        private Version m_version = null;
        private string m_strOwnerName = "";

        public Version Version
        {
            get { return m_version; }
            set { m_version = value; }
        }

        public string Owner
        {
            get { return m_strOwnerName; }
            set { m_strOwnerName = value; }
        }

        public VersionData(Version version = null)
        {
            m_version = version;
        }
    }
}
