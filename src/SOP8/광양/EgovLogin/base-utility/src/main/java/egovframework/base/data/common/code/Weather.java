package egovframework.base.data.common.code;

import java.util.Arrays;
import egovframework.base.data.common.code.CodeTypeData;
import egovframework.base.data.common.code.CodeType;

public class Weather {

    // 날씨 상태
    public static class Status extends CodeTypeData {
        public static final int Unknown = CodeType.WeatherStatus.getValue() + 0;
        public static final int Sunshine = CodeType.WeatherStatus.getValue() + 1;
        public static final int Thunder = CodeType.WeatherStatus.getValue() + 2;
        public static final int SnowRain = CodeType.WeatherStatus.getValue() + 3;
        public static final int HeavySnow = CodeType.WeatherStatus.getValue() + 4;
        public static final int Snow = CodeType.WeatherStatus.getValue() + 5;
        public static final int HeavyRain = CodeType.WeatherStatus.getValue() + 6;
        public static final int Rain = CodeType.WeatherStatus.getValue() + 7;
        public static final int Cloudy = CodeType.WeatherStatus.getValue() + 8;
        public static final int Cloud = CodeType.WeatherStatus.getValue() + 9;
        public static final int DustStorm = CodeType.WeatherStatus.getValue() + 10;
        public static final int FineDust = CodeType.WeatherStatus.getValue() + 11;

        public Status() {
            collections.addAll(Arrays.asList(
                Sunshine, Thunder, SnowRain, HeavySnow, Snow,
                HeavyRain, Rain, Cloudy, Cloud, DustStorm, FineDust
            ));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.WeatherStatus;
        }

        public static String toString(int status) {
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
            else
            	return "알수없음";
        }
    }

    // 풍향
    public static class WindDirection extends CodeTypeData {
        public static final int North = CodeType.WindDirection.getValue() + 0;
        public static final int NorthNorthEast = CodeType.WindDirection.getValue() + 1;
        public static final int NorthEast = CodeType.WindDirection.getValue() + 2;
        public static final int EastNorthEast = CodeType.WindDirection.getValue() + 3;
        public static final int East = CodeType.WindDirection.getValue() + 4;
        public static final int EastSouthEast = CodeType.WindDirection.getValue() + 5;
        public static final int SouthEast = CodeType.WindDirection.getValue() + 6;
        public static final int SouthSouthEast = CodeType.WindDirection.getValue() + 7;
        public static final int South = CodeType.WindDirection.getValue() + 8;
        public static final int SouthSouthWest = CodeType.WindDirection.getValue() + 9;
        public static final int SouthWest = CodeType.WindDirection.getValue() + 10;
        public static final int WestSouthWest = CodeType.WindDirection.getValue() + 11;
        public static final int West = CodeType.WindDirection.getValue() + 12;
        public static final int WestNorthWest = CodeType.WindDirection.getValue() + 13;
        public static final int NorthWest = CodeType.WindDirection.getValue() + 14;
        public static final int NorthNorthWest = CodeType.WindDirection.getValue() + 15;

        public WindDirection() {
            collections.addAll(Arrays.asList(
                North, NorthNorthEast, NorthEast, EastNorthEast, East,
                EastSouthEast, SouthEast, SouthSouthEast, South,
                SouthSouthWest, SouthWest, WestSouthWest, West,
                WestNorthWest, NorthWest, NorthNorthWest
            ));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.WindDirection;
        }

        public static String toString(int direction) {
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
            else
            	return "알수없음";
        }
    }
}
