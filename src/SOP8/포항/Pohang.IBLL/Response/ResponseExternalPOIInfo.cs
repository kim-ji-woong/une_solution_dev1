using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalPOIInfo : MessageResult
    {
        private List<POIInfo> m_poiInfos = new List<POIInfo>();
        
        public List<POIInfo> POIInfos
        {
            get { return m_poiInfos; }
            set { m_poiInfos = value; }
        }
        
        public ResponseExternalPOIInfo()
            : base()
        {
        }
        
        public ResponseExternalPOIInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}