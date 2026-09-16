import styled from 'styled-components';
import MainResource from '../resource/id';

import myPageIcon from '../images/myPageIcon.svg';
import myPageIconOn from '../images/myPageIconOn.svg';
import statusInfoIcon from '../images/statusInfoIcon.svg';
import assets3DInfoIcon from '../images/assets3DInfoIcon.svg';
import statusInfoIconOn from '../images/statusInfoIconOn.svg';
import assets3DInfoIconOn from '../images/assets3DInfoIconOn.svg';
import dataCenterInfoIcon from '../images/dataCenterInfoIcon.svg';
import dataCenterInfoIconOn from '../images/dataCenterInfoIconOn.svg';
import dataCenterInfoIconDisable from '../images/dataCenterInfoIconDisable.svg';
import goHome from '../images/goHome.svg';
import zoomIn from '../images/zoomIn.svg';
import zoomOut from '../images/zoomOut.svg';
import rotation from '../images/rotation.svg';
import camera360 from '../images/camera360.svg';
import goHome_on from '../images/goHome_on.svg';
import zoomIn_on from '../images/zoomIn_on.svg';
import zoomOut_on from '../images/zoomOut_on.svg';
import rotation_on from '../images/rotation_on.svg';
import camera360_on from '../images/camera360_on.svg';
import viewpoint from '../images/viewpoint.svg';
import viewpoint_on from '../images/viewpoint_on.svg';
import temperature from '../images/temperature.svg';
import temperature_on from '../images/temperature_on.svg';
import close_icon from '../../Common/images/closeIcon.svg';
import search_icon from '../images/search_icon.svg';
import visibleTemperature from '../images/visibleTemperature.svg';
import disableTemperature from '../images/disableTemperature.svg';
import visibleCommunication from '../images/visibleCommunication.svg';
import disableCommunication from '../images/disableCommunication.svg';
import visibleTray from '../images/visibleTray.svg';
import disableTray from '../images/disableTray.svg';
import visibleNameTag from '../images/visibleNameTag.svg';
import disableNameTag from '../images/disableNameTag.svg';
import visible360Camera from '../images/visible360Camera.svg';
import disable360Camera from '../images/disable360Camera.svg';
import visibleWall from '../images/visibleWall.svg';
import disableWall from '../images/disableWall.svg';
import disableFacility from '../images/disableFacility.svg';
import visibleFacility from '../images/visibleFacility.svg';

import assetsPop_icon from '../images/assetsPop_icon.svg';
import arrowDown_icon from '../images/arrowDown_icon.svg';
import arrowDown_focus from '../images/arrowDown_focus.svg';
import pagingArrow_left from '../images/pagingArrow_left.svg';
import pagingArrow_right from '../images/pagingArrow_right.svg';
import powerIcon from '../images/powerIcon.svg';
import temperatureIcon from '../images/temperatureIcon.svg';
import statusInfo_alarm_off from '../images/statusInfo_alarm_off.svg';
import statusInfo_alarm_on from '../images/statusInfo_alarm_on.svg';
import alarmInfoIcon_on from '../images/alarmInfoIcon_on.svg';
import alarmInfoIcon_off from '../images/alarmInfoIcon_off.svg';
import alarm_temperatureIcon from '../images/alarm_temperatureIcon.svg';
import alarm_electricIcon from '../images/alarm_electricIcon.svg';
import imgIcon from '../images/imgIcon.svg';
import imgIcon_on from '../images/imgIcon_on.svg';
import editIcon from '../images/editIcon.svg';
import eyeIcon_on from '../images/eyeIcon_on.svg';
import statusInfoIconDisable from '../images/statusInfoIconDisable.svg';
import assets3DInfoIconDisable from '../images/assets3DInfoIconDisable.svg';
import alarmIcon from '../images/alarmIcon.svg';
import arrow from '../images/arrow.svg';
import arrow_on from '../images/arrow_on.svg';
import noFacilityIcon from '../images/noFacilityIcon.svg';
import starIcon from '../images/starIcon.svg';


/**********************************************************************/
// LNB

