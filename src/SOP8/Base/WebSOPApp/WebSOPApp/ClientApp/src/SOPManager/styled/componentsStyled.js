
import styled from 'styled-components';

import UpIcon from '../../SOPManager/images/upIcon_B.svg';
import DownIcon from '../../SOPManager/images/downIcon_B.svg';
import DeleteIcon from '../../SOPManager/images/deleteIcon_B.svg';
import sopMenuArrowDown from '../../SOPManager/images/sopMenuArrowDown.png';
import sopMenuArrowUp from '../../SOPManager/images/sopMenuArrowUp.png';
import check_mark from '../../Common/images/check_mark.png';

/**********************************************************************/
// SOP편집 공통 CSS

/* SOP편집 설명문 작성 */
export const AnnotationPropertyComponent = styled.div`
    height: 100%;

    .sprCont{
        display: block;
        height: 100%;
        padding-bottom: 60px;
        position: relative;

        textarea, input {
            font-size: 0.8125rem;
        }
        .sprmExp{
            height: 100%;
        }
        .arrowBox {
            height: 100%;
            padding: 15px 18px;
        
            > h4{
                font-family: 'Spoqa Han Sans Neo','sans-serif';
                font-size: 1rem;
                color: ${({ theme }) => theme.colors.text.primary};
                margin-bottom: 20px;
            }
        }
    } 
    
    .sprTop{
        display: block;
        padding: 15px 18px 26px 18px;
        font-family: 'Spoqa Han Sans Neo','sans-serif';
    } 

    .scrollWrapper{
        overflow:auto;
        padding: 0 !important;
        position: relative;
    }

    .scrollbarOuter{
        height: 100%;
        overflow-y: auto;
    }
    
    .scrollContentAnnotation{
        display: block;
        height: calc(100vh - 250px);
    
        > textarea{
            display: block;
            width: 100%;
            height: 94%;
            border-radius: 4px; 
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
            font-size: 0.8125rem;
            border: solid 1px #485775 !important;
            background: ${({ theme }) => theme.colors.background.surface};
        }
    
        > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .sprmExTxt {
        display: block; 
        width: 100%; 
        height: 100%; 
        border: solid 1px #aaa !important; 
        border-radius: 4px; 
    }
    .sprmExTxt textarea {
        resize: none; 
        padding: 10px !important;
    }
    
    .sprBot{
        height: 60px;
        padding: 10px 15px;
        text-align: right;
        position: absolute;
        left: 0;
        right: 10px;
        bottom: -6px;
    
        > a:nth-child(1){
            display: inline-block;
            width: 57px;
            height: 23px;
            line-height: 23px;
            text-align: center;
            border-radius: 4px;
            background: transparent;
            color: ${({ theme }) => theme.colors.text.primary};
            margin-right: 6px;
            cursor: pointer;
            font-size: 0.8125rem;
            border: 1px solid #29313E;
        }
        > a:nth-child(2){
            display: inline-block;
            width: 57px;
            height: 23px;
            line-height: 23px;
            text-align: center;
            border-radius: 4px;
            background: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.text.inverse};
            cursor: pointer;
            font-size: 0.8125rem;
        }
    }
`;


export const SprTitle = styled.div`
    display: block;
    height: 46px;
    line-height: 46px;
    background: ${({ theme }) => theme.colors.background.overlay};
    color: ${({ theme }) => theme.colors.primary};
    padding: 0px 18px;
    font-size: 1.125rem;
    font-family: 'Spoqa Han Sans Neo','sans-serif';
    font-weight: 700;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
`;


/* SOP편집 시작/종료 작성 */
export const EndpointPropertyComponent = styled(AnnotationPropertyComponent)`
    height: 100%;

    .sprStartBox{
        height: 97%;
        padding: 15px 18px;

        > h4{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            font-size: 1rem;
            color: ${({ theme }) => theme.colors.text.primary};
            margin-bottom: 20px;
        }

        label {
            font-size: 0.875rem;

            > div {
                margin-right: 0px;
            }
        }

        textarea {
            font-size: 0.8125rem;
        }
    }

    .scrollWrapperStart{
        overflow:auto;
        padding: 0 !important;
        position: relative;
        height: 96%;
    }

    .scrollContentStart{
        display: block;
        height: 100%;
        margin-bottom: 0;
        margin-right: 0;
        max-height: none;
    
        > textarea{
            display: block;
            width: 100%;
            height: 100%;
            border: solid 1px #485775 !important;
            border-radius: 4px; 
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
        }
    
        > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .sprmExTxt {
        display: block; 
        width: 100%; 
        height: 100%; 
        border: solid 1px #aaa !important; 
        border-radius: 4px; 
    }
    .sprmExTxt textarea {
        resize: none; 
        padding: 10px !important;
    }

    .scrollbarOuter{
        height: 100%;
        overflow-y: auto;
    }

    .sprmStend{
        height: 34px;
        line-height: 34px;
    
        > li{
            float: left;
            margin-right: 20px;
            color: ${({ theme }) => theme.colors.text.primary};
        }
        > li > label{
            cursor: pointer;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        }
    }

    .labelInputRadio{
        display: inline-block;
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 1rem;
        margin-right: 5px;
    }

    .labelInput {
        position: relative;
        top: -2px;
        cursor: pointer;
        margin-right: 5px;
    }
`;


