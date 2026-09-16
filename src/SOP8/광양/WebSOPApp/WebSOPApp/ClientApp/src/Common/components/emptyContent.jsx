import React from 'react';
import styled from 'styled-components';
import Icon from './Icon/Icon';

const BaseNoData = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const IconWrapper = styled.div`
    width: 100px !important;
    height: 100px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.05) !important;
    margin-bottom: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
`;

const PageNoData = styled(BaseNoData)`
    &.content {
        width: 100%;
        height: 100%;
    }

    .title {
        font-size: 1rem !important;
        color: ${({ theme }) => theme.colors.grayscale.g20} !important;
        letter-spacing: -0.48px !important;
        margin-bottom: 8px !important;
    }

    .description {
        font-size: 0.75rem !important;
        color: ${({ theme }) => theme.colors.grayscale.g200} !important;
        line-height: 170% !important;
        letter-spacing: -0.36px !important;
        margin-bottom: 12px !important;
    }

    button {
        font-size: 0.875rem;
        line-height: 172%;
        letter-spacing: -0.42px;
        border-radius: 4px;
        padding: 4px 6px;
        color: ${({ theme }) => theme.colors.primary.p500};
        background: transparent;
        border: none;
        cursor: pointer;

        &:hover {
            background: ${({ theme }) => theme.colors.grayscale.g25};
        }

        &:active {
            color: ${({ theme }) => theme.colors.primary.p800};
            background: ${({ theme }) => theme.colors.grayscale.g50};
        }
    }
`;

const ListNoData = styled.ul`
    height: 100%;
    display: flex;

    li {
        flex: 1;
        display: flex;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        cursor: default !important;
        border-bottom: 0 !important;

        .title {
            font-size: 1.25rem !important;
            color: ${({ theme }) => theme.colors.grayscale.g20};
            line-height: 172%;
            letter-spacing: -0.6px;
            margin-bottom: 8px;
        }

        .description {
            font-size: 0.875rem;
            color: ${({ theme }) => theme.colors.grayscale.g200};
            line-height: 172%;
            letter-spacing: -0.42px;
        }

        &:hover {
            background-color: transparent;
        }
    }
`;

const SimpleNoData = styled(BaseNoData)`
    height: 100%;

    > div {
        width: 60px !important;
        height: 60px !important;
    }

    .title {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.grayscale.g20};
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
    }
`;

const PlainNodata = styled.div`
    height: 100%;
    ${({ theme }) => theme.mixins.flex('center', 'center', 'column', '4px')};

    > svg {
        margin-bottom: 4px;
    }

    > p {
        color: ${({ theme }) => theme.colors.grayscale.g400};
    }

    .description {
        font-size: 0.75rem !important;
    }
`;


const EmptyContent = ({
    title,
    description,
    action,
    layout = 'page', // page | list | simple | plain
}) => {
    if (layout === 'list') {
        return (
            <ListNoData className="noData noData--list">
                <li>
                    <IconWrapper>
                        <Icon.EmptyPaper />
                    </IconWrapper>
                    <p className="title">{title}</p>
                    {description && (
                        <p className="description">{description}</p>
                    )}
                </li>
            </ListNoData>
        );
    }

    if (layout === 'simple') {
        return (
            <SimpleNoData className="noData noData--simple">
                <IconWrapper>
                    <Icon.EmptyPaper width='40' height='40' />
                </IconWrapper>
                <p className="title">{title}</p>
            </SimpleNoData>
        );
    }

    if (layout === 'plain') {
        return (
            <PlainNodata>
                <Icon.InfoCircleIcon size='sm' fill='grayscale.g400' />
                <p className="title">{title}</p>
                {description && (
                    <p className="description">{description}</p>
                )}
            </PlainNodata>
        );
    }

    return (
        <PageNoData className="content noData noData--page">
            <IconWrapper>
                <Icon.EmptyPaper />
            </IconWrapper>
            <p className="title">{title}</p>
            {description && (
                <p className="description">{description}</p>
            )}
            {action && (
                <button onClick={action.onClick}>
                    {action.label}
                </button>
            )}
        </PageNoData>
    );
};

export default EmptyContent;