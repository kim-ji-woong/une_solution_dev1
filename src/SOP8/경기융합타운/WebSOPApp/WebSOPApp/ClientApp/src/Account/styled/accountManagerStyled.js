import styled from 'styled-components';

import searchIcon from '../images/searchIcon.svg';
import search_off from '../images/search_off.png';
import search_on from '../images/search_on.png';
import update_off from '../images/update_off.png';
import update_on from '../images/update_on.png';
import delete_off from '../images/delete_off.png';
import delete_on from '../images/delete_on.png';
import paging_first from '../../Common/images/paging_first.svg';
import paging_prev from '../../Common/images/paging_prev.svg';
import paging_next from '../../Common/images/paging_next.svg';
import paging_last from '../../Common/images/paging_last.svg';
import sortIcon from '../../Settings/images/sortIcon.svg';
import select_arrow from '../../Common/images/select_arrow.png';


/**********************************************************************/
// 공통 css
export const AccountCommon = styled.div`
    ${(props) => props.theme.userSelect()};

    & * {
        font-size: 14px;
    }
    
    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin-bottom: 10px;

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

    .listWrap {
        .accountList {
            .head > div, 
            .body > ul > li > div {

                &:nth-of-type(1) {
                    width: 5%;
                }

                &:nth-of-type(2) {
                    width: 19%;
                }
                
                &:nth-of-type(3) {
                    width: 19%;
                }
                
                &:nth-of-type(4) {
                    width: 19%;
                }
                
                &:nth-of-type(5) {
                    width: 19%;
                }
                
                &:nth-of-type(6) {
                    width: 19%;
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

                    .sort {
                        height: 34px;
                        ${(props) => props.theme.flex('center', 'center')};
                        gap: 5px;

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
                background-color: #1B212C;
                height: 476px;
                overflow: hidden;

                ul {

                    li {
                        ${(props) => props.theme.flex()};
                        height: 34px;
                        border-bottom: 1px solid #2A3344;
                        cursor: pointer;

                        &.selectUser {
                            background: ${(props) => props.theme.primary};
                        }

                        div {
                            text-align: center;
                            height: 38px;
                            line-height: 38px;

                            &:not(:last-child) {
                                border-right: 1px solid #2A3344;
                            }

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

    .pagenation {
        text-align: center;
        margin-top: 24px;

        button {
            width: 30px;
            height: 30px;
            color: ${(props) => props.theme.fontPrimary};
            font-size: 14px;
            font-weight: 600;
            margin: 0 2.5px;
            border-radius: 2px;
            border: 1px solid #29313E;

            &.first {
                background: url(${paging_first}) no-repeat center center;
            }

            &.prev {
                background: url(${paging_prev}) no-repeat center center;
            }

            &.next {
                background: url(${paging_next}) no-repeat center center;
            }

            &.last {
                background: url(${paging_last}) no-repeat center center;
            }

            &.firstDisable {
                background: url(${paging_first}) no-repeat center center;
            }

            &.prevDisable {
                background: url(${paging_prev}) no-repeat center center;
            }

            &.nextDisable {
                background: url(${paging_next}) no-repeat center center;
            }

            &.lastDisable {
                background: url(${paging_last}) no-repeat center center;
            }
        }

        > button {
            text-indent: -9999px;
        }

        ul {
            display: inline-block;
            vertical-align: middle;
        }

        ul li {
            display: inline-block;
            vertical-align: middle;
        }

        ul li.on button {
            color: #000;
            background-color: ${(props) => props.theme.primary};
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
// 계정 및 권한관리
export const AccountManagerComponent = styled.div`
    height: 823px;
    top: 52%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    ${(props) => props.theme.userSelect()};
    
    .popupBox {
        position: relative;
        width: 1434px;
        height: 823px;
        background: rgba(14, 22, 45, 1);
        border: 1px solid #FFFFFF1A;
        border-radius: 6px;
        padding: 60px 20px 20px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .popupboxLine {
        background-color: rgba(255, 255, 255, 0.1);
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px 5px 0 0;
    }

    .popupBoxTitle {
        font-size: 16px;
        color: ${(props) => props.theme.primary};
        font-weight: 600;
        margin-bottom: 15px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        left: 20px;
    }

    .popupBoxX {
        position: absolute;
        right: 20px;
        top: 11px;
        cursor: pointer;
    }
    
    .popupBoxX img {
        width: 16px;
    }

    .popupContent {
        height: calc(100% - 36px);
        
        .menuWrap {
            width: 100%;
            border-bottom: 1px solid #A5A5A5;

            p {
                color: #fff;
                font-size: 14px;
                width: 60px;
                padding: 0 15px 7px 15px;
                border-bottom: 3px solid ${(props) => props.theme.primary};
                text-align: center;
                position: relative;
                bottom: -2px;
            }
        }

        .searchWrap {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
            margin-right: 2px;

            input {
                width: 297px;
                height: 27px;
                background: rgba(255, 255, 255, .1);
                border-radius: 4px;
                color: #fff;
                font-size: 12px;
                padding-left: 10px;
                border: 0;
            }

            a {
                display: block;
                width: 27px;
                height: 27px;
                text-indent: -9999px;
                border-radius: 2px;
                cursor: pointer;

                &:nth-child(2) {
                    background: url(${search_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: url(${search_on}) no-repeat center center, rgba(83, 152, 255, .3);
                    }
                }

                &:nth-child(3) {
                    background: url(${update_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: url(${update_on}) no-repeat center center, rgba(83, 152, 255, .3);
                    }
                }

                &:nth-child(4) {
                    background: url(${delete_off}) no-repeat center center, rgba(204, 204, 204, .3);

                    &:hover {
                        background: url(${delete_on}) no-repeat center center, rgba(83, 152, 255, .3);
                    }
                }
            }
        }

        .userList {
            height: calc(100% - 128px);
            position: relative;

            overflow-x: hidden;
            overflow-y: auto !important;
    
            table {
                text-align: center;
                font-size: 12px;
    
                thead {
                    height: 31px !important;
                    line-height: 31px;
                    color: #A5A5A5;
                    background-color: #272E42;
    
                    tr {
                        td {
                            height: 31px !important;
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }

                            &.userId {
                                position: relative;
                            }

                            div {
                                display: inline-block;
                                position: absolute;
                                right: 5px;
                                top: 7px;
                                cursor: pointer;
                                line-height: 0;

                                &:hover {
                                    p {
                                        display: block;
                                    }
                                }
                                
                                p {
                                    display: none;
                                    position: absolute;
                                    transform: translate(-50%, 40%);
                                    width: 347px;
                                    height: 22px;
                                    line-height: 23px;
                                    background: #000000;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    color: #fff;

                                    &::before {
                                        content: '';
                                        display: block;
                                        width: 11px;
                                        height: 10px;
                                        clip-path: polygon(50% 29%, 0% 100%, 100% 100%);
                                        background-color: #000000;
                                        position: absolute;
                                        top: -9px;
                                        left: 176px;
                                    }
                                }

                            }

                        }
                    }
                    
                }
    
                tbody {
                    color: #fff;
    
                    tr {
                        height: 41px;
                        line-height: 41px;
                        border-bottom: 1px dashed #525868;

                        &:hover {
                            background-color: rgba(112, 112, 112, .1);
                        }
    
                        td {
    
                            &:not(:last-child){
                                border-right: 1px dashed #525868;
                            }
                        }
                    }

                    tr.on {
                        background: rgba(112, 112, 112, .1);
                        color: #fff;
                    }

                    input[type="text"] {
                        width: 127px;
                        height: 26px;
                        background: transparent;
                        border: 1px solid #CCCCCC;
                        color: #fff;
                        text-align: center;
                    }

                    select {
                        width: 104px;
                        height: 26px;
                        line-height: 24px;
                        border: 1px solid #CCCCCC;
                        border-radius: 0;
                        color: #fff;
                        font-size: 12px;
                        text-align: center;
                        cursor: pointer;
                        background:transparent url(${select_arrow}) 95% 49% no-repeat;
                    }

                    option {
                        color: #000000;
                    }
                }
            }
        }

        .buttonWrap {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 9px;
            width: 100%;
            position: absolute;
            bottom: 0;

            li {
                width: 96px;
                height: 35px;
                border-radius: 4px;
                line-height: 35px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;

                &.cancelBtn {
                    background-color: ${(props) => props.theme.background};
                    color: #A5A5A5;
                }

                &.saveBtn {
                    background-color: ${(props) => props.theme.primary};
                    color: #fff;
                }
            }
        }
        
        .userList + .buttonWrap {
            bottom: 24px;
            left: 0;
        }
    }
`;


/**********************************************************************/
// 목록
export const AccountListComponent = styled(AccountCommon)`
    margin-top: 10px;
`;


/**********************************************************************/
// 목록 - 사용자 선택 팝업
export const AccountUpdateUserComponent = styled.div`
    width: 450px;
    height: 680px;
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

        ul {

            li {

                ${(props) => props.theme.flex()};
                margin-bottom: 25px;

                div {

                    &:nth-child(1) {

                        span {
                            color: ${(props) => props.theme.warning};
                            margin-left: 3px;
                        }
                    }

                    &:nth-child(2) {
                        width: 254px;
                        position: relative;

                        p, select {
                            width: 254px;
                            height: 30px;
                            border: 1px solid #384355;
                            border-radius: 2px;
                            padding: 7px 10px;
                        }

                        select {
                            line-height: 13px;
                            font-size: 14px !important;
                            background: transparent url(${select_arrow}) 89% 50% no-repeat;
                            border: 1px solid ${(props) => props.theme.primary};

                            &.error {
                                border: 1px solid ${(props) => props.theme.error};
                            }
                        }

                        option {
                            background-color: #1B212C;
                            font-size: 14px !important;
                        }

                        textarea {
                            border-radius: 2px;
                            border: 1px solid #384355;
                            width: 254px;
                            height: 120px;
                            padding: 8px 10px;
                            background-color: transparent;
                            color: ${(props) => props.theme.fontPrimary};
                        }

                        img {
                            position: absolute;
                            top: 7px;
                            right: 5px;
                            cursor: help;
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

                        .edit {
                            border: 1px solid ${(props) => props.theme.primary};
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


/**********************************************************************/
// 신규등록
export const AccountAddUserComponent = styled(AccountCommon)`
    margin-top: 20px;

    .head > div,
    .body > ul > li > div {
        width: 20% !important;
    }

    .body {
        height: auto !important;

        ul > li {
            cursor: default !important;
        }

        > div {
            text-align: center;
            margin: 22px 0;

            button {
                font-size: 12px;
                background-color: ${(props) => props.theme.background};
                padding: 7px 10px;
                border-radius: 2px;
            }
        }
    }

    .body > ul > li > div {

        input, select {
            width: 178px;
            height: 20px;
            border: 1px solid ${(props) => props.theme.primary};
            border-radius: 0;
            text-align: center;
        }

        select {
            background: transparent url(${select_arrow}) 99% 49% no-repeat;
            font-size: 14px !important;
            line-height: 17px;

            option {
                background-color: #1B212C;
                font-size: 14px !important;
            }
        }
    }

    .infoWrap {
        width: 100%;
        background: #1B212C;
        padding: 15px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;

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
`;


/**********************************************************************/
// 신규등록 - 조직정보 불러오기 팝업
export const AccountFindMemberComponent = styled(AccountCommon)`
    width: 980px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: #1B212C;
    padding: 40px;

    header {
        
        h2 {
            font-size: 16px;
            font-weight: 700;
        }
    }

    section {
        padding: 22px 0;

        .listWrap {
            height: auto;

            & * {
                font-size: 12px;
            }

            .accountList {
                .head > div, 
                .body > ul > li > div {

                    &:nth-of-type(1) {
                        width: 5%;
                    }

                    &:nth-of-type(2) {
                        width: 5%;
                    }
                    
                    &:nth-of-type(3) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(4) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(5) {
                        width: 10%;
                    }
                    
                    &:nth-of-type(6) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(7) {
                        width: 15%;
                    }
                    
                    &:nth-of-type(8) {
                        width: 15%;
                    }
                }

                .head {
                    width: ${(props) => props.$rowLength > 6 ? `calc(100% - 6px)` : `100%`};
                    font-weight: 500;

                    &::after {
                        content: '';
                        display: ${(props) => props.$rowLength > 6 ? 'inline-block' : 'none'};
                        width: 6px;
                        height: 34px;
                        background-color: #2A3344;
                        position: absolute;
                        right: 40px;
                    }
                }

                .body {
                    height: 206px;
                    overflow: auto;
                    ${(props) => props.theme.scroll()};

                    ul {

                        li {
                            background-color: ${(props) => props.theme.background};
                            border-bottom: 1px solid #1B212C;
                            cursor: default;
                        }
                    }

                    > div {
                        text-align: center;
                        background-color: ${(props) => props.theme.background};

                        p {
                            color: ${(props) => props.theme.primary};
                            font-size: 12px;
                            font-weight: 500;
                            padding: 30px 0;
                        }
                    }
                }
            }
        }
    }
`;
