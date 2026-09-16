import styled, { keyframes, css } from "styled-components";

import select_arrow_on from '../../Settings/images/select_arrow.svg';
import contentBoxEl from '../images/contentBoxEl.svg';
import resize_icon from '../images/resize_icon.svg';
import event_memo from '../images/event_memo.svg';
import event_close from '../images/event_close.svg';
import event_cctv from '../images/event_cctv.svg';

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

        .tree {
            display: none;

            &.on {
                display: block;
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
        ${({ theme }) => theme.mixins.flex()};

        > p {
            color: ${({ theme }) => theme.colors.grayscale.g100};
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            margin-right: 11px;
        }

        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '6px')};

            > button {
                ${({ theme }) => theme.mixins.flex('center', 'center')};
                color: ${({ theme }) => theme.colors.grayscale.g500};
                width: 28px;
                height: 28px;
                border-radius: 4px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
    
                &:nth-child(1) {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                    color: ${({ theme }) => theme.colors.white};
                }
    
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
            width: 298px;
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

    .content {
        position: relative;
        padding: 16px 6px 20px 20px;
        height: calc(100% - 40px);

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

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '6px')};

                > p:nth-child(2)::before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 12px;
                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                    margin-right: 6px;
                    position: relative;
                    top: 1px;
                }
            }
            p, span {
                font-size: 0.75rem;
                line-height: 170%;
                letter-spacing: -0.36px;
            }

            span {
                color: ${({ theme }) => theme.colors.primary.p300};
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
                    pointer-events: none;
                    border: 0;

                    & * {
                        color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                    }

                    header {
                        .eventIconWrap {
                            .on {
                                &::before {
                                    background-color: #5E423B !important;
                                }
                            }
                        }

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
            width: 100%;

            > button {
                width: calc(100% - 14px);
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
    height: 604px;
    top: 11.5%;
    left: 39.5%;

    .content {
        position: relative;

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

                            &.sensor {
                                color: ${({ theme }) => theme.colors.error.error300};
                            }

                            &.manual {
                                color: ${({ theme }) => theme.colors.primary.p300};
                            }
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
    top: 65.7%;
    left: 19%;

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
    height: 256px !important;
    top: 65.7%;
    left: 19%;
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

        .valueWrap {
            > ul {
                margin: 0 6px 10px 0;
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
            margin: 0 19px 16px 19px;
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

            > button {
                margin-bottom: 8px;
            }

            .chart {
                height: 200px;
                background-color: ${({ theme }) => theme.colors.background.base};
                border-radius: 8px;
                padding: 10px;
            }

            .riskInfo {
                ${({ theme }) => theme.mixins.flex()};
                padding: 8px;
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                margin: 8px 0;

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

        .menuTypeWrap {
            padding: 0 20px;
        }

        .infoWrap {
            height: 100%;
            
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
        .loading {
            width: 100%;
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        .chartWrap {
            padding: 12px 20px;

            .chart {
                height: 200px;
                background-color: ${({ theme }) => theme.colors.background.base};
                border-radius: 8px;
                padding: 10px;
            }
        }

        .valueWrap {
            > ul {
                margin-bottom: 16px;
                padding: 0 20px;

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

        .cctvWrap {
            padding: 16px 20px 12px 20px;

            > iframe {
                width: 100%;
                height: 184px;
                display: block;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
            }
        }

        .noData {
            height: 184px;
        }
    }
`;


/**********************************************************************/
// 이벤트 CCTV

export const AlarmCCTVInfoComponent = styled(CCTVInfoComponent)`
    height: 320px !important;

    .dslTop {
        > div {
            > p {
                width: 130px;
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        height: calc(320px - 40px);
        padding: 0 16px 16px;
        box-sizing: border-box;

        .noData {
            height: 100%;
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
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 8px;
        align-items: stretch;
    }

    /* 확대 모드일 때: 1칸만 전체 차지 */
    .content .cctvGrid.expanded {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }

    .cctvTile {
        display: flex;
        flex-direction: column;
        overflow: visible;
        border-radius: 8px;
        background: rgba(19, 29, 36, 0.92);
        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
        cursor: default;
        min-height: 0;
        min-width: 0;
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
        min-width: 0;
        padding: 2px 8px;
        position: relative;
        z-index: 3;
    }

    .titleWrap {
        flex: 1 1 0%;
        min-width: 0;
        overflow: hidden; 
    }

    .cctvTile .tileHeader .title {
        flex: 1;
        min-width: 0;
        ${({ theme }) => theme.mixins.textEllipsis()};
        font-size: .75rem;
        line-height: 170%; /* 20.4px */
        letter-spacing: -0.36px;
        display: block;
    }

    .cctvTile .tileBody {
        flex: 1;           /* 나머지 공간 */
        min-height: 0;     /* ⭐ flex 아이템이 overflow로 커지는 거 방지 */
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
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

    [data-tooltip]:after {
        bottom: -4px;
    }

    [data-tooltip]:before {
        bottom: -36px;
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
    height: 284px;
    top: 20%;
    left: 84%;
    z-index: 3;

    .content {
        padding: 16px 6px 16px 20px;
        ${({ theme }) => theme.mixins.flex('space-between', 'center', 'column')};

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
                background: rgba(255, 255, 255, 0.02);

                &:not(:last-child) {
                    margin-bottom: 4px;
                }

                p {
                    width: calc(100% - 30px);
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.primary.p400};
                    ${({ theme }) => theme.mixins.textEllipsis()};
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
                    font-size: 0.75rem;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '18px')};

                    &:not(:last-child) {
                        margin-bottom: 8px;
                    }

                    &::before {
                        content: '';
                        display: inline-block;
                        width: 90px;
                        height: 16px;
                        border-radius: 4px;
                    }

                    &:nth-child(1)::before {
                        border: 1px solid #3844FF;
                        background: #00099F;
                    }

                    &:nth-child(2)::before {
                        border: 1px solid #3F9519;
                        background: #2F7311;
                    }

                    &:nth-child(3)::before {
                        border: 1px solid #FF877B;
                        background: #FF1700;
                    }
                }
            }
        }
    }
`;


/**********************************************************************/
// 출입자 현황정보
export const AccessInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 726px;
    top: 6.8%;
    left: 81.6%;

    .dslTop {
        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
        }
    }

    .menuTypeWrap {
        padding: 0 20px;
    }

    .content {
        position: relative;
        padding: 8px 8px 20px 20px;
        height: calc(100% - 82px);

        .countList {
            ${({ theme }) => theme.mixins.flex()};
            gap: 8px;
            padding-right: 12px;

            > li {
                flex: 1;
                border-radius: 8px;
                background: ${({ theme }) => theme.colors.background.base};

                .line {
                    display: block;
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.60) 50%, rgba(255, 255, 255, 0.00) 100%);
                }

                .countHeader {
                    padding: 8px 12px 4px 12px;
                    ${({ theme }) => theme.mixins.flex()};
                    flex-direction: column;
                    gap: 2px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.00);

                    > p {
                        font-size: .75rem;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }

                    .title {
                        align-self: flex-start; /* 왼쪽 정렬 */
                    }

                    .total {
                        align-self: flex-end;   /* 오른쪽 정렬 */
                        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '4px')};

                        > span {
                            font-size: 1.5rem;
                            line-height: 140%; /* 2.1rem */
                            letter-spacing: -0.045rem;
                            color: ${({ theme }) => theme.colors.primary.p400};
                            font-weight: 500;
                        }
                    }
                }

                .countBody {
                    padding: 4px 0;
                    ${({ theme }) => theme.mixins.flex()};
                    flex-direction: column;
                    gap: 4px;

                    > li {
                        ${({ theme }) => theme.mixins.flex()};
                        width: 100%;
                        padding: 4px 12px;

                        .label {
                            font-size: .75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '4px')};

                            &::before {
                                content: '';
                                display: block;
                                width: 1px;
                                height: 12px;
                                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                            }
                        }

                        .value {
                            font-size: 1rem;
                            font-weight: 500;
                            line-height: 172%; /* 27.52px */
                            letter-spacing: -0.48px;
                            color: ${({ theme }) => theme.colors.grayscale.g50};
                        }
                    }
                }
            }
        }

        .searchWrap {
            width: calc(100% - 12px);
            ${({ theme }) => theme.mixins.flex()};
            gap: 8px;
            padding: 12px 0 12px 0;
            margin-right: 12px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

            .resultCount {
                color: ${({ theme }) => theme.colors.primary.p300}; 
                font-size: 0.875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                white-space: nowrap;
            }
        }

        .contentList  {
            height: calc(100% - 226px);
            margin-top: 12px;
            display: flex;
            flex-direction: column;

            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 21%;
                }

                &:nth-of-type(2) {
                    width: 35%;
                }
                
                &:nth-of-type(3) {
                    width: 22%;
                }
                
                &:nth-of-type(4) {
                    width: 22%;
                }
                
            }

            .head {
                ${({ theme }) => theme.mixins.flex()};
                margin-bottom: 4px;
                padding-right: 12px;

                > div {
                    font-size: .75rem;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.grayscale.g300};
                    padding: 4px 8px;
                    ${({ theme }) => theme.mixins.flex()};
                }
            }

            .body {
                flex: 1;
                min-height: 0;
                overflow: hidden auto;
                ${({ theme }) => theme.mixins.scroll()};
                padding-right: 8px;

                ul {
                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        border-radius: 4px;
                        background: rgba(255, 255, 255, 0.05);
                        margin-bottom: 4px;
                        cursor: pointer;

                        > div {
                            font-size: .75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.white};
                            padding: 6px 8px;
                            ${({ theme }) => theme.mixins.textEllipsis()};
                        }

                        .entering,
                        .idle {
                            text-align: center;

                            > span {
                                padding: 2px 8px;
                                border-radius: 4px;
                                font-size: 0.875rem;
                                line-height: 172%; /* 24.08px */
                                letter-spacing: -0.42px;
                                border: 1px solid;
                            }
                        }

                        .entering > span {
                            color: ${({ theme }) => theme.colors.success.success400};
                            border-color: ${({ theme }) => theme.colors.success.success400};
                        }

                        .idle > span {
                            color: ${({ theme }) => theme.colors.grayscale.g400};
                            border-color: ${({ theme }) => theme.colors.grayscale.g400};
                        }

                        &:hover {
                            background: rgba(255, 255, 255, 0.10);
                        }

                        &.selected {
                            background: ${({ theme }) => theme.colors.primary.p100};

                            > div {
                                color: ${({ theme }) => theme.colors.primary.p700};
                            }
                        }
                    }
                }
            }
        }
        
        .treeWrap {
            flex: 1;
            min-height: 0;
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};
            margin-top: 12px;

            li {
                margin-bottom: 4px;

                .header {
                    width: calc(100% - 8px);
                    padding: 10px 8px;
                    border-radius: 6px;
                    background: transparent;
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                    cursor: pointer;
                    margin-bottom: 4px;
                    margin-right: 8px;

                    > p {
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        user-select: none;

                        &.count { 
                            margin-left: auto;
                        }
                    }

                    > svg {
                        width: 20px;
                        height: 20px;
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
    }
`;


export const AccessInfoSmallComponent = styled(PopupsCommon)`
    position: absolute;
    width: 820px !important;
    height: 116px !important;
    top: 80%;

    .dslTop {
        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
        }
    }

    .content {
        padding: 16px 20px;

        > div {
            display: grid;
            grid-template-columns: 100px 360px 160px 80px 80px;
            align-items: center;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            margin-bottom: 4px;

            .door {
                ${({ theme }) => theme.mixins.flex()};
                padding: 8px;
            }

            > p {
                padding: 8px;
            }
    
            p, span {
                font-size: .875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.white};
                ${({ theme }) => theme.mixins.textEllipsis()};
            }
    
            .entering,
            .idle,
            .important {
                text-align: center;

                > span {
                    padding: 2px 8px;
                    border-radius: 4px;
                    border: 1px solid;
                }
            }
    
            .entering > span {
                color: ${({ theme }) => theme.colors.success.success400};
                border-color: ${({ theme }) => theme.colors.success.success400};
            }
    
            .idle > span {
                color: ${({ theme }) => theme.colors.grayscale.g400};
                border-color: ${({ theme }) => theme.colors.grayscale.g400};
            }

            .important > span {
                color: ${({ theme }) => theme.colors.error.error400};
                border-color: ${({ theme }) => theme.colors.error.error400};
            }
        }
    }
`;


/**********************************************************************/
// 출입차량 현황정보
export const ParkingInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 900px;
    height: 652px;
    top: calc(50% - 326px);
    left: calc(50% - 450px);

    .dslTop {
        > div {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
        }
    }

    .content {
        padding: 20px;
        gap: 20px;
    }

    /* 상단 통계 영역 */
    .statsBar {
        flex-shrink: 0;
        height: 108px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.background.base};

        > ul {
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};

            > li {
                flex: 1;
                ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '8px')};

                &:not(:last-child) {
                    border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                }

                .label {
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }

                .value {
                    font-size: 1.75rem;
                    font-weight: 500;
                    line-height: 130%;
                    letter-spacing: -0.84px;
                    color: ${({ theme }) => theme.colors.white};
                }
            }
        }
    }

    /* 좌/우 패널 영역 */
    .panes {
        flex: 1;
        min-height: 0;
        ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'row', '20px')};
    }

    /* 좌측 : 차량 목록 */
    .listPane {
        flex: 1;
        min-width: 0;
        ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column', '12px')};
        padding: 16px 20px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.background.base};

        .listTop {
            flex-shrink: 0;
            ${({ theme }) => theme.mixins.flex('space-between', 'center')};

            .resetBtn {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                padding: 4px 6px;
                border: none;
                border-radius: 4px;
                background: transparent;
                color: ${({ theme }) => theme.colors.primary.p400};
                font-size: 0.75rem;
                line-height: 170%;
                letter-spacing: -0.36px;
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                &:disabled {
                    color: ${({ theme }) => theme.colors.grayscale.g500};
                    cursor: default;
                    background: transparent;
                }

                > svg path {
                    fill: currentColor;
                }
            }
        }

        .contentList {
            flex: 1;
            min-height: 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column')};

            .head > div,
            .body > ul > li > div {
                &:nth-of-type(1) { width: 26%; }
                &:nth-of-type(2) { width: 38%; }
                &:nth-of-type(3) { width: 18%; }
                &:nth-of-type(4) { width: 18%; }
            }

            .head {
                flex-shrink: 0;
                ${({ theme }) => theme.mixins.flex()};
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

                > div {
                    ${({ theme }) => theme.mixins.flex('space-between', 'center')};
                    gap: 4px;
                    padding: 8px 12px;
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g300};

                    &.sortable {
                        cursor: pointer;

                        svg { flex-shrink: 0; }

                        /* 기본 상태: 정렬 아이콘(↕)은 hover 시에만 노출 */
                        .sortHint {
                            display: inline-flex;
                            opacity: 0;
                        }

                        &:hover {
                            background: rgba(255, 255, 255, 0.05);
                        }

                        &:hover .sortHint {
                            opacity: 1;
                        }

                        /* 정렬 적용 상태: 파란색 + 단일 화살표(↑/↓) */
                        &.on { color: ${({ theme }) => theme.colors.primary.p400}; }
                    }
                }
            }

            .body {
                flex: 1;
                min-height: 0;
                overflow: hidden auto;
                ${({ theme }) => theme.mixins.scroll()};

                > ul > li {
                    ${({ theme }) => theme.mixins.flex()};
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                    cursor: pointer;

                    > div {
                        padding: 8px 12px;
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        ${({ theme }) => theme.mixins.textEllipsis()};
                    }

                    .badge {
                        font-weight: 400;
                        text-align: left;

                        > span {
                            display: inline-block;
                            padding: 0 8px;
                            border-radius: 4px;
                            border: 1px solid;
                            font-size: 0.875rem;
                            line-height: 172%;
                            letter-spacing: -0.42px;
                        }

                        &.enter > span {
                            color: ${({ theme }) => theme.colors.success.success400};
                            border-color: ${({ theme }) => theme.colors.success.success400};
                        }

                        &.exit > span {
                            color: ${({ theme }) => theme.colors.grayscale.g400};
                            border-color: ${({ theme }) => theme.colors.grayscale.g400};
                        }
                    }

                    &:hover {
                        background: rgba(255, 255, 255, 0.03);
                    }

                    &.selected {
                        background: rgba(255, 255, 255, 0.10);
                    }
                }
            }
        }
    }

    /* 우측 : 차량 상세 정보 */
    .detailPane {
        flex-shrink: 0;
        width: 273px;
        ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column', '16px')};
        padding: 16px 20px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.background.base};

        .paneTitle {
            flex-shrink: 0;
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }

        .detailBody {
            flex: 1;
            min-height: 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column', '16px')};
            overflow: hidden auto;
            ${({ theme }) => theme.mixins.scroll()};

            .vehicleImage {
                flex-shrink: 0;
                width: 100%;
                height: 150px;
                border-radius: 8px;
                object-fit: cover;
                background: ${({ theme }) => theme.colors.grayscale.g800};
            }

            .noImage {
                flex-shrink: 0;
                width: 100%;
                height: 150px;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '8px')};

                > p {
                    font-size: 0.875rem;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g400};
                }
            }

            .vehicleTitle {
                flex-shrink: 0;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                .number {
                    font-size: 1.5rem;
                    font-weight: 500;
                    line-height: 140%; /* 2.1rem */
                    letter-spacing: -0.045rem;
                    color: ${({ theme }) => theme.colors.grayscale.g50};
                }

                .badge > span {
                    display: inline-block;
                    padding: 0 8px;
                    border-radius: 4px;
                    border: 1px solid;
                    font-size: 0.875rem;
                    font-weight: 400;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                }

                .badge.enter > span {
                    color: ${({ theme }) => theme.colors.success.success400};
                    border-color: ${({ theme }) => theme.colors.success.success400};
                }

                .badge.exit > span {
                    color: ${({ theme }) => theme.colors.grayscale.g400};
                    border-color: ${({ theme }) => theme.colors.grayscale.g400};
                }
            }

            .detailFields {
                flex-shrink: 0;
                ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column', '8px')};

                > li {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};

                    .label {
                        flex-shrink: 0;
                        width: 76px;
                        padding: 0 12px;
                        border-radius: 4px;
                        background: #0B151C;
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                        white-space: nowrap;
                    }

                    .value {
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                    }
                }
            }
        }

        .manualOutBtn {
            flex-shrink: 0;
            width: 100%;
            padding: 8px;
            border: none;
            border-radius: 8px;
            background: ${({ theme }) => theme.colors.primary.p500};
            color: ${({ theme }) => theme.colors.white};
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            cursor: pointer;

            &:hover {
                background: ${({ theme }) => theme.colors.primary.p600};
            }
        }
    }
