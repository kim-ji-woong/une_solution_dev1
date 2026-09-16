import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './loginSection';
import FindPwdSection from './findPwdSection';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import busan_logo from '../images/busan_logo.png';
import ProjectResource from '../../Root/resource/id';

function LoginPage(props) {
	const FirstPage = ProjectResource.path.sdms;

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

	const onClickFindPwd = (name, phone) => {
		if (name.length === 0) {
			setErrorMsg(AccountResource.ID.textPlaceName);
			return;
		}

		if (phone.length === 0) {
			setErrorMsg(AccountResource.ID.textPlacePhone)
			return;
		}
	}

	return (
		<LoginPageComponent>
			<section className='left'>
			{
				current === 0 &&
				<>
					<LoginSection
						onClickLogin={onClickLogin}
						errorMsg={errorMsg}
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

				<p>COPYRIGHT 2024 © Busan TP. ALL RIGHTS RESERVED.</p>
			</section>
			<section className='right'>
				<img src={busan_logo} alt='부산_로고' width={200} height={200} />
				<div>
					<p>BUSAN TP</p>
					<p>MONITORING SYSTEM</p>
				</div>
				<div>
					<p>Lorem ipsum dolor sit amet consectetur. Vel leo lobortis odio non et nam </p>
					<p>scelerisque. Risus cursus tempor vitae etiam</p>
				</div>
			</section>
		</LoginPageComponent>
	);
}

export default withRouter(LoginPage);