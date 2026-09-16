import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import kftc_logo from '../Common/images/kftc_logo_light.svg';
import menu from './images/menu.svg';
import setting from './images/setting.svg';
import user_menu from './images/user_menu.svg';
import account_manager from './images/account_manager.svg';
import profile from './images/profile.svg';

import LayoutSetting from '../Settings/ui/layoutSetting';
import ChangePwd from '../Account/ui/changePwd';
import AccountManager from '../Account/ui/accountManager';
import AccountResource from '../Account/resource/id';
import { AccountController } from '../Account/services/accountController';
import SessionString from '../Common/js/sessionString';
import ConfirmDialog from '../Common/ui/confirmDialog';

import AccountStore from '../Account/accountStore';
import SettingsStore from '../Settings/settingsStore';
import SopSimulatorController from '../SOPSimulator/services/sopSimulatorController';
import { SettingController } from '../Settings/services/settingController';
import Button from '../Common/components/button';
import Icon from '../Common/components/Icon/Icon';
import WeatherInfo from './ui/weatherInfo';
import { WeatherController } from '../SDMS/services/weatherController';
import store from './store';
import SdmsResource from '../SDMS/resource/id';
import FindPwdSection from '../Account/ui/findPwdSection';

function TitleBar(props) {
    const [showSettingPopup, setShowSettingPopup] = useState(false);
    const [showMenuPopup, setShowMenuPopup] = useState(false);
    const [showUserMenuPopup, setShowUserMenuPopup] = useState(false);
    const [showWeatherPopup, setShowWeatherPopup] = useState(false);
    const [showChangePwdPopup, setShowChangePwdPopup] = useState(false);
    const [showFindPwdPopup, setShowFindPwdPopup] = useState(false);
    const [showAccountManagerPopup, setShowAccountManagerPopup] = useState(false);
    const [selectSiteNo, setSelectSiteNo] = useState(null);
    const [weatherDatas, setWeatherDatas] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

    useEffect(() => {
        // 환경설정 관련 감시 타이머
        SettingController.StartWatchTimer();

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        // 날씨 감시 타이머
        WeatherController.StartWatchTimer();

        // 선택 Site No 초기화
        initSelectSiteNo();

        const unsubscribe = store.subscribe(() => {
            const data = store.getState();

            if (data.actionType === 'WEATHER_CURRENT') {
                changeWeather(data.weatherDatas);
            }
        });

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
            unsubscribe();
            accountSubscription();
            settingSubscription();
        };

    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;

            // 토글 버튼 누를 때는 닫지 않음
            if (
                target.id === 'menuBtn' ||
                target.id === 'userBtn' ||
                target.id === 'weatherBtn'
            ) {
                return;
            }

            // 현재 DOM에 있는 것만 안전하게 확인
            const userMenu = document.getElementById('userMenu');
            const navMenu = document.getElementById('navMenu');
            const weatherMenu = document.getElementById('weatherMenu');

            const clickedInsideUser = userMenu?.contains(target);
            const clickedInsideNav = navMenu?.contains(target);
            const clickedInsideWeather = weatherMenu?.contains(target);

            const clickedInsideAny = clickedInsideUser || clickedInsideNav || clickedInsideWeather;

            // 팝업 밖을 클릭했을 때만 닫기
            if (!clickedInsideAny) {
                if (showMenuPopup) setShowMenuPopup(false);
                if (showUserMenuPopup) setShowUserMenuPopup(false);
                if (showWeatherPopup) setShowWeatherPopup(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showMenuPopup, showUserMenuPopup, showWeatherPopup]);

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

    const getCurrentMenuName = () => {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sdms) {
            return <p>{ProjectResource.ID.title.sdms}</p>
        }
        else if (path === ProjectResource.path.sopSimulator) {
            return <p>{ProjectResource.ID.title.sopSimulator}</p>
        }
        else if (path === ProjectResource.path.sopManager) {
            return <p>{ProjectResource.ID.title.sopManager}</p>
        }
        else if (path === ProjectResource.path.history) {
            return <p>{ProjectResource.ID.title.history}</p>
        }
        else if (path === ProjectResource.path.teamEditor) {
            return <p>{ProjectResource.ID.title.teamEditor}</p>
        }
    }

    const handlePopup = (type, isShow) => {
        if (type === 'setting') {
            setShowSettingPopup(isShow);
        }
        else if (type === 'accountManager') {
            setShowAccountManagerPopup(isShow);
        }
        else if (type === 'changePwd') {
            setShowChangePwdPopup(isShow);
        }
        else if (type === 'findPwd') {
            setShowFindPwdPopup(isShow);
            if (isShow) {
                setShowChangePwdPopup(false);
            }
            else {
                setShowChangePwdPopup(true);
            }
        }
        else if (type === 'menu') {
            setShowMenuPopup(!showMenuPopup);
            setShowUserMenuPopup(false);
            setShowWeatherPopup(false);
        }
        else if (type === 'userMenu') {
            setShowUserMenuPopup(!showUserMenuPopup);
            setShowMenuPopup(false);
            setShowWeatherPopup(false);
        }
        else if (type === 'weather') {
            setShowWeatherPopup(!showWeatherPopup);
            setShowMenuPopup(false);
            setShowUserMenuPopup(false);
        }
    }

    const onClickLogout = () => {
        showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['로그아웃 하시겠습니까?'], ['취소', '로그아웃'], doLogout);
    }

    const doLogout = (index) => {
        if (index === 1) {
            // 계정 리덕스에 상태 업데이트
            AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: '로그아웃 되었습니다.' });
        }
        else if (index === 0) {
            onCloseConfirmDialog();
        }
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

    const changeWeather = async (data) => {
        if (data) {
            setWeatherDatas(data);
        }
    };

    const getMenu = () => {
        const handleMenuClick = (path) => {
            props.history.push(path);
            setShowMenuPopup(false); // 클릭 후 닫기
        };

        return (
            <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => handleMenuClick(ProjectResource.path.sdms)}>
                        {ProjectResource.ID.title.sdms}
                    </li>
                    <li onClick={() => handleMenuClick(ProjectResource.path.sopSimulator)}>
                        {ProjectResource.ID.title.sopSimulator}
                    </li>
                    <li onClick={() => handleMenuClick(ProjectResource.path.sopManager)}>
                        {ProjectResource.ID.title.sopManager}
                    </li>
                    <li onClick={() => handleMenuClick(ProjectResource.path.history)}>
                        {ProjectResource.ID.title.history}
                    </li>
                    <li onClick={() => handleMenuClick(ProjectResource.path.teamEditor)}>
                        {ProjectResource.ID.title.teamEditor}
                    </li>
                    <li onClick={() => handleMenuClick(ProjectResource.path.equipmentManager)}>
                        {ProjectResource.ID.title.equipmentManager}
                    </li>
                </ul>
            </div>
        );
    };

    const getAccountManagerBtn = () => {
        const userInfo = ProjectResource.getUserInfo();

        if (!userInfo || userInfo.grad_sn === AccountResource.accountLevelNo.user) {
            return <></>
        }

        return <button 
                    className={showAccountManagerPopup ? 'on' : null}
                    onClick={() => handlePopup('accountManager', true)}
                >
                    <img src={account_manager} alt='계정 및 권한관리 버튼' />
                </button>
    }

    const getUserMenu = () => {
        const userInfo = ProjectResource.getUserInfo();

        let userLevel = '-';
        let userName = '-';

        if (userInfo !== null && userInfo !== undefined) {
            userLevel = userInfo.grad_name;
            userName = userInfo.user_name;
        }

        const handleUserMenuClick = (action) => {
            if (action === 'changePwd') {
                handlePopup('changePwd', true);
            } else if (action === 'logout') {
                onClickLogout();
            }
            setShowUserMenuPopup(false); // 실행 후 메뉴 닫기
        };

        return (
            <div className='userMenuWrap'>
                <p>{`${userName}님 환영합니다`}</p>
                <img src={profile} alt='프로필 사진' width={32} height={32} />
                <button
                    className={showUserMenuPopup ? 'on' : null}
                    onClick={() => handlePopup('userMenu')}
                >
                    <img src={user_menu} alt='사용자메뉴 버튼' id='userBtn' />
                </button>
                <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                    <ul>
                        <li>
                            <img src={profile} alt='프로필 사진' width={48} height={48} />
                            <p>{userLevel}</p>
                            <p>{userName}</p>
                        </li>
                        <li onClick={() => handleUserMenuClick('changePwd')}>비밀번호 변경</li>
                        <li onClick={() => handleUserMenuClick('logout')}>로그아웃</li>
                    </ul>
                </div>
            </div>
        );
    };

    const onClickLogo = () => {
        // props.history.push(ProjectResource.path.sdms);
        props.menuEvent?.onClickLogo();
    }

    const onClickFindPwd = (mode, name, value) => {
        if (name.length === 0) {
            setErrorMsg(AccountResource.ID.textPlaceName);
            return;
        }

        if (mode === AccountResource.findMode.sms && value.length === 0) {
            setErrorMsg(AccountResource.ID.textPlacePhone);
            return;
        }

        if (mode === AccountResource.findMode.email && value.length === 0) {
            setErrorMsg(AccountResource.ID.textPlaceEmail);
            return;
        }

        if (mode === AccountResource.findMode.sms) {
            requestTemporaryPasswordWithSMS(name, value);
        }
        else if (mode === AccountResource.findMode.email) {
            requestTemporaryPasswordWithEmail(name, value);
        }
    }

    const requestTemporaryPasswordWithSMS = async (name, value) => {
        const [result, message] = await AccountController.requestTemporaryPasswordWithSMS(name, value);

        if (result) {
            setErrorMsg('임시 비밀번호 전송이 완료되었습니다. 확인 후 비밀번호 변경을 진행하세요.');
        }
        else {
            setErrorMsg(message);
        }
    }

    const requestTemporaryPasswordWithEmail = async (name, value) => {
        const [result, message] = await AccountController.requestTemporaryPasswordWithEmail(name, value);

        if (result) {
            setErrorMsg('임시 비밀번호 전송이 완료되었습니다. 메일 확인 후 비밀번호 변경을 진행하세요.');
        }
        else {
            setErrorMsg(message);
        }
    }

    // 소숫점 몇째자리까지 표현할 것인가?
    const pointN = (data, n, defaultValue = "") => {
        if (data === null || data === undefined) {
            return defaultValue;
        }

        const str = data.toFixed(n).toString();
        const index = str.indexOf('.');

        if (index < 0) {
            return str;
        }

        const len = str.length;

        for (let i = len - 1; i >= 0; i--) {
            if (str[i] === '0') {
                continue;
            }
            else {
                if (str[i] === '.') {
                    return str.substring(0, i);
                }
                else {
                    return str.substring(0, i + 1);
                }
            }
        }

        return str;
    }

    return (
        <>
            <TitleBarComponent>
                <div className='logoWrap'>
                    <img src={kftc_logo} alt='금융결제원 로고' width={81} height={22} onClick={() => onClickLogo()} />
                    {getCurrentMenuName()}
                </div>
                <div className='contentWrap'>
                    {(weatherDatas && weatherDatas.length > 0) &&
                        <div className='weatherWrap'>
                            <div className='weatherIcon'>
                                {SdmsResource.getWeatherStateImage(weatherDatas[0]?.wethr_sttus_code, 18)}
                            </div>
                            <Button 
                                variant="unfill"
                                size="xxs"
                                id='weatherBtn'
                                onClick={() => handlePopup('weather')}
                            >
                                    {`온·습도  ${pointN(weatherDatas[0]?.tp, 1)}℃ / ${pointN(weatherDatas[0]?.hd, 1)}%`}
                            </Button>
                        </div>
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
                    {
                        getAccountManagerBtn()
                    }
                    {
                        getUserMenu()
                    }
                    {
                        showWeatherPopup &&
                            <WeatherInfo
                                weatherDatas={weatherDatas}
                            />
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
                showChangePwdPopup &&
                <ChangePwd
                    handlePopup={handlePopup}
                />
            }
            {
                showFindPwdPopup &&
                <FindPwdSection
                    type='gnb'
                    onChangeSection={handlePopup}
                    onClickFindPwd={onClickFindPwd}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                />
            }
            {
                showAccountManagerPopup &&
                <AccountManager
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