import React, { useState, useMemo, useEffect } from 'react';
import { EditCCTVMappingComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from '../popups/popupDraggable';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SearchInputBox from '../../../Common/components/searchInputBox';
import Button from '../../../Common/components/button';
import { CctvSlaveManager } from '../3D/utility/cctvMapping/cctvSlaveManager';

function EditCCTVMapping(props) {
    const {
        popupType,
        popupState,
        setActiveDragPopup,
        setPopupState,
        setEditMode,
        editCCTVList,
        handleChangeCCTVList,
        setEditCCTVList,
        showEditCCTVInfo,
        setShowEditCCTVInfo,
        cctvMappingManager
    } = props;

    const [searchText, setSearchText] = useState("");
    //const [localCctvList, setLocalCctvList] = useState(editCCTVList?.cctvList ?? []);

    const getCurrentCctvList = () => {
        const sensorNo = cctvMappingManager.getCurrentSensorNo();
        const cctvList = cctvMappingManager.getMappingCctvs(sensorNo);
        return cctvList;
    }

    const currentCctvList = getCurrentCctvList();

    // 부모에서 editCCTVList가 바뀌면 로컬 상태도 동기화
    useEffect(() => {
        //setLocalCctvList(currentCctvList);
    }, );

    /*useEffect(() => {
        if (Array.isArray(editCCTVList?.cctvList)) {
            setLocalCctvList(editCCTVList.cctvList);
        } else {
            setLocalCctvList([]);
        }
    }, [editCCTVList?.cctvList]); */

    const handleSubmit = (value) => {
        setSearchText(value ?? "");
    };

    const closePopup = () => {
        setEditMode(prev => ({
            ...prev,
            subMenu: SdmsResource.ID.poi_editSubMenu.none
        }));
    };

    // 검색 필터링
    const filteredList = useMemo(() => {
        if (!searchText.trim()) return currentCctvList;

        const keyword = searchText.toLowerCase();

        return currentCctvList.filter(item => {
            const target = `${item.cameraName ?? ''} `;
            return target.toLowerCase().includes(keyword);
        });
    }, [currentCctvList, searchText]);

    // CCTV 삭제
    const handleRemoveCCTV = (target) => {
        const sensorNo = cctvMappingManager.getCurrentSensorNo();
        const info = cctvMappingManager.getSensorBasicInfo(sensorNo);

        if (info) {
            const len = currentCctvList.length;

            for (let i = 0; i < len; i++) {
                const cctv = currentCctvList[i];

                if (cctv.sensor_sn === target.sensor_sn) {
                    currentCctvList.splice(i, 1);
                    break;
                }
            }

            let type = null;
            let zoneNo = null;

            if (info.equipZoneNo === 0 || info.equipZoneNo) {
                type = CctvSlaveManager.EquipZoneType;
                zoneNo = info.equipZoneNo;
            }
            else if (info.sensorZoneNo === 0 || info.sensorZoneNo) {
                type = CctvSlaveManager.SensorZoneType;
                zoneNo = info.sensorZoneNo;
            }

            if (type) {
                setEditCCTVList({ type, zoneNo, cctvList: currentCctvList }, sensorNo);
            }
        }
        /*setLocalCctvList((prev) => {
            const next = prev.filter(
                (item) =>
                    (item.sensor_sn ?? item.cctv_no) !== (target.sensor_sn ?? target.cctv_no)
            );

            if (typeof handleChangeCCTVList === "function") {
                handleChangeCCTVList(editCCTVList.type, editCCTVList.zoneNo, next);
            }

            return next;
        });*/
    };

    // (예시) CCTV 추가 - 자식에서 직접 추가할 때 사용할 수 있는 함수
    // 실제로는 다른 UI(검색/선택 팝업 등)에서 선택한 CCTV 객체를 넘겨서 호출하면 됩니다.
    /*const handleAddCCTV = (newCctv) => {
        setLocalCctvList((prev) => {
            const exists = prev.some(
                (item) => (item.sensor_sn ?? item.cctv_no) === (newCctv.sensor_sn ?? newCctv.cctv_no)
            );
            if (exists) return prev;

            const next = [...prev, newCctv];

            if (typeof handleChangeCCTVList === "function") {
                handleChangeCCTVList(editCCTVList.type, editCCTVList.zoneNo, next);
            }

            return next;
        });
    };*/

    return (
        <EditCCTVMappingComponent id={popupType} className='UI_Section editMode_cctvMappindg' $resize={true}>
            <PopupDraggable
                id={popupType}
                popupMinWidth={340}
                popupMinHeight={480}
                topSize={40}
                popupState={popupState}
                setActiveDragPopup={setActiveDragPopup}
                setPopupState={setPopupState}
                usePopupResize={true}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.editMode_cctvMapping}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={closePopup}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className={'content'}>
                    <div className='searchWrap'>
                        <SearchInputBox
                            value={searchText}
                            onChange={setSearchText}
                            placeholder={"검색하세요"}
                            onSubmit={handleSubmit}
                            onClear={() => setSearchText("")}
                            fullWidth={false}
                        />
                        <p>총 {filteredList.length}건</p>
                    </div>

                    {filteredList.length > 0 && (
                        <ul className='listWrap'>
                            {filteredList.map((item) => (
                                <li key={item.sensor_sn ?? item.cctv_no}>
                                    <p>{item.cctv_no ? item.cctv_no + '.' : ''} {item.cameraName ?? ''}</p>
                                    <IconButton
                                        variant="unfill_white"
                                        size="xxxs"
                                        icon={<Icon.Minus size={"xxxxxs"} />}
                                        onClick={() => handleRemoveCCTV(item)}
                                    >
                                        삭제
                                    </IconButton>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className='btnWrap'>
                        <Button
                            variant="fill"
                            size="md"
                            disabled={filteredList.length === 0}
                            isActive={showEditCCTVInfo}
                            onClick={() => setShowEditCCTVInfo(true)}
                        >
                            영상정보 보기
                        </Button>
                    </div>
                </div>
            </PopupDraggable>
        </EditCCTVMappingComponent>
    );
}

export default EditCCTVMapping;