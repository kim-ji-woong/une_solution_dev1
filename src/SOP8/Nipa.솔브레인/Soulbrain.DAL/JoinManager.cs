using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections;
using Soulbrain.Model.Facility;
using Soulbrain.Model.Cfd;
using Base.Model.Spatial;
using System.Collections.Generic;

namespace Soulbrain.DAL
{
    public class JoinManager : SelectManager
    {
        private IDataManager m_dataManager = null;

        public JoinManager(IDataManager dataManager)
            : base(dataManager)
        {
            m_dataManager = dataManager;
        }

        public ArrayList JoinFacilityFacilityData(string strAdditionalConditions, out string strErrorMessage)
        {
            Facility facility = new Facility();
            FacilityData facilityData = new FacilityData();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on c.{5} = a.{6}",
                facility.GetTableName(), facilityData.GetTableName(), Zone.TableName,
                Facility.Fields.fclty_sn, FacilityData.Fields.fclty_sn,
                Zone.Fields.zone_sn, Facility.Fields.zone_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nFacilityFieldCount = facility.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                facility = new Facility();
                facilityData = new FacilityData();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nFacilityFieldCount)
                    {
                        ReadFacility(pair.Key, pair.Value, facility);
                    }
                    else
                        ReadFacilityData(pair.Key, pair.Value, facilityData);

                    nIndex++;
                }

