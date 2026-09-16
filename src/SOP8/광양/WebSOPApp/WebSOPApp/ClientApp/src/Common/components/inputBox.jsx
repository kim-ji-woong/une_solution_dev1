import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon/Icon";

const activeStyles = css`
    > input {
        background: ${({ theme }) => theme.colors.grayscale.g900} !important;
        color: ${({ theme }) => theme.colors.primary.p400} !important;
        border: 1px solid ${({ theme }) => theme.colors.primary.p400} !important;

        &::placeholder {
            color: ${({ theme }) => theme.colors.primary.p400} !important;
        }
    }

    > span,
    > button {
        color: ${({ theme }) => theme.colors.primary.p400} !important;
    }
`;

const Wrapper = styled.div`
    ${({ $size }) => sizeStyles[$size || 'md']}
    position: relative;
    display: inline-flex;
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};

    &:active {
        ${activeStyles}
    }

    ${({ $isFocused }) =>
        $isFocused && activeStyles}

    ${({ $isFocused, $error }) =>
        !$isFocused && !$error &&
        css`
            &:hover > input {
                background: ${({ theme }) => theme.colors.background.base} !important;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g800} !important;
            }
        `}

    ${({ $error }) =>
        $error &&
        css`
            > input {
                border: 1px solid ${({ theme }) => theme.colors.error.error500} !important;
            }
        `}
`;


const Input = styled.input`
    width: 100% !important;
    height: 100% !important;
    background: ${({ theme }) => theme.colors.background.surface} !important;
    font-size: 0.875rem !important;
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500} !important;
    border-radius: 8px !important;

    padding: ${({ $size, $hasLeftIcon }) => {
        const leftPadding = $hasLeftIcon
            ? ($size === "md" ? "68px" : "64px")
            : "20px";

        return `0 20px 0 ${leftPadding}`;
    }} !important;

    color: ${({ $isFocused, theme }) =>
        $isFocused
            ? theme.colors.primary.p400
            : theme.colors.grayscale.g100};

    &::placeholder {
        color: ${({ $isFocused, theme }) =>
            $isFocused
                ? theme.colors.primary.p400
                : theme.colors.grayscale.g100};
    }
`;

const LeftIcon = styled.span`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    pointer-events: none;
    color: ${({ theme }) => theme.colors.grayscale.g100};
`;

const ClearButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 9999px;
    cursor: pointer;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
    transition: background 120ms ease, opacity 120ms ease;
    ${({ theme }) => theme.mixins.flex('center', 'center')};
    color: ${({ theme }) => theme.colors.grayscale.g100};
`;

const PasswordToggleButton = styled.button`
    position: absolute;
    right: 64px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 9999px;
    cursor: pointer;
    ${({ theme }) => theme.mixins.flex('center', 'center')};
    color: ${({ theme }) => theme.colors.grayscale.g100};
`;

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

export default function InputBox({
    type = "text",
    value,
    onChange,
    onClear,
    onSubmit,
    onKeyDown,
    placeholder = "검색",
    fullWidth,
    disabled = false,
    leftIcon,
    size = "md",
    error = false,
    className,
}) {
    const [showPassword, setShowPassword] = useState(false);

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

        // 부모에서 전달한 onKeyDown도 실행
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    return (
        <Wrapper
            className={className}
            $fullWidth={fullWidth}
            $isFocused={focused}
            $size={size}
            $error={error}
        >
            {leftIcon &&
                <LeftIcon aria-hidden>
                    {leftIcon}
                </LeftIcon>
            }

            <Input
                ref={inputRef}
                type={type === "password" && showPassword ? "text" : type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                aria-label="검색"
                autoComplete="off"
                $isFocused={focused}
                $size={size}
                $hasLeftIcon={!!leftIcon}
            />

            {type === "password" && value && (
                <PasswordToggleButton
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label="비밀번호 보기"
                >
                    <Icon.Eyes
                        size="xs"
                        isActive={showPassword}
                    />
                </PasswordToggleButton>
            )}

            <ClearButton
                type="button"
                aria-label="입력 지우기"
                onClick={clear}
                $visible={!!value}
            >
                <Icon.Closer size={size === "md" ? "xs" : "xxs"} />
            </ClearButton>
        </Wrapper>
    );
}
