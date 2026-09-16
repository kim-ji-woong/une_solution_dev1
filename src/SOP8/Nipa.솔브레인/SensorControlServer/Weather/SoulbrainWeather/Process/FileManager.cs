using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using Soulbrain.Model.Weather;
using dnsPipeHelper;
using dnsData.CommonCode;

namespace SoulbrainWeather.Process
{
    class FileManager
    {
        public static Current ReadFileMinute(string strPath, string strID, string strPassword, Logger logger)
        {
            int index = strPath.LastIndexOf('\\');

            if (index < 0)
                return null;

            List<string> datas = null;
            string strFolderPath = strPath.Substring(0, index);

            using (new NetworkShareAccesser(strFolderPath, strID, strPassword))
            {
                string strText = File.ReadAllText(strPath);
                //logger.Write(strPath + " : " + strText);
                datas = ParsingData(strText);
            }

            return datas != null ? MakeCurrent(datas) : null;
        }

        public static Current ReadFileSecond(string strPath, string strID, string strPassword, Logger logger)
        {
            int index = strPath.LastIndexOf('\\');

            if (index < 0)
                return null;

            List<string> datas = null;
            string strFolderPath = strPath.Substring(0, index);

            using (new NetworkShareAccesser(strFolderPath, strID, strPassword))
            {
                string strText = File.ReadAllText(strPath);
                //logger.Write(strPath + " : " + strText);
                datas = ParsingData(strText);
            }

            return datas != null ? MakeCurrent(datas) : null;
        }

        private static List<string> ParsingData(string strLine)
        {
            string[] tokens = strLine.Split(',');
            int tokenCount = tokens.Length;

            List<string> datas = new List<string>();

            for (int i=1;i<tokenCount;i++)
            {
                string strToken = tokens[i].Trim();

                if (i == tokenCount - 1)
                {
                    int index = strToken.IndexOf('[');

                    if (index > 0)
                    {
                        strToken = strToken.Substring(0, index).Trim();
                    }
                }

                datas.Add(strToken);
            }

            return datas;
        }

        private static Current MakeCurrent(List<string> datas)
        {
            int len = datas.Count;

            if (len < 6)
                return null;

            List<double> dataList = new List<double>();

            for (int i=0;i<len;i++)
            {
                double data;

                if (double.TryParse(datas[i], out data))
                    dataList.Add(data);
                else
                    return null;
            }

            Current current = new Current();

            // 온도
            current.tp = dataList[0];
            // 습도
            current.hd = dataList[1];
            // 풍속
            current.wind_spd = dataList[2];
            // 풍향
            current.wind_drc_code = (int)(dataList[3] + 0.01);
            // 기압
            current.atm = dataList[4];
            // 강우량
            current.rain = dataList[5];

            if (len > 6)
            {
                // 강우강도
                current.rain_per_hr = dataList[6];
            }

            current.wethr_sttus_optn_code = (int)CodeType.WeatherStatus;
            current.wind_drc_optn_code = (int)CodeType.WindDirection;

            return current;
        }
    }
}
