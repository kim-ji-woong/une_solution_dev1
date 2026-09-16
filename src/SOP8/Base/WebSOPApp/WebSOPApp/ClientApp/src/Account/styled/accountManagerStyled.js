import styled from 'styled-components';

import popup_background from '../../Settings/images/popup_background.png';
import searchIcon from '../images/searchIcon.svg';
import paging_first from '../../Common/images/paging_first.svg';
import paging_prev from '../../Common/images/paging_prev.svg';
import paging_next from '../../Common/images/paging_next.svg';
import paging_last from '../../Common/images/paging_last.svg';
import sortIcon from '../../Settings/images/sortIcon.svg';
import select_arrow from '../../Common/images/select_arrow.png';


/**********************************************************************/
// 공통 css
export const AccountCommon = styled.div`
    user-select: none;

    & * {
        font-size: 0.875rem;
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
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.75rem;
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
            background: ${({ theme }) => theme.colors.primary} url(${searchIcon}) no-repeat center center;
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
                ${({ theme }) => theme.mixins.flex()};

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid ${({ theme }) => theme.colors.background.surface};
                    }

                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    font-weight: 500;

                    .sort {
                        height: 34px;
                        ${({ theme }) => theme.mixins.flex('center', 'center')};
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
                background-color: ${({ theme }) => theme.colors.background.surface};
                height: 476px;
                overflow: hidden;

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        height: 34px;
                        border-bottom: 1px solid #222a38;
                        cursor: pointer;

                        &.selectUser {
                            background: ${({ theme }) => theme.colors.primary};
                        }

                        div {
                            text-align: center;
                            height: 38px;
                            line-height: 38px;

                            &:not(:last-child) {
                                border-right: 1px solid #222a38;
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

    .pagenation {
        text-align: center;
        margin-top: 24px;

        button {
            width: 30px;
            height: 30px;
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.875rem;
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
            color: ${({ theme }) => theme.colors.text.inverse};
            background-color: ${({ theme }) => theme.colors.primary};
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
            font-size: 0.875rem;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.text.inverse};
        }
    }
`;


/**********************************************************************/
// 계정 및 권한관리
export const AccountManagerComponent = styled.div`
    width: 1060px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: url(${popup_background}) no-repeat;
    padding: 40px;
    user-select: none;

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
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
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
                font-size: 0.875rem;
                font-weight: 500;
                width: 60px;
                padding: 10px 0;
                text-align: center;
                border-bottom: 3px solid #384355;
                cursor: pointer;

                &.on {
                    color: ${({ theme }) => theme.colors.primary};
                    border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
                }
            }
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
    background: ${({ theme }) => theme.colors.background.surface};
    padding: 40px;
    user-select: none;

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
        background-color: ${({ theme }) => theme.colors.text.primary};
        color: ${({ theme }) => theme.colors.text.inverse};
        font-size: 0.75rem;
        font-weight: 500;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-left: 5px solid ${({ theme }) => theme.colors.text.primary};
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

    header {
        
        h2 {
            font-weight: 700;
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
                border: 1px solid #384355;
                margin-left: 5px;

                &:nth-child(1).on {
                    background-color: ${({ theme }) => theme.colors.primary};
                    color: ${({ theme }) => theme.colors.text.inverse};
                }
            }
        }

        ul {

            li {

                ${({ theme }) => theme.mixins.flex()};
                margin-bottom: 25px;

                div {

                    &:nth-child(1) {

                        span {
                            color: ${({ theme }) => theme.colors.state.error};
                            margin-left: 3px;
                        }
                    }

                    &:nth-child(2):not(#tooltip) {
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
                            border: 1px solid ${({ theme }) => theme.colors.primary};

                            &.error {
                                border: 1px solid ${({ theme }) => theme.colors.state.error};
                            }
                        }

                        option {
                            background-color: ${({ theme }) => theme.colors.background.surface};
                            font-size: 14px !important;
                        }

                        textarea {
                            border-radius: 2px;
                            border: 1px solid #384355;
                            width: 254px;
                            height: 120px;
                            padding: 8px 10px;
                            background-color: transparent;
                            color: ${({ theme }) => theme.colors.text.primary};
                        }

                        #tooltip {
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
                                font-size: 0.625rem;
                                color: ${({ theme }) => theme.colors.state.error};
                                border: 0;
                                padding: 0;
                            }
                        } 

                        .edit {
                            border: 1px solid ${({ theme }) => theme.colors.primary};
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
            font-size: 0.875rem;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.text.inverse};
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
                font-size: 0.75rem;
                background-color: ${({ theme }) => theme.colors.background.base};
                padding: 7px 10px;
                border-radius: 2px;
            }
        }
    }

    .body > ul > li > div {

        input, select {
            width: 180px;
            height: 22px;
            border: 1px solid ${({ theme }) => theme.colors.primary};
            border-radius: 0;
            text-align: center;
        }

        select {
            background: transparent url(${select_arrow}) 99% 49% no-repeat;
            font-size: 0.875rem !important;
            line-height: 17px;

            option {
                background-color: ${({ theme }) => theme.colors.background.surface};
                font-size: 0.875rem !important;
            }
        }
    }

    .infoWrap {
        width: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
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
                font-size: 0.75rem;

                &::before {
                    content: '';
                    display: inline-block;
                    margin: 0 7px;
                    width: 3px;
                    height: 3px;
                    border-radius: 3px;
                    background-color: ${({ theme }) => theme.colors.background.light};
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
    background: ${({ theme }) => theme.colors.background.surface};
    padding: 40px;

    header {
        
        h2 {
            font-size: 1rem;
            font-weight: 700;
        }
    }

    section {
        padding: 22px 0;

        .listWrap {
            height: auto;

            & * {
                font-size: 0.75rem;
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
                        width: 10%;
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
                    
                    &:nth-of-type(9) {
                        width: 10%;
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
                    overflow-y: auto;
                    overflow-x: hidden;
                    ${({ theme }) => theme.mixins.scroll()};

                    ul {
                        li {
                            background-color: ${({ theme }) => theme.colors.background.base};
                            border-bottom: 1px solid ${({ theme }) => theme.colors.background.surface};
                            cursor: default;
                            
                            > div {
                                ${({ theme }) => theme.mixins.textEllipsis()};
                                padding: 0 2px 0 4px;

                                &:nth-of-type(9) {
                                    color: ${({ theme }) => theme.colors.primary};
                                }
                            }

                            &.disable {
                                > div {
                                    color: #565B69;
                                }
                            }
                        }
                    }

                    > div {
                        text-align: center;
                        background-color: ${({ theme }) => theme.colors.background.base};

                        p {
                            color: ${({ theme }) => theme.colors.primary};
                            font-size: 0.75rem;
                            font-weight: 500;
                            padding: 30px 0;
                        }
                    }
                }
            }
        }
    }
`;
