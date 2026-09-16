import styled, { css } from 'styled-components';

import popup_background from '../images/popup_background.png';
import treeArrow from '../images/treeArrow.svg';
import sortIcon from '../images/sortIcon.svg';
import yesIcon from '../images/yesIcon.svg';
import noIcon from '../images/noIcon.svg';
import select_arrow_on from '../images/select_arrow.svg';
import searchIcon from '../../Account/images/searchIcon.svg';
import sop_selected from '../images/sop_selected.svg';


// (공통) Tab Menu
const tabMenuStyle = css`
    .menuTypeWrap {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        position: relative;
        margin-bottom: 20px;

        &::before {
            content: '';
            width: calc(100% - 80px);
            height: 1px;
            background-color: ${({ theme }) => theme.colors.grayscale.g700};
            position: absolute;
            top: 49px;
            right: 0;
        }

        li {
            color: ${({ theme }) => theme.colors.grayscale.g700};
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            width: 80px;
            padding: 12px 0;
            text-align: center;
            border-bottom: 3px solid ${({ theme }) => theme.colors.grayscale.g700};
            cursor: pointer;

            &.on {
                color: ${({ theme }) => theme.colors.primary.p500};
                border-bottom: 3px solid ${({ theme }) => theme.colors.primary.p500};
            }
        }
    }
`;


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
    padding: 5px;
    background: #131D24;
    border-radius: 8px;
    user-select: none;
    
    .container {
        position: relative;
        ${({ theme }) => theme.mixins.flex('space-between', 'flex-start')};
        padding: 0;
        border-radius: 4px;
        box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.07) inset;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background: url(${popup_background}) -35.224px 0 / 106.646% 100% no-repeat;
            mix-blend-mode: overlay;
            z-index: 0;
            pointer-events: none;
        }

        & > * {
            position: relative;
            z-index: 1; /* 자식들은 blend 영향 안 받음 */
        }
    }

    .menuWrap {
        width: 240px;
        height: 744px;
        padding: 20px 12px 40px 12px;
        border-radius: 4px 0 0 4px;
        background: rgba(0, 0, 0, 0.20);
        ${({ theme }) => theme.mixins.flex('space-between', 'flex-start', 'column', '20px')};
        flex-shrink: 0;
        position: relative;
        z-index: 1;

        h2 {
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.48px;
            padding: 0 8px;
        }

        ul {
            height: 100%;
            width: 100%;
            position: relative;

            li {
                height: 44px;
                color: ${({ theme }) => theme.colors.grayscale.g300};
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                padding: 0 8px;
                cursor: pointer;
                border-radius: 8px;
                background-color: transparent;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

                > svg {
                    margin: 4px;
                    color: inherit;
                    fill: currentColor;
                }

                &:hover {
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
                }

                &.on {
                    font-weight: 500;
                    color: ${({ theme }) => theme.colors.white};
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
                }

                &:not(.etc) {
                    margin-bottom: 4px;
                }

                &.etc {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            }
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 20px;
        left: 555px;
        display: flex;
        gap: 8px;

        button {
            width: 91px;
            border-radius: 0.25rem !important;
            padding: 0 !important;
        }

        .cancle {
            background-color: transparent !important;
            color: ${({ theme }) => theme.colors.grayscale.g20} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
        }
    }
`;


/**********************************************************************/
// 환경설정 공통 CSS
export const SettingCommon = styled.div`
    width: 100%;
    height: 100%;
    padding: 16px 24px 20px 24px;
    position: relative;
    z-index: 1;

    ${tabMenuStyle}

    #tooltip {
        cursor: help;

        > img {
            filter: invert(46%) sepia(11%) saturate(370%) hue-rotate(183deg) brightness(89%) contrast(91%);
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

        & * {
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
        }

        .item {
            ${({ theme }) => theme.mixins.flex()};
            width: 100%;
            height: 52px;
            border-radius: 8px;
            background: #1F292F;
            padding: 0 20px;
            margin-bottom: 1px;

            &.margin {
                margin-top: 20px;
            }

            &.first {
                border-radius: 8px 8px 0 0;
            }

            &.center {
                border-radius: 0;
            }

            &.last {
                border-radius: 0 0 8px 8px;
            }

            .hidden {
                display: none;
            }

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                > p {
                    min-width: 200px;
                    padding: 8px;
                    font-weight: 500;
                    margin-right: 16px;
                }

                > div:not(:nth-child(1)) {
                    margin-right: 20px;
                }
            }

            &.receiveItems {
                height: auto !important;
                white-space: nowrap;

                > div {
                    > div {
                        padding: 20px 0;
                    }
                }

                .receiveItem {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};

                    &:not(:last-child) {
                        margin-bottom: 4px;
                    }

                    > div {
                        min-width: 100px;
                    }
                }
            }

            label {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
            }

            button {
                font-size: 0.75rem;
                line-height: 170%;
                letter-spacing: -0.36px;
                background-color: #0D121A;
                padding: 4px 20px;
                border-radius: 4px;
                margin-right: 8px;
            }

            .innerTxt {
                font-size: 0.75rem;
            }
        }
    }
