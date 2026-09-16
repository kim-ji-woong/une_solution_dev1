using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Pohang.IBLL;
using Pohang.IBLL.Request;
using Pohang.IBLL.Response;

namespace Pohang.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;
        
        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }
        
        public ResponseExternalSensorTypes RequestExternalSensorTypes(RequestExternalSensorTypes data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalSensorTypes(data);
        }
        
        public ResponseExternalSensorCategories RequestExternalSensorCategories(RequestExternalSensorCategories data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalSensorCategories(data);
        }
        
        public ResponseExternalSensorLink RequestExternalSensorLink()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalSensorLink();
        }

        public ResponseCCTVInfo RequestCCTVInfo(RequestCCTVInfo data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetCCTVInfo(data);
        }
        
        public ResponseExternalPOIInfo RequestExternalPOIInfo()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalPOIInfo();
        }
        
        public ResponseExternalSensorTypeSubTypes RequestExternalSensorTypeSubTypes()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalSensorTypeSubTypes();
        }
        
        public ResponseExternalSensorHistories RequestExternalSensorHistories(RequestExternalSensorHistories data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalSensorHistories(data);
        }

        public ResponseSensorSubTypes RequestSensorSubTypes()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetSensorSubTypes();
        }
        
        public ResponseExternalMaterialLinks RequestExternalMaterialLinks()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalMaterialLinks();
        }

        public ResponseExternalPublicData RequestExternalPublicData()
        { 
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalPublicData();
        }
        
        public ResponseConvertSpecialCharacters RequestConvertSpecialCharacters(RequestConvertSpecialCharacters data)
        {
            SmsManager smsManager = new SmsManager(m_dataManager);
            return smsManager.GetConvertSpecialCharacters(data);
        }
    }
}