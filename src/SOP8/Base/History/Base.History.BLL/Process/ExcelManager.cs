using System;
using System.Collections;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Writer;
using dnsExcelReport.Models;

namespace Base.History.BLL.Process
{
    using Excel.Writer;

    class ExcelManager
    {
        public enum Mode { None, SOPHistory, SensorDetectHistory, SensorAnalysisHistory };

        private IDataManager m_dataManager = null;

        public ExcelManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseExcelInfo DownloadExcelSOPPartialHistory(RequestExcelSOPPartialHistory data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            ResponseSOPHistory sopHistory = loadManager.GetSOPHistories(data);

            if (sopHistory.Success == false)
                return new ResponseExcelInfo(false, sopHistory.Message);

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(data);
            arrDatas.Add(sopHistory.SOPHistoryDatas);

            return DownloadExcel(Mode.SOPHistory, arrDatas);
        }

        public ResponseExcelInfo DownloadExcelSOPAllHistory(RequestSOPHistory data)
        {
            LoadManager loadManager = new LoadManager(m_dataManager);
            ResponseSOPHistory sopHistory = loadManager.GetSOPHistories(data);

            if (sopHistory.Success == false)
                return new ResponseExcelInfo(false, sopHistory.Message);

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(data);
            arrDatas.Add(sopHistory.SOPHistoryDatas);

            return DownloadExcel(Mode.SOPHistory, arrDatas);
        }

        public ResponseExcelInfo DownloadExcelPartialSensorDetectHistory(RequestExcelPartialDetectHistory data)
        {
            return DownloadExcel(Mode.SensorDetectHistory, data);
        }

        public ResponseExcelInfo DownloadExcelAllSensorDetectHistory(RequestExcelDetectHistory data)
        {
            RequestSensorDetectHistory request = data.ToRequestSensorDetectHistory();
            //RequestSensorDetectHistory request = ToRequestSensorDetectHistory(data);

            SensorDetectManager manager = new SensorDetectManager(m_dataManager);
            var response = manager.GetSensorDetectHistory(request);

            if (response.Success)
            {
                RequestExcelPartialDetectHistory _data = new RequestExcelPartialDetectHistory(data);
                _data.Histories = response.Histories;
                return DownloadExcel(Mode.SensorDetectHistory, _data);
            }

            ResponseExcelInfo _response = new ResponseExcelInfo(false, response.Message);
            return _response;
        }

        public ResponseExcelInfo DownloadExcelPartialSensorAnalysisHistory(RequestExcelPartialAnalysisHistory data)
        {
            return DownloadExcel(Mode.SensorAnalysisHistory, data);
        }

        public ResponseExcelInfo DownloadExcelAllSensorAnalysisHistory(RequestExcelAnalysisHistory data)
        {
            RequestSensorAnalysisHistory request = data.ToRequestSensorAnalysisHistory();
            //RequestSensorAnalysisHistory request = ToRequestSensorAnalysisHistory(data);

            SensorAnalysisManager manager = new SensorAnalysisManager(m_dataManager);
            var response = manager.GetSensorAnalysisHistory(request);

            if (response.Success)
            {
                RequestExcelPartialAnalysisHistory _data = new RequestExcelPartialAnalysisHistory(data);
                _data.Histories = response.Histories;
                return DownloadExcel(Mode.SensorAnalysisHistory, _data);
            }

            ResponseExcelInfo _response = new ResponseExcelInfo(false, response.Message);
            return _response;
        }

