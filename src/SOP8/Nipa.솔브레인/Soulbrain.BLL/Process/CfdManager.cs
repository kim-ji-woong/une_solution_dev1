using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.DAL;
using Soulbrain.Model.Cfd;
using Base.Model.Spatial;

namespace Soulbrain.BLL.Process
{
    using Request;
    using Response;

    class CfdManager
    {
        private IDataManager m_dataManager = null;

        public CfdManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCfdScenarioCase RequestCfdScenarioCase(RequestCfdScenarioCase data)
        {
            string strCondition = null;

            if (data.MaterialName != null)
                strCondition = string.Format("b.{0} = '{1}'", Material.Fields.name, data.MaterialName);

            if (strCondition != null)
                strCondition += string.Format(" and a.{0} = {1}", Scenario.Fields.buld_sn, (int)data.BuildingNo);
            else
                strCondition = string.Format("a.{0} = {1}", Scenario.Fields.buld_sn, (int)data.BuildingNo);

            if (data.TargetLocation != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and a.{0} = '{1}'", Scenario.Fields.trgt_lc, data.TargetLocation);
                else
                    strCondition = string.Format("a.{0} = '{1}'", Scenario.Fields.trgt_lc, data.TargetLocation);
            }

            if (data.WindDirection != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and a.{0} = {1}", Scenario.Fields.wind_drc, (int)data.WindDirection);
                else
                    strCondition = string.Format("a.{0} = {1}", Scenario.Fields.wind_drc, (int)data.WindDirection);
            }

            if (data.WindSpeed != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and a.{0} = {1}", Scenario.Fields.wind_spd, (double)data.WindSpeed);
                else
                    strCondition = string.Format("a.{0} = {1}", Scenario.Fields.wind_spd, (double)data.WindSpeed);
            }

            return RequestCfdScenarioCase(strCondition);
        }

        public ResponseCfdLocation RequestCfdLocation()
        {
            string strSQL = string.Format("Select {0} materialNo, {1} buildingNo, {2} targetLocation from {3} group by {0}, {1}, {2}", Scenario.Fields.mttr_sn, Scenario.Fields.buld_sn, Scenario.Fields.trgt_lc, Scenario.TableName);

            string strErrorMessage;
            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return new ResponseCfdLocation(false, strErrorMessage);

            Dictionary<int, Building> dicBuildings = new Dictionary<int, Building>();
            List<CfdLocation> locations = new List<CfdLocation>();

            foreach (var item in result)
            {
                int materialNo = item.materialNo;
                int buildingNo = item.buildingNo;
                string targetLocation = item.targetLocation;

                dicBuildings[buildingNo] = null;

                CfdLocationEx location = new CfdLocationEx();

                location.BuildingNo = buildingNo;
                location.TargetLocation = targetLocation;
                location.MaterialNo = materialNo;

                locations.Add(location);
            }

            if (dicBuildings.Count == 0)
                return new ResponseCfdLocation(true, "");

            string strCondition = string.Format("a.{0} in ({1})", Building.Fields.buld_sn, string.Join(",", dicBuildings.Keys));

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinBuildingBuildingGroup(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseCfdLocation(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            Dictionary<int, string> dicBuildingGroups = new Dictionary<int, string>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Building && arrDatas[i + 1] is BuildingGroup)
                {
                    Building building = (Building)arrDatas[i];
                    BuildingGroup buildingGroup = (BuildingGroup)arrDatas[i + 1];

                    dicBuildings[building.buld_sn] = building;
                    dicBuildingGroups[buildingGroup.buld_group_sn] = buildingGroup.name;
                }
            }

            IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(null, out strErrorMessage);

            if (materials == null)
                return new ResponseCfdLocation(false, strErrorMessage);

            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();

            foreach (Material material in materials)
            {
                dicMaterials[material.mttr_sn] = material;
            }

            ResponseCfdLocation response = new ResponseCfdLocation(true, "");

            foreach (CfdLocationEx location in locations)
            {
                Material material;
                Building building;
                string strBuildingGroupName;

                if (dicMaterials.TryGetValue(location.MaterialNo, out material) && dicBuildings.TryGetValue(location.BuildingNo, out building))
                {
                    if (dicBuildingGroups.TryGetValue(building.buld_group_sn, out strBuildingGroupName))
                    {
                        location.BuildingName = building.disp_text;
                        location.MaterialName = material.name;
                        location.BuildingGroupName = strBuildingGroupName;

                        response.Locations.Add(location);
                    }
                }
            }

            return response;
        }

        private ResponseCfdScenarioCase RequestCfdScenarioCase(string strCondition)
        {
            JoinManager joinManager = new JoinManager(m_dataManager);

            string strErrorMessage;
            ArrayList arrDatas = joinManager.JoinCfdScenarioMaterialCase(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseCfdScenarioCase(false, strErrorMessage);

            Scenario targetScenario = null;

            ResponseCfdScenarioCase response = new ResponseCfdScenarioCase(true, "");
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is Scenario && arrDatas[i + 1] is Material && arrDatas[i + 2] is ScenarioCase)
                {
                    Scenario scenario = (Scenario)arrDatas[i];
                    Material material = (Material)arrDatas[i + 1];
                    ScenarioCase scenarioCase = (ScenarioCase)arrDatas[i + 2];

                    if (targetScenario == null)
                        targetScenario = scenario;

                    if (response.Material == null)
                    {
                        response.Material = material;
                        response.Scenario = scenario;
                    }

                    response.ScenarioCases.Add(scenarioCase);
                }
            }

            if (response.Material != null)
            {
                IEnumerable<MaterialRange> materialRanges = GetMaterialRanges(response.Material, out strErrorMessage);

                if (materialRanges == null)
                    return new ResponseCfdScenarioCase(false, strErrorMessage);
                else
                    response.MaterialRanges.AddRange(materialRanges);

                if (targetScenario != null)
                {
                    ScenarioCondition scenarioCondition = GetScenarioCondition(targetScenario, out strErrorMessage);

                    if (scenarioCondition == null)
                    {
                        if (strErrorMessage != null)
                            return new ResponseCfdScenarioCase(false, strErrorMessage);
                    }
                    else
                        response.ScenarioCondition = scenarioCondition;
                }
            }
            else
                return new ResponseCfdScenarioCase(false, "해당 조건에 맞는 데이터가 존재하지 않습니다.");

            response.ScenarioCases.Sort();
            return response;
        }

        private ScenarioCondition GetScenarioCondition(Scenario scenario, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = '{3}' and {4} = {5}",
                ScenarioCondition.Fields.mttr_sn, scenario.mttr_sn,
                ScenarioCondition.Fields.trgt_lc, scenario.trgt_lc,
                ScenarioCondition.Fields.buld_sn, scenario.buld_sn);

            return m_dataManager.GetSelect().SelectFirst<ScenarioCondition>(strCondition, out strErrorMessage);
        }

        private IEnumerable<MaterialRange> GetMaterialRanges(Material material, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} order by {0}, {2}", MaterialRange.Fields.mttr_sn, material.mttr_sn, MaterialRange.Fields.ordr_no);
            IEnumerable<MaterialRange> materialRanges = m_dataManager.GetSelect().Select<MaterialRange>(strCondition, out strErrorMessage);

            if (materialRanges == null)
                return null;

            return materialRanges;
        }
    }
}
