using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOPWebServer.IBLL.Interface;
using SOPWebServer.IBLL.Models.Request;
using dnsData.CommonCode;
using Base.Model.Alarm;
using System.Collections.Generic;
using Base.Model.Spatial;

namespace SOPWebServer.Agent.BLL.Agent
{
    class FireAgent : IAgent
    {
        public int GetAlarmDepth(IDataManager dataManager, SensorSignal signal, bool useSensorAlarm, SensorZone sensorZone, bool isManual)
        {
            if (signal.AlarmDepth != null)
                return (int)signal.AlarmDepth;

            if (isManual)
                return 3;

            if (useSensorAlarm == false)
            {
                // sensorZone과 같은 영역에 이미 화재알람이 발생했는지 확인한다.
                string strSub2Query = string.Format("Select {0} from {1} where {2} = {3}",
                    SensorZone.Fields.eqp_zone_sn,
                    SensorZone.TableName,
                    SensorZone.Fields.sensor_zone_sn,
                    sensorZone.sensor_zone_sn);

                string strSubQuery = string.Format("Select {0} from {1} where {2} = {3} and {4} = ({5})",
                    SensorZone.Fields.sensor_zone_sn,
                    SensorZone.TableName,
                    SensorZone.Fields.sensor_ty_code,
                    SdmsSensor.SensorType.Fire,
                    SensorZone.Fields.eqp_zone_sn,
                    strSub2Query);

                string strErrorMessage;
                string strCondition = string.Format("{0} in ({1})", Current.Fields.sensor_zone_sn, strSubQuery);
                IEnumerable<Current> alarms = dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

                if (alarms == null)
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                else
                {
                    int count = 0;

                    foreach (Current alarm in alarms)
                    {
                        if (alarm.sensor_zone_sn != sensorZone.sensor_zone_sn)
                            count++;
                    }

                    if (signal.SensorData > 0)
                    {
                        // 알람 신호일 경우에는 아직 새로운 알람(Current)를 생성하기 이전이므로 count를 하나 빼서 계산
                        // 한 구역에 2개 이상의 센서가 작동하면 경계, 3개 이상 작동하면 심각
                        if (count == 1)
                            return 3;
                        else if (count >= 2)
                            return 4;
                    }
                    else
                    {
                        // 복구 신호일 경우에는 기존에 있던 알람(Current)를 하나 삭제한 상태이므로 count를 그대로 계산
                        // 한 구역에 2개 이상의 센서가 작동하면 경계, 3개 이상 작동하면 심각
                        if (count == 2)
                            return 3;
                        else if (count >= 3)
                            return 4;
                    }
                }
            }

            return 2;
        }

        // Return 값 : null이면서 strErrorMessage도 null이면 Agent가 아닌 Agent를 호출한 곳에서 GetMessage를 처리하도록 한다.
        public string GetMessage(SensorSignal signal, SensorZone sensorZone, Sensor sensor, EquipmentZone equipZone, bool useSensorAlarm, bool isReal, bool isAlarm, out string strErrorMessage)
        {
            strErrorMessage = null;
            return null;
        }
    }
}
