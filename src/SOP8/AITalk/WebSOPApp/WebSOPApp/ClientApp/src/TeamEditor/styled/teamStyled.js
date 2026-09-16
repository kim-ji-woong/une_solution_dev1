import styled from 'styled-components';

import teamArrowDown from '../../TeamEditor/images/teamArrowDown.svg';
import treePlus from '../../TeamEditor/images/treePlus.svg';
import treeMinus from '../../TeamEditor/images/treeMinus.svg';
import treeEdit from '../../TeamEditor/images/treeEdit.svg';

import teamTableSearch from '../../TeamEditor/images/teamTableSearch.svg';
import addMemberIcon from '../images/addMemberIcon.svg';
import memberFileIcon from '../images/memberFileIcon.svg';
import memberFileIcon_up from '../images/memberFileIcon_up.svg';
import check_mark_hover from '../../Common/images/check_mark_hover.svg';
import select_arrow_white from '../../Common/images/select_arrow_white.svg';
import select_arrow_hover from '../../Common/images/select_arrow_hover.svg';
import popupClose from '../../Common/images/common/popup_close.svg';
import AccountResource from '../../Account/resource/id';
import searchIcon from '../../Account/images/searchIcon.svg';
import select_arrow_on from '../../Settings/images/select_arrow.svg';


// 조직관리 Main
export const SubPageComponent = styled.div`
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%; 
    height: 100vh;
    margin-top: 50px;
    user-select: none;
    background-color: ${({ theme }) => theme.colors.background.elevated};

    .teamSubAside{
        display: block;
        width: 280px;
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        position: absolute;
        left: 0;
        top: 0;
    }

    input[type=checkbox] {
        width: 16px;
        height: 16px;
    }
`;

// 조직관리 메뉴
export const SaRhtComponent = styled.div`
    display: block;
    float: left;
    width: 280px;
    height: calc(100% - 50px);
    position: absolute;
    left: 0;
    overflow: hidden;


    .sarSel {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        cursor:pointer;

        > div {
            width: 100%;
            ${({ theme }) => theme.mixins.flex()};
            padding: 16px 20px;
            background: ${({ theme }) => theme.colors.primary.p500};

            > p {
                font-size: 16px;
                font-weight: 500;
                line-height: 172%; /* 27.52px */
                letter-spacing: -0.48px;
                color: ${({ theme }) => theme.colors.white};
            }
        }

        > ul {
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            z-index: 10;
            background: ${({ theme }) => theme.colors.background.surface};
            box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);
        }

        > ul > li {
            border-bottom: 1px solid #29313E;
            padding: 16px 20px;

            &:hover {
                background: ${({ theme }) => theme.colors.primary.p500};
            }
        }

        > ul > li > a {
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            color: ${({ theme }) => theme.colors.white};
        }
    }

    .sarEditBox{
        display: flex;
        position: absolute;
        top: 59px;
        left: 0;
        width: 100%;
        ${({ theme }) => theme.mixins.flex()};
        padding: 16px 20px;
        border-bottom: 1px solid #29313E;
        background: #2A3344;

        > p {
            font-size: 1rem;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    .memberInfoWrap {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        ${({ theme }) => theme.mixins.flex()};
        padding: 16px 20px;
        border-top: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        background: ${({ theme }) => theme.colors.background.surface};

        > button {
            font-size: 1rem;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    .sarTree {
        cursor: pointer;
        margin: ${(props) => props.$isEditMode ? '119px 0 0px 20px' : '59px 0 0px 20px'};
        padding: 14px 0;
        color: ${({ theme }) => theme.colors.white};
        overflow-y: auto;
    }
`;


