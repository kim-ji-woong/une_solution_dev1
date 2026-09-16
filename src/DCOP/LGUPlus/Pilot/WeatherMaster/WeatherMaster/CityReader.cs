using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil;
using System.Configuration;
using System.Net;
using System.IO;
using Weather.Model;

namespace WeatherMaster
{
    public class CityReader
    {
        private class CityData
        {
            private const string BaseURL = "https://www.weather.go.kr/w/obs-climate/land/city-obs.do?auto_man=m&stn=0&dtm=&type=t99&reg=";
            private string m_strTargetCity = "";
            private string m_strSourceCity = "";
            private string m_strURL = "";

            public string Target
            {
                get { return m_strTargetCity; }
                set { m_strTargetCity = value; }
            }

            public string Source
            {
                get { return m_strSourceCity; }
                set { m_strSourceCity = value; }
            }

            public string URL
            {
                get { return m_strURL; }
            }

            public void SetRegion(string strRegion)
            {
                m_strURL = BaseURL + strRegion;
            }
        }

        private List<CityData> m_cities = new List<CityData>();
        private Dictionary<string, int> m_dicWindDirection = new Dictionary<string, int>();
        private IDataManager m_dataManager = null;

        public CityReader()
        {
            SetDataManager();
            ReadCities();
            SetWindDirection(m_dicWindDirection);
        }

