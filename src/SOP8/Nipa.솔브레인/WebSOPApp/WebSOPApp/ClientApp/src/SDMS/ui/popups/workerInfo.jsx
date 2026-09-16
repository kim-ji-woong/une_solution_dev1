import React, { useEffect, useState } from 'react';
import PopupDraggable from './popupDraggable';
import { WorkerInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import { SDMSController } from '../../services/sdmsController';
import noDataIcon from '../../../Common/images/noDataIcon.svg';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SearchInputBox from '../../../Common/components/searchInputBox';

function WorkerInfo(props) {
    const [workList, setWorkList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const loadWorkList = async () => {
            const [workListData] = await SDMSController.requestSoulbrainWorkList();
            if (workListData?.length > 0) {
                setWorkList(workListData);
            }
        };

        loadWorkList();
    }, []);

    const onClickMove = (zoneID, buildingGroupID, buildingID) => {
        if (buildingGroupID === 20000) {
            props.onClickLogo?.();
        } else if (buildingID === 20000 && buildingGroupID) {
            props.moveToBuildingGroup?.(buildingGroupID);
        } else if (zoneID) {
            props.moveToZone?.(zoneID);
        } else if (buildingID && buildingID !== 20000) {
            props.moveToBuilding?.(buildingID);
        }
    };

    const handleSubmit = (value) => {
        setSearchText((value ?? '').trim());
    };

    const getSearchList = () => {
        if (!searchText) return workList;
        return workList.filter(work =>
            work.placE_NAME?.includes(searchText) ||
            work.plaN_NAME?.includes(searchText) ||
            work.worK_GBN?.includes(searchText) ||
            work.worK_ENTRANT_NAME?.includes(searchText)
        );
    };

    const searchList = getSearchList();

    return (
        <WorkerInfoComponent id={props.popupType} className='UI_Section workerInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={550}
                popupMinHeight={500}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>{SdmsResource.ID.menu.workerInfo}</h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size="xxs" />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.workerInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className='content'>
                    {workList.length > 0 && (
                        <div className='searchWrap'>
                            <SearchInputBox
                                value={searchText}
                                onChange={setSearchText}
                                placeholder={'검색어를 입력하세요'}
                                onSubmit={handleSubmit}
                                onClear={() => setSearchText('')}
                                fullWidth={true}
                            />
                        </div>
                    )}
                    {searchList.length > 0 ? (
                        <>
                            <p className='countText'><span className='countNum'>{searchList.length}</span>건의 작업일지가 조회되었습니다.</p>
                            <div className='workerWrap scrollbar'>
                                <div className='workerHeader'>
                                    <span>공사장소</span>
                                    <span>작업명</span>
                                    <span>작업종류</span>
                                    <span>담당자</span>
                                </div>
                                {searchList.map(work => (
                                    <div
                                        key={work.id}
                                        className={`workerItem${expandedId === work.id ? ' on' : ''}`}
                                    >
                                        <div
                                            className='workerRow'
                                            onClick={() => onClickMove(work.zoneID, work.buildingGroupID, work.buildingID)}
                                        >
                                            <span>{work.placE_NAME || '-'}</span>
                                            <span>{work.plaN_NAME || '-'}</span>
                                            <span>{work.worK_GBN || '-'}</span>
                                            <span>{work.worK_ENTRANT_NAME || '-'}</span>
                                            <IconButton
                                                variant="unfill_white"
                                                size="xxxs"
                                                icon={expandedId === work.id ? <Icon.MinusIcon size="xxxxs" /> : <Icon.PlusIcon size="xxxxs" />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedId(expandedId === work.id ? null : work.id);
                                                }}
                                            />
                                        </div>
                                        {expandedId === work.id && (
                                            <div className='workerDetail'>
                                                <div className='detailGroup'>
                                                    <span className='label'>법인</span>
                                                    <span>{work.companY_GBN || '-'}</span>
                                                </div>
                                                <div className='detailGroup span2'>
                                                    <span className='label'>작업기간</span>
                                                    <span>{work.sdate && work.edate ? `${work.sdate} ~ ${work.edate}` : work.sdate || work.edate || '-'}</span>
                                                </div>
                                                <div className='detailGroup'>
                                                    <span className='label'>공사업체</span>
                                                    <span>{work.subcontractoR_NAME || '-'}</span>
                                                </div>
                                                <div className='detailGroup'>
                                                    <span className='label'>업체 책임자</span>
                                                    <span>{work.fielD_MANAGER_NAME || '-'}</span>
                                                </div>
                                                <div className='detailGroup'>
                                                    <span className='label'>작업인원</span>
                                                    <span>{work.fielD_PEOPLE_NUM ?? '-'}</span>
                                                </div>
                                                <div className='detailGroup'>
                                                    <span className='label'>공사주관부서</span>
                                                    <span>{work.appR_DEPT1 || '-'}</span>
                                                </div>
                                                <div className='detailGroup'>
                                                    <span className='label'>공사발생부서</span>
                                                    <span>{work.appR_DEPT2 || '-'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className='noData'>
                            <img src={noDataIcon} alt='데이터 없음 아이콘' />
                            <p>조회된 작업일지가 없습니다</p>
                        </div>
                    )}
                </div>
            </PopupDraggable>
        </WorkerInfoComponent>
    );
}

export default WorkerInfo;
