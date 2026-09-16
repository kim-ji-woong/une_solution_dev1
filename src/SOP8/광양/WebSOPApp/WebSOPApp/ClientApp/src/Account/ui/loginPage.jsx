import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

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
		const [settings, message] = await SettingController.requestSetting(200, null, null)

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

						if (result === AccountResource.loginState.false) {
							showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
						}
		
						if (result === AccountResource.loginState.login) {
							const wsMgr = socketStore.getState().wsMgr;
							wsMgr.sendCheckLogin();
							await sendInitialViewport(wsMgr);
							
							// 페이지 이동
							props.history.push(ProjectResource.path.sdms);
							
							// 모든 로그인 과정이 끝난 후 처리해야할 로직
							await initUserOptions(user.user_sn);
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
			await sendInitialViewport(wsMgr);

			const [accountOptions, errorMessage] = await AccountController.requestOptions(loginResult.user.user_sn, null, null);    // 다른 변수명 사용
			
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

				await initUserOptions(loginResult.user.user_sn);
				await initSysOptions(loginResult);
				
			}

			props.history.push(FirstPage);
		}
		else {
			setErrorMsg(AccountResource.ID.textLoginError);
		}
	}

	const initSysOptions = async (loginResult) => {
		const [result, message] = await SettingController.requestSetting(loginResult.site_sn, 'SDMS', null);
		if (!result) return;

		const sdmsRaw = result.find(item => item.categoryType === 'SDMS');
		if (!sdmsRaw) return;

		const sdmsSettings = {};
		sdmsRaw.settingDatas.forEach(setting => {
			sdmsSettings[setting.name] = {
				value: setting.value,
				description: setting.description
			};
		});

		const requiredKeys = [
			{ key: 'UseReceiveAtmosphere',   defaultValue: 'true',  description: '대기유해물질 측정기 알람 사용여부' },
			{ key: 'UseReceiveWater',         defaultValue: 'true',  description: '수질 알람 사용여부' },
			{ key: 'UseReceiveWaterDisaster', defaultValue: 'true',  description: '수해방지 모니터링 시스템 알람 사용여부' },
			{ key: 'MoveDisplayAlarm',        defaultValue: '2',     description: '알람 발생시 화면 자동전환 옵션' },
		];

		const missingKeys = requiredKeys.filter(({ key }) => !sdmsSettings[key]);

		if (missingKeys.length > 0) {
			const categories = {
				categories: [{
					categoryType: 'SDMS',
					settingDatas: missingKeys.map(({ key, defaultValue, description }) => ({
						siteNo: loginResult.user.site_sn,
						name: key,
						value: defaultValue,
						description
					}))
				}]
			};
			await SettingController.requestSave(categories);

			missingKeys.forEach(({ key, defaultValue, description }) => {
				sdmsSettings[key] = { value: defaultValue, description };
			});
		}

		const wsMgr = socketStore.getState().wsMgr;
		if (wsMgr && wsMgr.connected) {
			const allowEvents = {
				allowEvents: [
					{ poiType: 1, value: sdmsSettings.UseReceiveAtmosphere?.value === 'true' ? 1 : 0 },
					{ poiType: 3, value: sdmsSettings.UseReceiveWater?.value === 'true' ? 1 : 0 },
					{ poiType: 4, value: sdmsSettings.UseReceiveWaterDisaster?.value === 'true' ? 1 : 0 },
				]
			};
			wsMgr.sendResponseAlarmLayerSettings(allowEvents);
		}
	}
	
	const initUserOptions = async (user_sn) => {
		const [userOptions, errorMessage] = await AccountController.requestOptions(user_sn, null, null);
		
		let newOptions = [];
		
		let needUpdate = false;
		
		if (!userOptions.find((optn) => optn.subCategory === 'alarmSound')) {
			newOptions.push(setNewUserOption('sdms', 'alarmSound', ['true']));
			needUpdate = true;
		}
		
		if (!userOptions.find((optn) => optn.subCategory === 'weatherEffect')) {
			newOptions.push(setNewUserOption('sdms', 'weatherEffect', ['true']));
			needUpdate = true;
		}
		
		if (!userOptions.find((optn) => optn.subCategory === 'lightEffect')) {
			newOptions.push(setNewUserOption('sdms', 'lightEffect', ['true']));
			needUpdate = true;
		}
		
		if (!userOptions.find((optn) => optn.subCategory === 'idleTime')) {
			newOptions.push(setNewUserOption('sdms', 'idleTime', ['15:0']));
			needUpdate = true;
		}
		
		newOptions.forEach((targetOption) => {
			const optionIndex = userOptions.findIndex(
				(option) => option.category === "sdms" && option.subCategory === targetOption.subCategory
			);

			if (optionIndex >= 0) {
				userOptions[optionIndex] = {
					...userOptions[optionIndex],
					values: targetOption.values,
				};
				return;
			}

			userOptions.push(targetOption);
		});
		if (needUpdate){
			const [result, message] = await AccountController.requestSaveOptions(user_sn, newOptions);
			if (!result) {
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			}
		}

		const getOptionValue = (subCategory) => userOptions.find((o) => o.subCategory === subCategory)?.values?.[0] === 'true' ? 1 : 0;

		const idleTime = userOptions.find((o) => o.subCategory === 'idleTime')?.values?.[0];
		const [time, use] = idleTime.split(':');
		const idleTimeContent = {
			"autoRotation": {
				"active": use === "1" ? 1 : 0,
				"time": time
			}
		}
		
		const wsMgr = socketStore.getState().wsMgr;
		
		if (wsMgr && wsMgr.connected) {
			wsMgr.sendResponseAutoRotationSettings(idleTimeContent);
			wsMgr.sendWeatherEffect({ value: getOptionValue('weatherEffect') });
			wsMgr.sendLightEffect({ value: getOptionValue('lightEffect') });
		}
	}

	const setNewUserOption = (category, subCategory, values) => {
		return {"category": category, "subCategory": subCategory, "values": values};
	}

	const onClickFindPwd = (name, value) => {
		if (name.length === 0) {
			setErrorMsg(AccountResource.ID.textPlaceName);
			return;
		}

		if (value.length === 0) {
			setErrorMsg(AccountResource.ID.textPlacePhone);
			return;
		}

		requestTemporaryPasswordWithSMS(name, value);

		// if (mode === AccountResource.findMode.sms && value.length === 0) {
		// 	setErrorMsg(AccountResource.ID.textPlacePhone);
		// 	return;
		// }

		// if (mode === AccountResource.findMode.email && value.length === 0) {
		// 	setErrorMsg(AccountResource.ID.textPlaceEmail);
		// 	return;
		// }

		// if (mode === AccountResource.findMode.sms) {
		// 	requestTemporaryPasswordWithSMS(name, value);
		// }
		// else if (mode === AccountResource.findMode.email) {
		// 	requestTemporaryPasswordWithEmail(name, value);
		// }
	}

	const requestTemporaryPasswordWithSMS = async (name, value) => {
		try {
			const [result, message] = await AccountController.requestTemporaryPasswordWithSMS(name, value);

			if (result) {
				setErrorMsg(AccountResource.ID.textFindPwdSuccessPhone);
			} else {
				console.warn("API Error:", message);
				setErrorMsg(AccountResource.ID.textFindPwdError);
			}
		} catch (err) {
			// 네트워크 오류 / 서버 장애 등의 예외
			console.error("Exception in requestTemporaryPasswordWithSMS:", err);
			setErrorMsg(AccountResource.ID.textFindPwdError);
		}
	}

	const requestTemporaryPasswordWithEmail = async (name, value) => {
		try {
			const [result, message] = await AccountController.requestTemporaryPasswordWithEmail(name, value);

			if (result) {
				setErrorMsg(AccountResource.ID.textFindPwdSuccessEmail);
			} else {
				console.warn("API Error:", message);
				setErrorMsg(AccountResource.ID.textFindPwdError);
			}
		} catch (err) {
			// 네트워크 오류 / 서버 장애 등의 예외
			console.error("Exception in requestTemporaryPasswordWithSMS:", err);
			setErrorMsg(AccountResource.ID.textFindPwdError);
		}
	}

	return (
		<>
		<LoginPageComponent>
			{
				current === 0 &&
					<LoginSection
						onClickLogin={onClickLogin}
						errorMsg={errorMsg}
						onChangeSection={onChangeSection}
						isAutoLogin={isAutoLogin}
						setIsAutoLogin={setIsAutoLogin}
					/>
			}
			{
				current === 1 &&
					<FindPwdSection
						type='loginPage'
						onClickFindPwd={onClickFindPwd}
						errorMsg={errorMsg}
						onChangeSection={onChangeSection}
						setErrorMsg={setErrorMsg}
					/>
			}

			<div className="copyright">
				<p>COPYRIGHT 2026 © Gwangyang . ALL RIGHTS RESERVED.</p>
			</div>

			<section className='description'>
				<p>Gwangyang industrial complex</p>
				<p>MONITORING SYSTEM</p>
				<span>
					{`광양산단의 안전성과 친환경성 강화를 위해 실시간 데이터 기반의 모니터링과
					효율적 관리를 구현하는 통합관리 시스템입니다.`}
				</span>
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