        private void SetDataManager()
        {
            int nDBType;

            string strDBName = ConfigurationManager.AppSettings.Get("dbName");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            string strDBHost = ConfigurationManager.AppSettings.Get("dbHost");
            string strDBId = ConfigurationManager.AppSettings.Get("dbId");
            string strDBPw = ConfigurationManager.AppSettings.Get("dbPw");

            if (strDBName == null || strDBName.Length == 0 ||
                strDBType == null || strDBType.Length == 0 ||
                strDBHost == null || strDBHost.Length == 0 ||
                strDBId == null || strDBId.Length == 0 ||
                strDBPw == null || strDBPw.Length == 0)
                return;

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim());
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim());
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim());

            if (int.TryParse(strDBType, out nDBType) == false)
                return;

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw);
        }

        public static void SetWindDirection(Dictionary<string, int> dicWindDirection)
        {
            dicWindDirection["북"] = 0;
            dicWindDirection["북북동"] = 1;
            dicWindDirection["북동"] = 2;
            dicWindDirection["동북동"] = 3;
            dicWindDirection["동"] = 4;
            dicWindDirection["동남동"] = 5;
            dicWindDirection["남동"] = 6;
            dicWindDirection["남남동"] = 7;
            dicWindDirection["남"] = 8;
            dicWindDirection["남남서"] = 9;
            dicWindDirection["남서"] = 10;
            dicWindDirection["서남서"] = 11;
            dicWindDirection["서"] = 12;
            dicWindDirection["서북서"] = 13;
            dicWindDirection["북서"] = 14;
            dicWindDirection["북북서"] = 15;
            // 바람없음(고요)
            dicWindDirection["정온"] = 16;
        }

        private bool ReadCities()
        {
            string strErrorMessage;
            IEnumerable<WeatherSite> sites = m_dataManager.GetSelect().Select<WeatherSite>(null, out strErrorMessage);

            if (sites == null)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return false;
            }

            foreach (WeatherSite site in sites)
            {
                CityData data = new CityData();

                data.Target = site.Name;
                data.Source = site.Name;
                data.SetRegion(site.RegionCode);

                m_cities.Add(data);
            }

            return true;
        }

        public bool ReadData()
        {
            Dictionary<int, bool> dicRead = new Dictionary<int, bool>();
            int nCityCount = m_cities.Count;

            for (int i = 0; i < nCityCount; i++)
            {
                dicRead[i] = false;
            }

            bool success = true;

            for (int i = 0; i < nCityCount; i++)
            {
                if (ReadData(dicRead, i, nCityCount) == false)
                    success = false;
            }

            return success;
        }

        private bool ReadData(Dictionary<int, bool> dicRead, int nIndex, int nCityCount)
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
                        return false;
                    }

                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        strResponse = sr.ReadToEnd();
                    }
                }

                float temp, sensible, rain, humidity, atm, windSpeed;
                int windDir, nState;

                for (int i = nIndex; i < nCityCount; i++)
                {
                    CityData city = m_cities[i];

                    if (dicRead[i] == false && city.URL == data.URL)
                    {
                        if (ParseData(strResponse, city.Source, out nState, out temp, out sensible, out rain, out humidity, out windDir, out windSpeed, out atm))
                        {
                            dicRead[i] = true;

                            if (m_dataManager != null)
                                WriteCurrentData(m_dataManager, city.Target, nState, temp, sensible, rain, humidity, windDir, windSpeed, atm);

                            string strLog = string.Format("{0} : {8} 현재기온({1}), 체감온도({2}), 강수량({3}), 습도({4}), 풍향({5}), 풍속({6}), 기압({7})",
                                city.Target, temp, sensible, rain, humidity, windDir, windSpeed, atm, WeatherCurrent.StateToString(nState));
                            System.Diagnostics.Trace.WriteLine(strLog);
                        }
                        else
                        {
                            System.Diagnostics.Trace.WriteLine("ReadFail : " + city.Target);
                            success = false;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("ReadData Error : " + e.Message);
                success = false;
            }

            return success;
        }

        public static void WriteCurrentData(IDataManager dataManager, string strCityName, int state, float currentTemperature, float sensibleTemperature, float rain, float humidity, int windDirection, float windSpeed, float atm)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", WeatherSite.Fields.Name, strCityName);
            IEnumerable<WeatherSite> sites = dataManager.GetSelect().Select<WeatherSite>(strCondition, out strErrorMessage);

            if (sites == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    return;
                }
            }

            WeatherSite site = GetFirstElement(sites);

            if (site == null)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("{0}에 해당하는 WeatherSite가 존재하지 않습니다.", strCityName));
                return;
            }

            strCondition = string.Format("{0} = {1}", WeatherCurrent.Fields.WeatherSiteNo, site.WeatherSiteNo);
            WeatherCurrent current = dataManager.GetSelect().SelectFirst<WeatherCurrent>(strCondition, out strErrorMessage);

            if (current == null)
            {
                WeatherCurrent weatherCurrent = new WeatherCurrent(site.WeatherSiteNo, state, currentTemperature, sensibleTemperature, rain, humidity, windSpeed, windDirection, atm, DateTime.Now);

                if (dataManager.GetCreate().Insert<WeatherCurrent>(weatherCurrent, out strErrorMessage) == false)
                {
                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    }
                }
            }
            else
            {
                current.State = state;
                current.Temperature = currentTemperature;
                current.SensibleTemp = sensibleTemperature;
                current.Rain = rain;
                current.Humidity = humidity;
                current.WindDirection = windDirection;
                current.WindSpeed = windSpeed;
                current.Atm = atm;
                current.UpdateTime = DateTime.Now;

                if (dataManager.GetUpdate().Update<WeatherCurrent>(current, null, out strErrorMessage) == false)
                {
                    if (strErrorMessage != null)
                    {
                        System.Diagnostics.Trace.WriteLine("[ERROR] WriteCurrentData : " + strErrorMessage);
                    }
                }
            }
        }

        private static DataType GetFirstElement<DataType>(IEnumerable<DataType> datas) where DataType : class
        {
            foreach (var data in datas)
            {
                return data;
            }

            return null;
        }

        private static bool IsEmpty<DataType>(IEnumerable<DataType> datas)
        {
            foreach (var data in datas)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// 각 도시별 기상정보를 얻어온다.
        /// </summary>
        /// <param name="strHTML"></param>
        /// <param name="strCity"></param>
        /// <param name="currentTemperature">현재온도</param>
        /// <param name="sensibleTemperature">체감온도</param>
        /// <param name="rain">강수량(mm)</param>
        /// <param name="humidity">습도(%)</param>
        /// <param name="windDirection">풍향</param>
        /// <param name="windSpeed">풍속(m/s)</param>
        /// <param name="atm">기압(hPa)</param>
        /// <returns></returns>
        private bool ParseData(string strHTML, string strCity, out int state, out float currentTemperature, out float sensibleTemperature, out float rain, out float humidity, out int windDirection, out float windSpeed, out float atm)
        {
            currentTemperature = sensibleTemperature = rain = humidity = windSpeed = atm = 0.0f;
            state = windDirection = 0;

            int nStateIdx, nCurrentTemperatureIdx, nSensibleTemperatureIdx, nRainIdx, nHumidityIdx, nWindDirectionIdx, nWindSpeedIdx, nAtmIdx;

            // 헤더 idx 값 찾기
            if (GetHeadIdx(strHTML, out nStateIdx, out nCurrentTemperatureIdx, out nSensibleTemperatureIdx, out nRainIdx, out nHumidityIdx, out nWindDirectionIdx, out nWindSpeedIdx, out nAtmIdx) == false)
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

                if (nStateIdx != -1 && i == nStateIdx)
                {
                    if (ReadWeatherState(strValue, ref state) == false)
                        return false;
                }
                else if (nCurrentTemperatureIdx != -1 && i == nCurrentTemperatureIdx)
                {
                    if (float.TryParse(strValue, out currentTemperature) == false)
                        return false;
                }
                else if (nSensibleTemperatureIdx != -1 && i == nSensibleTemperatureIdx)
                {
                    if (float.TryParse(strValue, out sensibleTemperature) == false)
                        return false;
                }
                else if (nRainIdx != -1 && i == nRainIdx)
                {
                    if (float.TryParse(strValue, out rain) == false)
                        rain = 0;
                }
                else if (nHumidityIdx != -1 && i == nHumidityIdx)
                {
                    if (float.TryParse(strValue, out humidity) == false)
                        return false;
                }
                else if (nWindDirectionIdx != -1 && i == nWindDirectionIdx)
                {
                    if (m_dicWindDirection.TryGetValue(strValue, out windDirection) == false)
                    {
                        System.Diagnostics.Trace.WriteLine("Unknown Wind Direction : " + strValue);
                        return false;
                    }
                }
                else if (nWindSpeedIdx != -1 && i == nWindSpeedIdx)
                {
                    if (float.TryParse(strValue, out windSpeed) == false)
                    {
                        if (ReadWindSpeed(strValue.ToLower(), ref windSpeed) == false)
                            return false;
                    }
                }
                else if (nAtmIdx != -1 && i == nAtmIdx)
                {
                    if (float.TryParse(strValue, out atm) == false)
                        return false;
                }
            }

            return true;
        }

        private bool GetHeadIdx(string strHTML, out int nStateIdx, out int nCurrentTemperatureIdx, out int nSensibleTemperatureIdx, out int nRainIdx, out int nHumidityIdx, out int nWindDirectionIdx, out int nWindSpeedIdx, out int nAtmIdx)
        {
            nStateIdx = -1;
            nCurrentTemperatureIdx = -1;
            nSensibleTemperatureIdx = -1;
            nRainIdx = -1;
            nHumidityIdx = -1;
            nWindDirectionIdx = -1;
            nWindSpeedIdx = -1;
            nAtmIdx = -1;

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
                    nStateIdx = nIdx - 1;
                else if (strValue.IndexOf("기온") != -1)
                    nCurrentTemperatureIdx = nIdx - 1;
                else if (strValue.IndexOf("체감") != -1)
                    nSensibleTemperatureIdx = nIdx - 1;
                else if (strValue.IndexOf("강수") != -1)
                    nRainIdx = nIdx - 1;
                else if (strValue.IndexOf("습도") != -1)
                    nHumidityIdx = nIdx - 1;
                else if (strValue.IndexOf("풍향") != -1)
                    nWindDirectionIdx = nIdx - 1;
                else if (strValue.IndexOf("풍속") != -1)
                    nWindSpeedIdx = nIdx - 1;
                else if (strValue.IndexOf("기압") != -1)
                    nAtmIdx = nIdx - 1;

                nIndex = nThIndex2 + 5;
                nIdx++;
            }

            return true;
        }

        private bool ReadWeatherState(string strValue, ref int state)
        {
            if (strValue.Contains("맑음"))
                state = (int)WeatherCurrent.WeatherState.Sunshine;
            else if (strValue.Contains("천둥"))
                state = (int)WeatherCurrent.WeatherState.Thunder;
            else if (strValue.Contains("진눈깨비"))
                state = (int)WeatherCurrent.WeatherState.SnowRain;
            else if (strValue.Contains("강한 눈") || strValue.Contains("강한눈"))
                state = (int)WeatherCurrent.WeatherState.HeavySnow;
            else if (strValue.Contains("눈"))
                state = (int)WeatherCurrent.WeatherState.Snow;
            else if (strValue.Contains("강한 비") || strValue.Contains("강한비"))
                state = (int)WeatherCurrent.WeatherState.HeavyRain;
            else if (strValue.Contains("비") || strValue.Contains("소나기"))
                state = (int)WeatherCurrent.WeatherState.Rain;
            else if (strValue.Contains("흐림") || strValue.Contains("구름많음") || strValue.Contains("구름 많음") || strValue.Contains("안개") || strValue.Contains("박무") || strValue.Contains("연무"))
                state = (int)WeatherCurrent.WeatherState.Cloudy;
            else if (strValue.Length == 0 || strValue.Contains("구름조금") || strValue.Contains("구름 조금"))
                state = (int)WeatherCurrent.WeatherState.Cloud;
            else if (strValue.Contains("황사"))
                state = (int)WeatherCurrent.WeatherState.DustStorm;
            else if (strValue.Contains("미세먼지"))
                state = (int)WeatherCurrent.WeatherState.FineDust;
            else
                state = (int)WeatherCurrent.WeatherState.Unknown;

            return true;
        }

        private bool ReadWindSpeed(string strValue, ref float windSpeed)
        {
            string strTag = "writewindspeed('";

            int nIndex1 = strValue.IndexOf(strTag);

            if (nIndex1 < 0)
                return false;

            nIndex1 += strTag.Length;

            int nIndex2 = strValue.IndexOf("'", nIndex1 + 1);

            if (nIndex2 < nIndex1)
                return false;

            string strWindSpeed = strValue.Substring(nIndex1, nIndex2 - nIndex1).Trim();
            return float.TryParse(strWindSpeed, out windSpeed);
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
    }
}
