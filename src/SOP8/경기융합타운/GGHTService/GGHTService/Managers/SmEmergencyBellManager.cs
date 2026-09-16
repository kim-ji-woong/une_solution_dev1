using Base.Model.Sdms.Sensor;
using SOPWebServer.BLL.Models.Request;
using dnsCommunicateSOPWebServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;

namespace GGHTService.Managers
{
    using Models;

    class SmEmergencyBellManager
    {
        private BellInfoModel m_model = null;
        private DataManager m_dataManager = null;

        public SmEmergencyBellManager(BellInfoModel model, bool isAlarm)
        {
            m_dataManager = new DataManager(ConfigManager.DbType, ConfigManager.DbHost, ConfigManager.DbName, ConfigManager.DbID, ConfigManager.DbPw);
            m_model = model;
            ProcessData(isAlarm);
        }

        private void ProcessData(bool isAlarm)
        {
            SensorZone sensorZone = FindSensor();
            if (sensorZone == null)
                return;

            SensorSignal signal = new SensorSignal();

            signal.Header = Header.SENSOR_DATA;
            signal.SensorType = sensorZone.SensorType;
            signal.SensorZoneNo = sensorZone.SensorZoneNo;
            signal.SensorData = isAlarm ? 1 : 0;

            SensorQueryManager sensorQueryManager = new SensorQueryManager(ConfigManager.SOPWebServerURL);
            sensorQueryManager.SendSensorSignal(signal);
        }

        public SensorZone FindSensor()
        {
            string strCondition = string.Format("{0} = (Select {1} from {2} where {3} = {4}) and {5} = '{6}'",
                SensorZone.Fields.ServerInfoNo,
                ServerInfo.Fields.ServerInfoNo,
                ServerInfo.TableName,
                ServerInfo.Fields.SensorServerType,
                (int)ID.ServerTypes.EmergencyBell_Smcom,
                SensorZone.Fields.Description,
                m_model.iphoneNm);

            string strErrorMessage;
            SensorZone sensorZone = m_dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
            
            if (sensorZone == null)
            {
                if (strErrorMessage != null)
                    Logger.Instance.Write("[Read SensorZone Fail] : " + strErrorMessage);
            }

            return sensorZone;
        }
    }
}
