using Response;
using Base.SDMS.IBLL.Request;
using Newtonsoft.Json.Linq;
using Base.SDMS.IBLL.Models;

namespace Base.SDMS.BLL.Process
{
    class SopManager
    {
        public static MessageResult BeginAlarmSop(RequestBeginSop data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/Sop" : strSopWebServerUrl + "/api/Sop";

            string strErrorMessage;

            if (SendBeginAlarmSop(data.SensorZoneHistoryNo, data.UserNo, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        private static bool SendBeginAlarmSop(int sensorZoneHistoryNo, int userNo, string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();
            json.Add("sensorZoneHistoryNo", sensorZoneHistoryNo);
            json.Add("userNo", userNo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }
    }
}
