import styled from 'styled-components';

/**********************************************************************/
export const TitleBarComponent = styled.div`
    position: fixed;
    z-index: 11;
    background-color: ${({ theme }) => theme.colors.background.base};
    width: 100vw;
    height: 50px;
    padding: 0 24px;
    ${({ theme }) => theme.mixins.flex()};
    user-select: none;

    .logoWrap {
        ${({ theme }) => theme.mixins.flex()};

        img {
            width: 99px;
            height: 20px;
        }

        p {
            font-size: 0.875rem;
            line-height: 172%;
            letter-spacing: -0.42px;
            margin-left: 12px;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            &::before {
                content: '';
                display: inline-block;
                width: 1px;
                height: 1rem;
                margin-right: 12px;
                background-color: ${({ theme }) => theme.colors.grayscale.g700};
            }
        }
    }

    .weatherWrap {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '4px')};
        margin-right: 24px;

        .weatherIcon {
            width: 28px;
            height: 28px;
            background-color: rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        > button {
            color: ${({ theme }) => theme.colors.white} !important;

            &:hover {
                color: ${({ theme }) => theme.colors.primary.p500} !important;
            }
        }
    }

    .contentWrap {
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;

        > button {
            width: 36px;
            height: 36px;
            border-radius: 0.5rem;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        > button:hover {
            background: ${({ theme }) => theme.colors.primary.p600};
        }

        > button:active {
            background: ${({ theme }) => theme.colors.primary.p800};
        }
    }

    #navMenu {
        position: absolute;
        top: 63px;
        right: 240px;
        width: 160px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.white};
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 4px 11px 0 rgba(0, 0, 0, 0.11);
        padding: 8px 0;

        ul {
            ${({ theme }) => theme.mixins.flex()};
            flex-direction: column;
            
            li {
                width: 100%;
                font-size: 1rem;
                line-height: 172%;
                letter-spacing: -0.48px;
                padding: 10px 20px;
                cursor: pointer;
                color: ${({ theme }) => theme.colors.grayscale.g700};

                &:hover {
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

    .userMenuWrap {
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        margin-left: 32px;

        > p {
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 172%;
            letter-spacing: -0.42px;
            margin-right: 12px;
        }

        > button {
            width: 36px;
            height: 36px;
            border-radius: 0.5rem;
            margin-left: 4px;
        }

        > button:hover {
            background: ${({ theme }) => theme.colors.primary.p600};
        }

        > button:active {
            background: ${({ theme }) => theme.colors.primary.p800};
        }
    }

    #userMenu {
        position: absolute;
        top: 63px;
        right: 24px;
        width: 160px;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.white};
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 4px 11px 0 rgba(0, 0, 0, 0.11);
        padding: 12px;
        text-align: center;

        & * {
            font-size: 0.875rem;
            color: ${({ theme }) => theme.colors.grayscale.g700};
        }

        ul {
            ${({ theme }) => theme.mixins.flex('center', 'flex-start')};
            flex-direction: column;

            li {
                width: 100%;
                cursor: pointer;
                position: relative;

                &:first-child {
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g50};
                }

                &:nth-child(1) {
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};
                    padding: 8px 0;
                    margin-bottom: 12px;
                    cursor: default;

                    > img {
                        margin-bottom: 12px;
                    }

                    p:nth-child(2) {
                        font-size: 0.75rem;
                        line-height: 170%;
                        letter-spacing: -0.36px;
                        font-weight: 400;
                    }

                    p:nth-child(3) {
                        font-size: 1rem;
                        line-height: 172%;
                        letter-spacing: -0.48px;
                        font-weight: 500;
                    }
                }

                &:nth-child(2),
                &:nth-child(3) {
                    color: ${({ theme }) => theme.colors.grayscale.g600};
                    font-size: 0.875rem;
                    padding: 0.25rem 0.375rem !important;
                    line-height: 172%;
                    letter-spacing: -0.42px;
                    border-radius: 0.25rem !important;

                    &:hover {
                        background-color: ${({ theme }) => theme.colors.grayscale.g25} !important;
                    }
                    &:active {
                        background-color: ${({ theme }) => theme.colors.grayscale.g50} !important;
                        color: ${({ theme }) => theme.colors.primary.p800} !important;
                    }
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


/**********************************************************************/
export const WeatherInfoComponent = styled.div`
    position: absolute;
    top: 63px;
    right: 295px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 6px 13px 0 rgba(0, 0, 0, 0.13);
    padding: 12px;

    header {
        padding: 20px 20px 16px 20px;
        width: 300px;

        > div {
            ${({ theme }) => theme.mixins.flex()};
            margin-bottom: 16px;

            .weatherIcon {
                width: 48px;
                height: 48px;
                box-shadow: 0 4px 11px rgba(0, 0, 0, 0.11), 0 0 3px rgba(0, 0, 0, 0.04);
                border-radius: 10px;
                ${({ theme }) => theme.mixins.flex('center', 'center')};
            }
    
            > p {
                color: ${({ theme }) => theme.colors.grayscale.g900};
                font-size: 2.5rem;
                font-weight: 500;
                line-height: 140%; /* 56px */
                letter-spacing: -1.2px;
            }
        }
        
        > ul {
            width: 100%;
            ${({ theme }) => theme.mixins.flex('flex-end')};
            gap: 23px;

            > li {
                ${({ theme }) => theme.mixins.flex()};
                gap: 4px;
                position: relative;

                &:not(:first-child)::before {
                    content: '';
                    width: 4px;
                    height: 4px;
                    display: inline-block;
                    background-color: ${({ theme }) => theme.colors.grayscale.g75};
                    border-radius: 50%;
                    position: absolute;
                    left: -12px
                }

                span {
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g400};
                    }

                    &:nth-child(2) {
                        color: ${({ theme }) => theme.colors.grayscale.g900};
                    }
                }
            }
        }
    }

    section {
        margin-bottom: 12px;

        > ul {
            border-radius: 8px;
            background: ${({ theme }) => theme.colors.grayscale.g20};
            padding: 12px 0;

            > li {
                ${({ theme }) => theme.mixins.flex()};
                padding: 0 20px;
                position: relative;
                
                &:nth-child(1), &:nth-child(2) {
                    margin-bottom: 16px;
                }
                
                &:nth-child(3) {
                    margin-bottom: 8px;
                }

                &:not(:nth-child(3), :nth-child(4))::before {
                    content: '';
                    width: calc(100% - 40px);
                    height: 1px;
                    display: inline-block;
                    background-color: ${({ theme }) => theme.colors.grayscale.g50};
                    position: absolute;
                    bottom: -8px;
                }

                span {

                    &:nth-child(1) {
                        color: ${({ theme }) => theme.colors.grayscale.g400};
                        font-size: 0.75rem;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;   
                    }

                    &:nth-child(2) {
                        color: ${({ theme }) => theme.colors.grayscale.g900};
                        font-size: 0.875rem;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                    }
                }
            }
        }
    }

    footer {
        padding: 0 12px;
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

        span, p {
            color: ${({ theme }) => theme.colors.grayscale.g400};
            font-size: 0.75rem;
            line-height: 170%; /* 20.4px */
            letter-spacing: -0.36px;
        }
    }
`;