import styled from "styled-components";
import buildingGroup from '../images/buildingGroup.svg';
import building from '../images/building.svg';
import arrow from '../images/arrow.svg';
import ckeck from '../images/check.svg';

export const Contents3DComponent = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #000;

    .buildingGroup,
    .building,
    .equipZone {
        font-size: 12px;
        position: absolute;
        transform: translate(-50%, -50%);
        transform-origin: 50% 50%;
        padding: 4px 8px;
        align-self: stretch;
        font-size: 14px;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 2px;
        background: #0D121A;
        box-shadow:
            0 0 4px 0 #A6A9AF inset, 
            0 0 0 2px rgba(13, 18, 26, 0.7); 
        color: ${({ theme }) => theme.colors.grayscale.g100};
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '6px')};
        flex: 1 0 0;

        &:hover {
            color: ${({ theme }) => theme.colors.white};

            &::before {
                filter: brightness(0) invert(1);
            }
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p400};
            box-shadow: 
                0 0 4px 0 #6487FA inset,
                0 0 0 2px rgba(13, 18, 26, 0.7);

            &::before {
                filter: invert(54%) sepia(52%) saturate(3954%) hue-rotate(207deg) brightness(102%) contrast(96%);
            }
        }
    }

    .buildingGroup {
        &::before {
            content: '';
            display: inline-block;
            width: 0.625rem;
            height: 0.5625rem;
            background: url(${buildingGroup}) no-repeat center center;
        }
    }

    .building {
        padding: 2px 6px;
        gap: 3px;
        font-size: 6px;

        &::before {
            content: '';
            display: inline-block;
            width: 0.4rem;
            height: 0.4rem;
            background: url(${building}) no-repeat center center;
            background-size: contain;
        }
    }

    .equipZone {
        padding: 2px 5px;
        font-weight: 500;
        font-size: 6px;
    }

    #areaInput {
        position: absolute;
        width: 100px !important;
        z-index: 9999;
        font-weight: 500;
        padding: 4px 8px;
        align-self: stretch;
        font-size: .875rem;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 4px;
        background: #0D121A;
        color: ${({ theme }) => theme.colors.primary.p400};
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '6px')};
        flex: 1 0 0;
        box-shadow: 
            0 0 4px 0 #6487FA inset,
            0 0 0 2px rgba(13, 18, 26, 0.7);
    }

    #areaInputHidden {
        display: none;
    }

    .equipmentBtn {
        position: absolute;
        width: 147px;
        height: 55px;
        padding: 4px 12px 12px 12px;
        border-radius: 8px;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '12px')};
        z-index: 2;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='147' height='55' viewBox='0 0 147 55' fill='none'%3E%3Cpath d='M8.11035 0.5H138.89C143.099 0.500002 146.5 3.8643 146.5 8V38C146.5 42.1357 143.099 45.5 138.89 45.5H78.5596L78.415 45.7471L73.4395 54.2471C73.2423 54.5838 72.744 54.5838 72.5469 54.2471L67.5713 45.7471L67.4268 45.5H8.11035C3.9008 45.5 0.5 42.1357 0.5 38V8L0.509766 7.61426C0.7134 3.65712 4.03246 0.5 8.11035 0.5Z' fill='%23131D24' stroke='white'/%3E%3C/svg%3E") no-repeat center;
        background-size: contain;

        svg {
            width: 32px;
            height: 32px;
            padding: 6px;
            border-radius: 4px;
            background: linear-gradient(180deg, #00CB70 0%, #004827 100%);
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        > div {
            ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '5px')};
    
            p {
                white-space: nowrap;
                
    
                &:nth-child(1) {
                    font-size: 10px;
                    letter-spacing: -0.3px;
                    color: ${({ theme }) => theme.colors.grayscale.g100};
                }
    
                &:nth-child(2) {
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.white};
                }
            }
        }
    }

    .equipmentLabel {
        position: absolute;
        padding: 5px 8px;
        border-radius: 4px;
        z-index: 2;
        background: ${({ theme }) => theme.colors.background.base};
        filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));
        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '5px')};
        cursor: default;

        &:hover {
            background: #232D33;
        }

        &.selected {
            border: 1px solid ${({ theme }) => theme.colors.white};
        }
    
        p {
            white-space: nowrap;

            &:nth-child(1) {
                font-size: 10px;
                letter-spacing: -0.3px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }

            &:nth-child(2) {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.white};
            }
        }
    }

    .simulationBtn {
        z-index: 9999;
        position: absolute;
        height: 20px;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08), 0 10px 28px 0 rgba(0, 0, 0, 0.22);
        
        > p,
        > button {
            flex: 1;
            height: 100%;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            font-weight: 500;
            white-space: nowrap;
            padding: 0 7px;
        }

        > p {
            background-color: ${({ theme }) => theme.colors.primary.p500};
            border-radius: 4px 0 0 4px;
            font-size: 8px;
            letter-spacing: -0.42px;
            gap: 5px;
        }

        > button {
            background-color: rgba(19, 29, 36, 0.95);
            border-radius: 0 4px 4px 0;
            font-size: 9px;
            letter-spacing: -0.48px;
            gap: 10px;

            &::after {
                content: '';
                display: inline-block;
                width: 8px;
                height: 8px;
                background: url(${arrow}) no-repeat center center;
                background-size: contain;
            }
        }

        &:hover {
            > button {
                background-color: rgba(31, 41, 47, 0.95);
            }
        }

        &.selected {
            > p {
                background-color: ${({ theme }) => theme.colors.primary.p700};
            }

            > button {
                &::after {
                    width: 9px;
                    height: 9px;
                    background: url(${ckeck}) no-repeat center center;
                    background-size: contain;
                }
            }
        }
    }

    .toggleBtn {
        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '4px')};
        width: 140px;
        padding: 8px 0;
        background-color: ${({ theme }) => theme.colors.white};
        border-radius: 8px;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 4px 11px 0 rgba(0, 0, 0, 0.11);
        z-index: 2;

        > li {
            ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column')};
            align-self: stretch;
            padding: 8px 20px;
            color: ${({ theme }) => theme.colors.grayscale.g700};
            font-size: 16px;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            cursor: pointer;

            &:hover {
                color: ${({ theme }) => theme.colors.primary.p500};
            }
        }
    }

    .deletePoiBtn {
        width: 120px;
        height: 60px;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.colors.white};
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 4px 11px 0 rgba(0, 0, 0, 0.11);
        z-index: 2;

        > button {
            width: 100%;
            font-size: 1rem;
            line-height: 172%; /* 1.72rem */
            letter-spacing: -0.48px;
            color: ${({ theme }) => theme.colors.grayscale.g700};
            padding: 10px 20px;
            text-align: left;
        }

        &:hover {
            > button {
                background: ${({ theme }) => theme.colors.grayscale.g20};
            }
        }

        &:active {
            > button {
                background: ${({ theme }) => theme.colors.primary.p60};
            }
        }
    }

    .mbIcon {
        position: absolute;
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '16px')};
        z-index: 2;

        > img {
            width: 41px;
            height: 45px;
            z-index: 3;
        }

        > ul {
            position: relative;
            top: -7px;
            left: -28px;
            border-radius: 4px;
            padding: 0 12px 0 20px;
            background: ${({ theme }) => theme.colors.black};
            ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '16px')};

            > li {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};

                > p {
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.white};
                }

                &:nth-child(2)::before {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 8px;
                    background-color: ${({ theme }) => theme.colors.grayscale.g700};
                    position: relative;
                    left: -5px;
                }
            }
        }
    }
`;