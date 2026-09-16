import styled from 'styled-components';

import iconLeftt from '../images/iconArrowLeft.svg'
import iconPlus from '../images/iconPlus.svg'
import iconArrowLeft from '../images/iconArrowLeft.svg'
import iconMod from '../images/sopEditIcon.svg'
import iconPlay from '../images/sopPlayIcon.svg'
import iconEnd from '../images/sopOutIcon.svg'
import resetIcon from '../images/icon_Reset.svg'
import eyeOpen from '../../Common/images/chart/eye_open.png'
import eyeCl from '../../Common/images/chart/eye_cl.png'

import btnArrowUp_normal from '../../Common/images/chart/btnArrowUp_normal.png'
import btnArrowUp_dark from '../../Common/images/chart/btnArrowUp_dark.png'
import btnArrowDown_normal from '../../Common/images/chart/btnArrowDown_normal.png'
import btnArrowDown_dark from '../../Common/images/chart/btnArrowDown_dark.png'
import btnArrowLeft_normal from '../../Common/images/chart/btnArrowLeft_normal.png'
import btnArrowLeft_dark from '../../Common/images/chart/btnArrowLeft_dark.png'
import btnArrowRight_normal from '../../Common/images/chart/btnArrowRight_normal.png'
import btnArrowRight_dark from '../../Common/images/chart/btnArrowRight_dark.png'
import check_mark_holiday from '../../Common/images/check_mark_holiday.png';


/*sopSimulatorCall*/
export const SopSimulatorBodyComponent = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 70px 0 20px 0;
    margin-top: 46px;
    height: calc(100% - 40px);
    overflow-y:hidden;
    user-select: none;
    background-color: #2A3344;
    padding-top: 60px;

    .appContainer{
        height:100%;
        padding: 30px 30px 10px 30px; 
    }
    .pgProgress{
        position:relative;
        padding-left: 373px;
        transition:padding-left .5s ease-in-out;

        &.isHidden {
            padding-left: 40px;
        }

        &.isHidden .progressHistoryWrap {
            position:absolute;
            left:-340px;
            overflow:visible;
        }

        &.isHidden .progressHistoryWrap .btnToggle {
            right:-40px;
            padding-left:10px;
            border-bottom-right-radius:4px;
        }

        &.isHidden .btnToggle .iconArrowLeft {
            width:28px; 
            height:28px; 
            background:url(${iconArrowLeft}) no-repeat;
            background-position: center;
            transform: rotate(180deg);
        }

        &.isHidden .progressViewWrap {
            width:calc(50% - 10px);
        }

        &.isHidden .taskListWrap {
            width:calc(50% - 10px);
        }
    }

    .tabArea{
        position:absolute; 
        top:-30px;
        left:0; 
        width:100%; 
        padding:0 30px;
    }
    .tabArea ul{ 
        max-width: 97vw;  
        white-space:nowrap; 
        overflow-x:hidden; 
        display: flex; 
    } 
    .tabArea li{ 
        display:inline-block; 
    }
    .tabArea li + li{
        margin-left:9px;
    }

    .tabArea li a{
        display:block; 
        width: 200px;
        height:38px; 
        padding:10px 18px; 
        font-size:1rem; 
        font-weight: 500; 
        letter-spacing: -0.48px;
        border-radius: 8px;
        text-align:center; 
        background-color: #384355;
        color: ${({ theme }) => theme.colors.grayscale.g200};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }
    .tabArea li a.plus {
        display:block; 
        position: absolute; 
        width: 38px; 
        height: 38px; 
        border-radius: 5px;  
        cursor:pointer;
        background: #0D121A url(${iconPlus}) no-repeat; 
        background-repeat: no-repeat; 
        background-position:center;
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    } 
    .tabArea li:last-child{ 
        text-overflow:ellipsis;
    }
    .tabArea li.isActive a{
        color: ${({ theme }) => theme.colors.primary.p600};
        background: ${({ theme }) => theme.colors.primary.p75};
        border: 1px solid ${({ theme }) => theme.colors.primary.p600};
    } 

    .squaree { 
        float:left; 
        display: flex; 
        gap: 5px; 
        height:38px; 
        width:56px; 
        margin-right: 12px;
    } 
    .leftt { 
        width: 50%;  
        background: #0D121A url(${iconLeftt}); 
        background-repeat: no-repeat; 
        background-position: center; 
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
        border-radius: 4px;
        cursor:pointer;

        &:hover {
            background-color:#182630; 
            border-radius:3px;
        }
    }
    .rightt {
        flex-grow: 1;
        width: 50%;  
        background: #0D121A url(${iconLeftt}); 
        background-repeat: no-repeat;
        background-position: center;
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
        border-radius: 3px; 
        transform: rotate(180deg); 
        cursor:pointer;

        &:hover {
            background-color:#182630; 
            border-radius:3px;
        }
    }
