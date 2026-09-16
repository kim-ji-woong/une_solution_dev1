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

    // 소숫점 몇째자리까지 표현할 것인가?
    const pointN = (data, n, defaultValue = "") => {
        if (data === null || data === undefined) {
            return defaultValue;
        }

        const str = data.toFixed(n).toString();
        const index = str.indexOf('.');

        if (index < 0) {
            return str;
        }

        const len = str.length;

        for (let i = len - 1; i >= 0; i--) {
            if (str[i] === '0') {
                continue;
            }
            else {
                if (str[i] === '.') {
                    return str.substring(0, i);
                }
                else {
                    return str.substring(0, i + 1);
                }
            }
        }

        return str;
    }

    return (
        <WeatherInfoComponent id='weatherMenu'>
            <header>
                <div>
                    <div className='weatherIcon'>
                        {SdmsResource.getWeatherStateImage(data.wethr_sttus_code, 30)}
                    </div>
                    <p>{pointN(data.tp, 1)}℃</p>
                </div>
                <ul>
                    {/* <li>
                        <span>체감</span>
                        <span>{data.sensb_tp.toFixed(1)}℃</span>
                    </li> */}
                    <li>
                        <span>습도</span>
                        <span>{pointN(data.hd, 1)}%</span>
                    </li>
                    <li>
                        <span>풍속</span>
                        <span>{pointN(data.wind_spd, 1)} m/s</span>
                    </li>
                </ul>
            </header>
            <section>
                <ul>
                    <li>
                        <span>풍향 (degree)</span>
                        <span>{pointN(data.wind_drc_code, 1)}</span>
                    </li>
                    <li>
                        <span>기압 (hPa)</span>
                        <span>{pointN(data.atm, 1)}</span>
                    </li>
                    <li>
                        <span>일누적강우량 (mm)</span>
                        <span>{pointN(data.rain, 1)}</span>
                    </li>
                    <li>
                        <span>강우강도 (mm/h)</span>
                        <span>{pointN(data.rain_per_hr, 1, "0")}</span>
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