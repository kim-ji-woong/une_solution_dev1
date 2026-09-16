import { Component } from 'react';

class SDMSMainMenu extends Component {
    static Atmosphere_Sensor = "atmosphere";                    // 대기
    static ReductionEquipment_Sensor = "reductionEquipment";    // 저감설비
    static EmissionFacilities_Sensor = "emissionFacilities";    // 배출설비
    static Weather_Sensor = "weather";                          // 기상
    static CCTV_Sensor = "cctv";                                // CCTV
    static ZoneName_Sensor = "zoneName";                        // 구역명
}

export default SDMSMainMenu;