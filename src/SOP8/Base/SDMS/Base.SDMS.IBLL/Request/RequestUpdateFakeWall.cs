using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class RequestUpdateFakeWall
    {
        private int m_nUserNo = -1;
        private List<FakeWallData> m_updateDatas = new List<FakeWallData>();

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        public List<FakeWallData> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }
    }

    public class FakeWallData
    {
        public enum UpdateMode { None = 0, Add, Move, Rotate, Resize, Delete };

        private int m_nFakeWallNo = -1;
        private int m_nZoneNo = -1;
        private float x = 0;
        private float y = 0;
        private float z = 0;
        private float m_fRotate = 0;
        private float m_fScale = 0;
        private int m_nMode = (int)UpdateMode.None;

        public int FakeWallNo
        {
            get { return m_nFakeWallNo; }
            set { m_nFakeWallNo = value; }
        }

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public float X
        {
            get { return x; }
            set { x = value; }
        }

        public float Y
        {
            get { return y; }
            set { y = value; }
        }

        public float Z
        {
            get { return z; }
            set { z = value; }
        }

        // Radian
        public float Rotate
        {
            get { return m_fRotate; }
            set { m_fRotate = value; }
        }

        public float Scale
        {
            get { return m_fScale; }
            set { m_fScale = value; }
        }

        // UpdateMode
        public int Mode
        {
            get { return m_nMode; }
            set { m_nMode = value; }
        }

        public bool IsDeleted
        {
            get { return m_nMode == (int)UpdateMode.Delete; }
        }

        public bool IsNew
        {
            get { return m_nFakeWallNo < 0 || m_nMode == (int)UpdateMode.Add; }
        }
    }
}
