
import styled from 'styled-components';

/* image파일 import */
import Process from '../../SOPManager/images/process.png';
import Decision from '../../SOPManager/images/explanation.png';
import Annotation from '../../SOPManager/images/judgment.png';
import EndPoint from '../../SOPManager/images/startEnd.png';
import Internal from '../../SOPManager/images/internal.png';

import NewSopIconImage from '../../SOPManager/images/newSopIcon.png';
import SopOpenIconImage from '../../SOPManager/images/folderOpenIcon.png';
import FileOpenIconImage from '../../SOPManager/images/fileOpenIcon.png';
import boolean from '../../SOPManager/images/boolean.png';

import sopMenuArrowDown from '../../SOPManager/images/sopMenuArrowDown.png';
import sopMenuArrowUp from '../../SOPManager/images/sopMenuArrowUp.png';
import SopManagerResource from '../resource/id';

import newSopIcon from '../images/newSopIcon.svg';
import newSopIcon_disabled from '../images/newSopIcon_disabled.svg';
import sopOpenIcon from '../images/sopOpenIcon.svg';
import openXMLIcon from '../images/openXMLIcon.svg';
import openXMLIcon_disabled from '../images/openXMLIcon_disabled.svg';
import sopOpenIcon_disabled from '../images/sopOpenIcon_disabled.svg';
import sopTrashIcon from '../images/sopTrashIcon.svg';
import sopTrashIcon_disabled from '../images/sopTrashIcon_disabled.svg';
import sopSaveIcon from '../images/sopSaveIcon.svg';
import sopSaveIcon_disabled from '../images/sopSaveIcon_disabled.svg';
import saveXMLIcon from '../images/saveXMLIcon.svg';
import saveXMLIcon_disabled from '../images/saveXMLIcon_disabled.svg';


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
        background: #2A3344;
        padding: 24px 40px;
    }

    #tooltipArea{
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.75rem; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }

    .subAside{
        position: absolute;
        left: 29px;
        top: 25px;
    }

    .hidden {
        display: none;
    }
