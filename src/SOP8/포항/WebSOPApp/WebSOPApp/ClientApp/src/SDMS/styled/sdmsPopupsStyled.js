import styled, { keyframes } from "styled-components";

import close_icon from '../images/close_icon.svg';
import close_icon_white from '../images/close_icon_white.svg';
import lineLeft from '../images/lineLeft.svg';
import lineRight from '../images/lineRight.svg';
import contentBoxEl from '../images/contentBoxEl.svg';
import poi_zoneName from '../images/poi_zoneName.svg';
import poi_atmosphere from '../images/poi_atmosphere.svg';
import poi_reductionEquipment from '../images/poi_reductionEquipment.svg';
import poi_emissionFacilities from '../images/poi_emissionFacilities.svg';
import poi_weather from '../images/poi_weather.svg';
import poi_cctv from '../images/poi_cctv.svg';
import building_icon from '../images/building_icon.svg';
import treeArrow from '../images/treeArrow.svg';
import resize_icon from '../images/resize_icon.svg';
import rangeFinding from '../images/rangeFinding.svg';
import keyMap from '../images/keyMap.svg';
import keyMap_plus from '../images/keyMap_plus.svg';
import initialSituation from '../images/initialSituation.svg';
import sound from '../images/sound.svg';
import shutdown from '../images/shutdown.svg';

import nav_statusInfo from '../images/nav_statusInfo.svg';
import nav_statusInfo_on from '../images/nav_statusInfo_on.svg';
import nav_statusInfo_disable from '../images/nav_statusInfo_disable.svg';
import nav_event from '../images/nav_event.svg';
import nav_event_on from '../images/nav_event_on.svg';
import nav_event_disable from '../images/nav_event_disable.svg';
import nav_publicData from '../images/nav_publicData.svg';
import nav_publicData_on from '../images/nav_publicData_on.svg';
import nav_publicData_disable from '../images/nav_publicData_disable.svg';
import nav_miniMap from '../images/nav_miniMap.svg';
import nav_miniMap_on from '../images/nav_miniMap_on.svg';
import nav_miniMap_disable from '../images/nav_miniMap_disable.svg';
import nav_poi from '../images/nav_poi.svg';
import nav_poi_on from '../images/nav_poi_on.svg';
import nav_poi_disable from '../images/nav_poi_disable.svg';
import nav_3d from '../images/nav_3d.svg';
import nav_3d_on from '../images/nav_3d_on.svg';
import nav_3d_disable from '../images/nav_3d_disable.svg';
import nav_simulation from '../images/nav_simulation.svg';
import nav_simulation_on from '../images/nav_simulation_on.svg';
import sensor_arrow from '../images/sensor_arrow.svg';
import arrow_white from '../images/arrow_white.svg';
import arrow_white_disable from '../images/arrow_white_disable.svg';
import event_memo from '../images/event_memo.svg';
import event_close from '../images/event_close.svg';
import event_spread from '../images/event_spread.svg';
import event_memo_disable from '../images/event_memo_disable.svg';
import event_close_disable from '../images/event_close_disable.svg';
import event_spread_disable from '../images/event_spread_disable.svg';
import alarm_off from '../images/alarm_off.svg';
import poiIcon_1 from '../images/poiIcon_1.svg';
import poiIcon_2 from '../images/poiIcon_2.svg';
import poiIcon_3 from '../images/poiIcon_3.svg';
import poiIcon_4 from '../images/poiIcon_4.svg';
import poiIcon_5 from '../images/poiIcon_5.svg';
import poiIcon_6 from '../images/poiIcon_6.svg';
import poiIcon_7 from '../images/poiIcon_7.svg';
import poiIcon_8 from '../images/poiIcon_8.svg';
import poiIcon_1_on from '../images/poiIcon_1_on.svg';
import poiIcon_2_on from '../images/poiIcon_2_on.svg';
import poiIcon_3_on from '../images/poiIcon_3_on.svg';
import poiIcon_4_on from '../images/poiIcon_4_on.svg';
import poiIcon_5_on from '../images/poiIcon_5_on.svg';
import poiIcon_6_on from '../images/poiIcon_6_on.svg';
import poiIcon_7_on from '../images/poiIcon_7_on.svg';
import poiIcon_8_on from '../images/poiIcon_8_on.svg';
import toolIcon_1 from '../images/3dIcon_1.svg';
import toolIcon_2 from '../images/3dIcon_2.svg';
import toolIcon_3 from '../images/3dIcon_3.svg';
import toolIcon_4 from '../images/3dIcon_4.svg';
import toolIcon_5 from '../images/3dIcon_5.svg';
import toolIcon_6 from '../images/3dIcon_6.svg';
import toolIcon_7 from '../images/3dIcon_7.svg';
import toolIcon_8 from '../images/3dIcon_8.svg';
import toolIcon_1_on from '../images/3dIcon_1_on.svg';
import toolIcon_2_on from '../images/3dIcon_2_on.svg';
import toolIcon_3_on from '../images/3dIcon_3_on.svg';
import toolIcon_4_on from '../images/3dIcon_4_on.svg';
import toolIcon_5_on from '../images/3dIcon_5_on.svg';
import toolIcon_6_on from '../images/3dIcon_6_on.svg';
import toolIcon_7_on from '../images/3dIcon_7_on.svg';
import toolIcon_8_on from '../images/3dIcon_8_on.svg';
import toolIcon_1_off from '../images/3dIcon_1_off.svg';
import toolIcon_2_off from '../images/3dIcon_2_off.svg';
import toolIcon_3_off from '../images/3dIcon_3_off.svg';
import toolIcon_4_off from '../images/3dIcon_4_off.svg';
import toolIcon_5_off from '../images/3dIcon_5_off.svg';
import toolIcon_6_off from '../images/3dIcon_6_off.svg';
import toolIcon_7_off from '../images/3dIcon_7_off.svg';
import toolIcon_8_off from '../images/3dIcon_8_off.svg';
import simulationIcon_1 from '../images/simulationIcon_1.svg';
import simulationIcon_1_on from '../images/simulationIcon_1_on.svg';
import simulationIcon_2 from '../images/simulationIcon_2.svg';
import simulationIcon_2_on from '../images/simulationIcon_2_on.svg';
import locationIcon from '../images/locationIcon.svg';
import noDataIcon from '../images/noDataIcon.svg';

