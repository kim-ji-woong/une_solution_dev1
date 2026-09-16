import React from 'react';
import { DetailInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

function DetailInfo(props) {

    const getNodataUI = () => {
        return (
            <div className='noData'>
                <Icon.QuestionCircleIcon size='xs' fill={"grayscale.g500"} />
                <p>정보가 존재하지 않아요</p>
            </div>
        );
    };

    const getFlags = () => {
        const { buildingGroup, building, zone, facility } = props.selected3DInfo ?? {};
        return {
            hasBG: !!buildingGroup,
            hasB: !!building,
            hasF: !!facility,
            buildingGroup,
            building,
            zone,
            facility
        };
    };

    const getTitle = () => {
        const { hasBG, hasB, hasF } = getFlags();

        switch (true) {
            case hasBG && !hasB && !hasF:
                return '건물그룹 정보';
            case !hasBG && hasB && !hasF:
                return '건물정보';
            case !hasBG && !hasB && hasF:
                return '설비정보';
            default:
                return '정보';
        }
    };

    const getPositionName = () => {
        const { hasBG, hasB, hasF, buildingGroup, zone, facility } = getFlags();

        switch (true) {
            case hasBG && !hasB && !hasF:
                return buildingGroup?.buildingGroupName ?? '';
            case !hasBG && hasB && !hasF:
                return zone?.displayText ?? '';
            case !hasBG && !hasB && hasF:
                return facility?.facilityName ?? '';
            default:
                return '';
        }
    };

    const getDetailInfo = () => {
        const { hasBG, hasB, hasF, buildingGroup, building, facility } = getFlags();

        let datas = [];
        switch (true) {
            case hasBG && !hasB && !hasF:
                datas = buildingGroup?.buildingGroupDatas ?? [];
                break;
            case !hasBG && hasB && !hasF:
                datas = building?.buildingDatas ?? [];
                break;
            case !hasBG && !hasB && hasF:
                datas = facility?.facilityDatas ?? [];
                break;
            default:
                datas = [];
        }

        if (!Array.isArray(datas) || datas.length === 0) {
            return getNodataUI();
        }

        return (
            <ul>
                {datas.map((data, idx) => (
                    <li key={`${data?.fclty_sn ?? data?.bldg_sn ?? 'row'}-${data?.ordr_indx ?? idx}`}>
                        <span>{String(data?.name ?? '')}</span>
                        <span>{String(data?.value ?? '')}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <DetailInfoComponent id={props.popupType} className='UI_Section detailInfo' $resize={true}>
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
                        {getTitle()}
                    </h5>
                    <div>
                        <p>{getPositionName()}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.detailInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className={'content'}>
                    {getDetailInfo()}
                </div>
            </PopupDraggable>
        </DetailInfoComponent>
    );
}

export default DetailInfo;