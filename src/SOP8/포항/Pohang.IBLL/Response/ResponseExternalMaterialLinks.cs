using System.Collections.Generic;
using Pohang.Model;
using Response;

namespace Pohang.IBLL.Response
{
    public class ResponseExternalMaterialLinks : MessageResult
    {
        private List<MaterialLink> m_materialLinks = new List<MaterialLink>();
        
        public List<MaterialLink> MaterialLinks
        {
            get { return m_materialLinks; }
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