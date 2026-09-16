import styled from 'styled-components';

import campusImgA from '../images/campusImgA.png';
import campusImgB from '../images/campusImgB.jpg';
import campusImgC from '../images/campusImgC.png';
import campusImgD from '../images/campusImgD.png';
import campusImgE from '../images/campusImgE.png';
import campusImgF from '../images/campusImgF.png';
import bellIcon from '../images/board_bell_icon.png';
import bellIconDisabled from '../images/board_bell_icon_disabled.png';

export const DashboardComponent = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.background};
    padding: 90px 40px 40px 40px;
    overflow: hidden;

    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 19.5px;
    grid-template-areas:
        'board-view-area agency-event-area'
        'board-view-area weekly-area'
        'board-view-area real-time-area';

    .board-view-area {
        grid-area: board-view-area;
    }

    .agency-event-area {
        grid-area: agency-event-area;
    }

    .weekly-area {
        grid-area: weekly-area;
    }

    .real-time-area {
        grid-area: real-time-area;
    }

    > div {
        border-radius: 10px;
        background: #272E42;
    }
`;


export const BoardViewComponent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    overflow: hidden;

    section {
        display: flex;
        gap: 1px;
        height: 100%;

        .campusS {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            
            .campus-img {
                width: 100%;
                height: 100%;
                opacity: 0.5;
    
                &.campus-a {
                    background:url(${campusImgA}) no-repeat;
                    background-position-x: 62%;
                    background-position-y: 33%;
                    background-size: auto 134%;
                }
    
                &.campus-b {
                    background:url(${campusImgB}) no-repeat;
                    background-position-x: 59%;
                    background-position-y: -82px;
                    background-size: auto 134%;
                }
    
                &.campus-c {
                    background:url(${campusImgC}) no-repeat;
                    background-position-x: 55%;
                    background-position-y: 8%;
                    background-size: auto 122%;
                } 
    
                &.campus-d {
                    background:url(${campusImgD}) no-repeat;
                    background-position-x: 19%;
                    background-position-y: 76%;
                    background-size: auto 137%; 
                }
    
                &.campus-e {
                    background:url(${campusImgE}) no-repeat;
                    background-position-x: 50%;
                    background-position-y: 56%;
                    background-size: auto 157%;
                }
    
                &.campus-f {
                    background:url(${campusImgF}) no-repeat;
                    background-position-x: 81%;
                    background-position-y: 20%;
                    background-size: auto 122%;
                }
    
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 201px;
                    bottom: 0;
                    background: linear-gradient(0deg, #272E42 35.03%, rgba(39, 46, 66, 0.90) 62.94%, rgba(39, 46, 66, 0.00) 100%);
                }
            }
    
            .title {
                position : absolute;
                top: 30px;
                left: 50%;
                transform: translate(-50%, 0%);
                font-size: 18px;
                font-weight: 600;
                width: calc(100% - 60px);
                height: 37px;
                ${(props) => props.theme.flex('center', 'center')};
            }
    
            .board-data-wrap {
                position : absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 0%);
                width: 100%;
                padding: 0 45px 30px 45px;
                font-size: 1rem;
    
                .disabled {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                    position: relative;
    
                    &::after {
                        content: url(${bellIconDisabled});
                        width: 28px;
                        height: 28px;
                        position: absolute;
                        top: -17px;
                        left: 0;
                        background-color: rgba(14, 22, 45, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50px;
                        text-align: center;
                        line-height: 33px;
                        cursor: pointer;
                    }
                }
                
                .board-data {
                    ${props => props.theme.flex()};
                    margin-top: 10px;
                    width: 100%;
                    height: 38px;
                    padding: 10px 15px;
    
                    & * {
                        font-size: 16px;
                    }
    
                    .board-data-detail > span {
                        margin-left: 10px;
                    }
    
                    .board-data-detail > span:nth-child(1):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: ${(props) => props.theme.primary};
                        margin-right: 8px;
                    }
    
                    .board-data-detail > span:nth-child(2):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: #fff;
                        margin-right: 8px;
                    }
    
                    .board-data-detail > span:nth-child(3):before {
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: #FF5353;
                        margin-right: 8px;
                    }
                }
            }
    
            &.on {
                .title {
                    background: rgba(235, 66, 66, 0.3);
                    border-radius: 5px;
    
                    &::after {
                        content: url(${bellIcon});
                        width: 28px;
                        height: 28px;
                        position: absolute;
                        top: -17px;
                        left: 0;
                        background-color: rgba(14, 22, 45, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50px;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    
    section > div:hover {

        &.on {
            .title {
                color: #2F0000;
            }
        }

        .campus-img {
            opacity: 1;
            transform: scale(1.3);
            transition: transform .35s;
        }

        .title {
            color: #272E42;
        }
    }
`


