import styled, { keyframes } from 'styled-components';

import userArrow from '../images/userArrow.svg';
import userInfo from '../images/userInfo.svg';
import logout from '../images/logout.svg';

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
    z-index: 3;
    background-color: ${({ theme }) => theme.colors.background.base};
    width: 100vw;
    height: 50px;
    padding: 0 20px;
    ${({ theme }) => theme.mixins.flex()};
    user-select: none;

    div:nth-child(1) {
        ${({ theme }) => theme.mixins.flex()};

        img {
            cursor: pointer;
            width: 99px;
            height: 24px;
        }

        p {
            height: 20px;
            line-height: 20px;
            font-weight: 500;
            padding-left: 10px;
            margin-left: 12px;
            border-left: 1px solid rgba(255, 255, 255, 0.30);
        }
    }

    div:nth-child(2) {
        ${({ theme }) => theme.mixins.flex()};
        gap: 22px;

        img:hover, & button.on img, & li.on button img {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }
    }

    #navMenu {
        position: absolute;
        top: 55px;
        right: 11px;
        width: 131px;
        background: ${({ theme }) => theme.colors.background.base};

        ul {
            ${({ theme }) => theme.mixins.flex()};
            flex-direction: column;
            
            li {
                width: 100%;
                height: 38px;
                line-height: 38px;
                font-size: 0.875rem;
                text-align: center;
                cursor: pointer;

                &:not(:last-child) {
                    border-bottom: 1px solid #29313E;
                }

                &:hover {
                    color: ${({ theme }) => theme.colors.primary};
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
        right: 20px;
        width: 160px;
        background: ${({ theme }) => theme.colors.background.base};

        & * {
            font-size: 0.875rem;
            font-weight: 500;
        }

        ul {
            ${({ theme }) => theme.mixins.flex('center', 'flex-start')};
            flex-direction: column;

            li {
                width: 100%;
                cursor: pointer;
                position: relative;

                &:not(:last-child) {
                    border-bottom: 1px solid #29313E;
                }

                &:hover {
                    color: ${({ theme }) => theme.colors.primary};

                    &::after {
                        content: '';
                        display: inline-block;
                        background: url(${userArrow}) no-repeat center center;
                        width: 12px;
                        height: 12px;
                        position: absolute;
                        top: 15px;
                        right: 20px;
                    }

                    &:nth-child(2), &:nth-child(3) {

                        &::before {
                            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
                        }
                    }
                }

                &:nth-child(1) {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 18px 20px;

                    &:hover {
                        p:nth-child(1) {
                            color: ${({ theme }) => theme.colors.primary};
                        }

                        &::after {
                            top: 19px;
                        }
                    }
                    
                    p {
                        &:nth-child(1) {
                            font-weight: 700;
                        }

                        &:nth-child(2) {
                            font-size: 0.75rem;
                            color: rgba(255, 255, 255, 0.70);
                        }
                    }
                }

                &:nth-child(2),
                &:nth-child(3) {
                    height: 42px;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    
                    &::before {
                        content: '';
                        display: inline-block;
                        background: url(${userInfo}) no-repeat center center;
                        width: 16px;
                        height: 15px;
                        margin-right: 10px;
                    }
                }

                &:nth-child(3) {

                    &::before {
                        background: url(${logout}) no-repeat center center;
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

    .navigationBtn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &.item {
            ${({ theme }) => theme.mixins.flex()};
            gap: 10px;
            top: 60px;
            transform: translate(-50%, 0);

            &.off {
                li {
                    opacity: 1;
                    margin-top: 0;
                    visibility: visible;
                    animation: ${animation_off} 0.5s forwards;
    
                    &:nth-child(1) {
                        animation-delay: 0.3s;
                    }
    
                    &:nth-child(2) {
                        animation-delay: 0.25s;
                    }
    
                    &:nth-child(3) {
                        animation-delay: 0.2s;
                    }
    
                    &:nth-child(4) {
                        animation-delay: 0.15s;
                    }
    
                    &:nth-child(5) {
                        animation-delay: 0.1s;
                    }
    
                    &:nth-child(6) {
                        animation-delay: 0.05s;
                    }
    
                    &:nth-child(7) {
                        animation-delay: 0s;
                    }
                }
            }

            &.on {

                li {
                    opacity: 0;
                    margin-top: -50px;
                    visibility: hidden;
                    animation: ${animation_on} 0.5s forwards;
    
                    &:nth-child(1) {
                        animation-delay: 0s;
                    }
    
                    &:nth-child(2) {
                        animation-delay: 0.05s;
                    }
    
                    &:nth-child(3) {
                        animation-delay: 0.1s;
                    }
    
                    &:nth-child(4) {
                        animation-delay: 0.15s;
                    }
    
                    &:nth-child(5) {
                        animation-delay: 0.2s;
                    }
    
                    &:nth-child(6) {
                        animation-delay: 0.25s;
                    }
    
                    &:nth-child(7) {
                        animation-delay: 0.3s;
                    }
                }
            }

            li {
                visibility: hidden;
                ${({ theme }) => theme.mixins.flex()};
                background: ${({ theme }) => theme.colors.background.base};
                width: 40px;
                height: 40px;
                border-radius: 2px;
                box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.17);
                position: relative;

                button {
                    width: 40px;
                }

                button::before {
                    display: block;
                    background: ${({ theme }) => theme.colors.text.inverse};
                    color: #F5F5F5;
                    opacity: 0;
                    -webkit-transition: all 0.3s;
                    transition: all 0.3s;
                    font-size: 0.625rem;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, 0%);
                    margin-top: 27px;
                    padding: 5px 10px;
                    white-space: nowrap;
                    border-radius: 2px;
                }

                button::after {
                    content: '';
                    display: block;
                    opacity: 0;
                    -webkit-transition: all 0.3s;
                    transition: all 0.3s;
                    position: absolute;
                    left: 50%;
                    bottom: -8px;
                    transform: translate(-50%, 0%);
                    border-bottom: 5px solid #000;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                }

                button:hover::before,
                button:hover::after {
                    opacity: 1;
                    z-index: 2;
                }

                &:nth-child(1) button::before {
                    content: "초기화면";
                }

                &:nth-child(2) button::before {
                    content: "초기화면 지정";
                }

                &:nth-child(3) button::before {
                    content: "확대";
                }

                &:nth-child(4) button::before {
                    content: "축소";
                }

                &:nth-child(5) button::before {
                    content: '${props => props.$autoRotation ? "자동회전 ON" : "자동회전 OFF"}';
                }

                &:nth-child(6) button::before {
                    content: "거리측정";
                }

                &:nth-child(7) button::before {
                    content: "키 맵";
                }
            }
        }
    }
`;