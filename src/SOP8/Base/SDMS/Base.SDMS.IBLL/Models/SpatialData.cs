using System.Collections.Generic;
using Base.Model.Spatial;

namespace Base.SDMS.IBLL.Models
{
    public class SpatialData
    {
        public class BuildingGroupData
        {
            private int m_nBuildingGroupNo = -1;
            private string m_strName = "";
            private double? x = null;
            private double? y = null;
            private double? z = null;
            private string m_strDisplayText = null;
            private int m_nSiteNo = -1;
            private List<BuildingData> m_buildingDatas = new List<BuildingData>();
            
            public List<BuildingData> BuildingDatas
            {
                get { return m_buildingDatas; }
                set { m_buildingDatas = value; }
            }

            public int BuildingGroupNo
            {
                get { return m_nBuildingGroupNo; }
                set { m_nBuildingGroupNo = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
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

            public string DisplayText
            {
                get { return m_strDisplayText; }
                set { m_strDisplayText = value; }
            }

            public int SiteNo
            {
                get { return m_nSiteNo; }
                set { m_nSiteNo = value; }
            }

            public BuildingGroupData()
            {
            }

            public BuildingGroupData(BuildingGroup buildingGroup)
            {
                this.BuildingGroupNo = buildingGroup.buld_group_sn;
                this.Name = buildingGroup.name;
                this.X = buildingGroup.text_center_crdnt_x;
                this.Y = buildingGroup.text_center_crdnt_y;
                this.Z = buildingGroup.text_center_crdnt_z;
                this.DisplayText = buildingGroup.disp_text;
                this.SiteNo = buildingGroup.site_sn;
            }
        }

        public class BuildingData
        {
            private int m_nBuildingNo = -1;
            private string m_strBuildingCode = null;
            private string m_strName = "";
            private int m_nTopFloorIndex = 0;
            private int m_nMinFloorIndex = 0;
            private double? x = null;
            private double? y = null;
            private double? z = null;
            private string m_strBroadcastText = null;
            private string m_strDisplayText = null;
            private List<ZoneData> m_zoneDatas = new List<ZoneData>();

            public int BuildingNo
            {
                get { return m_nBuildingNo; }
                set { m_nBuildingNo = value; }
            }

            public string BuildingCode
            {
                get { return m_strBuildingCode; }
                set { m_strBuildingCode = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
            }

            public int TopFloorIndex
            {
                get { return m_nTopFloorIndex; }
                set { m_nTopFloorIndex = value; }
            }

            public int MinFloorIndex
            {
                get { return m_nMinFloorIndex; }
                set { m_nMinFloorIndex = value; }
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

            public string BroadcastText
            {
                get { return m_strBroadcastText; }
                set { m_strBroadcastText = value; }
            }

            public string DisplayText
            {
                get { return m_strDisplayText; }
                set { m_strDisplayText = value; }
            }

            public List<ZoneData> ZoneDatas
            {
                get { return m_zoneDatas; }
                set { m_zoneDatas = value; }
            }

            public BuildingData()
            {
            }

            public BuildingData(Building building)
            {
                this.BuildingNo = building.buld_sn;
                this.BuildingCode = building.buld_code;
                this.Name = building.name;
                this.TopFloorIndex = building.top_floor_indx;
                this.MinFloorIndex = building.min_floor_indx;
                this.X = building.text_center_crdnt_x;
                this.Y = building.text_center_crdnt_y;
                this.Z = building.text_center_crdnt_z;
                this.BroadcastText = building.brdcst_text;
                this.DisplayText = building.disp_text;
            }
        }

        public class ZoneData : System.IComparable
        {
            private int m_nZoneNo = -1;
            private string m_strName = "";
            private int? m_buildingNo = null;
            private int? m_floorIndex = null;
            private double? m_additionalFloor = null;
            private double? x = null;
            private double? y = null;
            private double? z = null;
            private string m_strBroadcastText = null;
            private string m_strDisplayText = null;
            private int m_nSiteNo = -1;

            private List<EquipmentZoneData> m_equipmentZoneDatas = new List<EquipmentZoneData>();
            private SpatialZoneData m_zoneData = new SpatialZoneData();

            public int ZoneNo
            {
                get { return m_nZoneNo; }
                set { m_nZoneNo = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
            }

            public int? BuildingNo
            {
                get { return m_buildingNo; }
                set { m_buildingNo = value; }
            }

            public int? FloorIndex
            {
                get { return m_floorIndex; }
                set { m_floorIndex = value; }
            }

            public double? AdditionalFloor
            {
                get { return m_additionalFloor; }
                set { m_additionalFloor = value; }
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

            public string BroadcastText
            {
                get { return m_strBroadcastText; }
                set { m_strBroadcastText = value; }
            }

            public string DisplayText
            {
                get { return m_strDisplayText; }
                set { m_strDisplayText = value; }
            }

            public int SiteNo
            {
                get { return m_nSiteNo; }
                set { m_nSiteNo = value; }
            }

            public List<EquipmentZoneData> EquipmentZoneDatas
            {
                get { return m_equipmentZoneDatas; }
                set { m_equipmentZoneDatas = value; }
            }
            
            public SpatialZoneData Datas
            {
                get { return m_zoneData; }
                set { m_zoneData = value; }
            }

            public ZoneData()
            {
            }

            public ZoneData(Zone zone)
            {
                this.ZoneNo = zone.zone_sn;
                this.Name = zone.name;
                this.BuildingNo = zone.buld_sn;
                this.FloorIndex = zone.floor_indx;
                this.AdditionalFloor = zone.adit_floor;
                this.X = zone.text_center_crdnt_x;
                this.Y = zone.text_center_crdnt_y;
                this.Z = zone.text_center_crdnt_z;
                this.BroadcastText = zone.brdcst_text;
                this.DisplayText = zone.disp_text;
                this.SiteNo = zone.site_sn;
            }

            public int CompareTo(object obj)
            {
                ZoneData data1 = this;
                ZoneData data2 = (ZoneData)obj;

                if (data1.FloorIndex < data2.FloorIndex)
                    return -1;
                else if (data1.FloorIndex > data2.FloorIndex)
                    return 1;
                else
                {
                    if (data1.AdditionalFloor == null && data2.AdditionalFloor != null)
                        return -1;
                    else if (data1.AdditionalFloor != null && data2.AdditionalFloor == null)
                        return 1;
                    else if (data1.AdditionalFloor != null && data2.AdditionalFloor != null)
                    {
                        if ((float)data1.AdditionalFloor < (float)data2.AdditionalFloor)
                            return -1;
                        else if ((float)data1.AdditionalFloor > (float)data2.AdditionalFloor)
                            return 1;
                    }
                }
                return 0;
            }
        }

        public class SpatialZoneData
        {
            private int m_nZoneNo = -1;
            private double? m_fakeWallElevation = null;
            private double? m_poiElevation = null;

            public int ZoneNo
            {
                get { return m_nZoneNo; }
                set { m_nZoneNo = value; }
            }

            public double? FakeWallElevation
            {
                get { return m_fakeWallElevation; }
                set { m_fakeWallElevation = value; }
            }

            public double? PoiElevation
            {
                get { return m_poiElevation; }
                set { m_poiElevation = value; }
            }

            public SpatialZoneData()
            {
            }

            public SpatialZoneData(Model.Spatial.ZoneData zoneData)
            {
                this.ZoneNo = zoneData.zone_sn;
                this.FakeWallElevation = zoneData.fake_wall_elev;
                this.PoiElevation = zoneData.poi_elev;
            }
        }

        public class EquipmentZoneData
        {
            private int m_nEquipZoneNo = -1;
            private string m_strName = "";
            private double? x = null;
            private double? y = null;
            private double? z = null;
            private string m_strBroadcastText = null;
            private string m_strDisplayText = null;
            private int m_nSiteNo = -1;
            private List<int> m_linkedZoneNos = new List<int>();

            public int EquipZoneNo
            {
                get { return m_nEquipZoneNo; }
                set { m_nEquipZoneNo = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
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

            public string BroadcastText
            {
                get { return m_strBroadcastText; }
                set { m_strBroadcastText = value; }
            }

            public string DisplayText
            {
                get { return m_strDisplayText; }
                set { m_strDisplayText = value; }
            }

            public int SiteNo
            {
                get { return m_nSiteNo; }
                set { m_nSiteNo = value; }
            }

            public List<int> LinkedZoneNos
            {
                get { return m_linkedZoneNos; }
                set { m_linkedZoneNos = value; }
            }

            public EquipmentZoneData()
            {
            }

            public EquipmentZoneData(EquipmentZone equipZone)
            {
                this.EquipZoneNo = equipZone.eqp_zone_sn;
                this.Name = equipZone.name;
                this.X = equipZone.text_center_crdnt_x;
                this.Y = equipZone.text_center_crdnt_y;
                this.Z = equipZone.text_center_crdnt_z;
                this.BroadcastText = equipZone.brdcst_text;
                this.DisplayText = equipZone.disp_text;
                this.SiteNo = equipZone.site_sn;
            }
        }
    }
}