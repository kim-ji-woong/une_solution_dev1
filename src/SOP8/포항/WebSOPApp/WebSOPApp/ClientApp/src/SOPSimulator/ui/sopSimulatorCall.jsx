import React, { useState, useEffect } from 'react';
import SopController from '../../SOPManager/services/sopController';
import { SopSimulatorCallComponent } from '../styled/sopSimulatorStyled';
import { SettingController } from '../../Settings/services/settingController';

function SopSimulatorCall(props) {
    const [disasterCategories, setDisasterCategories] = useState([]);
    const [disasterCategoriesEmergency, setDisasterCategoriesEmergency] = useState([]);
    const [isNormal, setIsNormal] = useState(true);
    const [isEmergency, setIsEmergency] = useState(false);
    const [selectedDisasterCategory, setSelectedDisasterCategory] = useState(null);         // 재난분야
    const [selectedSubDisasterCategory, setSelectedSubDisasterCategory] = useState(null);   // 재난종류
    const [showList_L, setShowList_L] = useState(false);
    const [showList_M, setShowList_M] = useState(false);

    useEffect(() => {
        getDisasterCategories();
    }, [props.selectedSiteNo]);

    const getDisasterCategories = async () => {
        if (props.selectedSiteNo) {
            const [disasterCategoriesData, message] = await SopController.disasterCategories(true, props.selectedSiteNo);
            const [disasterCategoriesEmergencyData, message2] = await SopController.disasterCategories(false, props.selectedSiteNo);
    
            const normalStatus = await getWorkingTime();
            const emergencyStatus = !normalStatus;
    
            setDisasterCategories(disasterCategoriesData);
            setDisasterCategoriesEmergency(disasterCategoriesEmergencyData);
            setIsNormal(normalStatus);
            setIsEmergency(emergencyStatus);
        }
    }

    const getWorkingTime = async () => {
        try {
            const [settings] = await SettingController.requestSetting(props.selectedSiteNo, 'SOP');

            if (settings && settings.length > 0) {
                const workHours = settings[0].settingDatas.find((item) => item.name === 'WorkHours');

                const [startTime, endTime] = workHours.value.split(" - ");
                const [startHour, startMinute] = startTime.split(":").map(Number);
                const [endHour, endMinute] = endTime.split(":").map(Number);

                let now = new Date();
                let day = now.getDay();

                let beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
                let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

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
        setSelectedDisasterCategory(disasterCategoryData);
        setSelectedSubDisasterCategory(null);
        setShowList_L(false);
        setShowList_M(true);
    }

    const onSelectSubDisasterCategory = (subDisasterCategoryData, e) => {
        setSelectedSubDisasterCategory(subDisasterCategoryData);
        setShowList_M(false);
    }

    const onSelectVersion = (sclas_sn) => {
        props.openDB(sclas_sn, null);
    }

    const onChangeNormal = () => {
        setIsNormal(prevIsNormal => !prevIsNormal);
    }
    
    const onChangeEmergency = () => {
        setIsEmergency(prevIsEmergency => !prevIsEmergency);
    }

    const SetDisasterUI = () => {
        /*if (disasterCategories === null || disasterCategoriesEmergency === null)
            return;*/
        
        let disasterCategory = [];
        let subDisasterCategory = [];
        let disaster = [];

        if (disasterCategories === null || disasterCategoriesEmergency === null) {
            return [disasterCategory, subDisasterCategory, disaster];
        }

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
                    <li className={'isActive'} key={'disasterCategory/' + dc.disasterCategory.lclas_sn}>
                        <a key={dc} className={'btnList'} onClick={(e) => onSelectDisasterCategory(dc.disasterCategory, e)}>
                            <span className={'sopArrowIcon'}></span>
                            {dc.disasterCategory.lclas_name}
                        </a>
                    </li>
                );

                for (let j = 0; j < dc.subDisasterCategories.length; j++) {
                    const sdc = dc.subDisasterCategories[j];
                    if (selectedDisasterCategory === null || selectedDisasterCategory.lclas_sn === sdc.subDisasterCategory.lclas_sn) {

                        subDisasterCategory.push(
                            <li key={'subDisasterCategory/' + sdc.subDisasterCategory.mclas_sn}>
                                <a key={sdc} className={'btnList'} onClick={(e) => onSelectSubDisasterCategory(sdc.subDisasterCategory, e)}>
                                    <span className={'sopArrowIcon'}></span>
                                    {sdc.subDisasterCategory.mclas_name}
                                </a>
                            </li>
                        );

                        for (let k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            let sclas_sn = null;
                            
                            let isNormal = true;
                            for (var q = 0; q < d.disasterDatas.length; q++) {
                                if (selectedSubDisasterCategory === null || selectedSubDisasterCategory.mclas_sn === d.disasterDatas[q].disaster.mclas_sn) {
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    isNormal = d.disasterDatas[q].disaster.nor_yn;                                    
                                    if (isNormal === undefined) {
                                        continue;
                                    }
                                    if ((isNormal && isNormal) || (!isNormal && isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                        sclas_sn = d.disasterDatas[q].disaster.sclas_sn;
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            
                            for (let q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].last_acces_de) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.last_acces_de.replace('T', ' ');

                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.ver_sn}>
                                        <a key={d} onClick={() => onSelectVersion(sclas_sn)}>
                                            <p>{dc.disasterCategory.lclas_name}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.mclas_name}&nbsp;&gt;&nbsp;{d.disasterName}</p>
                                            {
                                                (isNormal)
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
                    if (selectedDisasterCategory === null || selectedDisasterCategory.lclas_sn === sdc.subDisasterCategory.lclas_sn) {

                        for (let k = 0; k < sdc.disasterDatas.length; k++) {
                            const d = sdc.disasterDatas[k];
                            const allVersions = [];
                            let sclas_sn = null;

                            for (let q = 0; q < d.disasterDatas.length; q++) {
                                if (selectedSubDisasterCategory === null || selectedSubDisasterCategory.mclas_sn === d.disasterDatas[q].disaster.mclas_sn) {
                                    if (d.disasterDatas[q].version === undefined || d.disasterDatas[q].version === null) {
                                        continue;
                                    }
                                    const isNormal = d.disasterDatas[q].disaster.nor_yn;
                                    if (isNormal === undefined) {
                                        continue;
                                    }
                                    if ((isNormal && isNormal) || (!isNormal && isEmergency)) {
                                        allVersions.push(d.disasterDatas[q].version);
                                        sclas_sn = d.disasterDatas[q].disaster.sclas_sn;
                                    }
                                }
                            }

                            let lastAccessVersion = (allVersions.length > 0) ? allVersions[0] : null;
                            for (let q = 0; q < allVersions.length; q++) {
                                if (allVersions.length - 1 >= q + 1) {
                                    if (lastAccessVersion < allVersions[q + 1].last_acces_de) {
                                        lastAccessVersion = allVersions[q + 1];
                                    }
                                }
                            }

                            if (lastAccessVersion !== null) {
                                const lastAccessTime = lastAccessVersion.last_acces_de.replace('T', ' ');//getMakeDateTime(lastAccessVersion.lastAccessTime);
                                disaster.push(
                                    <li key={'disaster/' + lastAccessVersion.ver_sn}>
                                        <a key={d} onClick={() => onSelectVersion(sclas_sn)}>
                                            <p>{dc.disasterCategory.lclas_name}&nbsp;&gt;&nbsp;{sdc.subDisasterCategory.mclas_name}&nbsp;&gt;&nbsp;{d.disasterName}</p>
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

    const handleCategory = (type) => {
        if (type === 'L-list') {
            if (!showList_L) {
                setShowList_M(false);
            }
            setShowList_L(!showList_L);
        }
        else if (type === 'M-list') {
            if (!showList_M) {
                setShowList_L(false);
            }
            setShowList_M(!showList_M);
        }
    }

    const [disasterCategory, subDisasterCategory, disaster] = SetDisasterUI();

    const categoryName = (selectedDisasterCategory === null) ? '전체' : selectedDisasterCategory.lclas_name; 
    const subCategoryName = (selectedSubDisasterCategory === null) ? '전체' : selectedSubDisasterCategory.mclas_name;

    return (
        <SopSimulatorCallComponent className={'appContainerWrapp clfix' + " " + 'UI_Section'}>
            <div className={'appContainer'}>
            <section className={'subSection' + ' menualListWrap'}>
                    <dl>
                        <div className={showList_L ? 'list isShow' : 'list'} onClick={() => handleCategory('L-list')}>
                            <dt>재난유형<em>{categoryName}</em></dt>
                            <dd className={'categoryScroll'}>
                                <ul className={'bullet'}>
                                    {disasterCategory}
                                </ul>
                            </dd>
                        </div>
                        <div className={showList_M ? 'list isShow' : 'list'} onClick={() => handleCategory('M-list')}>
                            <dt>재난종류<em>{subCategoryName}</em></dt>
                            <dd className={'subCategoryScroll'}>
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
                                <input type="checkbox" id="filter01" name='isNormal' checked={isNormal} onChange={onChangeNormal}/>
                                <label htmlFor='filter01'>평일/주간</label>
                            </div>
                            <div className={'holidayCheckBox cGreen'}>
                                <input type="checkbox" id="filter02" name='isNormal' checked={isEmergency} onChange={onChangeEmergency}/>
                                <label htmlFor='filter02'>휴일/야간</label>
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
        </SopSimulatorCallComponent>
    );
}
    export default SopSimulatorCall;