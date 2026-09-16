import styled from 'styled-components';

import popup_background from '../images/popup_background.png';
import treeArrow from '../images/treeArrow.svg';
import sortIcon from '../images/sortIcon.svg';
import yesIcon from '../images/yesIcon.svg';
import noIcon from '../images/noIcon.svg';
import receiver_icon from '../images/receiver_icon.svg';
import member_check_on from '../images/member_check_on.svg';
import member_check_off from '../images/member_check_off.svg';
import sop_selected from '../images/sop_selected.svg';
import select_arrow_on from '../../Common/images/select_arrow_on.svg';
import searchIcon from '../../Account/images/searchIcon.svg';


/**********************************************************************/
// 환경설정

export const LayoutSettingComponent = styled.div`
    width: 1016px;
    height: 746px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    user-select: none;
    ${({ theme }) => theme.mixins.flex('center', 'center')};
    flex-direction: column;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.background.base};
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);

    > div {
        position: relative;
        width: 1008px; 
        height: 738px;
        border-radius: 16px;
        background: rgba(20, 27, 39, 0.01);
        box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.05) inset;
        padding: 28px;
    }

    .menuWrap {

        h2 {
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            padding: 10px 0;
            margin-bottom: 24px;
        }

        ul {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '4px')};
            position: relative;

            &::before {
                content: '';
                width: 100%;
                height: 1px;
                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                position: absolute;
                top: 32.5px;
                right: 0;
            }

            li {
                ${({ theme }) => theme.mixins.flex('center', 'center')};
                width: 80px;
                padding: 4px 0;
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g700};
                border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g700};
                z-index: 1;
                cursor: pointer;

                &.on {
                    color: ${({ theme }) => theme.colors.primary.p500};
                    border-bottom: 2px solid ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translate(-50%, 0);
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
    }
`;


/**********************************************************************/
// 환경설정 공통 CSS
export const SettingCommon = styled.div`
    padding: 20px 0;

    select {
        background: #0D121A url(${select_arrow_on}) 95% 49% no-repeat;

        &.short {
            background: #0D121A url(${select_arrow_on}) 90% 49% no-repeat;

            &:focus {
                background: #0D121A url(${select_arrow_on}) 90% 49% no-repeat;
            }
        }

        &:focus {
            background: #0D121A url(${select_arrow_on}) 95% 49% no-repeat;
        }
    }

    option {
        background: #0D121A;
    }

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
        right: 170%;
        transform: translate(0, -50%);
        padding: 4px 8px;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.grayscale.g700};
        font-size: 0.75rem;
        content: attr(data-tooltip);
        text-align: left;
        line-height: 170%;
        letter-spacing: -0.36px;
        width: 280px;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-left: 5px solid ${({ theme }) => theme.colors.white};
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        right: 140%;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .contents {
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 0 20px;

        &:not(:last-child) {
            margin-bottom: 20px;
        }

        .item {
            ${({ theme }) => theme.mixins.flex()};
            width: 100%;
            padding: 20px 0;

            &:not(:last-child) {
                border-bottom: 1px solid rgba(255, 255, 255, 0.10);
            }

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                > p {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    margin-right: 24px;
                }

                > span {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }

                > div:not(:nth-child(1)) {
                    margin-right: 20px;
                }
            }

            label {
                gap: 8px;
                color: ${({ theme }) => theme.colors.white};
            }

            .innerTxt {
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
            }
        }
    }
`;


/**********************************************************************/
// 3D 관제

export const Monitoring3DComponent = styled(SettingCommon)`

`;


/**********************************************************************/
// 사용자 옵션

