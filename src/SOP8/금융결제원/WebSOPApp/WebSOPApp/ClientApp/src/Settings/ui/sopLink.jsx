import React, { useEffect, useState, useRef, useMemo } from 'react';
import { withRouter } from 'react-router-dom';

import { SopLinkComponent } from '../styled/settingsStyled';
import { ModalBackground } from '../../Root/styled/theme';
import binIcon from '../images/binIcon.svg';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import Button from '../../Common/components/button';
import SopController from '../../SOPManager/services/sopController';
import ProjectResource from '../../Root/resource/id';
import SettingsResource from '../resource/id';
import { useSensorList } from '../../Common/hooks/useSensorList';
import { SDMSController } from '../../SDMS/services/sdmsController';
import EmptyContent from '../../Common/components/emptyContent';
import SdmsResource from '../../SDMS/resource/id';

function SopLink(props) {
    const { sensorTypes } = useSensorList();

    const [isValid, setIsValid] = useState(false);
    const [linkedSOPs, setLinkedSOPs] = useState([]);

    const [selectedSensorType, setSelectedSensorType] = useState(null);            // 센서유형
    const [selectedDisasterCategoryNo, setSelectedDisasterCategoryNo] = useState(null);
    const [selectedSubDisasterCategoryNo, setSelectedSubDisasterCategoryNo] = useState(null);

    const [buildingGroups, setBuildingGroups] = useState(null);
    const [outdoorZones, setOutdoorZones] = useState(null);

    const [selecteBuildingGroup, setSelecteBuildingGroup] = useState(null);    
    const [selecteBuilding, setSelecteBuilding] = useState(null);    
    const [selectedZone, setSelectedZone] = useState(null);    

    const [disasterCategories, setDisasterCategories] = useState(null);

    const locationText = useMemo(() => {
        const parts = [
            selecteBuildingGroup?.displayText,
            selecteBuilding?.displayText,
            selectedZone?.displayText,
        ].filter(Boolean); // undefined/null 제거

        return parts.join(" > "); // 없으면 빈 문자열
    }, [selecteBuildingGroup, selecteBuilding, selectedZone]);

    const [sortOrder, setSortOrder] = useState({
        sensorTypeName: 'desc',
        zoneName: 'desc',
        disasterCategoryName: 'desc',
        subDisasterCategoryName: 'desc'
    });

    const bNeedToSave = useRef(false);

    useEffect(() => {
        loadLinkedSOPs();
        loadBuildingGroupList();
        loadDisasterCategory();
    }, []);

    const loadBuildingGroupList = async () => {
        const [buildingGroups, outdoorZones, message] = await SDMSController.requestBuildingGroupList();

        if (!buildingGroups) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setBuildingGroups(buildingGroups);
        setOutdoorZones(outdoorZones);
    }

    const loadDisasterCategory = async () => {
        const [disasterCategories, message] = await SopController.disasterCategories(null, props.selectedSiteNo);

        if (!disasterCategories) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            setDisasterCategories(disasterCategories);
        }
    }

    const loadLinkedSOPs = async () => {
        const sensorTypeDatas = getSensorTypeDatas();
        const [result, message] = await SopController.requestLinkedSOPs(null, sensorTypeDatas);

        if (!result) {
            console.log(message);
        }
        else {
            setLinkedSOPs(result);
            bNeedToSave.current = false;
            setIsValid(false);
        }
    }

    const onChangeNeedToSave = () => {
        bNeedToSave.current = true;
        setIsValid(true);
    }

    const getSensorTypeDatas = () => {
        let sensorTypeDatas = [];

        for (const sensorType of sensorTypes) {
            if (sensorType.sensorSubTypes) {
                for (const sensorSubType of sensorType.sensorSubTypes) {
                    sensorTypeDatas.push(
                        {
                            "sensorTypeCode": sensorType.sensorTpyeCode,
                            "sensorSubTypeNo": sensorSubType,
                            "sensorTypeName": sensorType.sensorTypeName
                        }
                    );
                }
            }
        }

        return sensorTypeDatas;
    }

    const onChangeSensorType = (sensorType) => {
        if (selectedSensorType?.sensorTypeCode === sensorType.sensorTypeCode) {
            setSelectedSensorType(null);
            return;
        }

        setSelectedSensorType(sensorType);
    }

    const onClickDisasterCategory = (disasterCategory) => {
        if (!disasterCategory) {
            return;
        }
        const disasterCategoryNo = disasterCategory.disasterCategory.lclas_sn;
        
        if (selectedDisasterCategoryNo === disasterCategoryNo) {
            setSelectedDisasterCategoryNo(null);
            setSelectedSubDisasterCategoryNo(null);
            return;
        }
        
        setSelectedDisasterCategoryNo(disasterCategoryNo);
    }

    const onClickSubDisasterCategory = (subDisasterCategory) => {
        if (!subDisasterCategory) {
            return;
        }
        
        if (selectedSubDisasterCategoryNo === subDisasterCategory.subDisasterCategory.mclas_sn) {
            setSelectedSubDisasterCategoryNo(null);
            return;
        }
        
        const subDisasterCategoryNo = subDisasterCategory.subDisasterCategory.mclas_sn;
        
        setSelectedSubDisasterCategoryNo(subDisasterCategoryNo);
    }

    const onClickDisasterData = (disasterCategory, subDisasterCategory, disasterData) => {
        let newLinkedSOPs = [];
        
        if (linkedSOPs && linkedSOPs.length > 0) {
            newLinkedSOPs = [...linkedSOPs];
        }
        if (selectedSensorType === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["이벤트 유형을 선택해주세요."], null, null);
            return;
        }
        
        for (const linkedSOP of newLinkedSOPs) {
            const isSensorTypeSame =
                linkedSOP.sensorTypeName === selectedSensorType?.sensorTypeName;

            const isLocationSame = isSameLocation(linkedSOP);

            if (isSensorTypeSame && isLocationSame) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["이미 연동이 완료된 센서입니다.", "삭제 후 다시 시도해주세요."], null, null);
                return;
            }
        }

        let sopData = {};

        sopData.link_sop_sn = -1;
        sopData.sensorTypeName = selectedSensorType.sensorTypeName;
        sopData.sensor_ty_code = selectedSensorType.sensorTypeCode;
        sopData.lclas_sn = disasterCategory.disasterCategory.lclas_sn;
        sopData.mclas_sn = subDisasterCategory.subDisasterCategory.mclas_sn;
        sopData.sclas_name = disasterData.disasterName;
        sopData.site_sn = disasterCategory.disasterCategory.site_sn;
        sopData.largeClassName = disasterCategory.disasterCategory.lclas_name;
        sopData.middleClassName = subDisasterCategory.subDisasterCategory.mclas_name;

        sopData.buildingGroupName = selecteBuildingGroup?.displayText ? selecteBuildingGroup.displayText : null;
        sopData.buildingName = selecteBuilding?.displayText ? selecteBuilding.displayText : null;
        sopData.zoneName = selectedZone?.name ? selectedZone.name : null;
        
        sopData.buld_group_sn = selecteBuildingGroup?.buildingGroupNo ? selecteBuildingGroup.buildingGroupNo : null;
        sopData.buld_sn = selecteBuilding?.buildingNo ? selecteBuilding.buildingNo : null;
        sopData.zone_sn = selectedZone?.zoneNo ? selectedZone.zoneNo : null;

        // 알 수 없는 값들
        sopData.sensor_ty_optn_code = 1;
        sopData.sensor_sub_ty_no = null;
        sopData.descp = null;
        
        newLinkedSOPs.push(sopData);
        
        onChangeNeedToSave();
        setLinkedSOPs(newLinkedSOPs);
    }
    
    const onClickBuildingGroup = (buildingGroup) => {
        if (!buildingGroup) {
            return;
        }

        // 외부영역
        if (buildingGroup.zoneNo === 20000) {
            setSelecteBuildingGroup(null);
            setSelecteBuilding(null);
            setSelectedZone(buildingGroup.zoneNo);
        }
        else {
            const buildingGroupNo = buildingGroup.buildingGroupNo;
            
            if (selecteBuildingGroup?.buildingGroupNo === buildingGroupNo) {
                setSelecteBuildingGroup(null);
                setSelecteBuilding(null);
                setSelectedZone(null);
                return;
            }
            
            setSelecteBuildingGroup(buildingGroup);
            setSelecteBuilding(null);
            setSelectedZone(null);
        }
    }
    
    const onClickBuilding = (building) => {
        if (!building) {
            return;
        }
        const buildingNo = building.buildingNo;
        
        if (selecteBuilding?.buildingNo === buildingNo) {
            setSelecteBuilding(null);
            setSelectedZone(null);
            return;
        }
        
        setSelecteBuilding(building);
        setSelectedZone(null);
    }
    
    const onClickZone = (zone) => {
        if (!zone) {
            return;
        }
        const zoneNo = zone.zoneNo;
        
        if (selectedZone?.zoneNo === zoneNo) {
            setSelectedZone(null);
            return;
        }
        
        setSelectedZone(zone);
    }

    const deleteLinkedSOP = (index) => {
        setLinkedSOPs(prev => {
            const next = prev.filter((_, i) => i !== index);
            return next;
        });

        props.handleToast('삭제되었습니다');
        onChangeNeedToSave();
    };

    const getBuildingGroupUI = () => {
        let ui = [];

        if (!buildingGroups) return ui;

        for (const buildingGroup of buildingGroups) {
            let depth1DivClassName = 'depth1';
            let depth1UlClassName = '';

            if (buildingGroup.buildingGroupNo === selecteBuildingGroup?.buildingGroupNo) {
                depth1DivClassName += ' on';
                depth1UlClassName = 'on';
            }

            let element = (
                <li key={`buildingGroup_${buildingGroup.buildingGroupNo}`}>
                    <div className={depth1DivClassName} onClick={() => onClickBuildingGroup(buildingGroup)}>
                        <h2>{buildingGroup.displayText}</h2>
                    </div>
                    <ul className={depth1UlClassName}>
                        {getBuildingUI(buildingGroup.buildingDatas)}
                    </ul>
                </li>
            );
            ui.push(element);
        }

        // if (outdoorZones) {
        //     ui.push(
        //         <li key={`outdoorZone_${outdoorZones[0].zoneNo}`}>
        //             <div className={selectedZone?.zoneNo === outdoorZones[0].zoneNo ? 'depth1 outdoor' : 'depth1'} onClick={() => onClickBuildingGroup(outdoorZones[0])}>
        //                 <h2>{outdoorZones[0].displayText}</h2>
        //             </div>
        //         </li>
        //     )
        // }

        return ui;
    }

    const getBuildingUI = (buildings) => {
        let ui = [];

        if (!buildings) return ui;

        for (const building of buildings) {
            let depth2DivClassName = 'depth2';
            let depth2UlClassName = '';

            if (building.buildingNo === selecteBuilding?.buildingNo) {
                depth2DivClassName += ' on';
                depth2UlClassName = 'on';
            }

            let element = (
                <li key={`building_${building.buildingNo}`}>
                    <div className={depth2DivClassName} onClick={() => onClickBuilding(building)}>
                        <h2>{building.displayText}</h2>
                    </div>
                    <ul className={depth2UlClassName}>
                        {getZoneUI(building.zoneDatas)}
                    </ul>
                </li>
            );
            ui.push(element);
        }

        return ui;
    }

    const getZoneUI = (zones) => {
        let ui = [];

        if (!zones) return ui;

        for (const zone of zones) {
            let depth3DivClassName = 'depth3';

            if (zone.zoneNo === selectedZone?.zoneNo) {
                depth3DivClassName += ' on';
            }

            let element = (
                <li key={`zone_${zone.zoneNo}`}>
                    <div className={depth3DivClassName} onClick={() => onClickZone(zone)}>
                        <h2>{zone.displayText}</h2>
                    </div>
                </li>
            );
            ui.push(element);
        }

        return ui;
    }

    const getSensorTypeUI = () => {
        let ui = [];

        if (sensorTypes) {
            for (const sensorType of sensorTypes) {
                if (sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV) continue;

                ui.push(
                    <li key={`sensorType_${sensorType.sensorTypeCode}`}>
                        <div 
                            className={selectedSensorType?.sensorTypeCode === sensorType.sensorTypeCode ? 'sensorTxt on' : 'sensorTxt'}
                            onClick={() => onChangeSensorType(sensorType)}
                        >
                            {sensorType.sensorTypeName}
                        </div>
                    </li>
                );
            }
        }

        return ui;
    }

    const getDisasterCategoryUI = () => {
        let ui = [];

        if (disasterCategories) {
            for (const disasterCategory of disasterCategories) {
                let depth1DivClassName = 'depth1';
                let depth1UlClassName = '';

                if (disasterCategory.disasterCategory.lclas_sn === selectedDisasterCategoryNo) {
                    depth1DivClassName += ' on';
                    depth1UlClassName = 'on';
                }
    
                let element = (
                    <li key={`disasterCategory_${disasterCategory.disasterCategory.lclas_sn}`}>
                        <div className={depth1DivClassName} onClick={() => onClickDisasterCategory(disasterCategory)}>
                            <h2>{disasterCategory?.disasterCategory.lclas_name}</h2>
                        </div>
                        <ul className={depth1UlClassName}>
                            {getSubDisasterCategoryUI(disasterCategory)}
                        </ul>
                    </li>
                );
                ui.push(element);
            }
        }

        return ui;
    }

    const getSubDisasterCategoryUI = (disasterCategory) => {
        let subDisasterCategoryUI = [];

        const subDisasterCategories = disasterCategory.subDisasterCategories;

        for (const subDisasterCategory of subDisasterCategories) {
            let depth2DivClassName = 'depth2';
            let depth2UlClassName = '';

            if (subDisasterCategory.subDisasterCategory.mclas_sn === selectedSubDisasterCategoryNo) {
                depth2DivClassName += ' on';
                depth2UlClassName = 'on';
            }

            let subDisasterCategoryElement = (
                <li key={`subDisasterCategory_${subDisasterCategory.subDisasterCategory.mclas_sn}`}>
                    <div className={depth2DivClassName} onClick={() => onClickSubDisasterCategory(subDisasterCategory)}>
                        <h2>{subDisasterCategory?.subDisasterCategory.mclas_name}</h2>
                    </div>
                    <ul className={depth2UlClassName}>
                        {getDisasterDataUI(subDisasterCategory, disasterCategory)}
                    </ul>
                </li>
            );
            subDisasterCategoryUI.push(subDisasterCategoryElement);
        }
        
        return subDisasterCategoryUI;
    }

    const getDisasterDataUI = (subDisasterCategory, disasterCategory) => {
        let disasterDataUI = [];

        const disasterData = subDisasterCategory.disasterDatas;
        
        let linkedCount = linkedSOPs.length;
        
        for (const data of disasterData) {
            let depth3DivClassName = 'depth3';
            for (let l = 0; l < linkedCount; l++) {
                const linkedSOP = linkedSOPs[l];

                if (
                    linkedSOP.lclas_sn === disasterCategory.disasterCategory.lclas_sn &&
                    linkedSOP.mclas_sn === subDisasterCategory.subDisasterCategory.mclas_sn &&
                    linkedSOP.sclas_name === data.disasterName &&
                    linkedSOP.sensorTypeName === selectedSensorType?.sensorTypeName &&
                    isPositionMatched(linkedSOP)
                ) {
                    depth3DivClassName += ' selected';
                }
            }

            let disasterDataElement = (
                <li key={`disaster_${data.disasterName}`}>
                    <div className={depth3DivClassName} onClick={() => onClickDisasterData(disasterCategory, subDisasterCategory, data)}>
                        <h2>{data?.disasterName}</h2>
                    </div>
                </li>
            );
            
            disasterDataUI.push(disasterDataElement);
        }
        
        return disasterDataUI;
    }

    const isPositionMatched = (linkedSOP) => {

        const selectedGroup = selecteBuildingGroup?.buildingGroupNo ?? null;
        const selectedBuilding = selecteBuilding?.buildingNo ?? null;
        const selectedZoneNo = selectedZone?.zoneNo ?? null;

        const hasGroup = linkedSOP.buld_group_sn !== null;
        const hasBuilding = linkedSOP.buld_sn !== null;
        const hasZone = linkedSOP.zone_sn !== null;

        if (!hasGroup && !hasBuilding && !hasZone) {
            return selectedGroup === null && selectedBuilding === null && selectedZoneNo === null;
        }

        if (hasGroup && linkedSOP.buld_group_sn !== selectedGroup) {
            return false;
        }

        if (hasBuilding && linkedSOP.buld_sn !== selectedBuilding) {
            return false;
        }

        if (hasZone && linkedSOP.zone_sn !== selectedZoneNo) {
            return false;
        }

        return true;
    };

    const isSameLocation = (linkedSOP) => {
        const hasNoLocation =
            linkedSOP.buld_group_sn == null &&
            linkedSOP.buld_sn == null &&
            linkedSOP.zone_sn == null;

        const newHasNoLocation =
            selecteBuildingGroup == null &&
            selecteBuilding == null &&
            selectedZone == null;

        if (hasNoLocation) {
            return newHasNoLocation;  
        }

        if (linkedSOP.buld_group_sn != null &&
            linkedSOP.buld_group_sn !== selecteBuildingGroup?.buildingGroupNo) {
            return false;
        }

        if (linkedSOP.buld_sn != null &&
            linkedSOP.buld_sn !== selecteBuilding?.buildingNo) {
            return false;
        }

        if (linkedSOP.zone_sn != null &&
            linkedSOP.zone_sn !== selectedZone?.zoneNo) {
            return false;
        }

        return true;
    };

    const getLinkedSopDataUI = () => {
        let ui = [];

        if (!linkedSOPs) {
            return;
        }
        
        const getPositionName = (buildingGroupName, buildingName, zoneName) => {
            if (buildingGroupName && buildingName && zoneName) {
                return <span>{`${buildingGroupName} > ${buildingName} > ${zoneName}`}</span>
            }
            else if (buildingGroupName && buildingName && !zoneName) {
                return <span>{`${buildingGroupName} > ${buildingName}`}</span>
            }
            else if (buildingGroupName && !buildingName) {
                return <span>{`${buildingGroupName}`}</span>
            }
            else if (!buildingGroupName) {
                return <span />
            }
        }

        for (let i = 0; i < linkedSOPs.length; i++) {
            const linkedSOP = linkedSOPs[i];
            
            ui.push(
                <li key={`linkedSOP_${i}`}>
                    <div>{i + 1}</div> 
                    <div><span>{getPositionName(linkedSOP.buildingGroupName, linkedSOP.buildingName, linkedSOP.zoneName)}</span></div>
                    <div><span>{linkedSOP.sensorTypeName}</span></div>
                    <div><span>{linkedSOP.largeClassName}</span></div>
                    <div><span>{linkedSOP.middleClassName}</span></div> 
                    <div><span>{linkedSOP.sclas_name}</span></div>
                    <div>
                        <button className={'binIcon'} onClick={() => deleteLinkedSOP(i)}>
                            <img src={binIcon} alt='삭제 아이콘'/>
                        </button>
                    </div>
                </li>
            );
        }

        return ui;
    }

    const onClickReset = () => {
        if (linkedSOPs.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['연결된 SOP가 없습니다.'], null, null);
            return;
        }
        
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['초기화하시겠습니까?', '초기화된 데이터는 되돌릴 수 없습니다'], ['취소', '초기화하기'], resetLinkedSOPs);
    }

    const resetLinkedSOPs = (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
        }
        else if (index === 1) {
            props.onCloseConfirmDialog();
            setLinkedSOPs([]);
            onChangeNeedToSave();
            
            setSelectedSensorType(null);
            setSelectedZone(null);
            setSelectedDisasterCategoryNo(null);
            setSelectedSubDisasterCategoryNo(null);
            
            props.handleToast('초기화되었습니다');
        }
    }

    const onClickSubmit = async () => {
        if (!bNeedToSave.current) {
            props.handleToast('변경된 항목이 없습니다');
            return;
        }

        const userInfo = ProjectResource.getUserInfo();
        const siteNo = userInfo.site_sn;

        const [success, message] = await SopController.requestSaveLinkedSops(linkedSOPs, siteNo);
        
        if (!success) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["저장에 실패하였습니다. [Error Message] : " + message], null, null);
        }
        else {
            props.handleToast('설정이 적용되었습니다');
            onClosePopup();
        }
    }

    const onClosePopup = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
    }

    const onClickSortLinkedSopData = (sortType) => {
        let sortOrders = { ...sortOrder };

        let newSortOrder = null;
    
        if (sortType === SettingsResource.sortType.sensorTypeName) {
            newSortOrder = sortOrder.sensorTypeName === 'asc' ? 'desc' : 'asc';
            sortOrders.sensorTypeName = newSortOrder;
        }
        else if (sortType === SettingsResource.sortType.zoneName) {
            newSortOrder = sortOrder.zoneName === 'asc' ? 'desc' : 'asc';
            sortOrders.zoneName = newSortOrder;
        }
        else if (sortType === SettingsResource.sortType.disasterCategoryName) {
            newSortOrder = sortOrder.disasterCategoryName === 'asc' ? 'desc' : 'asc';
            sortOrders.disasterCategoryName = newSortOrder;
        }
        else if (sortType === SettingsResource.sortType.subDisasterCategoryName) {
            newSortOrder = sortOrder.subDisasterCategoryName === 'asc' ? 'desc' : 'asc';
            sortOrders.subDisasterCategoryName = newSortOrder;
        }
    
        const sortedLinkedSopData = getSortLinkedSopData(linkedSOPs, sortType, newSortOrder);
        setLinkedSOPs(sortedLinkedSopData);
        setSortOrder(sortOrders);
    };

    const getSortLinkedSopData = (curLinkedSOPs, sortType, sortOrder) => {
        const sorted = [...curLinkedSOPs];

        const getValue = (val) => val ?? '';  // 데이터가 null or undefined이면 ''로 변환
    
        switch (sortType) {
            case SettingsResource.sortType.sensorTypeName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.sensorTypeName).localeCompare(getValue(a.sensorTypeName))
                        : getValue(a.sensorTypeName).localeCompare(getValue(b.sensorTypeName))
                );
                break;
            case SettingsResource.sortType.zoneName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.buildingGroupName).localeCompare(getValue(a.buildingGroupName))
                        : getValue(a.buildingGroupName).localeCompare(getValue(b.buildingGroupName))
                );
                break;
            case SettingsResource.sortType.disasterCategoryName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.largeClassName).localeCompare(getValue(a.largeClassName))
                        : getValue(a.largeClassName).localeCompare(getValue(b.largeClassName))
                );
                break;
            case SettingsResource.sortType.subDisasterCategoryName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.middleClassName).localeCompare(getValue(a.middleClassName))
                        : getValue(a.middleClassName).localeCompare(getValue(b.middleClassName))
                );
                break;
        }
    
        return sorted;
    };

    return (
        <ModalBackground>
        <SopLinkComponent>
            <div className='listWrap'>
                <h5>SOP 자동 실행 설정</h5>
                <IconButton
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer size={"xxs"} />}
                    onClick={() => props.handlePopup(false)}
                >
                    닫기
                </IconButton>
            </div>

            <div className='stgList'>
                <div className='sopTreeArea'>
                    <div className='sopTreeBox sopTypeBox'>
                        <span className='sopDisableText sopActiveText'>
                            <span>위치 : {locationText || "-"}</span>
                        </span>
                        <div className='sopLTree sopScroll'>
                            <ul className='sopTree'>
                                {getBuildingGroupUI()}
                            </ul>
                        </div>
                    </div>

                    <div className='sopTreeBox sopLocationBox'>
                        <span className='sopDisableText sopActiveText'>
                            <span>이벤트 유형 : {selectedSensorType?.sensorTypeName}</span>
                        </span>
                        <div className='sopLTree sopScroll'>
                            <ul className='sopTree'>
                                {getSensorTypeUI()}
                            </ul>
                        </div>
                    </div>

                    <div className='sopTreeBox sopListBox'>
                        <span className='sopDisableText sopActiveText'>
                            <span>SOP 명 : (상황분야 &gt; 상황종류 &gt; SOP 명)</span>
                        </span>
                        <div className='sopLTree sopScroll'>
                            <ul className={'sopTree'}>
                                {getDisasterCategoryUI()}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='sopListArea'>
                    <ul className='sopList'>
                        <li className='head'>
                            <div>NO</div>
                            <div>
                                <div className='sort'>
                                    <span>위치</span>
                                    <button className={sortOrder.zoneName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.zoneName)} />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>이벤트 유형</span>
                                    <button className={sortOrder.sensorTypeName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.sensorTypeName)} />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>상황분야</span>
                                    <button className={sortOrder.disasterCategoryName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.disasterCategoryName)} />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>상황종류</span>
                                    <button className={sortOrder.subDisasterCategoryName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.subDisasterCategoryName)} />
                                </div>
                            </div>
                            <div>SOP 명</div>
                            <div>삭제</div>
                        </li>
                        <li className='body'>
                            {linkedSOPs.length === 0 ?
                                <EmptyContent
                                    layout="simple"
                                    title="설정된 정보가 없습니다"
                                />
                                :
                                <ul>
                                    {getLinkedSopDataUI()}
                                </ul>
                            }
                        </li>
                    </ul>
                </div>
            </div>
            <div className='btnWrap sopLink'>
                <Button
                    className="cancle"
                    variant="outline"
                    size="xs"
                    disabled={linkedSOPs.length === 0}
                    onClick={() => onClickReset()}
                >
                    초기화
                </Button>
                <Button
                    variant="fill"
                    size="xs"
                    disabled={!isValid}
                    onClick={() => onClickSubmit()}
                >
                    저장하기
                </Button>
            </div>
        </SopLinkComponent>
        </ModalBackground>
    );
}

export default withRouter(SopLink);