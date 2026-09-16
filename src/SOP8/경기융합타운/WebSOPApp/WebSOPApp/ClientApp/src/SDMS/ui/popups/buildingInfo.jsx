import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import imgClose from '../../../Common/image/icon/close_x.png';
import SDMS from '../sdms';
import SdmsResource from '../../resource/id';
import SettingsStore from '../../../Settings/settingsStore';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SdmsScrollbar } from './SdmsScrollbar';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { BuildingInfoComponent } from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class BuildingInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 데이터 정보
            kind: "",
        }

        this.props = props;

        if (this.props.info !== null && this.props.info !== undefined) {
            this.initInfo(this.props.info);
        }

        //this.initInfo(this.props.info);

        // TODO: 샘플 데이터 예시
        //let arrInfo = new Array();
        //arrInfo[0] = SdmsResource.ID.buildingInfo.equipmentType;         // 건물 or 설비
        //arrInfo[1] = "HF 탱크";                                          // 설비 이름
        //arrInfo[2] = "HF";                                               // 취급물질(대표)
        //arrInfo[3] = "안준후";                                           // 담당자
        //arrInfo[4] = "010-123-1234";                                  // {i18n.t('sdms.formText.담당자 연락처')}

        //let arrInfo = new Array();
        //arrInfo[0] = SdmsResource.ID.buildingInfo.buildingType;         // 건물 정보인지 설비 정보인지 구별
        //arrInfo[1] = "1동";                                              // 건물 이름
        //arrInfo[2] = "CVD 공장";                                         // 건물 타입
        //arrInfo[3] = "9,501.86m2";                                         // 면적 
        //arrInfo[4] = "2012년 8월 15일";                                  // 준공일
        //this.initInfo(arrInfo);

        this.initPopupState = this.initPopupState.bind(this);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.refRoot = React.createRef();
        this.refTitle = React.createRef();
        this.refScrollbar = React.createRef();
        this.refDataList = React.createRef();
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
            if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                document.getElementById(this.props.popupType).style.opacity = 1;
            }
        });

        this.initPopupState();
        this.setScrollbar();
    }

    setScrollbar() {
        if (!this.refRoot.current || !this.refTitle.current) {
            SdmsScrollbar.setContentStyle(this.refScrollbar.current, 100, 100, false);
            return;
        }

        const rectRoot = this.refRoot.current.getBoundingClientRect();
        const rectTitle = this.refTitle.current.getBoundingClientRect();
        const width = rectTitle.width - 10;
        const height = rectRoot.height - rectTitle.height - 40;

        let scrollVisible = false;

        if (this.refDataList.current) {
            const rectList = this.refDataList.current.getBoundingClientRect();

            if (rectList.height > height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbar.current, width, height, scrollVisible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.buildingInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    initInfo = (arrInfo) => {
        if (arrInfo === null || arrInfo === undefined || arrInfo.length !== 5)
            return;

        this.state.kind = arrInfo[0];
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboardBuilding')[0];
            popup.style.zIndex = this.props.zIndex
            console.log('buildingInfoZIndex changed', popup.style.zIndex)
        }

        this.setScrollbar();
    }    

    getFacilityInfoElements(facilityName) {
        // 수소 관련 분기 주석처리
        //if (ProjectResource.SiteNo === ProjectResource.Site.Hydrogen && Number.isInteger(this.props.info)) {
        //    return this.getHydrogenUI();
        //}
        facilityName.push("");

        if (this.props.info && this.props.info.length > 0) {
            const datas = this.props.info; // as [value: string, withDot: boolean, indentDepth: number | null]

            if (datas.length >= 3) {                
                //facilityName[0] = datas[1];
                const data = i18nUtil.convertText(datas[1]);
                facilityName[0] = data;

                const arr = datas[2];
                const arrCount = arr.length;

                if (arrCount > 0) {
                    const list = [];
                    
                    for (let i = 0; i < arrCount; i++) {
                        const [value, withDot, indentDepth] = arr[i];
                        list.push(this.makeList(value, withDot, indentDepth, i));

                        // 수소 관련 분기 주석
                        //if (ProjectResource.SiteNo === ProjectResource.Site.Hydrogen) {
                        //    let sensorTypeName = facilityName[0];
                        //    let val = '';
                        //    if (sensorTypeName === i18n.t('facilityType.화재센서')) {
                                
                        //    } else if (sensorTypeName === i18n.t('facilityType.가스센서')) {
                                
                        //    } else if (sensorTypeName === i18n.t('materialType.압력센서')) {                                
                        //        val = (Math.floor(Math.random() * 60) + 3) + 'MPa';
                        //        list.push(<li key={"list_4"} className={'liDot'}>{val}</li>);
                        //    } else if (sensorTypeName === i18n.t('materialType.긴급차단장치')) {
                                
                        //    } else if (sensorTypeName === i18n.t('materialType.온도센서')) {
                        //        val = (Math.floor(Math.random() * 40) + 30) + '℃';
                        //        list.push(<li key={"list_4"} className={'liDot'}>{val}</li>);
                        //    } else if (sensorTypeName === i18n.t('materialType.유량센서')) {
                        //        val = (Math.floor(Math.random() * 30) + 20) + 'kg/hr';
                        //        list.push(<li key={"list_4"} className={'liDot'}>{val}</li>);
                        //    }
                        //}
                    }

                    return (
                        <ul ref={this.refDataList}>
                            {list}
                        </ul>
                        );
                }
            }

            return <></>;
        }
    }

    makeList(value, withDot, depth, index) {
        const leftPadding = depth !== null && depth !== undefined && depth > 0 ? (depth * 1.8) + 'em' : null;

        if (withDot) {
            if (leftPadding) {
                return <li key={"list_" + index} className={'liDot'} style={{ paddingLeft: leftPadding }}>{i18nUtil.convertText(value)}</li>;
            }
            else {
                return <li key={"list_" + index} className={'liDot'}>{i18nUtil.convertText(value)}</li>;
            }
        }
        else {
            if (leftPadding) {
                return <li key={"list_" + index} className={'liNoDot'} style={{ paddingLeft: leftPadding }}>{i18nUtil.convertText(value)}</li>;
            }
        }

        return <li key={"list_" + index} className={'liNoDot'}>{i18nUtil.convertText(value)}</li>;
    }

    getHydrogenUI() {
        const zoneID = this.props.info;
        if (!zoneID) {
            return <></>;
        }

        const lang = i18n.language;

        if (zoneID === 1) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '수처리 장치' : 'Water Treatment Device' }</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 2) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '수질 정화용 펌프' : 'Pressure Vessel for Water Purification'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 3) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '수질 정화용 펌프' : 'Pump for Water Purification'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>VOL10008</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 4) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '냉각용 열교환기' : 'Cooling Heat Exchanger'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> W20026</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 5) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '냉각용 펌프' : 'Cooling Pump'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 6) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '냉각용 압력용기' : 'Cooling Pressure Vessel'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 7) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '질소 정화 시스템' : 'Nitrogen Purging System'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 8) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? 'ELY 모듈' : 'ELY Module'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 9) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '드라이어' : 'Dryer'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 10) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '압력용기' : 'Pressure Vessels'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 11) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '압축기' : 'Compressor'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 12) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '공냉식 열교환기 1' : 'Air-cooled Heat Exchanger 1'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 13) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '공냉식 열교환기 2' : 'Air-cooled Heat Exchanger 2'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 14) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '환기 시스템 1' : 'Ventilation System 1'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 15) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '환기 시스템 2' : 'Ventilation System 2'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>+49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 16) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '환기 시스템 3' : 'Ventilation System 3'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 17) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '튜브트레일러' : 'Tube Trailer'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 18) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '중압 압력용기 1' : 'Medium Pressure Vessel 1'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 19) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '중압 압력용기 2' : 'Medium Pressure Vessel 2'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 20) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '중압 압력용기 3' : 'Medium Pressure Vessel 3'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 21) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '고압 압력용기 1' : 'High Pressure Vessel 1'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 22) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '고압 압력용기 2' : 'High Pressure Vessel 2'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 23) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '고압 압력용기 3' : 'High Pressure Vessel 3'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 24) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '고압 압력용기 4' : 'High Pressure Vessel 4'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 25) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '고압 압력용기 5' : 'High Pressure Vessel 5'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 26) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '열교환기' : 'Heat Exchanger'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 27) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '경차/승용차용' : '70MPa'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 28) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '트럭/화물차용' : '35MPa'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        } else if (zoneID === 29) {
            return <ul ref={this.refDataList}>
                <li key={"list_1"} className={'liDot'}><span className={'facilityInfoTitle'}>{lang === "ko" ? '설비명' : 'Name'}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}>{lang === "ko" ? '압축기' : 'Compressor'}</span></li>
                <li key={"list_2"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.설비관리번호')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> A10006</span></li>
                <li key={"list_3"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.관리 책임자')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> Kai Oehring</span></li>
                <li key={"list_4"} className={'liDot'}><span className={'facilityInfoTitle'}>{i18n.t('sdms.buildingInfo.담당자 연락처')}</span><p className={'facilitySemiclone'}>:</p><span className={'facilityInfoConts'}> +49 30 8104-3804</span></li>
            </ul>
        }
    }

    render() {
        const facilityName = [];
        const facilityInfoElements = this.getFacilityInfoElements(facilityName);

        return (
            <BuildingInfoComponent ref={this.refRoot} id={this.props.popupType} className={'viewDashboardBoxD viewDashboardBuilding'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={320}
                    popupMinHeight={210}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {this.state.kind}{i18n.t('sdms.buildingInfo.정보')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.buildingInfo, false)}></a>
                    </div>

                    {/* <div className={'viewBuildingConts'}>
                        {
                            (this.props.info && this.props.info.length > 0) &&
                            <div ref={this.refTitle} className={'viewBuildingTitle'}>{facilityName[0]}</div>
                        }
                        <Scrollbars ref={this.refScrollbar}>
                            {
                                facilityInfoElements
                            }
                        </Scrollbars>
                    </div> */}

                    <div className={'viewBuildingConts'}>
                        {
                            (this.props.info && this.props.info.length > 0) &&
                            <div ref={this.refTitle} className={'viewBuildingTitle'}>{facilityName[0]}</div>
                        }
                        <span>
                            {
                                facilityInfoElements
                            }
                       </span>
                    </div> 

                </PopupDraggable>
            </BuildingInfoComponent>
        );
    }
}

export default withTranslation()(BuildingInfo);