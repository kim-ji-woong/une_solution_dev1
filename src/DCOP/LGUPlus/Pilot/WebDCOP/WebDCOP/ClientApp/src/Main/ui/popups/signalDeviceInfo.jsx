import React, { Component } from 'react';
import Main from '../main';
import PopupDraggable from './popupDraggable';
import { SignalDeviceInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';

class SignalDeviceInfo extends Component {
    constructor(props) {
        super(props);
    }

    getItemInfo = () => {
        let ui = [];
        const item = this.props.selectedItemInfo;
        
        if (item) {

            const temperatureUpdateTime = MainResource.getDate(item.temperatureUpdateTime);
            const powerUpdateTime = MainResource.getDate(item.powerUpdateTime);

            ui.push(
                <React.Fragment key='itemInfo'>
                    <p>{item.itemName}</p>
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
                        <li className='temperature'>
                            <p>온도</p>
                            <div>
                                <p>{item.temperature} °</p>
                                <p>({temperatureUpdateTime})</p>
                            </div>
                        </li>
                        <li className='power'>
                            <p>전력</p>
                            <div>
                                <p>{item.power} kW</p>
                                <p>({powerUpdateTime})</p>
                            </div>
                        </li>
                    </ul>
                </React.Fragment>
            );
        }

        return ui;
    }

    render() {
        const itemInfo = this.getItemInfo();

        return (
            <SignalDeviceInfoComponent id={this.props.popupType} className='UI_Section itemInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={560}
                    topSize={68}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    usePopupResize={false}
                >
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.signalDeviceInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.setVisiblePopups(Main.menu.signalDeviceInfo, false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        {itemInfo}
                        <button onClick={() => this.props.handleModalPopup('itemInfo', true)}>더보기</button>
                    </div>
                </PopupDraggable>
            </SignalDeviceInfoComponent>
        );
    }
}

export default SignalDeviceInfo;