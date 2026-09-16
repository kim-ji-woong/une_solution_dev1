using System.Collections;

namespace SVMSServer.Process
{
    using DAL;
    using Models;
    using SVMS;
    using Datas;

    class SensorZoneManager
    {
        // SensorZone이 없는 CCTV가 있는지 검사하여, 있으면 SensorZone을 추가해준다.
        public static bool CheckCCTVSensorZones(DataManager dataManager)
        {
            int? sensorServerNo = CCTVManager.GetSensorServerNo(dataManager);

            bool isNullable;
            string strCondition = string.Format("a.{0} = {1} and a.{2} not in (Select {3} from {4} where {5} = {1})",
                Sensor.GetFieldName(Sensor.Fields.sensor_ty_code, out isNullable), CCTVManager.CCTV_Type_Code,
                Sensor.GetFieldName(Sensor.Fields.sensor_sn, out isNullable),
                SensorZone.GetFieldName(SensorZone.Fields.sensor_sn, out isNullable),
                SensorZone.TableName,
                SensorZone.GetFieldName(SensorZone.Fields.sensor_ty_code, out isNullable));

            string strErrorMessage;
            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorCCTV(strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                Logger.Instance.Write(LogTypes.Error, "CheckCCTVSensorZones : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int j=0;j<nDataCount-1;j+=2)
            {
                if (arrDatas[j] is Sensor && arrDatas[j + 1] is CCTV)
                {
                    Sensor sensor = (Sensor)arrDatas[j];
                    CCTV cctv = (CCTV)arrDatas[j + 1];

                    for (int i = 900; i <= 906; i++)
                    {
                        SensorZone sensorZone = new SensorZone();

                        sensorZone.sensor_sn = sensor.sensor_sn;
                        sensorZone.sensor_ty_optn_code = CCTVManager.Sensor_Type_Option_Code;
                        sensorZone.sensor_ty_code = CCTVManager.CCTV_Type_Code;
                        sensorZone.sensor_sub_ty_no = i;
                        sensorZone.unq_key = cctv.unq_key + "_" + i.ToString();
                        sensorZone.eqp_zone_sn = null;
                        sensorZone.alarm_yn = false;
                        sensorZone.tag_no = i;
                        sensorZone.acti = true;
                        sensorZone.sensor_server_sn = sensorServerNo;

                        if (dataManager.GetCreateManager().CreateSensorZone(sensorZone, out strErrorMessage) == null)
                        {
                            Logger.Instance.Write(LogTypes.Error, "CheckCCTVSensorZones : " + strErrorMessage);
                            return false;
                        }
                    }
                }
            }

            return true;
        }
    }
}
