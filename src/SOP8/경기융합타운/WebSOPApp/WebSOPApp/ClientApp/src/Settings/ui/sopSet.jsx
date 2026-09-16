import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { SopSetComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';
import SopLink from './sopLink';

function SopSet(props) {
    const [useSMS, setUseSMS] = useState(true);
    const [sopAutoClose, setSopAutoClose] = useState(true);
    const [useResultSummary, setUseResultSummary] = useState(true);
    const [showSopLinkPopup, setShowSopLinkPopup] = useState(true);

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

    const setChecked = (sopType) => {
        if (sopType === 'useSMS') {
            setUseSMS(!useSMS);
        } 
        else if (sopType === 'sopAutoClose') {
            setSopAutoClose(!sopAutoClose);
        } 
        else if (sopType === 'useResultSummary') {
            setUseResultSummary(!useResultSummary)
        } 
    }

    let comboHourUI = setComboHourUI();
    let comboMinuteUI = setComboMinuteUI();

    return (
        <>
        <SopSetComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>SOP 모드 시간 설정</p>
                        <div className='selectWrap'>
                            <span className='innerTxt'>평일 주간시간</span>
                            <select className='short'>
                                {comboHourUI}
                            </select>
                            <span className='innerTxt'>:</span>
                            <select className='short'>
                                {comboMinuteUI}
                            </select>
                            <span className='innerTxt'>~</span>
                            <select className='short'>
                                {comboHourUI}
                            </select>
                            <span className='innerTxt'>:</span>
                            <select className='short'>
                                {comboMinuteUI}
                            </select>
                        </div> 
                    </div>
                    <div id='tooltip' data-tooltip="SOP모드 시간을 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>문자전파 사용 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useSMS"
                            setChecked={setChecked}
                            isChecked={useSMS}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="문자전파 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>SOP 자동종료 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="sopAutoClose"
                            setChecked={setChecked}
                            isChecked={sopAutoClose}
                        />
                        <div>
                            <select disabled={sopAutoClose ? false : true}>
                                <option>15분</option>
                                <option>30분</option>
                                <option>1시간</option>
                            </select>
                            <span className='innerTxt'>미 입력 시 SOP 자동종료</span>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="대기상태의 SOP 자동종료를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>SOP 결과 요약창 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useResultSummary"
                            setChecked={setChecked}
                            isChecked={useResultSummary}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="SOP 결과 요약창을 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>이벤트 발생 시 실행 SOP 설정</p>
                        <button onClick={() => handlePopup(true)}>고급 설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 실행할 SOP를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </SopSetComponent>
        {
            showSopLinkPopup &&
            <SopLink
                handlePopup={handlePopup}
            />
        }
        </>
    );
}

export default withRouter(SopSet);