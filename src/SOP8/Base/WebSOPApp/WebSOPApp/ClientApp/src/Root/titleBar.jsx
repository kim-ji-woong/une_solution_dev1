import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import { RangeFindingComponent, KeyMapComponent } from '../SDMS/styled/sdmsPopupsStyled';
import Clock from '../Common/ui/clock';
import busan_typo from '../Common/images/busan_typo.svg';
import menu from './images/menu.svg';
import setting from './images/setting.svg';
import user_menu from './images/user_menu.svg';
import navigation from './images/navigation.svg';
import nav_1 from './images/nav_1.svg';
import nav_2 from './images/nav_2.svg';
import nav_3 from './images/nav_3.svg';
import nav_4 from './images/nav_4.svg'; 
import nav_5 from './images/nav_5.svg';
import nav_5_1 from './images/nav_5_1.svg';
import nav_6 from './images/nav_6.svg';
import nav_7 from './images/nav_7.svg';

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

function TitleBar(props) {
    const [showSettingPopup, setShowSettingPopup] = useState(false);
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [showUserMenuPopup, setShowUserMenuPopup] = useState(false);
    const [showMyPagePopup, setShowMyPagePopup] = useState(false);
    const [showChangePwdPopup, setShowChangePwdPopup] = useState(false);
    const [showAccountManagerPopup, setShowAccountManagerPopup] = useState(false);
    const [showRangeFindingPopup, setShowRangeFindingPopup] = useState(false);
    const [showKeyMapPopup, setShowKeyMapPopup] = useState(false);
    const [showNavBar, setShowNavBar] = useState(false);
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
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

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
        const handleClickOutside = (e) => {
            let target = e.target;
    
            if (target.id === 'menuBtn' || target.id === 'userBtn') {
                return;
            }
    
            if (showMenuPopup || showUserMenuPopup) {
                let userMenu = document.getElementById('userMenu');
                let navMenu = document.getElementById('navMenu');
    
                if (userMenu === null || navMenu === null) {
                    return;
                }
    
                setShowMenuPopup(false);
                setShowUserMenuPopup(false);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
    
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, [showMenuPopup, showUserMenuPopup]);

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

    const checkLoginState = (data) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            // 로그아웃 시
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

    const getMenu = () => {
        return (
            <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => props.history.push(ProjectResource.path.sdms)}>{ProjectResource.ID.title.sdms}</li>
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
            userLevel = userInfo.grad_name;
            userID = userInfo.user_id;
        }

        return (
            <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => handlePopup('myPage', true)}>
                        <p>{userLevel}</p>
                        <p>ID : {userID}</p>
                    </li>
                    <li onClick={() => handlePopup('accountManager', true)}>계정 및 권한</li>
                    <li onClick={() => onClickLogout()}>로그아웃</li>
                </ul>
            </div>
        );
    };

    const handleNavBar = () => {
        setShowNavBar(!showNavBar);

        const btns = document.getElementById('navigationBtns');
        if(!showNavBar) {
            btns.classList.add('on');
            btns.classList.remove('off');
        }
        else {
            btns.classList.add('off');
            btns.classList.remove('on');
        }
    }

    const getNavigationBtn = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sdms) {
            return (
                <>
                    <button className={showNavBar ? 'navigationBtn on' : 'navigationBtn off'} onClick={() => handleNavBar()}>
                        <img src={navigation} alt='네비게이션 버튼' width={20} height={20} />
                    </button>
                    <ul className={'navigationBtn item'} id='navigationBtns'>
                        <li>
                            <button>
                                <img src={nav_1} alt='초기화면 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_2} alt='초기화면 지정 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_3} alt='확대 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_4} alt='축소 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={(e) => handleAutoRotation(e)}>
                                <img src={autoRotation ? nav_5 : nav_5_1} alt='자동회전 ON 버튼' width={20} height={autoRotation ? 20 : 21} />
                            </button>
                        </li>
                        <li className={showRangeFindingPopup ? 'on' : null} onClick={() => handlePopup('rangeFinding', true)}>
                            <button>
                                <img src={nav_6} alt='거리측정 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li className={showKeyMapPopup ? 'on' : null} onClick={() => handlePopup('keyMap', true)}>
                            <button>
                                <img src={nav_7} alt='키 맵 버튼' width={20} height={20} />
                            </button>
                        </li>
                    </ul>
                </>
            );
        }
        else {
            return null;
        }
    }

    const handleAutoRotation = (e) => {
        e.stopPropagation();
        setAutoRotation(!autoRotation);
    }

    const onClickLogo = () => {
        props.history.push(ProjectResource.path.sdms);
        props.menuEvent.onClickLogo();
    }

    const path = window.location.pathname;

    return (
        <>
            <TitleBarComponent $autoRotation={autoRotation}>
                <div>
                    <img src={busan_typo} alt='부산시 로고' width={100} height={25} onClick={() => onClickLogo()} />
                    <Clock />
                </div>
                <div>
                    <button 
                        className={showSettingPopup ? 'on' : null}
                        onClick={() => handlePopup('setting', true)}
                    >
                        <img src={setting} alt='환경설정 버튼' />
                    </button>
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
                        className={showUserMenuPopup ? 'on' : null}
                        onClick={() => handlePopup('userMenu')}
                    >
                        <img src={user_menu} alt='사용자메뉴 버튼' id='userBtn' />
                    </button>
                    {
                        getUserMenu()
                    }
                    {
                        getNavigationBtn()
                    }
                </div>
            </TitleBarComponent>
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
            {
                (showRangeFindingPopup && path === ProjectResource.path.sdms) &&
                <RangeFinding
                    handlePopup={handlePopup}
                />
            }
            {
                (showKeyMapPopup && path === ProjectResource.path.sdms) &&
                <KeyMap
                    handlePopup={handlePopup}
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
        </>
    );
}

export default withRouter(TitleBar);


// 거리측정 팝업
function RangeFinding(props) {
    const [start, setStart] = useState(true);

    return (
        <RangeFindingComponent>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    거리측정
                </h5>
                <button className='dslX' onClick={() => props.handlePopup('rangeFinding', false)}>닫기</button>
            </div>
            <div className='rangeContent'>
                <ul className='range'>
                    {
                        !start ?
                        <li>시작점을 선택하여<br />거리를 측정해주세요.</li> :
                        <li>‘ESC’키를 눌러<br />측정을 마칠 수 있습니다.</li>
                    }
                </ul>
                <ul className='total'>
                    <li className='on'>
                        <p>총 거리</p>
                        <p>-</p>
                    </li>
                </ul>
            </div>
        </RangeFindingComponent>
    );
} 


// 키 맵 팝업
function KeyMap(props) {

    return (
        <KeyMapComponent>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    키 맵 도움말
                </h5>
                <button className='dslX' onClick={() => props.handlePopup('keyMap', false)}>닫기</button>
            </div>
            <div className='keyMapContent'>
                <ul>
                    <li>
                        <p>TOP</p>
                        <div>
                            <p>Ctrl</p>
                            <p>T</p>
                        </div>
                    </li>
                    <li>
                        <p>FRONT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>F</p>
                        </div>
                    </li>
                    <li>
                        <p>LEFT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>L</p>
                        </div>
                    </li>
                    <li>
                        <p>RIGHT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>R</p>
                        </div>
                    </li>
                    <li>
                        <p>ISO</p>
                        <div>
                            <p>Ctrl</p>
                            <p>S</p>
                        </div>
                    </li>
                </ul>
            </div>
        </KeyMapComponent>
    );
}