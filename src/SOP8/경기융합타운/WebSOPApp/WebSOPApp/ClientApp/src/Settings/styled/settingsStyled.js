import styled from 'styled-components';

import popup_background from '../images/popup_background.png';
import treeArrow from '../images/treeArrow.svg';
import sortIcon from '../images/sortIcon.svg';
import tooltip_icon from '../images/tooltip-icon.png';


/**********************************************************************/
// 환경설정

export const LayoutSettingComponent = styled.div`
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${(props) => props.theme.background};
    padding: 40px;
    ${(props) => props.theme.userSelect()};
    border-radius: 5px;

    &::before {
        content: '';
        display: block;
        width: 1050px;
        height: 744px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        border-radius: 3px;
        background: rgba(13, 18, 26, 0.01);
        box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.07) inset;
    }

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .menuWrap {

        h2 {
            font-weight: 700;
            margin-bottom: 10px;
        }

        ul {
            ${(props) => props.theme.flex('flex-start', 'center')};
            position: relative;

            &::before {
                content: '';
                width: calc(100% - 180px);
                height: 1px;
                background-color: #29313E;
                position: absolute;
                top: 35px;
                right: 0;
            }

            li {
                color: #384355;
                font-size: 14px;
                font-weight: 500;
                width: 60px;
                padding: 10px 0;
                text-align: center;
                border-bottom: 3px solid #384355;
                cursor: pointer;

                &.on {
                    color: ${(props) => props.theme.primary};
                    border-bottom: 3px solid ${(props) => props.theme.primary};
                }
            }
        }
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
            border-radius: 5px;
            border: 1px solid #57698A;
        }

        .submit {
            border-radius: 5px;
            background: linear-gradient(180deg, #5398FF 0%, #005FEC 100%);
        }
    }
`;


/**********************************************************************/
// 환경설정 공통 CSS
export const SettingCommon = styled.div`
    padding: 20px 0;

    #tooltip {
        cursor: help;
    }
    
    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after,
    [data-tooltip] ul {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        top: 50%;
        right: 170%;
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
        border-left: 5px solid ${(props) => props.theme.fontPrimary};
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        right: 140%;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover::after,
    [data-tooltip]:hover ul {
        visibility: visible;
        opacity: 1;
    }

    .contents {

        & * {
            font-size: 14px;
            z-index: 2;
        }

        .item {
            ${(props) => props.theme.flex()};
            width: 100%;
            height: 58px;
            background-color: #272E42;
            padding: 0 20px;
            margin-bottom: 1px;

            &.margin {
                margin-top: 20px;
            }

            > div {
                ${(props) => props.theme.flex('flex-start', 'center')};

                > p {
                    margin-right: 20px;
                }

                > div:not(:nth-child(1)) {
                    margin-right: 20px;
                }
            }

            input[type=radio] {
                margin-right: 6px;
            }

            input[type=checkbox] {
                margin-right: 3px;
            }

            label {
                font-size: 12px;
                position: relative;
                top: -1px;
            }

            button {
                font-size: 12px;
                background-color: ${(props) => props.theme.background};
                padding: 7px 10px;
                border-radius: 2px;
            }

            .innerTxt {
                font-size: 12px;
            }


        }
    }


`;


/**********************************************************************/
// 3D 관제

export const Monitoring3DComponent = styled(SettingCommon)`

`;


/**********************************************************************/
// SOP

export const SopSetComponent = styled(SettingCommon)`
    .selectWrap {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .item > div > div {
        display: flex;
        align-items: center;
        gap: 10px;
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
// CCTV

export const CCTVSettingComponent = styled(SettingCommon)`

    span {
        font-size: 12px !important;
    }

    .contents {

        .item {

            &.list {
                height: 400px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 16px;
                padding: 16px 20px;
                position: relative;

                > div {
                    ${(props) => props.theme.flex()};
                    width: 100%;

                    .title {
                        ${(props) => props.theme.flex('flex-start', 'center')};

                        p:nth-child(2) {
                            color: #9397A1;
                            font-size: 12px;
                            margin-left: 11px;
                        }
                    }

                    .server {
                        ${(props) => props.theme.flex('flex-start', 'center')};
                        margin-right: 0;

                        & * {
                            color: #fff;
                        }

                        > div {
                            ${(props) => props.theme.flex('flex-start', 'center')};

                            label {
                                border-radius: 2px 0px 0px 2px;
                                background: #424D69;
                                font-size: 12px;
                                padding: 7px 8px;
                                margin-left: 16px;
                                position: relative;
                                top: 0;
                                cursor: default;
                            }

                            input {
                                width: 230px;
                                height: 26px;
                                background: ${(props) => props.theme.background};
                                border: 0;
                                border-radius: 0px 2px 2px 0px;
                                text-align: center;
                            }
                        }
                    }
                }
            }

            select {
                margin-left: 10px;
            }
        }
    }
`;


/**********************************************************************/
// SOP 환경 - 고급

export const SopLinkComponent = styled.section`
    width: 860px;
    height: 619px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border-radius: 5px;
    background: #272E42;
    padding: 40px;

    .listWrap {
        ${(props) => props.theme.flex()};
        margin-top: 0;
        margin-bottom: 20px;

        h5 {
            font-weight: 700;
        }

        .closeBtn {
            position: absolute;
            top: 40px;
            right: 40px;
        }
    }

    .sopTreeArea {
        ${(props) => props.theme.flex()};
        gap: 10px;
        height: 226px;
        margin-bottom: 20px;
    }

    .sopTreeBox {
        height: 226px;
    }

    .sopLocationBox, .sopTypeBox {
        width: 240px;
        flex: auto;
        display: block;
        background: ${(props) => props.theme.background};
    }

    .sopListBox {
        width: 280px;
    }

    .sopDisableText, .sopDisableTextF {
        display: flex;
        height: 36px;
        background: #1F2536;
        color: ${(props) => props.theme.fontPrimary};
        font-weight: 400;
        font-size: 12px;
        padding: 12px 10px;
    }

    .sopActiveText,
    .sopActiveText span {
        color: ${(props) => props.theme.fontPrimary};
        font-size: 12px;
        font-weight: 500;

        span {
            margin-left: 3px;
        }
    }

    .sopLTree {
        display: block;
        overflow-y: auto;
    }

    .sopScroll {
        height: calc(100% - 36px);
        overflow-x: hidden;
        overflow-y: auto;

        ${(props) => props.theme.scroll()};
    }

    .sopTypeBox {
        display: block;
        background: ${(props) => props.theme.background};
    }

    .sopListBox {
        display: block;
        background: ${(props) => props.theme.background};

        .sFactoryText {
            position: relative;
            top: 2px;

            .toggleIcon {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
        }

        h5 { 
            height: 30px;
        }
    }

    .sopListFlex {
        flex: 1;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 12px;
        font-weight: 500;
    }

    .editIcon {
        display: inline-block;
        width: 12px;
        height: 23px;
        margin-right: 14px;
        cursor: pointer;
    }

    .editIconAct {
        display: inline-block;
        width: 31px;
        height: 31px;
    }

    .sopListArea {
        width: 100%;
        background-color: #1A1F23;
        border-radius: 4px 4px 0 0;
        margin-top: 10px;

        & * {
            font-size: 12px;
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
                height: 160px;

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

    .sopTree {

        & * {
            font-size: 12px;
        }
        
        > li {

            div {
                height: 38px;
                line-height: 37px;
                border-bottom: 1px solid #1B212C;
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
`;