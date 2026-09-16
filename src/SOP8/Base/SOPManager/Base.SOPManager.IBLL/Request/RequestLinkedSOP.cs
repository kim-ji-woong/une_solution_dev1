using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Request
{
    using Models;

    public class RequestLinkedSOP
    {
        private int? m_siteNo = null;
        private List<SensorTypeData> m_sensorTypeDatas = null;

        public int? SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public List<SensorTypeData> SensorTypeDatas
        {
            get { return m_sensorTypeDatas; }
            set { m_sensorTypeDatas = value; }
        }
    }
}
