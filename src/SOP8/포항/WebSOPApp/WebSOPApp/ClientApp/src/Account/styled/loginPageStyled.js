import styled from 'styled-components';
import login_back from '../images/login_back.svg';
import login_gif from '../images/login_gif.gif';
import arrow from '../images/arrow.svg';


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    background-color: #1B1A1F;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    &::before {
        content: '';
        display: block;
        position: absolute;
        top: 10%;
        left: 0%;
        width: calc(100vw - 816px);
        height: 100vh;
        background: url(${login_gif}) lightgray 0px 0px / 100% 116.129% no-repeat;
        background-size: cover;
        mix-blend-mode: lighten;
        z-index: 1;
        opacity: 15%;
    }

    .left {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw - 816px);
        height: 100vh;
        background: url(${login_back}) no-repeat center center;
        background-size: cover;
        padding: 40px;

        > img {
            margin-bottom: 100px;

            &:nth-child(1) {
                margin-right: 8px;
            }
        }

        > div {
            
            div:nth-child(1),
            div:nth-child(2) {
                & * {
                    font-size: 40px;
                    line-height: 140%;
                    letter-spacing: -1.2px;
                }
            }

            div:nth-child(1) {
                > span:nth-child(1) {
                    font-weight: 700;
                    margin-right: 10px;
                }
            }

            div:nth-child(2) {
                margin-bottom: 20px;

                > span:nth-child(2) {
                    font-weight: 700;
                    margin-left: 10px;
                }
            }

            div:nth-child(3) {
                p {
                    font-size: 16px;
                    line-height: 172%;
                    letter-spacing: -0.48px;
                    color: #A6A9AF;
                }
            }
        }

        > p {
            width: calc(100% - 80px);
            position: absolute;
            bottom: 40px;
            font-size: 12px;
            line-height: 170%;
            letter-spacing: -0.36px;
            color: #686D78;
            ${(props) => props.theme.flex()};

            &::after {
                content: '';
                width: calc(100% - 296px);
                height: 1px;
                background-color: #FFFFFF26;
                display: inline-block;
            }
        }
    }

    .right {
        position: absolute;
        top: 0;
        right: 0;
        height: 100vh;
        background: linear-gradient(90deg, #202126 0%, #020303 100%);
        ${(props) => props.theme.flex('center', 'center')};
        flex-direction: column;
        padding: 0 148px;

        .serviceBtn {
            font-size: 14px;
            font-weight: 500;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            padding: 4px 6px;

            position: absolute;
            top: 40px;
            right: 40px;
            ${(props) => props.theme.flex('center', 'center')};
            gap: 8px;

            &::after {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                background: url(${arrow}) no-repeat center center;
            }
        }
        
        .sectionWrap {
            width: 520px;

            .titleWrap {
                margin-bottom: 48px;

                h2 {
                    color: ${(props) => props.theme.primary};
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    line-height: 130%;
                }

                p {
                    color: ${(props) => props.theme.fontSecondary};
                    font-size: 14px;
                    line-height: 172%;
                }
            }

            .inputWrap {
                margin-bottom: 20px;
                position: relative;

                > div {
                    ${(props) => props.theme.flex()};
                    margin-bottom: 15px;

                    > label:nth-child(1) span {
                        color: ${(props) => props.theme.warning};
                        margin-left: 3px;
                    }

                    > label:nth-child(2) input {
                        margin-right: 10px;
                        position: relative;
                        top: -1px;
                    }
                }

                input[type=text], input[type=password] {
                    height: 48px;
                    border: 1px solid ${(props) => props.theme.secondary};
                    border-radius: 4px;
                    padding: 15px 55px 15px 20px;

                    &:hover,
                    &:focus {
                        border: 1px solid ${(props) => props.theme.primary};
                    }
                }

                .error {
                    border: 1px solid ${(props) => props.theme.warning} !important;
                }

                .showPwdBtn {
                    position: absolute;
                    right: 48px;
                    top: 50%;
                    transform: translate(0, -50%);
                }

                .clearBtn {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translate(0, -50%);
                }
            }

            .errorMsg{
                height: 31px;

                p {
                    font-size: 12px;
                    color: ${(props) => props.theme.warning};
                    margin-bottom: auto 0;
                }
            } 

            .submitBtn {
                width: 100%;
                height: 48px;
                background-color: ${(props) => props.theme.primary};
                text-align: center;
                color: ${(props) => props.theme.fontPrimary};
                font-weight: 500;
                border-radius: 4px;

                &:hover {
                    background-color: #27A5FF;
                }
            }
            
        }

        .sectionBtn{
            margin-top: 40px;
            font-size: 14px;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            border-bottom: 1px solid #EBEBED;
            color: #EBEBED;
            padding: 4px;

            &:hover {
                color: ${(props) => props.theme.primary};
                border-bottom: 1px solid ${(props) => props.theme.primary};
            }
        }

        > p {
            font-size: 12px;
            font-weight: 300;
            color: #616161;
            position: absolute;
            bottom: 36px;
        }
    }

`