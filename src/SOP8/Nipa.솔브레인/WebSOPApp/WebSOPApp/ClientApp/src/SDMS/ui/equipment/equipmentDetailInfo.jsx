import React, { useState, useRef, useEffect } from 'react';
import { EquipmentDetailInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from '../popups/popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import { FacilityController } from '../../services/facilityController';

function EquipmentDetailInfo(props) {
    const fcltyNameRef = useRef("-");
    const [mesures, setMesures] = useState([]);

    const getFcltyInfos = async () => {
        const [result, message] = await FacilityController.requestFacilityMesures(props.selFcltyInfoRef?.presvNo);

        if (!result?.success) {
            console.log(message);
            return;
        }

        if (result.success && Array.isArray(result.mesures)) {
            fcltyNameRef.current = result.fclty_presv_name;
            setMesures(result.mesures); 
        }
    }

    useEffect(() => {
        getFcltyInfos();
    }, [props.selFcltyInfoRef?.presvNo]);

    const getNodataUI = () => {
        return (
            <div className='noData'>
                <Icon.QuestionCircleIcon size='xs' fill={"grayscale.g500"} />
                <p>정보가 존재하지 않아요</p>
            </div>
        );
    };

    const onClickClose = () => {
        props.setVisiblePopups(SdmsResource.ID.menu.equipmentDetailInfo, false);
    }

    const changeMode = () => {
        const fcltyInfos = props.fcltyInfos;
        const faModels = props.faModel;

        let faModeNo = null;
        let zoneDataNo = null;

        if (fcltyInfos?.length > 0) {
            const fcltyInfo = fcltyInfos.find(x => x.fclty_presv_sn === props.selFcltyInfoRef?.presvNo);
            if (fcltyInfo && faModels.length > 0) {

                const faModelDatas = faModels.filter(x => x.fclty_type_code === fcltyInfo.fclty_ty_code);

                if (faModelDatas?.length > 0) {

                    for (const faModel of faModelDatas) {

                        for (const zone of faModel.zoneData) {

                            if (zone.zone_sn === fcltyInfo.zone_sn) {
                                faModeNo = faModel.gltf_fclty_zone_model_sn;
                                zoneDataNo = fcltyInfo.zone_sn;
                                break;
                            }
                        }

                        if (faModeNo !== null)
                            break;
                    }
                }
            }
        }

        if (faModeNo !== null && zoneDataNo !== null) {
            let showPopups = props.showPopups;
            showPopups[SdmsResource.ID.menu.equipmentDetailInfo] = false;

            props.handleControlMode(
                SdmsResource.controlMode.equipment,
                { fcltyNo: faModeNo, zoneNo: zoneDataNo }
            );
        }
    };

    return (
        <EquipmentDetailInfoComponent id={props.popupType} className='UI_Section equipmentDetailInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={256}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.equipmentDetailInfo}
                    </h5>
                    <div>
                        <p>{fcltyNameRef.current}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={onClickClose}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>

                <div className='content'>
                    <ul>
                        {
                            mesures.length > 0 ? 
                                mesures.map((item) => (
                                <li key={item.mesure_id}>
                                    <span>{item.tagName}</span>
                                    <span>
                                        {item.mesure_value} {item.mesure_uom}
                                    </span>
                                </li>
                            )) :
                            getNodataUI()
                        }
                    </ul>
                    {
                        (props.controlMode !== SdmsResource.controlMode.equipment) &&
                        <div className="btnWrap">
                            <button onClick={changeMode}>
                                설비모드 바로가기
                                <Icon.Arrow size={12} direction="right" />
                            </button>
                        </div>
                    }
                </div>
            </PopupDraggable>
        </EquipmentDetailInfoComponent>
    );
}

export default EquipmentDetailInfo;