import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import Clock from '../Common/ui/clock';
import pohang_logo from '../Common/images/pohang_logo.svg';
import menu from './images/menu.svg';
import setting from './images/setting.svg';
import user_menu from './images/user_menu.svg';
import sopBtn from './images/sopBtn.svg';

import LayoutSetting from '../Settings/ui/layoutSetting';
import MyPage from '../Account/ui/myPage';
import ChangePwd from '../Account/ui/changePwd';
import AccountManager from '../Account/ui/accountManager';
import AccountResource from '../Account/resource/id';
import { AccountController } from '../Account/services/accountController';
import SessionString from '../Common/js/sessionString';
import ConfirmDialog from '../Common/ui/confirmDialog';

import AccountStore from '../Account/accountStore';
import SettingsStore from '../Settings/settingsStore';
import { SDMSController } from '../SDMS/services/sdmsController';
import SopSimulatorController from '../SOPSimulator/services/sopSimulatorController';
import { SettingController } from '../Settings/services/settingController';
import {ExternalController} from "../SDMS/services/externalController";
import store from "./store";
import socketStore from "../SDMS/webSocket/socketStore";
import SettingsResource from "../Settings/resource/id";
import wsManager from "../SDMS/webSocket/wsManager";
import SdmsResource from "../SDMS/resource/id";

