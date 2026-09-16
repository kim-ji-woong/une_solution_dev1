import styled from 'styled-components';

import treePlus from '../../TeamEditor/image/treePlus.svg';
import treeMinus from '../../TeamEditor/image/treeMinus.svg';
import treeEdit from '../../TeamEditor/image/treeEdit.svg';

import teamTableSearch from '../../TeamEditor/image/teamTableSearch.svg';
import memberFileIcon from '../image/memberFileIcon.svg';
import memberFileIcon_up from '../image/memberFileIcon_up.svg';
import check_mark_hover from '../../Common/images/check_mark_hover.svg';
import select_arrow_white from '../../Common/images/select_arrow_white.svg';
import select_arrow_hover from '../../Common/images/select_arrow_hover.svg';
import popupClose from '../../Common/img/common/popup_close.svg';
import AccountResource from '../../Account/resource/id';


// 조직관리 Main
export const SubPageComponent = styled.div`
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%; 
    height: 100vh;
    margin-top: 50px;
    user-select: none;
    background: ${({ theme }) => theme.colors.background.base};

    .teamSubAside{
        display: block;
        width: 280px;
        height: 100%;
        background: ${({ theme }) => theme.colors.background.base};
        position: absolute;
        left: 0;
        top: 0;
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

    .sarSel{
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        cursor:pointer;

        > button{
            display: block;
            position: relative;
            width: 100%;
            height: 56px;
            text-align: left;
            background: ${({ theme }) => theme.colors.primary.p500};
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            padding: 0 20px;
            color: ${({ theme }) => theme.colors.white};
            ${({ theme }) => theme.mixins.flex()};
        }

        > ul{
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            z-index: 10;
            background: ${({ theme }) => theme.colors.background.base};
            display: none;
            box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.10), 0 12px 36px 0 rgba(0, 0, 0, 0.36);
        }

        > ul > li{
            height: 56px;
            ${({ theme }) => theme.mixins.flex()};

            &:not(:last-child) {
                border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
            }

            &:hover {
                background: ${({ theme }) => theme.colors.primary.p500};
            }
        }

        > ul > li > a{
            display: block;
            padding: 0 20px;
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    .sarEditBox{
        display: flex;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 240px;

        > button {
            width: 100%;
        }
    }

    .memberInfoWrap {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        > button {
            ${({ theme }) => theme.mixins.flex()};
            width: 100%;
            height: 56px;
            text-align: left;
            border-bottom: 1px solid ${({ theme }) => theme.colors.background.base};
            background: #2A3344;
            font-weight: 700;
            padding: 0 20px;

            &:hover::after {
                filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
            }
        }

        .upload::after {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background: url(${ memberFileIcon_up }) no-repeat;
        }

        .download::after {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background: url(${ memberFileIcon }) no-repeat;
        }
    }

    .sarTree {
        cursor: pointer;
        margin: ${(props) => props.$isEditMode ? '56px 0 0px 20px' : '56px 0 0px 20px'};
        padding: 10px 0;
        color: ${({ theme }) => theme.colors.white};
        overflow-y: auto;
    }

    .sarTree::-webkit-scrollbar {
        width: 6px;
        background: ${({ theme }) => theme.colors.background.base};
    }

    .sarTree::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .sarTree::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }
`;


