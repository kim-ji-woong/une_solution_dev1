import styled, { keyframes, css } from "styled-components";

import contentBoxEl from '../images/contentBoxEl.svg';
import resize_icon from '../images/resize_icon.svg';
import event_memo from '../images/event_memo.svg';
import event_close from '../images/event_close.svg';
import event_cctv from '../images/event_cctv.svg';
import equipment_bg from '../images/equipment_bg.png';
import SdmsResource from "../resource/id";
import dashboard_calendar_bk from "../../Common/images/dashboard_calendar_bk.png";

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
`;

const revealX = keyframes`
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
`;


/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const PopupsCommon = styled.div`
    position: relative;
    background: rgba(19, 29, 36, 0.92);
    border-radius: 8px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    cursor: default;
    user-select: none;
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
                    right: 8px;
                    bottom: 8px;
                    background: url(${resize_icon}) no-repeat center center;
                `
        }}
    }

    .dslTop {
        height: 40px;
        position: relative;
        ${({ theme }) => theme.mixins.flex()};
        padding: 0 20px;
        background: linear-gradient(180deg, rgba(56, 74, 86, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%);

        .dslTitle {
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.white};
            white-space: nowrap;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        padding: 0 16px 16px 16px;
        height: calc(100% - 40px);

        &, & * {
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
        }

        .contentBox {
            position: relative;
            padding: 15px;
            border: 1px solid rgba(56, 67, 85, 0.05);
            background: rgba(6, 9, 13, 0.80);
            box-shadow: 0px 0px 3px 0px ${({ theme }) => theme.colors.primary.p500} inset;

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

        .noData {
            padding: 16px 20px;
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '4px')};

            > p {
                font-size: 0.875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g400};
            }
        }

        .buttonWrap {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '6px')};
            
            > button {
                ${({ theme }) => theme.mixins.flex('center', 'center')};
                color: ${({ theme }) => theme.colors.grayscale.g500};
                width: 28px;
                height: 28px;
                border-radius: 4px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
    
                svg {
                    color: inherit;
                    fill: currentColor;
                }
    
                &.on {
                    color: ${({ theme }) => theme.colors.primary.p700};
                    border: 1px solid ${({ theme }) => theme.colors.primary.p700};
                    background-color: ${({ theme }) => theme.colors.primary.p50};
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
        content: attr(data-tooltip);
        position: absolute;
        bottom: -44px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-bottom: 4px;
        padding: 4px 8px;
        white-space: nowrap;
        border-radius: 8px;
        background-color: #FFFFFF;
        color: ${({ theme }) => theme.colors.grayscale.g700};
        font-size: 0.75rem;
        line-height: 170%; /* 1.275rem */
        letter-spacing: -0.0225rem;
        text-align: center;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translate(-50%, 0);
        /* margin-left: -5px; */
        width: 0;
        border-bottom: 5px solid #FFFFFF;
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
// 현황정보
export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 726px;
    top: 6.8%;
    left: 0.8%;

    .content {
        padding: 16px 8px 16px 20px;
    }

    .poiwrap {
        margin-bottom: 12px;
        margin-right: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        /* ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '6px')}; */

        .titleWrap {
            ${({ theme }) => theme.mixins.flex()};
            margin-bottom: 8px;

            > p {
                color: ${({ theme }) => theme.colors.grayscale.g100};
                font-size: 0.875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
            }

            .all {
                ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

                > p {
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    font-size: 0.75rem;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                }
            }
        }
    }

    .moveBtn {
        width: 44px;
        height: 36px;
        font-size: 0.875rem;
        line-height: 172%;
        letter-spacing: -0.02625rem;
        border-radius: 4px;
        padding: 4px 6px;
        color: ${({ theme }) => theme.colors.grayscale.g500};
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};

        &:hover {
            background: ${({ theme }) => theme.colors.grayscale.g25};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p800};
            background: ${({ theme }) => theme.colors.grayscale.g50};
        }
    }

    .searchWrap {
        padding-right: 14px;
        margin-bottom: 12px;
        position: relative;

        &::after {
            content: '';
            width: 300px;
            height: 1px;
            background: ${({ theme }) => theme.colors.grayscale.g800};
            position: absolute;
            bottom: -12px;
            left: 0;
        }
    }

    .buildingGroupWrap {
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;
        padding-right: 14px;
        margin-bottom: 12px;

        > div {
            width: 248px;
        }
    }

    .buildingWrap {
        width: 100%;
        padding-right: 10px;
        margin-top: 12px;
        overflow: hidden auto;
        ${({ theme }) => theme.mixins.scroll()};

        li {
            margin-bottom: 4px;

            > div {
                width: 100%;
                height: 36px;
                padding: 0 4px;
                border-radius: 6px;
                background: transparent;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                cursor: pointer;
                margin-bottom: 4px;

                > p {
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    user-select:none
                }

                > svg {
                    width: 16px;
                    height: 16px;
                    padding: 2px;
                    border-radius: 4px;
                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                    fill: ${({ theme }) => theme.colors.grayscale.g300};
                    ${({ theme }) => theme.mixins.flex('center', 'center')};
                }

                &:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                &.on {
                    background: rgba(255, 255, 255, 0.02);

                    > p {
                        font-weight: 500;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                    }

                    > svg {
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g20};
                        fill: ${({ theme }) => theme.colors.grayscale.g20};
                    }
                }
            }
        }
    }

    .depth1 {
        li {
            .zone {
                padding-left: 12px;
                position: relative;

                > button {
                    height: 28px;
                    position: absolute;
                    right: 4px;
                }
            }
        }
    }

    .depth2 {
        li {
            .sensorType {
                padding-left: 20px;
            }
        }
    }

    .depth3 {
        li {
            .sensor {
                padding-left: 28px;
            }
        }
    }

    .depth4 {
        padding: 4px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.25);

        li {

            &:last-child {
                margin-bottom: 0;
            }

            > div {
                ${({ theme }) => theme.mixins.flex()};
                padding-right: 12px;
                padding-left: 0;

                &.on {
                    background-color: ${({ theme }) => theme.colors.primary.p100};
    
                    p {
                        font-weight: 500;
                        color: ${({ theme }) => theme.colors.primary.p700};
                    }
    
                    .sensorInfo > svg {
                        border: 1px solid ${({ theme }) => theme.colors.primary.p700};
                        fill: ${({ theme }) => theme.colors.primary.p700};
                    }
                }
            }

            .sensorInfo {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                cursor: pointer;
                padding-left: 36px;
                width: calc(100% - 50px);

                > p {
                    width: 100%;
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    ${({ theme }) => theme.mixins.textEllipsis()};
                }

                > svg {
                    width: 16px;
                    height: 16px;
                    padding: 4px;
                    border-radius: 4px;
                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                    fill: ${({ theme }) => theme.colors.grayscale.g300};
                    ${({ theme }) => theme.mixins.flex('center', 'center')};
                }
            }

            .sensorStatus {
                ${({ theme }) => theme.mixins.flex()};
                gap: 8px;

                > svg {
                    border: 0;
                    padding: 0;
                }
            }
        }
    }

    .tree {
        display: none;

        &.on {
            display: block;
        }
    }
`;


/**********************************************************************/
// 대시보드

export const DashboardComponent = styled(PopupsCommon)`
    position: absolute;
    width: 1190px !important;
    height: 80px !important;
    top: 6.8%;
    left: 19%;

    .dslX {
        position: absolute;
        top: 8px;
        right: 20px;
        z-index: 2;
    }

    .dashboardContent {
        height: 100%;
        ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};

        > div {
            flex: 1;
            width: 100%;
            ${({ theme }) => theme.mixins.flex()};
            padding: 0 20px;

            ul {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '20px')};

                li {
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }
            }

            > div {
                width: 24px;
                height: 24px;
                ${({ theme }) => theme.mixins.flex('center', 'center')};
            }
        }

        .sensorWrap {
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

            &::after {
                content: '';
                display: inline-block;
                width: 16px;
                height: 16px;
            }

            li {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
            }
        }

        .eventWrap.noButton {
            &::after {
                content: '';
                display: inline-block;
                width: 24px;
                height: 24px;
            }
        }
    }
`;


