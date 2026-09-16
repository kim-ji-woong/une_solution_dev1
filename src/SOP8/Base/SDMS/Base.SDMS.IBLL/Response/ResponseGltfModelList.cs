using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    using Models;

    public class ResponseGltfModelList : MessageResult
    {
        private Dictionary<string, GltfModels> m_siteGltfModels = null;
        private GltfOption m_gltfOptions = new GltfOption();

        // Key : Site No
        public Dictionary<string, GltfModels> SiteModels
        {
            get { return m_siteGltfModels; }
            set { m_siteGltfModels = value; }
        }

        public GltfOption Options
        {
            get { return m_gltfOptions; }
            set { m_gltfOptions = value; }
        }

        public ResponseGltfModelList()
            : base()
        {
        }

        public ResponseGltfModelList(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseGltfModelList(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }
}
