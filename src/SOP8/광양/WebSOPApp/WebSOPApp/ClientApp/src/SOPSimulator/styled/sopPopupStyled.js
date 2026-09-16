import styled from 'styled-components';


export const BeginOptionComponent = styled.div`
    width: 538px;
    height: 295px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.40)) drop-shadow(0 0 7px rgba(0, 0, 0, 0.10));
    user-select: none;
    border-radius: 8px;

    .sqpTop {
        background-color: ${({ theme }) => theme.colors.background.overlay};
        display: block;
        cursor: default;
        padding: 15px 18px 13px 18px;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '11.4px')};
    }

    .sqpTop h4 {
        font-size: 18px;
        font-weight: 700;
        line-height: normal;
        color: ${({ theme }) => theme.colors.primary.p500};
        white-space: nowrap;
    }

    .sqpTop p {
        font-size: 16px;
        line-height: normal;
        color: ${({ theme }) => theme.colors.grayscale.g100};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .sqpCont {
        padding: 20px 24px;
    }

    .sqpSel {
        display: block;
        width: 100%;
        height: 35px;
        background-color: ${({ theme }) => theme.colors.background.surface};
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
        border-radius: 3px !important;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.grayscale.g100};
        margin-bottom: 23px;
    }

    .sqpRdo {
        margin-bottom: 14px;
    }

    .sqpRdo li {
        margin-bottom: 10px;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.white};
    }

    .sqpRdo li:last-child {
        margin-bottom: 0;
    }

    .sqpRdoWord {
        color: black;
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
        font-size: 14px;
        padding: 0 3px;
    }

    .sqpTime li select {
        display: block;
        width: 100%;
        height: 30px;
        background-color: ${({ theme }) => theme.colors.background.surface};
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
        border-radius: 3px !important;
        font-size: 14px;
        color: ${({ theme }) => theme.colors.grayscale.g200};
        pointer-events: none;
        padding: 0 10px;
        line-height: 28px;
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
        background: #0D121A; 
    }

    .sqpBtn {
        width: 100%;
        padding-top: 15px;
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '11px')};
    }

    .sqpBtn li {
        flex: 1;
        height: 32px;
    }

    .sqpBtn li a {
        display: block;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: ${({ theme }) => theme.colors.white};
        font-size: 14px;
        font-weight: 700;
        border-radius: 4px;
    }

    .sqpBtn li a.bk {
        background: #0095FF no-repeat padding-box;
        color: ${({ theme }) => theme.colors.white};
        cursor: pointer;
    }

    .sqpBtn li a.gry {
        background: transparent;
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g500};
        color: ${({ theme }) => theme.colors.grayscale.g500};
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
    width: 359px;
    height: 386px;
    position:absolute; 
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background.base};
    filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.40)) drop-shadow(0 0 7px rgba(0, 0, 0, 0.10));
    user-select: none;
    border-radius: 8px;

    .endBoxTop{
        background-color: ${({ theme }) => theme.colors.background.overlay};
        display: block;
        cursor: default;
        padding: 15px 18px 13px 18px;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '11.4px')};
    }

    .endBoxTop p{
        font-size: 18px;
        font-weight: 700;
        line-height: normal;
        color: ${({ theme }) => theme.colors.primary.p500};
        white-space: nowrap;
    }

    .endBoxCont {
        padding: 0 20px; 
        cursor: default;
    }

    .endBoxCont dl{ 
        padding: 15px 6px;
        display: flex; 
        align-items: center; 
        border-bottom: dashed 1px ${({ theme }) => theme.colors.grayscale.g800};
    } 
    .endBoxCont dd{
        padding-left:10px; 
        text-align: right; 
        flex: 1;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    }
    .endBoxCont dt,
    .endBoxCont dd{
        font-size: 14px;
        font-weight: 500;
    }
    .endBoxBtn{
        margin-top: 10px;
        ${({ theme }) => theme.mixins.flex('flex-end', 'center')};
    }
    .endBoxClose{
        text-align: center;
        display: inline-block; 
        width:85px; 
        height: 28px;
        line-height: 27px;
        color: ${({ theme }) => theme.colors.white};
        font-size: 14px;
        font-weight: 700;
        margin-top: 6px;
        letter-spacing: -0.05em; 
        border-radius: 4px; 
        background: #0095FF; 
        margin-right: 20px;
    }
`;