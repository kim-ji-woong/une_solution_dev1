import styled from 'styled-components';

import popup_background from '../../Settings/images/popup_background.png';
import searchIcon from '../images/searchIcon.svg';
import paging_first from '../../Common/images/paging_first.svg';
import paging_prev from '../../Common/images/paging_prev.svg';
import paging_next from '../../Common/images/paging_next.svg';
import paging_last from '../../Common/images/paging_last.svg';
import sortIcon from '../../Settings/images/sortIcon.svg';
import select_arrow from '../../Common/images/select_arrow.svg';
import yesIcon from '../../Settings/images/yesIcon.svg';
import noIcon from '../../Settings/images/noIcon.svg';
import select_arrow_on from '../../Settings/images/select_arrow.svg';


/**********************************************************************/
// 공통 css
export const AccountCommon = styled.div`
    user-select: none;
    border-radius: 8px;

    & * {
        font-size: 0.875rem;
    }

    .searchWrap {
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '12px')};
        padding: 0 4px;

        .searchBox {
            height: 30px;
            position: relative;
            padding-right: 100px;
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

        .resultCount {
            color: ${({ theme }) => theme.colors.primary.p300}; 
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    }

    .listWrap {
        border-radius: 8px;
        overflow: hidden;

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
                background: #1F292F;
                ${({ theme }) => theme.mixins.flex()};

                > div {

                    &:not(:last-child) {
                        border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                    }

                    &:not(:nth-child(1), :nth-child(3), :nth-child(4), :nth-child(6)) {
                        padding-left: 8px;
                    }

                    height: 32px;
                    line-height: 32px;
                    font-size: 0.75rem;
                    letter-spacing: -0.36px;
                    color: ${({ theme }) => theme.colors.grayscale.g200};

                    &:nth-child(1) {
                        text-align: center;
                    }

                    .sort {
                        height: 32px;
                        ${({ theme }) => theme.mixins.flex()};
                        padding: 0 8px;

                        > span {
                            font-size: 0.75rem;
                            letter-spacing: -0.36px;
                            color: ${({ theme }) => theme.colors.grayscale.g200};
                        }

                        button {
                            width: 16px;
                            height: 16px;

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
                height: 468px;
                overflow: hidden;

                ul {

                    li {
                        ${({ theme }) => theme.mixins.flex()};
                        height: 36px;
                        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                        cursor: pointer;

                        &.selectUser {
                            background: ${({ theme }) => theme.colors.primary.p500};
                        }

                        div {
                            text-align: left;
                            height: 36px;
                            line-height: 36px;
                            font-size: 0.75rem;
                            letter-spacing: -0.36px;

                            &:not(:last-child) {
                                border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                            }

                            &:nth-child(1) {
                                text-align: center;
                            }

                            &:not(:nth-child(1)) {
                                padding-left: 8px;
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
            color: ${({ theme }) => theme.colors.white};
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
            color: ${({ theme }) => theme.colors.black};
            background-color: ${({ theme }) => theme.colors.primary.p500};
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
// 계정 및 권한관리
export const AccountManagerComponent = styled.div`
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
        padding: 0;
        border-radius: 4px;
        box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.07) inset;
        height: 100%;

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

    .closeBtn {
        position: absolute;
        top: 23px;
        right: 19px;
        z-index: 2;
    }

    .menuWrap {
        padding: 19px 23px 0 23px;

        h2 {
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.48px;
            padding: 0 8px;
            margin-bottom: 16px;
        }

        ul {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            position: relative;
            padding: 0 12px;

            &::before {
                content: '';
                width: calc(100% - 184px);
                height: 1px;
                background-color: ${({ theme }) => theme.colors.grayscale.g700};
                position: absolute;
                top: 49px;
                right: 12px;
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
    }
`;


/**********************************************************************/
// 목록
export const AccountListComponent = styled(AccountCommon)`
    padding: 0 35px;
    margin-top: 10px;
    height: calc(100% - 125px);

    .account {
        bottom: 20px;
    }
`;


/**********************************************************************/
// 목록 - 사용자 정보 팝업
export const AccountUpdateUserComponent = styled.div`
    width: 480px;
    height: 754px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    padding: 40px;
    user-select: none;
    border-radius: 8px;

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
        right: -244px;
        transform: translate(0, -50%);
        padding: 5px 10px;
        white-space: nowrap;
        border-radius: 3px;
        background-color: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.black};
        font-size: 0.75rem;
        font-weight: 500;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-right: 5px solid ${({ theme }) => theme.colors.white};
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        right: -10px;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

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

        > ul {

            > li {

                ${({ theme }) => theme.mixins.flex()};
                margin-bottom: 20px;

                > div {

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '5px')};

                        span {
                            color: ${({ theme }) => theme.colors.secondary.s400};
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

                        &.disable > p {
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g800} !important;
                            color: ${({ theme }) => theme.colors.grayscale.g600} !important;
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
// 신규등록
export const AccountAddUserComponent = styled(AccountCommon)`
    height: calc(100% - 113px);
    padding: 12px 35px;

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
        padding: 0 20px;

        > div {
            ${({ theme }) => theme.mixins.flex()};

            label {
                flex: 1;
                cursor: default;
                color: ${({ theme }) => theme.colors.grayscale.g200};

                > span {
                    color: ${({ theme }) => theme.colors.secondary.s400};
                }
            }

            input,
            select,
            textarea,
            > div {
                width: 767px;
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

            .memberInfo {
                color: ${({ theme }) => theme.colors.grayscale.g300};
                font-size: 0.875;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;

                > div {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                    > p {

                        &:not(:first-child)::before {
                            content: '';
                            width: 1px;
                            height: 12px;
                            display: inline-block;
                            background-color: ${({ theme }) => theme.colors.grayscale.g700};
                            margin-left: 24px;
                            position: relative;
                            left: -12px;
                            top: 2px;
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
        transform: translate(-50%, 0);

        > button {
            border-radius: 0.25rem !important;
        }
    }
`;


/**********************************************************************/
// 신규등록 - 사용자 선택하기 팝업
export const AccountFindMemberComponent = styled(AccountCommon)`
    width: 980px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    padding: 40px;


    header {
        
        h2 {
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    section {
        padding: 20px 0;

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
                        width: ${(props) => props.$type === "account" ? `10%` : `15%`};
                    }
                    
                    &:nth-of-type(5) {
                        width: ${(props) => props.$type === "account" ? `10%` : `15%`};
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
                        background-color: #1F292F;
                        position: absolute;
                        right: 40px;
                        border-radius: 0 8px 0 0;
                    }

                    > div {
                        &:not(:nth-child(1), :nth-child(2)) {
                            padding: 0 2px 0 8px;
                        }

                        &:first-child {
                            ${({ theme }) => theme.mixins.flex('center', 'center')};
                        }

                        &:nth-child(2) {
                            padding: 0;
                            text-align: center;
                        }
                    }
                }

                .body {
                    height: 172px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    ${({ theme }) => theme.mixins.scroll()};

                    ul {
                        li {
                            background-color: #0D121A;
                            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g900};
                            cursor: default;
                            
                            > div {
                                ${({ theme }) => theme.mixins.textEllipsis()};

                                &:not(:nth-child(1), :nth-child(2)) {
                                    padding: 0 2px 0 8px;
                                }

                                &:nth-child(2) {
                                    padding: 0;
                                    text-align: center;
                                }
                            }

                            &.disable {
                                > div {
                                    color: #565B69;
                                }
                            }

                            .yes, .no {
                                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
                                gap: 4px;

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
                                color: ${({ theme }) => theme.colors.state.error} !important;

                                &::before {
                                    background: url(${noIcon}) no-repeat center center;
                                }
                            }
                        }
                    }

                    > div {
                        text-align: center;
                        background-color: ${({ theme }) => theme.colors.background.base};

                        p {
                            color: ${({ theme }) => theme.colors.primary.p500};
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
