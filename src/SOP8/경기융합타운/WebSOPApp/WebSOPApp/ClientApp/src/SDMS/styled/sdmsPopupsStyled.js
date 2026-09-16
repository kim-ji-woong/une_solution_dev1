import styled, { keyframes } from "styled-components";

import dashboard_layer_close from '../images/dashboard_layer_close.png';
import lineLeft from '../images/lineLeft.svg';
import lineRight from '../images/lineRight.svg';
import contentBoxEl from '../images/contentBoxEl.svg';
import contentBoxEl_red from '../images/contentBoxEl_red.svg';
import poi_zoneName from '../images/poi_zoneName.svg';
import poi_cctv from '../images/poi_cctv.svg';
import poi_parkingLot from '../images/poi_parkingLot.svg';
import poi_fire from '../images/poi_fire.svg';
import poi_emergencyBell from '../images/poi_emergencyBell.svg';

import building_icon from '../images/building_icon.svg';
import treeArrow from '../images/treeArrow.svg';
import receiver_icon from '../images/receiver_icon.svg';
import member_check_on from '../images/member_check_on.svg';
import member_check_off from '../images/member_check_off.svg';
import rangeFinding from '../images/rangeFinding.svg';
import keyMap from '../images/keyMap.svg';
import keyMap_plus from '../images/keyMap_plus.svg';
import initialSituation from '../images/initialSituation.svg';
import sound from '../images/sound.svg';
import shutdown from '../images/shutdown.svg';

import nav_statusInfo_off from '../images/nav_statusInfo_off.svg';
import nav_statusInfo_on from '../images/nav_statusInfo_on.svg';
import nav_weatherInfo_off from '../images/nav_weatherInfo_off.svg';
import nav_weatherInfo_on from '../images/nav_weatherInfo_on.svg';
import nav_dashboard_off from '../images/nav_dashboard_off.svg';
import nav_dashboard_on from '../images/nav_dashboard_on.svg';
import nav_event_off from '../images/nav_event_off.svg';
import nav_event_on from '../images/nav_event_on.svg';
import nav_manualReport_off from '../images/nav_manualReport_off.svg';
import nav_manualReport_on from '../images/nav_manualReport_on.svg';
import nav_background_on from '../images/nav_background_on.svg';
import nav_background_off from '../images/nav_background_off.svg';

import eventDashboardIcon from '../images/eventDashboardIcon.svg';

import wonik_dashboard_event_fire from '../images/wonik_dashboard_event_fire.png';
import wonik_sopIcon from '../images/wonik_sopIcon.png';
import wonik_event_endIcon from '../images/wonik_event_endIcon.png';
import wonik_event_menoIcon from '../images/wonik_event_menoIcon.png';
import wonik_event_soundIcon from '../images/wonik_event_soundIcon.png';
import wonik_event_soundOff from '../images/wonik_event_soundOff.png';
import wonik_event_sreenIcon from '../images/wonik_event_sreenIcon.png';



import dashboard_search from '../../Account/images/dashboard_search.png';
import popup_background from '../../Settings/images/popup_background.png';
import sortIcon from '../../Settings/images/sortIcon.svg';

import wonik_dashboard_navigator from '../images/wonik_dashboard_navigator.png';
import dashboard_nav_ico01 from '../images/dashboard_nav_ico01.png';
import dashboard_nav_ico02 from '../images/dashboard_nav_ico02.png';
import dashboard_nav_ico03 from '../images/dashboard_nav_ico03.png';
import dashboard_nav_ico04 from '../images/dashboard_nav_ico04.png';
import dashboard_nav_ico05 from '../images/dashboard_nav_ico05.png';
import dashboard_nav_ico06_on from '../images/dashboard_nav_ico06_on.png';
import dashboard_nav_ico06_off from '../images/dashboard_nav_ico06_off.png';
import SdmsResource from "../resource/id";

import wonik_quickButton_statusInfo_on from '../../Common/image/icon/QuickButton/wonik_quickButton_statusInfo_on.png';
import wonik_quickButton_statusInfo_off from '../../Common/image/icon/QuickButton/wonik_quickButton_statusInfo_off.png';
import wonik_quickButton_cctv_on from '../../Common/image/icon/QuickButton/wonik_quickButton_cctv_on.png';
import wonik_quickButton_cctv_off from '../../Common/image/icon/QuickButton/wonik_quickButton_cctv_off.png';
import wonik_quickButton_dashBoard_on from '../../Common/image/icon/QuickButton/wonik_quickButton_dashBoard_on.png';
import wonik_quickButton_dashBoard_off from '../../Common/image/icon/QuickButton/wonik_quickButton_dashBoard_off.png';
import wonik_quickButton_event_on from '../../Common/image/icon/QuickButton/wonik_quickButton_event_on.png';
import wonik_quickButton_event_off from '../../Common/image/icon/QuickButton/wonik_quickButton_event_off.png';
import wonik_quickButton_miniMap_on from '../../Common/image/icon/QuickButton/wonik_quickButton_miniMap_on.png';
import wonik_quickButton_miniMap_off from '../../Common/image/icon/QuickButton/wonik_quickButton_miniMap_off.png';
import wonik_manualReportIcon_on from '../../Common/image/icon/QuickButton/wonik_manualReportIcon_on.png';
import wonik_manualReportIcon_off from '../../Common/image/icon/QuickButton/wonik_manualReportIcon_off.png';
import wonik_editModeIcon_on from '../../Common/image/icon/QuickButton/wonik_editModeIcon_on.png';
import wonik_editModeIcon_off from '../../Common/image/icon/QuickButton/wonik_editModeIcon_off.png';
import gyeonggi_waterLevel_on from '../../Common/image/icon/QuickButton/gyeonggi_waterLevel_on.png';
import gyeonggi_waterLevel_off from '../../Common/image/icon/QuickButton/gyeonggi_waterLevel_off.png';
import gyeonggi_electric_on from '../../Common/image/icon/QuickButton/gyeonggi_electric_on.png';
import gyeonggi_electric_off from '../../Common/image/icon/QuickButton/gyeonggi_electric_off.png';
import gyeonggi_ev_on from '../../Common/image/icon/QuickButton/gyeonggi_ev_on.png';
import gyeonggi_ev_off from '../../Common/image/icon/QuickButton/gyeonggi_ev_off.png';

import elevatorInfo_up_run from '../images/elevatorInfo_up_run.png';
import elevatorInfo_down_run from '../images/elevatorInfo_down_run.png';
import waterLevel_line_low from '../images/waterLevel_line_low.png';
import waterLevel_background from '../images/waterLevel_background.png';
import waterLevel_cont_high from '../images/waterLevel_cont_high.png';
import waterLevel_cont_high_under from '../images/waterLevel_cont_high_under.png';
import waterLevel_cont_low from '../images/waterLevel_cont_low.png';
import waterLevel_element from '../images/waterLevel_element.png';
import waterLevel_line_default from '../images/waterLevel_line_default.png';
import waterLevel_line_high from '../images/waterLevel_line_high.png';

// 이벤트 대시보드 hide animation
const fadeOut = keyframes`
    0% {
        top: 60px;
        opacity: 1;
        display: block;
    }
    100% {
        top: 10px;
        opacity: 0;
        display: none;
    }
`

// 이벤트 현황 팝업 slide animation
const slideDown = keyframes`
    0% {
        height: 0;
        display: none;
    }
    100% {
        height: 32.53px;
        display: block;
    }
`

const slideUp = keyframes`
    0% {
        height: 32.53px;
        display: block;
    }
    100% {
        height: 0;
        display: none;
    }
`

