import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { SopSetComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip_icon.svg';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';
import SopLink from './sopLink';
import ProjectResource from '../../Root/resource/id';
import BoxButton from '../../Common/components/boxButton';
import DropBox from '../../Common/components/dropBox';

function SopSet(props) {
    const [openDropId, setOpenDropId] = useState(null);

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

    const isLoaded = useRef(false);

    useEffect(() => {
        initData();
    }, [props.settings]);

    useEffect(() => {
        if (
            !props.settings ||
            !props.settings.WorkHours ||
            workingBeginHour === null ||
            workingBeginMinute === null ||
            workingEndHour === null ||
            workingEndMinute === null
        ) return;

        const formatTime = (hour, minute) => {
            const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
            const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
            return `${formattedHour}:${formattedMinute}`;
        };

        const beginTime = formatTime(workingBeginHour, workingBeginMinute);
        const endTime = formatTime(workingEndHour, workingEndMinute);
        const workHousrs = `${beginTime} - ${endTime}`;

        // 초기값과 같으면 무시
        if (props.settings.WorkHours.value === workHousrs) return;

        props.settings.WorkHours.value = workHousrs;
        props.onChangeNeedToSave();

    }, [
        workingBeginHour,
        workingBeginMinute,
        workingEndHour,
        workingEndMinute
    ]);

    useEffect(() => {
        if (!props.settings || !props.settings.AutoClose || waitTime === 0) {
			return;
        }

        const newUseSopAutoClose = sopAutoClose ? 0 : 2;
        const value = `${waitTime};1;${newUseSopAutoClose}`;

        // 초기값과 같으면 무시
        if (props.settings.AutoClose.value === value) return;
        
        props.settings.AutoClose.value = value;
        setWaitTime(waitTime);
        props.onChangeNeedToSave();

    }, [waitTime]);

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

        isLoaded.current = true;
    };

    const handlePopup = (isShow) => {
        setShowSopLinkPopup(isShow);
    }

    const setComboHourUI = () => {
		let comboHourUI = [];

		for (let i = 1; i < 25; i++) {
			let hour = leadingZeros(i, 2);

			comboHourUI.push({ value: i, label: hour });
        }

		return comboHourUI;
	}

    const setComboMinuteUI = () => {
		let comboMinuteUI = [];

		for (let i = 0; i < 60; i += 5) {
			let minute = leadingZeros(i, 2);

            comboMinuteUI.push({ value: i, label: minute });
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

    const onChangeSopAutoClose = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

        const newUseSopAutoClose = e.checked ? 0 : 2;
        const value = `${waitTime};1;${newUseSopAutoClose}`;

		props.settings.AutoClose.value = value;
        setSopAutoClose(!sopAutoClose);
		props.onChangeNeedToSave();
	}

    return (
        <>
        <SopSetComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>SOP 모드 시간 설정</p>
                        <div>
                            <span className='innerTxt'>평일 주간시간</span>
                            <DropBox
                                className="dropBox"
                                id="workingBeginHour"
                                value={workingBeginHour}
                                onChange={setWorkingBeginHour}
                                options={setComboHourUI()}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                            <span className='innerTxt'>:</span>
                            <DropBox
                                className="dropBox"
                                id="workingBeginMinute"
                                value={workingBeginMinute}
                                onChange={setWorkingBeginMinute}
                                options={setComboMinuteUI()}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                            <span className='innerTxt'>~</span>
                            <DropBox
                                className="dropBox"
                                id="workingEndHour"
                                value={workingEndHour}
                                onChange={setWorkingEndHour}
                                options={setComboHourUI()}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                            <span className='innerTxt'>:</span>
                            <DropBox
                                className="dropBox"
                                id="workingEndMinute"
                                value={workingEndMinute}
                                onChange={setWorkingEndMinute}
                                options={setComboMinuteUI()}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                        </div> 
                    </div>
                    <div id='tooltip' data-tooltip="평일 주간에 대한 SOP 모드 시간 설정을 할 수 있습니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>

                <li className='item'>
                    <div>
                        <p>문자전파 사용 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF" 
                            sopType="useSMS"
                            setChecked={setChecked}
                            isChecked={useSMS}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="상황 전파 시 문자 전파 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>

                <li className='item'>
                    <div>
                        <p>SOP 자동 종료 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF" 
                            sopType="sopAutoClose"
                            setChecked={setChecked}
                            isChecked={sopAutoClose}
                            isDisabled={false}
                        />
                        {sopAutoClose &&
                            <div>
                                <DropBox
                                    className="dropBox"
                                    id="waitTime"
                                    value={waitTime}
                                    onChange={setWaitTime}
                                    options={[
                                        { value: 5, label: '5분' },
                                        { value: 15, label: '15분' },
                                        { value: 30, label: '30분' },
                                        { value: 60, label: '60분' },
                                    ]}
                                    disabled={sopAutoClose ? false : true}
                                    openId={openDropId}
                                    setOpenId={setOpenDropId}
                                />
                                <span className='innerTxt'>미 입력 시 SOP 자동종료</span>
                            </div>
                        }
                    </div>
                    <div id='tooltip' data-tooltip="일정 시간 SOP 미입력 시 자동 종료 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>

                <li className='item'>
                    <div>
                        <p>SOP 결과 요약창 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF"
                            sopType="useSopSummary"
                            setChecked={setChecked}
                            isChecked={useSopSummary}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="실행 중인 SOP 종료 시 결과 요약창 표출 여부에 대해 설정 할 수 있습니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                {/* <li className='item'>
                    <div>
                        <p>실행중인 컴포넌트로 자동 화면 이동</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useAutoMoveSOPScreen"
                            setChecked={setChecked}
                            isChecked={useAutoMoveSOPScreen}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="실행중인 컴포넌트로 자동 화면 이동 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li> */}
                {/* <li className='item'>
                    <div>
                        <p>방송 전파 사용</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useBroadcast"
                            setChecked={setChecked}
                            isChecked={useBroadcast}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="방송 전파 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li> */}
                {/* <li className='item'>
                    <div>
                        <p>이메일 전파 사용</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useEmail"
                            setChecked={setChecked}
                            isChecked={useEmail}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="이메일 전파 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li> */}
                {/* <li className='item'>
                    <div>
                        <p>상황 전파 시 확인 단계 거치기</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="transmissionUserConfirm"
                            setChecked={setChecked}
                            isChecked={transmissionUserConfirm}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="상황 전파 시 확인 단계 거치기 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li> */}

            </ul>

            <ul className='contents'>
                <li className='item margin'>
                    <div>
                        <p>SOP 자동 실행 설정</p>
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={() => handlePopup(true)}
                        >
                            설정하기
                        </BoxButton>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 SOP 자동 실행을 이벤트 유형에 따라 설정 할 수 있습니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </SopSetComponent>
        {
            showSopLinkPopup &&
            <SopLink
                handlePopup={handlePopup}
                sensorTypes={props.sensorTypes}
                sensorList={props.sensorList}
                showConfirmDialog={props.showConfirmDialog}
                onCloseConfirmDialog={props.onCloseConfirmDialog}
                selectedSiteNo={props.selectedSiteNo}
                handleToast={props.handleToast}
            />
        }
        </>
    );
}

export default withRouter(SopSet);