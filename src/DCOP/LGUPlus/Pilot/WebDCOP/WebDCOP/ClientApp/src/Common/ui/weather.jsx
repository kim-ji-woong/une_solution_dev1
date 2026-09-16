import React, { Component } from 'react';
import MainResource from '../../Main/resource/id';
import { MainController } from '../../Main/services/mainController';

class Weather extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherDatas: {}
        }
    }

    componentDidMount() {
        this.initFirstWeatherData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.weatherDatas.temperature !== this.props.weatherDatas.temperature) {
            this.setState({ weatherDatas: this.props.weatherDatas });
        }
    }
    
    initFirstWeatherData = async () => {
        const [weather, message] = await MainController.requestCurrentWeather(this.props.selectedDataCenter.dataCenterNo);

        if (weather) {
            this.setState({ weatherDatas: weather });
        }
        else {
            console.log(message);
        }
    }

    getWeatherInfo = () => {
        let img = null;
        let temperature = null;
    
        if (this.state.weatherDatas.state && this.state.weatherDatas.temperature) {
            img = MainResource.getStateImage(this.state.weatherDatas.state);
            temperature = Number(this.state.weatherDatas.temperature).toFixed(1);
        }
    
        return [img, temperature];
    }

    render() {
        let [img, temperature] = this.getWeatherInfo();

        return (
            <div className='weather'>
                {img && <img src={img} alt='weather-icon' width={24} height={24} />}
                {temperature && <p>{temperature}°</p>}
            </div>
        );
    }
}

export default Weather;