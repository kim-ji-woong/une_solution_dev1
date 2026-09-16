using System;
using System.Collections.Generic;

namespace Base.SDMS.IBLL.Models
{
    public class GltfModel : IComparable
    {
        private List<GltfModel> m_childModels = new List<GltfModel>();
        private string m_fileName = null;
        private CameraData m_camera = null;
        private CameraOrthoData m_cameraOrtho = null;
        private int? m_buildingGroupNo = null;
        private int? m_buildingNo = null;
        private int? m_zoneNo = null;
        private double? m_floorIndex = null;

        public List<GltfModel> Children
        {
            get { return m_childModels; }
        }

        public string File
        {
            get { return m_fileName; }
            set { m_fileName = value; }
        }

        public CameraData Camera
        {
            get { return m_camera; }
            set { m_camera = value; }
        }

        public CameraOrthoData CameraOrtho
        {
            get { return m_cameraOrtho; }
            set { m_cameraOrtho = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public double? FloorIndex
        {
            get { return m_floorIndex; }
            set { m_floorIndex = value; }
        }

        public GltfModel()
        {
        }

        public int CompareTo(object obj)
        {
            GltfModel model = (GltfModel)obj;

            if (this.BuildingGroupNo != null)
            {
                if (model.BuildingGroupNo == null)
                    return -1;
                else
                {
                    if ((int)this.BuildingGroupNo < (int)model.BuildingGroupNo)
                        return -1;
                    else if ((int)this.BuildingGroupNo > (int)model.BuildingGroupNo)
                        return 1;
                }
            }
            else
            {
                if (model.BuildingGroupNo != null)
                    return 1;
            }

            return CompareToBuilding(model);
        }

        private int CompareToBuilding(GltfModel model)
        {
            if (this.BuildingNo != null)
            {
                if (model.BuildingNo == null)
                    return -1;
                else
                {
                    if ((int)this.BuildingNo < (int)model.BuildingNo)
                        return -1;
                    else if ((int)this.BuildingNo > (int)model.BuildingNo)
                        return 1;
                }
            }
            else
            {
                if (model.BuildingNo != null)
                    return 1;
            }

            return CompareToZone(model);
        }

        private int CompareToZone(GltfModel model)
        {
            if (this.ZoneNo != null)
            {
                if (model.ZoneNo == null)
                    return -1;
                else
                {
                    if ((int)this.ZoneNo < (int)model.ZoneNo)
                        return -1;
                    else if ((int)this.ZoneNo > (int)model.ZoneNo)
                        return 1;
                }
            }
            else
            {
                if (model.ZoneNo != null)
                    return 1;
            }

            return 0;
        }
    }

    public class GltfModels
    {
        private GltfModel m_outdoorModel = null;
        private List<GltfModel> m_indoorModels = new List<GltfModel>();

        public GltfModel OutdoorModel
        {
            get { return m_outdoorModel; }
            set { m_outdoorModel = value; }
        }

        public List<GltfModel> IndoorModels
        {
            get { return m_indoorModels; }
            set { m_indoorModels = value; }
        }
    }

    public class CameraData
    {
        private double[] m_position = new double[3] { 0, 0, 0 };
        private double[] m_rotation = new double[3] { 0, 0, 0 };
        private double[] m_orbit = new double[3] { 0, 0, 0 };
        private double m_fov = 0;
        private double m_near = 0;
        private double m_far = 0;

        public double[] Position
        {
            get { return m_position; }
            set { m_position = value; }
        }

        public double[] Rotation
        {
            get { return m_rotation; }
            set { m_rotation = value; }
        }

        public double[] Orbit
        {
            get { return m_orbit; }
            set { m_orbit = value; }
        }

        public double Fov
        {
            get { return m_fov; }
            set { m_fov = value; }
        }

        public double Near
        {
            get { return m_near; }
            set { m_near = value; }
        }

        public double Far
        {
            get { return m_far; }
            set { m_far = value; }
        }
    }

    public class CameraOrthoData
    {
        private double[] m_position = new double[3] { 0, 0, 0 };
        private double[] m_rotation = new double[3] { 0, 0, 0 };
        private double[] m_targetControl = new double[3] { 0, 0, 0 };
        private double m_zoom = 0;

        public double[] Position
        {
            get { return m_position; }
            set { m_position = value; }
        }

        public double[] Rotation
        {
            get { return m_rotation; }
            set { m_rotation = value; }
        }

        public double[] TargetControl
        {
            get { return m_targetControl; }
            set { m_targetControl = value; }
        }

        public double Zoom
        {
            get { return m_zoom; }
            set { m_zoom = value; }
        }
    }
}
