using System.Collections.Generic;
using Base.Model.Spatial;

namespace Sop7ToSop8.Migration.Spatial
{
    class ZoneManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public ZoneManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("Zone 데이터를 읽어옵니다.");
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

            m_client.SendStatus("Zone 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, ZoneName, BuildingID, FloorIndex, AddFloor, TextCenter, BroadcastText, DisplayText from SdmsSpatialZone";
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
            Zone zone = new Zone();
            zone.zone_sn = data.ID;
            zone.name = data.ZoneName;
            zone.buld_sn = data.BuildingID;
            zone.floor_indx = data.FloorIndex;
            zone.adit_floor = data.AddFloor;
            zone.brdcst_text = data.BroadcastText;
            zone.disp_text = data.DisplayText;
            zone.site_sn = m_nSop8SiteNo;

            string strTextCenter = data.TextCenter;

            if (strTextCenter != null)
            {
                double x, y, z;

                string[] tokens = strTextCenter.Split(',');

                if (tokens.Length == 3)
                {
                    if (double.TryParse(tokens[0].Trim(), out x) && double.TryParse(tokens[1].Trim(), out y) && double.TryParse(tokens[2].Trim(), out z))
                    {
                        zone.text_center_crdnt_x = x;
                        zone.text_center_crdnt_y = y;
                        zone.text_center_crdnt_z = z;
                    }
                }
            }

            return m_client.Sop8DataManager.GetCreate().Insert<Zone>(zone, out strErrorMessage);
        }

        private bool ReadSop7Data(out string strErrorMessage)
        {
            string strSQL = "Select ZoneID, FakeWallElevation, PoiElevation from SdmsSpatialZoneData";
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
            ZoneData zoneData = new ZoneData();
            zoneData.zone_sn = data.ZoneID;
            zoneData.fake_wall_elev = data.FakeWallElevation;
            zoneData.poi_elev = data.PoiElevation;

            return m_client.Sop8DataManager.GetCreate().Insert<ZoneData>(zoneData, out strErrorMessage);
        }
    }
}
