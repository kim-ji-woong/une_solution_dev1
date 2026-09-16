import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import ProjectResource from '../../Root/resource/id';

function LoginPage(props) {
	const FirstPage = ProjectResource.path.sopManager;

	const [current, setCurrent] = useState(0);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		checkLogin();
	}, [])

	const checkLogin = async () => {
		// 세션 키를 이용해 로그인 체크
		const user = await ProjectResource.initUserInfo();

		if (user !== null && user !== undefined) {

			if (user.sessionKey !== null && user.sessionKey !== undefined) {
				// 로그인 정보가 남아있다면
				const [result, message] = await AccountController.checkLoginSession(user.user_sn, user.sessionKey);

				if (result === AccountResource.loginState.login) {
					// 페이지 이동
					props.history.push(ProjectResource.path.sopSimulator);
                }
			}
		}
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
		const result = await AccountController.login(id, pw);

		if (result === null) {
			setErrorMsg(AccountResource.ID.textLoginError);
		}

		if (result.success === true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			// 다음 페이지로 이동
			props.history.push(FirstPage);
		}
		else {
			setErrorMsg(AccountResource.ID.textLoginError);
		}
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

	return (
		<LoginPageComponent>
			{
				current === 0 &&
					<LoginSection
						onClickLogin={onClickLogin}
						errorMsg={errorMsg}
						onChangeSection={onChangeSection}
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
		</LoginPageComponent>
	);
}

export default withRouter(LoginPage);