import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { SopLinkComponent } from '../styled/settingsStyled';
import { ModalBackground } from '../../Root/styled/theme';
import SopController from '../../SOPManager/services/sopController';
import ProjectResource from '../../Root/resource/id';
import SettingsResource from '../resource/id';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';
import EmptyContent from '../../Common/components/emptyContent';


function SopLink(props) {
    const [isValid, setIsValid] = useState(false);

    const [linkedSOPs, setLinkedSOPs] = useState([]);
    const [displayZones, setDisplayZones] = useState([]);

    const [selectedSensorType, setSelectedSensorType] = useState(null);			// 센서유형
    const [selectedDisasterCategoryNo, setSelectedDisasterCategoryNo] = useState(null);
    const [selectedSubDisasterCategoryNo, setSelectedSubDisasterCategoryNo] = useState(null);

    const [selecteBuildingGroup, setSelecteBuildingGroup] = useState(null);    
    const [selecteBuilding, setSelecteBuilding] = useState(null);    
    const [selectedZone, setSelectedZone] = useState(null);    

    const [disasterCategories, setDisasterCategories] = useState(null);

    const [sortOrder, setSortOrder] = useState({
        sensorTypeName: 'desc',
        zoneName: 'desc',
        disasterCategoryName: 'desc',
        subDisasterCategoryName: 'desc'
    });

    const bNeedToSave = useRef(false);

    useEffect(() => {
        loadDisasterCategory();
        loadLinkedSOPs();
    }, []);

    useEffect(() => {
        // 알람을 받는 센서유형의 센서만 추리기 (위치 리스트에 들어갈 데이터)
        const displayZones = [];
    
        if (!props.sensorList) return;

        for (const sensor of props.sensorList) {
            const isAlarmSensor = sensor.sensorType.alarm_yn;
            const hasZones = sensor.zones.length > 0;
            const isMatchingType = selectedSensorType?.sensor_type_idx < 0 || selectedSensorType?.sensor_type_idx === sensor.sensorType.sensor_type_idx;
    
            if (isAlarmSensor && hasZones && isMatchingType) {
                for (const zone of sensor.zones) {
                    displayZones.push(
                        <li key={`zone_${zone.sensorLink.zone_sn}`}>
                            <div 
                                className={selectedZone?.sensorLink?.zone_sn === zone.sensorLink.zone_sn ? 'sensorTxt on' : 'sensorTxt'}
                                onClick={() => onChangeZone(zone)}
                            >
                                {zone.sensorLink.sensor_name}
                            </div>
                        </li>
                    );
                }
            }
        }
    
        setDisplayZones(displayZones);
    }, [props.sensorList, selectedSensorType, selectedZone]);

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

		for (const sensorType of props.sensorTypes) {
			if (sensorType.sensorSubTypes) {
				for (const sensorSubType of sensorType.sensorSubTypes) {
					sensorTypeDatas.push(
						{
							"sensorTypeCode": sensorType.co_code,
							"sensorSubTypeNo": sensorSubType,
							"sensorTypeName": sensorType.sensor_type_name
						}
					);
				}
			}
		}

		return sensorTypeDatas;
	}

    const onChangeSensorType = (sensorType) => {
        if (selectedSensorType?.sensor_type_idx === sensorType.sensor_type_idx) {
            setSelectedZone(null);
            setSelectedSensorType(null);
            return;
        }

        setSelectedZone(null);
        setSelectedSensorType(sensorType);
    }

    const onChangeZone = (zone) => {
        if (selectedZone?.sensorLink?.zone_sn === zone.sensorLink.zone_sn) {
            setSelectedZone(null);
            return;
        }

		setSelectedZone(zone);
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
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["센서유형을 선택해주세요."], null, null);
            return;
        }
        
        if (selectedZone === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["위치를 선택해주세요."], null, null);
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
        sopData.sensorTypeName = selectedSensorType.sensor_type_name;
        sopData.sensor_ty_code = selectedSensorType.co_code;
        sopData.zone_sn = selectedZone.sensorLink.zone_sn;
        sopData.lclas_sn = disasterCategory.disasterCategory.lclas_sn;
        sopData.mclas_sn = subDisasterCategory.subDisasterCategory.mclas_sn;
        sopData.sclas_name = disasterData.disasterName;
        sopData.site_sn = disasterCategory.disasterCategory.site_sn;
        sopData.largeClassName = disasterCategory.disasterCategory.lclas_name;
        sopData.middleClassName = subDisasterCategory.subDisasterCategory.mclas_name;

        // 정렬 기능을 위한 text data 추가
        sopData.zoneName = getZoneName(selectedZone.sensorLink.zone_sn);
        sopData.disasterCategoryName = getDisasterCategoryName(disasterCategory.disasterCategory.lclas_sn);
        sopData.subDisasterCategoryName = getSubDisasterCategoryName(disasterCategory.disasterCategory.lclas_sn, subDisasterCategory.subDisasterCategory.mclas_sn);

        // 알 수 없는 값들
        sopData.sensor_ty_optn_code = 1;
        sopData.sensor_sub_ty_no = null;
        sopData.buld_group_sn = null;
        sopData.buld_sn = null;
        sopData.descp = null;
        
        newLinkedSOPs.push(sopData);
        
        onChangeNeedToSave();
        setLinkedSOPs(newLinkedSOPs);
    }

    const getZoneName = (zoneNo) => {
        if (!props.sensorList) return '';
    
        for (const sensorItem of props.sensorList) {
            for (const zone of sensorItem.zones) {
                if (zone.sensorLink.zone_sn === zoneNo) {
                    const sensorName = zone.sensorLink.sensor_name;
                    return sensorName;
                }
            }
        }
    
        return '';
    };

    const getDisasterCategoryName = (lclas_sn) => {
        if (!props.disasterCategories) return '';
    
        const category = props.disasterCategories.find(
            (item) => item?.disasterCategory?.lclas_sn === lclas_sn
        );
    
        return category?.disasterCategory?.lclas_name || '';
    };

    const getSubDisasterCategoryName = (lclas_sn, mclas_sn) => {
        if (!props.disasterCategories) return '';
    
        const disasterCategory = props.disasterCategories.find(
            (item) => item?.disasterCategory?.lclas_sn === lclas_sn
        );
    
        const subDisasterCategory = disasterCategory?.subDisasterCategories?.find(
            (subItem) => subItem?.subDisasterCategory?.mclas_sn === mclas_sn
        );
    
        return subDisasterCategory?.subDisasterCategory?.mclas_name || '';
    };

    const deleteLinkedSOP = (index) => {
        setLinkedSOPs(prev => {
            const next = prev.filter((_, i) => i !== index);
            return next;
        });

        props.handleToast('삭제되었습니다');
        onChangeNeedToSave();
    };

    const getSensorTypeUI = () => {
        let ui = [];

        if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
				ui.push(
                    <li key={`sensorType_${sensorType.sensor_type_idx}`}>
                        <div 
                            className={selectedSensorType?.sensor_type_idx === sensorType.sensor_type_idx ? 'sensorTxt on' : 'sensorTxt'}
                            onClick={() => onChangeSensorType(sensorType)}
                        >
                            {sensorType.sensor_type_name}
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
            let isSelected = false;

            for (let l = 0; l < linkedCount; l++) {
                const linkedSOP = linkedSOPs[l];

                if (
                    linkedSOP.lclas_sn === disasterCategory.disasterCategory.lclas_sn &&
                    linkedSOP.mclas_sn === subDisasterCategory.subDisasterCategory.mclas_sn &&
                    linkedSOP.sclas_name === data.disasterName &&
                    linkedSOP.sensorTypeName === selectedSensorType?.sensorTypeName &&
                    linkedSOP.zone_sn !== selectedZone?.sensorLink?.zone_sn
                ) {
                    depth3DivClassName += ' selected';
                    isSelected = true;
                }
            }

            let disasterDataElement = (
                <li key={`disaster_${data.disasterName}`}>
                    <div className={depth3DivClassName} onClick={() => onClickDisasterData(disasterCategory, subDisasterCategory, data)}>
                        <h2>{data?.disasterName}</h2>
                        {isSelected && <Icon.Check size="xxxxs" fill="#fff" />}
                    </div>
                </li>
            );
            
            disasterDataUI.push(disasterDataElement);
        }
        
        return disasterDataUI;
    }

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

        for (let i = 0; i < linkedSOPs.length; i++) {
            const linkedSOP = linkedSOPs[i];
            
            ui.push(
                <li key={`linkedSOP_${i}`}>
                    <div>{i + 1}</div> 
                    <div><span>{linkedSOP.sensorTypeName}</span></div>
                    <div><span>{linkedSOP.zoneName}</span></div>
                    <div><span>{linkedSOP.largeClassName}</span></div>
                    <div><span>{linkedSOP.middleClassName}</span></div> 
                    <div><span>{linkedSOP.sclas_name}</span></div>
                    <div>
                        <button className={'binIcon'} onClick={() => deleteLinkedSOP(i)}>
                            <Icon.Trash size="xs" fill="grayscale.g300" />
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
                        ? getValue(b.zoneName).localeCompare(getValue(a.zoneName))
                        : getValue(a.zoneName).localeCompare(getValue(b.zoneName))
                );
                break;
            case SettingsResource.sortType.disasterCategoryName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.disasterCategoryName).localeCompare(getValue(a.disasterCategoryName))
                        : getValue(a.disasterCategoryName).localeCompare(getValue(b.disasterCategoryName))
                );
                break;
            case SettingsResource.sortType.subDisasterCategoryName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.subDisasterCategoryName).localeCompare(getValue(a.subDisasterCategoryName))
                        : getValue(a.subDisasterCategoryName).localeCompare(getValue(b.subDisasterCategoryName))
                );
                break;
        }
    
        return sorted;
    };

    return (
        <ModalBackground>
            <SopLinkComponent>
                <div className='listWrap'>
                    <h5>이벤트 발생 시 실행 SOP 설정</h5>
                    <IconButton
                        variant="unfill"
                        size="md"
                        icon={<Icon.Closer />}
                        onClick={() => props.handlePopup(false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div>
                    <div className='sopTreeArea'>
                        <div className='sensorType'>
                            <span className='head'>
                                센서 유형 <span>{selectedSensorType?.sensor_type_name}</span>
                            </span>
                            <div className='sopScroll'>
                                <ul className='sopTree'>
                                    {getSensorTypeUI()}
                                </ul>
                            </div>
                        </div>

                        <div className='sopTypeBox'>
                            <span className='head'>
                                위치 <span>{selectedZone?.sensorLink?.sensor_name}</span>
                            </span>
                            <div className='sopScroll'>
                                <ul className='sopTree'>
                                    {displayZones}
                                </ul>
                            </div>
                        </div>
                        
                        <div className='sopListBox'>
                            <span className='head'>
                                SOP 명 <span>(상황분야 &gt; 상황종류 &gt; SOP 이름)</span>
                            </span>
                            <div className='sopScroll'>
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
                                        <span>센서유형</span>
                                        <button className={sortOrder.sensorTypeName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.sensorTypeName)} />
                                    </div>
                                </div>
                                <div>
                                    <div className='sort'>
                                        <span>위치</span>
                                        <button className={sortOrder.zoneName === 'asc' ? 'az' : 'za'} onClick={() => onClickSortLinkedSopData(SettingsResource.sortType.zoneName)} />
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
                                <div>SOP 이름</div>
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

                <div className='btnWrap'>
                    <BoxButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => onClickReset()}
                    >
                        초기화
                    </BoxButton>
                    <BoxButton  
                        variant="fill"
                        size="sm"
                        disabled={!isValid}
                        onClick={() => onClickSubmit()}
                    >
                        저장하기
                    </BoxButton>
                </div>
            </SopLinkComponent>
        </ModalBackground>
    );
}

export default withRouter(SopLink);