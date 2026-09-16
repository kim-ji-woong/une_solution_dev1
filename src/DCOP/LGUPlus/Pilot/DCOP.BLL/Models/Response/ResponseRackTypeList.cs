using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseRackTypeList : MessageResult
    {
        private List<RackTypeEx> m_rackTypes = new List<RackTypeEx>();
        private int m_nTotalCount = 0;

        public List<RackTypeEx> RackTypes
        {
            get { return m_rackTypes; }
            set { m_rackTypes = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseRackTypeList()
            : base()
        {
        }

        public ResponseRackTypeList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class RackTypeEx : RackType
    {
        private Company m_company = null;

        public Company Company
        {
            get { return m_company; }
            set { m_company = value; }
        }

        public RackTypeEx()
        {
        }

        public RackTypeEx(RackType rackType, Company company)
        {
            SetRackType(rackType);
            m_company = company;
        }

        public void SetRackType(RackType rackType)
        {
            this.RackTypeNo = rackType.RackTypeNo;
            this.CompanyNo = rackType.CompanyNo;
            this.ModelName = rackType.ModelName;
            this.Height = rackType.Height;
            this.Width = rackType.Width;
            this.Depth = rackType.Depth;
            this.Unit = rackType.Unit;
            this.ImageUrl = rackType.ImageUrl;
            this.GlbUrl = rackType.GlbUrl;
            this.FbxUrl = rackType.FbxUrl;
            this.RegTime = rackType.RegTime;
            this.Type = rackType.Type;
            this.Barcode = rackType.Barcode;
        }
    }
}
