using System.Collections.Generic;
using Response;
using Base.Model.Sensor.CCTV;

namespace Base.SDMS.IBLL.Response
{
    public class ResponseCCTVList : MessageResult
    {
        private List<CctvEx> m_cctvs = new List<CctvEx>();
        
        public List<CctvEx> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ResponseCCTVList()
            : base()
        {
        }

        public ResponseCCTVList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseEquipZoneCCTVList : ResponseCCTVList
    {
        private int? m_equipZoneNo = null;

        public int? EquipZoneNo
        {
            get { return m_equipZoneNo; }
            set { m_equipZoneNo = value; }
        }

        public ResponseEquipZoneCCTVList()
            : base()
        {
        }

        public ResponseEquipZoneCCTVList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSensorZoneCCTVList : ResponseCCTVList
    {
        private int? m_sensorZoneNo = null;

        public int? SensorZoneNo
        {
            get { return m_sensorZoneNo; }
            set { m_sensorZoneNo = value; }
        }

        public ResponseSensorZoneCCTVList()
            : base()
        {
        }

        public ResponseSensorZoneCCTVList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class CctvEx : CCTV
    {
        private string m_strCameraName = "";

        public string CameraName
        {
            get { return m_strCameraName; }
            set { m_strCameraName = value; }
        }

        public CctvEx()
        {
        }

        public CctvEx(CCTV cctv)
        {
            this.FromCopy(cctv);
        }
    }
}