`;


/**********************************************************************/
// 출입자 이동 동선
export const AccessRouteComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 498px;
    top: 50%;
    left: 0.8%;

    .content {
        padding: 16px 8px 16px 20px;
    }
    
    .personInfo {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
        width: calc(100% - 12px);
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

        > img {
            width: 72px;
            height: 86px;
            border-radius: 8px;
            background-color: ${({ theme }) => theme.colors.white};
            object-fit: cover;
            object-position: top; 
        }

        > ul {
            min-width: 0;

            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                p:nth-child(1) {
                    margin-right: 6px;
                }

                p:nth-child(2) {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                }

                p:nth-child(2)::before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 12px;
                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                    margin-right: 6px;
                }

                &.name {
                    min-width: 0;

                    > p {
                        &:nth-child(1) {
                            min-width: 0;
                            font-size: 1.125rem;
                            font-weight: 500;
                            line-height: 169%; /* 30.42px */
                            letter-spacing: -0.54px;
                            color: ${({ theme }) => theme.colors.grayscale.g20};
                            ${({ theme }) => theme.mixins.textEllipsis()};
                        }

                        &:nth-child(2) {
                            font-size: 0.875rem;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            color: ${({ theme }) => theme.colors.grayscale.g100};
                            white-space: nowrap;
                        }
                    }
                }

                &.count {
                    p, span {
                        font-size: 0.75rem;
                        line-height: 170%;
                        letter-spacing: -0.36px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }

                    span {
                        color: ${({ theme }) => theme.colors.primary.p300};
                        margin-left: 2px;
                    }
                }
            }
        }
    }

    .sortWrap {
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
        width: calc(100% - 12px);
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

        > div {
            flex: 1;
        }

        > button {
            flex: none;
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
            border-radius: 4px;
            padding: 4px 6px;
            color: ${({ theme }) => theme.colors.grayscale.g200};

            &:hover {
                background: ${({ theme }) => theme.colors.grayscale.g25};
                color: ${({ theme }) => theme.colors.grayscale.g500};
            }

            &:active,
            &.selected {
                color: ${({ theme }) => theme.colors.primary.p800};
                background: ${({ theme }) => theme.colors.grayscale.g50};
            }
        }
    }

    .accessLog {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column', '8px')};
        overflow-y: auto;
        ${({ theme }) => theme.mixins.scroll()};
        padding-right: 8px;

        .accessLogList {
            width: 100%;

            .accessLogItem {
                position: relative;
                display: flex;
                gap: 8px;
                padding-bottom: 12px;
                cursor: pointer;
    
                .timeline {
                    position: relative;
                    width: 20px;
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column')};
                    flex-shrink: 0;
                    margin-top: 6px;
            
                    .timelineNumber {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background-color: ${({ theme }) => theme.colors.grayscale.g700};
                        color: ${({ theme }) => theme.colors.white};
                        font-size: 0.875rem;
                        font-weight: 500;
                        line-height: 100%; /* 14px */
                        letter-spacing: -0.42px;
                        ${({ theme }) => theme.mixins.flex('center', 'center')};
                        overflow: hidden;
                    }
                
                    .timelineLine {
                        position: absolute;
                        top: 20px;
                        width: 2px;
                        height: 110%;
                        background-color: ${({ theme }) => theme.colors.grayscale.g800};
                    }
                }
    
                &:last-child .timelineLine {
                    display: none;
                }
    
                .cardWrap {
                    flex: 1;
            
                    .cardHeader {
                        ${({ theme }) => theme.mixins.flex()};
                        padding: 4px 8px;
                        border-radius: 4px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        background: ${({ theme }) => theme.colors.background.base};
                        margin-bottom: 4px;
    
                        .badgeImportant {
                            font-size: 0.875rem;
                            padding: 0 8px;
                            border-radius: 4px;
                            border: 1px solid transparent;
                            color: ${({ theme }) => theme.colors.error.error400};
                            border-color: ${({ theme }) => theme.colors.error.error400};
                        }
    
                        .cardTitle {
                            font-size: 0.875rem;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            color: ${({ theme }) => theme.colors.white};
                        }
                    }
                
                    .cardBody {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column')};
                
                        .infoRow {
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '4px')};
                            font-size: 0.75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                
                            .infoLabel {
                                color: ${({ theme }) => theme.colors.grayscale.g400};
                            }
                        
                            .infoValue {
                                color: ${({ theme }) => theme.colors.grayscale.g100};
                            }
                        }
                    }
                }

                &:hover {
                    .timelineNumber {
                        background-color: ${({ theme }) => theme.colors.grayscale.g400};
                    }

                    .cardHeader {
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g400};
                    }
                }

                &.selected {
                    .timelineNumber {
                        background-color: ${({ theme }) => theme.colors.primary.p500};
                    }

                    .cardHeader {
                        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                    }
                }
            }
        }
    }

`;


