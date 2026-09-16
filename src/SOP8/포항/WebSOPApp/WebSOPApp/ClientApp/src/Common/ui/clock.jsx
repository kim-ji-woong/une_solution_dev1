import React, { useState, useEffect } from 'react';

function Clock() {
    const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];
    const [date, setdate] = useState(new Date());
    let displayTime = "-";

    useEffect(() => {
        const intervalId = setInterval(() => {
            setdate(new Date());
        }, 1000);

        // 컴포넌트가 언마운트될 때 타이머 정리
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    if (month < 10)
        month = "0" + month;

    let day = date.getDate();
    if (day < 10)
        day = "0" + day;

    const dayString = arrDayStr[date.getDay()];

    let unit = "오전";
    let hours = date.getHours();
    if (hours < 10)
        hours = "0" + hours;
    else if (hours > 11) {
        unit = "오후";

        if (hours > 12) {
            hours = hours - 12;
    
            if (hours < 10) {
                hours = "0" + hours;
            }
        }
    }

    let minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    let seconds = date.getSeconds();
    if (seconds < 10)
        seconds = "0" + seconds;

    displayTime = year + "-" + month + "-" + day + "(" + dayString + ") " + unit + " " + hours + ":" + minutes + ":" + seconds;

    return (
        <p>{displayTime}</p>
    );
}

export default Clock;