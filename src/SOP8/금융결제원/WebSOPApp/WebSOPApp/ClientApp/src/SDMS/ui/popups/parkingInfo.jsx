import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ParkingInfoComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import SearchInputBox from '../../../Common/components/searchInputBox';
import FilterDropdown from '../../../Common/components/filterDropdown';
import EmptyContent from '../../../Common/components/emptyContent';
import { SDMSController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import HistoryResource from '../../../History/resource/id';
import Button from '../../../Common/components/button';

// 상태 코드 (백엔드 ParkingData.Type 과 동일)
const PARKING_STATE = {
    OUT: 0,         // 출차
    ENTRY: 1,       // 입차
    USER_OUT: 2,    // 수동 출차
};

function ParkingInfo(props) {
    const parkingInfo = useSelector(state => state.parkingInfo);   // 출입차량 현황

    const [searchText, setSearchText] = useState("");
    const [openFilterKey, setOpenFilterKey] = useState(null);

    const [typeFilter, setTypeFilter] = useState(null);     // 'regular' | 'visitor' | null
    const [statusFilter, setStatusFilter] = useState(null); // 'enter' | 'exit' | null
    const [sortOrder, setSortOrder] = useState(null);       // 입차 일시 정렬 null(기본) | 'asc' | 'desc'

    const [selectedHisNo, setSelectedHisNo] = useState(null);   // 선택된 차량 (주차 이력 일련번호)
    const [imageError, setImageError] = useState(false);        // 선택 차량 상세 이미지 파일 없음/로드 실패 여부

    // 현재 목록
    const parkingList = parkingInfo?.parkingList ?? [];

    // 선택 차량은 매 폴링마다 일련번호로 다시 매칭하여 유지한다.
    const selectedParking = selectedHisNo != null
        ? parkingList.find(p => p.parkingHisNo === selectedHisNo) ?? null
        : null;

    // 타이머
    useEffect(() => {
        SDMSController.StartWatchParkingInfoTimer();

        return () => {
            SDMSController.stopWatchParkingInfoTimer();
        };
    }, []);

    // 선택된 차량이 바뀌면 이미지 오류 상태를 초기화한다. (정적 파일 경로는 img 태그가 직접 로드)
    useEffect(() => {
        setImageError(false);
    }, [selectedHisNo]);

    const isFilterActive = !!searchText || typeFilter !== null || statusFilter !== null;

    const includesSearchText = (...targets) => {
        if (!searchText) return true;
        const keyword = searchText.toLowerCase();
        return targets.some(t => (t ?? '').toString().toLowerCase().includes(keyword));
    };

    // 필터 + 검색 공통 판별 함수
    const passFilterAndSearch = (parking) => {
        if (searchText && !includesSearchText(parking.parkngNo)) return false;

        if (typeFilter === 'regular' && !parking.cmmtktYn) return false;
        if (typeFilter === 'visitor' && parking.cmmtktYn) return false;

        const isEntering = parking.parkngStateNo === PARKING_STATE.ENTRY;
        if (statusFilter === 'enter' && !isEntering) return false;
        if (statusFilter === 'exit' && isEntering) return false;

        return true;
    };

    const filteredList = parkingList.filter(passFilterAndSearch);

    // 정렬이 적용된 경우에만 정렬한다. (기본은 백엔드 정렬 = 최신순 유지)
    if (sortOrder) {
        filteredList.sort((a, b) => {
            const ta = new Date(a.parkngTm).getTime();
            const tb = new Date(b.parkngTm).getTime();
            return sortOrder === 'asc' ? ta - tb : tb - ta;
        });
    }

    const onClickReset = () => {
        setSearchText("");
        setTypeFilter(null);
        setStatusFilter(null);
    };

    // 수동 출차 : 클릭 시 안내(확인) 모달을 먼저 띄운다. (SCR-SDMS-104005)
    const onClickManualOut = () => {
        if (!selectedParking) return;

        const hisNo = selectedParking.parkingHisNo;
        const vhcleNo = selectedParking.parkngNo ?? '';

        props.showConfirmDialog?.(
            ProjectResource.dialogTypes.QUESTION,
            ["수동 출차 처리하시겠습니까?", "처리 후 차량 상태는 출차로 변경됩니다."],
            ["취소", "수동 출차"],
            (index) => handleManualOut(index, hisNo)
        );
    };

    const handleManualOut = async (index, hisNo) => {
        // 0: 취소 / 1: 수동 출차
        if (index !== 1) {
            props.onCloseConfirmDialog?.();
            return;
        }

        const [result, message] = await SDMSController.requestParkingManual(hisNo);
        if (!result) {
            props.showConfirmDialog?.(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        props.onCloseConfirmDialog?.();
        props.handleToast?.("수동 출차 처리되었습니다");

        // 수동 출차 후 새로운 이력으로 갱신되므로 선택을 해제한다. (다음 폴링에서 목록 갱신)
        setSelectedHisNo(null);
    };

    const getTypeText = (parking) => (parking.cmmtktYn ? '정기' : '방문');

    const isEntering = (parking) => parking.parkngStateNo === PARKING_STATE.ENTRY;

    // 일시 포맷 (값이 없거나 .NET DateTime 최소값(0001-01-01)이면 '-')
    const formatParkingTime = (iso) => {
        if (!iso || iso.startsWith('0001-01-01')) return '-';
        return SdmsResource.getDateTime(iso);
    };

    // 상태 뱃지 (입차: 초록 / 출차·수동출차: 회색)
    const getStatusBadge = (parking) => (
        <div className={`badge ${isEntering(parking) ? 'enter' : 'exit'}`}>
            <span>{parking.parkngStatusNm}</span>
        </div>
    );

    const getEmptyContentUI = (title, description, action) => (
        <EmptyContent layout="plain" title={title} description={description} action={action} />
    );

    const getStatsBar = () => (
        <div className='statsBar'>
            <ul>
                <li>
                    <p className='label'>당일 입차 건수</p>
                    <p className='value'>{parkingInfo?.entryParkingNum ?? 0}</p>
                </li>
                <li>
                    <p className='label'>당일 출차 건수</p>
                    <p className='value'>{parkingInfo?.outParkingNum ?? 0}</p>
                </li>
                <li>
                    <p className='label'>현재 주차 차량</p>
                    <p className='value'>{parkingInfo?.currentParkingNum ?? 0}</p>
                </li>
            </ul>
        </div>
    );

    const getListPane = () => {
        // 출입한 차량 자체가 없을 때
        if (parkingList.length === 0) {
            return (
                <div className='listPane'>
                    {getEmptyContentUI(
                        '출입한 차량이 없습니다',
                        '이전 데이터는 이력관리에서 확인하세요',
                        {
                            label: '이동하기',
                            onClick: () => props.history.push(ProjectResource.path.history, { menu: HistoryResource.menu.출입차량_이력 }),
                        }
                    )}
                </div>
            );
        } 

        return (
            <div className='listPane'>
                <div className='listTop'>
                    <SearchInputBox
                        value={searchText}
                        onChange={setSearchText}
                        placeholder={"검색"}
                        onClear={() => setSearchText("")}
                    />
                    <button
                        type='button'
                        className='resetBtn'
                        onClick={onClickReset}
                        disabled={!isFilterActive}
                    >
                        <Icon.Refresh size="xxxs" />
                        필터 초기화
                    </button>
                </div>

                <ul className='contentList'>
                    <li className='head'>
                        <div>차량 번호</div>
                        <div
                            className={`sortable ${sortOrder ? 'on' : ''}`}
                            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                        >
                            입차 일시
                            {sortOrder ? (
                                <Icon.RodArrow size="xxs" direction={sortOrder === 'asc' ? 'top' : 'bottom'} fill="primary.p400" />
                            ) : (
                                <span className='sortHint'>
                                    <Icon.SortIcon size="xs" fill="grayscale.g400" />
                                </span>
                            )}
                        </div>
                        <div>
                            구분
                            <FilterDropdown
                                filterKey="type"
                                openKey={openFilterKey}
                                setOpenKey={setOpenFilterKey}
                                activeValue={typeFilter}
                                items={[
                                    {
                                        label: '정기',
                                        value: 'regular',
                                        onClick: () => setTypeFilter(prev => (prev === 'regular' ? null : 'regular')),
                                    },
                                    {
                                        label: '방문',
                                        value: 'visitor',
                                        onClick: () => setTypeFilter(prev => (prev === 'visitor' ? null : 'visitor')),
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            상태
                            <FilterDropdown
                                filterKey="status"
                                openKey={openFilterKey}
                                setOpenKey={setOpenFilterKey}
                                activeValue={statusFilter}
                                items={[
                                    {
                                        label: '입차',
                                        value: 'enter',
                                        onClick: () => setStatusFilter(prev => (prev === 'enter' ? null : 'enter')),
                                    },
                                    {
                                        label: '출차',
                                        value: 'exit',
                                        onClick: () => setStatusFilter(prev => (prev === 'exit' ? null : 'exit')),
                                    },
                                ]}
                            />
                        </div>
                    </li>

                    <li className='body'>
                        {filteredList.length === 0 ? (
                            getEmptyContentUI('현재 조건에 해당하는 목록이 없습니다', '검색어나 필터 조건을 변경하세요')
                        ) : (
                            <ul>
                                {filteredList.map((parking) => (
                                    <li
                                        key={parking.parkingHisNo}
                                        className={selectedHisNo === parking.parkingHisNo ? 'selected' : ''}
                                        onClick={() => setSelectedHisNo(parking.parkingHisNo)}
                                    >
                                        <div>{parking.parkngNo ?? '-'}</div>
                                        <div>{formatParkingTime(parking.parkngTm)}</div>
                                        <div>{getTypeText(parking)}</div>
                                        {getStatusBadge(parking)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        );
    };

    const getDetailPane = () => {
        return (
            <div className='detailPane'>
                <h6 className='paneTitle'>차량 상세 정보</h6>

                {!selectedParking ? (
                    getEmptyContentUI('차량을 선택하세요')
                ) : (
                    <>
                        <div className='detailBody'>
                            {!imageError ? (
                                <img
                                    className='vehicleImage'
                                    src={`/resource/image/parking/${selectedParking.parkingHisNo}.jpg`}
                                    alt='차량 이미지'
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;   // 무한 루프 방지
                                        setImageError(true);
                                    }}
                                />
                            ) : (
                                <div className='noImage'>
                                    <Icon.Image size="lg" fill="grayscale.g400" />
                                    <p>{isEntering(selectedParking) ? '이미지 없음' : '출차 이미지 없음'}</p>
                                </div>
                            )}

                            <div className='vehicleTitle'>
                                <p className='number'>{selectedParking.parkngNo ?? '-'}</p>
                                {getStatusBadge(selectedParking)}
                            </div>

                            <ul className='detailFields'>
                                <li>
                                    <span className='label'>차량 구분</span>
                                    <span className='value'>{getTypeText(selectedParking)}</span>
                                </li>
                                <li>
                                    <span className='label'>입차 일시</span>
                                    <span className='value'>{formatParkingTime(selectedParking.parkngTm)}</span>
                                </li>
                                <li>
                                    <span className='label'>출차 일시</span>
                                    <span className='value'>{selectedParking.parkngOutTm ? formatParkingTime(selectedParking.parkngOutTm) : '미출차'}</span>
                                </li>
                            </ul>
                        </div>

                        {/* 수동 출차는 현재 입차(주차 중) 상태인 차량만 가능하다. */}
                        {isEntering(selectedParking) && (
                            <Button
                                variant='fill'
                                size='xs'
                                onClick={onClickManualOut}
                            >
                                수동 출차
                            </Button>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <ParkingInfoComponent id={props.popupType} className='UI_Section parkingInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={900}
                popupMinHeight={652}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        출입차량 현황정보
                    </h5>
                    <div>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.parkingInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className='content'>
                    {getStatsBar()}
                    <div className='panes'>
                        {getListPane()}
                        {getDetailPane()}
                    </div>
                </div>
            </PopupDraggable>
        </ParkingInfoComponent>
    );
}

export default withRouter(ParkingInfo);
