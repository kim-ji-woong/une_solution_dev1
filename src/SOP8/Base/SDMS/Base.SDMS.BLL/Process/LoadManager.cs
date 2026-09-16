using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Base.Model.Spatial;
using Base.SDMS.IBLL;
using Base.SDMS.IBLL.Models;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;

namespace Base.SDMS.BLL.Process
{
    public class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseBuildingGroupList GetBuildingGroupList(List<int> siteNos)
        {
            ResponseBuildingGroupList response = new ResponseBuildingGroupList();
            
            string strErrorMessage = "";

            Dictionary<int, SpatialData.BuildingGroupData> dicBuildingGroups = new Dictionary<int, SpatialData.BuildingGroupData>();
            Dictionary<int, SpatialData.BuildingData> dicBuildings = new Dictionary<int, SpatialData.BuildingData>();
            Dictionary<int, SpatialData.ZoneData> dicZones = new Dictionary<int, SpatialData.ZoneData>();
            Dictionary<int, SpatialData.EquipmentZoneData> dicEquipZones = new Dictionary<int, SpatialData.EquipmentZoneData>();
            
            IEnumerable bgs = m_dataManager.GetSelect().Select<BuildingGroup>(null, out strErrorMessage);
            
            if (bgs == null)
            {
                response.Success = false;
                response.Message = strErrorMessage;
                response.ErrorCode = ErrorCode.UnknownError;
                return response;
            }
            
            List<BuildingGroup> buildingGroups = bgs.Cast<BuildingGroup>().ToList();
            
            foreach (BuildingGroup bg in bgs)
            {
                SpatialData.BuildingGroupData bgData = new SpatialData.BuildingGroupData(bg);
                dicBuildingGroups[bg.buld_group_sn] = bgData;
            }
            
            IEnumerable buildings = m_dataManager.GetSelect().Select<Building>(null, out strErrorMessage);
            
            if (buildings == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                response.ErrorCode = ErrorCode.UnknownError;
                return response;
            }
            
            List<Building> buildingList = buildings.Cast<Building>().ToList();
            
            foreach (Building building in buildingList)
            {
                SpatialData.BuildingData buildingData = new SpatialData.BuildingData(building);

                SpatialData.BuildingGroupData bg;
                if (dicBuildingGroups.TryGetValue(building.buld_group_sn, out bg))
                {
                    bg.BuildingDatas.Add(buildingData);
                }

                dicBuildings[building.buld_sn] = buildingData;
            }
            
            IEnumerable zones = m_dataManager.GetSelect().Select<Zone>(null, out strErrorMessage);
            
            if (zones == null)
            {
                response.Message = strErrorMessage;
                response.ErrorCode = ErrorCode.UnknownError;
                response.Success = false;
            }
            
            List<Zone> zoneList = zones.Cast<Zone>().ToList();
            
            foreach (Zone zone in zoneList)
            {
                SpatialData.ZoneData zoneData = new SpatialData.ZoneData(zone);

                SpatialData.BuildingData building;
                if (zone.buld_sn != null && dicBuildings.TryGetValue((int)zone.buld_sn, out building))
                {
                    building.ZoneDatas.Add(zoneData);
                }

                dicZones[zone.zone_sn] = zoneData;
            }

            List<ZoneData> zoneDatas = m_dataManager.GetSelect().Select<ZoneData>(null, out strErrorMessage).ToList();

            foreach (ZoneData zoneData in zoneDatas)
            {
                SpatialData.ZoneData zd;
                
                if (dicZones.TryGetValue(zoneData.zone_sn, out zd))
                {
                    zd.Datas = new SpatialData.SpatialZoneData(zoneData);
                }
            }
            
            IEnumerable equipmentZones = m_dataManager.GetSelect().Select<EquipmentZone>(null, out strErrorMessage);
            
            if (equipmentZones == null)
            {
                response.Message = strErrorMessage;
                response.Success = false;
                response.ErrorCode = ErrorCode.UnknownError;
                return response;
            }
            
            List<EquipmentZone> equipmentZoneList = equipmentZones.Cast<EquipmentZone>().ToList();
            
            IEnumerable equipmentZoneLinkedZones = m_dataManager.GetSelect().Select<EquipmentZoneLinkedZone>(null, out strErrorMessage);
            