import pohang_map_background from '../../Common/images/pohang_map_background.png';
import pohang_minimap from '../../SDMS/images/minimap.png';

import popup_background from '../../Settings/images/popup_background.png';
import sortIcon from '../../Settings/images/sortIcon.svg';

import simulation_arrow from '../images/simulation_arrow.svg';
import simulation_stop from '../images/simulation_stop.svg';
import SdmsResource from "../resource/id";

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


export const SdmsStyled = styled.div`
    background: url(${pohang_map_background}) no-repeat center center / cover;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
`;


/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: ${(props) => props.theme.background};
    position: relative;
    cursor: default;
    opacity: ${props => props.$opacity};
    ${(props) => props.theme.userSelect()};
    border-radius: 4px;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 36px 0px rgba(0, 0, 0, 0.36);

    &::before {
        ${props => {
            if (props.$resize)
                return `
                    content: '';
                    display: block;
                    width: 12px;
                    height: 12px;
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    background: url(${resize_icon}) no-repeat center center;
                `
        }}
    }

    .dslTop {
        position: relative;
        ${(props) => props.theme.flex()};
        padding: 15px 15px 0 15px;

        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 39px;
            left: 15px;
            width: 56px;
            height: 2px;
            background: url(${lineLeft}) no-repeat center center;
            z-index: 2;
        }

        &::after {
            content: '';
            display: block;
            position: absolute;
            top: 39px;
            left: 15px;
            right: 15px;
            width: auto;
            height: 2px;
            background: url(${lineRight}) no-repeat center center;
            background-size: 100%;
        }

        .dslTitle {
            font-size: 14px;
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
            width: 14px;
            height: 14px;
            text-indent: -9999px;
            background: url(${close_icon}) no-repeat center center;
            z-index: 1;
            cursor: pointer;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        padding: 15px;
        height: calc(100% - 42px);

        &, & * {
            font-size: 12px;
        }

        .contentBox {
            position: relative;
            padding: 15px 0 15px 15px;
            border: 1px solid rgba(56, 67, 85, 0.05);
            background: rgba(6, 9, 13, 0.80);
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

            .contentName {
                font-weight: 700;

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
        overflow-y: scroll !important;
        ${(props) => props.theme.scroll()};
    }

`;


/**********************************************************************/
// 센서현황

export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 600px;
    top: 6%;
    left: 4%;

    .contentBox {
        height: 100%;
        padding: 15px 5px 15px 15px;

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
    }

    .treeWrap {
        margin-top: 5px;
        height: calc(100% - 50px);
        width: calc(100% - 1px);
        margin-bottom: 5px;
    }

    .tree {
        height: 100%;
        padding-right: 5px;

        li {
            cursor: pointer;
        }

        > li {
            padding: 9px 0;

            &:not(:first-child) {
                border-top: 1px solid #384355;
            }
        }

        .building {
            font-size: 14px;
            ${(props) => props.theme.flex()};
            padding: 0 8px;

            p {
                color: ${(props) => props.theme.fontTertiary};
                font-size: 14px;
                line-height: 172%;
            }

            &.on {
                p {
                    color: ${(props) => props.theme.primary};
                }
            }
        }
    }

    .tree-1depth {
        display: none;
        margin-top: 9px;

        > li {
            border-top: 1px dashed #384355;

            > div {
                ${(props) => props.theme.flex()};
                padding: 8px 8px 8px 16px;

                > p {
                    ${(props) => props.theme.flex()};
                    
                    &:first-child {
                        font-size: 14px;
                        line-height: 172%;
                        color: ${(props) => props.theme.fontTertiary};
                    }

                    &:last-child {
                        font-size: 10px;
                        font-weight: 500;
                        line-height: 10px;
                        padding: 5px 8px;
                        border-radius: 20px;
                        border: 1px solid ${(props) => props.theme.secondary};
                        color: ${(props) => props.theme.secondary};
                    }
                }

                &.on {
                    p {
                        color: ${(props) => props.theme.primary};

                        &:last-child {
                            border: 1px solid ${(props) => props.theme.primary};
                            color: ${(props) => props.theme.primary};
                        }
                    }
                }
            }
        }
        
        &.on {
            display: block;
        }
    }

    .tree-2depth {
        display: none;
        flex-direction: column;
        border-top: 1px dashed #384355;

        > li {
            ${(props) => props.theme.flex()};
            padding: 4px 16px;

            &:hover {
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.05);
            }

            > div {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 8px;

                > p {
                    line-height: 170%;
                }
            }

            > button {
                text-indent: -9999px;
                background: url(${sensor_arrow}) no-repeat center center;
                width: 12px;
                height: 12px;
            }

            &.selected {
                p {
                    color: ${(props) => props.theme.primary};
                }

                button {
                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                }
            }

            &.alarmOn.selected {
                p {
                    color: ${(props) => props.theme.warning};
                }

                button {
                    filter: invert(36%) sepia(73%) saturate(4091%) hue-rotate(343deg) brightness(85%) contrast(92%);
                }
            }

            &#off {
                p {
                    color: #7C8DA9;
                }
            }
        }

        &.on {
            display: flex;
        }
    }
`;


/**********************************************************************/
// 미니맵

export const MiniMapComponent = styled(PopupsCommon)`
    position: absolute;
    width: 550px;
    height: 420px;
    top: 75%;
    left: 84%;

    .content {
        > div {
            position: relative;
            width: 100%;
            height: 100%;
        }
    }

    @keyframes autoMinimapAlarmBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.25; }
    }

    .auto-minimap-alarm-blink {
        animation: autoMinimapAlarmBlink 1s ease-in-out infinite;
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
                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
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

export const EventDashboardComponent = styled(PopupsCommon)`
    position: absolute;
    width: 520px;
    top: 70px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 8px;
    border: 2px solid ${(props) => props.theme.warning};
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.08), 0px 10px 24px 0px rgba(0, 0, 0, 0.24);

    &.closePopup {
        animation: ${fadeOut} .3s ease-out;
    }

    > div {
        padding: 10px 20px;
        ${(props) => props.theme.flex()};
        
        > div {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;

            .eventIcon {
                width: 36px;
                height: 36px;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 50%;
                ${(props) => props.theme.flex('center', 'center')};

                > img {
                    text-indent: -9999px;
                }
            }

            .contentWrap {

                & * {
                    line-height: 172%;
                    font-size: 14px;
                }
    
                .text {
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 3px;
    
                    p {
                        font-weight: 500;
    
                        &:nth-child(1),
                        &:nth-child(3) {
                            color: ${(props) => props.theme.warning};
                        }
                    }
                }
    
                .autoClose {
                    color: #787C87;
                    font-size: 12px;
                    line-height: 170%;
                }
            }
        }

        .dslX {
            width: 9px;
            height: 9px;
            text-indent: -9999px;
            z-index: 1;
            cursor: pointer;
            
            background-color: #7C8DA9;
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='free-icon-reject-3705787 1' clip-path='url(%23clip0_625_4990)'%3E%3Cg id='Group'%3E%3Cpath id='Vector' d='M14 1.30003L12.7 0L7 5.69997L1.30003 0L0 1.30003L5.69997 7L0 12.7L1.30003 14L7 8.30003L12.7 14L14 12.7L8.30003 7L14 1.30003Z' fill='%237C8DA9'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_625_4990'%3E%3Crect width='14' height='14' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            mask-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='free-icon-reject-3705787 1' clip-path='url(%23clip0_625_4990)'%3E%3Cg id='Group'%3E%3Cpath id='Vector' d='M14 1.30003L12.7 0L7 5.69997L1.30003 0L0 1.30003L5.69997 7L0 12.7L1.30003 14L7 8.30003L12.7 14L14 12.7L8.30003 7L14 1.30003Z' fill='%237C8DA9'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_625_4990'%3E%3Crect width='14' height='14' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
            mask-repeat: no-repeat;
            mask-position: center center;

            position: absolute;
            top: 15px;
            right: 25px;
        }
    }
`;


/**********************************************************************/
// 거리측정 팝업
export const DistanceMeasureComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 180px;
    height: 182px;
    background-color: ${(props) => props.theme.background};
    z-index: 9999;

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

        .dslX {
            width: 12px;
            height: 12px;
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
    z-index: 9999;

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

        .dslX {
            width: 12px;
            height: 12px;
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
    width: 300px;
    height: 600px;
    top: 6%;
    left: 84%;

    .content {
        position: relative;
        padding: 15px 5px 15px 15px;

        .sortWrap {
            ${(props) => props.theme.flex()};
            gap: 10px;
            padding-right: 10px;

            select {
                background-color: rgba(255, 255, 255, 0.10);
                font-size: 10px;

                &:first-child {
                    flex: 2;
                }

                &:last-child {
                    flex: 1;
                }
    
                option {
                    background-color: ${(props) => props.theme.background};
                }
            }
        }

        .textWrap {
            margin-top: 15px;

            p {
                font-size: 12px;
                line-height: 170%;
                font-weight: 500;
                ${(props) => props.theme.flex('flex-start', 'center')};

                > span {
                    color: ${(props) => props.theme.primary};
                    margin-left: 4px;
                }

                &::before {
                    content: '';
                    display: block;
                    width: 16px;
                    height: 16px;
                    background: url(${alarm_off}) no-repeat center center;
                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                    margin-right: 4px;
                }
            }
        }

        .eventWrap {
            margin: 12px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: calc(100% - 88px);
            padding-right: 5px;

            .eventItem {
                border-radius: 4px;
                border: 1px solid #384355;
                background: rgba(12, 18, 26, 0.80);
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                header {
                    ${(props) => props.theme.flex()};
                    padding: 6px 15px;
                    background: rgba(255, 255, 255, 0.10);

                    .eventInfoWrap {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 5px;
                        width: calc(100% - 88px);

                        .sensorTypeName {
                            font-size: 14px;
                            font-weight: 500;
                            line-height: 172%; 
                            color: ${(props) => props.theme.fontTertiary};
                            ${(props) => props.theme.overText()};
                        }

                        .spreadSent {
                            color: ${(props) => props.theme.fontPrimary} !important;
                            border-radius: 2px;
                            background: ${(props) => props.theme.warning};
                            font-size: 10px;
                            font-weight: 700;
                            line-height: 10px;
                            padding: 4px;
                            white-space: nowrap;
                        }
                    }

                    .eventIconWrap {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 4px;

                        > button {
                            text-indent: -9999px;
                            width: 28px;
                            height: 28px;

                            &:hover {
                                filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                            }

                            &.eventMemo {
                                background: url(${event_memo}) no-repeat center center;
                            }

                            &.eventSpread {
                                background: url(${event_spread}) no-repeat center center;
                            }

                            &.eventClose {
                                background: url(${event_close}) no-repeat center center;
                            }
                        }
                    }
                }

                section {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 12px 15px;

                    p {
                        font-size: 12px;
                        line-height: 170%;
                    }
                }

                footer {
                    display: block;
                    border-top: 1px solid rgba(255, 255, 255, 0.10);
                    padding: 12px 15px;

                    button {
                        font-size: 12px;
                        line-height: 170%;
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        gap: 4px;
    
                        &::after {
                            content: '';
                            width: 8px;
                            height: 8px;
                            display: inline-block;
                            background: url(${arrow_white}) no-repeat center center;
                        }

                        &:hover {
                            color: ${(props) => props.theme.primary};

                            &::after {
                                filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                            }
                        }
                    }
                }

                &#onEvent {
                    background: rgba(12, 18, 26, 0.80);
                    box-shadow: 0px 0px 3px 0px #0095FF inset;

                    > header {
                        .eventInfoWrap {
                            .sensorTypeName{
                                color: ${(props) => props.theme.primary};
                            }
                        }
                    }
                }

                &.closed {
                    pointer-events: none;

                    & * {
                        color: #565B69 !important;
                    }

                    header {
                        .eventInfoWrap {
                            .spreadSent {
                                background: #0C121A;
                            }
                        }

                        .eventIconWrap {
                            .eventMemo {
                                background: url(${event_memo_disable}) no-repeat center center;
                            }
    
                            .eventSpread {
                                background: url(${event_spread_disable}) no-repeat center center;
                            }
    
                            .eventClose {
                                background: url(${event_close_disable}) no-repeat center center;
                            }
                        }
                    }

                    section {
                        p {
                            &::before {
                                background: #565B69;
                            }
                        }
                    }

                    footer {
                        button {
                            &::after {
                                background: url(${arrow_white_disable}) no-repeat center center;
                            }
                        }
                    }
                }
            }
        }
    
        .btnWrap {
            width: 100%;
    
            button {
                ${(props) => props.theme.button.primary('calc(100% - 10px)')};
            }
        }
    }
`;


/**********************************************************************/
// 이벤트 메모
export const EventMemoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background: ${(props) => props.$popupType === 'SDMS' ? '#141B27' : '#0D121A'};
    border: ${(props) => props.$popupType === 'SDMS' ? 'none' : '1px solid #29313E'};

    .dslTop {
        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 44px;
            left: 0;
            width: 100%;
            height: 1px;
            background: #29313E;
            z-index: 2;
        }

        &::after {
            display: none;
        }

        .dslTitle {
            ${(props) => props.theme.flex('flex-start', 'center')};

            &::before {
                content: '';
                display: inline-block;
                width: 2px;
                height: 2px;
                background-color: ${(props) => props.theme.primary};
                margin-right: 4px;
            }
        }

        .dslX {
            background: url(${close_icon_white}) no-repeat center center;
        }
    }

    .content {
        margin-top: 15px;

        textarea {
            width: 100%;
            height: ${(props) => props.$popupType === 'SDMS' ? '177px' : '225px'};
            background: #1B212C;
            border: 0;
            padding: 8px 10px;
            color: ${(props) => props.theme.fontPrimary};
            ${(props) => props.theme.scroll()};
        }

        .btnWrap {
            width: 100%;
            ${(props) => props.theme.flex()};
            gap: 5px;
            margin-top: 15px;

            button {
                height: 34px;
                border-radius: 2px;
                font-size: 14px;
                font-weight: 500;
                padding: 10px 20px;
                flex: 1;
            }

            .cancle {
                border: 1px solid #29313E;
            }

            .submit {
                background-color: ${(props) => props.theme.primary};
                color: #000000;
            }
        }
    }
