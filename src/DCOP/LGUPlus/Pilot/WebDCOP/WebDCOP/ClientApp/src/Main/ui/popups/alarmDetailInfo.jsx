import React, { Component } from 'react';
import { AlarmDetailInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';

class AlarmDetailInfo extends Component {
    constructor(props) {
        super(props);
    }

    getAlarmInfo = () => {
        let ui = [];
        const alarm = this.props.selectedAlarmInfo;
        const dataCenter = this.props.selectedDataCenter;

        if (alarm) {
            const rack = this.props.getRackInfoByRackNo(alarm.rackNo);

            ui.push (
                <React.Fragment key={alarm.alarmNo}>
                    <div className='position'>
                        <div className='headWrap'>
                            <div>
                                <p>공간 정보</p>
                                <p>{dataCenter.dataCenterName}</p>
                            </div>
                            <button>이미지 공유</button>
                        </div>
                        <div className='imgWrap'>
                            <img src={alarm.imagePath1} alt='공간 이미지' />
                        </div>
                    </div>
                    <div className='rack'>
                        <div className='headWrap'>
                            <div>
                                <p>랙 정보</p>
                                <p>{rack.rackName}</p>
                            </div>
                            <button>이미지 공유</button>
                        </div>
                        <div className='imgWrap'>
                            <img src={alarm.imagePath2} alt='랙 이미지' />
                        </div>
                    </div>
                </React.Fragment>
            );
        }

        return ui;
    }

    getItemInfo = () => {
        let ui = [];
        const item = this.props.selectedItemInfo;
        const alarm = this.props.selectedAlarmInfo;

        if (item && alarm) {

            const date = MainResource.getDate(alarm.alarmTime); 
            const rackData = this.props.getRackInfoByRackNo(alarm.rackNo);
            const itemData = this.props.getItemInfoByItemNo(alarm.itemNo);

            const temperatureUpdateTime = MainResource.getDate(item.temperatureUpdateTime);
            const powerUpdateTime = MainResource.getDate(item.powerUpdateTime);

            let className = '';
            if (alarm.alarmType === '고온') {
                className = 'temperature';
            }
            else if (alarm.alarmType === '저전력') {
                className = 'power';
            }
            
            ui.push(
                <div className='itemDetailWrap' key='itemDetailInfo'>
                    <p className={className}>{alarm.alarmType}</p>
                    <p>{item.itemName}</p>
                    <ul>
                        <li>
                            <p>발생일시</p>
                            <p>{date}</p>
                        </li>
                        <li>
                            <p>발생위치</p>
                            <p>{rackData.rackName} &gt; R_{itemData.uPos}</p>
                        </li>
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
                </div>
            );
        }

        return ui;
    }

    render() {
        const itemInfo = this.getItemInfo();
        const alarmInfo = this.getAlarmInfo();

        return (
            <ModalBackground className='UI_Section'>
                <AlarmDetailInfoComponent>
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.alarmDetailInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.handleModalPopup('alarmDetail', false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        <div className='alarmInfoWrap'>
                            {alarmInfo}
                        </div>
                        <div className='itemInfoWrap'>
                            {itemInfo}
                            <div className='historyWrap'>
                                <textarea placeholder='내용을 입력하세요' />
                                <p>0 / 500자</p>
                                <button>이전 이력보기</button>
                            </div>
                        </div>
                    </div>
                </AlarmDetailInfoComponent>
            </ModalBackground>
        );
    }
}

export default AlarmDetailInfo;