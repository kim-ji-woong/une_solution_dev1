using System;
using System.IO;
using Response;
using Newtonsoft.Json.Linq;
using SOPWebServer.IBLL.Models.Request;

namespace dnsSensorServer
{
    class AlarmManager
    {
        public MessageResult SendSensorAlarm(int sensorZoneNo, int sensorType, bool isAlarm, string strSensorValue, int? nAlarmDepth, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.");

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/Sensor" : strSopWebServerUrl + "/api/Sensor";
            strUrl += "/RequestSensorSignal";

            string strErrorMessage;

            if (SendSensorAlarm(sensorType, sensorZoneNo, isAlarm, strSensorValue, strUrl, nAlarmDepth, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public MessageResult ClearAllAlarm(int? sensorType, int? sensorSubType, int? siteNo, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new MessageResult(false, "알람을 전달할 URL이 지정되지 않았습니다.");

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAll" : strSopWebServerUrl + "/api/ClearAll";

            string strErrorMessage;

            if (SendClearAll(sensorType, sensorSubType, siteNo, strUrl, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        private bool SendClearAll(int? sensorType, int? sensorSubType, int? siteNo, string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("sensorType", sensorType);
            json.Add("sensorSubType", sensorSubType);
            json.Add("siteNo", siteNo);

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

        private bool SendSensorAlarm(int sensorType, int sensorZoneNo, bool isAlarm, string strSensorValue, string strUrl, int? nAlarmDepth, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("header", Header.SENSOR_DATA);
            json.Add("sensorType", sensorType);
            json.Add("sensorZoneNo", sensorZoneNo);
            json.Add("sensorData", isAlarm ? 1 : 0);

            if (nAlarmDepth.HasValue)
                json.Add("alarmDepth", nAlarmDepth.Value);

            if (strSensorValue != null)
                json.Add("sensorValue", strSensorValue);

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
