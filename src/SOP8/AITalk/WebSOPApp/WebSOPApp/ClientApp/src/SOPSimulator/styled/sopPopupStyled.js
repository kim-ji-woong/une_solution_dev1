import styled from 'styled-components';
import close_icon from "../../Common/images/dashboard_layer_close.png";


export const BeginOptionComponent = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #333;

    & > div {
        display: table;
        width: 100%;
        height: 100%;
    }
    & > div > div {
        display: table-cell;
        vertical-align: middle;
    }

    .sqPop {
        background: ${({ theme }) => theme.colors.background.surface};
        width: 538px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    }

    .sqpTop {
        background-color: ${({ theme }) => theme.colors.background.base};
        display: block;
        cursor: default;
    }

    .sqpTop:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpTop h4 {
        float: left;
        height: 40px;
        line-height: 40px;
        color: ${({ theme }) => theme.colors.primary.p500};
        padding-left: 20px;
        font-size: 1.125rem;
        font-weight: 600;
    }

    .sqpTop p {
        float: left;
        height: 40px;
        line-height: 40px;
        color: #485775;
        margin-left: 30px;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sqpTop a {
        display: block;
        float: right;
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        background: url(${close_icon}) no-repeat center center;
        background-size: 12px auto;
        cursor: pointer;
    }

    .sqpCont{
    }

    .sqpUp {
        padding: 20px;
        color: ${({ theme }) => theme.colors.black};
    }

    .sqpSel {
        display: block;
        width: 100%;
        height: 35px;
        background: ${({ theme }) => theme.colors.white};
        color: #485775;
        border-radius: 3px !important;
    }

    .sqpChk {
        margin-top: 15px;
    }

    .sqpRdo {
        margin-bottom: 20px;
    }

    .sqpRdo li {
        margin-bottom: 10px;
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.white};
    }

    .sqpRdo li:last-child {
        margin-bottom: 0;
    }

    .sqpRdo li input[type="radio"] {
        margin-right: 10px;
    }

    .sqpRdoWord {
        color: black;
    }

    .sqpDown {
        padding: 0px 20px;
        color: ${({ theme }) => theme.colors.black};
    }

    .sqpTime {
        margin: 0 -3px;
        height: 34px;
    }

    .sqpTime:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpTime li {
        float: left;
        line-height: 40px;
        font-size: 0.875rem;
        padding: 0 3px;
    }

    .sqpTime li select {
        display: block;
        width: 100%;
        height: 34px;
        border-radius: 3px;
        padding-left: 6px;
        color: #485775;
        pointer-events: none;
    }

    .sqpTime li input[type="text"] {
        display: block;
        width: 100%;
    }

    .sqpTime li:nth-child(1) {
        width: 15%;
    }

    .sqpTime li:nth-child(2) {
        color: ${({ theme }) => theme.colors.white};
        width: 5%;
    }

    .sqpTime li:nth-child(3) {
        width: 15%;
    }

    .sqpTime li:nth-child(4) {
        color: ${({ theme }) => theme.colors.white};
        width: 5%;
    }

    .sqpTime li:nth-child(5) {
        width: 15%;
    }

    .sqpTime li:nth-child(6) {
        color: ${({ theme }) => theme.colors.white};
        width: 5%;
    }

    .sqpTime li:nth-child(7) {
        width: 15%;
    }

    .sqpTime li:nth-child(8) {
        width: 5%;
        text-align: center;
        color: ${({ theme }) => theme.colors.white};
    }

    .sqpTime li:nth-child(9) {
        width: 15%;
    }

    .sqpTime li:nth-child(1) {

    }

    .sqpTime li:nth-child(3) {

    }

    .sqpTime li:nth-child(5) {

    }

    .sqpTime li:nth-child(7) {
        margin-left: 10px;
    }

    .sqpTime li:nth-child(9) {

    }

    .sqpSelectBox{ 
        background: ${({ theme }) => theme.colors.background.base}; 
    }

    .sqpBtn {
        padding-top: 20px;
        margin: 0 -2px;
        margin-bottom: 20px;
    }

    .sqpBtn:after {
        content: "";
        display: table;
        clear: both;
    }

    .sqpBtn li {
        float: left;
        width: 50%;
        height: 32px;
        padding: 0 6px;
    }

    .sqpBtn li a {
        display: block;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.875rem;
        border-radius: 4px;
    }

    .sqpBtn li a.bk {
        background: ${({ theme }) => theme.colors.primary.p500} no-repeat padding-box;
        color: ${({ theme }) => theme.colors.black};
        cursor: pointer;
    }

    .sqpBtn li a.bk:hover,
    .sqpBtn li a.bk:active,
    .sqpBtn li a.bk:focus {
        background: ${({ theme }) => theme.colors.primary.p500} no-repeat padding-box;
        color: ${({ theme }) => theme.colors.black};
    }

    .sqpBtn li a.gry {
        background: var(--navy-color);
        border: solid 1px #29313E;
        cursor: pointer;
    }

    .sqpBtn li a.gry:hover,
    .sqpBtn li a.gry:active,
    .sqpBtn li a.gry:focus {
        background: var(--navy-color);
    }

    .pointerEventsOff {
        pointer-events: none !important;
    }

    .pointerEventsOn {
        pointer-events: all !important;
    }
`;


export const EndPopupComponent = styled.div`
    position:absolute; 
    z-index:1000; 
    top:50%; 
    left:50%; 
    width:359px; 
    height:386px; 
    padding:0 1px; 
    background: ${({ theme }) => theme.colors.background.surface}; 
    margin:0 auto;
    border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
    border-radius:4px;
    transform:translate(-50%, -50%);

    .endBoxTop{
        line-height:46px; 
        height: 46px; 
        align-items:center; 
        background: ${({ theme }) => theme.colors.black};
    }
    .endBoxTop:after{
        content:'';
        display:table;
        clear:both;
    }
    .endBoxTop p{
        float:left; 
        width:150px;
        height:46px;
        line-height:46px;
        color: ${({ theme }) => theme.colors.primary.p500}; 
        font-weight:500;  
        padding-left: 20px;
        font-size: 1.125rem; 
        font-weight: 600;  
    }
    .endBoxTop a{
        display:inline-block;
        float:right;
        width:13px;
        height:13px;
        text-indent:-9999px;
        background:url(../image/icon/popup_close.png)no-repeat center center;
        background-size:13px auto;
        padding-top:40px; 
        padding-right:40px; 
        cursor: pointer;
    }
    .endBoxCont {
        padding:10px 15px; 
        padding-left:20px; 
        cursor: default;
    }
    .endBoxCont dl{ 
        display: flex; 
        height: 44px; 
        align-items: center; 
        border-bottom: dashed 1px #485775;  
    } 
    .endBoxCont dd{
        line-height:50px; 
        padding-left:10px; 
        text-align: right; 
        flex: 1;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    }
    .endBoxBtn{
        padding:0 3px; 
        text-align:center; 
        cursor: pointer;
    }
    .endBoxClose{
        float: right; 
        display:inline-block; 
        width:85px; 
        height:28px; 
        line-height: 28px; 
        font-size:0.875rem; 
        margin-top: 6px;
        letter-spacing: -0.05em; 
        border-radius: 4px; 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        color: ${({ theme }) => theme.colors.black};
        margin-right:10px;
    }
    .endBoxClose:hover{ 
        background: ${({ theme }) => theme.colors.primary.p500}; 
        color: ${({ theme }) => theme.colors.black};
        margin-top: 6px; 
    }
`;