//대기센서창 
const chartAnimateBest = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100%;
    }
    100% {
        width: 25%;
    }
`;


const chartAnimateNormal = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100%;
    }
    100% {
        width: 50%;
    }
`;

const chartAnimateBad = keyframes`
    0% {
        width: 0px;
    }
    50% {
        width: 100px;
    }
    100% {
        width: 50;
    }
`;

const chartAnimateVeryBad = keyframes`
    0% {
        width: 0px;
    }
    100% {
        width: 100%;
    }
`;


/**********************************************************************/
// Content3D

const alarmAnimation = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.8;
    }
    100% {
        opacity: 0;
    }
`

export const Contents3DComponent = styled.main`
    min-width: 1900px;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .clfix:after {
        display: block;
        content: '';
        clear: both;
    }

    #dsSoulBot {
        position: fixed;
        z-index: 1;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 20px;
    }

    #dsSoulBot button {
        display: block;
        background: #25343d;
        width: 100%;
        height: 20px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    #dsSoulBot button.edit {
        width: 70%;
        position: absolute;
        left: 50%;
        top: -20px;
        transform: translateX(-50%);
    }

    #dsSoulBot ~ ul {
        position: absolute;
        left: 50%;
        bottom: 30px;
        transform: translate(-50%, 0);
        z-index: 2;

        display: flex !important;

        justify-content: center;
        align-items: center;
    }

    #dsSoulBot ~ ul.edit {
        left: 114px;
    }

    #dsSoulBot ~ ul:after {
        content: "";
        display: table;
        clear: both;
    }

    #dsSoulBot ~ ul li {
        float: left;
        padding: 0 2px;
        position: relative;
    }

    #dsSoulBot ~ ul li a {
        display: table;
        width: 50px;
        height: 50px;
        border: solid 1px #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    #dsSoulBot ~ ul li a span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 1.1em;
    }

    #dsSoulBot ~ ul li a span em {
        display: none;
    }

    #dsSoulBot ~ ul li a:hover {
        background: rgba(39, 46, 66, 1) !important;
    }

    #dsSoulBot ~ ul li a:hover em {
        display: block;
    }

    .shortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -5px;
        top: -5px;
        z-index: 1;
        text-align: center;
        padding-top: 8%;
        font-size: 10px;
        opacity: 0.8;
    }

    .hideKey {
        visibility: hidden;
    }

    .on.statusInfoIcon {
        background: url(${wonik_quickButton_statusInfo_on}) no-repeat center center;
        position: relative;
    }

    .off.statusInfoIcon {
        background: url(${wonik_quickButton_statusInfo_off}) no-repeat center center;
        position: relative;
    }

    .on.cctvInfoIcon {
        background: url(${wonik_quickButton_cctv_on}) no-repeat center center;
        position: relative;
    }

    .off.cctvInfoIcon {
        background: url(${wonik_quickButton_cctv_off}) no-repeat center center;
        position: relative;
    }

    .on.dashboardIcon {
        background: url(${wonik_quickButton_dashBoard_on}) no-repeat center center;
        position: relative;
    }

    .off.dashboardIcon {
        background: url(${wonik_quickButton_dashBoard_off}) no-repeat center center;
        position: relative;
    }

    .on.eventIcon {
        background: url(${wonik_quickButton_event_on}) no-repeat center center;
        position: relative;
    }

    .off.eventIcon {
        background: url(${wonik_quickButton_event_off}) no-repeat center center;
        position: relative;
    }

    .on.miniMapIcon {
        background: url(${wonik_quickButton_miniMap_on}) no-repeat center center;
        position: relative;
    }

    .off.miniMapIcon {
        background: url(${wonik_quickButton_miniMap_off}) no-repeat center center;
        position: relative;
    }

    .on.manualReportIcon {
        background: url(${wonik_manualReportIcon_on}) no-repeat center center;
        position: relative;
    }

    .off.manualReportIcon {
        background: url(${wonik_manualReportIcon_off}) no-repeat center center;
        position: relative;
    }

    .on.editModeIcon {
        background: url(${wonik_editModeIcon_on}) no-repeat center center;
        position: relative;
    }

    .off.editModeIcon {
        background: url(${wonik_editModeIcon_off}) no-repeat center center;
        position: relative;
    }

    .on.waterLevelIcon {
        background: url(${gyeonggi_waterLevel_on}) no-repeat center center;
        position: relative;
    }
    .off.waterLevelIcon {
        background: url(${gyeonggi_waterLevel_off}) no-repeat center center;
        position: relative;
    }
    .on.electricIcon {
        background: url(${gyeonggi_electric_on}) no-repeat center center;
        position: relative;
    }
    .off.electricIcon {
        background: url(${gyeonggi_electric_off}) no-repeat center center;
        position: relative;
    }
    .on.elevatorIcon {
        background: url(${gyeonggi_ev_on}) no-repeat center center;
        position: relative;
    }
    .off.elevatorIcon {
        background: url(${gyeonggi_ev_off}) no-repeat center center;
        position: relative;
    }

    .contents3DArea {
        /*메인배경*/
        display: flex;
        flex-direction: column;
        /*justify-content: space-around;*/
        flex-wrap: wrap;
        background-color: #f8faff;
        top: -20px;
        height: 100%;
        /*width: calc(100% -50px);*/
        width: 100%;
        /*padding-left:50px;*/
        align-content: center;
        padding-top: 20px;
        position: relative;
        /*box-shadow: 0px 2px 15px 0px rgb(0 0 0 / 10%);*/
        cursor: default;
    }

    .contents3DArea.loading {
        cursor: wait;
    }
    
    .contents3DArea canvas {
        position: absolute;
        left: 0;
    }

    #areaInput {
        position: absolute;
        border-radius: 5px;
        display: block;
        border: solid 2px #3999ed;
        width: 100px !important;
    }

    #areaInputHidden {
        display: none;
    }

    .alarmedPoiImgs {
        width: 32px !important;
        height: 32px !important;
        border: #ff0000 2px solid;
        z-index: 4;
        position: absolute;
        pointer-events: auto !important;
    }

    .alarmedPoiImgs_img {
        width: 32px;
        height: 32px;
        position: absolute;
        background: #ff0000;
        z-index: 5;
        animation: ${alarmAnimation} 1s infinite ;
    }
`;


/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: rgba(14, 22, 45, .85);
    position: relative;
    cursor: default;
    opacity: 1;
    border-radius: 10px;
    border: 2px solid #FFFFFF1A;
    backdrop-filter: blur(3px);
    ${(props) => props.theme.userSelect()};

    .dslTop {
        padding: 10px 20px;
        position: relative;
        ${(props) => props.theme.flex()};
        background: rgba(255, 255, 255, .1) 0% 0% no-repeat padding-box;
        
        .dslTitle {
            font-size: 16px;
            font-weight: 700;
            color: ${(props) => props.theme.primary};
        }

        input[type=range] {
            width: 50px;
            height: 3px;
            background-color: ${(props) => props.theme.primary};
            cursor: pointer; 
            -webkit-appearance: none;
            position: absolute;
            right: 50px;
            z-index: 1;
        }

        input[type=range]:focus {
            outline: none;
        }

        input[type=range]::-webkit-slider-thumb { 
            -webkit-appearance: none;
            background: ${(props) => props.theme.primary};
            cursor: pointer;
            height: 8px; 
            width: 2px;   
        }

        .dslX {
            width: 12px;
            height: 12px;
            text-indent: -9999px;
            background: url(${dashboard_layer_close}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        padding: 20px;
        height: calc(100% - 42px);

        &, & * {
            font-size: 12px;
        }

        .contentBox {
            position: relative;

            .contentName {
                font-weight: 700;
            }
        }
    }

    #tooltip {
        margin-left: 5px;
        cursor: help;
    }

    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        bottom: 130%;
        left: -50%;
        margin-bottom: 4px;
        padding: 5px 10px;
        white-space: nowrap;
        border-radius: 3px;
        background-color: ${(props) => props.theme.fontPrimary};
        color: #424242;
        font-size: 12px;
        font-weight: 500;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        bottom: 130%;
        left: 50%;
        margin-left: -5px;
        width: 0;
        border-top: 5px solid ${(props) => props.theme.fontPrimary};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto !important;
        ${(props) => props.theme.scroll()};
    }

`;