export const TeamEditorContentComponent = styled.div`
    .saLeft {
        float: left; 
        width: 120px; 
        border-right: solid 1px #d9d9d9; 
        height: 100%;
    }

    .aslWrap.typeH { 
        background: #162235;
    }
    .aslWrap.typeH .salCont dd a:hover,
    .aslWrap.typeH .salCont dd a:active,
    .aslWrap.typeH .salCont dd a:hover { 
        cursor: pointer; 
        background: #070d17;
    }
    .aslWrap.typeH .salCont dd { 
        margin-bottom: 5px;
    }
    .aslWrap.typeH .salCont dd:last-child {
        margin-bottom: 0;
    }
    .aslWrap.typeH .salCont dd a {
        display: block; 
        height: 40px; 
        line-height: 40px; 
        text-align: center; 
        color: ${({ theme }) => theme.colors.white};
        background: rgba(59,63,92,0.5); 
        border-radius: 4px; 
    }
    .aslWrap.typeH .salCont dd a.disabled {
        display: block; 
        height: 40px; 
        line-height: 40px; 
        text-align: center; 
        color: #8e8e8e; 
        background: rgba(88,88,88,0.5); 
        border-radius: 4px;
        cursor: default;
    }
    .salMenu {
        background: ${({ theme }) => theme.colors.white};
    }
    .salMenu.on {
        background: none;
    }
    .salMenu.on .salIco { 
        color: ${({ theme }) => theme.colors.white};
        background: none;
    }
    .salMenu.on .salIco:after {
        content: ''; 
        display: block; 
        height: 1px; 
        position: absolute; 
        left: 10px; 
        right: 10px; 
        bottom: 0; 
        background: rgba(0,0,0,0.2);
    }
    .salMenu.on .salCont {
        display: block;
    }
    .salIco.ico0101:before {
        background: url('../img/common/aside_ico0101.png')no-repeat center center;
    }
    .salMenu.on .salIco.ico0101:before {
        background: url('../img/common/aside_ico0101_on.png')no-repeat center center;
    }
`;


