import React, { Component } from 'react';
import SectionDataInternal from '../../../Common/models/sections/sectionDataInternal';
import ProcessProperty from './processProperty';
import Receiver from '../../../Common/models/sections/receiver';
import TreeView from '../../../TeamEditor/ui/utility/treeview';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SectionData from '../../../Common/models/sections/sectionData';
import TreeNode from '../../../TeamEditor/ui/utility/treenode';
import TreeData from '../../../TeamEditor/ui/utility/treedata';
import SopDataManager from '../../services/sopDataManager';
import SpecialMessageParameter from '../../../Common/js/specialMessageParameter';
import SopController from '../../services/sopController';
import ProjectResource from '../../../Root/resource/id';

import { InternalPropertyComponent } from '../../../SOPManager/styled/componentsStyled';
import Icon from '../../../Common/components/Icon/Icon';

class InternalProperty extends Component {
	static SMS_Type = 0;
	static Broadcast_Type = 1;
	static Email_Type = 2;

	constructor(props) {
		super(props);
		this.props = props;

		const sectionData = new SectionDataInternal();

		if (this.props.sectionData) {
			SectionDataInternal.copyTo(this.props.sectionData, sectionData);
		}

		this.state = {
			instance: this,
			sectionData: sectionData,
			teamType: ProcessProperty.getDefaultTeamType(this.props.sectionData),
			teamTreeData: null,
			teamAllTreeDatas: { ...props.teamAllTreeDatas },
			receiverName: sectionData.transmission.receiverName ? sectionData.transmission.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: false,
			messagesOn: false,
			includeChildTeams: false,
			/*autoRun: sectionData.transmission.atmc_execut_yn,*/
			prevProps: this.props
		}

		this.refReceivers = React.createRef();
		this.refMessages = React.createRef();
		this.refMessage = React.createRef();
		this.refCheckIncludeChildTeams = React.createRef();
		this.refTitle = React.createRef();
		this.refCheckAutoRun = React.createRef();

		this.canceled = false;
	}

