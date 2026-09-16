import styled from 'styled-components';
import loginPage_img from '../images/loginPage_img.svg';
import loginPage_back from '../images/loginPage_back.png';
import login_input_id from '../images/login_input_id.svg';
import login_input_pwd from '../images/login_input_pwd.svg';
import DCOP_logo from '../../Common/images/DCOP_logo.svg';


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    background: url(${loginPage_back}) no-repeat center center / cover, linear-gradient(253deg, #364251 0%, #142032 99.69%);
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    &::before {
        content: '';
        background: url(${loginPage_img}) no-repeat center center;
        width: 1031px;
        height: 798px;
        display: block;
        position: absolute;
        left: 80px;
        top: 50%;
        transform: translate(0, -50%);
    }

    > section {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: 634px;
        padding-right: 234px;

        .titleWrap {
            width: 100%;
            text-align: center;
            margin-bottom: 64px;

            > img {
                margin-bottom: 8px;
            }

            > h2 {
                ${(props) => props.theme.flex('center', 'center')};
                gap: 25px;
                text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                font-size: 62px;
                font-weight: 700;
                line-height: 140%;
                letter-spacing: -1.86px;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 60px;
                    height: 66px;
                    background: url(${DCOP_logo}) no-repeat center center;
                }
            }

            > p {
                color: #A6A9AF;
                font-size: 18px;
                font-weight: 500;
                line-height: 169%;
                letter-spacing: -0.54px;
            }
        }

        .inputWrap {
            position: relative;

            &::before {
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translate(0, -50%);
            }

            input[type=text], input[type=password] {
                height: 48px;
                padding: 0 20px 0 48px;
            }

            &.id {
                margin-bottom: 20px;
            }

            &.id::before {
                background: url(${login_input_id}) no-repeat center center;
            }

            &.pwd::before {
                background: url(${login_input_pwd}) no-repeat center center;
            }

            .error {
                border: 1px solid ${(props) => props.theme.error} !important;
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
            height: 64px;
            ${(props) => props.theme.flex('flex-start', 'center')};

            p {
                color: ${(props) => props.theme.error};
                margin-bottom: auto 0;
                line-height: 172%
            }
        } 

        .submitBtn {
            width: 100%;
            height: 48px;
            background-color: ${(props) => props.theme.primary};
            text-align: center;
            color: ${(props) => props.theme.background};
            font-weight: 700;
            border-radius: 8px;

            &:hover {
                background-color: ${(props) => props.theme.primaryHover};
            }

            &:active {
                background-color: ${(props) => props.theme.primaryActive};
            }
        }
    }

    > footer {
        position: absolute;
        right: 30px;
        bottom: 24px;

        > p {
            color: #E5ECFE;
            font-weight: 300;
        }
    }
`;