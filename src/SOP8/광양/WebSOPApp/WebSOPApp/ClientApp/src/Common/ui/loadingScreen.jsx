import React from 'react';
import styled from 'styled-components';
import loadingScreen from '../images/loadingScreenImg.png';
import gwangyang_logo from '../images/gwangyang_logo.svg';

export default function LoadingScreen({ progress = 0 }) {
    return (
        <Background>
            <div className='titleWrap'>
                <img src={gwangyang_logo} alt='금융결제원 로고' width={150} height={48} />
                <pre>
                    {`디지털 트윈 기술을 통해 광양 산업단지 환경을 실시간으로 모니터링하고 최적화합니다.
센서 기반 데이터 수집으로 재난 상황을 통합 관리하고 대응 역량을 강화합니다.`}
                </pre>
            </div>

            <div className='progressWrap'>
                <div className='prograssValue'>
                    <p><span /><span /><span /><span /></p>
                    <p>Loading control service</p>
                    <p>{progress}%</p>
                    <p>Gwangyang Industrial Monitoring</p>
                </div>
                <div className='prograssbar'>
                    <div className='barFill' style={{ width: `${progress}%` }} />
                </div>
            </div>
            <GradientBackground />
        </Background>
    );
};

const Background = styled.div`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: url(${loadingScreen}) no-repeat center center;
    background-size: cover;
    z-index: 9999;
    ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'column', '38px')};

    .titleWrap {
        width: 100%;
        z-index: 2;
        padding: 10px;
        ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '32px')};

        > pre {
            font-size: 1rem;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            color: ${({ theme }) => theme.colors.grayscale.g50};
            text-align: center;
        }
    }
    
    .progressWrap {
        width: 100%;
        height: 9.75rem;
        z-index: 2;
        background: linear-gradient(90deg, rgba(3, 6, 11, 0.00) 0%, rgba(3, 6, 11, 0.90) 50%, rgba(3, 6, 11, 0.00) 100%);
        ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};

        .prograssValue {
            ${({ theme }) => theme.mixins.flex('center', 'center', 'column')};

            > p {

                &:nth-child(1) {
                    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
                    margin-bottom: 8px;

                    span {
                        display: inline-block;
                        width: 20px;
                        height: 2px;
                        background-color: ${({ theme }) => theme.colors.grayscale.g600};
                    }
                }

                &:nth-child(2) {
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: ${({ theme }) => theme.colors.grayscale.g600};
                    margin-bottom: 4px;


                }

                &:nth-child(3) {
                    font-size: 1.25rem;
                    font-weight: 500;
                    line-height: 172%;
                    letter-spacing: -0.6px;
                    color: ${({ theme }) => theme.colors.primary.p500};
                    margin-bottom: 12px;
                    position: relative;

                    &::after {
                        content: '';
                        width: 100px;
                        height: 2px;
                        background: linear-gradient(90deg, #0B0F16 0%, #3C69FC 50%, #0B0F16 100%);
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translate(-50%, 0);
                    }
                }

                &:nth-child(4) {
                    font-size: 0.875rem;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: 7px;
                    color: rgba(180, 195, 255, 0.80);
                }
            }
        }

        .prograssbar {
            width: 100%;
            height: 6px;
            background: ${({ theme }) => theme.colors.grayscale.g900};
            overflow: hidden;
            border-radius: 3px;
            position: absolute;
            bottom: 0;

            .barFill {
                height: 100%;
                background: ${({ theme }) => theme.colors.primary.p500};
                transform-origin: left center;
                will-change: transform;
            }
        }
    }
`;

const Gradient = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const GradientBackground = () => (
    <Gradient
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
    >
        <g filter="url(#filter0_n_49_1961)">
            <rect width="1920" height="1080" fill="url(#paint0_radial_49_1961)" />
        </g>
        <defs>
            <filter
                id="filter0_n_49_1961"
                x="0"
                y="0"
                width="1920"
                height="1080"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="1 1"
                    stitchTiles="stitch"
                    numOctaves="3"
                    result="noise"
                    seed="5834"
                />
                <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                    <feFuncA
                        type="discrete"
                        tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                    />
                </feComponentTransfer>
                <feComposite
                    operator="in"
                    in2="shape"
                    in="coloredNoise1"
                    result="noise1Clipped"
                />
                <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                <feComposite
                    operator="in"
                    in2="noise1Clipped"
                    in="color1Flood"
                    result="color1"
                />
                <feMerge result="effect1_noise_49_1961">
                    <feMergeNode in="shape" />
                    <feMergeNode in="color1" />
                </feMerge>
            </filter>
            <radialGradient
                id="paint0_radial_49_1961"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(960 540) rotate(90) scale(540 960)"
            >
                <stop stopOpacity="0.3" />
                <stop offset="1" stopOpacity="0.9" />
            </radialGradient>
        </defs>
    </Gradient>
);