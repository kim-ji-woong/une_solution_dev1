package egovframework.base.history.ibll;

import egovframework.base.history.ibll.request.*;
import egovframework.base.history.ibll.response.*;
import egovframework.base.excelreport.models.ResponseExcelInfo;

public interface IProcessManager {

    ResponseSOPHistory getSOPHistories(RequestSOPHistory data);

    ResponseSOPComponentHistory getSOPComponentHistories(RequestSOPComponentHistory data);

    ResponseExcelInfo downloadExcelSOPPartialHistory(RequestExcelSOPPartialHistory data);

    ResponseExcelInfo downloadExcelSOPAllHistory(RequestSOPHistory data);

    ResponseSensorDetectHistory requestSensorDetectHistory(RequestSensorDetectHistory data);

    ResponseSensorAnalysisHistory requestSensorAnalysisHistory(RequestSensorAnalysisHistory data);

    ResponseExcelInfo downloadExcelPartialSensorDetectHistory(RequestExcelPartialDetectHistory data);

    ResponseExcelInfo downloadExcelAllSensorDetectHistory(RequestExcelDetectHistory data);

    ResponseExcelInfo downloadExcelPartialSensorAnalysisHistory(RequestExcelPartialAnalysisHistory data);

    ResponseExcelInfo downloadExcelAllSensorAnalysisHistory(RequestExcelAnalysisHistory data);
}