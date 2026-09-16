import React, { useState } from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon/Icon";

const SelectWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: fit-content;
`;

const StyledSelect = styled.select`
    width: 100%;
    height: 36px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
    background: ${({ theme }) => theme.colors.background.base};
    color: ${({ theme }) => theme.colors.grayscale.g300};
    font-size: 0.875rem;
    outline: none;
    padding: 0 40px 0 20px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    &.selected {
        color: ${({ theme }) => theme.colors.grayscale.g20};
    }

    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.grayscale.g100};
    }

    option {
        background-color: ${({ theme }) => theme.colors.background.base};
    }

    ${({ $isFocused, theme }) =>
        $isFocused &&
        css`
        border: 1px solid ${theme.colors.primary.p500};
        background: ${theme.colors.primary.p100};
        color: ${theme.colors.primary.p700} !important;
        `}
`;

const ArrowIconWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    pointer-events: none;

    svg {
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

function SelectBox({ options, value, onChange }) {
    const [focused, setFocused] = useState(false);

    return (
        <SelectWrapper>
            <StyledSelect
                $isFocused={focused}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setFocused(false);
                    e.target.blur();
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={value && value !== '' ? 'selected' : null}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))}
            </StyledSelect>

            <ArrowIconWrapper $isFocused={focused}>
                <Icon.Arrow size="xxs" direction="bottom" />
            </ArrowIconWrapper>
        </SelectWrapper>
    );
}


export default SelectBox;
