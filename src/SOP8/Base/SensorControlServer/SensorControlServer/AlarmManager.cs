using System;
using Newtonsoft.Json.Linq;
using System.IO;

namespace SensorControlServer
{
    public class AlarmManager
    {
        public static bool CheckTimeout(string strSopWebServerUrl, out string strErrorMessage)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
            {
                strErrorMessage = "알람을 전달할 URL이 지정되지 않았습니다.";
                return false;
            }

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/ClearAlarm" : strSopWebServerUrl + "/api/ClearAlarm";
            strUrl += "/CheckTimeout";

            return SendData(strUrl, out strErrorMessage);
        }

        private static bool SendData(string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();
            string strJson = json.ToString();

            // without BOM
            byte[] bytes = new System.Text.UTF8Encoding(false).GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len;

            string strResult = "";

            try
            {
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(bytes, 0, bytes.Length);
                }

                using (System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse())
                {
                    using (Stream respPostStream = wRes.GetResponseStream())
                    {
                        using (StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8))
                        {
                            strResult = readerPost.ReadToEnd().Trim();
                        }
                    }
                }

                strErrorMessage = null;
                return GetResponse(strResult, out strErrorMessage);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private static bool GetResponse(string strResult, out string strErrorMessage)
        {
            bool success;

            if (GetJsonResult(JObject.Parse(strResult), out success, out strErrorMessage) == false)
                return false;

            return success;
        }

        private static bool GetJsonResult(JObject json, out bool success, out string strErrorMessage)
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
