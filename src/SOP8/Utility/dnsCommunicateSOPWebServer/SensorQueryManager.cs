using SOPWebServer.BLL.Models.Request;
using SOPWebServer.BLL.Models.Response;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.IO;
using Response;

namespace dnsCommunicateSOPWebServer
{
    public class SensorQueryManager
    {
        private string m_strRequestURL = "";
        public SensorQueryManager(string requestURL = "")
        {
            m_strRequestURL = requestURL;
        }

        // 센서신호를 통한 알람탐지 / 알람복구
        public ResponseSensorSignal SendSensorSignal(SensorSignal signal, string strURL = "")
        {
            JObject json = new JObject();

            json.Add("Header", signal.Header);
            json.Add("SensorType", signal.SensorType);
            json.Add("SensorZoneNo", signal.SensorZoneNo);
            json.Add("SensorData", signal.SensorData);
            json.Add("UserNo", signal.UserNo);
            json.Add("AlarmDepth", signal.AlarmDepth);
            json.Add("TimeStamp", signal.TimeStamp);
            json.Add("SensorValue", signal.SensorValue);
            json.Add("Memo", signal.Memo);

            string strErrorMessage;

            return SendQuery(json.ToString(), strURL, out strErrorMessage);
        }

        // 전체복구
        public MessageResult SendClearAll(ClearAll signal, string strURL = "")
        {
            JObject json = new JObject();

            json.Add("SensorType", signal.SensorType);
            json.Add("SensorSubType", signal.SensorSubType);
            json.Add("TimeStamp", signal.TimeStamp);
            json.Add("SiteNo", signal.SiteNo);
            json.Add("UserNo", signal.UserNo);

            string strErrorMessage;

            return SendQuery(json.ToString(), strURL, out strErrorMessage);
        }

        // 수동신고
        public MessageResult SendManualReport(ManualReport signal, string strURL = "")
        {
            JObject json = new JObject();

            json.Add("SensorType", signal.SensorType);
            json.Add("SensorSubType", signal.SensorSubType);
            json.Add("ZoneNo", signal.ZoneNo);
            json.Add("AlarmDepth", signal.AlarmDepth);
            json.Add("TimeStamp", signal.TimeStamp);
            json.Add("ReportPerson", signal.ReportPerson);
            json.Add("Memo", signal.Memo);
            json.Add("UserNo", signal.UserNo);

            string strErrorMessage;

            return SendQuery(json.ToString(), strURL, out strErrorMessage);
        }

        // 1. 알람 복구(수동신고 포함)
        // 2. 탐지된 알람을 실제상황으로 승격한다.(재난신고)
        public ResponseSensorSignal SendManualReport2(ManualReport2 signal, string strURL = "")
        {
            JObject json = new JObject();

            json.Add("SensorZoneHistoryNo", signal.SensorZoneHistoryNo);
            json.Add("UserNo", signal.UserNo);
            json.Add("ReportType", signal.ReportType);
            json.Add("TimeStamp", signal.TimeStamp);

            string strErrorMessage;

            return SendQuery(json.ToString(), strURL, out strErrorMessage);
        }

        // 시스템을 통한 사용자 복구, 타임아웃등을 처리
        // 특정 SensorZone을 대상으로 하지 않고, SensorZoneHistory를 사용하여 알람 복구
        public ResponseSensorSignal SendClearAlarm(ClearAlarm signal, string strURL = "")
        {
            JObject json = new JObject();

            json.Add("Header", signal.Header);
            json.Add("SensorZoneHistoryNo", signal.SensorZoneHistoryNo);
            json.Add("UserNo", signal.UserNo);
            json.Add("Memo", signal.Memo);
            json.Add("TimeStamp", signal.TimeStamp);

            string strErrorMessage;

            return SendQuery(json.ToString(), strURL, out strErrorMessage);
        }

        private ResponseSensorSignal SendQuery(string strBody, string strURL, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strURL == "" && m_strRequestURL.Length == 0)
                return new ResponseSensorSignal(false, "요청 URL을 확인하세요.");

            HttpWebRequest request = null;
            if (strURL.Length > 0)
            {
                request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
            }
            else
            {
                request = (HttpWebRequest)WebRequest.Create(new Uri(m_strRequestURL));
            }

            request.Method = "POST";
            request.ContentType = "application/json;";
            string strResponse = "";

            try
            {
                if (strBody != null && strBody != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBody);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (strResponse == null)
                    return new ResponseSensorSignal(false, "알수없는 Error입니다.");

                ResponseSensorSignal response = JsonConvert.DeserializeObject<ResponseSensorSignal>(strResponse);
                return response;
            }
            catch (WebException ex)
            {
                return new ResponseSensorSignal(false, ex.Status.ToString());
            }
        }
    }
}
