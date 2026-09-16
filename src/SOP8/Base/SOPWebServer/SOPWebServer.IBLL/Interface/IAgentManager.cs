using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace SOPWebServer.IBLL.Interface
{
    public interface IAgentManager
    {
        public enum SensorType { Unknown = -1, Fire, MaterialSensor }

        IAgent GetAgent(string strAgentType, IDataManager dataManager);
        INotifyManager GetNotifyManager();
        bool GetSensorServerType(int sensorType, out SensorType sensorServerType, out string strParameter);
        // sensorType의 알람을 수신할 것인가?
        bool GetUseReceive(IDataManager dataManager, int sensorType, int? siteNo);
    }
}
