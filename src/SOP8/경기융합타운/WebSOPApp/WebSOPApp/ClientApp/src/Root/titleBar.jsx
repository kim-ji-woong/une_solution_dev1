import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import Clock from '../Common/ui/clock';
import logo from './images/logo.svg';
import menu from './images/menu.svg';
import setting from './images/setting.svg';
import user_menu from './images/user_menu.svg';

import UpasswordWonik from './images/user_password_wonik.png';
import UmanagementWonik from './images/user_management_wonik.png';
import UlogoutWonik from './images/user_logout_wonik.png';

import LayoutSetting from '../Settings/ui/layoutSetting';
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

function TitleBar(props) {
    const [showSettingPopup, setShowSettingPopup] = useState(false);
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [showUserMenuPopup, setShowUserMenuPopup] = useState(false);
    const [showChangePwdPopup, setShowChangePwdPopup] = useState(false);
    const [showAccountManagerPopup, setShowAccountManagerPopup] = useState(false);
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

    useEffect(() => {

        // 센서 히스토리 감시 타이머
        SDMSController.StartWatchTimer();
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        // 시스템 Site No 초기화
        initSiteNo();
        // 선택 Site No 초기화
        initSelectSiteNo();

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
            accountSubscription();
            settingSubscription();
        };

    }, []);

    useEffect(() => {
        document.addEventListener("click", (e) => {
            let target = e.target;

            if (target.id === 'menuBtn' || target.id === 'userBtn' || target.id === 'userName') {
                return;
            } else {

                if (showMenuPopup || showUserMenuPopup) {
                    let userMenu = document.getElementById('userMenu');
                    let navMenu = document.getElementById('navMenu');
    
                    if (userMenu === null || navMenu === null) {
                        return;
                    } 

                    setShowMenuPopup(false);
                    setShowUserMenuPopup(false);
                }
            }
        });
    })

    const initSiteNo = async () => {
        let siteNo = ProjectResource.SiteNo;

        if (siteNo === null || siteNo === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteNo();

            if (result !== null && result !== undefined) {
                ProjectResource.SiteNo = result;
            }

            setReload(true);
        }
    }

    const initSelectSiteNo = async () => {
        const userInfo = await ProjectResource?.initUserInfo();
        const path = window?.location?.pathname;

        let siteNo = null;

        if (userInfo?.siteNo && path === ProjectResource?.path?.sdms) {
            siteNo = userInfo.siteNo;
        } else if (ProjectResource?.SiteNo) {
            siteNo = ProjectResource.SiteNo;
        }
        
        if (siteNo) {
            SettingsStore.dispatch({ type: 'SELECT_SITENO', selectSiteNo: siteNo });
        }
    }

    const changeSelectSiteNo = (siteNo) => {
        if (siteNo && siteNo !== selectSiteNo) 
            setSelectSiteNo(siteNo);
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
        if (type === 'accountManager') {
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
        else if (type === 'changePwd') {

            if (isShow) {
                setShowChangePwdPopup(isShow);
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
        // 계정 리덕스에 상태 업데이트
        AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: '로그아웃 되었습니다.' });
    }

    const checkLoginState = (data) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            // 로그아웃 시
            // 로그인 페이지로 이동
            props.history.push(ProjectResource.path.root);

            const siteNo = ProjectResource.SiteNo;

            if (siteNo !== null && siteNo !== undefined) {
                window.localStorage.removeItem(SessionString.Key.account + "_" + siteNo.toString());
            }
        } else if (data.loginState === AccountResource.loginState.disconnected) {
            // 네트워크 연결 끊김 시
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], null, props.history.push(ProjectResource.path.root));
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [data.message], null, props.history.push(ProjectResource.path.root));
        } else if (data.loginState === AccountResource.loginState.login) {
            // onCloseConfirmDialog();
        }
    }

    const getMenu = () => {
        return (
            <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => props.history.push(ProjectResource.path.sdms)}>{ProjectResource.ID.title.sdms}</li>
                    <li onClick={() => props.history.push(ProjectResource.path.dashboard)}>{ProjectResource.ID.title.dashboard}</li>
                    <li onClick={() => props.history.push(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                    <li onClick={() => props.history.push(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
                    <li onClick={() => props.history.push(ProjectResource.path.history)}>{ProjectResource.ID.title.history}</li> 
                    <li onClick={() => props.history.push(ProjectResource.path.teamEditor)}>{ProjectResource.ID.title.teamEditor}</li>
                </ul>
            </div>
        );
    };

    const getUserMenu = () => {
        const userInfo = ProjectResource.getUserInfo();

        let userLevel = '-';
        let userID = '-';

        if (userInfo !== null && userInfo !== undefined) {
            userLevel = userInfo.level;
            userID = userInfo.userID;
        }

        return (
            <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                <div>
                    <p>{userLevel}</p>
                    <p>{userID}</p>
                </div>
                <ul>
                    <li><a onClick={() => handlePopup('accountManager', true)} title='사용자 관리'><img src={UmanagementWonik} alt='사용자 관리' className="Amanagement" title='사용자 관리' /></a></li>
                    <li><a onClick={() => handlePopup('changePwd', true)} title='비밀번호 변경'><img src={UpasswordWonik} alt='비밀번호 변경' className="Apassword" title='비밀번호 변경' /></a></li>
                    <li><a onClick={onClickLogout} title='로그아웃'><img src={UlogoutWonik} alt='로그아웃' className="Alogout" title='로그아웃' /></a></li>
                </ul>
            </div>
        );
    };

    const userInfo = ProjectResource.getUserInfo();

    return (
        <>
            <TitleBarComponent $autoRotation={autoRotation}>
                <div>
                    <img src={logo} alt='부산시 로고' width={100} height={25} onClick={() => props.history.push(ProjectResource.path.sdms)} />
                    <Clock />
                </div>
                <div>
                    <button
                        className={showUserMenuPopup ? 'on' : null}
                        onClick={() => handlePopup('userMenu')}
                    >
                        <img src={user_menu} alt='사용자메뉴 버튼' id='userBtn' />
                        <p id='userName'>{userInfo ? userInfo.nickName : '사용자'}</p>
                    </button>
                    {
                        getUserMenu()
                    }
                    <button
                        className={showMenuPopup ? 'on' : null}
                        onClick={() => handlePopup('menu')}
                    >
                        <img src={menu} alt='메뉴 버튼' id='menuBtn' />
                    </button>
                    {
                        getMenu()
                    } 
                    <button 
                        className={showSettingPopup ? 'on' : null}
                        onClick={() => handlePopup('setting', true)}
                    >
                        <img src={setting} alt='환경설정 버튼' />
                    </button>
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
                showChangePwdPopup &&
                <ChangePwd
                    handlePopup={handlePopup}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                />
            }
            {
                showAccountManagerPopup &&
                <AccountManager
                    handlePopup={handlePopup}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                />
            }
        </>
    );
}

export default withRouter(TitleBar);