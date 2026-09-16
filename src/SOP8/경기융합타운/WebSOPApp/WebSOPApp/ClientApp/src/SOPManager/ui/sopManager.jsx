import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import SopManagerContent from './sopManagerContent';

import $ from 'jquery';
import SopManagerBody from './sopManagerBody';
import SopManagerResource from '../resource/id';
import OpenSOPOptions from './popup/openSOPOptions';
import DeleteSOPOptions from './popup/deleteSOPOptions';
import SaveSOPOptions from './popup/saveSOPOptions';
import SopController from '../services/sopController';

import SessionString from '../../Common/js/sessionString';
import SopDataManager from '../services/sopDataManager';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';

import ProjectResource from '../../Root/resource/id';
import { SDMSController } from '../../SDMS/services/sdmsController';

import ConfirmDialog from '../../Common/ui/confirmDialog';
import AccountResource from '../../Account/resource/id';
import RootResource from '../../Root/resource/id';

import SettingsStore from '../../Settings/settingsStore';
import { SopManagerComponent } from '../../SOPManager/styled/managerStyled';

function SopManager(props) {
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);
    const [content, setContent] = useState(props.menu);
    const [menuDatas, setMenuDatas] = useState(null);
    const [showCascading, setShowCascading] = useState({
        actionStep: false,
        addComponent: false,
        specialCharacter: false,
        userDefined: false
    });
    const [loginUser, setLoginUser] = useState(null);
    const [sopData, setSopData] = useState(null);

    const [tooltipState, setTooltipState] = useState({
        showTooltip: false,
        tooltipTop: 0,
        tooltipLeft: 0,
        tooltipContent: ''
    });

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });
    
    const refFileDialog = useRef();
    let bNeedToSave = false; // 저장이 필요한지 (사이트변경할때 저장안된내역있으면 저장하고 넘어감)

    const deleteSOPOptionsRef = useRef();

    useEffect(() => {
        loadActionStepNames();

        // 각 페이지 별로 클래스 초기화
        $('#subPage').addClass('sop');

        initUserInfo();
        processGetParameters(window.location.search);

        const unsubscribe_SettingsStore = SettingsStore.subscribe(() => {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITENO') {
                changeSelectSiteNo(data.selectSiteNo);
            }
        });

        return () => {
            unsubscribe_SettingsStore();
        };
    }, []);

    const changeSelectSiteNo = (siteNo) => {
        if (siteNo && siteNo !== selectedSiteNo) {
            onChangeSite(siteNo);
		}
    }

    const loadActionStepNames = async () => {
        // 각 사이트별 단계배열 및 단계명 초기화
        await SopController.loadActionStepNames();
    }

    const handleTooltip = (e, data) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {
            setTooltipState(prevState => ({
                ...prevState,
                showTooltip: !prevState.showTooltip,
                tooltipTop: parentNode.top - 17,
                tooltipLeft: parentNode.left,
                tooltipContent: data
            }));
        }
    }

    const removeTooltip = () => {
        setTooltipState({
            showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: ''
        });
    }

    const processGetParameters = (parameters) => {
        if (!parameters || parameters.length === 0) {
            return;
        }

        parameters = parameters.substring(1).trim();

        const params = parameters.split('&');
        const paramCount = params.length;

        for (let i = 0; i < paramCount; i++) {
            const datas = params[i].split('=');

            if (datas.length !== 2) {
                continue;
            }

            const paramName = datas[0].trim();
            const paramValue = datas[1].trim();

            if (paramName.toLowerCase() === "sop") {
                const versionID = parseInt(paramValue);

                if (versionID !== null && versionID !== undefined && isNaN(versionID) === false) {
                    openDB(versionID);
                    break;
                }
            }
        }
    }

    const initUserInfo = async () => {
        // 권한 체크
        const userInfo = await ProjectResource.initUserInfo();
        if (!userInfo || userInfo === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['로그인 정보가 없습니다'], null, onClickFalseConfirm);
            return;
        }

        if (userInfo.levelNo !== AccountResource.accountLevelID.master &&
            userInfo.levelNo !== AccountResource.accountLevelID.admin) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['권한이 없습니다'], null, onClickFalseConfirm);
        }

        // Multi Site
        if (selectedSiteNo === null && ProjectResource.sites && ProjectResource.sites.length > 0) {            
            if (userInfo.levelNo === AccountResource.accountLevelID.master) {
                selectedSiteNo = ProjectResource.sites[0].id;
            } else if (userInfo.levelNo === AccountResource.accountLevelID.admin) {
                for (let i = 0; i < ProjectResource.sites.length; i++) {
                    if (ProjectResource.sites[i].id === userInfo.siteNo) {
                        selectedSiteNo = ProjectResource.sites[i].id;
                        break;
                    }
                }
            }
        }

        setLoginUser(userInfo);
        setSelectedSiteNo(selectedSiteNo);
    }

    const onClickFalseConfirm = () => {
        // 루트로 이동
        props.history.push(RootResource.path.root);
    }

    const reloadSiteNo = async () => {
        let siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteNo();

            if (result !== null && result !== undefined) {
                siteNo = result;
            }
        }

        return siteNo;
    }

    const changeContent = (content, menuDatas, showDlg) => {
        if (content === SopManagerResource.menu.editSOP) {
            if (menuDatas) {
                setContent(content);
                setSopData(menuDatas);
                setMenuDatas(menuDatas);
                setShowCascading({
                    actionStep: true,
                    addComponent: showCascading.addComponent,
                    specialCharacter: showCascading.specialCharacter,
                    userDefined: showCascading.userDefined
                });
            }
            else {
                setContent(content);
                setSopData(menuDatas);
                setMenuDatas(menuDatas);
            }
        }
        else if (content === SopManagerResource.menu.save) {
            if (showDlg) {
                setContent(content);
                setSopData(menuDatas);
                setMenuDatas(menuDatas);
            }
            else {
                saveDB(menuDatas);
            }
        }
        else if (content === SopManagerResource.menu.saveXML) {
            saveXML(menuDatas);
        }
        else if (content === SopManagerResource.menu.open) {
            if (menuDatas === null) {
                setContent(content);
                setMenuDatas(menuDatas);
            }
            else {
                openDB(menuDatas);
            }
        }
        else if (content === SopManagerResource.menu.delete) {
            if (menuDatas !== null) {
                deleteDB(menuDatas);
            }

            setContent(content);
            setMenuDatas(menuDatas);
        }
        else if (content === SopManagerResource.menu.openXML) {
            openXML();
        }
        else {
            setContent(content);
            setMenuDatas(menuDatas);
        }
    }

    const deleteDB = async (params) => {
        const versionIDs = params[0];
        const obj = params[1];
        const isNormal = params[2];
        const [success, message] = await SopController.requestDeleteDB(versionIDs);

        if (success) {
            deleteSOPOptionsRef.current.postDeleteMethod(obj, isNormal);

            if (isCurrentVersion(versionIDs)) {
                clearSOP();
            }

            showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['삭제되었습니다'], null, null);
        }
        else {
            if (message && message.length > 0) {
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }
    }

    const isCurrentVersion = (versionIDs) => {
        if (!versionIDs) {
            return false;
        }

        if (sopData?.disaster) {
            const disaster = { ...sopData.disaster };

            for (const versionID of versionIDs) {
                if (versionID === disaster.versionID) {
                    return true;
                }
            }
        }

        return false;
    }

    const openDB = async (versionID) => {
        const [sopDataResult, message] = await SopController.requestOpenDB(versionID);

        if (sopDataResult && sopDataResult.success) {
            // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
            clearSOP();

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            setCurrentActionStep(sopDataResult.sopData);
            checkArrows(sopDataResult.sopData);
            await checkStepMembers(sopDataResult.sopData);

            setContent(SopManagerResource.menu.editSOP);
            setSopData(sopDataResult.sopData);
            setMenuDatas(sopDataResult.sopData);
            setShowCascading({
                actionStep: true,
                addComponent: showCascading.addComponent,
                specialCharacter: showCascading.specialCharacter,
                userDefined: showCascading.userDefined
            });
        }
        else {
            setContent(SopManagerResource.menu.editSOP);
            setMenuDatas(sopData);

            alert(message);
        }
    }

    const getAllTreeDatas = async () => {
        const teamAllTreeDatas = {};
        
        teamAllTreeDatas.regular = await TeamEditController.DisplayRegular(selectedSiteNo);
        teamAllTreeDatas.normal = await TeamEditController.DisplayTemporary(true, selectedSiteNo);
        teamAllTreeDatas.emergency = await TeamEditController.DisplayTemporary(false, selectedSiteNo);

        return teamAllTreeDatas;
    }

    const openXML = () => {
        refFileDialog.current.click();
    }

    const checkStepMembers = async (sopData) => {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;
            
            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];

                if (actionStepData.stepMemberDatas.length === 0) {
                    const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStepData);

                    if (!stepMemberData) {
                        showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                        break;
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

    const setCurrentActionStep = (sopData) => {
        sopData.actionStepDatas.map(actionStepData => {
            if (actionStepData.actionStep) {
                sopData.currentActionStep = actionStepData;
            }
        });
    }

    const changeCascadingMode = (cascading, show) => {
        if (cascading === SopManagerResource.ID.cascadingMenu.actionStep) {
            setShowCascading({
                actionStep: show,
                addComponent: showCascading.addComponent,
                specialCharacter: showCascading.specialCharacter,
                userDefined: showCascading.userDefined
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.addComponent) {
            setShowCascading({
                actionStep: showCascading.actionStep,
                addComponent: show,
                specialCharacter: showCascading.specialCharacter,
                userDefined: showCascading.userDefined
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.specialCharacter) {
            setShowCascading({
                actionStep: showCascading.actionStep,
                addComponent: showCascading.addComponent,
                specialCharacter: show,
                userDefined: showCascading.userDefined
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.userDefined) {
            setShowCascading({
                actionStep: showCascading.actionStep,
                addComponent: showCascading.addComponent,
                specialCharacter: showCascading.specialCharacter,
                userDefined: show
            });
        }
    }

    const onSelectFile = (event) => {
        const file = event.target.files[0];
        refFileDialog.current.value = "";
        _openXML(file);
    }

    const _openXML = async (file) => {
        if (file) {
            const [sopDataResult, message] = await SopController.requestOpenXML(file);

            if (sopDataResult && sopDataResult.success) {
                // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
                clearSOP();

                // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
                sopDataResult.sopData.teamAllTreeDatas = await getAllTreeDatas();
                SopDataManager.setReceiverNames(sopDataResult.sopData);

                setCurrentActionStep(sopDataResult.sopData);
                checkArrows(sopDataResult.sopData);
                await checkStepMembers(sopDataResult.sopData);

                setContent(SopManagerResource.menu.editSOP);
                setSopData(sopDataResult.sopData);
                setMenuDatas(sopDataResult.sopData);
                setShowCascading({
                    actionStep: true,
                    addComponent: showCascading.addComponent,
                    specialCharacter: showCascading.specialCharacter,
                    userDefined: showCascading.userDefined
                });
            }
            else {
                setContent(SopManagerResource.menu.editSOP);
                setMenuDatas(sopData);
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }
    }

    const clearSOP = () => {
        setContent(SopManagerResource.menu.editSOP);
        setSopData(null);
        setMenuDatas(null);
        setShowCascading({
            actionStep: true,
            addComponent: showCascading.addComponent,
            specialCharacter: showCascading.specialCharacter,
            userDefined: showCascading.userDefined
        });
    }

    const saveXML = async (sopData) => {
        if (!sopData) {
            return;
        }

        const userID = loginUser ? loginUser.id : -1;
        const [sopDataResult, message] = await SopController.requestSaveXML(userID, sopData);

        if (sopDataResult === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        } 
    }

    const saveDB = async (sopData) => {
        if (!sopData) {
            return;
        }

        const userID = loginUser ? loginUser.id : -1;
        const [sopDataResult, message] = await SopController.requestSaveDB(userID, sopData);

        if (sopDataResult && sopDataResult.success) {
            checkArrows(sopDataResult.sopData);
            await checkStepMembers(sopDataResult.sopData);

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            setContent(SopManagerResource.menu.editSOP);
            setMenuDatas(sopDataResult.sopData);
            setSopData(sopDataResult.sopData);
            setShowCascading({
                actionStep: true,
                addComponent: showCascading.addComponent,
                specialCharacter: showCascading.specialCharacter,
                userDefined: showCascading.userDefined
            });
        }
        else {
            setContent(SopManagerResource.menu.editSOP);
            setMenuDatas(sopData);

            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const getPopup = () => {
        if (content === SopManagerResource.menu.open) {
            return <OpenSOPOptions sopData={sopData} content={changeContent} showConfirmDialog={showConfirmDialog} handleTooltip={handleTooltip} removeTooltip={removeTooltip} selectedSiteNo={selectedSiteNo} />;
        }
        else if (content === SopManagerResource.menu.delete) {
            return <DeleteSOPOptions ref={deleteSOPOptionsRef} sopData={sopData} content={changeContent} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} handleTooltip={handleTooltip} removeTooltip={removeTooltip} selectedSiteNo={selectedSiteNo} />;
        }
        /*else if (content === SopManagerResource.menu.save) {
            return <SaveSOPOptions sopData={sopData} content={changeContent} />;
        }*/

        return <></>;
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

    const getSiteList = () => {
        // 총괄관리자: 전체 건물 다 봄
        // 관리자: 해당하는 siteNo만 봄(실행 권한 있음)
        // 사용자: 해당하는 SiteNo만 봄(실행 권한 없음)
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor === AccountResource.accountLevelID.master) {
            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    <li onClick={() => onChangeSite(site.id)}>{site.siteName}</li>
                ))
            );
        } else if (userAuthor === AccountResource.accountLevelID.admin) {
            const userInfo = ProjectResource.getUserInfo();
            console.log(userInfo);

            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    site.id === userInfo.siteNo &&
                    <li>{site.siteName}</li>
                ))
            );
        }
    }

    const onChangeSite = (siteNo) => {
        if (selectedSiteNo === siteNo) {
            return;
        }

        if (bNeedToSave) {
            showConfirmDialog('저장', ['변경된 내용이 있습니다. 저장할까요?'], ['변경된 내용 저장', '변경된 내용 취소'], onNeedToSave);
        }

        setSelectedSiteNo(siteNo);
        setContent(SopManagerResource.menu.editSOP);
        setSopData(null);
        setMenuDatas(null);
    }

    const onNeedToSave = (index) => {
        if (index === 0) {
            //onClickSave();
        }

        onCloseConfirmDialog();
    }

    return (
        <SopManagerComponent>
            <div id={'subPage'} className='UI_Section'>
                {
                    tooltipState.showTooltip &&
                    <div id={'tooltipArea'} style={{ top: tooltipState.tooltipTop, left: tooltipState.tooltipLeft }}>
                        {tooltipState.tooltipContent}
                    </div>
                }
                <input ref={refFileDialog} className={'hidden'} type='file' accept='.sop' onChange={onSelectFile} />
                <div className={'subAside'}>
                    <SopManagerContent sopData={sopData} content={changeContent} loginUser={loginUser} />
                </div>

                <SopManagerBody menu={content} menuDatas={menuDatas} sopData={sopData} showCascading={showCascading} changeCascadingMode={changeCascadingMode} content={changeContent} loginUser={loginUser} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} />
                {
                    getPopup()
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
            </div>
        </SopManagerComponent>
    );
}

export default withRouter(SopManager);