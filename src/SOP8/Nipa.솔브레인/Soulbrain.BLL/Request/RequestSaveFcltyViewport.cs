using System;
using System.Collections.Generic;
using System.Text;

namespace Soulbrain.BLL.Request
{
    public class RequestSaveFcltyViewport
    {
        private int m_fcltyNo = 0;
        private double m_dCameraPosX = 0;
        private double m_dCameraPosY = 0;
        private double m_dCameraPosZ = 0;
        private double m_dCameraRotationX = 0;
        private double m_dCameraRotationY = 0;
        private double m_dCameraRotationZ = 0;
        private double m_dOrbitTargetX = 0;
        private double m_dOrbitTargetY = 0;
        private double m_dOrbitTargetZ = 0;
        private int? m_nZoneNo = null;

        public int FcltyNo
        {
            get { return m_fcltyNo; }
            set { m_fcltyNo = value; }
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

        public double OrbitTargetX
        {
            get { return m_dOrbitTargetX; }
            set { m_dOrbitTargetX = value; }
        }

        public double OrbitTargetY
        {
            get { return m_dOrbitTargetY; }
            set { m_dOrbitTargetY = value; }
        }

        public double OrbitTargetZ
        {
            get { return m_dOrbitTargetZ; }
            set { m_dOrbitTargetZ = value; }
        }

        public int? ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }
    }
}
