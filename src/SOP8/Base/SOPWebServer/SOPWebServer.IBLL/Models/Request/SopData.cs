namespace SOPWebServer.IBLL.Models.Request
{
    public class RequestRunAlarmSop
    {
        private int m_nSensorZoneHistoryNo = -1;
        // 누가 SOP를 실행하도록 할것인가?
        // 이 값이 없으면 실행중인 SOP Simulator가 다수일 경우 SOP를 시작할 주체가 누가될지 혼란스러울수 있다.
        private int m_nUserNo = -1;

        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        // 누가 SOP를 실행하도록 할것인가?
        // 이 값이 없으면 실행중인 SOP Simulator가 다수일 경우 SOP를 시작할 주체가 누가될지 혼란스러울수 있다.
        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }
    }
}