        /*private RequestSensorAnalysisHistory ToRequestSensorAnalysisHistory(RequestExcelAnalysisHistory data)
        {
            RequestSensorAnalysisHistory request = new RequestSensorAnalysisHistory();

            request.BeginYear = data.BeginYear;
            request.BeginMonth = data.BeginMonth;
            request.BeginDay = data.BeginDay;
            request.EndYear = data.EndYear;
            request.EndMonth = data.EndMonth;
            request.EndDay = data.EndDay;
            request.BuildingGroupNo = data.BuildingGroupNo;
            request.BuildingNo = data.BuildingNo;
            request.ZoneNo = data.ZoneNo;
            request.SensorNo = data.SensorNo;
            request.SensorType = data.SensorType;
            request.SensorSubTypes = data.SensorSubTypes;
            request.SiteNo = data.SiteNo;
            request.SensorTypeDatas = data.SensorTypeDatas;
            request.UseSensorTypeName = data.UseSensorTypeName;
            request.UseSensorName = data.UseSensorName;
            request.UseLocationName = data.UseLocationName;
            request.UseDetectCount = data.UseDetectCount;
            request.UseMalfunctionCount = data.UseMalfunctionCount;
            request.UseSensorClearCount = data.UseSensorClearCount;
            request.UseUserResetCount = data.UseUserResetCount;
            request.UseMalfunctionRatio = data.UseMalfunctionRatio;

            return request;
        }*/

        /*private RequestSensorDetectHistory ToRequestSensorDetectHistory(RequestExcelDetectHistory data)
        {
            RequestSensorDetectHistory request = new RequestSensorDetectHistory();

            request.BeginYear = data.BeginYear;
            request.BeginMonth = data.BeginMonth;
            request.BeginDay = data.BeginDay;
            request.EndYear = data.EndYear;
            request.EndMonth = data.EndMonth;
            request.EndDay = data.EndDay;
            request.BuildingGroupNo = data.BuildingGroupNo;
            request.BuildingNo = data.BuildingNo;
            request.ZoneNo = data.ZoneNo;
            request.SensorNo = data.SensorNo;
            request.SensorType = data.SensorType;
            request.SensorSubTypes = data.SensorSubTypes;
            request.SiteNo = data.SiteNo;
            request.SensorTypeDatas = data.SensorTypeDatas;
            request.UseSensorTypeName = data.UseSensorTypeName;
            request.UseSensorName = data.UseSensorName;
            request.UseLocationName = data.UseLocationName;
            request.UseDetectStatus = data.UseDetectStatus;
            request.UseClearType = data.UseClearType;
            request.UseAlarmDepthName = data.UseAlarmDepthName;
            request.UseSopName = data.UseSopName;
            request.UseMemo = data.UseMemo;

            return request;
        }*/

        private ResponseExcelInfo DownloadExcel(Mode mode, object parameter = null)
        {
            ExcelWriter excelWriter = MakeInstance(mode, m_dataManager, parameter);
            ResponseExcelInfo response = null;

            if (excelWriter != null)
            {
                string strErrorMessage;
                byte[] bytes = excelWriter.Run(out strErrorMessage);

                if (bytes != null)
                {
                    response = new ResponseExcelInfo(true, "");
                    response.Bytes = bytes;
                    response.FileName = excelWriter.GetFileName();
                }
                else
                {
                    response = new ResponseExcelInfo(false, strErrorMessage);
                }
            }
            else
                response = new ResponseExcelInfo(false, "엑셀 보고서를 작성할 수 없습니다.");

            return response;
        }

        private static ExcelWriter MakeInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.SOPHistory)
            {
                if (parameter != null && parameter is ArrayList)
                    return new SOPHistoryWriter(dataManager, (ArrayList)parameter);
            }
            else if (mode == Mode.SensorDetectHistory)
            {
                if (parameter != null && parameter is RequestExcelPartialDetectHistory)
                    return new SensorDetectHistoryWriter(dataManager, (RequestExcelPartialDetectHistory)parameter);
            }
            else if (mode == Mode.SensorAnalysisHistory)
            {
                if (parameter != null && parameter is RequestExcelPartialAnalysisHistory)
                    return new SensorAnalysisHistoryWriter(dataManager, (RequestExcelPartialAnalysisHistory)parameter);
            }

            return null;
        }
    }
}
