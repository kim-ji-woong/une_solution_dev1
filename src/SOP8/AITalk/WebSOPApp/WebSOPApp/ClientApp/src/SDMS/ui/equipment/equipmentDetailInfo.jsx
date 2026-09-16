import React from 'react';
import { EquipmentDetailInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from '../popups/popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

function EquipmentDetailInfo(props) {

    const onClickClose = () => {

        // 그래프 상세 열린지 확인
        const showPopups = props.showPopups;

        if (showPopups[SdmsResource.ID.menu.equipmentChartDetailInfo] === true)
            showPopups[SdmsResource.ID.menu.equipmentChartDetailInfo] = false;

        // 창 닫기
        props.setVisiblePopups(SdmsResource.ID.menu.equipmentDetailInfo, false);
    }

    return (
        <EquipmentDetailInfoComponent id={props.popupType} className='UI_Section equipmentDetailInfo' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={256}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.equipmentDetailInfo}
                    </h5>
                    <div>
                        <p>MB Polisher</p>
                        <IconButton
                            className='chartBtn'
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.ChartIcon />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.equipmentChartDetailInfo, true)}
                        >
                            그래프 보기
                        </IconButton>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => onClickClose()}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className={'content'}>
                    <ul>
                        <li>
                            <span>전단 저항률(EDI B)</span>
                            <span>18.12033259 MΩ·cm</span>
                        </li>
                        <li>
                            <span>전단 저항률(EDI C)</span>
                            <span>18.26080352 MΩ·cm</span>
                        </li>
                        <li>
                            <span>전단 저항률(EDI D)</span>
                            <span>18.25695863 MΩ·cm</span>
                        </li>
                        <li>
                            <span>후단 저항률</span>
                            <span>18.32075772 MΩ·cm</span>
                        </li>
                        <li>
                            <span>후단 유량</span>
                            <span>6.6875 m³/hr</span>
                        </li>
                    </ul>
                </div>
            </PopupDraggable>
        </EquipmentDetailInfoComponent>
    );
}

export default EquipmentDetailInfo;