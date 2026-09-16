using Microsoft.AspNetCore.Mvc;

namespace GGHTService.Controllers
{
    using Managers;
    using Models;

    [Route("[controller]")]
    [ApiController]
    public class SmEmergencyBellController : ControllerBase
    {
        public SmEmergencyBellController()
        {
        }

        [HttpPost]
        [Route("~/api/smEmergencyBell/set")]
        [Consumes("application/x-www-form-urlencoded")]
        public IActionResult Post([FromForm] BellInfoModel model)
        {
            if (model == null)
                return BadRequest();

            WriteLog(model);

            bool isAlarm = true;

            if (model.iphoneSt == "R")
                isAlarm = true;
            else if (model.iphoneSt == "M")
                isAlarm = false;
            else if (model.iphoneSt == "F")
                isAlarm = false;
            else
                return Ok(true);

            SmEmergencyBellManager manager = new SmEmergencyBellManager(model, isAlarm);
            return Ok(true);
        }

        private void WriteLog(BellInfoModel model)
        {
            string strLog = "iphoneNm : " + model.iphoneNm + ", sectnId : " + model.sectnId + ", empNo : " + model.empNo + ", iphoneId : " + model.iphoneId + ", iphoneSt : " + model.iphoneSt;
            Logger.Instance.Write(strLog);
        }
    }
}
