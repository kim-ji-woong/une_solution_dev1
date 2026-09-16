import React, { useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import DropList from './dropList';
import Icon from './Icon/Icon';

export default function DropBox({
    id,
    value,
    onChange,
    options = [],
    size = 'sm',
    openId,
    setOpenId,
    className,
    placeholder,
    fullWidth,
}) {
    const wrapperRef = useRef(null);
    const open = openId === id;

    const selected = options.find((opt) => String(opt.value) === String(value));
    const displayLabel = selected?.label ?? placeholder ?? '';

    const items = useMemo(
        () =>
            options.map((opt) => ({
                ...opt,
                onClick: () => {
                    if (opt.disabled) return;
                    onChange(opt.value);
                    setOpenId && setOpenId(null);
                },
            })),
        [onChange, options, setOpenId]
    );

    useEffect(() => {
        if (!open) return;

        const handleMouseDownOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenId && setOpenId(null);
            }
        };

        document.addEventListener('mousedown', handleMouseDownOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDownOutside, true);
        };
    }, [open, setOpenId]);

    return (
        <Wrapper ref={wrapperRef} className={className} $fullWidth={fullWidth}>
            <Trigger
                type="button"
                $isFocused={open}
                $isSelected={!!selected}
                $size={size}
                $fullWidth={fullWidth}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenId && setOpenId(open ? null : id);
                }}
            >
                <span>{displayLabel}</span>
                <Icon.Arrow size="xs" direction="bottom" />
            </Trigger>

            {open && (
                <DropListWrapper onMouseDown={(e) => e.stopPropagation()}>
                    <DropList
                        size={size}
                        selectedValue={value}
                        items={items}
                    />
                </DropListWrapper>
            )}
        </Wrapper>
    );
}

const sizeStyles = {
    xs: css`
        height: 28px;
    `,
    sm: css`
        height: 36px;
    `,
    md: css`
        height: 56px;
    `,
};

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
    width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'fit-content')};
`;

const DropListWrapper = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    z-index: 20;
`;

const Trigger = styled.button`
    ${({ $size }) => sizeStyles[$size || 'sm']}
    ${({ theme }) => theme.mixins.flex()};
    width: 100%;
    padding: 0 20px;
    color: ${({ theme }) => theme.colors.grayscale.g100};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background.surface};
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
    cursor: pointer;
    outline: none;
    transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, color 120ms ease;

    > span {
        ${({ theme }) => theme.mixins.textEllipsis()};
        color: ${({ theme }) => theme.colors.grayscale.g100};
        font-size: 0.875rem !important;
        line-height: 172%;
        letter-spacing: -0.42px;
        min-width: 0;
    }

    /* 선택된 상태 (value 존재) */
    ${({ $isSelected, theme }) =>
        $isSelected &&
        css`
            background: ${theme.colors.background.surface};
            color: ${theme.colors.grayscale.g10};
            border: 1px solid ${theme.colors.grayscale.g500};

            > span {
                color: ${theme.colors.grayscale.g10};
            }
        `}

    /* hover */
    &:hover {
        ${({ $isFocused, theme }) =>
            !$isFocused &&
            css`
                background: ${theme.colors.background.base};
                border: 1px solid ${theme.colors.grayscale.g800};
            `}
    }

    /* hover */
    &:active {
        ${({ $isFocused, theme }) =>
            !$isFocused &&
            css`
                background: ${theme.colors.grayscale.g900} !important;
                color: ${theme.colors.primary.p400} !important;
                border: 1px solid ${theme.colors.primary.p400} !important;

                > span {
                    color: ${theme.colors.primary.p400} !important;
                }
            `}
    }

    /* focus (= open 상태) */
    ${({ $isFocused, theme }) =>
        $isFocused &&
        css`
            background: ${theme.colors.grayscale.g900} !important;
            color: ${theme.colors.primary.p400} !important;
            border: 1px solid ${theme.colors.primary.p400} !important;

            > span {
                color: ${theme.colors.primary.p400} !important;
            }
        `}

    svg {
        margin-left: 8px;
    }
`;
