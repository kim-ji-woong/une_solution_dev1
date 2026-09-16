using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kftc.BLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Kftc.BLL.Response;
using Kftc.BLL.Request;
using dnsExcelReport.Models;

namespace WebSOPApp.Areas.Equipment.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("[controller]/[action]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public EquipmentController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        /// <summary>
        /// 하위 장비 목록 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseEquipmentList), 200)]
        public IActionResult RequestEquipmentList(RequestEquipmentList req)
        {
            ResponseEquipmentList res = m_processManager.RequestEquipmentList(req);
            return Ok(res);
        }

        /// <summary>
        /// 장비 타입 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseEquipmentType), 200)]
        public IActionResult RequestEquipmentType()
        {
            ResponseEquipmentType res = m_processManager.RequestEquipmentType();
            return Ok(res);
        }

        /// <summary>
        /// 하위 장비 추가
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseEquipment), 200)]
        public IActionResult RequestInsertEquipment(RequestInsertEquipment req)
        {
            ResponseEquipment res = m_processManager.RequestInsertEquipment(req);
            return Ok(res);
        }

        /// <summary>
        /// 하위 장비 수정
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(Response.MessageResult), 200)]
        public IActionResult RequestUpdateEquipment(RequestEquipment req)
        {
            Response.MessageResult res = m_processManager.RequestUpdateEquipment(req);
            return Ok(res);
        }

        /// <summary>
        /// 하위 장비 삭제
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(Response.MessageResult), 200)]
        public IActionResult RequestDeleteEquipment(RequestDeleteEquipment req)
        {
            Response.MessageResult res = m_processManager.RequestDeleteEquipment(req);
            return Ok(res);
        }

        /// <summary>
        /// 하위 장비 리스트 다운로드
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseExcelInfo), 200)]
        public IActionResult DownloadExcelEquipments()
        {
            ResponseExcelInfo res = m_processManager.DownloadExcelEquipments();
            if (res.Success == false || res.Bytes == null)
                return Ok(res);

            return File(res.Bytes, "application/vnd.ms-excel", res.FileName);
        }

        /// <summary>
        /// 하위 장비에서 상위 장비 리스트 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParentList), 200)]
        public IActionResult RequestParentItemList()
        {
            ResponseParentList res = m_processManager.RequestParentItemList();
            return Ok(res);
        }

        /// <summary>
        /// 상위 장비 목록 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParentEquipList), 200)]
        public IActionResult RequestParentEquipmentList(RequestEquipmentList req)
        {
            ResponseParentEquipList res = m_processManager.RequestParentEquipmentList(req);
            return Ok(res);
        }

        /// <summary>
        /// 상위 장비 TPS실 리스트 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseTpsList), 200)]
        public IActionResult RequestTpsList()
        {
            ResponseTpsList res = m_processManager.RequestTpsList();
            return Ok(res);
        }

        /// <summary>
        /// 상위 장비 추가
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParentEquipment), 200)]
        public IActionResult RequestInsertParentEquipment(RequestInsertParentEquip req)
        {
            ResponseParentEquipment res = m_processManager.RequestInsertParentEquipment(req);
            return Ok(res);
        }

        /// <summary>
        /// 상위 장비 수정
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(Response.MessageResult), 200)]
        public IActionResult RequestUpdateParentEquipment(RequestParentEquipment req)
        {
            Response.MessageResult res = m_processManager.RequestUpdateParentEquipment(req);
            return Ok(res);
        }

        /// <summary>
        /// 상위 장비 삭제
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(Response.MessageResult), 200)]
        public IActionResult RequestDeleteParentEquipment(RequestDeleteParentEquipment req)
        {
            Response.MessageResult res = m_processManager.RequestDeleteParentEquipment(req);
            return Ok(res);
        }




        /// <summary>
        /// TPS실 상위 장비 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseParentEquipList), 200)]
        public IActionResult RequestTpsParentEquipments(RequestTpsParentEquipments req)
        {
            ResponseParentEquipList res = m_processManager.RequestTpsParentEquipments(req);
            return Ok(res);
        }


        /// <summary>
        /// TPS실 상위-하위 장비 조회
        /// </summary>
        /// <returns>
        /// </returns>
        /// <remarks>    
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseTpsEquipment), 200)]
        public IActionResult RequestTpsEquipments(RequestTpsEquipments req)
        {
            ResponseTpsEquipment res = m_processManager.RequestTpsEquipments(req);
            return Ok(res);
        }
    }
}
