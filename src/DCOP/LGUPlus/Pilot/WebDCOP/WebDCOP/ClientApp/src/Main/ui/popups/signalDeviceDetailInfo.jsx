import React, { Component } from 'react';
import { SignalDeviceDetailInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';
import DoughnutChart from '../chart/doughnutChart';

class SignalDeviceDetailInfo extends Component {
    constructor(props) {
        super(props);
    }

    getItemInfo = () => {
        let ui = [];
        const item = this.props.selectedItemInfo;

        if (item) {
            ui.push(
                <React.Fragment key='itemDetailInfo'>
                    <p>{item.itemName}</p>
                    <div className='imgWrap'>
                        <div className='img'>
                            <img src={item.itemType.imageUrl} alt='통신장비 이미지' />
                        </div>
                    </div>
                    <ul>
                        <li>
                            <p>카테고리</p>
                            <p>{item.equipmentTypeName}</p>
                        </li>
                        <li>
                            <p>모델명</p>
                            <p>{item.itemType.modelName}</p>
                        </li>
                        <li>
                            <p>제조사</p>
                            <p>{item.companyName}</p>
                        </li>
                        <li>
                            <p>크기</p>
                            <p>{`${item.itemType.width ? item.itemType.width : '-'} x ${item.itemType.depth ? item.itemType.depth : '-'} x ${item.itemType.height ? item.itemType.height : '-'} (mm)`}</p>
                        </li>
                        <li>
                            <p>Unit</p>
                            <p>{`${item.itemType.unit} U`}</p>
                        </li>
                        <li>
                            <p>종류</p>
                            <p>{item.itemType.type ? item.itemType.type : '-'}</p>
                        </li>
                        <li>
                            <p>등록일자</p>
                            <p>{item.regTime.slice(0, 10)}</p>
                        </li>
                    </ul>
                </React.Fragment>
            );
        }

        return ui;
    }

    getChartInfo = () => {
        let ui = [];
        const item = this.props.selectedItemInfo;
        
        if (item) {
            const temperatureBackground = 100 - item.temperature;
            const powerBackground = 100 - item.power;

            const temperatureUpdateTime = MainResource.getDate(item.temperatureUpdateTime);
            const powerUpdateTime = MainResource.getDate(item.powerUpdateTime);

            ui.push(
                <div className='chartWrap' key='itemChart'>
                    <div className='temperature'>
                        <div className='chart'>
                            <DoughnutChart
                                colors={['#222B33', '#FBB03B']}
                                labels={['온도', '온도']}
                                datasets={[temperatureBackground, item.temperature]}
                            />
                        </div>
                        <div className='info'>
                            <p>온도 : {`${item.temperature} °`}</p>
                            <p>{temperatureUpdateTime}</p>
                        </div>
                    </div>
                    <div className='powerConsumption'>
                        <div className='chart'>
                            <DoughnutChart
                                colors={['#222B33', '#4BE5DD']}
                                labels={['소모전력', '소모전력']}
                                datasets={[powerBackground, item.power]}
                            />
                        </div>
                        <div className='info'>
                            <p>전력 : {`${item.power}kW`}</p>
                            <p>{powerUpdateTime}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return ui;
    }

    render() {
        const itemInfo = this.getItemInfo();
        const chartInfo = this.getChartInfo();

        return (
            <ModalBackground className='UI_Section'>
                <SignalDeviceDetailInfoComponent>
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.signalDeviceDetailInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.handleModalPopup('itemInfo', false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        {itemInfo}
                        {chartInfo}
                    </div>
                </SignalDeviceDetailInfoComponent>
            </ModalBackground>
        );
    }
}

export default SignalDeviceDetailInfo;