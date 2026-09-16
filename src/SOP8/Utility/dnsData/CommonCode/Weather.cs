using System;
using System.Collections.Generic;
using System.Text;

namespace dnsData.CommonCode
{
    public class Weather
    {
        // 날씨상태
        public class Status : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.WeatherStatus; }
            }

            public const int Unknown = (int)CodeType.WeatherStatus + 0;   // 알수없음
            public const int Sunshine = (int)CodeType.WeatherStatus + 1;  // 맑음
            public const int Thunder = (int)CodeType.WeatherStatus + 2;   // 천둥번개
            public const int SnowRain = (int)CodeType.WeatherStatus + 3;  // 진눈깨비
            public const int HeavySnow = (int)CodeType.WeatherStatus + 4; // 폭설
            public const int Snow = (int)CodeType.WeatherStatus + 5;      // 눈
            public const int HeavyRain = (int)CodeType.WeatherStatus + 6; // 폭우
            public const int Rain = (int)CodeType.WeatherStatus + 7;      // 비
            public const int Cloudy = (int)CodeType.WeatherStatus + 8;    // 흐림
            public const int Cloud = (int)CodeType.WeatherStatus + 9;     // 구름조금
            public const int DustStorm = (int)CodeType.WeatherStatus + 10;// 황사
            public const int FineDust = (int)CodeType.WeatherStatus + 11; // 미세먼지

            public Status()
            {
                m_collections.Add(Sunshine);
                m_collections.Add(Thunder);
                m_collections.Add(SnowRain);
                m_collections.Add(HeavySnow);
                m_collections.Add(Snow);
                m_collections.Add(HeavyRain);
                m_collections.Add(Rain);
                m_collections.Add(Cloudy);
                m_collections.Add(Cloud);
                m_collections.Add(DustStorm);
                m_collections.Add(FineDust);
            }

            public static string ToString(int status)
            {
                if (status == Sunshine)
                    return "맑음";
                else if (status == Thunder)
                    return "천둥번개";
                else if (status == SnowRain)
                    return "진눈깨비";
                else if (status == HeavySnow)
                    return "폭설";
                else if (status == Snow)
                    return "눈";
                else if (status == HeavyRain)
                    return "폭우";
                else if (status == Rain)
                    return "비";
                else if (status == Cloudy)
                    return "흐림";
                else if (status == Cloud)
                    return "구름조금";
                else if (status == DustStorm)
                    return "황사";
                else if (status == FineDust)
                    return "미세먼지";

                return "알수없음";
            }
        }

        // 풍향
        public class WindDirection : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.WindDirection; }
            }

            public const int North = (int)CodeType.WindDirection + 0;
            public const int NorthNorthEast = (int)CodeType.WindDirection + 1;
            public const int NorthEast = (int)CodeType.WindDirection + 2;
            public const int EastNorthEast = (int)CodeType.WindDirection + 3;
            public const int East = (int)CodeType.WindDirection + 4;
            public const int EastSouthEast = (int)CodeType.WindDirection + 5;
            public const int SouthEast = (int)CodeType.WindDirection + 6;
            public const int SouthSouthEast = (int)CodeType.WindDirection + 7;
            public const int South = (int)CodeType.WindDirection + 8;
            public const int SouthSouthWest = (int)CodeType.WindDirection + 9;
            public const int SouthWest = (int)CodeType.WindDirection + 10;
            public const int WestSouthWest = (int)CodeType.WindDirection + 11;
            public const int West = (int)CodeType.WindDirection + 12;
            public const int WestNorthWest = (int)CodeType.WindDirection + 13;
            public const int NorthWest = (int)CodeType.WindDirection + 14;
            public const int NorthNorthWest = (int)CodeType.WindDirection + 15;

            public WindDirection()
            {
                m_collections.Add(North);
                m_collections.Add(NorthNorthEast);
                m_collections.Add(NorthEast);
                m_collections.Add(EastNorthEast);
                m_collections.Add(East);
                m_collections.Add(EastSouthEast);
                m_collections.Add(SouthEast);
                m_collections.Add(SouthSouthEast);
                m_collections.Add(South);
                m_collections.Add(SouthSouthWest);
                m_collections.Add(SouthWest);
                m_collections.Add(WestSouthWest);
                m_collections.Add(West);
                m_collections.Add(WestNorthWest);
                m_collections.Add(NorthWest);
                m_collections.Add(NorthNorthWest);
            }

            public static string ToString(int direction)
            {
                if (direction == North)
                    return "북";
                else if (direction == NorthNorthEast)
                    return "북북동";
                else if (direction == NorthEast)
                    return "북동";
                else if (direction == EastNorthEast)
                    return "동북동";
                else if (direction == East)
                    return "동";
                else if (direction == EastSouthEast)
                    return "동남동";
                else if (direction == SouthEast)
                    return "남동";
                else if (direction == SouthSouthEast)
                    return "남남동";
                else if (direction == South)
                    return "남";
                else if (direction == SouthSouthWest)
                    return "남남서";
                else if (direction == SouthWest)
                    return "남서";
                else if (direction == WestSouthWest)
                    return "서남서";
                else if (direction == West)
                    return "서";
                else if (direction == WestNorthWest)
                    return "서북서";
                else if (direction == NorthWest)
                    return "북서";
                else if (direction == NorthNorthWest)
                    return "북북서";

                return "알수없음";
            }
        }
    }
}