            List<EquipmentZoneLinkedZone> equipmentZoneLinkedZoneList = equipmentZoneLinkedZones.Cast<EquipmentZoneLinkedZone>().ToList();
            
            Dictionary<int, List<int>> dicEquipmentZoneLinkedZones = new Dictionary<int, List<int>>();

            foreach (EquipmentZoneLinkedZone ezlz in equipmentZoneLinkedZoneList)
            {
                int nEquipmentZoneSn = ezlz.eqp_zone_sn;
                int nZoneSn = ezlz.zone_sn;
                
                if (dicEquipmentZoneLinkedZones.ContainsKey(nEquipmentZoneSn) == false)
                {
                    dicEquipmentZoneLinkedZones[nEquipmentZoneSn] = new List<int>();
                }
                
                dicEquipmentZoneLinkedZones[nEquipmentZoneSn].Add(nZoneSn);
            }
            
            
            foreach (EquipmentZone equipmentZone in equipmentZoneList)
            {
                SpatialData.EquipmentZoneData equipZoneData = new SpatialData.EquipmentZoneData(equipmentZone);

                SpatialData.ZoneData zone;
                
                if (dicEquipmentZoneLinkedZones.ContainsKey(equipmentZone.eqp_zone_sn))
                {
                    foreach (int nZoneSn in dicEquipmentZoneLinkedZones[equipmentZone.eqp_zone_sn])
                    {
                        if (dicZones.TryGetValue(nZoneSn, out zone))
                        {
                            zone.EquipmentZoneDatas.Add(equipZoneData);
                            equipZoneData.LinkedZoneNos.Add(zone.ZoneNo);
                        }
                    }
                }
                dicEquipZones[equipmentZone.eqp_zone_sn] = equipZoneData;
            }

            SortZoneDatas(dicBuildingGroups);

            response.BuildingGroups = dicBuildingGroups.Values
                .Where(bdg => siteNos == null || siteNos.Count == 0 || siteNos.Contains(bdg.SiteNo))
                .ToList();

            response.OutdoorZones = dicZones.Values
                .Where(zd => zd.BuildingNo == null && (siteNos == null || siteNos.Count == 0 || siteNos.Contains(zd.SiteNo)))
                .ToList();
            
            response.Success = true;
            return response;
        }

