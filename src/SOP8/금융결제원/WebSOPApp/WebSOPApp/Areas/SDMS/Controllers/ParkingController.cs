using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kftc.BLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Microsoft.AspNetCore.Cors;
using Kftc.BLL.Response;
using Kftc.BLL.Request;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("SDMS/SDMS/[action]")]
    [ApiController]
    public class ParkingController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public ParkingController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 출입차량 현황정보
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseCurrentParkingInfo), 200)]
        public IActionResult RequestCurrentParkingInfo()
        {
            ResponseCurrentParkingInfo res = m_processManager.RequestCurrentParkingInfo();
            return Ok(res);
        }

        /// <summary>
        /// 차량 상세 이미지
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParkingImage), 200)]
        public IActionResult RequestComingHistory([FromBody] RequestParkingItem req)
        {
            ResponseParkingImage res = m_processManager.RequestParkingImage(req.ParkingHisNo);
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            // jpg 이미지를 인라인으로 리턴 (브라우저/<img>에서 바로 표시)
            return File(res.Bytes, "image/jpeg");
        }

        /// <summary>
        /// 수동 출차 처리
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParkingInfo), 200)]
        public IActionResult RequestParkingManual([FromBody] RequestParkingItem req)
        {
            ResponseParkingInfo res = m_processManager.RequestParkingManual(req.ParkingHisNo);
            return Ok(res);
        }
    }
}
