using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    // 1. 센서 번호별로 검색한다.
    //    SensorNos가 null이면 ZoneNo에 해당하는 센서를 조회한다.
    // 2. ZoneNo가 null이면 전체 센서를 검색한다.
    // 3. SensorTypes에 해당하는 센서를 검색한다.
    //    SensorTypes가 null이면 전체 센서타입이 검색대상이 된다.
    // 4. 모두 null이면 전체 센서를 조회한다.
    public class RequestZoneSensorList
    {
        private List<int> m_sensorTypes = null;
        private int? m_zoneNo = null;
        private List<int> m_sensorNos = null;

        public List<int> SensorTypes
        {
            get { return m_sensorTypes; }
            set { m_sensorTypes = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public List<int> SensorNos
        {
            get { return m_sensorNos; }
            set { m_sensorNos = value; }
        }
    }
}