// 정규조직
export const SubContComponent = styled.div`
    display: block;

    width: calc(100% - 280px);
    height: calc(100% - 50px);
    position: absolute;
    left: 280px;
    padding: 40px;

    ${({ theme }) => theme.mixins.scroll()};

    .scWrap{
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .scCont{
        display: block;
        height: 100%;

        .scTop{
            display: flex;
            justify-content: space-between;
            align-items: center;

            > div > p {
                display: inline-block;
                color: ${({ theme }) => theme.colors.primary.p400};
                font-size: 1.25rem;
                font-weight: 500;
                line-height: 172%; /* 34.4px */
                letter-spacing: -0.6px;
                cursor: pointer;
                user-select: none;

                &:hover {
                    color: ${({ theme }) => theme.colors.white};
                }

                &:not(:first-child)::before {
                    content: ' > ';
                    display: inline-block;
                    margin: 0 5px;
                    color: ${({ theme }) => theme.colors.primary.p400} !important;
                }
            }
        }

        .sctRht{
            display: flex;
            align-items: center;
        }

        .searchWrap {
            height: 32px;
            position: relative;
            padding-right: 30px;
            margin: 12px 0;
    
            input {
                display: block;
                width: 448px;
                height: 32px !important;
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
                width: 32px;
                height: 32px;
                position: absolute;
                right: 0;
                top: 0;
                text-indent: -9999px;
                background: ${({ theme }) => theme.colors.primary.p500} url(${searchIcon}) no-repeat center center;
                border-radius: 0 4px 4px 0;
                border: 1px solid ${({ theme }) => theme.colors.primary.p500}; 
            }
        }

        .sctBtn{
            height: 32px;
            padding: 0 16px;
            border-radius: 6px;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g400};
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            cursor: pointer;
            margin-left: 8px;

            &:hover {
                border: 1px solid ${({ theme }) => theme.colors.primary.p500}; 
                background: ${({ theme }) => theme.colors.primary.p25}; 
                box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
                color: ${({ theme }) => theme.colors.primary.p500}; 
            }

            &:active {
                border: 1px solid ${({ theme }) => theme.colors.primary.p800}; 
                background: ${({ theme }) => theme.colors.primary.p60}; 
                color: ${({ theme }) => theme.colors.primary.p800}; 
            }

            &:focus {
                border: 1px solid ${({ theme }) => theme.colors.primary.p700}; 
                background: ${({ theme }) => theme.colors.primary.p50}; 
                color: ${({ theme }) => theme.colors.primary.p700}; 
            }

            &:disabled {
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g600};
                color: ${({ theme }) => theme.colors.grayscale.g700}; 
                pointer-events: none;
            }
        }

        .memberListArea {
            width: 100%;
            height: calc(100% - 84px);
            background-color: #1A1F23;
            border-radius: 4px 4px 0 0;
            margin-top: 16px;

            & * {
                font-size: 0.875rem;
            }

            .memberList {
                height: 100%;

                &.regular {
                    .head > div, 
                    .body > ul > li > div {
                        ${({ theme }) => theme.mixins.textEllipsis()};
        
                        &:nth-of-type(1) {
                            width: 4%;
                            display: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'flex' : 'none' };
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 4%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 11.5%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 11.5%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 11.5%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 11.5%;
                        }
        
                        &:nth-of-type(7) {
                            width: 11.5%;
                        }
        
                        &:nth-of-type(8) {
                            width: 11.5%;
                        }
        
                        &:nth-of-type(9) {
                            width: 11.5%;
                        }
        
                        &:nth-of-type(10) {
                            width: 11.5%;
                        }
                    }
                }

                &.temporary {
                    .head > div, 
                    .body > ul > li > div {
        
                        &:nth-of-type(1) {
                            width: 4%;
                            display: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'flex' : 'none' };
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 4%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 18.4%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 18.4%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 18.4%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 18.4%;
                        }
                        
                        &:nth-of-type(7) {
                            width: 18.4%;
                        }
                    }
                }

                .head {
                    background: #2A3344;
                    width: calc(100% - 4px);
                    ${({ theme }) => theme.mixins.flex()};

                    &::after {
                        content: '';
                        width: 4px;
                        height: 34px;
                        background-color: #2A3344;
                        position: absolute;
                        right: 40px;
                    }

                    > div {

                        &:not(:last-child) {
                            border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        }

                        height: 34px;
                        line-height: 33px;
                        text-align: center;
                        color: ${({ theme }) => theme.colors.grayscale.g200};
                    }
                }

                .body {
                    background-color: ${({ theme }) => theme.colors.background.surface};
                    overflow-y: scroll;
                    height: 100%;

                    ${({ theme }) => theme.mixins.scroll()};

                    ul {

                        li {
                            ${({ theme }) => theme.mixins.flex()};
                            border-bottom: 1px solid #222a38;
                            cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' } !important;

                            &.colorOn {
                                
                                > div {

                                    > span {
                                        color: ${({ theme }) => theme.colors.primary.p400};
                                    }
                                }
                            }

                            > div {
                                border-right: 1px solid #222a38;
                                padding: 4px;
                            }

                            div {
                                height: 40px;
                                ${({ theme }) => theme.mixins.flex('center', 'center')};

                                &:not(:nth-child(2), :nth-child(3)) {
                                    cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' } !important;
                                    width: 100%;
                                }

                                input[type=text] {
                                    height: 32px;
                                    text-align: left;
                                    border-radius: 8px;
                                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                                    background: ${({ theme }) => theme.colors.background.base};
                                }

                                select {
                                    appearance: none;
                                    width: 100%;
                                    height: 32px;
                                    line-height: 100%;
                                    color: ${({ theme }) => theme.colors.white};
                                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                                    border-radius: 8px;
                                    cursor: pointer;
                                    background: ${({ theme }) => theme.colors.background.base} url(${select_arrow_on}) 90% 49% no-repeat;
                                    font-size: 0.875rem !important;
                                    padding: 0 4px 0 10px;
                                }
                            }
                        }

                        &.noData {
                            height: 100%;
                            
                            li {
                                flex-direction: column;
                                justify-content: center;
                                border-bottom: 0;
                                cursor: default !important;
                                height: 100%;

                                > img {
                                    width: 100px;
                                    height: 100px;
                                    border-radius: 50%;
                                    background: rgba(255, 255, 255, 0.05);
                                    object-fit: none;
                                    margin-bottom: 20px;
                                }
    
                                > p:nth-child(2) {
                                    font-size: 1.25rem;
                                    color: ${({ theme }) => theme.colors.grayscale.g20};
                                    line-height: 172%; /* 34.4px */
                                    letter-spacing: -0.6px;
                                    margin-bottom: 8px;
                                }
    
                                > p:nth-child(3) {
                                    font-size: 0.875rem;
                                    color: ${({ theme }) => theme.colors.grayscale.g200};
                                    line-height: 172%; /* 24.08px */
                                    letter-spacing: -0.42px;
                                }
    
                                &:hover {
                                    background-color: transparent;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

//임시조직
export const SubContTemporaryComponent = styled(SubContComponent)`

    .colTextLink {
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        line-height: 24px;
        width: 100%;
        height: 100%;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
    }

    .colTextLink:hover {
        text-decoration: underline;
        cursor: pointer;
    } 
