namespace Base.SDMS.IBLL.Request
{
    public class RequestFakeWall
    {
        // 외부영역은 지원하지 않는다.
        private int m_nZoneNo = -1;

        // 외부영역은 지원하지 않는다.
        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }
    }
}
