using System;
using System.Collections.Generic;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    using Models.Category;

    public class ResponseDisasterVersions : MessageResult
    {
        private List<VersionData> m_versions = new List<VersionData>();
        private VersionData m_currentVersion = null;

        public List<VersionData> Versions
        {
            get { return m_versions; }
        }

        public VersionData CurrentVersion
        {
            get { return m_currentVersion; }
            set { m_currentVersion = value; }
        }

        public ResponseDisasterVersions()
            : base()
        {
        }

        public ResponseDisasterVersions(bool success, string message)
            : base(success, message)
        {
        }
    }
}