function TitleBar(props) {
    const [showSettingPopup, setShowSettingPopup] = useState(false);
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [showUserMenuPopup, setShowUserMenuPopup] = useState(false);
    const [showMyPagePopup, setShowMyPagePopup] = useState(false);
    const [showChangePwdPopup, setShowChangePwdPopup] = useState(false);
    const [showAccountManagerPopup, setShowAccountManagerPopup] = useState(false);
    const [showRangeFindingPopup, setShowRangeFindingPopup] = useState(false);
    const [showKeyMapPopup, setShowKeyMapPopup] = useState(false);
    const [autoRotation, setAutoRotation] = useState(false);
    const [reload, setReload] = useState(null);
    const [selectSiteNo, setSelectSiteNo] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });
    
    const [tempWebSocket, setTempWebSocket] = useState(null);

    useEffect(() => {

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();
        
        sendDataTo3D();

        // 선택 Site No 초기화
        initSelectSiteNo();
        
        // 새창으로 열린 브라우저에서 WebSocket이 없으면 클라이언트를 새로 만든다.
        checkWebSocket();
        
        window.onClickMenu = onClickMenu;
        
        const accountSubscription = AccountStore.subscribe(() => {
            let data = AccountStore.getState();

            if (data.actionType === 'LOGIN_STATE') {
                checkLoginState(data);
            } 
        });

        const settingSubscription = SettingsStore.subscribe(() => {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITENO') {
                changeSelectSiteNo(data.selectSiteNo);
            }
        });

        return () => {
            delete window.onClickMenu;
            accountSubscription();
            settingSubscription();
        };

    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const path = window.location.pathname;
            const isSopPage = 
                path === ProjectResource.path.sopSimulator || 
                path === ProjectResource.path.sopManager;

            const { id } = e.target;
            if (id === 'menuBtn' || id === 'userBtn') return;

            if (!(showMenuPopup || showUserMenuPopup)) return;

            const userMenu = document.getElementById('userMenu');
            const navMenu = document.getElementById('navMenu');

            // 메뉴 요소가 없으면 종료
            if (!navMenu || (!isSopPage && !userMenu)) return;

            // SOP 페이지는 navMenu만 닫기
            if (isSopPage) {
                setShowMenuPopup(false);
                return;
            }

            // 일반 페이지는 둘 다 닫기
            setShowMenuPopup(false);
            setShowUserMenuPopup(false);
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);

    }, [showMenuPopup, showUserMenuPopup]);
    
    const sendDataTo3D = async () => {
        const commonSettings = await SettingController.requestSetting(100, null, null);

        if (commonSettings?.[0]) {
            const target = commonSettings[0].find(item => item.categoryType === "SDMS");

            const cameraIdleTime = target?.settingDatas.find(setting => setting.name === "CameraIdleTime")?.value;

            const useReceiveData = target?.settingDatas
                .filter(setting => setting.name.includes("UseReceive"))
                .map(setting => ({
                    name: setting.name,
                    value: setting.value
                })) || [];

            const wsMgr = socketStore.getState().wsMgr;
            if (wsMgr && wsMgr.connected) {
                const idleParam = {
                    autoRotation: {
                        active: 1,
                        time: cameraIdleTime
                    }
                };
                const allowEvents = useReceiveData
                    .map(item => ({
                        poiType: SettingsResource.convertReceiveTypeStringToID(item.name),
                        value: item.value === 'TRUE'
                    }))
                    .filter(event => event.poiType !== -1);

                const useReceiveParam = { allowEvents };
                // WebSocket 요청 전송
                wsMgr.sendResponseAutoRotationSettings(idleParam);
                wsMgr.sendResponseAlarmLayerSettings(useReceiveParam);
            }
        }
    }
    
    const checkWebSocket = () => {
        
        let wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            setTempWebSocket(wsMgr);
            return;
        }
        
        if (!wsMgr) {
            wsMgr = new wsManager(SdmsResource.webSocketPort, null);
            setTempWebSocket(wsMgr);
        }
    }

    const initSelectSiteNo = async () => {
        const userInfo = await ProjectResource?.initUserInfo();
        const path = window?.location?.pathname;

        let site_sn = null;

        if (userInfo?.site_sn && path === ProjectResource?.path?.sdms) {
            site_sn = userInfo.site_sn;
        } else if (ProjectResource?.site_sn) {
            site_sn = ProjectResource.site_sn;
        }
        
        if (site_sn) {
            SettingsStore.dispatch({ type: 'SELECT_SITENO', selectSiteNo: site_sn });
        }
    }

    const changeSelectSiteNo = (site_sn) => {
        if (site_sn && site_sn !== selectSiteNo) 
            setSelectSiteNo(site_sn);
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

    const handlePopup = (type, isShow) => {
        if (type === 'setting') {
            setShowSettingPopup(isShow);
        }
        else if (type === 'accountManager') {
            let userInfo = ProjectResource.getUserInfo();

            if (userInfo.grad_sn !== AccountResource.accountLevelNo.master &&
                userInfo.grad_sn !== AccountResource.accountLevelNo.admin) {
                showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['해당 로그인 사용자는 권한이 없습니다.'], null, null);
                return;
            } 
            
            setShowAccountManagerPopup(isShow);
        }
        else if (type === 'menu') {

            if (!showMenuPopup && showUserMenuPopup) {
                setShowMenuPopup(true);
                setShowUserMenuPopup(false);
            }
            else {
                setShowMenuPopup(!showMenuPopup);
            }
        }
        else if (type === 'userMenu') {

            if (!showUserMenuPopup && showMenuPopup) {
                setShowUserMenuPopup(true);
                setShowMenuPopup(false);
            }
            else {
                setShowUserMenuPopup(!showUserMenuPopup);
            }
        }
        else if (type === 'myPage') {

            if (isShow) {
                setShowMyPagePopup(isShow);
                setShowChangePwdPopup(false);
            }
            else {
                setShowMyPagePopup(isShow);
            }
        }
        else if (type === 'changePwd') {

            if (isShow) {
                setShowChangePwdPopup(isShow);
                setShowMyPagePopup(false);
            }
            else {
                setShowChangePwdPopup(isShow);
            }
        }
        else if (type === 'rangeFinding') {
            setShowRangeFindingPopup(isShow);
        }
        else if (type === 'keyMap') {
            setShowKeyMapPopup(isShow);
        }
    }

    const onClickLogout = () => {
        showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['로그아웃 하시겠습니까?'], ['확인'], doLogout);
    }

    const doLogout = () => {
        // 계정 리덕스에 상태 업데이트
        AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: '로그아웃 되었습니다.' });
    }

    const onClickSysExit = () => {
        showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['시스템을 종료하시겠습니까?'], ['확인'], doSysExit);
    }

    const doSysExit = () => {
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            wsMgr.sendCheckExit();
        }
    }

    const checkLoginState = (data) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            // 로그아웃 시
            // 3D에서도 초기화가 필요하여 로그아웃 신호 필요
            const wsMgr = socketStore.getState().wsMgr;

            if (wsMgr && wsMgr.connected) {
                wsMgr.sendCheckLogout();
            }
            
            // 로그인 페이지로 이동
            props.history.push(ProjectResource.path.root);

            const site_sn = ProjectResource.site_sn;

            if (site_sn !== null && site_sn !== undefined) {
                window.localStorage.removeItem(SessionString.Key.account + "_" + site_sn.toString());
            }
        } else if (data.loginState === AccountResource.loginState.disconnected) {
            // 네트워크 연결 끊김 시
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], null, props.history.push(ProjectResource.path.root));
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], null, props.history.push(ProjectResource.path.root));
        } else if (data.loginState === AccountResource.loginState.login) {
            onCloseConfirmDialog();
        }
    }
    
    const onClickMenu = (path) => {

        const wsMgr = socketStore.getState().wsMgr ? socketStore.getState().wsMgr : tempWebSocket;
        if (wsMgr && wsMgr.connected) {
            let param = {
                menuType: null
            }
            
            if (path === ProjectResource.path.sdms) {
                param.menuType = 1
            } else if (path === ProjectResource.path.sopSimulator) {
                param.menuType = 2
            } else if (path === ProjectResource.path.sopManager) {
                param.menuType = 3
            } else if (path === ProjectResource.path.history) {
                param.menuType = 4
            } else if (path === ProjectResource.path.teamEditor) {
                param.menuType = 5
            } else if (path === ProjectResource.path.sensorSimulator) {
                param.menuType = 6
            }
            
            wsMgr.sendCheckMenuState(param);
        }

        props.history.push(path);

    }

    const getSopBtn = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return null;
        }
        
        return (
            <button data-title="SOP 바로가기" onClick={() => onClickSOP()}>
                <img src={sopBtn} alt='SOP 열기 버튼' />
            </button>
        );
    }
    
    const onClickSOP = () => {
        
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const param = {
                menuType: 2
            }
            wsMgr.sendCheckMenuState(param);
        }
    }
    
    const getMenu = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return (
                <div id='navMenu' className={showMenuPopup ? 'UI_Section on' : 'UI_Section off'}>
                    <ul>
                        <li onClick={() => onClickMenu(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                        <li onClick={() => onClickMenu(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
                    </ul>
                </div>
            );
        }

        return (
            <div id='navMenu' className={showMenuPopup ? 'UI_Section on' : 'UI_Section off'}>
                <ul>
                    <li onClick={() => onClickMenu(ProjectResource.path.sdms)}>{ProjectResource.ID.title.sdms}</li>
                    <li onClick={() => onClickMenu(ProjectResource.path.history)}>{ProjectResource.ID.title.history}</li> 
                    <li onClick={() => onClickMenu(ProjectResource.path.teamEditor)}>{ProjectResource.ID.title.teamEditor}</li>
                    <li onClick={() => onClickMenu(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                    <li onClick={() => onClickMenu(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
                    <li onClick={() => onClickMenu(ProjectResource.path.sensorSimulator)}>{ProjectResource.ID.title.sensorSimulator}</li>
                </ul>
            </div>
        );
    };

    const getUserMenu = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return null;
        }

        const userInfo = ProjectResource.getUserInfo();

        let userLevel = '-';
        let userID = '-';

        if (userInfo !== null && userInfo !== undefined) {
            userLevel = userInfo.grad_name;
            userID = userInfo.user_id;
        }

        return (
            <>
                <button
                    data-title="사용자 메뉴"
                    className={showUserMenuPopup ? 'on' : null}
                    onClick={() => handlePopup('userMenu')}
                >
                    <img src={user_menu} alt='사용자메뉴 버튼' id='userBtn' />
                </button>
                <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                    <ul>
                        <li onClick={() => handlePopup('myPage', true)}>
                            <p>{userLevel}</p>
                            <p>ID : {userID}</p>
                        </li>
                        <li onClick={() => handlePopup('accountManager', true)}>계정 및 권한</li>
                        <li onClick={() => onClickLogout()}>로그아웃</li>
                        <li onClick={() => onClickSysExit()}>시스템 종료</li>
                    </ul>
                </div>
            </>
        );
    };

    const onClickLogo = () => {
        if (props.menuEvent && props.menuEvent.onClickLogo) {
            props.menuEvent.onClickLogo();
        }
    }

    const path = window.location.pathname;

    return (
        <>
            <TitleBarComponent className='UI_Section' $autoRotation={autoRotation}>
                <div>
                    <img src={pohang_logo} alt='포항시 로고' width={80} height={26} onClick={() => onClickLogo()} />
                    <Clock />
                </div>
                <div>
                    {
                        getSopBtn()
                    }
                    <button 
                        data-title="환경설정"
                        className={showSettingPopup ? 'on' : null}
                        onClick={() => handlePopup('setting', true)}
                    >
                        <img src={setting} alt='환경설정 버튼' />
                    </button>
                    <button
                        data-title="메뉴"
                        className={showMenuPopup ? 'on' : null}
                        onClick={() => handlePopup('menu')}
                    >
                        <img src={menu} alt='메뉴 버튼' id='menuBtn' />
                    </button>
                    {
                        getMenu()
                    } 
                    {
                        getUserMenu()
                    }
                </div>
            </TitleBarComponent>
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
            {
                showSettingPopup &&
                <LayoutSetting
                    handlePopup={handlePopup}
                />
            }
            {
                showMyPagePopup &&
                <MyPage
                    handlePopup={handlePopup}
                />
            }
            {
                showChangePwdPopup &&
                <ChangePwd
                    handlePopup={handlePopup}
                />
            }
            {
                showAccountManagerPopup &&
                <AccountManager
                    handlePopup={handlePopup}
                />
            }
        </>
    );
}

export default withRouter(TitleBar);