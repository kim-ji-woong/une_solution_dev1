namespace Base.SDMS.IBLL.Request
{
    // 특정 Zone에 속해있는 센서와 EquipZone 정보를 요청한다.
    // 센서는 위치와 상태정보가 바뀔수 있다.
    // EquipZone은 위치와 Text가 바뀔수 있다.
    public class RequestZone
    {
        private int m_nSiteNo = -1;
        // 이 값이 null이면 외부영역
        private int? m_zoneNo = null;

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }
    }
}
