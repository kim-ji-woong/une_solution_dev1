import React from 'react';
import styled from 'styled-components';

export default function DropList({ items = [], size = 'xs' }) {
    return (
        <StyledDropList size={size}>
            {items.map((item, index) => (
                <li
                    key={item.value ?? index}
                    className={item.isActive ? 'active' : ''}
                    onClick={item.onClick}
                >
                    {item.label}
                </li>
            ))}
        </StyledDropList>
    );
}

const SIZE_MAP = {
    xs: '100px',
    sm: '140px',
    md: '180px',
};

const StyledDropList = styled.ul`
    ${({ theme }) =>
        theme.mixins.flex('flex-start', 'flex-start', 'column', '4px')};

    padding: 8px 0;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04),
        0 4px 11px 0 rgba(0, 0, 0, 0.11);
    z-index: 3;

    max-height: 300px;        /* 6개 기준 */
    overflow-x: hidden;
    overflow-y: auto;         /* 넘칠 때만 스크롤 */

    > li {
        ${({ theme }) =>
            theme.mixins.flex('center', 'flex-start', 'column')};
        align-self: stretch;
        width: ${({ size }) => SIZE_MAP[size] || 'auto'};
        padding: 8px 20px;
        color: ${({ theme }) => theme.colors.grayscale.g700};
        font-size: 16px;
        line-height: 172%;
        letter-spacing: -0.48px;
        white-space: nowrap;
        cursor: pointer;

        &:hover {
            color: ${({ theme }) => theme.colors.primary.p500};
        }

        &.active {
            color: ${({ theme }) => theme.colors.primary.p500};
        }
    }
`;