/**********************************************************************/
// 이벤트
export const EventComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 784px;
    top: 6.8%;
    left: 81.6%;

    input[type=checkbox] {
        width: 16px;
        height: 16px;
    }

    .menuTypeWrap {
        padding: 4px 20px;
    }

    .content {
        position: relative;
        padding: 16px 6px 20px 20px;
        height: calc(100% - 90px);

        p {
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }

        .sortWrap {
            ${({ theme }) => theme.mixins.flex()};
            gap: 4px;
            padding-right: 14px;

            div {
                &:first-child {
                    flex: 6;
                }

                &:last-child {
                    flex: 4;
                }
            }
        }

        .textWrap {
            margin-top: 12px;
            padding-right: 14px;
            ${({ theme }) => theme.mixins.flex()};

            > label {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '4px')};
                font-size: .75rem;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
            }

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '6px')};

                > p, span {
                    font-size: 0.75rem;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                }

                > p:nth-child(2)::before,
                > p:nth-child(3)::before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 12px;
                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                    margin-right: 6px;
                    position: relative;
                    top: 2px;
                }

                > p:nth-child(3), span {
                    color: ${({ theme }) => theme.colors.primary.p300};
                }
            }
        }

        .eventWrap {
            margin: 12px 0 20px 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: calc(100% - 88px);
            padding-right: 10px;

            .eventItem {
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                background: ${({ theme }) => theme.colors.background.base};
                cursor: pointer;

                &:hover {
                    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                    border-color: ${({ theme }) => theme.colors.primary.p400};
                }

                header {
                    ${({ theme }) => theme.mixins.flex()};
                    padding: 6px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px 8px 0 0;

                    .eventInfoWrap {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                        width: calc(100% - 88px);

                        .sensorTypeName {
                            flex: auto;
                            font-size: 1rem;
                            font-weight: 500;
                            letter-spacing: -0.48px;
                            color: ${({ theme }) => theme.colors.white};
                            ${({ theme }) => theme.mixins.textEllipsis()};
                        }

                        input[type=checkbox] {
                            position: relative;
                            top: 1px;
                            min-width: 16px !important;
                        }
                    }

                    .eventIconWrap {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                        > button {
                            text-indent: -9999px;
                            width: 24px;
                            height: 24px;

                            &.eventCCTV {
                                background: url(${event_cctv}) no-repeat center center;
                            }

                            &.eventMemo {
                                background: url(${event_memo}) no-repeat center center;
                            }

                            &.eventClose {
                                background: url(${event_close}) no-repeat center center;
                            }
                        }

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
                    gap: 2px;
                    padding: 12px 15px;

                    p {
                        font-size: 0.75rem;
                        line-height: 170%;
                        letter-spacing: -0.36px;
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        ${({ theme }) => theme.mixins.textEllipsis()};

                        span {
                            font-size: 0.75rem;
                            line-height: 170%;
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                            margin-left: 36px;

                            &.depth {

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 6px;
                                    height: 6px;
                                    border-radius: 50%;
                                    margin-right: 8px;
                                    position: relative;
                                    top: -1px;
                                }

                                &.first::before {
                                    background-color: ${({ theme }) => theme.colors.primary.p300};
                                }

                                &.second::before {
                                    background-color: ${({ theme }) => theme.colors.state.warning};
                                }

                                &.third::before {
                                    background-color: ${({ theme }) => theme.colors.secondary.s500};
                                }

                                &.fourth::before {
                                    background-color: ${({ theme }) => theme.colors.state.error};
                                }
                            }
                            
                            &.type {
                                color: ${({ theme }) => theme.colors.error.error300} !important;
                                margin-left: 16px !important; 
                                position: relative;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 1px;
                                    height: 12px;
                                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                                    position: absolute;
                                    left: -8px;
                                    top: 3px;
                                }

                                &.report {
                                    color: ${({ theme }) => theme.colors.primary.p300} !important;
                                }

                                &.equipment {
                                    color: ${({ theme }) => theme.colors.secondary.s300} !important;
                                }
                            }
                        }
                    }
                }

                footer {
                    display: block;
                    border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                    padding: 6px 16px;
                    ${({ theme }) => theme.mixins.flex()};

                    .sop {
                        color: ${({ theme }) => theme.colors.grayscale.g300};
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: ${({ theme }) => theme.colors.grayscale.g300};
                        }

                        &.action {
                            color: ${({ theme }) => theme.colors.state.warning};

                            &::before {
                                background-color: ${({ theme }) => theme.colors.state.warning};
                            }
                        }

                        &.success {
                            color: ${({ theme }) => theme.colors.state.success};

                            &::before {
                                background-color: ${({ theme }) => theme.colors.state.success};
                            }
                        }
                    }

                    button {
                        font-size: 12px;
                        line-height: 170%;
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        gap: 4px;
                    }
                }

                &#onEvent {
                    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};

                    section p span {
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                    }
                }

                &.closed {
                    border: 0;

                    & p, span {
                        color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                    }

                    section {
                        p {
                            color: ${({ theme }) => theme.colors.grayscale.g600} !important;

                            span {
                                &.depth {
                                    &.first::before {
                                        background-color: ${({ theme }) => theme.colors.primary.p700};
                                    }

                                    &.second::before {
                                        background-color: #7B4D00;
                                    }

                                    &.third::before {
                                        background-color: #903400;
                                    }

                                    &.fourth::before {
                                        background-color: #790000;
                                    }
                                }

                                &.type {
                                    color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                                }
                            }
                        }
                    }

                    footer {
                        .sop {
                            color: ${({ theme }) => theme.colors.grayscale.g700} !important;

                            &::before {
                                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                            }

                            &.action {
                                color: #936312 !important;

                                &::before {
                                    background-color: #936312;
                                }
                            }

                            &.success {
                                color: #00630F !important;

                                &::before {
                                    background-color: #00630F;
                                }
                            }
                        }

                        button {
                            color: ${({ theme }) => theme.colors.grayscale.g700} !important;
                        }
                    }
                }
            }
        }
    
        .btnWrap {
            width: calc(100% - 13px);
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};

            > button {
                flex: 1;
                border-radius: 8px !important;
            }
        }
    }

    .content.noData {
        justify-content: center;
        align-items: center;

        > img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            object-fit: none;
            margin-bottom: 20px;
        }

        > p:nth-child(2) {
            font-size: 1rem;
            color: ${({ theme }) => theme.colors.grayscale.g20};
            letter-spacing: -0.48px;
            margin-bottom: 8px;
        }

        > p:nth-child(3) {
            font-size: 0.75rem;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            line-height: 170%;
            letter-spacing: -0.36px;
            margin-bottom: 12px;
        }

        > button {
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
            border-radius: 4px;
            padding: 4px 6px;
            color: ${({ theme }) => theme.colors.primary.p500};

            &:hover {
                background: ${({ theme }) => theme.colors.grayscale.g25};
            }

            &:active {
                color: ${({ theme }) => theme.colors.primary.p800};
                background: ${({ theme }) => theme.colors.grayscale.g50};
            }
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
            background: #1F292F;
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
        margin-top: 4px;
    }
`;


/**********************************************************************/
// 수동신고
export const ManualReportComponent = styled(PopupsCommon)`
    position: absolute;
    width: 400px;
    height: 740px;
    top: 11.5%;
    left: 39.5%;

    .content {
        position: relative;
        padding: 16px 6px 20px 20px;
        
        .itemWrap {
            height: calc(100% - 60px);
            padding-right: 10px;

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'row', '20px')};
                padding: 20px 4px;
    
                p:nth-child(1) {
                    width: 80px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};
    
                    > span {
                        color: ${({ theme }) => theme.colors.secondary.s400};
                        margin-left: 2px;
                    }
                }
    
                p:nth-child(2) {
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }
    
                > :nth-child(2) {
                    flex: 1;
                }
                
                &:not(:nth-child(5)) {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                }
    
                .buildingWrap {
                    width: 100%;
    
                    > div:nth-child(1) {
                        width: 100%;
                        margin-bottom: 8px;
                    }
    
                    > div:nth-child(2) {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
    
                        > div {
                            flex: 1;
                        }
                    }
                }
    
                textarea {
                    background: transparent !important;
                }
            }
        }


        > button {
            width: calc(100% - 40px);
            position: absolute;
            bottom: 20px;
            left: 20px;
            border-radius: 8px !important;
        }
    }