/* SOP편집 화살표 작성 */
export const ArrowPropertyComponent = styled(AnnotationPropertyComponent)`
    .scrollWrapperArrow{
        overflow:auto;
        padding: 0 !important;
        position: relative;
        height: 96%;

        ${({ theme }) => theme.mixins.scroll()};
    }

    .scrollContentArrow{
        display: block;
        height: 100%;
        margin-bottom: 0;
        margin-right: 0;
        max-height: none;

        > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            box-sizing: border-box;
            height: 100% !important;
            margin: 0;
            max-height: none !important;
            max-width: none !important;
            overflow-y: auto !important;
            padding: 5px;
            position: relative !important;
            top: 0;
            width: 100% !important;
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            height: 100%;
        }
    }

    .scrollbarOuter{
        height: 100%;
        overflow-y: auto;
    }

    .sprmExTxt {
        display: block; 
        width: 100%; 
        height: 100%; 
        border: solid 1px #aaa !important; 
        border-radius: 4px; 
    }
    .sprmExTxt textarea {
        resize: none; 
        padding: 10px !important;
    }
`;


/* SOP편집 판단문 작성 */
export const DecisionPropertyComponent = styled(AnnotationPropertyComponent)`
    .sprContDecision{
        display: block;
        height: 100%;
        padding-bottom: 60px;
        position: relative;
        user-select: none;

        label, div {
            font-size: 0.875rem;
            overflow: hidden;
        }

        textarea, td, p {
            font-size: 0.8125rem;
        }

        .nwrp {
            width: 150px;
            ${({ theme }) => theme.mixins.textEllipsis()};
            text-align: center;
        }
    }

    .sprtTitle{
        display: flex;
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 20px;
        
        > h4 {
            font-size: 1rem;
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            flex: 1;
        }
    
        > div > label{
            color: ${({ theme }) => theme.colors.text.primary};
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            font-size: 0.75rem;
            cursor: pointer;
            font-weight: 400;
            position: relative;
        }
    } 

    input[type=checkbox] {
        background: ${({ theme }) => theme.colors.text.primary};
        margin-right: 5px;
    }

    input[type=checkbox]:checked {
        background: url(${check_mark}) no-repeat center center; 
    }

    input[type=checkbox] + label {
        font-size: 0.75rem; 
        font-weight: 400; 
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .labelInput{
        display: flex;
        align-items: center;
        margin-right: 5px;
    }

    .sskChk {
        position: absolute; 
        left: 15px; 
        bottom: 15px;
    }
    .sskChk label {}

    .scrollContentDecision{
        display: block;
        height: 93px;
    
        > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            box-sizing: border-box;
            height: 100% !important;
            max-height: none !important;
            max-width: none !important;
            overflow-y: auto !important;
            padding: 5px;
            width: 100% !important;
            color: ${({ theme }) => theme.colors.text.primary};
            height: 100%;
            border: solid 1px #485775 !important;
            background: ${({ theme }) => theme.colors.background.surface};
            border-radius: 4px;
            font-size: 0.8125rem;
        }
        > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .scrollWrapperDecision{
        overflow:auto;
        padding: 0 !important;
        position: relative;
        height: calc(100% - 120px);
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sprmCont{
        > dl > dt > dd > h5{
            color: ${({ theme }) => theme.colors.text.primary};
        }
    
        > dl > dt {
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            line-height: 50px;
    
            &:after {
                content: '';
                display: block;
                width: 18px;
                height: 13px;
                position: absolute;
                right: 15px;
                top: 46%;
                margin-top: -4px;
                background: url(${sopMenuArrowDown})no-repeat center bottom;
                background-size: 100% auto;
            }
        }
    }

    .sprmAcdn {}
    .sprmAcdn dt {
        position: relative; 
        height: 50px; 
        line-height: 56px; 
        padding: 0 18px; 
        color: ${({ theme }) => theme.colors.text.primary};
        cursor: pointer; 
        margin-top: 1px;  
        font-size: 0.875rem; 
        color: #485775;
    }
    .sprmAcdn dt:first-child {
        border-top: none;
    }
    .sprmAcdn dt.on {
        color: ${({ theme }) => theme.colors.primary};
        cursor: default; 
        background-color: ${({ theme }) => theme.colors.background.overlay};
    }
    .sprmAcdn dt.on::after {
        background: url(${sopMenuArrowUp})no-repeat center bottom;
    }
    .sprmAcdn dd { 
        display: none;
        padding: 15px 20px;
    }
    .sprmAcdn dd:last-child { }
    .sprmAcdn dd.on {
        display: block;
    } 

    .scrollContentModify{
        display: block;
        height: 93px;
    
        > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            box-sizing: border-box;
            height: 100% !important;
            max-height: none !important;
            max-width: none !important;
            overflow-y: auto !important;
            padding: 5px;
            width: 100% !important;
            color: ${({ theme }) => theme.colors.text.primary};
            height: 100%;
            border: solid 1px #485775 !important;
            background: ${({ theme }) => theme.colors.background.surface};
            border-radius: 4px;
        }
    
        > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .tableTitle{
        display: block;
        height: 30px;
        line-height: 30px;
        color: ${({ theme }) => theme.colors.text.primary};
        margin-top: 20px;
    }

    .sopEdtTb{
        > table{
    
        }
        > table > colgroup > col:nth-child(1){
            width:25%;
        }
        > table > colgroup > col:nth-child(2){
            width:25%;
        }
        > table > colgroup > col:nth-child(3){
            width:50%;
        }
        > table > thead{
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.8125rem;
            font-weight: 600;
            height: 32px;
            line-height: 32px;
            border-top: solid 1px ${({ theme }) => theme.colors.text.primary};
            background: #d4d4d421;
            text-align: center;
        }
        > table > tbody{
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.8125rem;
        }
        > table > th,td{
            text-align: center;
            border-bottom: solid 1px #ebebeb5e;
            padding: 5px 0;
            ${({ theme }) => theme.mixins.textEllipsis()};
        }
        > table > th{
            background: #f7f7f7;
            border-top: solid 1px #555;
        } 
    }

    .tal{
        text-align: left !important;
    }

    .scrollContentJudgment{
        display: block;
        height: 93px;
    
        > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            box-sizing: border-box;
            height: 100% !important;
            max-height: none !important;
            max-width: none !important;
            overflow-y: auto !important;
            padding: 5px;
            width: 100% !important;
            color: ${({ theme }) => theme.colors.text.primary};
            height: 100%;
            border-radius: 4px;
            border: solid 1px #485775;
            background: ${({ theme }) => theme.colors.background.surface};

            ${({ theme }) => theme.mixins.scroll()};
        }
    }
`;


