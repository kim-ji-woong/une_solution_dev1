using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace SoulbrainWebAPIServer.Managers
{
    public class AlarmManager
    {
        public bool SendSensorAlarm(int sensorType, int sensorZoneNo, bool isAlarm, string? strSensorValue, string strSOPWebServerUrl, int? nAlarmDepth, DateTime? dtTimeStamp, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;
            
            JObject json = new JObject();

            json.Add("header", Header.SENSOR_DATA);
            json.Add("sensorType", sensorType);
            json.Add("sensorZoneNo", sensorZoneNo);
            json.Add("sensorData", isAlarm ? 1 : 0);

            if (nAlarmDepth.HasValue)
                json.Add("alarmDepth", nAlarmDepth.Value);

            if (strSensorValue != null)
                json.Add("sensorValue", strSensorValue);

            if (dtTimeStamp.HasValue)
                json.Add("timeStamp", dtTimeStamp);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strSOPWebServerUrl));
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

        private bool GetJsonResult(JObject? json, out bool success, out string strErrorMessage)
        {
            success = false;
            strErrorMessage = null;

            JToken? tokenSuccess = json?.GetValue("success");
            JToken? tokenMessage = json?.GetValue("message");

            if (tokenSuccess != null)
            {
                string? strSuccess = tokenSuccess?.Value<string>()?.ToLower();

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
                strErrorMessage = tokenMessage.Value<string>() ?? "";
            else
            {
                strErrorMessage = "api의 실행결과를 읽어오지 못하였습니다.";
                return false;
            }

            return true;
        }
    }
    
    public class Header
    {
        // 탐지신호
        public const int SENSOR_DATA = 100;
        // 탐지신호(테스트)
        public const int SENSOR_DATA_TEST = 101;
        // 오동작처리
        public const int SENSOR_MALFUNCTION = 102;
        // 신호복구
        public const int SENSOR_USER_RESET = 103;
        // 재난신고
        public const int MANUAL_REPORT = 104;
        // 재난신고 해제
        public const int CLEAR_MANUAL_REPORT = 105;
        // 모든 신호 해제
        public const int CLEAR_DETECT_ALL = 109;
        // 하루 경과한 알람 복구
        public const int TIMEOUT = 110;

        // 수동신고를 위한 Zone ID
        // ex) ManualReportDefaultID + CommonCode.SdmsSensor.SensorType
        //     화재 : ManualReportDefaultID + CommonCode.SdmsSensor.SensorType.Fire = 1000000
        //     누출 : ManualReportDefaultID + CommonCode.SdmsSensor.SensorType.PSM  = 1000011
        public const int ManualReportDefaultID = 1000000;
    }
}