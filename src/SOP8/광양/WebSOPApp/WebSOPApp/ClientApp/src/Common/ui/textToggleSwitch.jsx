import React from "react";
import styled from "styled-components";

export default function TextToggleSwitch({
    checked,
    onChange,
    leftText = "활성화",
    rightText = "비활성화",
    leftIcon,
    rightIcon,
    disabled = false
}) {
    return (
        <Wrapper
            $checked={checked}
            $disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
        >
            <Slider $checked={checked} />

            <Option
                $position="left"
                $checked={checked}
            >
                {leftIcon}
                {leftText}
            </Option>

            <Option
                $position="right"
                $checked={checked}
            >
                {rightIcon}
                {rightText}
            </Option>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 284px;
    height: 40px;
    background: #121721;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};

    &:hover {
        background-color: ${({ theme }) => theme.colors.grayscale.g850};
        border: 1px solid ${({ theme }) => theme.colors.background.elevated};
    }
`;

const Slider = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    border-radius: 8px;
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);

    background: ${({ theme, $checked }) =>
        $checked
            ? theme.colors.success.success900
            : theme.colors.error.error900};

    border: 1px solid
        ${({ theme, $checked }) =>
            $checked
                ? theme.colors.success.success400
                : theme.colors.error.error400};

    transform: ${(p) =>
        p.$checked ? "translateX(0)" : "translateX(100%)"};
`;

const Option = styled.div`
    flex: 1;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
    font-size: 14px;
    line-height: 172%; /* 24.08px */
    letter-spacing: -0.42px;
    z-index: 1;
    transition: color 0.25s ease;

    color: ${({ $position, $checked, theme }) => {
        const isActive =
            ($position === "left" && $checked) ||
            ($position === "right" && !$checked);

        // 활성일 때
        if (isActive) {
            return $position === "left"
                ? theme.colors.success.success400
                : theme.colors.error.error400;
        }

        // 비활성일 때
        return theme.colors.grayscale.g200
    }};
`;