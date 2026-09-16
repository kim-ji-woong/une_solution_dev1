import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import pohang_logo from '../../Common/images/pohang_logo.svg';
import pohang_logo2 from '../../Common/images/pohang_logo2.svg';
import ProjectResource from '../../Root/resource/id';

import socketStore from '../../SDMS/webSocket/socketStore';
import wsManager from "../../SDMS/webSocket/wsManager";
import SdmsResource from "../../SDMS/resource/id";
import {SettingController} from "../../Settings/services/settingController";
import ConfirmDialog from '../../Common/ui/confirmDialog';

function LoginPage(props) {
	const FirstPage = ProjectResource.path.sdms;

	const [current, setCurrent] = useState(0);
	const [errorMsg, setErrorMsg] = useState('');
	const [isAutoLogin, setIsAutoLogin] = useState(false);

	const [confirmMessage, setConfirmMessage] = useState({
		visible: false,
		type: null,
		messages: [""],
		buttons: ["확인"],
		onClickButton: null
	});

	useEffect(() => {
		// 로그인 세션 체크
		checkLogin();
		
		setWebSocket();
	}, []);
	
	const setWebSocket = () => {
		const wsMgr = new wsManager(SdmsResource.webSocketPort, null);
		socketStore.dispatch({ type: 'WS_MANAGER', wsMgr: wsMgr ? wsMgr : null });
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
	
	const sendInitialViewport = async (_wsMgr) => {
		const [settings, message] = await SettingController.requestSetting(100, null, null)

		const target = settings
			?.flatMap(item =>
				(item?.categoryType === "SDMS")
					? [item.settingDatas.find?.(setting => setting.name === "InitialViewport")].filter(Boolean)
					: []
			)[0];

		if (target?.value) {
			if (_wsMgr && _wsMgr.connected) {
				const content = {
					"cameraInfo": target.value
				}
				return _wsMgr.sendMoveToInitialScreen(content);
			}
		}
		
		
	}
	
	const checkLogin = async () => {
		// 세션 키를 이용해 로그인 체크
		const user = await ProjectResource.initUserInfo();
		
		let isAutoLogin = false;
		
		if (user) {
			const [accountOptions, errorMessage] = await AccountController.requestOptions(user.user_sn, 'login', 'autoLogin');

			if (!accountOptions) {
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMessage], null, null);
			}
			else {
				const option = accountOptions.find((optn) => optn.subCategory === 'autoLogin');
	
				if (option?.values && option?.values.length > 0) {
					isAutoLogin = option.values[0] && option?.values[0].toLowerCase() === 'true';
				}
	
				if (isAutoLogin) {
		
					if (user.session_key !== null && user.session_key !== undefined) {
						// 로그인 정보가 남아있다면
						const [result, message] = await AccountController.checkLoginSession(user.user_sn, user.session_key);
		
						if (result === AccountResource.loginState.login) {
							const wsMgr = socketStore.getState().wsMgr;
							wsMgr.sendCheckLogin();
							sendInitialViewport(wsMgr);
							
							// 페이지 이동
							props.history.push(ProjectResource.path.sdms);
						}
					}
				} else {
					await ProjectResource.clearLoginUser();
				}
			}
		} 
		
		// 자동 로그인 체크
		setIsAutoLogin(isAutoLogin);
    }

	const onChangeSection = (section) => {
		setCurrent(section);
		setErrorMsg('');
	}

	const onClickLogin = (id, pw) => {
		if (id.length === 0) {
			setErrorMsg(AccountResource.ID.textLoginIDError);
			return;
		}

		if (pw.length === 0) {
			setErrorMsg(AccountResource.ID.textLoginPwdError);
			return;
		}

		doLogin(id, pw);
	}

	const doLogin = async (id, pw) => {
		const loginResult = await AccountController.login(id, pw);    // 변수명 변경

		if (loginResult === null) {
			setErrorMsg(AccountResource.ID.textLoginError);
		}

		if (loginResult.success === true) {
			// 세션 저장
			ProjectResource.setLoginUser(loginResult.user);    // loginResult 사용

			const wsMgr = socketStore.getState().wsMgr;
			wsMgr.sendCheckLogin();
			sendInitialViewport(wsMgr);

			const [accountOptions, errorMessage] = await AccountController.requestOptions(loginResult.user.user_sn, 'login', 'autoLogin');    // 다른 변수명 사용

			if (!accountOptions) {
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMessage], null, null);
			}
			else {
				const option = accountOptions.find((optn) => optn.subCategory === 'autoLogin');
	
				if (!option || ((option.values[0] === 'true' | false) !== isAutoLogin)) {
					const optnValue = isAutoLogin ? 'true' : 'false';

					const options = {
						category: 'login',
						subCategory: 'autoLogin',
						values: [optnValue]
					}

					const [success, message] = await AccountController.requestSaveOptions(loginResult.user.user_sn, [options]);

					if (!success) {
						showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
					}
				}
			}

			props.history.push(FirstPage);
		}
		else {
			setErrorMsg(AccountResource.ID.textLoginError);
		}
	}

	const onClickFindPwd = async (name, phone) => {
		if (name.length === 0) {
			setErrorMsg(AccountResource.ID.textPlaceName);
			return;
		}

		if (phone.length === 0) {
			setErrorMsg(AccountResource.ID.textPlacePhone)
			return;
		}

		const [result, message] = await AccountController.requestTemporaryPasswordWithSMS(name, phone);

		if (result) {
			showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["임시 비밀번호를 문자로발송했습니다."], null, null);
		}
		else {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
		}
	}

	const goSafetyService = () => {
		const wsMgr = socketStore.getState().wsMgr;
		if (wsMgr && wsMgr.connected) {
			const element = {
				"url": "http://221.147.100.163:8201/"
			}
			return wsMgr.sendOpenUrl(element);
		}
	}

	return (
		<>
		<LoginPageComponent>
			<section className='left'>
				<img src={pohang_logo2} alt='한국산업단지공단_로고' width={128} height={26} />
				<img src={pohang_logo} alt='포항_로고' width={80} height={26} />
				<div>
					<div>
						<span>POHANG</span>
						<span>industrial complex</span>
					</div>
					<div> 
						<span>MONITORING</span>
						<span>SYSTEM</span>
					</div>
					<div>
						<p>포항철강산단의 안전성과 친환경성 강화를 위해</p>
						<p>실시간 데이터 기반의 모니터링과  효율적 관리를 구현하는 통합관리 시스템입니다.</p>
					</div>
				</div>
				<p>COPYRIGHT 2024 © Pohang. ALL RIGHTS RESERVED.</p>
			</section>

			<section className='right'>
				<button className='serviceBtn' onClick={() => goSafetyService()}>안전보건 서비스 바로가기</button>
			{
				current === 0 &&
				<>
					<LoginSection
						onClickLogin={onClickLogin}
						errorMsg={errorMsg}
						isAutoLogin={isAutoLogin}
						setIsAutoLogin={setIsAutoLogin}
					/>
					<button 
						type='button' 
						className='sectionBtn'
						onClick={(e) => onChangeSection(1)}
					>
						{AccountResource.ID.textPwdFind}
					</button>
				</>
			}
			{
				current === 1 &&
				<>
					<FindPwdSection
						onClickFindPwd={onClickFindPwd}
						errorMsg={errorMsg}
					/>
					<button 
						type='button' 
						className='sectionBtn'
						onClick={(e) => onChangeSection(0)}
					>
						{AccountResource.ID.textGoLoginPage}
					</button>
				</>
			}
			</section>
		</LoginPageComponent>
		{
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

export default withRouter(LoginPage);