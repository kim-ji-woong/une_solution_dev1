import styled from 'styled-components';
import close_icon from "../../Common/images/dashboard_layer_close.png";


export const BeginOptionComponent = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

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
        border-radius: 8px;
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    }

    .sqpTop {
        background-color: #0D121A;
        display: block;
        cursor: default;
        padding: 16px 24px;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};
    }

    .sqpTop h4 {
        color: ${({ theme }) => theme.colors.primary.p500};
        font-size: 1.125rem;
        line-height: normal;
        font-weight: 700;
        white-space: nowrap;
    }

    .sqpTop p {
        color: ${({ theme }) => theme.colors.grayscale.g100};
        font-size: 1rem;
        line-height: 172%; /* 27.52px */
        letter-spacing: -0.48px;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .sqpUp {
        padding: 24px 24px 20px 24px;
        color: ${({ theme }) => theme.colors.black};
    }

    .sqpSel {
        display: block;
        width: 100%;
        height: 36px;
        background: ${({ theme }) => theme.colors.white};
        color: #485775;
        border-radius: 6px !important;
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
    }

    .sqpRdo {
        margin-bottom: 12px;
    }

    .sqpRdo li {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        margin-bottom: 12px;
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        color: ${({ theme }) => theme.colors.white};
    }

    .sqpRdo li:last-child {
        margin-bottom: 0;
    }

    .sqpRdoWord {
        color: black;
    }

    .sqpDown {
        padding: 0px 24px;
        color: ${({ theme }) => theme.colors.black};
    }

    .sqpTime {
        ${({ theme }) => theme.mixins.flex()};
    }

    .sqpTime li {
        line-height: 40px;
        font-size: 0.875rem;
        padding: 0 3px;
    }

    .sqpTime li select {
        width: 100%;
        padding-left: 6px;
        color: #485775;
        height: 36px;
        line-height: 36px;
        border-radius: 6px !important;
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
        margin: 24px 0;
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;
    }

    .sqpBtn li {
        flex: 1;
        height: 32px;
    }

    .sqpBtn li a {
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        width: 100%;
        height: 100%;
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        border-radius: 6px;
    }

    .sqpBtn li a.submit {
        background: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.white};
        cursor: pointer;
    }

    .sqpBtn li a.cancle {
        background: ${({ theme }) => theme.colors.white};
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g400};
        color: ${({ theme }) => theme.colors.grayscale.g600};
        cursor: pointer;
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
    background: #1B212C;
    margin:0 auto;
    border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    border-radius:8px;
    transform:translate(-50%, -50%);
    overflow: hidden;

    .endBoxTop{
        background: #0D121A;
        padding: 16px 24px;
    }

    .endBoxTop p{
        color: ${({ theme }) => theme.colors.primary.p500}; 
        font-size: 1.125rem; 
        font-weight: 700;
        line-height: normal;
    }

    .endBoxCont dl{ 
        height: 49px;
        padding: 0 24px;
        border-bottom: 1px dashed #384355; 
        ${({ theme }) => theme.mixins.flex()};
    } 

    .endBoxCont dt{
        color: ${({ theme }) => theme.colors.grayscale.g100}; 
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        white-space: nowrap;
    }

    .endBoxCont dd{
        color: ${({ theme }) => theme.colors.white}; 
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        font-weight: 500;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .endBoxBtn{
        display: block;
        width: 100%;
        padding: 12px 24px;
        cursor: pointer;
    }
    .endBoxClose{
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        background-color: ${({ theme }) => theme.colors.primary.p500};
        width: 100%;
        height: 36px;
        font-size: 0.875rem;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
        color: ${({ theme }) => theme.colors.white}; 
        border-radius: 6px;
    }
`;