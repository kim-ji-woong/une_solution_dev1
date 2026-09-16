
import styled from 'styled-components';
import login_back from '../images/login_back.png';


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    background-color: ${({ theme }) => theme.colors.background.base};
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 950px;
        height: 100vh;
        background: url(${login_back}) no-repeat center center;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        flex-direction: column;

        div {
            text-align: center;

            &:nth-child(2) {
                margin: 40px 0 20px 0;

                p {
                    font-size: 2.25rem;
                    font-weight: 700;

                    &:first-child {
                        margin-bottom: 12px;
                    }
                }
            }

            &:nth-child(3) p:first-child {
                margin-bottom: 8px;
            }
        }
    }

    .left {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw - 950px);
        height: 100vh;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        flex-direction: column;
        
        .sectionWrap {
            width: 520px;

            .titleWrap {
                margin-bottom: 60px;

                h2 {
                    color: ${({ theme }) => theme.colors.primary};
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }

                p {
                    color: ${({ theme }) => theme.colors.text.muted};
                    font-size: 0.875rem;
                }
            }

            .inputWrap {
                margin-bottom: 20px;
                position: relative;

                > div {
                    ${({ theme }) => theme.mixins.flex()};
                    margin-bottom: 15px;

                    > label:nth-child(1) span {
                        color: ${({ theme }) => theme.colors.state.error};
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
                    border: 1px solid ${({ theme }) => theme.colors.secondary};
                    border-radius: 0;
                    padding: 15px 55px 15px 20px;
                }

                .error {
                    border: 1px solid ${({ theme }) => theme.colors.state.error} !important;
                }

                .showPwdBtn {
                    position: absolute;
                    right: 20px;
                    top: 45px;
                }
            }

            .errorMsg{
                height: 31px;

                p {
                    font-size: 0.75rem;
                    color: ${({ theme }) => theme.colors.state.error};
                    margin-bottom: auto 0;
                }
            } 

            .submitBtn {
                width: 100%;
                height: 48px;
                background-color: ${({ theme }) => theme.colors.primary};
                text-align: center;
                color: ${({ theme }) => theme.colors.text.primary};
                font-weight: 500;
            }
            
        }

        .sectionBtn{
            margin-top: 40px;
            font-size: 0.875rem;
        }

        > p {
            font-size: 0.75rem;
            font-weight: 300;
            color: #616161;
            position: absolute;
            bottom: 36px;
        }
    }

`