using dnsDapperDBUtil.DataAccessLayer.DAL;
using SoulbrainWebAPIServer.Managers.HanbitAPIManagers;
using SoulbrainWebAPIServer.Managers.UniAETAPIManagers;
using SoulbrainWebAPIServer.Model;
using SoulbrainWebAPIServer.Model.HanbitModels;
using SoulbrainWebAPIServer.Model.UniAETModels;
using RequestData = SoulbrainWebAPIServer.Model.HanbitModels.RequestData;

namespace SoulbrainWebAPIServer.Managers
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;
        private DataManager m_wishDataManager = null;
        private WorkListManager m_workListManager = null;
        private WorkPermitManager m_workPermitManager = null;
        
        private HanbitManager m_hanbitManager = null;

        private UniAETManager m_uniAETManager = null;

        public ProcessManager(DataManager dataManager, DataManager dataManager_power, DataManager dataManager_facility, DataManager wishDataManager, string strExcelPath, string strSOPWebServerUrl, string strSOPWebServerUrl_Power, string strSOPWebServerUrl_Facility)
        {
            m_dataManager = dataManager;
            m_wishDataManager = wishDataManager;

            m_workListManager = new WorkListManager(m_wishDataManager, strExcelPath);
            m_workPermitManager = new WorkPermitManager(m_wishDataManager, m_wishDataManager);
            m_hanbitManager = new HanbitManager(m_dataManager, strSOPWebServerUrl);
            m_uniAETManager = new UniAETManager(m_dataManager, dataManager_power, dataManager_facility, strSOPWebServerUrl, strSOPWebServerUrl_Power, strSOPWebServerUrl_Facility);
        }

        public ResponseTodayWorkList GetTodayWorkList()
        {
            return m_workListManager.GetTodayWorkList();
        }
        
        public ResponseCurrentWorkPermitData GetCurrentWorkPermitData()
        {
            return m_workPermitManager.GetWorkPermitData();
        }

        public HanbitResponse ProcessHanbitCurrentTagData(RequestData.RequestScannerTagInfo scanner)
        {
            return m_hanbitManager.ProcessHanbitScannerTagInfo(scanner);
        }

        public HanbitResponse ProcessHanbitUnauthData(RequestData.RequestUnauthTagSignal unauthTagSignal)
        {
            return m_hanbitManager.ProcessHanbitUnauthData(unauthTagSignal);
        }

        public HanbitResponse ProcessHanbitSosSignalData(RequestData.RequestSosSignal sosSignal)
        {
            return m_hanbitManager.ProcessSosSignalData(sosSignal);
        }

        public ResponseUniAET ReadIngestData(RequestIngest req, bool isCheckMesure = false)
        {
            return m_uniAETManager.ReadIngestData(req, isCheckMesure);
        }

        public ResponseUniAET ReadFcltyAnalysisData(RequestFcltyAnalysis req)
        {
            return m_uniAETManager.ReadFcltyAnalysisData(req);
        }

        public ResponseUniAET RequestAlert(RequestFcltyAnalysis req, int nSubType)
        {
            return m_uniAETManager.RequestAlert(req, nSubType);
        }

        public ResponseUniAET ReadPowerAnalysis(RequestPowerAnalysis req)
        {
            return m_uniAETManager.ReadPowerAnalysisData(req);
        }
    }
}