`;



/**********************************************************************/
// 센서 상세정보
export const StatusSensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 400px;
    top: 62%;
    left: 4%;

    .content {
        justify-content: space-between;
        gap: 10px;

        .contentBox {

            .contentName {
                font-weight: 500;
            }

            &.chart {
                height: 100%;
                padding: 15px 5px 15px 15px;

                #tooltip {
                    position: absolute;
                    top: 15px;
                    right: 15px;

                    #toolTipContent {
                        display: none;
                        position: absolute;
                        top: -5px;
                        left: 50px;
                        width: 485px;
                        border: 1px solid #252930;
                        cursor: default;

                        &.on {
                            display: block;
                        }

                        &::after {
                            position: absolute;
                            top: 7.5px;
                            left: 0;
                            margin-left: -5px;
                            width: 0;
                            border-top: 5px solid transparent;
                            border-right: 5px solid #232B32;
                            border-bottom: 5px solid transparent;
                            content: " ";
                            font-size: 0;
                            line-height: 0;
                        }

                        span {
                            white-space: nowrap;
                        }

                        > ul {
                            width: 100%;
                            height: 20%;

                            li {
                                ${(props) => props.theme.flex()};
                                text-align: center;
                                height: 22px;

                                div {
                                    height: 22px;
                                    line-height: 22px;
                                }

                                > div:nth-child(1) {
                                    flex: 2;
                                }

                                > div:nth-child(2) {
                                    flex: 1;
                                }

                                > div:nth-child(3) {
                                    flex: 1;
                                }

                                > div:nth-child(4) {
                                    flex: 1;
                                }

                                > div:nth-child(5) {
                                    flex: 1;
                                }
                            }

                            li, li > span {
                                color: #CCCCCC;
                                font-size: 12px;
                                width: 100%;
                            }
                        }

                        .toolTipHead {
                            background: #252930;

                            > div:not(:last-child)  {
                                border-right: 1px solid #10141C;
                            }

                            .blueTxt, .greenTxt, .yellowTxt, .redTxt {
                                margin-right: 4px;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    margin-right: 3px;
                                }
                            }

                            .blueTxt {
                                &::before {
                                    background: ${(props) => props.theme.primary};
                                }
                            }

                            .yellowTxt {
                                &::before {
                                    background: #F9A825;
                                }
                            }

                            .redTxt {
                                &::before {
                                    background: ${(props) => props.theme.warning};
                                }
                            }
                        }

                        .toolTipBody {
                            background: ${(props) => props.theme.background};

                            > div:not(:last-child) {
                                border-right: 1px solid #252930;
                            }

                            &:not(:last-child) {
                                border-bottom: 1px solid #252930;
                            }
                        }
                    }
                }

                .head {
                    margin-top: 10px;
                    padding-right: 10px;

                    li {
                        ${(props) => props.theme.flex()};
                        text-align: center;
                        background: rgba(255, 255, 255, 0.05);
                        border-bottom: 2px solid #384355;

                        p {
                            flex: 1;
                            padding: 7px;
                            font-size: 12px;
                            color: ${(props) => props.theme.fontTertiary};
                        }
                    }
                }

                > .body {
                    height: calc(100% - 34px);
                    padding-right: 5px;

                    li {
                        ${(props) => props.theme.flex()};
                        border-bottom: 1px solid #384355;
                        
                        > div {
                            flex: 1;
                            padding: 7px;
                        }

                        > div > span {
                            display: block;
                            text-align: center;
                        }

                        &.warning {
                            p span {
                                color: ${(props) => props.theme.warning};
                            }
                        }

                        &.noData {
                            height: 135px;
                            justify-content: center;

                            span {
                                color: #7C8DA9;
                            }
                        }

                        .chartArea{
                            width: 46px;
                            height: 12px;
                            margin-left: 10px;
                            position: relative;
                            overflow: hidden;
                        }

                        .blackStickBox{
                            position: absolute;
                            left: 0px;
                            top: 0px;
                            display: block;
                            width: 50px;
                            height: 12px;
                            padding-left: 4px;
                        }

                        .chartStickBlack{
                            display: inline-block;
                            width: 2px;
                            height: 13px;
                            background-color: #06090D;
                            margin-right: 4px;
                            position: relative;
                            z-index: 2;
                        }

                        .chartStickBox{
                            position: absolute;
                            left: 0px;
                            top: 0px;
                            display: block;
                            width: 50px;
                            height: 12px;
                        }

                        .chartStickNormal{
                            display: inline-block;
                            width: 4px;
                            height: 13px;
                            background-color: #393C3F;
                            margin-right: 2px;
                            position: relative;
                            z-index: 1;
                        }

                        .chartAnimate1{
                            display: block;
                            background-color: ${(props) => props.theme.primary};
                            width: 10px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateBest} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                        }

                        .chartAnimate2{
                            display: block;
                            background-color: ${(props) => props.theme.primary};
                            width: 22px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateNormal} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                        }

                        .chartAnimate3{
                            display: block;
                            background-color: #F9A825;
                            width: 34px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateBad} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);                  
                        }

                        .chartAnimate4{
                            display: block;
                            background-color: ${(props) => props.theme.warning};
                            width: 58px;
                            height: 12px;
                            padding-left: 2px;
                            position: absolute;
                            z-index: 1;

                            animation: ${chartAnimateVeryBad} .5s ease-in-out;
                        }

                        &.weather {
                            
                            &.head {
                                text-align: center;
                                background: rgba(255, 255, 255, 0.05);
                                border-bottom: 2px solid #384355;
                                margin-top: 15px;
                                padding-right: 0;

                                p {
                                    flex: 1;
                                    padding: 7px;
                                    font-size: 12px;
                                    color: ${(props) => props.theme.fontTertiary};
                                }
                            }

                            &.body {
                                text-align: center;
                                border-bottom: 1px solid #384355;
                                /* padding-right: 0; */

                                p {
                                    flex: 1;
                                    padding: 7px;
                                    font-size: 12px;
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
// 네비게이션 바

export const NavigationBarComponent = styled.div`
    width: 68px;
    height: calc(100vh - 50px);
    background: linear-gradient(180deg, #0D121A 0%, rgba(13, 18, 26, 0.80) 50%, rgba(20, 27, 39, 0.85) 100%);
    backdrop-filter: blur(5px);
    position: fixed;
    left: 0;
    top: 50px;
    z-index: 3;

    ${(props) => props.theme.flex()};
    flex-direction: column;

    ul {
        ${(props) => props.theme.flex()};
        flex-direction: column;
        gap: 24px;
        position: relative;

        &:nth-child(1) {
            padding: 20px 0 0 0;

            &::after {
                content: '';
                width: calc(100% - 20px);
                height: 1px;
                background-color: #3C4143;
                display: block;
            }
        }

        &:nth-child(2) {
            padding: 30px 0 0 0;
        }

        li:not(.poiIcon, .toolIcon, .simulationTypeIcon) {
            ${(props) => props.theme.flex('center', 'center')};
            width: 48px;
            height: 48px;
            position: relative;
            cursor: pointer;

            &:not(.disable):hover, &.on {
                border-radius: 8px;
                background-color: #1A2434;
                box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
            }

            &:hover {
                &::after {
                    content:attr(data-title); 
                    position: absolute;
                    top: 18%;
                    left: 103%;
                    height: 32px;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    text-align: center;
                    white-space: nowrap;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background-color: #565B69;
                    color: #FFFFFF;
                    font-size: 14px;
                    z-index: 9999;
                }

                &::before {
                    content: " ";
                    position: absolute;
                    border-right: 7px solid #565B69;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    left: 90%;
                    top: 40%; 
                }
            }

            > button {
                width: 28px;
                height: 28px;
                border-radius: 8px;
            }

            &:last-child {
                margin-bottom: 6px;
            }

            &.disable, &.disable > button {
                cursor: default;
            }
        }
    }

    .statusInfoIcon {
        background: url(${nav_statusInfo}) no-repeat center center;

        &.on {
            background: url(${nav_statusInfo_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_statusInfo_disable}) no-repeat center center;
        }
    }

    .eventIcon {
        background: url(${nav_event}) no-repeat center center;
        
        &:not(&.disable) > button {
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: -1px;
                right: -1px;
                width: 4px;
                height: 4px;
                background: #FC8B4C;
                border-radius: 50%;
            }
        }

        &.on {
            background: url(${nav_event_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_event_disable}) no-repeat center center;
        }
    }

    .publicDataIcon {
        background: url(${nav_publicData}) no-repeat center center;

        &.on {
            background: url(${nav_publicData_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_publicData_disable}) no-repeat center center;
        }
    }

    .miniMapIcon {
        background: url(${nav_miniMap}) no-repeat center center;

        &.on {
            background: url(${nav_miniMap_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_miniMap_disable}) no-repeat center center;
        }
    }

    .poiViewerIcon {
        background: url(${nav_poi}) no-repeat center center;

        &.on {
            background: url(${nav_poi_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_poi_disable}) no-repeat center center;
        }
    }

    .tool3DIcon {
        background: url(${nav_3d}) no-repeat center center;

        &.on {
            background: url(${nav_3d_on}) no-repeat center center;
        }

        &.disable {
            background: url(${nav_3d_disable}) no-repeat center center;
        }
    }

    .poiIcon, .toolIcon, .simulationTypeIcon {
        position: absolute;
        right: -62px;
        ${(props) => props.theme.flex()};
        flex-direction: column;
        gap: 4px;

        > button {
            position: relative;
            width: 44px;
            height: 44px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.10);
            background-color: rgba(13, 18, 26, 0.80);
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.06), 0px 10px 17px 0px rgba(0, 0, 0, 0.18);

            &:hover {
                &::after {
                    content:attr(data-title); 
                    position: absolute;
                    top: 50%;
                    transform: translate(0, -50%);
                    left: 55px;
                    height: 32px;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    text-align: center;
                    white-space: nowrap;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background-color: #565B69;
                    color: #FFFFFF;
                    font-size: 14px;
                    z-index: 9999;
                }

                &::before {
                    content: " ";
                    position: absolute;
                    border-right: 7px solid #565B69;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    left: 49px;
                    top: 50%;
                    transform: translate(0, -50%); 
                }
            }
        }
    }

    .poiIcon {
        top: 30px;

        > button {
            &:nth-child(1) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_1}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_1}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_1_on}) no-repeat center center;
                }
            }

            &:nth-child(2) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_2}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_2}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_2_on}) no-repeat center center;
                }
            }

            &:nth-child(3) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_3}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_3}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_3_on}) no-repeat center center;
                }
            }

            &:nth-child(4) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_4}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_4}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_4_on}) no-repeat center center;
                }
            }

            &:nth-child(5) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_5}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_5}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_5_on}) no-repeat center center;
                }
            }

            &:nth-child(6) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_6}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_6}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_6_on}) no-repeat center center;
                }
            }

            &:nth-child(7) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_7}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_7}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_7_on}) no-repeat center center;
                }
            }

            &:nth-child(8) {
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_8}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_8}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_8_on}) no-repeat center center;
                }
            }
        }
    }

    .toolIcon {
        top: 103px;

        > button {
            &:nth-child(1) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_1}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_1}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_1_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_1_on}) no-repeat center center;
                }
            }

            &:nth-child(2) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_2}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_2}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_2_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_2_on}) no-repeat center center;
                }
            }

            &:nth-child(3) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_3}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_3}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_3_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_3_on}) no-repeat center center;
                }
            }

            &:nth-child(4) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_4}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_4}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_4_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_4_on}) no-repeat center center;
                }
            }

            &:nth-child(5) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_5}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_5}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_5_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_5_on}) no-repeat center center;
                }

                &.rotate {
                    background: rgba(13, 18, 26, 0.80) url(${toolIcon_6}) no-repeat center center;

                    &:hover {
                        background: #1A2434 url(${toolIcon_6}) no-repeat center center;
                    }

                    &.disable {
                        background: #1A2434 url(${toolIcon_6_off}) no-repeat center center;
                    }

                    &.on {
                        background: #1A2434 url(${toolIcon_6_on}) no-repeat center center;
                    }
                }
            }

            &:nth-child(6) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_8}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_8}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_8_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_8_on}) no-repeat center center;
                }
            }

            &:nth-child(7) {
                background: rgba(13, 18, 26, 0.80) url(${toolIcon_7}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${toolIcon_7}) no-repeat center center;
                }
                
                &.disable {
                    background: #1A2434 url(${toolIcon_7_off}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${toolIcon_7_on}) no-repeat center center;
                }
            }
        }
    }

    .simulationIcon {
        background: url(${nav_simulation}) no-repeat center center;
        margin-bottom: 0 !important;

        &.on {
            background: url(${nav_simulation_on}) no-repeat center center;
        }
    }

    .simulationTypeIcon { 
        bottom: 25px;

        > button {
            &:nth-child(1) { 
                background: rgba(13, 18, 26, 0.80) url(${simulationIcon_1}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${simulationIcon_1}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${simulationIcon_1_on}) no-repeat center center;
                }
            }

            &:nth-child(2) {
                background: rgba(13, 18, 26, 0.80) url(${simulationIcon_2}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${simulationIcon_2}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${simulationIcon_2_on}) no-repeat center center;
                }
            }
        }
    }