`;


/**********************************************************************/
// 3D 관제

export const Monitoring3DComponent = styled(SettingCommon)`
    select {
        width: 360px;
        height: 32px;
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
        border-radius: 8px;
        padding: 0 20px;
        background: ${({ theme }) => theme.colors.background.base} url(${select_arrow_on}) 97% 50% no-repeat;
    }
`;


/**********************************************************************/
// SOP

export const SopSetComponent = styled(SettingCommon)`
    .selectWrap {
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }

    .item > div > div {
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }
`;


/**********************************************************************/
// 사용자 옵션

export const UserOptionComponent = styled(SettingCommon)`
    .menuTypeWrap {
        &::before {
            content: '';
            width: calc(100% - 80px);
        }
    }

    .item {
        ul {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};
        }

        input[type="text"] {
            width: 64px;
            height: 32px;
            padding: 4px 12px;
            border-radius: 4px;
            background: #0D121A;
            border: 0;
        }

        span {
            margin-left: 4px;
        }

        .smallText {
            font-size: 0.75rem;
            line-height: 170%;
            letter-spacing: -0.36px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
            margin-left: 8px;
        }
    }
`;


/**********************************************************************/
// 시스템 정보

export const SettingEtcComponent = styled(SettingCommon)`
    .menuTypeWrap {
        &::before {
            content: '';
            width: calc(100% - 80px);
        }
    }
