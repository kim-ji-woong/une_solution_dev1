import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";

const activeStyles = css`
    > textarea {
        background: ${({ theme }) => theme.colors.grayscale.g900} !important;
        color: ${({ theme }) => theme.colors.primary.p400} !important;
        border: 1px solid ${({ theme }) => theme.colors.primary.p400} !important;

        &::placeholder {
            color: ${({ theme }) => theme.colors.primary.p400} !important;
        }
    }
`;

const Wrapper = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "fit-content")};

    ${({ $isEditMode }) =>
        $isEditMode &&
        css`
            &:active {
                ${activeStyles}
            }
        `}

    ${({ $isFocused, $isEditMode }) =>
        $isFocused &&
        $isEditMode &&
        activeStyles}

    ${({ $isFocused, $error, $isEditMode, theme }) =>
        !$isFocused &&
        !$error &&
        $isEditMode &&
        css`
            &:hover > textarea {
                background: ${theme.colors.background.base} !important;
                border: 1px solid ${theme.colors.grayscale.g800} !important;
            }
        `}

    ${({ $error }) =>
        $error &&
        css`
            > textarea {
                border: 1px solid
                    ${({ theme }) =>
                        theme.colors.error.error500} !important;
            }
        `}
`;

const StyledTextarea = styled.textarea`
    width: 100% !important;
    height: ${({ $height }) => $height || "120px"} !important;

    background: ${({ theme }) => theme.colors.background.surface} !important;
    font-size: 0.875rem !important;
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g500} !important;
    border-radius: 8px !important;
    padding: 16px 20px !important;

    resize: none;

    ${({ $isEditMode }) =>
        !$isEditMode &&
        css`
            border: none !important;
            background: transparent !important;
        `}

    color: ${({ $isFocused, $isEditMode, theme }) =>
        $isFocused && $isEditMode
            ? theme.colors.primary.p400
            : theme.colors.grayscale.g100};

    &::placeholder {
        color: ${({ $isFocused, $isEditMode, theme }) =>
            $isFocused && $isEditMode
                ? theme.colors.primary.p400
                : theme.colors.grayscale.g300};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CharCount = styled.p`
    color: ${({ theme }) => theme.colors.grayscale.g200} !important;
    font-size: 0.75rem !important;
    line-height: 170% !important;
    letter-spacing: -0.36px !important;
    margin-top: 8px !important;
    text-align: right !important;
`;

export default function TextareaBox({
    value,
    onChange,
    placeholder = "내용을 작성하세요",
    fullWidth,
    disabled = false,
    height,
    error = false,
    onKeyDown,
    maxLength = 500,
    isEditMode = true,
    showCharCount = true
}) {
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef(null);

    return (
        <Wrapper
            $fullWidth={fullWidth}
            $isFocused={focused}
            $error={error}
            $isEditMode={isEditMode}
        >
            <StyledTextarea
                ref={textareaRef}
                value={value}
                onChange={(e) => isEditMode && onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={() => isEditMode && setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={onKeyDown}
                maxLength={maxLength}
                $isFocused={focused}
                $height={height}
                $isEditMode={isEditMode}
                readOnly={!isEditMode}
            />
            {isEditMode && showCharCount && (
                <CharCount>
                    {value.length} / {maxLength}자
                </CharCount>
            )}
        </Wrapper>
    );
}