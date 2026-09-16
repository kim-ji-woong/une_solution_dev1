import React, { useState, useEffect, useRef } from 'react';

import SopSimulatorCall from './sopSimulatorCall';
import SopSimulatorBody from './sopSimulatorBody';

import SopSimulatorResource from "../resource/id";
import SopController from '../../SOPManager/services/sopController';
import SopSimulatorController from '../services/sopSimulatorController';

import store from '../../Root/store';
import SettingsStore from '../../Settings/settingsStore';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';

import ConfirmDialog from '../../Common/ui/confirmDialog';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import SectionData from '../../Common/models/sections/sectionData';
import { SettingController } from '../../Settings/services/settingController';

function SopSimulator(props) {
    const [sopDatas, setSopDatas] = useState([]);               // 실행중인 전체 SOP 리스트

    const [selectedSiteNo, setSelectedSiteNo] = useState(null);
    const [content, setContent] = useState(SopSimulatorResource.menu.SOP_불러오기);
    const [sopTabIndex, setSopTabIndex] = useState(-1);
    const [currentActionStep, setCurrentActionStep] = useState(null);
    const [currentSopTabKey, setCurrentSopTabKey] = useState('');
    const [viewSopDatas, setViewSopDatas] = useState([]);       // 권한별 보여줄 SOP 리스트
    const [teamDatas, setTeamDatas] = useState([]);
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null,
        check: false,
        checkMessage: null
    });
    const [commonSettings, setCommonSettings] = useState({});

    // loadSOP시 state값 currentSopTabKey와 currentActionStep를 읽어오지 못하므로 ref에 값을 저장하여 활용
    const currentSopTabKeyRef = useRef(currentSopTabKey);
    const currentActionStepRef = useRef(currentActionStep);
    const viewSopDatasRef = useRef(viewSopDatas);
    const isFirstRef = useRef(true);

    useEffect(() => {
        currentSopTabKeyRef.current = currentSopTabKey;
    }, [currentSopTabKey]);

    useEffect(() => {
        currentActionStepRef.current = currentActionStep;
    }, [currentActionStep]);

    useEffect(() => {
        viewSopDatasRef.current = viewSopDatas;
    }, [viewSopDatas]);

    useEffect(() => {
        const settingSubscribe = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();
            
            if (data.actionType === 'COMMON_SETTINGS') {
                changeSOPCommonSettings(data.commonSettings);
            } else if (data.actionType === 'SELECT_SITENO') {
                changeSelectSiteNo(data.selectSiteNo);
            }
        });

        return () => {
            settingSubscribe();
        }
    }, []);

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'SOP_HISTORY') {
                loadSOP(store.getState(), currentSopTabKeyRef.current, currentActionStepRef.current);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        loadActionStepNames();
        loadSopCommonSettings();

        // 타이틀바 클릭 이벤트 핸들러
        props.menuEvent.onClickLogo = onClickLogo;
    }, []);

    useEffect(() => {
        if (!selectedSiteNo) {
            reloadSiteNo();
        }
    })

    useEffect(() => {
        if (isFirstRef.current && store.getState().sopHistory?.actionStepHistoryDatas && sopDatas.length === 0) {
            loadSOP(store.getState(), currentSopTabKeyRef.current, currentActionStepRef.current, isFirstRef.current);
        }
    }, [])

    const reloadSiteNo = async () => {
		let site_sn = ProjectResource.site_sn;
        
		if (site_sn === null || site_sn === undefined) {
            const userInfo = ProjectResource.getUserInfo();
			site_sn = userInfo?.site_sn;
		}
        
        setSelectedSiteNo(site_sn);
	}

    const loadActionStepNames = async () => {
        // 각 사이트별 단계배열 및 단계명 초기화
        const userInfo = ProjectResource.getUserInfo();

        if(userInfo) {
            await SopController.loadActionStepNames(userInfo.site_sn);
        }
    }

    const loadSopCommonSettings = async () => {
        const userInfo = ProjectResource.getUserInfo();

        if(userInfo) {
            const [settings, message] = await SettingController.requestSetting(userInfo.site_sn);

            if (!settings) {
                console.log(message);
                return;
            }
            else {
                changeSOPCommonSettings(settings);
            }
        }
    }

    const loadSOP = async (storeValue, sopTabKey, actionStep, isFirst) => {
        if (storeValue && storeValue.actionType !== 'SOP_HISTORY' && !isFirst)
            return;

        if (!storeValue.sopHistory)
            return;

        let newSelectedSiteNo = selectedSiteNo;
        const userInfo = await ProjectResource.initUserInfo();
        if (selectedSiteNo === null) {            
            if (userInfo) {
                // site 여러개일 경우 전체 (-1)로 업데이트
                if (userInfo.grad_sn === AccountResource.accountLevelNo.master) {
                    if (ProjectResource.sites.length > 0 && userInfo.grad_sn === AccountResource.accountLevelNo.master) {
                        newSelectedSiteNo = -1;
                    }
                    else {
                        newSelectedSiteNo = userInfo.showSiteNo;
                    }
                }
                else {
                    newSelectedSiteNo = userInfo.site_sn;
                }
            }
        }
                        
        const sopHistories = checkAlreadySOP(storeValue.sopHistory.actionStepHistoryDatas);
        
        // 마지막으로 조작된 ActionStepHistory의 ID 구하기
        const lastAccessActionStepHistoryNo = storeValue.sopHistory.lastAccessActionStepHistoryNo;

        if (sopHistories === null || sopHistories.length === 0) {
            setSopDatas([]);
            setViewSopDatas([]);
            setContent(SopSimulatorResource.menu.SOP_불러오기);
            setSopTabIndex(-1);
            setCurrentSopTabKey('');
            setSelectedSiteNo(newSelectedSiteNo);

        }
        else {
            if (sopHistories.length !== viewSopDatas.length && sopHistories.length > 0) {
                loadTeamDatas();
            }

            let sopTabIndex = 0;
            let newCurrentSopTabKey = sopTabKey;
            let newCurrentActionStep = actionStep;
            let currentSopData = null;

            let viewSopHistoriesDump = [];
            let allSopHistoriesDump = [];

            // sop key : disasterCategoryID + "/" + subDisasterCategoryID + "/" + disasterID

            // 각 SOP마다 표시할 단계, 화살표등 설정
            const historyLength = sopHistories.length;            
            for (let i = 0; i < historyLength; i++) {
                const sopHistory = sopHistories[i];

                if (userInfo && /* userInfo.grad_sn !== AccountResource.accountLevelNo.master && */ userInfo.site_sn !== sopHistory.version.site_sn) {
                    continue;
                }

                // 각 SOP의 Detail을 세팅한다 (ex: process의 checkbox checked 여부)
                setSopDetails(sopHistory.actionStepDatas);

                // 각 SOP의 현재 단계 설정
                setCurrentActionStep2(sopHistory, lastAccessActionStepHistoryNo);

                checkArrows(sopHistory);
                // await checkStepMembers(sopHistory);

                allSopHistoriesDump.push(sopHistory);

                // 모든 SOP를 볼수있는 권한이고, 지금 선택된 SITE의 SOP일때
                if (newSelectedSiteNo === -1 || newSelectedSiteNo === sopHistory.version.site_sn) {
                    viewSopHistoriesDump.push(sopHistory);
                }           
                
            }

            // 표시할 SOP 설정
            // 옵션1 : 새로운 이력이 있어도 현재 Client가 보고 있던 SOP를 유지한다                    
            // 옵션2 : 새로운 이력이 있다면 (다른 Client가 실행한) SOP로 이동한다
            const optionIndex = 1; // 옵션에 없으므로 일단 고정
            const historyDumpLength = viewSopHistoriesDump.length;
            for (let i = 0; i < historyDumpLength; i++) {
                const sopHistory = viewSopHistoriesDump[i];
                if (userInfo.grad_sn !== AccountResource.accountLevelNo.master && userInfo.site_sn !== sopHistory.currentActionStep.siteNo) {
                    continue;
                }

                if (optionIndex === 1 && sopTabKey.length > 0 && sopHistory.key === sopTabKey) {                    
                    sopTabIndex = i;
                    newCurrentSopTabKey = sopTabKey;
                    currentSopData = sopHistory.sopData;
                    break;
                }
                else if (optionIndex === 2) {
                    if (true) { // lastAccessActionStepHistoryNo 일치하는 SOP 찾기
                        sopTabIndex = i;
                        newCurrentSopTabKey = sopTabKey;
                        currentSopData = sopHistory.sopData;
                        break;
                    }
                }
                else {
                    for (let j = 0; j < sopHistory.actionStepDatas.length; j++) {
                        if (sopHistory.actionStepDatas[j].actionStepHistory === null) {
                            continue;
                        }

                        
                        sopTabIndex = i;
                        newCurrentSopTabKey = sopHistory.key;
                        newCurrentActionStep = sopHistory.actionStepDatas[j];
                        currentSopData = sopHistory;

                        if (sopHistory.actionStepDatas[j].actionStepHistory.action_step_hist_sn === lastAccessActionStepHistoryNo) {
                            break;
                        }                        
                    }                    
                }
            }

            let closeSOPHistoryID = null;
            let confirmDialogData = null;

            // 확인 후 자동종료할 SOP가 있나 ?
            // const closeSOPs = storeValue.sopHistory.confirmTimeoutCloseSOPs ? [...storeValue.sopHistory.confirmTimeoutCloseSOPs] : [];
            const closeSOPs = [];
            for (let i = 0; i < sopHistories.length; i++) {
                const sopHistory = sopHistories[i];

                if (sopHistory.confirmTimeoutCloseSOP) {
                    closeSOPs.push(sopHistory.actionStepHistory.action_step_hist_sn);
                }
            }
            
            if (closeSOPs.length > 0) {
                closeSOPHistoryID = closeSOPs[0];
                for (let i = 0; i < historyLength; i++) {
                    const sopHistory = sopHistories[i];

                    if (sopHistory.actionStepHistory.action_step_hist_sn === closeSOPHistoryID) {
                        sopTabIndex = i;
                        // newCurrentSopTabKey = sopHistory.key;
                        newCurrentActionStep = sopHistory.actionStepHistory;
                        currentSopData = sopHistory;
                        confirmDialogData = sopHistory.actionStepHistory;
                        break;
                    }
                }

                if (confirmDialogData) {
                    let message = '대기시간 자동 종료시간이 경과되어 SOP를 종료합니다';
                    if (confirmDialogData.sensor_zone_his_sn && confirmDialogData.sensor_zone_his_sn > 0) {
                        message = '신호 복구 후 자동 종료시간이 경과되어 SOP를 종료합니다';
                    }
                    showConfirmDialog(ProjectResource.dialogTypes.INFO, [message], null, confirmDialogCloseSOP);
                }
            }

            if (viewSopHistoriesDump.length === 0) {
                setSopDatas([]);
                setViewSopDatas([]);
                setContent(SopSimulatorResource.menu.SOP_불러오기);
                setSopTabIndex(-1);
                setCurrentSopTabKey('');
                setSelectedSiteNo(newSelectedSiteNo);
            }
            else {
                if (isFirstRef.current) {
                    isFirstRef.current = false;
                }

                setContent(SopSimulatorResource.menu.SOP_실행);
                setViewSopDatas(viewSopHistoriesDump);
                setSopDatas(allSopHistoriesDump);
                setSopTabIndex(sopTabIndex);
                setCurrentSopTabKey(newCurrentSopTabKey);
                setCurrentActionStep(newCurrentActionStep);
                setSelectedSiteNo(newSelectedSiteNo);
            }
        }
    }

    const loadTeamDatas = async () => {
        const teamDatas = [];
        [teamDatas.regular] = await TeamEditController.displayBasicRegular(selectedSiteNo);
        [teamDatas.regularMember] = await TeamEditController.displayRegularMember(selectedSiteNo);
        [teamDatas.normal] = await TeamEditController.displayTemporary(true, selectedSiteNo);
        [teamDatas.emergency] = await TeamEditController.displayTemporary(false, selectedSiteNo);

        setTeamDatas(teamDatas);
    }

    const changeSelectSiteNo = (site_sn) => {
        if (site_sn && site_sn !== selectedSiteNo) {
            setSelectedSiteNo(site_sn);
		}
    }

    const changeSOPCommonSettings = (storeValue) => {
        const setting = storeValue.find(item => item.categoryType === 'SOP');
        if (setting) {
            const transformedSettings = {};

            setting.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setCommonSettings(transformedSettings);
        }
    }

    // 수동 시작해서 실행전인 SOP는 DB입력이 되어있지 않기 때문에 DB 변경이 되서 loadSOP 함수가 호출되면 사라진다
    // 그러므로 전 state랑 비교해서 수동 시작해서 실행전인 SOP를 직접 list에 포함시킨다
    const checkAlreadySOP = (sopRunDatas) => {
        const oldSopDatas = viewSopDatasRef.current;

        if (!oldSopDatas || oldSopDatas.length === 0) {
            return sopRunDatas;        
        }

        let newSopDatas = [];       

        for (let i = 0; i < oldSopDatas.length; i++) {
            // 변경된 DB에 동일한 SOP가 있으면 넣지 않는다 > 어차피 뒤에서 넣을거야 
            // 뒤에서 넣는 이유는 SOP 순서 때문에 (수동 실행한 SOP를 앞에 배치함)
            let match = false;
            for (let j = 0; j < sopRunDatas.length; j++) {
                if (oldSopDatas[i].key === sopRunDatas[j].key) {
                    newSopDatas.push(sopRunDatas[j]);
                    match = true;
                    break;
                }
            }

            if (!match) {
                // actionStepHistory가 없으면 실행 전 SOP이다 (띄워지기만 함, DB에 정보 없음)
                if (!oldSopDatas[i]?.currentActionStep?.actionStepHistory) {
                    newSopDatas.push(oldSopDatas[i]);
                }
            }            
        }

        for (let i = 0; i < sopRunDatas.length; i++) {

            let match = false;
            for (let j = 0; j < newSopDatas.length; j++) {
                if (sopRunDatas[i].key === newSopDatas[j].key) {
                    newSopDatas[j] = sopRunDatas[i];
                    match = true;
                    break;
                }
            }

            if (!match) {
                newSopDatas.push(sopRunDatas[i]);
            }
        }

        return newSopDatas;
    }

    // sensorZoneHistoryID : 센서 신호를 통해 열리는 sop는 자동 시작한다
    const openDB = async (sclas_sn, alarm) => {      
        const [sopDataResult, /*message*/] = await SopController.requestOpenDB(sclas_sn);

        if (sopDataResult && sopDataResult.success) {
            let loadSopDatas = sopDatas;
            let newViewSopDatas = viewSopDatas;
            let sopTabIndex = checkOpenSOP(sopDataResult.sopData);
            
            if (sopTabIndex > -1) {
                setContent(SopSimulatorResource.menu.SOP_실행);
                setSopDatas(loadSopDatas);
                setSopTabIndex(sopTabIndex);
            }
            else {                                
                handleCurrentActionStep(sopDataResult.sopData);
                checkArrows(sopDataResult.sopData);
                await checkStepMembers(sopDataResult.sopData);

                loadTeamDatas();

                const newSOP = sopDataResult.sopData;
                newSOP.key = sopDataResult.sopData.disasterCategory.lclas_sn + '/' + sopDataResult.sopData.subDisasterCategory.mclas_sn + '/' + sopDataResult.sopData.disaster.sclas_sn;
                newSOP.actionStepDatas[0].sopKey = sopDataResult.sopData.disasterCategory.lclas_sn + '/' + sopDataResult.sopData.subDisasterCategory.mclas_sn + '/' + sopDataResult.sopData.disaster.sclas_sn;
                //newSOP.position = null;
                //newSOP.sensor_zone_his_sn = null;
                //newSOP.sopData = sopDataResult.sopData;
                //newSOP.site_sn = sopDataResult.sopData.version.site_sn;// selectedSiteNo;

                loadSopDatas.push(newSOP); // 열려있는 SOP 중에서 마지막에 추가
                newViewSopDatas.push(newSOP);
                sopTabIndex = newViewSopDatas.length - 1; // 열려있는 SOP 중에서 마지막 index

                setContent(SopSimulatorResource.menu.SOP_실행);
                setSopDatas(loadSopDatas);
                setViewSopDatas(newViewSopDatas);
                setSopTabIndex(sopTabIndex);
                setCurrentActionStep(sopDataResult.sopData.currentActionStep);
                setCurrentSopTabKey(newSOP.key);
            }
        }
    }

    // 같은 sop가 이미 열려있는지 체크
    const checkOpenSOP = (newSopData) => {        
        if (viewSopDatas === null || viewSopDatas.length === 0)
            return -1;

        const sopKey = newSopData.disasterCategory.lclas_sn + '/' + newSopData.subDisasterCategory.mclas_sn + '/' + newSopData.disaster.sclas_sn;

        for (let i = 0; i < viewSopDatas.length; i++) {
            if (viewSopDatas[i].key === sopKey)
                return i;
        }

        return -1;
    }

    const setCurrentActionStep2 = async (sopHistory, lastActionStepHistoryID) => {
        if (!sopHistory.actionStepDatas)
            return;

        //마지막으로 조작한 ActionStepHistory가 있으면 그걸로 설정
        for (let k = 0; k < sopHistory.actionStepDatas.length; k++) {
            const actionStepData = sopHistory.actionStepDatas[k];
            if (actionStepData.actionStepHistory && actionStepData.actionStep !== null && actionStepData.actionStepHistory.action_step_hist_sn === lastActionStepHistoryID) {
                sopHistory.currentActionStep = actionStepData;
                return;
            }
        }

        // 없으면 큰걸로 설정
        for (let k = sopHistory.actionStepDatas.length -1; k >= 0; k--) {
            const actionStepData = sopHistory.actionStepDatas[k];
            if (actionStepData.actionStep !== null) {
                sopHistory.currentActionStep = actionStepData;
                return;
            }
        }
    }

    const setSopDetails = (actionStepDatas) => {
        for (const actionStep of actionStepDatas) {
            if (actionStep.componentHistories) {
                if (actionStep.componentHistories.length === 0) continue;
        
                const sections = actionStep.stepMemberDatas[0].sections;
        
                for (const history of actionStep.componentHistories) {
                    if (history.componentHistoryDetails.length === 0) continue;
        
                    const section = sections.find((item) => history.compn_sn === item.component.compn_sn);
                    if (!section) continue;
        
                    if (history.compn_code === SectionData.ProcessType) {
                        updateProcessSection(section, history.componentHistoryDetails[0]);
                    } else if (history.compn_code === SectionData.InternalType) {
                        updateInternalSection(section, history.componentHistoryDetails[0]);
                    }
                }
            }
        }
    };
    
    const updateProcessSection = (section, historyDetail) => {
        const missions = section.process.missions;
        const { data_no, data_intgr } = historyDetail;
    
        if (missions[data_no]) {
            missions[data_no].checked = data_intgr === 1;
        }
    
        section.checked = missions.every((mission) => mission.checked);
    };
    
    const updateInternalSection = (section, historyDetail) => {
        section.checked = historyDetail.data_intgr === 1;
    };
        
    const handleCurrentActionStep = (sopData, actionStepID, lastActionStepHistoryID) => {
        if (!sopData.actionStepDatas || sopData.actionStepDatas === null)
            return;

        let check = false;
        for (let k = 0; k < sopData.actionStepDatas.length; k++) {
            const actionStepData = sopData.actionStepDatas[k];
            if (actionStepData.actionStep) {
                if (lastActionStepHistoryID > 0) {
                    if (actionStepData._ActionStepHistory && lastActionStepHistoryID === actionStepData._ActionStepHistory.id) {
                        sopData.currentActionStep = actionStepData;
                        check = true;
                        break;
                    }
                }
                else {
                    if (actionStepID) {
                        if (actionStepData.actionStep.action_step_sn === actionStepID) {
                            sopData.currentActionStep = actionStepData;
                            break;
                        }
                    }
                    else {
                        sopData.currentActionStep = actionStepData;
                    }
                }
            }
        }

        if (!check) {
            for (let k = 0; k < sopData.actionStepDatas.length; k++) {
                const actionStepData = sopData.actionStepDatas[k];
                if (actionStepData.actionStep) {
                    if (actionStepData.actionStepHistory && lastActionStepHistoryID === actionStepData.actionStepHistory.action_step_hist_sn) {
                        sopData.currentActionStep = actionStepData;
                        break;
                    }
                    else {

                        if (actionStepID) {
                            if (actionStepData.actionStep.action_step_sn === actionStepID) {
                                sopData.currentActionStep = actionStepData;
                                break;
                            }
                        }
                        else {
                            sopData.currentActionStep = actionStepData;
                        }
                    }
                }
            }
        }
    }

    const checkArrows = (sopData) => {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;

            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];
                const stepMemberCount = actionStepData.stepMemberDatas.length;

                for (let j = 0; j < stepMemberCount; j++) {
                    const stepMemberData = actionStepData.stepMemberDatas[j];

                    if (stepMemberData.arrows.length > 0) {
                        stepMemberData.resetArrows = true;
                    }
                }
            }
        }
    }

    const checkStepMembers = async (sopData) => {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;

            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];

                if (actionStepData.stepMemberDatas.length === 0) {
                    const stepMemberData = await SopController.requestDefaultStepMemberData(actionStepData);

                    if (!stepMemberData) {
                        // showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                        return false;
                    }
                }
            }
        }

        return true;
    }

    const getMakeDateTime = (dateTime) => {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

        return strDate;
    }

    const confirmDialogCloseSOP = async (index) => {        
        const actionStepHistory = confirmDialogData
        if (actionStepHistory) {
            const endTime = getMakeDateTime(new Date());
            actionStepHistory.end_time = endTime;

            await closeSOP(null, actionStepHistory.action_step_hist_sn, actionStepHistory.end_time, null);
        }
        confirmDialogData = undefined;
        onCloseConfirmDialog();
    }

    const closeSOP = async (tabIndex, actionStepHistoryNo, endTime, accessedUserID) => {
        if (actionStepHistoryNo && actionStepHistoryNo > 0) {
            await SopSimulatorController.closeSOPByUser(actionStepHistoryNo, endTime, accessedUserID);
        }
        else {
            // 시작전
            closeSopData(tabIndex);
        }
    }

    const closeSopData = (index) => {
        if (!sopDatas[index].position) {
            let sopTabIndexTemp = -1;
            let sopDatasCopy = sopDatas;
            let viewSopDatasCopy = viewSopDatas;

            // SOP 시작전이라면 통으로 없애기
            sopDatasCopy.splice(index, 1);
            viewSopDatasCopy.splice(index, 1);

            if (sopDatasCopy.length > 0) {
                sopTabIndexTemp = viewSopDatasCopy.length - 1;
            }
            if (sopTabIndexTemp < 0) {
                setSopDatas(sopDatasCopy);
                setViewSopDatas(viewSopDatasCopy);
                setSopTabIndex(-1);
                setContent(SopSimulatorResource.menu.SOP_불러오기);
                setCurrentSopTabKey('');
            }
            else {
                setSopDatas(sopDatasCopy);
                setViewSopDatas(viewSopDatasCopy);
                setSopTabIndex(sopTabIndexTemp);
                setCurrentSopTabKey(sopDatasCopy[sopTabIndexTemp].key);
            }
        }
    }

    const changeContent = (content, versionID) => {        
        if (content === SopSimulatorResource.menu.SOP_불러오기) {
            setContent(content);
        }
        else if (content === SopSimulatorResource.menu.SOP_실행) {
            if (versionID) {
                openDB(versionID, null);
            }
        }
    }

    const onChangeTab = (index) => {
        setSopTabIndex(index);
        setCurrentSopTabKey(sopDatas[index].key);
        setCurrentActionStep(sopDatas[index].currentActionStep);
    }

    // 단계 변경
    const onChangeStep = async (stepID, stepName) => {        
        var newSopDatas = sopDatas;

        const sopData = newSopDatas[sopTabIndex];
        
        for (var i = 0; i < sopData.actionStepDatas.length; i++) {
            const actionStepData = sopData.actionStepDatas[i];
            if (actionStepData.actionStep && actionStepData.actionStep.action_step_sn === stepID) {
                handleCurrentActionStep(sopData, stepID);
                setCurrentActionStep(actionStepData);
                break;
            }
        }
    }

    const onClickLogo = () => {
        changeContent(SopSimulatorResource.ID.menu.callSOP);
    }

    const onSelectMenu = (menu, param) => {
        // SOP 불러오기 버튼을 클릭 시
        if (menu === SopSimulator.resource.ID.menu.callSOP) {
            if (content === SopSimulatorResource.menu.SOP_불러오기 && sopDatas.length !== 0) {
                setContent(SopSimulatorResource.menu.SOP_실행);
            } else {
                setContent(SopSimulatorResource.menu.SOP_불러오기);
            }   
        }
    }

    const showConfirmDialog = (type, messages, buttons, onClickButton, check = false, checkMessage = '') => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;
        confirmInfo.check = check;
        confirmInfo.checkMessage = checkMessage;

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

    let ui = <></>;
    if (content === SopSimulatorResource.menu.SOP_불러오기) {
        ui = <>
            <SopSimulatorCall
                openDB={openDB}
                onSelectMenu={onSelectMenu}
                selectedSiteNo={selectedSiteNo}
            />
        </>
    } else if (content === SopSimulatorResource.menu.SOP_실행) {
        ui = <>
            <SopSimulatorBody
                id={'SopSimulatorBody'}
                changeContent={changeContent}
                sopDatas={sopDatas}
                sopTabIndex={sopTabIndex}
                onChangeTab={onChangeTab}
                closeSOP={closeSOP}
                onChangeStep={onChangeStep}
                showConfirmDialog={showConfirmDialog}
                onCloseConfirmDialog={onCloseConfirmDialog}
                currentSopTabKey={currentSopTabKey}
                currentActionStep={currentActionStep}
                teamDatas={teamDatas}
                commonSettings={commonSettings}
            />
        </>
    }

    return (
        <>
            {ui}
            {
                /* alert창 대신 사용 */
                confirmMessage.visible &&
                <ConfirmDialog 
                    type={confirmMessage.type}
                    messages={confirmMessage.messages} 
                    buttons={confirmMessage.buttons} 
                    onClickButton={confirmMessage.onClickButton}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    check={confirmMessage.check}
                    checkMessage={confirmMessage.checkMessage}
                />
            } 
        </>
    );
}

export default SopSimulator;