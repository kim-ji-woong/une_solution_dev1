using System.Collections.Generic;
using Base.Model.Sensor;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sensor
{
    class PsmSensorManager
    {
        private const int AddedSensorNumber = 110000;
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public PsmSensorManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            m_client.SendStatus("누출센서 데이터를 읽어옵니다.");
            string strErrorMessage;

            if (ReadSop7(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("누출센서 데이터를 옮기는데 성공하였습니다.");
            return true;
        }

        private bool ReadSop7(out string strErrorMessage)
        {
            // Key : Sensor ID
            Dictionary<int, dynamic> dicSensorZoneDatas = ReadSop7SensorZones(out strErrorMessage);

            if (dicSensorZoneDatas == null)
                return false;

            string strSQL = "Select ID, Name, PositionName, X, Y, Z, CurrentData, EquipZoneID, Department, DepartmentPhoneNumber, Enabled, Status, UniqueKey, ZoneID, MaterialType, LimitBase, LimitType, LimitValue from SdmsSensorPSM";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return false;

            foreach (var data in arrResults)
            {
                if (CreateSop8(data, dicSensorZoneDatas, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private Dictionary<int, dynamic> ReadSop7SensorZones(out string strErrorMessage)
        {
            string strSQL = "Select a.ID ID, a.SensorType SensorType, a.OrgSensorID OrgSensorID, a.EquipZoneID EquipZoneID, a.IsAlarmStatus IsAlarmStatus, a.Data Data, b.SensorServerID SensorServerID, b.TagNo TagNo, b.Activate Activate, c.UniqueKey UniqueKey, c.MaterialType MaterialType ";
            strSQL += "from SdmsSensorZone a inner join SdmsSensorTagInfo b on a.ID = b.SensorZoneID and a.SensorType = 11 inner join SdmsSensorPSM c on a.OrgSensorID = c.ID";
            IEnumerable<dynamic> arrResults = m_client.Sop7DataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (arrResults == null)
                return null;

            // Key : Sensor ID
            Dictionary<int, dynamic> dicSensorZoneDatas = new Dictionary<int, dynamic>();

            foreach (var data in arrResults)
            {
                dicSensorZoneDatas[data.OrgSensorID + AddedSensorNumber] = data;
            }

            return dicSensorZoneDatas;
        }

        private bool CreateSop8(dynamic data, Dictionary<int, dynamic> dicSensorZoneDatas, out string strErrorMessage)
        {
            Base.Model.Sensor.Sensor sensor = new Base.Model.Sensor.Sensor();
            sensor.sensor_sn = data.ID + AddedSensorNumber;
            sensor.sensor_ty_optn_code = (int)CodeType.SensorType;
            sensor.sensor_ty_code = SdmsSensor.SensorType.PSM;
            sensor.sensor_name = data.Name;
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

            dynamic sensorZoneData;

            if (dicSensorZoneDatas.TryGetValue(sensor.sensor_sn, out sensorZoneData))
            {
                if (CreateSensorZone(sensor, sensorZoneData, data, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool CreateSensorZone(Base.Model.Sensor.Sensor sensor, dynamic sensorZoneData, dynamic sensorData, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            sensorZone.sensor_zone_sn = sensor.sensor_sn;
            sensorZone.sensor_sn = sensor.sensor_sn;
            sensorZone.sensor_ty_optn_code = sensor.sensor_ty_optn_code;
            sensorZone.sensor_ty_code = sensor.sensor_ty_code;
            sensorZone.sensor_sub_ty_no = sensorData.MaterialType;
            sensorZone.unq_key = sensorZoneData.UniqueKey;
            sensorZone.eqp_zone_sn = sensorZoneData.EquipZoneID;
            sensorZone.alarm_yn = sensorZoneData.IsAlarmStatus;
            sensorZone.tag_no = sensorZoneData.TagNo;
            sensorZone.acti = sensorZoneData.Activate == 1;
            sensorZone.sensor_server_sn = sensorZoneData.SensorServerID;

            if (m_client.Sop8DataManager.GetCreate().Insert<SensorZone>(sensorZone, out strErrorMessage))
            {
                return SensorMaterialManager.Run(m_client.Sop8DataManager, sensorZone, sensorData, out strErrorMessage);
            }

            return false;
        }

        // sop7의 sensorZone ID를 sop8의 sensorZone 번호로 바꾼다.
        public static int ConvertSensorZoneID(int sop7SensorZoneID, Dictionary<int, int> dicSensorZones)
        {
            int sensorID;

            if (dicSensorZones.TryGetValue(sop7SensorZoneID, out sensorID) == false)
                return -1;

            return sensorID + AddedSensorNumber;
        }
    }
}
