using System.Collections.Generic;
using Base.Model.Spatial;

namespace Sop7ToSop8.Migration.Spatial
{
    class BuildingGroupManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public BuildingGroupManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("건물그룹 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (ReadSop7Data(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("건물그룹 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, GroupName, ParentID, TextCenter, DisplayText from SdmsSpatialBuildingGroup";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSop8(dynamic data, out string strErrorMessage)
        {
            BuildingGroup buildingGroup = new BuildingGroup();
            buildingGroup.buld_group_sn = data.ID;
            buildingGroup.name = data.GroupName;
            buildingGroup.disp_text = data.DisplayText;
            buildingGroup.site_sn = m_nSop8SiteNo;

            string strTextCenter = data.TextCenter;
            
            if (strTextCenter != null)
            {
                double x, y, z;

                string[] tokens = strTextCenter.Split(',');

                if (tokens.Length == 3)
                {
                    if (double.TryParse(tokens[0].Trim(), out x) && double.TryParse(tokens[1].Trim(), out y) && double.TryParse(tokens[2].Trim(), out z))
                    {
                        buildingGroup.text_center_crdnt_x = x;
                        buildingGroup.text_center_crdnt_y = y;
                        buildingGroup.text_center_crdnt_z = z;
                    }
                }
            }

            return m_client.Sop8DataManager.GetCreate().Insert<BuildingGroup>(buildingGroup, out strErrorMessage);
        }

        private bool ReadSop7Data(out string strErrorMessage)
        {
            string strSQL = "Select BuildingGroupID, OrderIndex, Value, WithDot, IndentDepth from SdmsSpatialBuildingGroupData";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8Data(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSop8Data(dynamic data, out string strErrorMessage)
        {
            string strValue, strName;
            ParseValue(data.OrderIndex, data.Value, out strName, out strValue);

            BuildingGroupData buildingGroupData = new BuildingGroupData();
            buildingGroupData.buld_group_sn = data.BuildingGroupID;
            buildingGroupData.ordr_indx = data.OrderIndex;
            buildingGroupData.value = strValue;
            buildingGroupData.name = strName;
            buildingGroupData.wdt = data.WithDot;
            buildingGroupData.indent_level = data.IndentDepth;



            return m_client.Sop8DataManager.GetCreate().Insert<BuildingGroupData>(buildingGroupData, out strErrorMessage);
        }

        private void ParseValue(int orderIndex, string value, out string strName, out string strValue)
        {
            strName = strValue = "";

            if (orderIndex == 1)
            {
                strName = "공장동";
                strValue = value;
            }
            else
            {
                int index = value.IndexOf(':');

                if (index > 0)
                {
                    strName = value.Substring(0, index).Trim();
                    strValue = value.Substring(index + 1).Trim();
                }
            }
        }
    }
}
