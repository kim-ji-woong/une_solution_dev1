import React, { useState, useEffect } from 'react';

function Clock() {
    const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];
    const [date, setDate] = useState(new Date());
    let displayTime = "-";

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;

    const dayString = arrDayStr[date.getDay()];

    let hours = date.getHours();
    if (hours < 10) hours = "0" + hours;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;

    let seconds = date.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;

    displayTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    // displayTime = `${year}-${month}-${day}(${dayString}) ${hours}:${minutes}:${seconds}`;

    return <p>{displayTime}</p>;
}

export default Clock;