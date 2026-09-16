import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import SettingsResource from '../resource/id';
import { ModalBackground } from '../../Root/styled/theme';
import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';

import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import { SettingController } from '../services/settingController';
import { SDMSController } from '../../SDMS/services/sdmsController';
import SpreadManager from './spreadManager';
import { ExternalController } from '../../SDMS/services/externalController';
import socketStore from "../../SDMS/webSocket/socketStore";
import SettingsStore from '../settingsStore';
import BoxButton from '../../Common/components/boxButton';
import UserOption from './userOption';
import useToast from '../../Common/hooks/useToast';
import {AccountController} from "../../Account/services/accountController";
import AccountResource from '../../Account/resource/id';
import useLoginUserInfo from '../../Common/hooks/useLoginUserInfo';

function LayoutSetting(props) {
    const { onShowToast } = useToast();
    const { loginUserInfo } = useLoginUserInfo();

    const [menu, setMenu] = useState(SettingsResource.menu.userOption);
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);     // 현재 SiteNo
    const [sensorTypes, setSensorTypes] = useState(null);
    const [sensorList, setSensorList] = useState([]);

    const [useSensorTypes, setUseSensorTypes] = useState(null);     // 센서별 신호 수신 여부
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });	

	const [sdmsSettings, setSdmsSettings] = useState({});
	const [sopSettings, setSopSettings] = useState({});
	const [etcSettings, setEtcSettings] = useState({});
    const [userOptions, setUserOptions] = useState([]);

    const [showSpread, setShowSpread] = useState(false);    // 초기상황 전파관리 팝업

    const [needToSave, setNeedToSave] = useState(false);

    useEffect(() => {
        init();
        initUserOptions();
        initSiteNo();
    }, []);

    useEffect(() => {
        if (!loginUserInfo) return;

        const path = window.location.pathname;

        // 총괄관리자 : 환경설정 전체 탭 crud 가능
        // 관리자, 사용자 : 환경설정 > 사용자 옵션만 crud 가능
        if (loginUserInfo.grad_sn === AccountResource.accountLevelNo.master) {
            if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
                setMenu(SettingsResource.menu.sopSet);
            } else {
                setMenu(SettingsResource.menu.monitoring3D);
            }
        } else {
            setMenu(SettingsResource.menu.userOption);
        }
    }, [loginUserInfo]);

    const init = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined) 
            return;
        
        // 설정 불러오기
        const [result, message] = await SettingController.requestSetting(userInfo.site_sn);

        if (result === null || result === undefined)
            return;

        const sdmsSettings = result.find(item => item.categoryType === 'SDMS');
        if (sdmsSettings) {
            const transformedSettings = {};

            sdmsSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setSdmsSettings(transformedSettings);
        }

        const sopSettings = result.find(item => item.categoryType === 'SOP');
        if (sopSettings) {
            const transformedSettings = {};

            sopSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setSopSettings(transformedSettings);
        }

        const etcSettings = result.find(item => item.categoryType === 'Etc');
        if (etcSettings) {
            const transformedSettings = {};

            etcSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setEtcSettings(transformedSettings);
        }

        try {
            const [sensorSubTypes, sensorTypes, sensorList] = await Promise.all([
                ExternalController.GetExternalSensorTypeSubTypes(),
                ExternalController.GetExternalSensorTypes(),
                SDMSController.getSensorList(),
            ]);

            setSensorList(sensorList);

            if (sensorSubTypes && sensorTypes) {
                const filteredSensorTypes = sensorTypes
                    .filter(({ alarm_yn }) => alarm_yn)
                    .map((sensorType) => ({
                        ...sensorType,
                        sensorSubTypes: sensorSubTypes[sensorType.sensor_type_idx] ?? null
                    }));

                setSensorTypes(filteredSensorTypes);
            }
        } catch (error) {
            console.error('센서 정보 불러오기 실패:', error);
            setSensorTypes([]);
            setSensorList([]);
        }
    }
    
    const initUserOptions = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;
        
        const [userOptions, message] = await AccountController.requestOptions(userInfo.user_sn);
        if (userOptions === null || userOptions === undefined)
            return;
        
        setUserOptions(userOptions);
        SettingsStore.dispatch({ type: 'USER_OPTIONS', userOptions });
    }

    const initSiteNo = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        let site_sn = null;
        
        if (userInfo.site_sn) {
            site_sn = userInfo.site_sn;
        } else if (ProjectResource.site_sn) {
            site_sn = ProjectResource.site_sn;
        }

        setSelectedSiteNo(site_sn);

        return site_sn;
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

    const handleToast = (message, status) => {
        onShowToast(message, status);
    };

    const onClickMenu = (menu) => {
        setMenu(menu);
    }

    const getDisplayView = () => {
        let ui = [];

        if (menu === SettingsResource.menu.monitoring3D) {
            ui.push(
                <Monitoring3D
                    key="LayoutSetting_Monitoring3D"
					settings={sdmsSettings}
                    
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
                    setShowSpread={setShowSpread}
					useSensorTypes={useSensorTypes}
                />
            );
        }
        else if (menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
					settings={sopSettings}
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    sensorTypes={sensorTypes}
                    sensorList={sensorList}
                    selectedSiteNo={selectedSiteNo}
                    handleToast={handleToast}
                />
            );
        }
        else if (menu === SettingsResource.menu.userOption) {
            ui.push(
                <UserOption
                    key="LayoutSetting_userOption"
					settings={etcSettings}
                    userOptions={userOptions}
                    setUser={setUserOptions}
                    resetSettings={resetSettings}
                    needToSave={needToSave}
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    closePopup={closePopup}
                    handleToast={handleToast}
                />
            );
        }

        return ui;
    }

	const onChangeNeedToSave = () => {
		setNeedToSave(true);
	}

    function transformSettings(sdmsSettings, sopSettings, etcSettings, siteNo) {
    
        const transformCategory = (settings, categoryType) => {
            return {
                categoryType,
                settingDatas: Object.keys(settings).map(key => ({
                    siteNo,
                    name: key,
                    value: settings[key].value,
                    description: settings[key].description
                }))
            };
        };
    
        return {
            categories: [
                transformCategory(sdmsSettings, "SDMS"),
                transformCategory(sopSettings, "SOP"),
                transformCategory(etcSettings, "Etc")
            ]
        };
    }

    const onClickSave = () => {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo) return;

        const transformedData = transformSettings(sdmsSettings, sopSettings, etcSettings, userInfo.site_sn);
        doSave(transformedData, { mode: "save" });
    };

    const doSave = async (categories, options = {}) => {
        const { mode = "save", userOptionsOverride = null } = options;

        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["설정정보를 저장할 수 없습니다.", "사용자정보를 확인해주세요."], null, null );

        // 환경설정 초기화로 진입하면 state값이 아닌 파라미터 사용
        const optionsToSave = Array.isArray(userOptionsOverride)
            ? userOptionsOverride
            : userOptions;
        
        let [sysSuccess, sysMessage] = [true, ""];
        let [userSuccess, userMessage] = [true, ""];

        if (userInfo.grad_sn === AccountResource.accountLevelNo.master) {
            [sysSuccess, sysMessage] = await SettingController.requestSave(categories);
        }

        [userSuccess, userMessage] = await AccountController.requestSaveOptions(userInfo.user_sn, optionsToSave);

        if (!sysSuccess || !userSuccess) {
            if (!sysSuccess) 
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["시스템 환경설정 저장에 실패하였습니다.", sysMessage], null, null);
            if (!userSuccess) 
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["사용자 환경설정 저장에 실패하였습니다.", userMessage], null, null);
            return;
        }

        SettingsStore.dispatch({ type: 'USER_OPTIONS', userOptions: optionsToSave });
        sendSettings(optionsToSave);
        
        
        setNeedToSave(false);

        if (mode === "reset") {
            handleToast("환경설정이 초기화되어 저장되었습니다.");
        } else {
            handleToast("적용 되었습니다.");
        }
    };
    
    const sendSettings = (tempUserOptions) => {
        let idleTimeOption = tempUserOptions.find((o) => o.category === "sdms" && o.subCategory === "idleTime").values[0];
        let weatherEffectOption = tempUserOptions.find((o) => o.category === "sdms" && o.subCategory === "weatherEffect").values[0];
        let lightEffectOption = tempUserOptions.find((o) => o.category === "sdms" && o.subCategory === "lightEffect").values[0];
        let allowEvents = getAllowEvents(sdmsSettings);
        
        if (!idleTimeOption) idleTimeOption = "15:0"
        if (!weatherEffectOption) weatherEffectOption = "true";
        if (!lightEffectOption) lightEffectOption = "true";
        if (!allowEvents) allowEvents = [{"poiType": 1, "value": 0}, {"poiType": 3, "value": 0}, {"poiType": 4, "value": 0}];
        
        const wsMgr = socketStore.getState().wsMgr;
        if (!wsMgr?.connected)
            return;

        const [time, use] = idleTimeOption.split(':');
        const idleParam = {
            autoRotation: {
                active: use === "1" ? 1 : 0,
                time: time,
            }
        };
        
        const weatherEffectParam = {
            value: weatherEffectOption === "true" ? 1 : 0,
        }
        
        const lightEffectParam = {
            value: lightEffectOption === "true" ? 1 : 0,
        }

        wsMgr.sendWeatherEffect(weatherEffectParam);
        wsMgr.sendLightEffect(lightEffectParam);
        wsMgr.sendResponseAutoRotationSettings(idleParam);
        wsMgr.sendResponseAlarmLayerSettings(allowEvents);
    }
    
    const getAllowEvents = (settings) => {
        let el = {
            "allowEvents": []
        }
        
        const useAtmosphere = settings.UseReceiveAtmosphere?.value === "true" ? 1 : 0;
        const useWater = settings.UseReceiveWater?.value === "true" ? 1 : 0;
        const useWaterDisaster = settings.UseReceiveWaterDisaster?.value === "true" ? 1 : 0;
        
        el.allowEvents.push({"poiType": 1, "value": useAtmosphere});
        el.allowEvents.push({"poiType": 3, "value": useWater});
        el.allowEvents.push({"poiType": 4, "value": useWaterDisaster});
        
        return el;
    }

    const closePopup = () => {
        props.handlePopup('setting', false)
    }

    const getTabMenus = () => {
        const path = window.location.pathname;
        
        if (loginUserInfo?.grad_sn === AccountResource.accountLevelNo.master && (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager)) {
            return (
                <ul>
                    <li className={menu === SettingsResource.menu.sopSet ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.sopSet)}>{SettingsResource.ID.menu.sopSet}</li>
                </ul>
            );
        }

        return (
            <ul>
                {loginUserInfo?.grad_sn === AccountResource.accountLevelNo.master &&
                    <li className={menu === SettingsResource.menu.monitoring3D ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.monitoring3D)}>{SettingsResource.ID.menu.monitoring3D}</li>
                }
                <li className={menu === SettingsResource.menu.userOption ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.userOption)}>{SettingsResource.ID.menu.userOption}</li>
            </ul>
        );
    }
    
    const resetSettings = (userInfo, tempUserOptions) => {

        const nextSdmsSettings = Object.keys(sdmsSettings || {}).reduce((acc, key) => {
            acc[key] = { ...(sdmsSettings[key] || {}) };
            return acc;
        }, {});
        
        if (nextSdmsSettings.MoveDisplayAlarm === undefined) {
            nextSdmsSettings.MoveDisplayAlarm = { value: "2", description: "알람 발생시 화면 자동전환 옵션(0 : 현재화면 유지, 1 : 첫번째 알람위치로 이동, 2 : 마지막 알람위치로 이동"};
        } else {
            nextSdmsSettings.MoveDisplayAlarm.value = "2";
        }
        
        if (nextSdmsSettings.UseReceiveAtmosphere === undefined) {
            nextSdmsSettings.UseReceiveAtmosphere = { value: 'true' , description: "대기유해물질 측정기 알람 사용여부"};
        } else {
            nextSdmsSettings.UseReceiveAtmosphere.value = "true";
        }
        
        if (nextSdmsSettings.UseReceiveWater === undefined) {
            nextSdmsSettings.UseReceiveWater = { value: 'true' , description: "대기유해물질 측정기 알람 사용여부"};
        } else {
            nextSdmsSettings.UseReceiveWater.value = "true";
        }
        
        if (nextSdmsSettings.UseReceiveWaterDisaster === undefined) {
            nextSdmsSettings.UseReceiveWaterDisaster = { value: 'true' , description: "수해방지 모니터링 시스템 알람 사용여부"} 
        } else {
            nextSdmsSettings.UseReceiveWaterDisaster.value = "true";
        }
        
        setSdmsSettings(nextSdmsSettings);

        const transformedData = transformSettings(
            nextSdmsSettings,
            sopSettings,
            etcSettings,
            userInfo.site_sn
        );

        doSave(transformedData, { mode: "reset", userOptionsOverride: tempUserOptions});
        setNeedToSave(false);
    }
    
    return (
        <ModalBackground className={'UI_Section'}>
            <LayoutSettingComponent className={'UI_Section'}>
                <div>
                    <div className='menuWrap'>
                        <h2>환경설정</h2>
                        {
                            getTabMenus()
                        }
                    </div>

                    {getDisplayView()}

                    <div className='btnWrap'>
                        <BoxButton
                            variant="ghost"
                            size="sm"
                            onClick={() => props.handlePopup('setting', false)}
                        >
                            취소
                        </BoxButton>
                        <BoxButton
                            variant="fill"
                            size="sm"
                            disabled={!needToSave}
                            onClick={() => onClickSave()}
                        >
                            적용
                        </BoxButton>
                    </div>
                </div>
            </LayoutSettingComponent>
            {
                showSpread &&
                <SpreadManager
                    setShowSpread={setShowSpread}
                    sensorTypes={sensorTypes}
                    sensorList={sensorList}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    handleToast={handleToast}
                />
            }
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