/* SOP편집 판단문 작성 */
export const InternalPropertyComponent = styled(AnnotationPropertyComponent)`

    .sprtTitle{
        display: flex;
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 20px;
        
        > h4 {
            font-size: 1rem;
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            flex: 1;
        }
    
        > div > label{
            color: ${({ theme }) => theme.colors.text.primary};
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            font-size: 0.75rem;
            cursor: pointer;
            font-weight: 400;
            position: relative;
        }
    }

    input[type=checkbox] {
        background: ${({ theme }) => theme.colors.text.primary};
        margin-right: 5px;
    }

    input[type=checkbox]:checked {
        background: url(${check_mark}) no-repeat center center; 
    }

    input[type=checkbox] + label {
        font-size: 0.75rem; 
        font-weight: 400; 
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .labelInput{
        display: flex;
        align-items: center;
        font-size: 0.75rem; 
    }

    .sprtIptTitleInter{
        display: flex;

        > dt{
            float: left;
            width: 20%;
            line-height: 31px;
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.875rem;
        }
        > dd{
            float: left;
            width: 80%;
            margin-bottom: 6px;
            border-radius: 4px;
        }
        > dd > input{
            display: block;
            width: 100%;
            height: 31px;
            border-radius: 4px;
            color: ${({ theme }) => theme.colors.text.primary};
            border: solid 1px #485775;
            background: ${({ theme }) => theme.colors.background.surface};
        }
    }

    .sprtIpt{
        display: flex;
    
        > dt{
            float: left;
            width: 20%;
            line-height: 32px;
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.875rem;
        }
        > dd{
            float: left;
            width: 80%;
            margin-bottom: 6px;
            border-radius: 4px;
        }
        > dd > input{
            display: block;
            width: 100%;
            height: 31px;
            border-radius: 4px;
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            border: none;
            font-size: 0.8125rem;
            padding-left: 5px;
        }
    }

    .scrollContentReci{
        display: block;
        height: 83px;
    
        > textarea{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px; 
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
            font-size: 0.8125rem;
            border: solid 1px #485775;
            background: ${({ theme }) => theme.colors.background.surface};
        }
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sprtTxt{
        display: block; 
        width: 100%; 
        border-radius: 4px;
    }

    .sprMidInternal{
        width: 100%;
        height: 70%;
        overflow-y: auto;
        border-top: dashed 1px #485775;
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .scrollContentInternal{
        height: 93%;
    }

    .sprmCont{
        > dl > dt > dd > h5{
            color: ${({ theme }) => theme.colors.text.primary};
        }
    
        > dl > dt {
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            line-height: 50px;
    
            &:after {
                content: '';
                display: block;
                width: 18px;
                height: 13px;
                position: absolute;
                right: 15px;
                top: 46%;
                margin-top: -4px;
                background: url(${sopMenuArrowDown})no-repeat center bottom;
                background-size: 100% auto;
            }
        }
        .sprmCheckBox{
            height: 37px;
            padding: 8px 20px;
            background: #293142;
        }

        .sprmCheckBox > span{
            margin-right: 15px;
        }

        input[type=checkbox] {
            background: ${({ theme }) => theme.colors.text.primary};
        }

        input[type=checkbox]:checked {
            background: url(${check_mark}) no-repeat center center;
        }

        input[type=checkbox] + label {
        }

        .sprmRadioBox{
            height: 37px;
            padding: 8px 20px;
            border-bottom: dashed 1px #485775;
        }

        .sprmRadioBox > span{
            margin-right: 10px;
        }

        input[type=radio] {
            background: ${({ theme }) => theme.colors.text.primary};
            margin-right: 4px;
        }
        input[type=radio]:checked {
            color: ${({ theme }) => theme.colors.text.primary};
            border: solid 1.5px ${({ theme }) => theme.colors.primary};
        }
        label {
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.75rem;
        }
    }

    .sprmAcdn {}
    .sprmAcdn dt {
        position: relative; 
        height: 50px; 
        line-height: 56px; 
        padding: 0 18px; 
        color: ${({ theme }) => theme.colors.text.primary};
        cursor: pointer; 
        margin-top: 1px;  
        font-size: 0.875rem; 
        color: #485775; 
    }
    .sprmAcdn dt:first-child {
        border-top: none;
    }
    .sprmAcdn dt.on {
        color: ${({ theme }) => theme.colors.primary};
        cursor: default; 
        background-color: ${({ theme }) => theme.colors.background.overlay};
    }
    .sprmAcdn dt.on::after {
        background: url(${sopMenuArrowUp})no-repeat center bottom;
    }
    .sprmAcdn dd { 
        display: none;
    }
    .sprmAcdn dd:last-child { }
    .sprmAcdn dd.on {
        display: block;
    } 

    .sprmTeam{
        padding: 10px 0px 0px 20px;
    };

    .sprmSprd{
        line-height: 34px;
        color: ${({ theme }) => theme.colors.text.primary};
        background: #d4d4d421;
        margin: 10px 20px;
    
        > h5{
            border-bottom: solid 1px #d7d7d7;
            text-align: center;
            line-height: 36px;
            font-size: 0.875rem;
        }
    }

    .scrollContentSpread{
        display: block;
        height: 238px;
    
        > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            border: solid 1px #485775;
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.875rem;
            padding: 10px;
        }
    }

    .sprmSpTxt {
        display: block; 
        width: 100%; 
        border: solid 1px #485775;
        background: ${({ theme }) => theme.colors.background.surface};
        border-radius: 4px; 
        color: ${({ theme }) => theme.colors.text.primary};
        padding: 10px;
    }
    .scroll-textarea.sprmSpTxt > .scroll-content > textarea {
        height: 238px !important; 
        padding: 10px !important;
    } 
`;


