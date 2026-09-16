import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import ProjectResource from '../../../Root/resource/id';

import { BeginOptionComponent } from '../../styled/sopPopupStyled';

function BeginOption(props) {
    const [isCurrent, setIsCurrent] = useState(true);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [day, setDay] = useState(null);
    const [hour, setHour] = useState(null);
    const [min, setMin] = useState(null);
    const [sec, setSec] = useState(null);

    useEffect(() => {
        //getDisasterCategories()
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
        $('.sqpDown').css({ 'color': '#000000' });
         //각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        $('#sqpRdo01').click(function () {
            $('.sqpSelectBox').css({ background: '#0D121A' });
            $('.sqpSelectBox').addClass("pointerEventsOff");
            $('.sqpSelectBox').removeClass("pointerEventsOn");
        });

        $('#sqpRdo02').click(function () {
            $('.sqpSelectBox').css({ background: '#fff' });
            $('.sqpSelectBox').addClass("pointerEventsOn");
            $('.sqpSelectBox').removeClass("pointerEventsOff");
        });

        setCurrentDate();
    }, [])

    const setCurrentDate = () => {
        const now = new Date();

        const newYear = now.getFullYear();
        const newMonth = now.getMonth();
        const newDay = now.getDate();
        const newHour = now.getHours();
        const newMin = now.getMinutes();
        const newSec = now.getSeconds();

        setYear(newYear);
        setMonth(newMonth);
        setDay(newDay);
        setHour(newHour);
        setMin(newMin);
        setSec(newSec);
    }

    const onChangeTimeMode = (isCurrent) => {
        if (isCurrent) {
            setCurrentDate();
        }

        setIsCurrent(isCurrent);
    }

    const setDateTime = () => {
        if (year === null) {
            return [[], [], [], [], []];
        }

        let yearTag = [];        
        for (let i = year - 1; i <= year + 1; i++) {

            if (year === i) {
                yearTag.push(<option key={'year_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                yearTag.push(<option key={'year_' + i} value={i}>{i}</option>);
            }
        }
        
        let monthTag = [];
        for (let i = 0; i <= 11; i++) {
            if (month === i) {
                monthTag.push(<option key={'month_' + i + 1} value={i} defaultValue>{i + 1}</option>);
            }
            else {
                monthTag.push(<option key={'month_' + i + 1} value={i}>{i + 1}</option>);
            }
        }
                
        const lastDay = new Date(year, month, 0).getDate();
        let dayTag = [];
        for (let i = 1; i <= lastDay; i++) {
            if (day === i) {
                dayTag.push(<option key={'day_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                dayTag.push(<option key={'day_' + i} value={i}>{i}</option>);
            }
        }

        let hourTag = [];
        for (let i = 0; i <= 23; i++) {
            if (hour === i) {
                hourTag.push(<option key={'hour_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                hourTag.push(<option key={'hour_' + i} value={i}>{i}</option>);
            }
        }

        let minTag = [];
        for (let i = 0; i <= 59; i++) {
            if (min === i) {
                minTag.push(<option key={'min_' + i} value={i} defaultValue>{i}</option>);
            }
            else {
                minTag.push(<option key={'min_' + i} value={i}>{i}</option>);
            }
        }

        return [yearTag, monthTag, dayTag, hourTag, minTag];
    }

    const onClickBegin = () => {

        const position = document.getElementById('txtPosition').value;
        if (!position || position.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['재난 발생 위치를 입력하세요.'], null, null);
            return;
        }
        else if (position.length > 50) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['재난 발생 위치 길이는 50자를 초과할 수 없습니다. (현재:' + position.length + ')'], null, null);
            return;
        }
        else {
            let beginTime = '';
            if (isCurrent) {
                //const now = new Date();

                //const year = now.getFullYear();
                //const month = now.getMonth();
                //const day = now.getDate();
                //const hour = now.getHours();
                //const min = now.getMinutes();
                //const sec = now.getSeconds();

                beginTime = null;//new Date(year, month, day, hour, min, sec);
            }
            else {
                beginTime = new Date(year, month, day, hour, min, 0);
            }

            props.beginSOP(beginTime, position);
        }
    }

    const onClickClose = () => {
        props.changeContent('');
    }

    const beginEnterKey = () => {
        if (window.event.keyCode === 13) {
            onClickBegin();
        }
    }

    const onChangeDate = (type, target) => {
        switch (type) {
            case 'year':
                setYear(Number(target.value));
                break;
            case 'month':
                setMonth(Number(target.value));
                break;
            case 'day':
                setDay(Number(target.value));
                break;
            case 'hour':
                setHour(Number(target.value));
                break;
            case 'min':
                setMin(Number(target.value));
                break;                
        }
        
    }

    const [yearTag, monthTag, dayTag, hourTag, minTag] = setDateTime();
    return (
        <BeginOptionComponent id={'sopPop'} className='UI_Section'>
            <div>
                <div>
                    <div className={'sqPop'}>
                        <div className={'sqpTop'}>
                            <h4>시작 이벤트 옵션</h4>
                            <p>{props.title}</p>
                            <a onClick={() => onClickClose()}>닫기</a>
                        </div>
                        <div className={'sqpCont'}>
                            <div className={'sqpUp'}>
                                <input type="text" id="txtPosition" className={'sqpSel'} onKeyUp={beginEnterKey} placeholder='시작 위치' />
                            </div>
                            <div className={'sqpDown'}>
                                <ul className={'sqpRdo'}>
                                    <li><input type="radio" name="sqpRdo" id="sqpRdo01" onChange={() => onChangeTimeMode(true)} checked={isCurrent} /><label htmlFor="sqpRdo01">현재 시간을 재난발생시간으로 설정</label></li>
                                    <li><input type="radio" name="sqpRdo" id="sqpRdo02" onChange={() => onChangeTimeMode(false)} /><label htmlFor="sqpRdo02">재난발생 시간 입력</label></li>
                                </ul>
                                <ul className={'sqpTime sqpTime'}>
                                    <li>
                                        <select name="" id="" value={year||''} className={'sqpSelectBox'} onChange={(e) => onChangeDate('year', e.target)}>
                                            {yearTag}
                                        </select>
                                    </li>
                                    <li>년</li>
                                    <li>
                                        <select name="" id="" value={month || ''} className={'sqpSelectBox'} onChange={(e) => onChangeDate('month', e.target)}>
                                            {monthTag}
                                        </select>
                                    </li>
                                    <li>월</li>
                                    <li>
                                        <select name="" id="" value={day || ''} className={'sqpSelectBox'} onChange={(e) => onChangeDate('day', e.target)}>
                                            {dayTag}
                                        </select>
                                    </li>
                                    <li>일</li>
                                    <li>
                                        <select name="" id="" value={hour || ''} className={'sqpSelectBox'} onChange={(e) => onChangeDate('hour', e.target)}>
                                            {hourTag}
                                        </select>
                                    </li>
                                    <li>:</li>
                                    <li>
                                        <select name="" id="" value={min || ''} className={'sqpSelectBox'} onChange={(e) => onChangeDate('min', e.target)}>
                                            {minTag}
                                        </select>
                                    </li>
                                </ul> 
                                
                                <ul className={'sqpBtn'}>
                                    <li><a className={'gry'} onClick={onClickClose}>취소</a></li>
                                    <li><a className={'bk'} onClick={onClickBegin}>시작</a></li>
                                </ul>
                            </div>
                        </div>{/*<!-- sqpCont -->*/}
                    </div>{/*<!-- sqPop -->*/}
                </div>
            </div>
        </BeginOptionComponent>
    );

}

export default BeginOption;