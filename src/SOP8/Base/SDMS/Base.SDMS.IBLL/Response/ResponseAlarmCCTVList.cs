using System.Collections.Generic;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseAlarmCCTVList : MessageResult
    {
        private int m_nSensorZoneHistoryNo = -1;
        private List<CCTVData> m_cctvDatas = new List<CCTVData>();

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public List<CCTVData> CctvDatas
        {
            get { return m_cctvDatas; }
            set { m_cctvDatas = value; }
        }

        public ResponseAlarmCCTVList()
            : base()
        {
        }

        public ResponseAlarmCCTVList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class CCTVData
    {
        private int m_nZoneNo = -1;
        private int m_nCctvNo = -1;
        private string m_strCameraName = "";

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public int CctvNo
        {
            get { return m_nCctvNo; }
            set { m_nCctvNo = value; }
        }

        public string CameraName
        {
            get { return m_strCameraName; }
            set { m_strCameraName = value; }
        }
    }
}
