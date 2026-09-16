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

export const HistoryComponent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #141B27;
`;

export const HistorysCommon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: rgba(255, 255, 255, 0.05);
    padding: 50px 0 0 280px;

    input[type="radio"] + label {
        color: ${({ theme }) => theme.colors.grayscale.g100};
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        margin-left: 8px; 
    }

    .contents {
        padding: 40px;
        min-width: 1200px;
        height: 100%;
        position: relative;

        .title {
            color: ${({ theme }) => theme.colors.white};
            font-size: 20px;
            font-weight: 500;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
            margin-bottom: 16px;
        }

        .searchWrap {
            background: ${({ theme }) => theme.colors.background.base};
            padding: 20px;
            border-radius: 8px;
            position: relative;
            ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column', '20px')};
    
            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '52px')};
    
                p {
                    width: 66px;
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.white};
                }

                > div {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '52px')};
                }
            }
    
            .sensorTypesWrap {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '24px')};
            }
    
            .dropWrap, .sensorTypesWrap {
                > div {
                    width: 280px;
                }
            }

            .dateWrap {
                > div {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};
                }
            }
    
            /* 기간선택 라디오버튼 */
            .selectDateWrap {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '24px')};
            }
    
            .datepickerWrap {
                float: left;
                margin-right: 30px;
        
                li {
                    float: left;
                }
            
                li:nth-child(2) {
                    line-height: 32px;
                    padding: 0 5px;
                }
            }
        
            .datepicker {
                position: relative;
                width: 160px;
                height: 28px;
                padding: 2px 20px 0 20px;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
                background: ${({ theme }) => theme.colors.background.surface};
        
                &:hover {
                    border: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                }
        
                input[type="text"] {
                    display: block;
                    width: 100%;
                    height: 24px;
                    background: transparent;
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    border: none;
                    padding: 0;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }
            
                input[type="text"] + label {
                    background: url(${dashboard_calendar_bk}) no-repeat center center;
                }
                
                .react-datepicker{
                    font-size: 0.625rem;
                }
            
                .react-datepicker-popper {
                    transform: translate3d(0, 32px, 0px) !important;
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
                        color: ${({ theme }) => theme.colors.black};
                        font-weight: bold;
                        font-size: 0.8125rem;
                        margin-bottom: 4px;
                    }
                }
            
                .react-datepicker__day-name{
                    color: ${({ theme }) => theme.colors.black};
                    display: inline-block;
                    width: 2.2rem;
                    line-height: 2.0rem;
                    text-align: center;
                    margin: 0.4rem;
                    font-size: 0.75rem;
                }
            
                .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
                    color: ${({ theme }) => theme.colors.black};
                    display: inline-block;
                    width: 2.2rem;
                    line-height: 2.0rem;
                    text-align: center;
                    margin: 0.4rem;
                    font-size: 0.75rem;
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
                    background: ${({ theme }) => theme.colors.primary.p500};
                    color: ${({ theme }) => theme.colors.white} !important;
                }
            }
        
            .btnCalendarBk {
                width: 17px;
                height: 18px;
                display: inline-block;
                z-index: 1;
                position: absolute;
                right: 20px;
                top: 3px;
                cursor: pointer;
            }
    
            .submitBtn {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translate(0, -50%);
            }
        }

        .downloadWrap {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};
            margin-top: 20px;
            margin-bottom: 8px;
        }
    }

    /* 테이블 영역 */
    .hscTb {
        display: block;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.10);
        background: ${({ theme }) => theme.colors.background.base};
        overflow: hidden;

        &.emptyContent {
            height: calc(100% - 278px);
            border-radius: 8px;
            background-color: ${({ theme }) => theme.colors.background.base};
            border: none;
        }
    }

    .hscTb th,
    .hscTb td {
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        text-align: center;
        vertical-align: middle;
    }

    .hscTb th {
        height: 34px;
        background: rgba(255, 255, 255, 0.10);
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.875rem;
        border-right: solid 1px rgba(255, 255, 255, 0.10);
    }

    .hscTb th:last-child{
        border: none;
    }

    .hscTb td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        background: rgba(255, 255, 255, 0.05);
    }

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g400};
        color: ${({ theme }) => theme.colors.grayscale.g100};
        height: 34px;
        line-height: 32px;
        font-size: 0.875rem;
        padding: 0 16px;
    }

    .scrTb table {
        background: ${({ theme }) => theme.colors.background.surface};
        table-layout: fixed;
    }

    .scrTb td {
        height: 40px;
        padding: 0 4px; 
        border-right: solid 1px ${({ theme }) => theme.colors.grayscale.g800};
        border-bottom: solid 1px ${({ theme }) => theme.colors.grayscale.g800};
        ${({ theme }) => theme.mixins.textEllipsis()};

        > input[type=checkbox] {
            top: -2px;
        }
    } 

    .scrTb td:last-child{
        border-right: none; 
        position: relative;
    }

    .colorOn{
        color: ${({ theme }) => theme.colors.primary.p500};
        background: none;

        span {
            color: ${({ theme }) => theme.colors.primary.p500} !important;
        }
    }

    .detailInfo{
        align-items: center;
        width: 72px;
        padding: 2px 10px;
        border: 1px solid #2A3344;
        border-radius: 2px;
        text-align: center;
        font-size: 0.875rem;
        font-weight: 500;
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
        width: 160px;
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
        background: ${({ theme }) => theme.colors.background.elevated};
        height: 26px;
        font-size: 0.8125rem;
        padding-left: 10px;
        border-radius: 2px;
        padding: 5px 5px 5px 10px;
        align-items: center;
    }
`;

