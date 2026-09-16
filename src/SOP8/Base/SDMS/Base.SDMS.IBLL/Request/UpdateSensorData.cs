using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SDMS.IBLL.Request
{
    public class UpdateSensorData
    {
        public class SensorData
        {
            private int m_nSensorNo = -1;
            // 이 값이 true이면 다른 값들은 모두 무시된다.
            private bool m_deleted = false;
            private bool? m_enabled = null;
            private double? x = null;
            private double? y = null;
            private double? z = null;
            private int? m_zoneNo = null;
            private int? m_equipZoneNo = null;

            public int SensorNo
            {
                get { return m_nSensorNo; }
                set { m_nSensorNo = value; }
            }

            public bool Deleted
            {
                get { return m_deleted; }
                set { m_deleted = value; }
            }

            public bool? Enabled
            {
                get { return m_enabled; }
                set { m_enabled = value; }
            }

            public double? X
            {
                get { return x; }
                set { x = value; }
            }

            public double? Y
            {
                get { return y; }
                set { y = value; }
            }

            public double? Z
            {
                get { return z; }
                set { z = value; }
            }

            public int? ZoneNo
            {
                get { return m_zoneNo; }
                set { m_zoneNo = value; }
            }

            public int? EquipZoneNo
            {
                get { return m_equipZoneNo; }
                set { m_equipZoneNo = value; }
            }
        }

        private int m_nUserNo = -1;
        private List<SensorData> m_sensorDatas = new List<SensorData>();

        public int UserNo
        {
            get { return m_nUserNo; }
            set { m_nUserNo = value; }
        }

        // 업데이트할 센서 목록
        public List<SensorData> UpdateDatas
        {
            get { return m_sensorDatas; }
            set { m_sensorDatas = value; }
        }
    }
}
