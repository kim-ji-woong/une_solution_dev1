using System.Collections.Generic;
using Base.History.IBLL.Request;
using Base.Model.History;
using Base.Model.Spatial;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using System.Collections;

namespace Soulbrain.BLL.Request
{
    public class RequestSensorDetectHistoryEx : RequestSensorDetectHistory
    {
        public class _PermitZones
        {
            private List<int> m_zoneNos = null;
            private List<int> m_exceptSensorNos = null;

            public List<int> ZoneNo
            {
                get { return m_zoneNos; }
                set { m_zoneNos = value; }
            }

            public List<int> ExceptSensorNo
            {
                get { return m_exceptSensorNos; }
                set { m_exceptSensorNos = value; }
            }
        }

        private _PermitZones m_permitZones = null;
        private List<int> m_permitSensorNos = null;

        public _PermitZones PermitZones
        {
            get { return m_permitZones; }
            set { m_permitZones = value; }
        }

        public List<int> PermitSensorNo
        {
            get { return m_permitSensorNos; }
            set { m_permitSensorNos = value; }
        }

        // Key : Zone No
        private Dictionary<int, Building> m_dicLinkedBuildings = new Dictionary<int, Building>();
        // Key : Building No
        private Dictionary<int, BuildingGroup> m_dicLinkedBuildingGroups = new Dictionary<int, BuildingGroup>();

        // Key : Zone No
        public Dictionary<int, Building> LinkedBuildings
        {
            get { return m_dicLinkedBuildings; }
            set { m_dicLinkedBuildings = value; }
        }

        public Dictionary<int, BuildingGroup> LinkedBuildingGroups
        {
            get { return m_dicLinkedBuildingGroups; }
            set { m_dicLinkedBuildingGroups = value; }
        }

        public RequestSensorDetectHistoryEx()
        {
        }

        public override void CheckAdditionalCondition(ref string strCondition)
        {
            if (this.PermitZones != null)
            {
                if (this.PermitZones.ZoneNo != null)
                    AddZoneCondition(this.PermitZones.ZoneNo, ref strCondition);

                if (this.PermitZones.ExceptSensorNo != null)
                    SubSensorCondition(this.PermitZones.ExceptSensorNo, ref strCondition);
            }

            if (this.PermitSensorNo != null)
                AddSensorCondition(this.PermitSensorNo, ref strCondition);
        }

        private void AddZoneCondition(List<int> zoneNos, ref string strCondition)
        {
            if (zoneNos.Count == 0)
                return;

            string strSubCondition = string.Format("a.{0} in ({1})", SensorZone.Fields.zone_sn, string.Join(',', zoneNos));

            if (strCondition == null || strCondition.Trim().Length == 0)
                strCondition = strSubCondition;
            else
                strCondition += " and " + strSubCondition;

        }

        private void SubSensorCondition(List<int> exceptSensorNos, ref string strCondition)
        {
            if (exceptSensorNos.Count == 0)
                return;

            string strSubCondition = string.Format("a.{0} not in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} in ({7})))",
                SensorZone.Fields.sensor_zone_hist_sn, SensorZoneDetail.Fields.sensor_zone_hist_sn,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.TableName,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, string.Join(',', exceptSensorNos));

            if (strCondition == null || strCondition.Trim().Length == 0)
                strCondition = strSubCondition;
            else
                strCondition += " and " + strSubCondition;
        }

        private void AddSensorCondition(List<int> sensorNos, ref string strCondition)
        {
            if (sensorNos.Count == 0)
                return;

            string strSubCondition = string.Format("a.{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} in ({7})))",
                SensorZone.Fields.sensor_zone_hist_sn, SensorZoneDetail.Fields.sensor_zone_hist_sn,
                SensorZoneDetail.TableName,
                SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn,
                Base.Model.Sensor.SensorZone.TableName,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn, string.Join(',', sensorNos));

            if (strCondition == null || strCondition.Trim().Length == 0)
                strCondition = strSubCondition;
            else
                strCondition += " and " + strSubCondition;
        }