	componentWillUnmount() {
		// 창이 닫히게 될 경우 편집한 내용을 저장한다.
		if (!this.canceled) {
			this.saveSectionData(true);
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		if (props.sectionData !== state.prevProps.sectionData && state.sectionData) {
			// 다른 Process를 선택하여 창이 바뀌게 될 경우 편집한 내용을 저장한다.
			state.instance.saveSectionData(true);
		}

		let sectionData = new SectionDataInternal();

		if (props.sectionData) {
			SectionDataInternal.copyTo(props.sectionData, sectionData);
		}

		state.instance.refTitle.current.value = state.instance.refTitle.current.text = sectionData.transmission.title;
		state.instance.refMessage.current.value = state.instance.refMessage.current.text = sectionData.transmission.mssage;

		if (sectionData.removed) {
			sectionData = null;
		}

		return {
			instance: state.instance,
			sectionData: sectionData,
			teamType: ProcessProperty.getDefaultTeamType(props.sectionData),
			teamTreeData: null,
			teamAllTreeDatas: { ...props.teamAllTreeDatas },
			receiverName: sectionData?.transmission?.receiverName ? sectionData?.transmission?.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: state.receiversOn,
			messagesOn: state.messagesOn,
			includeChildTeams: state.includeChildTeams,
			/*autoRun: sectionData.transmission.atmc_execut_yn,*/
			prevProps: props
		};
	}

	componentDidUpdate(prevProps, prevState) {
		// 다른 컴포넌트 선택시 수신자 탭 열려 있다면 트리 데이터 재조회 필요함
		if (prevProps.sectionData !== this.props.sectionData) {
			if (this.state.receiversOn) {
				this.slideCascade(this.refReceivers.current, true);
			}
		}
	}

	onClickCascade = (event) => {
		this.slideCascade(event.target);
	}

	async slideCascade(element, bLoad) {
		let teamTreeDatas = null;
		let message = null;
		let receiversOn = this.state.receiversOn;
		let messagesOn = this.state.messagesOn;

		const teamAllTreeDatas = { ...this.state.teamAllTreeDatas };

		if (element === this.refReceivers.current) {
			if (!bLoad && element.classList.contains("on")) {
				receiversOn = false;
			}
			else {
				if (!bLoad) {
					receiversOn = true;
					messagesOn = false;
				}
				if (this.state.teamType === Receiver.RegularTeam) {
					[teamTreeDatas, message] = await TeamEditController.displayRegular();
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.RegularTeam);
					teamAllTreeDatas.regular = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryNormalTeam) {
					[teamTreeDatas, message] = await TeamEditController.displayTemporary(true);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.TemporaryNormalTeam);
					teamAllTreeDatas.normal = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryEmergencyTeam) {
					[teamTreeDatas, message] = await TeamEditController.displayTemporary(false);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.TemporaryEmergencyTeam);
					teamAllTreeDatas.emergency = teamTreeDatas;
				}
			}
		}
		else {
			if (element.classList.contains("on")) {
				messagesOn = false;
			}
			else {
				receiversOn = false;
				messagesOn = true;
			}

			teamTreeDatas = this.state.teamTreeData;
		}

		if (ProjectResource.treeCascadeMode() === TreeNode.Checkbox_RelativeUse) {
			TreeData.setRelativeDefaultCheck(teamTreeDatas);
        }

		this.setState({ teamTreeData: teamTreeDatas, teamAllTreeDatas, receiversOn, messagesOn });
	}

	getReceiversClassName() {
		if (this.state.receiversOn) {
			return "on";
		}

		return "";
	}

	getMessagesClassName() {
		if (this.state.messagesOn) {
			return "on";
		}

		return "";
	}

	onCheckIncludeChildTeam = (event) => {
		this.setState({ includeChildTeams: event.target.checked });
	}

	onChangeAutoRun = (event) => {
		if (this.state.sectionData) {
			const sectionData = { ...this.state.sectionData };
			sectionData.transmission.atmc_execut_yn = event.target.checked;
			this.setState({ sectionData });
		}

		//this.setState({ autoRun: event.target.checked });
    }

	onChangeMode(event, mode) {
		const sectionData = { ...this.state.sectionData };
		const checked = event.target.checked ? true : false;

		if (mode === InternalProperty.SMS_Type) {
			sectionData.transmission.sms_yn = checked;
		}
		else if (mode === InternalProperty.Broadcast_Type) {
			sectionData.transmission.brdcst_yn = checked;
		}
		else if (mode === InternalProperty.Email_Type) {
			sectionData.transmission.email_yn = checked;
		}

		this.setState({ sectionData: sectionData });
	}

	onChangeTeamMode(teamType) {
		this.changeTeamMode(teamType);
	}

	async changeTeamMode(teamType) {
		let teamTreeDatas = null;
		let message = null;
		const teamAllTreeDatas = { ...this.state.teamAllTreeDatas };

		if (teamType === Receiver.RegularTeam) {
			[teamTreeDatas, message] = await TeamEditController.displayRegular();
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.RegularTeam);
			teamAllTreeDatas.regular = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryNormalTeam) {
			[teamTreeDatas, message] = await TeamEditController.displayTemporary(true);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.TemporaryNormalTeam);
			teamAllTreeDatas.normal = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryEmergencyTeam) {
			[teamTreeDatas, message] = await TeamEditController.displayTemporary(false);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.transmission?.receivers, Receiver.TemporaryEmergencyTeam);
			teamAllTreeDatas.emergency = teamTreeDatas;
		}

		this.setState({ teamTreeData: teamTreeDatas, teamAllTreeDatas, teamType });
	}

	onTreeNodeChanged = (team, event) => {
		if (event === undefined) {
			if (this.state.selectedTeam !== team) {
				this.setState({ selectedTeam: team });
			}
		}
		else if (event.type === TreeView.EventCheckedChanged) {
			this.onTreeNodeCheckedChanged(team, this.state.teamType);
		}
	}

	onTreeNodeCheckedChanged(team, teamType) {
		if (team) {
			let receivers = this.state.sectionData.transmission.receivers;

			if (!receivers) {
				this.state.sectionData.transmission.receivers = [];
				receivers = this.state.sectionData.transmission.receivers;
			}

			if (receivers) {
				if (team.checked === TreeNode.CHECKED_NONE) {
					this.removeReceiver(receivers, team.No, teamType);
				}
				else if (team.checked === TreeNode.CHECKED_ALL) {
					this.addReceiver(receivers, team.No, teamType);
				}

				// receivers.splice(0, receivers.length);
				// this.setReceiver(receivers, this.state.teamTreeData);
				const receiverName = SopDataManager.getReceiverText(this.state.sectionData.transmission.receivers, this.state.teamAllTreeDatas);

				if (receiverName !== this.state.receiverName) {
					this.setState({ receiverName });
				}
			}
		}
	}

	setReceiver(receivers, teamTreeData) {
		for (const treeData of teamTreeData) {
			if (treeData.checked) {
				receivers.push({
					teamType: this.state.teamType,
					teamID: treeData.No
				});
			}

			this.setReceiver(receivers, treeData.Children);
        }
    }

	removeReceiver(receivers, teamID, teamType) {
		const receiverCount = receivers.length;

		for (let i = 0; i < receiverCount; i++) {
			const receiver = receivers[i];

			if (receiver.teamType === teamType && receiver.teamID == teamID) {
				receivers.splice(i, 1);
				break;
			}
		}
	}

	addReceiver(receivers, teamID, teamType) {
		const receiverCount = receivers.length;

		for (let i = 0; i < receiverCount; i++) {
			const receiver = receivers[i];

			if (receiver.teamType === teamType && receiver.teamID == teamID) {
				// 이미 존재한다.
				return;
			}
		}

		const receiver = { teamType, teamID };
		receivers.push(receiver);
	}

	onTitleChange = (event) => {
	}

	onMessageChange = (event) => {
    }

	onClickApply(ok) {
		if (ok) {
			this.saveSectionData(true);
			// 확인 버튼을 누르면 강제로 초기화 시키도록 한다.
			this.props.onClickCancel();
		}
		else {
			this.setState({
				sectionData: null,
				teamType: ProcessProperty.getDefaultTeamType(this.props.sectionData),
				teamTreeData: null,
				selectedTeam: null,
				receiversOn: false,
				missionsOn: false,
				includeChildTeams: false
			});

			this.canceled = true;
			this.props.onClickCancel();
		}
	}

	saveSectionData(shouldUpdate) {
		const sectionData = { ...this.state.sectionData };
		// sectionData.transmission.receiver = this.refReceivers.current.value;
		sectionData.transmission.receiverName = this.state.receiverName;
		sectionData.transmission.title = this.refTitle.current.value;
		sectionData.transmission.mssage = this.refMessage.current.value;
		sectionData.transmission.atmc_execut_yn = this.refCheckAutoRun.current.checked;

		this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
	}

	onClickPreview = () => {
		const message = this.refMessage.current.value.trim();

		if (message.length === 0) {
			return;
		}

		this.processPreview(message);
	}

	onClearPreview = () => {
		this.setState({ messagePreview: "" });
    }

	async processPreview(message) {
		const param = new SpecialMessageParameter();
		param.message = message;
		param.location = "상황장소";

		const [resultMessage, errorMessage] = await SopController.requestParseSpecialMessage(param);

		if (resultMessage !== null) {
			this.setState({ messagePreview: resultMessage });
		}
		else if (errorMessage !== null && errorMessage.length > 0) {
			this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMessage], null, null);
        }
    }

	getReceiverName = () => {
		if (this.state.receiverName) {
			return this.state.receiverName;
		}
		else if (this.state.sectionData.transmission.receivers.length > 0) {
			return SopDataManager.getReceiverText(this.state.sectionData.transmission.receivers, this.state.teamAllTreeDatas);
		}
	}

	render() {
		const autoRun = this.state.sectionData?.transmission?.atmc_execut_yn ? true : false;
		const receiverName = this.getReceiverName();
		const isNormal = this.props.sopData?.disaster?.nor_yn;

		return (
			<InternalPropertyComponent>
				<div className={'sprCont'}>
					<div className={'sprTop'}>
						<div className={'sprtTitle'}>
							<h4>상황전파 작성</h4>
							<p>
								<label className={'labelInput'}>
									<input ref={this.refCheckAutoRun} type="checkbox" name="smsChk" id={'smsChk'} checked={autoRun} onChange={this.onChangeAutoRun} />
									자동실행
								</label>
							</p>
						</div>
						<div className={'sprtIptTitleInter'}>
							<dt>제목</dt>
							<dd><input ref={this.refTitle} type="text" defaultValue={this.state.sectionData?.transmission?.title} onChange={this.onTitleChange} /></dd>
						</div>
						<div className={'sprtIpt'}>
							<dt>수신자</dt>
							<dd>
								<div className={'scrollWrapper'}>
									<span className={'scrollContentReci'}>
										<textarea cols="30" rows="10" className={'sprtTxt' + " " + 'scrollbarOuter'} value={receiverName} onChange={() => {}}></textarea>
									</span>
								</div>
							</dd>
						</div>
					</div>
					<div className={'sprMidInternal'}>
						<div className={'scrollContentInternal'}>
							<div className={'sprmCont'}>
								<dl className={'sprmAcdn'}>
									<dt ref={this.refReceivers} className={this.getReceiversClassName()} onClick={this.onClickCascade}>
										전파 대상자 설정
										<Icon.Arrow size="sm" direction={this.state.receiversOn ? "top" : "bottom"} />
									</dt>
									<dd className={this.getReceiversClassName()}>
										<div className={'sprmCheckBox'}>
											<span><input type="checkbox" id="sms" checked={this.state.sectionData?.transmission?.sms_yn} onChange={(event) => this.onChangeMode(event, InternalProperty.SMS_Type)} /><label htmlFor='sms'>문자발송</label></span>
											<span><input type="checkbox" id="broadcast" checked={this.state.sectionData?.transmission?.brdcst_yn} onChange={(event) => this.onChangeMode(event, InternalProperty.Broadcast_Type)} /><label htmlFor='broadcast'>방송전파</label></span>
											<span><input type="checkbox" id="email" checked={this.state.sectionData?.transmission?.email_yn} onChange={(event) => this.onChangeMode(event, InternalProperty.Email_Type)} /><label htmlFor='email'>메일발송</label></span>
										</div>
										<div className={'sprmRadioBox'}>
											<span><input type="radio" name="team" id="team01" checked={this.state.teamType === Receiver.RegularTeam} onChange={() => this.onChangeTeamMode(Receiver.RegularTeam)} /><label htmlFor="team01">정규조직</label></span>
											{
												isNormal ?
													<span><input type="radio" name="team" id="team02" checked={this.state.teamType === Receiver.TemporaryNormalTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryNormalTeam)} /><label htmlFor="team02">평일 비상조직</label></span>
													:
													<span><input type="radio" name="team" id="team03" checked={this.state.teamType === Receiver.TemporaryEmergencyTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryEmergencyTeam)} /><label htmlFor="team03">야간/휴일 비상조직</label></span>
											}
										</div>
										<div className={'sprmTeam'}>
											<TreeView treeViewID="sopInternalTree" treeViewHeight={250} teamTreeData={this.state.teamTreeData} onTreeNodeChanged={this.onTreeNodeChanged} useCheckBox={TreeNode.CheckBox_NormalUse} />
										</div>
									</dd>
									<dt ref={this.refMessages} className={this.getMessagesClassName()} onClick={this.onClickCascade}>
										전파내용 작성
										<Icon.Arrow size="sm" direction={this.state.messagesOn ? "top" : "bottom"} />
									</dt>
									<dd className={this.getMessagesClassName()}>
										<div className={'sprmSprd'}>
											<div className={'scrollWrapper'}>
												<span className={'scrollContentSpread'}>
													<textarea ref={this.refMessage} name="" id="" cols="30" rows="10" className={'sprmSpTxt' + " " + 'scrollbarOuter'} defaultValue={this.state.sectionData?.transmission?.mssage} onChange={this.onMessageChange}></textarea>
												</span>
											</div>
										</div>
									</dd>
								</dl>
							</div>
						</div>
					</div>
					<div className={'sprBot'}>
						<a onClick={() => this.onClickApply(false)}>취소</a>
						<a onClick={() => this.onClickApply(true)}>확인</a>
					</div>
				</div>
			</InternalPropertyComponent>
        );
    }
    /*constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            sectionData: this.props.sectionData
        }

        this.refSMS = React.createRef();
        this.refBroadcast = React.createRef();
        this.refTitle = React.createRef();
        this.refReceiver = React.createRef();
        this.refText = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sectionData !== nextProps.sectionData) {
            this.setState({ sectionData: nextProps.sectionData });
        }
    }

    onApplyComponentProperty = () => {
        const sectionData = { ...this.state.sectionData };
        sectionData.transmission.mssage = this.refText.current.value;
        sectionData.transmission.receiver = this.refReceiver.current.value;
        sectionData.transmission.title = this.refTitle.current.value;

        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChange(isSMS) {
        const sectionData = { ...this.state.sectionData };
        sectionData.isSMS = isSMS;
        this.setState({ sectionData });
    }

    onChangeTitle = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.transmission.title = event.target.value;
        this.setState({ sectionData });
    }

    onChangeReceiver = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.transmission.receiver = event.target.value;
        this.setState({ sectionData });
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.transmission.mssage = event.target.value;
        this.setState({ sectionData });
    }

    render() {
        return (
            <>
                <div className="componentProperties">
                    <span className="componentType">상황전파</span>
                    <div className="internalProperty">
                        <div>
                            <label>제목</label>
                            <input ref={this.refTitle} className="processText" type="text" size="20" onChange={this.onChangeTitle} value={this.state.sectionData.transmission.title} />
                        </div>

                        <div>
                            <label>수신자</label>
                            <input ref={this.refReceiver} className="processText" type="text" size="20" onChange={this.onChangeReceiver} value={this.state.sectionData.transmission.receiver} />
                        </div>
                        <div className="isSMS">
                            <div>
                                <input ref={this.refSMS} type="radio" id="sms" name="sms" onChange={() => this.onChange(true)} checked={this.state.sectionData.isSMS === true} />
                                <label htmlFor="sms">문자메시지</label>
                            </div>

                            <div className="optionItem">
                                <input ref={this.refBroadcast} type="radio" id="broadcast" name="broadcast" onChange={() => this.onChange(false)} checked={this.state.sectionData.isSMS === false} />
                                <label htmlFor="broadcast">방송</label>
                            </div>
                        </div>
                        <div>
                            <textarea ref={this.refText} className="missionText" value={this.state.sectionData.transmission.mssage} onChange={this.onChangeText}/>
                        </div>
                    </div>
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default InternalProperty;