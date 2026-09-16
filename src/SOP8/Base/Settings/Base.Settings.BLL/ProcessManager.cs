using Base.Settings.IBLL;
using Base.Settings.IBLL.Request;
using Base.Settings.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;
using dnsExcelReport.Models;

namespace Base.Settings.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseSettingDatas RequestSettingData(RequestSettingDatas data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.RequestSettingData(data);
        }

        public ResponseSettingDatas RequestSettingDataList(RequestSettingDataList data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            return loadManager.RequestSettingDataList(data);
        }

        public MessageResult Save(RequestSave data)
        {
            SaveManager saveManager = new SaveManager(m_dataManager);
            return saveManager.Save(data);
        }

        public MessageResult Initialize(RequestInitialize data)
        {
            SaveManager saveManager = new SaveManager(m_dataManager);
            return saveManager.Initialize(data);
        }

        public ResponseExcelInfo DownloadBuildingGroupData(RequestDownloadBuildingGroupData data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadBuildingGroupData(data);
        }

        public ResponseExcelInfo DownloadBuildingData(RequestDownloadBuildingData data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadBuildingData(data);
        }

        public MessageResult UploadBuildingGroupData(string strFilePath, int? siteNo)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.UploadBuildingGroupData(strFilePath, siteNo);
        }

        public MessageResult UploadBuildingData(string strFilePath, int? siteNo)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.UploadBuildingData(strFilePath, siteNo);
        }
    }
}