`;

//조직 담당자 설정
export const ScPopComponent = styled.div`
    position: fixed; 
    left: 0; 
    right: 0; 
    top: 0; 
    bottom: 0; 
    z-index: 9999; 
    background: rgba(0,0,0,0.8);

    & > div {
        display: table; 
        width: 100%; 
        height: 100%;
    }
    & > div > div {
        display: table-cell; 
        width: 100%; 
        vertical-align: middle;
    }
    & > div > div.double {
        text-align: center;
    }
    & > div > div.double > .scpWrap {
        display: inline-block; 
        vertical-align: top; 
        text-align: left; 
        margin: 0;
    }

    .scpWrap{
        display: block; 
        margin: 0 auto; 
        background: ${({ theme }) => theme.colors.white};
        height: 680px; 
        position: relative; 
        padding-top: 50px; 
        overflow: hidden;
        box-shadow: 3px 3px 20px 0px rgba(0,0,0,0.2);
    }
    .scpWrap.w950 {
        width: 950px;
    }

    .scpTop {
        position: absolute; 
        left: 0; 
        right: 0; 
        top: 0; 
        background: #b61a33; 
        z-index: 2;
        cursor:default;
        background: ${({ theme }) => theme.colors.primary.p500} !important;
    }
    .scpTop:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .scpTop h3 {
        float: left; 
        height: 50px; 
        line-height: 50px; 
        color: ${({ theme }) => theme.colors.white};
        padding-left: 15px; 
        font-size: 1.375rem; 
        font-weight: 600;
    }
    .scpTop a {
        display: block; 
        float: right; 
        width: 50px; 
        height: 50px; 
        text-indent: -9999px; 
        background: url(${ popupClose }) no-repeat center center;
        background-size: 20px auto;
    }

    .scpCont{
        height: 100%;
    }
    .scpCont:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .scpLft {
        width: 220px; 
        float: left; 
        height: 100%; 
        padding-top: 64px; 
        position: relative;
        z-index: 1; 
        box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
    }
    .scplTitle{
        position: absolute; 
        left: 0; 
        right: 0; 
        top: 0; 
        height: 64px; 
        line-height: 64px; 
        padding: 0 15px; 
        font-size: 1.375rem; 
        cursor:default; 
        color: ${({ theme }) => theme.colors.black}; 
        font-weight: 600;
    }
    .scplOgz{
        height: 100%;
    }
    .scpRht {
        width: 730px; 
        float: left; 
        height: 100%; 
        padding-top: 64px; 
        padding-bottom: 69px; 
        position: relative;
    }
    .scprTop{
        position: absolute; 
        left: 0; 
        right: 0; 
        top: 0; 
        padding: 13px 20px;  
        cursor:default; 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
    }

    .scprTop a { background: ${({ theme }) => theme.colors.background.surface};}
    .scprTop a:hover,
    .scprTop a:active,
    .scprTop a:focus { 
        background: ${({ theme }) => theme.colors.primary.p500};
    }

    .scprTop h4 {
        float: left; 
        font-size: 1.375rem; 
        color: ${({ theme }) => theme.colors.black}; 
        font-weight: 600;
    }

    .scprTopForm {
        display: block;
        float: right;
        cursor:pointer;
    }

    .scprTopForm:after {
        content: '';
        display: table;
        clear: both;
    }

    .scprTop input[type="text"] {
        display: block; 
        float: left; 
        width: 230px; 
        height: 38px; 
        margin-right: 4px; 
        border-radius: 4px; 
        color: ${({ theme }) => theme.colors.black};
    }
    .scprTop a {
        display: block; 
        float: left; 
        width: 64px; 
        height: 38px; 
        line-height: 38px; 
        background: ${({ theme }) => theme.colors.background.button}; 
        color: ${({ theme }) => theme.colors.white};
        text-align: center; 
        border-radius: 4px;
    }
    .scprTop a:hover,
    .scprTop a:active,
    .scprTop a:focus {
        background: #222;
    }

    .scprCont{
        margin: 20px;

        &:not(.team) {
            height: 400px;
            overflow-x: hidden;
            overflow-y: auto;
            ${({ theme }) => theme.mixins.scroll()};
        }
    }
    .scprTb{
        border-left: solid 2px ${({ theme }) => theme.colors.white};
        border-right: solid 2px ${({ theme }) => theme.colors.white};
    }
    .scprTb tbody tr {
        cursor: pointer;
    }
    .scprTb tbody tr.on {
        background: #b61a33; 
        color: ${({ theme }) => theme.colors.white};
    }
    .scprTb th,
    .scprTb td {
        border: solid 1px #ebebeb; 
        text-align: center; 
        padding: 5px; 
        font-size: 0.875rem; 
        color: ${({ theme }) => theme.colors.black}; 
        vertical-align: middle;
    }
    .scprTb th {
        background: #f7f7f7; 
        color: #888; 
        border-top: solid 2px #485775; 
        font-weight: 500;
    }

    .scprBot {
        position: absolute; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        padding: 15px 20px; 
        text-align: right; 
        border-top: solid 1px #e5e5e5;
    }
    .scprBot a {
        display: inline-block; 
        width: 84px; 
        height: 38px; 
        line-height: 36px; 
        text-align: center; 
        border: solid 1px #888; 
        border-radius: 4px;
        color: ${({ theme }) => theme.colors.black} !important;
    } 
    .scprBot a.navy { 
        background: ${({ theme }) => theme.colors.primary.p500} !important;
        border-color: ${({ theme }) => theme.colors.primary.p500} !important;
        color: ${({ theme }) => theme.colors.white} !important; 
        margin-left: 5px;
    }
    .colTextSpan{
        white-space: nowrap;
        overflow: hidden;    
    }
