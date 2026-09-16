import styled, { css } from "styled-components";

const baseStyle = css`
    transition: all 0.2s;
    border: none;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
`;

const variantStyles = {
    unfill: css`
        color: ${({ theme }) => theme.colors.grayscale.g50};

        &:hover {
            color: ${({ theme }) => theme.colors.primary.p400};
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p600};
            background-color: ${({ theme }) => theme.colors.grayscale.g900};
        }
        
        &.selected {
            background-color: transparent;
            color: ${({ theme }) => theme.colors.primary.p500};
        }

        &:disabled {
            background-color: transparent;
            color: ${({ theme }) => theme.colors.grayscale.g500};
            cursor: default;
        }
    `,
    unfill_p: css`
        color: ${({ theme }) => theme.colors.primary.p500};

        &:hover {
            color: ${({ theme }) => theme.colors.primary.p400};
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p600};
            background-color: ${({ theme }) => theme.colors.grayscale.g900};
        }
        
        &.selected {
            background-color: transparent;
            color: ${({ theme }) => theme.colors.primary.p500};
        }

        &:disabled {
            background-color: transparent;
            color: ${({ theme }) => theme.colors.grayscale.g500};
            cursor: default;
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
    ${({ $variant }) => variantStyles[$variant || "unfill"]}
    ${({ $size }) => sizeStyles[$size || 'md']}
    ${({ $fullWidth }) => $fullWidth && css` width: 100%; `}
`;

function TextButton({
    children,
    onClick,
    type = "button",
    variant = "unfill",
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

export default TextButton;