// 정규조직
export const SubContComponent = styled.div`
    display: block;
    background-color: rgba(255, 255, 255, 0.05);
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
                color: ${({ theme }) => theme.colors.white};
                font-size: 20px;
                font-weight: 500;
                line-height: 172%; /* 34.4px */
                letter-spacing: -0.6px;
                cursor: pointer;
                user-select: none;

                &:hover {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }

                &:not(:first-child)::before {
                    content: ' > ';
                    display: inline-block;
                    margin: 0 5px;
                    color: ${({ theme }) => theme.colors.white} !important;
                }
            }
        }

        .sctRht{
            display: flex;
            align-items: center;
            gap: 12px;

            .searchWrap {
                width: 480px;
            }

            .fileWrap {
                position: relative;

                > ul {
                    width: 217px;
                    position: absolute;
                    right: 0;
                    top: 43px;
                }
            }
        }

        .labelInputText{
            display: block;
            width: 470px;
            height: 30px;
            color: ${({ theme }) => theme.colors.white};
        
            > input[type=text] {
                position: relative;
                width: 470px;
                height: 30px;
                border-radius: 2px;
                border: 0;
                border-top: 1px solid #29313E;
                border-left: 1px solid #29313E;
                border-bottom: 1px solid #29313E;
                background: ${({ theme }) => theme.colors.background.base};
                color: ${({ theme }) => theme.colors.white};
                padding-left: 10px;
                font-size: 12px;
            }
        }

        .sctAdd{
            width: 46px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            background-color: ${({ theme }) => theme.colors.background.base};
            color: ${({ theme }) => theme.colors.white};
            font-size: 14px;
            font-weight: 500;
            border-radius: 2px;
            border: 1px solid #29313E;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
                background-color: ${({ theme }) => theme.colors.primary.p500};
                color: ${({ theme }) => theme.colors.background.base};
            }
        }

        .sctDel{
            width: 46px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            background-color: ${({ theme }) => theme.colors.background.base};
            color: ${({ theme }) => theme.colors.white};
            font-size: 14px;
            font-weight: 500;
            border-radius: 2px;
            border: 1px solid #29313E;
            margin-left: 4px;
            cursor: pointer;

            &:hover {
                background-color: ${({ theme }) => theme.colors.primary.p500};
                color: ${({ theme }) => theme.colors.background.base};
            }
        }

        .memberListArea {
            width: 100%;
            height: calc(100% - 111px);
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            & * {
                font-size: 14px;
            }

            .memberList {
                flex: 1;
                min-height: 0;
                background-color: ${({ theme }) => theme.colors.background.base};
                border: 1px solid rgba(255, 255, 255, 0.10);
                border-radius: 0 0 8px 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;

                &.regular {
                    .head > div, 
                    .body > ul > li > div {
                        ${({ theme }) => theme.mixins.textEllipsis()};
        
                        &:nth-of-type(1) {
                            width: 3%;
                            display: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'flex' : 'none' };
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 3%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 20%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 12%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 12%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 12%;
                        }
        
                        &:nth-of-type(7) {
                            width: 12%;
                        }
        
                        &:nth-of-type(8) {
                            width: 13%;
                        }
        
                        &:nth-of-type(9) {
                            width: 13%;
                        }
                    }
                }

                &.temporary {
                    .head > div, 
                    .body > ul > li > div {
        
                        &:nth-of-type(1) {
                            width: 3%;
                            display: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'flex' : 'none' };
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 3%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 25%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 25%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 11%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 11%;
                        }
                        
                        &:nth-of-type(7) {
                            width: 11%;
                        }
                        
                        &:nth-of-type(8) {
                            width: 11%;
                        }
                    }
                }

                .head {
                    background: rgba(255, 255, 255, 0.10);
                    width: 100%;
                    ${({ theme }) => theme.mixins.flex()};

                    > div {

                        &:not(:last-child) {
                            border-right: 1px solid rgba(255, 255, 255, 0.10);
                        }

                        height: clamp(28px, 3vh, 34px);
                        line-height: clamp(28px, 3vh, 33px);
                        text-align: center;
                        font-weight: 500;
                    }
                }

                .body {
                    background: rgba(255, 255, 255, 0.05);
                    flex: 1;
                    min-height: 0;

                    ul {
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        li {
                            ${({ theme }) => theme.mixins.flex()};
                            flex: 1 0 0;
                            min-height: 24px;
                            cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' } !important;
                            
                            &:not(:last-child) {
                                border-bottom: 1px solid rgba(255, 255, 255, 0.10);
                            }

                            &:hover {
                                background-color: rgba(255, 255, 255, 0.10);

                                div span {
                                    color: ${({ theme }) => theme.colors.primary.p400};
                                }
                            }

                            &.colorOn > div > span {
                                color: ${({ theme }) => theme.colors.primary.p500};
                            }

                            &.emptyRow {
                                cursor: default !important;
                                border-bottom: 1px solid transparent !important;

                                &:hover {
                                    background-color: transparent;

                                    div span {
                                        color: inherit;
                                    }
                                }

                                > div {
                                    border-right: 1px solid transparent;
                                }
                            }

                            > div {
                                border-right: 1px solid rgba(255, 255, 255, 0.10);
                            }

                            div {
                                height: 100%;
                                ${({ theme }) => theme.mixins.flex('center', 'center')};
                                padding: 2px;

                                &:not(:nth-child(2), :nth-child(3)) {
                                    cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' } !important;
                                    width: 100%;
                                }

                                input[type=text] {
                                    height: clamp(20px, 2.4vh, 28px);
                                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
                                    border-radius: 6px;
                                    background: ${({ theme }) => theme.colors.background.surface};
                                    text-align: center;
                                }

                                select {
                                    appearance: none;
                                    width: 100%;
                                    height: clamp(20px, 2.4vh, 28px);
                                    line-height: 100%;
                                    color: ${({ theme }) => theme.colors.white};
                                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
                                    border-radius: 6px;
                                    cursor: pointer;
                                    background: ${({ theme }) => theme.colors.background.surface} url(${select_arrow_white}) 90% 49% no-repeat;
                                    font-size: 14px !important;
                                    padding: 0 4px 0 10px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .noData {
            background-color: ${({ theme }) => theme.colors.background.base};
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
    position: fixed !important;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 9998;

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
        font-size: 22px; 
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
        font-size: 22px; 
        cursor:default; 
        color: #000; 
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

    .scprTop a { background: ${({ theme }) => theme.colors.background.base};}
    .scprTop a:hover,
    .scprTop a:active,
    .scprTop a:focus { 
        background: ${({ theme }) => theme.colors.primary.p500};
    }

    .scprTop h4 {
        float: left; 
        font-size: 22px; 
        color: #000; 
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
        color: #000;
    }
    .scprTop a {
        display: block; 
        float: left; 
        width: 64px; 
        height: 38px; 
        line-height: 38px; 
        background: #424242; 
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
        font-size: 14px; 
        color: #000; 
        vertical-align: middle;
    }
    .scprTb th {
        background: #f7f7f7; 
        color: #888; 
        border-top: solid 2px #485775; 
        font-weight: 500;
    }
    .scprTb td input[type=radio] { 
        border: 1.5px solid #ddd; 
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
        color: #000 !important;
    } 
    .scprBot a.navy { 
        background: ${({ theme }) => theme.colors.primary.p500} !important;
        border-color: ${({ theme }) => theme.colors.primary.p500} !important;
        color: ${({ theme }) => theme.colors.white} !important; 
        margin-right: 10px;
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
        font-size: 26px; 
        font-weight: 700; 
        height: 38px; 
        line-height: 38px;
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
        font-size: 20px;
    }
    .scTb {
        margin-top: 20px; 
        background: ${(props) => props.theme.background()};
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
        font-size: 12px; 
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
        font-size: 12px;
    }
    .scTb td span { 
        padding: 5px 0; 
        font-size: 12px; 
    }
    .scTb td span.fixation { 
        padding: 8px; 
    }
    .scTb.ds tr th,
    .scTb.ds tr td {
        padding: 10px; 
        font-size: 18px;
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
        background-color: ${({ theme }) => theme.colors.background.base};
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
        font-size: 13px; 
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

    .sccInfo {
        display: table; 
        width: 100%;
    }
    .sccInfo dt {
        display: table-cell; 
        vertical-align: top; 
        width: 260px; 
        padding: 40px; 
        position: relative;
    }
    .sccInfo dt:after {
        content: ''; 
        display: block; 
        width: 120px; 
        height: 114px; 
        position: absolute; 
        right: 0; 
        bottom: 20px; 
        background: url('../img/common/info_ico.png')no-repeat center center;
    }
    .sccInfo dt h5 {
        font-size: 30px; 
        font-weight: 500; 
        line-height: 1.2em;
    }
    .sccInfo dd {
        display: table-cell; 
        vertical-align: top; 
        background: #fbfbfb; 
        padding: 40px;
    }
    .sccInfo dd ul {
        padding-left: 15px;
    }
    .sccInfo dd ul li {
        list-style: decimal; 
        margin-bottom: 5px;
    }
    .sccInfo dd p {
        color: #b61a33; 
        margin-top: 10px; 
        font-weight: 500;
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

export const ScheduleMenuComponent = styled.div`
    .saRht {
        float: left; 
        width: 310px; 
        height: 100%; 
        position: relative; 
        padding-top: 110px; 
        overflow: hidden;
    }
    .saRht.pt60 {
        padding-top: 60px;
    } 
    .sarSel {
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%;
        cursor:pointer;
    }
    .sarSel button {
        display: block; 
        position: relative; 
        width: 100%; 
        height: 60px; 
        text-align: left; 
        background: ${({ theme }) => theme.colors.white};
        font-size: 24px; 
        font-weight: 700; 
        padding-left: 20px; 
        border-bottom: solid 1px #e5e5e5;
    }
    .sarSel button:after {
        content: ''; 
        display: block; 
        width: 20px; 
        height: 12px; 
        position: absolute; 
        right: 20px; 
        top: 50%; 
        margin-top: -5px; 
        background: url('../img/common/aside_select_arrow.png')no-repeat center bottom; 
        background-size: 100% auto;
    }
    .sarSel button.on:after {
        background-position: center top;
    }
    .sarSel ul {
        position: absolute; 
        left: 0; 
        right: 0; 
        top: 100%; 
        z-index: 10; 
        background: ${({ theme }) => theme.colors.white};
        display: none;
        box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.1);
    }
    .sarSel ul li {
        border-bottom: solid 1px #e5e5e5;
    }
    .sarSel ul li a {
        display: block; 
        padding: 15px 20px; 
        font-size: 18px;
    }
    .sarSel ul li a:hover {
        background: #f7f7f7;
    }
    .sarSel h3 {
        height: 60px; 
        line-height: 60px; 
        border-bottom: solid 1px #e5e5e5; 
        font-size: 24px; 
        font-weight: 700; 
        padding: 0 15px;
    }
    .sarList {}
    .sarList li {
        padding: 0 15px;
    }
    .sarList li a {
        display: block; 
        font-size: 18px; 
        font-weight: 700; 
        height: 50px; 
        line-height: 49px; 
        border-bottom: solid 1px #f2f2f2; 
        position: relative; 
        font-weight: 400; 
        cursor: pointer;
    }
    .sarList li a.current {
        color: #39A7DE; 
        font-weight: 700;
    }
    .sarList li a.current:after {
        content: ''; 
        display: block; 
        width: 9px; 
        height: 15px; 
        position: absolute; 
        right: 5px; 
        top: 50%; 
        margin-top: -7px; 
        background: url('../img/common/aside_list_arrow.png')no-repeat center center;
    }