/**********************************************************************/
// 현황정보

export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 600px;
    top: 7%;
    left: 1%;

    .contentBox {
        
        &.flex {
            ${(props) => props.theme.flex()};
            margin-bottom: 10px;
        }

        &.sensor {
            height: calc(100% - 65px);
        }

        .poiWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
        }

        > ul {
            ${(props) => props.theme.flex()};
            gap: 5px;

            > li > label {
                display: block;
                position: relative;
                cursor: pointer;

                input[type="checkbox"] {
                    display: none;
                } 

                &:hover::after {
                    content:attr(data-title); 
                    position: absolute; 
                    white-space: nowrap;
                    line-height: 10px;
                    top: 32px;
                    left: 50%; 
                    transform: translate(-50%, 0);
                    padding: 7px 10px;
                    background: #fff; 
                    border-radius: 2px;
                    font-size: 12px; 
                    font-weight: 500;
                    color: #424242;
                    text-align: center; 
                    z-index: 100;
                }

                &:hover::before {
                    content: " ";
                    position: absolute;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                    border-bottom: 5px solid #fff;
                    top: 28px;
                    left: 50%; 
                    transform: translate(-50%, 0);
                }
            }
        }

        .visibleFire,
        .disableFire {
            background: url(${poi_fire}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleEmergencyBell,
        .disableEmergencyBell {
            background: url(${poi_emergencyBell}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleParkingLot,
        .disableParkingLot {
            background: url(${poi_parkingLot}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleCCTV,
        .disableCCTV {
            background: url(${poi_cctv}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleZoneName,
        .disableZoneName {
            background: url(${poi_zoneName}) no-repeat center center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
        }

        .visibleFire,
        .visibleCCTV,
        .visibleEmergencyBell,
        .visibleParkingLot,
        .visibleZoneName {
            background-color: ${(props) => props.theme.primary};
        }

        .disableFire,
        .disableCCTV,
        .disableEmergencyBell,
        .disableParkingLot,
        .disableZoneName {
            background-color: #7C8DA9;
        }
    }

    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin: 10px 0;

        input {
            height: 34px !important;
            color: #fff;
            font-size: 12px;
            background: ${(props) => props.theme.background} 0% 0% no-repeat padding-box;
            border: 1px solid #525868;
            border-radius: 5px 0 0 5px;
            opacity: 1;
            border-right: 0;
            padding: 0 10px;
        }

        button {
            display: block;
            width: 34px;
            height: 34px;
            position: absolute;
            right: 0;
            top: 0;
            text-indent: -9999px;
            background: ${(props) => props.theme.background} url(${dashboard_search}) no-repeat center center;
            border-radius: 0 2px 2px 0;
            border: 1px solid #525868;
        }
    }

    .treeWrap {
        margin-top: 5px;
        height: calc(100% - 50px);
        margin-bottom: 5px;
    }

    .dsiTree {
        padding: 0 5px 0 0;
        font-family: "dotum", sans-serif;
        font-size: 12px;
    }

    .dsiTree h5 {
        font-size: 12px;
        font-weight: 400;
    }

    .dsiTree h5:after {
        content: "";
        display: table;
        clear: both;
    }

    .dsiTree > li .viewListConts {
        display: none;
        padding: 0;
        color: #fff;
    }

    .dsiTree > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li {
    }

    .dsiTree > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li > ul > li > a {
        color: #fff;
        line-height: 1.8em;
        display: inline-block;
        padding-left: 5px;
    }

    .dsiTree > li > ul > li > ul > li > a:focus,
    .dsiTree > li > ul > li > ul > li > a:active,
    .dsiTree > li > ul > li > ul > li > a:hover {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > ul > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul > li > ul > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li > ul > li > ul > li {
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > ul > li > ul > li ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li .viewListConts.on {
        display: block;
    }

    .dsiTree > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > h5 > span.on:before {
        content: "▼";
    }

    .dsiTree > li > ul > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span.on:before {
        content: "▼";
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span.on:before {
        content: "▼";
    }
`;


/**********************************************************************/
// 미니맵

export const MiniMapComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 254px;
    top: 20%;
    left: 60%;

    .content {
        
        > div {
            position: relative;
            width: 100%;
            height: 100%;

            img {
                width: 270px;
                height: 180px;
                position: relative;
                top: 2px;
            }
    
            .position {
                display: ${props => props.$showPosition ? 'block' : 'none'};
                width: 14px;
                height: 14px;
                position: absolute;
            }
    
            .alarm {
                display: ${props => props.$showAlarm ? 'block' : 'none'};
                width: 14px;
                height: 14px;
                position: absolute;
            }
        }

    }
`;


/**********************************************************************/
// CCTV 영상정보

export const CCTVInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 314px;
    top: 50%;
    left: 60%;

    .hidden {
        display: none;
    }

    .viewDashboardCCTVConts {
        height: calc(100% - 6px);
    }

    .viewDashboardCCTVGrid {
        width: 100%;
        height: 100%;
        display: grid;
        padding-right: 5px;
        grid-gap: 5px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;

        > div {
            position: relative;
            background: #06090D;
            box-shadow: 0px 0px 3px 0px #0095FF inset;

            &::before {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                left: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
            }

            &::after {
                content: '';
                display: block;
                position: absolute;
                top: -1px;
                right: -1px;
                width: 8px;
                height: 8px;
                background: url(${contentBoxEl}) no-repeat center center;
                transform: rotate(90deg);
            }

            > div {

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    left: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(270deg);
                }

                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: -1px;
                    right: -1px;
                    width: 8px;
                    height: 8px;
                    background: url(${contentBoxEl}) no-repeat center center;
                    transform: rotate(180deg);
                }
            }
        }

        div span p {
            font-size: 10px;
            margin-bottom: 3px;
        }

        div span iframe,
        .cctv_none {
            width: 100% !important;
            height: 100% !important;
        }

        .cctv_none {
            ${(props) => props.theme.flex()};
            background: #161616;
            margin-top: 10px;

            img {
                object-fit: contain;
                width: 44px;
                height: 37px;
                margin: 0 auto;
            }
        }

        div span.on {
            p {
                color: ${(props) => props.theme.yellowColor};
            }

            iframe {
                border: 1px solid ${(props) => props.theme.yellowColor};
            }
        }

        .titleWrap {
            ${(props) => props.theme.flex()};
            width: 100%;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.05);

            &.selected {

                p {
                    color: ${(props) => props.theme.primary};
                }

                img {
                    filter: invert(58%) sepia(40%) saturate(4138%) hue-rotate(195deg) brightness(100%) contrast(103%);
                }
            }
        }
    }

    .viewDashboardCCTVGrid .col1row1 {
        grid-column: 1;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row1.full {
        width: calc(200% + 5px);
        height: calc(200% + 5px);
    }

    .viewDashboardCCTVGrid .col1row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row1 span {
        color: white;
        width: 100%;
    }
    .viewDashboardCCTVGrid .col1row1 span p {
        max-height: 19px;
        overflow: hidden;
    }

    .viewDashboardCCTVGrid .col2row1 {
        grid-column: 2;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row1.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col2row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row1 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col1row2 {
        grid-column: 1;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col1row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col2row2 {
        grid-column: 2;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 20px);
    }

    .viewDashboardCCTVGrid .col2row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid div:nth-child(2n + 2) {
        margin-right: 0;
    }

    .viewDashboardCCTVGrid div span {
        position: relative;
        height: 100%;
        display: inline-block;
    }

    .viewDashboardCCTVGrid div span img {
        position: relative;
        width: 180px;
        height: 130px;
    }

    .viewDashboardCCTVGrid div span iframe {
        width: 100% !important;
        height: 100% !important;
    }

    .viewDashboardCCTVGrid div span video {
        width: 100% !important;
        height: 100% !important;
    }

    .viewDashboardCCTVGrid div span:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
`;


/**********************************************************************/
// 이벤트 대시보드

export const EventDashboardComponent = styled.div`
    position: absolute;
    width: 524px;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: ${(props) => props.theme.background};
    border-radius: 0px 0px 15px 15px;

    &.closePopup {
        animation: ${fadeOut} .3s ease-out;
    }

    > div {
        padding: 30px 20px 30px 60px;
        ${(props) => props.theme.flex()};
        background: rgba(255, 44, 44, .85);
        border: 2px solid #FFFFFF2B;
        border-radius: 0px 0px 15px 15px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        position: relative;

        &::before {
            content: '';
            display: block;
            width: 59px;
            height: 54px;
            background: url(${eventDashboardIcon}) no-repeat center center;
            position: absolute;
            left: 20px;
        }

        p {
            font-size: 14px;
            font-weight: 600;
        }

        .btnWrap {
            ${(props) => props.theme.flex()};
            gap: 15px;

            .move {
                font-size: 14px;
                font-weight: 600;
            }
    
            .dslX {
                width: 12px;
                height: 12px;
                text-indent: -9999px;
                background: url(${dashboard_layer_close}) no-repeat center center;
                z-index: 1;
                cursor: pointer;
            }
        }

    }
`;


/**********************************************************************/
// 초기상황 전파관리

export const InitialSituationManagementComponent = styled.div`
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: url(${popup_background}) no-repeat;
    padding: 40px;
    ${(props) => props.theme.userSelect()};

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 34px;
            border-radius: 2px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }

    .menuWrap {
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
        }
    }

    section {
        height: calc(100% - 100px);

        .filterWrap {
            ${(props) => props.theme.flex()};
            gap: 11px;
            margin-bottom: 10px;

            > select, button {
                width: 25%;
                height: 30px;
                background-color: #1B212C;
                font-size: 14px !important;
            }

            select {
                background-position-x: 97%;
            }

            select:disabled {
                color: #384355;
            }

            > button {
                border-radius: 2px;
                text-align: left;
                padding-left: 10px;
                position: relative;

                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${receiver_icon}) no-repeat center center;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 20px;
                    height: 20px;
                }

                &.on {
                    &::before {
                        filter: invert(58%) sepia(40%) saturate(4138%) hue-rotate(195deg) brightness(100%) contrast(103%);
                    }
                }
            }
        }

        .receiverWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 5px ;
            width: 100%;
            background-color: #1B212C;
            padding: 10px;
            margin-bottom: 20px;

            p {
                font-size: 14px;
                min-width: 46px;
            }

            ul {
                ${(props) => props.theme.flex('flex-start', 'center')};
                flex-wrap: wrap;
                gap: 5px ;

                li {
                    font-size: 12px;
                    background-color: ${(props) => props.theme.primary};
                    border-radius: 2px;
                    color: ${(props) => props.theme.background};
                    padding: 5px;
                }
            }
        }

        .contentWrap {
            background-color: #1B212C;
            height: calc(100% - 95px);
            
            #tooltip {
                cursor: help;
            }
            
            [data-tooltip] {
                position: relative;
                z-index: 2;
            }

            [data-tooltip]:before,
            [data-tooltip]:after {
                visibility: hidden;
                opacity: 0;
                pointer-events: none;
            }

            [data-tooltip]:before {
                position: absolute;
                top: 50%;
                left: 24px;
                transform: translate(0, -50%);
                padding: 5px 10px;
                white-space: nowrap;
                border-radius: 3px;
                background-color: ${(props) => props.theme.fontPrimary};
                color: #000;
                font-size: 12px;
                font-weight: 500;
                content: attr(data-tooltip);
                text-align: center;
                line-height: 1.2;
            }

            [data-tooltip]:after {
                content: " ";
                position: absolute;
                border-right: 5px solid ${(props) => props.theme.fontPrimary};
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                transform: translate(0, -50%);
                top: 50%;
                left: 20px;
            }
            
            [data-tooltip]:hover:before,
            [data-tooltip]:hover:after {
                visibility: visible;
                opacity: 1;
            }

            .header {
                width: 100%;
                height: 36px;
                background: #2A3344;
                ${(props) => props.theme.flex('center', 'center')};
                gap: 10px;

                > p {
                    font-size: 14px;
                    font-weight: 500;
                }
            }

            .content {
                width: 100%;
                height: calc(100% - 36px);
                padding: 20px;

                textarea {
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                    border: 1px solid #384355;
                    padding: 10px;
                    color: #fff;
                    font-size: 12px;
                    line-height: 15px;
                    ${(props) => props.theme.scroll()};
                }
            }
        }
    }
`;


/**********************************************************************/
// 수신자 편집

export const EditReceiverComponent = styled.div`
    width: 860px;
    height: 619px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    padding: 40px;
    background: #1B212C;
    ${(props) => props.theme.userSelect()};

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    > h2 {
        font-weight: 700;
        margin-bottom: 20px;
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 34px;
            border-radius: 2px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }

    section {
        .scroll {
            height: 190px;
            overflow-x: hidden;
            overflow-y: auto;
            ${(props) => props.theme.scroll()};
        }

        .selectWrap {
            ${(props) => props.theme.flex('', 'flex-start')};
            gap: 10px;

            .teamList {
                flex: 2;
    
                > p {
                    background: #2A3344;
                    padding: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    height: 36px;
                    display: flex;
                    align-items: center;
                }

                .teamTree {

                    & * {
                        font-size: 12px;
                    }

                    > li {

                        div {
                            height: 38px;
                            line-height: 37px;
                            border-bottom: 1px solid #1B212C;
                            background: ${(props) => props.theme.background};
                            cursor: pointer;

                            &:hover {
                                background-color: ${(props) => props.theme.primary};
                            }

                            &.depth1, &.sensorTxt {
                                padding: 0 10px;
                            }

                            &.depth2 {
                                padding: 0 10px 0 15px;
                            }

                            &.depth3 {
                                padding: 0 10px 0 20px;
                            }

                            h2:before {
                                content: '';
                                display: inline-block;
                                width: 18px;
                                height: 18px;
                                background: url(${treeArrow}) no-repeat center center;
                                position: relative;
                                top: 5px;
                                margin-right: 10px;
                            }

                            &.on {

                                h2:before {
                                    content: '';
                                    transform: rotate(90deg);
                                    transition: transform .35s;
                                }
                            }
                        }
                    }
                }
            }
    
            .memberList {
                flex: 1;

                > p {
                    background: #2A3344;
                    padding: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    height: 36px;
                    display: flex;
                    align-items: center;
                }

                ul {
                    background: ${(props) => props.theme.background};

                    li {
                        height: 38px;
                        border-bottom: 1px solid #1B212C;
                        font-size: 12px;
                        padding: 10px;
                        ${(props) => props.theme.flex()};
                        cursor: pointer;

                        &:hover {
                            background-color: ${(props) => props.theme.primary};
                        }

                        &.selected {

                            &::after {
                                content: '';
                                display: inline-block;
                                background: url(${member_check_off});
                                width: 16px;
                                height: 16px;
                            }

                            &:hover {
                                &::after {
                                    background: url(${member_check_on});
                                }
                            }
                        }
                    }
                }
            }
        }
        
        .selectedMemberList {
            width: 100%;
            background-color: #1A1F23;
            margin-top: 10px;

            & * {
                font-size: 12px;
            }

            .selectedMember {

                .head > div, 
                .body > ul > li > div {

                    &:nth-of-type(1) {
                        width: 6%;
                    }

                    &:nth-of-type(2) {
                        width: 88%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 6%;
                    }
                }

                .head {
                    background: #2A3344;
                    width: calc(100% - 6px);
                    ${(props) => props.theme.flex()};

                    &::after {
                        content: '';
                        width: 6px;
                        height: 32px;
                        background-color: #2A3344;
                        position: absolute;
                        right: 40px;
                    }

                    > div {

                        &:not(:last-child) {
                            border-right: 1px solid ${(props) => props.theme.background};
                        }

                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        font-weight: 500;

                        .sort {
                            ${(props) => props.theme.flex('center', 'center')};
                            gap: 5px;

                            span {
                                font-size: 12px;
                            }

                            button {
                                width: 15px;
                                height: 10px;

                                &.az {
                                    background: url(${sortIcon}) no-repeat center center;
                                }

                                &.za {
                                    background: url(${sortIcon}) no-repeat center center;
                                    transform: rotate(180deg);
                                }
                            }
                        }
                    }
                }

                .body {
                    background-color: ${(props) => props.theme.background};
                    overflow-y: scroll;
                    height: 170px;

                    ${(props) => props.theme.scroll()};

                    ul {

                        li {
                            ${(props) => props.theme.flex()};
                            height: 38px;
                            border-bottom: 1px solid #1B212C;

                            div {
                                text-align: center;
                                border-right: 1px solid #1B212C;
                                height: 38px;
                                line-height: 38px;

                                .binIcon {
                                    position: relative;
                                    top: -2px;

                                    &:hover > img {
                                        filter: invert(58%) sepia(40%) saturate(4138%) hue-rotate(195deg) brightness(100%) contrast(103%);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 거리측정 팝업
export const RangeFindingComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 180px;
    height: 144px;
    background-color: ${(props) => props.theme.background};

    .dslTop {
        padding: 10px 10px 0 10px;

        &::after {
            background-size: auto;
            top: 32px;
            left: 10px;
            right: 10px;
        }

        &::before {
            background-size: auto;
            top: 32px;
            left: 10px;
        }
    }

    .dslTitle {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url(${rangeFinding}) no-repeat center center;
            margin-right: 5px;
        }
    }

    .rangeContent {
        padding-top: 15px;

        & * {
            font-size: 12px;
        }

        .total, .range {

            li {
                ${(props) => props.theme.flex()};
                padding: 13px 10px;

                p {
                    font-weight: 500;
                    color: #7C8DA9;
                }
            }
        }

        .total {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;

            li {
                background-color: rgba(255, 255, 255, 0.05);
                border-top: 1px solid #384355;

                &.on p {
                    color: ${(props) => props.theme.primary};
                }
            }
        }

        .range {
            width: 100%;

            li {
                justify-content: center;
                color: #7C8DA9;
                line-height: 17px;
                text-align: center;
            }
        }
    }
`;


/**********************************************************************/
// 키맵 팝업
export const KeyMapComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 180px;
    background-color: ${(props) => props.theme.background};

    .dslTop {
        padding: 10px 10px 0 10px;

        &::after {
            background-size: auto;
            top: 32px;
            left: 10px;
            right: 10px;
        }

        &::before {
            background-size: auto;
            top: 32px;
            left: 10px;
        }
    }

    .dslTitle {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            background: url(${keyMap}) no-repeat center center;
            margin-right: 5px;
        }
    }

    .keyMapContent {
        padding-top: 9px;

        & * {
            font-size: 12px;
            font-weight: 500;
        }

        ul {

            li {
                ${(props) => props.theme.flex()};
                padding: 10px;

                &:not(:first-child) {
                    border-top: 1px solid #384355;
                }

                > div {
                    ${(props) => props.theme.flex()};
                    gap: 22px;
                    position: relative;

                    > p:first-child {
                        color: ${(props) => props.theme.primary};
                        border-radius: 2px;
                        border: 1px solid ${(props) => props.theme.primary};
                        padding: 3px 5px;
                        font-size: 10px;
                    }

                    > p:last-child {
                        padding: 3px 5px;
                        color: #000000;
                        border-radius: 2px;
                        background: ${(props) => props.theme.primary};
                        font-size: 10px;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${keyMap_plus}) no-repeat center center;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(0, -50%);
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 이벤트
export const EventComponent = styled(PopupsCommon)`
    position: absolute;
    width: 380px;
    height: 680px;
    top: 22%;
    left: 18%;

    .viewDashboardEventConts {
        padding: 10px 10px;
        box-sizing: border-box;
    }

    .viewDashboardEventList {
        position: relative;
        clear: both;
        margin-top: 10px;
    }

    .viewDashboardEventcare {
        width: 85px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .viewDashboardEventcare span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 100%;
        margin: 0 auto;
    }

    .viewDashboardEventInfo {
        padding-left: 85px;
    }

    .viewDashboardEventInfo li {
        float: left;
        color: #fff;
        width: 50%;
        height: 30px;
        font-size: 14px;
    }

    .viewDashboardEventInfo .viewDashboardEventBtn {
        clear: both;
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        background: #6281e6;
    }

    .viewDashboardEventInfo .viewDashboardEventBtn a {
        display: block;
    }

    .viewDashboardEvent table.tblA th {
        font-size: 14px;
        padding-left: 10px;
        padding-right: 10px;
        vertical-align: middle;
    }

    .viewDashboardEvent table.tblA td {
        font-size: 13px;
    }

    .dslContEvent {
        display: flex;
        flex-direction: column;
        padding: 0 10px 20px 20px;
        height: 94%;
    }

    .dslContEvent .alarmList {
        overflow-y: hidden;
        flex: 1;
        margin-top: 10px;
    }

    .dslContEvent .alarmList .alarmListTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        border-right: solid 10px transparent;
    }

    .dslCont .alarmDetail {
        overflow-y: hidden;
        margin-top: 4px;
        height: 50%;
        display: inline-flex;
        justify-content: flex-end;
    }

    .dseTitle {
        font-size: 16px;
        color: #FFD753;
        font-weight: 400;
        margin-bottom: 5px;
    }

    .dseTop {
        border-right: solid 6px transparent;
    }

    .dseTop th {
        color: #fff;
        text-align: center;
        font-size: 12px;
        border: 0.5px dashed #707070;
        border-bottom: none;
        padding: 7px;
        line-height: 1.2em;
        background: #0E162D;
        font-weight: 300;
    }

    .dseTb {
        position: relative;
        min-height: calc(100% - 92px);
        height: 130px;
        border-right: ${(props) => !props.$tableScroll ? 'solid 6px transparent' : null};
    }

    .dseTb td {
        color: #fff;
        text-align: center;
        font-size: 12px;
        border: 0.5px dashed #707070;
        padding: 7px;
        line-height: 1.2em;
        font-weight: 300;
        vertical-align: middle;
        position: relative;
    }

    .dseTb td span.grn {
        color: #6beb1a;
        font-weight: 500;
    }

    .dseTb td span.red {
        color: #EB4242;
        font-weight: 500;
    }

    .dseTb tr:hover {
        background: #273040;
    }

    .width_10Pro {
        width: 10%;
    }
    .width_12Pro {
        width: 12%;
    }
    .width_13Pro {
        width: 13%;
    }
    .width_15Pro {
        width: 15%;
    }
    .width_20Pro {
        width: 20%;
    }
    .width_25Pro {
        width: 25%;
    }
    .width_100px {
        width: 100px;
    }

    .scrollTable {
        width: calc(100% - 10px);
        border: dashed 1px yellow;
    }

    .eventAct {
        display: inline-block;
        position: absolute;
        background-color: rgb(0 143 255);
        color: #fff;
        width: 15px;
        height: 15px;
        left: 3.5px;
        top: 12px;
        z-index: 1;
        text-align: center;
        padding-top: 1.5px;
        padding-right: 0.5px;
        font-size: 10px;
        border-radius: 50%;
        font-weight: 600;
    }

    .dseInfo {
        position: relative;
        padding-left: 60px;
    }

    .dseInfo em {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -24px;
        text-indent: -9999px;
    }

    .dseInfo em.evtFIRE {
        background: url(${wonik_dashboard_event_fire}) no-repeat center center;
    }

    .dseInfo p {
        font-size: 12px;
        color: #fff;
        line-height: 1.4em;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; /* 0518 */
        margin-left: 20px;
    }

    .dseInfo p span {
        margin-right: 10px;
    }

    .dseInfo p span:last-child {
        margin-right: 0;
    }

    .eventShortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -5px;
        top: -5px;
        z-index: 1;
        text-align: center;
        padding-top: 2.5%;
        font-size: 10px;
        opacity: 80%;
    }

    .eventIconBox {
        display: flex;
        padding: 5px;
        margin-top: 20px;
        width: 100%;
    }

    .eventIconBox li {
        display: block;
        border: 1px solid #FFFFFF1A;
        border-radius: 10px;
        padding: 7px 3px;
        width: 19%;
        margin-right: 10px;
        text-align: center;
        background: #0E162D;
    }

    .eventIconBox li .eIcon1 {
        display: block;
        background: url(${wonik_sopIcon}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li .eIcon2 {
        display: block;
        background: url(${wonik_event_sreenIcon}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li .eIcon3 {
        display: block;
        background: url(${wonik_event_soundOff}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li .eIcon4 {
        display: block;
        background: url(${wonik_event_soundIcon}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li .eIcon5 {
        display: block;
        background: url(${wonik_event_menoIcon}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li .eIcon6 {
        display: block;
        background: url(${wonik_event_endIcon}) no-repeat;
        height: 20px;
        background-position: center;
    }

    .eventIconBox li:nth-child(1) a {
        color: #fff;
        font-size: 12px;
    }

    .eventIconBox li:nth-child(2) a {
        color: #fff;
        font-size: 12px;
    }

    .eventIconBox li:nth-child(3) a {
        color: #fff;
        font-size: 12px;
    }

    .eventIconBox li:nth-child(4) a {
        color: #fff;
        font-size: 12px;
    }

    .eventIconBox li:nth-child(5) a {
        color: #fff;
        font-size: 12px;
    }

    .eventIconBox li.on,
    .eventIconBox li:hover {
        background: ${(props) => props.theme.primary};
        color: #fff;
    }

    .noMemoIconBox {
        display: flex;
        padding: 5px;
        margin-top: 10px;
        width: 100%;
        position: relative;
    }

    .noMemoIconBox li {
        display: block;
        border: solid 1px #727171;
        border-radius: 15px;
        padding: 10px 3px;
        width: 30%;
        margin-left: 5px;
        margin-right: 5px;
        text-align: center;
        background: #222a43;
    }

    .noMemoIconBox li .eIcon1 {
        display: block;
        background: url(${wonik_sopIcon}) no-repeat;
        height: 30px;
        background-size: 26px;
        background-position: center;
        background-position-y: 4px;
    }

    .noMemoIconBox li .eIcon2 {
        display: block;
        background: url(${wonik_event_sreenIcon}) no-repeat;
        height: 30px;
        background-size: 30px;
        background-position: center;
    }

    .noMemoIconBox li .eIcon3 {
        display: block;
        background: url(${wonik_event_soundOff}) no-repeat;
        height: 30px;
        background-size: 30px;
        background-position: center;
    }

    .noMemoIconBox li .eIcon4 {
        display: block;
        background: url(${wonik_event_soundIcon}) no-repeat;
        height: 30px;
        background-size: 30px;
        background-position: center;
    }

    .noMemoIconBox li .eIcon6 {
        display: block;
        background: url(${wonik_event_endIcon}) no-repeat;
        height: 30px;
        background-size: 30px;
        background-position: center;
    }

    .noMemoIconBox li:nth-child(1) a {
        color: #fff;
        font-size: 9px;
    }

    .noMemoIconBox li:nth-child(2) a {
        color: #fff;
        font-size: 9px;
    }

    .noMemoIconBox li:nth-child(3) a {
        color: #fff;
        font-size: 9px;
    }

    .noMemoIconBox li:nth-child(4) a {
        color: #fff;
        font-size: 9px;
    }

    .hideKey { 
        visibility: hidden; 
    }

    .imgBroadcast {
        display: block;
        position: absolute;
        left: 80px;
        top: 50%;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        cursor: pointer;
    }
`;


/**********************************************************************/
// 네비게이션 바

export const NavigationBarComponent = styled.div`
    position: absolute;
    left: 50%;
    bottom: 35px;
    transform: translate(-50%, 0);
    z-index: 1;

    ul {
        ${(props) => props.theme.flex('center', 'center')};
        gap: 10px;

        li {
            width: 58px;
            height: 58px;
            ${(props) => props.theme.flex('center', 'center')};
            cursor: pointer;

            div {
                display: none;
                text-align: center;
                border-radius: 5px;
                width: 58px;
                height: 58px;
                ${(props) => props.theme.userSelect()};
            }

            &:hover div {
                ${(props) => props.theme.flex('center', 'center')};
                background: url(${nav_background_off}) no-repeat center center !important;
            }

            &.off.statusInfoIcon {
                background: url(${nav_statusInfo_off}) no-repeat center center;
            }

            &.on.statusInfoIcon {
                background: url(${nav_statusInfo_on}) no-repeat center center;
            }

            &.off.weatherInfoIcon {
                background: url(${nav_weatherInfo_off}) no-repeat center center;
            }

            &.on.weatherInfoIcon {
                background: url(${nav_weatherInfo_on}) no-repeat center center;
            }

            &.off.dashboardIcon {
                background: url(${nav_dashboard_off}) no-repeat center center;
            }

            &.on.dashboardIcon {
                background: url(${nav_dashboard_on}) no-repeat center center;
            }

            &.off.eventIcon {
                background: url(${nav_event_off}) no-repeat center center;
            }

            &.on.eventIcon {
                background: url(${nav_event_on}) no-repeat center center;
            }

            &.off.manualReportIcon {
                background: url(${nav_manualReport_off}) no-repeat center center;
            }

            &.on.manualReportIcon {
                background: url(${nav_manualReport_on}) no-repeat center center;
            }
        }

        #dsBot {
            position: fixed;
            z-index: 99; /* 0518 */
            left: 50%;
            bottom: 20px;
            width: 500px;
            margin-left: -250px;
        }

        #dsBot button {
            display: block;
            background: #25343d;
            width: 100%;
            height: 20px;
            cursor: pointer;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
        }

        #dsBot button.edit {
            width: 70%;
            position:absolute;
            left:50%;
            top:-20px;
            transform: translateX(-50%);
        }

        #dsBot ul {
            position: absolute;
            left: 34px;
            right: 34px;
            bottom: 0;
            margin-bottom: 10px;
        }

        #dsBot ul.edit {
            left: 114px;
        }

        #dsBot ul:after {
            content: '';
            display: table;
            clear: both;
        }

        #dsBot ul li {
            float: left;
            padding: 0 2px;
            position: relative;
        }

        #dsBot ul li a {
            display: table;
            width: 50px;
            height: 50px;
            border: solid 1px #fff;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }

        #dsBot ul li a span {
            display: table-cell;
            width: 100%;
            vertical-align: middle;
            text-align: center;
            color: #fff;
            font-size: 12px;
            line-height: 1.1em;
        }

        #dsBot ul li a span em {
            display: none;
        }

        #dsBot ul li a:hover {
            background: rgba(39, 46, 66, 1) !important;
        }

        #dsBot ul li a:hover em {
            display: block;
        }

    }
`;


/**********************************************************************/
// 대시보드

export const DashboardComponent = styled(PopupsCommon)`
    position: absolute;
    width: 712px;
    height: 98px;
    top: 15%;
    left: 50%;
    transform: translate(-50%, -50%);

    span, li {
        padding: 0 1px;
    }

    .dslX {
        width: 12px;
        height: 12px;
        text-indent: -9999px;
        background: url(${dashboard_layer_close}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
        position: absolute;
        right: 11px;
        top: 11px;
    }

    .viewDashboardSectionConts {
        ${(props) => props.theme.userSelect()};
    }

    .viewDashboardTemperature {
        clear: both;
        text-align: center;
        overflow: hidden;
        position: relative;
    }

    .viewDashboardTemperature ul {
        position: relative;
        padding: 10px 38px;
        white-space: wrap;
    }

    .viewDashboardTemperature ul li {
        display: inline-block;
        margin: 0 15px;
    }

    .sectionblank {
        text-align: center;
        border-bottom: 1px solid #525868;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        padding: 21px 15px 10px 15px;
        margin: 0 11px;
    }

    .sectionblank > div {
        margin: 0 10px;
        color: #fff;
    }

    .greenTxt {
        color: #53FF98;
    }

    .grayTxt {
        color: #7F7F7F;
    }
`;


/**********************************************************************/
// 툴바

export const ToolbarComponent = styled.div`
    & {
        position: fixed;
        top: 80px;
        right: 30px;
        z-index: 98;
    }

    & button {
        display: block;
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        position: relative;
        z-index: 1;
        background: url(${wonik_dashboard_navigator}) no-repeat center center, linear-gradient(180deg, rgba(83, 152, 255, 1) 0%, rgba(0, 95, 236, 1) 100%);
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        box-shadow: inset 0px 2px 4px rgba(255, 255, 255, 0.07), 0px 5px 6px rgba(0, 0, 0, 0.16);
    }

    & button.on {
        background: url(${wonik_dashboard_navigator}) no-repeat center center, linear-gradient(180deg, rgba(83, 152, 255, 1) 0%, rgba(0, 95, 236, 1) 100%);
    }

    & > div {
        display: none;
        background: #111928;
        width: 40px;
        position: absolute;
        left: 0;
        top: 20px;
        border-radius: 0px 0px 20px 20px;
        -moz-border-radius: 0px 0px 20px 20px;
        -webkit-border-radius: 0px 0px 20px 20px;
    }

    & > .dsnMenuDiv{
        display: none;
        background: #111928;
        width: 40px;
        position: absolute;
        left: 0;
        top: 20px;
        border-radius: 0px 0px 20px 20px;
        -moz-border-radius: 0px 0px 20px 20px;
        -webkit-border-radius: 0px 0px 20px 20px;
    }

    .dsnMenuHydrogen {
        padding-top: 25px !important;
        padding-bottom: 15px;
        width: 40px;
    }

    .dsnMenuHydrogen li {
    }

    .dsnMenuHydrogen li a {
        display: block;
        height: 40px;
        /*text-indent: -9999px;*/
        cursor: pointer;
        position: relative;
    }

    .dsnMenuHydrogen li:nth-child(1) a {
        background: url(${dashboard_nav_ico01}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(2) a {
        background: url(${dashboard_nav_ico02}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(3) a {
        background: url(${dashboard_nav_ico03}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(4) a {
        background: url(${dashboard_nav_ico04}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(5) a {
        background: url(${dashboard_nav_ico05}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li a.on {
        background: url(${dashboard_nav_ico06_on}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li a.off {
        background: url(${dashboard_nav_ico06_off}) no-repeat center
        center;
    }
    

    .dsnMenu {
        padding-top: 25px;
        padding-bottom: 15px;
    }

    .dsnMenu li {
    }

    .dsnMenu li a {
        display: block;
        height: 40px;
        /*text-indent: -9999px;*/
        cursor: pointer;
        position: relative;
    }

    .dsnMenu li:nth-child(1) a {
        background: url(${dashboard_nav_ico01}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(2) a {
        background: url(${dashboard_nav_ico02}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(3) a {
        background: url(${dashboard_nav_ico03}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(4) a {
        background: url(${dashboard_nav_ico04}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(5) a {
        background: url(${dashboard_nav_ico05}) no-repeat center
        center;
    }

    .dsnMenu li a.on {
        background: url(${dashboard_nav_ico06_on}) no-repeat center
        center;
    }

    .dsnMenu li a.off {
        background: url(${dashboard_nav_ico06_off}) no-repeat center
        center;
    }

    .dsnMenu li a:before {
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        opacity: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .dsnMenu li a:hover:before {
        margin-right: 45px;
        opacity: 1;
        z-index: 2;
    }

    .dsnMenu li:nth-child(1) a:before {
        content: "초기화면"; 
    }

    .dsnMenu li:nth-child(2) a:before {
        content: "기본뷰로 설정";
    }

    .dsnMenu li:nth-child(3) a:before {
        content: "확대";
    }

    .dsnMenu li:nth-child(4) a:before {
        content: "축소";
    }

    .dsnMenu li:nth-child(5) a:before {
        content: "즉시회전";
    }

    .dsnMenu li a.on:before {
        content: "자동회전ON";
    }

    .dsnMenu li a.off:before {
        content: "자동회전OFF";
    }

    .balloonHome{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 65px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonDefault{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 107px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonIn{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 145px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonOut{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 187px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonRotate{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 226px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonAutoRotate{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 265px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .dsnBox {
        display: block;
        position: absolute;
        right: 100%;
        top: 30px;
        width: 52px;
        height: 940px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .dsnFloor {
        display: inline-block;
    }

    .dsnFloor li {
        margin-bottom: 5px;
    }

    .dsnFloor li:last-child {
        margin-bottom: 0;
    }

    .dsnFloor li a {
        display: block;
        height: 30px;
        line-height: 28px;
        border: none;
        color: #fff;
        background: rgba(14, 22, 45, 0.85);
        width: 50px;
        text-align: center;
        font-size: 13px;
        border-radius: 15px 0px 0px 15px;
        -moz-border-radius: 15px 0px 0px 15px;
        -webkit-border-radius: 15px 0px 0px 15px;
        cursor: pointer;
    }

    .dsnFloor li a.on {
        background: rgba(14, 22, 45, 1);
        color: #5398FF;
    }
`;


/**********************************************************************/
// 정보

export const BuildingInfoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 10px;
    top: 720px;
    width: 320px;
    height: 210px;
    overflow: hidden;

    .viewBuildingConts {
        clear: both;
        overflow-y: auto;
        height: calc(100% - 32px);
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .viewBuildingTitleBox{
        border: dashed 1px red; 
    }

    .viewBuildingTitle {
        border-bottom: 1px dashed #3b3f5c;
        color: #fff;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 400;
    }

    .viewBuildingList {
    }

    .viewBuildingConts ul {
        padding: 12px 20px;
    }

    .viewBuildingConts ul li {
        position: relative;
        padding: 6px 0 6px 15px;
        line-height: 120%;
        font-weight: 300;
    }

    .liDot {
        color: #fff;
        font-size: 12px;
    }

    .liDot:before {
        content: "○";
        color: #fff;
        font-size: 9px;
        position: absolute;
        left: 0;
        top: 6px;
    }

    .liNoDot {
        color: #fff;
        font-size: 12px;
    }

    .facilityInfoTitle{
        display: block;
        text-align-last: justify;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .facilitySemiclone{
        padding-right: 10px;
        padding-left: 10px;
    }

    .facilityInfoConts{
        display: block;
    }
`;


/**********************************************************************/
// 엘리베이터 위치 현황 (경기)
export const ElevatorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 100px;
    right: 100px;
    width: 430px !important;

    .dslCont {
        padding: 20px;

        & * {
            color: #fff;
        }

        section {

            &:first-child {
                margin-bottom: 10px;
            }

            > h4 {
                width: 100%;
                height: 23px;
                font-size: 16px;
                font-weight: 400;
                color: #FFD753;
                background: #0E162D;
                ${(props) => props.theme.flex('center', 'center')};
            }

            > ul {
                margin-top: 10px;
    
                > li {
                    ${(props) => props.theme.flex()};
                    margin-bottom: 10px;
                    gap: 10px;
    
                    .elementWrap {
                        ${(props) => props.theme.flex()};
                        flex: auto;
                        border: 1px solid #525868;
                    }

                    .description {
                        width: 122px;
                        height: 108px;
                        background: #0E162D;
                        border: 1px solid #0E162D;
                        ${(props) => props.theme.flex('center', 'center')};
                        flex-direction: column;
                        gap: 8px;
                        font-size: 12px;

                        > ul {
                            display: flex;
                            gap: 8px;
                            flex-direction: column;

                            > li {
                                

                                &:nth-child(1)::before {
                                    content: '';
                                    display: inline-block;
                                    width: 12px;
                                    height: 3px;
                                    background: #6EB6FF;
                                    margin-right: 9px;
                                }

                                &:nth-child(2)::before {
                                    content: '';
                                    display: inline-block;
                                    width: 12px;
                                    height: 3px;
                                    background: #FF6E6E;
                                    margin-right: 9px;
                                }

                                &:nth-child(3)::before {
                                    content: '';
                                    display: inline-block;
                                    width: 16px;
                                    height: 10px;
                                    background: url(${elevatorInfo_up_run}) no-repeat center center;
                                    position: relative;
                                    left: -2px;
                                    margin-right: 5px;
                                }

                                &:nth-child(4)::before {
                                    content: '';
                                    display: inline-block;
                                    width: 16px;
                                    height: 10px;
                                    background: url(${elevatorInfo_down_run}) no-repeat center center;
                                    position: relative;
                                    left: -2px;
                                    margin-right: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

// 엘리베이터 요소
export const ElevatorElementComponent = styled.div`
    height: 108px;
    width: 55px;
    background: #0E162D;
    ${(props) => props.theme.flex('center', 'center')};
    flex-direction: column;
    position: relative;
    
    > div {
        position: absolute;
        top: 8px;

        > p {
            font-size: 12px;
            color: ${props => props.$elevatorType === 'emergency' ? '#FF6E6E' : '#6EB6FF'} !important;
        }

        > div {
            ${(props) => props.theme.flex('center', 'center')};
            flex-direction: column;
            gap: 5px;
            margin-top: 7px;

            img {
                width: 16px;
                height: 10px;
            }
            
            > p {
                font-size: 16px;
            }
        }
    }

    > p {
        width: 100%;
        border-top: 0.5px dashed #525868;
        padding: 7px 0;
        font-size: 12px;
        text-align: center;
        position: absolute;
        bottom: 0;
    }
`


/**********************************************************************/
// 집수정 (경기)

const lowFadeChart = keyframes`
    0% {
        height: 0;
    }
    100% {
        height: 54px;
    }
`

const highFadeChart = keyframes`
    0% {
        height: 0;
    }
    100% {
        height: 141px;
    }
`

export const WaterLevelInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 100px;
    left: 300px;
    width: 260px;

    .dslCont {
        width: 100%;
        padding: 16px 20px 10px 20px;

        & * {
            color: #fff;
            font-size: 12px;
        }

        .chart {
            ${(props) => props.theme.flex('center', 'center')};
            width: 100%;
            min-height: 200px;
            background: url(${waterLevel_background}) no-repeat center center;
            position: relative;

            &::after {
                content: '';
                display: block;
                width: 34px;
                height: 34px;
                background: url(${waterLevel_element}) no-repeat center center;
                position: absolute;
                bottom: 15px;
            }

            &::before {
                content: '';
                display: block;
                width: 221px;
                height: 199px;
                position: absolute;
                bottom: 0;
                z-index: 1;
                background : ${(props) => {
                    if(props.$waterLevel === SdmsResource.waterLevel.default) 
                        return `url(${waterLevel_line_default}) no-repeat center center`
                    else if(props.$waterLevel === SdmsResource.waterLevel.low) 
                        return `url(${waterLevel_line_low}) no-repeat center center`
                    else if(props.$waterLevel === SdmsResource.waterLevel.high) 
                        return `url(${waterLevel_line_high}) no-repeat center center`
                }};
            }

            .low {
                display: inline-block;
                background: url(${waterLevel_cont_low}) no-repeat center center;
                width: 97px;
                height: 54px;
                position: absolute;
                bottom: 21px;
                animation: ${lowFadeChart} 1s;
    
                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${waterLevel_cont_high_under}) no-repeat center center;
                    width: 97px;
                    height: 6px;
                    position: absolute;
                    bottom: -5px;
                }
            }
    
            .high {
                display: inline-block;
                background: url(${waterLevel_cont_high}) no-repeat center center;
                width: 97px;
                height: 141px;
                position: absolute;
                animation: ${highFadeChart} 1s;
                bottom: 21px;
    
                &::before {
                    content: '';
                    display: inline-block;
                    background: url(${waterLevel_cont_high_under}) no-repeat center center;
                    width: 97px;
                    height: 6px;
                    position: absolute;
                    bottom: -6px;
                }
            }
        }

        .sensorWrap {
            margin-top: 20px;
    
            li {
                ${(props) => props.theme.flex()};
                width: 100%;
                padding: 10px 0;
                border-top: 1px solid #3A4154;
    
                p {
                    ${(props) => props.theme.flex('flex-start', 'center')};
    
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 2px;
                        height: 14px;
                        background-color: #fff;
                        margin-right: 5px;
                        
                    }
                }
            }
        }
    }
`;