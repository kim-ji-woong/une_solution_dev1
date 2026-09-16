import styled from "styled-components";
import dashboard_calendar_bk from "../../Common/img/sub/dashboard_calendar_bk.png";
import dashboard_calendar from "../../Common/img/sub/dashboard_calendar.png";
import paging_next from "../../Common/img/common/paging_next_B_active.svg";
import paging_last from "../../Common/img/common/paging_last_B_active.svg";
import paging_first_disable from "../../Common/img/common/paging_first_B.svg";
import paging_prev_disable from "../../Common/img/common/paging_prev_B.svg";
import historyMemoOn from "../../Common/img/common/history_memo_On.png";
import historyMemoIcon from "../../Common/img/common/history_memo_Off.png";
import SelectBoxArrowDrop from '../../History/images/selectBoxArrowDrop.png';
import select_arrow from '../../Common/images/select_arrow.png';
import list_Icon from '../images/list_Icon.svg';
import checkBox_active from '../images/checkbox_active.svg';
import closeMemo_icon from '../images/closeMemo_icon.svg';
import closePopIcon from '../images/setting_close.png';


/**********************************************************************/
// 이력 공통 CSS

export const HistorysCommon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.fontPrimary};

    .teamEditorName{
        position: absolute;
        left: 165px;
        top: 24px;
        z-index: 99;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
    }
    .teamEditorNameIcon{
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-left: 10px;
    }

    .hsScr {
        height: 100vh;
        margin-left: 280px;
        margin-top: 50px;
    }

    #hsCont {
        background: #222A38;
        padding: 40px;
        min-width: 1200px;
        height: calc(100vh - 50px);
        position: relative;
    }

    .hsCont{
        display: block;
    }

    .hsContTitle{
        display: block;
        color: ${(props) => props.theme.primary};
        font-family: "Spoqa Han Sans Neo";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
        margin-bottom: 20px;
    }

    .hscSch {
        background: #1B212C;
        padding: 20px;
        padding-right: 140px;
        position: relative;

        .sensorTypesWrap {
            ${(props) => props.theme.flex('flex-start', 'center')};
            gap: 12px;

            > li {
                ${(props) => props.theme.flex('flex-start', 'center')};
                gap: 8px;

                > label {
                    font-size: 12px;
                }
            }
        }  
        
        .selWh {
            width: 258px;
        }
    }

    .hscSch dl {
        display: table;
        width: 100%;
        height: 26px;
        margin-top: 14px;
    }

    .hscSch dl:first-child {
        margin-top: 0;
    }

    .hscSch dl dt {
        display: table-cell;
        vertical-align: middle;
        width: 92px;
        height: 26px;
        color: ${(props) => props.theme.fontPrimary};
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px;
    }

    .hscSch dl dd {
        display: table-cell;
        vertical-align: middle;
        height: 26px;
        position: relative;
    }

    .hscSch dl dd:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdo {
        float: left;
        vertical-align: middle;
        position: relative;
    } 

    .hscsRdo:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdo li {
        float: left;
        margin-right: 15px;
    }

    .hscsRdo li:last-child {
        margin-right: 0;
    }

    .hscsRdo input[type="radio"] {
    }

    .hscsRdo input[type="radio"] + label {
        color: ${(props) => props.theme.fontPrimary};
        text-align: center;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        margin-left: 8px; 
    }

    .hscsRdo input[type="radio"]:checked:after {
        content: "";
        display: block;
        background: ${(props) => props.theme.primary};
        position: absolute;
        left: 3px;
        right: 3px;
        top: 3px;
        bottom: 3px;
        border-radius: 50%;
    }

    .hscsRdoPeriod {
        float: left;
        height: 26px;
        padding-top: 4px;
        vertical-align: middle;
        position: relative;
    } 

    .hscsRdoPeriod:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsRdoPeriod li {
        float: left;
        margin-right: 15px;
    }

    .hscsRdoPeriod li:last-child {
        margin-right: 0;
    }

    .hscsRdoPeriod input[type="radio"] {
    }

    .hscsRdoPeriod input[type="radio"] + label {
        color: ${(props) => props.theme.fontPrimary};
        text-align: center;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        margin-left: 8px; 
    }

    .selWh {
        display: block;
        height: 26px;
        line-height: 24px; 
        border-radius: 2px;
        border: 0;
        font-size: 12px;
        padding: 0 27px 0 10px;
        background: #222A38 url(${select_arrow}) 95% 49% no-repeat;
    }
        
    .subjectEvaluation{
        width: 120px;
        font-size: 15px;
        font-weight: 500;
    }

    .hscsDate {
        float: left;
        height: 26px;
        margin-right: 30px;
        position: static;
    }

    .hscsDate:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsDate li {
        float: left;
    }

    .hscsDate li:nth-child(2) {
        line-height: 32px;
        padding: 0 5px;
    }

    .datepicker {
        position: relative;
    }

    .datepicker input[type="text"] {
        padding-right: 32px;
        border: none;
    } 

    .datepicker input[type="text"] + label {
        display: block;
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        text-indent: -9999px;
        background: url(${dashboard_calendar}) no-repeat center center;
    }

    .hscsDate .datepicker {
    }

    .hscsDate .datepicker input[type="text"] {
        display: block;
        width: 120px;
        background: #222A38;
        height: 26px;
        font-size: 12px;
        padding-left: 10px;
    }

    .hscsDate .datepicker input[type="text"] + label {
        background: url(${dashboard_calendar_bk}) no-repeat center center;
    }

    .react-datepicker{
        font-size: 10px;
    }

    .react-datepicker__header {
        text-align: center;
        background-color: #f0f0f0;
        border-bottom: 1px solid #aeaeae;
        border-top-left-radius: 0.3rem;
        padding: 12px 8px;
        position: relative;

        .react-datepicker__current-month{
            margin-top: 0;
            color: #000;
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 4px;
        }
    }

    .react-datepicker__day-name{
        color: #000;
        display: inline-block;
        width: 2.2rem;
        line-height: 2.0rem;
        text-align: center;
        margin: 0.4rem;
        font-size: 12px;
    }

    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
        color: #000;
        display: inline-block;
        width: 2.2rem;
        line-height: 2.0rem;
        text-align: center;
        margin: 0.4rem;
        font-size: 12px;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__month-text--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range,
    .react-datepicker__quarter-text--selected,
    .react-datepicker__quarter-text--in-selecting-range,
    .react-datepicker__quarter-text--in-range,
    .react-datepicker__year-text--selected,
    .react-datepicker__year-text--in-selecting-range,
    .react-datepicker__year-text--in-range {
        border-radius: 0.3rem;
        background: ${(props) => props.theme.primary};
        color: ${(props) => props.theme.fontPrimary} !important;
    }

    .dateTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .hscsDay {
        float: left;
        vertical-align: middle;
    }

    .dateTypeChiceTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .sensorDetectHDaySelect{
        display: block;
        width: 218px;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #f5f5f5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .sensorDetectDayOptionBox{
        display: block;
        width: 218px;
        height: 138px;
        background: #f5f5f5;
        border-radius: 5px;
        border: solid 1px #00AFFF;
        margin-top: 4px;
        position: absolute;
        z-index: 1;
    }

    .sensorDetectDayOptionBox span{
        display: block;
        color: #575757;
        height: 32.3px;
        line-height: 32.3px;
        padding-left: 20px;
    }

    .btnCalendarBk {
        width: 17px;
        height: 18px;
        display: inline-block;
        z-index: 1;
        position: absolute;
        right: 10px;
        top: 4px;
        cursor: pointer;
    }

    .hscsSbmt {
        display: block;
        width: 70px;
        height: 56px; 
        background: #131d24;
        color: ${(props) => props.theme.fontPrimary};
        position: absolute;
        top: 42px;
        right: 20px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscsSbmt > span {
    }

    .hscsSbmt > span > span {
        display: block;
        width: 70px;
        height: 56px;
        line-height: 40px;
        vertical-align: middle;
        text-align: center;
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        padding-top: 8px;
        justify-content: center;
        align-items: center;
        background: ${(props) => props.theme.primary};
        border-radius: 2px;

        &.searchBtn {
            /* padding-top: 20px; */
        }
    }

    .hscsSbmtSOP {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translate(0, -50%);
        display: block;
        width: 70px;
        height: 56px;
        background: #131d24;
        color: ${(props) => props.theme.fontPrimary};
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscsSbmtSOP > span {
        display: block;
        width: 70px;
        height: 56px;
        text-align: center;
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${(props) => props.theme.primary};
        border-radius: 2px;
    }

    #hscsSbmting {
        cursor: wait;
    }

    .hscExl {
        text-align: right;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .hscExl li {
        display: inline-block;
        margin-left: 10px;
    }

    .hscExl li a {
        display: block;
        width: 101px; 
        height: 30px;
        line-height: 18px; 
        border: solid 1px #222a38;
        background: #1B212C;
        padding: 5px 10px;
        text-align: center;
        color: ${(props) => props.theme.fontPrimary};
        font-family: "Spoqa Han Sans Neo";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        border-radius: 2px;
        cursor: pointer;
    }

    .hscExl li a:hover {
        background: ${(props) => props.theme.primary};
        border-radius: 2px;
    }

    .hscTb {
        display: block;
    }

    .hscTb tbody tr:not(.noData):hover {
        background: ${(props) => props.theme.primary};
        color: #1B212C;

        span {
            color: #1B212C;
        }

        input[type=checkbox]{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #1B212C;
        }
        
        input[type=checkbox]:checked{
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(${ checkBox_active }) no-repeat center center !important;
            background-size: 16px auto !important;
            border: 0;
        }
    } 

    .hscTb th,
    .hscTb td {
        font-size: 14px;
        text-align: center;
    }

    .hscTb th {
        background: #222a38;
        font-weight: 500;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
        padding: 9px 10px;
    }

    .hscTb th:last-child{
        border: none;
    }

    .hscTb td {

    }

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: solid 1px #ccc;
        height: 28px;
        line-height: 26px;
        font-size: 13px;
        padding: 0 10px;
        border-radius: 4px;
    }

    .scrTb {
        overflow-x: hidden;
        overflow-y: auto;
        display: block;
        height: calc(100% - 0px);
    }

    .scrTb table {
        min-width: 1400px;
        background: #1B212C;
    }

    .scrTb th {
        background: #2A3344;
        font-weight: 500;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
    }

    .scrTb td {
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #222a38;
        border-bottom: solid 1px #222a38;
        ${(props) => props.theme.overText()};
    } 

    .scrTb td a {
        display: inline-block;
        border: solid 1px #222a38;
        /* height: 28px;
        line-height: 26px; */
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 4px;
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translate(-50%, -50%);
    } 

    .scrTb th,
    .scrTb td {
        font-size: 14px;
        text-align: center;
        padding: 10px 12px;
        vertical-align: middle;
    }

    .scrTb td:last-child{
        border-right: none; 
        position: relative;
    }

    .scrTb table .noData td {
        cursor: default !important;
    }

    .activeBackgroundTr{

        &#lineOn {
            background: ${(props) => props.theme.primary} !important;
            color: #1B212C !important;

            td > input[type=checkbox]:checked {
                display: inline-block;
                background: url(${ checkBox_active }) no-repeat center center;
                background-size: 16px auto !important;
                z-index: 1;
            }

            span {
                color: #1B212C !important;
            }
        }

        &.memoOn {
            background: ${(props) => props.theme.primary};
        }

        &.colorOn{
            color: ${(props) => props.theme.primary};
            background: none;

            span {
                color: ${(props) => props.theme.primary} !important;
            }
        }
    }

    .detailInfo{
        align-items: center;
        width: 72px;
        padding: 2px 10px;
        border: 1px solid #222a38;
        border-radius: 2px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
    }

    .hscNav {
        text-align: center;
        margin-top: 38px;
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translate(-50%, 0);
        ${(props) => props.theme.userSelect()};
    }

    .hscNav a {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        line-height: 29px;
        border: #222a38;
        position: relative;
        font-family: "Roboto", sans-serif;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 13px;
        border-radius: 2px !important;
    }

    .hscNav > a {
        text-indent: -9999px;
    }

    .hscNav a.first {
        background: url(${paging_last}) no-repeat center center;
        transform: scaleX(-1);
        border: solid 1px #222a38;
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.prev {
        background: url(${paging_next}) no-repeat center center;
        transform: scaleX(-1);
        border: solid 1px #222a38;
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.next {
        background: url(${paging_next}) no-repeat center center;
        border: solid 1px #222a38;
        cursor: pointer;
        margin-right: 6px;
    }

    .hscNav a.last {
        background: url(${paging_last}) no-repeat center center;
        border: solid 1px #222a38;
        cursor: pointer;
    }

    .hscNav a.firstDisable {
        background: url(${paging_first_disable}) no-repeat center center;
        border: solid 1px #222a38;
        margin-right: 6px;
        cursor: default;
    }

    .hscNav a.prevDisable {
        background: url(${paging_prev_disable}) no-repeat center center;
        border: solid 1px #222a38;
        margin-right: 6px;
        cursor: default;
    }
    .hscNav a.nextDisable {
        background: url(${paging_prev_disable}) no-repeat center center;
        transform: scaleX(-1);
        border: solid 1px #222a38;
        cursor: default;
    }

    .hscNav a.lastDisable {
        background: url(${paging_first_disable}) no-repeat center center;
        transform: scaleX(-1);
        border: solid 1px #222a38;
        cursor: default;
    }

    .hscNav ul {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }

    .hscNav ul li {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        margin-right: 6px;
        border: solid 1px #222a38;
    }

    .hscNav ul li:before {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
    }

    .hscNav ul li:last-child:after {
        content: "";
        display: block;
        width: 1px;
        height: 12px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -6px;
    }

    .hscNav ul li.on a {
        display: block;
        font-weight: 700;
        color: #000000;
        background: ${(props) => props.theme.primary};
        border: ${(props) => props.theme.primary};
        border-radius: 2px;
    }

    .hscsHalf {
        margin-bottom: 10px;
    }
    
    .hscsHalf:after {
        content: "";
        display: table;
        clear: both;
    }

    .hscsHalf > li {
        float: left;
        width: 25%;
    }

    .hscsHalf > li select {
        display: block;
        width: 100%;
    }

    .hscsHalf > li dl dt {
        text-align: right;
        padding-right: 20px;
    }

    .hscsHalf > li:first-child dl dt {
        text-align: left;
    }

    .hscsHalf > li input[type="text"] {
        display: block;
        width: 100%;
        border: none;
        background: #222A38;
        height: 26px;
        font-size: 13px;
        padding-left: 10px;
        border-radius: 2px;
        padding: 5px 5px 5px 10px;
        align-items: center;
    }

    .hscsIpt {
        position: relative;
        padding-left: 170px;
        width: 600px;
    }

    .hscsIpt select {
        position: absolute;
        left: 0;
        top: 0;
        width: 160px;
    }

    .hscsIpt input[type="text"] {
        display: block;
        width: 100%;
        border: none;
        height: 26px; 
        font-size: 13px;
        padding: 5px 5px 5px 10px;
        border-radius: 2px;
    }
`;

export const HistoryMenuComponent = styled.div`
    position: fixed;
    left: 0; 
    top: 50px;
    bottom: 0;
    width: 280px;
    background: #1B212C;
    z-index: 1;

    .hslMenu li {
        border-bottom: solid 1px #29313E;
        cursor: pointer;
        padding: 20px;
        height: 58px;
        line-height: 58px;
    }

    .hslMenu li.on {
        background: ${(props) => props.theme.primary};
        color: #1B212C;
    }

    .hslMenu li a {
        display: block;
        position: relative;
        font-family: "Spoqa Han Sans Neo";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 18px;
    }

    .hslMenu li a:after {
        content: "";
        display: block;
        width: 5px;
        height: 8px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
    }

    .hslMenu li a.on:after {
        color: #1B212C;
    }
`;


// 센서 탐지 이력
export const SensorDetectHistoryComponent = styled(HistorysCommon)`
`;


// 센서 탐지 분석
export const SensorDetectAnalysisComponent = styled(HistorysCommon)`
    .scrTb th,
    .scrTb td {
        padding: 8px 12px;
    }

    .hscWng {
        background: #2A3344;
        height: 70px;
        line-height: 30px;
        padding: 20px;
        margin-top: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }

    .hscWng span {
        color: ${(props) => props.theme.primary};
        font-size: 20px;
        line-height: 20px;
    }

    .hscCht {
        background: #1B212C;
        padding: 27px;
        margin-top: 20px;
        margin-bottom: 20px;
        border-radius: 4px;
    }
`;


// SOP 이력
export const SOPHistoryComponent = styled(HistorysCommon)`

    .hscSOPTb {
        display: block;
    }
    .hscSOPTb table .noData td {
        cursor: default !important;
    }

    .hscSOPTb tbody tr:not(.noData):hover {
        background: ${(props) => props.theme.primary};
        color: #1B212C;

        input[type=checkbox]{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: solid 1px #1B212C;
        }
        input[type=checkbox]:checked{
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(${ checkBox_active }) no-repeat center center !important;
            background-size: 16px auto !important;
            border: 0;
        }
    }

    .hscSOPTb th,
    .hscSOPTb td {
        font-size: 14px;
        text-align: center;
        padding: 10px 12px;
        vertical-align: middle;
    }

    .hscSOPTb th {
        background: #2A3344;
        font-weight: 500;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        align-items: center;
        border-right: solid 1px #1B212C;
    }

    .hscSOPTb th:last-child{
        border: none;
        position: relative;
    }

    .hscSOPTb td {

    }

    .hscSOPTb td select {
        display: inline-block;
    }

    .hscSOPTb td a {
        display: inline-block;
        border: solid 1px #222a38;
        /* height: 28px;
        line-height: 26px; */
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 4px;
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .scrSOPTb {
        overflow-x: hidden;
        overflow-y: auto;
        display: block;
        height: calc(100% - 0px);
    }

    .scrSOPTb table {
        min-width: 1400px;
        background: #1B212C;
    }

    .scrSOPTb td {
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #222a38;
        border-bottom: solid 1px #222a38;
        ${(props) => props.theme.overText()};
    }

    .scrSOPTb td:last-child{
        border-right: none;
        position: relative;
    }

    .activeBgSOPTr{

        &#lineOn {
            background: ${(props) => props.theme.primary} !important;
            color: #1B212C !important;

            td > input[type=checkbox]:checked {
                display: inline-block;
                background: url(${ checkBox_active }) no-repeat center center;
                background-size: 16px auto !important;
                z-index: 1;
            }

            span {
                color: #1B212C !important;
            }
        }

        &.memoOn {
            background: ${(props) => props.theme.primary};
        }

        &.colorOn{
            color: ${(props) => props.theme.primary};
            background: none;

            span {
                color: ${(props) => props.theme.primary} !important;
            }
        }
    }

    .selectedTr {
        border: solid;
        border-color: green;
    }

    .disasterTypeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .disasterTypeSelect{
        display: block;
        width: 470px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .crisisStageSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .crisisStageSelect{
        display: block;
        width: 143px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%; 
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .modeSelectTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .modeSelect{
        display: block;
        width: 143px !important;
        height: 54px;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }

    .writePersonTitle{
        font-size: 11px;
        color: #808080;
        background: #f5f5f5;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .writePersonInput{
        display: block;
        width: 147px !important;
        height: 54px !important;
        border-radius: 5px;
        border: solid 1px #F5F5F5;
        background: #f5f5f5;
        padding: 10px;
        padding-top: 26px;
        font-size: 14px;
        margin-right: 20px;
    }
`

//SOP 이력 상세정보
export const SOPHistoryDetailInfoComponent = styled.div`
    #hsMmo{
        position: fixed; 
        left: 50%; 
        top: 50%; 
        transform: translate(-50%, -50%);  
        z-index: 1; 
        background: #efefef; 
        border-radius:5px; 
    }

    #hsMmo > div {
        display: table;
    }
    #hsMmo > div > div {
        display: table-cell; 
        width: 100%; 
        vertical-align: middle;
    }

    .hsmCont {
        background: #fff; 
        width: 400px; 
        margin: 0 auto; 
        padding: 20px; 
        border-radius: 4px;
    }
    .hsmCont.sop {
        width: 800px;
    }
    .hsmTitle:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .hsmTitle h3 {
        float: left; 
        height: 30px; 
        line-height: 30px; 
        font-size: 22px; 
        font-weight: 600; 
        color: #000000; 
        letter-spacing: -1px; 
    }
    .hsmExl {
        display: block; 
        height: 30px; 
        line-height: 30px; 
        padding: 0 15px;
        float: left; 
        margin-left: 15px; 
        background: ${(props) => props.theme.primary}; 
        border-color: ${(props) => props.theme.primary}; 
        color: #fff; 
        font-size: 13px; 
        border-radius: 4px; 
        cursor: pointer;
    }
    .hsmCls {
        display: block; 
        float: right; 
        width: 12px; 
        height: 12px; 
        text-indent: -9999px; 
        //background: url('../img/sub/setting_close.png')no-repeat center center;
        background: url(${closePopIcon})no-repeat center center;
        position: absolute; 
        right: 20px; 
        z-index: 99; 
        cursor: pointer; 
    }

    .scrollWrapper{
        overflow:auto;
        padding: 0 !important;
        position: relative;
    }

    .hsmPrc {
        margin-top: 20px; 
        height: 240px; 
        border: solid 1px #ccc;
    }
    .hsmPrc 
    .scrollBar {
        background: #fff !important;
    }

    .hsmTb {}
    .hsmTb th,
    .hsmTb td {
        padding: 5px; 
        text-align: center; 
        border-bottom: solid 1px #ddd; 
        font-size: 13px; 
        color: #000000; 
    }
    .hsmTb th {
        font-weight: 500; 
        color: #000000; 
        letter-spacing: -1px; 
        background: #f5f5f5; 
    }
    .hsmTb td {
        padding: 10px;
    }
    .hsmTb tbody tr:hover{
        background:rgb(233 233 233 / 0.3); 
        cursor:pointer;
    }
    .hsmDtl {
        margin-top: 20px; 
        height: 240px; 
        border: solid 1px #ccc;
    }
    .hsmDtl .scrollBar {
        background: #fff !important;
    } 

    .hsmDtl::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: #fff;
    }
    .hsmDtl::-webkit-scrollbar-thumb {
        width: 6px;
        background: #808080;
        border-radius: 10px;
    }
    .hsmDtl::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }
