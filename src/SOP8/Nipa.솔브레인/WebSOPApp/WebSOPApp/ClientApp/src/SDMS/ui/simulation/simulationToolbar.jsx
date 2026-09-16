import React from 'react';
import { SimulationToolbarComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SdmsResource from '../../resource/id';

function SimulationToolbar(props) {

    const onClickClose = () => {
        props.resetSimulation();
        props.setSelectedSimulationInfo({
            buildingGroup: "",
            buildingGroupName: "",
            materialName: "",
            area: "",
            windDirection: null,
            windDirectionName: "",
            windSpeed: null,
        });
        props.handleControlMode(SdmsResource.controlMode.integrated);
    }

    return (
        <SimulationToolbarComponent>
            <div className='titleWrap'>
                <h2>누출 확산 시뮬레이션</h2>
                <div>
                    <IconButton
                        variant="unfill"
                        size="sm"
                        icon={<Icon.Logout size={"xxs"} />}
                        onClick={() => onClickClose()}
                    >
                        시뮬레이션 모드에서 나가기
                    </IconButton>
                </div>
            </div>
        </SimulationToolbarComponent>
    );
}

export default SimulationToolbar;