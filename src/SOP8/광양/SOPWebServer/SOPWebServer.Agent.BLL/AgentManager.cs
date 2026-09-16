using SOPWebServer.IBLL.Interface;
using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SOPWebServer.Agent.BLL
{
    public class AgentManager : IAgentManager
    {
        public INotifyManager GetNotifyManager()
        {
            return new NotifyManager();
        }

        public IAgent GetAgent(string strAgentType, IDataManager dataManager)
        {
            if (strAgentType == null)
                return null;

            //strAgentType = strAgentType.ToLower();
            return null;
        }

        public bool GetSensorServerType(int sensorType, out IAgentManager.SensorType sensorServerType, out string strParameter)
        {
            strParameter = null;

            if (sensorType == SdmsSensor.SensorType.Fire)
                sensorServerType = IAgentManager.SensorType.Fire;
            else if (sensorType == SdmsSensor.SensorType.CCTV)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "cctv";
            }
            else if (sensorType == SdmsSensor.SensorType.PSM)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "psm";
            }
            else if (sensorType == SdmsSensor.SensorType.Etc)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "etc";
            }
            else if (sensorType == 300331)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "대기유해물질측정기";
            }
            else if (sensorType == 300333)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "수질오염측정기";
            }
            else if (sensorType == 300334)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "수해방지 모니터링 시스템";
            }
            else
            {
                sensorServerType = IAgentManager.SensorType.Unknown;
                return false;
            }

            return true;
        }

        public bool GetUseReceive(IDataManager dataManager, int sensorType, int? siteNo)
        {
            return true;
        }
    }
}