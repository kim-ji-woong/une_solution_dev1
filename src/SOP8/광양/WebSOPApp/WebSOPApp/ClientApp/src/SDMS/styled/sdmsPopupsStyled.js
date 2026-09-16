import styled, { keyframes } from "styled-components";

import close_icon_white from '../images/close_icon_white.svg';
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
import poiIcon_1_on from '../images/poiIcon_1_on.svg';
import poiIcon_2_on from '../images/poiIcon_2_on.svg';
import poiIcon_3_on from '../images/poiIcon_3_on.svg';
import poiIcon_4_on from '../images/poiIcon_4_on.svg';
import poiIcon_5_on from '../images/poiIcon_5_on.svg';
import poiIcon_6_on from '../images/poiIcon_6_on.svg';
import poiIcon_7_on from '../images/poiIcon_7_on.svg';
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

import pohang_map_background from '../../Common/images/pohang_map_background.png'

import simulation_arrow from '../images/simulation_arrow.svg';
import simulation_stop from '../images/simulation_stop.svg';

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
    background: rgba(20, 27, 39, 0.93);
    position: relative;
    cursor: default;
    opacity: ${props => props.$opacity};
    user-select: none;
    border-radius: 8px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.06), 0 10px 17px 0 rgba(0, 0, 0, 0.18), 0 0 2px 0 rgba(221, 233, 255, 0.35) inset;
    overflow: hidden;

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
        ${({ theme }) => theme.mixins.flex()};
        padding: 8px 16px;
        border-bottom: 1px solid var(--grayscale-g-8502-a-2-f-3-d, #2A2F3D);
        background: linear-gradient(180deg, #3C424D 0%, #0F131A 100%);

        .dslTitle {
            font-size: 14px;
            font-weight: 500;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.primary.p200};
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
        }

        input[type=range] {
            width: 50px;
            height: 3px;
            background-color: ${({ theme }) => theme.colors.primary.p500};
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
            background: ${({ theme }) => theme.colors.primary.p500};
            cursor: pointer;
            height: 8px; 
            width: 2px;   
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        height: calc(100% - 40px);

        &, & * {
            font-size: 12px;
        }

        .contentName {
            font-weight: 500;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;
            color: ${({ theme }) => theme.colors.primary.p100};
            margin-bottom: 5px;
        }
    }

    #tooltip {
        margin-left: 5px;

        > svg {
            cursor: help;
        }
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
        background-color: ${({ theme }) => theme.colors.white};
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
        border-top: 5px solid ${({ theme }) => theme.colors.white};
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
        ${({ theme }) => theme.mixins.scroll('#121721', '#3C424D')};
    }
