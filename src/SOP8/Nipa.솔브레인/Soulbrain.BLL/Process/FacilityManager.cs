using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.Model.Facility;
using Base.Model.Spatial;
using Base.DAL;
using System.Collections;

namespace Soulbrain.BLL.Process
{
    using Response;
    using Request;

    class FacilityManager
    {
        private IDataManager m_dataManager = null;

        public FacilityManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAllFacility GetAllFacilities()
        {
            string strErrorMessage;
            IEnumerable<Facility> facilities = m_dataManager.GetSelect().Select<Facility>(null, out strErrorMessage);

            if (facilities == null)
                return new ResponseAllFacility(false, strErrorMessage);

            ResponseAllFacility response = new ResponseAllFacility(true, "");
            response.Facilities.AddRange(facilities);
            return response;
        }

        public ResponseAllFacility GetFacilities(RequestFacilityList data)
        {
            string strCondition = null;

            if (data.SiteNo != null)
            {
                if (data.ZoneNo != null)
                {
                    strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {1} = {5})",
                        Facility.Fields.zone_sn,
                        Zone.Fields.zone_sn,
                        Zone.TableName,
                        Zone.Fields.site_sn, (int)data.SiteNo,
                        (int)data.ZoneNo);
                }
                else
                {
                    strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                        Facility.Fields.zone_sn,
                        Zone.Fields.zone_sn,
                        Zone.TableName,
                        Zone.Fields.site_sn, (int)data.SiteNo);
                }
            }
            else if (data.ZoneNo != null)
            {
                strCondition = string.Format("{0} = {1}", Facility.Fields.zone_sn, (int)data.ZoneNo);
            }

            string strErrorMessage;
            IEnumerable<Facility> facilities = m_dataManager.GetSelect().Select<Facility>(strCondition, out strErrorMessage);

            if (facilities == null)
                return new ResponseAllFacility(false, strErrorMessage);

            ResponseAllFacility response = new ResponseAllFacility(true, "");
            response.Facilities.AddRange(facilities);
            return response;
        }

        public ResponseFacilityData GetFacilityDatas(RequestFacilityData data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", Facility.Fields.model_name, data.ModelName);
            Facility facility = m_dataManager.GetSelect().SelectFirst<Facility>(strCondition, out strErrorMessage);

            if (facility == null)
            {
                if (strErrorMessage != null)
                    return new ResponseFacilityData(false, strErrorMessage);
                else
                    return new ResponseFacilityData(false, "주어진 모델이름에 맞는 설비정보를 찾을수  없습니다.");
            }

            strCondition = string.Format("{0} = {1}", FacilityData.Fields.fclty_sn, facility.fclty_sn);
            IEnumerable<FacilityData> facilityDatas = m_dataManager.GetSelect().Select<FacilityData>(strCondition, out strErrorMessage);

            if (facilityDatas == null)
                return new ResponseFacilityData(false, strErrorMessage);

            int zoneNo;
            int? buildingGroupNo;
            int? buildingNo;

            if (ReadZoneInfo(facility, out zoneNo, out buildingNo, out buildingGroupNo, out strErrorMessage) == false)
                return new ResponseFacilityData(false, strErrorMessage);

            ResponseFacilityData response = new ResponseFacilityData(true, "");

            response.ZoneNo = zoneNo;
            response.BuildingNo = buildingNo;
            response.BuildingGroupNo = buildingGroupNo;
            response.FacilityName = facility.fclty_name;
            response.ModelName = facility.model_name;
            response.FacilityDatas.AddRange(facilityDatas);

            return response;
        }

        private bool ReadZoneInfo(Facility facility, out int zoneNo, out int? buildingNo, out int? buildingGroupNo, out string strErrorMessage)
        {
            zoneNo = 0;
            buildingNo = buildingGroupNo = null;

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("a.{0} = {1}", Zone.Fields.zone_sn, facility.zone_sn);
            ArrayList arrDatas = joinManager.JoinZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int dataCount = arrDatas.Count;

            if (dataCount >= 3 && arrDatas[0] is Zone &&
                (arrDatas[1] == null || arrDatas[1] is Building) &&
                (arrDatas[2] == null || arrDatas[2] is BuildingGroup))
            {
                Zone zone = (Zone)arrDatas[0];
                Building building = (Building)arrDatas[1];
                BuildingGroup buildingGroup = (BuildingGroup)arrDatas[2];

                zoneNo = zone.zone_sn;

                if (building != null)
                    buildingNo = building.buld_sn;

                if (buildingGroup != null)
                    buildingGroupNo = buildingGroup.buld_group_sn;

                return true;
            }

            strErrorMessage = "설비위치를 확인할 수 없습니다.";
            return false;
        }
    }
}
