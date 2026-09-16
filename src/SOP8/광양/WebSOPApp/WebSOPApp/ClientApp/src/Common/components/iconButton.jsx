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

        &:disabled {
            background-color: ${({ theme }) => theme.colors.grayscale.g700};
            color: ${({ theme }) => theme.colors.grayscale.g500};
            cursor: default;
        }

        &.selected {
            background-color: ${({ theme }) => theme.colors.primary.p500};
            border: 2px solid ${({ theme }) => theme.colors.primary.p200};
            color: ${({ theme }) => theme.colors.grayscale.g10};
        }
    `,
    unfill: css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.grayscale.g300};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 4px 11px 0 rgba(0, 0, 0, 0.11);
            color: ${({ theme }) => theme.colors.grayscale.g100};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g900};
            color: ${({ theme }) => theme.colors.primary.p400};
        }

        &:disabled {
            background-color: transparent;
            color: ${({ theme }) => theme.colors.grayscale.g500};
            cursor: default;
        }

        &.selected {
            background-color: ${({ theme }) => theme.colors.grayscale.g800};
            border: 2px solid ${({ theme }) => theme.colors.primary.p200};
            color: ${({ theme }) => theme.colors.primary.p500};
        }
    `
};

const sizeStyles = {
    xxs: css`
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        svg { width: 1rem; height: 1rem; }
    `,
    xs: css`
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 0.25rem;
        svg { width: 1rem; height: 1rem; }
    `,
    sm: css`
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        svg { width: 1rem; height: 1rem; }
    `,
    md: css`
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.375rem;
        svg { width: 1.25rem; height: 1.25rem; }
    `, 
    lg: css`
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        svg { width: 1.5rem; height: 1.5rem; }
    `, 
};

const shapeStyle = ({ $shape }) =>
    $shape === "circle" ? css`border-radius: 50%;` : css``;

const StyledIconButton = styled.button`
    ${baseStyle}
    ${({ $variant }) => variantStyles[$variant || "unfill"]}
    ${({ $size }) => sizeStyles[$size || "md"]}
    ${shapeStyle}
`;

function IconButton({
    icon,
    onClick,
    type = "button",
    variant = "unfill",
    size = "md",
    shape = "rounded", // "rounded" | "circle"
    disabled = false,
    className = "",
    id = "",
}) {
    return (
        <StyledIconButton
            type={type}
            onClick={onClick}
            $variant={variant}
            $size={size}
            $shape={shape}
            disabled={disabled}
            className={className}
            id={id}
        >
            {icon}
        </StyledIconButton>
    );
}

export default IconButton;