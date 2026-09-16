import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { LoginPageComponent } from '../styled/loginPageStyled';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

import ProjectResource from '../../Root/resource/id';

function LoginPage(props) {
	const FirstPage = "/sdms";

	const [loginError, setLoginError] = useState('');

	const refID = useRef();
	const refPW = useRef();

	useEffect(() => {
		initSiteNo();
		checkLogin();
	}, [])

	const initSiteNo = async () => {
		let siteNo = ProjectResource.SiteNo;

		if (siteNo === null || siteNo === undefined) {
			siteNo = await ProjectResource.loadSiteNo();

			return;
		}
	}

	const checkLogin = async () => {
		// 세션 키를 이용해 로그인 체크
		const user = await ProjectResource.initUserInfo();

		if (user !== null && user !== undefined) {

			if (user.sessionKey !== null && user.sessionKey !== undefined) {
				// 로그인 정보가 남아있다면
				const [result, message] = await AccountController.checkLoginSession(user.id, user.sessionKey);

				if (result === AccountResource.loginState.login) {
					// SDMS 페이지로 이동
					props.history.push("/sdms");
                }
			}
		}
    }

	const onClickLogin = () => {
		const id = refID.current.value.toString().trim();
		const pw = refPW.current.value.toString().trim();

		if (id.length === 0) {
			setLoginError(AccountResource.ID.textLoginIDError);
			return;
		}

		if (pw.length === 0) {
			setLoginError(AccountResource.ID.textLoginPwdError);
			return;
		}

		doLogin(id, pw);
	}

	const doLogin = async (id, pw) => {
		const result = await AccountController.login(id, pw);

		if (result === null) {
			setLoginError(AccountResource.ID.textLoginError);
		}

		if (result.success === true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			// 다음 페이지로 이동
			props.history.push(FirstPage);
		}
		else {
			setLoginError(AccountResource.ID.textLoginError);
		}
	}

	const onKeyPressLogin = (e) => {
		if (e.key === 'Enter') {
			onClickLogin();
		}
	}

	const onClickSetPwd = () => {
		props.history.push(ProjectResource.path.findPassword);
	}

	let errorMsg = null;
	if (loginError) {
		errorMsg = (
			<div className='error-msg' style={{ display : "on" }}>
				<p>{loginError}</p>
			</div>);
	}

	const settings = {
		dots: true,
		fade: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		speed: 500,
		pauseOnHover: false
	};

	return (
		<LoginPageComponent>
			<Slider {...settings}>
				<div className='company-img1' />
				<div className='company-img2' />
				<div className='company-img3' />
			</Slider>
			<div className='gradient-bg' />

			<header>
				<h1 className='blind'>비밀번호 찾기</h1>
				<div className='find-pwd-wrap'>
					<button className='find-pwd' onClick={onClickSetPwd}>비밀번호 찾기</button>
					<span>비밀번호를 잊으셨나요?</span>
				</div>
			</header>

			<section className='content-wrap'>
				<h2 className='blind'>로그인</h2>
				<p>경기도청 · 도의회</p>
				<p>스마트 재난관리 솔루션</p>
				<form autoComplete='off'>
					<div>
						<label htmlFor='inputId'>ID</label>
						<input ref={refID} type='text' className='check' id='inputId' onKeyPress={(e) => onKeyPressLogin(e)} placeholder={'ID를 입력하세요'} />
					</div>
					<div>
						<label htmlFor='inputPwd'>Password</label>
						<input ref={refPW} type='password' className='check' id='inputPwd' onKeyPress={(e) => onKeyPressLogin(e)} placeholder={'비밀번호를 입력하세요'} />
					</div>
					<button type='button' onClick={onClickLogin}>로그인</button>

					{/* 로그인 유효성 검사시 사용 */}
					{errorMsg}
				</form>
			</section>

			<footer>
				<p>Copyright 2024. UNE inc. all rights reserved.</p>
			</footer>
		</LoginPageComponent>
	);
}

export default withRouter(LoginPage);