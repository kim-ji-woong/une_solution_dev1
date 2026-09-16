import styled from "styled-components";
import buildingGroup from '../images/buildingGroup.svg';
import building from '../images/building.svg';
import tps from '../images/tps.svg';

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
    .equipZone,
    .tps {
        font-size: 12px;
        position: absolute;
        transform: translate(-50%, -50%);
        transform-origin: 50% 50%;
        padding: 4px 8px;
        align-self: stretch;
        font-size: 14px;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 1px;
        background: #0D121A;
        box-shadow:
            0 0 4px 0 #A6A9AF inset, 
            0 0 0 1px rgba(13, 18, 26, 0.7); 
        color: ${({ theme }) => theme.colors.grayscale.g100};
        ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '2px')};
        flex: 1 0 0;
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

    .equipZone,
    .tps {
        padding: 1px 2px;
        font-weight: 400;
        font-size: 5px;
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

    .door {
        z-index: 2;
        ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start')};

        .door__icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }

        .door__icon {
            display: block;
        }
    }

    .doorList {
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '4px')};
        padding: 5px 10px;
        border-radius: 0 4px 4px 0;
        background: ${({ theme }) => theme.colors.background.base};
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
        z-index: 1;

        > li {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${({ theme }) => theme.colors.grayscale.g700};
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            overflow: hidden;

            > span {
                font-size: 0.875rem;
                font-weight: 500;
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.white};
            }

            &.blue {
                background: ${({ theme }) => theme.colors.primary.p500};
            }

            &.orange {
                background: ${({ theme }) => theme.colors.secondary.s500};
            }
        }
    }

    .elevator {
        z-index: 2;
        position: absolute;
        top: 50%;
        left: 60%;
        border-radius: 4px;
        background: ${({ theme }) => theme.colors.background.base};
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
        padding: 4px 8px;

        > span {
            font-size: 14px;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }
    }

    .tps {
        &::after {
            content: '';
            display: inline-block;
            width: 7px;
            height: 7px;
            background: url(${tps}) no-repeat center center;
            background-size: contain;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.white};

            &::after,
            &::before {
                filter: brightness(0) invert(1);
            }
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p400};
            box-shadow: 
                0 0 4px 0 #6487FA inset,
                0 0 0 1px rgba(13, 18, 26, 0.7);

            &::after,
            &::before {
                filter: invert(54%) sepia(52%) saturate(3954%) hue-rotate(207deg) brightness(102%) contrast(96%);
            }
        }
    }
`;