`;


/**********************************************************************/
// 이벤트 대시보드

export const EventDashboardComponent = styled(PopupsCommon)`
    position: absolute;
    min-width: 533px;
    top: 70px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 8px;
    border-radius: 8px;
    background: linear-gradient(180deg, #23313A 0%, #0C1216 100%);
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    cursor: pointer;
    z-index: 4;

    &.closePopup {
        animation: ${fadeOut} .3s ease-out;
    }

    > div {
        padding: 16px 12px 16px 20px;
        ${({ theme }) => theme.mixins.flex()};
        
        > div {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row')};

            .eventIcon {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '4px')};
                padding-right: 20px;
                margin-right: 20px;
                position: relative;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 36px;
                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                    position: absolute;
                    right: 0;
                }

                > img {
                    text-indent: -9999px;
                    width: 48px;
                    height: 48px;
                }

                > p {
                    font-size: 0.75rem;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.error.error300};
                }
            }

            .contentWrap {
                padding-right: 44px;

                > p {

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                        font-size: 0.875rem;
                        font-weight: 400;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                        margin-right: 2px;

                        > span {
                            color: ${({ theme }) => theme.colors.error.error300};
                        }
                    }

                    font-size: 1rem;
                    font-weight: 500;
                    line-height: 172%; /* 27.52px */
                    letter-spacing: -0.48px;
                    color: ${({ theme }) => theme.colors.white};
                }
    
                .autoClose {
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                    font-size: 0.75rem;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                    margin-top: 6px;
                }
            }
        }

        .dslX {
            position: absolute;
            top: 10px;
            right: 12px;
        }
    }
`;


/**********************************************************************/
// 상세정보

export const DetailInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 256px;
    top: 70.8%;
    left: 0.8%;

    .dslTop {

        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

            > p {
                width: 190px;
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.primary.p300};
                ${({ theme }) => theme.mixins.textEllipsis()};
                text-align: right;
            }
        }
    }

    .content {
        padding: 0;

        > ul {
            margin: 4px 6px 20px 0;
            padding: 0 14px 0 20px;
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};

            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
                padding: 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                > span {
                    font-size: .875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        width: 100px;
                        white-space: nowrap; /* 줄바꿈 방지 */
                    }

                    &:nth-child(2) {
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        flex: 1;
                        text-align: left;
                        white-space: pre-line;
                        word-break: break-word; /* 너무 긴 텍스트는 줄바꿈 */
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 센서정보

export const SensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: ${({ $sensorType }) => {
        switch ($sensorType) {
            case SdmsResource.facilityType.SUMP:
                return '360px';
            case SdmsResource.facilityType.PM:
                return '348px';
            case SdmsResource.facilityType.MOBILE_SCANNER:
                return '304px';
            default:
                return '256px';
        }
    }};
    top: 60%;
    left: 0.8%;
    overflow: visible;

    .dslTop {
        border-radius: 8px 8px 0 0;

        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

            > p {
                width: 200px;
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.primary.p300};
                ${({ theme }) => theme.mixins.textEllipsis()};
                text-align: right;
            }
        }
    }

    .content {
        padding: 0;
    }

    /* 화재 */
    .fire {
        > ul {
            margin: 4px 6px 20px 0;
            padding: 0 14px 0 20px;
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};

            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
                padding: 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                > span {
                    font-size: .875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        width: 100px;
                        white-space: nowrap; /* 줄바꿈 방지 */
                    }

                    &:nth-child(2) {
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        flex: 1;
                        text-align: left;
                        word-break: break-word; /* 너무 긴 텍스트는 줄바꿈 */
                    }
                }
            }
        }
    }

    /* 누출, ETC */
    .psm,
    .etc {
        > ul {
            padding: 0 9px 0 20px;

            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'row', '4px')};
                padding: 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                > div {
                    font-size: .875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    flex: 1;
                }
            }
        }

        .head {
            margin-right: 10px;

            li {
                div {
                    color: ${({ theme }) => theme.colors.grayscale.g200};

                    &.risk {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                        position: relative;

                        > div {
                            display: inline-block;
                            position: relative;

                            .riskTooltip {
                                position: absolute;
                                left: 125%;
                                top: 50%;
                                transform: translateY(-50%);
                                margin-left: 8px;
                                background: ${({ theme }) => theme.colors.white};
                                border-radius: 8px;
                                box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                                z-index: 1000;
                                font-size: 0.75rem;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;

                                &::before {
                                    content: " ";
                                    position: absolute;
                                    border-right: 16px solid ${({ theme }) => theme.colors.white};
                                    border-top: 12px solid transparent;
                                    border-bottom: 12px solid transparent;
                                    transform: translate(0, -50%); 
                                    top: 50%; 
                                    left: -8px;
                                }

                                > p {
                                    border-radius: 8px 8px 0 0;
                                    padding: 4px 8px;
                                    background-color: ${({ theme }) => theme.colors.grayscale.g50};
                                    color: ${({ theme }) => theme.colors.grayscale.g900};
                                }
                            }

                            .riskTooltip ul {
                                padding: 0 8px;
                            }

                            .riskTooltip li {
                                padding: 0 4px;
                                margin: 4px 0;
                                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '20px')};
                                color: ${({ theme }) => theme.colors.grayscale.g900};
                                white-space: nowrap;
                            }
                        }
                    }
                }
            }
        }

        .body {
            margin: 0 6px 12px 0;
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};

            .chart {
                position: relative;
                top: -1px;

                svg {
                    will-change: clip-path;
                    animation: ${revealX} 300ms ease-out forwards;
                }
            }
        }

        .moveBtn {
            > button {
                width: calc(100% - 40px);
                padding: 4px 6px;
                margin: 0 20px 16px 20px;
            }
        }
    }

    /* 미세먼지 */
    .pm {
        height: calc(100% - 50px);

        > .scrollbar {
            height: 100%;
            margin-right: 6px;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: auto;
            ${({ theme }) => theme.mixins.scroll()};
            display: flex;
            flex-direction: column;
        }

        .valueWrap {
            > ul {
                padding: 0 14px 0 20px;

                > li {
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                    padding: 8px;
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                    > div {
                        min-width: 0;

                        &:first-child { flex: 7 1 0; }
                        &:last-child  { flex: 3 1 0; }
                    }

                    &:nth-child(1) {
                        > div {
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                        }
                    }

                    &:not(:nth-child(1)) {

                        > div {
                            &:nth-child(1) {
                                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                            }

                            &:nth-child(2) {
                                ${({ theme }) => theme.mixins.flex()};
                            }
                        }
                    }
                }
            }
        }

        .statusWrap {
            margin: 12px 12px 10px 19px;
            padding: 0 12px;
            border-radius: 8px;
            background-color: ${({ theme }) => theme.colors.black};

            > div {
                padding: 8px 0;
                ${({ theme }) => theme.mixins.flex()};

                .on, .off {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                    gap: 4px;
                }

                .on {
                    color: ${({ theme }) => theme.colors.state.success};
                }
                
                .off {
                    color: ${({ theme }) => theme.colors.state.error};
                }
            }
        }

        .chartWrap {
            padding: 8px 20px;
            flex: 1;
            min-height: 200px;
            display: flex;
            flex-direction: column;

            > button {
                margin-bottom: 8px;
                flex-shrink: 0;
                align-self: flex-start;
            }

            .chart {
                height: 100%;
                width: 100%;
                flex: 1;
                background-color: ${({ theme }) => theme.colors.background.base};
                border-radius: 8px;
                padding: 10px;
            }

            .riskInfo {
                ${({ theme }) => theme.mixins.flex()};
                padding: 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                margin: 8px 0;
                flex-shrink: 0;

                > div {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                }
            }
        }

        .depth {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;

            &.first {
                background-color: ${({ theme }) => theme.colors.primary.p300};
            }

            &.second {
                background-color: ${({ theme }) => theme.colors.state.warning};
            }

            &.third {
                background-color: ${({ theme }) => theme.colors.secondary.s500};
            }

            &.fourth {
                background-color: ${({ theme }) => theme.colors.state.error};
            }

            &.normal {
                background-color: #37B44A;
            }
        }

        sub {
            font-size: 10px;
            position: relative;
            top: 0;
        }
    }

    /* 이동식 스캐너 */
    .ms {
        height: calc(100% - 50px);
        
        > .scrollbar {
            height: 100%;
            display: flex;
            flex-direction: column;
            margin-right: 6px;
        }

        .menuTypeWrap {
            padding: 0 20px;
        }

        .infoWrap {
            flex: 1;
            min-height: 0;
            
            > ul {
                margin: 6px 0;
                padding: 0 52px;

                > li {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
                    padding: 8px;
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                    > span {
                        font-size: .875rem;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;

                        &:nth-child(1) {
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                            width: 80px;
                            white-space: nowrap; /* 줄바꿈 방지 */
                        }

                        &:nth-child(2) {
                            color: ${({ theme }) => theme.colors.grayscale.g20};
                            flex: 1;
                            text-align: left;
                            word-break: break-word; /* 너무 긴 텍스트는 줄바꿈 */
                        }
                    }
                }
            }
        }

        .btnWrap {
            position: absolute;
            top: 59%;
            width: 100%;
            ${({ theme }) => theme.mixins.flex()};
            padding: 0 12px;
        }
    }

    /* 집수정 */
    .sump {
        height: calc(100% - 60px);
        padding-right: 6px;
        display: flex;
        flex-direction: column;

        > .scrollbar {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .loading {
            width: 100%;
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        .chartWrap {
            padding: 12px 10px 12px 20px;
            flex: 1;
            min-height: 200px;
            display: flex;

            .chart {
                height: 100%;
                width: 100%;
                background-color: ${({ theme }) => theme.colors.background.base};
                border-radius: 8px;
                padding: 10px;
            }
        }

        .valueWrap {
            flex-shrink: 0;

            > ul {
                margin-bottom: 16px;
                padding: 0 10px 0 20px;

                > li {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
                    padding: 8px;
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};

                    > span {
                        font-size: .875rem;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;

                        &:nth-child(1) {
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                            width: 80px;
                            white-space: nowrap; /* 줄바꿈 방지 */
                        }

                        &:nth-child(2) {
                            color: ${({ theme }) => theme.colors.grayscale.g20};
                            flex: 1;
                            text-align: left;
                            word-break: break-word; /* 너무 긴 텍스트는 줄바꿈 */
                        }
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// CCTV

export const CCTVInfoComponent = styled(DetailInfoComponent)`
    position: absolute;
    width: 340px;
    height: 428px;
    top: 25.3%;
    left: 19%;

    .content {
        display: flex;
        flex-direction: column;
        min-height: 0;
        gap: 12px;

        .cctvWrap {
            padding: 16px 20px 0 20px;
            flex: 1 1 auto;
            min-height: 184px;
            display: flex;
            align-items: stretch;

            .cctvViewport {
                width: 100%;
                height: 100%;
                min-height: 184px;
                aspect-ratio: 300 / 184;
            }

            .cctvViewport > iframe {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
            }
        }

        .noData {
            height: 100%;
            min-height: 184px;
        }

        > ul {
            flex: 0 1 auto;
            min-height: 0;
            overflow: hidden auto;
        }
    }
