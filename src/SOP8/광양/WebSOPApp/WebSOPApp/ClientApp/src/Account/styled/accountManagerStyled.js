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
        font-size: 14px;
    }

    .searchWrap {
        padding: 16px 0;
    }
    
    .listWrap {
        border-radius: 4px;
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
                background: rgba(255, 255, 255, 0.10);
                ${({ theme }) => theme.mixins.flex()};

                > div {
                    &:not(:last-child) {
                        border-right: 1px solid rgba(255, 255, 255, 0.10);
                    }

                    padding: 10px 0;
                    text-align: center;
                    font-weight: 500;

                    .sort {
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
                background-color: rgba(255, 255, 255, 0.05);
                height: 415px;

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

    .btnWrap {
        position: absolute;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
    }
`;


/**********************************************************************/
// 계정 및 권한관리
export const AccountManagerComponent = styled.div`
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

        > div {
            ${({ theme }) => theme.mixins.flex()};
            margin-bottom: 24px;

            h2 {
                font-size: 16px;
                font-weight: 500;
                line-height: 172%; /* 27.52px */
                letter-spacing: -0.48px;
            }
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
`;


/**********************************************************************/
// 목록
export const AccountListComponent = styled(AccountCommon)`
`;


/**********************************************************************/
// 목록 - 사용자 선택 팝업
export const AccountUpdateUserComponent = styled.div`
    width: 500px;
    height: 600px;
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
        > div {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
            padding: 4px 8px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);

            > span {
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }
        }

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


/**********************************************************************/
// 신규등록
export const AccountAddUserComponent = styled(AccountCommon)`
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
            white-space: pre-line;

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
                width: 739px;
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

                .memberInfo {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};

                    > span {
                        color: ${({ theme }) => theme.colors.grayscale.g700};
                    }
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


/**********************************************************************/
// 신규등록 - 조직정보 불러오기 팝업
export const AccountFindMemberComponent = styled(AccountCommon)`
    width: 980px;
    height: 480px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    padding: 32px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background.base};
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 40px 0 rgba(0, 0, 0, 0.40);

    header {
        padding: 10px 0;
        
        h2 {
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    section {
        .listWrap {
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
                        width: 18%;
                    }
                    
                    &:nth-of-type(4) {
                        width: ${(props) => props.$type === "account" ? `10%` : `18%`};
                    }
                    
                    &:nth-of-type(5) {
                        width: ${(props) => props.$type === "account" ? `10%` : `18%`};
                    }
                    
                    &:nth-of-type(6) {
                        width: 18%;
                    }
                    
                    &:nth-of-type(7) {
                        width: 18%;
                    }
                    
                    &:nth-of-type(8) {
                        width: 18%;
                    }
                }

                .head {
                    position: relative;
                    width: ${(props) => props.$rowLength > 7 ? `calc(100% - 4px)` : `100%`};

                    > div {
                        font-size: 12px;
                    }

                    &::after {
                        content: '';
                        display: ${(props) => props.$rowLength > 7 ? 'inline-block' : 'none'};
                        width: 4px;
                        height: 34px;
                        background-color: rgba(255, 255, 255, 0.10);
                        position: absolute;
                        right: -4px;
                    }
                }

                .body {
                    height: 208px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    ${({ theme }) => theme.mixins.scroll()};

                    ul {
                        li {
                            cursor: default;
                            
                            > div {
                                font-size: 12px;
                                letter-spacing: -0.36px;

                                &:nth-of-type(9) {
                                    color: ${({ theme }) => theme.colors.primary.p500};
                                }
                            }

                            .accountStatus {
                                color: ${({ theme }) => theme.colors.primary.p400};
                            }

                            &.disable {
                                > div {
                                    color: ${({ theme }) => theme.colors.grayscale.g500};
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
