
import styled from 'styled-components';
import background from '../images/background.png';

/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: url(${background}) lightgray 50% / cover no-repeat;
`;

export const LoginSectionComponent = styled.section`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 532px;
    height: 597px;
    padding: 80px 40px;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);
    ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};

    & * {
        color: #A6A9AF;
    }
    
    .headerWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 64px;
        padding: 0 20px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
    }

    .sectionWrap {
        width: 100%;

        .titleWrap {
            text-align: center;

            &.login {
                margin-bottom: 60px;
            }
        }

        > ul {
            padding: 16px 12px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};

            label {
                color: ${({ theme }) => theme.colors.grayscale.g600};
            }
        }

        .inputWrap {
            position: relative;
            ${({ theme }) => theme.mixins.flex()};
            gap: 20px;

            > div {
                ${({ theme }) => theme.mixins.flex()};
                width: 80px;

                input {
                    margin-right: 10px;
                    position: relative;
                    top: -1px;
                }
            }

            &:nth-child(1) {
                margin-bottom: 16px;
            }

            &:nth-child(2) {
                margin-bottom: 12px;
            }

            input[type=text], input[type=password] {
                height: 56px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
                border-radius: 8px;
                padding: 0 50px 0 20px;
                color: #444A57;

                &:hover, &:active, &:focus {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                }
            }

            .error {
                border: 1px solid ${({ theme }) => theme.colors.state.error} !important;
            }

            .showPwdBtn,
            .clearBtn {
                width: 24px;
                height: 24px;
                position: absolute;
                right: 56px;
                top: 50%;
                transform: translate(0, -50%);
                ${({ theme }) => theme.mixins.flex('center', 'center')};
            }

            .clearBtn {
                right: 20px;
            }
        }

        .contentWrap {
            ${({ theme }) => theme.mixins.flex()};

            & * {
                color: #565B69;
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
            }

            label {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            }

            input[type=checkbox] {
                margin-right: 12px;
            }

            button {
                padding: 0 12px;
            }
        }

        .errorMsg{
            height: 48px;
            margin: 28px 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.state.error};
                margin-bottom: auto 0;
                white-space: pre-line;
            }
        } 

        .submitBtn {
            width: 100%;
        }
    }
`;

export const FindPwdSectionComponent = styled.section`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 532px;
    height: 597px;
    padding: 64px 40px 40px 40px;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);
    
    .headerWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 64px;
        padding: 0 20px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
    }

    .sectionWrap {
        & * {
            color: #A6A9AF;
        }

        width: 100%;
        padding-top: 40px;

        .titleWrap {
            text-align: center;
            margin-bottom: 20px;

            &.login {
                margin-bottom: 60px;
            }

            h2 {
                font-size: 1.25rem;
                font-weight: 500;
                line-height: 172%;
                letter-spacing: -0.0375rem;
                color: ${({ theme }) => theme.colors.black};
            }

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.02625rem;
                color: ${({ theme }) => theme.colors.grayscale.g400};
            }
        }

        > ul {
            padding: 16px 12px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '20px')};

            label {
                color: ${({ theme }) => theme.colors.grayscale.g600};
            }
        }

        .inputWrap {
            position: relative;
            ${({ theme }) => theme.mixins.flex()};
            gap: 20px;
            padding: 20px 12px;
            margin-bottom: 0 !important;

            label {
                color: ${({ theme }) => theme.colors.grayscale.g300};
                font-size: 14px;
                font-weight: 400;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
            }

            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};

            > div {
                ${({ theme }) => theme.mixins.flex()};
                width: 80px;

                input {
                    margin-right: 10px;
                    position: relative;
                    top: -1px;
                }
            }

            &:nth-child(1) {
                margin-bottom: 16px;
            }

            &:nth-child(2) {
                margin-bottom: 12px;
            }

            input[type=text], input[type=password] {
                width: auto;
                flex: 1;
                height: 44px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
                border-radius: 8px;
                padding: 0 20px;
                color: #444A57;

                &:hover {
                    border: 1px solid ${({ theme }) => theme.colors.primary.p500};
                }
            }

            .error {
                border: 1px solid ${({ theme }) => theme.colors.state.error} !important;
            }

            .showPwdBtn,
            .clearBtn {
                width: 24px;
                height: 24px;
                position: absolute;
                right: 56px;
                top: 50%;
                transform: translate(0, -50%);
                ${({ theme }) => theme.mixins.flex('center', 'center')};
            }

            .clearBtn {
                right: 20px;
            }
        }

        .contentWrap {
            ${({ theme }) => theme.mixins.flex()};

            & * {
                color: #565B69;
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
            }

            label {
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            }

            input[type=checkbox] {
                margin-right: 12px;
            }

            button {
                padding: 0 12px;
            }
        }

        .errorMsg{
            height: 48px;
            margin: 24px 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.state.error};
                margin-bottom: auto 0;
                white-space: pre-line;
            }
        } 

        .submitBtn {
            width: 100%;
        }
    }
`;