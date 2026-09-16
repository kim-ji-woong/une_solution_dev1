using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;
using Response;

namespace Soulbrain.BLL
{
    using Response;
    using Process;
    using Request;

    public class ProcessManager
    {
        private IDataManager m_dataManager = null;

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseWorker GetWorkers()
        {
            WorkerManager workerManager = new WorkerManager(m_dataManager);
            return workerManager.GetWorkers();
        }

        public ResponseExcelInfo DownloadFacilityData(RequestDownloadFacilityData data)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.DownloadFacilityData(data);
        }

        public MessageResult UploadFacilityData(string strFilePath, int? siteNo)
        {
            ExcelManager excelManager = new ExcelManager(m_dataManager);
            return excelManager.UploadFacilityData(strFilePath, siteNo);
        }

        public ResponseAllFacility RequestAllFacility()
        {
            FacilityManager facilityManager = new FacilityManager(m_dataManager);
            return facilityManager.GetAllFacilities();
        }

        public ResponseAllFacility RequestFacilityList(RequestFacilityList data)
        {
            FacilityManager facilityManager = new FacilityManager(m_dataManager);
            return facilityManager.GetFacilities(data);
        }

        public ResponseFacilityData RequestFacilityData(RequestFacilityData data)
        {
            FacilityManager facilityManager = new FacilityManager(m_dataManager);
            return facilityManager.GetFacilityDatas(data);
        }

        public ResponseCurrentWeather RequestCurrentWeather(RequestCurrentWeather data)
        {
            WeatherManager weatherManager = new WeatherManager(m_dataManager);
            return weatherManager.GetCurrentWeather(data);
        }

        public ResponseFacilityModelList GetFacilityModelList()
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetFacilityModelList();
        }

        public ResponseCfdScenarioCase RequestCfdScenarioCase(RequestCfdScenarioCase data)
        {
            CfdManager cfdManager = new CfdManager(m_dataManager);
            return cfdManager.RequestCfdScenarioCase(data);
        }

        public ResponseCfdLocation RequestCfdLocation()
        {
            CfdManager cfdManager = new CfdManager(m_dataManager);
            return cfdManager.RequestCfdLocation();
        }

        public MessageResult SaveFcltyViewport(RequestSaveFcltyViewport data)
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.SaveFcltyViewport(data);
        }

        public ResponseSimulationPoi RequestSimulationPois()
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetSimulationPois();
        }

        public ResponseAllCCTVs RequestAllCCTVs()
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetAllCCTVs();
        }

        public ResponseSensorinfo RequestSensorInfo(RequestSensorInfo data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.RequestSensorInfo(data);
        }

        public ResponseWeeklyStatus RequestWeeklyStatus()
        {
            AlarmManager alarmManager = new AlarmManager(m_dataManager);
            return alarmManager.RequestWeeklyStatus();
        }

        public ResponseScannerInfo RequestScannerInfo(RequestScannerInfo data)
        {
            ScannerManager scannerManager = new ScannerManager(m_dataManager);
            return scannerManager.RequestScannerInfo(data);
        }
        
        public ResponseScannerTagInfo RequestScannerTagInfo(RequestScannerTagInfo data)
        {
            ScannerManager scannerManager = new ScannerManager(m_dataManager);
            return scannerManager.RequestScannerTagInfo(data);
        }

        public ResponseScannerEmergencyInfo RequestScannerEmergencyInfo(RequestScannerEmergencyInfo data)
        {
            ScannerManager scannerManager = new ScannerManager(m_dataManager);
            return scannerManager.RequestScannerEmergencyInfo(data);
        }

        public ResponseAdditableSensors RequestAdditableSensors(RequestAdditableSensors data)
        {
            SensorManager sensorManager = new SensorManager(m_dataManager);
            return sensorManager.GetAdditableSensors(data);
        }

        public ResponseCCTVList RequestCCTVList(RequestCCTVList data)
        {
            CCTVManager cctvManager = new CCTVManager(m_dataManager);
            return cctvManager.GetCCTVList(data);
        }

        public ResponseFacilityHistory GetFacilityHistory(RequestFacilityHistory data)
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetFacilityHistory(data.SensorID);
        }

        public ResponsePowerHistory GetPowerHistory(RequestFacilityHistory data)
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetPowerHistory(data.SensorID);
        }
        
        public ResponseDustMeasurementInfo RequestDustMeasurementInfo()
        {
            DustMeasurementManager dustMeasurementManager = new DustMeasurementManager(m_dataManager);
            return dustMeasurementManager.RequestDustMeasurementInfo();
        }
        
        public ResponseWaterGatherInfo RequestWaterGatherInfo(RequestWaterGatherInfo data)
        {
            WaterGatherManager waterGatherManager = new WaterGatherManager(m_dataManager);
            return waterGatherManager.RequestWaterGatherInfo(data);
        }

        public ResponseFcltyPresvList GetFcltyPresvList()
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetFcltyPresvList();
        }

        public ResponseDustForecastInfo RequestDustForecastInfo(RequestDustForecastInfo data)
        {
            ForecastManager forecastManager = new ForecastManager(m_dataManager);
            return forecastManager.RequestDustForecastInfo(data);
        }
        
        public ResponseWaterGatherForecast RequestWaterGatherForecastInfo(RequestWaterGatherForecastInfo data)
        {
            ForecastManager forecastManager = new ForecastManager(m_dataManager);
            return forecastManager.RequestWaterGatherForecastInfo(data);
        }

        public ResponseFcltyAnalysis GetFcltyAnalysis(RequestFacilityHistory data)
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetFcltyAnalysis(data.SensorID);
        }

        public ResponseFacilityMesureData GetFacilityMesures(RequestFacilityMesures data)
        {
            FacilityModeManager facilityModeManager = new FacilityModeManager(m_dataManager);
            return facilityModeManager.GetFacilityMesureData(data.PresvNo);
        }
    }
}
