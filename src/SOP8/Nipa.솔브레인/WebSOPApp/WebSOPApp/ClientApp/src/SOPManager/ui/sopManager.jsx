import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SopManagerContent from './sopManagerContent';
import $ from 'jquery';
import SopManagerBody from './sopManagerBody';
import SopManagerResource from '../resource/id';
import OpenSOPOptions from './popup/openSOPOptions';
import DeleteSOPOptions from './popup/deleteSOPOptions';
import SopController from '../services/sopController';
import SopDataManager from '../services/sopDataManager';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import AccountResource from '../../Account/resource/id';
import RootResource from '../../Root/resource/id';
import { SopManagerComponent } from '../../SOPManager/styled/managerStyled';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import SettingsStore from '../../Settings/settingsStore';
import SopSimulatorController from '../../SOPSimulator/services/sopSimulatorController';
import SectionData from '../../Common/models/sections/sectionData';

class SopManager extends Component {
    static menu = {
        none: null,
        editSOP: SopManagerResource.ID.menu.editSOP,
        newSOP: SopManagerResource.ID.menu.newSOP,
        open: SopManagerResource.ID.menu.open,
        save: SopManagerResource.ID.menu.save,
        saveAs: SopManagerResource.ID.menu.saveAs,
        delete: SopManagerResource.ID.menu.delete,
        openXML: SopManagerResource.ID.menu.openXML,
        saveXML: SopManagerResource.ID.menu.saveXML
    }

    constructor(props)
    {
        super(props);

        this.state = {
            selectedSiteNo: null,
            content: props.menu,
            menuDatas: null,
            showCascading:
            {
                actionStep: false,
                addComponent: false,
                specialCharacter: false,
                userDefined: false
            },
            loginUser: null,
            sopData: null,
            prevProps: props,

            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },

            showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',

            isAction: false // 열기, 저장하기, 삭제하기 실행 시 메뉴 중복클릭 방지를 위한 값
        }

