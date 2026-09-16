import React from 'react';
import { EquipmentAnalysisComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from '../popups/popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import equipmentAnalysis from '../../images/equipmentAnalysis.png';

function EquipmentAnalysis(props) {
    const isDraggable = true;

    const changeMode = () => {
        const showPopups = props.showPopups;

        // 창 닫기
        showPopups[SdmsResource.ID.menu.equipmentAnalysis] = false;

        // 모드 전환
        props.handleControlMode(SdmsResource.controlMode.equipment, { fcltyNo: 1, zoneNo: 71 })
    }

    return (
        <EquipmentAnalysisComponent id={props.popupType} className='UI_Section equipmentAnalysis' $resize={false} $isDraggable={isDraggable}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={277}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.equipmentAnalysis}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.equipmentAnalysis, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className='content'>
                    <div className='infoWrap'>
                        <p>설비 명</p>
                        <p>MB Polisher (전처리 필터)</p>
                    </div>
                    <div className='imgWrap'>
                        <img src={equipmentAnalysis} alt="equipment analysis" />
                        <button onClick={() => changeMode()}>
                            설비모드  바로가기
                            <Icon.Arrow size={12} direction={"right"} />
                        </button>
                    </div>
                </div>
            </PopupDraggable>
        </EquipmentAnalysisComponent>
    );
}

export default EquipmentAnalysis;