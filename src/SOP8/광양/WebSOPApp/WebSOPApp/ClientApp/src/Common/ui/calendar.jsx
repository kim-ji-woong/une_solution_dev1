import React, { useEffect, useRef, useState } from 'react';
import { styled } from "styled-components";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function DateCalendar(props) {
    const [value, onChange] = useState(new Date());
    const prevValueState = useRef(value);

    useEffect(() => {
        if (value !== prevValueState.current) {
            props.onClickDate(value);
            prevValueState.current = value;
        }
    }, [value]);

    return (
        <CalendarComponent 
            onChange={onChange}
            value={props.selectedDate}
            showNeighboringMonth={false}    
        />
    );
}

export const CalendarComponent = styled(Calendar)`
    width: 280px;
    max-width: 280px;
    background-color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    font-family: inherit;

    & * {
        font-size: 13px;
        box-sizing: border-box;
        color: #212121;
    }

    .react-calendar__navigation {
        display: flex;
        height: 36px;
        margin-bottom: 12px;
        align-items: center;
    }

    .react-calendar__navigation button {
        min-width: 28px;
        background: transparent;
        border-radius: 6px;
        font-size: 15px;
        color: ${({ theme }) => theme.colors.primary.p500};
        padding: 0 4px;
    }

    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus-visible {
        background-color: ${({ theme }) => theme.colors.primary.p500}22;
    }

    .react-calendar__navigation button:enabled:focus:not(:focus-visible) {
        background-color: transparent;
    }

    .react-calendar__navigation button:disabled {
        color: #c5c5c5;
        background: transparent;
    }

    .react-calendar__navigation__label,
    .react-calendar__navigation__label__labelText {
        font-weight: 700;
        font-size: 15px;
        color: ${({ theme }) => theme.colors.primary.p500} !important;
        letter-spacing: -0.3px;
    }

    .react-calendar__month-view__weekdays {
        text-align: center;
        text-transform: none;
        font-weight: 500;
        margin-bottom: 4px;

        abbr {
            text-decoration: none;
            color: #9e9e9e;
            font-size: 12px;
        }
    }

    .react-calendar__month-view__days__day {
        color: #212121;
        abbr { font-size: 12px; }
    }

    .react-calendar__month-view__days__day--neighboringMonth {
        abbr { color: #c5c5c5; }
    }

    .react-calendar__tile {
        padding: 8px 4px;
        border-radius: 50%;
        line-height: 1.4;
        color: #212121;

        &:enabled:hover,
        &:enabled:focus {
            background-color: #e8f0fe;
        }
    }

    .react-calendar__year-view .react-calendar__tile,
    .react-calendar__decade-view .react-calendar__tile,
    .react-calendar__century-view .react-calendar__tile {
        padding: 1em 0.5em;
        border-radius: 8px;
    }

    .react-calendar__tile--now {
        background-color: #e8e8e8;
        border-radius: 50%;

        abbr {
            color: #212121;
            font-weight: 400;
        }

        &:hover { background-color: #d8d8d8; }
    }

    .react-calendar__tile--hasActive {
        background-color: transparent;

        abbr { color: ${({ theme }) => theme.colors.primary.p500}; font-weight: 700; }

        &:enabled:hover,
        &:enabled:focus { background-color: #e8f0fe; }
    }

    .react-calendar__tile--active {
        background-color: transparent;

        abbr { color: ${({ theme }) => theme.colors.primary.p500}; font-weight: 700; }

        &:enabled:hover,
        &:enabled:focus { background-color: #e8f0fe; }
    }
`;