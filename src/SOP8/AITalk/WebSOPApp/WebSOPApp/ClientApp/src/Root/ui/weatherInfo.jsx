import React from 'react';
import { WeatherInfoComponent } from '../styled/titleBarStyled';
import Clock from '../../Common/ui/clock';
import SdmsResource from '../../SDMS/resource/id';

function WeatherInfo(props) {
    // props.weatherDatas[0] 공주 데이터 사용
    const data = props.weatherDatas?.[0];

    if (!data) {
        return (
            <WeatherInfoComponent id='weatherMenu'>
                <p>날씨 데이터를 불러오는 중...</p>
            </WeatherInfoComponent>
        );
    }

    return (
        <WeatherInfoComponent id='weatherMenu'>
            <header>
                <div>
                    <div className='weatherIcon'>
                        {SdmsResource.getWeatherStateImage(data.wethr_sttus_code, 30)}
                    </div>
                    <p>{data.tp.toFixed(1)}℃</p>
                </div>
                <ul>
                    <li>
                        <span>체감</span>
                        <span>{data.sensb_tp.toFixed(1)}℃</span>
                    </li>
                    <li>
                        <span>습도</span>
                        <span>{data.hd}%</span>
                    </li>
                    <li>
                        <span>풍속</span>
                        <span>{data.wind_spd.toFixed(1)} m/s</span>
                    </li>
                </ul>
            </header>
            <section>
                <ul>
                    <li>
                        <span>풍향</span>
                        <span>{SdmsResource.windDirectionNames[data.wind_drc_code]}</span>
                    </li>
                    <li>
                        <span>기압 (hPa)</span>
                        <span>{data.atm}</span>
                    </li>
                    <li>
                        <span>일누적강우량 (mm)</span>
                        <span>{data.rain.toFixed(1)}</span>
                    </li>
                    <li>
                        <span>강우강도 (mm/h)</span>
                        <span>{data.rain_per_hr ? data.rain_per_hr.toFixed(1) : 0}</span>
                    </li>
                </ul>
            </section>
            <footer>
                <span>현재시각</span>
                <Clock />
            </footer>
        </WeatherInfoComponent>
    );
}

export default WeatherInfo;