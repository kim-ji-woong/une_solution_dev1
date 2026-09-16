import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import SectionPanel from '../../Common/sections/sectionPanel';
import $ from 'jquery';

import SopSimulatorResource from "../resource/id";
import AccountResource from '../../Account/resource/id';
import ProjectResource from '../../Root/resource/id';
//import SessionString from '../../Common/js/sessionString';

import { SopSimulatorChartComponent } from '../styled/sopSimulatorStyled';
import SectionData from '../../Common/models/sections/sectionData';

function SopSimulatorChart(props) {
    const [currentMenu, setCurrentMenu] = useState({ menuType: "" });
    const [editDatas, setEditDatas] = useState({
        command: "",
        sectionCellDatas: null,
    });
    const [selectedSectionData, setSelectedSectionData] = useState([]);
    const [firstUpdateChk, setFirstUpdateChk] = useState(false);        // SOP Chart 불러오기 유무 판단

    const prevProps = useRef(null);

    // 그리드 계산에 사용
    const cellDefaultWidth = 300;
    const cellDefaultHeight = 200;
    const gridHeaderMargin = 50;
    const scrollCenterWidth = 180;

    useEffect(() => {
        // SOP Chart 첫 업데이트 시 or 탭을 클릭하여 SOP Chart를 변경하였을때
        if (firstUpdateChk !== true || prevProps.current.sopTabIndex !== props.sopTabIndex)
            selectCurrentComponent();

        // 부모에서 현재 컴포넌트를 변경하였을 경우
        if (prevProps.current?.currentSection !== props.currentSection) {
            // 현재 Section 조회
            let currentActionStep = props.sopData?.currentActionStep;

            let sectionData = null;
            if (props.currentSection) {
                sectionData = props.currentSection;
            }

            // 현재 Section Component 체크하기
            setSelectedSectionData([sectionData, currentActionStep]);

            // 실행중인 컴포넌트로 자동 화면 이동
            if (props.commonSettings?.UseAutoMoveSOPScreen?.value?.toLowerCase() === 'true' && sectionData) {
                gridCenterForcus(sectionData?.component.row_no, sectionData?.component.column_no);
            }
        }

        prevProps.current = props;

    }, [props.sopData, props.sopTabIndex, props.currentSection, firstUpdateChk, props.commonSettings]);

    const selectCurrentComponent = () => {
        // 현재 Section 조회
        let currentActionStep = props.sopData?.currentActionStep;
        let sectionData = null;

        if (props.currentSection) {
            sectionData = props.currentSection;
        }

        // 현재 Section Component 체크하기
        setSelectedSectionData([sectionData, currentActionStep]);
        if(sectionData) {
            gridCenterForcus(sectionData?.component.row_no, sectionData?.component.column_no);
        }
        
        // 첫 업데이트 체크 >> SOP Chart 불러오기 유무 판단
        setFirstUpdateChk(true);
    }

    const onSelectComponent = (sectionData, actionStep) => {
        // 선택된 sectionData 전달하기
        if (props.onSelectComponent(sectionData, null)) {
            setSelectedSectionData([sectionData, actionStep]);
            gridCenterForcus(sectionData?.component.row_no, sectionData?.component.column_no);
        }
    }

    const toOriginalLocation = () => {
        if (props.currentSection) {
            gridCenterForcus(props.currentSection.component.row_no, props.currentSection.component.column_no);
        }
    }

    const gridCenterForcus = (rowIndex, columnIndex) => {
        if (rowIndex === null || rowIndex === undefined) {
            rowIndex = 0;
        }
        if (columnIndex === null || columnIndex === undefined) {
            columnIndex = 0;
        }

        // 그리드 계산
        let width = (cellDefaultWidth * columnIndex) - scrollCenterWidth;
        let height = gridHeaderMargin + (cellDefaultHeight * rowIndex);

        // 애니메이션 효과
        $('.sectionPanel').animate({ scrollTop: height, scrollLeft: width }, 500);
    }

    const getSectionData = () => {
        if (selectedSectionData && selectedSectionData.length >= 2) {
            return [selectedSectionData[0], selectedSectionData[1]];
        }

        return [null, null];
    }

    const onSelectArrow = (arrow, actionStep) => {
        
    }

    const getSOPName = () => {
        let sopName = '';
        if (props.sopData?.disaster) {
            sopName = props.sopData.disaster.sclas_name + ' ';
        }

        if (props.sopData?.alarmDateTime && props.sopData?.alarmPosition) {
            sopName += props.sopData?.alarmDateTime + props.sopData?.alarmPosition;
        }

        return sopName;
    }

    // SOP 단계 버튼 클릭시 작동 핸들러 
    const onClickStep = (e) => {
        let target = e;

        // 해당 단계 sop 내용이 없는 버튼이라면 return
        if ($(target).closest('li').hasClass("unActive") !== true)
            return;

        $('.btnActionStep').closest('li.' + "isActive").removeClass("isActive").addClass("unActive");
        $(target).closest('li').removeClass("unActive").addClass("isActive");

        /* test */
        $('.isActive').show("actCircle");


        // 현재 SOP ID 및 단계 정보 얻어오기
        let stepName = target.innerText;
        let sopID = null;
        let actionStepDatas = props.sopData?.actionStepDatas;

        for (let i = 0; i < actionStepDatas.length; i++) {
            let actionStepData = actionStepDatas[i];

            if (stepName === actionStepData.stepName) {
                sopID = actionStepData.actionStep?.action_step_sn;
            }
        }

        // 해당 SOP ID가 없다면 리턴 
        if (sopID === null)
            return;

        // 첫 업데이트 체크 해제 >> SOP Chart 불러오기 유무 판단
        setFirstUpdateChk(false);

        // 값 전달하기
        props.onChangeActionStep(stepName, sopID);
        return;
    }

    // SOP 단계 버튼영역 생성
    const getActionStepArea = () => {
        let class_1st = "btnActionStep " + "class1st";
        let class_2nd = "btnActionStep " + "class2nd";
        let class_3rd = "btnActionStep " + "class3rd";
        let class_4th = "btnActionStep " + "class4th";
        let actionStepArea = "";

        // 현재 단계 및 단계 유무 파악
        const stepDatas = props.sopData?.actionStepDatas;
        const stepDatasLength = stepDatas?.length;

        for (let i = 0; i < stepDatasLength; i++) {
            let stepData = stepDatas[i];

            // 단계별 데이터가 존재한다면
            if (stepData.actionStep != null) {
                if (stepData.stepName === SopSimulatorResource.ID.actionStep._1st) {
                    if (props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_1st += " " + "isActive";
                    }
                    else {
                        class_1st += " " + "unActive";
                    }

                    if (stepData._ActionStepHistory) {
                        class_1st += " " + "actCircle";
                    }                    
                } else if (stepData.stepName === SopSimulatorResource.ID.actionStep._2nd) {
                    if (props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_2nd += " " + "isActive";
                    }
                    else {
                        class_2nd += " " + "unActive";
                    }

                    if (stepData._ActionStepHistory) {
                        class_2nd += " " + "actCircle";
                    }                    
                } else if (stepData.stepName === SopSimulatorResource.ID.actionStep._3rd) {
                    if (props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_3rd += " " + "isActive";
                    }
                    else {
                        class_3rd += " " + "unActive";
                    }

                    if (stepData._ActionStepHistory) {
                        class_3rd += " " + "actCircle";
                    }                    
                } else if (stepData.stepName === SopSimulatorResource.ID.actionStep._4th) {
                    if (props.sopData.currentActionStep.stepName === stepData.stepName) {
                        class_4th += " " + "isActive";
                    }
                    else {
                        class_4th += " " + "unActive";
                    }

                    if (stepData._ActionStepHistory) {
                        class_4th += " " + "actCircle";
                    }                    
                }

            }
        }

        // HTML 작성
        actionStepArea = <>
            <li className={class_1st}><button type="button" className={"value"} onClick={(e) => onClickStep(e.target)}>{SopSimulatorResource.ID.actionStep._1st}</button></li>
            <li className={class_2nd}><button type="button" className={"value"} onClick={(e) => onClickStep(e.target)}>{SopSimulatorResource.ID.actionStep._2nd}</button></li>
            <li className={class_3rd}><button type="button" className={"value"} onClick={(e) => onClickStep(e.target)}>{SopSimulatorResource.ID.actionStep._3rd}</button></li>
            <li className={class_4th}><button type="button" className={"value"} onClick={(e) => onClickStep(e.target)}>{SopSimulatorResource.ID.actionStep._4th}</button></li>
        </>;

        return actionStepArea;
    }

    const showConfirmDialog = () => {
        let userInfo = ProjectResource.getUserInfo();

        if (SectionData.isEndpointType(props.currentSection.component.compn_code) && props.currentSection.endpoint.begin_yn) {
            props.history.push("/sop-manager?sop=" + props.sopData.disaster.sclas_sn, '_blank');
        }
        else if (userInfo && userInfo !== null && (parseInt(userInfo.grad_sn) === AccountResource.accountLevelNo.master || parseInt(userInfo.grad_sn) === AccountResource.accountLevelNo.admin)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['실행중인 SOP는 종료 후 수정 할 수 있습니다.', '종료할까요 ?'], ['종료 후 열기', '종료하지 않고 열기', '취소'], onClickEditSOP);
        } 
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['권한이 없습니다.'], null, null);
        }
    }

    const onClickEditSOP = (index) => {        
        if (index === 0) {
            props.closeSOP(true);
        }

        if (index <= 1) {
            props.history.push("/sop-manager?sop=" + props.sopData.disaster.sclas_sn, '_blank');
            // window.open("/sop-manager?sop=" + props.sopData.disaster.sclas_sn, '_blank');
        }

        props.onCloseConfirmDialog();
    }

    const [sectionData, /*actionStep*/] = getSectionData();

    // let sopName = "";
    // sopName = getSOPName();

    // SOP 단계 버튼영역 생성
    let btnActionStepArea = getActionStepArea();

    return (
        <>
            <SopSimulatorChartComponent className={'subSection progressViewWrap'}>
                {/* <section className={'subSection progressViewWrap'}> */}
                    <div className={'tit clfix'}>
                        <strong>{getSOPName()}</strong>
                        <div className={'btnArea'}>
                            <button className={'btnMod'} onClick={showConfirmDialog}><i className={'iconMod'}></i></button>
                            <button className={'btnPlay'} onClick={props.beginSopData}><i className={'iconPlay'}></i></button>
                            <button className={'btnEnd'} onClick={() => props.closeSOP(false)}><i className={'iconEnd'}></i></button>
                        </div>
                    </div>
                    <div className={'chartWrap'}>
                        <ul className={'infoList'}>
                            {btnActionStepArea}
                        </ul>

                        <div className={'chartArea scrollbar'}>
                            <section className={'panelAreas scrollbar'}>
                                <button id={'refresh'} onClick={toOriginalLocation}></button>
                                {/* 실행모드일 경우 Cell hover 테두리 제거를 위해서 apps.sectionPanels 클래스 네임 선언 */}
                                <div className={'sectionPanels scrollbar'}>
                                    <SectionPanel
                                        currentMenu={currentMenu}
                                        selectedSectionData={sectionData}
                                        editDatas={editDatas}
                                        onProcessEdit={""}
                                        onSelectComponent={onSelectComponent}
                                        selectedArrowData={""}
                                        onAddComponent={""}
                                        onRemoveComponent={""}
                                        onSelectArrow={onSelectArrow}
                                        sopData={props.sopData}
                                        rowCount={30}
                                        columnCount={30}
                                        mode={"exec"}
                                        showConfirmDialog={props.showConfirmDialog}
                                        />
                                </div>
                            </section>
                        </div>
                    </div>
                {/* </section> */}
            </SopSimulatorChartComponent>
        </>
    );
}

export default withRouter(SopSimulatorChart);