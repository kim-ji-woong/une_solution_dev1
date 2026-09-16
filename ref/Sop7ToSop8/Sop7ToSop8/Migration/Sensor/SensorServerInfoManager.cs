using System.Collections.Generic;
using Base.Model.Sensor;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sensor
{
    class SensorServerInfoManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SensorServerInfoManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("센서서버 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("센서서버 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            string strSQL = "Select ID, Place, IP, ServerType, Port, Status, SOPWebServerURL, bUse from SdmsSensorServerInfo";
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
            ServerInfo server = new ServerInfo();
            server.sensor_server_sn = data.ID;
            server.lc = data.Place;
            server.ip = data.IP;
            server.port = data.Port;
            server.cnnc_sttus = data.Status;
            server.alarm_server_url = data.SOPWebServerURL;
            server.usab = data.bUse;
            server.sensor_server_ty_optn_code = (int)CodeType.SensorServerType;
            server.sensor_server_ty_code = data.ServerType;
            server.site_sn = m_nSop8SiteNo;

            return m_client.Sop8DataManager.GetCreate().Insert<ServerInfo>(server, out strErrorMessage);
        }
    }
}