        this.props = props;
        this.refFileDialog = React.createRef();
        this.deleteSOPOptionsRef = React.createRef();
        this.bNeedToSave = false // 저장이 필요한지 (사이트변경할때 저장안된내역있으면 저장하고 넘어감)
    }

    componentDidMount() {
        this.props.menuEvent.onClickLogo = this.onClickLogo;

        this.loadActionStepNames();

        // 각 페이지 별로 클래스 초기화
        $('#subPage').addClass('sop');

        this.initUserInfo();
        this.processGetParameters(window.location.search);


        this.unsubscribe_SettingsStore = SettingsStore.subscribe(() => {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITENO') {
                this.changeSelectSiteNo(data.selectSiteNo);
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe_SettingsStore();
    }

    onClickLogo = () => {
        // 로고 클릭 시 아무것도 실행하지 않음
        // this.changeContent(SopManagerResource.menu.editSOP, this.state.sopData);
        
        // this.setState({
        //     menuDatas: null,
        //     sopData: null,
        //     showCascading: {
        //         actionStep: false,
        //         addComponent: false,
        //         specialCharacter: false,
        //         userDefined: false
        //     }
        // })
    }

    changeSelectSiteNo = (site_sn) => {
        if (site_sn && site_sn !== this.state.selectedSiteNo) {
            this.onChangeSite(site_sn);
		}
    }

    async loadActionStepNames() {
        // 각 사이트별 단계배열 및 단계명 초기화
        const userInfo = ProjectResource.getUserInfo();

        if(userInfo) {
            await SopController.loadActionStepNames(userInfo.site_sn);
        }
    }

    handleTooltip = (e, data) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > li.width &&
        if(targetNode.width > parentNode.width) {

            this.setState({
                showTooltip: !this.state.showTooltip,
                tooltipTop: parentNode.top - 17,
                tooltipLeft: parentNode.left,
                tooltipContent: data
            });
        }
    }

    removeTooltip = () => {
        this.setState({ showTooltip: false });
    }

    processGetParameters(parameters) {
        if (!parameters || parameters.length === 0) {
            return;
        }

        parameters = parameters.substring(1).trim();

        const params = parameters.split('&');
        const paramCount = params.length;

        for (let i = 0; i < paramCount; i++) {
            const datas = params[i].split('=');

            if (datas.length !== 2) {
                continue;
            }

            const paramName = datas[0].trim();
            const paramValue = datas[1].trim();

            if (paramName.toLowerCase() === "sop") {
                const versionID = parseInt(paramValue);

                if (versionID !== null && versionID !== undefined && isNaN(versionID) === false) {
                    this.openDB(versionID);
                    break;
                }
            }
        }
    }

    initUserInfo = async () => {
        // 권한 체크
        const userAuthor = await ProjectResource.initUserAuthor();

        if (userAuthor !== AccountResource.accountLevelNo.master &&
            userAuthor !== AccountResource.accountLevelNo.admin) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['해당 로그인 사용자는 권한이 없습니다.'], ['확인'], this.onClickFalseConfirm);
        } 

        let userInfo = ProjectResource.getUserInfo();

        if (userInfo !== null && userInfo !== undefined) {
            this.setState({ loginUser: userInfo, selectedSiteNo: userInfo.site_sn });
        }
    }

    onClickFalseConfirm = () => {
        // 루트로 이동
        this.props.history.push(RootResource.path.sopSimulator);
    }

    changeContent = (content, menuDatas, showDlg) => {
        if (content === SopManager.menu.editSOP) {
            if (menuDatas) {
                this.setState(
                    {
                        content: content,
                        sopData: menuDatas,
                        menuDatas: menuDatas,
                        showCascading:
                        {
                            actionStep: true,
                            addComponent: this.state.showCascading.addComponent,
                            specialCharacter: this.state.showCascading.specialCharacter,
                            userDefined: this.state.showCascading.userDefined
                        }
                    }
                );
            }
            else {
                this.setState({ content: content, sopData: menuDatas, menuDatas: menuDatas });
            }
        }
        else if (content === SopManager.menu.save) {
            if (showDlg) {
                this.setState({ content: content, sopData: menuDatas, menuDatas: menuDatas });
            }
            else {
                this.setState({ isAction: true });
                this.saveDB(menuDatas);
            }
        }
        else if (content === SopManager.menu.saveXML) {
            this.saveXML(menuDatas);
        }
        else if (content === SopManager.menu.open) {
            if (menuDatas === null) {
                this.setState({ content: content, menuDatas: menuDatas });
            }
            else {
                this.setState({ isAction: true });
                this.openDB(menuDatas);
            }
        }
        else if (content === SopManager.menu.delete) {
            if (menuDatas !== null) {
                this.setState({ isAction: true });
                this.deleteDB(menuDatas);
            }

            this.setState({ content: content });
        }
        else if (content === SopManager.menu.openXML) {
            this.openXML();
        }
        else {
            this.setState({ content: content, menuDatas: menuDatas });
        }
    }

    async deleteDB(params) {
        const versionIDs = params[0];
        const obj = params[1];
        const isNormal = params[2];
        const [success, message] = await SopController.requestDeleteDB(versionIDs);

        if (success) {
            this.deleteSOPOptionsRef.current.postDeleteMethod(obj, isNormal);

            if (this.isCurrentVersion(versionIDs)) {
                this.clearSOP();
            }

            this.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ["삭제되었습니다."], null, null);
            this.setState({ content: SopManagerResource.ID.menu.editSOP })
        }
        else {
            if (message && message.length > 0) {
                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }

        this.setState({ isAction: false });
    }

    isCurrentVersion(versionIDs) {
        if (!versionIDs) {
            return false;
        }

        const sopData = this.state.sopData;

        if (sopData?.disaster) {
            const disaster = { ...sopData.disaster };

            for (const versionID of versionIDs) {
                if (versionID === disaster.ver_sn) {
                    return true;
                }
            }
        }

        return false;
    }

    async openDB(disasterNo) {
        const [sopDataResult, message] = await SopController.requestOpenDB(disasterNo);

        if (sopDataResult && sopDataResult.success) {
            // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
            this.clearSOP();

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            this.setCurrentActionStep(sopDataResult.sopData);
            this.checkArrows(sopDataResult.sopData);
            await this.checkStepMembers(sopDataResult.sopData);
            this.setState(
                {
                    content: SopManager.menu.editSOP,
                    sopData: sopDataResult.sopData,
                    menuDatas: sopDataResult.sopData,
                    showCascading:
                    {
                        actionStep: true,
                        addComponent: this.state.showCascading.addComponent,
                        specialCharacter: this.state.showCascading.specialCharacter,
                        userDefined: this.state.showCascading.userDefined
                    }
                });
        }
        else {
            this.setState({ content: SopManager.menu.editSOP, menuDatas: this.state.sopData });
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }

        this.setState({ isAction: false });
    }

    async getAllTreeDatas() {
        const teamAllTreeDatas = {};
        
        [teamAllTreeDatas.regular] = await TeamEditController.displayRegular(this.state.selectedSiteNo);
        [teamAllTreeDatas.normal] = await TeamEditController.displayTemporary(true, this.state.selectedSiteNo);
        [teamAllTreeDatas.emergency] = await TeamEditController.displayTemporary(false, this.state.selectedSiteNo);

        return teamAllTreeDatas;
    }

    openXML() {
        this.refFileDialog.current.click();
    }

    async checkStepMembers(sopData) {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;
            
            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];

                if (actionStepData.stepMemberDatas.length === 0) {
                    const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStepData);

                    if (!stepMemberData) {
                        // this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                        break;
                    }
                }
            }
        }
    }

    checkArrows(sopData) {
        if (sopData) {
            const actionStepCount = sopData.actionStepDatas.length;

            for (let i = 0; i < actionStepCount; i++) {
                const actionStepData = sopData.actionStepDatas[i];
                const stepMemberCount = actionStepData.stepMemberDatas.length;

                for (let j = 0; j < stepMemberCount; j++) {
                    const stepMemberData = actionStepData.stepMemberDatas[j];

                    if (stepMemberData.arrows.length > 0) {
                        stepMemberData.resetArrows = true;
                    }
                }
            }
        }
    }

    setCurrentActionStep(sopData) {
        sopData.actionStepDatas.map(actionStepData => {
            if (actionStepData.actionStep) {
                sopData.currentActionStep = actionStepData;
            }
        });
    }

    changeCascadingMode = (cascading, show) => {
        if (cascading === SopManagerResource.ID.cascadingMenu.actionStep) {
            this.setState({
                showCascading:
                {
                    actionStep: show,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.addComponent) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: show,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.specialCharacter) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: show,
                    userDefined: this.state.showCascading.userDefined
                }
            });
        }
        else if (cascading === SopManagerResource.ID.cascadingMenu.userDefined) {
            this.setState({
                showCascading:
                {
                    actionStep: this.state.showCascading.actionStep,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: show
                }
            });
        }
    }

    onSelectFile = (event) => {
        const file = event.target.files[0];
        this.refFileDialog.current.value = "";
        this._openXML(file);
    }

    async _openXML(file) {
        if (file) {
            const userInfo = ProjectResource.getUserInfo();

            if (!userInfo) {
                return;
            }

            const [sopDataResult, message] = await SopController.requestOpenXML(file, userInfo.site_sn);

            if (sopDataResult && sopDataResult.success) {
                // 새로 읽어들인 SopData를 새로운 Grid에 그리기 위하여 이전 Grid는 삭제한다.
                this.clearSOP();

                // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
                sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
                SopDataManager.setReceiverNames(sopDataResult.sopData);

                this.setCurrentActionStep(sopDataResult.sopData);
                this.checkArrows(sopDataResult.sopData);
                await this.checkStepMembers(sopDataResult.sopData);
                this.setState(
                    {
                        content: SopManager.menu.editSOP,
                        sopData: sopDataResult.sopData,
                        menuDatas: sopDataResult.sopData,
                        showCascading:
                        {
                            actionStep: true,
                            addComponent: this.state.showCascading.addComponent,
                            specialCharacter: this.state.showCascading.specialCharacter,
                            userDefined: this.state.showCascading.userDefined
                        }
                    });
            }
            else {
                this.setState({ content: SopManager.menu.editSOP, menuDatas: this.state.sopData });
                this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
        }
    }

    clearSOP() {
        this.setState(
            {
                content: SopManager.menu.editSOP,
                sopData: null,
                menuDatas: null,
                showCascading:
                {
                    actionStep: true,
                    addComponent: this.state.showCascading.addComponent,
                    specialCharacter: this.state.showCascading.specialCharacter,
                    userDefined: this.state.showCascading.userDefined
                }
            });
    }

    async saveXML(sopData) {
        if (!sopData) {
            return;
        }

        const userNo = this.state.loginUser ? this.state.loginUser.user_sn : -1;
        const [sopDataResult, message] = await SopController.requestSaveXML(userNo, sopData);

        if (sopDataResult === null) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        } 
    }

    async saveDB(sopData) {
        if (!sopData) {
            this.setState({ isAction: false });
            return;
        }

        const currentActionStep = sopData.currentActionStep;

        // 상황전파 컴포넌트의 mssage가 null이면 빈 문자열로 초기화 후 저장
        for (const actionStepData of sopData.actionStepDatas) {
            const stepMember = actionStepData.stepMemberDatas[0];
        
            if (!stepMember || !stepMember.sections) {
                continue;
            }
        
            for (const section of stepMember.sections) {
                const { component, transmission } = section;

                if (SectionData.isTransmissionType(component?.compn_code) && transmission?.mssage === null) {
                    transmission.mssage = '';
                }
            }
        }

        const userNo = this.state.loginUser ? this.state.loginUser.user_sn : -1;
        const [sopDataResult, message] = await SopController.requestSaveDB(userNo, sopData);

        if (sopDataResult && sopDataResult.success) {
            this.checkArrows(sopDataResult.sopData);
            await this.checkStepMembers(sopDataResult.sopData);

            // 수신자 정보를 알아내기 위하여 팀 정보를 미리 얻어온다.
            sopDataResult.sopData.teamAllTreeDatas = await this.getAllTreeDatas();
            SopDataManager.setReceiverNames(sopDataResult.sopData);

            sopDataResult.sopData.currentActionStep = currentActionStep;

            // 저장 성공 시 sopSimulator.allChartDatas를 새로 불러오기 위해 Timer를 재작동 시킨다.
            SopSimulatorController.stopWatchTimer();
            SopSimulatorController.StartWatchTimer();

            this.setState(
                {
                    content: SopManager.menu.editSOP,
                    menuDatas: sopDataResult.sopData,
                    showCascading:
                    {
                        actionStep: true,
                        addComponent: this.state.showCascading.addComponent,
                        specialCharacter: this.state.showCascading.specialCharacter,
                        userDefined: this.state.showCascading.userDefined
                    },
                    sopData: sopDataResult.sopData
                }
            );
        }
        else {
            this.setState({ content: SopManager.menu.editSOP, menuDatas: sopData });
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }

        this.setState({ isAction: false });
    }

    getPopup() {
        if (this.state.content === SopManager.menu.open) {
            return <OpenSOPOptions sopData={this.state.sopData} content={this.changeContent} showConfirmDialog={this.showConfirmDialog} handleTooltip={this.handleTooltip} removeTooltip={this.removeTooltip} selectedSiteNo={this.state.selectedSiteNo} isAction={this.state.isAction} />;
        }
        else if (this.state.content === SopManager.menu.delete) {
            return <DeleteSOPOptions ref={this.deleteSOPOptionsRef} sopData={this.state.sopData} content={this.changeContent} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} handleTooltip={this.handleTooltip} removeTooltip={this.removeTooltip} selectedSiteNo={this.state.selectedSiteNo} isAction={this.state.isAction} />;
        }
        /*else if (this.state.content === SopManager.menu.save) {
            return <SaveSOPOptions sopData={this.state.sopData} content={this.changeContent} />;
        }*/

        return <></>;
    }

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
		confirmMessage.type = type;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;

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

    getSiteList = () => {
        // 총괄관리자: 전체 건물 다 봄
        // 관리자: 해당하는 site_sn만 봄(실행 권한 있음)
        // 사용자: 해당하는 site_sn만 봄(실행 권한 없음)
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor === AccountResource.accountLevelNo.master) {
            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    <li onClick={() => this.onChangeSite(site.id)}>{site.siteName}</li>
                ))
            );
        } else if (userAuthor === AccountResource.accountLevelNo.admin) {
            const userInfo = ProjectResource.getUserInfo();

            return (
                ProjectResource.sites && ProjectResource.sites.map((site, index) => (
                    site.site_sn === userInfo.site_sn &&
                    <li>{site.siteName}</li>
                ))
            );
        }
    }

    onChangeSite = (site_sn) => {
        if (this.state.selectedSiteNo === site_sn) {
            return;
        }

        if (this.bNeedToSave) {
            this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['변경된 내용이 있습니다. 저장할까요?'], ['변경된 내용 저장', '변경된 내용 취소'], this.onNeedToSave);
        }

        this.setState({ selectedSiteNo: site_sn, content: SopManagerResource.menu.editSOP, sopData: null, menuDatas: null });
    }

    onNeedToSave = (index) => {
        if (index === 0) {
            //this.onClickSave();
        }

        this.onCloseConfirmDialog();
    }

    render() {
        const {showTooltip, tooltipTop, tooltipLeft, tooltipContent} = this.state;

        return (
            <SopManagerComponent>
                <div id={'subPage'} className='UI_Section'>
                    {
                        showTooltip &&
                        <div id={'tooltipArea'} style={{ top: tooltipTop, left: tooltipLeft }}>
                            {tooltipContent}
                        </div>
                    }
                    <input ref={this.refFileDialog} className={'hidden'} type='file' accept='.sop' onChange={this.onSelectFile} />
                    <div className={'subAside'}>
                        <SopManagerContent sopData={this.state.sopData} content={this.changeContent} loginUser={this.state.loginUser} menu={this.state.content} />
                    </div>

                    <SopManagerBody selectedSiteNo={this.state.selectedSiteNo} menu={this.state.content} menuDatas={this.state.menuDatas} sopData={this.state.sopData} showCascading={this.state.showCascading} changeCascadingMode={this.changeCascadingMode} content={this.changeContent} loginUser={this.state.loginUser} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} isAction={this.state.isAction} />
                    {
                        this.getPopup()
                    }

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog 
                            type={this.state.confirmMessage.type}
                            messages={this.state.confirmMessage.messages} 
                            buttons={this.state.confirmMessage.buttons} 
                            onClickButton={this.state.confirmMessage.onClickButton}
                            onCloseConfirmDialog={this.onCloseConfirmDialog}
                        />
                    } 
                </div>
            </SopManagerComponent>
        );
    }
}

export default withRouter(SopManager);