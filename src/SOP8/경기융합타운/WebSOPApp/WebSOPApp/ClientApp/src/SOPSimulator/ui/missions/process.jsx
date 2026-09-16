import React, { useState, useEffect } from 'react';
//import uis from '../../../Common/css/ui.module.css';
import SectionData from '../../../Common/models/sections/sectionData';
import ProjectResource from '../../../Root/resource/id';
import { SettingController } from '../../../Settings/services/settingController';

import { ProcessComponent } from '../../styled/missionsStyled';

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
    const [missions, setMissions] = useState(props.sectionData.missions);

    useEffect(() => {
        let nextAllChecked = true;
        if (props.sectionData.missions === null || props.sectionData.missions.length === 0) {
            if (props.sectionData.status === SectionData.Status_Done) {
                nextAllChecked = true;
            } else {
                nextAllChecked = allChecked;
            }
        } 
        else {
            for (let i = 0; i < props.sectionData.missions.length; i++) {
                if (!props.sectionData.missions[i].checked) {
                    nextAllChecked = false;
                    break;
                }
            }
        }

        setMissions(props.sectionData.missions);
        setAllChecked(nextAllChecked);
    }, [props.sectionData]);

    const runSection = () => {        
        props.runSection(props.sectionData);
    }

    const showConfirmDialogExternal = (mission) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        confirmDialogData = [onClickExternalType, mission];

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['외부 프로그램을 실행할까요?'], ['취소', '실행'], onProgress);
    }

    const showConfirmDialog = (onClickType, mission) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        if (props.sectionData.missions === null || props.sectionData.missions.length === 0) {
            return;
        }

        let strMessage = '';
        if (props.sectionData.receivers === null || props.sectionData.receivers.length === 0) {
            strMessage = '수신자가 없습니다.'
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [strMessage], null, null);
            return;
        }

        if (onClickType === onClickSMSType) {
            if (props.commonSettings.UseSMS === 'false') {
                strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '문자메시지를 발송할까요?'
            }

            confirmDialogData = [onClickSMSType, mission];
        }
        else if (onClickType === onClickEmailType) {
            if (props.commonSettings.UseEmail === 'false') {
                strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
            }
            else {
                strMessage = '메일을 전송할까요?';
            }
            confirmDialogData = [onClickEmailType, mission];
        }
        else if (onClickType === onClickAllType) {
            let containsNormalMission = false;
            const missionCount = props.sectionData.missions.length;
            for (let i = 0; i < missionCount; i++) {
                if (props.sectionData.missions[i].missionType === missionType.Normal) {
                    containsNormalMission = true;
                    break;
                }
            }

            if (containsNormalMission) {
                if (props.commonSettings.UseSMS === 'false' && props.commonSettings.UseEmail === 'true') {
                    strMessage = '문자 전파가 사용되지 않음으로 설정되어 있습니다. 문자 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (props.commonSettings.UseSMS === 'true' && props.commonSettings.UseEmail === 'false') {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else if (props.commonSettings.UseSMS === 'false' && props.commonSettings.UseEmail === 'false') {
                    strMessage = '문자와 메일 전파가 사용되지 않음으로 설정되어 있습니다. 문자, 메일 전파를 사용함으로 설정하고 문자메시지와 메일을 모두 전송할까요?'
                }
                else {
                    strMessage = '문자메시지와 메일을 모두 전송할까요?';
                }
            }
            else {
                strMessage = '모든 외부 프로그램을 실행할까요?';
            }

            confirmDialogData = [onClickAllType];
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
            if (confirmDialogData) {
                const type = confirmDialogData[0];
                if (type === onClickSMSType && confirmDialogData[1]) {
                    let useSMS = props.commonSettings.UseSMS === 'true';
                    if (!useSMS) {
                        useSMS = await SaveSetting('UseSMS', 'true');
                    }

                    if (useSMS) {
                        onProgressSpread(confirmDialogData[1], type);
                    }
                }
                else if (type === onClickEmailType && confirmDialogData[1]) {
                    let useEmail = props.commonSettings.useEmail === 'true';
                    if (!useEmail) {
                        useEmail = await SaveSetting('UseEmail', 'true');
                    }

                    if (useEmail) {
                        onProgressSpread(confirmDialogData[1], type);
                    }
                }
                else if (type === onClickExternalType && confirmDialogData[1]) {
                    onProgressSpread(confirmDialogData[1], type);
                }
                else if (type === onClickAllType) {
                    let containsNormalMission = false;
                    const missionCount = props.sectionData.missions.length;
                    for (let i = 0; i < missionCount; i++) {
                        if (props.sectionData.missions[i].missionType === missionType.Normal) {
                            containsNormalMission = true;
                            break;
                        }
                    }

                    if (containsNormalMission) {
                        let useSMS = props.commonSettings.UseSMS === 'true';
                        if (!useSMS) {
                            useSMS = await SaveSetting('UseSMS', 'true');
                        }

                        let useEmail = props.commonSettings.useEmail === 'true';
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

                confirmDialogData = undefined;
            }
        }

        props.onCloseConfirmDialog();
    }

    const onProgressSpread = (mission, type) => {
        const missions = props.sectionData.missions;
        const missionsLength = props.sectionData.missions.length;

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
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        props.onProgressSpread(props.sectionData, -1, true, true, false, false);
    }


    const onProgressMission = async (checked, mission) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
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

        if (missions !== null) {
            for (let i = 0; i < missions.length; i++) {
                const mission = missions[i];
                let missionText = '';
                if (mission.missionType === missionType.External) {
                    missionText = mission.programName;
                    if (mission.parameters !== null && mission.parameters.length > 0) {
                        missionText += " (전달인자 : " + mission.parameters.join() + ")";
                    }

                    let btnSpreadAllName = 'btnArea' + " " + 'btnPropagateSelect';
                    if (!props.sectionData.sectionNumber) {
                        // sectionNumber가 null일 때
                        btnSpreadAllName = 'btnAreaDisable' + " " + 'proBtnDisable';
                    }
                    else if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
                            // 현재 SOP가 시작되지 않았을 때 Disable
                        btnSpreadAllName = 'btnAreaDisable' + " " + 'proBtnDisable';
                    }
                    else if (props.sectionData.status === SectionData.Status_Done) {
                        // 현재 임무가 완료된 상태라면 Disable
                        btnSpreadAllName = 'btnAreaDisable' + " " + 'proBtnDisable';
                    }

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
                                <textarea className={'processTextarea processTextScrollbar'}>
                                    {missionText}
                                </textarea>
                            </p>
                            <p className={btnSpreadAllName} style={{ 'marginRight': '40px' }} onClick={() => showConfirmDialogExternal(mission)}>실행</p>
                            <p className={'completionStatus'}>{mission.checked ? '완료' : '미완료'}</p>
                        </dd>
                    );
                }
                else {
                    missionText = mission.missionText;

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
                                <textarea className={'processTextarea processTextScrollbar'} defaultValue={missionText}>
                                    {/* {missionText} */}
                                </textarea>
                            </p>
                            <p className={'completionStatus'}>{mission.checked ? '완료' : '미완료'}</p>
                        </dd>
                    );
                }
            }
        }


        return [missionList];
    }

    const onCheckedChangeAll = async (checked) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
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

    const onClickEditPhoneNumber = () => {

    }

    //onBlurCheckPhoneNumber = (target) => {
    //    let patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;

    //    const phoneValid = patternPhone.test(target.value);
    //    if (!phoneValid && target.value != "") {
    //        //alert(target.value + "휴대전화번호 형식이 맞지 않습니다.");
    //        //props.showErrorDialog("에러", [target.value + " 휴대전화번호 형식이 맞지 않습니다."]);
    //        setState({ value: "" });
    //        //props.member.PhoneNumber = '';
    //        return;
    //    }

    //    //props.member.PhoneNumber = target.value;
    //    if (!props.sectionData.phoneNumbers) {
    //        props.sectionData.phoneNumbers = [];
    //    }

    //    props.sectionData.phoneNumbers.push(target.value);
    //}

    //onChangeCheckPhoneNumber = (target) => {
    //    // 휴대전화일 경우 숫자 및 자릿수 제한
    //    const regex = /^[0-9\b -]{0,13}$/;
    //    if (regex.test(target.value)) {
    //        let value = target.value;
    //        let inputValue = value.replace(/-/g, '');
    //        inputValue = inputValue.replace(/ /g, '');

    //        inputValue = value;

    //        //setState({ value: inputValue });
    //    }
    //}

    const getReceiversUI = () => {
        if (!props.sectionData.receivers || props.sectionData.receivers.length === 0)
            return <></>;

        let ui = [];
        const receiverCount = props.sectionData.receivers.length;

        for (let i = 0; i < receiverCount; i++) {
            const receiver = props.sectionData.receivers[i];
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
        if (teamType === 2) {
            teamDatas = props.teamDatas.regular;
        }

        if (!teamDatas || teamDatas === null) {
            return '';
        }

        for (let i = 0; i < teamDatas.length; i++) {
            if (teamDatas[i].id === teamID) {
                content = teamDatas[i].teamName;
                break;
            }
        }

        return content;
    }

    const getReceiverPhoneNumberContent = (contents, teamType, teamID) => {
        let members = null;
        if (teamType === 2) {
            members = props.teamDatas.regularMember;
        }

        if (!members || members === null) {
            return ['', ''];
        }

        const memberLength = members.length;
        for (let i = 0; i < memberLength; i++) {
            if (members[i].RegularID === teamID) {
                let content = {};
                content.memberName = members[i].MemberName;
                content.phoneNumber = members[i].PhoneNumber === null ? '' : members[i].PhoneNumber;
                contents.push(content);
            }
        }

        return contents;
    }

    const [missionList] = getMissionListUI();

    //현재임무 - sectionCurrent
    //대기(실행중) - sectionRun
    //완료 - sectionDone
    //대기 - 
    let boxClassName = "";
    let textClassName = " " + 'textNormal';

    let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
    const currentSectionCount = props.currentSection.length;
    for (let i = 0; i < currentSectionCount; i++) {
        const currentSection = props.currentSection[i];
        if (currentSection.id === props.sectionData.id && currentSection.componentType === props.sectionData.componentType) {
            bAmICurrentSection = true;
        }
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
    if (!props.sectionData.sectionNumber) {
        // sectionNumber가 null일 때
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }
    else if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
        btnSpreadAllName = 'btnAreaDisable proBtnDisable';
    }

    //const receiversUI = getReceiversUI();

    return (
        <ProcessComponent className={'sectionBox' + boxClassName} id={props.id}>
            <div className={'tit clfix' + textClassName}>
                <strong>
                    {props.sectionData.sectionNumber}.{props.sectionData.text}
                    {
                        (props.sectionData.autoRun)
                            ? <span className={'flag flag01'}>자동</span>
                            : <></>
                    }
                </strong>
                {/* <div className={uneStyles.tooltip}>
                    <div className={uneStyles.propagatePeople}><button type="button"></button></div>
                    <div className={uneStyles.dropBox}>
                        <span className={uneStyles.dropFlexTitle}>
                            <p>전파 대상자</p> */}
                            {/* <span className={uneStyles.editIcon} onClick={() => onClickEditPhoneNumber}></span> */}
                        {/* </span> */}
                        {/* {receiversUI} */}
                        {/*
                            <div>
                                <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                                <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                                <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}>010-0000-0000</p></div>
                            </div>
                            */

                            /* input */
                            //<div>
                            //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                            //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                            //    <div className={uneStyles.dropFlex}><span className={uneStyles.arrowLeft}></span><span className={uneStyles.personName}>홍길동</span><p className={uneStyles.phoneName}><input type="text" placeholder="010-0000-0000" /></p></div>
                            //</div>

                            //<div className={uneStyles.dropBtn}>확인</div>
                        }
{/* 
                    </div>
                </div> */}
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
                <div className={'completionStatuss'}>{(allChecked) ? '완료' : '미완료'}</div>
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
                <dt>행동요령
                    {/* <p className={btnSpreadAllName} onClick={() => showConfirmDialog(onClickAllType)}>전체전파</p> */}
                </dt>
                </span>
                {missionList}
            </dl>
        </ProcessComponent>
    );
}

export default Process;