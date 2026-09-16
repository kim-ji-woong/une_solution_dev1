
import styled from 'styled-components';

/* image파일 import */
import Process from '../../SOPManager/image/process.png';
import Decision from '../../SOPManager/image/explanation.png';
import Annotation from '../../SOPManager/image/judgment.png';
import EndPoint from '../../SOPManager/image/startEnd.png';
import Internal from '../../SOPManager/image/internal.png';

import Copy from '../../SOPManager/image/copyIcon.png';
import Cut from '../../SOPManager/image/cutIcon.png';
import Paste from '../../SOPManager/image/pasteIcon.png';
import Del from '../../SOPManager/image/delIcon.png';

import NewSopIconImage from '../../SOPManager/image/newSopIcon.png';
import SopOpenIconImage from '../../SOPManager/image/folderOpenIcon.png';
import FileOpenIconImage from '../../SOPManager/image/fileOpenIcon.png';
import boolean from '../../SOPManager/image/boolean.png';

import sopMenuArrowDown from '../../SOPManager/image/sopMenuArrowDown.png';
import sopMenuArrowUp from '../../SOPManager/image/sopMenuArrowUp.png';
import SopManagerResource from '../resource/id';

import newSopIcon_disabled from '../image/newSopIcon_disabled.png';
import sopOpenIcon_disabled from '../image/sopOpenIcon_disabled.png';
import sopTrashIcon_disabled from '../image/sopTrashIcon_disabled.png';
import openXMLIcon_disabled from '../image/openXMLIcon_disabled.png';


/* sopManager.jsx */
export const SopManagerComponent = styled.div`
    #subPage{
        position: absolute; 
        top: 0;
        left: 0;
        width: 100%; 
        height: 100vh;
        margin-top: 50px;
        user-select: none;
        background: ${(props) => props.theme.systemMainBackground};
    }

    #tooltipArea{
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 12px; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }

    .subAside{
        display: block;
        width: 60px;
        height: 508px;
        border-radius:10px;
        position: absolute;
        left: 0;
        top: -10px;
    }

    .hidden {
        display: none;
    }
`;


/* sopManagerContent.jsx */
/* SOP편집 메인화면 */
export const SopManagerContentComponent = styled.div`
    .sopMLeft{
        width: 120px;
        height: 100%;
        float: left;
    }

    .aslWrap{

    }
    .typeC{
        background: #457de9;
    }

    .salMenu{
        display: block;
        background: ${(props) => props.theme.systemMainBackground};

        dd > a > span {
            cursor: pointer;
        }
    }
    
    .salCont dd a:hover:before { 
        margin-right: 45px; 
        z-index: 2; 
        opacity: 1;
    } 

    .salCont{
        display: block;
        padding-left: 30px;
        position: relative;
        background: ${(props) => props.theme.systemMainBackground};
        top: 22px;
    } 

    .salCont dd:nth-child(1) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s !important; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 6%;
        padding: 0 5px; 
        padding-left: 16px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap;
    }
    .salCont dd:nth-child(2) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 23%; 
        padding: 0 5px; 
        padding-left: 22px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap; 
    }
    .salCont dd:nth-child(3) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 40%; 
        padding: 0 5px; 
        padding-left: 22px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap; 
    }
    .salCont dd:nth-child(4) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 56%; 
        padding: 0 5px; 
        padding-left: 22px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap; 
    }
    .salCont dd:nth-child(5) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 73%; 
        padding: 0 5px; 
        padding-left: 12px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap; 
    }
    .salCont dd:nth-child(6) a:before { 
        display: block; 
        background: url(${boolean}) no-repeat;
        color: ${(props) => props.theme.defaultFontColor};
        opacity: 0; 
        transition: all 1.0s; 
        font-size: 13px; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 72%;
        top: 90%; 
        padding: 0 5px; 
        padding-left: 12px; 
        width: 100px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap; 
    }

    .salCont dd a:hover:before { 
        margin-right: 45px; 
        opacity: 1.0; 
        z-index: 2; 
    } 

    .salCont dd:nth-child(1) a:before { 
        content: '새 SOP'; 
    }
    .salCont dd:nth-child(2) a:before { 
        content: '열기'; 
    }
    .salCont dd:nth-child(3) a:before { 
        content: '저장'; 
    }
    .salCont dd:nth-child(4) a:before { 
        content: '삭제'; 
    }
    .salCont dd:nth-child(5) a:before { 
        content: '파일열기'; 
    }
    .salCont dd:nth-child(6) a:before { 
        content: '파일저장'; 
    }
    
    .newSOPIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${newSopIcon_disabled})` : 'url(./../../resource/image/sopManager/newSopIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopOpenIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${sopOpenIcon_disabled})` : 'url(./../../resource/image/sopManager/sopOpenIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopSaveIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? 'url(./../../resource/image/sopManager/sopSaveIcon_disabled.png)' : 'url(./../../resource/image/sopManager/sopSaveIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? 'default !important' : 'pointer'};
    }

    .sopSaveAsIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: url(./../../resource/image/sopManager/sopSaveAsIcon.png) center center;
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
    }

    .sopDeleteIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${sopTrashIcon_disabled})` : 'url(./../../resource/image/sopManager/sopTrashIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopOpenXMLIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${openXMLIcon_disabled})` : 'url(./../../resource/image/sopManager/openXMLIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopSaveXMLIcon{
        display: inline-block;
        width: 44px;
        height: 44px;
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? 'url(./../../resource/image/sopManager/saveXMLIcon_disabled.png)' : 'url(./../../resource/image/sopManager/saveXMLIcon.png)'};
        color: #215336;
        margin-bottom: 4px;
        font-size: 0px;
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? 'default !important' : 'pointer'};
    }
