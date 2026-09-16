import styled from 'styled-components';

import popupBg from '../images/popupBg.png';
import myPageIcon from '../images/myPageIcon.png';

/**********************************************************************/

export const MyPageComponent = styled.div`
    width: 550px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: url(${popupBg}) no-repeat center center;
    padding: 40px;
    ${(props) => props.theme.userSelect()};
    ${(props) => props.theme.flex()};
    flex-direction: column;

    & * {
        font-size: 14px;
    }

    .closeBtn {
        position: absolute;
        top: 40px;
        right: 40px;
    }

    header {
        width: calc(100% - 16px);
        ${(props) => props.theme.flex()};

        &::after {
            content: '';
            display: inline-block;
            width: 150px;
            height: 117px;
            background: url(${myPageIcon}) no-repeat center center;
        }

        > div {
            display: flex;
            flex-direction: column;
            gap: 15px;

            h2 {
                font-size: 16px;
                font-weight: 700;
            }
    
            div {
    
                span {
                    font-size: 20px;
                    font-weight: 700;
    
                    &:nth-child(1) {
                        color: ${(props) => props.theme.primary};
                    }
                }
            }
        }
    }

    section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        ul {
            width: 100%;
            margin-bottom: 50px;

            li {
                ${(props) => props.theme.flex()};
                height: 37px;
                line-height: 36px;
                
                span {
                    padding-left: 12px;
                    
                    &:nth-child(1) {
                        flex: 1.2;
                        background-color: #2A3344;
                        font-weight: 500;
                        border-bottom: 1px solid #1B212C;
                    }

                    &:nth-child(2) {
                        flex: 2;
                        background-color: #1B212C;
                        font-weight: 400;
                        border-bottom: 1px solid ${(props) => props.theme.background};
                    }
                }
            }
        }

        > button {
            color: #000;
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 2px;
            background-color: ${(props) => props.theme.primary};
        }
    }
`;

export const ChangePwdComponent = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    height: auto !important;
    ${(props) => props.theme.userSelect()};

    .passwordConts {
        position: relative;
        width: 453px;
        background: rgba(14, 22, 45, 1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        padding: 0;
        box-sizing: border-box;
    }

    .passwordBoxTitle {
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: ${(props) => props.theme.primary};
        font-size: 16px;
        background: rgba(255, 255, 255, .1);
        font-weight: 600;
        padding-left: 20px;
        border-radius: 4px 4px 0 0;
    }

    .passwordBox {
        padding: 20px;
        font-size: 16px;
    }

    .passwordBoxTxt {
        font-size: 18px;
        padding-bottom: 10px;
        color: #fff;
    }

    .DblueInput {
        background: ${(props) => props.theme.background};
        width: 100%;
        height: 38px !important;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        width: 100% !important;
    }

    input.DblueInput::-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input.DblueInput::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input.DblueInput::-moz-placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .gap20 {
        height: 20px;
        clear: both;
        overflow: hidden;
    }

    .btnBlue {
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        border-radius: 5px;
        width: 68px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #fff;
        display: inline-block;
        margin-right: 10px;
        cursor: pointer;
        font-size: 14px;
    }

    .btnBlue:hover {
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;;
        cursor: pointer;
    }

    .btnNavy {
        background: ${(props) => props.theme.background};
        border-radius: 5px;
        width: 68px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #fff;
        display: inline-block;
        cursor: pointer;
        font-size: 14px;
    }

    .btnNavy:hover {
        background: ${(props) => props.theme.background};
        cursor: pointer;
    }

    .btnArea {
        text-align: center;
    }
`;