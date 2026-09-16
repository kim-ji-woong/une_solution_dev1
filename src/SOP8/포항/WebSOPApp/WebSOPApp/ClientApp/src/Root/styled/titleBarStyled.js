import styled from 'styled-components';

import userArrow from '../images/userArrow.svg';
import userInfo from '../images/userInfo.svg';
import logout from '../images/logout.svg';
import systemOut from '../images/systemOut.svg';


/**********************************************************************/
export const TitleBarComponent = styled.div`
    position: fixed;
    z-index: 3;
    background-color: ${(props) => props.theme.background};
    width: 100vw;
    height: 50px;
    padding: 0 20px;
    ${(props) => props.theme.flex()};
    ${(props) => props.theme.userSelect()};

    div:nth-child(1) {
        ${(props) => props.theme.flex()};

        img {
            cursor: pointer;
            width: 80px;
            height: 26px;
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
        ${(props) => props.theme.flex()};
        gap: 22px;

        img:hover, & button.on img, & li.on button img {
            filter: invert(42%) sepia(82%) saturate(2612%) hue-rotate(184deg) brightness(100%) contrast(108%);
        }

        button {
            position: relative;

            &:hover::after {
                content:attr(data-title); 
                position: absolute; 
                white-space: nowrap;
                line-height: 10px;
                top: 32px;
                left: 50%; 
                transform: translate(-50%, 0);
                padding: 11px 10px;
                background: #565B69; 
                border-radius: 4px;
                font-size: 12px; 
                font-weight: 500;
                color: #fff;
                text-align: center; 
                z-index: 100;
            }

            &:hover::before {
                content: " ";
                position: absolute;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-bottom: 5px solid #565B69;
                top: 28px;
                left: 50%; 
                transform: translate(-50%, 0);
            }
        }
    }

    #navMenu {
        position: absolute;
        top: 55px;
        right: 11px;
        width: 131px;
        background: ${(props) => props.theme.background};

        ul {
            ${(props) => props.theme.flex()};
            flex-direction: column;
            
            li {
                width: 100%;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                text-align: left;
                cursor: pointer;
                padding-left: 20px;

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
        right: 20px;
        width: 160px;
        background: ${(props) => props.theme.background};

        & * {
            font-size: 14px;
            font-weight: 500;
        }

        ul {
            ${(props) => props.theme.flex('center', 'flex-start')};
            flex-direction: column;

            li {
                width: 100%;
                cursor: pointer;
                position: relative;

                &:not(:last-child) {
                    border-bottom: 1px solid #29313E;
                }

                &:hover {
                    color: ${(props) => props.theme.primary};

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

                    &:nth-child(2), &:nth-child(3), &:nth-child(4) {

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
                            color: ${(props) => props.theme.primary};
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
                            font-size: 12px;
                            color: rgba(255, 255, 255, 0.70);
                        }
                    }
                }

                &:nth-child(2),
                &:nth-child(3),
                &:nth-child(4) {
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

                &:nth-child(4) {

                    &::before {
                        height: 16px;
                        background: url(${systemOut}) no-repeat center center;
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