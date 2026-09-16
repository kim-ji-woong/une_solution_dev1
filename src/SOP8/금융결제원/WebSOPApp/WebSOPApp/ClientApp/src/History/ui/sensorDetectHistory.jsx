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
import EmptyContent from '../../Common/components/emptyContent';
import DropBox from '../../Common/components/dropBox';
import SdmsResource from '../../SDMS/resource/id';
import IconButton from '../../Common/components/iconButton';

const SensorDetectHistory = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		resetPage
	}))

	const [openDropId, setOpenDropId] = useState(null);
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
					<tr key={'dataSource_' + (data.rowNo)} className={data.checked ? ' colorOn' : ''}>
						<td><input type="checkbox" checked={data.checked || false} onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
						<td>{index}</td>
						<td>{props.formatIsoToDateTime(data.beginTime)}</td>
						<td>{data.endTime ? props.formatIsoToDateTime(data.endTime) : '-'}</td>
						<td>{(data.sensorTypeName === '화재' && !data.isManual) ? '금융결제원' : data.locationName}</td>
						<td>{data.sensorTypeName}</td>
						<td>{data.sensorName}</td>
						<td>{data.isManual ? '수동신고' : '센서탐지'}</td>
						<td>{data.alarmDepthName}</td>
						<td>{data.sopName ? data.sopName : '-'}</td>
						<td>{data.clearType ? data.clearType : '-'}</td>
						<td>
							<IconButton
								variant="unfill_white"
								size="xxs"
								icon={<Icon.MemoIcon size={"xs"} />}
								disabled={!data.memo}
								onClick={() => {if (data.memo) {handleMemoPopup(data.memo);}}}
							>
								메모
							</IconButton>
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

	// 체크된 데이터가 있는지 확인
	const hasChecked = useMemo(() => {
		return dataSource?.some(d => d.checked);
	}, [dataSource]);

	// 데이터가 존재하는지
	const hasData = dataSource && dataSource.length > 0;

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

		ui.push(
			<li key={'sensorType_all'}>
				<input 
					type="radio" 
					name="sensorType" 
					id="sensorType_all" 
					onChange={() => onChangeSensorType(-1)} 
					checked={selectSensorType < 0} 
				/>
				<label htmlFor="sensorType_all">전체</label>
			</li>
		);

		if (props.sensorTypes && props.sensorTypes.length > 0) {
			// sensorTypeCode 기준 오름차순 정렬
			const sortedSensorTypes = [...props.sensorTypes].sort(
				(a, b) => a.sensorTypeCode - b.sensorTypeCode
			);

			for (const sensorType of sortedSensorTypes) {

				if (sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV) continue;

				ui.push(
					<li key={`sensorType_${sensorType.sensorTypeCode}`}>
						<input
							type="radio"
							name="sensorType"
							id={`sensorType_${sensorType.sensorTypeCode}`}
							onChange={() => onChangeSensorType(sensorType.sensorTypeCode)}
							checked={selectSensorType === sensorType.sensorTypeCode}
						/>
						<label htmlFor={`sensorType_${sensorType.sensorTypeCode}`}>
							{sensorType.sensorTypeName}
						</label>
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

	const handleChangeZone = (value) => {
		setSelectedGroupNo(-1);
		setSelectedBuildingNo(-1);
		setSelectedZoneNo(Number(value));
	};

	const getZoneOptions = () => {
		let options = [];

		options.push({ value: '-1', label: '전체' });

		for (const group of groups) {
			for (const building of group.buildingDatas) {
				for (const zone of building.zoneDatas) {
					options.push({ value: zone.zoneNo, label: zone.displayText });
				}
			}
		}

		return options;
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
				{
					autoContentTooltip.show &&
					<AutoContentTooltip
						direction={"bottom"}
						color={"black"}
						node={autoContentTooltip}
					/>
				}
				<div className='contents'>
					<p className='title'>이벤트 탐지 이력</p>
					<ul className='searchWrap'>
						<li>
							<p>이벤트 유형</p>
							<div>
								<ul className='sensorTypesWrap'>
									{getSensorTypes()}
								</ul>
							</div>
						</li>
						<li className='dropWrap'>
							<p>발생위치</p>
							<DropBox
								id="zone"
								value={selectedZoneNo}
								onChange={handleChangeZone}
								options={getZoneOptions()}
								openId={openDropId}
								setOpenId={setOpenDropId}
							/>
						</li>
						<li className='dateWrap'>
							<p>발생일시</p>
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
										<col style={{ width: '12%' }} />
										<col style={{ width: '12%' }} />
										<col style={{ width: '12%' }} />
										<col style={{ width: '12%' }} />
										<col style={{ width: '12%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} />
										<col style={{ width: '8%' }} /> 
										<col style={{ width: '8%' }} /> 
										<col style={{ width: '3%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
											<th>NO</th>
											<th>발생일시</th>
											<th>종료일시</th>
											<th>발생위치</th>
											<th>이벤트 유형</th>
											<th>센서 명</th>
											<th>탐지 방식</th>
											<th>위험 단계</th>
											<th>대응 SOP</th>
											<th>종료 처리</th>
											<th>메모</th>
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
								title="선택한 조건에 해당하는 이벤트 탐지 이력이 존재하지 않습니다."
								description="조회 조건을 다시 설정하여 검색하세요"
							/>
						</div>
					}
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