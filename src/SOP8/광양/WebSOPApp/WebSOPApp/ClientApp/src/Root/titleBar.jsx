import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import Clock from '../Common/ui/clock';
import gwangyang_logo from '../Common/images/gwangyang_logo.svg';

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
import Icon from '../Common/components/Icon/Icon';
import IconButton from '../Common/components/iconButton';
import DropList from '../Common/components/dropList';
import useToast from '../Common/hooks/useToast';
import useLoginUserInfo from '../Common/hooks/useLoginUserInfo';

function TitleBar(props) {
    const { onShowToast } = useToast();
    const { loginUserInfo } = useLoginUserInfo();

    const [showSettingPopup, setShowSettingPopup] = useState(false);
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [showUserMenuPopup, setShowUserMenuPopup] = useState(false);
    const [showMyPagePopup, setShowMyPagePopup] = useState(false);
    const [showChangePwdPopup, setShowChangePwdPopup] = useState(false);
    const [showAccountManagerPopup, setShowAccountManagerPopup] = useState(false);
    const [showRangeFindingPopup, setShowRangeFindingPopup] = useState(false);
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
        if (!showMenuPopup && !showUserMenuPopup) return;

        const handleClickOutside = (e) => {
            if (e.target.closest('.dropdown-portal')) return;

            const userMenu = document.getElementById('userMenu');
            const navMenu = document.getElementById('navMenu');
            const menuBtn = document.getElementById('menuBtn');
            const userBtn = document.getElementById('userBtn');

            if (
                userMenu?.contains(e.target) ||
                navMenu?.contains(e.target) ||
                menuBtn?.contains(e.target) ||
                userBtn?.contains(e.target)
            ) {
                return;
            }

            setShowMenuPopup(false);
            setShowUserMenuPopup(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showMenuPopup, showUserMenuPopup]);

    const handleToast = (message, status) => {
        onShowToast(message, status);
    };

    const closeMenus = () => {
        setShowMenuPopup(false);
        setShowUserMenuPopup(false);
    };
    
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

    const moveToLoginPage = () => {
        onCloseConfirmDialog();
        props.history.push(ProjectResource.path.root);
    }

    const handlePopup = (type, isShow) => {
        if (type === 'setting') {
            setShowSettingPopup(isShow);
        }
        else if (type === 'accountManager') {
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
    }

    const onClickLogout = () => {
        showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['로그아웃 하시겠습니까?'], ['취소', '로그아웃'], doLogout);
    }

    const doLogout = (index) => {
        if (index === 0) {
            onCloseConfirmDialog();
            return;
        }

        // 계정 리덕스에 상태 업데이트
        AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: '로그아웃 되었습니다.' });

        handleToast('로그아웃 되었습니다');
    }

    const onClickSysExit = () => {
        showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['시스템을 종료하시겠습니까?'], ['취소', '종료'], doSysExit);
    }

    const doSysExit = (index) => {
        if (index === 0) {
            onCloseConfirmDialog();
            return;
        }

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
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], ['확인'], moveToLoginPage);
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], ['확인'], moveToLoginPage);
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
            <IconButton
                variant="unfill"
                size="lg"
                icon={<Icon.IconSOP isFill={false} />}
                onClick={onClickSOP}
            />
        );
    }

    const getSettingsBtn = () => {
        const path = window.location.pathname;

        // SOP 페이지에서 로그인 계정의 권한이 총괄관리자가 아닐 경우 환경설정 버튼 숨김
        if ((path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) && 
            loginUserInfo?.grad_sn !== AccountResource.accountLevelNo.master) {
            return null;
        }

        return(
            <IconButton
                variant="unfill"
                size="lg"
                icon={<Icon.Setting />}
                onClick={() => handlePopup('setting', true)}
                className={showSettingPopup ? 'selected' : ''}
            />
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
        const canViewSopManager = loginUserInfo?.grad_sn !== AccountResource.accountLevelNo.user;

        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return (
                <div id='navMenu' className={showMenuPopup ? 'UI_Section on' : 'UI_Section off'}>
                    <DropList
                        size='md'
                        items={[
                            {
                                label: ProjectResource.ID.title.sopSimulator,
                                value: 'sopSimulator',
                                onClick: () => {
                                    closeMenus();
                                    onClickMenu(ProjectResource.path.sopSimulator);
                                }
                            },
                            canViewSopManager ? {
                                label: ProjectResource.ID.title.sopManager,
                                value: 'sopManager',
                                onClick: () => {
                                    closeMenus();
                                    onClickMenu(ProjectResource.path.sopManager);
                                }
                            } : null,
                        ].filter(Boolean)}
                    />
                </div>
            );
        }

        return (
            <div id='navMenu' className={showMenuPopup ? 'UI_Section on' : 'UI_Section off'}>
                <DropList
                    size='md'
                    items={[
                        {
                            label: ProjectResource.ID.title.sdms,
                            value: 'sdms',
                            onClick: () => {
                                closeMenus();
                                onClickMenu(ProjectResource.path.sdms);
                            }
                        },
                        {
                            label: ProjectResource.ID.title.history,
                            value: 'history',
                            onClick: () => {
                                closeMenus();
                                onClickMenu(ProjectResource.path.history);
                            }
                        },
                        {
                            label: ProjectResource.ID.title.teamEditor,
                            value: 'teamEditor',
                            onClick: () => {
                                closeMenus();
                                onClickMenu(ProjectResource.path.teamEditor);
                            }
                        },
                        {
                            label: ProjectResource.ID.title.sensorSimulator,
                            value: 'sensorSimulator',
                            onClick: () => {
                                closeMenus();
                                onClickMenu(ProjectResource.path.sensorSimulator);
                            }
                        },
                        {
                            label: 'HMTS 바로가기',
                            value: 'hmts',
                            onClick: () => {
                                closeMenus();
                                moveToHmts();
                            }
                        }
                    ].filter(Boolean)}
                />
            </div>
        );
    };
    
    const moveToHmts = () => {
        const wsMgr = socketStore.getState().wsMgr;
        if (wsMgr && wsMgr.connected) {
            const param = {
                "url": "https://hmts.kotsa.or.kr/pt/login"
            }
            
            wsMgr.sendOpenUrl(param);
        }
    }

    const getUserMenu = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return null;
        }

        const userInfo = ProjectResource.getUserInfo();

        let userLevel = '-';
        let userName = '-';

        if (userInfo !== null && userInfo !== undefined) {
            userLevel = userInfo.grad_name;
            userName = userInfo.user_name;
        }

        return (
            <div className='userMenuWrap'>
                <div className='userBtn'>
                    <p><span>{userName}</span>님 환영합니다</p>
                    <IconButton
                        id="userBtn"
                        variant="unfill"
                        size="sm"
                        icon={showUserMenuPopup ? <Icon.Arrow direction='top' /> : <Icon.Arrow />}
                        onClick={() => handlePopup('userMenu')}
                        className={showUserMenuPopup ? 'selected' : ''}
                    />
                </div>
                <div id='userMenu' className={showUserMenuPopup ? 'UI_Section on' : 'UI_Section off'}>
                    <div onClick={() => { closeMenus(); handlePopup('myPage', true); }}>
                        <span>{userLevel}</span>
                        <p>{userName}</p>
                    </div>
                    <ul>
                        <li onClick={() => { closeMenus(); handlePopup('accountManager', true); }}>계정관리</li>
                        <li onClick={() => { closeMenus(); onClickLogout(); }}>로그아웃</li>
                        <li onClick={() => { closeMenus(); onClickSysExit(); }}>시스템 종료</li>
                    </ul>
                </div>
            </div>
        );
    };

    const onClickLogo = () => {
        if (props.menuEvent && props.menuEvent.onClickLogo) {
            props.menuEvent.onClickLogo();
        }
    }

    return (
        <>
            <TitleBarComponent className='UI_Section' $autoRotation={autoRotation}>
                <div>
                    <img src={gwangyang_logo} alt='광양시 로고' width={75} height={24} onClick={() => onClickLogo()} />
                    <Clock />
                </div>
                <div>
                    <div className='menuWrap'>
                        <IconButton
                            id="menuBtn"
                            variant="unfill"
                            size="lg"
                            icon={<Icon.Hambug />}
                            onClick={() => handlePopup('menu')}
                            className={showMenuPopup ? 'selected' : ''}
                        />
                        {
                            getMenu()
                        }
                    </div>

                    {
                        getSopBtn()
                    }

                    {
                        getSettingsBtn()
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
