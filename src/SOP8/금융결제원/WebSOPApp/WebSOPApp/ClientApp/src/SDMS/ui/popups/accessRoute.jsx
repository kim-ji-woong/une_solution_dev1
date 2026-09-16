import React, { useEffect, useRef, useState } from 'react';
import PopupDraggable from './popupDraggable';
import { AccessRouteComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import DropBox from '../../../Common/components/dropBox';
import profile from '../../images/access_profile.svg';
import { SDMSController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import { isEqual } from 'lodash';

function AccessRoute(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [sort, setSort] = useState('newest'); // 최신순, 오래된순
    const [histories, setHistories] = useState([]);
    const [workerNo, setWorkerNo] = useState(null); // 사원 이미지 파일명 -> 사번

    const accessLogRef = useRef(null);

    useEffect(() => {
        getRouteHistory();
    }, [props.selectedComingPerson]);

    useEffect(() => {
        // 데이터가 변경되면 스크롤 최상단으로 이동
        if (accessLogRef.current) {
            accessLogRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [props.selectedComingPerson]);

    const getRouteHistory = async () => {
        if (!props.selectedComingPerson) return;

        const [result, message] = await SDMSController.requestRouteHistory(props.selectedComingPerson.cardNo);

        if (result === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setHistories(result.histories);
        setWorkerNo(result.sabun);

        // 논모달 열린 상태에서 출입자 변경되었을 경우 상태 업데이트
        if (props.accessRoutes) {
            props.setAccessRoutes(result.histories);
        }
    };

    const sortedHistories = [...histories].sort((a, b) => {
        if (sort === 'newest') {
            return new Date(b.entryTime) - new Date(a.entryTime);
        }
        return new Date(a.entryTime) - new Date(b.entryTime);
    });
    
    const onClickClose = () => {
        props.setVisiblePopups(SdmsResource.ID.menu.accessRoute, false);
        props.setSelectedComingPerson(null);
        props.setSelectedAccessRoute(null);
        props.setAccessRoutes(null);
    }

    const setAccessRoutes = (histories) => {
        if (!props.accessRoutes) {
            props.handleToast("경로보기 중에는 출입문 열림 효과가 일시 중지됩니다", "warning");
            props.setAccessRoutes(histories);
            return;
        }

        const isSame = isEqual(histories, props.accessRoutes);
        props.setAccessRoutes(isSame ? null : histories);
    }

    const setSelectedAccessRoute = (history) => {
        props.setSelectedAccessRoute(history);
        props.moveToZone(history.zoneNo);
    }

    const profileImageSrc = workerNo
        ? `/resource/image/access/${workerNo}.png`
        : profile;

    return (
        <AccessRouteComponent id={props.popupType} className='UI_Section accessRoute' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={498}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.accessRoute}
                    </h5>
                    <IconButton
                        variant='unfill'
                        size='xxs'
                        icon={<Icon.Closer size={'xxs'} />}
                        onClick={() => onClickClose()}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className='content'>
                    <div className='personInfo'>
                        <img
                            src={profileImageSrc}
                            alt="출입자 사진"
                            width={72}
                            height={86}
                            onError={(e) => {
                                e.currentTarget.onerror = null; // 무한 루프 방지
                                e.currentTarget.src = profile;  // 기본 이미지
                            }}
                        />
                        <ul>
                            <li className='name'>
                                <p>{props.selectedComingPerson.personName}</p>
                                <p>{props.selectedComingPerson.isVisitor ? '방문객' : '임직원'}</p>
                            </li>
                            <li className='count'>
                                <p>이동기록 :<span>{histories.length}</span></p>
                                <p>중요구역 :<span>{histories.filter(h => h.isImportant).length}</span></p>
                            </li>
                        </ul>
                    </div>

                    <div className='sortWrap'>
                        <DropBox
                            id='sort'
                            value={sort}
                            onChange={setSort}
                            options={[
                                { value: 'newest', label: '최신순' },
                                { value: 'oldest', label: '오래된순' },
                            ]}
                            openId={openDropId}
                            setOpenId={setOpenDropId}
                        />
                        <button
                            className={props.accessRoutes ? 'selected' : ''} 
                            onClick={() => setAccessRoutes(histories)}
                        >
                            경로보기
                        </button>
                    </div>

                    <div className='accessLog' ref={accessLogRef}>
                        <ul className='accessLogList'>
                            {sortedHistories.map((history, index) => {
                                const timelineNumber =
                                    sort === 'newest'
                                        ? sortedHistories.length - index
                                        : index + 1;

                                return (
                                    <li
                                        key={history.key}
                                        className={props.selectedAccessRoute?.key === history.key ? 'accessLogItem selected' : 'accessLogItem'}
                                        onClick={() => setSelectedAccessRoute(history)}
                                    >
                                        <div className='timeline'>
                                            <span className='timelineNumber'>
                                                {timelineNumber}
                                            </span>
                                            <span className='timelineLine'></span>
                                        </div>

                                        <div className='cardWrap'>
                                            <div className='cardHeader'>
                                                <h3 className='cardTitle'>
                                                    [{history.zoneName}]{' '}
                                                    {history.doorName}
                                                </h3>
                                                {history.isImportant && (
                                                    <span className='badgeImportant'>중요</span>
                                                )}
                                            </div>

                                            <div className='cardBody'>
                                                <div className='infoRow'>
                                                    <span className='infoLabel'>
                                                        입장 일시
                                                    </span>
                                                    <span className='infoValue'>
                                                        {SdmsResource.getDateTime(history.entryTime)}
                                                    </span>
                                                </div>
                                                <div className='infoRow'>
                                                    <span className='infoLabel'>
                                                        퇴장 일시
                                                    </span>
                                                    <span className='infoValue'>
                                                        {SdmsResource.getDateTime(history.exitTime)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </PopupDraggable>
        </AccessRouteComponent>
    );
}

export default AccessRoute;