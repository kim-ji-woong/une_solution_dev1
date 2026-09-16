using Base.History.IBLL;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;

namespace Base.History.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;
        private SOPManager.IBLL.IProcessManager m_sopProcessManager = null;
        private SOPSimulator.IBLL.IProcessManager m_sopSimulatorProcessManager = null;

        public ProcessManager(IDataManager dataManager, SOPManager.IBLL.IProcessManager sopPropcessManager, SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager)
        {
            m_dataManager = dataManager;
            m_sopProcessManager = sopPropcessManager;
            m_sopSimulatorProcessManager = sopSimulatorProcessManager;
        }

        public ResponseSOPHistory GetSOPHistories(RequestSOPHistory data)
        {
            LoadManager manager = new LoadManager(m_dataManager);
            return manager.GetSOPHistories(data);
        }

        public ResponseSOPComponentHistory GetSOPComponentHistories(RequestSOPComponentHistory data)
        {
            LoadManager manager = new LoadManager(m_dataManager);
            return manager.GetSOPComponentHistories(data, m_sopProcessManager, m_sopSimulatorProcessManager);
        }

        public ResponseExcelInfo DownloadExcelSOPPartialHistory(RequestExcelSOPPartialHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelSOPPartialHistory(data);
        }

        public ResponseExcelInfo DownloadExcelSOPAllHistory(RequestSOPHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelSOPAllHistory(data);
        }

        public ResponseSensorDetectHistory RequestSensorDetectHistory(RequestSensorDetectHistory data)
        {
            SensorDetectManager manager = new SensorDetectManager(m_dataManager);
            return manager.GetSensorDetectHistory(data);
        }

        public ResponseSensorAnalysisHistory RequestSensorAnalysisHistory(RequestSensorAnalysisHistory data)
        {
            SensorAnalysisManager manager = new SensorAnalysisManager(m_dataManager);
            return manager.GetSensorAnalysisHistory(data);
        }

        public ResponseExcelInfo DownloadExcelPartialSensorDetectHistory(RequestExcelPartialDetectHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelPartialSensorDetectHistory(data);
        }

        public ResponseExcelInfo DownloadExcelAllSensorDetectHistory(RequestExcelDetectHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelAllSensorDetectHistory(data);
        }

        public ResponseExcelInfo DownloadExcelPartialSensorAnalysisHistory(RequestExcelPartialAnalysisHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelPartialSensorAnalysisHistory(data);
        }

        public ResponseExcelInfo DownloadExcelAllSensorAnalysisHistory(RequestExcelAnalysisHistory data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadExcelAllSensorAnalysisHistory(data);
        }
    }
}
