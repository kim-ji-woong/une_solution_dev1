import React, { Component } from 'react';
import Main from '../main';
import PopupDraggable from './popupDraggable';
import { RackInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';

class RackInfo extends Component {
    constructor(props) {
        super(props);
    }

    getRackInfo = () => {
        let ui = [];
        const rack = this.props.selectedRackInfo;

        if (rack) {
            ui.push(
                <React.Fragment key='rackInfo'>
                    <p>{rack.rackName}</p>
                    <ul>
                        <li>
                            <p>모델명</p>
                            <p>{rack.rackType.modelName}</p>
                        </li>
                        <li>
                            <p>제조사</p>
                            <p>{rack.companyName}</p>
                        </li>
                        <li>
                            <p>크기</p>
                            <p>{`${rack.rackType.width ? rack.rackType.width : '-'} x ${rack.rackType.depth ? rack.rackType.depth : '-'} x ${rack.rackType.height ? rack.rackType.height : '-'} (mm)`}</p>
                        </li>
                        <li>
                            <p>Unit</p>
                            <p>{`${rack.rackType.unit} U`}</p>
                        </li>
                        <li>
                            <p>종류</p>
                            <p>{rack.rackType.type}</p>
                        </li>
                        <li>
                            <p>등록일자</p>
                            <p>{rack.regTime.slice(0, 10)}</p>
                        </li>
                    </ul>
                </React.Fragment>
            );
        }

        return ui;
    }

    render() {
        const rackInfo = this.getRackInfo();

        return (
            <RackInfoComponent id={this.props.popupType} className='UI_Section rackInfo'>
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
                            {MainResource.ID.menu.rackInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.setVisiblePopups(Main.menu.rackInfo, false)}>
                            <button>닫기버튼</button>
                        </div>
                        <button onClick={() => this.props.handleModalPopup('viewImg', true)}>현장이미지 보기 버튼</button> 
                    </div>

                    <div className={'body'}>
                        {rackInfo}
                        <button onClick={() => this.props.handleModalPopup('rackInfo', true)}>더보기</button>
                    </div>
                </PopupDraggable>
            </RackInfoComponent>
        );
    }
}

export default RackInfo;