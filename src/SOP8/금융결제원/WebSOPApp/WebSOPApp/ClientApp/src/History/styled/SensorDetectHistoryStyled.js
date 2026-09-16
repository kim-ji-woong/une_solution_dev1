import styled from "styled-components";
import dashboard_calendar_bk from "../../Common/images/dashboard_calendar_bk.png";
import SelectBoxArrowDrop from '../../History/images/selectBoxArrowDrop.png';
import closeMemo_icon from '../images/closeMemo_icon.svg';


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
    background: ${({ theme }) => theme.colors.background.elevated};
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
            color: ${({ theme }) => theme.colors.primary.p400};
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
            margin-bottom: 16px;
        }

        .searchWrap {
            background: ${({ theme }) => theme.colors.background.surface};
            padding: 20px 40px;
            border-radius: 8px;
            position: relative;
            ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column', '20px')};
    
            > li {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '52px')};
                height: 32px;
    
                p {
                    width: 66px;
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }

                > div {
                    ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '52px')};
                }
            }
    
            .sensorTypesWrap,
            .comingPersonWrap {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '24px')};
            }
    
            .dropWrap {
                > div {
                    width: 240px;
                }
            }

            .inputWrap {
                gap: 12px;

                &::before {
                    content: '';
                    width: 1px;
                    height: 16px;
                    display: inline-block;
                    background: ${({ theme }) => theme.colors.grayscale.g700};
                    margin-right: 40px;
                }

                > p {
                    width: auto;
                }

                > div {

                    input {
                        width: 487px;
                        height: 36px;
                        border-radius: 8px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        background: ${({ theme }) => theme.colors.background.base};
                    }
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
                width: 240px;
                height: 36px;
                padding: 2px 20px 0 20px;
                border-radius: 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                background: ${({ theme }) => theme.colors.background.base};
        
                &:hover {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                }
        
                input[type="text"] {
                    display: block;
                    width: 100%;
                    background: transparent;
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    border: none;
                    padding: 0;
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
                top: 8px;
                cursor: pointer;
            }
    
            .submitBtn {
                width: 80px;
                height: 80px;
                border-radius: 4px;
                ${({ theme }) => theme.mixins.flex('center', 'center')};
                cursor: pointer;
                background-color: ${({ theme }) => theme.colors.primary.p500};
                position: absolute;
                right: 40px;
                top: 50%;
                transform: translate(0, -50%);
        
                > span {
                    color: ${({ theme }) => theme.colors.grayscale.g20};
                    font-size: 0.875rem;
                    letter-spacing: -0.42px;
                }
            }
        }

        .downloadWrap {
            ${({ theme }) => theme.mixins.flex('flex-end', 'center')};
            margin-top: 20px;
            margin-bottom: 10px;
    
            li {
                margin-left: 10px;
                ${({ theme }) => theme.mixins.flex('center', 'center')};
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
    
                a {
                    color: ${({ theme }) => theme.colors.grayscale.g20};
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }
    
                a.disabled {
                    pointer-events: none;
                    opacity: 0.4;
                }
    
                a:focus {
                    outline: none;
                }
            }
        }
    }

    /* 테이블 영역 */
    .hscTb {
        display: block;
        border-radius: 8px;
        overflow: hidden;

        &.emptyContent {
            height: 594px;
            background-color: ${({ theme }) => theme.colors.background.surface};
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
        height: 32px;
        background: #2A3344;
        color: ${({ theme }) => theme.colors.grayscale.g200};
        font-size: 0.875rem;
        border-right: solid 1px ${({ theme }) => theme.colors.grayscale.g700};
    }

    .hscTb th:last-child{
        border: none;
    }

    .hscTb td select {
        display: inline-block;
    }

    .hscTb td a {
        display: inline-block;
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g400};
        color: ${({ theme }) => theme.colors.grayscale.g100};
        height: 32px;
        line-height: 30px;
        font-size: 0.875rem;
        padding: 0 16px;
        border-radius: 6px;
    }

    .scrTb {
        overflow-x: auto;
    }

    .scrTb table {
        min-width: 1400px;
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
    background: ${({ theme }) => theme.colors.background.surface};
    z-index: 1;

    .hslMenu > li {
        border-bottom: solid 1px #29313E;
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
        font-weight: 500;
        line-height: 172%; /* 27.52px */
        letter-spacing: -0.48px;
        color: ${({ theme }) => theme.colors.grayscale.g100};
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


// 이벤트 정보 -> 메모
export const SensorDetectHistoryMemoComponent = styled.div`
    #hsMmo {
        position: fixed; 
        z-index: 102;  
        background: rgba(0,0,0,0.7);
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0;
    } 
    #hsMmo > div {
        display: table;
    }
    #hsMmo > div > div {
        display: table-cell; 
        vertical-align: middle;
        position: fixed;
        width: 300px;
        height: 300px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        background: ${({ theme }) => theme.colors.background.base};
        border-radius: 5px; 
    } 

    .dslTopMemo{
        position: relative;
        display: flex;
        align-items: center;
        height: 44px;
        padding: 0 15px;
        border-bottom: solid 1px #29313E;
    }

    .squareIcon{
        display: inline-block;
        width: 4px;
        height: 4px;
        background: ${({ theme }) => theme.colors.primary.p500};
        margin-right: 4px;
    }

    .squareTitle{
        display: inline-flex;
        flex: 1;
        font-size: 0.875rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .dslX{
        width: 14px;
        height: 14px;
        text-indent: -9999px;
        background: url(${closeMemo_icon}) no-repeat center center;
        z-index: 1;
        cursor: pointer;
    }

    .memoContents {
        display: block;
        height: calc(100% - 42px);
        /* margin: 10px 15px; */
        padding: 15px;
    }

    .memoContents > textarea{
        background: ${({ theme }) => theme.colors.background.surface};
        border: none;
        font-family: 'Spoqa Han Sans Neo';
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0em;
        color: ${({ theme }) => theme.colors.white};
    }

    .memoTxt {
        height: 240px;
        border: solid 1px #ddd;
        margin-top: 10px;
        border-radius: 4px;
        border: dashed 1px red;
    }

    .memoTxt .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    textarea.memoTxt {
        padding: 10px !important;
    }
`;


// 이벤트 탐지 이력
export const SensorDetectHistoryComponent = styled(HistorysCommon)`

`;


// 이벤트 탐지 분석
export const SensorDetectAnalysisComponent = styled(HistorysCommon)`

    .hscTb {
        &.emptyContent {
            height: 291px;
        }
    }

    .summaryWrap {
        border-radius: 8px;
        background: #2A3344;
        height: 70px;
        margin-top: 12px;
        font-size: 1rem;
        font-weight: 500;
        line-height: 20px;
        ${({ theme }) => theme.mixins.flex('center', 'center')};

        span {
            color: ${({ theme }) => theme.colors.secondary.s500};
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 20px;
            line-height: 20px;
        }
    }

    .hscCht {
        background: ${({ theme }) => theme.colors.background.surface};
        padding: 27px;
        margin-top: 12px;
        margin-bottom: 16px;
        border-radius: 8px;
    }
`;


// SOP 이력
export const SOPHistoryComponent = styled(HistorysCommon)`

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


// 순찰 결과 이력
export const PatrolHistoryComponent = styled(HistorysCommon)`

`;

export const PatrolHistoryDetailInfoComponent = styled(SOPHistoryDetailInfoComponent)`
    .hsmCont.sop {
        height: 590px;
    }

    .hsmPrc {
        height: 500px;
    }
`;

export const ComingPersonHistoryComponent = styled(HistorysCommon)`


    .dropWrap {

        > label {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
            color: ${({ theme }) => theme.colors.grayscale.g100};
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    }
`;

export const ParkingHistoryComponent = styled(HistorysCommon)`

`;