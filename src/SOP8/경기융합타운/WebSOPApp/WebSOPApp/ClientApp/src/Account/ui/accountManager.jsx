import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import imgClose from '../../Common/images/close_btn.png';

import ProjectResource from "../../Root/resource/id.js";
import AccountResource from '../resource/id.js';

import { AccountManagerComponent } from '../styled/accountManagerStyled.js';
import { ModalBackground } from '../../Root/styled/theme';

import ColComboBox from './columns/colComboBox.jsx';

import { AccountController } from '../services/accountController';


class AccountManager extends Component {
    static Type = {
        Level: 0,
        Site: 1
    }

	constructor(props) {
		super(props);

		this.state = {
            isEditMode: false,  // 사용자 편집모드
            levels: [],         // 권한 정보     (JSON {{value: "value값", name: "name값"}...}) 
            sites: [],          // 사이트 정보   (JSON {{value: "value값", name: "name값"}...}) 
            editMembers: [],    // 수정 리스트
        }

        this.refSearch = React.createRef();

        this.props = props;

        // this.init();
    }

    async init() {
        let siteNo = null;
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            userInfo?.siteNo) {
            siteNo = userInfo.siteNo;
        } else if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            ProjectResource?.SiteNo) {
            siteNo = ProjectResource.SiteNo;
        }

        const accountLevels = await AccountController.getAccountLevels();
        this.state.accountLevels = accountLevels;

        const accountUsers = await AccountController.getAccountUsers(siteNo);
        this.state.accountUsers = accountUsers;

        const arrSites = [];
        const sites = ProjectResource.sites;

        let temp = { value: null, name: "-" };
        //arrSites.push(temp);

        for (let i = 0; i < sites?.length; i++) {
            const item = { value: sites[i].id, name: sites[i].siteName };
			arrSites.push(item);
        }
        
        this.state.sites = arrSites;

        const levels = [];
		levels.push(temp);

        for (let i = 0; i < accountLevels?.length; i++) {
            const item = { value: accountLevels[i].id, name: accountLevels[i].levelName };
			levels.push(item);
        }

        this.state.levels = levels;

        this.onClickSaerch();
    }

    setEditMode = () => {
        if (this.state.isEditMode === true) {
            // 새로고침
            this.state.isEditMode = !this.state.isEditMode;
            this.reload();
        } else {
            this.setState({ isEditMode: !this.state.isEditMode });
        }
    }

    onClickClosePopup = () => {
        this.props.handlePopup('accountManager', false)
    }

    onChangeComboBox = (type, value, member) => {
        const accountUsers = this.state.accountUsers;
        const editMembers = this.state.editMembers;

        const levels = this.state.levels;
        const sites = this.state.sites;

        let user = accountUsers?.find(x => x.memberID === member?.memberID);
        if (user) {
            console.log("onChangeComboBox: " + user.memberName);

            if (type === AccountManagerNew.Type.Level) {
                
                const level = levels?.find(x => x.value === value);
                if (level) {
                    user.accountLevel = { id: level.value, levelName: level.name };
                    member.accountLevel = { id: level.value, levelName: level.name };


                    if (level.value !== null && user.site === null && sites?.length > 0) {
                        // 권한이 새로 부여된다면 계정 SiteNo 부여
                        const site = sites[0];
                        user.site = { id: site.value, siteName: site.name, teamID: null };
                    } else if (level.value === null && user.site !== null) {
                        // 권한이 없어진다면 계정 SiteNo 제거
                        user.site = null;
                    }

                    let editMember = editMembers.find(x => x.memberID === user.memberID);
                    if (!editMember) {
                        editMembers.push(user);
                    }

                    this.onClickSaerch();
                }
            } else if (type === AccountManagerNew.Type.Site) {
                
                const site = sites?.find(x => x.value === value);
                if (site) {
                    user.site = { id: site.value, siteName: site.name, teamID: null };
                    member.site = { id: site.value, siteName: site.name, teamID: null };

                    let editMember = editMembers.find(x => x.memberID === user.memberID);
                    if (!editMember) {
                        editMembers.push(user);
                    }

                    this.onClickSaerch();
                }
            }
        }
    }

    onClickSaerch = () => {
        const accountUsers = this.state.accountUsers;
        let displayAccountUser = [];

        const search =  this.refSearch.current.value.toString();

        for (let i = 0; i < accountUsers?.length; i++) {
            const user = accountUsers[i];

            let siteName = "";
            if (user.site?.siteName) {
                siteName = user.site?.siteName;
            }
            else if (user.regular?.siteNo > 0) {
                const site = this.state.sites?.find(x => x.value === user.regular.siteNo);
                if (site)
                    siteName = site.name;
            }

            if (!search) {
                displayAccountUser.push(user);
            }
            else if (user.regular?.teamName?.includes(search) ||
                user.jobLevel?.name?.includes(search) ||
                user.jobPosition?.name?.includes(search) ||
                user.phoneNumber?.includes(search) ||
                user.officePhoneNumber?.includes(search) ||
                user.memberID?.includes(search) ||
                user.email?.includes(search) ||
                user.accountLevel?.levelName?.includes(search) ||
                user.memberName?.includes(search) ||
                siteName?.includes(search)) {
                displayAccountUser.push(user);
            }
        }

        this.setState({ displayAccountUser });
    }

    setAccountUserTable = () => {
        const sites = this.state.sites;

        let accountUserTable = [];
        let accountUsers = this.state.displayAccountUser;
        

        for (let i = 0; i < accountUsers?.length; i++) {
            let user = accountUsers[i];

            // 사번이 존재하지 않는다면 제외
            if (!user.memberID || user.memberID === "") 
                continue;

            let regularName = "";
            if (user.regular?.teamName) {
                regularName = user.regular.teamName;
            }

            let jobLevel = "-";
            if (user.jobLevel?.name) {
                jobLevel = user.jobLevel.name;
            }

            let jobPosition = "-";
            if (user.jobPosition?.name) {
                jobPosition = user.jobPosition.name;
            }

            let levelName = "-";
            if (user.accountLevel?.levelName) {
                levelName = user.accountLevel.levelName;
            }


            let siteName = "-";
            let site = sites?.find(x => x.value === user.site?.id);
            if (site) {
                siteName = site.name;
            } else {
                site = sites?.find(x => x.value === user.regular?.siteNo);
                if (site)
                    siteName = site.name;
            }

            let siteUI = siteName;
            if (this.state.isEditMode && user.accountLevel?.id !== null && user.accountLevel?.id >= 0 && sites?.length > 0) {
                let siteNo = user.site?.id;
                if (!siteNo) {
                    siteNo = user.regular?.siteNo;
                    if (!siteNo)
                        siteNo = sites[0].value;
                }

                siteUI = (<ColComboBox
                    type={AccountManagerNew.Type.Site}
                    member={user}
                    options={this.state.sites}
                    value={(siteNo >= 0 ? siteNo : null)}
                    onChange={this.onChangeComboBox}
                />);
            }

            accountUserTable.push(
                <tr key={"accountUserTable_" + user.id}>
                    <td>{i + 1}</td>
                    <td>
                    {siteUI}
                    </td>
                    <td>{regularName}</td>
                    <td>{user.memberName}</td>   
                    <td>{jobLevel}</td>
                    <td>{jobPosition}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.memberID}</td>
                    <td>{user.officePhoneNumber}</td>
                    <td>{user.email}</td>
                    <td>
                    {
                        this.state.isEditMode ?
                        <ColComboBox
                            type={AccountManagerNew.Type.Level}
                            member={user}
                            options={this.state.levels}
                            value={(user.accountLevel?.id >= 0 ? user.accountLevel.id : null)}
                            onChange={this.onChangeComboBox}
                        />
                        : levelName
                    }
                    </td>
                </tr>
            );
        }
        

        return accountUserTable;
    }

    async reload() {
        let siteNo = null;
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            userInfo?.siteNo) {
            siteNo = userInfo.siteNo;
        } else if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            ProjectResource?.SiteNo) {
            siteNo = ProjectResource.SiteNo;
        }

        const accountUsers = await AccountController.getAccountUsers(siteNo);
        this.state.accountUsers = accountUsers;

        this.onClickSaerch();
    }

    onClickSave = async () => {
        const editMembers = this.state.editMembers;
        if (!editMembers || editMembers.length === 0)
            return;

        const user = ProjectResource.getUserInfo();

        const textConfirm = '확인';
        const textError = '에러';
        const textSaveComplete = '저장되었습니다';

        const [result, message] = await AccountController.updateAccountUser2(editMembers, user.id);
        if (result === true) {
            this.state.editMembers = [];
            this.showConfirmDialog(textConfirm, [textSaveComplete], [textConfirm], this.onClickConfirm, this.onClickConfirm);
        } else {
            this.showConfirmDialog(textError, [message], [textConfirm], this.onClickConfirm, this.onClickConfirm);
        }
    }

    onClickConfirm = () => {
        // 결과 확인 후 새로고침
        this.state.isEditMode = !this.state.isEditMode;
        this.reload();

        this.onCloseConfirmDialog();
    }

    onClickCancle = () => {
        // 새로고침
        this.state.isEditMode = !this.state.isEditMode;
        this.reload();
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClickClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (onClickClose !== null && onClickClose !== undefined)
            confirmMessage.onClose = onClickClose;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.onClickSaerch();
            e.target.blur();
        }
    }

    render() {

        const accountUserTable = this.setAccountUserTable();

        // const data = {
        //     id: 1,
        //     campus: '캠퍼스H',
        //     team: '안전관리팀',
        //     name: '홍길동',
        //     position: '팀장',
        //     position2: '팀장',
        //     phone: '010-0000-0000',
        //     teamNumber: 'SS0102',
        //     call: '000-0000-0000',
        //     email: 'aaa123@ncs.co.kr',
        //     authority: '총괄관리자'
        // }

        return (
            <ModalBackground>
                <AccountManagerComponent>
                    <div className={"popupBox"}>
                        <div className='popupboxLine' />
                        <div className={"popupBoxTitle"}>{'사용자 권한 관리'}</div>
                        <div className={"popupBoxX"}><a onClick={this.onClickClosePopup}><img src={imgClose} alt={'저장되었습니다'} /></a></div>

                        <div className='popupContent'>
                            <div className='menuWrap'>
                                <p>{'목록'}</p>
                            </div>
                            <div className={'searchWrap'}>
                                <input ref={this.refSearch} type="text" id="txtSearch" onKeyPress={this.handleKeyPress} placeholder={'검색어를 입력해주세요'} />
                                <a onClick={this.onClickSaerch}>{'검색'}</a>
                                <a onClick={this.setEditMode}>{'편집'}</a>
                            </div>
                            <section className='userList'>
                                <table>
                                    <thead>
                                        <tr>
                                            <td width={'3%'}>NO.</td>
                                            <td width={'10%'}>{'소속'}</td>
                                            <td width={'10%'}>{'부서'}</td>
                                            <td width={'7%'}>{'이름'}</td>
                                            <td width={'7%'}>{'직위'}</td>
                                            <td width={'7%'}>{'직급'}</td>
                                            <td width={'10%'}>{'핸드폰 번호'}</td>
                                            <td width={'7%'}>{'사번'}</td>
                                            <td width={'10%'}>{'근무처 전화번호'}</td>
                                            <td width={'16%'}>{'메일'}</td>
                                            <td width={'10%'}>{'권한'}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accountUserTable}
                                    </tbody>
                                </table>
                            </section> 
                            {
                                this.state.isEditMode &&
                                    <ul className={'buttonWrap'}>
                                        <li className={'cancelBtn'} onClick={this.onClickCancle}>{'취소'}</li>
                                        <li className={'saveBtn'} onClick={this.onClickSave}>{'저장'}</li>
                                    </ul>
                            }
                        </div>
                    </div>
                </AccountManagerComponent>
            </ModalBackground>
        );
    }
}

export default withRouter(AccountManager);