const DashboardCommon = styled.div`
    position: relative;
    padding: 20px;

    h2 {
        position: absolute;
        top: 21px;
        left: 34px;
        font-size: 16px;

        &::before {
            content: '';
            width: 4px;
            height: 19px;
            background-color: #004BB9;
            position: absolute;
            top: -1;
            left: -10px;
        }
    }
`;


export const BoardAgencyEventComponent = styled(DashboardCommon)`
    display: flex;
    
    > div {
        flex: 1;
    }

    .chartWrap {
        padding-top: 30px;
        ${(props) => props.theme.flex('center', 'center')};
    }

    .tableWrap {
        ul {
            ${(props) => props.theme.flex()};
            flex-direction: column;
            height: 100%;
            gap: 1px;

            li {
                ${(props) => props.theme.flex()};
                background: ${(props) => props.theme.background};
                width: 100%;
                flex: auto;
                padding: 0 55px;

                p {
                    font-size: 14px;
                    ${(props) => props.theme.flex('flex-start', 'center')};

                    &::before {
                        content: '';
                        width: 13px;
                        height: 13px;
                        display: inline-block;
                        margin-right: 8px;
                    }
                }

                > div {

                    span:nth-child(1) {
                        color: #5398FF;
                        font-size: 24px;
                        font-weight: 500;
                    }

                    span:nth-child(2) {
                        font-size: 14px;
                        font-weight: 500;
                        margin-left: 2px;
                    }
                }

                &:nth-child(1) {
                    border-radius: 5px 5px 0 0;

                    p::before {
                        background-color: #004BB9;
                    }
                }

                &:nth-child(2) p::before {
                    background-color: #0066FF;
                }

                &:nth-child(3) p::before {
                    background-color: #0085FF;
                }

                &:nth-child(4) p::before {
                    background-color: #1EA1FF;
                }

                &:nth-child(5) p::before {
                    background-color: #5CBBFF;
                }

                &:last-child {
                    border-radius: 0 0 5px 5px;

                    p::before {
                        background-color: #8CCFFF;
                    }
                }
            }
        }
    }
`;


export const BoardWeeklyComponent = styled(DashboardCommon)`
    padding-top: 55px;

    .chartWrap {
        height: 21vh;
    }
`;


export const BoardRealTimeComponent = styled(DashboardCommon)`
    padding-top: 55px;
    position: relative;

    .btnWrap {
        position: absolute;
        top: 20px;
        right: 20px;
        ${(props) => props.theme.flex('flex-start', 'center')};

        p {
            font-size: 12px;
            margin-right: 8px;
        }

        button {
            font-size: 14px;
            border-radius: 2px;
            border: 1px solid rgba(255, 255, 255, 0.30);
            padding: 4px 8px;

            &:hover {
                background-color: ${(props) => props.theme.background};
            }

            &:active {
                background-color: #010922;
            }
        }
    }

    .tableWrap {

        ul {
            li {
                ${(props) => props.theme.flex()};

                span {
                    width: 100%;
                    font-size: 14px;
                    padding: 8px 0;
                    text-align: center;
                }

                &.head {
                    background: ${(props) => props.theme.background};
                }

                &.body {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
                    height: 50px;
                }
            }
        }
    }
`;