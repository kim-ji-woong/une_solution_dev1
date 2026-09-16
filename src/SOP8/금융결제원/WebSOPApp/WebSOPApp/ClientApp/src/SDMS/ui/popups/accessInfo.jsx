import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { AccessInfoComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import TabMenu from '../../../Common/components/tabMenu';
import SearchInputBox from '../../../Common/components/searchInputBox';
import FilterDropdown from '../../../Common/components/filterDropdown';
import { SDMSController } from '../../services/sdmsController';
import EmptyContent from '../../../Common/components/emptyContent';
import ProjectResource from '../../../Root/resource/id';
import HistoryResource from '../../../History/resource/id';

function AccessInfo(props) {
    const comingHistory = useSelector(state => state.comingHistory);   // 건물 내부
    const areaComingHistory = useSelector(state => state.areaComingHistory);   // 중요구역

    const [menuType, setMenuType] = useState('inside');
    const [searchText, setSearchText] = useState("");
    const [openFilterKey, setOpenFilterKey] = useState(null);

    const [openDoorKey, setOpenDoorKey] = useState(null);

    const [typeFilter, setTypeFilter] = useState(null);   // 'worker' | 'visitor' | null
    const [statusFilter, setStatusFilter] = useState(null); // 'enter' | 'exit' | null

    const tabs = [
        { key: "inside", label: "건물 내부" },
        { key: "importantZone", label: "중요구역" },
    ];

    // 타이머
    useEffect(() => {
        SDMSController.stopWatchComingHistoryTimer();
        SDMSController.stopWatchAreaComingHistoryTimer();
        SDMSController.stopWatchLastComingPersonTimer();

        if (menuType === 'inside') {
            SDMSController.StartWatchComingHistoryTimer();
        } else {
            SDMSController.StartWatchAreaComingHistoryTimer();
        }

        return () => {
            SDMSController.stopWatchComingHistoryTimer();
            SDMSController.stopWatchAreaComingHistoryTimer();
            SDMSController.stopWatchLastComingPersonTimer();
        };
    }, [menuType]);

    const toggleCollapse = () => {
        props.setIsCollapsedAccessInfo(prev => !prev);
    };

    const toggleDoor = (key) => {
        setOpenDoorKey(prev => (prev === key ? null : key));
    };

    const includesSearchText = (...targets) => {
        if (!searchText) return true;
        const keyword = searchText.toLowerCase();
        return targets.some(t =>
            (t ?? '').toString().toLowerCase().includes(keyword)
        );
    };

    // 필터 + 검색 공통 판별 함수
    const passFilterAndSearch = (person) => {
        if (searchText && !includesSearchText(person.personName, person.doorName)) return false;

        if (typeFilter === 'worker' && person.isVisitor) return false;
        if (typeFilter === 'visitor' && !person.isVisitor) return false;

        if (statusFilter === 'enter' && !person.isEnterance) return false;
        if (statusFilter === 'exit' && person.isEnterance) return false;

        return true;
    };

    const getEmptyContentUI = (type, title, description) => {
        if (type === 'plain') {
            return (
                <EmptyContent
                    layout={type}
                    title={title}
                    description={description}
                />
            );
        }

        return (
            <EmptyContent
                title="출입자 정보가 없습니다"
                description="이전 출입자 정보는 이력관리에서 확인하세요"
                action={{
                    label: '이동하기',
                    onClick: () => props.history.push(ProjectResource.path.history, {menu: HistoryResource.menu.출입자_이력}),
                }}
            />
        );
    };

    const onChangeMenuType = (menu) => {
        setMenuType(menu);
    };

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    const getTotalCountInfo = () => {
        if (menuType === 'inside') {
            return (
                <ul className='countList'>
                    <li>
                        <div className='countHeader'>
                            <p className='title'>입장 수</p>
                            <p className='total'>총 <span>{comingHistory?.totalComingCount}</span></p>
                        </div>
                        <span className='line' />
                        <ul className='countBody'>
                            <li>
                                <p className='label'>임직원</p>
                                <p className='value'>{comingHistory?.totalComingCount_Worker}</p>
                            </li>
                            <li>
                                <p className='label'>방문객</p>
                                <p className='value'>{comingHistory?.totalComingCount_Visitor}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className='countHeader'>
                            <p className='title'>잔류 수</p>
                            <p className='total'>총 <span>{comingHistory?.totalRemainingCount}</span></p>
                        </div>
                        <span className='line' />
                        <ul className='countBody'>
                            <li>
                                <p className='label'>임직원</p>
                                <p className='value'>{comingHistory?.totalRemainingCount_Worker}</p>
                            </li>
                            <li>
                                <p className='label'>방문객</p>
                                <p className='value'>{comingHistory?.totalRemainingCount_Visitor}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            );
        }
        else if (menuType === 'importantZone') {
            return (
                <ul className='countList'>
                    <li>
                        <div className='countHeader'>
                            <p className='title'>입장 수</p>
                            <p className='total'>총 <span>{areaComingHistory?.totalComingCount}</span></p>
                        </div>
                        <span className='line' />
                        <ul className='countBody'>
                            <li>
                                <p className='label'>임직원</p>
                                <p className='value'>{areaComingHistory?.totalComingCount_Worker}</p>
                            </li>
                            <li>
                                <p className='label'>방문객</p>
                                <p className='value'>{areaComingHistory?.totalComingCount_Visitor}</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className='countHeader'>
                            <p className='title'>잔류 수</p>
                            <p className='total'>총 <span>{areaComingHistory?.totalRemainingCount}</span></p>
                        </div>
                        <span className='line' />
                        <ul className='countBody'>
                            <li>
                                <p className='label'>임직원</p>
                                <p className='value'>{areaComingHistory?.totalRemainingCount_Worker}</p>
                            </li>
                            <li>
                                <p className='label'>방문객</p>
                                <p className='value'>{areaComingHistory?.totalRemainingCount_Visitor}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            );
        }
    };

    const getComingPersonInfos = () => {
        if (!comingHistory || !comingHistory.comingPersonInfos) {
            return getEmptyContentUI('plain', '현재 조건에 해당하는 목록이 없습니다', '검색어나 필터 조건을 변경하세요');
        } 

        const filtered = comingHistory.comingPersonInfos.filter(passFilterAndSearch);
        if (filtered.length === 0) return getEmptyContentUI('plain', '현재 조건에 해당하는 목록이 없습니다', '검색어나 필터 조건을 변경하세요');

        return filtered.map((person, index) => (
            <li 
                key={index} 
                className={props.selectedComingPerson?.cardNo === person.cardNo ? 'selected' : ''}
                onClick={() => props.setSelectedComingPerson(person)}
            >
                <div>{person.personName ?? '-'}</div>
                <div>{person.doorName ?? '-'}</div>
                <div>{person.isVisitor ? '방문객' : '임직원'}</div>
                <div className={person.isEnterance ? 'entering' : 'idle'}>
                    <span>{person.isEnterance ? '입장' : '퇴장'}</span>
                </div>
            </li>
        ));
    };

    const getAreaComingPersonInfos = () => {
        if (!areaComingHistory?.doorInfos || areaComingHistory.doorInfos.length === 0) {
            return getEmptyContentUI('plain', '중요구역 출입자가 없습니다');
        }

        return areaComingHistory.doorInfos.map((door) => {
            const filteredPersons = door.comingPersonInfos?.filter(passFilterAndSearch) ?? [];
            const isOpen = openDoorKey === door.nSensorNo;

            return (
                <li key={door.nSensorNo}>
                    <div
                        className={`header ${isOpen ? 'on' : ''}`}
                        onClick={() => toggleDoor(door.nSensorNo)}
                    >
                        <Icon.Arrow
                            size="xxxxs"
                            direction={isOpen ? 'bottom' : 'right'}
                        />
                        <p>{door.doorName}</p>
                        <p className='count'>{filteredPersons.length}</p>
                    </div>

                    {isOpen && (
                        <ul className='tree children on'>
                            <li>
                                <ul className='contentList'>
                                    <li className='head'>
                                        <div>출입자</div>
                                        <div>최근 출입 공간</div>
                                        <div>
                                            구분
                                            <FilterDropdown
                                                filterKey="type"
                                                openKey={openFilterKey}
                                                setOpenKey={setOpenFilterKey}
                                                activeValue={typeFilter}
                                                items={[
                                                    {
                                                        label: '임직원',
                                                        value: 'worker',
                                                        onClick: () =>
                                                            setTypeFilter(prev => (prev === 'worker' ? null : 'worker')),
                                                    },
                                                    {
                                                        label: '방문객',
                                                        value: 'visitor',
                                                        onClick: () =>
                                                            setTypeFilter(prev => (prev === 'visitor' ? null : 'visitor')),
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
                                                        label: '입장',
                                                        value: 'enter',
                                                        onClick: () =>
                                                            setStatusFilter(prev => (prev === 'enter' ? null : 'enter')),
                                                    },
                                                    {
                                                        label: '퇴장',
                                                        value: 'exit',
                                                        onClick: () =>
                                                            setStatusFilter(prev => (prev === 'exit' ? null : 'exit')),
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </li>

                                    <li className='body'>
                                        {filteredPersons.length === 0 ? (
                                            getEmptyContentUI('plain', '현재 조건에 해당하는 목록이 없습니다', '검색어나 필터 조건을 변경하세요')
                                        ) : (
                                            <ul>
                                                {filteredPersons.map((person, idx) => (
                                                        <li 
                                                            key={idx} 
                                                            className={props.selectedComingPerson?.cardNo === person.cardNo ? 'selected' : ''}
                                                            onClick={() => props.setSelectedComingPerson(person)}
                                                        >
                                                        <div>{person.personName ?? '-'}</div>
                                                        <div>{person.doorName ?? '-'}</div>
                                                        <div>{person.isVisitor ? '방문객' : '임직원'}</div>
                                                        <div className={person.isEnterance ? 'entering' : 'idle'}>
                                                            <span>{person.isEnterance ? '입장' : '퇴장'}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    )}
                </li>
            );
        });
    };


    // 검색 결과 갯수
    const resultCount =
        menuType === 'inside'
            ? comingHistory?.comingPersonInfos?.filter(passFilterAndSearch).length ?? 0
            : areaComingHistory?.doorInfos?.reduce(
                (acc, d) => acc + (d.comingPersonInfos?.filter(passFilterAndSearch).length ?? 0),
                0
            );

    return (
        <AccessInfoComponent id={props.popupType} className='UI_Section accessInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={726}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
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
                            축소
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
                {!comingHistory || comingHistory.totalComingCount === 0 ? 
                    getEmptyContentUI()
                    : <>
                        <TabMenu
                            tabs={tabs}
                            activeKey={menuType}
                            onChange={onChangeMenuType}
                            className='menuTypeWrap'
                        />
                        <div className={'content'}>
                            {getTotalCountInfo()}
                            <div className='searchWrap'>
                                <SearchInputBox
                                    value={searchText}
                                    onChange={setSearchText}
                                    placeholder={"검색하세요"}
                                    onSubmit={handleSubmit}
                                    onClear={() => setSearchText("")}
                                    fullWidth={true}
                                />
                                <p className="resultCount">총 {resultCount}건</p>
                            </div>

                            {menuType === 'inside' ? 
                                <ul className='contentList'>
                                    <li className='head'>
                                        <div>출입자</div>
                                        <div>최근 출입 공간</div>
                                        <div>
                                            구분
                                            <FilterDropdown
                                                filterKey="type"
                                                openKey={openFilterKey}
                                                setOpenKey={setOpenFilterKey}
                                                activeValue={typeFilter}
                                                items={[
                                                    {
                                                        label: '임직원',
                                                        value: 'worker',
                                                        onClick: () =>
                                                            setTypeFilter(prev => (prev === 'worker' ? null : 'worker')),
                                                    },
                                                    {
                                                        label: '방문객',
                                                        value: 'visitor',
                                                        onClick: () =>
                                                            setTypeFilter(prev => (prev === 'visitor' ? null : 'visitor')),
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
                                                        label: '입장',
                                                        value: 'enter',
                                                        onClick: () =>
                                                            setStatusFilter(prev => (prev === 'enter' ? null : 'enter')),
                                                    },
                                                    {
                                                        label: '퇴장',
                                                        value: 'exit',
                                                        onClick: () =>
                                                            setStatusFilter(prev => (prev === 'exit' ? null : 'exit')),
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </li>
                                    <li className='body'>
                                        <ul>
                                            {getComingPersonInfos()}
                                        </ul>
                                    </li>
                                </ul> :
                                <ul className='treeWrap'>
                                    {getAreaComingPersonInfos()}
                                </ul>
                            }
                        </div>
                    </>
                }
            </PopupDraggable>
        </AccessInfoComponent>
    );
}

export default withRouter(AccessInfo);