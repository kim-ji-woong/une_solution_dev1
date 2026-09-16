import styled from 'styled-components';

import iconCheck from '../../Common/images/check_icon.svg'
import propagatePeople from '../../Common/images/peoples.png'
import messageDisable from '../../Common/images/message_disable.svg'
import mail_desable from '../../Common/images/mail_desable.svg'
import brdcst_on from '../../Common/images/brdcst_on.svg'
import brdcst_off from '../../Common/images/brdcst_off.svg'
import selectArrow from '../../Common/images/common/select_arrow.png'
import micOn from '../../Common/images/mic_on.png'
import volumeOn from '../../Common/images/volume_on.png'
import volumeOn2 from '../../Common/images/volume_on__.png'
import volumeOff from '../../Common/images/volume_off.png'
import volumeOff2 from '../../Common/images/volume_off_.png'




export const ProcessComponent = styled.div`
    + .sectionBox{
        margin-top:20px; 
        border-radius:5px;
    }

    .tit{ 
        position:relative; 
        border-radius:3px; 
    }

    .tit::after {
        display: block;
        content: "";
        clear: both;
    }
    
    .sectionCurrent > .tit{ 
        background: ${({ theme }) => theme.colors.primary}; 
    }

    .sectionBox.sectionRun > .tit{
        border: 2px solid ${({ theme }) => theme.colors.primary}; 
    }
    .sectionBox.sectionDone > .tit{ 
        background-color: ${({ theme }) => theme.colors.background.base};
        border-radius: 4px; 
    }

    .hasFire strong{
        width:calc(100% - 280px);
    }

    .tit.textNormal strong {
        color: #EEEEEE;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .tit.textCurrent strong {
        color: ${({ theme }) => theme.colors.text.inverse};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .tit.textRun strong {
        color: #F7F7F7;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .tit.textDone strong {
        color: #485775;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }


    > .tit{ 
        position:relative; 
        padding:10px 20px; 
        background-color: ${({ theme }) => theme.colors.background.base};
        border-radius:3px; 
    }

    .tit strong {
        float: left;
        position: relative;
        width: calc(100% - 180px);
        font-size: 1.125rem;
        line-height: 30px;
        font-weight: 500;
    }

    .tit.cRed strong {
        color: #e7525a;
    }

    .tit.cBlue strong {
        color: #4d55e3;
    }

    .tit.cGray strong {
        color: #9596ad;
    }

    .tit.cWhite strong {
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .tit.cGreen strong {
        color: #18ee9e;
    }

    .tit .flag {
        display: inline-block;
        width: 50px;
        height: 20px;
        margin-top: 5px;
        margin-left: 10px;
        padding: 2px 0;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.05em;
        color: ${({ theme }) => theme.colors.text.primary};
        border-radius: 10px;
        text-align: center;
        vertical-align: top;
    }

    .tit .flagAuto {
        background-color: #0073d4;
        border: solid 1.5px #0073d4;
    }

    .tit .flagBroadcast {
        background-color: #e91915;
        border: solid 1.5px #e91915;
    }

    .tit .flagSms {
        background-color: #ffa500;
        border: solid 1.5px #ffa500;
    }

    .tit .flagMail {
        background-color: #5eba7d;
        border: solid 1.5px #5eba7d;
    }

    .tit .btnArea {
        float: right;
        text-align: center;
        font-size: 0;
        display: flex;
    }

    .tit .btnArea a {
        display: inline-block;
        width: 80px;
        height: 30px;
        padding: 6px 0;
        border: 2px solid ${({ theme }) => theme.colors.text.primary};
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        border-radius: 4px;
    }

    .tit .btnArea .btnAllCheck {
        display: inline-block;
        width: 82px;
        height: 30px;
        line-height: 19px;
        border: 1px solid ${({ theme }) => theme.colors.primary};
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        background: ${({ theme }) => theme.colors.background.base};
        border-radius: 8px;
        cursor: pointer;
        margin-right: 16px;
        ${({ theme }) => theme.mixins.textEllipsis()};
        color: ${({ theme }) => theme.colors.primary};
    }

    .tit .btnArea .btnAllCheck:hover {
        background: ${({ theme }) => theme.colors.background.base};
    }

    .tit .btnArea .btnDisable {
        display: inline-block;
        width: 82px;
        height: 30px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 1px solid #485775;
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        border-radius: 8px;
        opacity: 0.3;
        cursor: default;
        background: none;
        pointer-events: none;
        margin-right: 16px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .seleteBox {
        float: left;
        width: 100px;
    }

    .seleteBox button {
        padding: 6px 10px;
    }

    .seleteBox .seletedTxttt:after {
        top: 7px;
    }

    .seleteBox.isShow .seletedTxttt:after {
        top: 13px;
    }

    .hasFire strong {
        width: calc(100% - 300px);
    }

    .isOn.sectionBox .hasFire strong{
        width:calc(100% - 190px);
    }
    .isOn.sectionBox .tit .btnArea .btnNext,
    .isOn.sectionBox .tit .btnArea .btnAllCheck{
        display:none;
    }
    .isOn.sectionBox .tit .btnArea .btnCheck{
        display:inline-block;
    }

    .taskDetail {
        counter-reset: taskDetail;
        border-radius: 3px;
    }

    .taskDetailFlex{ 
        display: flex; 
        align-items: center; 
        border-bottom: dashed 1px ${({ theme }) => theme.colors.background.base}; 
        padding-left: 20px; 
        border: solid 1px ${({ theme }) => theme.colors.background.base};
    }

    .taskDetail > div {
        float: left;
        width: calc(100% - 180px);
        border-radius: 3px;
    }
    .taskDetail > div + div {
        width: 180px;
    }
    .taskDetail > dt .checkk {
        width: 30px;
        display: inline-block;
        height: 30px;
        position: relative;
        top: 5px;
    }
    .taskDetail > dt .taskDetailText{
        display: inline-block;
        width: 100px;
        margin-left: 40px;
    } 

    .taskDetailBehavior {
        counter-reset: taskDetailBehavior;
        border: solid 1px #d1d1d1;
        border-radius: 3px;
    }

    @media screen and (min-width: 0px) and (max-width: 1920px) {
        .taskDetail > dt .checkk {
            width: 30px;
            display: inline-block;
            height: 30px;
            position: absolute;
            padding: 10px 10px;
        }
        .taskDetailBehavior > dt .checkk {
            width: 30px;
            display: inline-block;
            height: 30px;
            margin-left: calc(100% - 45%);
            position: absolute;
        }
        dd .check {
            height: 30px;
            padding: 5px 10px;
        }
    }

    @media screen and (min-width: 1921px) {
        .taskDetail > dt .checkk {
            width: 30px;
            display: inline-block;
            height: 30px;
            position: absolute;
            padding: 10px;
        }
        .taskDetailBehavior > dt .checkk {
            width: 30px;
            display: inline-block;
            height: 30px;
            margin-left: calc(100% - 46.5%);
            position: absolute;
        }
        dd .check {
            height: 30px;
            padding: 5px 10px;
        }
    }

    .taskDetail .action {
        color: #f8bd57;
    }

    .taskDetailBehavior .action {
        color: #f8bd57;
    }

    dt {
        padding: 10px 25px;
        font-weight: 400;
        line-height: 30px;
        letter-spacing: -0.05em;
        position: relative;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    dd {
        display: flex;
        padding-right: 0;
        font-weight: 100;
        border-bottom: 1px solid #060817;
        flex-wrap: wrap;
        padding: 10px;
    }

    dd p {
        line-height: 30px;
        align-items: center;
        justify-content: center;
    }

    dd .tit {
        position: relative; 
        width: 80%;
        padding-left: 15px;
    }

    .taskDetailBehavior dd .tit {
        position: relative;
        width: 50%;
        padding-left: 25px;
    }

    .taskDetailBehavior dd .tit:before {
        counter-increment: taskDetailBehavior;
        content: counters(taskDetailBehavior, ".") ". ";
        position: absolute;
        top: 0;
        left: 0;
    }

    dd .send {
        height: 30px;
        padding: 5px 10px;
    }

    dd .send button {
        vertical-align: top;
    }

    input[type="checkbox"] {
        width: 14px;
        height: 14px;
        background-color: ${({ theme }) => theme.colors.text.primary};
        border: 1px solid ${({ theme }) => theme.colors.text.primary};
        vertical-align: top;
    }

    input[type="checkbox"]:checked {
        background: url(${iconCheck}) no-repeat center center;
        background-size: 14px auto !important;
        border: none;
    }

    .checkBox input[type="checkbox"] {
        width: 14px;
        height: 14px;
        background-color: ${({ theme }) => theme.colors.text.primary};
        vertical-align: top;
        border: solid 1px #485775;
    }

    .checkBox input[type="checkbox"]:checked {
        background: url(${iconCheck}) no-repeat center center;
        background-size: 14px auto !important;
    }

    .sendMessage {
        display: flex;
        height: 40px;
        justify-content: flex-end;
        margin-top: 5px;
        align-items: center;
        margin-right: 20px;
    }

    .sendMessage .message {
        padding-top: 5px;
    }

    .sendMessage .wifi {
        height: 30px;
        padding: 3px 5px;
    }

    .sendMessage .send {
        height: 30px;
        padding: 0 10px;
    }

    .sendMessage .check {
        height: 30px;
        padding: 5px 20px;
        flex: 1 1;
    }

    .sendMessage + .taskDetail {
        margin-top: 8px;
    }

    .taskSubSection {
        display: flex;
        border: 1px solid #060817;
    }

    .taskSub {
        word-break: keep-all;
    }

    .taskSub dd {
        height: 130px;
        padding: 15px 20px;
        line-height: 25px;
        border-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        border-left: dashed 1px ${({ theme }) => theme.colors.background.base};
    }

    .taskSub .taskMessage {
        height: 130px;
        padding: 15px 20px;
        line-height: 25px;
        border-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
        width: 100%;
        color: white;
        border-color: transparent;
        text-align: start;
        font-size: 0.875rem;
    }

    .taskScrollbar::-webkit-scrollbar { 
        width: 7px; 
        height: 7px; 
        border-radius: 10px !important; 
    }
    .taskScrollbar::-webkit-scrollbar-thumb { 
        width: 3px; 
        background: ${({ theme }) => theme.colors.background.base}; 
        border-radius: 10px !important; 
    }
    .taskScrollbar::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }

    .taskSubList dd {
        padding: 0;
    }

    .taskSub dd.all {
        justify-content: center;
    }

    .taskSub dd:not(.all) {
        align-items: baseline;
    }

    .taskSub ul{
        display: block;
        width: 100%;
    }

    .taskSub ul li {
        padding: 10px 10px;
        line-height: 20px;
        font-size: 0.875rem;
    }

    .taskSub ul li + li {
        border-top: 1px solid #162235;
    }

    .taskSub ul li input[type="checkbox"] {
        width: 16px;
        height: 16px;
        border-color: ${({ theme }) => theme.colors.text.primary};
        background: none;
        border-radius: 2px;
        float: right;
    }

    .taskSub ul li input[type="checkbox"]:checked {
        background-size: 16px auto !important;
        background: url(${iconCheck}) no-repeat center center;
    }

    .propagatePeople {
        float: right;
        position: absolute;
        background-image: url(${propagatePeople});
        background-repeat: no-repeat;
        width: 25px;
        height: 25px;
        align-items: center;
        top: -8px;
        right: 5px;
        cursor: pointer;
    }
    
    .propagatePeople:hover {
        background-repeat: no-repeat;
        width: 25px;
        align-items: center;
    }
    
    .propagatePeoplee {
        float: left;
        display: inline-block;
        background: url(${propagatePeople});
        background-repeat: no-repeat;
        width: 25px;
        height: 25px;
        align-items: center;
        margin: 5px 10px 0 5px;
    }

    .btnArea {
        float:right; 
        text-align:center; 
        font-size:0;
        width: 178px;
    }

    .btnAreaDisable {
        float:right; 
        margin-right: 106px;
        text-align:center; 
        font-size:0;
    }

    .elevationBtn2{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid ${({ theme }) => theme.colors.text.primary};
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #F2BE08;
        margin-right: 16px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .elevationBtn3{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid ${({ theme }) => theme.colors.text.primary};
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #ff8500;
        margin-right: 16px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .elevationBtn4{
        display: inline-block;
        width: 75px;
        height: 29px;
        line-height: 16px;
        padding: 5px 0 0 5px;
        border: 2px solid ${({ theme }) => theme.colors.text.primary};
        font-size: 0.875rem;
        letter-spacing: -0.05em;
        border-radius: 15px !important;
        cursor: pointer;
        background: #E80800;
        margin-right: 16px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .completionStatus{ 
        margin-left: 15px;
        text-align: center;
        font-size: 0.875rem;
        display: inline-flex;
        flex: 1;
    }

    .completionStatuss{ 
        float:right; 
        right:13px; 
        position:absolute; 
        top:17px; 
        width: 50px;
        font-size: 0.875rem;
        display:inline-block; 
        z-index:1; 
        margin-right: 4px; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .processTextarea { 
        display: block; 
        min-height: 100px; 
        line-height: 25px;
        border-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        resize: none;
        padding-right: 10px;
        background-color: transparent;
        width: 100%; 
        color: white;
        border-color: transparent; 
        text-align: start; 
    }

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

    .borderSide {
        border-left: 1px solid #060817;
        border-right: 1px solid #060817;
    }

    .processTextScrollbar { 
        overflow-y: auto; 
        padding-right: 10px; 
    }
    .processTextScrollbar::-webkit-scrollbar {
        width: 7px; 
        height: 7px; 
        border-radius: 10px !important; 
    }
    .processTextScrollbar::-webkit-scrollbar-thumb { 
        width: 3px; 
        background: ${({ theme }) => theme.colors.background.base}; 
        border-radius: 10px !important; 
    }
    .processTextScrollbar::-webkit-scrollbar-button{ 
        width: 0px; 
        height: 0px; 
    }
`;


