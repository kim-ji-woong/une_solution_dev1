import React, { useState, useEffect, useRef, useMemo } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectResource from '../../Root/resource/id';
import Pagination from '../../Common/ui/pagination';
import { SensorDetectAnalysisComponent } from '../styled/SensorDetectHistoryStyled';
import { Bar } from 'react-chartjs-2';
import DropBox from '../../Common/components/dropBox';
import BoxButton from '../../Common/components/boxButton';
import Icon from '../../Common/components/Icon/Icon';
import EmptyContent from '../../Common/components/emptyContent';

function SensorDetectAnalysis(props) {
	const [openDropId, setOpenDropId] = useState(null);

	const [displayZones, setDisplayZones] = useState([]);
	const [dataSource, setDataSource] = useState(null);
	const [summary, setSummary] = useState(null);

	const [dateType, setDateType] = useState('today');
	const [beginDate, setBeginDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState('');
	const [searchZoneName, setSearchZoneName] = useState('-');

	const [selectSensorType, setSelectSensorType] = useState(-1);			// 센서유형
	const [selectZone, setSelectZone] = useState(-1);						// 위치

	const [loadingIndicator, setLoadingIndicator] = useState(false);		// 새로고침중인지 표시

	const [pageItemCount, setPageItemCount] = useState(8);
	const [pageIndex, setPageIndex] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [listCount, setListCount] = useState(0);

	const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용
	const [displayContent, setDisplayContent] = useState([]);

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
		// 알람을 받는 센서유형의 센서만 추리기 (위치 selectBox에 들어갈 데이터)
		const displayZones = [];
		displayZones.push({ value: -1, label: '전체' });
	
		if (!props.sensorList) return;

		for (const sensor of props.sensorList) {
			const isAlarmSensor = sensor.sensorType.alarm_yn;
			const hasZones = sensor.zones.length > 0;
			const isMatchingType = selectSensorType < 0 || selectSensorType === sensor.sensorType.sensor_type_idx;
	
			if (isAlarmSensor && hasZones && isMatchingType) {
				for (const zone of sensor.zones) {
					displayZones.push({ value: zone.sensorLink.zone_sn, label: zone.sensorLink.sensor_name });
				}
			}
		}
	
		setDisplayZones(displayZones);
	}, [props.sensorList, selectSensorType]);

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
						<td className={'clickArea'}>{data.sensorTypeName}</td>
						<td className={'clickArea'}>{data.sensorName}</td>
						<td className={'clickArea'}>{data.locationName}</td>
						<td className={'clickArea'}>{data.detectCount ?? '-'}</td>
						<td className={'clickArea'}>{data.malfunctionCount ?? '-'}</td>
						<td className={'clickArea'}>{data.sensorClearCount ?? '-'}</td>
						<td className={'clickArea'}>{data.userResetCount ?? '-'}</td>
						<td className={'clickArea'}>{data.malfunctionRatio ?? '-'}</td>
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

		const sensorTypeDatas = getSensorTypeDatas();

		// 검색 버튼을 통해 조회 시 pageIndex는 무조건 1
		const index = isTriggeredByClick ? 1 : pageIndex;

		let sensorType = null;
		let sensorSubTypes = null;

		if (selectSensorType > 0) {
			[sensorType, sensorSubTypes] = getSensorTypeBySensorTypeIdx(selectSensorType);
		}

		const [dataSource, summary, totalCount, message] = await HistoryController.requestSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, pageItemCount, index, sensorTypeDatas, null, null, selectZone < 0 ? null : selectZone, null, sensorType, sensorSubTypes);

		if (dataSource) {
			const newTotalCount = Math.ceil(totalCount / pageItemCount);
			const selectedDate = beginDateValue + ' ~ ' + endDateValue;
	
			setDataSource(dataSource);
			setSummary(summary);
			setTotalCount(newTotalCount);
			setListCount(totalCount);
			setSelectedDate(selectedDate);
			setSearchZoneName(selectZone < 0 ? '전체' : getZoneName(selectZone));

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

	const getSensorTypeDatas = () => {
		let sensorTypeDatas = [];

		for (const sensorType of props.sensorTypes) {
			if (sensorType.sensorSubTypes) {
				for (const sensorSubType of sensorType.sensorSubTypes) {
					sensorTypeDatas.push(
						{
							"sensorTypeCode": sensorType.co_code,
							"sensorSubTypeNo": sensorSubType,
							"sensorTypeName": sensorType.sensor_type_name
						}
					);
				}
			}
		}

		return sensorTypeDatas;
	}

	const getSensorTypeBySensorTypeIdx = (sensorTypeNo) => {
		for (const sensorType of props.sensorTypes) {
			if (sensorType.sensor_type_idx === sensorTypeNo) {
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
		setSelectZone(-1);
		setSelectSensorType(value);
	}

	const handleChangeZone = (value) => {
		setSelectZone(Number(value));
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
		const sensorTypeDatas = getSensorTypeDatas();

		let sensorType = null;
		let sensorSubTypes = null;

		if (selectSensorType > 0) {
			[sensorType, sensorSubTypes] = getSensorTypeBySensorTypeIdx(selectSensorType);
		}

		// 전체 다운로드
		if (!isCheckedDownload) {
			const [success, message] = await HistoryController.downloadAllSensorAnalysisHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, null, null, selectZone < 0 ? null : selectZone, null, siteNo);

			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}
		}
		else {
			const checkedList = getCheckedList();

			const [success, message] = await HistoryController.downloadPartialSensorAnalysisHistory(checkedList, beginYear, beginMonth, beginDay, endYear, endMonth, endDay, sensorTypeDatas, sensorType, sensorSubTypes, null, null, selectZone < 0 ? null : selectZone);

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

		ui.push(<li key={'sensorType_all'}><label><input type="radio" name="sensorType" onChange={() => onChangeSensorType(-1)} checked={selectSensorType < 0} />전체</label></li>);

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
				ui.push(
					<li key={`sensorType_${sensorType.sensor_type_idx}`}>
						<label>
							<input 
								type="radio" 
								name="sensorType" 
								onChange={() => onChangeSensorType(sensorType.sensor_type_idx)} 
								checked={selectSensorType === sensorType.sensor_type_idx} 
							/>
						{sensorType.sensor_type_name}</label>
					</li>
				);
            }
        }

		return ui;
    }

	const setPage = (page) => {
		setPageIndex(page);
	}

	const getSummaryDatas = () => {
		if (!summary) return [];

		const totalDetectionCount = summary.totalDetectionCount;
		const totalMalfunctionRatio = Number(summary.totalMalfunctionRatio.toFixed(1));
		const topMalfunctionSensorName = summary.topMalfunctionSensorName ?? '-';

		return <p className='summaryWrap'>
				<span>{selectedDate}</span> 동안 <span>{searchZoneName}</span>의 센서 탐지 횟수는 <span>{totalDetectionCount}</span>회 이며 오작동률은 <span>{totalMalfunctionRatio}%</span> 입니다. 가장 많은 오작동을 일으킨 센서는 <span>{topMalfunctionSensorName}</span> 입니다.
			</p>
	}

	const getZoneName = (zoneNo) => {
		for (const sensor of props.sensorList) {
			const isAlarmSensor = sensor.sensorType.alarm_yn;
			const hasZones = sensor.zones.length > 0;
	
			if (isAlarmSensor && hasZones) {
				for (const zone of sensor.zones) {
					if (zone.sensorLink.zone_sn === zoneNo) {
						return zone.sensorLink.sensor_name;
					}
				}
			}
		}
		
		return '-';
	}

	const getChart = () => {
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [
					{
						display: true,
						ticks: {
							fontColor: '#FFFFFF',
							maxTicksLimit: 10, //x축에 표시할 최대 눈금 수
						},
						gridLines: {
							display: false,
						},
					},
				],
				yAxes: [
					{
						id: 'A',
						display: true,
						position: 'left',
						ticks: {
							fontColor: '#FFFFFF',
							beginAtZero: true,
							stepSize: 20
						},
						gridLines: {
							display: false,
						},
					},
					{
						id: 'B',
						display: true,
						type: 'linear',
						position: 'right',
						fontColor: '#FFFFFF',
						ticks: {
							fontColor: '#FFFFFF',
							beginAtZero: true,
							stepSize: 25,
							min: 0,
							max: 100,
							//y축 scale 값에 % 붙이기 위해 사용
							callback: function (value) {
								return value + "%";
							}
						},
						gridLines: {
							color: '#2A3344', // x축 그리드 선 색상 (선택)
						},
					}
				]
			},
			legend: {
				display: true,
				labels: {
					fontColor: '#FFFFFF' // 범례 텍스트 흰색
				}
			},
		} // chart 옵션

		const dataTemp = {};
		dataTemp.labels = [];
		dataTemp.detectCount = [];
		dataTemp.detectRate = [];

		for (let i = 0; i < dataSource?.length; i++) {
			dataTemp.labels.push(dataSource[i].sensorName);
			dataTemp.detectCount.push(dataSource[i].detectCount);
			dataTemp.detectRate.push(Number(dataSource[i].accumulationRatio.toFixed(1)));
		}

		const data = {
			labels: dataTemp.labels,
			datasets: [
				{
					label: '탐지 횟수',
					data: dataTemp.detectCount,
					backgroundColor: '#0095FF',
					fill: false,
					barThickness: 20,
					pointStyle: 'rectRounded',
					yAxisID: 'A'
				},
				{
					type: 'line',
					label: '누적 탐지율',
					data: dataTemp.detectRate,
					//backgroundColor: 'rgba(247, 169, 43, 0.8)',
					borderColor: '#7000FF',
					//borderDash: [5, 5],
					//backgroundColor: "#e755ba",
					//pointBackgroundColor: "#55bae7",
					pointBorderColor: '#7000FF',
					pointRadius: 10, // 포인트 사이즈
					pointHoverRadius: 10, // 포인트 호버 사이즈
					//pointHoverBackgroundColor: "#55bae7",
					//pointHoverBorderColor: "#55bae7",
					fill: false,
					pointStyle: 'triangle',
					yAxisID: 'B'
				}
			]
		};

		return <Bar key={'chart_analysis2'} id='chart_analysis2' data={data} options={chartOptions} />
	}

	return (
		<SensorDetectAnalysisComponent>
			<div className='contents'>
				<p className='title'>센서 탐지 이력</p>
				<ul className='searchWrap'>
					<li>
						<p>센서 유형</p>
						<div>
							<ul className='sensorTypesWrap'>
								{getSensorTypes()}
							</ul>
						</div>
					</li>
					<li className='dropWrap'>
						<p>위치</p>
						<DropBox
							size="xs"
							id="zone"
							value={selectZone}
							onChange={handleChangeZone}
							options={displayZones}
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
											<Icon.IconCalendar size='xs' />
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
											<Icon.IconCalendar size='xs' />
										</button>
									</div>
								</li>
							</ul>
							<ul className='selectDateWrap'>
								<li><label><input type="radio" name="hscsRdo" onChange={() => onClickDateType('select')} checked={dateType === 'select'} />기간선택</label></li>
								<li><label><input type="radio" name="hscsRdo" onChange={() => onClickDateType('today')} checked={dateType === 'today'} />오늘</label></li>
								<li><label><input type="radio" name="hscsRdo" onChange={() => onClickDateType('week')} checked={dateType === 'week'} />1주</label></li>
								<li><label><input type="radio" name="hscsRdo" onChange={() => onClickDateType('month')} checked={dateType === 'month'} />1개월</label></li>
								<li><label><input type="radio" name="hscsRdo" onChange={() => onClickDateType('year')} checked={dateType === 'year'} />1년</label></li>
							</ul>
						</div>
					</li>
					<BoxButton
						className="submitBtn"
						variant="fill"
						size="sm"
						leftIcon={<Icon.Search />}
						onClick={() => display(true)}
					>
						검색
					</BoxButton>
				</ul>

				<ul className='downloadWrap'>
					{/* 전체 다운로드: 데이터가 없으면 비활성화 */}
					<li>
						<BoxButton
							variant="ghost"
							size="sm"
							leftIcon={<Icon.Fileload size={"xs"} />}
							onClick={hasData ? () => onClickDownloadFile(false) : undefined}
							disabled={!hasData}
						>
							전체 다운로드
						</BoxButton>
					</li>

					{/* 선택 다운로드: 데이터가 없거나, 체크된 데이터가 없으면 비활성화 */}
					<li>
						<BoxButton
							variant="ghost"
							size="sm"
							leftIcon={<Icon.Fileload size={"xs"} />}
							onClick={hasChecked ? () => onClickDownloadFile(true) : undefined}
							disabled={!hasChecked}
						>
							선택 다운로드
						</BoxButton>
					</li>
				</ul>

				{
					getSummaryDatas()
				}

				<div className={'hscCht'} id='chart_analysis'>
					{getChart()}
				</div>

				{displayContent && displayContent.length > 0 ?
					<div className={'hscTb'}>
						<div className={'scrTb'}>
							<table>
								<colgroup>
									<col style={{ width: '3%' }} />
									<col style={{ width: '3%' }} />
									<col style={{ width: '18%' }} />
									<col style={{ width: '18%' }} />
									<col style={{ width: '18%' }} />
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
										<th>센서 유형</th>
										<th>센서 명</th>
										<th>위치</th>
										<th>탐지횟수</th>
										<th>오작동 횟수</th>
										<th>현장 복구</th>
										<th>사용자 복구</th>
										<th>오작동 률</th>
									</tr>
								</thead>
								<tbody>
									{displayContent}
								</tbody>
							</table>
						</div>
						{(listCount > 0) &&
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
							title="선택한 조건에 해당하는 센서 탐지 분석이 존재하지 않습니다."
							description="조회 조건을 다시 설정하여 검색하세요"
						/>
					</div>
				}
			</div>
		</SensorDetectAnalysisComponent>
	);
} 

export default SensorDetectAnalysis;