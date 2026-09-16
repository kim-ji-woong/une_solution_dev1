import styled, { css } from "styled-components";

const baseStyle = css`
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    
    i {
        ${({ theme }) => theme.mixins.flex('center', 'center')};
    }
`;

const variantStyles = {
    fill: css`
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.white};
        
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.p600};
        }
        &:active {
            background-color: ${({ theme }) => theme.colors.primary.p800};
        }
    `,
    unfill: css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.grayscale.g500};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g50};
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
            color: ${({ theme }) => theme.colors.primary.p500};
        }
        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g100};
            color: ${({ theme }) => theme.colors.primary.p800};
        }
    `,
    unfill_white: css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.white};

        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.p600};
            /* box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08); */
        }
        &:active {
            background-color: ${({ theme }) => theme.colors.primary.p800};
        }
    `,
};

const sizeStyles = {
    xxxs: css`
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 63rem;
        i { width: 0.5; height: 0.5rem; }
    `,
    xxs: css`
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        i { width: 1rem; height: 1rem; }
    `,
    sm: css`
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        i { width: 1.25rem; height: 1.25rem; }
    `,
    md: css`
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.375rem;
        i { width: 1.25rem; height: 1.25rem; }
    `, 
};

const StyledIconButton = styled.button`
    ${baseStyle}
    ${({ $variant }) => variantStyles[$variant || "unfill"]}
    ${({ $size }) => sizeStyles[$size || "md"]}

    ${({ disabled }) =>
        disabled &&
        css`
            svg {
                fill: ${({ theme }) => theme.colors.grayscale.g100} !important;
                color: ${({ theme }) => theme.colors.grayscale.g100} !important;
            }
            cursor: not-allowed;
            pointer-events: none;

            &:hover,
            &:active {
                fill: ${({ theme }) => theme.colors.grayscale.g100} !important;
                color: ${({ theme }) => theme.colors.grayscale.g100} !important;
            }
        `}
    
    &.selected {
        background-color: ${({ theme }) => theme.colors.grayscale.g100};
        color: ${({ theme }) => theme.colors.primary.p800};
    }

    /* xxs(24px) 전용 disabled 스타일 */
    ${({ disabled, $size }) =>
        disabled && $size === "xxs" &&
        css`
            svg {
                fill: ${({ theme }) => theme.colors.grayscale.g800} !important;
                color: ${({ theme }) => theme.colors.grayscale.g800} !important;
            }
            &:hover,
            &:active {
                fill: ${({ theme }) => theme.colors.grayscale.g800} !important;
                color: ${({ theme }) => theme.colors.grayscale.g800} !important;
            }
        `}

    i, svg {
        color: inherit;
        fill: currentColor;
    }
`;

function IconButton({
    icon,
    onClick,
    type = "button",
    variant = "unfill",
    size = "md",
    disabled = false,
    className = "",
}) {
    return (
        <StyledIconButton
            type={type}
            onClick={onClick}
            $variant={variant}
            $size={size}
            disabled={disabled}
            className={className}
        >
            {icon}
        </StyledIconButton>
    );
}

export default IconButton;