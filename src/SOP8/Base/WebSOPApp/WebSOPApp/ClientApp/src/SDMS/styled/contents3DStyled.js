import styled from "styled-components";
import buildingGroup from '../images/buildingGroup.svg';
import building from '../images/building.svg';

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
        box-shadow: 0 0 4px 0 #A6A9AF inset;
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
            box-shadow: 0 0 4px 0 #6487FA inset;

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
`;