                arrDatas.Add(facility);
                arrDatas.Add(facilityData);
            }

            return arrDatas;
        }

        public ArrayList JoinCfdScenarioMaterialCase(string strAdditionalConditions, out string strErrorMessage)
        {
            Scenario scenario = new Scenario();
            Material material = new Material();
            ScenarioCase scenarioCase = new ScenarioCase();

            string strSQL = string.Format("Select a.*, b.*, c.* from {0} a inner join {1} b on a.{3} = b.{4} inner join {2} c on a.{5} = c.{6}",
                scenario.GetTableName(), material.GetTableName(), scenarioCase.GetTableName(),
                Scenario.Fields.mttr_sn, Material.Fields.mttr_sn,
                Scenario.Fields.senario_sn, ScenarioCase.Fields.senario_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            int nScenarioFieldCount = scenario.GetFieldCount();
            int nMaterialFieldCount = material.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                scenario = new Scenario();
                material = new Material();
                scenarioCase = new ScenarioCase();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nScenarioFieldCount)
                        ReadCfdScenario(pair.Key, pair.Value, scenario);
                    else if (nIndex < nScenarioFieldCount + nMaterialFieldCount)
                        ReadCfdMaterial(pair.Key, pair.Value, material);
                    else
                        ReadCfdScenarioCase(pair.Key, pair.Value, scenarioCase);

                    nIndex++;
                }

                arrDatas.Add(scenario);
                arrDatas.Add(material);
                arrDatas.Add(scenarioCase);
            }

            return arrDatas;
        }

        public ArrayList JoinBuildingBuildingGroup(string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;

            Building building = new Building();
            BuildingGroup buildingGroup = new BuildingGroup();

            string strSQL = string.Format("Select a.*, b.* from {0} a inner join {1} b on a.{2} = b.{3}",
                Building.TableName, BuildingGroup.TableName,
                Building.Fields.buld_group_sn, BuildingGroup.Fields.buld_group_sn);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strAdditionalConditions.ToLower().Trim().StartsWith("order by"))
                    strSQL += " " + strAdditionalConditions;
                else
                    strSQL += " where " + strAdditionalConditions;
            }

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = this.Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            Base.DAL.JoinManager joinManager = new Base.DAL.JoinManager(m_dataManager);

            int nBuildingFieldCount = building.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                building = new Building();
                buildingGroup = new BuildingGroup();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nBuildingFieldCount)
                        joinManager.ReadBuilding(pair.Key, pair.Value, ref building);
                    else
                        joinManager.ReadBuildingGroup(pair.Key, pair.Value, ref buildingGroup);

                    nIndex++;
                }

                arrDatas.Add(building);
                arrDatas.Add(buildingGroup);
            }

            return arrDatas;
        }

        public void ReadCfdScenarioCase(string strFieldName, object value, ScenarioCase scenarioCase)
        {
            if (strFieldName == ScenarioCase.Fields.senario_case_sn.ToString())
                scenarioCase.senario_case_sn = (int)value;
            else if (strFieldName == ScenarioCase.Fields.senario_sn.ToString())
                scenarioCase.senario_sn = (int)value;
            else if (strFieldName == ScenarioCase.Fields.frme_secnd.ToString())
                scenarioCase.frme_secnd = (int)value;
            else if (strFieldName == ScenarioCase.Fields.file_url.ToString())
                scenarioCase.file_url = (string)value;
        }

        public void ReadCfdMaterial(string strFieldName, object value, Material material)
        {
            if (strFieldName == Material.Fields.mttr_sn.ToString())
                material.mttr_sn = (int)value;
            else if (strFieldName == Material.Fields.name.ToString())
                material.name = (string)value;
            else if (strFieldName == Material.Fields.min_value.ToString())
                material.min_value = (double)(float)value;
            else if (strFieldName == Material.Fields.max_value.ToString())
                material.max_value = (double)(float)value;
            else if (strFieldName == Material.Fields.min_color_red.ToString())
                material.min_color_red = (int)value;
            else if (strFieldName == Material.Fields.min_color_green.ToString())
                material.min_color_green = (int)value;
            else if (strFieldName == Material.Fields.min_color_blue.ToString())
                material.min_color_blue = (int)value;
            else if (strFieldName == Material.Fields.min_color_red.ToString())
                material.max_color_red = (int)value;
            else if (strFieldName == Material.Fields.min_color_green.ToString())
                material.max_color_green = (int)value;
            else if (strFieldName == Material.Fields.min_color_blue.ToString())
                material.max_color_blue = (int)value;
        }

        public void ReadCfdScenario(string strFieldName, object value, Scenario scenario)
        {
            if (strFieldName == Scenario.Fields.senario_sn.ToString())
                scenario.senario_sn = (int)value;
            else if (strFieldName == Scenario.Fields.mttr_sn.ToString())
                scenario.mttr_sn = (int)value;
            else if (strFieldName == Scenario.Fields.trgt_lc.ToString())
                scenario.trgt_lc = (string)value;
            else if (strFieldName == Scenario.Fields.buld_sn.ToString())
                scenario.buld_sn = (int)value;
            else if (strFieldName == Scenario.Fields.wind_drc.ToString())
            {
                if (value == null)
                    scenario.wind_drc = null;
                else
                    scenario.wind_drc = (int)value;
            }
            else if (strFieldName == Scenario.Fields.wind_spd.ToString())
            {
                if (value == null)
                    scenario.wind_spd = null;
                else
                    scenario.wind_spd = (double)(float)value;
            }
        }

        public void ReadFacility(string strFieldName, object value, Facility facility)
        {
            if (strFieldName == Facility.Fields.fclty_sn.ToString())
                facility.fclty_sn = (int)value;
            else if (strFieldName == Facility.Fields.model_name.ToString())
                facility.model_name = (string)value;
            else if (strFieldName == Facility.Fields.fclty_name.ToString())
                facility.fclty_name = (string)value;
            else if (strFieldName == Facility.Fields.zone_sn.ToString())
                facility.zone_sn = (int)value;
        }

        public void ReadFacilityData(string strFieldName, object value, FacilityData facilityData)
        {
            if (strFieldName == FacilityData.Fields.fclty_sn.ToString())
                facilityData.fclty_sn = (int)value;
            else if (strFieldName == FacilityData.Fields.ordr_indx.ToString())
                facilityData.ordr_indx = (int)value;
            else if (strFieldName == FacilityData.Fields.value.ToString())
                facilityData.value = (string)value;
            else if (strFieldName == FacilityData.Fields.wdt.ToString())
                facilityData.wdt = (bool)value;
            else if (strFieldName == FacilityData.Fields.indent_level.ToString())
            {
                if (value == null)
                    facilityData.indent_level = null;
                else
                    facilityData.indent_level = (int)value;
            }
        }
    }
}