export const DecisionComponent = styled(ProcessComponent)`
    strong {
        width: calc(100% - 280px);
    }

    .choiceBox {
        background-color: #060817;
        color: ${({ theme }) => theme.colors.text.primary};
        text-align: left;
        margin-right: 10px;
        user-select: none;
        border: solid 1px ${({ theme }) => theme.colors.primary};
        width: 110px;
        text-align: center;
    }

    .choiceBox option {
        background-color: #060817;
    }

    .choiceBox option:hover {
        background-color: #5fb2af !important;
    }

    .choiceBox .choiceOp:hover {
        background-color: #5fb2af;
    }

    .choiceBox .decorated option:hover {
        box-shadow: 0 0 10px 100px #1882a8 inset;
    }

    .choiceBoxx {
        color: ${({ theme }) => theme.colors.text.inverse};
        text-align: left;
        margin-right: 10px;
        user-select: none;
        background: ${({ theme }) => theme.colors.background.light} url(${selectArrow}) no-repeat right center;
    }

    .seleteBox {
        position: relative;
        z-index: 50;
        font-size: 1rem;
        font-weight: 100;
        background-color: #1a1c2c;
        border-radius: 4px;
    }

    .seleteBox button {
        width: 100%;
        padding: 11px 10px;
        padding-right: 40px;
        font-weight: 100;
        text-align: left;
        vertical-align: top;
        color: white;
    }

    .seleteBox .seletedTxt:after {
        content: "";
        position: absolute;
        top: 13px;
        right: 12px;
        width: 8px;
        height: 8px;
        border-left: 2px solid #5f616c;
        border-bottom: 2px solid #5f616c;
        transform: rotate(-45deg);
    }

    .seleteBox ul {
        display: none;
        position: absolute;
        width: 100%;
        padding: 10px 0;
        background-color: #1a1c2c;
        z-index: 99;
    }

    .seleteBox.isShow {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .seleteBox.isShow .seletedTxt:after {
        top: 17px;
        transform: rotate(135deg);
    }

    .seleteBox.isShow ul {
        display: block;
    }
`;


