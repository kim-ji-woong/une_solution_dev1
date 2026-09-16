using System;
using Response;
using Newtonsoft.Json.Linq;
using SOPWebServer.IBLL.Models.Request;
using System.IO;
using Base.SDMS.IBLL.Models;
using Base.AlarmService.IBLL.Models;

namespace Base.AlarmService.BLL.Process
{
    class AlarmManager
    {
        public MessageResult SendSensorSignal(RequestSendSensorAlarm data, bool isAlarm, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.");

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/Sensor" : strSopWebServerUrl + "/api/Sensor";
            strUrl += "/RequestSensorSignal";

            string strErrorMessage;

            if (SendSensorSignal(data.SensorType, data.SensorZoneNo, isAlarm ? 1 : 0, data.AlarmDepth, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public MessageResult ClearAlarm(IBLL.Models.ClearAlarm data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAlarm" : strSopWebServerUrl + "/api/ClearAlarm";

            string strErrorMessage;

            if (SendClearAlarm(data.SensorZoneHistoryNo, data.IsMalfunction, data.UserNo, data.Memo, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        public MessageResult ClearAllAlarm(ClearAllAlarm data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAll" : strSopWebServerUrl + "/api/ClearAll";

            string strErrorMessage;

            if (SendClearAll(data.UserNo, data.SiteNo, data.SensorType, data.SensorSubType, data.TimeStamp, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return new MessageResult(true, "");
        }

        private bool SendClearAll(int userNo, int? siteNo, int? sensorType, int? sensorSubType, DateTime? timeStamp, string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("sensorType", sensorType);
            json.Add("sensorSubType", sensorSubType);
            json.Add("timeStamp", timeStamp);
            json.Add("userNo", userNo);
            json.Add("siteNo", siteNo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }

        private bool SendClearAlarm(int nSensorZoneHistoryNo, bool isMalfunction, int userNo, string strMemo, string strUrl, out string strErrorMessage)
        {
            JObject json = new JObject();

            int header = isMalfunction ? Header.SENSOR_MALFUNCTION : Header.SENSOR_USER_RESET;

            json.Add("header", header);
            json.Add("sensorZoneHistoryNo", nSensorZoneHistoryNo);
            json.Add("userNo", userNo);
            json.Add("memo", strMemo);

            return WebServiceManager.SendJsonData(json, strUrl, out strErrorMessage);
        }

        private bool SendSensorSignal(int sensorType, int sensorZoneNo, int sensorData, int? alarmDepth, string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("header", Header.SENSOR_DATA_TEST);
            json.Add("sensorType", sensorType);
            json.Add("sensorZoneNo", sensorZoneNo);
            json.Add("sensorData", sensorData);

            if (alarmDepth != null)
                json.Add("alarmDepth", (int)alarmDepth);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                return GetResponse(strResult, out strErrorMessage);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private bool GetResponse(string strResult, out string strErrorMessage)
        {
            bool success;

            if (GetJsonResult(JObject.Parse(strResult), out success, out strErrorMessage) == false)
                return false;

            return success;
        }

        private bool GetJsonResult(JObject json, out bool success, out string strErrorMessage)
        {
            success = false;
            strErrorMessage = null;

            JToken tokenSuccess = json.GetValue("success");
            JToken tokenMessage = json.GetValue("message");

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                {
                    success = true;
                }
            }
            else
            {
                strErrorMessage = "api가 제대로 실행되지 못하였습니다.";
                return false;
            }

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();
            else
            {
                strErrorMessage = "api의 실행결과를 읽어오지 못하였습니다.";
                return false;
            }

            return true;
        }
    }
}
