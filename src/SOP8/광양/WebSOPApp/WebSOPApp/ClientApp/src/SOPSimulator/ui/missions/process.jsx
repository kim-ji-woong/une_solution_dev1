import React, { useState, useEffect, useRef } from 'react';
import SectionData from '../../../Common/models/sections/sectionData';
import ProjectResource from '../../../Root/resource/id';
import { SettingController } from '../../../Settings/services/settingController';

import { ProcessComponent } from '../../styled/missionsStyled';
import Receiver from '../../../Common/models/sections/receiver';

function Process(props) {
    const missionType = {
        Normal: 0,
        External: 1,
        None: 2
    };

    const onClickSMSType = 'sms';
    const onClickEmailType = 'email';
    const onClickExternalType = 'external';
    const onClickAllType = 'all';

    const [allChecked, setAllChecked] = useState(false);
    // const [missions, setMissions] = useState(props.sectionData.process.missions);
    const [missions, setMissions] = useState(null);

    const confirmDialogData = useRef(null);

    useEffect(() => {
        let nextAllChecked = true;
        if (props.sectionData.process.missions === null || props.sectionData.process.missions.length === 0) {
            if (props.sectionData.status === SectionData.Status_Done) {
                nextAllChecked = true;
            } else {
                nextAllChecked = allChecked;
            }
        } 
        else {
            for (let i = 0; i < props.sectionData.process.missions.length; i++) {
                if (!props.sectionData.process.missions[i].checked) {
                    nextAllChecked = false;
                    break;
                }
            }
        }

        setMissions(props.sectionData.process.missions);
        setAllChecked(nextAllChecked);
    }, [props.sectionData]);

    const runSection = () => {        
        props.runSection(props.sectionData);
    }

    const showConfirmDialogExternal = (mission) => {
        if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            return;
        }

        confirmDialogData.current = [onClickExternalType, mission];

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['외부 프로그램을 실행할까요?'], ['취소', '실행'], onProgress);
    }

    const showConfirmDialog = (onClickType, mission) => {
        if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            return;
        }

        if (props.sectionData.process.missions === null || props.sectionData.process.missions.length === 0) {
            return;
        }

        let strMessage = '';
        if (props.sectionData.process.receivers === null || props.sectionData.process.receivers.length === 0) {
            strMessage = '수신자가 없습니다.'
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [strMessage], null, null);
            return;
        }

        if (onClickType === onClickSMSType) {
            if (props.commonSettings.UseSMS.value === 'false') {
                strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '문자메시지를 발송할까요?'
            }

            confirmDialogData.current = [onClickSMSType, mission];
        }
        else if (onClickType === onClickEmailType) {
            if (props.commonSettings.UseEmail.value === 'false') {
                strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '메일을 전송할까요?';
            }
            confirmDialogData.current = [onClickEmailType, mission];
        }
        else if (onClickType === onClickAllType) {
            let containsNormalMission = false;
            const missionCount = props.sectionData.process.missions.length;
            for (let i = 0; i < missionCount; i++) {
                if (props.sectionData.process.missions[i].missionType === missionType.Normal) {
                    containsNormalMission = true;
                    break;
                }
            }

            if (containsNormalMission) {
                if (props.commonSettings.UseSMS.value === 'false' && props.commonSettings.UseEmail.value === 'true') {
                    strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (props.commonSettings.UseSMS.value === 'true' && props.commonSettings.UseEmail.value === 'false') {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (props.commonSettings.UseSMS.value === 'false' && props.commonSettings.UseEmail.value === 'false') {
                    strMessage = '문자와 메일 전파가 사용되지 않음으로 설정되어 있습니다. 문자, 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else {
                    strMessage = '문자메시지와 메일을 모두 전송할까요?';
                }
            }
            else {
                strMessage = '모든 외부 프로그램을 실행할까요?';
            }

            confirmDialogData.current = [onClickAllType];
        }

        //if (useManualInputMessagePopup) {
        //    const showManualInputMessagePopup = {
        //        visible: true, message: strMessage
        //    }
        //    setState({ showManualInputMessagePopup });
        //}
        //else {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [strMessage],  ['취소', '상황 전파'], onProgress);
        //}
    }

    const SaveSetting = async (propertyName, propertyValue) => {
        const result = await SettingController.requestSaveSetting(propertyName, propertyValue);
        return result;
    }

    // 보류
    // bIncludeOrg : 핸드폰 번호 추가 입력 기능을 사용하는 사이트 (깨끗한나라) 에서
    //               기존에 지정된 담당자들에게도 발송할건지 여부 
    // otherPhoneNumbers : 추가 입력한 번호들
    const onProgress = async (index, bIncludeOrg, otherPhoneNumbers) => {
        if (index === 1) {
            if (confirmDialogData.current) {
                const type = confirmDialogData[0];
                if (type === onClickSMSType && confirmDialogData[1]) {
                    let useSMS = props.commonSettings.UseSMS.value === 'true';
                    if (!useSMS) {
                        useSMS = await SaveSetting('UseSMS', 'true');
                    }

                    if (useSMS) {
                        onProgressSpread(confirmDialogData.current[1], type);
                    }
                }
                else if (type === onClickEmailType && confirmDialogData.current[1]) {
                    let useEmail = props.commonSettings.UseEmail.value === 'true';
                    if (!useEmail) {
                        useEmail = await SaveSetting('UseEmail', 'true');
                    }

                    if (useEmail) {
                        onProgressSpread(confirmDialogData.current[1], type);
                    }
                }
                else if (type === onClickExternalType && confirmDialogData.current[1]) {
                    onProgressSpread(confirmDialogData.current[1], type);
                }
                else if (type === onClickAllType) {
                    let containsNormalMission = false;
                    const missionCount = props.sectionData.process.missions.length;
                    for (let i = 0; i < missionCount; i++) {
                        if (props.sectionData.process.missions[i].missionType === missionType.Normal) {
                            containsNormalMission = true;
                            break;
                        }
                    }

                    if (containsNormalMission) {
                        let useSMS = props.commonSettings.UseSMS.value === 'true';
                        if (!useSMS) {
                            useSMS = await SaveSetting('UseSMS', 'true');
                        }

                        let useEmail = props.commonSettings.UseEmail.value === 'true';
                        if (!useEmail) {
                            useEmail = await SaveSetting('UseEmail', 'true');
                        }

                        if (useSMS && useEmail) {
                            onProgressSpreadAll();
                        }
                    }
                    else {
                        onProgressSpreadAll();
                    }
                }

                confirmDialogData.current = undefined;
            }
        }

        props.onCloseConfirmDialog();
    }

    const onProgressSpread = (mission, type) => {
        const missions = props.sectionData.process.missions;
        const missionsLength = props.sectionData.process.missions.length;

        let missionIndex = -1;
        for (let i = 0; i < missionsLength; i++) {
            if (missions[i] === mission) {
                // 몇 번째 임무인지 구하기
                missionIndex = i;
                break;
            }
        }

        if (type === onClickExternalType) {
            props.onExcuteExternalProgram(props.sectionData, missionIndex);
        }
        else {
            props.onProgressSpread(props.sectionData, missionIndex, type === onClickSMSType, !type === onClickSMSType, false, false);
        }
    }

    const onProgressSpreadAll = () => {
        if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            return;
        }

        props.onProgressSpread(props.sectionData, -1, true, true, false, false);
    }

    const onProgressMission = async (checked, mission) => {
        if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            return;
        }

        const missionsData = missions;
        const missionsLength = missions.length;

        let allChecked = true;
        let missionIndex = -1;
        for (var i = 0; i < missionsLength; i++) {
            if (missionsData[i] === mission) {
                // 몇 번째 임무인지 구하기
                missionIndex = i;
                missionsData[i].checked = checked;
            }

            if (!missionsData[i].checked) {
                allChecked = false;
            }
        }

        if (allChecked) {
            props.sectionData.status = SectionData.Status_Done;
        }

        setMissions(missionsData);
        setAllChecked(allChecked);

        if (missionIndex >= 0) {
            await props.onProgressMission(checked, props.sectionData, missionIndex);
        }
    }

    const getMissionListUI = () => {
        var missionList = [];

        if (missions) {
            for (let i = 0; i < missions?.length; i++) {
                const mission = missions[i];
                let misn_contents = '';
                misn_contents = mission.misn_contents;

                missionList.push(
                    <dd className={'borderSide'} key={i}>
                        <p className={'check'}>
                            <span className={'checkBox'}>
                                <input type="checkbox" name="task01"
                                    onChange={(e) => onProgressMission(e.target.checked, mission)}
                                    checked={mission.checked} />
                            </span>
                        </p>
                        <p className={'tit'}>
                            <textarea className={'processTextarea processTextScrollbar'} defaultValue={misn_contents} readOnly />
                        </p>
                        <p className={mission.checked ? 'completionStatus done' : 'completionStatus'}>{mission.checked ? '완료' : '미완료'}</p>
                    </dd>
                );
            }
        }

        return [missionList];
    }

    const onCheckedChangeAll = async (checked) => {
        if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            return;
        }

        if (missions === null || missions.length === 0) {            
            await props.onProgressMission(checked, props.sectionData, -1);
            setMissions(missions);
            setAllChecked(checked);
            return;
        }

        const missionsLength = missions.length;

        for (var i = 0; i < missionsLength; i++) {
            if (missions[i].checked === checked) {
                continue;
            }

            missions[i].checked = checked;
            props.sectionData.status = checked ? SectionData.Status_Done : SectionData.Status_Run;

            await props.onProgressMission(checked, props.sectionData, i);
        }

        setMissions(missions);
        setAllChecked(checked);

    }

    const getReceiversUI = () => {
        if (!props.sectionData.process.receivers || props.sectionData.process.receivers.length === 0)
            return <></>;

        let ui = [];
        const receiverCount = props.sectionData.process.receivers.length;

        for (let i = 0; i < receiverCount; i++) {
            const receiver = props.sectionData.process.receivers[i];
            // 0:평일비상조직, 1:휴일비상조직, 2:정규조직
            const teamType = receiver.teamType;
            const teamID = receiver.teamID;

            let content = getReceiverContent(teamType, teamID);

            ui.push(<p key={"teamInfo_" + i}>{content}</p>);
        }
        //}
        return ui;
    }

    const getReceiverContent = (teamType, teamID) => {
        let content = '';

        let teamDatas = null;
        if (teamType === Receiver.RegularTeam) {
            teamDatas = props.teamDatas.regular;
        }

        if (!teamDatas || teamDatas === null) {
            return '';
        }

        for (let i = 0; i < teamDatas.length; i++) {
            if (teamDatas[i].rgl_sn === teamID) {
                content = teamDatas[i].team_name;
                break;
            }
        }

        return content;
    }

    //현재임무 - sectionCurrent
    //대기(실행중) - sectionRun
    //완료 - sectionDone
    //대기 - 
    let boxClassName = "";
    let textClassName = " " + 'textNormal';

    let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
    if (props.currentSection?.component?.compn_sn === props.sectionData.component.compn_sn && props.currentSection?.component?.compn_code === props.sectionData.component.compn_code) {
        bAmICurrentSection = true;
    }

    if (bAmICurrentSection) {                
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Run) { // 실행중
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Done) { // 완료
        boxClassName = " " + 'sectionDone';
        textClassName = " " + 'textDone';
    } else if (props.sectionData.status === SectionData.Status_Skip) { // 스킵
        boxClassName = " " + 'sectionRun';
        textClassName = " " + 'textRun';
    }

    // 다음 버튼 활성화
    let btnNextClassName = 'btnAllCheck';
    let btnSpreadAllName = 'btnArea btnPropagateSelect';
    if (!props.sectionData.process.execut_no) {
        // sectionNumber가 null일 때
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }
    else if (props.currentSection && SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }

    const receiversUI = getReceiversUI();

    return (
        <ProcessComponent className={'sectionBox' + boxClassName} id={props.id}>
            <div className={'tit clfix' + textClassName}>
                <strong>
                    {props.sectionData.process.execut_no}.{props.sectionData.process.title}
                    {
                        (props.sectionData.process.atmc_execut_yn)
                            ? <span className={'flag flag01'}>자동</span>
                            : <></>
                    }
                </strong>

                {/* <div className={'receiversWrap'}>
                    <div className={'propagatePeople'}>
                        <button type="button">임무대상자</button>
                    </div>
                    <div className={'dropBox'}>
                        {receiversUI}
                    </div>
                </div> */}
                
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
                <div className={allChecked ? 'completionStatuss done' : 'completionStatuss'}>{(allChecked) ? '완료' : '미완료'}</div>
            </div>
            <dl className={'taskDetail'}>
                <span className={'taskDetailFlex'}>
                    <p className={'checkk checkk'}>
                        {
                            (props.missions !== null) ?
                                <span className={'checkBox'}>
                                    <input type="checkbox" name=" " checked={allChecked} onChange={(e) => onCheckedChangeAll(e.target.checked)} />
                                </span>
                                : null
                        }
                    </p>
                    <dt>행동요령</dt>
                </span>
                {getMissionListUI()}
            </dl>
        </ProcessComponent>
    );
}

export default Process;