`;


/**********************************************************************/
// 이벤트 CCTV

export const AlarmCCTVInfoComponent = styled(CCTVInfoComponent)`
    height: 320px;

    .dslTop {
        > div {
            > p {
                width: 130px;
            }
        }
    }

    .content {
        width: 100%;
        flex: 1 1 auto;
        min-height: 0;
        box-sizing: border-box;
        padding: 0 16px 16px 16px;
        gap: 10px;
        overflow: hidden;

        .noData {
            height: 100%;
            min-height: 0;
        }

        .disableData {
            text-align: center;
            
            > svg {
                width: 12px;
                height: 12px;
            }

            > p {
                font-size: 0.5rem;
                color: ${({ theme }) => theme.colors.grayscale.g400};
            }
        }
    }

    .content .cctvGrid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        gap: 8px;
    }

    /* 확대 모드일 때: 1칸만 전체 차지 */
    .content .cctvGrid.expanded {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }

    .cctvTile {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;
        background: rgba(19, 29, 36, 0.92);
        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
        cursor: default;
    }

    /* 숨김 처리 (확대 모드일 때 다른 타일) */
    .cctvTile.hidden {
        display: none;
    }

    /* 확대한 타일은 전체 영역 차지 */
    .cctvTile.expanded {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
    }

    .cctvTile.empty {
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
    }

    .cctvTile .tileHeader {
        display: flex;
        align-items: center;
        padding: 2px 8px;
    }

    .cctvTile .tileHeader .title {
        flex: 1;
        ${({ theme }) => theme.mixins.textEllipsis()};
        font-size: .75rem;
        line-height: 170%; /* 20.4px */
        letter-spacing: -0.36px;
    }

    .cctvTile .tileBody {
        flex: 1;           /* 나머지 공간 */
        min-height: 0;     /* ⭐ flex 아이템이 overflow로 커지는 거 방지 */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cctvTile .tileBody iframe,
    .cctvTile .tileBody .noData {
        width: 100%;
        height: 100%;
        display: block;
    }

    .infoWrap {
        flex: 0 0 auto;
        padding: 10px 0;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
        
        span {
            font-size: .75rem;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;

            &:nth-child(1) {
                color: ${({ theme }) => theme.colors.grayscale.g150};
            }

            &:nth-child(2) {
                color: ${({ theme }) => theme.colors.grayscale.g20};
                flex: 1;
                ${({ theme }) => theme.mixins.textEllipsis()};
            }
        }
    }
`;


/**********************************************************************/
// 편집모드 toolbar

export const EditToolbarComponent = styled.nav`
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 3;
    width: 100vw;
    height: 50px;
    user-select: none;

    > div {
        padding: 8px 32px;
    }

    .titleWrap {
        background-color: ${({ theme }) => theme.colors.grayscale.g50};
        ${({ theme }) => theme.mixins.flex()};
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g100};

        h2 {
            color: ${({ theme }) => theme.colors.grayscale.g900};
            font-size: 1rem;
            line-height: 172%;
            letter-spacing: -0.48px;
        }

        > div {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '16px')};
        }
    }

    .menuWrap {
        background-color: ${({ theme }) => theme.colors.grayscale.g20};
        border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g100};
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
    }
`;

export const EditToolButtonComponent = styled.button`
    width: 62px;
    height: 64px;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '4px')};
    padding: 8px 4px;
    color: ${({ theme }) => theme.colors.grayscale.g500};
    font-size: 0.75rem;
    line-height: 170%;
    letter-spacing: -0.36px;
    border-radius: 8px;
    transition: all 0.2s;
    position: relative;

    svg {
        height: 24px;
        box-sizing: border-box;
        color: inherit;
        fill: currentColor;
    }
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.grayscale.g50};
        color: ${({ theme }) => theme.colors.primary.p500};
    }
    
    ${({ $disabled }) =>
        $disabled &&
        css`
            color: ${({ theme }) => theme.colors.grayscale.g150} !important;
            cursor: not-allowed;
            pointer-events: none;
            
            &:hover,
            &:active {
                background: ${({ theme }) => theme.colors.grayscale.g700} !important;
                color: ${({ theme }) => theme.colors.grayscale.g400} !important;
            }
    `};

    &.plus {
        margin-right: 8px;

        &::after {
            content: '';
            width: 1px;
            height: 100%;
            background-color: ${({ theme }) => theme.colors.grayscale.g75};
            position: absolute;
            right: -8px;
        }
    }

    &.on {
        background-color: ${({ theme }) => theme.colors.primary.p100};
        color: ${({ theme }) => theme.colors.primary.p700};
    }
`;

export const EditStatusInfoComponent = styled(StatusInfoComponent)`
    position: fixed;
    top: 180px;
    left: 0;
    width: 340px;
    height: calc(100vh - 180px);
    padding: 16px 6px 16px 20px;
    background: rgba(19, 29, 36, 0.95);
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column')};
    z-index: 1;
    border-radius: 0;

    > div {
        width: 100%;
    }
