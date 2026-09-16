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
import { PatrolHistoryComponent } from '../styled/SensorDetectHistoryStyled';
import HistoryResource from '../resource/id';
import Icon from '../../Common/components/Icon/Icon';
import EmptyContent from '../../Common/components/emptyContent';
import PatrolHistoryDetailInfo from './popups/patrolHistoryDetailInfo';
import DropBox from '../../Common/components/dropBox';

function PatrolHistory(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [subContent, setSubContent] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const [courseList, setCourseList] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [selectCourseType, setSelectCourseType] = useState('');
    const [selectWorkerName, setSelectWorkerName] = useState('');

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
            loadCourseList();
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
                        <td>{data.workerName}</td>
                        <td>{data.courseName}</td>
                        <td>{data.placeName}</td>
                        <td>{props.formatIsoToDateTime(data.patrolTime)}</td>
                        <td><a onClick={() => onDetailInfo(data)}>상세보기</a></td>
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

    const loadCourseList = async () => {
        const [result, message] = await HistoryController.requestCourseList();

        if (result === null) {
            console.log(message);
            return;
        }
        
        setCourseList(result);
    }

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

		const [dataSource, totalCount, message] = await HistoryController.requestPatrolHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageItemCount, index, selectCourseType, selectWorkerName);

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

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		setDateType('select');
	}

	const onChangeEnd = (date) => {
		setEndDate(date);
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

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

		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();

		let korFormat = year + "-" + month + "-" + day;

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
        const userInfo = ProjectResource.getUserInfo();

        const [beginYear, beginMonth, beginDay, ,] = getMakeDateTime(beginDate);
        const [endYear, endMonth, endDay, ,] = getMakeDateTime(endDate);

        // 전체 다운로드
        if (!isCheckedDownload) {
            const [success, message] = await HistoryController.downloadExcelAllPatrolHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, selectCourseType, selectWorkerName);

            if (!success) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
        else {
            const checkedList = getCheckedList();

            const [success, message] = await HistoryController.downloadExcelPartialPatrolHistory(checkedList);

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

    const onDetailInfo = (data) => {
		setSelectedData(data);
		setSubContent('상세보기');
	}

    const changeSubContent = (subContent) => {
		setSubContent(subContent);
	}

    const onChangeSelectedUser = (value) => {
		setSelectWorkerName(value);
	}

    const searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			display();
		}
	}

    const onChangeCourseType = (value) => {
		setSelectCourseType(value);
    }

	const getCourseList = () => {
		let options = [];
        options.push({ value: '', label: '전체' });

		if (courseList) {
            for (const course of courseList) {
                options.push({ value: course, label: course });
            }
        }

		return options;
    }

    return (
        <PatrolHistoryComponent>
            {
                autoContentTooltip.show &&
                <AutoContentTooltip
                    direction={"bottom"}
                    color={"black"}
                    node={autoContentTooltip}
                />
            }
            <div className='contents'>
                <p className='title'>{HistoryResource.menu.순찰_결과_이력}</p>
                <ul className='searchWrap'>
                    <li>
                        <div className='dropWrap'>
                            <p>순찰코스</p>
                            <DropBox
                                id="course"
                                value={selectCourseType}
                                onChange={onChangeCourseType}
                                options={getCourseList()}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                        </div>
                        <div className='inputWrap'>
                            <p>순찰자 명</p>
                            <div>
                                <input type="text" name="" id="" value={selectWorkerName} onChange={(e) => onChangeSelectedUser(e.target.value)} onKeyUp={searchEnterKey} />
                            </div>
                        </div>
                    </li>
                    <li className='dateWrap'>
                        <p>순찰일시</p>
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
                                    <col style={{ width: '3%' }} />
                                    <col style={{ width: '3%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '48%' }} />
                                    <col style={{ width: '14%' }} />
                                    <col style={{ width: '14%' }} />
                                    <col style={{ width: '8%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
                                        <th>NO</th>
                                        <th>순찰자</th>
                                        <th>순찰 코스</th>
                                        <th>마지막 순찰 지점</th>
                                        <th>순찰 일시</th>
                                        <th>순찰 경로</th>
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
                            title="선택한 조건에 해당하는 순찰 결과 이력이 존재하지 않습니다."
                            description="조회 조건을 다시 설정하여 검색하세요"
                        />
                    </div>
                }
            </div>
            {(subContent && subContent === '상세보기') &&
                <PatrolHistoryDetailInfo changeSubContent={changeSubContent} datas={selectedData?.courseHistories} formatIsoToDateTime={props.formatIsoToDateTime} />
            }
        </PatrolHistoryComponent>
	);
}

export default PatrolHistory;