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
    public class ComingPersonController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public ComingPersonController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 출입문 리스트
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseComingDoors), 200)]
        public IActionResult RequestComingDoors()
        {
            ResponseComingDoors res = m_processManager.RequestComingDoors();
            return Ok(res);
        }

        /// <summary>
        /// 출입자 이력 정보
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseComingPersonHistory), 200)]
        public IActionResult RequestComingHistories([FromBody] RequestComingPersonHistory req)
        {
            ResponseComingPersonHistory res = m_processManager.RequestComingHistories(req);
            return Ok(res);
        }

        /// <summary>
        /// 출입자 선택 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(dnsExcelReport.Models.ResponseExcelInfo), 200)]
        public IActionResult RequestExcelPartialComingHistory([FromBody] RequestExcelPartialComingHistory req)
        {
            dnsExcelReport.Models.ResponseExcelInfo res = m_processManager.RequestExcelPartialComingHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }

        /// <summary>
        /// 출입자 전체 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(dnsExcelReport.Models.ResponseExcelInfo), 200)]
        public IActionResult RequestExcelAllComingHistory([FromBody] RequestExcelComingHistory req)
        {
            dnsExcelReport.Models.ResponseExcelInfo res = m_processManager.RequestExcelAllComingHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }
    }
}