`;

export const EditAddPoiComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 480px;
    top: 20%;
    left: 84%;
    z-index: 3;

    .content {
        padding: 16px 6px 16px 20px;

        .menuTypeWrap {
            padding-right: 14px;
            margin-bottom: 12px;
        }

        .searchWrap {
            padding-right: 14px;
            margin-bottom: 12px;
            ${({ theme }) => theme.mixins.flex()};

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.primary.p300};
            }
        }

        .listWrap {
            width: 100%;
            padding-right: 10px;
            
            &.body {
                overflow: hidden auto;
                ${({ theme }) => theme.mixins.scroll()};
            }

            li {
                ${({ theme }) => theme.mixins.flex()};
                gap: 10px;
                padding: 0 12px;
                height: 36px;
                border-radius: 8px;
                margin-bottom: 4px;
                cursor: pointer;

                &.head {
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                    padding: 8px 12px;
                    border-radius: 0;
                }

                p {
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    ${({ theme }) => theme.mixins.textEllipsis()};

                    &:nth-child(2) {
                        min-width: 77px;
                    }
                }

                &:hover:not(.head) {
                    background: rgba(255, 255, 255, 0.05);
                }

                &.selected {
                    background: rgba(255, 255, 255, 0.02);

                    p {
                        font-weight: 500;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                    }
                }
            }
        }
    }
`;

export const EditCCTVMappingComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 480px;
    top: 20%;
    left: 84%;
    z-index: 3;

    .content {
        padding: 16px 6px 16px 20px;

        .searchWrap {
            padding-right: 14px;
            margin-bottom: 12px;
            ${({ theme }) => theme.mixins.flex()};

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.primary.p300};
            }
        }

        .listWrap {
            width: 100%;
            padding-right: 10px;
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};
            margin-bottom: 12px;

            li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 0 12px;
                height: 36px;
                border-radius: 8px;

                p {
                    width: calc(100% - 30px);
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    ${({ theme }) => theme.mixins.textEllipsis()};
                }

                &.on {
                    background: rgba(255, 255, 255, 0.02);

                    p {
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        font-weight: 500;
                    }
                }
            }
        }

        .btnWrap {
            width: 100%;
            padding-right: 14px;

            > button {
                width: 100%;
            }
        }
    }
`;

export const EditCCTVInfoComponent = styled(AlarmCCTVInfoComponent)`
    height: 280px;

    .content {
        padding: 16px;
    }
`;

export const EditPOIViewerComponent = styled(PopupsCommon)`
    position: absolute;
    top: 200px;
    left: 356px;
    z-index: 1;
    overflow: visible;
    
    .content {
        padding: 8px 12px;
        background: rgba(19, 29, 36, 0.92);
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.10);
        border-radius: 8px;
    }
`;

/**********************************************************************/
// 시뮬레이션 toolbar

export const SimulationToolbarComponent = styled(EditToolbarComponent)`

`;

// 시뮬레이션 사이드 패널
export const SimulationSetupComponent = styled.div`
    position: fixed;
    top: 98px;
    left: 0;
    width: 340px;
    height: calc(100vh - 98px);
    padding: 20px 12px;
    background: rgba(19, 29, 36, 0.95);
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column')};
    z-index: 2;
    border-radius: 0;

    > div:not(.titleWrap, .info) {
        width: 100%;
        margin: 8px 0;
        padding: 16px 8px 24px 8px;

        &:not(:nth-child(4)) {
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        }

        > p {
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            margin-bottom: 12px;
        }  
        
        .positionWrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;

            > div {
                width: 100%;
            }
        }

        .windDirectionWrap,
        .windSpeedWrap {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
        }

        button {
            flex: 1;
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
            border-radius: 6px;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
            padding: 6px 0;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            white-space: nowrap;

            &:hover {
                border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                color: ${({ theme }) => theme.colors.primary.p500};
                background-color: ${({ theme }) => theme.colors.primary.p25};
            }

            &:active {
                border: 1px solid ${({ theme }) => theme.colors.primary.p800};
                color: ${({ theme }) => theme.colors.primary.p800};
                background-color: ${({ theme }) => theme.colors.primary.p60};
            }

            &.selected {
                border: 1px solid ${({ theme }) => theme.colors.primary.p700};
                color: ${({ theme }) => theme.colors.primary.p700};
                background-color: ${({ theme }) => theme.colors.primary.p50};
            }

            > svg {
                color: inherit;
                fill: currentColor;
            }
        }
    }

    .titleWrap {
        width: 100%;
        padding-right: 8px;
        ${({ theme }) => theme.mixins.flex()};

        > h2 {
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            color: ${({ theme }) => theme.colors.white};
            margin-left: 8px;
        }
    }

    .info {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
        width: 100%;
        padding: 8px 0;

        &:not(:nth-child(6)) {
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        }

        > p {
            padding: 16px 8px;
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;

            &:nth-child(1) {
                width: 80px;
                color: ${({ theme }) => theme.colors.grayscale.g200};
            }

            &:nth-child(2) {
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }
        }

        &.timeline {
            justify-content: space-between;

            span {
                color: ${({ theme }) => theme.colors.primary.p300};
            }

            .autoPlayBtn {
                padding: 4px 6px;
            }
        }
    }

    .submitBtn{
        width: calc(100% - 46px);
        position: absolute;
        bottom: 20px;
        left: 23px;
        border-radius: 8px !important;
    }

    .resetBtn,
    .autoPlayBtn {
        font-size: 0.875rem;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 4px;
        padding: 4px 17px;
        color: ${({ theme }) => theme.colors.grayscale.g500};
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;

        &:hover {
            background: ${({ theme }) => theme.colors.grayscale.g25};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p800};
            background: ${({ theme }) => theme.colors.grayscale.g50};
        }
        
        > svg {
            color: inherit;
            fill: currentColor;
        }
    }

    .sliderWrap {
        border-bottom: 0 !important;
        margin: 0 !important;
    }

    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        border-radius: 9999px;
        background-color: ${({ theme }) => theme.colors.primary.p75};
        outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36' fill='none'><g filter='url(%23filter0_f_2418_26757)'><circle cx='18' cy='18' r='12' fill='%238CA5FF'/></g><circle cx='18' cy='18' r='11.6' fill='white' stroke='%233C69FC' stroke-width='0.8'/><path d='M15.2304 10.9226C16.7428 10.3308 18.405 10.239 19.9734 10.6607C21.5417 11.0824 22.9338 11.9954 23.9454 13.2659C24.9571 14.5364 25.5351 16.0975 25.5949 17.7205C25.6546 19.3435 25.1928 20.9429 24.2773 22.2843C23.3618 23.6257 22.0406 24.6386 20.5075 25.1744C18.9743 25.7103 17.3099 25.7409 15.7581 25.2618C14.2063 24.7827 12.8487 23.8191 11.8845 22.5123C10.9203 21.2054 10.4 19.6241 10.4 18' stroke='%233C69FC' stroke-width='0.8' stroke-linecap='round'/><circle cx='18' cy='18' r='4' fill='%233C69FC'/></svg>") no-repeat center;
        background-size: contain;
        cursor: pointer;
    }

    .sliderLabel {
        ${({ theme }) => theme.mixins.flex()};
        margin-top: 8px;
        width: calc(100% - 3px);

        > span {
            width: 100px;
            text-align: center;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    }
`;

export const SimulationLegendComponent = styled(PopupsCommon)`
    position: absolute;
    bottom: 20px;
    right: 16px;
    width: 300px;
    height: 348px;
    z-index: 2;
    overflow: visible;

    .dslTop {
        border-radius: 8px 8px 0 0;
    }

    .content {
        padding: 0 20px 16px 20px;

        > ul {
            margin-bottom: 12px;
    
            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
                padding: 7px 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
    
                > p {
                    font-size: .875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
    
                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        width: 100px;
                    }
    
                    &:nth-child(2) {
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        flex: 1;
                        text-align: left;
                    }
                }
            }
        }

        .legendWrap {
            border-radius: 8px;
            background: rgba(19, 29, 36, 0.95);
            padding: 8px 16px;

            > p {
                font-size: 0.75rem;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g200};
                margin-bottom: 8px;
            }

            > ul {

                > li {

                    ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                    &:not(:last-child) {
                        margin-bottom: 8px;
                    }

                    p {
                        font-size: 0.75rem;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                    }

                    & > div::before {
                        content: '';
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border-radius: 4px;
                        margin-right: 4px;
                    }

                    &:nth-child(1) > div::before {
                        border: 1px solid #3844FF;
                        background: #00099F;
                    }

                    &:nth-child(2) > div::before {
                        border: 1px solid #3F9519;
                        background: #2F7311;
                    }

                    &:nth-child(3) > div::before {
                        border: 1px solid #FF877B;
                        background: #FF1700;
                    }

                    > div {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '5px')};
                        flex: 1.2;
                    }

                    > p {
                        flex: 1;
                    }
                }
            }

            #tooltip {
                margin: 0;
                top: -1px;
            }

            [data-tooltip]:before {
                bottom: 20px;
            }

            [data-tooltip]:after {
                bottom: 20px;
                border-top: 5px solid #FFFFFF;
                border-bottom: 0;
            }
        }
    }
