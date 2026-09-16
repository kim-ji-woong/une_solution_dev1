namespace Base.SDMS.IBLL.Request
{
    public class RequestSaveOrthoViewport
    {
        private int? m_userNo = null;
        private string m_strModelName = "";
        private double m_dCameraPosX = 0;
        private double m_dCameraPosY = 0;
        private double m_dCameraPosZ = 0;
        private double m_dCameraRotationX = 0;
        private double m_dCameraRotationY = 0;
        private double m_dCameraRotationZ = 0;
        private double m_dTargetX = 0;
        private double m_dTargetY = 0;
        private double m_dTargetZ = 0;
        private float m_fZoom = 1.0f;
        // 이 값이 null이면 m_strModelName을 이용하여 업데이트 한다.
        private int? m_nZoneNo = null;

        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
        }

        public string ModelName
        {
            get { return m_strModelName; }
            set { m_strModelName = value; }
        }

        public double CameraPositionX
        {
            get { return m_dCameraPosX; }
            set { m_dCameraPosX = value; }
        }

        public double CameraPositionY
        {
            get { return m_dCameraPosY; }
            set { m_dCameraPosY = value; }
        }

        public double CameraPositionZ
        {
            get { return m_dCameraPosZ; }
            set { m_dCameraPosZ = value; }
        }

        public double CameraRotationX
        {
            get { return m_dCameraRotationX; }
            set { m_dCameraRotationX = value; }
        }

        public double CameraRotationY
        {
            get { return m_dCameraRotationY; }
            set { m_dCameraRotationY = value; }
        }

        public double CameraRotationZ
        {
            get { return m_dCameraRotationZ; }
            set { m_dCameraRotationZ = value; }
        }

        public double TargetX
        {
            get { return m_dTargetX; }
            set { m_dTargetX = value; }
        }

        public double TargetY
        {
            get { return m_dTargetY; }
            set { m_dTargetY = value; }
        }

        public double TargetZ
        {
            get { return m_dTargetZ; }
            set { m_dTargetZ = value; }
        }

        public float Zoom
        {
            get { return m_fZoom; }
            set { m_fZoom = value; }
        }

        // 이 값이 null이면 ModelName을 이용하여 업데이트 한다.
        public int? ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }
    }
}
