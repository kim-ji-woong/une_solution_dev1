import React, { useState, useEffect } from 'react';
import $ from 'jquery';
//import uis from '../../Common/css/ui.module.css';
import SopController from '../../SOPManager/services/sopController';
import SopSimulatorController from '../services/sopSimulatorController';

import { SopSimulatorSBcallComponent } from '../styled/sopSimulatorStyled';
import { SettingController } from '../../Settings/services/settingController';

function SopSimulatorSBcall(props) {
    const [disasterCategories, setDisasterCategories] = useState([]);
    const [disasterCategoriesEmergency, setDisasterCategoriesEmergency] = useState([]);
    const [isNormal, setIsNormal] = useState(true);
    const [isEmergency, setIsEmergency] = useState(false);
    const [selectedDisasterCategory, setSelectedDisasterCategory] = useState(null);         // 재난분야
    const [selectedSubDisasterCategory, setSelectedSubDisasterCategory] = useState(null);   // 재난종류
    const [selectedDisaster, setSelectedDisaster] = useState(null);                         // 재난상황
    const [selectedVersion, setSelectedVersion] = useState(null);                           // 선택 SOP

    useEffect(() => {
        getDisasterCategories();

        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden', 'color': '#fff' });
        // 각 페이지 별로 클래스 초기화
        $('#subPage').removeClass('sop');

        // E-SOP 매뉴얼 Left List Toggle
        $('.menualListWrap').on('click', 'dt', function () {
            $(this).closest('.list').toggleClass("isShow").siblings().removeClass("isShow");
        });

        /* $('.menualListWrap').on('click', 'dt', function () {
            $(this).closest('.list').toggleClass("isShow").siblings().removeClass("isShow");
        }); */

        // 재난분야 버튼 이벤트
        $('.category dd ul').on('click', 'li', function () {
            //console.log("재난분야 버튼 테스트");

            // 재난분야 메뉴 닫기
            $('.category').removeClass("isShow");
            // 재난종류 메뉴 열기
            $('.subCategory').addClass("isShow");
        });

        // 재난종류 버튼 이벤트
        $('.subCategory dd ul').on('click', 'li', function () {
            //console.log("재난종류 버튼 테스트");
        });

        // 페이지 타이틀 
        $('#pageTitle').text("E-SOP");

    }, [props.selectedSiteNo]);

    const getDisasterCategories = async () => {
        const [disasterCategoriesData, message] = await SopController.disasterCategories(true, props.selectedSiteNo);
        const [disasterCategoriesEmergencyData, message2] = await SopController.disasterCategories(false, props.selectedSiteNo);

        const normalStatus = await getWorkingTime();
        const emergencyStatus = !isNormal;

        setDisasterCategories(disasterCategoriesData);
        setDisasterCategoriesEmergency(disasterCategoriesEmergencyData);
        setIsNormal(normalStatus);
        setIsEmergency(emergencyStatus);
    }

    const getWorkingTime = async () => {
        try {
            const settings = await SettingController.requestSopCommonSettings();
            if (!settings || settings.length === 2) {

                const begin = settings[0].WorkingBeginHour?.split(':');
                const end = settings[0].WorkingEndHour?.split(':');

                if (begin.length != 2 || end.length != 2)
                    return true; // 주간 근무시간 설정 안되어 있으면 그냥 주간으로 간주한다

                const beginHours = Number(begin[0]);
                const beginTime = Number(begin[1]);
                const endHours = Number(end[0]);
                const endTime = Number(end[1]);

                let now = new Date();
                let day = now.getDay();

                let beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), beginHours, beginTime);
                let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endTime);

                if (day >= 1 && day <= 5 && now >= beginDate && now <= endDate) { // 평일 근무시간인가?
                    return true;
                }

                return false;
            }
        } catch (e) {
            return true;
        }
    }

    const onSelectDisasterCategory = (disasterCategoryData, e) => {

        const category = document.getElementsByClassName('btnList isActiveType');

        for(let el of category) {
            el.classList.remove("isActiveType");
        }

        e.currentTarget.classList.toggle("isActiveType");

        setSelectedDisasterCategory(disasterCategoryData);
        setSelectedSubDisasterCategory(null);
    }

    const onSelectSubDisasterCategory = (subDisasterCategoryData, e) => {

        const category = document.getElementsByClassName('isActiveType');
        
        for(let el of category) {
            el.classList.remove("isActiveType");
        }

        e.currentTarget.classList.toggle("isActiveType");

        setSelectedSubDisasterCategory(subDisasterCategoryData);
    }

    const onSelectVersion = (versionID) => {
        props.openDB(versionID, null);
    }

    const onChangeNormal = () => {
        setIsNormal(prevIsNormal => !prevIsNormal);
    }
    
    const onChangeEmergency = () => {
        setIsEmergency(prevIsEmergency => !prevIsEmergency);
    }

    const SetDisasterUI = () => {
        /* if (disasterCategories === null || disasterCategoriesEmergency === null)
            return; */
        
        let disasterCategory = [];
        let subDisasterCategory = [];
        let disaster = [];

        disasterCategory.push(
            <li className={'isActive'} key={'disasterCategory/'}>
                <a className={'btnList'} onClick={(e) => onSelectDisasterCategory(null, e)}>
                    <span className={'sopArrowIcon'}></span>
                    전체
                </a>
            </li>
        );

        subDisasterCategory.push(
            <li key={'subDisasterCategory/'}>
                <a className={'btnList'} onClick={(e) => onSelectSubDisasterCategory(null, e)}>
                    <span className={'sopArrowIcon'}></span>
                    전체
                </a>
            </li>
        );

        if (isNormal) {
            for (let i = 0; i < disasterCategories.length; i++) {
                const dc = disasterCategories[i];
                disasterCategory.push(
                    <li className={'isActive'} key={'disasterCategory/' + dc.disasterCategory.id}>
                        <a key={dc} className={'btnList'} onClick={(e) => onSelectDisasterCategory(dc.disasterCategory, e)}>
                            <span className={'sopArrowIcon'}></span>
                            {dc.disasterCategory.categoryName}
                        </a>
                    </li>
                );

                for (let j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (selectedDisasterCategory === null || selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        subDisasterCategory.push(
                            <li key={'subDisasterCategory/' + sdc.subDisasterCategory.id}>
                                <a key={sdc} className={'btnList'} onClick={(e) => onSelectSubDisasterCategory(sdc.subDisasterCategory, e)}>
                                    <span className={'sopArrowIcon'}></span>
                                    {sdc.subDisasterCategory.subCategoryName}
                                </a>
                            </li>
                        );



                        for (let k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            for (var q = 0; q < d.disasterDatas.length; q++) {
                                if (selectedSubDisasterCategory === null || selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    const isNormal = d.disasterDatas[q].version.isNormal;                                    
                                    if (isNormal === undefined) {
                                        continue;
                                    }
                                    if ((isNormal && isNormal) || (!isNormal && isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (let q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].lastAccessTime) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.lastAccessTime.replace('T', ' '); //getMakeDateTime(lastAccessVersion.lastAccessTime);

                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.id}>
                                        <a key={d} onClick={() => onSelectVersion(lastAccessVersion.id)}>
                                            <p>{dc.disasterCategory.categoryName}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.subCategoryName}&nbsp;&gt;&nbsp;{d.disasterName}</p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <div className={'sopDayBox'}><span className={'sopGreenCircle'}></span><span className={'noti'}>평일/주간</span></div>
                                                    : <div className={'sopDayBox'}><span className={'sopYellowCircle'}></span><span className={'noti'}>휴일/야간</span></div>
                                            }
                                            <span className={'date'}>{lastAccessTime}</span>
                                        </a>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }

        if (isEmergency) {
            for (let i = 0; i < disasterCategoriesEmergency.length; i++) {
                const dc = disasterCategoriesEmergency[i];
                
                for (let j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (selectedDisasterCategory === null || selectedDisasterCategory.id === sdc.subDisasterCategory.disasterCategoryID) {

                        for (let k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            for (let q = 0; q < d.disasterDatas.length; q++) {
                                if (selectedSubDisasterCategory === null || selectedSubDisasterCategory.id === d.disasterDatas[q].disaster.subDisasterCategoryID) {
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    const isNormal = d.disasterDatas[q].version.isNormal;
                                    if (isNormal === undefined) {
                                        continue;
                                    }
                                    if ((isNormal && isNormal) || (!isNormal && isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (let q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].lastAccessTime) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.lastAccessTime.replace('T', ' ');//getMakeDateTime(lastAccessVersion.lastAccessTime);
                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.id}>
                                        <a key={d} onClick={() => onSelectVersion(lastAccessVersion.id)}>
                                            <p>{dc.disasterCategory.categoryName}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.subCategoryName}&nbsp;&gt;&nbsp;{d.disasterName}</p>
                                            {
                                                (lastAccessVersion.isNormal)
                                                    ? <div className={'sopDayBox'}><span className={'sopGreenCircle'}></span><span className={'noti'}>평일/주간</span></div>
                                                    : <div className={'sopDayBox'}><span className={'sopYellowCircle'}></span><span className={'noti'}>휴일/야간</span></div>
                                            }
                                            <span className={'date'}>{lastAccessTime}</span>
                                        </a>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }
                
        return [disasterCategory, subDisasterCategory, disaster];
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

    const [disasterCategory, subDisasterCategory, disaster] = SetDisasterUI();

    const categoryName = (selectedDisasterCategory === null) ? '전체' : selectedDisasterCategory.categoryName; 
    const subCategoryName = (selectedSubDisasterCategory === null) ? '전체' : selectedSubDisasterCategory.subCategoryName;

    return (
        <SopSimulatorSBcallComponent className={'appContainerWrapp clfix' + " " + 'UI_Section'}>
            <div className={'appContainer'}>
            <section className={'subSection menualListWrap'}>
                    <dl>
                        <div className={'list category'}>
                            <dt>상황분야<em>{categoryName}</em></dt>
                            <dd /* className={'categoryScroll'} */>
                                <ul className={'bullet'}>
                                    {disasterCategory}
                                </ul>
                            </dd>
                        </div>
                        <div className={'list subCategory'}>
                            <dt>상황종류<em>{subCategoryName}</em></dt>
                            <dd /* className={'subCategoryScroll'} */>
                                <ul className={'bullet'}>
                                    {subDisasterCategory}
                                </ul>
                            </dd>
                        </div> 
                    </dl>
                </section>
                <section className={'subSection boardListWrap'}>
                    <div className={'sopTit clfix'}>
                        <strong>SOP 임무 목록</strong>
                        <div className={'filterArea clfix'}>                                    
                            <div className={'allDaycheckBox'}>
                                <input type="radio" id="filter01" defaultChecked={isNormal} onChange={onChangeNormal}/>
                                <label>평일/주간</label>
                            </div>
                            <div className={'holidayCheckBox cGreen'}>
                                <input type="radio" id="filter01" defaultChecked={isEmergency} onChange={onChangeEmergency}/>
                                <label>휴일/야간</label>
                            </div>
                        </div>
                    </div>
                    <div className={'innerSection scrollbar'}>
                        <ol className={'numList list'}>
                            {disaster}
                        </ol>
                    </div>
                </section>
            </div>
        </SopSimulatorSBcallComponent>
    );
}
    export default SopSimulatorSBcall;