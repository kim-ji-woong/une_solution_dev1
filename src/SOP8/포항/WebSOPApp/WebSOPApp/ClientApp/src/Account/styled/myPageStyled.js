import styled from 'styled-components';

import popupBg from '../images/popupBg.png';
import myPageIcon from '../images/myPageIcon.png';
import changePwdIcon from '../images/changePwdIcon.png';

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
    border-radius: 8px;

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
                        background-color: #222a38;
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

export const ChangePwdComponent = styled(MyPageComponent)`

    header {
        &::after {
            background: url(${changePwdIcon}) no-repeat center center;
        }
    }

    section {
        height: 100%;
        margin-top: 23px;

        .infoWrap {
            width: 100%;
            background: #1B212C;
            padding: 15px 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 10px;

            p {

                &:nth-child(1) {
                    font-weight: 500;
                }

                &:not(:nth-child(1)) {
                    font-size: 12px;

                    &::before {
                        content: '';
                        display: inline-block;
                        margin: 0 7px;
                        width: 3px;
                        height: 3px;
                        border-radius: 3px;
                        background-color: #fff;
                        position: relative;
                        top: -3px;
                    }
                }
            }
        }

        ul {

            li {
                
                input {
                    width: 90%;
                    height: 23px;
                    padding: 3px;
                    font-size: 12px;
                    border: 0;
                }

                input::placeholder {
                    font-size: 14px;
                    line-height: 16px;
                    font-weight: bold;
                    color: #384355;
                }

                span {
                    &:nth-child(2) {
                        ${(props) => props.theme.flex()};
                        padding-right: 12px;
                    }
                }
            }
        }

        .btnWrap {
            margin-top: 100px;
        }
    }

    .btnWrap {
        position: absolute;
        bottom: 23px;
        left: 50%;
        transform: translate(-50%, -50%);

        button {
            height: 34px;
            border-radius: 2px;
            font-size: 14px;
            font-weight: 500;
            margin: 0 2.5px;
            padding: 10px 20px;
        }

        .cancle {
            border: 1px solid #29313E;
        }

        .submit {
            background-color: ${(props) => props.theme.primary};
            color: #000000;
        }
    }
`;