using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;

namespace Kftc.BLL.Process
{
    using Response;
    using Request;
    using System;
    using Base.Model.Spatial;
    using static dnsDataKftc.CommonCode.SdmsSensor;
    using System.Linq;

    class DoorManager
    {
        private const int DoorTypeCode = 300316;

        private const string TYPE_OPEN = "opened";
        private const string TYPE_CLOSE = "closed";


        private IDataManager m_dataManager = null;

        public DoorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDoorStatus RequestDoorStatus(RequestDoorStatus data)
        {
            string strErrorMessage;
            string strCondition = GetSensorZoneCondition(data.ZoneNo);
            IEnumerable<SensorZone> sensorZones = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZones == null)
                return new ResponseDoorStatus(false, strErrorMessage);

            ResponseDoorStatus response = new ResponseDoorStatus(true, "");

            foreach (SensorZone sensorZone in sensorZones)
            {
                if (sensorZone.descp == null)
                    response.DoorDatas.Add(new DoorData(sensorZone.sensor_sn, null));
                else
                {
                    string strStatus = sensorZone.descp.ToLower().Trim();

                    if (strStatus == TYPE_OPEN)
                        response.DoorDatas.Add(new DoorData(sensorZone.sensor_sn, true));
                    else if (strStatus == TYPE_CLOSE)
                        response.DoorDatas.Add(new DoorData(sensorZone.sensor_sn, false));
                    else
                        response.DoorDatas.Add(new DoorData(sensorZone.sensor_sn, null));
                }
            }

            Dictionary<int, bool?> dicDoorStatus = new Dictionary<int, bool?>();

            foreach (var doorData in response.DoorDatas)
            {
                if (doorData.IsOpened != null)
                    dicDoorStatus[doorData.SensorNo] = (bool)doorData.IsOpened;
            }

            foreach (var doorData in response.DoorDatas)
            {
                if (doorData.IsOpened == null)
                {
                    bool? isOpened;

                    if (dicDoorStatus.TryGetValue(doorData.SensorNo, out isOpened))
                    {
                        if (isOpened != null)
                            doorData.IsOpened = (bool)isOpened;
                    }
                }
            }

            return response;
        }

        private string GetSensorZoneCondition(int? zoneNo)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4}",
                    SensorZone.Fields.sensor_sn,
                    Sensor.Fields.sensor_sn,
                    Sensor.TableName,
                    Sensor.Fields.sensor_ty_code, DoorTypeCode);

            if (zoneNo == null)
                strCondition += ")";
            else
                strCondition += string.Format(" and {0} = {1})", Sensor.Fields.zone_sn, (int)zoneNo);

            return strCondition;
        }

        public ResponseTotalDoorStatus RequestTotalDoorStatus()
        {
            string strErrorMessage;

            ResponseTotalDoorStatus response = new ResponseTotalDoorStatus();

            try
            {

                string strSQL = string.Format(@$"SELECT {Sensor.TableName}.{Sensor.Fields.sensor_name}, {Sensor.Fields.sensor_name}, {Sensor.TableName}.{Sensor.Fields.zone_sn}, {SensorZone.Fields.descp}, {Zone.TableName}.{Zone.Fields.name}
                                                FROM {Sensor.TableName} 
                                                INNER JOIN {SensorZone.TableName} ON {Sensor.TableName}.{Sensor.Fields.sensor_sn} = {SensorZone.TableName}.{SensorZone.Fields.sensor_zone_sn}
                                                INNER JOIN {Zone.TableName} ON {Zone.TableName}.{Zone.Fields.zone_sn} = {Sensor.TableName}.{Sensor.Fields.zone_sn}
                                                WHERE {Sensor.TableName}.{Sensor.Fields.sensor_ty_code} = {SensorType.Door} AND {Sensor.Fields.manual_yn} = 0");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out string strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                Dictionary<int, ZoneCountData> dicZoneData = new Dictionary<int, ZoneCountData>();

                foreach (var result in results)
                {
                    ZoneCountData data = null;

                    if (dicZoneData.ContainsKey(result.zone_sn) == false)
                    {
                        data = new ZoneCountData();
                        data.ZoneNo = result.zone_sn;
                        data.ZoneName = result.name;

                        dicZoneData[result.zone_sn] = data;
                    }
                    else
                    {
                        data = dicZoneData[result.zone_sn];
                    }

                    data.TotalDoorCount++;

                    if (result.descp == TYPE_CLOSE)
                    {
                        data.CloseDoorCount++;
                        response.TotalCloseDoorCount++;
                    }
                }

                response.Zones = dicZoneData.Values.ToList();
                response.Success = true;
            }
            catch (Exception e)
            {
                response.Message = e.Message;
                response.Success = false;
            }

            return response;
        }
    }
}
