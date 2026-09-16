import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon/Icon";

const Wrapper = styled.div`
    position: relative;
    display: inline-flex;
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};
`;

const Input = styled.input`
    height: 36px !important;
    width: 90px !important;
    border-radius: 8px !important;
    background: transparent !important;
    padding: 0 20px 0 44px !important;
    color: ${({ theme }) => theme.colors.grayscale.g300} !important;
    font-size: 0.875rem !important;
    line-height: 172%;
    letter-spacing: -0.42px;
    transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, color 120ms ease;
    border: 1px solid transparent !important;

    &::placeholder {
        color: ${({ theme }) => theme.colors.grayscale.g300} !important;
    }

    ${({ $isFocused, $hasValue, theme }) =>
        ($isFocused || $hasValue)
            ? css`
                width: 100% !important;
                background: ${theme.colors.grayscale.g20} !important;
                color: ${theme.colors.primary.p700} !important;
                border: 1px solid ${theme.colors.grayscale.g100} !important;
                padding: 0 44px !important;

                &::placeholder {
                    color: ${theme.colors.primary.p700} !important;
                }
            `
            : css`
                &:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                }
            `}
`;

const LeftIcon = styled.span`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    pointer-events: none;

    svg path {
        fill: ${({ theme }) => theme.colors.grayscale.g300};
    }

    ${({ $isFocused, $hasValue, theme }) =>
        ($isFocused || $hasValue) &&
            css`
                svg path {
                    fill: ${theme.colors.primary.p700} !important;
                }
    `}
`;

const ClearButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 16px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
    transition: background 120ms ease, opacity 120ms ease;
    ${({ theme }) => theme.mixins.flex('center', 'center')};

    svg path {
        fill: ${({ theme }) => theme.colors.grayscale.g500};
    }
`;

export default function SearchInputBox({
    value,
    onChange,
    onClear,
    onSubmit,
    placeholder = "검색",
    fullWidth,
    disabled,
}) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const clear = () => {
        onChange("");
        onClear && onClear();
        inputRef.current && inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSubmit && onSubmit(value);
        }
        if (e.key === "Escape" && value) {
            clear();
        }
    };

    return (
        <Wrapper $fullWidth={fullWidth}>
            <LeftIcon $isFocused={focused} $hasValue={!!value} aria-hidden>
                <Icon.Search size={"xxs"} />
            </LeftIcon>

            <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                $isFocused={focused}
                $hasValue={!!value}
                aria-label="검색"
                autoComplete="off"
            />

            <ClearButton
                type="button"
                aria-label="입력 지우기"
                onClick={clear}
                $visible={!!value}
            >
                <Icon.Closer size={"xxs"} />
            </ClearButton>
        </Wrapper>
    );
}
