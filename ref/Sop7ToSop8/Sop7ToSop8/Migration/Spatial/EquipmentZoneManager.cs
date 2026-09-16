using System.Collections.Generic;
using Base.Model.Spatial;
using System.Windows.Forms;

namespace Sop7ToSop8.Migration.Spatial
{
    class EquipmentZoneManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        private bool m_ignoreError = false;
        private string m_strIgnoreLogs = "";

        public EquipmentZoneManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("EquipmentZone 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            if (m_strIgnoreLogs.Length > 0)
                m_client.SendStatus(m_strIgnoreLogs);

            m_client.SendStatus("EquipmentZone 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, ZoneName, LinkedZoneIDList, TextCenter, BroadcastText, DisplayText from SdmsSpatialEquipmentZone";
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
            EquipmentZone equipZone = new EquipmentZone();
            equipZone.eqp_zone_sn = data.ID;
            equipZone.name = data.ZoneName;
            equipZone.brdcst_text = data.BroadcastText;
            equipZone.disp_text = data.DisplayText;
            equipZone.site_sn = m_nSop8SiteNo;

            string strTextCenter = data.TextCenter;

            if (strTextCenter != null)
            {
                double x, y, z;

                string[] tokens = strTextCenter.Split(',');

                if (tokens.Length == 3)
                {
                    if (double.TryParse(tokens[0].Trim(), out x) && double.TryParse(tokens[1].Trim(), out y) && double.TryParse(tokens[2].Trim(), out z))
                    {
                        equipZone.text_center_crdnt_x = x;
                        equipZone.text_center_crdnt_y = y;
                        equipZone.text_center_crdnt_z = z;
                    }
                }
            }

            if (m_client.Sop8DataManager.GetCreate().Insert<EquipmentZone>(equipZone, out strErrorMessage))
                return CreateLinkedZone(equipZone, data.LinkedZoneIDList, out strErrorMessage);

            return false;
        }

        private void AddIgnoreLog(string strErrorMessage)
        {
            if (m_strIgnoreLogs.Length == 0)
                m_strIgnoreLogs = strErrorMessage;
            else
                m_strIgnoreLogs += "\r\n" + strErrorMessage;
        }

        private bool CreateLinkedZone(EquipmentZone equipZone, string strLinkedZoneIDList, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strLinkedZoneIDList == null)
                return true;

            string[] tokens = strLinkedZoneIDList.Split(',');

            foreach (string strToken in tokens)
            {
                int zoneNo;

                if (int.TryParse(strToken, out zoneNo))
                {
                    EquipmentZoneLinkedZone link = new EquipmentZoneLinkedZone();
                    link.eqp_zone_sn = equipZone.eqp_zone_sn;
                    link.zone_sn = zoneNo;

                    if (m_client.Sop8DataManager.GetCreate().Insert<EquipmentZoneLinkedZone>(link, out strErrorMessage) == false)
                    {
                        strErrorMessage = string.Format("Create EquipmentZoneLinkedZone.eqp_zone_sn = {0}, EquipmentZoneLinkedZone.zone_sn = {1} Error", link.eqp_zone_sn, link.zone_sn) + " : " + strErrorMessage;

                        if (m_ignoreError == false)
                            m_client.SendStatus(strErrorMessage);
                        else
                            AddIgnoreLog(strErrorMessage);

                        if (m_ignoreError == false)
                        {
                            DialogResult result = m_client.CheckInterrupt();

                            if (result == DialogResult.No)
                            {
                                strErrorMessage = "작업이 중단됩니다.";
                                return false;
                            }
                            else
                            {
                                if (result == DialogResult.Cancel)
                                    m_ignoreError = true;

                                strErrorMessage = null;
                            }
                        }
                    }
                }
            }

            return true;
        }
    }
}
