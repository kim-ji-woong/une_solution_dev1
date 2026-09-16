using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace AlarmWebService.Controllers
{
    using Models;
    using Models.Response;

    [ApiController]
    [Route("api/[controller]")]
    public class AlarmInfoController : ControllerBase
    {
        private IDataManager m_dataManager = null;

        public AlarmInfoController(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        [HttpPost]
        public IActionResult RequestAlarmInfo()
        {
            string strErrorMessage;
            IEnumerable<CurrentAlarm> alarms = m_dataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);

            if (alarms == null)
                return Ok(new ResponseAlarm(false, strErrorMessage));

            string strAlarmTypes = "";

            foreach (CurrentAlarm alarm in alarms)
            {
                if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Fire)
                    AddAlarmType(ref strAlarmTypes, "화재");
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Flooding)
                    AddAlarmType(ref strAlarmTypes, "침수");
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Earthquake)
                {
                    if (alarm.AlarmValue != null && (double)alarm.AlarmValue >= 6)
                        AddAlarmType(ref strAlarmTypes, "지진");
                }
                else if (alarm.AlarmType == (int)CurrentAlarm.AlarmTypes.Terror)
                {
                    if (alarm.Description != null && (alarm.Description == "경계" || alarm.Description == "심각"))
                        AddAlarmType(ref strAlarmTypes, "테러");
                }
            }

            return Ok(new ResponseAlarm(true, "", strAlarmTypes));
        }

        private void AddAlarmType(ref string strAlarmType, string strType)
        {
            if (strAlarmType.Length == 0)
                strAlarmType = strType;
            else
                strAlarmType += "," + strType;
        }
    }
}
