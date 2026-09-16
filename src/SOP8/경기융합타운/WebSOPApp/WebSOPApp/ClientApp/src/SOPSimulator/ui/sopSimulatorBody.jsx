import React, { useState, useEffect } from 'react';
import '../../Common/css/scroll.css';
import $ from 'jquery';
import { TabContent } from 'reactstrap';

//import uis from '../../Common/css/ui.module.css';

import SopSimulatorResource from "../resource/id";
import SopSimulatorController from '../services/sopSimulatorController';
import SopController from '../../SOPManager/services/sopController';

import ProcessListSB from './processListSB';
import SopSimulatorSBChart from './sopSimulatorSBChart';
import MissionListSB from './missionListSB';

import BeginOption from './popup/beginOption';
import SummarySOP from './popup/endPopup';

import SectionData from '../../Common/models/sections/sectionData';
import SessionString from '../../Common/js/sessionString';
import ProjectResource from '../../Root/resource/id';

import onGoingSopImg from '../../Common/image/icon/onGoingSopRedImg.png';

import { SopSimulatorBodyComponent } from '../styled/sopSimulatorStyled';


function SopSimulatorBody(props) {
    const [content, setContent] = useState('');
    const [currentActionStep, setCurrentActionStep] = useState("관심");     // 현재 SOP 단계
    const [orderSopData, setOrderSopData] = useState(null);
    const [arrows, setArrows] = useState(null);
    const [currentActionStepID, setCurrentActionStepID] = useState(4);      // 현재 SOP 단계 ID
    const [ActionStepHistoryID, setActionStepHistoryID] = useState(-1);
    const [isBegin, setIsBegin] = useState(false);

    const [currentSection, setCurrentSection] = useState(null);             // 현재 임무 Data
    const [currentActionStepHistoryID, setCurrentActionStepHistoryID] = useState(-1);
    const [sections, setSections] = useState(null);
    const [loginUser, setLoginUser] = useState(null);
    const [endPopup, setEndPopup] = useState(null);

    const [sensorNames, setSensorNames] = useState('');

    const [prevProps, setPrevProps] = useState(null);
    const [tabMaxCount, setTabMaxCount] = useState(6);      // 한 페이지에 표시할 탭 최대 개수
    const [summarySOPKey, setSummarySOPKey] = useState(-1); // SOP요약창 표시할 SOP

    useEffect(() => {
        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null || userInfo !== undefined) {
            setLoginUser(userInfo);
        }

        // Top Menu
        $('.tabArea').on('click', 'a', function () {
            $(this).closest('li').addClass("isActive").siblings().removeClass("isActive");
        });

        // 판단문 yes or no combobox
        $('.seleteBox').on('click', '.seletedTxt', function () {
            $(this).closest('.seleteBox').toggleClass("isShow");
        })
            .on('click', '.' + "value", function () {
                let value = $(this).closest('li').data('val');
                $(this).closest('.seleteBox').toggleClass("isShow");
                $(this).closest('.seleteBox').removeClass('.step01', '.step02', '.step03', '.step04').addClass(value);
                $(this).closest('.seleteBox').find('.seletedTxt').text($(this).text());
            });

        // 페이지 타이틀 
        $('#pageTitle').text("");

        if (props.sopTabIndex > -1) {
            requestSensorName(props.sopDatas[props.sopTabIndex]?.sensorZoneHistoryID);
        }

    }, [props.sopDatas, props.sopTabIndex]);

    // getDerivedStateFromProps
    useEffect(() => {
        if (prevProps === props) {
            return;
        }

        let sectionsData = sections;
        let arrowsData = arrows;
        let currentSectionData = currentSection;
        let currentActionStepHistoryID = -1;

        if (props.sopDatas !== null || props.sopDatas.length - 1 >= props.sopTabIndex) {
            let sopRunData = props.sopDatas[props.sopTabIndex];
            const stepLength = sopRunData?.sopData.actionStepDatas.length;
            for (let i = 0; i < stepLength; i++) {
                const actionStepData = sopRunData.sopData.actionStepDatas[i];
                if (!actionStepData.actionStep)
                    continue;

                if (actionStepData.actionStep.id === sopRunData.sopData.currentActionStep.actionStep.id) {
                    sectionsData = actionStepData.stepMemberDatas[0].sections;                    
                    arrowsData = actionStepData.stepMemberDatas[0].arrows;
                    currentSectionData = actionStepData.currentSection;

                    if (actionStepData._ActionStepHistory !== null)
                        currentActionStepHistoryID = actionStepData._ActionStepHistory.id;

                    // 임무 상태 (status)값 할당
                    if (actionStepData.componentHistoryData !== null) {
                        for (let j = 0; j < actionStepData.stepMemberDatas[0].sections.length; j++) {
                            const section = actionStepData.stepMemberDatas[0].sections[j];
                            for (let k = 0; k < actionStepData.componentHistoryData.length; k++) {
                                const componentHistory = actionStepData.componentHistoryData[k].componentHistory;
                                if (componentHistory.componentID === section.id && componentHistory.componentType === section.componentType) {
                                    section.status = componentHistory.status;
                                }
                            }
                        }
                    }
                    else {
                        // 진행 이력이 없으므로 첫번째 임무로 지정한다
                        currentSectionData = [];
                        currentSectionData.push(actionStepData.stepMemberDatas[0].sections[0]);
                    }

                    break;
                }
            }
        }

        setSections(sectionsData);
        setArrows(arrowsData);
        setCurrentSection(currentSectionData);
        setCurrentActionStepHistoryID(currentActionStepHistoryID);
        setPrevProps(props);
        
    }, [props, prevProps, currentSection, sections, arrows]);

    const runSectionFromChart = (selectSection) => {
        if (currentActionStepHistoryID === -1 && !selectSection.isBegin) {
            // SOP가 시작하지 않았는데 시작이 아닌 다른 세션을 눌렀을 때 
            return false;
        }

        if (currentActionStepHistoryID > 0 && selectSection.componentType === 3 && selectSection.isBegin) {
            // SOP 시작했는데 시작section 눌렀을 때
            return false;
        }

        if (selectSection.componentType === 3 && selectSection.isBegin) {
            // 시작한 경우 다음 세션을 찾아야하므로 runSection 함수에 넘긴다
            runSection(selectSection);
        }
        else if (selectSection.componentType === 3 && !selectSection.isBegin) {
            // 종료 컴포넌트 선택시 종료
            closeSOP(false);
        }
        else {
            //var preSection = currentSection;
            //runSection2(selectSection, preSection, true);

            runSection(selectSection, undefined, true);
        }

        return true;
    }

    const requestSensorName = async (sensorZoneHistoryID) => {
        let sensorName = '수동';
        if (sensorZoneHistoryID && sensorZoneHistoryID > 0) {
            sensorName = await SopSimulatorController.requestSensorName(sensorZoneHistoryID);
        }
        setSensorNames(sensorName);
    }

    // decisionResult 는 판단문일때만 있음    
    const runSection = async (section, decisionValue, fromChart) => { 
        if (section.componentType === 3 && !section.isBegin) {
            // 종료 컴포넌트 선택시 종료
            closeSOP(false);
            return;
        }

        const sopKey = props.currentSopTabKey;
        const actionStepID = props.sopDatas[props.sopTabIndex].sopData.currentActionStep.actionStep.id;
        const actionStepHistoryID = currentActionStepHistoryID;
        const userID = loginUser?.id;

        if (props.sopDatas[props.sopTabIndex].position === null && currentActionStepHistoryID === -1) {
            changeContent(SopSimulatorResource.menu.SOP_시작_옵션);
        }
        else {
            let isSkip = true; // 건너뛰기
            if (!fromChart) {
                if (currentSection?.length > 0) {
                    for (let i = 0; i < currentSection.length; i++) {
                        if (currentSection[i].componentType === section.componentType && currentSection[i].id === section.id) {
                            isSkip = false;
                            break;
                        }
                    }
                }
            }
            else {
                isSkip = false;
            }

            const history = await SopSimulatorController.runSection(sopKey, actionStepID, actionStepHistoryID, section, userID, decisionValue, isSkip);
            return history;
        }
    }

    const beginSOP = async (beginDate, position) => {
        const sopRunData = props.sopDatas[props.sopTabIndex];

        //const date = getMakeDateTime(beginDate);

        // sop 시작
        await excuteSOP(beginDate, sopRunData.sopData.version.id, sopRunData.sopData.currentActionStep.actionStep.id, position, loginUser.id, sopRunData.sensorZoneHistoryID);
        
        changeContent('');
    }

    const beginNextStep = async () => {
        if (currentActionStepHistoryID === -1) {
            // SOP가 시작하지 않았는데 시작이 아닌 다른 세션을 눌렀을 때 
            return false;
        }

        // 권한 (사용자 등급은 실행 권한 없음)
        const userAuth = ProjectResource.getUserInfo();
        if (!userAuth || userAuth === null || userAuth.levelID === AccountResource.accountLevelID.user) {
            props.showConfirmDialog('권한', '해당 로그인 사용자는 권한이 없습니다', '확인', null);
            return;
        }

        const sopRunData = props.sopDatas[props.sopTabIndex];
        let nCurrentIndex = -1;
        let nNextActionStepID = -1;
        let strNextActionStepName = "";
        for (let i = 0; i < sopRunData.sopData.actionStepDatas.length; i++) {
            if (!sopRunData.sopData.actionStepDatas[i].actionStep || sopRunData.sopData.actionStepDatas[i].actionStep === null) {
                continue;
            }

            if (sopRunData.sopData.actionStepDatas[i].actionStep.id === props.currentActionStep.actionStep.id) {
                nCurrentIndex = i;
                continue;
            }

            if (nCurrentIndex >= 0 && nCurrentIndex < i) {
                if (sopRunData.sopData.actionStepDatas[i].actionStep !== null) {
                    nNextActionStepID = sopRunData.sopData.actionStepDatas[i].actionStep.id;
                    strNextActionStepName = sopRunData.sopData.actionStepDatas[i].actionStep.stepName;
                    break;
                }
            }
        }

        if (nNextActionStepID > 0) {
            const userID = loginUser.id;
            await SopSimulatorController.nextActionStep(props.currentSopTabKey, nNextActionStepID, props.currentActionStep.actionStep.id, userID);
            props.onChangeStep(nNextActionStepID, strNextActionStepName);
        }
    }

    const getMakeDateTime = (dateTime) => {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        let day = dateTime.getDate();                   //d
        day = day >= 10 ? day : '0' + day;

        let hour = dateTime.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        let min = dateTime.getMinutes();
        min = min >= 10 ? min : '0' + min;
        let sec = dateTime.getSeconds();
        sec = sec >= 10 ? sec : '0' + sec;

        let strDate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

        return strDate;
    }

    const excuteSOP = async (beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID) => {
        const actionStepHistoryID = await SopSimulatorController.excuteSOP(beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID);
        return actionStepHistoryID;
    }

    //async progressSOP(actionStepHistoryID, componentID, componentType, status) {
    //    const userID = 1;
    //    const history = await SopSimulatorController.progressSOP(actionStepHistoryID, componentID, componentType, userID, status);
    //    return history;
    //}

    const onChangeTab = (index) => {
        if (index === props.sopTabIndex)
            return;

        props.onChangeTab(index);

        requestSensorName(props.sopDatas[index].sensorZoneHistoryID);
    }

    // SOP Chart에서 단계 변경
    const onChangeActionStep = (stepName, stepID) => {
        props.onChangeStep(stepID, stepName);
    }

    // 임무 체크
    const onProgressMission = async (checked, section, dataIndex) => {
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = props.currentSopTabKey;
        const actionStepHistoryID = currentActionStepHistoryID;
        const userID = loginUser.id;

        // section 뒤져서 완료된 임무라면 status(3), 실행한적 없는 임무라면 status(1) 현재임무라면 status(2)로 insert
        
        await SopSimulatorController.progressMission(
            sopKey,
            actionStepHistoryID,
            section.componentType, section.id,
            dataIndex, nStatus, userID, checked);
    }

    // 상황 전파
    const onProgressSpread = async (section, dataIndex, isSMS, isEmail, isBroadcast, isSiren, message, teams) => {
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = props.currentSopTabKey;
        const actionStepHistoryID = currentActionStepHistoryID;
        const userID = loginUser.id;

        // 전파
        if (section.componentType === 0) {
            await SopSimulatorController.progressSpread(
                sopKey,
                actionStepHistoryID,
                section.componentType, section.id,
                dataIndex, nStatus, userID,
                isSMS, isEmail, isBroadcast, isSiren,
                message);
        }
        else {
            await SopSimulatorController.progressInternalSpread(
                sopKey,
                actionStepHistoryID,
                section.componentType, section.id,
                dataIndex, nStatus, userID,
                isSMS, isEmail, isBroadcast, isSiren,
                message, teams);
        }
    }

    const onExcuteExternalProgram = async (section, dataIndex) => {
        let nStatus = section.status;
        if (!nStatus)
            nStatus = SectionData.Status_Normal;

        const sopKey = props.currentSopTabKey;
        const actionStepHistoryID = currentActionStepHistoryID;
        const userID = loginUser.id;
                
        await SopSimulatorController.excuteExternalProgram(
            sopKey,
            actionStepHistoryID,
            section.componentType, section.id,
            dataIndex, nStatus, userID);
    }

    const beginSopData = () => {
        if (currentSection?.length > 0) {
            if (currentSection[0].componentType === 3 && currentSection[0].isBegin) {
                runSectionFromChart(currentSection[0]);
            }
        }
    }

    const closeSOP = async (ignoreSummary) => {
        const sopRunData = props.sopDatas[props.sopTabIndex];
        const actionStepHistory = sopRunData.sopData.currentActionStep?._ActionStepHistory;
        if (actionStepHistory && actionStepHistory !== null) {

            const endTime = getMakeDateTime(new Date());

            actionStepHistory.endTime = endTime;
            // SOP 결과 요약창 사용?
                if (props.commonSettings.UseResultSummary === 'true' && !ignoreSummary) {
                setContent(SopSimulatorResource.ID.menu.summarySOP);
                setSummarySOPKey(sopRunData.key);
            }
            else {
                await props.closeSOP(props.sopTabIndex, actionStepHistory.id, actionStepHistory.endTime);
            }
        }
        else {
            // 시작 전 SOP는 탭만 없애준다
            await props.closeSOP(props.sopTabIndex, null, null, null);
        }
    }

    // 열려있는 SOP 탭 만들기
    const getSopTabUI = () => {
        if (props.sopDatas === null || props.sopDatas.length === 0)
            return null;

        let sopTabUI = [];

        let beginIndex = 0;
        let endIndex = 0;
        if (props.sopDatas.length <= tabMaxCount) {
            beginIndex = 0;
            endIndex = props.sopDatas.length;
        }
        else {            
            let value = parseInt(props.sopDatas.length / tabMaxCount);
            let remainder = props.sopDatas.length % tabMaxCount;
            
            let bundle = parseInt((props.sopTabIndex) / tabMaxCount);
            beginIndex = bundle * tabMaxCount;
            endIndex = beginIndex + 6;
        }
        
        for (let i = beginIndex; i < endIndex; i++) {

            if (props.sopDatas.length - 1 < i) {
                continue;
            }

            const disasterName = props.sopDatas[i].sopData.disaster.disasterName;
            const stepName = (props.sopDatas[i].sopData.currentActionStep) ? props.sopDatas[i].sopData.currentActionStep.stepName : '';
            const className = (props.sopTabIndex === i) ? "isActive" : null;
            const index = i;

            // position 값이 있으면 실행중임
            if (props.sopDatas[i].position) {
                sopTabUI.push(<li className={className} key={i}><a style={{ cursor: "pointer" }} onClick={() => onChangeTab(index)}>{disasterName}({stepName})</a><img className={'onGoingSopImg'} /* src={onGoingSopImg} */ /></li>);
            }
            else {
                sopTabUI.push(<li className={className} key={i}><a style={{ cursor: "pointer" }} onClick={() => onChangeTab(index)}>{disasterName}({stepName})</a></li>);
            }            
        }

        sopTabUI.push(<li className={'posiRelative'} key={'tabPlus'}><a className={'plus posiAbsolute'} onClick={() => props.changeContent(SopSimulatorResource.ID.menu.callSOP)}></a></li>);

        return sopTabUI;
    }

    const changeContent = (content) => {
        setContent(content);
    }

    const onClickPrevTab = () => {
        const curIndex = props.sopTabIndex;
        if (curIndex - 1 < 0 || props.sopDatas.length - 1 < curIndex - 1)
            return;

        props.onChangeTab(curIndex - 1);
    }

    const onClickNextTab = () => {
        const curIndex = props.sopTabIndex;
        if (props.sopDatas.length - 1 < curIndex + 1)
            return;

        props.onChangeTab(curIndex + 1);
    }

    const getPopup = () => {
        if (content === SopSimulatorResource.menu.SOP_시작_옵션) {
            const sopData = props.sopDatas[props.sopTabIndex].sopData;
            const title = sopData.disasterCategory.categoryName + ' → ' + sopData.subDisasterCategory.subCategoryName + ' → ' + sopData.disaster.disasterName + ' → ' + sopData.currentActionStep.stepName;
            return <BeginOption changeContent={changeContent} beginSOP={beginSOP} title={title} showConfirmDialog={props.showConfirmDialog} />
        }
        else if (content === SopSimulatorResource.ID.menu.summarySOP) {
            const sopRunData = props.sopDatas[props.sopTabIndex];

            if (summarySOPKey === sopRunData.key) {
                return <SummarySOP changeContent={changeContent} closeSOP={props.closeSOP} sopRunData={sopRunData} loginUser={loginUser} />
            }
        }

        return <></>;
    }

    const tabUI = getSopTabUI();

    return (
        <>       
            <SopSimulatorBodyComponent className={'appContainerWrapSop paddingTop60' + " " + 'UI_Section'}>
                <div className={'appContainer pgProgress'}>

                    <div className={'tabArea tabArea'}>
                        <div className={'squaree'}>
                            <div className={'leftt'} onClick={onClickPrevTab}></div>
                            <div className={'rightt'} onClick={onClickNextTab}></div>
                        </div>
                        <ul>
                            {tabUI}
                        </ul>
                    </div>   

                    <ProcessListSB sopRunData={props.sopDatas[props.sopTabIndex]} sensorNames={sensorNames} />
                    
                    <SopSimulatorSBChart
                        sopData={props.sopDatas[props.sopTabIndex]?.sopData}
                        onChangeActionStep={onChangeActionStep}
                        onSelectComponent={runSectionFromChart}
                        currentSection={currentSection}
                        sopTabIndex={props.sopTabIndex}
                        beginSopData={beginSopData}
                        closeSOP={closeSOP}
                        currentActionStep={props.currentActionStep}
                        showConfirmDialog={props.showConfirmDialog}
                        onCloseConfirmDialog={props.onCloseConfirmDialog}
                        commonSettings={props.commonSettings}
                    />
                    
                    <MissionListSB
                        orderSopData={orderSopData}
                        arrows={arrows}
                        currentSection={currentSection}
                        runSection={runSection}
                        onProgressSpread={onProgressSpread}
                        onExcuteExternalProgram={onExcuteExternalProgram}
                        runSectionFromChart={runSectionFromChart}
                        onProgressMission={onProgressMission}
                        sopTabIndex={props.sopTabIndex}

                        sopDatasNew={props.sopDatas}
                        sections={sections}
                        displaySopTabKey={props.displaySopTabKey}
                        currentActionStep={props.currentActionStep}
                        teamDatas={props.teamDatas}
                        showConfirmDialog={props.showConfirmDialog}
                        onCloseConfirmDialog={props.onCloseConfirmDialog}
                        commonSettings={props.commonSettings}
                        beginNextStep={beginNextStep}
                    />
                </div>
            </SopSimulatorBodyComponent>   
            {                    
                getPopup()
            }
        </>
    );
}

export default SopSimulatorBody;