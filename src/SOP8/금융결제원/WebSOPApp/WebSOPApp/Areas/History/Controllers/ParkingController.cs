using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kftc.BLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Kftc.BLL.Request;
using Kftc.BLL.Response;

namespace WebSOPApp.Areas.History.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("History/[controller]/[action]")]
    [ApiController]
    public class ParkingController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public ParkingController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 출입차량 이력
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParkingHistory), 200)]
        public IActionResult RequestParkingHistory([FromBody] RequestParkingHistory req)
        {
            ResponseParkingHistory res = m_processManager.RequestParkingHistory(req);
            return Ok(res);
        }

        /// <summary>
        /// 출입차량 선택 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(dnsExcelReport.Models.ResponseExcelInfo), 200)]
        public IActionResult RequestExcelPartialParkingHistory([FromBody] RequestExcelPartialParkingHistory req)
        {
            dnsExcelReport.Models.ResponseExcelInfo res = m_processManager.RequestExcelPartialParkingHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }

        /// <summary>
        /// 출입차량 전체 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(dnsExcelReport.Models.ResponseExcelInfo), 200)]
        public IActionResult RequestExcelAllParkingHistory([FromBody] RequestExcelParkingHistory req)
        {
            dnsExcelReport.Models.ResponseExcelInfo res = m_processManager.RequestExceAllParkingHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }
    }
}
