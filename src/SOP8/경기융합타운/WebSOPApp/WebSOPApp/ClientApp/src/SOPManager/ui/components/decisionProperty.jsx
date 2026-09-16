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
			useVariables: false,
			variableOn: false,
			descriptionOn: false,
			prevProps: this.props
		}

		this.refTitle = React.createRef();
		this.refVariableDT = React.createRef();
		this.refVariableDD = React.createRef();
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

		state.instance.refTitle.current.value = state.instance.refTitle.current.text = sectionData.text;

		if (sectionData.removed) {
			sectionData = null;
		}

		return {
			instance: state.instance,
			sectionData: sectionData,
			useVariables: state.useVariables,
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
			sectionData.description = event.target.value;
			this.setState({ sectionData });
        }
    }

	onCheckUseVariables = (event) => {
		if (event.target.checked) {
			if (this.refVariableDT.current.classList.contains("on") === false) {
				this.refVariableDT.current.classList.add("on");
			}

			if (this.refVariableDD.current.classList.contains("on") === false) {
				this.refVariableDD.current.classList.add("on");
			}
		}
		else {
			if (this.refVariableDT.current.classList.contains("on")) {
				this.refVariableDT.current.classList.remove("on");
			}

			if (this.refVariableDD.current.classList.contains("on")) {
				this.refVariableDD.current.classList.remove("on");
			}
        }

		this.setState({ useVariables: event.target.checked });
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

			if (element === this.refVariableDT.current) {
				this.refVariableDT.current.classList.remove("on");

				this.setState({ variableOn: false });
			}
			else if (element === this.refDescriptionDT.current) {
				this.refDescriptionDT.current.classList.remove("on");

				this.setState({ descriptionOn: false });
            }
		}
		else {
			event.target.classList.add("on");

			if (element === this.refVariableDT.current) {
				if (this.refVariableDT.current.classList.contains("on") === false) {
					this.refVariableDT.current.classList.add("on");
				}

				this.refDescriptionDT.current.classList.remove("on");

				this.setState({ variableOn: true, descriptionOn: false });
			}
			else if (element === this.refDescriptionDT.current) {
				if (this.refDescriptionDT.current.classList.contains("on") === false) {
					this.refDescriptionDT.current.classList.add("on");
				}

				this.refVariableDT.current.classList.remove("on");

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
				useVariables: false
			});

			this.canceled = true;
			this.props.onClickCancel();
		}
	}

	saveSectionData(shouldUpdate) {
		const sectionData = { ...this.state.sectionData };
		sectionData.text = this.refTitle.current.value;
		sectionData.description = this.refDescription.current.value;
		sectionData.autoRunScript = this.refScript.current.value;

		this.props.onApplyComponentProperty(sectionData, this.props.actionStep, shouldUpdate);
	}

	render() {
		const description = this.state.sectionData?.description ? this.state.sectionData.description : "";

		return (
			<DecisionPropertyComponent>
			<div className={'sprContDecision'}>
				<div className={'sprTop'}>
					<div className={'sprtTitle'}>
						<h4>판단문 작성</h4>
						<p>
							<label>
								<span className={'labelInput'}>
								    <input type="checkbox" name="sskChk" id={'sskChk'} checked={this.state.useVariables} onChange={this.onCheckUseVariables}/>
									수식사용
								</span>
							</label>
						</p>
					</div>

					<div className={'scrollWrapper'}>
						<span className={'scrollContentDecision'}>
							<textarea ref={this.refTitle} name="" id="" cols="30" rows="10" defaultValue={this.state.sectionData?.text} onChange={this.onTextChange}></textarea>
						</span>
					</div>
				</div>

				<div className={'scrollWrapperDecision'}>
					<div className={'sprmCont'}>
						<dl className={'sprmAcdn'}>
							<dt ref={this.refVariableDT} className={this.getVariableClassName()} onClick={this.onClickCascade}>수식</dt>
							<dd ref={this.refVariableDD} className={this.getVariableClassName()}>
								<div className={'scrollWrapper'}>
									<span className={'scrollContentModify'}>
										<textarea ref={this.refScript} name="" id="" cols="30" rows="10" defaultValue={this.state.sectionData?.autoRunScript} onChange={this.onScriptTextChange}></textarea>
									</span>
								</div>
								<span className={'tableTitle'}>기본타입</span>
								<div className={'sopEdtTb'}>
									<table>
										<caption>변수, 타입, 설명으로 구성된 표</caption>
										<colgroup>
											<col />
											<col />
											<col />
										</colgroup>
										<thead>
											<tr>
												<th>변수</th>
												<th>Type</th>
												<th>설명</th>
											</tr>
										</thead>
										<tbody>
											<tr onClick={this.onClickToggle}>
												<td>time</td>
												<td>문자열</td>
												<td className={'tal'}><p className={'nwrp'}>상황발생 시간 상황발생 시간 상황발생 시간</p></td>
											</tr>
											<tr onClick={this.onClickToggle}>
												<td>location</td>
												<td>문자열</td>
												<td className={'tal'}><p className={'nwrp'}>상황발생 위치 상황발생 위치 상황발생 위치</p></td>
											</tr>
											<tr>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
										</tbody>
									</table>
								</div>

								<span className={'tableTitle'}>기본타입</span>
								<div className={'sopEdtTb'}>
									<table>
										<caption>변수, 타입, 설명으로 구성된 표</caption>
										<colgroup>
											<col />
											<col />
											<col />
										</colgroup>
										<thead>
											<tr>
												<th>변수</th>
												<th>Type</th>
												<th>설명</th>
											</tr>
										</thead>
										<tbody>
											<tr onClick={this.onClickToggle}>
												<td>time</td>
												<td>문자열</td>
												<td className={'tal'}><p className={'nwrp'}>상황발생 시간 상황발생 시간 상황발생 시간</p></td>
											</tr>
											<tr onClick={this.onClickToggle}>
												<td>location</td>
												<td>문자열</td>
												<td className={'tal'}><p className={'nwrp'}>상황발생 위치 상황발생 위치 상황발생 위치</p></td>
											</tr>
											<tr>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
										</tbody>
									</table>
								</div>
							</dd>
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
    /*constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            sectionData: this.props.sectionData
        }

        this.refText = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.sectionData !== nextProps.sectionData) {
            this.setState({ sectionData: nextProps.sectionData });
        }
    }

    onApplyComponentProperty = () => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = this.refText.current.value;
        this.props.onApplyComponentProperty(sectionData, this.props.actionStep);
    }

    onChangeText = (event) => {
        const sectionData = { ...this.state.sectionData };
        sectionData.text = this.refText.current.value;
        this.setState({ sectionData });
    }

    render() {
        return (
            <>
                <div className="componentProperties">
                    <span className="componentType">판단</span>
                    <div className="decisionProperty">
                        <label className="decisionLabel">내용</label>
                        <textarea ref={this.refText} className="componentText" value={this.state.sectionData.text} onChange={this.onChangeText}/>
                    </div>
                </div>
                <button className="btnApply" onClick={this.onApplyComponentProperty}>적용</button>
            </>
        );
    }*/
}

export default DecisionProperty;