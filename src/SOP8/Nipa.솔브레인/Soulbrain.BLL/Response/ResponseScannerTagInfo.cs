using System.Collections.Generic;
using Response;
using Soulbrain.Model.History;

namespace Soulbrain.BLL.Response
{
    public class ResponseScannerTagInfo : MessageResult
    {
        private ScannerTag m_scannerTag = new ScannerTag();
        
        public ScannerTag ScannerTag
        {
            get { return m_scannerTag; }
            set { m_scannerTag = value; }
        }
        
        public ResponseScannerTagInfo()
            : base()
        {
        }
        
        public ResponseScannerTagInfo(bool success, string message)
            : base(success, message)
        {
        }
        
        public ResponseScannerTagInfo(bool success, string message, ScannerTag scannerTag)
            : base(success, message)
        {
            ScannerTag = scannerTag;
        }
    }
}