`;



/**********************************************************************/
// 기상센서 상세정보

export const WeatherInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 387px;
    min-width: 300px;
    min-height: 387px;
    top: 62%;
    left: 4%;

    .contentBox {
        padding: 15px !important;

        &.current {
            min-height: 197px;
        }

        &.chart {
            margin-top: 10px;
            padding: 0 !important;
            height: calc(100% - 65px);

            .contentName {
                text-indent: -9999px;
            }
        }

        .currentWrap {
            > ul {
                ${(props) => props.theme.flex()};
                gap: 4px;
                flex: 1;

                &:first-child {
                    margin: 10px 0 4px 0;
                }

                li {
                    ${(props) => props.theme.flex('center', 'center')};
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.05);
                    flex: 1;
                    cursor: pointer;
                    height: 70px;
                    width: 100%;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 2px;

                    &:hover {
                        background: rgba(255, 255, 255, 0.10);
                        border: 1px solid rgba(255, 255, 255, 0.10);
                    }

                    > p {
                        font-size: 14px;
                        line-height: 172%; 

                        &:first-child {
                            color: #C4E7FF;
                        }

                        &:last-child {
                            font-weight: 500;
                            width: 100%;
                            ${(props) => props.theme.overText()};
                            text-align: center;
                        }
                    }

                    &.on {
                        border: 1px solid ${(props) => props.theme.primary};

                        > p {

                            &:last-child {
                                color: ${(props) => props.theme.primary};
                            }
                        }
                    }
                }
            }
        }

        .bearingWrap {
            ${(props) => props.theme.flex()};
            padding: 10px 10px 15px 10px;

            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 5px 10px;

                &:not(:last-child) {
                    border-right: 1px solid rgba(255, 255, 255, 0.10);
                }
            }
        }

        .chartArea {
            padding-right: 5px;
        }

        .noData {
            height: calc(100% - 24px);
            ${(props) => props.theme.flex('center', 'center')};
            
            p {
                font-size: 12px;
                color: #7C8DA9;
            }
        }
    }
`;


