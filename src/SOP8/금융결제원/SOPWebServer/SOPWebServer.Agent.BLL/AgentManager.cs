using SOPWebServer.IBLL.Interface;
using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Common;
using System.Collections.Generic;

namespace SOPWebServer.Agent.BLL
{
    using Agent;

    public class AgentManager : IAgentManager
    {
        private const int DoorType = 300316;
        private const int EmergencyBellType = 300319;
        private const int IntrusionType = 300320;

        public INotifyManager GetNotifyManager()
        {
            return new NotifyManager();
        }

        public IAgent GetAgent(string strAgentType, IDataManager dataManager)
        {
            if (strAgentType == null)
                return null;

            strAgentType = strAgentType.ToLower();

            if (strAgentType == "fire")
                return new FireAgent();

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
            else if (sensorType == EmergencyBellType)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "emergencyBell";
            }
            else if (sensorType == DoorType)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "Door";
            }
            else if (sensorType == IntrusionType)
            {
                sensorServerType = IAgentManager.SensorType.MaterialSensor;
                strParameter = "Intrusion";
            }
            else
            {
                sensorServerType = IAgentManager.SensorType.Unknown;
                return false;
            }

            return true;
        }

        // sensorType의 알람을 수신할 것인가?
        public bool GetUseReceive(IDataManager dataManager, int sensorType, int? siteNo)
        {
            string strPropertyName = "UseReceive";

            if (sensorType == SdmsSensor.SensorType.Fire)
                strPropertyName += "Fire";
            else if (sensorType == SdmsSensor.SensorType.CCTV)
                strPropertyName += "CCTV";
            else if (sensorType == SdmsSensor.SensorType.PSM)
                strPropertyName += "PSM";
            else if (sensorType == SdmsSensor.SensorType.Etc)
                strPropertyName += "Etc";
            else
                return true;

            string strCondition = string.Format("{0} = 'SDMS/{1}'", Option.Fields.prop_name, strPropertyName);

            if (siteNo != null)
                strCondition += string.Format(" and {0} = {1}", Option.Fields.site_sn, (int)siteNo);

            string strErrorMessage;
            IEnumerable<Option> options = dataManager.GetSelect().Select<Option>(strCondition, out strErrorMessage);

            // 명시적인 알람거부 표시가 없으면 알람을 수신한다.
            if (options == null)
                return true;

            foreach (Option option in options)
            {
                if (option.prop_value != null)
                {
                    string strValue = option.prop_value.ToLower();

                    if (strValue == "false" || strValue == "0")
                        return false;
                    else if (strValue == "true" || strValue == "1")
                        return true;
                }
            }

            return true;
        }
    }
}