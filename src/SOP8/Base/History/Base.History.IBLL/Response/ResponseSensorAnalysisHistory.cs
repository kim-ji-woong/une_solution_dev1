using System.Collections.Generic;
using Response;

namespace Base.History.IBLL.Response
{
    using Models.History;

    public class ResponseSensorAnalysisHistory : PagingMessageResult
    {
        private List<SensorAnalysisHistory> m_histories = new List<SensorAnalysisHistory>();
        private int m_nTotalDetectionCount = 0;
        private double m_malfunctionRatio = 0;
        private string m_mostDetectionSensorName = null;
        private int? m_mostDetectionSensorCount = null;
        private string m_mostDetectionLocationName = null;
        private int? m_mostDetectionLocationCount = null;
        private string m_mostDetectionSensorTypeName = null;
        private int? m_mostDetectionSensorTypeCount = null;
        private string m_topMalfunctionSensorName = null;
        private double m_topMalfunctionSensorRatio = 0;
        private string m_strBuildingGroupName = null;
        private string m_strBuildingName = null;
        private string m_strZoneName = null;

        public List<SensorAnalysisHistory> Histories
        {
            get { return m_histories; }
        }

        // 전체 센서탐지 횟수
        public int TotalDetectionCount
        {
            get { return m_nTotalDetectionCount; }
            set { m_nTotalDetectionCount = value; }
        }

        // 전체 오작동률(%)
        public double TotalMalfunctionRatio
        {
            get { return m_malfunctionRatio; }
            set { m_malfunctionRatio = value; }
        }

        // 가장 탐지횟수가 높은 센서이름
        public string MostDetectionSensorName
        {
            get { return m_mostDetectionSensorName; }
            set { m_mostDetectionSensorName = value; }
        }

        // 가장 탐지횟수가 높은 센서의 탐지횟수
        public int? MostDetectionSensorCount
        {
            get { return m_mostDetectionSensorCount; }
            set { m_mostDetectionSensorCount = value; }
        }

        // 가장 탐지횟수가 높은 위치이름
        public string MostDetectionLocationName
        {
            get { return m_mostDetectionLocationName; }
            set { m_mostDetectionLocationName = value; }
        }

        // 가장 탐지횟수가 높은 위치의 탐지횟수
        public int? MostDetectionLocationCount
        {
            get { return m_mostDetectionLocationCount; }
            set { m_mostDetectionLocationCount = value; }
        }

        // 가장 탐지횟수가 높은 센서타입 이름
        public string MostDetectionSensorTypeName
        {
            get { return m_mostDetectionSensorTypeName; }
            set { m_mostDetectionSensorTypeName = value; }
        }

        // 가장 탐지횟수가 높은 센서타입의 탐지횟수
        public int? MostDetectionSensorTypeCount
        {
            get { return m_mostDetectionSensorTypeCount; }
            set { m_mostDetectionSensorTypeCount = value; }
        }

        // 가장 오작동률이 높은 센서이름
        public string TopMalfunctionSensorName
        {
            get { return m_topMalfunctionSensorName; }
            set { m_topMalfunctionSensorName = value; }
        }

        // 가장 오작동률이 높은 센서의 오작동률(%)
        public double TopMalfunctionSensorRatio
        {
            get { return m_topMalfunctionSensorRatio; }
            set { m_topMalfunctionSensorRatio = value; }
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

        public ResponseSensorAnalysisHistory()
            : base()
        {
        }

        public ResponseSensorAnalysisHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
