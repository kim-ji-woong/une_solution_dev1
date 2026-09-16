using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using DCOP.BLL;
using DCOP.BLL.Models.Request;
using DCOP.BLL.Models.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace WebDCOP.Areas.api.Controllers
{
    [Authorize]
    [Area("api")]
    public class MainController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public MainController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestDataCenterList()
        {
            ResponseDataCenterList response = m_processManager.DataCenterManager.GetDataCenterList();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestCurrentWeather([FromBody] RequestCurrentWeather data)
        {
            ResponseCurrentWeather response = m_processManager.WeatherManager.GetCurrentWeather(data.DataCenterNo);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestRackGroupList([FromBody] RequestRackGroupList data)
        {
            ResponseRackGroupList response = m_processManager.DataCenterManager.GetRackGroupList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestRackItemList([FromBody] RequestRackItemList data)
        {
            ResponseRackItemList response = m_processManager.DataCenterManager.GetRackItemList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestDataCenterRackItemList([FromBody] RequestDataCenterRackItemList data)
        {
            ResponseRackItemList response = m_processManager.DataCenterManager.GetDataCenterRackItemList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestItemData([FromBody] RequestItemData data)
        {
            ResponseItemData response = m_processManager.DataCenterManager.GetItemData(data.ItemNo);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestSensorList([FromBody] RequestSensorList data)
        {
            ResponseSensorList response = m_processManager.DataCenterManager.GetSensorList(data.DataCenterNo);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestRackTypeList([FromBody] RequestRackTypeList data)
        {
            ResponseRackTypeList response = m_processManager.DataCenterManager.GetRackTypeList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestItemTypeList([FromBody] RequestItemTypeList data)
        {
            ResponseItemTypeList response = m_processManager.DataCenterManager.GetItemTypeList(data);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestRackFilterList()
        {
            ResponseRackFilterList response = m_processManager.DataCenterManager.GetRackFilterList();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestItemFilterList()
        {
            ResponseItemFilterList response = m_processManager.DataCenterManager.GetItemFilterList();
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestAlarmList([FromBody] RequestAlarmList data)
        {
            ResponseAlarmList response = m_processManager.AlarmManager.GetAlarmList(data.DataCenterNo);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult Request360CameraUrl([FromBody] Request360CameraUrl data)
        {
            Response360CameraUrl response = m_processManager.DataCenterManager.Get360CameraUrl(data.DataCenterNo);
            return Ok(response);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult RequestFacilityInfo([FromBody] RequestFacilityInfo data)
        {
            ResponseFacilityInfo response = m_processManager.DataCenterManager.GetFacilityInfo(data.FacilityNo);
            return Ok(response);
        }
    }
}
