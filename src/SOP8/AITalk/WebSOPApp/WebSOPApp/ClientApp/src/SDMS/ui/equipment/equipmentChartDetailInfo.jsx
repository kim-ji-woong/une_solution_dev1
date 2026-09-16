import React from 'react';
import { EquipmentChartDetailInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from '../popups/popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import equipmentChart_1 from '../../images/equipmentChart_1.png';
import equipmentChart_2 from '../../images/equipmentChart_2.png';

function EquipmentChartDetailInfo(props) {

    return (
        <EquipmentChartDetailInfoComponent id={props.popupType} className='UI_Section equipmentChartDetailInfo' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={452}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.equipmentChartDetailInfo}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.equipmentChartDetailInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className='content'>
                    <div>
                        <div className='infoWrap'>
                            <Icon.ChartIcon />
                            <p>초순수공정 예지보전 유량 그래프</p>
                        </div>
                        <div className='imgWrap'>
                            <img src={equipmentChart_1} alt="equipment chart" />
                        </div>
                    </div>
                    <div>
                        <div className='infoWrap'>
                            <Icon.ChartIcon />
                            <p>초순수공정 예지보전 저항률 그래프</p>
                        </div>
                        <div className='imgWrap'>
                            <img src={equipmentChart_2} alt="equipment chart" />
                        </div>
                    </div>
                </div>
            </PopupDraggable>
        </EquipmentChartDetailInfoComponent>
    );
}

export default EquipmentChartDetailInfo;