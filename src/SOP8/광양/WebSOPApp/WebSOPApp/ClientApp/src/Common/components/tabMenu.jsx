import React from "react";
import styled, { css } from "styled-components";

const TabMenuWrap = styled.ul`
    ${({ theme }) => theme.mixins.flex()}
    gap: 4px;
`;

const TabItem = styled.li`
    flex: 1;
    color: ${({ theme }) => theme.colors.grayscale.g700};
    font-size: .875rem;
    line-height: 172%; /* 24.08px */
    letter-spacing: -0.42px;
    text-align: center;
    padding: 8px 0;
    border-bottom: 2px solid ${({ theme }) => theme.colors.grayscale.g700};
    cursor: pointer;

    ${({ $active }) =>
        $active &&
        css`
            color: ${({ theme }) => theme.colors.primary.p500};
            border-bottom: 2px solid ${({ theme }) => theme.colors.primary.p500};
        `}
`;

export default function TabMenu({
    tabs = [], // [{ key: 'sensor', label: '센서', count: 12 }]
    activeKey,
    onChange,
    className = "",
}) {
    return (
        <TabMenuWrap
            className={className}
        >
            {tabs.map(({ key, label, count }) => (
                <TabItem
                    key={key}
                    $active={key === activeKey}
                    onClick={() => onChange(key)}
                >
                    {count !== undefined ? `${label} (${count})` : label}
                </TabItem>
            ))}
        </TabMenuWrap>
    );
}
