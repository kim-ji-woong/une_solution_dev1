import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import SettingsResource from '../resource/id';
import { ModalBackground } from '../../Root/styled/theme';
import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';
import SettingEtc from './settingEtc';
import SettingsStore from '../settingsStore';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import { SettingController } from '../services/settingController';
import { SDMSController } from '../../SDMS/services/sdmsController';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import SopController from '../../SOPManager/services/sopController';
import CctvSetting from './cctvSetting';

function LayoutSetting(props) {
    const [menu, setMenu] = useState(SettingsResource.menu.monitoring3D);
    const [onOffState, setOnOffState] = useState(true);     // 팝업 OnOff 상태
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);       // 정보 불러오기 체크

    const [disasterCategories, setDisasterCategories] = useState(null);     // 재난 종류
    const [buildingGroupList, setBuildingGroupList] = useState(null);
    const [teamTreeDatas, setTeamTreeDatas] = useState(null);
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);

    const [settings, setSettings] = useState(null);
    const [spreadMessages, setSpreadMessages] = useState(null);
    const [linkedSOPs, setLinkedSOPs] = useState(null);     // 재난 종류 및 빌딩, 층에 따른 SOP 연결 정보
    const [sensorTypes, setSensorTypes] = useState(null);   // 사용하는 센서 종류
    const [useSensorTypes, setUseSensorTypes] = useState(null);     // 센서별 신호 수신 여부
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });	

    let bNeedToSave = false;      // 저장이 필요한지 여부 상태 추가

	useEffect(() => {
		console.log(settings);
	}, [settings]);

    useEffect(() => {
        const unsubscribe = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                reloadUseSensorTypes(data.sdmsCommonSettings);
            }
        });

        init();
		initUseSensorTypes();

        return () => {
            unsubscribe();
        };
    }, []);

    const init = async () => {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		// 설정 불러오기 
		const [result, message] = await SettingController.requestSettings(userInfo.id, userInfo.siteNo);

		if (result === null || result === undefined)
			return;

		//setState({ settings: result, isLoading: false });

		// 단축키 적용, sdms 회전 대기시간 적용
		let shortcutKey = result.shortcutKey;
		let idleTime = result.idleTime;
		let moveDisplayAlarm = result.moveDisplayAlarm;
		let turnStart = result.turnStart;
		let useAlarmTurn = result.useAlarmTurn;
		SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm, turnStart, useAlarmTurn });

		// 건물 정보 가져오기
		let siteNos = [];
		siteNos.push(userInfo.siteNo);
		const [buildingGroupListData, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteNos);
		let buildingGroupList = [];

		if (buildingGroupListData !== null && buildingGroupListData !== undefined)
			buildingGroupList = buildingGroupListData;

		// 사용중인 센서 종류
		let sensorTypes = [];
		const [sensorTypeDatas, sensorTypesMessage] = await SDMSController.getFacilityTypes();
		if (sensorTypeDatas !== null && sensorTypeDatas !== undefined)
			sensorTypes = sensorTypeDatas;

		// 초기 상황전파 메시지 가져오기
		let spreadMessages = [];
		const [spreadResult, spreadMessage] = await SettingController.requestGetSpreadMessage();
		if (spreadResult !== null && spreadResult !== undefined)
			spreadMessages = spreadResult;

		// SOP Link 정보 가져오기
		let linkedSOPs = [];
		const [linkedSOPData, linkedSOPMessage] = await SopController.requestLinkedSOPs(userInfo.id);
		if (linkedSOPData !== null && linkedSOPData !== undefined)
			linkedSOPs = linkedSOPData;

		// 정규조직 팀, 멤버 가져오기
		const [teamTreeDatas, teams] = await TeamEditController.DisplayRegular(userInfo.id, true);
		//const teams = await TeamEditController.GetRegular(selectedSiteNo);
		const members = await TeamEditController.DisplayRegularMember(userInfo.id);

		// SOP 재난 정보 가져오기
		const [disasterCategories, disasterCategoriesMessage] = await SopController.disasterCategories(true, userInfo.id);
        setSettings(result);
        setBuildingGroupList(buildingGroupList);
        setTeamTreeDatas(teamTreeDatas);
        setTeams(teams);
        setMembers(members);
        setDisasterCategories(disasterCategories);
        setSpreadMessages(spreadMessages);
        setLinkedSOPs(linkedSOPs);
        setSensorTypes(sensorTypes);
        setIsLoading(false);
	}

	const initUseSensorTypes = () => {
		const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

		if (sdmsCommonSettings) {
			reloadUseSensorTypes(sdmsCommonSettings);
		}
	}

	const reloadUseSensorTypes = (sdmsCommonSettings) => {
		let data = sdmsCommonSettings;

		if (data?.UseFire !== undefined ||
			data?.UsePSM !== undefined ||
			data?.UseETC !== undefined ||
			data?.UseSVMS !== undefined ||
			data?.UseEarthquake !== undefined ||
			data?.UseStrongWind !== undefined ||
			data?.UseBlackOut !== undefined ||
			data?.UseBecon !== undefined ||
			data?.UseEnvironment !== undefined ||
			data?.UseManufacture !== undefined) {

			let sensorTypes = new Object();
			sensorTypes.UseFire = false;
			sensorTypes.UsePSM = false;
			sensorTypes.UseETC = false;
			sensorTypes.UseSVMS = false;
			sensorTypes.UseEarthquake = false;
			sensorTypes.UseStrongWind = false;
			sensorTypes.UseBlackOut = false;
			sensorTypes.UseBecon = false;
			sensorTypes.UseEnvironment = false;
			sensorTypes.UseManufacture = false;

			if (data.UseFire === "true")
				sensorTypes.UseFire = true;
			if (data.UsePSM === "true")
				sensorTypes.UsePSM = true;
			if (data.UseETC === "true")
				sensorTypes.UseETC = true;
			if (data.UseSVMS === "true")
				sensorTypes.UseSVMS = true;
			if (data.UseEarthquake === "true")
				sensorTypes.UseEarthquake = true;
			if (data.UseStrongWind === "true")
				sensorTypes.UseStrongWind = true;
			if (data.UseBlackOut === "true")
				sensorTypes.UseBlackOut = true;
			if (data.UseBecon === "true")
				sensorTypes.UseBecon = true;
			if (data.UseEnvironment === "true")
				sensorTypes.UseEnvironment = true;
			if (data.UseManufacture === "true")
				sensorTypes.UseManufacture = true;

			if (useSensorTypes === null ||
				useSensorTypes.UseFire !== data.UseFire ||
				useSensorTypes.UsePSM !== data.UsePSM ||
				useSensorTypes.UseETC !== data.UseETC ||
				useSensorTypes.UseSVMS !== data.UseSVMS ||
				useSensorTypes.UseEarthquake !== data.UseEarthquake ||
				useSensorTypes.UseStrongWind !== data.UseStrongWind ||
				useSensorTypes.UseBlackOut !== data.UseBlackOut ||
				useSensorTypes.UseBecon !== data.UseBecon ||
				useSensorTypes.UseEnvironment !== data.UseEnvironment ||
				useSensorTypes.UseManufacture !== data.UseManufacture) {

                setUseSensorTypes(sensorTypes);
			}
		}
	}

	const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

    const onClickMenu = (menu) => {
        setMenu(menu);
    }

    const getDisplayView = () => {
        let ui = [];

        if (menu === SettingsResource.menu.monitoring3D) {
            ui.push(
                <Monitoring3D
                    key="LayoutSetting_Monitoring3D"
					settings={settings}
					buildingGroupList={buildingGroupList} 
					spreadMessages={spreadMessages}
					teamTreeDatas={teamTreeDatas} 
					teams={teams} 
					members={members} 
					showConfirmDialog={showConfirmDialog} 
					useSensorTypes={useSensorTypes}
					onChangeNeedToSave={onChangeNeedToSave} 
                />
            );
        }
        else if (menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
					settings={settings}
                />
            );
        }
        else if (menu === SettingsResource.menu.cctv) {
            ui.push(
                <CctvSetting
                    key="LayoutSetting_SopSet"
					settings={settings}
                />
            );
        }
        else if (menu === SettingsResource.menu.etc) {
            ui.push(
                <SettingEtc
                    key="LayoutSetting_etc"
					settings={settings}
                />
            );
        }

        return ui;
    }

	const onChangeNeedToSave = () => {
		bNeedToSave = true;
	}

    const ui = getDisplayView();

    return (
        <ModalBackground>
        <LayoutSettingComponent>
            <button onClick={() => props.handlePopup('setting', false)} className={'closeBtn'}>
                <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
            </button>
            <div className='menuWrap'>
                <h2>환경설정</h2>
                <ul>
                    <li className={menu === SettingsResource.menu.monitoring3D ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.monitoring3D)}>{SettingsResource.ID.menu.monitoring3D}</li>
                    <li className={menu === SettingsResource.menu.sopSet ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.sopSet)}>{SettingsResource.ID.menu.sopSet}</li>
                    <li className={menu === SettingsResource.menu.cctv ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.cctv)}>{SettingsResource.ID.menu.cctv}</li>
                    <li className={menu === SettingsResource.menu.etc ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.etc)}>{SettingsResource.ID.menu.etc}</li>
                </ul>
            </div>
            {ui}
            <div className='btnWrap'>
                <button className='cancle'>취소</button>
                <button className='submit'>적용</button>
            </div>
        </LayoutSettingComponent>
		{
            /* alert창 대신 사용 */
            confirmMessage.visible &&
            <ConfirmDialog 
                type={confirmMessage.type}
                messages={confirmMessage.messages} 
                buttons={confirmMessage.buttons} 
                onClickButton={confirmMessage.onClickButton}
                onCloseConfirmDialog={onCloseConfirmDialog}
            />
        } 
        </ModalBackground>
    );
}

export default withRouter(LayoutSetting);