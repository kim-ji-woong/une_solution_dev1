import styled, { css } from "styled-components";

const baseStyle = css`
    white-space: nowrap;
    transition: all 0.2s;
    border: none;

    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '4px')};
`;

const variantStyles = {
    fill: css`
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.grayscale.g10};

        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.p400};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.primary.p600};
        }

        &:focus {
            border: none;
        }

        &.selected {
            background-color: ${({ theme }) => theme.colors.primary.p500};
            border: 2px solid ${({ theme }) => theme.colors.primary.p200};
        }

        &:disabled {
            background-color: ${({ theme }) => theme.colors.grayscale.g700};
            color: ${({ theme }) => theme.colors.grayscale.g500};
            cursor: default;
        }
    `,
    line: css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary.p500};
        border: 1px solid ${({ theme }) => theme.colors.primary.p500};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
            color: ${({ theme }) => theme.colors.primary.p400};
            border: 1px solid ${({ theme }) => theme.colors.primary.p400};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g900};
            color: ${({ theme }) => theme.colors.primary.p600};
            border: 1px solid ${({ theme }) => theme.colors.primary.p600};
        }

        &:focus {
            border: 1px solid ${({ theme }) => theme.colors.primary.p500};
        }

        &.selected {
            color: ${({ theme }) => theme.colors.primary.p500};
            border: 2px solid ${({ theme }) => theme.colors.primary.p200};
        }

        &:disabled {
            background-color: transparent !important;
            color: ${({ theme }) => theme.colors.grayscale.g600} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g600} !important;
            cursor: default !important;
        }
    `,
    ghost: css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.grayscale.g300};
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
            color: ${({ theme }) => theme.colors.grayscale.g100};
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g900};
            color: ${({ theme }) => theme.colors.primary.p400};
            border: 1px solid ${({ theme }) => theme.colors.primary.p400};
        }

        &:focus {
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
        }

        &.selected {
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
            color: ${({ theme }) => theme.colors.primary.p500};
            border: 2px solid ${({ theme }) => theme.colors.primary.p500};
        }

        &:disabled {
            background-color: transparent !important;
            color: ${({ theme }) => theme.colors.grayscale.g600} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g500} !important;
            cursor: default !important;
        }
    `
};

const sizeStyles = {
    xxs: css`
        height: 1.75rem !important;
        border-radius: 0.25rem !important;
        padding: 0 0.5rem !important;
        font-size: 0.75rem !important;
        line-height: 170% !important;
        letter-spacing: -0.0225rem !important;
        svg { width: 1rem !important; height: 1rem !important; }
    `,
    xs: css`
        height: 2rem !important;
        border-radius: 0.25rem !important;
        padding: 0 0.75rem !important;
        font-size: 0.875rem !important;
        line-height: 172% !important;
        letter-spacing: -0.02625rem !important;
        svg { width: 1rem !important; height: 1rem !important; }
    `,
    sm: css`
        height: 2.25rem !important;
        border-radius: 0.375rem !important;
        padding: 0 0.75rem !important;
        font-size: 0.875rem !important;
        line-height: 172% !important;
        letter-spacing: -0.02625rem !important;
        svg { width: 1.25rem !important; height: 1.25rem !important; }
    `,
    md: css`
        height: 2.5rem !important;
        border-radius: 0.375rem !important;
        padding: 0 1rem !important;
        font-size: 1rem !important;
        line-height: 172% !important;
        letter-spacing: -0.03rem !important;
        svg { width: 1.25rem !important; height: 1.25rem !important; }
    `,
    lg: css`
        height: 2.75rem !important;
        border-radius: 0.5rem !important;
        padding: 0 1rem !important; 
        font-size: 1rem !important;
        line-height: 172% !important;
        letter-spacing: -0.03rem !important;
        svg { width: 1.25rem !important; height: 1.25rem !important; }
    `,
    xl: css`
        height: 3.5rem !important;
        border-radius: 0.5rem !important;
        padding: 0 1.25rem !important;
        font-size: 1rem !important;
        font-size: 1rem !important;
        line-height: 172% !important;
        letter-spacing: -0.03rem !important;
        svg { width: 1.5rem !important; height: 1.5rem !important; }
    `,
};

const StyledButton = styled.button`
    ${baseStyle}
    ${({ $variant }) => variantStyles[$variant || "fill"]}
    ${({ $size }) => sizeStyles[$size || 'md']}
    ${({ $fullWidth }) => $fullWidth && css` width: 100%; `}
`;

function BoxButton({
    children,
    onClick,
    type = "button",
    variant = "fill",
    size = "md",
    disabled = false,
    leftIcon,
    rightIcon,
    className = "",
    id ="",
    isActive = false,
    fullWidth = false,
}) {
    return (
        <StyledButton
            type={type}
            onClick={onClick}
            $variant={variant}
            $size={size}
            disabled={disabled}
            className={className}
            id={id}
            $isActive={isActive}
            $fullWidth={fullWidth}
        >
            {leftIcon ? leftIcon : ""}
            {children}
            {rightIcon ? rightIcon : ""}
        </StyledButton>
    );
}

export default BoxButton;
