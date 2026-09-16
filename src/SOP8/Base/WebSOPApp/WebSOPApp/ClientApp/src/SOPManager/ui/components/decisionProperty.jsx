import React, { Component } from 'react';
import SectionDataDecision from '../../../Common/models/sections/sectionDataDecision';

import { DecisionPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

class DecisionProperty extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const sectionData = new SectionDataDecision();

		if (this.props.sectionData) {
			SectionDataDecision.copyTo(this.props.sectionData, sectionData);
		}

		this.state = {
			instance: this,
			sectionData: sectionData,
			variableOn: false,
			descriptionOn: false,
			prevProps: this.props
		}

		this.refTitle = React.createRef();
		this.refDescriptionDT = React.createRef();
		this.refDescriptionDD = React.createRef();
		this.refDescription = React.createRef();
		this.refScript = React.createRef();

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

		let sectionData = new SectionDataDecision();

		if (props.sectionData) {
			SectionDataDecision.copyTo(props.sectionData, sectionData);
		}

		state.instance.refTitle.current.value = state.instance.refTitle.current.text = sectionData.decision.title;

		if (sectionData.removed) {
			sectionData = null;
		}

		return {
			instance: state.instance,
			sectionData: sectionData,
			variableOn: state.variableOn,
			descriptionOn: state.descriptionOn,
			prevProps: props
		};
	}

	onClickToggle = (event) => {
		if (event.target.classList.contains("on")) {
			event.target.classList.remove("on");
		}
		else {
			event.target.classList.add("on");
		}
	}

	onTextChange = (event) => {
	}

	onScriptTextChange = (event) => {
	}

	onDescriptionChange = (event) => {
		if (this.state.sectionData) {
			const sectionData = { ...this.state.sectionData };
			sectionData.decision.descp = event.target.value;
			this.setState({ sectionData });
        }
    }

	getVariableClassName() {
		if (this.state.variableOn) {
			return "on";
		}

		return "";
	}

	getDescriptionClassName() {
		if (this.state.descriptionOn) {
			return "on";
		}

		return "";
	}

	onClickCascade = (event) => {
		const element = event.target;

		if (event.target.classList.contains("on")) {
			event.target.classList.remove("on");

			if (element === this.refDescriptionDT.current) {
				this.refDescriptionDT.current.classList.remove("on");

				this.setState({ descriptionOn: false });
            }
		}
		else {
			event.target.classList.add("on");

			if (element === this.refDescriptionDT.current) {
				if (this.refDescriptionDT.current.classList.contains("on") === false) {
					this.refDescriptionDT.current.classList.add("on");
				}

				this.setState({ variableOn: false, descriptionOn: true });
			}
        }
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
			});

			this.canceled = true;
			this.props.onClickCancel();
		}
	}

	saveSectionData(shouldUpdate) {
		const sectionData = { ...this.state.sectionData };
		sectionData.decision.title = this.refTitle.current.value;
		sectionData.decision.descp = this.refDescription.current.value;

		this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
	}

	render() {
		const description = this.state.sectionData?.decision?.descp ? this.state.sectionData.decision.descp : "";

		return (
			<DecisionPropertyComponent>
			<div className={'sprContDecision'}>
				<div className={'sprTop'}>
					<div className={'sprtTitle'}>
						<h4>판단문 작성</h4>
					</div>

					<div className={'scrollWrapper'}>
						<span className={'scrollContentDecision'}>
							<textarea ref={this.refTitle} name="" id="" cols="30" rows="10" defaultValue={this.state.sectionData?.decision?.title} onChange={this.onTextChange}></textarea>
						</span>
					</div>
				</div>

				<div className={'scrollWrapperDecision'}>
					<div className={'sprmCont'}>
						<dl className={'sprmAcdn'}>
							<dt ref={this.refDescriptionDT} className={this.getDescriptionClassName()} onClick={this.onClickCascade}>판단 기준 설명</dt>
							<dd ref={this.refDescriptionDD} className={this.getDescriptionClassName()}>
								<div className={'scrollWrapper'}>
									<span className={'scrollContentJudgment'}>
										<textarea ref={this.refDescription} cols="30" rows="10" value={description} onChange={this.onDescriptionChange}></textarea>
									</span>
								</div>
							</dd>
						</dl>
					</div>
				</div>
				<div className={'sprBot'}>
					<a onClick={() => this.onClickApply(false)}>취소</a>
					<a onClick={() => this.onClickApply(true)}>확인</a>
				</div>
			</div>
			</DecisionPropertyComponent>
        );
    }
}

export default DecisionProperty;