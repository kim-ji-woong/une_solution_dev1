using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using Base.DAL;
using Base.Model.Spatial;

namespace Kftc.BLL.Process
{
    using Request;
    using Response;

    class SensorManager
    {
        private IDataManager m_dataManager = null;

        private const int CCTV = 300303;
        private const int Door = 300316;
        private const int EmergencyBell = 300319;
        private const int Intrusion = 300320;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSensorinfo RequestSensorInfo(RequestSensorInfo data)
        {
            string strCondition = string.Format("{0} = {1}", Sensor.Fields.sensor_sn, data.SensorNo);

            string strErrorMessage;
            Sensor sensor = m_dataManager.GetSelect().SelectFirst<Sensor>(strCondition, out strErrorMessage);

            if (sensor == null)
            {
                if (strErrorMessage != null)
                    return new ResponseSensorinfo(false, strErrorMessage);
                else
                    return new ResponseSensorinfo(false, "존재하지 않는 센서입니다.");
            }

            ResponseSensorinfo response = null;
            List<SensorData> sensorDatas = null;

            if (sensor.sensor_ty_code == EmergencyBell)
                sensorDatas = GetEmergencyBellInfo(sensor, out strErrorMessage);
            else if (sensor.sensor_ty_code == CCTV)
                sensorDatas = GetCCTVInfo(sensor, out strErrorMessage);
            else if (sensor.sensor_ty_code == Door)
                sensorDatas = GetDoorInfo(sensor, out strErrorMessage);
            else if (sensor.sensor_ty_code == Intrusion)
                sensorDatas = GetIntrusionInfo(sensor, out strErrorMessage);
            else
                strErrorMessage = "정의되지 않은 센서타입입니다.";

            if (sensorDatas == null)
                response = new ResponseSensorinfo(false, strErrorMessage);
            else
            {
                response = new ResponseSensorinfo(true, "");
                response.SensorDatas.AddRange(sensorDatas);
            }

            return response;
        }

        private List<SensorData> GetIntrusionInfo(Sensor sensor, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            SensorZone sensorZone = GetSensorZone(sensor, out strErrorMessage);

            if (sensorZone == null)
                return null;

            string strSubType = GetSubType(sensor, out strErrorMessage);

            if (strSubType == null && strErrorMessage != null)
                return null;

            List<SensorData> sensorDatas = new List<SensorData>();

            sensorDatas.Add(new SensorData("위치", strLocation));
            sensorDatas.Add(new SensorData("수신기 번호", GetTagInfo(sensorZone)));
            sensorDatas.Add(new SensorData("감지기 종류", strSubType));

            return sensorDatas;
        }

        private List<SensorData> GetDoorInfo(Sensor sensor, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            List<SensorData> sensorDatas = new List<SensorData>();

            sensorDatas.Add(new SensorData("위치", strLocation));

            return sensorDatas;
        }

        private List<SensorData> GetCCTVInfo(Sensor sensor, out string strErrorMessage)
        {
            CCTV cctv = GetCCTV(sensor, out strErrorMessage);

            if (cctv == null)
                return null;

            SensorZone sensorZone = GetSensorZone(sensor, out strErrorMessage);

            if (sensorZone == null)
                return null;

            string strCCTVType = GetSubType(sensor, out strErrorMessage);

            if (strCCTVType == null && strErrorMessage != null)
                return null;

            string strModelName = cctv.camera_makr_name == null ? "/" : cctv.camera_makr_name + "/";

            if (cctv.camera_model_name != null)
                strModelName += cctv.camera_model_name;

            List<SensorData> sensorDatas = new List<SensorData>();

            sensorDatas.Add(new SensorData("CCTV 명", sensor.sensor_name));
            sensorDatas.Add(new SensorData("IP 주소", cctv.camera_ip));
            sensorDatas.Add(new SensorData("CCTV 종류", strCCTVType));
            sensorDatas.Add(new SensorData("제조사_모델", strModelName));

            return sensorDatas;
        }

