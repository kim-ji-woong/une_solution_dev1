using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kftc.BLL;
using Kftc.BLL.Response;
using Kftc.BLL.Request;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsExcelReport.Models;

namespace WebSOPApp.Areas.History.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("History/[controller]/[action]")]
    [ApiController]
    public class PatrolController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public PatrolController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 순찰일지 이력
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponsePatrolHistory), 200)]
        public IActionResult RequestPatrolHistory([FromBody] RequestPatrolHistory req)
        {
            ResponsePatrolHistory res = m_processManager.RequestPatrolHistory(req);
            return Ok(res);
        }

        /// <summary>
        /// 순찰 코스 리스트
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseCourseList), 200)]
        public IActionResult RequestCourseList()
        {
            ResponseCourseList res = m_processManager.RequestCourseList();
            return Ok(res);
        }

        /// <summary>
        /// 순찰일지 선택 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseExcelInfo), 200)]
        public IActionResult DownloadExcelPartialPatrolHistory([FromBody] RequestExcelPartialPatrolHistory req)
        {
            ResponseExcelInfo res = m_processManager.DownloadExcelPartialPatrolHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }

        /// <summary>
        /// 순찰일지 전체 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseExcelInfo), 200)]
        public IActionResult DownloadExcelAllPatrolHistory([FromBody] RequestExcelPatrolHistory req)
        {
            ResponseExcelInfo res = m_processManager.DownloadExcelAllPatrolHistory(req);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }
    }
}