`;



/**********************************************************************/
// 설비모드 toolbar

export const EquipmentToolbarComponent = styled(EditToolbarComponent)`

`;

export const EquipmentToggleSwitchComponent = styled.div`
    position: absolute;
    top: 120px;
    left: 360px;
    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
    z-index: 2;

    > p {
        font-size: 1rem;
        font-weight: 500;
        line-height: 172%; /* 27.52px */
        letter-spacing: -0.48px;
        color: ${({ theme }) => theme.colors.grayscale.g700};
    }
`;

export const EquipmentButtonComponent = styled.div`
    position: absolute;
    top: 120px;
    right: 20px;
    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
    z-index: 2;

    > button {
        min-width: 60px;
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: 172%; /* 1.72rem */
        letter-spacing: -0.03rem;
        color: ${({ theme }) => theme.colors.grayscale.g600};
        border-radius: 6px; 
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        padding: 4px 6px;

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g25};
            color: ${({ theme }) => theme.colors.primary.p500};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g50};
            color: ${({ theme }) => theme.colors.primary.p800};
        }

        &.selected {
            color: ${({ theme }) => theme.colors.primary.p700} !important;
        }
    }
`;

// 설비모드 사이드 패널
export const EquipmentInfoComponent = styled(PopupsCommon)`
    position: fixed;
    top: 98px;
    left: 0;
    width: 340px;
    height: calc(100vh - 98px);
    padding-top: 4px;
    background: rgba(19, 29, 36, 0.95);
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column')};
    z-index: 2;
    border-radius: 0;

    .menuTypeWrap {
        width: 100%;
        ${({ theme }) => theme.mixins.flex()};
        gap: 4px;

        li {
            flex: 1;
            color: ${({ theme }) => theme.colors.grayscale.g700};
            font-size: .875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            text-align: center;
            padding: 8px 0;
            border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g700};
            cursor: pointer;

            &.on {
                color: ${({ theme }) => theme.colors.primary.p500};
                border-bottom: 2px solid ${({ theme }) => theme.colors.primary.p500};
            }
        }
    }

    .content {
        width: 100%;
        height: calc(100% - 50px);
        margin-top: 8px;
        padding: 20px 6px 20px 20px;

        .titleWrap {
            ${({ theme }) => theme.mixins.flex()};
            margin-right: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

            > h2 {
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }
        }

        .scrollWrap {
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};
            height: calc(100% - 42px);
            padding-right: 10px;
        }

        .btnWrap {
            padding: 12px 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column', '12px')};
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
            
            button {
                width: 100%;
                ${({ theme }) => theme.mixins.flex()};
                border-radius: 6px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                padding: 6px 12px;
                color: ${({ theme }) => theme.colors.grayscale.g200};
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                white-space: nowrap;

                &:hover {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                    color: ${({ theme }) => theme.colors.white};
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                }

                &:active {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p700};
                    color: ${({ theme }) => theme.colors.white};
                    background-color: ${({ theme }) => theme.colors.primary.p700};
                }

                &.selected {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p600};
                    color: ${({ theme }) => theme.colors.white};
                    background-color: ${({ theme }) => theme.colors.primary.p600};
                }

                > svg {
                    > path {
                        stroke: currentColor;
                    }
                }
            }
        }

        .treeWrap {
            width: 100%;
            margin-top: 12px;

            li {
                margin-bottom: 4px;

                > div {
                    width: 100%;
                    height: 36px;
                    padding: 0 4px 0 12px;
                    border-radius: 6px;
                    background: transparent;
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                    cursor: pointer;
                    margin-bottom: 4px;
                    position: relative;

                    > p {
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                        user-select:none
                    }

                    > svg {
                        width: 16px;
                        height: 16px;
                        padding: 2px;
                        border-radius: 4px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                        fill: ${({ theme }) => theme.colors.grayscale.g300};
                        ${({ theme }) => theme.mixins.flex('center', 'center')};
                    }

                    &:hover {
                        background: rgba(255, 255, 255, 0.05);
                    }

                    &.on {
                        background: rgba(255, 255, 255, 0.02);

                        > p {
                            font-weight: 500;
                            color: ${({ theme }) => theme.colors.grayscale.g20};
                        }

                        > svg {
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g20};
                            fill: ${({ theme }) => theme.colors.grayscale.g20};
                        }
                    }
                }
            }

            .tree {
                display: none;
                padding: 4px;
                background-color: rgba(0, 0, 0, 0.25);
                border-radius: 8px;

                &.on {
                    display: block;
                }

                li {
                    > div {
                        padding: 0 12px 0 20px;
                        ${({ theme }) => theme.mixins.flex()};

                        > div {
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                            > svg {
                                width: 16px;
                                height: 16px;
                                padding: 2px;
                                border-radius: 4px;
                                border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                                fill: ${({ theme }) => theme.colors.grayscale.g300};
                                ${({ theme }) => theme.mixins.flex('center', 'center')};
                            }
                        }

                        > span {
                            ${({ theme }) => theme.mixins.flex('center', 'center')};
                        }
                        
                        &.on {
                            background-color: ${({ theme }) => theme.colors.primary.p100};
            
                            > div {
                                p {
                                    font-weight: 500;
                                    color: ${({ theme }) => theme.colors.primary.p700};
                                }

                                > svg {
                                    border: 1px solid ${({ theme }) => theme.colors.primary.p700};
                                    fill: ${({ theme }) => theme.colors.primary.p700};
                                }
                            }
                        }
                    }
                }
            }

            .moveBtn {
                width: 44px;
                height: 28px;
                position: absolute;
                right: 4px;
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.02625rem;
                border-radius: 4px;
                padding: 4px 6px;
                color: ${({ theme }) => theme.colors.grayscale.g500};
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};

                &:hover {
                    background: ${({ theme }) => theme.colors.grayscale.g25};
                }

                &:active {
                    color: ${({ theme }) => theme.colors.primary.p800};
                    background: ${({ theme }) => theme.colors.grayscale.g50};
                }
            }
        }
    }