        private List<SensorData> GetEmergencyBellInfo(Sensor sensor, out string strErrorMessage)
        {
            string strLocation = GetLocation(sensor, out strErrorMessage);

            if (strLocation == null)
                return null;

            SensorZone sensorZone = GetSensorZone(sensor, out strErrorMessage);

            if (sensorZone == null)
                return null;

            List<SensorData> sensorDatas = new List<SensorData>();

            sensorDatas.Add(new SensorData("위치", strLocation));
            sensorDatas.Add(new SensorData("수신기 번호", GetTagInfo(sensorZone)));

            return sensorDatas;
        }

        private SensorZone GetSensorZone(Sensor sensor, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.sensor_sn, sensor.sensor_sn);
            IEnumerable<SensorZone> sensorZones = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return null;

            foreach (SensorZone sensorZone in sensorZones)
            {
                return sensorZone;
            }

            strErrorMessage = "센서의 부가정보를 찾을수 없습니다.";
            return null;
        }

        private CCTV GetCCTV(Sensor sensor, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn, sensor.sensor_sn);
            CCTV cctv = m_dataManager.GetSelect().SelectFirst<CCTV>(strCondition, out strErrorMessage);

            if (cctv == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "CCTV 정보를 DB에서 찾을수 없습니다.";

                return null;
            }

            return cctv;
        }

        private string GetSubType(Sensor sensor, out string strErrorMessage)
        {
            string strSQL = string.Format("Select c.{3} name from {0} a inner join {1} b on a.{4} = b.{5} and a.{4} = {6} inner join {2} c on b.{7} = c.{8} and b.{9} = c.{10}",
                Sensor.TableName, SensorZone.TableName, SubType.TableName,
                SubType.Fields.sensor_sub_ty_name,
                Sensor.Fields.sensor_sn, SensorZone.Fields.sensor_sn, sensor.sensor_sn,
                SensorZone.Fields.sensor_sub_ty_no, SubType.Fields.sensor_sub_ty_no,
                SensorZone.Fields.sensor_ty_code, SubType.Fields.sensor_ty_code);

            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                string strSubTypeName = item.name;

                if (strSubTypeName != null)
                    return strSubTypeName;
            }

            return "";
        }

        private string GetTagInfo(SensorZone sensorZone)
        {
            if (sensorZone.tag_no == null)
                return "";

            return sensorZone.tag_no.ToString();
            /*int tagNo = (int)sensorZone.tag_no;
            int receiverNo = (tagNo - 1000000000) / 10000000;
            int relayTeam = (tagNo % 10000000) / 100000;
            int loop = (tagNo % 100000) / 10000;
            int relayNo = (tagNo % 10000) / 10;
            int tag = tagNo % 10;

            return string.Format("{0}-{1}-{2}-{3}-{4}", receiverNo, relayTeam, loop, relayNo, tag);*/
        }

        private string GetLocation(Sensor sensor, out string strErrorMessage)
        {
            if (sensor.zone_sn == null)
            {
                strErrorMessage = null;
                return "";
            }

            JoinManager joinManager = new JoinManager(m_dataManager);

            string strCondition = string.Format("a.{0} = {1}", Zone.Fields.zone_sn, sensor.zone_sn);
            ArrayList arrDatas = joinManager.JoinZoneBuilding(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int dataCount = arrDatas.Count;

            if (dataCount < 2)
            {
                strErrorMessage = "센서의 위치정보를 찾을수 없습니다.";
                return null;
            }

            Zone zone = (Zone)arrDatas[0];
            Building building = (Building)arrDatas[1];

            if (building != null)
            {
                string strBuildingName = building.disp_text;
                string strZoneName = zone.disp_text;

                if (strZoneName.StartsWith(strBuildingName))
                    return strZoneName;
                else
                    return strBuildingName + " " + strZoneName;
            }

            return zone.disp_text;
        }
    }
}
