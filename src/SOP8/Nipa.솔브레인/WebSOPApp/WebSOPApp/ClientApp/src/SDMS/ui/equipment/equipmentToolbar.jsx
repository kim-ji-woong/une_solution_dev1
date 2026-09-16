import React from 'react';
import { EquipmentToolbarComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SdmsResource from '../../resource/id';

function EquipmentToolbar(props) {

    const onClickClose = () => {
        // 존 체크 필요
        const faModels = props.faModel;
        const selFcltyInfo = props.selFcltyInfo;

        let zoneNo = null;

        if (selFcltyInfo.zoneNo > 0) {
            zoneNo = selFcltyInfo.zoneNo;
        }
        else {
            if (faModels?.length > 0 && selFcltyInfo.fcltyNo !== null) {
                const faModel = faModels.find(x => x.gltf_fclty_zone_model_sn === selFcltyInfo.fcltyNo);
                if (faModel) {
                    for (const zone of faModel.zoneData) {
                        zoneNo = zone.zone_sn;
                        break;
                    }
                }
            }
        }

        // 층 이동
        if (zoneNo > 0) {
            setTimeout(() => showLazyMovingCamera(props, zoneNo), 200);
        }

        props.handleControlMode(SdmsResource.controlMode.integrated);
    }

    const showLazyMovingCamera = (props, zoneNo) => {
        props.moveToZone(zoneNo);
    }

    return (
        <EquipmentToolbarComponent>
            <div className='titleWrap'>
                <h2>설비모드</h2>
                <div>
                    <IconButton
                        variant="unfill"
                        size="sm"
                        icon={<Icon.Logout size={"xxs"} />}
                        onClick={() => onClickClose()}
                    >
                        설비모드에서 나가기
                    </IconButton>
                </div>
            </div>
        </EquipmentToolbarComponent>
    );
}

export default EquipmentToolbar;