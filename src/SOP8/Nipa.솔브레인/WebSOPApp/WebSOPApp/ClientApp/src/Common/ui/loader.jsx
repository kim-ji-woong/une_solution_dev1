import React from 'react';
import styled, { keyframes } from 'styled-components';

function Loader({ message = '데이터를 불러오고 있습니다.' }) {
    return (
        <LoaderWrap role="status" aria-live="polite">
            <Blobs>
                <div className="blobs">
                    <div className="blob-center"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                    <div className="blob"></div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" aria-hidden="true">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                result="goo"
                            />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>
            </Blobs>
            <p>{message}</p>
        </LoaderWrap>
    );
}

export default Loader;

const blobs = keyframes`
    0% {
        opacity: 0;
        transform: scale(0) translate(calc(-330px - 50%), -50%);
    }
    1% {
        opacity: 1;
    }
    35%,
    65% {
        opacity: 1;
        transform: scale(0.9) translate(-50%, -50%);
    }
    99% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: scale(0) translate(calc(330px - 50%), -50%);
    }
`;

const blobGrow = keyframes`
    0%,
    39% {
        transform: scale(0) translate(-50%, -50%);
    }
    40%,
    42% {
        transform: scale(1, 0.9) translate(-50%, -50%);
    }
    43%,
    44% {
        transform: scale(1.2, 1.1) translate(-50%, -50%);
    }
    45%,
    46% {
        transform: scale(1.3, 1.2) translate(-50%, -50%);
    }
    47%,
    48% {
        transform: scale(1.4, 1.3) translate(-50%, -50%);
    }
    52% {
        transform: scale(1.5, 1.4) translate(-50%, -50%);
    }
    54% {
        transform: scale(1.7, 1.6) translate(-50%, -50%);
    }
    58% {
        transform: scale(1.8, 1.7) translate(-50%, -50%);
    }
    68%,
    70% {
        transform: scale(1.7, 1.5) translate(-50%, -50%);
    }
    78% {
        transform: scale(1.6, 1.4) translate(-50%, -50%);
    }
    80%,
    81% {
        transform: scale(1.5, 1.4) translate(-50%, -50%);
    }
    82%,
    83% {
        transform: scale(1.4, 1.3) translate(-50%, -50%);
    }
    84%,
    85% {
        transform: scale(1.3, 1.2) translate(-50%, -50%);
    }
    86%,
    87% {
        transform: scale(1.2, 1.1) translate(-50%, -50%);
    }
    90%,
    91% {
        transform: scale(1, 0.9) translate(-50%, -50%);
    }
    92%,
    100% {
        transform: scale(0) translate(-50%, -50%);
    }
`;

const LoaderWrap = styled.div`
    width: 100%;
    height: 100%;
    min-height: 240px;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '12px')};

    > p {
        font-size: 1rem;
        font-weight: 500;
        line-height: 160%;
        color: ${({ theme }) => theme.colors.grayscale.g100};
        text-align: center;
    }
`;

const Blobs = styled.div`
    svg {
        display: none;
    }

    .blobs {
        filter: url(#goo);
        width: 300px;
        height: 150px;
        position: relative;
        overflow: hidden;
        border-radius: 70px;
        transform-style: preserve-3d;

        .blob-center {
            transform-style: preserve-3d;
            position: absolute;
            background: ${({ theme }) => theme.colors.primary.p500};
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            transform-origin: left top;
            transform: scale(0.9) translate(-50%, -50%);
            animation: ${blobGrow} linear 3.4s infinite;
            border-radius: 50%;
            box-shadow: 0 -10px 40px -5px ${({ theme }) => theme.colors.primary.p500};
        }
    }

    .blob {
        position: absolute;
        background: ${({ theme }) => theme.colors.primary.p500};
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        animation: ${blobs} ease-out 3.4s infinite;
        transform: scale(0.9) translate(-50%, -50%);
        transform-origin: center top;
        opacity: 0;

        &:nth-child(1) {
            animation-delay: 0.2s;
        }

        &:nth-child(2) {
            animation-delay: 0.4s;
        }

        &:nth-child(3) {
            animation-delay: 0.6s;
        }

        &:nth-child(4) {
            animation-delay: 0.8s;
        }

        &:nth-child(5) {
            animation-delay: 1s;
        }

        &:nth-child(6) {
            animation-delay: 1.2s;
        }
    }
`;
