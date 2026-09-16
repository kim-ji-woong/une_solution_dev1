import styled from 'styled-components';

/**********************************************************************/

export const ChangePwdComponent = styled.div`
    width: 532px;
    height: 597px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: ${({ theme }) => theme.colors.white};
    user-select: none;
    ${({ theme }) => theme.mixins.flex()};
    flex-direction: column;
    border-radius: 1rem;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);

    header {
        width: 100%;
        height: 64px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};

        .closeBtn {
            position: absolute;
            top: 12px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 8px;

            &:hover {
                background-color: ${({ theme }) => theme.colors.grayscale.g50};

                img {
                    filter: invert(66%) sepia(85%) saturate(7492%) hue-rotate(221deg) brightness(105%) contrast(98%);
                }
            }

            &:active {
                background-color: ${({ theme }) => theme.colors.grayscale.g100};

                img {
                    filter: invert(8%) sepia(78%) saturate(5506%) hue-rotate(235deg) brightness(95%) contrast(97%);
                }
            }
        }
    }

    section {
        width: 100%;
        padding: 52px 40px;
        ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};

        .titleWrap {
            padding-bottom: 20px;

            h2 {
                font-size: 1.25rem;
                font-weight: 500;
                line-height: 172%;
                letter-spacing: -0.6px;
                color: ${({ theme }) => theme.colors.black}; 
            }
        }

        .inputWrap {
            width: 100%;
            position: relative;
            ${({ theme }) => theme.mixins.flex()};
            gap: 20px;

            &:nth-child(2), &:nth-child(3) {
                margin-bottom: 16px;
            }

            > div {
                ${({ theme }) => theme.mixins.flex()};
                width: 80px;

                input {
                    margin-right: 10px;
                    position: relative;
                    top: -1px;
                }
            }

            input[type=text], input[type=password] {
                height: 56px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
                border-radius: 8px;
                padding: 0 50px 0 20px;
                color: ${({ theme }) => theme.colors.grayscale.g700};

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

        .errorMsg{
            width: 100%;
            height: 48px;
            margin: 13.5px 0;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            p {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.state.error};
                white-space: pre-line;

                &.success {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        } 

        .submitBtn {
            width: 100%;
        }

        .findPwdBtn {
            margin-top: 16px;
        }
    }
`;