/**********************************************************************/
// 대기 시뮬레이션
export const AtmosphereSimulationComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 516px;
    top: 6%;
    left: 83.5%;


    .content {
        gap: 10px;
    
        .menuBtn {
            ${(props) => props.theme.flex()};
    
            > button {
                font-weight: 500;
                background-color: rgba(255, 255, 255, 0.10);
                padding: 10px;
                flex: 1;
                font-size: 14px;
    
                &.on {
                    background-color: ${(props) => props.theme.primary};
                    color: ${(props) => props.theme.background};
                }
            }
        }
    }

    .contentBox {
        padding: 15px !important;

        .contentHeadWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
            margin-bottom: 15px;

            .contentName {
                width: auto;
            }
        }

        > p {
            margin-bottom: 15px;
        }

        .defaultWrap {
            display: flex;
            flex-direction: column;
            gap: 15px;

            > li {
                ${(props) => props.theme.flex()};
                height: 22px;

                > div {
                    ${(props) => props.theme.flex('flex-end', 'center')};
                }

                &:nth-child(1) {

                    .datepicker {
                        position: relative;

                        input[type="text"] {
                            display: block;
                            width: 116px;
                            background: #1B212C;
                            height: 22px;
                            font-size: 12px;
                            padding-left: 10px;
                            padding-right: 32px;
                            border: none;
                        }

                        .btnCalendarBk {
                            width: 18px;
                            height: 18px;
                            display: inline-block;
                            z-index: 1;
                            position: absolute;
                            right: 4px;
                            //cursor: pointer;
                        }
                    }
                }

                &:nth-child(2) {

                    > div {
                        gap: 5px;

                        > button {
                            background-color: #1B212C;
                            padding: 5px;
                            border-radius: 2px;

                            &.on {
                                background-color: ${(props) => props.theme.primary};
                                color: ${(props) => props.theme.background};
                            }
                        }
                    }
                }

                &:nth-child(3) {

                    > div {
                        gap: 8px;

                        > p {
                            color: ${(props) => props.theme.primary};
                        }

                        > button {
                            width: 22px;
                            height: 22px;
                            text-indent: -9999px;
                            border-radius: 2px;

                            &.on {
                                background: #1B212C url(${ simulation_arrow }) no-repeat center center;
                            }

                            &.off {
                                background: #1B212C url(${ simulation_stop }) no-repeat center center;
                            }
                        }
                    }
                }

                &:nth-child(4) {
                    flex-direction: column;

                    input[type=range] {
                        width: 241px;
                        height: 5px;
                        background-color: #1B212C;
                        cursor: pointer;
                        -webkit-appearance: none;
                        position: absolute;
                    }

                    input[type=range]::-webkit-slider-thumb { 
                        -webkit-appearance: none;
                        background: ${(props) => props.theme.fontPrimary};
                        cursor: pointer;
                        height: 10px; 
                        width: 10px;   
                        border-radius: 5px;
                        border: 2px solid ${(props) => props.theme.primary};
                    }

                    > div {
                        ${(props) => props.theme.flex()};
                        width: 100%;
                        position: relative;
                        top: 12px;

                        > p {
                            font-size: 10px;
                        }
                    }
                }
            }
        }

        .dataWrap {

            li {
                ${(props) => props.theme.flex()};
                
                &:first-child {
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px dashed #384355;
                }
            }
        }

        .legendWrap {

            > div {
                ${(props) => props.theme.flex()};
                margin-bottom: 4px;

                > p {
                    font-size: 10px;
                }
            }
        }
    }
