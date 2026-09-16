using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class UpdateSensorZoneCCTVs
    {
        private List<UpdateCCTVData> m_updateDatas = new List<UpdateCCTVData>();
        // SensorZoneNo
        private List<int> m_deleteDatas = new List<int>();

        public List<UpdateCCTVData> UpdateDatas
        {
            get { return m_updateDatas; }
            set { m_updateDatas = value; }
        }

        // SensorZoneNo
        public List<int> DeleteDatas
        {
            get { return m_deleteDatas; }
            set { m_deleteDatas = value; }
        }
    }

    public class UpdateCCTVData
    {
        private int m_nSensorZoneNo = -1;
        // CCTV의 SensorNo
        private int? m_cctv1 = null;
        private int? m_cctv2 = null;
        private int? m_cctv3 = null;
        private int? m_cctv4 = null;

        public int SensorZoneNo
        {
            get { return m_nSensorZoneNo; }
            set { m_nSensorZoneNo = value; }
        }

        // CCTV의 SensorNo
        public int? Cctv1
        {
            get { return m_cctv1; }
            set { m_cctv1 = value; }
        }

        // CCTV의 SensorNo
        public int? Cctv2
        {
            get { return m_cctv2; }
            set { m_cctv2 = value; }
        }

        // CCTV의 SensorNo
        public int? Cctv3
        {
            get { return m_cctv3; }
            set { m_cctv3 = value; }
        }

        // CCTV의 SensorNo
        public int? Cctv4
        {
            get { return m_cctv4; }
            set { m_cctv4 = value; }
        }
    }
}
