using System;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Base.SDMS.BLL.Process
{
    class WebServiceManager
    {
        public static bool SendJsonData(JObject json, string strUrl, out string strErrorMessage)
        {
            return SendJsonData(json, strUrl, null, out strErrorMessage);
        }

        public static bool SendJsonData(JObject json, string strUrl, Dictionary<string, string> dicResults, out string strErrorMessage)
        {
            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len;

            string strResult = "";

            try
            {
                // StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                // writer.Write(strJson);
                // writer.Close();
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(bytes, 0, bytes.Length);
                }

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                return GetResponse(strResult, dicResults, out strErrorMessage);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private static bool GetResponse(string strResult, Dictionary<string, string> dicResults, out string strErrorMessage)
        {
            bool success;

            if (GetJsonResult(JObject.Parse(strResult), dicResults, out success, out strErrorMessage) == false)
                return false;

            return success;
        }

        private static bool GetJsonResult(JObject json, Dictionary<string, string> dicResults, out bool success, out string strErrorMessage)
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

            if (dicResults != null)
            {
                List<string> keys = new List<string>();
                keys.AddRange(dicResults.Keys);

                foreach (string strKey in keys)
                {
                    JToken token = json.GetValue(strKey);

                    if (token != null)
                        dicResults[strKey] = token.Value<string>();
                }
            }

            return true;
        }
    }
}
