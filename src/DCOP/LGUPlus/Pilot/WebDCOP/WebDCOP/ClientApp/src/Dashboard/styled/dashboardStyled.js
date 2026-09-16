import styled from 'styled-components';
import business_Establishment from '../images/business_establishment.svg';
import file_icon from '../images/file_icon.svg';
import file_icon_on from '../images/file_icon_on.svg';
import file_icon_active from '../images/file_icon_active.svg';
import arrow_up_active from '../images/arrow_up_active.svg';
import arrow_down from '../images/arrow_down.svg';
import arrow_down_on from '../images/arrow_down_on.svg';
import dcop_logo from '../images/dcop_logo.svg';
import alarm_icon from '../images/alarm_icon.svg';
import background from '../images/background.png';
import countryIcon from '../images/countryIcon.svg';
import power_icon from '../images/power_icon.svg';
import change_icon from '../images/change_icon.svg';


// 대시보드 페이지
export const DashboardComponent = styled.div`
    background: url(${background}) no-repeat center center, linear-gradient(180deg, #1D242A 0%, #364251 50.05%, #1D242A 100%);
    width: 100vw;
    height: 100vh;
    padding-top: 60px;
    overflow: hidden;

    section {
        height: calc(100vh - 60px);
        display: flex;
        align-items: center;
        position: absolute;

        &:nth-child(1) {
            left: 25px;
        }

        &:nth-child(2) {
            right: 25px;
            justify-content: center;
            gap: 12px;
            flex-direction: column;
        }
    }
`;

export const MapComponent = styled.div`
    width: 1148px;
    height: 934px;
    position: absolute; 
    left: 50%; 
    top: 50%;
    transform: translate(-50%, -50%);
    margin-top: 30px;
    ${(props) => props.theme.userSelect()};

    .country {
        position: absolute;
        top: 10px;
        right: 165px;
        background-color: #1A2228;
        padding: 6px 28px;
        border-radius: 30px;
        z-index: 999;

        > p {
            font-size: 16px;
            ${(props) => props.theme.flex('center', 'center')};
            gap: 8px;
            &::before {
                content: '';
                display: inline-block;
                background: url(${countryIcon}) no-repeat center center;
                width: 24px;
                height: 24px;
            }
        }
    }

    #chartdiv {
        width: 1148px;
        height: 934px;
        position: absolute; 
        left: 50%; 
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;


//국사 목록 페이지
export const DataCenterInfoComponent = styled.div`
    width: 340px;
    height: 939px;
    background: ${(props) => props.theme.secondary};
    border: solid 1px #25474A;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
    ${(props) => props.theme.userSelect()};

    .npListTitle{
        display: flex;
        align-items: center;
        height: 68px;
        padding: 20px;
    }
    
    .npIcon{
        display: inline-block; 
        width: 24px; 
        height: 24px;
        background: url(${business_Establishment}) no-repeat center center;
        margin-right: 12px;
    }

    .npTitle{
        color: ${(props) => props.theme.primary};
        font-family: 'Spoqa Han Sans Neo';
        font-size: 16px;
    }

    .npListArea {
        background: #1A2228;
        cursor: pointer;

        .npListBox {
            display: flex;
            align-items: center;
            height: 56px;
            padding: 16px;
            border-bottom: solid 1px #313644;
            background: #1A2228;

            span:nth-child(1) {
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url(${file_icon}) no-repeat center center;
                margin-right: 8px;
            }

            span:nth-child(2) {
                flex: 1;
            }

            span:nth-child(3) {
                margin-right: 8px;
            }

            span:nth-child(4) {
                display: inline-block;
                width: 32px;
                height: 32px;
                background: url(${arrow_down}) no-repeat center center;
            }
        }

        > ul {
            display: none;

            > li {
                height: 48px;
                line-height: 48px;
                padding: 0px 40px;
                background: #1A2228;

                &:hover {
                    color: ${(props) => props.theme.primaryHover};
                }

                &:active {
                    color: ${(props) => props.theme.primary};
                    background: ${(props) => props.theme.background};
                }
            }
        }

        &:hover {
            .npListBox {
                span {
                    color: ${(props) => props.theme.primaryHover};
                }

                span:nth-child(1) {
                    background: url(${file_icon_on}) no-repeat center center;
                }

                span:nth-child(4) {
                    background: url(${arrow_down_on}) no-repeat center center;
                }
            }
        }

        &.on {
            background: ${(props) => props.theme.background};

            .npListBox {

                span {
                    color: ${(props) => props.theme.primary};
                }

                span:nth-child(1) {
                    background: url(${file_icon_active}) no-repeat center center;
                }

                span:nth-child(4) {
                    background: url(${arrow_up_active}) no-repeat center center;
                }
            }

            > ul {
                display: block;
            }
        }
    }