/* SOP편집 프로세스 작성 */
export const ProcessPropertyComponent = styled(AnnotationPropertyComponent)`
    .sprContProcess{
        display: block;
        height: 100%;
        padding-bottom: 60px;
        position: relative;
        user-select: none;
    }

    .sprtTitle{
        display: flex;
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 20px;
        
        > h4 {
            font-size: 1rem;
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            flex: 1;
        }
    
        > div > label{
            color: ${({ theme }) => theme.colors.text.primary};
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            font-size: 0.75rem;
            cursor: pointer;
            font-weight: 400;
            position: relative;
        }
    } 

    input[type=checkbox] {
        background: ${({ theme }) => theme.colors.text.primary};
        margin-right: 5px;
    }

    input[type=checkbox]:checked {
        background: url(${check_mark}) no-repeat center center; 
    }

    input[type=checkbox] + label {
        font-size: 0.75rem; 
        font-weight: 400; 
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .labelInput{
        display: flex;
        align-items: center;
        margin-right: 5px;
    }

    .sprtIpt{
        display: flex;
    
        > dt{
            float: left;
            width: 20%;
            line-height: 32px;
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.875rem;
        }
        > dd{
            float: left;
            width: 80%;
            margin-bottom: 6px;
            border-radius: 4px;
        }
        > dd > input{
            display: block;
            width: 100%;
            height: 31px;
            border-radius: 4px;
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            border: solid 1px #485775;
            font-size: 0.8125rem;
            padding-left: 5px;
        }
    }

    .scrollContentReci{
        display: block;
        height: 83px;
    
        > textarea{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px; 
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
            font-size: 0.8125rem;
            border: solid 1px #485775;
            background: ${({ theme }) => theme.colors.background.surface};
        }
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sprtTxt{
        display: block; 
        width: 100%; 
        border-radius: 4px;
    }

    .sprMid{
        width: 100%;
        height: 100%;
        border-top: dashed 1px #485775;
        ${({ theme }) => theme.mixins.scroll()};
    } 

    .scrollWrapperProcess{
        overflow:auto;
        padding: 0 !important;
        position: relative;
        height: calc(100% - 120px);
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sprmCont{
        > dl > dt > dd > h5{
            color: ${({ theme }) => theme.colors.text.primary};
        }
    
        > dl > dt {
            position: relative;
            font-size: 1rem;
            font-weight: bold;
            line-height: 50px;
    
            &:after {
                content: '';
                display: block;
                width: 18px;
                height: 13px;
                position: absolute;
                right: 15px;
                top: 46%;
                margin-top: -4px;
                background: url(${sopMenuArrowDown})no-repeat center bottom;
                background-size: 100% auto;
            }
        }

        input[type=checkbox] {
            background: ${({ theme }) => theme.colors.text.primary};
        }

        input[type=checkbox]:checked {
            background: url(${check_mark}) no-repeat center center;
        }

        input[type=checkbox] + label {
        }

        .sprmRadioBox{
            height: 37px;
            padding: 8px 20px;
            border-bottom: dashed 1px #485775;
        }

        .sprmRadioBox > span{
            margin-right: 10px;
        }

        input[type=radio] {
            background: ${({ theme }) => theme.colors.text.primary};
            margin-right: 4px;
        }
        input[type=radio]:checked {
            color: ${({ theme }) => theme.colors.text.primary};
            border: solid 1.5px ${({ theme }) => theme.colors.primary};
        }
        label {
            color: ${({ theme }) => theme.colors.text.primary};
            font-size: 0.75rem;
        }
    }
    
    .sprmAcdn {}
    .sprmAcdn dt {
        position: relative; 
        height: 50px; 
        line-height: 56px; 
        padding: 0 18px; 
        color: ${({ theme }) => theme.colors.text.primary};
        cursor: pointer; 
        margin-top: 1px;  
        font-size: 0.875rem; 
        color: #485775; 
    }
    .sprmAcdn dt:first-child {
        border-top: none;
    }
    .sprmAcdn dt.on {
        color: ${({ theme }) => theme.colors.primary};
        cursor: default; 
        background-color: ${({ theme }) => theme.colors.background.overlay};
    }
    .sprmAcdn dt.on::after {
        background: url(${sopMenuArrowUp})no-repeat center bottom;
    }
    .sprmAcdn dd { 
        display: none;
    }
    .sprmAcdn dd:last-child { }
    .sprmAcdn dd.on {
        display: block;
    } 

    .sprmTeam{
        padding: 10px 0px 0px 20px;
    };

    .sprmUdn{
        display: flex;
        margin: 6px 20px;
    
        & > span {
            cursor: pointer;
        }
    }

    .sprmUdnUp{
        display: inline-block;
        width: 26px;
        height: 26px;
        margin-right: 6px;
        text-align: center;
        background: url(${ UpIcon }) no-repeat;
    }

    .sprmUdnDown{
        display: inline-block;
        width: 26px;
        height: 26px;
        text-align: center;
        background: url(${ DownIcon }) no-repeat;
        flex: 1;
    }

    .sprmUdnDel{
        display: inline-block;
        width: 26px;
        height: 26px;
        text-align: center;
        background: url(${ DeleteIcon }) no-repeat;
    }
    .sprmAdd{
        display: block;
        height: 40px;
        line-height: 40px;
        color: #232B33;
        background: ${({ theme }) => theme.colors.primary};
        margin: 15px 20px;
        text-align: center;
        border-radius: 3px; 
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: bold;
    }
    .sprmTb {
        display: block;
        padding: 0px 20px;

        & > ul > li {
            display: flex;
            justify-content: space-between;
            padding-left: 15px;
        }

        & > ul textarea {
            border: 0;
            font-size: 0.8125rem !important;
        }
    }

    .width_15Pro{
        width: 15%;
    }

    .width_85Pro{
        width: 85%;
    }

    .blu{
    }

    .labelInput{
        display: flex;
        align-items: center;
        margin-right: 5px;
    }

    .sprmDsc{
        display: block;
        padding: 0 15px 15px 15px;

        > p{
            color: #485775;
            position: relative; 
            padding-left: 22px;
            font-size: 0.75rem;
            line-height: 18px;
            letter-spacing: 0.54px;
        }
    }

    .tal{
        display: block;
        background: ${({ theme }) => theme.colors.background.surface};
        padding: 6px;
        margin-bottom: 15px;
        border-radius: 4px;
        border: solid 1px ${({ theme }) => theme.colors.primary};

        > div > div > textarea{
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            height: 83px;
            font-size: 0.875rem;
        }
        > div > div > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > div > div > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > div > div > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    }

    .sprmUmoo {
        padding: 10px 5px;
    }
    .sprmUmoo:after {
        content: ''; 
        display: table; 
        clear: both;
    }
    .sprmUmoo span {
        display: block;
        float: left; 
        color: #345bbf; 
        border: solid 1px #345bbf; 
        background: ${({ theme }) => theme.colors.text.primary};
        font-size: 0.8125rem; 
        padding: 2px 5px; 
        margin-right: 10px; 
        border-radius: 4px; 
    }
    .sprmUmoo p {
        float: left; 
        display: block; 
        font-size: 0.875rem;
    } 

    .scrollContentMission{
        > textarea{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px; 
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
        }
        > textarea::-webkit-scrollbar {
            width: 7px;
            height: 7px;
            border-radius: 3px;
            background-color: #282828;
        }
        > textarea::-webkit-scrollbar-thumb {
            width: 3px;
            border-radius: 3px;
            background: ${({ theme }) => theme.colors.primary};
        }
        > textarea::-webkit-scrollbar-button{
            width: 0px;
            height: 0px;
        }
    
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sprtTxt{
        display: block; 
        width: 100%; 
        border-radius: 4px;
    }

    .scrollContent{
        > textarea{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            font-family: 'Spoqa Han Sans Neo','sans-serif';
            background: ${({ theme }) => theme.colors.background.surface};
            color: ${({ theme }) => theme.colors.text.primary};
            resize: none;
            padding: 10px !important;
            font-size: 0.75rem;
        }
    
        ${({ theme }) => theme.mixins.scroll()};
    } 
`;



/* 임시 보류 */
export const LabelInputText = styled.div`
    display: block;
    width: 470px;
    height: 30px;
    color: ${({ theme }) => theme.colors.text.primary};

    > input[type=text] {
        position: relative;
        width: 470px;
        height: 30px;
        border-radius: 2px;
        border: 0;
        border-top: 1px solid #29313E;
        border-left: 1px solid #29313E;
        border-bottom: 1px solid #29313E;
        background: ${({ theme }) => theme.colors.background.surface};
        color: ${({ theme }) => theme.colors.text.primary};
        padding-left: 10px;
        font-size: 0.75rem;
    }
`;


