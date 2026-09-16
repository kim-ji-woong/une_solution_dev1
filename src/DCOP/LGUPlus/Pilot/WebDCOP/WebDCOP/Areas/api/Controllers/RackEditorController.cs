using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DCOP.BLL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.BLL.Models.Request.RackEditor;
using DCOP.BLL.Models.Response.RackEditor;
using DCOP.BLL.Models.Response;

namespace WebDCOP.Areas.api.Controllers
{
    [Area("api")]
    public class RackEditorController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public RackEditorController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestDataCenterInfo != null)
                return RequestDataCenterInfo(data.RequestDataCenterInfo);
            else if (data.RequestItem != null)
                return RequestItem(data.RequestItem);
            else if (data.RequestCodeType != null)
                return RequestCodeType(data.RequestCodeType);
            else if (data.RequestRackType != null)
                return RequestRackType(data.RequestRackType);
            else if (data.RequestRackUnit != null)
                return RequestRackUnit(data.RequestRackUnit);
            else if (data.RequestRack != null)
                return RequestRack(data.RequestRack);
            else if (data.RequestRackCoord != null)
                return RequestRackCoord(data.RequestRackCoord);
            else if (data.RequestRackItems != null)
                return RequestRackItems(data.RequestRackItems);
            else if (data.RequestSave != null)
                return RequestSave(data.RequestSave);

            return BadRequest();
        }

        private IActionResult RequestSave(RequestSave data)
        {
            MessageResult response = m_processManager.RackEditorManager.Save(data);
            return Ok(response);
        }

        private IActionResult RequestRackItems(RequestRackItems data)
        {
            ResponseRackItems response = m_processManager.RackEditorManager.GetRackItems(data);
            return Ok(response);
        }

        private IActionResult RequestRackCoord(RequestRackCoord data)
        {
            ResponseRackCoord response = m_processManager.RackEditorManager.GetRackCoord(data);
            return Ok(response);
        }

        private IActionResult RequestRack(RequestRack data)
        {
            ResponseRack response = m_processManager.RackEditorManager.GetRack(data);
            return Ok(response);
        }

        private IActionResult RequestRackUnit(RequestRackUnit data)
        {
            ResponseRackUnit response = m_processManager.RackEditorManager.GetRackUnit(data);
            return Ok(response);
        }

        private IActionResult RequestRackType(RequestRackType data)
        {
            ResponseRackType response = m_processManager.RackEditorManager.GetRackType(data);
            return Ok(response);
        }

        private IActionResult RequestCodeType(RequestCodeType data)
        {
            ResponseCodeType response = m_processManager.RackEditorManager.GetCodeType(data);
            return Ok(response);
        }

        private IActionResult RequestItem(RequestItem data)
        {
            ResponseItem response = m_processManager.RackEditorManager.GetItem(data.Barcode);
            return Ok(response);
        }

        private IActionResult RequestDataCenterInfo(RequestDataCenterInfo data)
        {
            ResponseDataCenterInfo response = m_processManager.RackEditorManager.GetDataCenterInfo(data.Barcode);
            return Ok(response);
        }
    }
}
