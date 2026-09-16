using System.Collections.Generic;
using Base.Model.Spatial;

namespace Sop7ToSop8.Migration.Spatial
{
    class BuildingManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public BuildingManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("건물 데이터를 읽어옵니다.");
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

            m_client.SendStatus("건물 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, BuildingCode, BuildingName,BuildingGroupID, MaxFloor, MinFloor, TextCenter, BroadcastText, DisplayText from SdmsSpatialBuilding";
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
            Building building = new Building();
            building.buld_sn = data.ID;
            building.buld_code = data.BuildingCode;
            building.name = data.BuildingName;
            building.buld_group_sn = data.BuildingGroupID;
            building.top_floor_indx = data.MaxFloor;
            building.min_floor_indx = data.MinFloor;
            building.brdcst_text = data.BroadcastText;
            building.disp_text = data.DisplayText;

            string strTextCenter = data.TextCenter;

            if (strTextCenter != null)
            {
                double x, y, z;

                string[] tokens = strTextCenter.Split(',');

                if (tokens.Length == 3)
                {
                    if (double.TryParse(tokens[0].Trim(), out x) && double.TryParse(tokens[1].Trim(), out y) && double.TryParse(tokens[2].Trim(), out z))
                    {
                        building.text_center_crdnt_x = x;
                        building.text_center_crdnt_y = y;
                        building.text_center_crdnt_z = z;
                    }
                }
            }

            return m_client.Sop8DataManager.GetCreate().Insert<Building>(building, out strErrorMessage);
        }

        private bool ReadSop7Data(out string strErrorMessage)
        {
            string strSQL = "Select BuildingID, OrderIndex, Value, WithDot, IndentDepth from SdmsSpatialBuildingData";
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

            BuildingData buildingData = new BuildingData();
            buildingData.buld_sn = data.BuildingID;
            buildingData.ordr_indx = data.OrderIndex;
            buildingData.value = strValue;
            buildingData.name = strName;
            buildingData.wdt = data.WithDot;
            buildingData.indent_level = data.IndentDepth;

            return m_client.Sop8DataManager.GetCreate().Insert<BuildingData>(buildingData, out strErrorMessage);
        }

        private void ParseValue(int orderIndex, string value, out string strName, out string strValue)
        {
            strName = strValue = "";

            if (orderIndex == 1)
            {
                strName = "공장";
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