`;


/**********************************************************************/
// 센서현황

export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 596px;
    top: 60px;
    left: 10px;

    .content {
        padding: 16px 4px 16px 16px;

        .searchWrap {
            padding-right: 12px;
            margin-bottom: 12px;
        }
    }

    .treeWrap {
        height: calc(100% - 50px);
        width: calc(100% - 1px);
    }

    .tree {
        height: 100%;
        padding-right: 7px;

        li {
            cursor: pointer;
        }

        > li {
            padding: 8px 0;

            &:not(:first-child) {
                border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
            }
        }

        .building {
            ${({ theme }) => theme.mixins.flex()};
            padding: 0 8px;

            p {
                color: ${({ theme }) => theme.colors.white};
                font-size: 14px;
                line-height: 172%;
                letter-spacing: -0.42px;
            }

            &:hover,
            &.on {
                p {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }
    }

    .tree-1depth {
        display: none;
        margin-top: 9px;

        > li {
            border-top: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};

            > div {
                ${({ theme }) => theme.mixins.flex()};
                padding: 8px 8px 8px 16px;

                > p {
                    ${({ theme }) => theme.mixins.flex()};
                    
                    &:first-child {
                        font-size: 14px;
                        line-height: 172%;
                        color: ${({ theme }) => theme.colors.white};
                    }

                    &:last-child {
                        font-size: 10px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 10px; /* 100% */
                        padding: 5px 8px;
                        border-radius: 20px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                        color: ${({ theme }) => theme.colors.grayscale.g300};
                    }
                }

                &:hover,
                &.on {
                    p {
                        color: ${({ theme }) => theme.colors.primary.p500};

                        &:last-child {
                            border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                            color: ${({ theme }) => theme.colors.primary.p500};
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
        border-top: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};

        > li {
            ${({ theme }) => theme.mixins.flex()};
            padding: 4px 16px;

            .sensorText {
                flex: 1;
                min-width: 0;
                ${({ theme }) => theme.mixins.textEllipsis()};
            }

            &:hover {
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.05);
            }

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                gap: 8px;
                min-width: 0; 

                > p {
                    line-height: 170%;
                }
            }

            > button {
                text-indent: -9999px;
                background: url(${sensor_arrow}) no-repeat center center;
                width: 12px;
                height: 12px;
                flex-shrink: 0;
            }

            &.selected {
                p {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }

                button {
                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                }
            }

            &.alarmOn.selected {
                p {
                    color: ${({ theme }) => theme.colors.error.error500};
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
    width: 340px;
    height: 280px;
    bottom: 10px;
    right: 360px;

    .content {
        padding: 16px;

        > div {
            position: relative;
            width: 100%;
            height: 100%;
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
            ${({ theme }) => theme.mixins.flex()};
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
            ${({ theme }) => theme.mixins.flex()};
            width: 100%;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.05);

            &.selected {

                p {
                    color: ${({ theme }) => theme.colors.primary.p500};
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
    border: 2px solid ${({ theme }) => theme.colors.error.error500};
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.08), 0px 10px 24px 0px rgba(0, 0, 0, 0.24);

    &.closePopup {
        animation: ${fadeOut} .3s ease-out;
    }

    > div {
        padding: 10px 20px;
        ${({ theme }) => theme.mixins.flex()};
        
        > div {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            gap: 12px;

            .eventIcon {
                width: 36px;
                height: 36px;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 50%;
                ${({ theme }) => theme.mixins.flex('center', 'center')};

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
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                    gap: 3px;
    
                    p {
                        font-weight: 500;
    
                        &:nth-child(1),
                        &:nth-child(3) {
                            color: ${({ theme }) => theme.colors.error.error500};
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
            position: absolute;
            top: 10px;
            right: 20px;
        }
    }
`;