`;



/**********************************************************************/
// 공공 데이터
export const PublicDataComponent = styled(PopupsCommon)`
    position: absolute;
    width: 300px;
    height: 476px;
    top: 6%;
    left: 83.5%;

    .content {

        .menuWrap {
            ${(props) => props.theme.flex('center', 'center')};
            gap: 1px;
            margin-bottom: 10px;

            > button {
                flex: 1;
                padding: 10px;
                font-size: 14px;
                font-weight: 500;
                line-height: 14px; /* 100% */
                background: rgba(255, 255, 255, 0.10);

                &.on {
                    background: ${(props) => props.theme.primary};
                    color: #0D121A;
                }
            }
        }

        .contentWrap {
            height: calc(100% - 40px);
            display: flex;
            flex-direction: column;
            min-height: 0;

            select {
                width: 100%;
                height: 28px;
                background-color: rgba(255, 255, 255, 0.10);
                margin-bottom: 15px;
    
                option {
                    background-color: ${(props) => props.theme.background};
                }
            }
    
            .contentBox {
                flex: 1 1 auto;
                min-height: 0;
                padding-right: 15px;

                .location {
                    margin-bottom: 10px;
                    ${(props) => props.theme.flex('flex-start', 'center')};
                    gap: 4px;

                    &::before {
                        content: '';
                        display: inline-block;
                        min-width: 16px;
                        min-height: 16px;
                        background: url(${locationIcon}) no-repeat center center;
                    }

                    > p {
                        color: #D7EFFF;
                        font-size: 12px;
                        font-weight: 500;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        ${(props) => props.theme.overText()};
                    }
                }

                > ul {
                    > li {
                        ${(props) => props.theme.flex()};
                        padding: 4px;

                        > span {
                            flex: 1;
                            ${(props) => props.theme.flex('center', 'center')};
                            font-size: 12px;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                        }
                    }

                    &.head {
                        border-bottom: 2px solid #384355;

                        li {
                            background: rgba(255, 255, 255, 0.05);

                            span {
                                color: #D7EFFF;
                                font-weight: 500;
                            }
                        }
                    }

                    &.body {
                        height: calc(100% - 60px);
                        overflow-y: auto !important;

                        li {
                            background: rgba(12, 18, 26, 0.80);

                            &:not(:last-child) {
                                border-bottom: 1px solid #384355;
                            }

                            &.disable {
                                span {
                                    color: #565B69;
                                }
                            }
                        }
                    }
                }

                .noData {
                    width: 100%;
                    height: 100%;
                    ${(props) => props.theme.flex('center', 'center')};
                    flex-direction: column;

                    &::before {
                        content: '';
                        display: block;
                        width: 24px;
                        height: 24px;
                        background: url(${noDataIcon}) no-repeat center center;
                        margin-bottom: 8px;
                    }

                    > p {
                        &:nth-child(1) {
                            color: #EBEBED;
                            font-size: 14px;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            margin-bottom: 4px;
                        }

                        &:nth-child(2) {
                            color: #787C87;
                            font-size: 12px;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                        }
                    }
                }
            }
    
            .timeWrap {
                padding: 0 12px;
                margin-top: 10px;
                ${(props) => props.theme.flex('flex-end', 'center')};
                gap: 8px;
    
                span {
                    color: #7C8DA9;
                    font-size: 12px;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                }
            }
        }
    }
`;