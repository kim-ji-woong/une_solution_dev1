import styled from "styled-components";

export const SensorSimulatorComponent = styled.div`
    width: 100vw;
    height: 100vh;
    background: #202732;
    position: absolute;
    top: 0;
    left: 0;
    ${({ theme }) => theme.mixins.flex('center', 'center')};

    .sensorPopBox {
        width: 1120px;
    }

    .sensorText {
        font-size: 20px;
        font-weight: 700;
        line-height: 172%;
        letter-spacing: -0.6px;
        color: ${({ theme }) => theme.colors.white};
    }

    .sensorBoxTitle {
        margin-bottom: 20px;
    }

    .sensorTableArea {
        ${({ theme }) => theme.mixins.flex('flex-start', 'stretch', 'row', '20px')};

        > div {
            flex: 1;
        }
    }

    .tableWrap {
        ${({ theme }) => theme.mixins.flex('center', 'stretch', 'column', '20px')};
    }

    /* 왼쪽: 센서 리스트 */
    .sensorTable {
        display: flex;
        flex-direction: column;
        height: 520px;
        color: #ffffff;
    }

    .sensorListHeader {
        ${({ theme }) => theme.mixins.flex()};
        padding: 12px 16px;
        background: ${({ theme }) => theme.colors.background.surface};
        border-radius: 8px 8px 0 0;
        border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        flex-shrink: 0;

        > div {
            width: 197px;
        }
    }

    .sensorListTitle {
        font-size: 14px;
        font-weight: 500;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
    }

    .sensorTreeArea {
        background: ${({ theme }) => theme.colors.background.base};
        flex: 1;
        overflow-y: auto;
        ${({ theme }) => theme.mixins.scroll()};
        padding: 12px 16px;
    }

    .sensorTable input[type="checkbox"] { display: none; }
    .sensorTable input[type="checkbox"]:checked ~ ul { display: none; }
    .sensorTable input[type="checkbox"]:not(:checked) + label { color: ${({ theme }) => theme.colors.primary.p500}; }

    .sensorTable {
        label {
            font-size: 14px;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
        }
    }

    .firstTab {
        > li {
            > label {
                padding: 8px;
                border-bottom: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
            }
        }
    }

    .secondTab {
        > li {
            > label {
                padding: 8px 16px;
                border-bottom: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
            }
        }
    }

    .thirdTab {
        > li {
            > label {
                padding: 8px 24px;
                border-bottom: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
            }
        }
    }

    .fourthTab {
        > li {
            > label {
                padding: 8px 32px;
                border-bottom: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
            }
        }
    }

    .fifthTab {
        > li {
            padding: 4px 0 4px 40px;

            &:hover {
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.05);
            }

            > p {
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
                color: ${({ theme }) => theme.colors.grayscale.g50};
                ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '14px')};

                &::before {
                    content: '';
                    display: inline-block;
                    width: 2.5px;
                    height: 2.5px;
                    border-radius: 50%;
                    background-color: ${({ theme }) => theme.colors.grayscale.g50};
                }
            }
        }
    }

    .sensorTable *:before {
        width: 17px;
        height: 20px;
        display: inline-block;
    }

    .sensorName { font-size: 12px; }
    .sensorName label { cursor: pointer; }
    .selected > label { color: ${({ theme }) => theme.colors.primary.p500}; }
    .selectedArea { background-color: #d7d7d76b; }

    /* 오른쪽: 알람 테이블 */
    .alarmTable {
        display: flex;
        flex-direction: column;
        height: 520px;
        color: #ffffff;
        border: solid 1px rgba(255, 255, 255, 0.10);
        border-radius: 6px;
        background: ${({ theme }) => theme.colors.background.base};
        overflow: hidden;
    }

    .alarmTableScroll {
        flex: 1;
        overflow-y: auto;
        ${({ theme }) => theme.mixins.scroll()};
    }

    .alarmTable table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .alarmTable thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .alarmTable tr {
        font-weight: 100;
        font-size: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        background: rgba(255, 255, 255, 0.05);
    }

    .alarmTable tbody tr td {
        padding: 10px 5px;
        border-right: 1px solid rgba(255, 255, 255, 0.10);
        max-width: 0;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .alarmTable tbody tr:hover {
        background-color: #d7d7d72b;
    }

    .alarmTable th {
        font-size: 14px;
        font-weight: 500;
        padding: 10px 0;
        text-align: center;
        color: #fff;
        background: #2B313C;
        border-right: 1px solid #40454F;
    }

    .alarmTable td {
        text-align: center;
        cursor: pointer;
    }

    /* 버튼 영역 */
    .buttonWrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
    }
`;
