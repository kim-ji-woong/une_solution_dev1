using System;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Drawing;

namespace UnEcctv
{
    using Data;

    class WebServiceManager
    {
        private string m_strUrl = "";

        public WebServiceManager(string strUrl)
        {
            if (strUrl != null)
            {
                string strBaseUrl = strUrl;

                if (strBaseUrl.EndsWith("/"))
                    m_strUrl = strBaseUrl + ConfigurationManager.AppSettings.Get("apiUrl");
                else
                    m_strUrl = strBaseUrl + "/" + ConfigurationManager.AppSettings.Get("apiUrl");
            }
            else
                m_strUrl = ConfigurationManager.AppSettings.Get("apiUrl");
        }

        public Dictionary<int, CCTVData> ReadCCTVs(List<int> cctvNos)
        {
            if (cctvNos.Count == 0)
                return new Dictionary<int, CCTVData>();

            JArray arrNos = new JArray();

            foreach (int no in cctvNos)
            {
                arrNos.Add(no);
            }

            JObject json = new JObject();
            json.Add("cctvNos", arrNos);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strUrl));
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

                if (strResult == null)
                    return null;

                JObject jsonResult = JObject.Parse(strResult);

                if (jsonResult == null)
                    return null;

                List<CCTVData> cctvs = new List<CCTVData>();
                JArray arr = (JArray)jsonResult["cctvs"];

                foreach (JToken token in arr)
                {
                    cctvs.Add(ToCCTVData(token));
                }

                Dictionary<int, CCTVData> dicCCTVDatas = new Dictionary<int, CCTVData>();

                foreach (CCTVData cctv in cctvs)
                {
                    dicCCTVDatas[cctv.No] = cctv;
                }

                return dicCCTVDatas;
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine("ReadCCTVs Error : " + ex.Message);
            }

            return null;
        }

        private CCTVData ToCCTVData(JToken token)
        {
            int no = (int)token["cctv_no"];
            string strCameraName = (string)token["cameraName"];
            string strUrl = (string)token["url"];

            CCTVData cctv = new CCTVData();

            cctv.No = no;
            cctv.Title = strCameraName;
            cctv.Url = strUrl;

            return cctv;
        }

        public CCTVStatus RunCommand(string strCommand, List<CCTVData> cctvDatas, out Point? ptLocation)
        {
            ptLocation = null;

            if (strCommand == null)
                return null;

            strCommand = strCommand.Trim();

            if (strCommand.Length == 0)
                return null;

            List<int> cctvNos = new List<int>();
            string[] tokens = strCommand.Split('/');
            int len = tokens.Length;

            if (len < 5)
                return null;

            CCTVStatus status = new CCTVStatus();

            status.Guid = tokens[0].Trim();

            int userNo, sensorZoneHistoryNo;

            if (int.TryParse(tokens[1].Trim(), out userNo))
                status.UserNo = userNo;
            else
                return null;

            int markNo;
            int? mark = null;

            if (int.TryParse(tokens[2].Trim(), out markNo))
                mark = markNo;

            status.Title = tokens[3].Trim();

            if (int.TryParse(tokens[4].Trim(), out sensorZoneHistoryNo))
                status.SensorZoneHistoryNo = sensorZoneHistoryNo;
            else
                status.SensorZoneHistoryNo = null;

            string strLocation = tokens[5].Trim();
            int index = strLocation.IndexOf(',');

            if (index > 0)
            {
                string strX = strLocation.Substring(0, index).Trim();
                string strY = strLocation.Substring(index + 1).Trim();

                int x, y;

                if (int.TryParse(strX, out x) && int.TryParse(strY, out y))
                {
                    ptLocation = new Point(x, y);
                }
            }

            for (int i = 6; i < len; i++)
            {
                string strToken = tokens[i].Trim();
                int cctvNo;

                if (int.TryParse(strToken, out cctvNo))
                {
                    cctvNos.Add(cctvNo);
                    SetCCTV(status, cctvNo, cctvNos.Count);
                }
            }

            if (cctvNos.Count > 0)
            {
                Dictionary<int, CCTVData> dicCCTVDatas = ReadCCTVs(cctvNos);

                if (dicCCTVDatas == null)
                    return null;

                foreach (KeyValuePair<int, CCTVData> pair in dicCCTVDatas)
                {
                    cctvDatas.Add(pair.Value);
                }

                status.MarkNo = mark;
                status.Visible = ptLocation != null;
                return status;
            }

            return null;
        }

        private void SetCCTV(CCTVStatus status, int cctvID, int index)
        {
            if (index == 1)
                status.CCTV1 = cctvID;
            else if (index == 2)
                status.CCTV2 = cctvID;
            else if (index == 3)
                status.CCTV3 = cctvID;
            else if (index == 4)
                status.CCTV4 = cctvID;
        }
    }
}
