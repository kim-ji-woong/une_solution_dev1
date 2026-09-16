using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;

namespace dnsSensorServer
{
    class SensorManager
    {
        private IDataManager m_dataManager = null;

        public SensorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public SensorZone FindSensorZone(string strUniqueKey, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}'", SensorZone.Fields.unq_key, strUniqueKey);
            return m_dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);
        }

        public bool UpdateConnectionState(string strServerType, bool isConnected, out string strErrorMessage)
        {
            Dictionary<ServerInfo.Fields, object> dicSets = new Dictionary<ServerInfo.Fields, object>();
            dicSets[ServerInfo.Fields.cnnc_sttus] = isConnected;

            string strCondition = string.Format("{0} = '{1}'", ServerInfo.Fields.lc, strServerType);
            return m_dataManager.GetUpdate().Update<ServerInfo, ServerInfo.Fields>(dicSets, strCondition, out strErrorMessage);
        }
    }
}
