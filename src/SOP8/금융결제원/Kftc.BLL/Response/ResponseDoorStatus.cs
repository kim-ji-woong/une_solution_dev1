using System.Collections.Generic;
using Response;

namespace Kftc.BLL.Response
{
    public class ResponseDoorStatus : MessageResult
    {
        private List<DoorData> m_doors = new List<DoorData>();

        public List<DoorData> DoorDatas
        {
            get { return m_doors; }
            set { m_doors = value; }
        }

        public ResponseDoorStatus()
            : base()
        {
        }

        public ResponseDoorStatus(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class DoorData
    {
        private int m_nSensorNo = -1;
        private bool? m_isOpened = null;

        public int SensorNo
        {
            get { return m_nSensorNo; }
            set { m_nSensorNo = value; }
        }

        public bool? IsOpened
        {
            get { return m_isOpened; }
            set { m_isOpened = value; }
        }

        public DoorData()
        {
        }

        public DoorData(int sensorNo, bool? isOpened)
        {
            m_nSensorNo = sensorNo;
            m_isOpened = isOpened;
        }
    }
}
