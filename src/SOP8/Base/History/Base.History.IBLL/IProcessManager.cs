using dnsExcelReport.Models;

namespace Base.History.IBLL
{
    using Request;
    using Response;

    public interface IProcessManager
    {
        ResponseSOPHistory GetSOPHistories(RequestSOPHistory data);
        ResponseSOPComponentHistory GetSOPComponentHistories(RequestSOPComponentHistory data);
        ResponseExcelInfo DownloadExcelSOPPartialHistory(RequestExcelSOPPartialHistory data);
        ResponseExcelInfo DownloadExcelSOPAllHistory(RequestSOPHistory data);
        ResponseSensorDetectHistory RequestSensorDetectHistory(RequestSensorDetectHistory data);
        ResponseSensorAnalysisHistory RequestSensorAnalysisHistory(RequestSensorAnalysisHistory data);
        ResponseExcelInfo DownloadExcelPartialSensorDetectHistory(RequestExcelPartialDetectHistory data);
        ResponseExcelInfo DownloadExcelAllSensorDetectHistory(RequestExcelDetectHistory data);
        ResponseExcelInfo DownloadExcelPartialSensorAnalysisHistory(RequestExcelPartialAnalysisHistory data);
        ResponseExcelInfo DownloadExcelAllSensorAnalysisHistory(RequestExcelAnalysisHistory data);
    }
}
