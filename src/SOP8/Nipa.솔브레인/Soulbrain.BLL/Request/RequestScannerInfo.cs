namespace Soulbrain.BLL.Request
{
    public class RequestScannerInfo
    {
        private int? scannerId;
        
        public int? ScannerId
        {
            get { return scannerId; }
            set { scannerId = value; }
        }
        
        public RequestScannerInfo()
        {
        }
    }
}