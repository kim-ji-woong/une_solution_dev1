import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import HistoryController from '../services/historyController';
import SOPHistoryDetailInfo from './popups/SOPHistoryDetailInfo';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import ProjectResource from '../../Root/resource/id';
import SopManagerResource from '../../SOPManager/resource/id';
import SopController from '../../SOPManager/services/sopController';
import Pagination from '../../Common/ui/pagination';
import { SOPHistoryComponent } from '../styled/SensorDetectHistoryStyled';


function SOPHistory(props) {
	const [subContent, setSubContent] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const [disasterCategories, setDisasterCategories] = useState(null);
    const [dataSource, setDataSource] = useState(null);
	
    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [selectDisasterType, setSelectDisasterType] = useState('전체');
    const [selectActionStep, setSelectActionStep] = useState('전체');
    const [selectUserName, setSelectUserName] = useState('');

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [linkSOP, setLinkSOP] = useState(null);

	const [pageItemCount, setPageItemCount] = useState(13);
	const [pageIndex, setPageIndex] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [listCount, setListCount] = useState(0);

	const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용
	const [displayContent, setDisplayContent] = useState([]);
    
	const prevProps = useRef(null);

    const refDatepicker01 = useRef(null);
    const refDatepicker02 = useRef(null);
	const refIsFirst = useRef(true);

	useEffect(() => {
		loadActionStepNames();
	}, [])

    useEffect(() => {
        if (props.selectedSiteNo) {
            loadDisasterCategory();
            display();
        }
    }, [props.selectedSiteNo]);

	useEffect(() => {
		if (!refIsFirst.current) {
			display();
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
	
				let trClassName = null;
				if (linkSOP && linkSOP.actionStepHistoryNo && linkSOP.actionStepHistoryNo === data.actionStepHistoryNo) {
					trClassName = 'selectedTr';
				}
	
				ui.push(
					<tr key={'dataSource_' + (data.rowNo)} className={trClassName + " " + 'activeBgSOPTr clickArea' + (data.checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
						<td className={'clickArea'}><input type="checkbox" className='clickArea' checked={data.checked || false} onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
						<td className={'clickArea'}>{index}</td>
						<td className={'clickArea'}>{data.disasterCategoryName}</td>
						<td className={'clickArea'}>{data.sopName}</td>
						<td className={'clickArea'}>{data.actionStepName}</td>
						<td className={'clickArea'}>{!data.sensorName ? '-' : data.sensorName}</td>
						<td className={'clickArea'}>{data.position}</td>
						<td className={'clickArea'}>{data.beginTime.toString().replace('T', ' ')}</td>
						<td className={'clickArea'}>{data.endTime?.toString().replace('T', ' ')}</td>
						<td className={'clickArea'}>{data.userName}</td>
						<td className={'clickArea'}><a onClick={() => onDetailInfo(data)}>상세정보</a></td>
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
	}, [dataSource])

    useEffect(() => {
        if (prevProps.current?.linkSOP !== linkSOP) {
            if (prevProps.current?.linkSOP && prevProps.current.linkSOP.beginTime) {
                setBeginDate(new Date(prevProps.current.linkSOP.beginTime));
                setEndDate(new Date(prevProps.current.linkSOP.beginTime));
                setLinkSOP(prevProps.current.linkSOP);
                display();
            }
        }

        if (prevProps.current?.selectedSiteNo !== props.selectedSiteNo) {
            if (prevProps.current?.linkSOP === linkSOP)
                display();
        }

		prevProps.current = props;

    }, [props.selectedSiteNo, prevProps.linkSOP]);

	const loadActionStepNames = async () => {
		// 각 사이트별 단계배열 및 단계명 초기화
		const userInfo = ProjectResource.getUserInfo();

		if(userInfo) {
			await SopController.loadActionStepNames(userInfo.site_sn);
		}
	}

	const loadDisasterCategory = async () => {
		const [disasterCategories, message] = await SopController.disasterCategories(null, props.selectedSiteNo);
		setDisasterCategories(disasterCategories);
    }

	const display = async () => {

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

		const disasterCategoryName = selectDisasterType === '전체' ? null : selectDisasterType;
		const actionStepName = selectActionStep === '전체' ? null : selectActionStep;

		setLoadingIndicator(true);

		let [dataSource, totalCount, message] = await HistoryController.requestSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, props.selectedSiteNo, disasterCategoryName, actionStepName, selectUserName, pageItemCount, pageIndex);

		if (dataSource) {
			let datacount = dataSource.length;
	
			if (selectUserName.length > 0) {
				let realDataSource = [];
				for (let i = 0; i < datacount; i++) {
					if (dataSource[i].userName.indexOf(selectUserName) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
							
				dataSource = realDataSource;
				datacount = dataSource.length;
			}
	
			const newTotalCount = Math.ceil(totalCount / pageItemCount);
	
			setDataSource(dataSource);
			setTotalCount(newTotalCount);
			setListCount(totalCount);
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

	const getMakeTime = (dateTime) => {
		let hour = dateTime.getHours();
		hour = hour >= 10 ? hour : '0' + hour;
		let min = dateTime.getMinutes();
		min = min >= 10 ? min : '0' + min;
		let sec = dateTime.getSeconds();
		sec = sec >= 10 ? sec : '0' + sec;

		let strDate = hour + ':' + min + ':' + sec;
		return strDate;
	}

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

	const onChangeDisasterType = (value) => {
		setSelectDisasterType(value);
    }

	const onChangeStep = (value) => {
		setSelectActionStep(value);
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

	const onChangeSelectedUser = (value) => {
		setSelectUserName(value);
	}

	const searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			display();
		}
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
		const siteNo = userInfo.site_sn;
		const disasterCategoryName = selectDisasterType === '전체' ? null : selectDisasterType;
		const actionStepName = selectActionStep === '전체' ? null : selectActionStep;
		const userName = selectUserName ? selectUserName : null;

		// 전체 다운로드
		if (!isCheckedDownload) {
			const [success, message] = await HistoryController.downloadAllSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, siteNo, disasterCategoryName, actionStepName, userName);

			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}
		}
		else {
			const actionStepHistoryNoList = getActionStepHistoryNoList();

			const [success, message] = await HistoryController.downloadPartialSOPHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, disasterCategoryName, actionStepName, actionStepHistoryNoList);

			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}
		}
	}

	const getActionStepHistoryNoList = () => {
		const actionStepHistoryNoList = [];

		if (dataSource && dataSource.length > 0) {
			for (const data of dataSource) {
				if (data.checked) {
					actionStepHistoryNoList.push(data.actionStepHistoryNo);
				}
			}
		}

		return actionStepHistoryNoList;
	}

	const getSensorTypes = () => {
		let ui = [];
		ui.push(<option key={'disaster_all'} value={'전체'}>전체</option>);

		if (disasterCategories) {
			for (let i = 0; i < disasterCategories.length; i++) {
				if (selectDisasterType === disasterCategories[i].disasterCategory.lclas_name) {
					ui.push(<option key={'disaster_' + i} value={disasterCategories[i].disasterCategory.lclas_name} selected>{disasterCategories[i].disasterCategory.lclas_name}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={disasterCategories[i].disasterCategory.lclas_name}>{disasterCategories[i].disasterCategory.lclas_name}</option>);
				}
            }
        }

		return ui;
    }

	const onDetailInfo = (data) => {
		setSelectedData(data);
		setSubContent('상세보기');
	}

	const changeSubContent = (subContent) => {
		setSubContent(subContent);
	}

	const onClickDatepicker01 = () => {
		refDatepicker01.current.setOpen(true);
	}

	const onClickDatepicker02 = () => {
		refDatepicker02.current.setOpen(true);
	}

	const getActionStepNames = () => {
		const actionStepNames = SopManagerResource.actionStepName;
	
		if (!actionStepNames) {
			return (
				<>
					<option key="전체" value="전체">전체</option>
					<option key="관심" value="관심">관심</option>
					<option key="주의" value="주의">주의</option>
					<option key="경계" value="경계">경계</option>
					<option key="심각" value="심각">심각</option>
				</>
			);
		} else {
			const ui = [];
			ui.push(<option key="all" value="전체">전체</option>);
	
			Object.entries(actionStepNames).forEach(([key, value], index) => {
				if (value) {
					ui.push(
						<option key={key || `option-${index}`} value={value}>
							{value}
						</option>
					);
				}
			});
	
			return ui;
		}
	};

	const setPage = (page) => {
		setPageIndex(page);
    }

	return (
		<SOPHistoryComponent>
			<div id={'hsty'}>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>SOP 이력</span>
						<form action="">
							<div className={'hscSch'}>
								<ul className={'hscsHalf'}>
									<li>
										<dl>
											<dt>재난유형</dt>
											<dd>
												<select name="" id="" onChange={(e) => onChangeDisasterType(e.target.value)} className={'selWh'}>
													{getSensorTypes()}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>SOP 단계</dt>
											<dd>
												<select name="" id="" onChange={(e) => onChangeStep(e.target.value)} className={'selWh'}>
													{getActionStepNames()}
												</select>
											</dd>
										</dl>
									</li>
									<li>
										<dl>
											<dt>실행자</dt>
											<dd>
												<input type="text" name="" id="" value={selectUserName} onChange={(e) => onChangeSelectedUser(e.target.value)} onKeyUp={searchEnterKey} />
											</dd>
										</dl>
									</li>
								</ul>

								<dl>
									<dt>조회기간</dt>
									<dd>
										<ul className={'hscsDate'}>
											<li>
												<div className={'datepicker'}>
													<DatePicker ref={refDatepicker01} name="datepicker01" id="datepicker01"
														dateFormat="yyyy-MM-dd"
														locale={ko}
														maxDate={new Date()}
														selected={beginDate}
														onChange={date => onChangeBegin(date)} />
													<img src={btnCalendarBk} onClick={onClickDatepicker01} alt="" className={'btnCalendarBk'} />
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
														onChange={date => onChangeEnd(date)} />
													<img src={btnCalendarBk} onClick={onClickDatepicker02} alt="" className={'btnCalendarBk'} />
												</div>
											</li>
										</ul>
										<ul className={'hscsRdoPeriod'}>
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => onClickDateType('select')} checked={dateType === 'select'} /><label htmlFor="hscsRdo01">기간선택</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => onClickDateType('today')} checked={dateType === 'today'} /><label htmlFor="hscsRdo02">오늘</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => onClickDateType('week')} checked={dateType === 'week'} /><label htmlFor="hscsRdo03">1주</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => onClickDateType('month')} checked={dateType === 'month'} /><label htmlFor="hscsRdo04">1개월</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo05" onChange={() => onClickDateType('year')} checked={dateType === 'year'} /><label htmlFor="hscsRdo05">1년</label></li>
										</ul>
									</dd>
								</dl>
								{
									loadingIndicator === true ?
										<a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										:
										<a onClick={display} className={'hscsSbmtSOP'}><span><span>검색</span></span></a>
								} 
							</div>
						</form>
						{
							loadingIndicator === true ?
								<ul className={'hscExl'}>
									<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
									<li><a className={'exl'} id={'hscsSbmting'}>선택 다운로드</a></li>
								</ul>
								:
								<ul className={'hscExl'}>
									<li><a onClick={() => onClickDownloadFile(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => onClickDownloadFile(true)} className={'exl'}>선택 다운로드</a></li>
								</ul>
						}
						<div className={'hscSOPTb'}>
							<div className={'scrSOPTb'}>
								<table>
									<colgroup>
										<col style={{ width: '3%' }} />
										<col style={{ width: '3%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
											<th>NO</th>
											<th>재난유형</th>
											<th>SOP 이름</th>
											<th>SOP 단계</th>
											<th>센서명</th>
											<th>위치</th>
											<th>시작일시</th>
											<th>종료일시</th>
											<th>실행자</th>
											<th>상세대응이력</th>
										</tr>
									</thead>
									<tbody>
										{
											displayContent && displayContent.length > 0 ?
											displayContent : <tr className='noData'><td colSpan={11}>조회된 데이터가 없습니다</td></tr>
										}
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
					</div>
				</div>
				{
					(subContent && subContent === '상세보기') ?
						<SOPHistoryDetailInfo changeSubContent={changeSubContent} selectedData={selectedData} />
						: <> </>
				}
			</div>
		</SOPHistoryComponent>
	);

} export default SOPHistory;