/**********************************************************************/
// 출입문 현황정보
export const DoorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 340px;
    height: 328px;
    top: 65%;
    left: 81.6%;

    .content {
        padding: 16px 8px 16px 20px;

        .sortWrap {
            ${({ theme }) => theme.mixins.flex()};
            padding-right: 12px;
            margin-bottom: 12px;

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
            }

            p {
                font-size: 0.875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }

            > p {
                color: ${({ theme }) => theme.colors.primary.p300};
            }
        }

        .listWrap {
            overflow-y: auto;
            ${({ theme }) => theme.mixins.scroll()};
            padding-right: 8px;

            .listItem {
                ${({ theme }) => theme.mixins.flex()};
                padding: 8px 16px;
                border-radius: 6px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                background: ${({ theme }) => theme.colors.background.base};
                cursor: pointer;

                &:not(:last-child) {
                    margin-bottom: 4px;
                }

                .floor {
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                    > svg {
                        color: inherit;
                        fill: currentColor;
                    }

                    > p {
                        font-size: 0.875rem;
                        font-weight: 500;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                        ${({ theme }) => theme.colors.white};
                    }
                }

                .doorListWrap {
                    ${({ theme }) => theme.mixins.flex()};
                    gap: 12px;

                    .doorListItem {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                        p {
                            font-size: 0.75rem;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;

                            &:nth-child(1) {
                                color: ${({ theme }) => theme.colors.grayscale.g200};
                            }

                            &:nth-child(2) {
                                color: ${({ theme }) => theme.colors.white};
                                font-weight: 500;
                            }

                            &.highlight {
                                color: ${({ theme }) => theme.colors.primary.p300};
                            }
                        }
                    }
                }

                &:hover {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p300};
                }

                &:active,
                &.selected {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }
    }