export const NavigationBarComponent = styled.nav`
    position: fixed;
    width: 80px;
    height: 100vh;
    background: ${(props) => props.theme.secondary};
    box-shadow: 0px 12px 40px 0px #00000066;
    padding: 34px 0;
    text-align: center;
    z-index: 9999;
    ${(props) => props.theme.flex('space-between', 'center')};
    flex-direction: column;

    .headWrap {

        .logo {
            cursor: pointer;
            margin-bottom: 40px;
    
            h2 {
                font-weight: 700;
                letter-spacing: -0.03em;
                margin-top: 10px;
            }
        }

        .navList {
            display: flex;
            flex-direction: column;
            gap: 28px;
            position: relative;

            .navBtn {
                
                &.off {
                    .statusInfoIcon {
                        background: url(${statusInfoIcon}) no-repeat center center;
                    }
                    .assets3DInfoIcon {
                        background: url(${assets3DInfoIcon}) no-repeat center center;
                    }
                    .dataCenterInfoIcon {
                        background: url(${dataCenterInfoIcon}) no-repeat center center;
                    }
                } 
                
                &.on {
                    .statusInfoIcon {
                        background: url(${statusInfoIconOn}) no-repeat center center;
                    }
                    .assets3DInfoIcon {
                        background: url(${assets3DInfoIconOn}) no-repeat center center;
                    }
                    .dataCenterInfoIcon {
                        background: url(${dataCenterInfoIconOn}) no-repeat center center;
                    }
                } 

                &.disable {
                    pointer-events: none;

                    .statusInfoIcon {
                        background: url(${statusInfoIconDisable}) no-repeat center center;
                    }
                    .assets3DInfoIcon {
                        background: url(${assets3DInfoIconDisable}) no-repeat center center;
                    }
                    .dataCenterInfoIcon {
                        background: url(${dataCenterInfoIconDisable}) no-repeat center center;
                    }
                }
            }
        }
    }

    .myPage {

        > button {
            background: url(${myPageIcon}) no-repeat center center;
        }

        &.on {

            > button {
                background: url(${myPageIconOn}) no-repeat center center;
            }
        }
    }

    .navBtn,
    .myPage {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        background: ${(props) => props.theme.secondary};
        ${(props) => props.theme.flex('center', 'center')};
        cursor: pointer;
        position: relative;

        > button {
            width: 28px;
            height: 28px;
            text-indent: -9999px;
        }

        &.on, 
        &:hover {
            box-shadow: 0px 12px 40px 0px #00000066;
        }

        &.on {
            background: ${(props) => props.theme.background};
        }

        &::before {
            opacity: 0;
            display: none;
            background: ${(props) => props.theme.secondary};
            color: ${(props) => props.theme.fontPrimary};
            position: absolute;
            left: 90px;
            top: 50%;
            transform: translate(0, -50%);
            padding: 8px;
            white-space: nowrap;
            border-radius: 4px;
        }

        &::after {
            content: " ";
            display: none;
            position: absolute;
            border-right: 8px solid ${(props) => props.theme.secondary};
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            left: 84px;
            top: 50%;
            transform: translate(0, -50%);
        }

        &:hover:before,
        &:hover::after {
            opacity: 1;
            z-index: 2;
            display: block;
        }

        &.statusInfo::before {
            content: "랙/통신 장비 관리";
        }

        &.assets3DInfo::before {
            content: "전국 3D 모델 관리";
        }

        &.dataCenterInfo::before {
            content: "국사 정보";
        }

        &.myPage::before {
            content: "마이페이지";
        }
    }
`

/**********************************************************************/
// Toolbar