/**********************************************************************/
// 거리측정 팝업
export const DistanceMeasureComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 240px;
    height: 232px;
    background: rgba(20, 27, 39, 0.92);
    z-index: 9999;

    .rangeContent {

        .total {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;

            li {
                padding: 16px;
                border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                ${({ theme }) => theme.mixins.flex()};

                > p {
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    color: #7C8DA9;
                }

                &.on p {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }

        .range {
            width: 100%;
            padding: 24px 0;
            font-size: 12px;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;
            color: #7C8DA9;
            text-align: center;
            white-space: pre-line;
        }
    }
`;


/**********************************************************************/
// 키맵 팝업
export const KeyMapComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    right: 10px;
    width: 240px;
    background: rgba(20, 27, 39, 0.92);
    z-index: 9999;

    .keyMapContent {
        ul {
            li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 11px 16px;

                &:not(:last-child) {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                }

                > p {
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.white};
                }

                > div {
                    ${({ theme }) => theme.mixins.flex()};
                    gap: 28px;
                    position: relative;

                    > p {
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 12px;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        width: 28px;
                        text-align: center;
                    }

                    > p:first-child {
                        color: ${({ theme }) => theme.colors.primary.p500};
                        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                    }

                    > p:last-child {
                        color: ${({ theme }) => theme.colors.grayscale.g900};
                        background: ${({ theme }) => theme.colors.primary.p500};
                        font-weight: 500;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${keyMap_plus}) no-repeat center center;
                            position: absolute;
                            top: 50%;
                            left: 43%;
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
    width: 340px;
    height: 600px;
    top: 60px;
    right: 10px;

    .content {
        height: calc(100% - 40px);
        position: relative;
        padding: 16px 4px 16px 16px;

        .sortWrap {
            ${({ theme }) => theme.mixins.flex()};
            gap: 4px;
            padding-right: 14px;

            div {
                flex: 1;
            }
        }

        .textWrap {
            margin-top: 16px;

            p {
                font-size: 12px;
                line-height: 170%;
                letter-spacing: -0.36px;
                font-weight: 500;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                > span {
                    color: ${({ theme }) => theme.colors.primary.p500};
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
            margin: 12px 0 15px 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: calc(100% - 88px);
            padding-right: 7px;

            .eventItem {
                flex-shrink: 0;
                border-radius: 4px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                background: ${({ theme }) => theme.colors.background.surface};
                overflow: hidden;
                cursor: pointer;

                &:hover {
                    background: ${({ theme }) => theme.colors.background.elevated};
                }

                header {
                    ${({ theme }) => theme.mixins.flex()};
                    padding: 6px 15px;
                    background: rgba(255, 255, 255, 0.10);

                    .eventInfoWrap {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        gap: 4px;
                        width: calc(100% - 88px);

                        .sensorTypeName {
                            font-size: 14px;
                            font-weight: 500;
                            line-height: 172%; 
                            letter-spacing: -0.42px;
                            color: ${({ theme }) => theme.colors.primary.p100};
                            ${({ theme }) => theme.mixins.textEllipsis()};
                        }

                        .spreadSent {
                            color: ${({ theme }) => theme.colors.white} !important;
                            border-radius: 2px;
                            background: ${({ theme }) => theme.colors.error.error500};
                            font-size: 10px;
                            font-weight: 700;
                            line-height: 10px;
                            padding: 4px;
                            white-space: nowrap;
                        }
                    }

                    .eventIconWrap {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        gap: 4px;

                        .on {
                            position: relative;

                            &::before {
                                content: '';
                                display: inline-block;
                                width: 2px;
                                height: 2px;
                                position: absolute;
                                top: 2px;
                                right: 2px;
                                background-color: ${({ theme }) => theme.colors.secondary.s400};
                                border-radius: 50%;
                            }
                        }
                    }
                }

                section {
                    display: flex;
                    flex-direction: column; 
                    gap: 4px;
                    padding: 12px 16px;

                    p {
                        font-size: 14px;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                    }
                }

                footer {
                    display: block;
                    border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                    padding: 12px 16px;
                }

                &#onEvent {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};

                    > header {
                        .eventInfoWrap {
                            .sensorTypeName{
                                color: ${({ theme }) => theme.colors.primary.p500};
                            }
                        }
                    }
                }

                &.closed {
                    pointer-events: none;

                    & * {
                        color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                    }

                    header {
                        .eventInfoWrap {
                            .spreadSent {
                                background: ${({ theme }) => theme.colors.grayscale.g800};
                            }
                        }
                    }
                }
            }
        }
    
        .btnWrap {
            width: calc(100% - 10px);
        }
    }
`;


/**********************************************************************/
// 이벤트 메모
export const EventMemoComponent = styled.div`
    position: absolute;
    width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    padding: 32px;
    background: ${({ theme }) => theme.colors.background.base};
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);

    height: ${({ $isEditMode, $selectedOption }) => {
        if (!$isEditMode) return "332px";      // 읽기 모드
        if ($isEditMode && $selectedOption === "direct") return "584px"; // 직접입력
        return "424px"; // 수정 모드 기본
    }};
    transition: height 0.3s ease; 

    .dslTop {
        ${({ theme }) => theme.mixins.flex()};

        h5 {
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.6px;
        }
    }

    .content {
        .memo {
            margin-top: 28px;
            padding: 8px 20px;
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g20};

            &.disable {
                color: ${({ theme }) => theme.colors.grayscale.g300};
            }
        }

        .radioGroup {
            margin-top: 28px;
            ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column')};

            > label {
                width: 100%;
                padding: 8px 0;
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;

                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};

                &:not(:last-child) {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                }
            }
        }

        .btnWrap {
            position: absolute;
            bottom: 0;
            left: 0;
            border-radius: 0 0 12px 12px;
            width: 100%;
            background: #2A3344;
            padding: 12px 32px;
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '24px')};
        }
    }

    i, svg {
        color: inherit;
        fill: currentColor;
    }

    .confirmBtn {
        font-size: 0.875rem;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 4px;
        padding: 4px 6px;
        color: ${({ theme }) => theme.colors.grayscale.g500};
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};

        &:hover {
            background: ${({ theme }) => theme.colors.grayscale.g25};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p800};
            background: ${({ theme }) => theme.colors.grayscale.g50};

            .leftIcon {
                color: ${({ theme }) => theme.colors.primary.p800};
            }
        }

        &:disabled {
            color: ${({ theme }) => theme.colors.grayscale.g700} !important;
            cursor: not-allowed;
            pointer-events: none;
        }

        .leftIcon {
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }
    }

    .edit, .submit {
        color: ${({ theme }) => theme.colors.primary.p500};

        &:active {
            color: ${({ theme }) => theme.colors.primary.p800};
        }
    }

    textarea {
        margin-top: 28px;
    }
`;



/**********************************************************************/
// 센서 상세정보
export const StatusSensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 369px;
    bottom: 10px;
    left: 10px;
    overflow: visible;
    
    .dslTop {
        border-radius: 8px 8px 0 0;
    }

    .content {
        padding: 16px 4px 16px 16px;

        .contentName {
            margin-bottom: 0;
        }

        &.chart {
            height: calc(100% - 41px);

            .header {
                ${({ theme }) => theme.mixins.flex()};
                padding-right: 12px;
            }

            #tooltip {
                position: relative;
                cursor: help;

                .tooltipIcon {
                    color: ${({ theme }) => theme.colors.grayscale.g300};

                    &:hover{ 
                        color: ${({ theme }) => theme.colors.primary.p400};
                    }
                }

                #toolTipContent {
                    position: absolute;
                    top: -5px;
                    left: 27px;
                    width: 480px;
                    border-radius: 8px;
                    cursor: default;

                    &::after {
                        position: absolute;
                        top: 7.5px;
                        left: 0;
                        margin-left: -5px;
                        width: 0;
                        border-top: 5px solid transparent;
                        border-right: 5px solid #1E232C;
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
                            ${({ theme }) => theme.mixins.flex()};
                            text-align: center;

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
                            width: 100%;
                        }
                    }

                    .toolTipHead {
                        background: #1E232C;
                        border-radius: 8px 8px 0 0;

                        > div:not(:last-child)  {
                            border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                        }

                        span {
                            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '5px')};
                            font-size: 12px;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                        }

                        .blueTxt, .greenTxt, .yellowTxt, .redTxt {

                            &::before {
                                content: '';
                                display: inline-block;
                                width: 5px;
                                height: 5px;
                                border-radius: 50%;
                            }
                        }

                        .greenTxt {
                            &::before {
                                background: ${({ theme }) => theme.colors.success.success400};
                            }
                        }

                        .blueTxt {
                            &::before {
                                background: ${({ theme }) => theme.colors.primary.p400};
                            }
                        }

                        .yellowTxt {
                            &::before {
                                background: ${({ theme }) => theme.colors.warning.warning400};
                            }
                        }

                        .redTxt {
                            &::before {
                                background: ${({ theme }) => theme.colors.error.error400};
                            }
                        }
                    }

                    .toolTipBody {
                        background: #121721;

                        &:last-child {
                            border-radius: 0 0 8px 8px;
                        }

                        > div:not(:last-child) {
                            border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                        }

                        &:not(:last-child) {
                            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                        }

                        span {
                            padding: 4px;
                            font-size: 12px;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.white};
                        }

                    }
                }
            }

            .head {
                margin-top: 8px;
                padding-right: 11px;

                li {
                    ${({ theme }) => theme.mixins.flex()};
                    text-align: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g800};

                    p {
                        &:nth-child(1) {
                            flex: 2;
                        }
                        
                        flex: 1;
                        padding: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }
                }
            }

            > .body {
                height: calc(100% - 34px);
                padding-right: 6px;

                li {
                    ${({ theme }) => theme.mixins.flex()};
                    background-color: ${({ theme }) => theme.colors.background.surface};
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                    
                    > div {

                        &:nth-child(1) {
                            flex: 2;
                        }

                        flex: 1;
                        padding: 4px;
                    }

                    > div > span {
                        display: block;
                        text-align: center;
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;

                        &.noData {
                            color: ${({ theme }) => theme.colors.grayscale.g800};
                        }
                    }

                    &.warning {
                        div span {
                            color: ${({ theme }) => theme.colors.error.error400};
                        }
                    }

                    &.noData {
                        height: 135px;
                        justify-content: center;

                        span {
                            color: ${({ theme }) => theme.colors.grayscale.g800};
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
                        background-color: ${({ theme }) => theme.colors.background.surface};
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
                        background-color: ${({ theme }) => theme.colors.grayscale.g800};
                        margin-right: 2px;
                        position: relative;
                        z-index: 1;
                    }

                    .chartAnimate1{
                        display: block;
                        background-color: ${({ theme }) => theme.colors.success.success400};
                        width: 10px;
                        height: 12px;
                        padding-left: 2px;
                        position: absolute;
                        z-index: 1;

                        animation: ${chartAnimateBest} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                    }

                    .chartAnimate2{
                        display: block;
                        background-color: ${({ theme }) => theme.colors.primary.p400};
                        width: 22px;
                        height: 12px;
                        padding-left: 2px;
                        position: absolute;
                        z-index: 1;

                        animation: ${chartAnimateNormal} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);
                    }

                    .chartAnimate3{
                        display: block;
                        background-color: ${({ theme }) => theme.colors.warning.warning400};
                        width: 34px;
                        height: 12px;
                        padding-left: 2px;
                        position: absolute;
                        z-index: 1;

                        animation: ${chartAnimateBad} 1s cubic-bezier(0.965, 0.005, 0.080, 1.015);                  
                    }

                    .chartAnimate4{
                        display: block;
                        background-color: ${({ theme }) => theme.colors.error.error400};
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
                            border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g800};
                            margin-top: 15px;
                            padding-right: 0;

                            p {
                                flex: 1;
                                padding: 4px;
                                font-size: 12px;
                                font-weight: 500;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;
                                color: ${({ theme }) => theme.colors.grayscale.g100};
                            }
                        }

                        &.body {
                            text-align: center;
                            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

                            p {
                                flex: 1;
                                padding: 4px;
                                font-size: 12px;
                                font-weight: 400;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;
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

    ${({ theme }) => theme.mixins.flex()};
    flex-direction: column;

    ul {
        ${({ theme }) => theme.mixins.flex()};
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
            ${({ theme }) => theme.mixins.flex('center', 'center')};
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
        ${({ theme }) => theme.mixins.flex()};
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
                background: rgba(13, 18, 26, 0.80) url(${poiIcon_7}) no-repeat center center;

                &:hover {
                    background: #1A2434 url(${poiIcon_7}) no-repeat center center;
                }

                &.on {
                    background: #1A2434 url(${poiIcon_7_on}) no-repeat center center;
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
    width: 340px;
    height: 361px;
    bottom: 10px;
    left: 10px;

    .contentBox {
        padding: 16px !important;

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
                ${({ theme }) => theme.mixins.flex()};
                gap: 8px;

                &:first-child {
                    margin: 3px 0 8px 0;
                }

                li {
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.05);
                    flex: 1;
                    cursor: pointer;
                    height: 70px;
                    width: 100%;
                    overflow: hidden;
                    border: 1px solid transparent;
                    border-radius: 4px;

                    &:hover {
                        background: rgba(255, 255, 255, 0.10);
                        border: 1px solid transparent;
                        
                        > p {

                            &:last-child {
                                color: ${({ theme }) => theme.colors.primary.p500};
                            }
                        }
                    }

                    > p {
                        font-size: 14px;
                        line-height: 172%; 

                        &:first-child {
                            color: ${({ theme }) => theme.colors.grayscale.g50};
                        }

                        &:last-child {
                            font-weight: 500;
                            width: 100%;
                            ${({ theme }) => theme.mixins.textEllipsis()};
                            text-align: center;
                            color: ${({ theme }) => theme.colors.white};
                        }
                    }

                    &.on {
                        border: 1px solid ${({ theme }) => theme.colors.primary.p500};

                        > p {

                            &:last-child {
                                color: ${({ theme }) => theme.colors.primary.p500};
                            }
                        }
                    }
                }
            }
        }

        .bearingWrap {
            ${({ theme }) => theme.mixins.flex()};
            padding: 10px 10px 15px 10px;

            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 5px 15px;

                &:not(:last-child) {
                    border-right: 1px dashed rgba(255, 255, 255, 0.10);
                }

                > p {
                    font-size: 10px;

                    &:last-child {
                        margin-top: 7px;
                    }
                }
            }
        }

        .chartArea {
            padding-right: 5px;
        }

        .noData {
            height: calc(100% - 24px);
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            
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
    width: 340px;
    height: 621px;
    top: 60px;
    right: 10px;
    overflow: visible;

    .dslTop {
        border-radius: 8px 8px 0 0;
    }

    .content {
        padding: 16px;
        gap: 16px;
        
        * {
            font-size: 14px;
        }
    
        .menuBtn {
            ${({ theme }) => theme.mixins.flex()};
    
            > button {
                font-weight: 500;
                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                padding: 10px;
                flex: 1;
    
                &.on {
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                    color: #0D121A;
                }
            }
        }
    }

    .contentBox {
        padding: 15px !important;
        background-color: ${({ theme }) => theme.colors.background.surface};
        border-radius: 4px;

        .contentHeadWrap {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            margin-bottom: 16px;

            .contentName {
                width: auto;
                margin: 0;
            }
        }

        .contentName {
            margin-bottom: 16px;
        }

        .defaultWrap {
            display: flex;
            flex-direction: column;
            gap: 16px;

            > li {
                ${({ theme }) => theme.mixins.flex()};

                > div {
                    ${({ theme }) => theme.mixins.flex('flex-end', 'center')};
                    color: ${({ theme }) => theme.colors.grayscale.g50};
                }

                &:nth-child(1) {
                    height: 32px;

                    .datepicker {
                        position: relative;
                        z-index: 2;
                        border-radius: 4px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
                        width: auto;
                        height: 32px;
                        padding: 4px 6px;
                        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '6px')};

                        .selectedDate {
                            font-size: 14px;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            color: ${({ theme }) => theme.colors.grayscale.g300};
                        }

                        .react-calendar {
                            position: absolute;
                            top: 110%;
                            left: 0;
                            z-index: 10;
                            width: 280px !important;
                            max-width: 280px !important;
                        }
                    }
                }

                &:nth-child(2) {

                    > div {
                        gap: 8px;

                        > button {
                            z-index: 0;
                        }
                    }
                }

                &:nth-child(3) {
                    position: relative;
                    z-index: 0;

                    > div {
                        gap: 8px;

                        > p {
                            color: ${({ theme }) => theme.colors.primary.p500};
                        }
                    }
                }

                &:nth-child(4) {
                    flex-direction: column;
                    height: 20px;

                    input[type=range] {
                        width: 280px;
                        height: 5px;
                        background-color: rgba(255, 255, 255, 0.10);
                        cursor: pointer;
                        -webkit-appearance: none;
                        position: absolute;
                    }

                    input[type=range]::-webkit-slider-thumb { 
                        -webkit-appearance: none;
                        background: ${({ theme }) => theme.colors.white};
                        cursor: pointer;
                        height: 10px; 
                        width: 10px;   
                        border-radius: 5px;
                        border: 2px solid ${({ theme }) => theme.colors.primary.p500};
                    }

                    > div {
                        ${({ theme }) => theme.mixins.flex()};
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
                ${({ theme }) => theme.mixins.flex()};
                
                &:first-child {
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
                }

                > p {
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g50};
                    }
                }
            }
        }

        .legendWrap {

            > div {
                ${({ theme }) => theme.mixins.flex()};
                margin-bottom: 4px;

                > p {
                    font-size: 12px;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                }
            }
        }
    }
`;


/**********************************************************************/
// 공공데이터
export const PublicDataComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 324px;
    left: 360px;
    bottom: 10px;

    .content {
        display: flex;
        flex-direction: column;
        height: calc(100% - 41px);
    }

    .positionWrap {
        padding: 16px 16px 12px 16px;
    }

    .dataTable {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 16px;

        .tableHeader {
            display: flex;
            background: rgba(255, 255, 255, 0.05);

            p {
                flex: 1;
                padding: 4px;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
                margin: 0;
            }
        }

        .tableBody {
            flex: 1;
            margin: 0;
            padding: 0;
            background: ${({ theme }) => theme.colors.background.surface};
            
            overflow-y: auto;
            ${({ theme }) => theme.mixins.scroll()};

            li {
                display: flex;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

                p {
                    flex: 1;
                    padding: 4px;
                    text-align: center;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.white};
                }

                &.disable {
                    p {
                        color: ${({ theme }) => theme.colors.grayscale.g600};
                    }
                }
            }
        }

        .noData {
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            height: 100%;
            text-align: center;

            p {
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g400};
            }
        }
    }

    .measureDate {
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
        padding: 8px 16px 16px 16px;
        
        p {
            font-size: 12px;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;
            color: ${({ theme }) => theme.colors.grayscale.g300};
        }
    }
`;