`;


/**********************************************************************/
// 장비정보
export const TpsInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 1480px;
    height: 900px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

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
        ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'row', '20px')};
        height: calc(100% - 40px);
        padding: 20px;

        .parentList {
            flex: 0 0 260px;
            padding: 12px;
            border-radius: 8px;
            background-color: ${({ theme }) => theme.colors.background.base};
            overflow-y: auto;
            ${({ theme }) => theme.mixins.scroll()};

            ul {
                li {
                    margin-bottom: 4px;

                    button {
                        width: 100%;
                        text-align: left;
                        padding: 6px;
                        border-radius: 4px;
                        font-size: 0.875rem;
                        line-height: 172%;
                        letter-spacing: -0.42px;
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        background: transparent;
                        border: none;

                        &:hover {
                            color: ${({ theme }) => theme.colors.grayscale.g500};
                        }

                        &:active,
                        &.selected {
                            color: ${({ theme }) => theme.colors.primary.p800};
                            background: ${({ theme }) => theme.colors.grayscale.g50};
                        }
                    }
                }
            }
        }

        .infoWrap {
            flex: 1;
            min-height: 0;
            overflow: hidden;
            ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column', '20px')};

            .parentInfo {
                padding: 12px 20px 20px 20px;
                border-radius: 8px;
                background-color: ${({ theme }) => theme.colors.background.base};

                .header {
                    ${({ theme }) => theme.mixins.flex()};
                    margin-bottom: 12px;

                    p {
                        font-size: 1.125rem;
                        font-weight: 500;
                        line-height: 169%; /* 30.42px */
                        letter-spacing: -0.54px;
                        color: ${({ theme }) => theme.colors.primary.p400};
                    }
                }

                .infoTable {
                    table {
                        width: 100%;
                        table-layout: fixed;
                        border-collapse: collapse;
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

                        tr {
                            border-bottom: 1px solid rgba(255, 255, 255, 0.05);

                            &:last-child {
                                border-bottom: none;
                            }
                        }

                        th, td {
                            padding: 8px 12px;
                            font-size: 0.875rem;
                            line-height: 172%;
                            letter-spacing: -0.42px;
                            text-align: left;
                            vertical-align: middle;
                        }

                        th {
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                            font-weight: 400;
                            white-space: nowrap;
                            width: 120px;
                            background: rgba(255, 255, 255, 0.03);
                        }

                        td {
                            color: ${({ theme }) => theme.colors.white};
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            &.multiline {
                                white-space: normal;
                                position: relative;

                                > span {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    padding: 8px 12px;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 3;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    word-break: break-all;
                                }
                            }
                        }
                    }
                }
            }

            .childList {
                flex: 1;
                min-height: 0;
                padding-top: 12px;
                border-radius: 8px;
                background-color: ${({ theme }) => theme.colors.background.base};
                ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'column')};
                overflow: hidden;

                .head {
                    ${({ theme }) => theme.mixins.flex()};
                    padding: 0 20px;
                    margin-bottom: 12px;

                    > div {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};

                        > p {
                            font-size: 1rem;
                            line-height: 172%; /* 27.52px */
                            letter-spacing: -0.48px;
                            color: ${({ theme }) => theme.colors.white};
                            white-space: nowrap;
                        }
                    }
                }

                .body {
                    flex: 1;
                    overflow: hidden;

                    .tableScrollX {
                        width: 100%;
                        height: 100%;
                        overflow-x: auto;
                        overflow-y: auto;
                        ${({ theme }) => theme.mixins.scroll('x', '#313644', '#CECFD2')};
                        ${({ theme }) => theme.mixins.scroll('y', '#313644', '#CECFD2')};
                    }

                    .list {
                        width: max-content;
                        min-width: 100%;
                        height: 100%;

                        .listHead {
                            position: sticky;
                            top: 0;
                            z-index: 2;
                            ${({ theme }) => theme.mixins.flex()};
                            background: #1A242B;

                            > div {
                                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '5px')};
                                height: 34px;
                                text-align: center;
                                color: ${({ theme }) => theme.colors.grayscale.g200};
                                font-size: 0.875rem;

                                &:not(:last-child) {
                                    border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                                }

                                > span {
                                    color: inherit;
                                }
    
                                button {
                                    color: ${({ theme }) => theme.colors.grayscale.g200};
                                }
    
                                svg, path {
                                    color: inherit;
                                    fill: currentColor;
                                }
                            }
                        }

                        .listBody {
                            overflow-y: visible;
                            height: calc(100% - 34px);

                            ul {
                                li {
                                    ${({ theme }) => theme.mixins.flex()};
                                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

                                    > div {
                                        height: 40px;
                                        ${({ theme }) => theme.mixins.flex('center', 'center')};
                                        border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                                        padding: 4px;

                                        > span {
                                            ${({ theme }) => theme.mixins.textEllipsis()};
                                            width: 100%;
                                            text-align: center;
                                            font-size: 0.875rem;
                                            color: ${({ theme }) => theme.colors.white};
                                        }

                                        .dot {
                                            display: inline-block;
                                            width: 12px;
                                            height: 12px;
                                            border-radius: 50%;
                                            background: ${({ theme }) => theme.colors.grayscale.g300};
                                        }
                                    }
                                }
                            }
                        }

                        /* dot */
                        .listHead > div,
                        .listBody > ul > li > div {
                            &:nth-of-type(1) {
                                width: 50px;
                                min-width: 50px;
                            }
                            /* NO */
                            &:nth-of-type(2) {
                                width: 60px;
                                min-width: 60px;
                            }
                            /* 장비 타입 */
                            &:nth-of-type(3) {
                                width: 180px;
                                min-width: 180px;
                            }
                            /* 상위 장비 */
                            &:nth-of-type(4) {
                                width: 180px;
                                min-width: 180px;
                            }
                            /* 층 */
                            &:nth-of-type(5) {
                                width: 80px;
                                min-width: 80px;
                            }
                            /* 자재명 */
                            &:nth-of-type(6) {
                                width: 160px;
                                min-width: 160px;
                            }
                            /* 모델명 */
                            &:nth-of-type(7) {
                                width: 180px;
                                min-width: 180px;
                            }
                            /* 장비식별정보 */
                            &:nth-of-type(8) {
                                width: 180px;
                                min-width: 180px;
                            }
                            /* 규격 */
                            &:nth-of-type(9) {
                                width: 160px;
                                min-width: 160px;
                            }
                            /* IP */
                            &:nth-of-type(10) {
                                width: 140px;
                                min-width: 140px;
                            }
                            /* 위치 */
                            &:nth-of-type(11) {
                                width: 140px;
                                min-width: 140px;
                            }
                            /* 교체일자 */
                            &:nth-of-type(12) {
                                width: 120px;
                                min-width: 120px;
                            }
                            /* 비고 */
                            &:nth-of-type(13) {
                                width: 200px;
                                min-width: 200px;
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const EditParentEquipComponent = styled.div`
    width: 480px;
    height: 880px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    border-radius: 8px;
    padding: 40px;
    user-select: none;
    z-index: 10;

    header {
        margin-bottom: 40px;

        h2 {
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.48px;
        }
    }

    section {
        & * {
            font-size: 0.875rem;
        }

        > ul > li {
            ${({ theme }) => theme.mixins.flex()};
            margin-bottom: 16px;

            > div {
                &:nth-child(1) {
                    flex: 1;
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                }

                &:nth-child(2) {
                    width: 297px;

                    p, input, select, textarea {
                        width: 100%;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        border-radius: 8px;
                        font-size: 0.875rem;
                        background-color: transparent;
                        color: ${({ theme }) => theme.colors.white};
                    }

                    p, input, select {
                        height: 32px;
                        padding: 7px 10px;
                    }

                    p {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                        color: ${({ theme }) => theme.colors.grayscale.g600};
                    }

                    select {
                        appearance: none;
                        cursor: pointer;
                        background: ${({ theme }) => theme.colors.background.base} url(${select_arrow_on}) no-repeat;
                        background-position: calc(100% - 20px) center;
                        padding: 0 30px 0 10px;
                    }

                    textarea {
                        width: 100%;
                        height: 100px;
                        padding: 8px 10px;
                        resize: none;
                        overflow-y: auto;
                        ${({ theme }) => theme.mixins.scroll('y', '#313644', '#CECFD2')};
                    }

                    &.datepicker {
                        position: relative;
                        width: 297px;
                        height: 32px;
                        border-radius: 8px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        background: transparent;
                        overflow: visible !important;
                        padding-left: 10px;
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                        .react-datepicker-wrapper,
                        .react-datepicker__input-container {
                            width: 100%;
                        }

                        input[type="text"] {
                            display: block;
                            width: 100%;
                            height: auto;
                            background: transparent;
                            font-size: 0.875rem;
                            line-height: 172%;
                            letter-spacing: -0.42px;
                            border: none !important;
                            padding: 0 !important;
                            color: ${({ theme }) => theme.colors.white};
                        }

                        .react-datepicker {
                            font-size: 0.625rem;
                        }

                        .react-datepicker-popper {
                            left: 50% !important;
                            transform: translateX(-50%) !important;
                            bottom: 100% !important;
                            top: auto !important;
                            margin-bottom: 4px;
                        }

                        .react-datepicker__header {
                            text-align: center;
                            background-color: #f0f0f0;
                            border-bottom: 1px solid #aeaeae;
                            border-top-left-radius: 0.3rem;
                            padding: 12px 8px;
                            position: relative;

                            .react-datepicker__current-month {
                                margin-top: 0;
                                color: ${({ theme }) => theme.colors.black};
                                font-weight: bold;
                                font-size: 0.8125rem;
                                margin-bottom: 4px;
                            }
                        }

                        .react-datepicker__day-name {
                            color: ${({ theme }) => theme.colors.black};
                            display: inline-block;
                            width: 2.2rem;
                            line-height: 2.0rem;
                            text-align: center;
                            margin: 0.4rem;
                            font-size: 0.75rem;
                        }

                        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
                            color: ${({ theme }) => theme.colors.black};
                            display: inline-block;
                            width: 2.2rem;
                            line-height: 2.0rem;
                            text-align: center;
                            margin: 0.4rem;
                            font-size: 0.75rem;
                        }

                        .react-datepicker__day--selected,
                        .react-datepicker__day--in-selecting-range,
                        .react-datepicker__day--in-range,
                        .react-datepicker__month-text--selected,
                        .react-datepicker__month-text--in-selecting-range,
                        .react-datepicker__month-text--in-range,
                        .react-datepicker__quarter-text--selected,
                        .react-datepicker__quarter-text--in-selecting-range,
                        .react-datepicker__quarter-text--in-range,
                        .react-datepicker__year-text--selected,
                        .react-datepicker__year-text--in-selecting-range,
                        .react-datepicker__year-text--in-range {
                            border-radius: 0.3rem;
                            background: ${({ theme }) => theme.colors.primary.p500};
                            color: ${({ theme }) => theme.colors.white} !important;
                        }

                        .btnCalendarBk {
                            width: 17px;
                            height: 18px;
                            display: inline-block;
                            position: absolute;
                            right: 20px;
                            top: 50%;
                            transform: translate(0, -50%);
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }

    .btnWrap {
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '12px')};
        margin-top: 52px;
    }
`;

// 화재 알람 안내 모달 fade-in animation
const fireAlarmModalShow = keyframes`
    from {
        opacity: 0;
        margin-top: -30px;
    }
    to {
        opacity: 1;
        margin-top: 0;
    }
`;

export const FireAlarmModalComponent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;

    width: 400px;
    box-sizing: border-box;
    padding: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    border: 2px solid #D83A3A;
    border-radius: 12px;
    background: linear-gradient(180deg, #3A2323 0%, #1E1010 100%);
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1), 0px 12px 40px 0px rgba(0, 0, 0, 0.4);

    user-select: none;
    animation: ${fireAlarmModalShow} 0.3s ease-out;

    .infoWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .headerWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .sirenIcon {
        width: 56px;
        height: 52px;
    }

    .title {
        color: #E48181;
        font-size: 18px;
        font-weight: 500;
        line-height: 169%;
        letter-spacing: -0.54px;
        text-align: center;
        white-space: nowrap;
    }

    .metaWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .typeRow {
        display: flex;
        align-items: center;
        gap: 8px;

        .detectType {
            font-size: 14px;
            font-weight: 400;
            line-height: 172%;
            letter-spacing: -0.42px;
            white-space: nowrap;

            &.sensor {
                color: #E48181;
            }

            &.manual {
                color: #8CA5FF;
            }
        }

        .dot {
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background: #A6A9AF;
        }

        .dateTime {
            color: #CECFD2;
            font-size: 14px;
            font-weight: 400;
            line-height: 172%;
            letter-spacing: -0.42px;
            white-space: nowrap;
        }
    }

    .messageRow {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        line-height: 172%;
        white-space: nowrap;

        .keyword {
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 500;
            letter-spacing: -0.48px;
        }

        .text {
            color: #CECFD2;
            font-size: 14px;
            font-weight: 400;
            letter-spacing: -0.42px;
        }
    }
`;