`;

export const ColComboBoxComponent = styled.div`
    .selectCombo{
        background: url('../../TeamEditor/image/teamSelectArrow.png') no-repeat; 
        background-position: 95%; 
        background-position-y: center;
        background-size: 12px; 
        color: ${({ theme }) => theme.colors.white};
        font-size: 13px; 
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
        padding: 10px 0;
        color: ${({ theme }) => theme.colors.white};
        overflow-y: auto;
    }

    .sarTree::-webkit-scrollbar {
        width: 6px;
        background: ${({ theme }) => theme.colors.background.base};
    }

    .sarTree::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.primary.p500};
        border-radius: 3px;
    }

    .sarTree::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }

    #temporaryPopupTreeArea.sarTree {
    margin: 0 0 0 20px;
    }

    #temporaryPopupTreeArea h5,
    #temporaryPopupTreeArea a {
        color: #000 !important;
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
        background: ${({ theme }) => theme.colors.background.base};
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
        font-size: 14px;
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
        font-size: 14px;
        max-width: 82%;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        margin-right: 10px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
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
        font-size: 14px;
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
        color: #000;
        font-weight: 700;
    }

    .treeview a {
        display: inline-block;
        padding-left: 20px; 
        padding-right: 10px;
        font-size: 14px;
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
        color: ${({ theme }) => theme.colors.primary.p500} !important;
        margin-right: 10px;
    }

    .wordIength {
        display: inline-block;
        font-size: 16px;
        max-width: calc(62%) !important;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .selected .editArea .treeEdit{ 
        display: inline-block; 
        width: 20px; 
        height: 20px; 
        background: url(${ treeEdit }) no-repeat;
        margin-right:6px; 
    } 
    .selected .editArea .treeEdit:hover{ 
        display: inline-block; 
        width: 20px; 
        height: 20px; 
        filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%); 
        margin-right:6px; } 

    .selected .editArea .treePlus{ 
        display: block; 
        width: 20px; 
        height: 20px;  
        background: url(${ treePlus }) no-repeat;
        float: right; 
        color: ${({ theme }) => theme.colors.white};
        margin-right:6px; 
    } 
    .selected .editArea .treePlus:hover{ 
        display:inline-block; 
        width: 20px; 
        height: 20px; 
        filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
        float:right; 
        color: ${({ theme }) => theme.colors.white};
    }
    .selected .editArea .treeMinus{ 
        display: block; 
        width: 20px; 
        height: 20px; 
        background: url(${ treeMinus }) no-repeat;
        float: right; 
        color: ${({ theme }) => theme.colors.white};
    } 
    .selected .editArea .treeMinus:hover{ 
        display:inline-block; 
        width: 20px; 
        height:20px; 
        filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%); 
        float:right; 
        color: ${({ theme }) => theme.colors.white};
    }
    .selected .editArea { 
        visibility:visible; 
        display:inline-block; 
        position:absolute; 
        right: 8px;
    }
    .labelInput{
        display: inline-block;
        color: ${({ theme }) => theme.colors.white};
        font-size: 12px;
        margin-right: 5px;
        vertical-align: top;
    }

    //임시보류
    /* .editArea{
        display: flex;
        position:absolute;
        top: 0;
        right: 10px;
        visibility:visible;
    } 
    .treeEdit{
        display: inline-block;
        width: 20px;
        height: 19px;
        background: url(${ treeEdit }) no-repeat;
        margin-right: 6px;
    }
    .treeMinus{
        display: inline-block;
        width: 20px;
        height: 19px;
        background: url(${ treeMinus }) no-repeat;
        margin-right: 6px;
    }
    .treePlus{
        display: inline-block;
        width: 19px;
        height: 19px;
        background: url(${ treePlus }) no-repeat;
    } */
`;
