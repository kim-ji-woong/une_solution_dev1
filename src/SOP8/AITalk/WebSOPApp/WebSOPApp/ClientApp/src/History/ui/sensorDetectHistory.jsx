import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectResource from '../../Root/resource/id';
import Pagination from '../../Common/ui/pagination';
import AutoContentTooltip from '../../Common/ui/autoContentTooltip';
import { SensorDetectHistoryComponent } from '../styled/SensorDetectHistoryStyled';

import memoIcon from '../images/memo.svg';
import memoIcon_disabled from '../images/memo_disabled.svg';
import EventMemo from '../../SDMS/ui/popups/eventMemo';
import Icon from '../../Common/components/Icon/Icon';

const SensorDetectHistory = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		resetPage
	}))

	const [dataSource, setDataSource] = useState(null);

	const [dateType, setDateType] = useState('today');
	const [beginDate, setBeginDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const [selectSensorType, setSelectSensorType] = useState(-1);			// 센서유형

	const [selectedGroupNo, setSelectedGroupNo] = useState(-1);
	const [selectedBuildingNo, setSelectedBuildingNo] = useState(-1);
	const [selectedZoneNo, setSelectedZoneNo] = useState(-1);

	const [loadingIndicator, setLoadingIndicator] = useState(false);		// 새로고침중인지 표시

    const [pageItemCount, setPageItemCount] = useState(13);
	const [pageIndex, setPageIndex] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [listCount, setListCount] = useState(0);

	const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용
	const [displayContent, setDisplayContent] = useState([]);

	const [showMemoPopup, setShowMemoPopup] = useState(false);
	const [memo, setMemo] = useState(null);

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
					<tr key={'dataSource_' + (data.rowNo)} className={'activeBackgroundTr clickArea' + (data.checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
						<td className={'clickArea'}><input type="checkbox" className='clickArea' checked={data.checked || false} onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
						<td className={'clickArea'}>{index}</td>
						<td className={'clickArea'}>{props.formatIsoToDateTime(data.beginTime)}</td>
						<td className={'clickArea'}>{data.endTime ? props.formatIsoToDateTime(data.endTime) : '-'}</td>
						<td className={'clickArea'}>{data.sensorTypeName}</td>
						<td className={'clickArea'}>{data.sensorName}</td>
						<td className={'clickArea'}>{data.locationName}</td>
						<td className={'clickArea'}>{data.clearType ? data.clearType : '-'}</td>
						<td className={'clickArea'}>{data.alarmDepthName}</td>
						<td className={'clickArea'}>{data.sopName ? data.sopName : '-'}</td>
						<td 
							className={'clickArea'}
							onClick={() => {if (data.memo) {handleMemoPopup(data.memo);}}}
						>
							<img 
								src={data.memo ? memoIcon : memoIcon_disabled} 
								alt='메모보기 버튼' 
								style={{ cursor: data.memo ? 'pointer' : 'default' }}
							/>
						</td>
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

	const resetPage = () => {
		setDataSource(null);
		onClickDateType('today');
		setSelectSensorType(-1);
		setSelectedZoneNo(-1);
		setDisplayContent([]);
	}

	const handleTooltip = (e, bool) => {
        if(!bool) {
            setAutoContentTooltip({ show: false });
        }
        else {
            const target = e.target;
            const parent = e.target.parentElement;
            setAutoContentTooltip({ show: true, target: target, parent: parent });
        }
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

		const sensorTypeDatas = null;

		// 검색 버튼을 통해 조회 시 pageIndex는 무조건 1
		const index = isTriggeredByClick ? 1 : pageIndex;

		let sensorSubTypes = null;

		const [dataSource, totalCount, message] = await HistoryController.requestSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageItemCount, index, sensorTypeDatas, (selectedGroupNo > 0 ? selectedGroupNo : null), (selectedBuildingNo > 0 ? selectedBuildingNo : null), (selectedZoneNo > 0 ? selectedZoneNo : null), null, (selectSensorType > 0 ? selectSensorType : null), sensorSubTypes);

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

	const getSensorTypeBySensorTypeIdx = (sensorTypeNo) => {
		for (const sensorType of props.sensorTypes) {
			if (sensorType.sensorTypeCode === sensorTypeNo) {
				return [sensorType.co_code, sensorType.sensorSubTypes];
			}
		}
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

	const onChangeSensorType = (value) => {
		setSelectedZoneNo(-1);
		setSelectSensorType(value);
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
		const siteNo = userInfo.site_sn;

		const [beginYear, beginMonth, beginDay, ,] = getMakeDateTime(beginDate);
		const [endYear, endMonth, endDay, ,] = getMakeDateTime(endDate);
		const sensorTypeDatas = null;

		let sensorType = null;
		let sensorSubTypes = null;

		if (selectSensorType > 0) {
			[sensorType, sensorSubTypes] = getSensorTypeBySensorTypeIdx(selectSensorType);
		}

		// 전체 다운로드
		if (!isCheckedDownload) {
			const [success, message] = await HistoryController.downloadAllSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, null, null, selectedZoneNo < 0 ? null : selectedZoneNo, null, siteNo);

			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}
		}
		else {
			const checkedList = getCheckedList();

			const [success, message] = await HistoryController.downloadPartialSensorDetectHistory(checkedList, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, null, null, selectedZoneNo < 0 ? null : selectedZoneNo);

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

	const getSensorTypes = () => {
		let ui = [];

		ui.push(<li key={'sensorType_all'}><input type="radio" name="sensorType" id="sensorType_all" onChange={() => onChangeSensorType(-1)} checked={selectSensorType < 0} /><label htmlFor="sensorType_all">전체</label></li>);

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
				ui.push(
					<li key={`sensorType_${sensorType.sensorTypeCode}`}>
						<input 
							type="radio" 
							name="sensorType" 
							id={`sensorType_${sensorType.sensorTypeCode}`} 
							onChange={() => onChangeSensorType(sensorType.sensorTypeCode)} 
							checked={selectSensorType === sensorType.sensorTypeCode} 
						/>
						<label htmlFor={`sensorType_${sensorType.sensorTypeCode}`}>{sensorType.sensorTypeName}</label>
					</li>
				);
            }
        }

		return ui;
    }

	const setPage = (page) => {
		setPageIndex(page);
    }

	const groups = props.buildingGroups ?? [];

	// 위치 선택 -> 선택된 부모에 따라 자식 목록을 계산
	const buildingsOfSelectedGroup = useMemo(() => {
		const gNo = selectedGroupNo === '' ? null : Number(selectedGroupNo);
		return groups.find(g => g.buildingGroupNo === gNo)?.buildingDatas ?? [];
	}, [groups, selectedGroupNo]);

	const zonesOfSelectedBuilding = useMemo(() => {
		const bNo = selectedBuildingNo === '' ? null : Number(selectedBuildingNo);
		return buildingsOfSelectedGroup.find(b => b.buildingNo === bNo)?.zoneDatas ?? [];
	}, [buildingsOfSelectedGroup, selectedBuildingNo]);

	const handleChangeGroup = (e) => {
		const value = e.target.value;
		setSelectedGroupNo(Number(value));
		setSelectedBuildingNo(-1);
		setSelectedZoneNo(-1);
	};

	const handleChangeBuilding = (e) => {
		const value = e.target.value;
		setSelectedBuildingNo(Number(value));
		setSelectedZoneNo(-1);
	};

	const handleChangeZone = (e) => {
		const value = e.target.value;
		setSelectedZoneNo(Number(value));
	};

	const getBuildingGroupOptions = () => {
		return groups.map(g => (
			<option key={`group_${g.buildingGroupNo}`} value={g.buildingGroupNo}>
				{g.displayText}
			</option>
		));
	};

	const getBuildingOptions = () => {
		return buildingsOfSelectedGroup.map(b => (
			<option key={`building_${b.buildingNo}`} value={b.buildingNo}>
				{b.displayText}
			</option>
		));
	};

	const getZoneOptions = () => {
		return zonesOfSelectedBuilding.map(z => (
			<option key={`zone_${z.zoneNo}`} value={z.zoneNo}>
				{z.displayText}
			</option>
		));
	};

	const handleMemoPopup = (memo) => {
		setMemo(memo);
		setShowMemoPopup(true);
	} 

	const closeMemoPopup = () => {
		setMemo(null);
        setShowMemoPopup(false);
    }

	return (
		<>
			<SensorDetectHistoryComponent>
				<div id={'hsty'}>
					{
						autoContentTooltip.show &&
						<AutoContentTooltip
							direction={"bottom"}
							color={"black"}
							node={autoContentTooltip}
						/>
					}
					<div className={'hsScr'}>
						<div className={'hsCont'} id={'hsCont'}>
							<span className={'hsContTitle'}>이벤트 탐지 이력</span>
							<form action="">
								<div className={'hscSch'}>
									<dl>
										<dt>이벤트 유형</dt>
										<dd>
											<ul className='sensorTypesWrap'>
												{getSensorTypes()}
											</ul>
										</dd>
									</dl>
									<dl className='buildingWrap'>
										<dt>발생위치</dt>
										<dd>
											<select
												value={selectedGroupNo}
												onChange={handleChangeGroup}
												className="selWh"
											>
												<option value="-1">전체</option>
												{getBuildingGroupOptions()}
											</select>
										</dd>
										<dd>
											<select
												value={selectedBuildingNo}
												onChange={handleChangeBuilding}
												className="selWh"
												disabled={selectedGroupNo < 0} // 부모 선택 전 비활성화
											>
												<option value="-1">전체</option>
												{getBuildingOptions()}
											</select>
										</dd>
										<dd>
											<select
												value={selectedZoneNo}
												onChange={handleChangeZone}
												className="selWh"
												disabled={selectedBuildingNo < 0} // 부모 선택 전 비활성화
											>
												<option value="-1">전체</option>
												{getZoneOptions()}
											</select>
										</dd>
									</dl>
									<dl>
										<dt>발생일시</dt>
										<dd>
											<ul className={'hscsDate'}>
												<li>
													<div className={'datepicker'}>
														<DatePicker ref={refDatepicker01} name="datepicker01" id="datepicker01"
															dateFormat="yyyy-MM-dd"
															locale={ko}
															maxDate={new Date()}
															selected={beginDate}
															onChange={date => onChangeBegin(date)}
															className={'datePickerCss'}
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
											<a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><CircularProgress className="spinner" /></span></a>
											:
											<a onClick={() => display(true)} className={'hscsSbmtSOP'}><span>검색하기</span></a>
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

							<div className={'hscTb clickArea'} id={'hscTb'}> 
								<div className={'scrTb clickArea'}>
									<table className={'clickArea'}>
										<colgroup className={'clickArea'}>
											<col style={{ width: '3%' }} />
											<col style={{ width: '5%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '7%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} />
											<col style={{ width: '10%' }} /> 
											<col style={{ width: '7%' }} />
										</colgroup>
										<thead className={'clickArea'}>
											<tr className={'clickArea'}>
												<th className={'clickArea'}><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
												<th className={'clickArea'}>NO</th>
												<th className={'clickArea'}>발생일시</th>
												<th className={'clickArea'}>종료일시</th>
												<th className={'clickArea'}>이벤트 유형</th>
												<th className={'clickArea'}>센서명</th>
												<th className={'clickArea'}>위치</th>
												<th className={'clickArea'}>탐지정보</th>
												<th className={'clickArea'}>단계</th>
												<th className={'clickArea'}>대응 SOP</th>
												<th className={'clickArea'}>메모</th>
											</tr>
										</thead>
										<tbody className={'clickArea'}>
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
				</div>
			</SensorDetectHistoryComponent>
			{
				showMemoPopup &&
				<EventMemo
					popupType='History'
					alarmMemo={memo}
					closeMemoPopup={closeMemoPopup}
				/>
			}
		</>
	);
})

export default SensorDetectHistory;