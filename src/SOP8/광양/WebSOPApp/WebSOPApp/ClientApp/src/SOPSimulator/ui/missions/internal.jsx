import React, { useEffect, useState, useRef } from 'react';
//import uis from '../../../Common/css/ui.module.css';
//import uneStyles from '../../../Common/css/uneCommon.module.css';
import $ from 'jquery';
import SectionData from '../../../Common/models/sections/sectionData';
import { SettingController } from '../../../Settings/services/settingController';
import ProjectResource from '../../../Root/resource/id';

import { InternalComponent } from '../../styled/missionsStyled';
import Receiver from '../../../Common/models/sections/receiver';

function Internal(props) {
    const [allChecked, setAllChecked] = useState(false);
    const [useBroadcast, setUseBroadcast] = useState(false);

    const prevProps = useRef(null);
    const confirmDialogDataRef = useRef([]);
    const isChangedMessageRef = useRef(false);
    const messageRef = useRef();

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

        messageRef.current = props.sectionData.transmission.mssage;
    }, [])

    useEffect(() => {
        if (props !== prevProps.current) {
            setAllChecked(props.sectionData.checked);
        }

        if (props.sectionData.transmission.mssage !== prevProps.current?.sectionData.transmission.mssage) {
            props.sectionData.transmission.mssage = props.sectionData.transmission.mssage;
        }

        prevProps.current = props;
    }, [props]);

    const runSection = () => {
        props.runSection(props.sectionData);
    }

    const onProgressMission = async (checked) => {
        if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
            return;
        }

        props.sectionData.status = checked ? SectionData.Status_Done : SectionData.Status_Run;
        setAllChecked(checked);
                
        await props.onProgressMission(checked, props.sectionData, 0);       
    }

    const confirmSendSms = () => {
        if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
            return;
        }

        if (props.sectionData.transmission.receivers === null || props.sectionData.transmission.receivers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }

        showConfirmDialog(true, false, false, false);
    }

    const confirmBroadcast = () => {
        if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
            return;
        }

        if (props.sectionData.transmission.receivers === null || props.sectionData.transmission.receivers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }

        // 상황 전파시 확인단계 거치기
        if (props.commonSettings.TransmissionUserConfirm.value === 'true') {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['방송전파를 실행할까요?'], ['취소', '상황 전파'], doBroadcast, true, '방송 전파 시 사이렌 사용');
        }
    }

    const doBroadcast = (index, useSiren) => {
        if (index === 1) {
            confirmDialogDataRef.current = [false, false, true, useSiren ? true : false];
            onProgressSpread(index);
        }
        else {
            props.onCloseConfirmDialog();
        }
    }

    const showConfirmDialog = (useSMS, useEmail, useBroadcast, useSiren) => {
        if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
            return;
        }

        //if (!refMessage || refMessage.current.value.length === 0) {
        //    return;
        //}

        if (props.sectionData.transmission.mssage.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 내용이 없습니다'], null, null);
            return;
        }

        if (!useBroadcast && props.sectionData.transmission.receivers === null || props.sectionData.transmission.receivers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['전파할 수신자가 없습니다.'], null, null);
            return;
        }
        else {
            let strMessage = '';
            let strSmsName = '문자';

            if (useSMS) {
                if (props.commonSettings.UseSMS.value === 'false') {
                    strMessage = strSmsName + '전파가 사용되지 않음으로 설정되어 있습니다.' + strSmsName + ' 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (props.commonSettings.TransmissionUserConfirm.value === 'true') {
                        strMessage = strSmsName + '메시지를 전송할까요?'
                    }
                }

                confirmDialogDataRef.current = [useSMS, useEmail, useBroadcast, useSiren];
            }
            else if (useEmail) {
                if (props.commonSettings.UseEmail.value === 'false') {
                    strMessage = '메일 전파가 사용되지 않음으로 설정되어 있습니다. 메일 전파를 사용함으로 설정하고 발송할까요?'
                }
                else {
                    // 상황 전파시 확인단계 거치기
                    if (props.commonSettings.TransmissionUserConfirm.value === 'true') {
                        strMessage = '메일을 발송할까요?'
                    }
                }

                confirmDialogDataRef.current = [useSMS, useEmail, useBroadcast, useSiren];
            }
            // else if (useBroadcast) {
            //     if (props.commonSettings.UseEmail.value === 'false') {
            //         strMessage = '방송 전파가 사용되지 않음으로 설정되어 있습니다. 방송 전파를 사용함으로 설정하고 전파할까요?'
            //     }
            //     else {
            //         // 상황 전파시 확인단계 거치기
            //         if (props.commonSettings.TransmissionUserConfirm.value === 'true') {
            //             strMessage = '방송을 전파할까요?'
            //         }
            //     }

            //     confirmDialogDataRef.current = [useSMS, useEmail, useBroadcast, useSiren];
            // }

            if (strMessage.length > 0) {
                props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, [strMessage], ['취소', '상황 전파'], onProgressSpread);
            }
            else {
                onProgressSpread(1);
            }            
        }
    }

    const SaveSetting = async (propertyName, propertyValue) => {
        const result = await SettingController.requestSaveSetting(propertyName, propertyValue);
        return result;
    }

    const onProgressSpread = async (index) => {
        if (index === 1) {
            const [isSMS, isEmail, isBroadcast, isSiren] = confirmDialogDataRef.current;

            if (isSMS) {
                let useSMS = props.commonSettings.UseSMS.value;
                if (!useSMS) {
                    useSMS = await SaveSetting('UseSMS', 'true');
                }

                if (!useSMS) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['문자 전파 설정이 실패했습니다'], null, null);
                    return;
                }
            }
            else if (isEmail) {
                let useEmail = props.commonSettings.UseEmail.value;
                if (!useEmail) {
                    useEmail = await SaveSetting('UseEmail', 'true');
                }

                if (!useEmail) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['메일 전파 설정이 실패했습니다'], null, null);
                    return;
                }
            }
            else if (isBroadcast) {
                let useBroadcast = props.commonSettings.UseBroadcast.value;
                if (!useBroadcast) {
                    useBroadcast = await SaveSetting('UseBroadcast', 'true');
                }

                if (!useBroadcast) {
                    props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['방송 전파 설정이 실패했습니다'], null, null);
                    return;
                }
            }

            const dataIndex = 0; // 상황전파는 한 개 임무만 있으므로 첫번째인 0

            props.onProgressSpread(props.sectionData, dataIndex, isSMS, isEmail, isBroadcast, isSiren, props.sectionData.transmission.mssage);

            confirmDialogDataRef.current = []; // 초기화

            if (isChangedMessageRef.current && messageRef.current.length === 0) {
                document.getElementById('message').value = '';
                isChangedMessageRef.current = false;
            }
        }

        props.onCloseConfirmDialog();
    }

    const getReceiversUI = () => {
        if (!props.sectionData.transmission.receivers || props.sectionData.transmission.receivers.length === 0)
            return <></>;

        let ui = [];
        const receiverCount = props.sectionData.transmission.receivers.length;
        
        for (let i = 0; i < receiverCount; i++) {
            const receiver = props.sectionData.transmission.receivers[i];
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
        if (teamType === Receiver.RegularTeam) {
            teamDatas = props.teamDatas.regular;
        }
        else if (teamType === Receiver.TemporaryNormalTeam) {
            teamDatas = props.teamDatas.normal;
        }
        else if (teamType === Receiver.TemporaryEmergencyTeam) {
            teamDatas = props.teamDatas.emergency;
        }

        if (!teamDatas) {
            return '';
        }

        if (teamType === Receiver.RegularTeam) {
            for (var i = 0; i < teamDatas.length; i++) {
                if (teamDatas[i].rgl_sn === teamID) {
                    content = teamDatas[i].team_name;
                    break;
                }
            }
        }
        else if (teamType === Receiver.TemporaryNormalTeam || teamType === Receiver.TemporaryEmergencyTeam) {
            for (var i = 0; i < teamDatas.length; i++) {
                if (teamDatas[i].No === teamID) {
                    content = teamDatas[i].TeamName;
                    break;
                }
            }
        }

        return content;
    }

    const onChangea = (e) => {
        // refMessage.current.value = e.target.value;
        props.sectionData.transmission.mssage = e.target.value;
        isChangedMessageRef.current = true;
    }

    const handleBroadcast = (useBroadcast) => {
        setUseBroadcast(useBroadcast);
    }

    let boxClassName = "";
    let textClassName = " " + 'textNormal';

    let bAmICurrentSection = false; // 자신이 현재 세션인지 여부
    if (props.currentSection?.component?.compn_sn === props.sectionData.component.compn_sn && props.currentSection?.component?.compn_code === props.sectionData.component.compn_code) {
        bAmICurrentSection = true;
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
    if (!props.sectionData.transmission.execut_no) {
        // sectionNumber가 null일 때
        btnNextClassName = 'btnDisable';
    }
    else if (props.currentSection && props.currentSection.component.compn_code === 3 && props.currentSection.endpoint.begin_yn) {
        // 현재 SOP가 시작되지 않았을 때 Disable
        btnNextClassName = 'btnDisable';
    }
    else if (props.sectionData.status === SectionData.Status_Done) {
        // 현재 임무가 완료된 상태라면 Disable
        btnNextClassName = 'btnDisable';
    }

    let tagUI = [];
    if (props.sectionData.transmission.atmc_execut_yn)
        tagUI.push(<span key='auto' className={'flag flagAuto'}>자동</span>);
    if (props.sectionData.transmission.sms_yn)
        tagUI.push(<span key='sms' className={'flag flagSms'}>문자</span>);
    if (props.sectionData.transmission.email_yn)
        tagUI.push(<span key='email' className={'flag flagMail'}>메일</span>);
    // if (props.sectionData.transmission.brdcst_yn)
    //     tagUI.push(<span key='broadcast' className={'flag flagBroadcast'}>방송</span>);

    let receiverUI = getReceiversUI();

    return (
        <InternalComponent className={'sectionBox' + boxClassName + " " + 'sectionBox'} id={props.id}>
            <div className={'tit clfix' + textClassName}>
                <strong>{props.sectionData.transmission.execut_no}.{props.sectionData.transmission.title}
                    {tagUI}
                </strong>
                <div className={'btnArea btnArea'}>
                    <a className={btnNextClassName} onClick={runSection}>다음</a>
                </div>
                <div className={allChecked ? 'completionStatuss done' : 'completionStatuss'}>{(allChecked) ? '완료' : '미완료'}</div>
            </div>
            <div className={'sendMessage sendMessage'}>
                <div className={'check'}>
                    <span className={'checkBox'}>
                        <input type="checkbox" checked={allChecked || false} onChange={(e) => onProgressMission(e.target.checked)}/>
                    </span>
                </div>
                <div className='btnWrap'>
                    {
                        (props.sectionData.transmission.sms_yn) ?
                            <div id='tooltip' data-tooltip="문자발송">
                                <button type="button" onClick={() => confirmSendSms()}>
                                    <i className={'message'}></i>
                                </button>
                            </div>
                            : <></>
                    }
                    {
                        (props.sectionData.transmission.email_yn) ?
                            <div id='tooltip' data-tooltip="메일발송">
                                <button type="button" onClick={() => showConfirmDialog(false, true, false, false)}>
                                    <i className={'email'}></i>
                                </button>
                            </div>
                            : <></>
                    }
                    {/* {
                        (props.sectionData.transmission.brdcst_yn) ?
                            <div className={'brdcstInfo'} id='tooltip' data-tooltip="방송전파">
                                <button type="button" onClick={() => confirmBroadcast()}>
                                    <i className={'brdcst on'}></i>
                                </button>
                            </div>
                            : <></>
                    } */}
                </div>
            </div>
            <dl className={'taskDetail taskSubSection'}>
                <div className={'taskSub'}>
                    <dt style={{ backgroundColor: '#0D121A', fontSize: '14px', padding: '0 10px' }}>전파메시지</dt>
                    <textarea className={'taskMessage taskScrollbar'} id='message' defaultValue={props.sectionData.transmission.mssage} onChange={(e) => onChangea(e)} />
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