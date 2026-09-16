using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Configuration;
using dnsPipeHelper;
using dnsData.CommonCode;

namespace SoulbrainWeather.Process
{
    using Datas;

    class WeatherStateManager
    {
        private List<CityData> m_cities = null;
        private Logger m_logger = null;

        public WeatherStateManager(Logger logger)
        {
            m_logger = logger;
            m_cities = ReadConfig();
        }

        public int? ReadData()
        {
            Dictionary<CityData, int?> dicCityStates = new Dictionary<CityData, int?>();
            int nCityCount = m_cities.Count;

            for (int i = 0; i < nCityCount; i++)
            {
                dicCityStates[m_cities[i]] = null;
            }

            for (int i = 0; i < nCityCount; i++)
            {
                ReadData(dicCityStates, i, nCityCount);
            }

            foreach (KeyValuePair<CityData, int?> pair in dicCityStates)
            {
                if (pair.Value != null)
                    return pair.Value;
            }

            return null;
        }

        private bool ReadData(Dictionary<CityData, int?> dicCityStates, int nIndex, int nCityCount)
        {
            CityData data = m_cities[nIndex];
            bool success = true;

            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(data.URL);
                request.Method = "GET";
                request.Timeout = 10 * 1000; // 10초

                string strResponse = "";

                using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
                {
                    HttpStatusCode status = resp.StatusCode;

                    if (status != HttpStatusCode.OK)
                    {
                        System.Diagnostics.Trace.WriteLine("URL 실패 : " + data.URL);
                        m_logger.Write("URL 실패 : " + data.URL);
                        return false;
                    }

                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        strResponse = sr.ReadToEnd();
                    }
                }

                int nState;

