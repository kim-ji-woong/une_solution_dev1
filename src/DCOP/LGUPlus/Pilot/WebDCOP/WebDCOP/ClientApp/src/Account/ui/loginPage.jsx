import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { AccountController } from '../services/accountController';
import { LoginPageComponent } from '../styled/loginPageStyled';
import AccountResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';

import pwd_hide from '../images/pwd_hide.svg';
import pwd_show from '../images/pwd_show.svg';
import input_x from '../images/input_x.svg';
import logo_lg from '../images/logo_lg.png';

class LoginPage extends Component {
	static FirstPage = ProjectResource.path.dashboard;

	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			isShowPwd: false,
			idValue: '',
            pwdValue: ''
		}

		this.refID = React.createRef();
		this.refPW = React.createRef();
	}

	componentDidMount() {
        this.refID.current.focus();
    }

	componentDidUpdate() {
        if (this.state.errorMsg === AccountResource.ID.textLoginError) {
            this.refID.current.classList.add('error');
            this.refPW.current.classList.add('error');
        }
    }

	onKeyPressLogin = (e, type) => {
		if (e.key === 'Enter') {
			this.onClickLogin();
		}
		else if (type === 'id' && e.key === 'Tab') {
			e.preventDefault();
			this.refPW.current.focus();
		}
		else if (type === 'pwd' && e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			this.refID.current.focus();
		}

		return;
	}

	handleShowPwChecked = () => {
        const password = this.refPW.current;
        if (password === null)
            return;

        if(!this.state.isShowPwd) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }

		this.setState({ isShowPwd: !this.state.isShowPwd });
    }

	handleIDChange = (event) => {
        this.setState({ idValue: event.target.value });
    }

    handlePWChange = (event) => {
        this.setState({ pwdValue: event.target.value });
    }

	clearInputText = (type) => {
		if (type === 'id') {
			const id = this.refID.current;
			if (id) {
                id.value = '';
				id.focus();
				this.setState({ idValue: '' });
            }
		}
		else if (type === 'pwd') {
			const pw = this.refPW.current;
			if (pw) {
                pw.value = '';
				this.refPW.current.type = 'password';
				pw.focus();
				this.setState({ pwdValue: '', isShowPwd: false });
            }
		}
	}

	onClickLogin = () => {
        const id = this.refID.current.value.toString().trim();
        const pw = this.refPW.current.value.toString().trim();

		if (id.length === 0) {
            this.refID.current.classList.add('error');
			this.setState({ errorMsg: AccountResource.ID.textLoginIDError });
			return;
        } else {
            this.refID.current.classList.remove('error');
        }

        if (pw.length === 0) {
            this.refPW.current.classList.add('error');
			this.setState({ errorMsg: AccountResource.ID.textLoginPwdError });
			return;
        } else {
            this.refPW.current.classList.remove('error');
        }

		this.doLogin(id, pw);
    }

	doLogin = async (id, pw) => {
		const result = await AccountController.login(id, pw);

		if (result === null) {
			this.setState({ errorMsg: AccountResource.ID.textLoginError });
		}

		if (result.success === true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			// 다음 페이지로 이동
			this.props.history.push(LoginPage.FirstPage);
		}
		else {
			this.setState({ errorMsg: AccountResource.ID.textLoginError });
		}
	}

	render() {
		const { isShowPwd, errorMsg, idValue, pwdValue } = this.state;

		let errorMsgUI = null;

		if (errorMsg) {
			errorMsgUI = (
				<p>{errorMsg}</p>
			);
		}

		return (
			<LoginPageComponent>
				<section>
					<div className='titleWrap'>
						<img src={logo_lg} alt='LG U+ 로고 이미지' width={160} height={45} />
						<h2>DCOP</h2>
						<p>Digital twin Central Office Platform</p>
					</div>
					<form autoComplete='off'>
						<div className='inputWrap id'>
							<input ref={this.refID} type='text' id='inputId' placeholder={AccountResource.ID.textIDInput} onKeyDown={(e) => this.onKeyPressLogin(e, 'id')} value={idValue} onChange={this.handleIDChange} />
							<button
								type='button'
								onClick={() => this.clearInputText('id')}
								style={{ display: idValue.length > 0 ? 'inline-block' : 'none' }}
							>
								<img className='clearBtn'src={input_x} alt='삭제 버튼' />
							</button>
						</div>
						<div className='inputWrap pwd'>
							<input ref={this.refPW} type='password' id='inputPwd' placeholder={AccountResource.ID.textPwdInput} onKeyDown={(e) => this.onKeyPressLogin(e, 'pwd')} value={pwdValue} onChange={this.handlePWChange} />
							<button 
								type='button'
								style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
								onClick={() => this.handleShowPwChecked()}
							>
								<img className='showPwdBtn' src={isShowPwd ? pwd_show : pwd_hide} alt='비밀번호 보기 버튼' /> 
							</button>
							<button
								type='button'
								style={{ display: pwdValue.length > 0 ? 'inline-block' : 'none' }}
								onClick={() => this.clearInputText('pwd')}
							>
								<img className='clearBtn'src={input_x} alt='삭제 버튼' />
							</button>
						</div>

						{/* 로그인 유효성 검사시 사용 */}
						<div className='errorMsg'>
							{errorMsgUI}
						</div>
						
						<button type='button' className='submitBtn' onClick={() => this.onClickLogin()}>로그인</button>
					</form>
				</section>
				<footer>
					<p>Copyright © Data Center orp. All Right Reserved.</p>
				</footer>
			</LoginPageComponent>
		);
	}
}

export default withRouter(LoginPage);