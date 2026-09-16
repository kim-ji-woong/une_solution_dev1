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
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: url(${popup_background}) no-repeat;
    padding: 40px;
    border-radius: 8px;
    ${(props) => props.theme.userSelect()};

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
                width: ${(props) => props.$isSopPage ? `calc(100% - 60px)` : `calc(100% - 120px)`};
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
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
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
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .contents {

        & * {
            font-size: 14px;
        }

        .item {
            ${(props) => props.theme.flex()};
            width: 100%;
            height: 58px;
            background-color: #1B212C;
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
                background-color: #0D121A;
                padding: 7px 10px;
                border-radius: 2px;

                &:hover {
                    background-color: ${(props) => props.theme.primary};
                }
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
// SOP 환경 - 고급

export const SopLinkComponent = styled.section`
    width: 860px;
    height: 619px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background-color: #1B212C;
    padding: 40px;
    border-radius: 4px;

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
        background: #0D121A;
    }

    .sopListBox {
        width: 280px;
    }

    .sopDisableText, .sopDisableTextF {
        display: flex;
        height: 36px;
        background: #2A3344;
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
                background-color: #0D121A;
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
                            ${(props) => props.theme.overText()};

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

                    &.selected {
                        background-color: ${(props) => props.theme.primary};
                        ${(props) => props.theme.flex()};

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
    border-radius: 4px;
    
    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin: 10px 0;

        input {
            display: block;
            width: 355px;
            height: 30px !important;
            background: none;
            color: #fff;
            font-size: 12px;
            border-radius: 2px 0 0 2px;
            border: 1px solid #384355;
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
            background: ${(props) => props.theme.primary} url(${searchIcon}) no-repeat center center;
            border-radius: 0 2px 2px 0;
            border: 1px solid #384355; 
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
`;

export const SpreadComponent = styled(SpreadCommon)`
    width: 860px;
    height: 619px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${(props) => props.theme.sopBoxBackground};
    padding: 40px;
    border-radius: 4px;
    ${(props) => props.theme.userSelect()};

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
                width: calc(100% - 120px);
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
`;


export const SpreadListComponent = styled(SpreadCommon)`
    .listWrap {
        font-size: 14px;

        .initSitMgrList {
            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 5%;
                }

                &:nth-of-type(2) {
                    width: 11%;
                }
                
                &:nth-of-type(3) {
                    width: 24%;
                }
                
                &:nth-of-type(4) {
                    width: 24%;
                }
                
                &:nth-of-type(5) {
                    width: 24%;
                }
                
                &:nth-of-type(6) {
                    width: 12%;
                }
            }

            .head {
                background: #2A3344;
                ${(props) => props.theme.flex()};

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid #1B212C;
                    }

                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    font-weight: 500;
                }
            }

            .body {
                background-color: #0D121A;
                height: 340px;
                overflow: hidden;

                ul {

                    li {
                        ${(props) => props.theme.flex()};
                        height: 34px;
                        border-bottom: 1px solid #222a38;
                        cursor: pointer;

                        &:hover {
                            background-color: ${(props) => props.theme.primary};
                        }

                        &.selected {
                            background: ${(props) => props.theme.primary};
                        }

                        div {
                            text-align: center;
                            height: 38px;
                            line-height: 38px;
                            padding: 0 10px;
                            ${(props) => props.theme.overText()};

                            &:not(:last-child) {
                                border-right: 1px solid #222a38;
                            }

                            &.yes, &.no {
                                ${(props) => props.theme.flex('center', 'center')};
                                gap: 8px;

                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 20px;
                                    height: 20px;
                                }
                            }

                            &.yes {
                                color: #4CAF50;

                                &::before {
                                    background: url(${yesIcon}) no-repeat center center;
                                }
                            }
                            
                            &.no {
                                color: ${(props) => props.theme.warning};

                                &::before {
                                    background: url(${noIcon}) no-repeat center center;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;


export const UpdateSpreadComponent = styled(SpreadCommon)`
    width: 560px;
    height: 863px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: #1B212C;
    padding: 40px;
    ${(props) => props.theme.userSelect()};

    header {
        
        h2 {
            font-weight: 700;
        }
    }

    section {

        & * {
            font-size: 14px;
        }

        > div {
            margin: 20px 0;
            text-align: right;

            button {
                font-size: 12px;
                padding: 7px 10px;
                border-radius: 2px;
                border: 1px solid #384355;
                margin-left: 5px;

                &:nth-child(1).on {
                    background-color: ${(props) => props.theme.primary};
                    color: #000000;
                }
            }
        }

        > ul {

            > li {

                ${(props) => props.theme.flex()};
                margin-bottom: 20px;

                > div {

                    &:nth-child(1) {

                        span {
                            color: ${(props) => props.theme.warning};
                            margin-left: 3px;
                        }
                    }

                    &:nth-child(2):not(#tooltip) {
                        width: 344px;
                        position: relative;

                        p, input, select, textarea {
                            border: ${(props) => props.$isEditMode ? `1px solid ${props.theme.primary}` : `1px solid #384355`};
                        }

                        p, select {
                            width: 344px;
                            height: 30px;
                            border-radius: 2px;
                            font-size: 14px !important;
                        }

                        p {
                            padding: 7px 10px;
                        }

                        select {
                            background: ${(props) => props.theme.sopBoxBackground} url(${select_arrow_on}) 98% 49% no-repeat;
                        }

                        option {
                            background-color: #1B212C;
                            font-size: 14px !important;
                        }

                        textarea {
                            border-radius: 2px;
                            width: 344px;
                            height: 80px;
                            padding: 8px 10px;
                            background-color: transparent;
                            color: ${(props) => props.theme.fontPrimary};
                        }

                        .errorMsg{
                            height: 31px;
                            position: absolute;
                            top: 35px;

                            p {
                                font-size: 10px;
                                color: ${(props) => props.theme.error};
                                border: 0;
                                padding: 0;
                            }
                        } 
                    }
                }

                &.spreadMembersWrap {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 20px;

                    > div:first-child {
                        width: 100%;
                        height: 30px;
                        ${(props) => props.theme.flex()};

                        .searchWrap {
                            display: ${(props) => props.$isEditMode ? 'block' : 'none'};

                            input {
                                width: 315px;
                                font-size: 14px;
                                border: 1px solid ${(props) => props.theme.primary};
                            }

                            button {
                                border: 1px solid ${(props) => props.theme.primary};
                            }
                        }
                    }

                    .spreadMembersCont {
                        width: 100% !important;
                        height: 298px;
                        border-radius: 2px;
                        border: 1px solid #384355;
                        padding: 20px;
                        overflow-x: hidden;
                        overflow-y: auto;
                        ${(props) => props.theme.scroll()};

                        > div {
                            ${(props) => props.theme.flex('flex-start', 'center')};
                        }

                        > div:not(:last-child) {
                            margin-bottom: 16px;
                        }

                        span {
                            display: inline-block;
                            color: ${(props) => props.theme.fontPrimary};
                            margin-left: 0px;
                            line-height: 172%;
                            ${(props) => props.theme.overText()};

                            &.line {
                                content: '';
                                width: 1px;
                                height: 12px;
                                display: inline-block;
                                background-color: #384355;
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

                    .spreadMembersSearchWrap {
                        width: 100% !important;
                        ${(props) => props.theme.flex('flex-start', 'flex-start')};
                        flex-direction: column;
                        gap: 10px;

                        > div {
                            width: 100% !important;
                            display: flex;
                            flex-direction: column;

                            > span {
                                font-size: 12px;
                                line-height: 170%;
                                margin-bottom: 4px;
                            }
    
                            > div {
                                width: 100% !important;
                                height: 120px;
                                border-radius: 2px;
                                border: 1px solid ${(props) => props.theme.primary};
    
                                &.spreadMembersList,
                                &.spreadMembersSearch {
                                    overflow-y: auto;
                                    overflow-x: hidden;
                                    ${(props) => props.theme.scroll()};
                                    padding: 20px;

                                    display: flex;
                                    justify-content: flex-start;
                                    flex-direction: column;
                                    gap: 12px;

                                    > div {
                                        ${(props) => props.theme.flex('flex-start', 'center')};
                                        position: relative;
                                    }
    
                                    span {
                                        display: inline-block;
                                        color: ${(props) => props.theme.fontPrimary};
                                        margin-left: 0px;
                                        line-height: 172%;
                                        ${(props) => props.theme.overText()};

                                        &.line {
                                            width: 1px;
                                            height: 12px;
                                            display: inline-block;
                                            background-color: #384355;
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

                                        &:last-child {
                                            position: absolute;
                                            right: 0;

                                            > button {
                                                font-size: 12px;

                                                &.add {
                                                    color: #4CAF50;
                                                }

                                                &.remove {
                                                    color: ${(props) => props.theme.warning};
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
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }
`;


export const AddSpreadComponent = styled(SpreadCommon)`
    margin-top: 20px;

    & * {
        font-size: 14px;
    }

    .infoWrap {
        width: 100%;
        background: #2A3344;
        padding: 15px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 22px;

        p {

            &:nth-child(1) {
                font-weight: 500;
            }

            &:not(:nth-child(1)) {
                font-size: 12px;

                &::before {
                    content: '';
                    display: inline-block;
                    margin: 0 7px;
                    width: 3px;
                    height: 3px;
                    border-radius: 3px;
                    background-color: #fff;
                    position: relative;
                    top: -3px;
                }
            }
        }
    }

    .formWrap {
        display: flex;
        flex-direction: column;
        gap: 20px;

        > div {
            ${(props) => props.theme.flex()};

            label {
                flex: 1;
                font-weight: 500;
                cursor: default;

                > span {
                    color: ${(props) => props.theme.warning};
                }
            }

            input,
            select,
            textarea,
            > div {
                width: 644px;
            }

            > input,
            > select {
                height: 30px;
                border: 1px solid ${(props) => props.theme.primary};
            }
        
            select {
                background: ${(props) => props.theme.sopBoxBackground} url(${select_arrow_on}) 99% 49% no-repeat;
            }

            > div {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 12px;

                button {
                    border-radius: 2px;
                    background: #0D121A;
                    padding: 5px 10px;
                    font-size: 12px;
                    line-height: 15px;
                }
            }

            > textarea {
                height: 100px;
                border: 1px solid ${(props) => props.theme.primary};
                background: ${(props) => props.theme.sopBoxBackground};
                border-radius: 2px;
                padding: 8px 10px;
                color: ${(props) => props.theme.fontPrimary};
                line-height: 17px;
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
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }
`;