`;

//스케줄 페이지
export const SubContScheduleComponent = styled(SubContComponent)`
    #subCont{
        width: 100%; 
        height: 100vh;
        background: #f7f7f7; 
        position: relative; 
        overflow: hidden;
    }
    .scWrap{
        min-height: 700px; 
        padding: 15px;
    }
    .scCont {
        border: solid 1px #dbdde2; 
        padding: 20px; 
        border-radius: 4px; 
    }
    .scCont:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .scTop {}
    .scTop:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .scTop h4 {
        float: left; 
        font-size: 1.625rem; 
        font-weight: 700; 
        height: 38px; 
        line-height: 38px;
    }

    .sctRht {
        float: right;
    }
    .sctRht:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .sctRht button,
    .sctRht a {
        float: left; 
        display: block; 
        height: 38px; 
        line-height: 36px; 
        text-align: center; 
        border: solid 1px #ccc; 
        text-align: center;
        padding: 0 15px; 
        border-radius: 4px; 
    }
    .sctRht a:hover,
    .sctRht a:active,
    .sctRht a:focus {
        border-color: #485775; 
        color: ${({ theme }) => theme.colors.black};
    }
    .sctrSel {
        display: block; 
        width: 130px; 
        height: 40px; 
        float: left; 
        margin-right: 4px;
    }
    .scSec {}
    .scSec:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .scsLft {
        float: left; 
        width: 75%; 
        padding-right: 30px;
    }
    .scAtcl {
        margin-top: 30px;
    }
    .scAtcl h5 {
        font-size: 1.25rem;
    }
    .scTb {
        margin-top: 20px; 
        background: ${({ theme }) => theme.colors.background.base};
        color: ${({ theme }) => theme.colors.white};
        padding: 6px; 
        table-layout: fixed; 
    }
    .scTb tr { 
        height: 34px; 
        cursor: pointer; 
    }
    .scTb tr.on {
        background: ${({ theme }) => theme.colors.primary.p500};
    }
    .scTb th,
    .scTb td {
        text-align: center; 
        font-size: 0.75rem; 
        color: ${({ theme }) => theme.colors.white};
        vertical-align: middle; 
        border: 1px solid #485775;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }
    .scTb th {
        font-weight: 500; 
        color: ${({ theme }) => theme.colors.white};
    }
    .scTb td select {
        display: block; 
        width: 100%; 
        height:30px;
    }
    .scTb td input[type="text"] {
        display: block; 
        width: calc(100% - 6px); 
        text-align: center; 
        height:25px;     
        margin: 0 auto;
        font-size: 0.75rem;
    }
    .scTb td span { 
        padding: 5px 0; 
        font-size: 0.75rem; 
    }
    .scTb td span.fixation { 
        padding: 8px; 
    }
    .scTb.ds tr th,
    .scTb.ds tr td {
        padding: 10px; 
        font-size: 1.125rem;
    }
    .scTb.ds tr.on {
        background: #f7fcfb;
    }
    .scTb.ds tr.on td {
        color: #009c79; 
        text-decoration: underline; 
        font-weight: 500;
    }
    .scTb tbody { 
        background-color: ${({ theme }) => theme.colors.background.surface};
    }

    .sctEdt {
        position: relative; 
        padding-right: 45px;
    }
    .sctEdt p {
        line-height: 30px;
    }
    .sctEdt a {
        display: block; 
        width: 40px; 
        height: 30px; 
        line-height: 30px; 
        font-size: 0.8125rem; 
        background: #686868; 
        color: ${({ theme }) => theme.colors.white};
        position: absolute; 
        right: 0; 
        top: 0; 
        border-radius: 4px;
    }
    .sctEdt a:hover,
    .sctEdt a:active,
    .sctEdt a:focus {
        background: #222;
    }
    .scsRht {
        float: left;
        width: 25%;
    }
    .mt20{
        margin-top: 20px !important;
    } 
    .mt50{
        margin-top: 50px !important;
    }
    .mt60 {
        margin-top: 60px !important;
    }
`;

export const ColComboBoxComponent = styled.div`
    .selectCombo{
        background: url('../../TesamEditor/images/teamSelectArrow.png') no-repeat; 
        background-position: 95%; 
        background-position-y: center;
        background-size: 12px; 
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.8125rem; 
        padding-left: 10px; 
    }
`;

export const ColTextComponent = styled.div`
    .colTextSpan {
        white-space: nowrap;
        overflow: hidden;    
    }
`;

export const ColTemporaryMemberNewComponent = styled.div`
    width: 100%;

    .colTextLink {
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        line-height: 24px;
        width: 100%;
        height: 100%;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
    }

    .colTextLink:hover {
        text-decoration: underline;
        cursor: pointer;
    } 
`;


//tree view
export const TreeViewComponent = styled.div`
    display: contents;

    .scrollbarOuter{
        height: 100%;
        overflow-y: auto;
    }

    .sarTree {
        cursor: pointer;
        padding: 14px 0;
        color: ${({ theme }) => theme.colors.white};
        overflow-y: auto;
        ${({ theme }) => theme.mixins.scroll()};
    }

    #temporaryPopupTreeArea.sarTree {
    margin: 0 0 0 20px;
    }

    #temporaryPopupTreeArea h5,
    #temporaryPopupTreeArea a {
        color: ${({ theme }) => theme.colors.black} !important;
    }

    #temporaryPopupTreeArea.treeview i.fa-minus,
    #temporaryPopupTreeArea.treeview i:hover,
    #temporaryPopupTreeArea.treeview i:active,
    #temporaryPopupTreeArea.treeview i:focus,
    #temporaryPopupTreeArea.treeview i {
        background: #000 !important;
        border-color: #000 !important;
    }

    #temporaryPopupTreeArea.treeview i:before,
    #temporaryPopupTreeArea.treeview i:after {
        background: ${({ theme }) => theme.colors.white};
    }

    .treeview>li {
        margin-bottom: 10px;
        position: relative;
    }

    .treeview>li:last-child {
        margin-bottom: 0;
    }

    .treeview i {
        display: inline-block;
        vertical-align: top;
        width: 14px;
        height: 14px;
        margin-right: 6px;
        border: solid 1px #888;
        position: relative;
        cursor: pointer;
        text-indent: -9999px;
        border-radius: 2px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        background: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.white};
    }

    .treeview i:before,
    .treeview i:after {
        content: '';
        display: block;
        background: ${({ theme }) => theme.colors.background.surface};
        position: absolute;
        left: 50%;
        top: 50%;
    }

    .treeview i:before {
        width: 10px;
        height: 2px;
        margin-top: -1px;
        margin-left: -5px;
    }

    .treeview i:after {
        width: 2px;
        height: 10px;
        margin-top: -5px;
        margin-left: -1px;
        display: none;
    }

    .treeview i.fa-plus:after {
        display: block;
    }

    .treeview i.fa-minus,
    .treeview i:hover,
    .treeview i:active,
    .treeview i:focus {
        background: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.white};
    }

    .treeview ul {
        margin-top: 10px;
        padding-left: 15px;
        margin-bottom: 10px;
    }

    .treeview>li>h5 {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        line-height: 18px;
        margin-top: -2px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        max-width: calc(100% - 39%);
        margin-right: 10px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview>li>ul li {
        margin-bottom: 10px;
        position: relative;
    }

    .treeview>li>ul li:last-child {
        margin-bottom: 0;
    }

    .treeview>li>ul h5 {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        max-width: 82%;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        margin-right: 10px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }

    .treeview i~a:before {
        display: none;
    }

    .treeview i~a:hover,
    .treeview i~a:active,
    .treeview i~a:focus {
        font-weight: 700;
        background: none;
    }

    .treeview.wk a:focus,
    .treeview.wk a:hover {
        background: #000;
        color: ${({ theme }) => theme.colors.white};
        text-decoration: none;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .treeview.wk a:focus:before,
    .treeview.wk a:hover:before {
        background: ${({ theme }) => theme.colors.white};
    }

    .treeview.wk i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }

    .treeview.wk i~a:before {
        display: none;
    }

    .treeview.wk i~a:hover,
    .treeview.wk i~a:active,
    .treeview.wk i~a:focus {
        font-weight: 700;
        background: none;
        color: #333;
    }

    .treeview.wkd a {
        color: #aaa;
    }

    .treeview.wkd a:focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.black};
        font-weight: 700;
    }

    .treeview a {
        display: inline-block;
        padding-left: 20px; 
        padding-right: 10px;
        font-size: 0.875rem;
        max-width: calc(100% - 25%);
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview a:hover {
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .select { 
        color: ${({ theme }) => theme.colors.primary.p500} !important; 
        margin-right: 10px;
    }
    .selected { 
        color: ${({ theme }) => theme.colors.primary.p400} !important; 
        margin-right: 10px;
    }

    .wordIength {
        display: inline-block;
        font-size: 1rem;
        max-width: calc(62%) !important;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }
    
    .editArea {
        display: none;

        svg {
            fill: ${({ theme }) => theme.colors.grayscale.g500};
        }

        > span {
            width: 16px;
            height: 16px;

            &:hover {
    
                svg {
                    fill: ${({ theme }) => theme.colors.primary.p400};
                }
            }
        }
    }

    .selected .editArea { 
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '16px')};
        display: block!;

        position:absolute; 
        top: -3px;
        right: 8px;
    }
    .labelInput{
        display: inline-block;
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.75rem;
        margin-right: 5px;
        vertical-align: top;
    }
`;
