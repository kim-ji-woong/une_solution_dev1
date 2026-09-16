using Microsoft.AspNetCore.Mvc;
using dnsCommunicateSopServer;
using System.Collections;
using SDMS.IDAL;

namespace WebSOPApp.Areas.SDMS.Controllers
{
    using Request;
    using Response;

    [Area("SDMS")]
    public class SensorSimulatorController : Controller
    {
        private IDataManager m_dataManager = null;

        public SensorSimulatorController(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        [HttpPost]
        public IActionResult RequestData([FromBody] RequestData data)
        {
            if (data == null)
                return BadRequest();

            if (data.RequestSendSensorAlarm != null)
                return RequestSendSensorAlarm(data.RequestSendSensorAlarm);
            else if (data.RequestClearSensorAlarm != null)
                return RequestClearSensorAlarm(data.RequestClearSensorAlarm);
            else if (data.RequestAlarmList != null)
                return RequestAlarmList();

            return null;
        }

        private IActionResult RequestAlarmList()
        {
            return Ok(ResponseAlarmList.GetAlarmList(m_dataManager));
        }

        private IActionResult RequestSendSensorAlarm(RequestSendSensorAlarm data)
        {
            SopQueryManager mgr = new SopQueryManager();
            string strUrl = Startup.ConfigManager.Site.SOPWebServerURL;

            if (strUrl.EndsWith("/") == false)
                strUrl += "/";

            if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                strUrl += "api/FireSensor";
            else if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Intrusion_S1)
                strUrl += "api/SecuritySensor";
            else if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
                strUrl += "api/PSMSensor";
            else
                strUrl += "api/EtcSensor";


            ArrayList arrData = new ArrayList();

            arrData.Add(data.SensorType);
            arrData.Add(data.SensorTagInfoID);
            arrData.Add(data.SensorZoneID);
            arrData.Add(true);

            if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
            {
                // 기타 센서의 경우 2단계 알람으로 설정
                arrData.Add(2);
            }

            MessageResult result = new MessageResult();

            if (mgr.SendAlarmQuery_TEST(arrData, "POST", strUrl))
                result.Success = true;
            else
            {
                result.Success = false;
                result.Message = "센서신호 전달에 실패하였습니다.";
            }

            return Ok(result);
        }

        private IActionResult RequestClearSensorAlarm(RequestClearSensorAlarm data)
        {
            foreach (int nSensorZoneID in data.SensorZoneIDs)
            {
                SopQueryManager mgr = new SopQueryManager();
                string strUrl = Startup.ConfigManager.Site.SOPWebServerURL;

                if (strUrl.EndsWith("/") == false)
                    strUrl += "/";

                if (data.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                    strUrl += "api/FireSensor";
                else
                    strUrl += "api/EtcSensor";

                ArrayList arrData = new ArrayList();

                arrData.Add(data.SensorType);
                arrData.Add(data.SensorTagInfoID);
                arrData.Add(nSensorZoneID);
                arrData.Add(false);

                if (mgr.SendAlarmQuery_TEST(arrData, "POST", strUrl) == false)
                {
                    return Ok(new MessageResult(false, "센서신호 전달에 실패하였습니다."));
                }
            }

            return Ok(new MessageResult(true, ""));
        }
    }
}
