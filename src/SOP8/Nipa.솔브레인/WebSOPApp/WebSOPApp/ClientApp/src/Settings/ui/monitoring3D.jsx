import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import SettingsResource from '../resource/id';
import { SettingController } from '../services/settingController';
import SdmsResource from '../../SDMS/resource/id';

function Monitoring3D(props) {
    const [menuType, setMenuType] = useState(SettingsResource.menuType.normal);
    const [cameraIdleTime, setCameraIdleTime] = useState(null);
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);
    const [moveFacilityDisplayAlarm, setMoveFacilityDisplayAlarm] = useState(null);
    const [useAlarmSound, setUseAlarmSound] = useState(null);

    const [useReceiveFire, setUseReceiveFire] = useState(false);
    const [useReceivePSM, setUseReceivePSM] = useState(false);
    const [useReceiveFineDust, setUseReceiveFineDust] = useState(false);
    const [useReceiveNotPermittedPerson, setUseReceiveNotPermittedPerson] = useState(false);
    const [useReceiveNotSubmerge, setUseReceiveNotSubmerge] = useState(false);
    const [useReceiveEtc, setUseReceiveEtc] = useState(false);
    const [useReceiveCCTV, setUseReceiveCCTV] = useState(false);
    const [useReceivePredictAlarm, setUseReceivePredictAlarm] = useState(false);
    const [useReceivePeakPower, setUseReceivePeakPower] = useState(false);

    const refBuildingFile = useRef(null);
    const refGroupFile = useRef(null);
    const refFacilityFile = useRef(null);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        setCameraIdleTime(Number(props.settings.CameraIdleTime?.value));
        setMoveDisplayAlarm(Number(props.settings.MoveDisplayAlarm?.value));
        setMoveFacilityDisplayAlarm(Number(props.settings.MoveFacilityDisplayAlarm?.value));
        setUseAlarmSound(props.settings.UseAlarmSound?.value?.toLowerCase() === "true");

        setUseReceiveFire(props.settings.UseReceiveFire?.value?.toLowerCase() === "true");
        setUseReceivePSM(props.settings.UseReceivePSM?.value?.toLowerCase() === "true");
        setUseReceiveFineDust(props.settings.UseReceiveFineDust?.value?.toLowerCase() === "true");
        setUseReceiveNotPermittedPerson(props.settings.UseReceiveNotPermittedPerson?.value?.toLowerCase() === "true");
        setUseReceiveNotSubmerge(props.settings.UseReceiveNotSubmerge?.value?.toLowerCase() === "true");
        setUseReceiveEtc(props.settings.UseReceiveEtc?.value?.toLowerCase() === "true");
        setUseReceiveCCTV(props.settings.UseReceiveCCTV?.value?.toLowerCase() === "true");
        setUseReceivePredictAlarm(props.settings.UseReceivePredictAlarm?.value?.toLowerCase() === "true");
        setUseReceivePeakPower(props.settings.UseReceivePeakPower?.value?.toLowerCase() === "true");
    };

    const onChangeMoveDisplayAlarm = (value) => {
        if (!props.settings) return;

        props.settings.MoveDisplayAlarm.value = value.toString();
        setMoveDisplayAlarm(value);
        props.onChangeNeedToSave();
    };

    const onChangeMoveFacilityDisplayAlarm = (value) => {
        if (!props.settings) return;

        props.settings.MoveFacilityDisplayAlarm.value = value.toString();
        setMoveFacilityDisplayAlarm(value);
        props.onChangeNeedToSave();
    };

    const onClickMenuType = (menuType) => {
        setMenuType(menuType);
    }

    const onClickDownloadBuilding = async () => {
        if (!props.selectedSiteNo) {
            props.handleToast('선택된 site가 없습니다');
            return;
        }

        const [success, message] = await SettingController.requestDownloadBuilding(props.selectedSiteNo);

        if (!success) {
            props.handleToast(message);
        }
    }

    const onClickDownloadBuildingGroup = async () => {
        if (!props.selectedSiteNo) {
            props.handleToast('선택된 site가 없습니다');
            return;
        }

        const [success, message] = await SettingController.requestDownloadBuildingGroup(props.selectedSiteNo);

        if (!success) {
            props.handleToast(message);
        }
    }

    const onClickDownloadFacility = async () => {
        if (!props.selectedSiteNo) {
            props.handleToast('선택된 site가 없습니다');
            return;
        }

        const [success, message] = await SettingController.requestDownloadFacility(props.selectedSiteNo);

        if (!success) {
            props.handleToast(message);
        }
    }

    const onClickUpload = async (type) => {
        if (type === 'building') {
            refBuildingFile.current.click();
        } else if (type === 'group') {
            refGroupFile.current.click();
        } else if (type === 'facility') {
            refFacilityFile.current.click();
        }
    }

    const onSelectBuildingFile = async (event) => {
		const file = event.target.files[0];
		refBuildingFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			props.handleToast('엑셀 파일(xls, xlsx)만 업로드 가능합니다');
			return;
		} else if (file.size > 10485760) {
			props.handleToast('최대 10MB 엑셀 파일을 업로드 할 수 있습니다');
			return;
        }

		const [success, message] = await SettingController.requestUploadBuildingFile(file, props.selectedSiteNo);
        props.handleToast(success ? '업로드가 완료되었습니다' : message);
	}

	const onSelectGroupFile = async (event) => {
		const file = event.target.files[0];
		refGroupFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
            props.handleToast('엑셀 파일(xls, xlsx)만 업로드 가능합니다');
			return;
		} else if (file.size > 10485760) {
            props.handleToast('최대 10MB 엑셀 파일을 업로드 할 수 있습니다');
			return;
		}

		const [success, message] = await SettingController.requestUploadBuildingGroupFile(file, props.selectedSiteNo);
        props.handleToast(success ? '업로드가 완료되었습니다' : message);
	}

	const onSelectFacilityFile = async (event) => {
		const file = event.target.files[0];
		refFacilityFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
            props.handleToast('엑셀 파일(xls, xlsx)만 업로드 가능합니다');
			return;
		} else if (file.size > 10485760) {
            props.handleToast('최대 10MB 엑셀 파일을 업로드 할 수 있습니다');
			return;
		}

		const [success, message] = await SettingController.requestUploadFacilityFile(file, props.selectedSiteNo);
        props.handleToast(success ? '업로드가 완료되었습니다' : message);
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

    const onChangeReceiveNotSubmerge = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveNotSubmerge.value = checked.toString();
        setUseReceiveNotSubmerge(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceiveEtc = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveEtc.value = checked.toString();
        setUseReceiveEtc(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceiveCCTV = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceiveCCTV.value = checked.toString();
        setUseReceiveCCTV(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceivePredictAlarm = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceivePredictAlarm.value = checked.toString();
        setUseReceivePredictAlarm(checked);
        props.onChangeNeedToSave();
    };

    const onChangeReceivePeakPower = (e) => {
        const checked = e.target.checked;
        if (!props.settings) return;

        props.settings.UseReceivePeakPower.value = checked.toString();
        setUseReceivePeakPower(checked);
        props.onChangeNeedToSave();
    };

    const getDisplayView = () => {
        if (menuType === SettingsResource.menuType.normal) {
            return (
                <ul className='contents'>
                    <li className='item first'>
                        <div>
                            <p>건물정보 업데이트</p>
                            <input ref={refBuildingFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={onSelectBuildingFile} />
                            <button onClick={() => onClickUpload('building')}>업로드</button>
                            <button onClick={() => onClickDownloadBuilding()}>다운로드</button>
                        </div>
                        <div id='tooltip' data-tooltip="건물정보를 엑셀파일로 업로드 또는 다운로드를 할 수 있습니다. (최대 10MB 가능)">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item center'>
                        <div>
                            <p>건물 그룹 정보 업데이트</p>
                            <input ref={refGroupFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={onSelectGroupFile} />
                            <button onClick={() => onClickUpload('group')}>업로드</button>
                            <button onClick={() => onClickDownloadBuildingGroup()}>다운로드</button>
                        </div>
                        <div id='tooltip' data-tooltip="건물그룹 정보를 엑셀파일로 업로드 또는 다운로드를 할 수 있습니다. (최대 10MB 가능)">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item last'>
                        <div>
                            <p>설비정보 업데이트</p>
                            <input ref={refFacilityFile} className={'hidden'} type='file' accept='.xls,.xlsx' onChange={onSelectFacilityFile} />
                            <button onClick={() => onClickUpload('facility')}>업로드</button>
                            <button onClick={() => onClickDownloadFacility()}>다운로드</button>
                        </div>
                        <div id='tooltip' data-tooltip="설비정보를 엑셀파일로 업로드 또는 다운로드를 할 수 있습니다. (최대 10MB 가능)">
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
                            <div>
                                <div className='receiveItem'>
                                    <div>
                                        <input type='checkbox' id="sensor_1" checked={useReceiveFire} onChange={onChangeReceiveFire} />
                                        <label htmlFor='sensor_1'>화재</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_2" checked={useReceivePSM} onChange={onChangeReceivePSM} />
                                        <label htmlFor='sensor_2'>누출</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_3" checked={useReceiveFineDust} onChange={onChangeReceiveFineDust} />
                                        <label htmlFor='sensor_3'>미세먼지</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_4" checked={useReceiveNotPermittedPerson} onChange={onChangeReceiveNotPermittedPerson} />
                                        <label htmlFor='sensor_4'>비인가자 탐지</label>
                                    </div>
                                </div>
                                <div className='receiveItem'>
                                    <div>
                                        <input type='checkbox' id="sensor_5" checked={useReceiveNotSubmerge} onChange={onChangeReceiveNotSubmerge} />
                                        <label htmlFor='sensor_5'>집수정</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_6" checked={useReceiveEtc} onChange={onChangeReceiveEtc} />
                                        <label htmlFor='sensor_6'>etc</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_7" checked={useReceiveCCTV} onChange={onChangeReceiveCCTV} />
                                        <label htmlFor='sensor_7'>cctv</label>
                                    </div>
                                </div>
                                <div className='receiveItem'>
                                    <div>
                                        <input type='checkbox' id="sensor_8" checked={useReceivePredictAlarm} onChange={onChangeReceivePredictAlarm} />
                                        <label htmlFor='sensor_8'>AI 설비 예지보전</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' id="sensor_9" checked={useReceivePeakPower} onChange={onChangeReceivePeakPower} />
                                        <label htmlFor='sensor_9'>AI 전력 분석</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='tooltip' data-tooltip="이벤트 유형 별 알람 수신을 설정할 수 있습니다.">
                            <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                        </div>
                    </li>
                    <li className='item margin moveDisplayAlarm'>
                        <div>
                            <p>이벤트 별 자동 화면 전환 설정</p>
                            <div>
                                <div>
                                    <p>센서</p>
                                    <select
                                        value={moveDisplayAlarm ?? 0}
                                        onChange={(e) => onChangeMoveDisplayAlarm(Number(e.target.value))}
                                    >
                                        <option value={SdmsResource.alarmOption.stayCurrent}>현재 화면 유지</option>
                                        <option value={SdmsResource.alarmOption.moveToLastAlarm}>이벤트 화면으로 이동</option>
                                    </select>
                                </div>
                                <div>
                                    <p>설비</p>
                                    <select
                                        value={moveFacilityDisplayAlarm ?? 0}
                                        onChange={(e) => onChangeMoveFacilityDisplayAlarm(Number(e.target.value))}
                                    >
                                        <option value={SdmsResource.alarmOption.stayCurrent}>현재 화면 유지</option>
                                        <option value={SdmsResource.alarmOption.moveToLastAlarm}>이벤트 화면으로 이동</option>
                                    </select>
                                </div>
                            </div>
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