export const ToolBarComponent = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 8px;
    background: ${(props) => props.theme.secondary};
    z-index: 9999;

    > ul {
        ${(props) => props.theme.flex('center', 'center')};
        gap: 12px;
        padding: 4px 28px;

        li {
            position: relative;

            button {
                width: 40px;
                height: 40px;
                text-indent: -9999px;
                border-radius: 8px;

                &:hover {
                    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
                }
            }

            &::before {
                opacity: 0;
                display: none;
                background: ${(props) => props.theme.secondary};
                color: ${(props) => props.theme.fontPrimary};
                position: absolute;
                left: 50%;
                top: -52px;
                transform: translate(-50%, 0);
                padding: 8px;
                white-space: nowrap;
                border-radius: 4px;
            }

            &::after {
                content: " ";
                display: none;
                position: absolute;
                border-right: 8px solid transparent;
                border-left: 8px solid transparent;
                border-top: 8px solid ${(props) => props.theme.secondary};
                left: 50%;
                top: -24px;
                transform: translate(-50%, 0);
            }

            &:hover:before,
            &:hover::after {
                opacity: 1;
                z-index: 2;
                display: block;
            }

            &.goHome::before {
                content: "초기화면";
            }

            &.zoomIn::before {
                content: "확대";
            }

            &.zoomOut::before {
                content: "축소";
            }

            &.rotation::before {
                content: "자동회전";
            }

            &.camera360::before {
                content: "360도 카메라";
            }

            &.viewpoint::before {
                content: "시점 변경";
            }

            &.temperature::before {
                content: "전체 온도 가시화";
            }
        }

        .goHome {
            > button {
                background: url(${goHome}) no-repeat center center;

                &:active {
                    background: url(${goHome_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 

        .zoomIn {
            > button {
                background: url(${zoomIn}) no-repeat center center;

                &:active {
                    background: url(${zoomIn_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 

        .zoomOut {
            > button {
                background: url(${zoomOut}) no-repeat center center;

                &:active {
                    background: url(${zoomOut_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            } 
        } 

        .rotation {
            > button {
                background: url(${rotation}) no-repeat center center;

                &:active {
                    background: url(${rotation_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 

        .camera360 {
            > button {
                background: url(${camera360}) no-repeat center center;

                &:active {
                    background: url(${camera360_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 

        .viewpoint {
            > button {
                background: url(${viewpoint}) no-repeat center center;

                &:active {
                    background: url(${viewpoint_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 

        .temperature {
            > button {
                background: url(${temperature}) no-repeat center center;

                &:active {
                    background: url(${temperature_on}) no-repeat center center, ${(props) => props.theme.background};
                }
            }
        } 
    }
`;

export const PersonalViewComponent = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 24px;
    background: ${(props) => props.theme.secondary};
    z-index: 9999;
    width: 210px;
    height: 48px;
    ${(props) => props.theme.flex('space-around', 'center')};
    gap: 20px;
    padding: 0 20px;

    > p {
        font-size: 16px;
        font-weight: 500;
        line-height: 172%; /* 27.52px */
        letter-spacing: -0.48px;
        ${(props) => props.theme.flex('center', 'center')};
        gap: 10px;

        &::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(${eyeIcon_on}) no-repeat center center;
        }
    }

    > button {
        text-indent: -9999px;
        background: url(${close_icon}) no-repeat center center;
        width: 12px;
        height: 12px;
    }
`;

export const ThermalViewComponent = styled(PersonalViewComponent)`
    width: 255px;

    > p {
        &::before {
            background: url(${temperature_on}) no-repeat center center;
        }
    }
`;


/**********************************************************************/
// POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: ${(props) => props.theme.secondary};
    border: 1px solid ${(props) => props.theme.primary};
    border-radius: 8px;
    position: absolute;
    ${(props) => props.theme.userSelect()};

    .head {
        padding: 20px;
        ${(props) => props.theme.flex()};

        .title {
            line-height: 18px;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.48px;
            color: ${(props) => props.theme.primary};
        }

        .close {
            display: block;
            width: 24px;
            height: 24px;
            text-indent: -9999px;
            background: url(${close_icon}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        padding: 0 20px 20px 20px;
        height: calc(100% - 77px);
        overflow-y: hidden;
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto !important;
        ${(props) => props.theme.scroll()};
    }
`;

/**********************************************************************/
// 랙/통신 장비 관리

export const StatusInfoComponent = styled(PopupsCommon)`
    width: 340px;
    height: 560px;
    top: 18px;
    left: 100px;

    .head {
        .title {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;

            &::before {
                content: '';
                background: url(${statusInfoIconOn}) no-repeat center center;
                width: 24px;
                height: 24px;
                display: inline-block;
            }
        }
    }

    .body {
        padding: 0 8px 0 20px;

        .dsiScr {
            height: calc(100% - 100px);
        }
    }

    .poiBtnWrap {
        position: relative;
        padding: 8px 12px 8px 8px;
        margin-bottom: 8px;
        background-color: #1A2228;
        border-radius: 8px;

        > div {
            display: block;
            width: 100%;
            text-align: left;
            line-height: 26px;
            cursor: pointer;

            ul {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                li {
                    float: left;
                    margin-right: 8px;

                    label {
                        display: block;
                        float: left;
                        cursor: pointer;
                        margin-left: 4px;
                        margin-right: 2px;
                        position: relative;
                        border-radius: 4px;

                        input[type="checkbox"] {
                            display: none;
                        }

                        &:hover::after {
                            content:attr(data-title); 
                            position: absolute; 
                            white-space: nowrap;
                            height: 8px;
                            line-height: 7px;
                            top: 30px;
                            left: 50%; 
                            transform: translate(-50%, 0);
                            padding: 5px; 
                            background: ${(props) => props.theme.secondary};
                            border-radius: 2px;
                            font-size: 10px; 
                            text-align: center; 
                            z-index: 100;
                        }

                        &:hover::before {
                            content: " ";
                            display: block;
                            position: absolute;
                            border-bottom: 8px solid ${(props) => props.theme.secondary};
                            border-left: 8px solid transparent;
                            border-right: 8px solid transparent;
                            top: 26px;
                            left: 50%; 
                            transform: translate(-50%, 0);
                        }
                    }

                    .visibleTemperature  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleTemperature}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableTemperature {
                        width: 24px;
                        height: 24px;
                        background: url(${disableTemperature}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visibleSignal  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleCommunication}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableSignal {
                        width: 24px;
                        height: 24px;
                        background: url(${disableCommunication}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visibleTray  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleTray}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableTray {
                        width: 24px;
                        height: 24px;
                        background: url(${disableTray}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visibleNameTag  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleNameTag}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableNameTag {
                        width: 24px;
                        height: 24px;
                        background: url(${disableNameTag}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visible360Camera  {
                        width: 24px;
                        height: 24px;
                        background: url(${visible360Camera}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disable360Camera {
                        width: 24px;
                        height: 24px;
                        background: url(${disable360Camera}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visibleWall  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleWall}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableWall {
                        width: 24px;
                        height: 24px;
                        background: url(${disableWall}) no-repeat center center, ${(props) => props.theme.background};
                    }

                    .visibleFacility  {
                        width: 24px;
                        height: 24px;
                        background: url(${visibleFacility}) no-repeat center center, ${(props) => props.theme.secondary};
                    }

                    .disableFacility {
                        width: 24px;
                        height: 24px;
                        background: url(${disableFacility}) no-repeat center center, ${(props) => props.theme.background};
                    }
                }
            }
        }
    }

    .searchWrap {
        position: relative;
        padding: 8px 8px 8px 12px;
        margin-bottom: 8px;
        background-color: #1A2228;
        border-radius: 8px;

        input[type="text"] {
            display: block;
            height: 24px;
            padding: 0 36px 0 0;
            background: none;
            color: #fff;
            font-size: 12px;
            width: 100%;
            border: none;
        }

        > button {
            display: block;
            position: absolute;
            width: 24px;
            height: 24px;
            right: 8px;
            top: 8px;
            border-radius: 4px;
            background: url(${search_icon}) no-repeat center center, ${(props) => props.theme.background};
            text-indent: -9999px;
        }
    }

    .dsiScr {
        display: flex;
        flex-direction: column;
        height: calc(100% - 76px);
        margin-bottom: 5px;
        padding-top: 4px;
    }

    .dsiTree {
        height: 100%;

        li {
            cursor: pointer;
            position: relative;
        }

        > li > p {
            padding: 13px 20px 13px 36px;

            &::before {
                content: '';
                display: inline-block;
                width: 24px;
                height: 24px;
                background-color: ${(props) => props.theme.background};
                border-radius: 4px;
                position: absolute;
                top: 8px;
                left: 0
            }

            &::after {
                content: '>';
                display: inline-block;
                width: 24px;
                height: 24px;
                color: #CECFD2;
                background-color: transparent;
                text-align: center;
                line-height: 24px;
                transform: rotate(0deg);
                transition: transform .35s;
                position: absolute;
                top: 8px;
                left: 0
            }

            &.on {
                color: ${(props) => props.theme.primary};

                &::after {
                    color: ${(props) => props.theme.primary};
                    background-color: transparent;
                    transform: rotate(90deg);
                    transition: transform .35s;
                }
            }
        }
    }

    .tree-1depth {
        display: none;
        padding-right: 10px;

        > li {
            margin-left: 12px;

            > div {
                ${(props) => props.theme.flex()};

                > p {
                    padding: 13px 5px 13px 36px;
    
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        background-color: ${(props) => props.theme.background};
                        border-radius: 4px;
                        position: absolute;
                        top: 8px;
                        left: 0
                    }

                    &::after {
                        content: '>';
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        color: #CECFD2;
                        background-color: transparent;
                        text-align: center;
                        line-height: 24px;
                        transform: rotate(0deg);
                        transition: transform .35s;
                        position: absolute;
                        top: 8px;
                        left: 0
                    }
    
                    &.on {
                        &::after {
                            color: ${(props) => props.theme.primary};
                            background-color: transparent;
                            transform: rotate(90deg);
                            transition: transform .35s;
                        }
                    }
                }
            }

            & .on {
                color: ${(props) => props.theme.primary};
            }
        }
        
        &.on {
            display: block;
        }
    }

    .tree-2depth {
        display: none;

        > li {
            padding: 4px 0;

            > ul {
                ${(props) => props.theme.flex()};
                gap: 1px;
                border-radius: 4px;
                border: 1px solid transparent;

                > li {
                    font-size: 12px;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                    background-color: ${(props) => props.theme.background};
                    text-align: center;
                    flex-grow: 1;
                    padding: 4px 8px;
                    ${(props) => props.theme.overText()};

                    &:nth-child(1) {
                        border-radius: 4px 0 0 4px;
                        width: 12%;
                    }

                    &:nth-child(2) {
                        width: 18%;
                    }

                    &:nth-child(3) {
                        width: 25%;
                    }

                    &:nth-child(4) {
                        width: 15%;
                    }

                    &:nth-child(5) {
                        text-indent: -9999px;
                        position: relative;
                        width: 15%;

                        &::before {
                            content: '';
                            width: 12px;
                            height: 12px;
                            background-color: #37B44A;
                            display: inline-block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-radius: 50%;
                        }
                    }

                    &:nth-child(6) {
                        border-radius: 0 4px 4px 0;
                        text-indent: -9999px;
                        width: 15%;
                        position: relative;

                        &::before {
                            content: '';
                            width: 16px;
                            height: 16px;
                            background: url(${statusInfo_alarm_off}) no-repeat center center;
                            display: inline-block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-radius: 50%;
                        }
                        
                        &.on {
                            &::before {
                                background: url(${statusInfo_alarm_on}) no-repeat center center;
                            }
                        }
                    }
                }

                &:hover {
                    border: 1px solid #035365;
                }

                &.on {
                    border: 1px solid ${(props) => props.theme.primary};
                }
            }
        }

        &.on {
            display: block;
        }
    }
`;

/**********************************************************************/
// 랙 정보
export const RackInfoComponent = styled(PopupsCommon)`
    width: 340px;
    height: 362px;
    top: 595px;
    left: 100px;

    .head {
        position: relative;

        > button {
            position: absolute;
            top: 0;
            right: 0;
            background: url(${imgIcon}) no-repeat center center;
            width: 24px;
            height: 24px;
            text-indent: -9999px;
            top: 22px;
            right: 56px;
            z-index: 2;
        }
    }

    .body {
        position: relative;

        > p {

            &::before {
                content: '>';
                display: inline-block;
                width: 24px;
                height: 24px;
                color: #CECFD2;
                background-color: transparent;
                text-align: center;
                line-height: 24px;
                background-color: ${(props) => props.theme.background};
                border-radius: 4px;
                margin-right: 12px;
                margin-bottom: 14px;
            }
        }

        > ul {

            > li {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 12px;

                &:not(:last-child) {
                    margin-bottom: 12px;
                }

                > p {
                    line-height: 172%;
                }

                > p:nth-child(1) {
                    width: 104px;
                    text-align: center;
                    background-color: ${(props) => props.theme.background};
                    color: #CECFD2;
                    border-radius: 4px;
                }

                > p:nth-child(2) {
                    width: 180px;
                    ${(props) => props.theme.overText()};
                }
            }
        }

        > button {
            line-height: 172%;
            color: #EBEBED;
            position: absolute;
            bottom: 0;
            right: 20px;

            &::after {
                content: '>';
                display: inline-block;
                width: 12px;
                height: 12px;
                color: #EBEBED;
                text-align: center;
                line-height: 12px;
                margin-left: 8px;
            }
        }
    }
`;


/**********************************************************************/
// 랙 상세정보
export const RackDetailInfoComponent = styled(RackInfoComponent)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 766px;

    .body {

        > p {
            &::before {
                margin-bottom: 10px;
            }
        }

        ul {
            li {
                p:nth-child(2) {
                    width: 350px;
                }
            }
        }

        .imgWrap {
            ${(props) => props.theme.flex('center', 'center')};
            gap: 8px;
            margin-bottom: 24px;

            > div {
                background-color: ${(props) => props.theme.background};
                border-radius: 8px;
                width: 50%;
                height: 412px;
                ${(props) => props.theme.flex('center', 'center')};

                > img {
                    height: 90%;
                    object-fit: contain;
                }
            }
        }
    }
`;


/**********************************************************************/
//3D 모델관리 페이지

export const Assets3DInfoComponent = styled(PopupsCommon)`
    width: 1400px;
    height: 840px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .head {
        .title {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;
            
            &::before {
                content: '';
                background: url(${assetsPop_icon}) no-repeat center center;
                width: 24px;
                height: 24px;
                display: inline-block;
            }
        }
    }

    .body {
        overflow: hidden;
    }

    .assetsOptionArea {
        display: flex;
        height: 40px;
        margin-bottom: 4px;

        > div {
            display: flex;
            width: 340px;
            height: 40px;
            align-items: center;
            position: relative;
            z-index: 2;
            
            > span {
                background: ${(props) => props.theme.background};
                display: flex;
                min-width: 80px;
                height: 40px;
                justify-content: center;
                align-items: center;
                color: var(--grayscale-g-50-ebebed, #EBEBED);
                text-align: center;
                font-weight: 500;
                line-height: 172%; 
                letter-spacing: -0.42px;
            }
            
            > button {
                width: 100%;
                height: 40px;
                padding: 8px 16px;
                background: #1A2228 url(${arrowDown_icon}) no-repeat 94% 50%;
                color: #EBEBED;
                font-size: 14px !important;
                line-height: 172%; 
                letter-spacing: -0.42px;
                text-align: left;

                &.on {
                    color: ${(props) => props.theme.primary};
                    background: #1A2228 url(${arrowDown_focus}) no-repeat 94% 50%;
                }
            }

            ul {
                display: none;
                width: ${(props) => props.$section === MainResource.section.item ? '272px' : '341px'};
                max-height: 263px;
                border-radius: 8px;
                padding: 8px 0px;
                border: 1px solid #313644;
                background: #1A2228;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.06), 0px 10px 17px 0px rgba(0, 0, 0, 0.18);
                font-size: 14px;
                position: absolute;
                top: 44px;
                left: 0;
                overflow-x: hidden;
                overflow-y: auto;
                ${(props) => props.theme.scroll()};

                &.on {
                    display: block;
                }

                li {
                    width: 100%;
                    height: 36px;
                    line-height: 150%;
                    border-radius: 5px;
                    letter-spacing: -0.42px;
                    cursor: pointer;

                    > button {
                        width: 100%;
                        height: 100%;
                        text-align: left;
                        padding: 6px 20px;
                        color: #EBEBED;
                    }

                    &:hover {
                        background: ${(props) => props.theme.background};
                    }

                    &:active {
                        button {
                            color: ${(props) => props.theme.primary};
                        }
                    }
                }
            }
        }
        
        > div:nth-child(1){
            border-radius: 8px 0px 0px 8px;
            
            > span:nth-child(1){
                border-radius: 8px 0px 0px 8px;
            }
        }

        > div:last-child {
            button {
                border-radius: 0px 8px 8px 0px;
            }
        }
    }
    
    .assetsSearch{
        display: flex;
        height: 40px;
        align-items: center;
        border-radius: 8px;
        background: #1A2228;
        padding: 8px 8px 8px 16px;
        margin-bottom: 32px;
        position: relative;

        input[type="text"] {
            display: block;
            height: 24px;
            padding: 0 36px 0 0;
            background: none;
            color: #fff;
            font-size: 12px;
            width: 100%;
            border: none;
        }

        > button {
            display: block;
            position: absolute;
            width: 24px;
            height: 24px;
            right: 8px;
            top: 8px;
            border-radius: 4px;
            background: url(${search_icon}) no-repeat center center, ${(props) => props.theme.background};
            text-indent: -9999px;
        }
    }

    .assetsTable{
        display: table;
        width: 100%;
        
        thead tr{
            width: 1208px;
            height: 40px;
            line-height: 40px;
            background: ${(props) => props.theme.background};
            border-radius: 8px;
        }

        thead tr th{
            color: var(--grayscale-g-50-ebebed, #EBEBED);
            text-align: center;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            letter-spacing: -0.42px;
        } 

        thead tr th:nth-child(1){
            border-radius: 8px 0px 0px 8px;
        }

        thead tr th:last-child{
            border-radius: 0px 8px 8px 0px;
        }

        tbody tr{
            height: 52px;
            line-height: 52px;
            border-bottom: 1px solid ${(props) => props.theme.background};
        }

        tbody tr:last-child{
            border-bottom: none;
        }

        tbody tr td{
            text-align: center;
            ${(props) => props.theme.overText()};
        }
    }

    .pagination{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-top: 32px;
        flex-shrink: 0;

        .firstBtn{
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(${pagingArrow_left}) no-repeat center center;
            margin-right: 12px;
            cursor: pointer;
        }

        > div > button{
            padding: 4px 6px;
            margin-right: 20px;
            cursor: pointer;

            &.on{
                border-radius: 6px;
                border: 1px solid ${(props) => props.theme.primary};
            }
        }

        > div > button:last-child{
            margin-right: 0px;
        }

        .nextBtn{
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(${pagingArrow_right}) no-repeat center center;
            margin-left: 12px;
            cursor: pointer;
        }
    }

    .nopowerEquipmentInfo {
        height: 75%;
        ${(props) => props.theme.flex('center', 'center')};

        > p {
            font-size: 16px;
            line-height: 172%;
            ${(props) => props.theme.flex('center', 'center')};
            flex-direction: column;
            gap: 20px;

            &::before {
                content: '';
                display: block;
                width: 80px;
                height: 80px;
                border-radius: 999px;
                background: url(${noFacilityIcon}) no-repeat center center rgba(255, 255, 255, 0.10);
            }
        }
    }
`;

// 통신 장비 정보
export const SignalDeviceInfoComponent = styled(RackInfoComponent)`
    height: 470px;

    .temperature,
    .power {
        
        > div {
            width: calc(100% - 118px);
            ${(props) => props.theme.flex()};

            p:nth-child(2) {
                font-size: 12px;
                color: #A6A9AF;
            }
        }
    }

    .temperature {
        > div > p:nth-child(1) {
            color: #FBB03B;
        }
    }

    .power {
        > div > p:nth-child(1) {
            color: ${(props) => props.theme.primary};
        }
    }

    .body {
        ul {
            li {
                p:nth-child(2) {
                    ${(props) => props.theme.overText()};
                }
            }
        }
    }
`;


/**********************************************************************/
// 통신 장비 상세정보 
export const SignalDeviceDetailInfoComponent = styled(RackInfoComponent)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 778px;

    .body {

        > p {
            &::before {
                margin-bottom: 10px;
            }
        }

        ul {
            li {
                p:nth-child(2) {
                    width: 350px;
                }
            }
        }

        .imgWrap {
            margin-bottom: 24px;

            > div {
                background-color: ${(props) => props.theme.background};
                border-radius: 8px;
                width: 100%;
                height: 240px;
                ${(props) => props.theme.flex('center', 'center')};

                > img {
                    width: 90%;
                    height: 80%;
                    object-fit: contain;
                }
            }
        }

        .chartWrap {
            ${(props) => props.theme.flex('center', 'center')};
            gap: 8px;
            margin-top: 25px;

            > div {
                background-color: ${(props) => props.theme.background};
                border-radius: 8px;
                width: 50%;
                height: 128px;
                ${(props) => props.theme.flex()};
                padding: 20px 17px;

                .chart {
                    position: relative;
                }

                .info {
                    text-align: center;
                    width: 100px;

                    > p {
                        white-space: nowrap;
                    }

                    p:nth-child(1) {
                        ${(props) => props.theme.flex('center', 'center')};
                        line-height: 172%;
                        font-size: 16px;
                        font-weight: 500;
                        
                        &::before {
                            content: '';
                            width: 8px;
                            height: 8px;
                            border-radius: 2px;
                            margin-right: 8px;
                        }
                    }

                    p:nth-child(2) {
                        font-size: 10px;
                        color: #787C87;
                        line-height: 140%;
                        letter-spacing: -0.72px;
                    }
                }
            }

            .temperature {

                .chart {
                    position: relative;

                    &::before {
                        content: '';
                        width: 12px;
                        height: 27px;
                        background: url(${temperatureIcon}) no-repeat center center;
                        position: absolute;
                        top: 31px;
                        left: 38px;
                    }
                }

                .info {
                    p:nth-child(1) {
                        &::before {
                            background: #FBB03B;
                        }
                    }
                }
            }

            .powerConsumption {

                .chart {
                    position: relative;
                    
                    &::before {
                        content: '';
                        width: 23px;
                        height: 25px;
                        background: url(${powerIcon}) no-repeat center center;
                        position: absolute;
                        top: 31px;
                        left: 32px;
                    }
                }

                .info {
                    p:nth-child(1) {
                        &::before {
                            background: #4BE5DD;
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 알람 정보
export const AlarmInfoComponent = styled.div`
    position: fixed;
    top: 75px;
    right: 28px;

    .btnWrap {
        > button {
            text-indent: -9999px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: ${(props) => props.theme.secondary} url(${alarmInfoIcon_off}) no-repeat center center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            cursor: default;
            border: 1px solid #444A57;
        }
    
        .badge {
            visibility: hidden;
            position: absolute;
            top: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 1px solid #fff;
            background-color: ${(props) => props.theme.error};
            ${(props) => props.theme.flex('center', 'center')};
        }

        &.on {
            .badge {
                visibility: visible;
            }

            > button {
                background: ${(props) => props.theme.secondary} url(${alarmInfoIcon_on}) no-repeat center center;
                cursor: pointer;
            }

            &:hover > button {
                background: ${(props) => props.theme.background} url(${alarmInfoIcon_on}) no-repeat center center;
            }
        }
    }

    .cardWrap {
        position: absolute;
        top: 0;
        right: 60px;
        cursor: pointer;

        > div {
            width: 224px;
            padding: 16px;
            ${(props) => props.theme.flex('center', 'flex-start')};
            flex-direction: column;
            gap: 8px;
            border-radius: 8px;
            background: ${(props) => props.theme.secondary};
            position: relative;

            &:not(:last-child) {
                margin-bottom: 4px;
            }

            > p {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 8px;

                &::before {
                    content: '';
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                }

                &.temperature::before {
                    background: url(${alarm_temperatureIcon}) no-repeat center center;
                }

                &.power::before {
                    background: url(${alarm_electricIcon}) no-repeat center center;
                }
            }

            > ul {

                > li {
                    font-size: 12px;
                    line-height: 170%;
                }
            }

            > button {
                position: absolute;
                top: 14px;
                right: 16px;
                padding: 4px 8px;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                font-size: 12px;
                line-height: 170%;
                ${(props) => props.theme.flex('center', 'center')};
                gap: 8px;

                &::after {
                    content: '';
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: url(${arrow}) no-repeat center center;
                }

                &.on {
                    color: ${(props) => props.theme.primary};

                    &::after {
                        background: url(${arrow_on}) no-repeat center center;
                    }
                }
            }

            &.on {
                background: ${(props) => props.theme.background};
            }
        }
    }
`;


/**********************************************************************/
// 현장이미지 보기
export const ViewImgComponent = styled(RackInfoComponent)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1400px;
    height: 840px;

    .head {
        .title {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;

            &::before {
                content: '';
                width: 24px;
                height: 24px;
                display: inline-block;
                background: url(${imgIcon_on}) no-repeat center center;
            }
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .contentWrap {
            ${(props) => props.theme.flex()};
            gap: 12px;

            .content {
                background-color: rgba(255, 255, 255, 0.10);
                border-radius: 8px;
                flex: 1;
                height: 368px;

                .titleWrap {
                    ${(props) => props.theme.flex()};
                    padding: 12px;

                    > p {
                        background: ${(props) => props.theme.secondary};
                        border-radius: 4px;
                        padding: 4px 12px;
                        font-weight: 500;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                    }

                    > button {
                        background: url(${editIcon}) no-repeat center center, ${(props) => props.theme.secondary};
                        border-radius: 4px;
                        padding: 4px 12px;
                        text-indent: -9999px;
                        width: 32px;
                        height: 32px;
                    }
                }

                .imgWrap {
                    height: calc(100% - 56px);
                    padding: 0 30px 30px 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    > img {
                        height: 90%;
                        object-fit: contain;
                    }
                }
            }
        }
    }

`;


/**********************************************************************/
// 알람 상세정보 
export const AlarmDetailInfoComponent = styled(RackInfoComponent)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1400px;
    height: 840px;

    .head {
        .title {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;

            &::before {
                content: '';
                width: 24px;
                height: 24px;
                display: inline-block;
                background: url(${alarmIcon}) no-repeat center center;
            }
        }
    }

    .body {
        ${(props) => props.theme.flex()};
        flex-direction: row;
        gap: 20px;
        overflow: hidden;
        height: calc(100% - 68px);
        
        .alarmInfoWrap {
            ${(props) => props.theme.flex()};
            gap: 12px;
            height: 100%;

            > div {
                background-color: #1A2228;
                border-radius: 8px;
                width: 100%;
                height: 100%;

                &.position {
                    width: 650px;
                }

                &.rack {
                    width: 360px;
                }

                .headWrap {
                    ${(props) => props.theme.flex()};
                    padding: 12px;

                    > div {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 4px;

                        > p {
                            padding: 4px 12px;
                            font-weight: 500;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;

                            &:nth-child(1) {
                                background-color: ${(props) => props.theme.background};
                                border-radius: 4px;
                            }
                        }
                    }

                    > button {
                        padding: 4px 8px;
                        background-color: rgba(255, 255, 255, 0.05);
                        border-radius: 6px;
                        font-size: 12px;
                        line-height: 170%;
                        ${(props) => props.theme.flex('center', 'center')};
                        gap: 8px;

                        &::after {
                            content: '';
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            background: url(${imgIcon}) no-repeat center center;
                            background-size: contain;
                        }
                    }
                }

                .imgWrap {
                    ${(props) => props.theme.flex('center', 'center')};
                    height: calc(100% - 56px);
                    padding: 0 50px;
    
                    > img {
                        height: 85%;
                        object-fit: contain;
                    }
                }
            }
        }

        .itemInfoWrap {
            width: 320px;
            width: 320px;
            ${(props) => props.theme.flex()};
            flex-direction: column;
            height: 100%;

            .itemDetailWrap {
                width: 100%;
    
                > p:nth-child(1) {
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 20px;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20.5px;
    
                    &::before {
                        content: '';
                        width: 40px;
                        height: 40px;
                        display: inline-block;
                    }
    
                    &.temperature::before {
                        background: url(${alarm_temperatureIcon}) no-repeat center center;
                        background-size: cover;
                    }
    
                    &.power::before {
                        background: url(${alarm_electricIcon}) no-repeat center center;
                        background-size: cover;
                    }
                }
    
                > p:nth-child(2) {
    
                    &::before {
                        content: '>';
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        color: #CECFD2;
                        background-color: transparent;
                        text-align: center;
                        line-height: 24px;
                        background-color: #1A2228;
                        border-radius: 4px;
                        margin-right: 12px;
                        margin-bottom: 14px;
                    }
                }
    
                > ul {
    
                    > li {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 12px;
    
                        &:not(:last-child) {
                            margin-bottom: 12px;
                        }
    
                        > p {
                            line-height: 172%;
                        }
    
                        > p:nth-child(1) {
                            width: 104px;
                            text-align: center;
                            background-color: #1A2228;
                            color: #CECFD2;
                            border-radius: 4px;
                        }
    
                        > p:nth-child(2) {
                            width: 200px;
                            ${(props) => props.theme.overText()};
                        }
                    }
    
                    .temperature,
                    .power {
                        
                        > div {
                            width: calc(100% - 118px);
                            ${(props) => props.theme.flex()};
    
                            p:nth-child(2) {
                                font-size: 12px;
                                color: #A6A9AF;
                            }
                        }
                    }
    
                    .temperature {
                        > div > p:nth-child(1) {
                            color: #FBB03B;
                        }
                    }
    
                    .power {
                        > div > p:nth-child(1) {
                            color: ${(props) => props.theme.primary};
                        }
                    }
                }
            }

            .historyWrap {
                margin-top: 18px;

                > textarea {
                    width: 320px;
                    height: 175px;
                    padding: 8px 20px;
                    border-radius: 4px;
                    background-color: #1A2228;
                    border: 0;
                    color: #fff;
                }

                > p {
                    width: 320px;
                    ${(props) => props.theme.flex('flex-end', 'center')};
                    gap: 20px;
                    font-size: 12px;
                    line-height: 170%;
                    color: #A6A9AF;
                    margin-bottom: 16px;
                }

                > button {
                    width: 320px;
                    height: 36px;
                    ${(props) => props.theme.flex('center', 'center')};
                    background: ${(props) => props.theme.primary};
                    color: #171D23;
                    font-weight: 700;
                    border-radius: 4px;
                }
            }
        }
    }
`;


/**********************************************************************/
// 설비 정보
export const FacilityInfoComponent = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
    
    > img {
        max-width: 600px;
    }

    > button {
        width: 40px;
        height: 40px;
        background: transparent;
        text-indent: -9999px;
        position: absolute;
        top: 0;
        right: 0;
    }
`;

export const NoFacilityInfoComponent = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 340px;
    height: 240px;
    border-radius: 8px;
    background: #193D51;
    ${(props) => props.theme.flex('center', 'center')};
    padding-top: 10px;
    
    > p {
        font-size: 16px;
        line-height: 172%;
        ${(props) => props.theme.flex('center', 'center')};
        flex-direction: column;
        gap: 20px;

        &::before {
            content: '';
            display: block;
            width: 80px;
            height: 80px;
            border-radius: 999px;
            background: url(${noFacilityIcon}) no-repeat center center rgba(255, 255, 255, 0.10);
        }
    }

    .close {
        display: block;
        width: 24px;
        height: 24px;
        text-indent: -9999px;
        background: url(${close_icon}) no-repeat center center;
        z-index: 1;
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }
`;


/**********************************************************************/
// 국사 정보
export const DataCenterInfoComponent = styled(RackInfoComponent)`
    height: 596px;
    top: 464px;

    .body {

        > div {
            margin-top: 20px;
            ${(props) => props.theme.flex('flex-start', 'center')};
            
            > p:nth-child(1) {
                margin-right: 8px;

                &::before {
                    content: '>';
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    color: #CECFD2;
                    background-color: transparent;
                    text-align: center;
                    line-height: 24px;
                    background-color: ${(props) => props.theme.background};
                    border-radius: 4px;
                    margin-right: 12px;
                    margin-bottom: 14px;
                }
            }

            > span:nth-child(2),
            > span:nth-child(3) {
                margin-bottom: 14px;
                color: #FBB03B;
                font-weight: 500;
            }

            > span:nth-child(3)::before {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                background: url(${starIcon}) no-repeat center center;
                padding: 0 3px;
            }
        }

        > ul {
            > li {
                > p:nth-child(2) {
                    width: 200px;
                    letter-spacing: -0.42px;
                }
            }
        }
    }
`;