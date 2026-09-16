import React, { useEffect, useRef, useState } from 'react';

import PopupDraggable from './popupDraggable';
import { WeatherInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import LineChart from '../charts/lineChart';

import bearing_icon from '../../images/bearing_icon.svg';

import {SDMSController} from "../../services/sdmsController";
import {ExternalController} from "../../services/externalController";
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';

function WeatherInfo(props) {
    const [opacity, setOpacity] = useState(1); 
    const [weatherProperty, setWeatherProperty] = useState(SdmsResource.weatherProperty.temperature);

    const [tempDatas, setTempDatas] = useState([]);
    const [humiDatas, setHumiDatas] = useState([]);
    const [wdDatas, setWdDatas] = useState([]);
    const [wsDatas, setWsDatas] = useState([]);
    const [pressureDatas, setPressureDatas] = useState([]);
    const [solarDatas, setSolarDatas] = useState([]);
    const [rainfallDatas, setRainfallDatas] = useState([]);

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
            "Atmospheric pressure": [],
            "Solar radiation": [],
            "Rainfall": [],
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
        setPressureDatas(sensorTypes["Atmospheric pressure"].slice().reverse());
        setSolarDatas(sensorTypes["Solar radiation"].slice().reverse());
        setRainfallDatas(sensorTypes["Rainfall"].slice().reverse());
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
    
    const getCurrentDatas = () => {
        switch (weatherProperty) {
            case SdmsResource.weatherProperty.temperature: return tempDatas;
            case SdmsResource.weatherProperty.wind: return wsDatas;
            case SdmsResource.weatherProperty.humidity: return humiDatas;
            case SdmsResource.weatherProperty.pressure: return pressureDatas;
            case SdmsResource.weatherProperty.solarRadiation: return solarDatas;
            case SdmsResource.weatherProperty.rainfall: return rainfallDatas;
            default: return [];
        }
    }

    const getWeatherChart = () => {
        let chartUI = [];
        
        if (weatherProperty === SdmsResource.weatherProperty.temperature) {
            return getLineChartDatas(tempDatas, '℃');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.humidity) {
            return getLineChartDatas(humiDatas, '%');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.pressure) {
            return getLineChartDatas(pressureDatas, 'hPa');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.solarRadiation) {
            return getLineChartDatas(solarDatas, 'W/㎡');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.rainfall) {
            return getLineChartDatas(rainfallDatas, 'mm');
        }
        else if (weatherProperty === SdmsResource.weatherProperty.wind) {
            
            const wsMap = {};
            wsDatas.forEach((ws) => {
                wsMap[ws.his_timestamp] = ws.sensor_value;
            });

            const datas = wdDatas.map((item, idx) => {
                const date = new Date(item.his_timestamp);
                const label = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                const value = item.sensor_value;
                const windSpeed = wsMap[item.his_timestamp] ?? '-';

                return {
                    index: idx + 1,
                    data: value,
                    label,
                    windSpeed,
                };
            });
            
            const element = datas.map(({ index, data, label, windSpeed }) => {
                
                return (
                    <li key={`windDirection_${index}`}>
                        <img
                            src={bearing_icon}
                            alt="방위 아이콘"
                            style={{ rotate: `${Number(data) - 180}deg` }}
                        />
                        <p>{SdmsResource.getWindDirectionString(data)}풍</p>
                        <p>{windSpeed}m/s</p>
                        <p>{label}</p>
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
    


    const getWeatherDatas = () => {
        const selectedSensor = props.selectedSensor;
        if (!selectedSensor) {
            props.setVisiblePopups(SdmsResource.ID.menu.weatherInfo, false);
            return;
        }

        let temperature = null;     // 온도
        let humidity = null;        // 습도
        let windDirection = null;   // 풍향
        let windSpeed = null;       // 풍속
        let pressure = null;        // 기압
        let solarRadiation = null;  // 일사량
        let rainfall = null;        // 강수량

        for (const data of selectedSensor.sensors) {
            if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.Temp) {
                temperature = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.Humi) {
                humidity = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.WD) {
                windDirection = SdmsResource.getWindDirectionString(data.sensorZoneData.sensorMaterial.cur_data);
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.WS) {
                windSpeed = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType["Atmospheric pressure"]) {
                pressure = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType["Solar radiation"]) {
                solarRadiation = data.sensorZoneData.sensorMaterial.cur_data;
            }
            else if (data.sensorZoneData.sensorZone.sensor_sub_ty_no === SdmsResource.weatherMaterialType.Rainfall) {
                rainfall = data.sensorZoneData.sensorMaterial.cur_data;
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
                    className={weatherProperty === SdmsResource.weatherProperty.wind ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.wind)}
                >
                    <p>풍향·풍속</p>
                    <p>{windDirection ? `${windDirection}` : '-'}풍·{windSpeed ? windSpeed : '-'}m/s</p>
                </li>
            </ul>
            <ul>
                <li
                    className={weatherProperty === SdmsResource.weatherProperty.pressure ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.pressure)}
                >
                    <p>기압</p>
                    <p>{pressure ? pressure : '-'}hPa</p>
                </li>
                <li
                    className={weatherProperty === SdmsResource.weatherProperty.solarRadiation ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.solarRadiation)}
                >
                    <p>일사량</p>
                    <p>{solarRadiation ? solarRadiation : '-'}W/㎡</p>
                </li>
                <li
                    className={weatherProperty === SdmsResource.weatherProperty.rainfall ? 'on' : null}
                    onClick={() => changeWeatherProp(SdmsResource.weatherProperty.rainfall)}
                >
                    <p>강수량</p>
                    <p>{rainfall ? rainfall : '-'}mm</p>
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
                popupMinWidth={340}
                popupMinHeight={361}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    <Icon.InfoCircleIcon size='xs' />
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
                <IconButton
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer />}
                    onClick={() => onClickClosePopup(SdmsResource.ID.menu.weatherInfo, false)}
                >
                    닫기
                </IconButton>
            </div>

            <div className={'content'}>
                <div className='contentBox current'>
                    <p className='contentName'>{props.selectedSensor?.sensorLink?.sensor_name}</p>
                    {
                        getWeatherDatas()
                    }

                </div>

                <div className='contentBox chart'>
                    {getCurrentDatas().length > 0 ? (
                        <div className='chartArea'>
                            {getWeatherChart()}
                        </div>
                    ) : (
                        <div className='noData'>
                            <p>데이터 값이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
            </PopupDraggable>
        </WeatherInfoComponent>
    );
}

export default WeatherInfo;