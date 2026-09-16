import { ui } from 'jquery';
import React, { Component } from 'react';
import $ from 'jquery';
import dashStyles from '../../Common/css/dash.module.css';
import guideDash from '../../Common/css/guide.module.css';

import Weather from '../popup/weather';
import icLocation from "../../Common/img/common/ic_location.png";

import cloudy from "../../Common/img/weather/cloudy.png";
import partlyCloudyDay from "../../Common/img/weather/partly_cloudy_day.png";
import partlyCloudyNight from "../../Common/img/weather/partly_cloudy_night.png";
import rain from "../../Common/img/weather/rain.png";
import rainSnow from "../../Common/img/weather/rain_snow.png";
import rainSnowThunder from "../../Common/img/weather/rain_snow_thunder.png";
import rainThunder from "../../Common/img/weather/rain_thunder.png";
import snow from "../../Common/img/weather/snow.png";
import snowThunder from "../../Common/img/weather/snow_thunder.png";
import sunnyDay from "../../Common/img/weather/sunny_day.png";
import sunnyNight from "../../Common/img/weather/sunny_night.png";
import dustStorm from "../../Common/img/weather/dust_storm.png";
import heavyRain from "../../Common/img/weather/heavy_rain.png";
import heavySnow from "../../Common/img/weather/heavy_snow.png";



class Weather extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {

    }


    render() {
        return (
            <main className={dashStyles.sampleDashboard}>
                <h1 className={guideDash.Title}>
                    날씨 팝업
                    {/*<small>작업시 'guide-' calss 는 삭제</small>*/}
                </h1>

                <header className={guideDash.Header}>
                    <h1>기본 날씨 팝업</h1>
                </header>
                <div className={dashStyles.bythemDashboard}>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> cloudy </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    {/*<div className={dashStyles.icLocation} src="../../Common/img/common/ic_location.png" alt=""/>*/}
                                      <div className={icLocation} alt="" />
                                       <p className={dashStyles.name}>
                                            공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        {/*<span className={dashStyles.weatherImg + " " + dashStyles.cloudy}></span>*/}
                                        <img className={dashStyles.weatherImg} src={cloudy}/>
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> partly_cloudy_day </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={partlyCloudyDay} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> partly_cloudy_night </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={partlyCloudyNight} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> rain  </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={rain} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> rain_snow </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={rainSnow} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> rain_snow_thunder </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={rainSnowThunder} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> rain_thunder </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={rainThunder} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> snow </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={snow} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> snow_thunder </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={snowThunder} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> sunny_day </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={sunnyDay} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> sunny_night  </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={sunnyNight} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> dust_storm </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={dustStorm} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> heavy-rain </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={heavyRain} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className={dashStyles.weatherPopup + " " + dashStyles.isOpen}>
                        <div className={dashStyles.popupWrap}>
                            <header className={dashStyles.popupHeader}>날씨 클래스명 <br /> heavy_snow </header>
                            <section className={dashStyles.popupBody}>
                                <div className={dashStyles.subTitle}>
                                    <div className={icLocation} alt="" />
                                    <p className={dashStyles.name}>
                                        공주 공장
                                      </p>
                                </div>
                                <div className={dashStyles.content}>
                                    <div className={dashStyles.weatherInfo}>
                                        <img className={dashStyles.weatherImg} src={heavySnow} />
                                        <p className={dashStyles.temperature + " " + dashStyles.colorInfo}>26℃</p>
                                    </div>
                                    <div className={dashStyles.text}>
                                        <p>습도 : 50%</p>
                                        <p>풍향 : 150°</p>
                                        <p>풍속 : 1m/s</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>

                    <header className={dashStyles.Header}>
                        <h1>날씨 클래스명 <br /></h1>
                    </header>
                    <header className={dashStyles.bythemDashboard}>
                        <ul>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.cloudy}></span>
                                    <p>.cloudy</p>
                                </div>
                            </li>
                            <li>
                                {/*<div style="display: flex; align-items: center">*/}
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.partlyCloudyDay}></span>
                                    <p>.partly_cloudy_day</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.partlyCloudyNight}></span>
                                    <p>.partly_cloudy_night</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.rain}></span>
                                    <p>.rain</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.rainSnow}></span>
                                    <p>.rain_snow</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.rainSnowThunder}></span>
                                    <p>.rain_snow_thunder</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.rainThunder}></span>
                                    <p>.rain_thunder</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.snow}></span>
                                    <p>.snow</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.snowThunder}></span>
                                    <p>.snow_thunder</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.sunnyDay}></span>
                                    <p>.sunny_day</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.sunnyNight}></span>
                                    <p>.sunny_night</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.dustStorm}></span>
                                    <p>.dust_storm</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.heavyRain}></span>
                                    <p>.heavy_rain</p>
                                </div>
                            </li>
                            <li>
                                <div className={dashStyles.guideSquare}>
                                    <span className={dashStyles.heavySnow}></span>
                                    <p>.heavy_snow</p>
                                </div>
                            </li>
                        </ul>
                    </header>
                </div>
            </main>
        );
    }
}
export default Weather;