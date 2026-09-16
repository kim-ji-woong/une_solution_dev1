import styled, { keyframes } from 'styled-components';

import small_arrow from '../images/small_arrow.svg';

/**********************************************************************/

const animation_on = keyframes`
    0%{
        opacity: 0;
        margin-top: -50px;
        visibility: hidden;
    }
    100%{
        opacity: 1;
        margin-top: 0;
        visibility: visible;
    }
`

const animation_off = keyframes`
    0%{
        opacity: 1;
        margin-top: 0;
        visibility: visible;
    }
    100%{
        opacity: 0;
        margin-top: -50px;
        visibility: hidden;
    }
`

/**********************************************************************/
export const TitleBarComponent = styled.div`
    position: fixed;
    z-index: 9999;
    background-color: #272E42;
    width: 100vw;
    height: 50px;
    padding: 0 20px;
    ${(props) => props.theme.flex()};
    ${(props) => props.theme.userSelect()};

    > div:nth-child(1) {
        ${(props) => props.theme.flex()};

        > img {
            cursor: pointer;
            width: 63px;
            height: 23px;
        }

        > p {
            height: 20px;
            line-height: 20px;
            font-weight: 500;
            padding-left: 10px;
            margin-left: 12px;
            border-left: 1px solid rgba(255, 255, 255, 0.30);
        }
    }

    div:nth-child(2) {
        ${(props) => props.theme.flex()};
        gap: 22px;

        button:nth-child(1) {
            ${(props) => props.theme.flex('flex-start', 'center')};

            > p {
                font-size: 14px;
                color: #9397A1;
                margin: 0 6px 0 10px;
            }

            &::after {
                content: '';
                display: inline-block;
                width: 7px;
                height: 3px;
                background: url(${small_arrow}) no-repeat center center;
            }
        }

        img {
            filter: invert(64%) sepia(7%) saturate(421%) hue-rotate(185deg) brightness(95%) contrast(83%);
        }

        button:hover img {
            filter: invert(50%) sepia(100%) saturate(1448%) hue-rotate(194deg) brightness(100%) contrast(102%);
        }
    }

    #navMenu {
        position: absolute;
        top: 55px;
        right: 11px;
        width: 131px;
        background: ${(props) => props.theme.background};
        border-radius: 5px;

        ul {
            ${(props) => props.theme.flex()};
            flex-direction: column;
            
            li {
                width: 100%;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                text-align: center;
                cursor: pointer;

                &:not(:last-child) {
                    border-bottom: 1px solid #29313E;
                }

                &:hover {
                    color: ${(props) => props.theme.primary};
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

    #userMenu {
        position: absolute;
        top: 55px;
        right: 102px;
        width: 100px;
        height: 100px;
        background: ${(props) => props.theme.background};
        border: 1px solid #FFFFFF1A;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;

        > div {
            ${(props) => props.theme.flex()};
            flex-direction: column;
            gap: 6px;
            padding-top: 20px;

            p:nth-child(1) {
                color: ${(props) => props.theme.primary};
                font-weight: 600;
            }
        }

        > ul {
            ${(props) => props.theme.flex('space-evenly', 'center')};
            background: #272E42;
            height: 24px;
            width: 100%;
            position: absolute;
            bottom: 0;
            border-radius: 0px 0px 4px 4px;

            a {
                position: relative;
            }

            img {
                position: absolute;
                top: -7px;
                left: -4px;
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