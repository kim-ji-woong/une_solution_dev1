import { Component } from 'react';

class SDMSMainMenu extends Component {
    static Atmosphere_Sensor = "atmosphere";        // 대기유해물질
    static Weather_Sensor = "weather";              // 통합기상
    static Water_Sensor = "water";                  // 수질오염
    static WaterDisaster_Sensor = "waterDisaster";  // 수해방지
    static TrafficCCTV_Sensor = "trafficCCTV";      // 교통안전
    static NaturalCCTV_Sensor = "existingCCTV";     // 환경감시
    static ZoneName_Sensor = "zoneName";            // 건물명

    static SENSOR_TYPE_SN_MAP = {
        [SDMSMainMenu.Atmosphere_Sensor]: 1,
        [SDMSMainMenu.Weather_Sensor]: 2,
        [SDMSMainMenu.Water_Sensor]: 3,
        [SDMSMainMenu.WaterDisaster_Sensor]: 4,
        [SDMSMainMenu.TrafficCCTV_Sensor]: 5,
        [SDMSMainMenu.NaturalCCTV_Sensor]: 6,
        [SDMSMainMenu.ZoneName_Sensor]: 18,
    };

    static getSensorTypeSn = (sensorType) => {
        return SDMSMainMenu.SENSOR_TYPE_SN_MAP[sensorType] ?? -1;
    }
}

export default SDMSMainMenu;
