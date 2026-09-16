import React, { useState } from 'react';
import { ManualReportComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import Button from '../../../Common/components/button';
import Clock from '../../../Common/ui/clock';
import ProjectResource from '../../../Root/resource/id';
import { SDMSController } from '../../services/sdmsController';
import TextareaBox from '../../../Common/components/textareaBox';
import DropBox from '../../../Common/components/dropBox';

function ManualReport(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [selectedFacilityType, setSelectedFacilityType] = useState('');
    const [selectedFacilityOption, setSelectedFacilityOption] = useState('');
    const [selectedSensorSubType, setSelectedSensorSubType] = useState(null);
    const [selectedAlarmDepth, setSelectedAlarmDepth] = useState(null);
    const [selectedZoneNo, setSelectedZoneNo] = useState('');
    const [memo, setMemo] = useState('');

    const handleFacilityTypeChange = (value) => {
        setSelectedFacilityOption(value);

        if (value === SdmsResource.facilityType.FIRE) {
            setSelectedFacilityType(value);
            setSelectedSensorSubType(null);
            setSelectedAlarmDepth(3);
        }
        else if (value === 3) {
            setSelectedFacilityType(SdmsResource.facilityType.DOOR);
            setSelectedSensorSubType(3);
            setSelectedAlarmDepth(4);
        }
        else if (value === 4) {
            setSelectedFacilityType(SdmsResource.facilityType.DOOR);
            setSelectedSensorSubType(4);
            setSelectedAlarmDepth(3);
        }
        else if (value === 5) {
            setSelectedFacilityType(SdmsResource.facilityType.DOOR);
            setSelectedSensorSubType(5);
            setSelectedAlarmDepth(2);
        }
        else if (value === SdmsResource.facilityType.Invasion) {
            setSelectedFacilityType(value);
            setSelectedSensorSubType(null);
            setSelectedAlarmDepth(3);
        }
    };

    const handleZoneGroupChange = (value) => {
        setSelectedZoneNo(value);
    };

    const getFacilityTypeOptions = () => {
        let options = [];

        options.push({ value: '', label: '선택하세요', disabled: true });

        for (const sensorType of props.sensorTypes) {
            if (sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV || sensorType.sensorTypeCode === SdmsResource.facilityType.EmergencyBell) continue;

            if (sensorType.sensorTypeCode === SdmsResource.facilityType.DOOR) {
                options.push({ value: 3, label: '출입문_강제 개방' });
                options.push({ value: 4, label: '출입문_장시간 개방' });
                // options.push({ value: 5, label: '출입문_다중 태그' });
            }
            else {
                options.push({ value: sensorType.sensorTypeCode, label: sensorType.sensorTypeName });
            }
        }

        return options;
    };

    const getSpatailUI = () => {
        let zoneUI = [{ value: '', label: '층', disabled: true }];

        if (!props.buildingGroupList) {
            return (
                <div className="buildingWrap">
                    <DropBox
                        id="zone"
                        value={selectedZoneNo}
                        onChange={handleZoneGroupChange}
                        options={zoneUI}
                        openId={openDropId}
                        setOpenId={setOpenDropId}
                    />
                </div>
            );
        }

        const buildingGroups = props.buildingGroupList[props.siteNo]?.buildingGroups || [];

        buildingGroups.forEach(group => {
            group.buildingDatas.forEach(building => {
                building.zoneDatas.forEach(zone => {
                    zoneUI.push({
                        value: String(zone.zoneNo),
                        label: zone.displayText,
                    });
                });
            });
        });

        return (
            <div className="buildingWrap">
                <DropBox
                    id="zone"
                    value={selectedZoneNo}
                    onChange={handleZoneGroupChange}
                    options={zoneUI}
                    openId={openDropId}
                    setOpenId={setOpenDropId}
                />
            </div>
        );
    };

    const getUserName = () => {
        const userInfo = ProjectResource.getUserInfo();
        return userInfo ? userInfo.user_name : '-';
    }

    const onClickReport = async () => {
        const userInfo = ProjectResource.getUserInfo();
        const sensorSubType = selectedSensorSubType ? Number(selectedSensorSubType) : null;
        const reportPerson = null;

        const [success, message] = await SDMSController.requestManualReport(
            Number(selectedFacilityType),
            Number(selectedZoneNo),
            userInfo.user_sn,
            sensorSubType,
            Number(selectedAlarmDepth),
            reportPerson,
            memo
        );

        if (success) {
            props.setVisiblePopups(SdmsResource.ID.menu.manualReport, false);
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    return (
        <ManualReportComponent id={props.popupType} className='UI_Section manualReport' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={400}
                popupMinHeight={604}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
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
                    <div>
                        <p>이벤트 유형 <span>*</span></p>
                        <DropBox
                            id="facility"
                            value={selectedFacilityOption}
                            onChange={handleFacilityTypeChange}
                            options={getFacilityTypeOptions()}
                            openId={openDropId}
                            setOpenId={setOpenDropId}
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
                    <Button
                        variant="fill"
                        size="md"
                        disabled={(!selectedFacilityType || !selectedZoneNo) ? true : false}
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