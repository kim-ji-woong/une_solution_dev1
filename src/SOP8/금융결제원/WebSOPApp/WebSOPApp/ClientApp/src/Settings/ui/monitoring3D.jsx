import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import SettingsResource from '../resource/id';
import SdmsResource from '../../SDMS/resource/id';
import ToggleSwitch from '../../Common/ui/toggleSwitch';

function Monitoring3D(props) {
    const [menuType, setMenuType] = useState(SettingsResource.menuType.normal);
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);

    const [useReceiveFire, setUseReceiveFire] = useState(false);
    const [useReceivePSM, setUseReceivePSM] = useState(false);
    const [useReceiveFineDust, setUseReceiveFineDust] = useState(false);
    const [useReceiveNotPermittedPerson, setUseReceiveNotPermittedPerson] = useState(false);
    const [useDoorAnimation, setUseDoorAnimation] = useState(false);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        setMoveDisplayAlarm(Number(props.settings.MoveDisplayAlarm?.value));

        setUseReceiveFire(props.settings.UseReceiveFire?.value?.toLowerCase() === "true");
        setUseReceivePSM(props.settings.UseReceivePSM?.value?.toLowerCase() === "true");
        setUseReceiveFineDust(props.settings.UseReceiveFineDust?.value?.toLowerCase() === "true");
        setUseReceiveNotPermittedPerson(props.settings.UseReceiveNotPermittedPerson?.value?.toLowerCase() === "true");
        setUseDoorAnimation(props.settings.UseDoorAnimation?.value?.toLowerCase() === "true");
    };

    const onChangeMoveDisplayAlarm = (value) => {
        if (!props.settings) return;

        props.settings.MoveDisplayAlarm.value = value.toString();
        setMoveDisplayAlarm(value);
        props.onChangeNeedToSave();
    };

    const onClickMenuType = (menuType) => {
        setMenuType(menuType);
    }

    const onChangeReceiveFire = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveFire.value = checked.toString();
        setUseReceiveFire(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceivePSM = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceivePSM.value = checked.toString();
        setUseReceivePSM(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceiveFineDust = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveFineDust.value = checked.toString();
        setUseReceiveFineDust(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceiveNotPermittedPerson = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveNotPermittedPerson.value = checked.toString();
        setUseReceiveNotPermittedPerson(checked);
        props.onChangeNeedToSave();
    };

    const onChangeUseDoorAnimation = (e) => {
		if (props.settings === null || props.settings === undefined)
			return;

		let value = e.checked.toString();
		props.settings.UseDoorAnimation.value = value;
        setUseDoorAnimation(!useDoorAnimation)
		props.onChangeNeedToSave();
	}

    const setChecked = (target, type) => {
        if (type === 'useDoorAnimation') {
            onChangeUseDoorAnimation(target);
        } 
    }

    const getDisplayView = () => {
        if (menuType === SettingsResource.menuType.normal) {
            return (
                <ul className='contents'>
                    <li className='item margin'>
                        <div>
                            <p>출입문 POI 열림 효과</p>
                            <ToggleSwitch
                                leftcolor="#878787" 
                                rightcolor="#ffffff"
                                leftbgcolor="#787C87"
                                rightbgcolor="#E5ECFF"
                                circleColor="#0C2CCA"
                                type="useDoorAnimation"
                                setChecked={setChecked}
                                isChecked={useDoorAnimation}
                                isDisabled={false}
                            />
                        </div>
                        <div id='tooltip' data-tooltip="출입문 개방 시 열림 애니메이션을 ON/OFF 할 수 있습니다. " >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            );
        }
        else if (menuType === SettingsResource.menuType.event) {
            return (
                <ul className='contents'>
                    <li className='item receiveItems'>
                        <div>
                            <p>유형 별 이벤트 수신 설정</p>
                            <div className='receiveItem'>
                                <div>
                                    <input type='checkbox' id="sensor_1" checked={useReceiveFire} onChange={onChangeReceiveFire} />
                                    <label htmlFor='sensor_1'>화재</label>
                                </div>
                                <div>
                                    <input type='checkbox' id="sensor_2" checked={useReceivePSM} onChange={onChangeReceivePSM} />
                                    <label htmlFor='sensor_2'>비상벨</label>
                                </div>
                                <div>
                                    <input type='checkbox' id="sensor_3" checked={useReceiveFineDust} onChange={onChangeReceiveFineDust} />
                                    <label htmlFor='sensor_3'>출입문</label>
                                </div>
                                <div>
                                    <input type='checkbox' id="sensor_4" checked={useReceiveNotPermittedPerson} onChange={onChangeReceiveNotPermittedPerson} />
                                    <label htmlFor='sensor_4'>침입</label>
                                </div>
                            </div>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 유형 별 알람 수신을 설정할 수 있습니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin'>
                        <div>
                            <p>이벤트 별 자동 화면 전환 설정</p>
                            <select
                                value={moveDisplayAlarm ?? 0}
                                onChange={(e) => onChangeMoveDisplayAlarm(Number(e.target.value))}
                            >
                                <option value={SdmsResource.alarmOption.stayCurrent}>현재 화면 유지</option>
                                <option value={SdmsResource.alarmOption.moveToLastAlarm}>이벤트 화면으로 이동</option>
                            </select>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 발생 시 자동 화면 전환 설정을 할 수 있습니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin'>
                        <div>
                            <p>초기상황 전파 설정</p>
                            <button onClick={() => props.setShowSpread(true)}>설정하기</button>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 발생 시 설정한 유형에 따른 초기상황 전파 설정을 할 수 있습니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                </ul>
            );
        }
    }

    return (
        <Monitoring3DComponent>
            <ul className='menuTypeWrap'>
                <li className={menuType === SettingsResource.menuType.normal ? 'on' : null} onClick={() => onClickMenuType(SettingsResource.menuType.normal)}>
                    일반 관리
                </li>
                <li className={menuType === SettingsResource.menuType.event ? 'on' : null} onClick={() => onClickMenuType(SettingsResource.menuType.event)}>
                    이벤트 관리
                </li>
            </ul>
            {getDisplayView()}
        </Monitoring3DComponent>
    );
}

export default withRouter(Monitoring3D);