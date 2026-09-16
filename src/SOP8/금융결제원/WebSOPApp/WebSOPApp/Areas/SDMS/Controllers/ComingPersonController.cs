using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kftc.BLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Kftc.BLL.Response;
using Kftc.BLL.Request;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/[controller]/[action]")]
    [ApiController]
    public class ComingPersonController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public ComingPersonController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 출입자 건물내부 현황
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseComingHistory), 200)]
        public IActionResult RequestComingHistory()
        {
            ResponseComingHistory res = m_processManager.RequestComingHistory();
            return Ok(res);
        }



        /// <summary>
        /// 출입자 중요구역 현황
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseAreaComingHistory), 200)]
        public IActionResult RequestAreaComingHistory()
        {
            ResponseAreaComingHistory res = m_processManager.RequestAreaComingHistory();
            return Ok(res);
        }


        /// <summary>
        /// 출입자 이동 동선
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseRouteHistory), 200)]
        public IActionResult RequestRouteHistory([FromBody] RequestRouteHistory req)
        {
            ResponseRouteHistory res = m_processManager.RequestRouteHistory(req.CardNo);
            return Ok(res);
        }

        /// <summary>
        /// 출입자 최신 현황정보
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseLastComingPerson), 200)]
        public IActionResult RequesttLastComingPerson()
        {
            ResponseLastComingPerson res = m_processManager.RequesttLastComingPerson();
            return Ok(res);
        }
    }
}
