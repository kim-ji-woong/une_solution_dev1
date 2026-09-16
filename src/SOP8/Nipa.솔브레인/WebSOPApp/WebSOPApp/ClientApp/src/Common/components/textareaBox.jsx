import React, { useState } from "react";
import styled, { css } from "styled-components";

const TextareaWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    min-height: 120px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
    background: ${({ theme }) => theme.colors.background.base};
    color: ${({ theme }) => theme.colors.grayscale.g20};
    font-size: 0.875rem;
    outline: none;
    padding: 12px 16px;
    resize: none;

    &::placeholder {
        color: ${({ theme }) => theme.colors.grayscale.g300};
    }

    /* hover, focus 스타일은 수정 모드일 때만 동작 */
    ${({ $isEditMode, theme }) =>
        $isEditMode &&
        css`
            &:hover {
                border: 1px solid ${theme.colors.primary.p500};
            }
        `}

    ${({ $isFocused, theme }) =>
        $isFocused &&
        css`
            border: 1px solid ${theme.colors.primary.p500};
        `}

    ${({ $isEditMode, theme }) =>
        !$isEditMode &&
        css`
            border: none;
        `}
`;

const CharCount = styled.p`
    color: ${({ theme }) => theme.colors.grayscale.g200} !important;
    font-size: 0.75rem !important;
    line-height: 170% !important;
    letter-spacing: -0.36px !important;
    margin-top: 8px !important;
    text-align: right !important;
`;

function TextareaBox({
    placeholder = "내용을 작성하세요",
    value,
    onChange,
    maxLength = 500,
    isEditMode = true
}) {
    const [focused, setFocused] = useState(false);

    return (
        <TextareaWrapper>
            <StyledTextarea
                $isFocused={focused && isEditMode}
                placeholder={placeholder}
                value={value}
                maxLength={maxLength}
                onChange={(e) => isEditMode && onChange(e.target.value)}
                onFocus={() => isEditMode && setFocused(true)}
                onBlur={() => setFocused(false)}
                readOnly={!isEditMode}
                $isEditMode={isEditMode}
            />
            {
                isEditMode &&
                    <CharCount>
                        {value.length} / {maxLength}자
                    </CharCount>
            }
        </TextareaWrapper>
    );
}

export default TextareaBox;
