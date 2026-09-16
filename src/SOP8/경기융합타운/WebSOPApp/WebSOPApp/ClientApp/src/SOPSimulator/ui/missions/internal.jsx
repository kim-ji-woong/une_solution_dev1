import React, { useEffect, useState, useRef } from 'react';
//import uis from '../../../Common/css/ui.module.css';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';
import { SettingController } from '../../../Settings/services/settingController';
import ProjectResource from '../../../Root/resource/id';

import { InternalComponent } from '../../styled/missionsStyled';

function Internal(props) {
    const [allChecked, setAllChecked] = useState(false);

    const prevProps = useRef(null);

    useEffect(() => {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });

        // Sound Button UI
        $('.btnSoundToggle').on('click', function () {
            $(this).closest('.soundInfo').toggleClass("isShow");
        });

        // soundInfoList
        $('.soundInfoList').on('click', 'button', function () {
            var val = $(this).data('value');
            if (val == 'Y') {
                $(this).closest('.soundInfo').addClass("isOn");
            }
            else if (val == 'N') {
                $(this).closest('.soundInfo').removeClass("isOn");
            }
            $(this).closest('.soundInfo').removeClass("isShow");
        });
    }, [])

    useEffect(() => {
        if (props !== prevProps.current) {
            setAllChecked(props.sectionData.checked);
        }

        if (props.sectionData.message !== prevProps.current?.sectionData.message) {
            props.sectionData.message = props.sectionData.message;
        }

        prevProps.current = props;
    }, [props]);

    const runSection = () => {
        props.runSection(props.sectionData);
    }

    const onProgressMission = async (checked) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        props.sectionData.status = checked ? SectionData.Status_Done : SectionData.Status_Run;
        setAllChecked(checked);
                
        await props.onProgressMission(checked, props.sectionData, 0);       
    }

    const confirmSendSms = () => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        if (props.sectionData.receivers === null || props.sectionData.receivers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['메시지를 전송할까요?'], ['취소', '발송'], sendSms);
    }

    const sendSms = (index) => {
        if (index === 1) {
            showConfirmDialog(true, false, false, false);
        }
    }

    const showConfirmDialog = (isSMS, isEmail, isBroadcast, isSiren) => {
        if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
            return;
        }

        //if (!refMessage || refMessage.current.value.length === 0) {
        //    return;
        //}

        if (props.sectionData.message.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 내용이 없습니다'], null, null);
            return;
        }

        if (!isBroadcast && props.currentSection.receivers === null || props.currentSection.receivers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }
        else {
            let strMessage = '';
            let strSmsName = '문자';

            if (isSMS) {
                if (!props.commonSettings.UseSMS) {
                    strMessage = strSmsName + '전파가 사용되지 않음으로 설정되어 있습니다.' + strSmsName + ' 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (props.commonSettings.UseConfirm) {
                        strMessage = strSmsName + '메시지를 전송할까요?'
                    }
                }

                confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }
            else if (isEmail) {
                if (!props.commonSettings.UseEmail) {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (props.commonSettings.UseConfirm) {
                        strMessage = '메일을 발송할까요?'
                    }
                }

                confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }
            else if (isBroadcast) {
                if (!props.commonSettings.UseEmail) {
                    strMessage = '방송 전파가 사용되지 않음으로 설정되어 있습니다. 방송 전파를 사용함으로 설정하고 전파할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (props.commonSettings.UseConfirm) {
                        strMessage = '방송을 전파할까요?'
                    }
                }

                confirmDialogData = [isSMS, isEmail, isBroadcast, isSiren];
            }

            if (strMessage.length > 0) {
                props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [strMessage], ['취소', '상황 전파'], onProgressSpread);
            }
            else {
                onProgressSpread(0);
            }            
        }
    }

    const SaveSetting = async (propertyName, propertyValue) => {
        const result = await SettingController.requestSaveSetting(propertyName, propertyValue);
        return result;
    }

    const onProgressSpread = async (index) => {
        if (index === 1) {
            if (confirmDialogData && confirmDialogData.length === 4) {

                const isSMS = confirmDialogData[0];
                const isEmail = confirmDialogData[1];
                const isBroadcast = confirmDialogData[2];
                const isSiren = confirmDialogData[3];

                if (isSMS) {
                    let useSMS = props.commonSettings.UseSMS;
                    if (!useSMS) {
                        useSMS = await SaveSetting('UseSMS', 'true');
                    }

                    if (!useSMS) {
                        props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['문자 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }
                else if (isEmail) {
                    let useEmail = props.commonSettings.UseEmail;
                    if (!useEmail) {
                        useEmail = await SaveSetting('UseEmail', 'true');
                    }

                    if (!useEmail) {
                        props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['메일 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }
                else if (isBroadcast) {
                    let useBroadcast = commonSettings.UseBroadcast;
                    if (!useBroadcast) {
                        useBroadcast = await SaveSetting('UseBroadcast', 'true');
                    }

                    if (!useBroadcast) {
                        props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['방송 전파 설정이 실패했습니다'], null, null);
                        return;
                    }
                }

                const dataIndex = 0; // 상황전파는 한 개 임무만 있으므로 첫번째인 0
                props.onProgressSpread(props.sectionData, dataIndex, isSMS, isEmail, isBroadcast, isSiren, props.sectionData.message/*refMessage.current.value*/);

                confirmDialogData = undefined;
            }
        }

        props.onCloseConfirmDialog();
    }

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
            
            ui.push(<li key={"teamInfo_" + i}>{content}</li>);
        }
        return ui;
    }

    const getReceiverContent = (teamType, teamID) => {
        let content = '';

        let teamDatas = null;
        if (teamType === 2) {
            teamDatas = props.teamDatas.regular;
        }

        if (!teamDatas) {
            return '';
        }

        for (var i = 0; i < teamDatas.length; i++) {
            if (teamDatas[i].id === teamID) {
                content = teamDatas[i].teamName;
                break;
            }
        }

        return content;
    }

    const onChangea = (e) => {
        refMessage.current.value = e.target.value;
        props.sectionData.message = e.target.value;
    }

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
        //boxClassName = " " + uis.sectionCurrent + " " + uneStyles.currentBox + " " + uis.borderCurrent;
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Run) {
        boxClassName = " " + 'sectionCurrent' + " " + 'borderCurrent';
        textClassName = " " + 'textCurrent';
    } else if (props.sectionData.status === SectionData.Status_Done) {
        boxClassName = " " + 'sectionDone';
        textClassName = " " + 'textDone';
    } else if (props.sectionData.status === SectionData.Status_Skip) {
        boxClassName = " " + 'sectionRun';
        textClassName = " " + 'textRun';
    }

    // 다음 버튼 활성화
    var btnNextClassName = 'btnAllCheck';
    if (!props.sectionData.sectionNumber) {
        // sectionNumber가 null일 때
        btnNextClassName = 'btnDisable';
    }
    else if (props.currentSection?.length > 0 && props.currentSection[0].componentType === 3 && props.currentSection[0].isBegin) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
    }

    let tagUI = [];
    if (props.sectionData.autoRun)
        tagUI.push(<span key='auto' className={'flag flagAuto'}>자동</span>);
    if (props.sectionData.isSMS)
        tagUI.push(
            <span key='sms' className={'flag flagSms'}>
                문자
            </span>
        );
    if (props.sectionData.isEmail)
        tagUI.push(<span key='email' className={'flag flagMail'}>메일</span>);

    let receiverUI = getReceiversUI();

    return (
        <InternalComponent className={'sectionBox' + boxClassName + " " + 'sectionBox'} id={props.id}>
            <div className={'tit clfix' + textClassName}>
                <strong>{props.sectionData.sectionNumber}.{props.sectionData.text}
                    {tagUI}
                </strong>
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
                <div className={'completionStatuss'}>{(allChecked) ? '완료' : '미완료' }</div>
            </div>
            <div className={'sendMessage sendMessage'}>
                <div className={'check'}>
                    <span className={'checkBox'}>
                        <input type="checkbox" checked={allChecked} onChange={(e) => onProgressMission(e.target.checked)}/>
                    </span>
                </div>
                {
                    (props.sectionData.isSMS) ?
                        <div><button type="button" onClick={() => confirmSendSms()}><i className={'message'}></i></button></div>
                        : <></>
                }
                {
                    (props.sectionData.isEmail) ?
                        <div><button type="button" onClick={() => showConfirmDialog(false, true, false, false)}><i className={'email'}></i></button></div>
                        : <></>
                }
            </div>
            <dl className={'taskDetail taskSubSection'}>
                <div className={'taskSub'}>
                    <dt style={{ backgroundColor: '#0D121A', fontSize: '14px', padding: '0 10px' }}>전파메시지</dt>
                    <textarea className={'taskMessage taskScrollbar'} defaultValue={props.sectionData.message} onChange={(e) => onChangea(e)} />
                </div>
                <div className={'taskSub taskSubList'}>
                    <dt style={{ backgroundColor: '#0D121A', fontSize: '14px', padding: '0 10px' }}>전파 대상자</dt>
                    <dd className={'scrollbar'}>
                        <ul className={'clfix'}>
                            {receiverUI}
                        </ul>
                    </dd>
                </div>
            </dl>
        </InternalComponent>
    );
}

export default Internal;