        public ResponseBuildingGroupData LoadBuildingGroupDatas(RequestBuildingGroupData data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", BuildingGroupData.Fields.buld_group_sn, data.BuildingGroupNo);
            IEnumerable<BuildingGroupData> buildingGroupDatas = m_dataManager.GetSelect().Select<BuildingGroupData>(strCondition, out strErrorMessage);

            if (buildingGroupDatas == null)
                return new ResponseBuildingGroupData(false, strErrorMessage);

            strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.buld_group_sn, data.BuildingGroupNo);
            BuildingGroup buildingGroup = m_dataManager.GetSelect().SelectFirst<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroup == null)
            {
                if (strErrorMessage != null)
                    return new ResponseBuildingGroupData(false, strErrorMessage);
                else
                    return new ResponseBuildingGroupData(false, "주어진 정보를 사용하는 건물그룹을 찾을수 없습니다.");
            }

            ResponseBuildingGroupData response = new ResponseBuildingGroupData(true, "");
            response.BuildingGroupName = buildingGroup.name;
            response.BuildingGroupDatas.AddRange(buildingGroupDatas);

            return response;
        }

        public ResponseBuildingData LoadBuildingDatas(RequestBuildingData data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", BuildingData.Fields.buld_sn, data.BuildingNo);
            IEnumerable<BuildingData> buildingDatas = m_dataManager.GetSelect().Select<BuildingData>(strCondition, out strErrorMessage);

            if (buildingDatas == null)
                return new ResponseBuildingData(false, strErrorMessage);

            strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, data.BuildingNo);
            Building building = m_dataManager.GetSelect().SelectFirst<Building>(strCondition, out strErrorMessage);

            if (building == null)
            {
                if (strErrorMessage != null)
                    return new ResponseBuildingData(false, strErrorMessage);
                else
                    return new ResponseBuildingData(false, "주어진 정보를 사용하는 건물을 찾을수 없습니다.");
            }

            ResponseBuildingData response = new ResponseBuildingData(true, "");
            response.BuildingName = building.name;
            response.BuildingDatas.AddRange(buildingDatas);

            return response;
        }

        public static List<SpatialData.BuildingGroupData> LoadBuildingGroupDatas(IDataManager dataManager, int siteNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.site_sn, siteNo);
            IEnumerable<BuildingGroup> buildingGroups = dataManager.GetSelect().Select<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroups == null)
                return null;

            List<SpatialData.BuildingGroupData> buildingGroupDatas = new List<SpatialData.BuildingGroupData>();
            Dictionary<int, SpatialData.BuildingGroupData> dicBuildingGroupDatas = new Dictionary<int, SpatialData.BuildingGroupData>();

            string strBuildingGroupNos = null;

            foreach (BuildingGroup buildingGroup in buildingGroups)
            {
                SpatialData.BuildingGroupData buildingGroupData = new SpatialData.BuildingGroupData(buildingGroup);
                dicBuildingGroupDatas[buildingGroup.buld_group_sn] = buildingGroupData;

                if (strBuildingGroupNos == null)
                    strBuildingGroupNos = buildingGroup.buld_group_sn.ToString();
                else
                    strBuildingGroupNos += "," + buildingGroup.buld_group_sn.ToString();
            }

            if (strBuildingGroupNos != null)
            {
                strCondition = string.Format("{0} in ({1})", Building.Fields.buld_sn, strBuildingGroupNos);
                IEnumerable<Building> buildings = dataManager.GetSelect().Select<Building>(strCondition, out strErrorMessage);

                if (buildings == null)
                    return null;

                SpatialData.BuildingGroupData buildingGroupData;

                foreach (Building building in buildings)
                {
                    SpatialData.BuildingData buildingData = new SpatialData.BuildingData(building);

                    if (dicBuildingGroupDatas.TryGetValue(building.buld_group_sn, out buildingGroupData))
                    {
                        buildingGroupData.BuildingDatas.Add(buildingData);
                    }
                }
            }

            buildingGroupDatas.AddRange(dicBuildingGroupDatas.Values);
            return buildingGroupDatas;
        }

        public static List<SpatialData.EquipmentZoneData> LoadEquipZoneDatas(IDataManager dataManager, int siteNo, int? zoneNo, out string strErrorMessage)
        {
            string strCondition = null;

            if (zoneNo == null)
            {
                strCondition = string.Format("b.{0} in (Select {1} from {2} where {3} is null and {4} = {5})",
                    EquipmentZoneLinkedZone.Fields.zone_sn,
                    Zone.Fields.zone_sn,
                    Zone.TableName,
                    Zone.Fields.buld_sn,
                    Zone.Fields.site_sn,
                    siteNo);
            }
            else
            {
                strCondition = string.Format("b.{0} = {1}", EquipmentZoneLinkedZone.Fields.zone_sn, (int)zoneNo);
            }

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinEquipmentZoneEquipmentZoneLinkedZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, SpatialData.EquipmentZoneData> dicEquipZoneDatas = new Dictionary<int, SpatialData.EquipmentZoneData>();
            List<SpatialData.EquipmentZoneData> equipZoneDatas = new List<SpatialData.EquipmentZoneData>();

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is EquipmentZone && arrDatas[i + 1] is EquipmentZoneLinkedZone)
                {
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i];
                    EquipmentZoneLinkedZone link = (EquipmentZoneLinkedZone)arrDatas[i + 1];

                    SpatialData.EquipmentZoneData equipZoneData = null;

                    if (dicEquipZoneDatas.TryGetValue(equipZone.eqp_zone_sn, out equipZoneData) == false)
                    {
                        equipZoneData = new SpatialData.EquipmentZoneData(equipZone);
                        dicEquipZoneDatas[equipZone.eqp_zone_sn] = equipZoneData;
                    }

                    equipZoneData.LinkedZoneNos.Add(link.zone_sn);
                }
            }

            equipZoneDatas.AddRange(dicEquipZoneDatas.Values);
            return equipZoneDatas;
        }
        
        private void SortZoneDatas(Dictionary<int, SpatialData.BuildingGroupData> dicBuildingGroupDatas)
        {
            foreach (KeyValuePair<int, SpatialData.BuildingGroupData> pair in dicBuildingGroupDatas)
            {
                foreach (SpatialData.BuildingData bd in pair.Value.BuildingDatas)
                {
                    bd.ZoneDatas.Sort();
                }
            }
        }
    }
}