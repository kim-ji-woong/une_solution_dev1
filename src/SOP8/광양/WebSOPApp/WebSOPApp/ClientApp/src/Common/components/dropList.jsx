import React from 'react';
import styled, { css } from 'styled-components';

export default function DropList({ items = [], size = 'sm', selectedValue }) {
    return (
        <StyledDropList $size={size}>
            {items.map((item, index) => {
                const isSelected = item.value === selectedValue;

                return (
                    <StyledItem
                        key={item.value ?? index}
                        $selected={isSelected}
                        onClick={item.onClick}
                        disabled={item.disabled}
                    >
                        {item.label}
                    </StyledItem>
                );
            })}
        </StyledDropList>
    );
}

const sizeStyles = {
    xs: css`
        > li {
            padding: 6px 20px;
            font-size: 14px !important;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    `,
    sm: css`
        > li {
            padding: 6px 20px;
            font-size: 14px !important;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    `,
    md: css`
        > li {
            padding: 8px 20px;
            font-size: 16px !important;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
        }
    `,
}

const StyledDropList = styled.ul`
    ${({ $size }) => sizeStyles[$size || 'sm']}
    ${({ theme }) => theme.mixins.flex('flex-start', 'flex-start', 'column', '4px')};

    width: 100%;
    padding: 8px 0;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04),
        0 4px 11px 0 rgba(0, 0, 0, 0.11);

    z-index: 3;
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: auto;
`;

const StyledItem = styled.li`
    ${({ theme }) => theme.mixins.flex('center', 'flex-start', 'column')};
    align-self: stretch;
    white-space: nowrap;
    cursor: pointer;

    color: ${({ theme, $selected }) =>
        $selected
            ? theme.colors.primary.p500
            : theme.colors.grayscale.g700};

    background-color: ${({ theme }) => theme.colors.white};

    &:hover {
        background: ${({ theme }) => theme.colors.grayscale.g20};
    }

    &:active {
        background: ${({ theme }) => theme.colors.primary.p100};
    }

    &:disabled {
        color: ${({ theme }) => theme.colors.grayscale.g150};
        cursor: not-allowed;
    }
`;