`;


/* sopManagerBody.jsx */
export const SOPManagerBodyComponent = styled.div`
    .sopCont{
        left: 86px;
        width: Calc(100% - 115px);
        height: calc(100% - 100px);
        position: absolute;
        top: 25px;
    }
`;


/* panelAreas.jsx */
export const PanelAreasComponent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .sectionPanels {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: auto;
    }

    .scrollbar { 
        overflow-y: auto;
    }
    .scrollbar::-webkit-scrollbar { 
        width: 6px;
        background: none;
    }
    .scrollbar::-webkit-scrollbar-thumb { 
        background: ${(props) => props.theme.primary};
        opacity: .4;
    }
    .scrollbar::-webkit-scrollbar-track { 
        background: none;
    }
    .sectionPanels{
        width: 100%;
        height: 100%;
        display: flex;
        overflow: auto;
    }

    .sectionPanels > .sectionPanel > ._sectionGrid_ > .sectionGridColumn > .sectionGridCell:hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        border: 2px solid yellow;
    }

    .panelScrollbar{
        overflow-y: auto;

        .panelScrollbar::-webkit-scrollbar { 
            width: 6px; 
            height: 6px; 
            background: none; 
            border-radius: 3px; 
        }
        .panelScrollbar::-webkit-scrollbar-thumb { 
            background: ${(props) => props.theme.primary};
            border-radius: 3px; 
            opacity: .4; 
        }
        .panelScrollbar::-webkit-scrollbar-track { 
            background: none;
        }
    }
`;