`;


/**********************************************************************/
// SOP 환경 - 고급

export const SopLinkComponent = styled.section`
    width: 860px;
    height: 620px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.background.base};
    border-radius: 8px;
    user-select: none;

    .listWrap {
        height: 40px;
        padding: 0 20px;
        background: linear-gradient(180deg, rgba(56, 74, 86, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%);
        ${({ theme }) => theme.mixins.flex()};

        h5 {
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
        }
    }

    .stgList {
        padding: 36px 40px;
    }

    .sopTreeArea {
        ${({ theme }) => theme.mixins.flex()};
        gap: 0.625rem;
        height: 226px;
        margin-bottom: 20px;
    }

    .sopTreeBox {
        height: 226px;
        border-radius: 8px;
        overflow: hidden;
    }

    .sopLocationBox, .sopTypeBox {
        width: 240px;
        flex: auto;
        display: block;
        background: #0D121A;
    }

    .sopListBox {
        width: 280px;
    }

    .sopDisableText, .sopDisableTextF {
        display: flex;
        height: 36px;
        background: #1F292F;
        color: ${({ theme }) => theme.colors.white};
        font-weight: 400;
        font-size: 0.75rem;
        padding: 12px 10px;

        > span {
            width: 100%;
            display: inline-block;
            ${({ theme }) => theme.mixins.textEllipsis()};
        }
    }

    .sopActiveText,
    .sopActiveText span {
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.75rem;
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

        ${({ theme }) => theme.mixins.scroll()};
    }

    .sopTypeBox {
        display: block;
        background: #0D121A;
    }

    .sopListBox {
        display: block;
        background: #0D121A;

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
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.75rem;
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
            font-size: 0.75rem;
        }

        .sopList {
            border-radius: 8px;
            overflow: hidden;

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
                background: #1F292F;
                width: calc(100% - 6px);
                ${({ theme }) => theme.mixins.flex()};

                &::after {
                    content: '';
                    width: 6px;
                    height: 32px;
                    background-color: #1F292F;
                    position: absolute;
                    right: 40px;
                }

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid ${({ theme }) => theme.colors.background.base};
                    }

                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};

                    .sort {
                        ${({ theme }) => theme.mixins.flex()};
                        padding: 0 8px;

                        span {
                            font-size: 0.75rem;
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
                background: #0D121A;
                overflow-y: scroll;
                height: 160px;

                ${({ theme }) => theme.mixins.scroll()};

                .noData {
                    height: 100%;
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '20px')};

                    > div {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        overflow: hidden;
                        background: rgba(255, 255, 255, 0.05);
                        padding: 10px;
                        
                        > img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            object-position: center;
                        }
                    }

                    > p {
                        font-size: 0.875rem;
                        color: ${({ theme }) => theme.colors.grayscale.g20};
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                    }
                }

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        height: 38px;
                        border-bottom: 1px solid ${({ theme }) => theme.colors.background.base};

                        div {
                            text-align: center;
                            border-right: 1px solid ${({ theme }) => theme.colors.background.base};
                            height: 38px;
                            line-height: 38px;

                            > span {
                                width: 100%;
                                display: inline-block;
                                ${({ theme }) => theme.mixins.textEllipsis()};
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
        }
        
        > li {

            div {
                height: 38px;
                line-height: 37px;
                border-bottom: 1px solid #1B212C;
                cursor: pointer;

                &:hover, &.sensorTxt.on {
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                }

                &.depth1, &.sensorTxt {
                    padding: 0 10px;
                }

                &.depth2 {
                    padding: 0 10px 0 15px;
                }

                &.depth3 {
                    padding: 0 10px 0 20px;

                    h2 {
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                    }

                    h2:before {
                        content: '-';
                        width: 18px;
                        height: 18px;
                        top: 0;
                        margin-right: 10px;
                        background: none !important;
                        ${({ theme }) => theme.mixins.flex('center', 'center')};
                    }

                    &.on {
                        background-color: ${({ theme }) => theme.colors.primary.p500};
                    }

                    &.selected {
                        background-color: ${({ theme }) => theme.colors.primary.p500};
                        ${({ theme }) => theme.mixins.flex()};

                        &::after {
                            content: '';
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background: url(${sop_selected}) no-repeat center center;
                        }
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
                    margin-right: 10px;
                    transition: transform .35s;
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

    .btnWrap {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        gap: 8px;

        button {
            width: 91px;
            border-radius: 0.25rem !important;
            padding: 0 !important;
        }

        .cancle {
            background-color: transparent !important;
            color: ${({ theme }) => theme.colors.grayscale.g20} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
        }
    }
`;


/**********************************************************************/
// 초기상황 전파관리

export const SpreadCommon = styled.div`
    ${tabMenuStyle}

    border-radius: 8px;

    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin: 12px 0;

        input {
            display: block;
            width: 410px;
            height: 30px !important;
            background: none;
            color: ${({ theme }) => theme.colors.white};
            font-size: 0.75rem;
            border-radius: 8px 0 0 8px;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
            border-right: 0;
            position: absolute;
            right: 30px;
            top: 0;
            padding: 0;
            padding-left: 10px;
        }

        button {
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            right: 0;
            top: 0;
            text-indent: -9999px;
            background: ${({ theme }) => theme.colors.primary.p500} url(${searchIcon}) no-repeat center center;
            border-radius: 0 4px 4px 0;
            border: 1px solid ${({ theme }) => theme.colors.primary.p500}; 
        }
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
        bottom: 130%;
        left: -50%;
        margin-bottom: 4px;
        padding: 5px 10px;
        white-space: nowrap;
        border-radius: 3px;
        background-color: ${({ theme }) => theme.colors.white};
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
        border-top: 5px solid ${({ theme }) => theme.colors.white};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .yes, .no {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        gap: 8px;

        &::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
        }
    }

    .yes {
        color: ${({ theme }) => theme.colors.state.success};

        &::before {
            background: url(${yesIcon}) no-repeat center center;
        }
    }
    
    .no {
        color: ${({ theme }) => theme.colors.state.error};

        &::before {
            background: url(${noIcon}) no-repeat center center;
        }
    }
`;

export const SpreadComponent = styled(SpreadCommon)`
    width: 860px;
    height: 620px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    user-select: none;

    .titleWrap {
        height: 40px;
        padding: 0 20px;
        background: linear-gradient(180deg, rgba(56, 74, 86, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%);
        ${({ theme }) => theme.mixins.flex()};

        h5 {
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
        }
    }

    .content {
        padding: 16px 40px 20px 40px;

        .menuTypeWrap {
            margin-bottom: 0;
        }
    }
`;


export const SpreadListComponent = styled(SpreadCommon)`
    .listWrap {
        font-size: 0.875rem;

        .initSitMgrList {
            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 5%;
                }

                &:nth-of-type(2) {
                    width: 50%;
                }
                
                &:nth-of-type(3) {
                    width: 15%;
                }
                
                &:nth-of-type(4) {
                    width: 15%;
                }
                
                &:nth-of-type(5) {
                    width: 15%;
                }
            }

            .head {
                border-radius: 8px 8px 0 0;
                background: #1F292F;
                ${({ theme }) => theme.mixins.flex()};

                > div {
                    &:first-child {
                        text-align: center !important;
                    }

                    &:not(:last-child) {
                        border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                    }

                    padding: 0 8px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                    font-size: 0.875rem;
                    letter-spacing: -0.36px;
                    height: 32px;
                    line-height: 32px;
                    text-align: left;
                }
            }

            .body {
                background-color: #0D121A;
                height: 340px;
                overflow: hidden;
                border-radius: 0 0 8px 8px;

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                        cursor: pointer;

                        &:hover {
                            background-color: ${({ theme }) => theme.colors.primary.p500};
                        }

                        &.selected {
                            background: ${({ theme }) => theme.colors.primary.p500};
                        }

                        div {
                            height: 36px;
                            line-height: 36px;
                            padding: 0 8px;
                            ${({ theme }) => theme.mixins.textEllipsis()};
                            text-align: left;
                            font-size: 0.875rem;
                            letter-spacing: -0.36px;

                            &:first-child {
                                text-align: center !important;
                            }

                            &:not(:last-child) {
                                border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                            }
                        }
                    }
                }
            }
        }
    }
`;


export const UpdateSpreadComponent = styled(SpreadCommon)`
    width: 480px;
    height: 880px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    padding: 40px;
    user-select: none;

    header {
        ${({ theme }) => theme.mixins.flex()};
        margin-bottom: 40px;
        
        h2 {
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }

        > div {
            ${({ theme }) => theme.mixins.flex()};
            gap: 12px;
        }
    }

    section {

        & * {
            font-size: 0.875rem;
        }

        > div {
            margin: 20px 0;
            text-align: right;

            button {
                font-size: 0.75rem;
                padding: 7px 10px;
                border-radius: 2px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g300};
                margin-left: 5px;

                &:nth-child(1).on {
                    background-color: ${({ theme }) => theme.colors.primary.p500};
                    color: ${({ theme }) => theme.colors.black};
                }
            }
        }

        > ul {

            > li {

                ${({ theme }) => theme.mixins.flex()};
                margin-bottom: 20px;

                > div {

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g200};

                        span {
                            color: ${({ theme }) => theme.colors.secondary.s400};
                            margin-left: 3px;
                            display: ${(props) => props.$isEditMode ? 'inline-block' : 'none'};
                        }
                    }

                    &:nth-child(2):not(#tooltip) {
                        width: 297px;
                        position: relative;

                        p:not(.active), input, select, textarea {
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        }

                        p, select {
                            width: 297px;
                            height: 32px;
                            border-radius: 8px;
                            font-size: 0.875rem !important;
                        }

                        input {
                            border-radius: 8px;
                        }

                        p {
                            padding: 7px 10px;
                        }

                        select {
                            background: ${({ theme }) => theme.colors.background.base} url(${select_arrow_on}) 95% 50% no-repeat;
                        }

                        option {
                            background-color: ${({ theme }) => theme.colors.background.base};
                            font-size: 0.875rem !important;
                        }

                        textarea {
                            border-radius: 8px;
                            width: 297px;
                            height: 120px;
                            padding: 8px 10px;
                            background-color: transparent;
                            color: ${({ theme }) => theme.colors.white};
                        }

                        .errorMsg{
                            height: 31px;
                            position: absolute;
                            top: 35px;

                            p {
                                font-size: 0.625rem;
                                color: ${({ theme }) => theme.colors.state.error};
                                border: 0;
                                padding: 0;
                            }
                        } 
                    }
                }

                &.spreadMembersWrap {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.25rem;
                    padding-bottom: 40px;
                    margin-bottom: 40px;
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};

                    > div:first-child {
                        width: 100%;
                        height: 30px;
                        ${({ theme }) => theme.mixins.flex()};

                        > div {
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                        }

                        .memberCount {
                            display: inline-block !important;
                            color: ${({ theme }) => theme.colors.primary.p500};
                        }

                        .edit {
                            height: 28px !important;
                            padding: 4px 20px !important;
                            background-color: transparent !important;
                            color: ${({ theme }) => theme.colors.grayscale.g20} !important;
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
                        }

                        .searchWrap {
                            display: ${(props) => props.$isEditMode ? 'block' : 'none'};

                            input {
                                width: 315px;
                                font-size: 0.875rem;
                                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                            }

                            button {
                                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                            }
                        }
                    }

                    .spreadMembersCont {
                        width: 100% !important;
                        height: 176px;
                        border-radius: 8px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        background-color: #1F292F;
                        padding: 12px;
                        overflow-x: hidden;
                        overflow-y: auto;
                        ${({ theme }) => theme.mixins.scroll()};

                        > div {
                            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                        }

                        > div:not(:last-child) {
                            margin-bottom: 8px;
                        }

                        span {
                            display: inline-block;
                            color: ${({ theme }) => theme.colors.grayscale.g20};
                            margin-left: 0px;
                            line-height: 172%;
                            ${({ theme }) => theme.mixins.textEllipsis()};
                            font-size: 0.875rem;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;

                            &.line {
                                content: '';
                                width: 1px;
                                height: 12px;
                                display: inline-block;
                                background-color: ${({ theme }) => theme.colors.grayscale.g300};
                                margin: 0 12px;
                            }

                            &:nth-child(1) {
                                width: 26px;
                                margin-right: 12px;
                            }

                            &:nth-child(2) {
                                width: 51px;
                            }

                            &:nth-child(4) {
                                width: 130px;
                            }

                            &:nth-child(6) {
                                width: 100px;
                            }
                        }
                    }

                    .spreadMembersSearchWrap {
                        width: 100% !important;
                        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start')};
                        flex-direction: column;
                        gap: 0.625rem;

                        > div {
                            width: 100% !important;
                            display: flex;
                            flex-direction: column;

                            > span {
                                font-size: 0.75rem;
                                line-height: 170%;
                                margin-bottom: 4px;
                            }
    
                            > div {
                                width: 100% !important;
                                height: 120px;
                                border-radius: 8px;
                                border: 1px solid ${({ theme }) => theme.colors.primary.p500};
    
                                &.spreadMembersList,
                                &.spreadMembersSearch {
                                    overflow-y: auto;
                                    overflow-x: hidden;
                                    ${({ theme }) => theme.mixins.scroll()};
                                    padding: 1.25rem;

                                    display: flex;
                                    justify-content: flex-start;
                                    flex-direction: column;
                                    gap: 0.75rem;

                                    > div {
                                        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                                        position: relative;
                                    }
    
                                    span {
                                        display: inline-block;
                                        color: ${({ theme }) => theme.colors.white};
                                        margin-left: 0px;
                                        line-height: 172%;
                                        ${({ theme }) => theme.mixins.textEllipsis()};

                                        &.line {
                                            width: 1px;
                                            height: 12px;
                                            display: inline-block;
                                            background-color: ${({ theme }) => theme.colors.grayscale.g300};
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
            }
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        gap: 8px;

        button {
            width: 91px;
            border-radius: 0.25rem !important;
            padding: 0 !important;
        }

        .cancle {
            background-color: transparent !important;
            color: ${({ theme }) => theme.colors.grayscale.g20} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
        }
    }
`;


export const AddSpreadComponent = styled(SpreadCommon)`
    margin-top: 12px;

    & * {
        font-size: 0.875rem;
    }

    .infoWrap {
        width: 100%;
        background: #1F292F;
        padding: 15px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        border-radius: 8px;

        p {

            &:nth-child(1) {
                font-weight: 500;
            }

            &:not(:nth-child(1)) {
                font-size: 0.75rem;

                &::before {
                    content: '';
                    display: inline-block;
                    margin: 0 7px;
                    width: 3px;
                    height: 3px;
                    border-radius: 3px;
                    background-color: ${({ theme }) => theme.colors.white};
                    position: relative;
                    top: -3px;
                }
            }
        }
    }

    .formWrap {
        display: flex;
        flex-direction: column;
        gap: 16px;

        > div {
            ${({ theme }) => theme.mixins.flex()};

            label {
                flex: 1;
                cursor: default;
                color: ${({ theme }) => theme.colors.grayscale.g200};

                > span {
                    color: ${({ theme }) => theme.colors.secondary.s400};
                }

                .memberCount span {
                    color: ${({ theme }) => theme.colors.primary.p500} !important;
                    margin-left: 8px;
                }
            }

            input,
            select,
            textarea,
            > div {
                width: 607px;
            }

            > input,
            > select {
                height: 32px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                border-radius: 8px;
                padding: 0 20px;
            }
        
            select {
                background: transparent url(${select_arrow_on}) 97% 50% no-repeat;
            }

            > div {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                gap: 0.75rem;

                button {
                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                    border-radius: 4px;
                    background: transparent;
                    padding: 4px 20px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }
            }

            > textarea {
                height: 100px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                background: transparent;
                border-radius: 8px;
                padding: 8px 20px;
                color: ${({ theme }) => theme.colors.white};
                line-height: 17px;
            }
        }
    }
    
    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, 0);

        > button {
            border-radius: 0.25rem !important;
        }
    }
`;