import styled from 'styled-components';
import AccountResource from '../../Account/resource/id';
import searchIcon from '../../Account/images/searchIcon.svg';
import select_arrow_on from '../../Settings/images/select_arrow.svg';

export const EquipmentManagerComponent = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.background.elevated};
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 50px;
    ${({ theme }) => theme.mixins.flex()};

    .menuWrap {
        width: 280px;
        flex-shrink: 0;
        height: calc(100vh - 50px);
        background-color: ${({ theme }) => theme.colors.background.surface};
        ${({ theme }) => theme.mixins.flex('flex-start', 'center')};
        flex-direction: column;

        > p {
            width: 100%;
            font-size: 1rem;
            font-weight: 500;
            line-height: 172%; /* 27.52px */
            letter-spacing: -0.48px;
            padding: 16px 20px;
            border-bottom: 1px solid #29313E;
            cursor: pointer;
            
            &.on {
                background-color: ${({ theme }) => theme.colors.primary.p500};
            }
        }
    }
`;

export const EquipmentListComponent = styled.div`
    flex: 1;
    min-width: 0;
    padding: 40px;
    height: calc(100vh - 50px);
    ${({ theme }) => theme.mixins.flex()};
    flex-direction: column;

    input[type=checkbox] {
        width: 16px;
        height: 16px;
    }

    .titleWrap {
        width: 100%;
        padding: 0 12px;
        ${({ theme }) => theme.mixins.flex()};
        gap: 16px;

        > p {
            font-size: 1.25rem; 
            font-weight: 500;
            line-height: 172%; /* 34.4px */
            letter-spacing: -0.6px;
            color: ${({ theme }) => theme.colors.primary.p400};
        }

        .sctRht{
            display: flex;
            align-items: center;
        }
    
        .searchWrap {
            height: 32px;
            position: relative;
            padding-right: 30px;
            margin: 12px 0;
    
            input {
                display: block;
                width: 448px;
                height: 32px !important;
                background: none;
                color: ${({ theme }) => theme.colors.white};
                font-size: 0.75rem;
                border-radius: 8px 0 0 8px;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                border-right: 0;
                position: absolute;
                right: 30px;
                top: 0;
                padding: 0;
                padding-left: 10px;
            }
    
            button {
                display: block;
                width: 32px;
                height: 32px;
                position: absolute;
                right: 0;
                top: 0;
                text-indent: -9999px;
                background: ${({ theme }) => theme.colors.primary.p500} url(${searchIcon}) no-repeat center center;
                border-radius: 0 4px 4px 0;
                border: 1px solid ${({ theme }) => theme.colors.primary.p500}; 
            }
        }
    
        .sctBtn{
            height: 32px;
            padding: 0 16px;
            border-radius: 6px;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g400};
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            color: ${({ theme }) => theme.colors.grayscale.g100};
            ${({ theme }) => theme.mixins.flex('center', 'center')};
            cursor: pointer;
            margin-left: 8px;
    
            &:hover {
                border: 1px solid ${({ theme }) => theme.colors.primary.p500}; 
                background: ${({ theme }) => theme.colors.primary.p25}; 
                box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
                color: ${({ theme }) => theme.colors.primary.p500}; 
            }
    
            &:active {
                border: 1px solid ${({ theme }) => theme.colors.primary.p800}; 
                background: ${({ theme }) => theme.colors.primary.p60}; 
                color: ${({ theme }) => theme.colors.primary.p800}; 
            }
    
            /* &:focus {
                border: 1px solid ${({ theme }) => theme.colors.primary.p700}; 
                background: ${({ theme }) => theme.colors.primary.p50}; 
                color: ${({ theme }) => theme.colors.primary.p700}; 
            } */
    
            &:disabled {
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g600};
                color: ${({ theme }) => theme.colors.grayscale.g700}; 
                pointer-events: none;
            }
        }
    }

    .listWrap {
        flex: 1;
        width: 100%;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.colors.background.surface};
        overflow: hidden;

        & * {
            font-size: 0.875rem;
        }

        .tableScrollX {
            width: 100%;
            height: 100%;
            overflow-x: auto;
            overflow-y: visible;
            ${({ theme }) => theme.mixins.scroll('x')};
            ${({ theme }) => theme.mixins.scroll('y')};
        }

        .head {
            position: sticky;
            top: 0;
            z-index: 2;
            width: 100%;
            background: #2A3344;
            ${({ theme }) => theme.mixins.flex()};

            &::after {
                content: '';
                width: 4px;
                height: 34px;
                background-color: #2A3344;
                position: absolute;
                right: 40px;
            }

            > div {
                ${({ theme }) => theme.mixins.flex('center', 'center', 'row', '5px')};

                &:not(:last-child) {
                    border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                }

                height: 34px;
                line-height: 33px;
                text-align: center;
                color: ${({ theme }) => theme.colors.grayscale.g200};

                > span {
                    color: inherit;
                }

                button {
                    color: ${({ theme }) => theme.colors.grayscale.g200};
                }

                svg, path {
                    color: inherit;
                    fill: currentColor;
                }
            }
        }

        .body {
            background-color: ${({ theme }) => theme.colors.background.surface};
            flex: 1;
            overflow-y: visible;
            height: calc(100% - 34px);

            ${({ theme }) => theme.mixins.scroll()};

            ul {
                li:has(textarea) {
                    z-index: 50;
                }

                li:has(.react-datepicker__tab-loop) {
                    z-index: 50;
                }

                li {
                    ${({ theme }) => theme.mixins.flex()};
                    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                    cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' };
                    position: relative;
                    z-index: 1;

                    &.colorOn {
                        
                        > div {

                            > span {
                                color: ${({ theme }) => theme.colors.primary.p400};
                            }
                        }
                    }

                    > div {
                        height: 40px;
                        ${({ theme }) => theme.mixins.flex('center', 'center')};
                        border-right: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
                        padding: 4px;
                        display: flex;
                        align-items: center;

                        &:not(:nth-child(2), :nth-child(3)) {
                            cursor: ${(props) => (props.$userLevel === AccountResource.accountLevelNo.master || props.$userLevel === AccountResource.accountLevelNo.admin) ? 'pointer' : 'default' } !important;
                            width: 100%;
                        }

                        > span {
                            ${({ theme }) => theme.mixins.textEllipsis()};
                            width: 100%;
                            text-align: center;
                        }
                    }

                    div {
                        input[type=text] {
                            height: 32px;
                            text-align: left;
                            border-radius: 8px;
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                            background: ${({ theme }) => theme.colors.background.base};
                        }

                        select {
                            appearance: none;
                            width: 100%;
                            height: 32px;
                            line-height: 100%;
                            color: ${({ theme }) => theme.colors.white};
                            border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                            border-radius: 8px;
                            cursor: pointer;
                            background: ${({ theme }) => theme.colors.background.base} url(${select_arrow_on}) 90% 49% no-repeat;
                            font-size: 0.875rem !important;
                            padding: 0 4px 0 10px;
                        }
                    }

                    .datepicker {
                        position: relative;
                        width: 100%;
                        height: 32px;
                        border-radius: 8px;
                        border: 1px solid ${({ theme }) => theme.colors.grayscale.g700};
                        background: ${({ theme }) => theme.colors.background.base};
                        overflow: visible !important;
                        padding-left: 20px;
                
                        input[type="text"] {
                            display: block;
                            width: 100%;
                            background: transparent;
                            font-size: 0.875rem;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            border: none;
                            padding: 0;
                        }
                        
                        .react-datepicker{
                            font-size: 0.625rem;
                        }
                    
                        .react-datepicker-popper {
                            transform: translate3d(0, 32px, 0px) !important;
                        }
                    
                        .react-datepicker__header {
                            text-align: center;
                            background-color: #f0f0f0;
                            border-bottom: 1px solid #aeaeae;
                            border-top-left-radius: 0.3rem;
                            padding: 12px 8px;
                            position: relative;
                    
                            .react-datepicker__current-month{
                                margin-top: 0;
                                color: ${({ theme }) => theme.colors.black};
                                font-weight: bold;
                                font-size: 0.8125rem;
                                margin-bottom: 4px;
                            }
                        }
                    
                        .react-datepicker__day-name{
                            color: ${({ theme }) => theme.colors.black};
                            display: inline-block;
                            width: 2.2rem;
                            line-height: 2.0rem;
                            text-align: center;
                            margin: 0.4rem;
                            font-size: 0.75rem;
                        }
                    
                        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
                            color: ${({ theme }) => theme.colors.black};
                            display: inline-block;
                            width: 2.2rem;
                            line-height: 2.0rem;
                            text-align: center;
                            margin: 0.4rem;
                            font-size: 0.75rem;
                        }
                    
                        .react-datepicker__day--selected,
                        .react-datepicker__day--in-selecting-range,
                        .react-datepicker__day--in-range,
                        .react-datepicker__month-text--selected,
                        .react-datepicker__month-text--in-selecting-range,
                        .react-datepicker__month-text--in-range,
                        .react-datepicker__quarter-text--selected,
                        .react-datepicker__quarter-text--in-selecting-range,
                        .react-datepicker__quarter-text--in-range,
                        .react-datepicker__year-text--selected,
                        .react-datepicker__year-text--in-selecting-range,
                        .react-datepicker__year-text--in-range {
                            border-radius: 0.3rem;
                            background: ${({ theme }) => theme.colors.primary.p500};
                            color: ${({ theme }) => theme.colors.white} !important;
                        }
                    }
                
                    .btnCalendarBk {
                        width: 17px;
                        height: 18px;
                        display: inline-block;
                        position: absolute;
                        right: 20px;
                        top: 50%;
                        transform: translate(0, -50%);
                        cursor: pointer;
                    }
                }

                &.noData {
                    li {
                        &:hover {
                            background-color: transparent;
                        }
                    }
                }
            }
        }

        .list {
            width: max-content;
            min-width: 100%;
            height: 100%;

            .head > div, 
            .body > ul > li > div {
                ${({ theme }) => theme.mixins.textEllipsis()};

                &:nth-of-type(1) {
                    width: 50px;
                    display: flex; 
                    justify-content: center;
                    align-items: center;
                }

                &:nth-of-type(2) {
                    width: 50px;
                }

                &:nth-of-type(3) {
                    width: 240px;
                }

                &:nth-of-type(4) {
                    width: 180px;
                }

                &:nth-of-type(5) {
                    width: 97px;
                }

                &:nth-of-type(6) {
                    width: 240px;
                }

                &:nth-of-type(7) {
                    width: 240px;
                }

                &:nth-of-type(8) {
                    width: 240px;
                }

                &:nth-of-type(9) {
                    width: 400px;
                }

                &:nth-of-type(10) {
                    width: 180px;
                }

                &:nth-of-type(11) {
                    width: 180px;
                }

                &:nth-of-type(12) {
                    width: 180px;
                }

                &:nth-of-type(13) {
                    width: 240px;
                }
            }
        }
    }
`;