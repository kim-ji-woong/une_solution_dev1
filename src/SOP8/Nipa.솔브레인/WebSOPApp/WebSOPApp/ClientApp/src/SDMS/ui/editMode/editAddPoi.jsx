import React, { useEffect, useState } from 'react';
import { EditAddPoiComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from '../popups/popupDraggable';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SearchInputBox from '../../../Common/components/searchInputBox';
import { SDMSController } from '../../services/sdmsController';
import TabMenu from '../../../Common/components/tabMenu';

function EditAddPoi(props) {
    const [searchText, setSearchText] = useState("");
    const [menuType, setMenuType] = useState(SdmsResource.facilityType.CCTV);

    const onChangeMenuType = (menu) => {
        setMenuType(menu);
    };
    
    const handleSubmit = (value) => {
        console.log(value);
    };

    const tabs = [
        { key: SdmsResource.facilityType.CCTV, label: "CCTV" },
        { key: SdmsResource.facilityType.MOBILE_SCANNER, label: "이동식 스캐너" },
    ];

    const getCurrentSensors = () => {
        if (!props.sensorList) return [];

        const currentType = props.sensorList.find(
            (item) => item.sensorTypeCode === menuType
        );

        if (!currentType) return [];

        let list = currentType.sensors || [];

        if (searchText.trim()) {
            const keyword = searchText.trim().toLowerCase();
            list = list.filter((item) => {
                const name = (item.sensor?.sensor_name || "").toLowerCase();
                const subTypeName = (item.sensor?.subTypeName || "").toLowerCase();
                return (
                    name.includes(keyword) ||
                    subTypeName.includes(keyword)
                );
            });
        }

        return list;
    };

    const closePopup = () => {
        props.setEditMode(prev => ({
            ...prev,
            subMenu: SdmsResource.ID.poi_editSubMenu.none
        }));
    }

    const currentSensors = getCurrentSensors();

    const setTemporarySensor = (sensor, cctv, isActive) => {
        if (!isActive) {
            props.setTemporarySensor(sensor, cctv);
        }
    }

    return (
        <EditAddPoiComponent id={props.popupType} className='UI_Section editMode_addPoi' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={480}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={true}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.editMode_addPoi}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => closePopup()}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className={'content'}>
                    <TabMenu
                        tabs={tabs}
                        activeKey={menuType}
                        onChange={onChangeMenuType}
                        className='menuTypeWrap'
                    />
                    <div className='searchWrap'>
                        <SearchInputBox
                            value={searchText}
                            onChange={setSearchText}
                            placeholder={"검색하세요"}
                            onSubmit={handleSubmit}
                            onClear={() => setSearchText("")}
                            fullWidth={false}
                        />
                        <p>총 {currentSensors.length}건</p>
                    </div>
                    <ul className='listWrap'>
                        <li className='head'>
                            <p>센서 명</p>
                            <p>배치여부</p>
                        </li>
                    </ul>
                    <ul className='listWrap body'>
                        {
                            currentSensors.map((item) => {
                                const sensor = item.sensor;
                                const zone = item.sensorZoneData?.sensorZone;
                                const cctv = item.cctv;

                                // 배치여부 (x, y, z 중에 null이 있거나 zone_sn이 null일 경우 배치 X)
                                const isActive =
                                    sensor.x !== null &&
                                    sensor.y !== null &&
                                    sensor.z !== null &&
                                    sensor.zone_sn !== null &&
                                    !sensor.deleted;

                                return (
                                    <li 
                                        key={zone?.sensor_zone_sn || `${sensor.sensor_sn}_${sensor.subTypeNo}`} 
                                        className={props.temporarySensor?.sensor?.subTypeNo === sensor.subTypeNo && props.temporarySensor?.sensor?.sensor_sn === sensor.sensor_sn ? 'selected' : null}
                                        onClick={() => setTemporarySensor(sensor, cctv, isActive)}
                                    >
                                        <p>
                                            {sensor.sensor_name} {sensor.subTypeName && '(' + sensor.subTypeName + ')'}
                                        </p>
                                        <p>
                                            {isActive ? <Icon.PoiCheckIcon /> : <Icon.PoiXIcon />}
                                        </p>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </PopupDraggable>
        </EditAddPoiComponent>
    );
}

export default EditAddPoi;