import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import IconButton from './iconButton';
import Icon from './Icon/Icon';
import DropList from './dropList';

export default function FilterDropdown({
    filterKey,
    openKey,
    setOpenKey,
    items = [],
    size = 'xs',
    label = '필터',
    activeValue,
}) {
    const [position, setPosition] = useState(null);

    const wrapperRef = useRef(null);
    const isOpen = openKey === filterKey;   // 버튼을 클릭하여 dropList가 열린 상태인지
    const hasActiveFilter = activeValue !== null;   // 필터가 선택된 상태인지

    const toggle = (e) => {
        e.stopPropagation();

        if (!isOpen && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.right,
            });
        }

        setOpenKey(isOpen ? null : filterKey);
    };

    useEffect(() => {
        const handleClickOutside = () => setOpenKey(null);

        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, setOpenKey]);

    return (
        <>
            <Wrapper ref={wrapperRef}>
                <IconButton
                    variant="unfill"
                    size={size === "xs" ? "xxxs" : "xxs"}
                    icon={<Icon.Filter size={size === "xs" ? "xxxxs" : "xxs"} />}
                    onClick={toggle}
                    className={`${isOpen ? 'selected' : ''} ${hasActiveFilter ? 'filtered' : ''}`}
                >
                    {label}
                </IconButton>
            </Wrapper>

            {isOpen && position &&
                createPortal(
                    <DropListWrapper
                        style={{
                            top: position.top + 3,
                            left: size === 'xs' ? position.left - 100 : position.left - 110,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DropList
                            size={size}
                            items={items.map(item => ({
                                ...item,
                                isActive: item.value === activeValue,
                                onClick: () => {
                                    item.onClick?.();
                                    setOpenKey(null);
                                },
                            }))}
                        />
                    </DropListWrapper>,
                    document.body
                )}
        </>
    );
}

const Wrapper = styled.div`
    position: relative;
    display: inline-flex;

    .filtered {
        position: relative;

        &::before {
            content: '';
            display: inline-block;
            width: 2px;
            height: 2px;
            position: absolute;
            top: 2px;
            right: 2px;
            background-color: ${({ theme }) => theme.colors.secondary.s400};
            border-radius: 50%;
        }
    }
`;

const DropListWrapper = styled.div`
    position: fixed;
    z-index: 9999;
`;