import styled from 'styled-components';

/**********************************************************************/
export const TitleBarComponent = styled.div`
    position: fixed;
    z-index: 3;
    background-color: ${({ theme }) => theme.colors.background.overlay};
    width: 100vw;
    height: 50px;
    padding: 0 32px;
    ${({ theme }) => theme.mixins.flex()};
    user-select: none;

    div:nth-child(1) {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '8px')};

        img {
            cursor: pointer;
            width: 75px;
            height: 24px;
        }

        p {
            font-size: 16px;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    }

    div:nth-child(2) {
        ${({ theme }) => theme.mixins.flex()};
        gap: 20px;
    }

    .menuWrap {
        position: relative;
    }

    #navMenu {
        position: absolute;
        top: 55px;
        right: 0;
        width: 170px;

        &.on {
            display: block;
        }

        &.off {
            display: none;
        }
    }

    .userMenuWrap {
        position: relative;
        margin-left: 40px;

        .userBtn {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};

            > p {
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
                
                > span {
                    font-weight: 500;
                    color: ${({ theme }) => theme.colors.grayscale.g50};
                }
            }
        }
    }

    #userMenu {
        position: absolute;
        top: 55px;
        right: 0;
        width: 160px;
        padding: 12px 20px;
        z-index: 1000;
        background-color: ${({ theme }) => theme.colors.white};
        border-radius: 8px;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04),
            0 4px 11px 0 rgba(0, 0, 0, 0.11);

        > div {
            ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column')};
            padding: 8px 0;
            margin-bottom: 12px;
            border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
            cursor: pointer;

            > span {
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.black};
            }

            > p {
                font-size: 16px;
                line-height: 172%; /* 27.52px */
                letter-spacing: -0.48px;
                color: ${({ theme }) => theme.colors.black};
            }
        }

        ul {
            > li {
                padding: 4px 6px;
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column')};
                align-self: stretch;
                color: ${({ theme }) => theme.colors.grayscale.g700};
                white-space: nowrap;
                cursor: pointer;

                &:hover {
                    background: ${({ theme }) => theme.colors.grayscale.g20};
                }

                &:active {
                    background: ${({ theme }) => theme.colors.primary.p100};
                }

                &:disabled {
                    color: ${({ theme }) => theme.colors.grayscale.g150};
                }

                &.active {
                    color: ${({ theme }) => theme.colors.primary.p500};
                }
            }
        }

        &.on {
            display: block;
        }

        &.off {
            display: none;
        }
    }
`;
