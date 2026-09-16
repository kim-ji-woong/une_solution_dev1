import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { createPortal } from 'react-dom';
import DropList from './dropList';
import Icon from './Icon/Icon';

export default function DropBox({
    id,
    value,
    onChange,
    options = [],
    size = 'xs',
    openId,
    setOpenId,
}) {
    const open = openId === id;
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const [position, setPosition] = useState(null);

    const selected = options.find(opt => opt.value === value);

    useEffect(() => {
        if (!open || !triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            top: rect.bottom + 4 + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setOpenId(null);
            }
        };

        if (open) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [open, setOpenId]);

    return (
        <>
            <Wrapper ref={wrapperRef}>
                <Trigger
                    ref={triggerRef}
                    $isFocused={open}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(open ? null : id);
                    }}
                >
                    <span>{selected?.label ?? '선택'}</span>
                    <Icon.Arrow size="xxs" direction="bottom" />
                </Trigger>
            </Wrapper>

            {open && position &&
                createPortal(
                    <DropListWrapper
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        <DropList
                            size={size}
                            items={options.map(opt => ({
                                ...opt,
                                onClick: () => {
                                    onChange(opt.value);
                                    setOpenId(null);
                                },
                            }))}
                        />
                    </DropListWrapper>,
                    document.body
                )}
        </>
    );
}

const DropListWrapper = styled.div`
    position: absolute;
    z-index: 9999;
`;

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const Trigger = styled.button`
    ${({ theme }) => theme.mixins.flex()};
    width: 100%;
    min-width: 120px;
    height: 36px;
    padding: 0 20px 0 20px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
    background: ${({ theme }) => theme.colors.background.base};
    color: ${({ theme }) => theme.colors.grayscale.g300};
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;

    /* 선택된 상태 (value 존재) */
    ${({ $isSelected, theme }) =>
        $isSelected &&
        css`
            border: 1px solid ${theme.colors.primary.p500};
            background: ${theme.colors.primary.p100};
            color: ${theme.colors.primary.p700} !important;
        `}

    /* hover */
    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.grayscale.g100};
    }

    /* focus (= open 상태) */
    ${({ $isFocused, theme }) =>
        $isFocused &&
        css`
            border: 1px solid ${theme.colors.primary.p500} !important;
            background: ${theme.colors.primary.p100};

            > span {
                color: ${theme.colors.primary.p700} !important;
            }
        `}

    svg {
        margin-left: 8px;
        fill: ${({ theme }) => theme.colors.grayscale.g500};
    }

    ${({ $isFocused, theme }) =>
        $isFocused &&
        css`
            svg {
                fill: ${theme.colors.primary.p500};
            }
        `}
`;
