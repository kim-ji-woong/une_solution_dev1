import styled, { keyframes } from "styled-components";

import close_icon from '../images/close_icon.svg';
import lineLeft from '../images/lineLeft.svg';
import lineRight from '../images/lineRight.svg';
import contentBoxEl from '../images/contentBoxEl.svg';
import rangeFinding from '../images/rangeFinding.svg';
import keyMap from '../images/keyMap.svg';
import keyMap_plus from '../images/keyMap_plus.svg';
import nav_statusInfo from '../images/nav_statusInfo.svg';
import nav_event from '../images/nav_event.svg';
import nav_miniMap from '../images/nav_miniMap.svg';
import nav_simulation from '../images/nav_simulation.svg';
import nav_line from '../images/nav_line.svg';

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
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    background: ${({ theme }) => theme.colors.background.base};
    position: relative;
    cursor: default;
    opacity: ${props => props.$opacity};
    user-select: none;

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
        ${({ theme }) => theme.mixins.flex()};
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
            font-size: 0.875rem;
            font-weight: 700;
            color: ${({ theme }) => theme.colors.primary};
        }

        input[type=range] {
            width: 50px;
            height: 3px;
            background-color: ${({ theme }) => theme.colors.primary};
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
            background: ${({ theme }) => theme.colors.primary};
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
            font-size: 0.75rem;
        }

        .contentBox {
            position: relative;
            padding: 15px;
            border: 1px solid rgba(56, 67, 85, 0.05);
            background: rgba(6, 9, 13, 0.80);
            box-shadow: 0px 0px 3px 0px ${({ theme }) => theme.colors.primary} inset;

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
        background-color: ${({ theme }) => theme.colors.text.primary};
        color: ${({ theme }) => theme.colors.background.button};
        font-size: 0.75rem;
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
        border-top: 5px solid ${({ theme }) => theme.colors.text.primary};
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
        ${({ theme }) => theme.mixins.scroll()};
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
    background-color: ${({ theme }) => theme.colors.background.base};
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
            font-size: 0.75rem;
        }

        .total, .range {

            li {
                ${({ theme }) => theme.mixins.flex()};
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
                    color: ${({ theme }) => theme.colors.primary};
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
    background-color: ${({ theme }) => theme.colors.background.base};
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
            font-size: 0.75rem;
            font-weight: 500;
        }

        ul {

            li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 10px;

                &:not(:first-child) {
                    border-top: 1px solid #384355;
                }

                > div {
                    ${({ theme }) => theme.mixins.flex()};
                    gap: 22px;
                    position: relative;

                    > p:first-child {
                        color: ${({ theme }) => theme.colors.primary};
                        border-radius: 2px;
                        border: 1px solid ${({ theme }) => theme.colors.primary};
                        padding: 3px 5px;
                        font-size: 0.625rem;
                    }

                    > p:last-child {
                        padding: 3px 5px;
                        color: ${({ theme }) => theme.colors.text.inverse};
                        border-radius: 2px;
                        background: ${({ theme }) => theme.colors.primary};
                        font-size: 0.625rem;

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
// 네비게이션 바

export const NavigationBarComponent = styled.div`
    width: 400px;
    height: 50px;
    background: ${({ theme }) => theme.colors.background.base};
    border-radius: 25px 25px 0 0;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);

    ul {
        width: 100%;
        height: 50px;
        ${({ theme }) => theme.mixins.flex('space-evenly', 'center')}

        .navList > li:hover,
        .navHomeBtn:hover {
            &::after {
                content:attr(data-title); 
                position: absolute; 
                white-space: nowrap;
                line-height: 10px;
                top: -45px;
                left: 50%; 
                transform: translate(-50%, 0);
                padding: 7px 10px;
                background: #000 !important;
                border-radius: 2px;
                font-size: 0.75rem; 
                font-weight: 500;
                text-align: center; 
                z-index: 100;
            }

            &::before {
                content: " ";
                position: absolute;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-top: 5px solid #000 !important;
                top: -22px;
                left: 50%; 
                transform: translate(-50%, 0);
            }
        }

        .navHomeBtn {
            text-align: center;
            line-height: 41px;
            position: relative;
            top: -18px;

            &::after {
                top: -20px !important;
            }

            &::before {
                top: 4px !important;
            }
        }

        .navList {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            li {
                position: relative;
            }

            li:hover {

                button {
                    &::before {
                        content: '';
                        display: block;
                        background: url(${nav_line}) no-repeat center center;
                        position: absolute;
                        bottom: -12px;
                        left: 50%;
                        transform: translate(-53%, 0);
                        width: 44px;
                        height: 2px;
                    }
                }
            }
        }

        & > li > ul > li {
            width: 77px;
            border-right: 1px dashed #525868;
            text-align: center;

            &:last-child {
                border-right: 0;
            }
        }

        .statusInfoIcon {
            background: url(${nav_statusInfo}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.statusInfoIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .eventIcon {
            background: url(${nav_event}) no-repeat center center;
            width: 22px;
            height: 24px;
        }

        .on.eventIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .miniMapIcon {
            background: url(${nav_miniMap}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.miniMapIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        .simulationIcon {
            background: url(${nav_simulation}) no-repeat center center;
            width: 24px;
            height: 24px;
        }

        .on.simulationIcon {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }
    }
`;
