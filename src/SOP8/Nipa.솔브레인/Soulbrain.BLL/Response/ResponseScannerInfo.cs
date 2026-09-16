using System.Collections.Generic;
using Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Response
{
    public class ResponseScannerInfo : MessageResult
    {
        private List<ScannerStatus> m_scanners = new List<ScannerStatus>();
        
        public List<ScannerStatus> Scanners
        {
            get { return m_scanners; }
            set { m_scanners = value; }
        }
        
        public ResponseScannerInfo()
            : base()
        {
        }
        
        public ResponseScannerInfo(bool success, string message)
            : base(success, message)
        {
        }
        
    }

    public class ScannerStatus : Scanner
    {
        private List<ScannerCurrentTagInfo> m_scannerCurrentTagInfos = new List<ScannerCurrentTagInfo>();
        
        public List<ScannerCurrentTagInfo> ScannerCurrentTagInfos
        {
            get { return m_scannerCurrentTagInfos; }
            set { m_scannerCurrentTagInfos = value; }
        }
        
        public ScannerStatus(Scanner scanner)
        {
            scnr_sn = scanner.scnr_sn;
            scnr_macaddr = scanner.scnr_macaddr;
            sensor_sn = scanner.sensor_sn;
            sensor_ty_code = scanner.sensor_ty_code;
            sensor_ty_optn_code = scanner.sensor_ty_optn_code;
            scnr_name = scanner.scnr_name;
            tag_co = scanner.tag_co;
            tag_nnpmsn_co = scanner.tag_nnpmsn_co;
            tag_prmisn_co = scanner.tag_prmisn_co;
        }
    }
}