import styled from 'styled-components';

import teamArrowDown from '../../TeamEditor/image/teamArrowDown.svg';
import treePlus from '../../TeamEditor/image/treePlus.svg';
import treeMinus from '../../TeamEditor/image/treeMinus.svg';
import treeEdit from '../../TeamEditor/image/treeEdit.svg';

import teamTableSearch from '../../TeamEditor/image/teamTableSearch.svg';
import addMemberIcon from '../image/addMemberIcon.svg';
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
    background-color: #222A38;

    .teamSubAside{
        display: block;
        width: 280px;
        height: 100%;
        background: #1B212C;
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
            background: ${(props) => props.theme.primary};
            font-size: 16px;
            font-weight: 700;
            padding-left: 20px;
            color: #1B212C;
        }

        > button:after{
            content: '';
            display: block;
            width: 16px;
            height: 9px;
            position: absolute;
            right: 25px;
            top: 50%;
            margin-top: -5px;
            background: url(${ teamArrowDown }) no-repeat center center;
        }

        > button.on:after {
            background: url(${ teamArrowDown }) no-repeat center center;
            transform: rotate(180deg);
        }

        > ul{
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            z-index: 10;
            background: #1B212C;
            display: none;
            box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);
        }

        > ul > li{
            border-bottom: 1px solid #2A3344;
            font-size: 14px;
            height: 56px;

            &:hover {
                background: ${(props) => props.theme.primary};
                color: #1B212C;
            }
        }

        > ul > li > a{
            display: block;
            padding: 20px;
            font-size: 16px;
            font-weight: 700;
        }
    }

    .sarEditBox{
        display: flex;
        position: absolute;
        top: 56px;
        left: 0;
        width: 280px;
        height: 56px;
        cursor: pointer;
        border-bottom: 1px solid #1B212C;
        background: #2A3344;

        > button{
            display: block;
            position: relative;
            width: 100%;
            height: 56px;
            text-align: left;
            background: #2A3344;
            font-size: 16px;
            font-weight: 700;
            padding-left: 20px;
            color: ${(props) => props.theme.fontPrimary};

            &:hover::after {
                filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
            }
        }

        > button:after{
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translate(0, -50%);
            background: url(${ addMemberIcon }) no-repeat;
        }
    }

    .memberInfoWrap {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        > button {
            ${(props) => props.theme.flex()};
            width: 100%;
            height: 56px;
            text-align: left;
            border-bottom: 1px solid #1B212C;
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
        margin: ${(props) => props.$isEditMode ? '112px 0 0px 20px' : '56px 0 0px 20px'};
        padding: 10px 0;
        color: ${(props) => props.theme.fontPrimary};
        overflow-y: auto;
    }

    .sarTree::-webkit-scrollbar {
        width: 6px;
        background: ${(props) => props.theme.background};
    }

    .sarTree::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.primary};
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
        color: ${(props) => props.theme.fontPrimary};
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
        background: ${(props) => props.theme.fontPrimary};
    }
    .salMenu.on {
        background: none;
    }
    .salMenu.on .salIco { 
        color: ${(props) => props.theme.fontPrimary};
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

    width: calc(100% - 280px);
    height: calc(100% - 50px);
    position: absolute;
    left: 280px;
    padding: 40px;

    ${(props) => props.theme.scroll()};

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
                color: ${(props) => props.theme.primary};
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                ${(props) => props.theme.userSelect()};

                &:hover {
                    color: ${(props) => props.theme.fontPrimary};
                }

                &:not(:first-child)::before {
                    content: ' > ';
                    display: inline-block;
                    margin: 0 5px;
                    color: ${(props) => props.theme.primary} !important;
                }
            }
        }

        .sctRht{
            display: flex;
            align-items: center;
        }

        .sctSch{
            display: flex;
            align-items: center;
            height: 31px;

            > a {
                display: inline-block;
                width: 28px;
                height: 28px;
                background: ${(props) => props.theme.primary} url(${ teamTableSearch }) no-repeat center center;
                background-size: 18px;
                cursor: pointer;
            }
        }

        .labelInputText{
            display: block;
            width: 470px;
            height: 30px;
            color: ${(props) => props.theme.fontPrimary};
        
            > input[type=text] {
                position: relative;
                width: 470px;
                height: 30px;
                border-radius: 2px;
                border: 0;
                border-top: 1px solid #29313E;
                border-left: 1px solid #29313E;
                border-bottom: 1px solid #29313E;
                background: #1B212C;
                color: ${(props) => props.theme.fontPrimary};
                padding-left: 10px;
                font-size: 12px;
            }
        }

        .sctAdd{
            width: 46px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            background-color: #1B212C;
            color: ${(props) => props.theme.fontPrimary};
            font-size: 14px;
            font-weight: 500;
            border-radius: 2px;
            border: 1px solid #29313E;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
                background-color: ${(props) => props.theme.primary};
                color: #1B212C;
            }
        }

        .sctDel{
            width: 46px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            background-color: #1B212C;
            color: ${(props) => props.theme.fontPrimary};
            font-size: 14px;
            font-weight: 500;
            border-radius: 2px;
            border: 1px solid #29313E;
            margin-left: 4px;
            cursor: pointer;

            &:hover {
                background-color: ${(props) => props.theme.primary};
                color: #1B212C;
            }
        }

        .memberListArea {
            width: 100%;
            height: calc(100% - 123px);
            background-color: #1A1F23;
            border-radius: 4px 4px 0 0;
            margin-top: 20px;

            & * {
                font-size: 14px;
            }

            .memberList {
                height: 100%;

                &.regular {
                    .head > div, 
                    .body > ul > li > div {
        
                        &:nth-of-type(1) {
                            width: 3%;
                            display: ${(props) => (props.$userLevel === AccountResource.accountLevelID.master || props.$userLevel === AccountResource.accountLevelID.admin) ? 'flex' : 'none' };
                            justify-content: center;
                            align-items: center;
                        }
        
                        &:nth-of-type(2) {
                            width: 3%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 10%;
                        }
                        
                        &:nth-of-type(4) {
                            width: 10%;
                        }
                        
                        &:nth-of-type(5) {
                            width: 10%;
                        }
                        
                        &:nth-of-type(6) {
                            width: 16%;
                        }
        
                        &:nth-of-type(7) {
                            width: 16%;
                        }
        
                        &:nth-of-type(8) {
                            width: 16%;
                        }
        
                        &:nth-of-type(9) {
                            width: 16%;
                        }
                    }
                }

                &.temporary {
                    .head > div, 
                    .body > ul > li > div > div {
        
                        &:nth-of-type(1) {
                            width: 3%;
                        }
        
                        &:nth-of-type(2) {
                            width: 3%;
                        }
                        
                        &:nth-of-type(3) {
                            width: 30%;
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
                            width: 30%;
                        }
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
                        background-color: ${(props) => props.theme.background};
                        position: absolute;
                        right: 40px;
                    }

                    > div {

                        &:not(:last-child) {
                            border-right: 1px solid ${(props) => props.theme.background};
                        }

                        height: 34px;
                        line-height: 33px;
                        text-align: center;
                        font-weight: 500;
                    }
                }

                .body {
                    background-color: #1B212C;
                    overflow-y: scroll;
                    height: calc(100% - 35px);

                    ${(props) => props.theme.scroll()};

                    ul {

                        li {
                            ${(props) => props.theme.flex()};
                            border-bottom: 1px solid #2A3344;

                            &:hover {
                                background-color: ${(props) => props.theme.primary};

                                div span {
                                    color: #1B212C;
                                }

                                input[type=checkbox] {
                                    border: 1.5px solid #1B212C;
                                }

                                input[type=checkbox]:checked {
                                    background: url(${check_mark_hover}) no-repeat center center;
                                }

                                input[type=text] {
                                    border: 1px solid #1B212C;
                                    color: #1B212C;
                                }

                                select {
                                    border: 1px solid #1B212C;
                                    color: #1B212C;
                                    background: url(${select_arrow_hover}) right 49% content-box no-repeat;
                                    padding-right: 4px;
                                }
                            }

                            &.colorOn > div > span {
                                color: ${(props) => props.theme.primary};
                            }

                            &.colorOn:hover > div > span {
                                color: #1B212C;
                            }

                            > div {
                                border-right: 1px solid #2A3344;
                            }

                            div {
                                height: 32px;
                                padding: 5px;
                                ${(props) => props.theme.flex('center', 'center')};

                                &:not(:nth-child(2), :nth-child(3)) {
                                    cursor: pointer;
                                    width: 100%;
                                }

                                input[type=text] {
                                    border: 1px solid ${(props) => props.theme.fontPrimary};
                                    border-radius: 0;
                                    height: 100%;
                                }

                                select {
                                    appearance: none;
                                    width: 100%;
                                    height: 100%;
                                    color: ${(props) => props.theme.fontPrimary};
                                    border: 1px solid ${(props) => props.theme.fontPrimary};
                                    border-radius: 0;
                                    cursor: pointer;
                                    background: url(${select_arrow_white}) right 49% content-box no-repeat;
                                    font-size: 14px !important;
                                    padding: 0 4px 0 10px;
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
        background: ${(props) => props.theme.fontPrimary};
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
        background: ${(props) => props.theme.primary} !important;
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
        color: ${(props) => props.theme.fontPrimary};
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

    .scprTop a { background: #1B212C;}
    .scprTop a:hover,
    .scprTop a:active,
    .scprTop a:focus { 
        background: ${(props) => props.theme.primary};
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
        color: ${(props) => props.theme.fontPrimary};
        text-align: center; 
        border-radius: 4px;
    }
    .scprTop a:hover,
    .scprTop a:active,
    .scprTop a:focus {
        background: #222;
    }

    .scprCont{
        padding: 20px;
    }
    .scprTb{
        border-left: solid 2px ${(props) => props.theme.fontPrimary};
        border-right: solid 2px ${(props) => props.theme.fontPrimary};
    }
    .scprTb tbody tr {
        cursor: pointer;
    }
    .scprTb tbody tr.on {
        background: #b61a33; 
        color: ${(props) => props.theme.fontPrimary};
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
        border-top: solid 2px #707070; 
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
        background: ${(props) => props.theme.primary} !important;
        border-color: ${(props) => props.theme.primary} !important;
        color: ${(props) => props.theme.fontPrimary} !important; 
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
        font-size: 26px; 
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
        border-color: #707070; 
        color: #000;
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
        color: ${(props) => props.theme.fontPrimary};
        padding: 6px; 
        table-layout: fixed; 
    }
    .scTb tr { 
        height: 34px; 
        cursor: pointer; 
    }
    .scTb tr.on {
        background: ${(props) => props.theme.primary};
    }
    .scTb th,
    .scTb td {
        text-align: center; 
        font-size: 12px; 
        color: ${(props) => props.theme.fontPrimary};
        vertical-align: middle; 
        border: 1px solid #485775;
        ${(props) => props.theme.overText()};
    }
    .scTb th {
        font-weight: 500; 
        color: ${(props) => props.theme.fontPrimary};
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
        background-color: #1B212C;
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
        color: ${(props) => props.theme.fontPrimary};
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
        background: ${(props) => props.theme.fontPrimary};
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
        background: ${(props) => props.theme.fontPrimary};
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
        color: ${(props) => props.theme.fontPrimary};
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
        color: ${(props) => props.theme.fontPrimary};
        overflow-y: auto;
    }

    .sarTree::-webkit-scrollbar {
        width: 6px;
        background: ${(props) => props.theme.background};
    }

    .sarTree::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.primary};
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
        background: ${(props) => props.theme.fontPrimary};
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
        background: ${(props) => props.theme.fontPrimary};
        border-color: ${(props) => props.theme.fontPrimary};
    }

    .treeview i:before,
    .treeview i:after {
        content: '';
        display: block;
        background: #1B212C;
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
        background: ${(props) => props.theme.fontPrimary};
        border-color: ${(props) => props.theme.fontPrimary};
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
        color: ${(props) => props.theme.fontPrimary};
        max-width: calc(100% - 39%);
        margin-right: 10px;
        ${(props) => props.theme.overText()};
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
        color: ${(props) => props.theme.fontPrimary};
        margin-right: 10px;
        ${(props) => props.theme.overText()};
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
        color: ${(props) => props.theme.fontPrimary};
        text-decoration: none;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .treeview.wk a:focus:before,
    .treeview.wk a:hover:before {
        background: ${(props) => props.theme.fontPrimary};
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
        ${(props) => props.theme.overText()};
    }

    .treeview a:hover {
        color: ${(props) => props.theme.primary};
    }

    .select { 
        color: ${(props) => props.theme.primary} !important; 
        margin-right: 10px;
    }
    .selected { 
        color: ${(props) => props.theme.primary} !important; 
        margin-right: 10px;
    }

    .wordIength {
        display: inline-block;
        font-size: 16px;
        max-width: calc(62%) !important;
        ${(props) => props.theme.overText()};
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
        color: ${(props) => props.theme.fontPrimary};
        margin-right:6px; 
    } 
    .selected .editArea .treePlus:hover{ 
        display:inline-block; 
        width: 20px; 
        height: 20px; 
        filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%);
        float:right; 
        color: ${(props) => props.theme.fontPrimary};
    }
    .selected .editArea .treeMinus{ 
        display: block; 
        width: 20px; 
        height: 20px; 
        background: url(${ treeMinus }) no-repeat;
        float: right; 
        color: ${(props) => props.theme.fontPrimary};
    } 
    .selected .editArea .treeMinus:hover{ 
        display:inline-block; 
        width: 20px; 
        height:20px; 
        filter: invert(48%) sepia(60%) saturate(5096%) hue-rotate(185deg) brightness(103%) contrast(107%); 
        float:right; 
        color: ${(props) => props.theme.fontPrimary};
    }
    .selected .editArea { 
        visibility:visible; 
        display:inline-block; 
        position:absolute; 
        right: 8px;
    }
    .labelInput{
        display: inline-block;
        color: ${(props) => props.theme.fontPrimary};
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