export const UserOptionComponent = styled(SettingCommon)`
    .dropBox {
        width: 107px;
    }

    .item > div > div {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;


/**********************************************************************/
// SOP

export const SopSetComponent = styled(SettingCommon)`
    .dropBox {
        width: 107px;
    }

    .item > div > div {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;


/**********************************************************************/
// 기타

export const SettingEtcComponent = styled(SettingCommon)`

    span {
        font-size: 12px !important;
    }
`;


/**********************************************************************/
// SOP 환경 - 고급

export const SopLinkComponent = styled.section`
    width: 860px;
    height: 654px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.background.base};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);

    .listWrap {
        ${({ theme }) => theme.mixins.flex()};
        margin-bottom: 24px;

        h5 {
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    .sopTreeArea {
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;
        height: 226px;
        margin-bottom: 20px;

        > div {
            flex: 1;
            height: 100%;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.05);
            overflow: hidden;

            .head {
                background-color: rgba(255, 255, 255, 0.10);
                padding: 8px;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g200};
            }
        }
    }

    .sopScroll {
        display: block;
        height: calc(100% - 36px);
        overflow-x: hidden;
        overflow-y: auto;

        ${({ theme }) => theme.mixins.scroll()};
    }

    .sopListArea {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;

        & * {
            font-size: 12px;
            letter-spacing: -0.36px;
        }

        .sopList {

            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 6%;
                }

                &:nth-of-type(2) {
                    width: 16%;
                }
                
                &:nth-of-type(3) {
                    width: 16%;
                }
                
                &:nth-of-type(4) {
                    width: 16%;
                }
                
                &:nth-of-type(5) {
                    width: 16%;
                }
                
                &:nth-of-type(6) {
                    width: 24%;
                }

                &:nth-of-type(7) {
                    width: 6%;
                }
            }

            .head {
                background: rgba(255, 255, 255, 0.10);
                width: calc(100% - 4px);
                ${({ theme }) => theme.mixins.flex()};
                position: relative;

                &::after {
                    content: '';
                    width: 4px;
                    height: 32px;
                    background-color: rgba(255, 255, 255, 0.10);
                    position: absolute;
                    right: -4px;
                }

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid rgba(255, 255, 255, 0.10);
                    }

                    height: 32px;
                    line-height: 32px;
                    padding: 0 8px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                    text-align: center;

                    .sort {
                        ${({ theme }) => theme.mixins.flex()};

                        span {
                            font-size: 12px;
                            color: ${({ theme }) => theme.colors.grayscale.g200};
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
                overflow-y: scroll;
                height: 188px;

                ${({ theme }) => theme.mixins.scroll()};

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        height: 36px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.10);

                        div {
                            text-align: left;
                            padding: 0 8px;
                            border-right: 1px solid rgba(255, 255, 255, 0.10);
                            height: 36px;
                            line-height: 36px;
                            ${({ theme }) => theme.mixins.textEllipsis()};

                            &:nth-child(1), 
                            &:nth-child(7) {
                                text-align: center;
                            }

                            .binIcon {
                                position: relative;
                                top: -2px;

                                &:hover > img {
                                    filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .sopTree {

        & * {
            font-size: 12px;
            letter-spacing: -0.36px;
            color: ${({ theme }) => theme.colors.grayscale.g200};
        }
        
        > li {

            div {
                height: 38px;
                line-height: 37px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.10);
                cursor: pointer;

                &:hover, &.sensorTxt.on {
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                    color: ${({ theme }) => theme.colors.white};
                    font-weight: 500;
                    
                    h2 {
                        color: ${({ theme }) => theme.colors.white};
                    }
                }

                &.depth1, &.sensorTxt {
                    padding: 0 10px;
                }

                &.depth2 {
                    padding: 0 10px 0 16px;
                }

                &.depth3 {
                    padding: 0 15px 0 30px;

                    &.selected {
                        background-color: ${({ theme }) => theme.colors.primary.p500};
                        ${({ theme }) => theme.mixins.flex()};

                        h2 {
                            color: ${({ theme }) => theme.colors.white};
                            font-weight: 500;
                        }
                    }

                    h2:before {
                        content: '-';
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        position: relative;
                        top: 0;
                        margin-right: 0;
                        background: none;
                    }
                }

                h2:before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background: url(${treeArrow}) no-repeat center center;
                    position: relative;
                    top: 5px;
                    margin-right: 3px;
                    transition: transform .35s;
                }

                &.on {

                    h2:before {
                        content: '';
                        transform: rotate(90deg);
                        transition: transform .35s;
                    }
                }
            }

            ul {
                display: none;

                &.on {
                    display: block;
                }
            }
        }
    }
`;


/**********************************************************************/
// 초기상황 전파관리

export const SpreadCommon = styled.div`

    .searchWrap {
        padding: 16px 0;
    }

    #tooltip {
        display: inline-block;
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
        top: 50%;
        left: 22px;
        transform: translate(0, -50%);
        padding: 4px 8px;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.grayscale.g700};
        font-size: 0.75rem;
        content: attr(data-tooltip);
        text-align: left;
        line-height: 170%;
        letter-spacing: -0.36px;
        width: 280px;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-right: 5px solid ${({ theme }) => theme.colors.white};
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        left: 18px;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }
`;

export const SpreadComponent = styled(LayoutSettingComponent)`
    width: 860px;
    height: 670px;
    background: #1B212C;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);

    > div {
        width: 852px;
        height: 662px;
    }

    .titleWrap {
        ${({ theme }) => theme.mixins.flex()};
        margin-bottom: 24px;

        h2 {
            font-size: 16px;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    .menuWrap {
        margin-bottom: 8px;
    }
`;


export const SpreadListComponent = styled(SpreadCommon)`
    .listWrap {
        font-size: 14px;
        border-radius: 4px;
        overflow: hidden;

        .initSitMgrList {
            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 6%;
                }

                &:nth-of-type(2) {
                    width: 14%;
                }
                
                &:nth-of-type(3) {
                    width: 22%;
                }
                
                &:nth-of-type(4) {
                    width: 22%;
                }
                
                &:nth-of-type(5) {
                    width: 22%;
                }
                
                &:nth-of-type(6) {
                    width: 14%;
                }
            }

            .head {
                background: rgba(255, 255, 255, 0.10);
                ${({ theme }) => theme.mixins.flex()};

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid rgba(255, 255, 255, 0.10);
                    }

                    padding: 10px 0;
                    text-align: center;
                    font-weight: 500;
                }
            }

            .body {
                background-color: rgba(255, 255, 255, 0.05);
                height: 344px;

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        border-bottom: 1px solid rgba(255, 255, 255, 0.10);
                        cursor: pointer;

                        &.selected {
                            background: ${({ theme }) => theme.colors.primary.p500};
                        }

                        div {
                            padding: 0 12px;
                            text-align: center;
                            height: 34px;
                            line-height: 34px;
                            ${({ theme }) => theme.mixins.textEllipsis()};

                            &:not(:last-child) {
                                border-right: 1px solid rgba(255, 255, 255, 0.10);
                            }

                            &.yes, &.no {
                                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
                            }
                        }
                    }
                }
            }
        }
    }
`;


export const UpdateSpreadComponent = styled(SpreadCommon)`
    width: 500px;
    height: 800px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    padding: 40px;
    user-select: none;
    border-radius: 8px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);
    overflow: hidden;

    header {
        ${({ theme }) => theme.mixins.flex()};
        margin-bottom: 24px;
        
        h2 {
            font-size: 20px;
            font-weight: 500;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
        }

        > div {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
        }
    }

    section {

        > ul {

            > li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 12px 8px;

                &:not(:last-child) {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                }

                > div {
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;

                    &:nth-child(1) {
                        width: 120px;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }

                    &:nth-child(2):not(#tooltip) {
                        flex: auto;
                        position: relative;

                        .yes, .no {
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
                        }

                        .errorMsg{
                            height: 31px;
                            position: absolute;
                            top: 35px;

                            p {
                                font-size: 10px;
                                color: ${({ theme }) => theme.colors.error.error500};
                                border: 0;
                                padding: 0;
                            }
                        } 
                    }
                }

                &.spreadMembersWrap {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;

                    .head {
                        ${({ theme }) => theme.mixins.flex()};
                        width: 100%;

                        > div {
                            color: ${({ theme }) => theme.colors.grayscale.g100};

                            span {
                                margin-left: 4px;
                                color: ${({ theme }) => theme.colors.primary.p400};
                            }
                        }
                    }

                    .spreadMembersCont {
                        width: 100% !important;
                        height: 176px;
                        border-radius: 8px;
                        padding: 12px;
                        overflow-x: hidden;
                        overflow-y: auto;
                        ${({ theme }) => theme.mixins.scroll()};

                        background: ${({ $isEditMode }) => 
                            $isEditMode ? '#121721' : 'transparent'
                        };

                        border: 1px solid ${({ $isEditMode, theme }) => 
                            $isEditMode ? theme.colors.grayscale.g500 : theme.colors.grayscale.g800
                        };

                        > div {
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        }

                        > div:not(:last-child) {
                            margin-bottom: 8px;
                        }

                        span {
                            display: inline-block;
                            color: ${({ theme }) => theme.colors.white};
                            ${({ theme }) => theme.mixins.textEllipsis()};

                            &.line {
                                content: '';
                                width: 1px;
                                height: 12px;
                                display: inline-block;
                                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                                margin: 0 12px;
                            }

                            &:nth-child(1) {
                                width: 26px;
                                margin-right: 12px;
                            }

                            &:nth-child(2) {
                                width: 75px;
                            }

                            &:nth-child(4) {
                                width: 100px;
                            }
                        }
                    }
                }
            }
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #2A3344;
        padding: 12px 32px;
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '40px')};
    }
`;


export const AddSpreadComponent = styled(SpreadCommon)`
    margin-top: 24px;

    .infoWrap {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 6px;
        border-radius: 8px;

        p {
            font-size: 14px;
            font-style: normal;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g50};

            &:nth-child(1) {
                font-weight: 500;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }
        }
    }

    .formWrap {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        > div {
            ${({ theme }) => theme.mixins.flex()};

            label {
                gap: 2px;
                flex: 1;
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g200};

                > span {
                    color: ${({ theme }) => theme.colors.error.error400};
                }
            }

            textarea,
            > div {
                width: 644px;
            }

            .targetWrap {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};

                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g20};

                > p {
                    color: ${({ theme }) => theme.colors.grayscale.g300};
                }
            }
        }
    }
    
    .btnWrap {
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
    }
`;