`;


export const EquipmentAnalysisComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 312px;
    top: 59%;
    left: 81%;

    .content {
        height: calc(100% - 40px);
        padding: 0 20px 16px 20px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-height: 0;
        overflow: hidden;

        .infoWrap {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
            padding: 8px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
            flex-shrink: 0;

            p {
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;

                &:nth-child(1) {
                    width: 60px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                }

                &:nth-child(2) {
                    color: ${({ theme }) => theme.colors.grayscale.g20};
                }
            }
        }

        .chartWrap {
            margin: 12px 0 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            gap: 12px;

            .aiChartWrap{
                width: 100%;
                height: 100%;
                background: ${({ theme }) => theme.colors.background.base};
                border-radius: 8px;
                padding: 30px 16px 10px 16px;
                position: relative;
                flex: 1;
                min-height: 0;

                > h3 {
                    font-size: 0.75rem;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }

                .legendWrap {
                    position: absolute;
                    top: 11px;
                    right: 19px;
                    ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

                    > ul {
                        border-radius: 4px;
                        background: rgba(255, 255, 255, 0.05);
                        padding: 0 8px;
                        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};

                        > li {
                            font-size: 0.5rem;
                            line-height: 172%; /* 13.76px */
                            letter-spacing: -0.24px;
                            color: ${({ theme }) => theme.colors.white};
                            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                        }
                    }

                    .legend {
                        > li {
                            &::after {
                                content: '';
                                display: inline-block;
                                width: 20px;
                                margin-left: 4px;
                            }
                        }

                        &.eq {
                            > li {
                                &:nth-child(1)::after {
                                    border: 1px solid #4EB6FF;
                                }

                                &:nth-child(2)::after {
                                    border: 1px dashed #37B44A;
                                }
                            }
                        }

                        &.el {
                            > li {
                                &:nth-child(1)::after {
                                    border: 1px solid #FFAE5E;
                                }
                                
                                &:nth-child(2)::after {
                                    border: 1px solid #4EB6FF;
                                }
                            }
                        }
                    }

                    .actionStep {
                        > li {
                            &::before {
                                content: '';
                                width: 8px;
                                height: 8px;
                                border-radius: 2px;
                                display: inline-block;
                            }
    
                            &:nth-child(1)::before {
                                background: rgba(73, 113, 255, 0.60);
                            }
    
                            &:nth-child(2)::before {
                                background: rgba(255, 199, 58, 0.60);
                            }
    
                            &:nth-child(3)::before {
                                background: rgba(252, 107, 25, 0.60);
                            }
    
                            &:nth-child(4)::before {
                                background: rgba(255, 60, 60, 0.60);
                            }
                        }
                    }
                }

                .chart {
                    width: 100%;
                    height: 100%;
                }
            }

            button {
                width: 100%;
                flex-shrink: 0;
                margin-top: auto;
                min-height: 32px;
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                border-radius: 4px;
                padding: 4px 6px;
                color: ${({ theme }) => theme.colors.grayscale.g200};
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};

                &:hover {
                    color: ${({ theme }) => theme.colors.grayscale.g500};
                    background: ${({ theme }) => theme.colors.grayscale.g25};
                }

                &:active {
                    color: ${({ theme }) => theme.colors.primary.p800};
                    background: ${({ theme }) => theme.colors.grayscale.g50};
                }

                > svg {
                    color: inherit;
                    fill: currentColor;
                }
            }
        }
    }
`;


export const EquipmentDetailInfoComponent = styled(DetailInfoComponent)`
    position: absolute;
    width: 340px;
    height: 256px;
    top: 15%;
    left: 10%;

    .content {
        justify-content: space-between;

        > ul {
            flex: 1;

            > li {
                justify-content: space-between;

                > span {

                    &:nth-child(1) {
                        width: auto;
                    }

                    &:nth-child(2) {
                        width: auto;
                        text-align: right;
                    }
                }
            }
        }
    }

    .btnWrap {
        padding: 0 20px 16px 20px;

        button {
            width: 100%;
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
            border-radius: 4px;
            padding: 4px 6px;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
    
            &:hover {
                color: ${({ theme }) => theme.colors.grayscale.g500};
                background: ${({ theme }) => theme.colors.grayscale.g25};
            }
    
            &:active {
                color: ${({ theme }) => theme.colors.primary.p800};
                background: ${({ theme }) => theme.colors.grayscale.g50};
            }
    
            > svg {
                color: inherit;
                fill: currentColor;
            }
        }
    }
`;


export const EquipmentChartDetailInfoComponent = styled(EquipmentAnalysisComponent)`
    position: absolute;
    width: 340px;
    height: 452px;
    top: 59%;
    left: 81%;

`;

export const EquipmentChartInfoComponent = styled(DetailInfoComponent)`
    position: absolute;
    width: 720px;
    height: 954px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .dslTop {
        > div {
            > p {
                width: 200px;
            }
        }
    }

    .content {
        padding: 25px;
        height: calc(100% - 40px);
        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '12px')};

        .eqWrap {
            width: 100%;
            text-align: left;

            > figcaption {
                width: 100%;
                text-align: left;
                padding-left: 20px;

                > p {

                    &:nth-child(1) {
                        font-size: 0.875rem;
                        font-weight: 500;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }

                    &:nth-child(2) {
                        font-size: 2.5rem;
                        font-weight: 500;
                        line-height: 140%; /* 56px */
                        letter-spacing: -1.2px;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                    }
                }
            }
        }

        .aiChartWrap{
            width: 100%;
            height: 320px !important;
            background: ${({ theme }) => theme.colors.background.base};
            border-radius: 8px;
            padding: 8px 16px 10px 16px;
            position: relative;

            .titleWrap {
                ${({ theme }) => theme.mixins.flex()};

                > h3 {
                    font-size: 0.75rem;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }
    
                .legendWrap {
                    ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
    
                    > ul {
                        border-radius: 4px;
                        background: rgba(255, 255, 255, 0.05);
                        padding: 0 8px;
                        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
    
                        > li {
                            font-size: 0.5rem;
                            line-height: 172%; /* 13.76px */
                            letter-spacing: -0.24px;
                            color: ${({ theme }) => theme.colors.white};
                            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                        }
                    }
    
                    .legend {
                        > li {
                            &::after {
                                content: '';
                                display: inline-block;
                                width: 20px;
                                margin-left: 4px;
                            }
    
                            &:nth-child(1)::after {
                                border: 1px solid #4EB6FF;
                            }
    
                            &:nth-child(2)::after {
                                border: 1px dashed #37B44A;
                            }
                        }
                    }
    
                    .actionStep {
                        > li {
                            &::before {
                                content: '';
                                width: 8px;
                                height: 8px;
                                border-radius: 2px;
                                display: inline-block;
                            }
    
                            &:nth-child(1)::before {
                                background: rgba(73, 113, 255, 0.60);
                            }
    
                            &:nth-child(2)::before {
                                background: rgba(255, 199, 58, 0.60);
                            }
    
                            &:nth-child(3)::before {
                                background: rgba(252, 107, 25, 0.60);
                            }
    
                            &:nth-child(4)::before {
                                background: rgba(255, 60, 60, 0.60);
                            }
                        }
                    }
                }
            }

            .chart {
                height: calc(100% - 20px);
            }
        }

        .sensorChartWrap {
            flex: 1;
            width: 100%;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column', '12px')};

                .sensorItem {
                    flex: 0 0 120px;
                    width: 100%;
                    height: 120px;
                    min-height: 120px;
                    background: ${({ theme }) => theme.colors.background.base};
                    border-radius: 8px;
                    padding: 8px 16px;
                    ${({ theme }) => theme.mixins.flex()};
                    overflow: hidden;

                    > header {
                        flex: 1;
                        height: 100%;
                        min-height: 0;
                        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '16px')};

                    > p {

                        &:nth-child(1) {
                            font-size: 0.75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                        }

                        &:nth-child(2) {
                            font-size: 2rem;
                            font-weight: 500;
                            line-height: 138%; /* 44.16px */
                            letter-spacing: -0.96px;
                            color: ${({ theme }) => theme.colors.white};
                            margin: 0 auto;

                            > span {
                                font-size: 0.75rem;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;
                                margin-left: 9px;
                            }
                        }
                    }
                }
                
                .chart {
                    width: 425px;
                    height: ${(props) => props.$type === 'Ro Safety Filter' ? '100px' : '70px'};
                }
            }

            &.flex {

                .sensorItem {
                    flex: 0 0 80px;
                    height: 80px;
                    min-height: 80px;
                    padding: 6px 16px;

                    > header {
                        gap: 7px;

                        p:nth-child(2) {
                            font-size: 1.5rem;
                            line-height: 140%; /* 2.1rem */
                            letter-spacing: -0.045rem;

                            span {
                                font-size: 0.625rem;
                                line-height: 170%; /* 17px */
                                letter-spacing: -0.3px;
                                font-weight: 400;
                            }
                        }
                    }
                }
            }

            .flex {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '12px')};
                width: 100%;
                height: 120px;
                min-height: 120px;

                .sensorItem {
                    flex: 1 1 0;
                    width: 100%;
                    height: 100%;
                    min-height: 100%;
                    flex-direction: column;

                    > header {
                        width: 100%;
                        flex-direction: row;
                        justify-content: space-between;

                        > p {
                            font-weight: 400;

                            &:nth-child(2) {
                                font-size: 0.75rem;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;
                                margin: 0;

                                > span {
                                    font-size: 0.625rem;
                                    line-height: 170%; /* 17px */
                                    letter-spacing: -0.3px;
                                    margin-left: 4px;
                                }
                            }
                        }
                    }
                }

                .chart {
                    width: 315px;
                    height: 85px;
                }
            }
        }

        .btnWrap {
            flex: 1;
            width: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};

            > button {
                padding: 7px 16px;
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                color: #477DFF;

                > span {
                    color: inherit;
                    font-size: 1rem;
                    line-height: 160%; /* 25.6px */
                    letter-spacing: -0.48px;
                    text-decoration-line: underline;
                    text-decoration-style: solid;
                    text-decoration-skip-ink: auto;
                    text-decoration-thickness: auto;
                    text-underline-offset: auto;
                    text-underline-position: from-font;
                }

                > svg {
                    color: inherit;
                    fill: currentColor;
                }

                &:hover {
                    color: #6693FF;
                }

                &:active {
                    color: #84A8FF;
                }
            }
        }
    }
`;

