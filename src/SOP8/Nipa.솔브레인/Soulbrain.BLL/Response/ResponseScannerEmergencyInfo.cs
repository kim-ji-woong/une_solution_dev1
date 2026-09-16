using System.Collections.Generic;
using Response;
using Soulbrain.Model.History;

namespace Soulbrain.BLL.Response
{
    public class ResponseScannerEmergencyInfo : MessageResult
    {
        private ScannerEmergency m_scannerEmergencyInfo = new ScannerEmergency();
        
        public ScannerEmergency ScannerEmergencyInfo
        {
            get { return m_scannerEmergencyInfo; }
            set { m_scannerEmergencyInfo = value; }
        }
        
        public ResponseScannerEmergencyInfo()
            : base()
        {
        }
        
        public ResponseScannerEmergencyInfo(bool success, string message)
            : base(success, message)
        {
        }
        
        public ResponseScannerEmergencyInfo(bool success, string message, ScannerEmergency scannerEmergencyInfo)
            : base(success, message)
        {
            ScannerEmergencyInfo = scannerEmergencyInfo;
        }
    }
}