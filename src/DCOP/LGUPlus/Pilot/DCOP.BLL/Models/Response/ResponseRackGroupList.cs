using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Response
{
    public class ResponseRackGroupList : MessageResult
    {
        private List<RackGroupEx> m_rackGroups = new List<RackGroupEx>();
        private int m_nTotalCount = 0;

        public List<RackGroupEx> RackGroups
        {
            get { return m_rackGroups; }
            set { m_rackGroups = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseRackGroupList()
            : base()
        {
        }

        public ResponseRackGroupList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class RackGroupEx : RackGroup
    {
        private List<RackEx> m_racks = new List<RackEx>();

        public List<RackEx> Racks
        {
            get { return m_racks; }
            set { m_racks = value; }
        }

        public RackGroupEx()
        {
        }

        public RackGroupEx(RackGroup rackGroup)
        {
            this.RackGroupNo = rackGroup.RackGroupNo;
            this.DataCenterNo = rackGroup.DataCenterNo;
            this.GroupName = rackGroup.GroupName;
        }
    }

    public class RackEx : Rack
    {
        private RackType m_rackType = null;
        private string m_strCompanyName = "";

        public RackType RackType
        {
            get { return m_rackType; }
            set { m_rackType = value; }
        }

        public string CompanyName
        {
            get { return m_strCompanyName; }
            set { m_strCompanyName = value; }
        }

        public RackEx()
        {
        }

        public RackEx(Rack rack)
        {
            SetRack(rack);
        }

        public RackEx(Rack rack, RackType rackType)
        {
            SetRack(rack);
            m_rackType = rackType;
        }

        public void SetRack(Rack rack)
        {
            this.RackNo = rack.RackNo;
            this.RackName = rack.RackName;
            this.DataCenterNo = rack.DataCenterNo;
            this.RackGroupNo = rack.RackGroupNo;
            this.RackTypeNo = rack.RackTypeNo;
            this.Rotation = rack.Rotation;
            this.X = rack.X;
            this.Y = rack.Y;
            this.Z = rack.Z;
            this.RegTime = rack.RegTime;
            this.Barcode = rack.Barcode;
        }
    }
}
