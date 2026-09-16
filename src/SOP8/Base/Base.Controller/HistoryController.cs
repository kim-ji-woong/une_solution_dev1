using Microsoft.AspNetCore.Mvc;
using Base.History.IBLL;
using Base.History.IBLL.Request;
using Base.History.IBLL.Response;
using dnsExcelReport.Models;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public HistoryController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult RequestSOPHistory([FromBody] RequestSOPHistory data)
        {
            ResponseSOPHistory response = m_processManager.GetSOPHistories(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestSOPComponentHistory([FromBody] RequestSOPComponentHistory data)
        {
            ResponseSOPComponentHistory response = m_processManager.GetSOPComponentHistories(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DownloadPartialSOPHistory([FromBody] RequestExcelSOPPartialHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelSOPPartialHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult DownloadAllSOPHistory([FromBody] RequestSOPHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelSOPAllHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult RequestSensorDetectHistory([FromBody] RequestSensorDetectHistory data)
        {
            ResponseSensorDetectHistory response = m_processManager.RequestSensorDetectHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestSensorAnalysisHistory([FromBody] RequestSensorAnalysisHistory data)
        {
            ResponseSensorAnalysisHistory response = m_processManager.RequestSensorAnalysisHistory(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DownloadPartialSensorDetectHistory([FromBody] RequestExcelPartialDetectHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelPartialSensorDetectHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult DownloadAllSensorDetectHistory([FromBody] RequestExcelDetectHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelAllSensorDetectHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult DownloadPartialSensorAnalysisHistory([FromBody] RequestExcelPartialAnalysisHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelPartialSensorAnalysisHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult DownloadAllSensorAnalysisHistory([FromBody] RequestExcelAnalysisHistory data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelAllSensorAnalysisHistory(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }
    }
}