/* sopManagerBodyMain.jsx */
/* SOP편집 chart창 */
export const SOPManagerBodyMainComponent = styled.div`
    display: block;
    height: 100%;
    background: ${(props) => props.theme.systemMainBackground};
    padding-left: 320px;
    padding-right: 360px;
    position: relative;
    overflow: hidden;

    .sopProcessLeft{
        display: block;
        width: 303px;
        height: 100%;
        background: ${(props) => props.theme.sopBoxBackground};
        border-radius: 6px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .scrollbarOuter{
        height: 100%;
    }

    .sopAcdn li {
        list-style: none;
    }
    .sopAcdn > dt {
        height: 56px; 
        line-height: 56px; 
        cursor: pointer; 
        padding: 0 15px; 
        font-size: 16px; 
        color: #485775; 
        font-weight: 700; 
        position: relative; 
        letter-spacing: -0.075em; 
    }
    .sopAcdn > dt:first-child {
        border-top: none; 
        border-top-left-radius: 6px; 
        border-top-right-radius: 6px; 
    }
    .sopAcdn > dt.last {
        border-bottom: solid 1px #8fb1f2;
    }
    .sopAcdn > dt:after {
        content: ''; 
        display: block; 
        width: 18px; 
        height: 13px; 
        position: absolute; 
        right: 15px; 
        top: 50%; 
        margin-top: -4px; 
        background: url(${sopMenuArrowDown});
        background-size: 100% auto;
    }
    .sopAcdn > dt.on {
        background: ${(props) => props.theme.sopTitleBackground};
        color: ${(props) => props.theme.primary}; 
    } 
    .sopAcdn > dt.on:after {
        background-position: center top; 
        background: url(${sopMenuArrowUp});
    }
    .sopAcdn > dd {
        padding: 15px; 
        display: none;
    }
    .sopAcdn > dd.on {
        display: block;
    }

    .sopEdt1{
        display: block;
        height: 110px;
    }

    .sopEdtTitle {
        margin-bottom: 10px;
    }
    .sopEdtTitle:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .sopEdtTitle span {
        display: block; 
        width: 64px;
        height: 25px; 
        line-height: 25px; 
        text-align: center; 
        float: left; 
        color: ${(props) => props.theme.fontPrimary};
        font-size: 14px; 
        font-weight: 400; 
        margin-right: 10px;
        border-radius: 19px;
    }
    .sopEdtTitle span.grn {
        background: #007BCC;
    }
    .sopEdtTitle span.ylw {
        background: #F2BE08;
    }
    .sopEdtTitle span.org {
        background: #FF6D00;
    }
    .sopEdtTitle span.hpk {
        background: #E80800;
    }
    .sopEdtTitle h4 {
        float: left; 
        height: 30px; 
        line-height: 30px; 
        font-size: 20px; 
        font-weight: 700;
    }

    .sopEdtRdo{
        display: block;
        padding-bottom: 30px;

        > li{
            float: left;
        }
        > li > label{
            color: ${(props) => props.theme.fontPrimary};
            font-size: 12px;
            font-weight: 400;
            margin-right: 20px;
            margin-left: 0;
        }
    }

    .labelInputRadio{
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.fontPrimary};
    }

    input[type=radio] {
        background: ${(props) => props.theme.fontPrimary};
        margin-right: 4px;
    }

    input[type=radio]:checked+label {
        color: ${(props) => props.theme.fontPrimary};
    }

    .sopEdtRdo2{
        display: block;
        padding-top: 10px;
        border-top: dashed 0.5px #485775;

        > li{
            float: left;
        }
        > li > label{
            width: 64px;
            height: 25px;
            line-height: 22px;
            color: ${(props) => props.theme.fontPrimary};
            font-size: 12px;
            font-weight: 400;
            margin-right: 20px;
            border: solid 1px #485775;
        }
    }

    .sopMode {
        display: block;
        width: 50px;
        height: 30px;
        line-height: 27px;
        text-align: center;
        float: left;
        color: brown;
        font-size: 16px;
        font-weight: 500;
        margin-right: 10px;
        border-radius: 4px;
        border: 1px solid black;
        margin-left: 0;
    }

    .sopEdt2{
        display: block;
        height: 350px;
        overflow-y: scroll;
    
        ${(props) => props.theme.scroll("transparent")};
    }

    .sopEdtCpnt{
        display: block;
        text-align: center;

        > li{
            margin-bottom: 10px;
            border-bottom: dashed 1px #485775;
            padding: 10px 0px 20px 0px;
            cursor: pointer;
        }
        > li:last-child{
            border: none;
        }
    }

    .sopEdt3{
        display: block;

        > textarea{
            background: ${(props) => props.theme.sopBoxBackground};
            color: ${(props) => props.theme.fontPrimary};
            font-size: 13px;
            ${(props) => props.theme.scroll()};
            border: 1px solid #485775 !important;
        }
        ${(props) => props.theme.scroll()};
    }

    .sopEdtTpy{
        display: block;
        padding-left: 70px;
        margin-bottom: 10px;
        position: relative;

        > span{
            display: block;
            height: 35px;
            line-height: 36px;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 14px;
            color: ${(props) => props.theme.fontPrimary};
        }
        > select{
            display: block;
            width: 100%;
            height: 35px;
            border-radius: 4px;
            padding-left: 5px;
            background: ${(props) => props.theme.sopBoxBackground};
            border: solid 1px #485775;
            color: ${(props) => props.theme.fontPrimary};
            font-size: 13px;
        }
        > select > option{
            color: ${(props) => props.theme.fontPrimary};
        }
    }

    .sopEdtText {
        border: solid 1px #aaa !important;
        border-radius: 4px;
        resize: none;
        width: 100%;
        line-height: 200%;
    }

    .scroll-textarea.sopEdtText > .scroll-content > textarea {
        height: 198px !important; 
        padding: 10px !important;
    }

    .sopCent{
        display: block;
        height: 100%;
        padding-top: 40px;
        border-radius: 4px;
        position: relative;
    }

    .spcTop{
        display: block;
        background: ${(props) => props.theme.sopTitleBackground};
        height: 46px;
        padding-top: 8px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        overflow: hidden;

        > li{
            display: flex;
            justify-content: center;
            float: left;
            width: 25%;
            border-right: dashed 1px #485775;
        }
        > li:last-child{
            border-right: none;
        }
        > li > p{
            line-height: 30px;
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            cursor: pointer;
            color: ${(props) => props.theme.primary};
        }
    }

    .sopTopCopy{
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: ${(props) => props.theme.sopGridBtnBackground};
        color: ${(props) => props.theme.primary};
        font-size: 16px;
        margin-right: 4px;
        text-align: center;
        background: url(${ Copy }) no-repeat center center;
        cursor: pointer;
    }

    .sopTopCut{
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: ${(props) => props.theme.sopGridBtnBackground};
        color: ${(props) => props.theme.primary};
        font-size: 16px; 
        margin-right: 4px;
        text-align: center;
        background: url(${ Cut }) no-repeat center center;
        cursor: pointer;
    }

    .sopTopPaste{
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: ${(props) => props.theme.sopGridBtnBackground};
        color: ${(props) => props.theme.primary};
        font-size: 16px;
        margin-right: 4px;
        text-align: center;
        background: url(${ Paste }) no-repeat center center;
        cursor: pointer;
    }
    .sopTopDel{
        display: block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: ${(props) => props.theme.sopGridBtnBackground};
        color: ${(props) => props.theme.primary};
        font-size: 16px;
        margin-right: 4px;
        text-align: center;
        background: url(${ Del }) no-repeat center center;
        cursor: pointer;
    }
    .spcWrap{
        display: block;
        width: 100%;
        height: 100%;
        background: ${(props) => props.theme.sopBoxBackground};
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 4px;
    }
    .sopTitle{
        display: block;
        height: 50px;
        line-height: 50px;
        background: ${(props) => props.theme.sopBoxBackground};
        color: ${(props) => props.theme.primary};
        font-size: 18px;
        text-align: left;
        font-weight: bold;
    }
    .spcCont{
        display: block;
        height: 91%;
        background: ${(props) => props.theme.fontPrimary};
        color: #505050 !important;
        position: relative;
        overflow: hidden;
        ${(props) => props.theme.scroll()};
    }
    .spRht{
        display: block;
        width: 341px;
        background: ${(props) => props.theme.sopBoxBackground};
        color: #505050;
        padding-top: 50px;
        border-radius: 4px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
    }
`;