`;


export const SopSimulatorCallComponent = styled.section`
    height: calc(-50px + 100vh);
    overflow-y: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 50px;
    height: 100vh;
    overflow-y:hidden;
    user-select: none;
    background: #2A3344;

    &::after{
        content:'';
        display:block; 
        clear:both;  
    }

    .appContainer > section{
        float:left; 
        height:100%; 
        border-radius:8px; 
        background: ${({ theme }) => theme.colors.background.surface}; 
        overflow: hidden;
    }

    .appContainer .innerSection{ 
        max-height:calc(100% - 60px); 
        overflow-y:auto; 
        background-color:${({ theme }) => theme.colors.background.surface}; 
        cursor:pointer;
    } 

    .innerSection::-webkit-scrollbar { 
        width: 7px; 
        height: 7px; 
    }
    .innerSection::-webkit-scrollbar-thumb { 
        width: 7px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        border-radius: 10px; 
    }
    .innerSection::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }
    
    .appContainer{
        height: 100%;
        padding: 20px 40px;

        > section:not(.progressHistoryWrap) {
            float:left; 
            height:100%; 
            border-radius: 8px;
        }
    }
    .subSection{
        float:left; 
        height:calc(100% + 5px); 
        border-radius:4px; 
    }
    .menualListWrap { 
        width: 362px; 
        margin-right: 20px; 
    }
    .menualListWrap .list dt{
        height:56px; 
        line-height: normal; 
        padding:15px 26px 15px 23px; 
        font-size:1.125rem;
        font-weight:500;
        letter-spacing:-0.05em;
        cursor:pointer;
        border-radius:3px; 
        color: ${({ theme }) => theme.colors.grayscale.g300}; 
    }
    .menualListWrap .list dt:hover,
    .menualListWrap .list.isShow dt{ 
        background: #0D121A; 
        color: ${({ theme }) => theme.colors.primary.p500}; 
    }
    .menualListWrap .list dd{
        display:none;  
        border-radius:3px;
        padding: 20px;
        overflow-y: auto;
        max-height: calc(-222px + 100vh); 
    } 
    .menualListWrap .isShow dd{
        display:block;
    }
    .menualListWrap .list dt em{
        float:right; 
        color:${({ theme }) => theme.colors.primary.p500}; 
    }
    .menualListWrap .list li a{
        display:block; 
        padding: 10px 23px; 
        font-size:1rem;
        cursor:pointer;
    }

    .menualListWrap .list li a:hover{
        color:${({ theme }) => theme.colors.primary.p500};
    } 
    
    .subCategoryScroll::-webkit-scrollbar { 
        width: 7px; 
        height: 7px; 
    }
    .subCategoryScroll::-webkit-scrollbar-thumb { 
        width: 7px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        border-radius: 10px; 
    }
    .subCategoryScroll::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }

    .categoryScroll::-webkit-scrollbar { 
        width: 7px; 
        height: 7px; 
    }
    .categoryScroll::-webkit-scrollbar-thumb {
        width: 7px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        border-radius: 10px; 
    }
    .categoryScroll::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }

    .bullet a {
        position:relative;
        padding-left:13px;
    }

    .bullet a:before {
        content:'';
        position:absolute;
        top:16px;
        left:4px;
        width:4px;
        height:4px;
        background-color: ${({ theme }) => theme.colors.white};
        border-radius:4px;
    }

    .bullet a:before:hover {
        background-color: ${({ theme }) => theme.colors.white};
    }

    .boardListWrap{
        width:calc(100% - 383px); 
        border-radius: 4px; 
    }

    .subSection > .sopTit{
        display:block; 
        height: 57px; 
        padding:12px 0px 12px 20px; 
        font-size:1.25rem;
        font-weight:700;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        letter-spacing:-0.05em;
        background-color:#0D121A;
        text-align: left;
        cursor:default;
		color:${({ theme }) => theme.colors.primary.p500};
    } 
    .boardListWrap .sopTit{
        padding:19px 35px; 
    }
    .boardListWrap .sopTit strong{
        float:left; 
        color: ${({ theme }) => theme.colors.primary.p500}; 
        font-size: 1.125rem; 
    }
    .boardListWrap .sopTit .filterArea{
        float:right;
    }

    .boardListWrap .filterArea > div{
        float:left; 
        display: flex; 
        align-items: center;
    }
    .boardListWrap .filterArea > div + div{
        margin-left:40px;
    }
    .boardListWrap .filterArea label{
        font-size:0.875rem;
        font-weight:400;
        line-height:1;
        color: ${({ theme }) => theme.colors.white};
        text-align: center; 
        letter-spacing: 0px; 
    }
    .boardListWrap .filterArea .cGreen label{ 
        color: ${({ theme }) => theme.colors.white};
    }

    input[type=radio] {
        margin-right: 5px;
    }

    .boardListWrap .list li{ 
        border-bottom: solid 1px ${({ theme }) => theme.colors.grayscale.g800}; 
    }
    .boardListWrap .list li:hover { 
        background: ${({ theme }) => theme.colors.grayscale.g800}; 
    } 
    .boardListWrap .list a{
        display: flex;
        align-items: center;
        padding: 20px 35px 20px 97.5px; 
        padding-right:0;
        font-size:1.125rem;
        font-weight:400;
        letter-spacing:-0.05em;
    }
    .boardListWrap .list a:before{
        top:26px;
        left:35px;
    }
    .boardListWrap .list a:after{
        content:'';
        display:block;
        clear:both;
    }
    .boardListWrap .list a p{
        float:left;
        width:calc(100% - 437px); 
        letter-spacing: 0px; 
        font-size: 1rem;
        line-height: 172%; /* 27.52px */
    }
    .sopDayBox{ 
        display: inline-flex; 
        align-items: center;
        float: left; 
        margin-right: 149.5px; 
    }
    .sopGreenCircle{ 
        display: inline-block; 
        width: 11px; 
        height: 11px; 
        border-radius: 50%; 
        background:${({ theme }) => theme.colors.primary.p500}; 
    }
    .sopYellowCircle{ 
        display: inline-block; 
        width: 11px; 
        height: 11px; 
        border-radius: 50%; 
        background:#7000FF; 
    }
    .boardListWrap .list .noti{ 
        width: 75px; 
        font-weight:400; 
        color: ${({ theme }) => theme.colors.white};
        text-align:center; 
        letter-spacing: 0px; 
        margin-left: 9.5px; 
        font-size: 1rem;
    }
    .boardListWrap .list .noti.cGreen{
        color: ${({ theme }) => theme.colors.primary.p500};
    }
    .boardListWrap .list .date{
        float:left;
        width:167px;
        text-align:center; 
        font-size: 1rem; 
        white-space: nowrap;
    }

    .numList{
        counter-reset:number;
    }
    .numList a{
        position:relative;
        padding-left:16px;
    }
    .numList a:before{
        counter-increment:number;
        content:counters(number, '.')". ";
        position:absolute;
        top:0;
        left:0;
        font-size: 1rem;
    }