        public override string GetLocationName(IDataManager dataManager, int equipZoneNo, string strEquipZoneName, Dictionary<int, List<Zone>> dicLinkedZones, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups)
        {
            if (dicLinkedZones == null || dicLinkedBuildings == null || dicLinkedBuildingGroups == null)
                return strEquipZoneName;

            List<Zone> zones = null;

            if (dicLinkedZones.TryGetValue(equipZoneNo, out zones) == false)
            {
                string strErrorMessage;
                var _zones = GetLinkedZones(dataManager, equipZoneNo, out strErrorMessage);

                if (_zones == null)
                    return strEquipZoneName;
                else
                {
                    dicLinkedZones[equipZoneNo] = _zones;
                    zones = _zones;
                }
            }

            foreach (Zone zone in zones)
            {
                return GetLocationName(strEquipZoneName, zone, dicLinkedBuildings, dicLinkedBuildingGroups);
            }

            return strEquipZoneName;
        }

        private List<Zone> GetLinkedZones(IDataManager dataManager, int equipZoneNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Zone.Fields.zone_sn,
                EquipmentZoneLinkedZone.Fields.zone_sn,
                EquipmentZoneLinkedZone.TableName,
                EquipmentZoneLinkedZone.Fields.eqp_zone_sn,
                equipZoneNo);

            IEnumerable<Zone> zones = dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

            if (zones == null)
                return null;

            List<Zone> result = new List<Zone>();
            result.AddRange(zones);
            return result;
        }

        public override string GetLocationName(IDataManager dataManager, int zoneNo, string strZoneName)
        {
            Building building;

            if (this.LinkedBuildings.TryGetValue(zoneNo, out building) == false)
            {
                JoinManager joinManager = new JoinManager(dataManager);

                string strErrorMessage;
                string strCondition = string.Format("a.{0} = {1}", Zone.Fields.zone_sn, zoneNo);
                ArrayList arrDatas = joinManager.JoinZoneBuilding(strCondition, out strErrorMessage);

                if (arrDatas == null || arrDatas.Count < 2)
                    return strZoneName;

                building = (Building)arrDatas[1];

                if (building == null)
                    return strZoneName;

                this.LinkedBuildings[zoneNo] = building;

                BuildingGroup buildingGroup;

                if (this.LinkedBuildingGroups.TryGetValue(building.buld_sn, out buildingGroup) == false)
                {
                    strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.buld_group_sn, building.buld_group_sn);
                    buildingGroup = dataManager.GetSelect().SelectFirst<BuildingGroup>(strCondition, out strErrorMessage);

                    if (buildingGroup == null)
                        return building.disp_text + " > " + strZoneName;

                    this.LinkedBuildingGroups[building.buld_sn] = buildingGroup;
                }

                return buildingGroup.disp_text + " > " + building.disp_text + " > " + strZoneName;
            }
            else
            {
                BuildingGroup buildingGroup;

                if (this.LinkedBuildingGroups.TryGetValue(building.buld_sn, out buildingGroup) == false)
                {
                    string strErrorMessage;
                    string strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.buld_group_sn, building.buld_group_sn);
                    buildingGroup = dataManager.GetSelect().SelectFirst<BuildingGroup>(strCondition, out strErrorMessage);

                    if (buildingGroup == null)
                        return building.disp_text + " > " + strZoneName;

                    this.LinkedBuildingGroups[building.buld_sn] = buildingGroup;
                }

                return buildingGroup.disp_text + " > " + building.disp_text + " > " + strZoneName;
            }

            //return base.GetLocationName(dataManager, zoneNo, strZoneName);
        }

        private string GetLocationName(string strEquipZoneName, Zone zone, Dictionary<int, Building> dicLinkedBuildings, Dictionary<int, BuildingGroup> dicLinkedBuildingGroups)
        {
            if (zone.buld_sn == null)
                return zone.disp_text + " > " + strEquipZoneName;

            Building building;

            if (dicLinkedBuildings.TryGetValue((int)zone.zone_sn, out building) == false)
                return zone.disp_text + " > " + strEquipZoneName;

            BuildingGroup buildingGroup;

            if (dicLinkedBuildingGroups.TryGetValue(building.buld_sn, out buildingGroup))
                return buildingGroup.disp_text + " > " + building.disp_text + " > " + zone.disp_text + " > " + strEquipZoneName;

            return building.disp_text + " > " + zone.disp_text + " > " + strEquipZoneName;
        }
    }
}
