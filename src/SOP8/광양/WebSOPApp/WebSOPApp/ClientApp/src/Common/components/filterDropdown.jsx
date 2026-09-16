import React, { useEffect, useRef } from 'react';
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
    const wrapperRef = useRef(null);
    const isOpen = openKey === filterKey;   // 버튼을 클릭하여 dropList가 열린 상태인지
    const hasActiveFilter = activeValue !== null;   // 필터가 선택된 상태인지

    const toggle = (e) => {
        e.stopPropagation();
        setOpenKey(isOpen ? null : filterKey);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpenKey(null);
            }
        };

        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, setOpenKey]);

    return (
        <Wrapper ref={wrapperRef}>
            <IconButton
                variant="unfill"
                size="xxxs"
                icon={<Icon.Filter size={'xxxxs'} />}
                onClick={toggle}
                className={`${isOpen ? 'selected' : ''} ${hasActiveFilter ? 'filtered' : ''}`}
            >
                {label}
            </IconButton>

            {isOpen && (
                <DropListWrapper>
                    <DropList
                        size={size}
                        items={items.map((item) => ({
                            ...item,
                            isActive: item.value === activeValue,
                            onClick: () => {
                                item.onClick?.();
                                setOpenKey(null);
                            },
                        }))}
                    />
                </DropListWrapper>
            )}
        </Wrapper>
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
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 1000;
`;