using System.Collections.Generic;
using Base.Model.Sop.Config;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    public class ResponseLinkedSOPs : MessageResult
    {
        private List<LinkedSopEx> m_linkedSops = null;

        public List<LinkedSopEx> LinkedSops
        {
            get { return m_linkedSops; }
            set { m_linkedSops = value; }
        }

        public ResponseLinkedSOPs()
            : base()
        {
        }

        public ResponseLinkedSOPs(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class LinkedSopEx : LinkedSop
    {
        private string m_strSensorTypeName = null;
        private string m_strLargeClassName = "";
        private string m_strMiddleClassName = "";
        private string m_strBuildingGroupName = null;
        private string m_strBuildingName = null;
        private string m_strZoneName = "";

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public string LargeClassName
        {
            get { return m_strLargeClassName; }
            set { m_strLargeClassName = value; }
        }

        public string MiddleClassName
        {
            get { return m_strMiddleClassName; }
            set { m_strMiddleClassName = value; }
        }

        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        public LinkedSopEx()
        {
        }

        public LinkedSopEx(LinkedSop sop)
        {
            this.FromCopy(sop);
        }
    }
}
