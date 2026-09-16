import React, { Component } from 'react';
import SectionDataInternal from '../../../Common/models/sections/sectionDataInternal';
import ProcessProperty from './processProperty';
import Receiver from '../../../Common/models/sections/receiver';
import TreeView from '../../../TeamEditor/ui/utility/treeview';
import { TeamEditController } from '../../../TeamEditor/services/teamEditController';
import SectionData from '../../../Common/models/sections/sectionData';
import TreeNode from '../../../TeamEditor/ui/utility/treenode';
import SopDataManager from '../../services/sopDataManager';
import SpecialMessageParameter from '../../../Common/js/specialMessageParameter';
import SopController from '../../services/sopController';
import ProjectResource from '../../../Root/resource/id';

import { InternalPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

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
			receiverName: sectionData.receiverName ? sectionData.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: false,
			messagesOn: false,
			includeChildTeams: false,
			/*autoRun: sectionData.autoRun,*/
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

		state.instance.refTitle.current.value = state.instance.refTitle.current.text = sectionData.text;
		state.instance.refMessage.current.value = state.instance.refMessage.current.text = sectionData.message;

		if (sectionData.removed) {
			sectionData = null;
		}

		return {
			instance: state.instance,
			sectionData: sectionData,
			teamType: ProcessProperty.getDefaultTeamType(props.sectionData),
			teamTreeData: null,
			teamAllTreeDatas: { ...props.teamAllTreeDatas },
			receiverName: sectionData?.receiverName ? sectionData?.receiverName : "",
			messagePreview: "",
			selectedTeam: null,
			receiversOn: state.receiversOn,
			messagesOn: state.messagesOn,
			includeChildTeams: state.includeChildTeams,
			/*autoRun: sectionData.autoRun,*/
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
					teamTreeDatas = await TeamEditController.DisplayRegular();
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.RegularTeam);
					teamAllTreeDatas.regular = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryNormalTeam) {
					teamTreeDatas = await TeamEditController.DisplayTemporary(true);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryNormalTeam);
					teamAllTreeDatas.normal = teamTreeDatas;
				}
				else if (this.state.teamType === Receiver.TemporaryEmergencyTeam) {
					teamTreeDatas = await TeamEditController.DisplayTemporary(false);
					SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryEmergencyTeam);
					teamAllTreeDatas.emergency = teamTreeDatas;
				}
			}

			//if (element.classList.contains(InternalProperty.cssStyles.on)) {
			//	receiversOn = false;
			//}
			//else {
			//	receiversOn = true;
			//	messagesOn = false;
			//}
		}
		else {
			if (element.classList.contains("on")) {
				messagesOn = false;
			}
			else {
				receiversOn = false;
				messagesOn = true;
			}
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
			sectionData.autoRun = event.target.checked;
			this.setState({ sectionData });
		}

		//this.setState({ autoRun: event.target.checked });
    }

	onChangeMode(event, mode) {
		const sectionData = { ...this.state.sectionData };
		const checked = event.target.checked ? true : false;

		if (mode === InternalProperty.SMS_Type) {
			sectionData.isSMS = checked;
		}
		else if (mode === InternalProperty.Broadcast_Type) {
			sectionData.isBroadcast = checked;
		}
		else if (mode === InternalProperty.Email_Type) {
			sectionData.isEmail = checked;
		}

		this.setState({ sectionData: sectionData });
	}

	onChangeTeamMode(teamType) {
		this.changeTeamMode(teamType);
	}

	async changeTeamMode(teamType) {
		let teamTreeDatas = null;
		const teamAllTreeDatas = { ...this.state.teamAllTreeDatas };

		if (teamType === Receiver.RegularTeam) {
			teamTreeDatas = await TeamEditController.DisplayRegular();
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.RegularTeam);
			teamAllTreeDatas.regular = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryNormalTeam) {
			teamTreeDatas = await TeamEditController.DisplayTemporary(true);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryNormalTeam);
			teamAllTreeDatas.normal = teamTreeDatas;
		}
		else if (teamType === Receiver.TemporaryEmergencyTeam) {
			teamTreeDatas = await TeamEditController.DisplayTemporary(false);
			SopDataManager.setTeamTreeDataChecked(teamTreeDatas, this.state.sectionData?.receivers, Receiver.TemporaryEmergencyTeam);
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
			let receivers = this.state.sectionData.receivers;

			if (!receivers) {
				this.state.sectionData.receivers = [];
				receivers = this.state.sectionData.receivers;
			}

			if (receivers) {
				/*if (team.checked === TreeNode.CHECKED_NONE) {
					this.removeReceiver(receivers, team.ID, teamType);
				}
				else if (team.checked === TreeNode.CHECKED_ALL) {
					this.addReceiver(receivers, team.ID, teamType);
				}*/

				receivers.splice(0, receivers.length);
				this.setReceiver(receivers, this.state.teamTreeData);
				const receiverName = SopDataManager.getReceiverText(this.state.sectionData.receivers, this.state.teamAllTreeDatas);

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
					teamID: treeData.ID
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
		sectionData.receiver = this.refReceivers.current.value;
		sectionData.receiverName = this.state.receiverName;
		sectionData.text = this.refTitle.current.value;
		sectionData.message = this.refMessage.current.value;
		sectionData.autoRun = this.refCheckAutoRun.current.checked;

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

	render() {
		const autoRun = this.state.sectionData?.autoRun ? true : false;

		return (
			<InternalPropertyComponent>
				<div className={'sprCont'}>
					<div className={'sprTop'}>
						<div className={'sprtTitle'}>
							<h4>전파내용 입력</h4>
							<p>
								<label className={'labelInput'}>
									<input ref={this.refCheckAutoRun} type="checkbox" name="smsChk" id={'smsChk'} checked={autoRun} onChange={this.onChangeAutoRun} />
									자동실행
								</label>
							</p>
						</div>
						<div className={'sprtIptTitleInter'}>
							<dt>제목</dt>
							<dd><input ref={this.refTitle} type="text" defaultValue={this.state.sectionData?.text} onChange={this.onTitleChange} /></dd>
						</div>
						<div className={'sprtIpt'}>
							<dt>수신자</dt>
							<dd>
								<div className={'scrollWrapper'}>
									<span className={'scrollContentReci'}>
										<textarea cols="30" rows="10" className={'sprtTxt' + " " + 'scrollbarOuter'} value={this.state.receiverName} onChange={() => {}}></textarea>
									</span>
								</div>
							</dd>
						</div>
					</div>
					<div className={'sprMidInternal'}>
						<div className={'scrollContentInternal'}>
							<div className={'sprmCont'}>
								<dl className={'sprmAcdn'}>
									<dt ref={this.refReceivers} className={this.getReceiversClassName()} onClick={this.onClickCascade}>수신자</dt>
									<dd className={this.getReceiversClassName()}>
										<div className={'sprmCheckBox'}>
											<span><input type="checkbox" checked /><label>문자발송</label></span>
											<span><input type="checkbox" /><label>방송전파</label></span>
											<span><input type="checkbox" /><label>메일발송</label></span>
										</div>
										<div className={'sprmRadioBox'}>
											<span><input type="radio" name="team" id="team01" /><label htmlFor="team01">정규조직</label></span>
											<span><input type="radio" name="team" id="team01" /><label htmlFor="team01">평일 비상조직</label></span>
											<span><input type="radio" name="team" id="team01" /><label htmlFor="team01">야간/휴일 비상조직</label></span>
										</div>
										<div className={'sprmTeam'}>
											{
												//<SprmRdo>
												//	<li>
												//		<label>
												//			<LabelInputRadio>
												//				<input type="radio" name="sprmRdo" /* className={bodyStyles.labelInput} */ id={InternalProperty.cssStyles.sprmRdo01} checked={this.state.teamType === Receiver.RegularTeam} onChange={() => this.onChangeTeamMode(Receiver.RegularTeam)} />
												//			</LabelInputRadio>
												//		정규조직
												//	</label>
												//	</li>
												//	<li>
												//		<label>
												//			<LabelInputRadio>
												//				<input type="radio" name="sprmRdo" /* className={bodyStyles.labelInput} */ id={InternalProperty.cssStyles.sprmRdo02} checked={this.state.teamType === Receiver.TemporaryNormalTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryNormalTeam)} />
												//			</LabelInputRadio>
												//		평일 비상조직
												//	</label>
												//	</li>
												//	<li>
												//		<label>
												//			<LabelInputRadio>
												//				<input type="radio" name="sprmRdo" /* className={bodyStyles.labelInput} */ id={InternalProperty.cssStyles.sprmRdo03} checked={this.state.teamType === Receiver.TemporaryEmergencyTeam} onChange={() => this.onChangeTeamMode(Receiver.TemporaryEmergencyTeam)} />
												//			</LabelInputRadio>
												//		야간/휴일 비상조직
												//	</label>
												//	</li>
												//</SprmRdo>
											}
											<TreeView treeViewID="sopInternalTree" treeViewHeight={250} teamTreeData={this.state.teamTreeData} onTreeNodeChanged={this.onTreeNodeChanged} useCheckBox={TreeNode.CheckBox_NormalUse} />
										</div>
									</dd>
									<dt ref={this.refMessages} className={this.getMessagesClassName()} onClick={this.onClickCascade}>전파내용</dt>
									<dd className={this.getMessagesClassName()}>
										<div className={'sprmSprd'}>
											<div className={'scrollWrapper'}>
												<span className={'scrollContentSpread'}>
													<textarea ref={this.refMessage} name="" id="" cols="30" rows="10" className={'sprmSpTxt' + " " + 'scrollbarOuter'} defaultValue={this.state.sectionData?.message} onChange={this.onMessageChange}></textarea>
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
        sectionData.message = this.refText.current.value;
        sectionData.receiver = this.refReceiver.current.value;
        sectionData.text = this.refTitle.current.value;

        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChange(isSMS) {
        const sectionData = { ...this.state.sectionData };
        sectionData.isSMS = isSMS;
        this.setState({ sectionData });
    }

    onChangeTitle = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = event.target.value;
        this.setState({ sectionData });
    }

    onChangeReceiver = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.receiver = event.target.value;
        this.setState({ sectionData });
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.message = event.target.value;
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
                            <input ref={this.refTitle} className="processText" type="text" size="20" onChange={this.onChangeTitle} value={this.state.sectionData.text} />
                        </div>

                        <div>
                            <label>수신자</label>
                            <input ref={this.refReceiver} className="processText" type="text" size="20" onChange={this.onChangeReceiver} value={this.state.sectionData.receiver} />
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
                            <textarea ref={this.refText} className="missionText" value={this.state.sectionData.message} onChange={this.onChangeText}/>
                        </div>
                    </div>
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default InternalProperty;