`;


//알람 발생 현황 페이지
export const AlarmStatusComponent = styled.div`
    width: 340px;
    height: 300px; 
    background: ${(props) => props.theme.secondary};
    border: solid 1px #25474A;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
    ${(props) => props.theme.userSelect()};

    .alarmStatusTitle{
        display: flex;
        align-items: center;
        height: 68px;
        padding: 20px;
    }
    .alarmIcon{
        display: inline-block; 
        width: 24px; 
        height: 24px;
        background: url(${alarm_icon}) no-repeat center center;
        margin-right: 12px;
    }
    .alarmTitle{
        color: ${(props) => props.theme.primary};
        font-family: 'Spoqa Han Sans Neo';
        font-size: 16px;
    }

    .alarmListArea{
        display: block;
        padding: 0 16px 14px 16px;
        
        .alarmListBox{
            display: inline-block; 
            min-width: 149px;
            height: 105px; 
            border-radius: 8px;
            background: #1A2228;
            margin: 0px 7px 7px 0px;
            padding: 8px;
            
            &:nth-child(2){
                margin: 0px 0px 7px 0px;
            }
            &:nth-child(4){
                margin: 0px 0px 7px 0px;
            }
            
            .chartTitle{
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                
                span:nth-child(1){
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 16px;
                    height: 16px;
                    background: ${(props) => props.theme.secondary};
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: 'Spoqa Han Sans Neo';
                    margin-right: 4px;
                }
                
                span:nth-child(2){
                    margin-right: 4px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: -0.36px;
                }
                
                span:nth-child(3){
                    color: #A6A9AF;
                    font-size: 10px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 170%; 
                    letter-spacing: -0.3px;
                }
            }
            
            .alarmChartBox{
                display: flex;
                align-items: center;
                
                > div{
                    display: block;
                    width: 59px;
                    height: 59px;
                    margin-right: 24px;
                }

                > div > canvas{
                    height: inherit;
                    position: absolute;
                    left: -20px;
                    top: 0;
                }
                
                > span{
                    display: flex;
                    align-items: baseline;
                    font-size: 28px;
                    font-weight: 500;
                    line-height: 130%; 
                    letter-spacing: -0.84px;
                }
                
                > span p{
                    color: #A6A9AF;
                    font-size: 12px;
                    letter-spacing: -0.36px;
                    margin-left: 2px;
                }
            }
        }
    }
`;


//소모 전력 현황 페이지
export const PowerSituationComponent = styled.div`
    width: 340px;
    height: 374px; 
    background: ${(props) => props.theme.secondary};
    border: solid 1px #25474A;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
    ${(props) => props.theme.userSelect()};

    .powerSituationTitle{
        display: flex;
        align-items: center;
        height: 68px;
        padding: 20px;
    }
    .powerIcon{
        display: inline-block; 
        width: 24px; 
        height: 24px;
        background: url(${power_icon}) no-repeat center center;
        margin-right: 12px;
    }
    .powerTitle{
        color: ${(props) => props.theme.primary};
        font-family: 'Spoqa Han Sans Neo';
        font-size: 16px;
    }

    .powerListArea{
        display: block;
        padding: 0 16px 14px 16px;

        .powerListBox{
            display: block;
            width: 308px;
            height: 67px;
            padding: 5px 12px 12px 12px;
            background: #1A2228;
            border-radius: 8px;
            margin-bottom: 8px;

            &:last-child{
                margin-bottom: 0;
            }

            .powerChartTitle{
                display: flex;
                align-items: center;
                height: 34px;

                span:nth-child(1){
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 16px;
                    height: 16px;
                    background: #222B33;
                    border-radius: 4px;
                    margin-right: 4px;
                }
                span:nth-child(2){
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 170%; 
                    letter-spacing: -0.36px;
                    margin-right: 4px;
                }
                span:nth-child(3){
                    flex: 1;
                    color: var(--grayscale-g-200-a-6-a-9-af, #A6A9AF);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 10px;
                    font-weight: 500;
                    line-height: 170%;
                    letter-spacing: -0.3px;
                }
                span:nth-child(4){
                    display: flex;
                    align-items: baseline;
                    color: #fff;
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 172%;
                    letter-spacing: -0.6px;
                }

                span:nth-child(4) > p{
                    color: var(--grayscale-g-200-a-6-a-9-af, #A6A9AF);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                    margin-left: 2px;
                }
            }

            .powerChartBox{
                display: block;
                width: 284px;
                height: 16px;

                #myProgress {
                    width: 100%;
                    background: #222B33;
                }
            
                #myBar {
                    width: 50%;  /* 초기 수치값 */
                    height: 16px;
                    background: #4BE5DD;
                }
            }
        }
    }
`;


//변경 관리 현황 페이지
export const ChangeManagementComponent = styled.div`
    width: 340px;
    height: 241px; 
    background: ${(props) => props.theme.secondary};
    border: solid 1px #25474A;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10), 0px 12px 40px 0px rgba(0, 0, 0, 0.40);
    ${(props) => props.theme.userSelect()};

    .changeManagementTitle{
        display: flex;
        align-items: center;
        height: 68px;
        padding: 20px;
    }
    .changeIcon{
        display: inline-block; 
        width: 24px; 
        height: 24px;
        background: url(${change_icon}) no-repeat center center;
        margin-right: 12px;
    }
    .changeTitle{
        color: ${(props) => props.theme.primary};
        font-family: 'Spoqa Han Sans Neo';
        font-size: 16px;
    }

    .changeListArea{
        display: block;
        padding: 0 16px 21px 16px;

        .changeListBox{
            display: block;
            width: 308px;
            height: 44px;
            background: #1A2228;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px; 

            &:last-child{
                margin-bottom: 0;
            }

            .changeListTitle{
                display: flex;
                align-items: center;

                span:nth-child(1){
                    display: flex;
                    width: 16px;
                    height: 16px;
                    justify-content: center;
                    align-items: center;
                    background: #222B33;
                    border-radius: 4px;
                    margin-right: 4px; 
                }
                span:nth-child(2){
                    color: var(--black-white-white, #FFF);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 170%; 
                    letter-spacing: -0.36px;
                }
                span:nth-child(3){
                    flex: 1;
                    color: var(--black-white-white, #FFF);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 170%; 
                    letter-spacing: -0.36px;
                }
                span:nth-child(4){
                    color: var(--grayscale-g-200-a-6-a-9-af, #A6A9AF);
                    font-family: "Spoqa Han Sans Neo";
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 170%; 
                    letter-spacing: -0.36px;
                }
            }
        }
    }



`;