`;




// 보고서 이력
export const ReportHistoryComponent = styled(HistorysCommon)`

    .hscTb2{
        display: block;
        width: calc(100% - 0px);
        height: calc(100% - 326px);
        overflow: hidden;
    }

    .hsTbFlex{
        display: flex;
        width: 100%;
        height: 100%;
    }

    .hsTbFlex::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: ${(props) => props.theme.background};
    }
    .hsTbFlex::-webkit-scrollbar-thumb {
        width: 6px;
        background: ${(props) => props.theme.primary};
    }
    .hsTbFlex::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    } 

    .hsTbConts{
        width: 20%;
        height: 100%;
        margin-right: 11px;
        background: #1B212C;
    }

    .hsTbConts table {
        background: #1B212C;
    }

    .hsTbConts tr:hover{
        background: ${(props) => props.theme.primary};
    }

    .hsTbConts th {
        padding: 9px 12px;
        font-size: 13px;
        text-align: center;
        background: #222a38;
        font-weight: 500;
        border-right: solid 1px #1B212C;
        text-align: center;
    }

    .hsTbConts td {
        height: 34px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        border-right: solid 1px #222a38;
        border-bottom: solid 1px #222a38;
        text-align: center;
        ${(props) => props.theme.overText()};
    }

    .hsTbConts td:last-child{
        border-right: none;
    }

    .checkDisable{
        color: #485875;
    }

    .checkDisable input[type="checkbox"] {
        border-color: #485875;
    }
    .checkDisable input[type="checkbox"]:checked {
        background: url(${checkBox_active}) no-repeat center center;
        background-size: 14px auto !important;
    } 


    .hsTbContsNum::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: ${(props) => props.theme.background};
    }
    .hsTbContsNum::-webkit-scrollbar-thumb {
        width: 6px;
        background: ${(props) => props.theme.primary};
    }
    .hsTbContsNum::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

    .hsTbContsNum {
        width: 100%;
        height: 100%;
        background: #1B212C;
        overflow: auto;

        .hsTbContList {
            .hsTbContListHead {
                display: flex;
                width: 100%;

                &::after {
                    content: '';
                    width: 6px;
                    height: 34px;
                    background-color: ${(props) => props.theme.background};
                    position: absolute;
                    right: 40px;
                }

                > div {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    height: 34px;
                    line-height: 14px;
                    text-align: center;
                    font-weight: 400;
                    padding: 10px 12px;
                    font-size: 14px;
                    min-width: 110px;
                    background: #222a38;

                    &:not(:last-child) {
                        border-right: 1px solid ${(props) => props.theme.background};
                    }
                }
            } 

            .listText{
                display: inline-block;
                ${(props) => props.theme.overText()};
            }

            .listIcon{
                display: inline-block;
                width: 15px;
                height: 16px;
                background: url(${ list_Icon }) no-repeat;
                background-position: center;
                margin-left: 5px;
            }

            .hsTbContListBody {
                width: 100%;
                height: calc(100% - 34px);

                ${(props) => props.theme.scroll()};

                ul {
                    li {
                        display: flex;
                        height: 34px;
                        border-bottom: #222a38;
                        cursor: pointer;
                        border-bottom: solid 1px #222a38;

                        div {
                            text-align: center;
                            width: 100%;
                            height: 34px;
                            padding: 10px 12px;
                            min-width: 110px;
                            font-size: 14px;
                            font-weight: 400;
                            position: relative;
                            background: #1B212C;
                            border-bottom: solid 1px #222a38;
                        }
                        div > p {
                            display: inline-block;
                            font-size: 14px;
                            font-weight: 400;
                            position: absolute;
                            left: 0;
                            top: 2px;
                        }
                    }
                }
            }
        }

        .hsTbContsNone{
            display: block;
            width: 100%;
            height: 684px;
        }

        .hsTbContsNone > span{
            display: block;
            height: 34px;
            background: #222a38;
        }

        .hsTbContsNone > div{
            display: block;
            width: 100%;
            height: 100%;
            background: #1B212C;
            text-align: center;
            padding-top: 340px;
            font-size: 14px;
            font-weight: 400;
            color: #7C8DA9;
        }

        .locationSelectTitle{
            font-size: 11px;
            color: #808080;
            background: #f5f5f5;
            position: absolute;
            left: 10px;
            top: 10px;
        }
        .locationSelect{
            display: block;
            width: 470px !important;
            height: 54px;
            border-radius: 5px;
            border: solid 1px #F5F5F5;
            background: #f5f5f5 url(${SelectBoxArrowDrop}) no-repeat 92% 80%;
            padding: 10px;
            padding-top: 26px;
            font-size: 14px;
            margin-right: 20px;
        }

        .InquiryPeriodSelectTitle{
            font-size: 11px;
            color: #808080;
            background: #f5f5f5;
            position: absolute;
            left: 10px;
            top: 10px;
        } 
    }
`;


// 통계 이력
export const StatisticsHistoryComponent = styled(HistorysCommon)`

    .hscTb{
        display: block;
        width: 100%;
        height: 100%;
    }

    .hsGraphConts{
        display: block;
        width: 100%;
        height: calc(100vh - 400px);
        background: #1B212C;
        padding: 16px;
    }

    .hsGraphBox{
        display: inline-block;
        width: 372px;
        height: 49%;
        padding: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        background: #222A38;
    }

    .hsGraphTitle{
        display: block;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        color: ${(props) => props.theme.primary};
        margin-bottom: 20px;
    }

    .hsGraphArea{
        display: block;
        height: 90%;
    }

    .hsLocationdGraphArea{
        display: block;
        height: 90%;
        margin-right: 6px;
    }
`;