export const HistoryMenuComponent = styled.div`
    position: fixed;
    left: 0; 
    top: 50px;
    bottom: 0;
    width: 280px;
    background: ${({ theme }) => theme.colors.background.base};
    z-index: 1;

    .hslMenu > li {
        border-bottom: solid 1px ${({ theme }) => theme.colors.grayscale.g800};
        cursor: pointer;
        line-height: 58px;
    }

    .hslMenu > li.on {
        background: ${({ theme }) => theme.colors.primary.p500};
    }

    .hslMenu > li.on a {
        color: ${({ theme }) => theme.colors.white};
    }

    .hslMenu > li a {
        padding: 16px 20px;
        display: block;
        position: relative;
        font-size: 1rem;
        line-height: 172%; /* 27.52px */
        letter-spacing: -0.48px;
        color: ${({ theme }) => theme.colors.white};
    }

    .hslMenu > li a:after {
        content: "";
        display: block;
        width: 5px;
        height: 8px;
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -4px;
    }

    .hslMenu > li a.on:after {
        color: ${({ theme }) => theme.colors.background.surface};
    }

    .toggleMenu {

        > div {
            ${({ theme }) => theme.mixins.flex()};
            color: ${({ theme }) => theme.colors.grayscale.g100}; 
            padding-right: 20px;

            &.on {
                background: ${({ theme }) => theme.colors.primary.p500};
                color: ${({ theme }) => theme.colors.white};  

                > a {
                    color: ${({ theme }) => theme.colors.white};  
                }
            }

            > svg {
                color: inherit;
                fill: currentColor;
            }
        }

        > ul {

            > li {

                > a {
                    color: ${({ theme }) => theme.colors.grayscale.g100}; 
                    padding: 12px 28px;
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }

                &.on {
                    background: rgba(255, 255, 255, 0.05);

                    > a {
                        color: ${({ theme }) => theme.colors.primary.p400};
                    }
                }
            }
        }
    }
`;


// 센서 탐지 이력
export const SensorDetectHistoryComponent = styled(HistorysCommon)`

    .scrTb {
        td {
            button.on {
                position: relative;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 2px;
                    height: 2px;
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background-color: ${({ theme }) => theme.colors.secondary.s400};
                    border-radius: 50%;
                }
            }
        }
    }
`;


// 센서 탐지 분석
export const SensorDetectAnalysisComponent = styled(HistorysCommon)`

    .hscTb {
        &.emptyContent {
            height: calc(100% - 590px);
        }
    }

    .summaryWrap {
        height: 70px;
        margin-top: 12px;
        font-size: 1rem;
        font-weight: 500;
        line-height: 20px;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        background: #2A3344;

        span {
            color: ${({ theme }) => theme.colors.primary.p500};
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 20px;
            line-height: 20px;
        }
    }

    .hscCht {
        background: #1B212C;
        padding: 27px;
        margin-top: 20px;
        margin-bottom: 19px;
    }

    .scrTb td {
        height: 34px;
    }

`;


