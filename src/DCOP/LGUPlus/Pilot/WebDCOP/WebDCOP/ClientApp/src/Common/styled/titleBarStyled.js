import styled from 'styled-components';
import DCOP_logo from '../images/DCOP_logo.svg';

/**********************************************************************/
// GNB (Dashboard)

export const TitleBarComponent = styled.header`
    position: fixed;
    width: 100vw;
    height: 60px;
    background: linear-gradient(90deg, rgba(23, 29, 35, 0) 0%, rgba(23, 29, 35, 0.9) 19.5%, #171D23 50%, rgba(23, 29, 35, 0.9) 80.37%, rgba(23, 29, 35, 0) 100%);
    text-align: center;
    box-shadow: 0px 4px 4px 0px #00000040;
    z-index: 9999;
    ${(props) => props.theme.flex('center', 'center')};
    ${(props) => props.theme.userSelect()};

    &::before {
        content: '';
        width: 100vw;
        height: 3px;
        background: linear-gradient(90deg, rgba(75, 230, 221, 0) 0%, #4BE5DD 49.5%, rgba(75, 229, 221, 0) 100%);
        position: absolute;
        bottom: 0;
        left: 0;
    }

    h1 {
        font-size: 18px;
        font-weight: 500;
        letter-spacing: -0.03em;
        ${(props) => props.theme.flex('center', 'center')};
        gap: 16px;

        &::before {
            content: '';
            display: inline-block;
            width: 23px;
            height: 27px;
            background: url(${DCOP_logo}) no-repeat center center/cover;
        }
    }
`;


/**********************************************************************/
// GNB (Main)

export const MainTitleBarComponent = styled.header`
    position: fixed;
    z-index: 9999;
    padding-right: 28px;
    ${(props) => props.theme.userSelect()};

    .titleWrap {
        position: fixed;
        left: 50%;
        top: 0;
        transform: translate(-50%, 0);
        width: 800px;
        height: 60px;
        background: linear-gradient(90deg, rgba(23, 29, 35, 0) 0%, rgba(23, 29, 35, 0.9) 19.5%, #171D23 50%, rgba(23, 29, 35, 0.9) 80.37%, rgba(23, 29, 35, 0) 100%);
        text-align: center;
        ${(props) => props.theme.flex('center', 'center')};
        flex-direction: column;
        gap: 6px;

        &::before {
            content: '';
            width: 800px;
            height: 3px;
            background: linear-gradient(90deg, rgba(75, 230, 221, 0) 0%, #4BE5DD 49.5%, rgba(75, 229, 221, 0) 100%);
            position: absolute;
            bottom: 0;
            left: 0;
        }
    
        > h1 {
            font-size: 18px;
            font-weight: 500;
            letter-spacing: -0.03em;
            ${(props) => props.theme.flex('center', 'center')};
            gap: 16px;
        }

        > p {
            font-size: 12px;
            font-weight: 700;
            color: #A6A9AF;
        }
    }

    .sideWrap {
        position: fixed;
        right: 28px;
        height: 60px;
        ${(props) => props.theme.flex('flex-end', 'center')};
        gap: 12px;

        > p {
            font-size: 18px;
            font-weight: 500;
        }

        .weather {
            background: ${(props) => props.theme.background};
            padding: 8px 12px 8px 12px;
            border-radius: 8px;
            ${(props) => props.theme.flex('flex-end', 'center')};
            gap: 12px;

            p {
                font-size: 18px;
                font-weight: 500;
                letter-spacing: -0.03em;
            }

            img {
                width: 24px;
                height: 24px;
            }
        }
    }
`;