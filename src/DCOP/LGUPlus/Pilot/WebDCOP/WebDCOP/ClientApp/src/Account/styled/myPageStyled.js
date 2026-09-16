import styled from 'styled-components';

import closeIcon from '../../Common/images/closeIcon.svg';
import myPageIcon from '../images/myPageIcon.svg';
import logoutIcon from '../images/logoutIcon.svg';

/**********************************************************************/
// 마이페이지

export const MyPageComponent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 340px;
    height: 400px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.secondary};

    header {
        position: relative;
        padding: 20px;
        ${(props) => props.theme.flex('flex-end', 'center')};

        > button {
            text-indent: -9999px;
            background: url(${closeIcon}) no-repeat center center;
            width: 24px;
            height: 24px;
            display: block;
        }
    }

    section {
        ${(props) => props.theme.flex('flex-end', 'center')};
        flex-direction: column;
        gap: 4px;

        p:nth-child(1) {
            font-size: 18px;
            font-weight: 500;
            line-height: 30.42px;
            color: #CECFD2;
        }

        p:nth-child(2) {
            font-size: 40px;
            font-weight: 500;
            line-height: 56px;
        }

        button {
            width: 225px;
            height: 46px;
            padding: 8px 0;
            border-radius: 8px;
            color: ${(props) => props.theme.primary};
            background-color: ${(props) => props.theme.background};
            font-size: 18px;
            font-weight: 500;
            margin-top: 20px;
            ${(props) => props.theme.flex('center', 'center')};
            gap: 8px;

            &::before {
                content: '';
                display: inline-block;
                background: url(${logoutIcon}) no-repeat center center;
                width: 24px;
                height: 24px;
            }
        }

        &::before {
            content: '';
            display: inline-block;
            background: url(${myPageIcon}) no-repeat center center;
            width: 120px;
            height: 120px;
            margin-bottom: 24px;
        }
    }
`;