// SOP 이력
export const SOPHistoryComponent = styled(HistorysCommon)`

    .hscTb {
        &.emptyContent {
            height: calc(100% - 233px);
        }
    }

    .searchWrap {
        li:nth-child(1) {
            gap: 60px;

            > div {
                gap: 20px;  
            }
        }

        .sensorTypesWrap {
            gap: 52px !important;
        }

        .inputWrap {
            > div {
                width: 280px;
            }
        }
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
        background: ${({ theme }) => theme.colors.white};
        width: 400px; 
        margin: 0 auto; 
        padding: 20px; 
        border-radius: 8px;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);
    }
    .hsmCont.sop {
        width: 800px;
    }
    .hsmTitle {
        ${({ theme }) => theme.mixins.flex()};
    }
    .hsmTitle h3 {
        height: 30px; 
        line-height: 30px; 
        font-size: 1.375rem; 
        font-weight: 600; 
        color: ${({ theme }) => theme.colors.black}; 
        letter-spacing: -1px; 
    }
    .hsmExl {
        display: block; 
        height: 30px; 
        line-height: 30px; 
        padding: 0 15px;
        float: left; 
        margin-left: 15px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        border-color: ${({ theme }) => theme.colors.primary.p500}; 
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.8125rem; 
        border-radius: 4px; 
        cursor: pointer;
    }
    .count {
        font-size: 12px;
        line-height: 170%;
        letter-spacing: -0.36px;
        color: ${({ theme }) => theme.colors.grayscale.g300}; 
        margin-left: 12px;

        > span {
            color: ${({ theme }) => theme.colors.primary.p400}; 
        }
    }
    .hsmCls {
        margin-left: auto;
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
        background: ${({ theme }) => theme.colors.white} !important;
    }

    .hsmTb {}
    .hsmTb th,
    .hsmTb td {
        padding: 5px; 
        text-align: center; 
        border-bottom: solid 1px #ddd; 
        font-size: 0.8125rem; 
        color: ${({ theme }) => theme.colors.black}; 
        vertical-align: middle;
    }
    .hsmTb th {
        font-weight: 500; 
        color: ${({ theme }) => theme.colors.black}; 
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
        background: ${({ theme }) => theme.colors.white} !important;
    } 

    .hsmDtl::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.colors.white};
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

    .hsmScr {
        height: 90px; 
        border: solid 1px #ddd; 
        text-align: left; 
        line-height: 1.6em; 
        -webkit-border-radius: 4px; 
        -moz-border-radius: 4px; 
        border-radius: 4px; 
        color: ${({ theme }) => theme.colors.black}; 
        overflow: auto;
    }

    .hsmScr .scroll-bar {
        background: rgba(0,0,0,0.2) !important;
    }

    .hsmScr.scroll-content {
        padding: 5px !important;
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
        background-color: ${({ theme }) => theme.colors.background.base};
    }
    .hsTbFlex::-webkit-scrollbar-thumb {
        width: 6px;
        background: ${({ theme }) => theme.colors.primary.p500};
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
        background: ${({ theme }) => theme.colors.primary.p500};
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
        ${({ theme }) => theme.mixins.textEllipsis()};
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
        background-color: ${({ theme }) => theme.colors.background.base};
    }
    .hsTbContsNum::-webkit-scrollbar-thumb {
        width: 6px;
        background: ${({ theme }) => theme.colors.primary.p500};
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
                    background-color: ${({ theme }) => theme.colors.background.base};
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
                        border-right: 1px solid ${({ theme }) => theme.colors.background.base};
                    }
                }
            } 

            .listText{
                display: inline-block;
                ${({ theme }) => theme.mixins.textEllipsis()};
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

                ${({ theme }) => theme.mixins.scroll()};

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
        color: ${({ theme }) => theme.colors.primary.p500};
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

