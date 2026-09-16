using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Gwangyang.BLL.Process;
using Gwangyang.IBLL;
using Gwangyang.BLL.Process;
using Gwangyang.IBLL.Request;
using Gwangyang.IBLL.Response;
using Response;
using dnsExcelReport.Models;
using Base.TeamEditor.IBLL.Request;
using Gwangyang.BLL.Excel.Writer;

namespace Gwangyang.BLL
{
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
        
        public ResponseWeatherData RequestExternalWeatherData()
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.GetExternalWeatherData();
        }

        public ResponseExcelInfo DownloadExcelRegularTeam(RequestDownloadRegularTeam data)
        {
            GwangYangRegularTeamWriter writer = new GwangYangRegularTeamWriter(m_dataManager, data.SiteNo);
            string strErrorMessage;
            byte[] bytes = writer.Run(out strErrorMessage);

            if (bytes != null)
            {
                ResponseExcelInfo response = new ResponseExcelInfo(true, "");
                response.Bytes = bytes;
                response.FileName = writer.GetFileName();
                return response;
            }
            else
            {
                return new ResponseExcelInfo(false, strErrorMessage);
            }
        }

    }
}