using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sop.Config;
using Base.Model.Spatial;
using Base.Model.Sop.Category;

namespace Base.SOPSimulator.BLL.Process
{
    class LinkedSopManager
    {
        private IDataManager m_dataManager = null;

        public LinkedSopManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public LinkedSop GetLinkedSop(int? zoneNo, int sensorType, int? siteNo, out SmallClass smallClass, out string strErrorMessage, out bool noUsableSop)
        {
            smallClass = null;
            noUsableSop = false;
            strErrorMessage = null;

            string strCondition = zoneNo == null ? null : string.Format("{0} = {1}", Zone.Fields.zone_sn, zoneNo);
            Zone zone = strCondition == null ? null : m_dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null && strCondition != null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                {
                    strErrorMessage = "알람발생 위치를 확인할 수 없어 SOP를 실행할 수 없습니다.";
                    return null;
                }
            }

            if (siteNo != null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    LinkedSop.Fields.site_sn, (int)siteNo,
                    LinkedSop.Fields.sensor_ty_code, sensorType);
            }
            else
            {
                strCondition = string.Format("{0} = {1}", LinkedSop.Fields.sensor_ty_code, sensorType);
            }

            IEnumerable<LinkedSop> linkedSops = m_dataManager.GetSelect().Select<LinkedSop>(strCondition, out strErrorMessage);

            if (linkedSops == null)
                return null;

            if (zone != null)
            {
                LinkedSop sop = CheckZone(zone, linkedSops, out smallClass, out strErrorMessage);

                if (sop != null)
                    return sop;
                else if (sop == null && strErrorMessage != null)
                    return null;

                sop = CheckBuilding(zone, linkedSops, out smallClass, out strErrorMessage);

                if (sop != null)
                    return sop;
                else if (sop == null && strErrorMessage != null)
                    return null;

                sop = CheckBuildingGroup(zone, linkedSops, out smallClass, out strErrorMessage);

                if (sop != null)
                    return sop;
                else if (sop == null && strErrorMessage != null)
                    return null;
            }

            foreach (LinkedSop sop in linkedSops)
            {
                smallClass = CheckUsableSop(sop, out strErrorMessage);

                if (smallClass != null)
                    return sop;
                else if (strErrorMessage != null)
                    return null;
            }

            noUsableSop = true;
            strErrorMessage = "연결된 SOP 정보를 찾을수 없습니다.";
            return null;
        }

        private LinkedSop CheckBuildingGroup(Zone zone, IEnumerable<LinkedSop> linkedSops, out SmallClass smallClass, out string strErrorMessage)
        {
            smallClass = null;

            if (zone.buld_sn == null)
            {
                strErrorMessage = null;
                return null;
            }

            string strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, (int)zone.buld_sn);
            Building building = m_dataManager.GetSelect().SelectFirst<Building>(strCondition, out strErrorMessage);

            if (building == null)
                return null;

            foreach (LinkedSop sop in linkedSops)
            {
                if (sop.buld_group_sn != null && (int)sop.buld_group_sn == building.buld_group_sn)
                {
                    smallClass = CheckUsableSop(sop, out strErrorMessage);

                    if (smallClass != null)
                        return sop;
                    else
                    {
                        if (strErrorMessage != null)
                            return null;
                    }
                }
            }

            smallClass = null;
            strErrorMessage = null;
            return null;
        }

        private LinkedSop CheckBuilding(Zone zone, IEnumerable<LinkedSop> linkedSops, out SmallClass smallClass, out string strErrorMessage)
        {
            if (zone.buld_sn == null)
            {
                smallClass = null;
                strErrorMessage = null;
                return null;
            }

            foreach (LinkedSop sop in linkedSops)
            {
                if (sop.buld_sn != null && (int)sop.buld_sn == (int)zone.buld_sn)
                {
                    smallClass = CheckUsableSop(sop, out strErrorMessage);

                    if (smallClass != null)
                        return sop;
                    else
                    {
                        if (strErrorMessage != null)
                            return null;
                    }
                }
            }

            smallClass = null;
            strErrorMessage = null;
            return null;
        }

        private LinkedSop CheckZone(Zone zone, IEnumerable<LinkedSop> linkedSops, out SmallClass smallClass, out string strErrorMessage)
        {
            foreach (LinkedSop sop in linkedSops)
            {
                if (sop.zone_sn != null && sop.zone_sn == zone.zone_sn)
                {
                    smallClass = CheckUsableSop(sop, out strErrorMessage);

                    if (smallClass != null)
                        return sop;
                    else
                    {
                        if (strErrorMessage != null)
                            return null;
                    }
                }
            }

            smallClass = null;
            strErrorMessage = null;
            return null;
        }

        // 실제 사용가능한 SOP를 얻어온다.
        private SmallClass CheckUsableSop(LinkedSop linkedSop, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}' and {2} in (Select {3} from {4} where {3} = {5} and {6} = {7})",
                SmallClass.Fields.sclas_name, linkedSop.sclas_name,
                SmallClass.Fields.mclas_sn,
                MiddleClass.Fields.mclas_sn,
                MiddleClass.TableName,
                linkedSop.mclas_sn,
                MiddleClass.Fields.lclas_sn, linkedSop.lclas_sn);

            SmallClass smallClass = m_dataManager.GetSelect().SelectFirst<SmallClass>(strCondition, out strErrorMessage);

            if (smallClass != null)
                return smallClass;

            return null;
        }
    }
}
