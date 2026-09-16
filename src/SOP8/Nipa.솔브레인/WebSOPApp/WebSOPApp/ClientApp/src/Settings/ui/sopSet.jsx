import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { SopSetComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';
import SopLink from './sopLink';
import ProjectResource from '../../Root/resource/id';
import SettingsResource from '../resource/id';

function SopSet(props) {
    const [menuType, setMenuType] = useState(SettingsResource.menuType.normal);

    const [workingBeginHour, setWorkingBeginHour] = useState(null);
    const [workingBeginMinute, setWorkingBeginMinute] = useState(null);
    const [workingEndHour, setWorkingEndHour] = useState(null);
    const [workingEndMinute, setWorkingEndMinute] = useState(null);

    const [useAutoMoveSOPScreen, setUseAutoMoveSOPScreen] = useState(null);
    const [useSMS, setUseSMS] = useState(null);
    const [useBroadcast, setUseBroadcast] = useState(null);
    const [useEmail, setUseEmail] = useState(null);
    const [transmissionUserConfirm, setTransmissionUserConfirm] = useState(null);
    const [useSopSummary, setUseSopSummary] = useState(null);

    const [waitTime, setWaitTime] = useState(0);
    const [sopAutoClose, setSopAutoClose] = useState(null);

    const [showSopLinkPopup, setShowSopLinkPopup] = useState(false);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        // SOP 모드 시간
        const workHours = props.settings.WorkHours.value;
        const [startTime, endTime] = workHours.split(" - ");
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        // 자동종료
        const autoClose = props.settings.AutoClose.value;
        const [waitTime, unit, useAutoClose] = autoClose.split(";").map(Number);

        setWorkingBeginHour(startHour);
        setWorkingBeginMinute(startMinute);
        setWorkingEndHour(endHour);
        setWorkingEndMinute(endMinute);

        setWaitTime(waitTime);
        setSopAutoClose(useAutoClose === 2 ? false : true);

        setUseAutoMoveSOPScreen(props.settings.UseAutoMoveSOPScreen?.value?.toLowerCase() === "true");
        setUseSMS(props.settings.UseSMS?.value?.toLowerCase() === "true");
        setUseBroadcast(props.settings.UseBroadcast?.value?.toLowerCase() === "true");
        setUseEmail(props.settings.UseEmail?.value?.toLowerCase() === "true");
        setTransmissionUserConfirm(props.settings.TransmissionUserConfirm?.value?.toLowerCase() === "true");
        setUseSopSummary(props.settings.UseSopSummary?.value?.toLowerCase() === "true");
    };

    const handlePopup = (isShow) => {
        setShowSopLinkPopup(isShow);
    }

    const setComboHourUI = () => {
		let comboHourUI = [];

		for (let i = 1; i < 25; i++) {
			let hour = leadingZeros(i, 2);

			comboHourUI.push(
				<option key={i} value={i}>{hour}</option>
			);
        }

		return comboHourUI;
	}

    const setComboMinuteUI = () => {
		let comboMinuteUI = [];

		for (let i = 0; i < 60; i += 5) {
			let minute = leadingZeros(i, 2);

			comboMinuteUI.push(
				<option key={i} value={i}>{minute}</option>
			);
		}

		return comboMinuteUI;
	}

    const leadingZeros = (n, digits) => {
		var zero = '';
		n = n.toString();

		if (n.length < digits) {
			for (var i = 0; i < digits - n.length; i++)
				zero += '0';
		}
		return zero + n;
	}

    const setChecked = (target, sopType) => {
        if (sopType === 'useAutoMoveSOPScreen') {
            onChangeUseAutoMoveSOPScreen(target);
        } 
        else if (sopType === 'useSMS') {
            onChangeUseSMS(target);
        } 
        else if (sopType === 'useBroadcast') {
            onChangeUseBroadcast(target);
        } 
        else if (sopType === 'useEmail') {
            onChangeUseEmail(target);
        } 
        else if (sopType === 'transmissionUserConfirm') {
            onChangeTransmissionUserConfirm(target);
        } 
        else if (sopType === 'sopAutoClose') {
            onChangeSopAutoClose(target);
        } 
        else if (sopType === 'useSopSummary') {
            onChangeUseSopSummary(target);
        } 
    }

    const onChangeUseAutoMoveSOPScreen = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseAutoMoveSOPScreen.value = value;
        setUseAutoMoveSOPScreen(!useAutoMoveSOPScreen);
		props.onChangeNeedToSave();
	}

    const onChangeUseSMS = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseSMS.value = value;
        setUseSMS(!useSMS);
		props.onChangeNeedToSave();
	}

    const onChangeUseBroadcast = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseBroadcast.value = value;
        setUseBroadcast(!useBroadcast);
		props.onChangeNeedToSave();
	}

    const onChangeUseEmail = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseEmail.value = value;
        setUseEmail(!useEmail);
		props.onChangeNeedToSave();
	}

    const onChangeTransmissionUserConfirm = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.TransmissionUserConfirm.value = value;
        setTransmissionUserConfirm(!transmissionUserConfirm);
		props.onChangeNeedToSave();
	}

    const onChangeUseSopSummary = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseSopSummary.value = value;
        setUseSopSummary(!useSopSummary)
		props.onChangeNeedToSave();
	}

    const onChangeWorkHours = (type, value) => {
        let newBeginHour = workingBeginHour;
        let newBeginMinute = workingBeginMinute;
        let newEndHour = workingEndHour;
        let newEndMinute = workingEndMinute;

        if (type === 'beginHour') {
            newBeginHour = value;
            setWorkingBeginHour(value)
        }
        else if (type === 'beginMinute') {
            newBeginMinute = value;
            setWorkingBeginMinute(value)
        }
        else if (type === 'endHour') {
            newEndHour = value;
            setWorkingEndHour(value)
        }
        else if (type === 'endMinute') {
            newEndMinute = value;
            setWorkingEndMinute(value)
        }

        if (isNaN(newBeginHour) || isNaN(newBeginMinute) || isNaN(newEndHour) || isNaN(newEndMinute)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['데이터가 올바르지 않습니다.'], null, null);
            return;
        }

        const formatTime = (hour, minute) => {
            const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
            const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
            return `${formattedHour}:${formattedMinute}`;
        };

        const beginTime = formatTime(newBeginHour, newBeginMinute);
        const endTime = formatTime(newEndHour, newEndMinute);
        const workHousrs = `${beginTime} - ${endTime}`;

        props.settings.WorkHours.value = workHousrs;
        props.onChangeNeedToSave();
    }

    const onChangeAutoCloseTime = (waitTime) => {
        if (props.settings === null || props.settings === undefined)
			return;

        const newUseSopAutoClose = sopAutoClose ? 0 : 2;
        const value = `${waitTime};1;${newUseSopAutoClose}`;

        props.settings.AutoClose.value = value;
        setWaitTime(waitTime);
        props.onChangeNeedToSave();
    }

    const onChangeSopAutoClose = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

        const newUseSopAutoClose = e.checked ? 0 : 2;
        const value = `${waitTime};1;${newUseSopAutoClose}`;

		props.settings.AutoClose.value = value;
        setSopAutoClose(!sopAutoClose);
		props.onChangeNeedToSave();
	}

    const onClickMenuType = (menuType) => {
        setMenuType(menuType);
    }

    const getDisplayView = () => {
        if (menuType === SettingsResource.menuType.normal) {
            return (
                <ul className='contents'>
                    <li className='item'>
                        <div>
                            <p>평일 주간 시간 설정</p>
                            <div className='selectWrap'>
                                <select 
                                    className='short' 
                                    value={workingBeginHour || false}
                                    onChange={(e) => onChangeWorkHours('beginHour', Number(e.target.value))}
                                >
                                    {setComboHourUI()}
                                </select>
                                <span className='innerTxt'>시</span>
                                <select 
                                    className='short'
                                    value={workingBeginMinute || false}
                                    onChange={(e) => onChangeWorkHours('beginMinute', Number(e.target.value))}
                                >
                                    {setComboMinuteUI()}
                                </select>
                                <span className='innerTxt'>분 ~</span>
                                <select 
                                    className='short'
                                    value={workingEndHour || false}
                                    onChange={(e) => onChangeWorkHours('endHour', Number(e.target.value))}
                                >
                                    {setComboHourUI()}
                                </select>
                                <span className='innerTxt'>시</span>
                                <select 
                                    className='short'
                                    value={workingEndMinute || false}
                                    onChange={(e) => onChangeWorkHours('endMinute', Number(e.target.value))}
                                >
                                    {setComboMinuteUI()}
                                </select>
                                <span className='innerTxt'>분</span>
                            </div> 
                        </div>
                        <div id='tooltip' data-tooltip="평일 주간에 대한 시간 설정을 할 수 있습니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin'>
                        <div>
                            <p>SOP 결과 요약창 표출 여부</p>
                            <ToggleSwitch
                                leftcolor="#878787" 
                                rightcolor="#ffffff"
                                leftbgcolor="#787C87"
                                rightbgcolor="#E5ECFF"
                                circleColor="#0C2CCA"
                                type="useSopSummary"
                                setChecked={setChecked}
                                isChecked={useSopSummary}
                                isDisabled={false}
                            />
                        </div>
                        <div id='tooltip' data-tooltip="실행 중인 SOP 종료 시 결과 요약창 표출 여부에 대해 설정 할 수 있습니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            );
        }
        else if (menuType === SettingsResource.menuType.event) {
            return (
                <ul className='contents'>
                    <li className='item'>
                        <div>
                            <p>SOP 자동 실행 설정</p>
                            <button onClick={() => handlePopup(true)}>설정하기</button>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 발생 시 SOP 자동 실행을 이벤트 유형에 따라 설정 할 수 있습니다." >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            );
        }
    }

    return (
        <>
        <SopSetComponent>
            <ul className='menuTypeWrap'>
                <li className={menuType === SettingsResource.menuType.normal ? 'on' : null} onClick={() => onClickMenuType(SettingsResource.menuType.normal)}>
                    일반 관리
                </li>
                <li className={menuType === SettingsResource.menuType.event ? 'on' : null} onClick={() => onClickMenuType(SettingsResource.menuType.event)}>
                    이벤트 관리
                </li>
            </ul>
            {getDisplayView()}
        </SopSetComponent>
        {
            showSopLinkPopup &&
            <SopLink
                handlePopup={handlePopup}
                selectedSiteNo={props.selectedSiteNo}
                showConfirmDialog={props.showConfirmDialog}
                onCloseConfirmDialog={props.onCloseConfirmDialog}
                handleToast={props.handleToast}
            />
        }
        </>
    );
}

export default withRouter(SopSet);