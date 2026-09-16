
import styled from 'styled-components';

import background_img from '../images/background_img.png';

/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.background.surface};
    padding: 20px;
    ${({ theme }) => theme.mixins.flex()};
    position: relative;

    > section {
        z-index: 2;
    }

    .copyright {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: calc(100% - 64px);
        ${({ theme }) => theme.mixins.flex('center', 'flex-end')};

        > p {
            font-size: 12px;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;
            color: ${({ theme }) => theme.colors.grayscale.g500};
        }
    }

    .description {
        width: 50%;
        height: calc(100vh - 40px);
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'column')};
        padding-top: 223px;
        background: url(${background_img}) no-repeat center center;
        background-size: cover;
        border-radius: 24px;

        > p {
            font-size: 2.5rem;
            font-weight: 500;
            line-height: 140%; /* 56px */
            letter-spacing: -1.2px;
            color: ${({ theme }) => theme.colors.primary.p100};
            margin-bottom: 24px;

            &:nth-child(1) {
                margin-bottom: 12px;
            }
        }

        span {
            font-size: 1rem;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            white-space: pre-line;
            text-align: center;
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }
    }
`;

export const LoginSectionComponent = styled.section`
    flex: 1;
    ${({ theme }) => theme.mixins.flex('center', 'center')};

    > div {
        width: 520px;
        height: 694px;
        padding: 80px 40px;
        background-color: ${({ theme }) => theme.colors.background.surface};
    }
    
    .headerWrap {
        width: 100%;
        text-align: center;
        margin-bottom: 48px;

        > p {
            font-size: 20px;
            font-weight: 500;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
        }

        > span {
            font-size: 14px;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }
    }

    .sectionWrap {
        width: 100%;

        .inputWrap {
            ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '8px')};
            margin-bottom: 24px;

            > p {
                color: ${({ theme }) => theme.colors.grayscale.g100};
                font-size: 14px;
                line-height: 160%; /* 22.4px */
                letter-spacing: -0.42px;
            }

            > div {
                width: 100%;
                position: relative;
            }

            .error {
                border: 1px solid ${({ theme }) => theme.colors.state.error} !important;
            }
        }

        .contentWrap {
            width: 100%;
            margin-bottom: 24px;
            ${({ theme }) => theme.mixins.flex('space-between', 'flex-start')};
        }

        .submitBtn {
            margin-bottom: 24px;
        }

        .errorMsg{
            min-height: 48px;

            p {
                font-size: 14px;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.error.error400};
                margin-bottom: auto 0;
                white-space: pre-line;

                &.success {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        } 
    }
`;

export const FindPwdSectionComponent = styled(LoginSectionComponent)`

`;