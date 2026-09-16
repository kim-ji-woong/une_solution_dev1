using System.Collections.Generic;
using Gwangyang.Model;
using Response;

namespace Gwangyang.IBLL.Response
{
    public class ResponseExternalMaterialLinks : MessageResult
    {
        private List<MaterialLink> m_materialLinks = new List<MaterialLink>();
        
        public List<MaterialLink> MaterialLinks
        {
            get { return m_materialLinks; }
            set { m_materialLinks = value; }       
        }
        
        public ResponseExternalMaterialLinks()
            : base()
        {
        }
        
        public ResponseExternalMaterialLinks(bool success, string message)
            : base(success, message)
        {
        }
    }
}