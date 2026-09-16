import styled, { css } from "styled-components";

const baseStyle = css`
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '8px')};
`;

const unfillBaseStyle = css`
    background-color: transparent !important;

    .leftIcon, .rightIcon {
        ${({ $size }) => iconSizeStyles[$size || 'md']};
        ${({ theme }) => theme.mixins.flex('center', 'center')};
    }

    &:active {
        background-color: ${({ theme }) => theme.colors.grayscale.g50} !important;
        color: ${({ theme }) => theme.colors.primary.p800} !important;

        .leftIcon, .rightIcon {
            filter: invert(7%) sepia(69%) saturate(6281%) hue-rotate(236deg) brightness(101%) contrast(98%);
        }
    }
`;

const variantStyles = {
    fill: css`
        background-color: ${({ theme }) => theme.colors.primary.p500} !important;
        color: ${({ theme }) => theme.colors.white} !important;
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary.p600} !important;
        }
        &:active {
            background-color: ${({ theme }) => theme.colors.primary.p800} !important;
        }
    `,
    unfill: css`
        ${unfillBaseStyle}
        color: ${({ theme }) => theme.colors.grayscale.g500};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g25} !important;
        }
    `,
    unfill_light: css`
        ${unfillBaseStyle}
        color: ${({ theme }) => theme.colors.grayscale.g200};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g25} !important;
            color: ${({ theme }) => theme.colors.grayscale.g500};
        }
    `,
    outline: css`
        background-color: ${({ theme }) => theme.colors.white};
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g100} !important;
        color: ${({ theme }) => theme.colors.grayscale.g600};

        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g50};
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g100} !important;
            color: ${({ theme }) => theme.colors.primary.p500};
        }

        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g100};
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g300} !important;
            color: ${({ theme }) => theme.colors.primary.p800};
        }
    `,
    line: css`
        background-color: ${({ theme }) => theme.colors.white} !important;
        color: ${({ theme }) => theme.colors.grayscale.g600} !important;
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g100} !important;
        &:hover {
            background-color: ${({ theme }) => theme.colors.grayscale.g50} !important;
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
        }
        &:active {
            background-color: ${({ theme }) => theme.colors.grayscale.g75} !important;
        }
        &:disabled {
            background-color: ${({ theme }) => theme.colors.grayscale.g700} !important;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g400} !important;
        }
    `,
};

const sizeStyles = {
    xxxl: css`
        height: 3.5rem !important;
        font-size: 1rem !important;
        border-radius: 0.5rem !important;
        padding: 0 2rem !important;
    `,
    md: css`
        height: 2.5rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.25rem !important;
        padding: 0.25rem 0.375rem !important;
    `,
    sm: css`
        height: 2.25rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.375rem !important;
        padding: 0 1rem !important;
    `,
    xs: css`
        height: 2rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.5rem !important;
        padding: 0 1.25rem !important;
    `,
    xxs: css`
        height: 1.75rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.25rem !important;
        padding: 0.25rem 0.375rem !important;
    `,
};

const iconSizeStyles = {
    xxs: css`
        width: 0.75rem !important;
        height: 0.75rem !important;
    `,
}

const StyledButton = styled.button`
    ${baseStyle}
    ${({ $variant }) => variantStyles[$variant || "primary"]}
    ${({ $size }) => sizeStyles[$size || 'md']}
    ${({ disabled }) =>
        disabled &&
        css`
            color: ${({ theme }) => theme.colors.grayscale.g400} !important;
            background: ${({ theme }) => theme.colors.grayscale.g700} !important;
            cursor: not-allowed;
            pointer-events: none;
            
            &:hover,
            &:active {
                background: ${({ theme }) => theme.colors.grayscale.g700} !important;
                color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                filter: none !important;
            }
        `};
    `;

    function Button({
        children,
        onClick,
        type = "button",
        variant = "primary",
        size = "md",
        disabled = false,
        leftIcon,
        rightIcon,
        className = "",
        id ="",
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
        >
            {leftIcon ? <i className="leftIcon">{leftIcon}</i> : ""}
            {children}
            {rightIcon ? <i className="rightIcon">{rightIcon}</i> : ""}
        </StyledButton>
    );
}

export default Button;