/**********************************************************************/

export const EndPointComponent = styled(ProcessComponent)`

    .sectionBoxStart strong:before {
        counter-increment: taskOrder;
        content: no-close-quote;
        position: absolute;
        top: 0;
        left: 0;
    }

    .sectionBoxStart strong {
        padding-left: 0;
    }
`;


/**********************************************************************/

export const InternalComponent = styled(ProcessComponent)`
    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 5px 10px;
        white-space: nowrap;
        border-radius: 3px;
        background-color: ${({ theme }) => theme.colors.text.primary};
        color: ${({ theme }) => theme.colors.text.inverse};
        font-size: 0.75rem;
        font-weight: 500;
        content: attr(data-tooltip);
        text-align: center;
        line-height: 1.2;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-top: 5px solid ${({ theme }) => theme.colors.text.primary};
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        transform: translate(-50%, 0);
        top: -11px;
        left: 50%;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .sendMessage .btnWrap {
        ${({ theme }) => theme.mixins.flex()};
        gap: 15px;
    }

    .scrollbar {
        overflow-x: scroll;
        overflow-y: scroll;
    }

    .scrollbar::-webkit-scrollbar {
        width: 5.5px;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background-color: rgb(125, 131, 137);
        opacity: 0.4;
    }

    .scrollbar::-webkit-scrollbar-track {
        background-color: rgb(61, 63, 71);
        border-radius: 3px;
    }

    .scrollbar::-webkit-scrollbar-corner {
        display: none;
    }

    .soundInfo {
        position: relative;
    }

    .soundInfo.isShow .soundInfoList {
        display: block;
    }

    .soundInfo .soundInfoList {
        display: none;
        position: absolute;
        top: 38px;
        right: -35px;
        z-index: 1;
        width: 100px;
        height: 100px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .soundInfo .soundInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .soundInfo .soundInfoList button {
        width: 100%;
        font-size: 0.875rem;
        line-height: 50px;
        color: ${({ theme }) => theme.colors.text.primary};
        text-align: center;
    }

    .soundInfo .soundInfoList button[data-value="N"] {
        color: #369ed2;
    }

    .soundInfo.isOn .soundInfoList button[data-value="Y"] {
        color: #00ff4e;
    }

    .soundInfo.isOn .soundInfoList button[data-value="N"] {
        color: ${({ theme }) => theme.colors.text.primary};
    }

    /*방송, 알람 on/off*/
    .brdcstInfo {
        position: relative;
    }

    .brdcstInfo.isShow .brdcstInfoList {
        display: block;
    }

    .brdcstInfo .brdcstInfoList {
        display: none;
        position: absolute;
        top: 38px;
        right: -19px;
        z-index: 1;
        width: 70px;
        height: 90px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .brdcstInfo .brdcstInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .brdcstInfo .brdcstInfoList button {
        width: 100%;
        font-size: 0.875rem;
        line-height: 45px;
        color: ${({ theme }) => theme.colors.text.primary};
        text-align: center;
    }

    .brdcstInfo .brdcstInfoList button[data-value="N"] {
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .brdcstInfo .brdcstInfoList button[data-value="N"] {
        color: ${({ theme }) => theme.colors.text.primary};
    } 
    
    .brdcstInfoOn {
    }

    .brdcstInfoOff {
    }

    .isOn .brdcst {
        display: inline-block;
        vertical-align: top;
        background-image: url(${micOn});
    }

    .volume {
        display: inline-block;
        background: transparent url(${volumeOff}) 0 0 no-repeat
        padding-box;
        opacity: 1;
        width: 30px;
        height: 19px;
    }

    .isOn .volume {
        display: inline-block;
        vertical-align: top;
        background-image: url(${volumeOn});
    }

    .volumeInfoOn {
        color: #39a7de !important;
    }

    .volumeInfoOff {
    } 

    .volumeInfo {
        position: relative;
    }

    .volumeInfo.isShow .volumeInfoList {
        display: block;
    }

    .volumeInfo .volumeInfoList {
        display: none;
        position: absolute;
        top: 36px;
        right: -10px;
        z-index: 1;
        width: 100px;
        height: 100px;
        background-color: #060817;
        border: 1px solid #3b3f5c;
    }

    .volumeInfo .volumeInfoList li + li {
        border-top: 1px solid #3b3f5c;
    }

    .volumeInfo .volumeInfoList button {
        width: 100%;
        font-size: 0.875rem;
        line-height: 50px;
        color: ${({ theme }) => theme.colors.text.primary};
        text-align: center;
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: #369ed2;
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: ${({ theme }) => theme.colors.text.primary};
    }

    .volumeInfo .volumeInfoList button[data-value="N"] {
        color: #39a7de;
    } 
    
    .message {
        background: url(${messageDisable}) 0 0 no-repeat;
        width: 24px;
        height: 24px;
        display: inline-block;
        background-size: 100%;
    }

    .email {
        display: inline-block;
        background: transparent url(${mail_desable}) 0% 0% no-repeat
        padding-box;
        opacity: 1;
        width: 24px;
        height: 24px;
    }

    .brdcst {
        display: inline-block;
        background: url(${brdcst_off}) 0% 0% no-repeat;
        width: 24px;
        height: 24px;
    }

    .brdcst.on {
        display: inline-block;
        /* vertical-align: top; */
        background-image: url(${brdcst_on});
    }

    .volume {
        display: inline-block;
        background: transparent url(${volumeOff2}) 0 0 no-repeat
        padding-box;
        opacity: 1;
        width: 30px;
        height: 19px;
    }

    .isOn .volume {
        display: inline-block;
        vertical-align: top;
        background-image: url(${volumeOn2});
    }
`;