import React, { useState, useEffect, useRef, useMemo } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectResource from '../../Root/resource/id';
import Pagination from '../../Common/ui/pagination';
import AutoContentTooltip from '../../Common/ui/autoContentTooltip';
import { ParkingHistoryComponent } from '../styled/SensorDetectHistoryStyled';
import HistoryResource from '../resource/id';
import Icon from '../../Common/components/Icon/Icon';
import EmptyContent from '../../Common/components/emptyContent';

function ParkingHistory(props) {
    const [dataSource, setDataSource] = useState(null);

    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [cmmtktYn, setCmmtktYn] = useState(null);         // 차량구분 (null: 전체 / true: 정기 / false: 방문)
    const [selectParkngNo, setSelectParkngNo] = useState(''); // 차량번호 검색

    const [loadingIndicator, setLoadingIndicator] = useState(false);		// 새로고침중인지 표시

    const [pageItemCount, setPageItemCount] = useState(13);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용
    const [displayContent, setDisplayContent] = useState([]);

    const [autoContentTooltip, setAutoContentTooltip] = useState({
        show: false,
        target: null,
        parent: null
    });

    const refDatepicker01 = useRef(null);
    const refDatepicker02 = useRef(null);
    const refIsFirst = useRef(true);

    useEffect(() => {
        if (props.selectedSiteNo) {
            display(false);
        }
    }, [props.selectedSiteNo, props.sensorTypes]);

    useEffect(() => {
        if (!refIsFirst.current) {
            display(false);
        }
    }, [pageIndex]);

    useEffect(() => {
        let ui = [];

        if (dataSource && dataSource.length > 0) {
            let allListChecked = true;

            let index = 1;

            if (pageIndex > 1) {
                index = pageIndex * pageItemCount - (pageItemCount - 1);
            }

            for (let i = 0; i < dataSource.length; i++) {
                const data = dataSource[i];

                ui.push(
                    <tr key={'dataSource_' + i} className={'activeBackgroundTr clickArea' + (data.checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
                        <td><input type="checkbox" className='clickArea' checked={data.checked || false} onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
                        <td>{index}</td>
                        <td>{data.parkngNo ?? '-'}</td>
                        <td>{data.cmmtktYn ? '정기' : '방문'}</td>
                        <td>{data.parkngStatusNm ?? '-'}</td>
                        <td>{props.formatIsoToDateTime(data.parkngTm)}</td>
                    </tr>
                );

                index++;

                if (!data.checked) {
                    allListChecked = false;
                }
            }

            setAllChecked(allListChecked);
            setDisplayContent(ui);
        }
        else {
            setAllChecked(false);
            setDisplayContent([]);
        }
    }, [dataSource]);

    // 체크된 데이터가 있는지 확인
    const hasChecked = useMemo(() => {
        return dataSource?.some(d => d.checked);
    }, [dataSource]);

    // 데이터가 존재하는지
    const hasData = dataSource && dataSource.length > 0;

    const display = async (isTriggeredByClick) => {
        $("body").css("cursor", "wait");

        const [beginYear, beginMonth, beginDay, beginDateValue] = getMakeDateTime(beginDate);
        const fullBeginDateTime = beginDateValue + ' 00:00:00';

        const [endYear, endMonth, endDay, endDateValue] = getMakeDateTime(endDate);
        const fullEndDateTime = endDateValue + ' 23:59:59';

        if (fullBeginDateTime > fullEndDateTime) {
            $("body").css("cursor", "default");
            alert('조회 기간을 다시 선택하세요');
            return;
        }

        setLoadingIndicator(true);

        // 검색 버튼을 통해 조회 시 pageIndex는 무조건 1
        const index = isTriggeredByClick ? 1 : pageIndex;

        const [dataSource, totalCount, message] = await HistoryController.requestParkingHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageItemCount, index, cmmtktYn, selectParkngNo);

        if (dataSource) {
            const newTotalCount = Math.ceil(totalCount / pageItemCount);

            setDataSource(dataSource);
            setTotalCount(newTotalCount);
            setListCount(totalCount);

            if (isTriggeredByClick) {
                setPageIndex(1);
            }
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }

        $("body").css("cursor", "default");
        setLoadingIndicator(false);
        refIsFirst.current = false;
    }

    const getMakeDateTime = (dateTime) => {
        let year = dateTime.getFullYear();
        let month = 1 + dateTime.getMonth();
        let strMonth = month >= 10 ? String(month) : '0' + month; // 문자열 변환
        let day = dateTime.getDate();
        let strDay = day >= 10 ? String(day) : '0' + day;         // 문자열 변환

        let strDate = `${year}-${strMonth}-${strDay}`;          // 날짜 문자열 생성
        return [year, month, day, strDate];               // 배열로 반환
    };

    const onChangeBegin = (date) => {
        setBeginDate(date);
        $("input:radio[name='stgDate']").prop('checked', false);
        setDateType('select');
    }

    const onChangeEnd = (date) => {
        setEndDate(date);
        $("input:radio[name='stgDate']").prop('checked', false);
        setDateType('select');
    }

    const onClickDateType = (type) => {
        let dateType = '';

        if (type === 'select') {
            dateType = 'select';
            setDateType(dateType);
            return;
        }

        let today = new Date();
        let date = new Date();

        if (type === 'today') {
            dateType = 'today';
        }
        else if (type === 'week') {
            date.setDate(date.getDate() - 7);
            dateType = 'week';
        }
        else if (type === 'month') {
            date.setMonth(date.getMonth() - 1);
            dateType = 'month';
        }
        else if (type === 'year') {
            date.setFullYear(date.getFullYear() - 1);
            dateType = 'year';
        }

        setBeginDate(date);
        setEndDate(today);
        setDateType(dateType);
    }

    const onCheckedRow = (checked, index) => {
        const newDataSource = [...dataSource];

        if (index === -1) {
            for (let data of newDataSource) {
                data.checked = checked;
            }
        }
        else {
            newDataSource[index].checked = checked;
        }

        setDataSource(newDataSource);
    }

    const onClickDownloadFile = async (isCheckedDownload) => {
        const [beginYear, beginMonth, beginDay, ,] = getMakeDateTime(beginDate);
        const [endYear, endMonth, endDay, ,] = getMakeDateTime(endDate);

        // 전체 다운로드
        if (!isCheckedDownload) {
            const [success, message] = await HistoryController.requestExcelAllParkingHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, cmmtktYn, selectParkngNo);

            if (!success) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
        else {
            const checkedList = getCheckedList();

            const [success, message] = await HistoryController.requestExcelPartialParkingHistory(checkedList);

            if (!success) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
    }

    const getCheckedList = () => {
        const checkedList = [];

        if (dataSource && dataSource.length > 0) {
            for (const data of dataSource) {
                if (data.checked) {
                    checkedList.push(data);
                }
            }
        }

        return checkedList;
    }

    const onClickDatepicker01 = () => {
        refDatepicker01.current.setOpen(true);
    }

    const onClickDatepicker02 = () => {
        refDatepicker02.current.setOpen(true);
    }

    const setPage = (page) => {
        setPageIndex(page);
    }

    const onChangeParkngNo = (value) => {
        setSelectParkngNo(value);
    }

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {
            display(true);
        }
    }

    return (
        <ParkingHistoryComponent>
            {
                autoContentTooltip.show &&
                <AutoContentTooltip
                    direction={"bottom"}
                    color={"black"}
                    node={autoContentTooltip}
                />
            }
            <div className='contents'>
                <p className='title'>{HistoryResource.menu.출입차량_이력}</p>
                <ul className='searchWrap'>
                    <li>
                        <div className='dropWrap'>
                            <p>차량 구분</p>
                            <ul className='comingPersonWrap'>
                                <li>
                                    <input
                                        type="radio"
                                        name="cmmtkt"
                                        id="cmmtkt_all"
                                        onChange={() => setCmmtktYn(null)}
                                        checked={cmmtktYn === null}
                                    />
                                    <label htmlFor="cmmtkt_all">전체</label>
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="cmmtkt"
                                        id="cmmtkt_regular"
                                        onChange={() => setCmmtktYn(true)}
                                        checked={cmmtktYn === true}
                                    />
                                    <label htmlFor="cmmtkt_regular">정기</label>
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="cmmtkt"
                                        id="cmmtkt_visitor"
                                        onChange={() => setCmmtktYn(false)}
                                        checked={cmmtktYn === false}
                                    />
                                    <label htmlFor="cmmtkt_visitor">방문</label>
                                </li>
                            </ul>
                        </div>
                        <div className='inputWrap'>
                            <p>차량 번호</p>
                            <div>
                                <input type="text" value={selectParkngNo} placeholder='차량 번호를 입력하세요' onChange={(e) => onChangeParkngNo(e.target.value)} onKeyUp={searchEnterKey} />
                            </div>
                        </div>
                    </li>
                    <li className='dateWrap'>
                        <p>출입일시</p>
                        <div>
                            <ul className='datepickerWrap'>
                                <li>
                                    <div className='datepicker'>
                                        <DatePicker ref={refDatepicker01} name="datepicker01" id="datepicker01"
                                            dateFormat="yyyy-MM-dd"
                                            locale={ko}
                                            maxDate={new Date()}
                                            selected={beginDate}
                                            onChange={date => onChangeBegin(date)}
                                        />
                                        <button type='button' className={'btnCalendarBk'} onClick={onClickDatepicker01}>
                                            <Icon.Calendar />
                                        </button>
                                    </div>
                                </li>
                                <li>~</li>
                                <li>
                                    <div className={'datepicker'}>
                                        <DatePicker ref={refDatepicker02} name="datepicker02" id="datepicker02"
                                            dateFormat="yyyy-MM-dd"
                                            locale={ko}
                                            maxDate={new Date()}
                                            selected={endDate}
                                            onChange={date => onChangeEnd(date)}
                                        />
                                        <button type='button' className={'btnCalendarBk'} onClick={onClickDatepicker02}>
                                            <Icon.Calendar />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            <ul className='selectDateWrap'>
                                <li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => onClickDateType('select')} checked={dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
                                <li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => onClickDateType('today')} checked={dateType === 'today'} /><label htmlFor="hscsRdo02">오늘</label></li>
                                <li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => onClickDateType('week')} checked={dateType === 'week'} /><label htmlFor="hscsRdo03">1주</label></li>
                                <li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => onClickDateType('month')} checked={dateType === 'month'} /><label htmlFor="hscsRdo04">1개월</label></li>
                                <li><input type="radio" name="hscsRdo" id="hscsRdo05" onChange={() => onClickDateType('year')} checked={dateType === 'year'} /><label htmlFor="hscsRdo05">1년</label></li>
                            </ul>
                        </div>
                    </li>
                    {
                        loadingIndicator === true ?
                            <a className='submitBtn'><span><CircularProgress className="spinner" /></span></a>
                            :
                            <a onClick={() => display(true)} className='submitBtn'><span>검색하기</span></a>
                    }
                </ul>

                <ul className='downloadWrap'>
                    {/* 전체 다운로드: 데이터가 없으면 비활성화 */}
                    <li>
                        <a
                            onClick={hasData ? () => onClickDownloadFile(false) : undefined}
                            className={`all ${!hasData ? 'disabled' : ''}`}
                        >
                            전체 다운로드
                        </a>
                    </li>

                    {/* 선택 다운로드: 데이터가 없거나, 체크된 데이터가 없으면 비활성화 */}
                    <li>
                        <a
                            onClick={hasChecked ? () => onClickDownloadFile(true) : undefined}
                            className={`exl ${!hasChecked ? 'disabled' : ''}`}
                        >
                            선택 다운로드
                        </a>
                    </li>
                </ul>

                {displayContent && displayContent.length > 0 ?
                    <div className={'hscTb'} id={'hscTb'}>
                        <div className={'scrTb'}>
                            <table>
                                <colgroup>
                                    <col style={{ width: '4%' }} />
                                    <col style={{ width: '4%' }} />
                                    <col style={{ width: '32%' }} />
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '20%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
                                        <th>NO</th>
                                        <th>차량 번호</th>
                                        <th>차량 구분</th>
                                        <th>출입 상태</th>
                                        <th>출입 일시</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayContent}
                                </tbody>
                            </table>
                        </div>
                        {
                            (listCount > 0) &&
                            <Pagination
                                totalPage={totalCount}
                                limit={5}
                                page={pageIndex}
                                setPage={setPage}
                            />
                        }
                    </div>
                    :
                    <div className='hscTb emptyContent'>
                        <EmptyContent
                            title="선택한 조건에 해당하는 출입차량 이력이 존재하지 않습니다."
                            description="조회 조건을 다시 설정하여 검색하세요"
                        />
                    </div>
                }
            </div>
        </ParkingHistoryComponent>
    );
}

export default ParkingHistory;