export const ElectricChartInfoComponent = styled(DetailInfoComponent)`
    position: absolute;
    width: 777px;
    height: 887px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .dslTop {
        > div {
            > p {
                width: 200px;
            }
        }
    }

    .content {
        padding: 24px;

        &.loading {
            height: calc(100% - 40px);
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        .fullLoader {
            width: 100%;
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        > header {
            margin-left: 20px;
            margin-bottom: 12px;

            > p {
                &:nth-child(1) {
                    font-size: 0.875rem;
                    font-weight: 500;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }

                &:nth-child(2) {
                    font-size: 2.5rem;
                    font-weight: 500;
                    line-height: 140%; /* 56px */
                    letter-spacing: -1.2px;
                    color: ${({ theme }) => theme.colors.grayscale.g20};
                }
            }
        }

        > div {
            width: 100%;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column', '12px')};

            > section {
                width: 100%;
    
                > article {
                    height: 100%;
                    border-radius: 8px;
                    background: ${({ theme }) => theme.colors.background.base};
                    padding: 8px 16px;
                    flex: 1;
                    overflow: hidden;
    
                    h3 {
                        font-size: 0.75rem;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }
                }
            }
    
            .chartSection {
                ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'row', '12px')};

                .aiChartWrap{
                    width: 100%;
                    height: 380px !important;
                    background: ${({ theme }) => theme.colors.background.base};
                    border-radius: 8px;
                    padding: 8px 16px 10px 16px;
                    position: relative;

                    .titleWrap {
                        ${({ theme }) => theme.mixins.flex()};

                        > h3 {
                            font-size: 0.75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                            margin-bottom: 5px;
                        }
    
                        .legendWrap {
                            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
    
                            > ul {
                                border-radius: 4px;
                                background: rgba(255, 255, 255, 0.05);
                                padding: 0 8px;
                                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
    
                                > li {
                                    font-size: 0.5rem;
                                    line-height: 172%; /* 13.76px */
                                    letter-spacing: -0.24px;
                                    color: ${({ theme }) => theme.colors.white};
                                    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                                }
                            }
    
                            .legend {
                                > li {
                                    &::after {
                                        content: '';
                                        display: inline-block;
                                        width: 20px;
                                        margin-left: 4px;
                                    }
    
                                    &:nth-child(1)::after {
                                        border: 1px solid #FFAE5E;
                                    }
                                    
                                    &:nth-child(2)::after {
                                        border: 1px solid #4EB6FF;
                                    }
                                }
                            }
    
                            .actionStep {
                                > li {
                                    &::before {
                                        content: '';
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 2px;
                                        display: inline-block;
                                    }
            
                                    &:nth-child(1)::before {
                                        background: rgba(73, 113, 255, 0.60);
                                    }
            
                                    &:nth-child(2)::before {
                                        background: rgba(255, 199, 58, 0.60);
                                    }
            
                                    &:nth-child(3)::before {
                                        background: rgba(252, 107, 25, 0.60);
                                    }
            
                                    &:nth-child(4)::before {
                                        background: rgba(255, 60, 60, 0.60);
                                    }
                                }
                            }
                        }
                    }

                    .chart {
                        height: calc(100% - 20px);
                    }
                }
            }
    
            .infoSection {

                .detailWrap {
                    ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'row', '12px')};

                    > ul {
                        flex: 1;

                        > li {
                            ${({ theme }) => theme.mixins.flex()};
                            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                            padding: 8px;

                            > p {
                                font-size: 0.75rem;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;

                                &:nth-child(1) {
                                    color: ${({ theme }) => theme.colors.grayscale.g200};
                                }

                                &:nth-child(2) {
                                    color: ${({ theme }) => theme.colors.grayscale.g20};
                                }
                            }
                        }
                    }
                }
            }

            .btnWrap {
                flex: 1;
                width: 100%;
                ${({ theme }) => theme.mixins.flex('center', 'center')};

                > button {
                    padding: 7px 16px;
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                    color: #477DFF;

                    > span {
                        color: inherit;
                        font-size: 1rem;
                        line-height: 160%; /* 25.6px */
                        letter-spacing: -0.48px;
                        text-decoration-line: underline;
                        text-decoration-style: solid;
                        text-decoration-skip-ink: auto;
                        text-decoration-thickness: auto;
                        text-underline-offset: auto;
                        text-underline-position: from-font;
                    }

                    > svg {
                        color: inherit;
                        fill: currentColor;
                    }

                    &:hover {
                        color: #6693FF;
                    }

                    &:active {
                        color: #84A8FF;
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 작업자 정보
export const WorkerInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 550px;
    height: 500px;
    top: 18%;
    left: 49%;

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 12px 6px 16px 16px;
        height: calc(100% - 40px);
        overflow: hidden;

        .searchWrap {
            flex-shrink: 0;
            padding-right: 10px;
            margin-bottom: 10px;
        }

        .countText {
            flex-shrink: 0;
            font-size: 0.75rem;
            color: ${({ theme }) => theme.colors.grayscale.g300};
            letter-spacing: -0.36px;
            text-align: right;
            padding-right: 10px;
            margin-bottom: 8px;

            .countNum {
                font-size: inherit;
                color: ${({ theme }) => theme.colors.primary.p500};
            }
        }

        .workerWrap {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding-right: 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;

            .workerHeader {
                flex-shrink: 0;
                display: grid;
                grid-template-columns: 1.5fr 2fr 1fr 1fr 15px;
                padding: 6px 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                margin-bottom: 2px;

                span {
                    font-size: 0.75rem;
                    color: ${({ theme }) => theme.colors.grayscale.g300};
                    letter-spacing: -0.36px;
                }
            }

            .workerItem {
                flex-shrink: 0;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                background: ${({ theme }) => theme.colors.background.base};

                &:hover {
                    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                    border-color: ${({ theme }) => theme.colors.primary.p400};
                }

                &.on {
                    border-color: ${({ theme }) => theme.colors.primary.p500};
                }

                .workerRow {
                    display: grid;
                    grid-template-columns: 1.5fr 2fr 1fr 1fr 15px;
                    align-items: center;
                    padding: 8px 16px;
                    cursor: pointer;

                    span {
                        display: block;
                        min-width: 0;
                        font-size: 0.75rem;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding-right: 10px;
                    }
                }

                .workerDetail {
                    border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                    padding: 10px 16px;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    column-gap: 12px;
                    background: rgba(255, 255, 255, 0.02);

                    .detailGroup {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        padding: 6px 0;

                        &.span2 {
                            grid-column: span 2;
                        }

                        /* &:nth-child(-n+3) {
                            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        } */

                        .label {
                            font-size: 0.625rem;
                            color: ${({ theme }) => theme.colors.grayscale.g400};
                            letter-spacing: -0.3px;
                            line-height: 150%;
                        }

                        span:last-child {
                            font-size: 0.75rem;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                            line-height: 170%;
                        }
                    }
                }
            }
        }

        .noData {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            padding-right: 10px;

            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.05);
                object-fit: none;
                margin-bottom: 8px;
            }

            p {
                font-size: 0.875rem;
                color: ${({ theme }) => theme.colors.grayscale.g300};
            }
        }
    }
`;
