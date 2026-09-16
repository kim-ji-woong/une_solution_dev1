using Base.Model.Sensor.CCTV;
using System.Collections.Generic;
using Response;

namespace Kftc.BLL.Response
{
    // 특정 센서와 연결된 CCTV 목록을 얻어온다.
    public class ResponseCCTVList : MessageResult
    {
        private List<CctvEx> m_cctvs = new List<CctvEx>();
        private int? m_equipZoneNo = null;
        private int? m_sensorZoneNo = null;

        public List<CctvEx> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        // 이 값이 null이 아니면 구역별 CCTV를 사용한다.
        public int? EquipZoneNo
        {
            get { return m_equipZoneNo; }
            set { m_equipZoneNo = value; }
        }

        // 이 값이 null이 아니면 SensorZone별 CCTV를 사용한다.
        public int? SensorZoneNo
        {
            get { return m_sensorZoneNo; }
            set { m_sensorZoneNo = value; }
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