                for (int i = nIndex; i < nCityCount; i++)
                {
                    CityData city = m_cities[i];

                    if (dicCityStates[city] == null && city.URL == data.URL)
                    {
                        if (ParseData(strResponse, city.Source, out nState))
                        {
                            dicCityStates[city] = nState;
                        }
                        else
                        {
                            System.Diagnostics.Trace.WriteLine("ReadFail : " + city.Target);
                            m_logger.Write("[ERROR] ReadFail : " + city.Target);
                            success = false;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("ReadData Error : " + e.Message);
                m_logger.Write("[ERROR] bool ReadData(Dictionary<CityData, int?> dicCityStates, int nIndex, int nCityCount) " + e.Message);
                success = false;
            }

            return success;
        }

        // 각 도시별 기상정보를 얻어온다.
        private bool ParseData(string strHTML, string strCity, out int state)
        {
            state = 0;

            int nStateIndex;

            // 헤더 index 값 찾기
            if (GetHeadIndex(strHTML, out nStateIndex) == false)
                return false;

            string strTag = strCity + "</a></td>";
            int nIndex = strHTML.IndexOf(strTag);

            if (nIndex < 0)
            {
                strTag = strCity + "</a></th>";
                nIndex = strHTML.IndexOf(strTag);

                if (nIndex < 0)
                    return false;
            }

            nIndex += strTag.Length;

            for (int i = 0; i < 12; i++)
            {
                string strValue = GetValue(strHTML, ref nIndex);

                if (strValue == null)
                    return false;

                if (nStateIndex != -1 && i == nStateIndex)
                {
                    if (ReadWeatherState(strValue, ref state) == false)
                        return false;
                }
            }

            return true;
        }

        private bool ReadWeatherState(string strValue, ref int state)
        {
            if (strValue.Contains("맑음"))
                state = Weather.Status.Sunshine;
            else if (strValue.Contains("천둥"))
                state = Weather.Status.Thunder;
            else if (strValue.Contains("진눈깨비"))
                state = Weather.Status.SnowRain;
            else if (strValue.Contains("강한 눈") || strValue.Contains("강한눈"))
                state = Weather.Status.HeavySnow;
            else if (strValue.Contains("눈"))
                state = Weather.Status.Snow;
            else if (strValue.Contains("강한 비") || strValue.Contains("강한비"))
                state = Weather.Status.HeavyRain;
            else if (strValue.Contains("비") || strValue.Contains("소나기"))
                state = Weather.Status.Rain;
            else if (strValue.Contains("흐림") || strValue.Contains("구름많음") || strValue.Contains("구름 많음") || strValue.Contains("안개") || strValue.Contains("박무") || strValue.Contains("연무"))
                state = Weather.Status.Cloudy;
            else if (strValue.Length == 0 || strValue.Contains("구름조금") || strValue.Contains("구름 조금"))
                state = Weather.Status.Cloud;
            else if (strValue.Contains("황사"))
                state = Weather.Status.DustStorm;
            else if (strValue.Contains("미세먼지"))
                state = Weather.Status.FineDust;
            else
                state = Weather.Status.Unknown;

            return true;
        }

        private string GetValue(string strHTML, ref int nIndex)
        {
            int nIndex1 = strHTML.IndexOf("<td>", nIndex);
            int nIndex2 = strHTML.IndexOf("</td>", nIndex);

            if (nIndex1 < 0 || nIndex2 < nIndex1)
                return null;

            nIndex = nIndex2 + 5;
            string strValue = strHTML.Substring(nIndex1 + 4, nIndex2 - nIndex1 - 4).Trim();
            return strValue;
        }

        private bool GetHeadIndex(string strHTML, out int nStateIdx)
        {
            nStateIdx = -1;

            // 헤더 찾기
            string strTag = "<thead>";
            int nIndex = strHTML.IndexOf(strTag);

            if (nIndex < 0)
                return false;

            // 헤더의 두번째 줄 처음과 끝 찾기
            nIndex = strHTML.IndexOf("<tr", nIndex);
            nIndex = nIndex + 3;

            nIndex = strHTML.IndexOf("<tr", nIndex);
            nIndex = nIndex + 3;
            int nIndexEnd = strHTML.IndexOf("</tr>", nIndex);

            int nIdx = 0;

            while (nIndexEnd > nIndex)
            {
                int nThIndex1 = strHTML.IndexOf("<th", nIndex);
                int nThIndex2 = strHTML.IndexOf("</th>", nIndex);

                if (nThIndex1 == -1 && nThIndex2 == -1)
                {   // 헤더 내용이 끝
                    break;
                }
                else if (nThIndex1 < 0 || nThIndex2 < nThIndex1)
                    return false;

                string strValue = strHTML.Substring(nThIndex1 + 3, nThIndex2 - (nThIndex1 + 3)).Trim();

                if (strValue.IndexOf("일기") != -1)
                {
                    nStateIdx = nIdx - 1;
                    break;
                }

                nIndex = nThIndex2 + 5;
                nIdx++;
            }

            return true;
        }

        private List<CityData> ReadConfig()
        {
            string strCities = ConfigurationManager.AppSettings.Get("cities");

            if (strCities == null || strCities.Length == 0)
                return null;

            string[] tokens = strCities.Split(',');
            int nTokenCount = tokens.Length;
            int nIndex = 1;

            List<CityData> cities = new List<CityData>();

            for (int i = 0; i < nTokenCount; i++)
            {
                string strToken = tokens[i].Trim();

                int nIndex1 = strToken.IndexOf('(');
                int nIndex2 = strToken.IndexOf(')');

                if (nIndex1 < 0 || nIndex2 < nIndex1)
                    continue;

                string strTrgCity = strToken.Substring(0, nIndex1).Trim();
                string strSrcCity = strToken.Substring(nIndex1 + 1, nIndex2 - nIndex1 - 1).Trim();

                string strRegion = ConfigurationManager.AppSettings.Get("region" + nIndex.ToString());

                if (strRegion == null || strRegion.Length == 0)
                    return null;

                CityData data = new CityData();

                data.Target = strTrgCity;
                data.Source = strSrcCity;
                data.SetRegion(strRegion);

                cities.Add(data);
                nIndex++;
            }

            return cities;
        }
    }
}