`;


/* sopManagerContent.jsx */
/* SOP편집 메인화면 */
export const SopManagerContentComponent = styled.div`
    
    .salCont dd {
        ${({ theme }) => theme.mixins.flex('center', 'center')};
    }

    .salCont dd span:hover:before { 
        margin-right: 45px; 
        z-index: 2; 
        opacity: 1;
    } 

    .salCont dd span {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-bottom: 15px;
        color: transparent;
        position: relative;
    }

    .salCont dd div {
        margin-bottom: 15px;
        width: 32px;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.grayscale.g700};
    }

    .salCont dd span::before { 
        display: block; 
        background: ${({ theme }) => theme.colors.white};
        border-radius: 4px;
        color: ${({ theme }) => theme.colors.black};
        opacity: 0; 
        font-size: 0.8125rem; 
        font-family: 'Spoqa Han Sans Neo', 'sans-serif'; 
        font-weight: 400; 
        position: absolute; 
        left: 58px;
        top: 50%;
        transform: translate(0, -50%);
        padding: 0 8px; 
        height: 26px; 
        line-height: 26px; 
        white-space: nowrap;
    }

    .salCont dd span::after { 
        content: " ";
        position: absolute;
        border-right: 5px solid ${({ theme }) => theme.colors.white};
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        left: 53px;
        top: 50%;
        transform: translate(0, -50%);
        opacity: 0; 
    }

    .salCont dd span:hover::before,
    .salCont dd span:hover::after { 
        margin-right: 45px; 
        opacity: 1.0; 
        z-index: 2; 
    } 

    .salCont dd:nth-child(1) span:before { 
        content: '새 SOP 생성'; 
    }
    .salCont dd:nth-child(3) span:before { 
        content: '목록열기'; 
    }
    .salCont dd:nth-child(4) span:before { 
        content: '불러오기'; 
    }
    .salCont dd:nth-child(6) span:before { 
        content: '삭제하기'; 
    }
    .salCont dd:nth-child(8) span:before { 
        content: '저장하기'; 
    }
    .salCont dd:nth-child(9) span:before { 
        content: '내보내기'; 
    }
    
    .newSOPIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${newSopIcon_disabled})` : `url(${newSopIcon})`};
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopOpenIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${sopOpenIcon_disabled})` : `url(${sopOpenIcon})`};
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopSaveIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? `url(${sopSaveIcon_disabled})` : `url(${sopSaveIcon})`};
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? 'default !important' : 'pointer'};
    }

    .sopSaveAsIcon{
        background: url(./../../resource/image/sopManager/sopSaveAsIcon.png) center center;
    }

    .sopDeleteIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${sopTrashIcon_disabled})` : `url(${sopTrashIcon})`};
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopOpenXMLIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? `url(${openXMLIcon_disabled})` : `url(${openXMLIcon})`};
        cursor: ${(props) => props.$menu === SopManagerResource.menu.newSOP ? 'default !important' : 'pointer'};
    }

    .sopSaveXMLIcon{
        background: ${(props) => props.$menu === SopManagerResource.menu.newSOP || props.$disabled === null ? `url(${saveXMLIcon_disabled})` : `url(${saveXMLIcon})`};
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
        background: ${({ theme }) => theme.colors.primary.p500};
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
            background: ${({ theme }) => theme.colors.primary.p500};
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
    background: #2A3344;
    padding-left: 320px;
    padding-right: 360px;
    position: relative;
    overflow: hidden;

    .sopProcessLeft{
        display: block;
        width: 303px;
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        border-radius: 8px;
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
        font-size: 1.125rem; 
        color: ${({ theme }) => theme.colors.grayscale.g300}; 
        font-weight: 700; 
        position: relative; 
        letter-spacing: -0.075em; 
        ${({ theme }) => theme.mixins.flex()};

        > svg {
            color: inherit;
            fill: currentColor;
        }
    }
    .sopAcdn > dt:first-child {
        border-top: none; 
        border-top-left-radius: 6px; 
        border-top-right-radius: 6px; 
    }
    .sopAcdn > dt.last {
        border-bottom: solid 1px #8fb1f2;
    }
    .sopAcdn > dt.on {
        background: #0D121A;
        color: ${({ theme }) => theme.colors.primary.p500}; 
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
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.875rem; 
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
        font-size: 1.25rem; 
        font-weight: 700;
    }

    .sopEdtRdo{
        display: block;
        padding-bottom: 30px;

        > li{
            float: left;
        }
        > li > label{
            color: ${({ theme }) => theme.colors.white};
            font-size: 0.75rem;
            font-weight: 400;
            margin-right: 20px;
            margin-left: 0;
        }
    }

    .labelInputRadio{
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.colors.white};
    }

    input[type=radio]:checked+label {
        color: ${({ theme }) => theme.colors.white};
    }

    .sopEdtRdo2{
        display: block;
        padding-top: 10px;
        border-top: dashed 1px #384355;

        > li{
            float: left;
        }
        > li > label{
            width: 64px;
            height: 25px;
            line-height: 22px;
            color: ${({ theme }) => theme.colors.white};
            font-size: 0.75rem;
            font-weight: 400;
            margin-right: 20px;
            border: solid 1px ${({ theme }) => theme.colors.grayscale.g300};
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
        font-size: 1rem;
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
        ${({ theme }) => theme.mixins.scroll("transparent")}
    }

    .sopEdtCpnt{
        display: block;
        text-align: center;

        > li{
            margin-bottom: 10px;
            border-bottom: dashed 1px #384355;
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
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 0.8125rem;
            ${({ theme }) => theme.mixins.scroll()};
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
        }
        ${({ theme }) => theme.mixins.scroll()};
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
            font-size: 0.875rem;
            color: ${({ theme }) => theme.colors.white};
        }
        > select{
            display: block;
            width: 100%;
            height: 35px;
            border-radius: 4px;
            padding-left: 5px;
            background: ${({ theme }) => theme.colors.background.surface};
            border: solid 1px ${({ theme }) => theme.colors.grayscale.g700};
            color: ${({ theme }) => theme.colors.grayscale.g20};
            font-size: 0.8125rem;
        }
        > select > option{
            color: ${({ theme }) => theme.colors.white};
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
        padding-top: 56px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
    }

    .spcTop{
        background: #0D121A;
        height: 56px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        overflow: hidden;
        ${({ theme }) => theme.mixins.flex()};

        > li{
            flex: 1;
            border-right: dashed 1px #384355;
        }

        > li:last-child{
            border-right: none;
        }

        > li > p {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            cursor: pointer;
            color: ${({ theme }) => theme.colors.primary.p500};

            > svg {
                color: inherit;
                fill: currentColor;
            }
        }
    }

    .spcWrap{
        display: block;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        padding-left: 20px;
        padding-right: 20px;
    }
    .sopTitle{
        display: block;
        height: 50px;
        line-height: 50px;
        color: ${({ theme }) => theme.colors.white};
        font-size: 1.125rem;
        text-align: left;
        font-weight: 500;
    }
    .spcCont{
        display: block;
        height: 91%;
        background: ${({ theme }) => theme.colors.white};
        color: #505050 !important;
        position: relative;
        overflow: hidden;
        ${({ theme }) => theme.mixins.scroll()};
    }
    .spRht{
        display: block;
        width: 341px;
        background: ${({ theme }) => theme.colors.background.surface};
        color: #505050;
        padding-top: 56px;
        border-radius: 8px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: hidden;
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
        border: 2px dashed #000;
        background: #F4F5F6;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        gap: 24px;

        > button {
            border-radius: 8px !important;
            padding: 0 20px !important;

            svg {
                color: inherit;
                fill: currentColor;
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
