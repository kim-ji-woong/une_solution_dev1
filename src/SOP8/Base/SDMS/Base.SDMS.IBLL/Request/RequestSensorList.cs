using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestSensorList
    {
        private List<int> m_sensorTypes = null;
        private List<int> m_siteNos = null;
        private bool? m_enabled = null;
        private string m_strSearchText = null;
        private int? m_pageIndex = null;
        private int? m_pageItemCount = null;

        // 이 값이 null이면 전체 SensorType을 얻어온다.
        public List<int> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public List<int> SiteNos
        {
            get { return m_siteNos; }
            set { m_siteNos = value; }
        }

        public bool? Enabled
        {
            get { return m_enabled; }
            set { m_enabled = value; }
        }

        public string SearchText
        {
            get { return m_strSearchText; }
            set { m_strSearchText = value; }
        }

        public int? PageIndex
        {
            get { return m_pageIndex; }
            set { m_pageIndex = value; }
        }

        public int? PageItemCount
        {
            get { return m_pageItemCount; }
            set { m_pageItemCount = value; }
        }
    }
}
