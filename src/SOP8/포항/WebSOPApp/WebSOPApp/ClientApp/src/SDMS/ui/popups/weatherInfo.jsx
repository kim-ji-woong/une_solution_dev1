import React, { useEffect, useRef, useState } from 'react';

import PopupDraggable from './popupDraggable';
import { WeatherInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import LineChart from '../charts/lineChart';

import bearing_icon from '../../images/bearing_icon.svg';

import {SDMSController} from "../../services/sdmsController";
import {ExternalController} from "../../services/externalController";

function WeatherInfo(props) {
    const [opacity, setOpacity] = useState(1); 
    const [weatherProperty, setWeatherProperty] = useState(SdmsResource.weatherProperty.temperature);

    const [tempDatas, setTempDatas] = useState([]);
    const [humiDatas, setHumiDatas] = useState([]);
    const [wdDatas, setWdDatas] = useState([]);
    const [wsDatas, setWsDatas] = useState([]);
    const [pm25Datas, setPm25Datas] = useState([]);
    const [pm10Datas, setPm10Datas] = useState([]);

    const prevProps = useRef(null);

    useEffect(() => {
        if (prevProps.current?.selectedSensor?.sensorLink.node_id !== props?.selectedSensor?.sensorLink.node_id) {
            initDataHistory(props.selectedSensor?.sensorLink?.node_id);
        }

        prevProps.current = props;

    }, [props.selectedSensor]);
    
    const initDataHistory = async (nodeID) => {
        if (!nodeID) return;

        const result = await ExternalController.GetExternalSensorHistories(nodeID);
        if (!result) return;

        const sensorTypes = {
            "Temp": [],
            "Humi": [],
            "WD": [],
            "WS": [],
            "PM-10": [],
            "PM-2.5": [],
        };

        // 센서 타입별 sensor_sn 매핑
        const sensorMap = {};
        props.selectedSensor.sensors.forEach(({ sensor }) => {
            if (sensorTypes.hasOwnProperty(sensor.subTypeName)) {
                sensorMap[sensor.subTypeName] = sensor.sensor_sn;
            }
        });

        // 센서 타입별 데이터 분류
        result.forEach((data) => {
            for (const [type, sensorSn] of Object.entries(sensorMap)) {
                if (data.sensor_sn === sensorSn) {
                    sensorTypes[type].push(data);
                    break;
                }
            }
        });

        // 상태 업데이트
        setTempDatas(sensorTypes["Temp"].slice().reverse());
        setHumiDatas(sensorTypes["Humi"].slice().reverse());
        setWdDatas(sensorTypes["WD"].slice().reverse());
        setWsDatas(sensorTypes["WS"].slice().reverse());
        setPm10Datas(sensorTypes["PM-10"].slice().reverse());
        setPm25Datas(sensorTypes["PM-2.5"].slice().reverse());
    };

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    const changeWeatherProp = (prop) => {
        setWeatherProperty(prop);
    }

    const getLineChartDatas = (datas, unit) => {
        let chartUI = [];
        if (!datas) return chartUI;

        const labels = datas.map((item) => {
            const date = new Date(item.his_timestamp);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        });

        const data = datas.map((item) => Number(item.sensor_value));

        chartUI.push(
            <LineChart 
                key='lineChart_weather'
                labels={labels}
                data={data}
                unit={unit}
            />
        );

        return chartUI;
    }
    
    const getWeatherChart = () => {
        let chartUI = [];
        
        if (weatherProperty === SdmsResource.weatherProperty.temperature) {
            return getLineChartDatas(tempDatas, '℃');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.windSpeed) {
            return getLineChartDatas(wsDatas, 'm/s');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.humidity) {
            return getLineChartDatas(humiDatas, '%');
        }
        else if (weatherProperty === SdmsResource.weatherProperty["pm-2.5"]) {
            return getLineChartDatas(pm25Datas, '㎍/㎥');
        }
        else if (weatherProperty === SdmsResource.weatherProperty["pm-10"]) {
            return getLineChartDatas(pm10Datas, '㎍/㎥');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.windDirection) {
            const datas = wdDatas.map((item, idx) => {
                const date = new Date(item.his_timestamp);
                const label = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                const value = item.sensor_value;

                return {
                    index: idx + 1,
                    data: value,
                    label,
                };
            });
            
            const element = datas.map(({ index, data, label }) => {
                
                const rotate = getRotate(data);
                
                return (
                    <li key={`windDirection_${index}`}>
                        <img 
                            src={bearing_icon}
                            alt="방위 아이콘"
                            style={{ rotate }}
                        />
                        <p  style={{ fontSize: '9px' }}>{data}</p>
                        <p  style={{ fontSize: '9px' }}>{label}</p>
                    </li>
                );
            });

            chartUI.push(
                <ul key='windDirection' className='bearingWrap'>
                    {element}
                </ul>
            );

            return chartUI;
        }
    }
    
    const getRotate = (data) => {
        switch (data) {
            case '북' : return '0deg';
            case '북북동' : return '22.5deg';
            case '북동' : return '45deg';
            case '동북동' : return '67.5deg';
            case '동' : return '90deg';
            case '동남동' : return '112.5deg';
            case '남동' : return '135deg';
            case '남남동' : return '157.5deg';
            case '남' : return '180deg';
            case '남남서' : return '202.5deg';
            case '남서' : return '225deg';
            case '서남서' : return '247.5deg';
            case '서' : return '270deg';
            case '서북서' : return '292.5deg';
            case '북서' : return '315deg';
            case '북북서' : return '337.5deg';
        default: return '0deg';
        }
    }

    const getWeatherDatas = () => {
        const selectedSensor = props.selectedSensor;
        if (!selectedSensor) {
            props.setVisiblePopups(SdmsResource.ID.menu.weatherInfo, false);
            return;
        }

        let temperature = null;
        let humidity = null;
        let windDirection = null;
        let windSpeed = null;
        let pm25 = null;
        let pm10 = null;
    
        for (const data of selectedSensor.sensors) {
            if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.Temp) {
                temperature = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.Humi) {
                humidity = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.WD) {
                windDirection = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.WS) {
                windSpeed = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType["PM-2.5"]) {
                pm25 = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType["PM-10"]) {
                pm10 = data.sensorZoneData.sensorMaterial.cur_data;
            }
        }

        return <div className='currentWrap'>
            <ul>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty.temperature ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.temperature)}
                >
                    <p>온도</p>
                    <p>{temperature ? temperature : '-'}°</p>
                </li>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty.humidity ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.humidity)}
                >
                    <p>습도</p>
                    <p>{humidity ? humidity : '-'}%</p>
                </li>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty.windDirection ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.windDirection)}
                >
                    <p>풍향</p>
                    <p>{windDirection ? `${windDirection}` : '-'}</p>
                </li>
            </ul>
            <ul>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty.windSpeed ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.windSpeed)}
                >
                    <p>풍속</p>
                    <p>{windSpeed ? windSpeed : '-'}m/s</p>
                </li>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty["pm-10"] ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty["pm-10"])}
                >
                    <p>미세먼지</p>
                    <p>{pm10 ? pm10 : '-'}㎍/㎥</p>
                </li>
                <li 
                    className={weatherProperty === SdmsResource.weatherProperty["pm-2.5"] ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty["pm-2.5"])}
                >
                    <p>초미세먼지</p>
                    <p>{pm25 ? pm25 : '-'}㎍/㎥</p>
                </li>
            </ul>
        </div>;
    }
    
    const onClickClosePopup = (type, value) => {
        // 팝업이 닫히는 경우 SelectedSensor를 null로 초기화 해야한다.
        // 이미 선택된 센서를 한번더 선택되게 하면 SelectedSensor는 null이 되며 소켓신호도 전송 된다.
        props.setSelectedSensorInfo(3, props.selectedSensor);
        props.setVisiblePopups(type, value);
    }

    return (
        <WeatherInfoComponent id={props.popupType} className='UI_Section weatherInfo' $opacity={opacity} $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={387}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    {SdmsResource.ID.menu.weatherInfo}
                </h5>
                <input
                    type="range"
                    className="rangeInput"
                    min={0.1}
                    max={1}
                    color="gray"
                    step={0.1}
                    defaultValue={opacity}
                    onChange={(e) => {changePopupOpacity(e.target.valueAsNumber)}}
                />
                <button className='dslX' onClick={() => onClickClosePopup(SdmsResource.ID.menu.weatherInfo, false)}>닫기</button>
            </div>

            <div className={'content'}>
                <div className='contentBox current'>
                    <p className='contentName'>{props.selectedSensor?.sensorLink?.sensor_name}</p>
                    {
                        getWeatherDatas()
                    }

                </div>

                <div className='contentBox chart'>
                    <p className='contentName'>차트</p>
                    {/* 데이터가 존재할 경우 */}
                    <div className='chartArea'>
                        {getWeatherChart()}
                    </div>

                    {/* 데이터가 없을 경우 */}
                    {/* <div className='noData'>
                        <p>데이터 값이 없습니다.</p>
                    </div> */}
                </div>
            </div>
            </PopupDraggable>
        </WeatherInfoComponent>
    );
}

export default WeatherInfo;