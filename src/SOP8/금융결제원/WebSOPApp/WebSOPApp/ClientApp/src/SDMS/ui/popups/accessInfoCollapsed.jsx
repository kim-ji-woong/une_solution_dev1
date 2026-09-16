import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { AccessInfoSmallComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import { SDMSController } from '../../services/sdmsController';

function AccessInfoCollapsed(props) {
    const lastComingPerson = useSelector(state => state.lastComingPerson);   // 마지막 출입자

    useEffect(() => {
        SDMSController.stopWatchComingHistoryTimer();
        SDMSController.stopWatchAreaComingHistoryTimer();
        SDMSController.stopWatchLastComingPersonTimer();

        SDMSController.StartWatchLastComingPersonTimer();

        return () => {
            SDMSController.stopWatchLastComingPersonTimer();
        };
    }, []);

    const toggleCollapse = () => {
        props.setIsCollapsedAccessInfo(prev => !prev);
    };

    return (
        <AccessInfoSmallComponent id={props.popupType} className='UI_Section accessInfo' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={820}
                popupMinHeight={116}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
                useInitialCenter={props.popupType === SdmsResource.popupLayer.accessInfoCollapsed}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.accessInfo}
                    </h5>
                    <div>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.ExpandIcon size="xxs" />}
                            onClick={toggleCollapse}
                        >
                            확대
                        </IconButton>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.accessInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className='content'>
                    <div>
                        <p>{lastComingPerson?.personName ?? '-'}</p>
                        <div className='door'>
                            <p>{lastComingPerson?.doorName ?? '-'}</p>
                            <p className={lastComingPerson?.isEnterance ? 'important' : null}>
                                {lastComingPerson?.isImportant ? '중요' : null}
                            </p>
                        </div>
                        
                        <p>{SdmsResource.getDateTime(lastComingPerson?.time)}</p>
                        <p>{lastComingPerson?.isVisitor ? '방문객' : '임직원'}</p>
                        <p className={lastComingPerson?.isEnterance ? 'entering' : 'idle'}>
                            <span>{lastComingPerson?.isEnterance ? '입장' : '퇴장'}</span>
                        </p>
                    </div>
                </div>
            </PopupDraggable>
        </AccessInfoSmallComponent>
    );
}

export default withRouter(AccessInfoCollapsed);