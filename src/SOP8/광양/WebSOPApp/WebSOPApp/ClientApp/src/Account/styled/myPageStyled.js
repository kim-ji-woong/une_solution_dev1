import styled from 'styled-components';

import popupBg from '../images/popupBg.png';
import myPageIcon from '../images/myPageIcon.png';
import changePwdIcon from '../images/changePwdIcon.png';

/**********************************************************************/

export const MyPageComponent = styled.div`
    width: 532px;
    height: 686px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    user-select: none;
    ${({ theme }) => theme.mixins.flex('center', 'center')};
    flex-direction: column;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.background.base};
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);

    > div {
        width: 524px;
        height: 678px;
        border-radius: 16px;
        background: rgba(20, 27, 39, 0.01);
        box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.05) inset;
    }

    .headerWrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 12px 20px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g850};
        ${({ theme }) => theme.mixins.flex('flex-end', 'center')};
    }

    header {
        padding: 92px 32px 24px 32px;
        ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column', '4px')};

        > h2 {
            ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};
            font-size: 14px;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }

        > p {
            font-size: 20px;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
            color: ${({ theme }) => theme.colors.white};
            font-weight: 500;

            > span {
                color: ${({ theme }) => theme.colors.primary.p500};
            }
        }
    }

    section {
        padding: 0 32px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        ul {
            width: 100%;
            margin-bottom: 50px;

            li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 10px 8px;

                &:not(:last-child) {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                }
                
                span {
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    
                    &:nth-child(1) {
                        flex: 1.2;
                        color: ${({ theme }) => theme.colors.grayscale.g100};
                    }

                    &:nth-child(2) {
                        flex: 2;
                    }
                }
            }
        }
    }
`;

export const ChangePwdComponent = styled(MyPageComponent)`
    .headerWrap {
        justify-content: space-between;
    }

    section {
        .infoWrap {
            width: 100%;
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column', '4px')};

            > p {
                font-size: 14px;
                font-weight: 500;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g50};
            }

            > pre {
                font-size: 14px;
                font-weight: 400;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }
        }

        ul {
            margin-top: 16px;
            margin-bottom: 0;

            > li {
                border-bottom: none !important;
                padding: 0;

                &:not(:last-child) {
                    margin-bottom: 16px;
                }
            }
        }

        .errorMsg {
            width: 100%;
            height: 100px;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
            
            > p {
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.error.error500};
                white-space: pre-line;

                &.success {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }
    }
`;