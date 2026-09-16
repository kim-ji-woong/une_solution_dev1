import React, { useState } from 'react';
import { ManualReportComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import SelectBox from '../../../Common/components/selectBox';
import Button from '../../../Common/components/button';
import Clock from '../../../Common/ui/clock';
import ProjectResource from '../../../Root/resource/id';
import { getProjectTypeState } from '../../../Root/resource/projectType';
import { SDMSController } from '../../services/sdmsController';
import TextareaBox from '../../../Common/components/textareaBox';

const WATER_BUILDING_CODES = new Set(['T2-13', 'T8-1']);
const POWER_BUILDING_CODES = new Set(['T8-1']);
const WATER_T8_1_FLOOR_FILTER = new Set(['T8-1 1층']);

function ManualReport(props) {
    const [selectedFacilityType, setSelectedFacilityType] = useState('');
    const [selectedBuildingGroupNo, setSelectedBuildingGroupNo] = useState('');
    const [selectedBuildingNo, setSelectedBuildingNo] = useState('');
    const [selectedZoneNo, setSelectedZoneNo] = useState('');
    const [memo, setMemo] = useState('');

    const handleFacilityTypeChange = (value) => {
        setSelectedFacilityType(value);
    };
    
    const handleBuildingGroupChange = (value) => {
        setSelectedBuildingGroupNo(value);
        setSelectedBuildingNo(''); // ✅ 그룹 바뀌면 빌딩 초기화
        setSelectedZoneNo('');     // ✅ 존도 초기화
    };

    const handledBuildingChange = (value) => {
        setSelectedBuildingNo(value);
        setSelectedZoneNo(''); // ✅ 빌딩 바뀌면 존 초기화
    };

    const handleZoneGroupChange = (value) => {
        setSelectedZoneNo(value);
    };

    const handleMemoChange = (e) => {
        const value = e.target.value;

        if (value.length <= 500) {   // 500자 제한
            setMemo(value);
        }
    };

    const getFacilityTypeOptions = () => {
        const projectTypeState = getProjectTypeState();

        const allowedCodes = (() => {
            if (projectTypeState.isPower) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.PSM_SENSOR,
                    SdmsResource.facilityType.CCTV,
                ]);
            }
            if (projectTypeState.isWater) {
                return new Set([
                    SdmsResource.facilityType.FIRE,
                    SdmsResource.facilityType.CCTV,
                ]);
            }
            // NORMAL: 전체
            return new Set([
                SdmsResource.facilityType.FIRE,
                SdmsResource.facilityType.PSM_SENSOR,
                SdmsResource.facilityType.PM,
                SdmsResource.facilityType.MOBILE_SCANNER,
                SdmsResource.facilityType.SUMP,
                SdmsResource.facilityType.CCTV,
                SdmsResource.facilityType.ETC,
            ]);
        })();

        let options = [];
        options.push({ value: '', label: '선택하세요', disabled: true });

        for (const sensorType of props.sensorTypes) {
            if (allowedCodes.has(sensorType.sensorTypeCode)) {
                options.push({ value: sensorType.sensorTypeCode, label: sensorType.sensorTypeName });
            }
        }

        return options;
    };

    const getSpatailUI = () => {
        const projectTypeState = getProjectTypeState();

        const allowedBuildingCodeSet = (() => {
            if (projectTypeState.isWater) return WATER_BUILDING_CODES;
            if (projectTypeState.isPower) return POWER_BUILDING_CODES;
            return null; // NORMAL: 전체
        })();

        const isAllowedBuilding = (building) => {
            if (!allowedBuildingCodeSet) return true;
            const keys = [building?.buildingCode, building?.displayText, building?.name, building?.broadcastText]
                .filter(Boolean)
                .map(v => String(v).trim().toUpperCase());
            return keys.some(key => allowedBuildingCodeSet.has(key));
        };

        const isBuildingT8_1 = (building) => {
            const keys = [building?.buildingCode, building?.displayText, building?.name, building?.broadcastText]
                .filter(Boolean)
                .map(v => String(v).trim().toUpperCase());
            return keys.includes('T8-1');
        };

        const filterZonesForBuilding = (building) => {
            const zones = building?.zoneDatas ?? [];
            if (projectTypeState.isWater && isBuildingT8_1(building)) {
                return zones.filter(z => WATER_T8_1_FLOOR_FILTER.has(String(z.displayText ?? '').trim()));
            }
            return zones;
        };

        let buildingGroupUI = [{ value: '', label: '공장동', disabled: true }];
        let buildingUI = [{ value: '', label: '공장', disabled: true }];
        let zoneUI = [{ value: '', label: '층', disabled: true }];

        if (!props.buildingGroupList) {
            return (
                <div className="buildingWrap">
                    <SelectBox value={selectedBuildingGroupNo || ''} onChange={handleBuildingGroupChange} options={buildingGroupUI} />
                    <div>
                        <SelectBox value={selectedBuildingNo || ''} onChange={handledBuildingChange} options={buildingUI} />
                        <SelectBox value={selectedZoneNo || ''} onChange={handleZoneGroupChange} options={zoneUI} />
                    </div>
                </div>
            );
        }

        const buildingGroups = props.buildingGroupList[props.siteNo]?.buildingGroups || [];

        buildingGroups.forEach(group => {
            const allowedBuildings = (group.buildingDatas || []).filter(bd =>
                isAllowedBuilding(bd) && filterZonesForBuilding(bd).length > 0
            );

            if (allowedBuildings.length === 0) return;

            buildingGroupUI.push({
                value: String(group.buildingGroupNo),
                label: group.displayText,
            });

            if (String(selectedBuildingGroupNo) === String(group.buildingGroupNo)) {
                allowedBuildings.forEach(building => {
                    buildingUI.push({
                        value: String(building.buildingNo),
                        label: building.displayText,
                    });

                    if (String(selectedBuildingNo) === String(building.buildingNo)) {
                        filterZonesForBuilding(building).forEach(zone => {
                            zoneUI.push({
                                value: String(zone.zoneNo),
                                label: zone.displayText,
                            });
                        });
                    }
                });
            }
        });

        return (
            <div className="buildingWrap">
                <SelectBox
                    value={selectedBuildingGroupNo ? String(selectedBuildingGroupNo) : ''}
                    onChange={handleBuildingGroupChange}
                    options={buildingGroupUI}
                />
                <div>
                    <SelectBox
                        value={selectedBuildingNo ? String(selectedBuildingNo) : ''}
                        onChange={handledBuildingChange}
                        options={buildingUI}
                    />
                    <SelectBox
                        value={selectedZoneNo ? String(selectedZoneNo) : ''}
                        onChange={handleZoneGroupChange}
                        options={zoneUI}
                    />
                </div>
            </div>
        );
    };

    const getUserName = () => {
        const userInfo = ProjectResource.getUserInfo();
        return userInfo ? userInfo.user_name : '-';
    }

    const onClickReport = async () => {
        const userInfo = ProjectResource.getUserInfo();
        const sensorSubType = null;
        const alarmDepth = null;
        const reportPerson = null;

        const [success, message] = await SDMSController.requestManualReport(
            Number(selectedFacilityType),
            Number(selectedZoneNo),
            userInfo.user_sn,
            sensorSubType,
            alarmDepth,
            reportPerson,
            memo
        );

        if (success) {
            props.setVisiblePopups(SdmsResource.ID.menu.manualReport, false);
        }
        else {
            console.log(message);
        }
    }

    return (
        <ManualReportComponent id={props.popupType} className='UI_Section manualReport' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={400}
                popupMinHeight={400}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.manualReport}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.manualReport, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className={'content'}>
                    <div className='itemWrap scrollbar'>
                        <div>
                            <p>이벤트 유형 <span>*</span></p>
                            <SelectBox
                                value={selectedFacilityType}
                                onChange={handleFacilityTypeChange}
                                options={getFacilityTypeOptions()}
                            />
                        </div>
                        <div>
                            <p>발생위치 <span>*</span></p>
                            {getSpatailUI()}
                        </div>
                        <div>
                            <p>메모</p>
                            <TextareaBox
                                placeholder="내용을 작성하세요"
                                value={memo}
                                onChange={setMemo}
                                maxLength={500}
                            />
                        </div>
                        <div>
                            <p>신고자</p>
                            <p>{getUserName()}</p>
                        </div>
                        <div>
                            <p>신고일시</p>
                            {/* <p>2025.07.01 12:00:16</p> */}
                            <Clock />
                        </div>
                    </div>
                    <Button
                        variant="fill"
                        size="md"
                        disabled={(!selectedFacilityType || !selectedBuildingGroupNo || !selectedBuildingNo || !selectedZoneNo) ? true : false}
                        onClick={() => onClickReport()}
                    >
                        신고하기
                    </Button>
                </div>
            </PopupDraggable>
        </ManualReportComponent>
    );
}

export default ManualReport;