import React, { Component } from 'react';
import MainResource from '../../resource/id';
import Main from '../main';
import PopupDraggable from './popupDraggable';
import { DataCenterInfoComponent } from '../../styled/mainStyled';

class DataCenterInfo extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <DataCenterInfoComponent id={this.props.popupType} className='UI_Section dataCenterInfo'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={596}
                    topSize={68}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    usePopupResize={false}
                >
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.dataCenterInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.setVisiblePopups(Main.menu.dataCenterInfo, false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        <p>안양박달국사</p>
                        <ul>
                            <li>
                                <p>국사 ID</p>
                                <p>5002329972</p>
                            </li>
                            <li>
                                <p>국사계위</p>
                                <p>가입자국사</p>
                            </li>
                            <li>
                                <p>담당</p>
                                <p>경인인프라담당</p>
                            </li>
                            <li>
                                <p>팀</p>
                                <p>수원인프라팀</p>
                            </li>
                            <li>
                                <p>국사등급</p>
                                <p>무급</p>
                            </li>
                            <li>
                                <p>국사주소</p>
                                <p>경기도 안양시 만안구 박달동 2층</p>
                            </li>
                        </ul>

                        <div>
                            <p>국사리스크 등급</p>
                            <span>[</span>
                            <span>1.3 등급 ]</span>
                        </div>
                        <ul>
                            <li>
                                <p>선로 인입형태</p>
                                <p>1등급</p>
                            </li>
                            <li>
                                <p>건축물 상태</p>
                                <p>3등급</p>
                            </li>
                            <li>
                                <p>누수/침수</p>
                                <p>1등급</p>
                            </li>
                            <li>
                                <p>전원용량</p>
                                <p>1등급</p>
                            </li>
                            <li>
                                <p>정전 장애대응</p>
                                <p>1등급</p>
                            </li>
                            <li>
                                <p>국사출입</p>
                                <p>1등급</p>
                            </li>
                        </ul>
                    </div>
                </PopupDraggable>
            </DataCenterInfoComponent>
        );
    }
}

export default DataCenterInfo;