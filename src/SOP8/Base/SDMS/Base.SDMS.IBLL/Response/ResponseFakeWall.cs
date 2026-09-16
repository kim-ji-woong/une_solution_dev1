using System.Collections.Generic;
using Base.Model.Spatial;
using Response;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseFakeWall : MessageResult
    {
        private int m_nZoneNo = -1;
        private List<FakeWall> m_fakeWalls = new List<FakeWall>();

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public List<FakeWall> FakeWalls
        {
            get { return m_fakeWalls; }
            set { m_fakeWalls = value; }
        }

        public ResponseFakeWall()
            : base()
        {
        }

        public ResponseFakeWall(bool success, string message)
            : base(success, message)
        {
        }
    }
}
