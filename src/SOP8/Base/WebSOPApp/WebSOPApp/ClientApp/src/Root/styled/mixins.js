import { css } from 'styled-components';

// flexBox 정렬
export const flex = (justify = 'space-between', align = 'center', direction = 'row', gap = '0') => css`
    display: flex;
    justify-content: ${justify};
    align-items: ${align};
    flex-direction: ${direction};
    gap: ${gap};
`;

// Scrollbar 스타일링
export const scroll = (background = '#0D121A', thumb = '#0095FF') => css`
    &::-webkit-scrollbar {
        width: 6px;
        background: ${background};
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${thumb};
        border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    &::-webkit-scrollbar-corner {
        display: none;
    }
`;

// 말줄임 (...) 처리
export const textEllipsis = () => css`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

// 여러 줄 말줄임 (line clamp)
export const multiLineEllipsis = (lines = 2) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

// 시각적으로 숨기되 스크린리더는 인식 (접근성)
export const visuallyHidden = () => css`
    position: absolute !important;
    height: 1px; width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
`;

// 카드 그림자 효과
export const boxShadow = (level = 1) => {
    const shadows = {
        1: '0 1px 3px rgba(0,0,0,0.12)',
        2: '0 3px 6px rgba(0,0,0,0.16)',
        3: '0 10px 20px rgba(0,0,0,0.19)',
    };
    return css`
        box-shadow: ${shadows[level] || shadows[1]};
    `;
};