`;


export const ProcessListComponent = styled.section`
    float:left; 
    height:calc(100% + 5px); 
    border-radius:4px;

    position:absolute;
    left:30px;
    width:330px; 
    height:calc(100% - 15px); 
    margin-right:20px;
    transition:left .5s ease-in-out; 
    background: none;

    .tit > div{ 
        color: ${({ theme }) => theme.colors.primary.p500}; 
        font-size: 1.125rem;
        font-weight: 700;
        line-height: normal;
    }
    .tit {
        position:relative;
        font-size: 1.125rem;
        font-weight:700;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        letter-spacing:-0.05em;
        background-color: #0D121A;
        cursor:default;
        color: ${({ theme }) => theme.colors.primary.p500};
        padding: 15px 40px 14px 20px;
    }

    .tit::after {
        content: '';
        display: block;
    }

    .tit strong {
        float:left;
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .clfix:after{
        content:'';
        display:block; 
        clear:both;  
    } 

    .btnToggle {
        position:absolute;
        top:0;
        right:0;
        width:40px;
        height:47px;
        text-align:center; 
        background: #0D121A;
        border-top-right-radius:8px;
        transition:right .5s ease-in-out;
    }

    .iconArrowLeft {
        display:block; 
        width:28px; 
        height:28px; 
        background:url(${iconArrowLeft}) no-repeat; 
        background-position-x:7px; 
        background-position-y: 4px;
    }

    .innerSectionn {
        overflow-y:auto; 
        padding: 12px 24px; 
        margin-bottom: 12px;  
        background-color: ${({ theme }) => theme.colors.background.surface};
        border-radius: 0 0 8px 8px;
    }

    .innerSectionn ul li {
        ${({ theme }) => theme.mixins.textEllipsis()};
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        color: ${({ theme }) => theme.colors.grayscale.g100};

        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    .innerSectionnn {
        max-height:calc(100% - 337px); 
        overflow-y: auto;  
        border-radius: 0 0 8px 8px;
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        font-size: 0.875rem;
    }

    .numList {
        counter-reset:number;
    }

    .numList li {
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
    }

    .numList .btnList {
        display:table;
        width:100%;
        padding: 20px 20px 20px 50px;
        border-bottom: solid 1px #d1d1d1;
        cursor: default;
    }
    
    .numList .btnList:before {
        position: absolute;
        top: 20px;
        left: 20px;
        font-weight: 500;
        counter-increment: number;
        content: counters(number,".")". ";
    }

    .numList .btnList > span:nth-child(1) {
        width: 100px;
    }

    .numList .btnList > span:nth-child(2) {
        width: 60px;
    }

    .numList .btnList:last-child {
        border: none;
    }

    .numList .btnList span {
        display:table-cell;
        font-weight:500;
    }

    .numList .btnList span:not(.text) {
        text-align: right;
    }

    .numList .btnList .text {
        max-width:100px; 
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .numList .btnList:hover {
        color: ${({ theme }) => theme.colors.white};
    }

    .numList .detailInfo {
        display:none;
        background-color:#0e1829;
    }

    .numList .detailInfo > span {
        display:table-cell;
        width:50%;
        padding:20px;
        line-height:20px;
        font-weight:300;
        vertical-align:middle;
        word-break:keep-all;
    }

    .numList .detailInfo:after {
        content:'';
        display:block; 
        clear:both;
    }

    .numList .isShow .btnList:after {
        transform:rotateX(180deg);
    }

    .list li {
        border-bottom: solid 1px #d1d1d1;
    }

    .list li:hover {
        background-color:rgba(0,0,0,0.2);
    }

    .list a {
        position: relative;
    }

    // .list a:before {
    //     top:30px;
    //     left:35px;
    // }

    // .list a:after {
    //     content:'';
    //     display:block;
    //     clear:both;
    // }

    // .list a p {
    //     float:left;
    //     width:calc(100% - 400px);
    // }
`;



export const MissionListComponent = styled.section`
    float:left; 
    height:calc(100% + 5px); 
    border-radius:4px; 
    width: calc(50% - 24px); 

    .taskListWrap .sectionBoxStart {} 
    .taskListWrap .sectionBoxStart strong:before { 
        counter-increment:taskOrder; 
        content:no-close-quote; 
        position:absolute;
        top:0;
        left:0;
    } 
    .taskListWrap .sectionBoxStart strong { 
        padding-left:0;
    }
    .isHidden .taskListWrap{
        width:calc(50% - 10px);
    }

    >.tit {
        display:block;
        padding: 14px 20px;
        font-size: 1.125rem;
        font-weight:700;
        line-height: normal;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        letter-spacing:-0.05em;
        background-color: #0D121A;
        cursor:default;
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .innerSectionnnn { 
        height:100%; 
        background: ${({ theme }) => theme.colors.background.surface};
        max-height:calc(100% - 56px); 
        border-radius: 0 0 8px 8px;
        overflow-y:auto; 
        overflow-x: hidden;
    }

    /* scrollbar test */

    .scrollbar::-webkit-scrollbar {
        width: 7px;
        background: none;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary.p500};
        border-radius: 10px;
        opacity: .4;
    }
    .scrollbar::-webkit-scrollbar-track {
        background: none;
    }

    .taskSectionArea{
        counter-reset:taskOrder;
        padding:10px;

        & * {
            word-break:keep-all;
        }
    }

    .taskSectionArea > .sectionBox > .tit{ 
        position: relative; 
        padding: 12px 24px; 
        border-radius: 8px 8px 0 0; 
        background: #0D121A;
    }

    .taskSectionArea > .sectionBox.round > .tit{ 
        position: relative; 
        padding: 12px 24px; 
        border-radius: 8px; 
        background: #0D121A;
    }

    .taskSectionArea .numList li{
        position:relative;
        padding-left:16px
    }

    .currentBox { 
        border: solid 2px ${({ theme }) => theme.colors.primary.p500};
        border-radius: 5px; 
    }

    .sectionCurrent > .tit {
        background-color: ${({ theme }) => theme.colors.primary.p75} !important;
        border: 1px solid ${({ theme }) => theme.colors.primary.p600};
    }

    .sectionRun > .tit {
        background-color: #0D121A;
        border: solid 3px ${({ theme }) => theme.colors.primary.p500};
    }

    .sectionDone > .tit {
        background-color: #0D121A;
        border-radius: 3px;
    }
    .sectionSkip > .tit {
        background-color: #0D121A;
        border: solid 3px ${({ theme }) => theme.colors.primary.p500};
    }
`;


export const SopSimulatorChartComponent = styled.div`
    float:left; 
    height:calc(100% + 5px); 
    border-radius:4px; 
    width:calc(50% + 10px);
    margin-right:12px; 

    > section:not(.progressHistoryWrap) {
        float:left;
        height:100%;
        border-radius: 4px;
    }

    .tit{ 
        display: block;
        padding: 13px 20px;
        height: 54px;
        font-size: 1.125rem;
        font-weight: 700;
        line-height: normal;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        letter-spacing: -0.05em;
        background-color: #0D121A;
        text-align: center;
        cursor: default;
        color: ${({ theme }) => theme.colors.primary.p500};
    }
    .tit strong{
        float:left;
        font-weight:700;
        line-height: normal;
        color: ${({ theme }) => theme.colors.primary.p500}; 
        font-size: 1.125rem;
    }
    .btnArea{
        float:right; 
    }
    .btnArea button + button{
        margin-left: 16px;
    }

    .iconMod{
        display:inline-block;
        vertical-align:top;
        width:26px;
        height:26px;
        background:url(${iconMod}) no-repeat;
        background-size: 24px;
    }
    .iconPlay{
        display:inline-block;
        vertical-align:top;
        width:28px;
        height:28px;
        background:url(${iconPlay}) no-repeat;
        background-size: 24px; 
        background-position: center; 
    }
    .iconEnd{
        display:inline-block;
        vertical-align:top;
        width:28px;
        height:28px;
        background:url(${iconEnd}) no-repeat;
        background-size: 24px; 
        background-position: center; 
    }


    .chartWrap{
        position:relative;
        height:calc(100% - 57px); 
    }
    .infoList{
        position:absolute;
        top:20px;
        left:25px;
        z-index:2;
    }  
    .infoList button {
        width: 75px;
        height: 31px;  
        font-size: 0.875rem;
        font-weight: 500; 
        color:#c6c6c6; 
        text-align:center;
        border: solid 1px #d7d7d7;
        border-radius: 20px;
        cursor: default; 
        z-index:2; 
        position:relative; 
    }
    .infoList .actCircle{ 
        border-radius: 50%; 
        color:red; 
        list-style: disc; 
    } 
    .infoList li + li{
        margin-top:10px; 
        z-index:2;
    }
    .isActive button{
        background-color:#39a7de;
        color: ${({ theme }) => theme.colors.white};
    }
    .chartArea{
        height:100%;
        overflow-y:auto;
    }

    .class1st.unActive button {
        background-color: ${({ theme }) => theme.colors.primary.p700}; 
        color: ${({ theme }) => theme.colors.grayscale.g200};
        cursor: pointer;
        border:none; 
        cursor:pointer; 
    }
    .class2nd.unActive button {
        background-color: #936312; 
        color: ${({ theme }) => theme.colors.grayscale.g200};
        cursor: pointer; 
        border: none; 
        cursor:pointer; 
    }
    .class3rd.unActive button {
        background-color: ${({ theme }) => theme.colors.secondary.s700};
        color: ${({ theme }) => theme.colors.grayscale.g200};
        cursor: pointer;
        border: none; 
        cursor:pointer; 
    }
    .class4th.unActive button {
        background-color: ${({ theme }) => theme.colors.error.error800};
        color: ${({ theme }) => theme.colors.grayscale.g200};
        cursor: pointer;
        border: none; 
        cursor:pointer; 
    }
    .class1st.isActive button {
        background-color: ${({ theme }) => theme.colors.primary.p400}; 
        color: ${({ theme }) => theme.colors.white};
        border:none; 
        cursor:pointer; 
    }
    .class2nd.isActive button {
        background-color: #EBA800;
        color: ${({ theme }) => theme.colors.white};
        border: none; 
        cursor:pointer; 
    }
    .class3rd.isActive button {
        background-color: ${({ theme }) => theme.colors.secondary.s500};
        color: ${({ theme }) => theme.colors.white};
        border: none; 
        cursor:pointer; 
    }
    .class4th.isActive button {
        background-color: ${({ theme }) => theme.colors.state.error};
        color: ${({ theme }) => theme.colors.white};
        border: none; 
        cursor:pointer; 
    }

    .chartArea {
        width: 100%;
        height:100%;
        background: ${({ theme }) => theme.colors.background.surface};
        border-radius: 0 0 8px 8px;
    }
    .chartArea::-webkit-scrollbar { 
        width: 7px;
        height: 7px;
        border-radius: 3px;
        padding: 10px;
    }
    .chartArea::-webkit-scrollbar-thumb { 
        width: 3px;
        border-radius: 3px;
        background: ${({ theme }) => theme.colors.primary.p500};
    }
    .chartArea::-webkit-scrollbar-track { 
        width: 0px;
        height: 0px;
    } 

    .panelAreas {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .panelAreas .scrollbar { 
        overflow-y: auto;
    }
    .panelAreas .scrollbar::-webkit-scrollbar { 
        width: 6px; 
        background: none; 
    }
    .panelAreas .scrollbar::-webkit-scrollbar-thumb { 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        opacity: .4;
    }
    .panelAreas .scrollbar::-webkit-scrollbar-track { 
        background: none; 
    }

    #refresh { 
        width: 43px; 
        height: 43px; 
        padding: 8px 3px; 
        cursor: pointer; 
        position: absolute; 
        top: 25px; 
        right: 25px;
        z-index: 2; 
        background:url(${resetIcon}) no-repeat;
        background-repeat: no-repeat;
    }

    .sectionPanels {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .sectionPanels::-webkit-scrollbar { 
        width: 6px; 
        background: none; 
    }
    .sectionPanels::-webkit-scrollbar-thumb { 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        opacity: .4;
    }
    .sectionPanels::-webkit-scrollbar-track { 
        background: none; 
    }
`;


export const SectionPanelComponent = styled.section`
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    overflow: auto;

    &::-webkit-scrollbar { 
        width: 6px; 
        height: 7px; 
        /* background-color: #0D121A;  */
    }
    &::-webkit-scrollbar-thumb { 
        width: 3px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        border-radius: 20px; 
    }
    &::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }
    &::-webkit-scrollbar-corner { 
        background: transparent;
    }


    .sectionGridFix {
        position: relative;
        width: var(--sizeGridInitWidth);
        height: 0;
        z-index: 10;
    }

    /* 
    .sectionGridFix::before {
        content: '';
        display: inline-block;
        width: 37px;
        height: 37px;
        background-color: #efefef;
    } */

    .sectionGridFix .btnToggleBorder {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 50px;
        height: 50px;
        margin: 0;
        padding: 0;
        border: 0;
        background: #efefef url(${eyeOpen}) 50% 50% no-repeat;
    }
    
    .sectionGridFix .btnToggleBorder.isClose {
        background-image: url(${eyeCl});
    }
    
    .sectionGridFix .sectionGridRow {
        position: absolute;
        top: 50px;
        left: 0;
        width: 50px;
        height: 1400px;
    }

    .sectionGridFix .sectionGridColumn {
        position: absolute;
        top: 0;
        left: 50px;
        width: 300px;
        height: 50px;
    }

    .sectionGridCell {
        position: relative;
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
        
    .sectionGridCell.selected {
        background-color: rgba(180, 180, 180, 0.3);
    }

    .btnArrowTop {
        position: absolute;
        width: 20px;
        height: 12px;
        top: -20px;
        background-image: url(${btnArrowUp_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }
        
    .decisionArrowBox .btnArrowTop,
    .annotationArrowBox .btnArrowTop,
    .internalArrowBox .btnArrowTop {
        top: -15px;
    }

    .btnArrowTop:hover {
        background-image: url(${btnArrowUp_dark});
    }

    .btnArrowBottom {
        position: absolute;
        width: 20px;
        height: 12px;
        bottom: -20px;
        background-image: url(${btnArrowDown_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }
        
    .decisionArrowBox .btnArrowBottom,
    .annotationArrowBox .btnArrowBottom,
    .internalArrowBox .btnArrowBottom {
        bottom: -15px;
    }

    .btnArrowBottom:hover {
        background-image: url(${btnArrowDown_dark});
    }

    .btnArrowLeft {
        position: absolute;
        width: 12px;
        height: 20px;
        left: -20px;
        background-image: url(${btnArrowLeft_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowLeft,
    .annotationArrowBox .btnArrowLeft,
    .internalArrowBox .btnArrowLeft {
        left: -15px;
    }
        
    .btnArrowLeft:hover {
        background-image: url(${btnArrowLeft_dark});
    }

    .btnArrowRight {
        position: absolute;
        width: 12px;
        height: 20px;
        right: -20px;
        background-image: url(${btnArrowRight_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowRight,
    .annotationArrowBox .btnArrowRight,
    .internalArrowBox .btnArrowRight {
        right: -15px;
    }
        
    .btnArrowRight:hover {
        background-image: url(${btnArrowRight_dark});
    }

    .sectionGridCell:hover .decisionArrowBox .btnArrowTop,
    .sectionGridCell:hover .decisionArrowBox .btnArrowBottom,
    .sectionGridCell:hover .decisionArrowBox .btnArrowLeft,
    .sectionGridCell:hover .decisionArrowBox .btnArrowRight,
    .sectionGridCell:hover .internalArrowBox .btnArrowTop,
    .sectionGridCell:hover .internalArrowBox .btnArrowBottom,
    .sectionGridCell:hover .internalArrowBox .btnArrowLeft,
    .sectionGridCell:hover .internalArrowBox .btnArrowRight,
    .sectionComponent:hover .btnArrowTop,
    .sectionComponent:hover .btnArrowBottom,
    .sectionComponent:hover .btnArrowLeft,
    .sectionComponent:hover .btnArrowRight,
    .internalArrowBox:hover .btnArrowTop,
    .internalArrowBox:hover .btnArrowBottom,
    .internalArrowBox:hover .btnArrowLeft,
    .internalArrowBox:hover .btnArrowRight,
    .annotationArrowBox:hover .btnArrowTop,
    .annotationArrowBox:hover .btnArrowBottom,
    .annotationArrowBox:hover .btnArrowLeft,
    .annotationArrowBox:hover .btnArrowRight,
    .decisionArrowBox:hover .btnArrowTop,
    .decisionArrowBox:hover .btnArrowBottom,
    .decisionArrowBox:hover .btnArrowLeft,
    .decisionArrowBox:hover .btnArrowRight {
        opacity: 1;
    } 

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell:after {
        border: 0;
    }
            
    .sectionGridFix > .sectionGridRow > .sectionGridCell, 
    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        background: #F4F5F6;
        color: ${({ theme }) => theme.colors.border.strong};
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell.selected {
        background: #d8d8d8;
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell.selected {
        background: #d8d8d8;
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell {
        border-right: 1px solid ${({ theme }) => theme.colors.border.strong};
        border-bottom: 1px solid ${({ theme }) => theme.colors.border.strong};
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell {
        border-top: 1px solid ${({ theme }) => theme.colors.border.strong};
        border-right: 1px solid ${({ theme }) => theme.colors.border.strong};
        border-bottom: 1px solid ${({ theme }) => theme.colors.border.strong};
        display: flex;
    }

    .sectionGridFix > .sectionGridRow > .sectionGridCell:first-child {
        border-top: 1px solid ${({ theme }) => theme.colors.border.strong};
    }

    .sectionGridFix > .sectionGridColumn > .sectionGridCell:first-child {
        border-left: 1px solid ${({ theme }) => theme.colors.border.strong};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    #selectedComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p600};
        background: ${({ theme }) => theme.colors.primary.p75};
        color: ${({ theme }) => theme.colors.primary.p600};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .annotationArrowBox > .sectionComponent.annotation.selected .inner.selected,
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .annotationArrowBox > .sectionComponent.annotation .inner.selected {
        background-color: #FF4E4E;
    }

    .sectionGridColumn {
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        flex-shrink: 0;
    }
        
    ._sectionGrid_ .sectionGridColumn {
        flex-wrap: nowrap;
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.selected {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.runBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter > .sectionComponent.internal.selected {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter > .sectionComponent.internal.runComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.white};
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.selected > .sectionComponent.internal.runComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter.selected {
        background: ${({ theme }) => theme.colors.primary.p600};
    }

    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter > .decision.selected {
        color: ${({ theme }) => theme.colors.black};
    }
    
    ._sectionGrid_.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter > .decision.selected.runComponent {
        background-color: ${({ theme }) => theme.colors.primary.p75};
        color: ${({ theme }) => theme.colors.black};
    }

    #invisible {
        display: none;
    }

    #stopDrag {
        user-select: none;
    }

    .staticContextMenu {
        position: absolute;
        background-color: #242424;
        width: 190px;
        height: 240px;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid #e8e8e829;
        z-index: 100;
    }
    
    .staticContextMenu.row3 {
        height: 100px;
    }

    .menuBody ul {
        all: unset;
        display: table;
        width: 100%;
        list-style: none;
        border-bottom: 1px solid #e8e8e829;
        padding: 5px 7px;
        box-sizing: border-box;
        letter-spacing: -1px;
    }
    
    .menuBody ul:last-child {
        border: none;
    }

    .menuBody li {
        box-sizing: border-box;
        padding: 5px 6px;
    }
    
    .menuBody li:hover {
        background-color: #e8e8e829;
        border-radius: 5px;
    }
    
    .menuBody ul li span {
        font-size: 0.8125rem;
        line-height: 18px;
        color: #e6e6e6;
        margin-left: 5px;
        cursor: pointer;
    }
`;