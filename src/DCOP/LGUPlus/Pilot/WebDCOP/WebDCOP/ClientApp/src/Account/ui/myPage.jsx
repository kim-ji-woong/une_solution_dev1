import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ModalBackground } from '../../Root/styled/theme';
import { MyPageComponent } from '../styled/myPageStyled';
import ProjectResource from '../../Root/resource/id';
import SessionString from '../../Common/js/sessionString';
import AccountResource from '../resource/id';
import { AccountController } from '../services/accountController';

class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    onClickLogout = async () => {
        // 로그아웃 시
        // 로그인 페이지로 이동
        const result = await AccountController.logout();

        if (result && result.success) {
            this.props.history.push(ProjectResource.path.root);
            window.localStorage.removeItem(SessionString.Key.account);
            ProjectResource.clearLoginUser();
    
            const wsMgr = this.props.getWebSocket();
    
            if (wsMgr) {
                wsMgr.close();
            }
        }
        else {
            console.log(result.message);
        }
    }

    getLevelNameByLevelNo = (no) => {
        let levelName = '';
        if (no === AccountResource.accountLevel.vdsManager) {
            levelName = AccountResource.ID.accountLevel.vdsManager;
        }
        else if (no === AccountResource.accountLevel.vdcSupervisor) {
            levelName = AccountResource.ID.accountLevel.vdcSupervisor;
        }
        else if (no === AccountResource.accountLevel.user) {
            levelName = AccountResource.ID.accountLevel.user;
        }

        return levelName;
    }

    getUserInfo = () => {
        let ui = [];
        const userInfo = ProjectResource.getUserInfo();
        
        if (userInfo) {
            const levelName = this.getLevelNameByLevelNo(userInfo.userLevel.accountLevelNo);
            
            ui.push(
                <React.Fragment key='myPage'>
                    <p>{levelName}</p>
                    <p>{userInfo.nickName}</p>
                </React.Fragment>
            )
        }
        return ui;
    }

    render() {
        const userInfo = this.getUserInfo();

        return (
            <ModalBackground className='UI_Section'>
                <MyPageComponent>
                    <header>
                        <button type='button' onClick={() => this.props.handleModalPopup('myPage', false)}>닫기</button>
                    </header>
                    <section>
                        {
                            userInfo
                        }
                        <button onClick={() => this.onClickLogout()}>로그아웃</button>
                    </section>
                </MyPageComponent>
            </ModalBackground>
        );
    }
}

export default withRouter(MyPage);