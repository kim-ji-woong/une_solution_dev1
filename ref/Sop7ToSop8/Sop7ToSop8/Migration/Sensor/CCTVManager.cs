using System.Collections.Generic;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sensor
{
    class CCTVManager
    {
        private const int AddedSensorNumber = 30000;
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public CCTVManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("CCTV 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("CCTV 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            // Key : Sensor ID
            Dictionary<int, List<dynamic>> dicSensorZoneDatas = ReadSop7SensorZones(out strErrorMessage);

            if (dicSensorZoneDatas == null)
                return false;

            string strSQL = "Select ID, CameraName, PositionName, UniqueKey, X, Y, Z, ZoneID, IsIndoor, Type, Channel, UserID, Password, URL, BigURL, SmallURL, Enabled, Description, CameraIP, CameraCompanyName, CameraModelName from SdmsCCTV";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, dicSensorZoneDatas, out strErrorMessage) == false)
                    return false;
            }

            strSQL = "Select EquipZoneID, CCTV1, CCTV2, CCTV3, CCTV4 from SdmsCCTVEquipZone";
            arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateEquipZoneCCTV(data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateEquipZoneCCTV(dynamic data, out string strErrorMessage)
        {
            EquipZoneCCTV equipZoneCCTV = new EquipZoneCCTV();
            equipZoneCCTV.eqp_zone_sn = data.EquipZoneID;
            equipZoneCCTV.cctv_1 = data.CCTV1 + AddedSensorNumber;
            equipZoneCCTV.cctv_2 = data.CCTV2 + AddedSensorNumber;
            equipZoneCCTV.cctv_3 = data.CCTV3 + AddedSensorNumber;
            equipZoneCCTV.cctv_4 = data.CCTV4 + AddedSensorNumber;

            return m_client.Sop8DataManager.GetCreate().Insert<EquipZoneCCTV>(equipZoneCCTV, out strErrorMessage);
        }

        private Dictionary<int, List<dynamic>> ReadSop7SensorZones(out string strErrorMessage)
        {
            string strSQL = "Select a.ID ID, a.SensorType SensorType, a.OrgSensorID OrgSensorID, a.EquipZoneID EquipZoneID, a.IsAlarmStatus IsAlarmStatus, a.Data Data, b.SensorServerID SensorServerID, b.TagNo TagNo, b.Activate Activate, c.UniqueKey UniqueKey ";
            strSQL += "from SdmsSensorZone a inner join SdmsSensorTagInfo b on a.ID = b.SensorZoneID and a.SensorType >= 900 and a.SensorType <= 906 inner join SdmsCCTV c on a.OrgSensorID = c.ID";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return null;

            // Key : Sensor ID
            Dictionary<int, List<dynamic>> dicSensorZoneDatas = new Dictionary<int, List<dynamic>>();
            List<dynamic> datas = null;

            foreach (var data in arrResults)
            {
                if (dicSensorZoneDatas.TryGetValue(data.OrgSensorID + AddedSensorNumber, out datas) == false)
                {
                    datas = new List<dynamic>();
                    dicSensorZoneDatas[data.OrgSensorID + AddedSensorNumber] = datas;
                }

                datas.Add(data);
            }

            return dicSensorZoneDatas;
        }

        private bool CreateSop8(dynamic data, Dictionary<int, List<dynamic>> dicSensorZoneDatas, out string strErrorMessage)
        {
            Base.Model.Sensor.Sensor sensor = new Base.Model.Sensor.Sensor();
            sensor.sensor_sn = data.ID + AddedSensorNumber;
            sensor.sensor_ty_optn_code = (int)CodeType.SensorType;
            sensor.sensor_ty_code = SdmsSensor.SensorType.CCTV;
            sensor.sensor_name = data.CameraName;
            sensor.lc_name = data.PositionName;
            sensor.x = data.X;
            sensor.y = data.Y;
            sensor.z = data.Z;
            sensor.zone_sn = data.ZoneID;
            sensor.site_sn = m_nSop8SiteNo;
            sensor.sensor_sttus_optn_code = (int)CodeType.SensorStatus;
            sensor.sensor_sttus_code = null;
            sensor.enab = data.Enabled == null || data.Enabled == true;
            sensor.deleted = false;

            if (m_client.Sop8DataManager.GetCreate().Insert<Base.Model.Sensor.Sensor>(sensor, out strErrorMessage) == false)
                return false;

            List<dynamic> sensorZoneDatas;

            if (dicSensorZoneDatas.TryGetValue(sensor.sensor_sn, out sensorZoneDatas))
            {
                if (CreateSensorZone(sensor, sensorZoneDatas, data, out strErrorMessage) == false)
                    return false;
            }

            if (CreateCCTV(sensor, data, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CreateCCTV(Base.Model.Sensor.Sensor sensor, dynamic sensorData, out string strErrorMessage)
        {
            CCTV cctv = new CCTV();
            cctv.sensor_sn = sensor.sensor_sn;
            cctv.sensor_ty_optn_code = sensor.sensor_ty_optn_code;
            cctv.sensor_ty_code = sensor.sensor_ty_code;
            cctv.cctv_no = sensor.sensor_sn - AddedSensorNumber;
            cctv.unq_key = sensorData.UniqueKey;
            cctv.indoor_yn = sensorData.IsIndoor;
            cctv.strmg_ty = sensorData.Type;
            cctv.user_id = sensorData.UserID;
            cctv.password = sensorData.Password;
            cctv.url = sensorData.URL;
            cctv.hd_url = sensorData.BigURL;
            cctv.ld_url = sensorData.SmallURL;
            cctv.camera_ip = sensorData.CameraIP;
            cctv.camera_makr_name = sensorData.CameraCompanyName;
            cctv.camera_model_name = sensorData.CameraModelName;

            return m_client.Sop8DataManager.GetCreate().Insert<CCTV>(cctv, out strErrorMessage);
        }

        private bool CreateSensorZone(Base.Model.Sensor.Sensor sensor, List<dynamic> sensorZoneDatas, dynamic sensorData, out string strErrorMessage)
        {
            strErrorMessage = null;

            int prevID = -1;

            foreach (dynamic sensorZoneData in sensorZoneDatas)
            {
                if (prevID == sensorZoneData.ID)
                    continue;

                prevID = sensorZoneData.ID;

                SensorZone sensorZone = new SensorZone();
                sensorZone.sensor_zone_sn = sensorZoneData.ID + AddedSensorNumber;
                sensorZone.sensor_sn = sensor.sensor_sn;
                sensorZone.sensor_ty_optn_code = sensor.sensor_ty_optn_code;
                sensorZone.sensor_ty_code = sensor.sensor_ty_code;
                sensorZone.sensor_sub_ty_no = sensorZoneData.SensorType;
                sensorZone.unq_key = sensorData.UniqueKey + "_" + sensorZoneData.SensorType.ToString();
                sensorZone.eqp_zone_sn = sensorZoneData.EquipZoneID;
                sensorZone.alarm_yn = sensorZoneData.IsAlarmStatus;
                sensorZone.tag_no = sensorZoneData.TagNo;
                sensorZone.acti = sensorZoneData.Activate == 1;
                sensorZone.sensor_server_sn = sensorZoneData.SensorServerID;

                if (m_client.Sop8DataManager.GetCreate().Insert<SensorZone>(sensorZone, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        // sop7의 sensorZone ID를 sop8의 sensorZone 번호로 바꾼다.
        public static int ConvertSensorZoneID(int sop7SensorZoneID)
        {
            return sop7SensorZoneID + AddedSensorNumber;
        }
    }
}