/* SectionGridDefault.jsx */
/* SOP편집 grid 버튼 */
export const SectionGridDefaultComponent = styled.div`
    margin-top: 50px;
    margin-left: 50px;
    width: 70%;
    height: 94%;
    z-index: 98;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;

    .defaultGridArea{
        width: 80%;
        height: 46%;
        min-width: 600px;
        min-height: 300px;
        background-color: rgba(112, 112, 112, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 3px dashed black;
        position: relative;
        left: 15%;
    }
    .defaultButtonAreaV{
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
    }
    .defaultButtonAreaH{
        display: flex;
        height: 100%;
        justify-content: space-between;

        > button{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 153px;
            height: 47px;
            line-height: 47px;
            text-align: center;
            color: ${(props) => props.theme.primary};
            background: ${(props) => props.theme.sopBoxBackground};
            border-radius: 7px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0px 6px 6px #00000029;

            &:not(:last-child) {
                margin-right: 20px;
            }
        } 
    }

    .newSopIconN{
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url(${ NewSopIconImage }) no-repeat center center;
        margin-right: 6px;
    }
    .sopOpenIconN{
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url(${ SopOpenIconImage }) no-repeat center center;
        margin-right: 6px;
    }
    .fileOpenIconP{
        display: inline-block; 
        width: 26px;
        height: 26px;
        background: url(${ FileOpenIconImage }) no-repeat;
        margin-right: 6px;
    }
`;


/* image */
export const ProcessShape = styled.div`
    display: inline-block;
    width: 174px;
    height: 53px;
    background: url(${ Process }) no-repeat;
`;

export const DecisionShape = styled.div`
    display: inline-block;
    width: 174px;
    height: 59px;
    background: url(${ Decision }) no-repeat;
`;

export const AnnotationShape = styled.div`
    display: inline-block; 
    width: 166px;
    height: 70px;
    background: url(${ Annotation }) no-repeat;
`;

export const EndpointShape = styled.div`
    display: inline-block;
    width: 174px;
    height: 53px;
    background: url(${ EndPoint }) no-repeat;
`;

export const InternalShape = styled.div`
    display: inline-block;
    width: 174px;
    height: 53px;
    background: url(${ Internal }) no-repeat;
`;
