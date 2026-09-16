namespace Kftc.BLL.Request
{
    // 특정 센서와 연결된 CCTV 목록을 얻어온다.
    // 구역별 CCTV인지 센서별 CCTV인지 여부는 사용자가 신경쓰지 않는다.
    public class RequestCCTVList
    {
        private int m_nSensorNo = -1;

        public int SensorNo
        {
            get { return m_nSensorNo; }
            set { m_nSensorNo = value; }
        }
    }
}
