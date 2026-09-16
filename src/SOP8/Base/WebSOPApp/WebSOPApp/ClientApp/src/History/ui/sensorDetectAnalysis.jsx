import React, { useState, useEffect, useRef } from 'react';
import $, { data } from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { Bar } from 'react-chartjs-2';
import btnCalendarBk from '../../Common/images/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';
import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';
import SdmsResource from '../../SDMS/resource/id';
import { SensorDetectAnalysisComponent } from '../styled/SensorDetectHistoryStyled';


function SensorDetectHistory(props) {

	const [selectedBuildingGroupID, setSelectedBuildingGroupID] = useState(-1);
    const [selectedBuildingID, setSelectedBuildingID] = useState(-1);
    const [selectedZoneID, setSelectedZoneID] = useState(-1);
    const [searchZoneName, setSearchZoneName] = useState('-');

    const [facilityType, setFacilityType] = useState(-1);		// -1:전체, 0:화재, 11:누출, 900:CCTV
    const [dataSource, setDataSource] = useState(null);
    const [maxRowCount, setMaxRowCount] = useState(9);			// 한 페이지에 보여줄 data row 수
    const [maxPageCount, setMaxPageCount] = useState(5);		// 한번에 보여줄 페이지 개수
    const [pageIndex, setPageIndex] = useState(1);				// 현재 페이지
	const [minPageIndex, setMinPageIndex] = useState(1);	// 최소 페이지 Index
    const [maxPageIndex, setMaxPageIndex] = useState(1);		// 최대 페이지 Index
	const [IsKnowPageIndex, setIsKnowPageIndex] = useState(true);	// 순서대로 조회할 경우 페이지 번호를 알 수 있지만 끝에서부터 조회하면 알 수 없다.	
    
	const [havePrevPage, setHavePrevPage] = useState(false);	// 이전 데이터가 있나?
    const [haveAfterPage, setHaveAfterPage] = useState(false);	// 이후 데이터가 있나?
	
	const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [selectedDate, setSelectedDate] = useState(null);
    const [allDetectCount, setAllDetectCount] = useState(0);
    const [allMalfunctionRate, setAllMalfunctionRate] = useState(0);
    const [maxCountSensorName, setMaxCountSensorName] = useState('');

    const [loadingIndicator, setLoadingIndicator] = useState(false);

	const prevProps = useRef(null);

    const refDatepicker01 = useRef(null);
    const refDatepicker02 = useRef(null);

    useEffect(() => {
        if (props.selectedSiteNo) {
            display();
        }
    }, []);

    useEffect(() => {
        if (prevProps.current?.selectedSiteNo !== props?.selectedSiteNo) {
            display();
        }

		prevProps.current = props;

    }, [props.selectedSiteNo]);

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			xAxes: [
				{
					display: true,
					ticks: {
						maxTicksLimit: 10, //x축에 표시할 최대 눈금 수
					},
				},
			],
			yAxes: [
				{
					id: 'A',
					display: true,
					position: 'left',
					ticks: {
						beginAtZero: true,
						stepSize: 20
					},
				},
				{
					id: 'B',
					display: true,
					type: 'linear',
					position: 'right',
					ticks: {
						beginAtZero: true,
						stepSize: 25,
						min: 0,
						max: 100,
						//y축 scale 값에 % 붙이기 위해 사용
						callback: function (value) {
							return value + "%";
						}
					}
				}
			]
		}
	} // chart 옵션

	const chartLegend = {
		display: true,
		position: 'top'
	}  // chart 옵션


	const display = async () => {
		$("body").css("cursor", "wait");

		const beginDateValue = getMakeDateTime(beginDate) + ' 00:00:00';
		const endDateValue = getMakeDateTime(endDate) + ' 23:59:59';

		if (beginDateValue > endDateValue) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
			return;
		}

		setLoadingIndicator(true);

		const buildingGroupID = selectedBuildingGroupID;
		const buildingID = selectedBuildingID;
		const zoneID = selectedZoneID;

		const result = await HistoryController.DisplaySensorDetectAnalysis(beginDateValue, endDateValue, facilityType, buildingGroupID, buildingID, zoneID, props.selectedSiteNo);
		if (!result) {
			$("body").css("cursor", "default");
			setLoadingIndicator(false);		
			return;
        }

		const allDetectCount = result.allDetectCount;
		const allMalfunctionRate = result.allMalfunctionRate
		const maxCountSensorName = result.maxCountSensorName;
		const searchZoneName = result.searchZoneName;

		const dataSource = result.sensorDetectAnalysisDatas;
		const datacount = dataSource.length;
		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		const selectedDate = getMakeDateTime(beginDate) + ' ~ ' + getMakeDateTime(endDate);

		$("body").css("cursor", "default");

		setDataSource(dataSource);
		setMaxPageIndex(maxPageIndex);
		setIsKnowPageIndex(true);
		setSelectedDate(selectedDate);
		setAllDetectCount(allDetectCount);
		setAllMalfunctionRate(allMalfunctionRate);
		setMaxCountSensorName(maxCountSensorName);
		setSearchZoneName(searchZoneName);
		setPageIndex(1);
		setLoadingIndicator(false);
	}

	const onClickPrevSearch = async (bVery) => {
		let isDesc = true;
		let searchLastID = -1;
		let searchRowCount = maxRowCount * maxPageCount;
		if (bVery) {
			searchLastID = maxID +1; // maxID도 포함해서 조회해야 하기 때문에 +1한다([<=]가 아닌 [<] 필터임)
		}
		else {
			if (!IsKnowPageIndex) {
				searchRowCount = maxRowCount;
			}

			searchLastID = dataSource[0].sensorZoneHistoryID;// currentPageMaxID;

			console.log(searchLastID);
			isDesc = false; // 현재값보다 큰값으로 조회해야함
        }

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			searchBeginDate, searchEndDate,
			searchFacilityType,
			searchBuildingGroupID, searchBuildingID, searchZoneID,
			searchLastID, searchRowCount, isDesc, props.selectedSiteNo
		);

		let havePrevPage = false;
		let haveAfterPage = false;		

		if (minID < currentLastID) {
			// 뒤에 데이터 더 있음

			haveAfterPage = true;
		}

		const datacount = dataSource.length;
		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		let pageIndex = -1;
		let minPageIndex = -1;

		let IsKnowPageIndex = true;

		if (bVery) { // 맨처음
			havePrevPage = false;
			pageIndex = 1;
			minPageIndex = 1;
			IsKnowPageIndex = true;
		}
		else { // 이전
			if (!IsKnowPageIndex) {
				pageIndex = maxPageIndex;
				minPageIndex = pageIndex;

				IsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				minPageIndex = minPageIndex - maxPageCount;
				pageIndex = minPageIndex - 1;
				//pageIndex = minPageIndex;
				maxPageIndex = pageIndex;//maxPageIndex - maxPageIndex;
			}

			if (maxID <= dataSource[0].sensorZoneHistoryID) {
				havePrevPage = false;
            }
		}

		setDataSource(dataSource);
		setCurrentLastID(currentLastID);
		setPageIndex(pageIndex);
		setMinPageIndex(minPageIndex);
		setMaxPageIndex(maxPageIndex);
		setHavePrevPage(havePrevPage);
		setHaveAfterPage(haveAfterPage);
		setIsKnowPageIndex(IsKnowPageIndex);
	}

	const onClickAfterSearch = async (bVery) => {
		let isDesc = true;
		let searchLastID = -1;
		let searchRowCount = maxRowCount * maxPageCount;

		if (bVery) {
			searchLastID = minID - 1// maxID도 포함해서 조회해야 하기 때문에 +1한다([<=]가 아닌 [<] 필터임)
			isDesc = false;
			searchRowCount = maxRowCount; // 맨 끝으로 이동하므로 10개씩 구해옴

		}
		else {
			if (!IsKnowPageIndex) {
				searchRowCount = maxRowCount;
			}
			searchLastID = currentLastID; //currentPageMinID
			isDesc = true;
		}

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			searchBeginDate, searchEndDate,
			searchFacilityType,
			searchBuildingGroupID, searchBuildingID, searchZoneID,
			searchLastID, searchRowCount, isDesc, props.selectedSiteNo
		);

		let havePrevPage = true;
		let haveAfterPage = false;
		
		const datacount = dataSource.length;
		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		let pageIndex = -1;

		let IsKnowPageIndex = true;
		if (bVery) { // 맨끝
			IsKnowPageIndex = false;

			pageIndex = maxPageIndex;
		}
		else { // 다음
			if (!IsKnowPageIndex) {
				pageIndex = maxPageIndex;

				IsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				pageIndex = maxPageIndex + 1;
				maxPageIndex = maxPageIndex + maxPageIndex;
			}

			if (minID < currentLastID) {
				// 뒤에 데이터 더 있음
				haveAfterPage = true;
			}
		}

		setDataSource(dataSource);
		setCurrentLastID(currentLastID);
		setPageIndex(pageIndex);
		setMinPageIndex(pageIndex);
		setMaxPageIndex(maxPageIndex);
		setHavePrevPage(havePrevPage);
		setHaveAfterPage(haveAfterPage);
		setIsKnowPageIndex(IsKnowPageIndex);
    }

	const getMakeDateTime = (dateTime) => {
		let year = dateTime.getFullYear();
		let month = 1 + dateTime.getMonth();
		month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
		let day = dateTime.getDate();                   //d
		day = day >= 10 ? day : '0' + day;

		let strDate = year + '-' + month + '-' + day;
		return strDate;
	}

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

	const handlePageIndex = (index) => {
		if (pageIndex === index) {
			return;
		}
		if (maxPageIndex < index || index < 1) {
			return;
		}

		setPageIndex(index);
	}

	const onChangeBegin = (date) => {
		setBeginDate(date);
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		setDateType('select');
	}

	const onChangeEnd = (date) => {
		setEndDate(date);
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		//let korFormat = year + "-" + month + "-" + day;

		setDateType('select');
	}

	const onChangeBuildingGroup = (target) => {
		setSelectedBuildingGroupID(Number(target.value));
		setSelectedBuildingID(-1);
		setSelectedZoneID(-1);
	}

	const onChangeBuilding = (target) => {
		setSelectedBuildingID(Number(target.value));
		setSelectedZoneID(-1);
	}

	const onChangeZone = (target) => {
		setSelectedZoneID(Number(target.value));
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

		//let korFormat = year + "-" + month + "-" + day;

		setBeginDate(date);
		setEndDate(today);
		setDateType(dateType);

	}

	const onClickDownload = async (isCheckedDownload) => {
		const title = '센서 탐지 분석';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:H2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = getMakeDateTime(beginDate);
		const endDate = getMakeDateTime(endDate);
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['조회 범위' + ' : ' + searchZoneName]);
		worksheet.addRow([]);

		let content1 = ('센서탐지분석 요약1', { selectedDate: selectedDate, searchZoneName: searchZoneName, allDetectCount: allDetectCount, allMalfunctionRate: allMalfunctionRate});
		let content2 = ('센서탐지분석 요약2', { maxCountSensorName: ((maxCountSensorName && maxCountSensorName.length > 0) ? maxCountSensorName : '-') });

		//let content = selectedDate + '동안 ';
		//content += searchZoneName + '의 센서 탐지 횟수는' + allDetectCount + '회 이며 ';
		//content += '오작동률은 ' + allMalfunctionRate + ' % 입니다.'
		//let content2 = '가장 많은 오작동을 일으킨 센서는 ' + ((maxCountSensorName && maxCountSensorName.length > 0) ? maxCountSensorName : '-') + '입니다.'

		worksheet.addRow([content1]);
		worksheet.addRow([content2]);

		const chart = document.getElementById('chart_analysis2');
		let img = chart.toDataURL(1.0);
		let img2 = workbook.addImage({ base64: img, extension: 'png' });
		worksheet.addImage(img2, 'A9:H14');

		// 빈칸 10칸 띄우기
        for (let i = 0; i < 10; i++) {
			worksheet.addRow([]);
        }		

		// column
		let columnRow = worksheet.addRow(['No', '유형', '위치', '센서명', '탐지 횟수', '오작동', '현장 복구', '오작동률(%)']);
		columnRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '#A24B40' }
			};
			cell.style = {
				alignment: { vertical: 'middle', horizontal: 'center' }
			};
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}

		});

		// column key 설정 
		worksheet.columns = [
			{ key: "no", width: 5 },
			{ key: "type", width: 15 },
			{ key: "zoneName", width: 20 },
			{ key: "sensorName", width: 25 },
			{ key: "detectCount", width: 13 },
			{ key: "malfunctionCount", width: 13 },
			{ key: "endCount", width: 13 },
			{ key: "malfunctionRate", width: 13 }
		];

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = dataSource[i].checked;
				if (isCheckedDownload && !checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const type = dataSource[i].type;
				const zoneName = dataSource[i].zoneName;
				const sensorName = dataSource[i].sensorName;
				const detectCount = dataSource[i].detectCount;
				const malfunctionCount = dataSource[i].malfunctionCount;
				const endCount = dataSource[i].endCount;
				const malfunctionRate = dataSource[i].malfunctionRate;

				data.no = no;
				data.type = type;
				data.zoneName = zoneName;
				data.sensorName = sensorName;
				data.detectCount = detectCount;
				data.malfunctionCount = malfunctionCount;
				data.endCount = endCount;
				data.malfunctionRate = malfunctionRate;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					type: item.type,
					zoneName: item.zoneName,
					sensorName: item.sensorName,
					detectCount: item.detectCount,
					malfunctionCount: item.malfunctionCount,
					endCount: item.endCount,
					malfunctionRate: item.malfunctionRate
				}).alignment = { vertical: 'middle', horizontal: 'center' };
			})
		}

		// 다운로드 
		const mimeType = { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], mimeType);

		const dtNow = new Date();
		const date = getMakeDateTime(dtNow).replace(/-/gi, '');
		const time = getMakeTime(dtNow).replace(/:/gi, '');

		saveAs(blob, title + '_' + date + '_' + time + ".xlsx");
	}

	const onClickFacilityType = (facilityType) => {
		setFacilityType(facilityType)
    }

	// 하단 페이지 index 만들기
	const getPageIndexUI = () => {
		let ui = [];
		if (!dataSource) {
			return ui;
		}

		if (IsKnowPageIndex) {
			for (let i = minPageIndex; i <= maxPageIndex; i++) {
				if (i === pageIndex) {
					ui.push(<li key={'pageIndex_' + (i)} className={'on'}><a>{i}</a></li>);
				}
				else {
					ui.push(<li key={'pageIndex_' + (i)}><a onClick={() => handlePageIndex(i)}>{i}</a></li>);
				}
			}
		}
		else {
			ui.push(<li key={'pageIndex_'} className={'on'}><a>...</a></li>);
        }

		return ui;
	}

	const onCheckedRow = (checked, index) => {
		const updatedDataSource = [...dataSource];
		
		const datacount = dataSource.length;
		if (index === -1) {
			//let beginIndex = 0;
			//if (pageIndex > 1) {
			//	beginIndex = (pageIndex - 1) * maxRowCount;
			//}
			const beginIndex = (pageIndex - minPageIndex) * maxRowCount;

			for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {
				if (datacount < i + 1) {
					break;
				}
				updatedDataSource[i].checked = checked;
			}
		}
		else {			
			updatedDataSource[index].checked = checked;
			props.setLastClickRow(checked ? index : null);
		}
		setDataSource(updatedDataSource);
	}

	/* const onClickCheckbox = (sensorZoneHistoryID) => {
        const activeTr = document.getElementById('hsTbTr' + sensorZoneHistoryID);
        const checkedTr = document.querySelector('.lineOn');
        //console.log(checkedTr);

		if(checkedTr){
			checkedTr.classList.replace('lineOn', 'colorOn');
		}
		activeTr.classList.toggle('lineOn');
	} */

	const getGridData = () => {
		let gridUI = [];
		let chartUI = [];
		if (!dataSource) {
			return [gridUI, chartUI, false];
		}

		const dataTemp = {};
		dataTemp.labels = [];
		dataTemp.detectCount = [];
		dataTemp.detectRate = [];

		/*let allDetectCount = 0;
		let allDetectRate = 0;*/
		//const dataSource = dataSource;
		const datacount = dataSource.length;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;

		if (pageIndex > 1) {
			beginIndex = (pageIndex - 1) * maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {

			if (datacount < i + 1) {
				break;
			}

			gridUI.push(<tr key={'dataSource_' + (i)} className={'activeBgAnalysisTr clickArea' + (dataSource[i].checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
				<td className={'clickArea'}><input type="checkbox" className='clickArea' checked={dataSource[i].checked} /* onClick={(event) => onClickCheckbox(dataSource[i].sensorZoneHistoryID, event)} */ onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
				<td className={'clickArea'}>{i + 1}</td>
				<td className={'clickArea'}>{dataSource[i].type}</td>
				<td className={'clickArea'}>{dataSource[i].zoneName}</td>
				<td className={'clickArea'}>{dataSource[i].sensorName}</td>
				<td className={'clickArea'}>{dataSource[i].detectCount}</td>
				<td className={'clickArea'}>{dataSource[i].malfunctionCount}</td>
				<td className={'clickArea'}>{dataSource[i].endCount}</td>
				<td className={'clickArea'}>{dataSource[i].userResetCount}</td>
				<td className={'clickArea'}>{dataSource[i].malfunctionRate}%</td>
			</tr>);

			dataTemp.labels.push(dataSource[i].sensorName);
			dataTemp.detectCount.push(dataSource[i].detectCount);
			dataTemp.detectRate.push(dataSource[i].detectRate);

			//allDetectCount += dataSource[i].detectCount;

			rowCount++;
			if (allChecked && !dataSource[i].checked) {
				allChecked = false;
			}
		}

		//for (let i = 0; i < dataTemp.detectCount.length; i++) {
		//	allDetectRate += (dataTemp.detectCount[i] / allDetectCount) * 100;
		//	dataTemp.detectRate.push(allDetectRate);
		//}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
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

		chartUI.push(<Bar key={'chart_analysis2'} id='chart_analysis2' data={data} legend={chartLegend} options={chartOptions} />)

		return [gridUI, chartUI, allChecked];
	}

	const getSpatailUI = () => {
		let buildingGroupUI = [];
		let buildingUI = [];
		let zoneUI = [];

		buildingGroupUI.push(<option key={'buildingGroupOption_-1'} value="-1">전체</option>);
		buildingUI.push(<option key={'buildingOption_-1'} value="-1">전체</option>);
		zoneUI.push(<option key={'zoneOption_-1'} value="-1">전체</option>);

		if (!props.buildingGroupList) {
			return [buildingGroupUI, buildingUI, zoneUI];
		}

		const buildingGroupLength = props.buildingGroupList.length;
		for (let i = 0; i < buildingGroupLength; i++) {
			const buildingGroup = props.buildingGroupList[i];

			if (selectedBuildingGroupID === buildingGroup.id) {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id} selected>{buildingGroup.displayText}</option>);

				const buildingLength = buildingGroup.buildingDatas.length;
				for (let j = 0; j < buildingLength; j++) {
					const building = buildingGroup.buildingDatas[j];					
					if (selectedBuildingID === building.id) {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id} selected>{building.displayText}</option>);

						const zoneLength = building.zoneDatas.length;
						for (var k = 0; k < zoneLength; k++) {
							const zone = building.zoneDatas[k];
							if (selectedZoneID === zone.id) {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id} selected>{zone.displayText}</option>);
							}
							else {
								zoneUI.push(<option key={'zoneOption_' + zone.id} value={zone.id}>{zone.displayText}</option>);
                            }
						}
					}
					else {
						buildingUI.push(<option key={'buildingOption_' + building.id} value={building.id}>{building.displayText}</option>);
                    }
				}
			}
			else {
				buildingGroupUI.push(<option key={'buildingGroupOption_' + buildingGroup.id} value={buildingGroup.id}>{buildingGroup.displayText}</option>);
            }
        }

		return [buildingGroupUI, buildingUI, zoneUI];
    }

	const onClickDatepicker01 = () => {
		refDatepicker01.current.setOpen(true);
	}

	const onClickDatepicker02 = () => {
		refDatepicker02.current.setOpen(true);
	}

	const getSensorTypeUI = () => {
		let sensorTypeUI = [];

		if (props.useSensorTypes?.UseFire === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType0" onChange={() => onClickFacilityType(SdmsResource.facilityType.FIRE)} checked={facilityType === SdmsResource.facilityType.FIRE} /><label htmlFor="hscsType0">화재</label></li>);
		}
		if (props.useSensorTypes?.UsePSM === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType11" onChange={() => onClickFacilityType(SdmsResource.facilityType.PSM_SENSOR)} checked={facilityType === SdmsResource.facilityType.PSM_SENSOR} /><label htmlFor="hscsType11">누출</label></li>);
		}
		if (props.useSensorTypes?.UseETC === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType21" onChange={() => onClickFacilityType(SdmsResource.facilityType.ETC)} checked={facilityType === SdmsResource.facilityType.ETC} /><label htmlFor="hscsType21">기타</label></li>);
		}

		if (props.useSensorTypes?.UseEnvironment === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType117" onChange={() => onClickFacilityType(SdmsResource.facilityType.Environment)} checked={facilityType === SdmsResource.facilityType.Environment} /><label htmlFor="hscsType117">환경설비</label></li>);
		}
		if (props.useSensorTypes?.UseManufacture === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType118" onChange={() => onClickFacilityType(SdmsResource.facilityType.Manufacture)} checked={facilityType === SdmsResource.facilityType.Manufacture} /><label htmlFor="hscsType118">제조설비</label></li>);
		}

		if (props.useSensorTypes?.UseSVMS === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType900" onChange={() => onClickFacilityType(SdmsResource.facilityType.Intrusion_S1)} checked={facilityType === SdmsResource.facilityType.Intrusion_S1} /><label htmlFor="hscsType900">SVMS</label></li>);
		}
		if (props.useSensorTypes?.UseEarthquake === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType50" onChange={() => onClickFacilityType(SdmsResource.facilityType.Earthquake)} checked={facilityType === SdmsResource.facilityType.Earthquake} /><label htmlFor="hscsType50">지진</label></li>);
		}
		if (props.useSensorTypes?.UseStrongWind === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType18" onChange={() => onClickFacilityType(SdmsResource.facilityType.STRONG_WIND)} checked={facilityType === SdmsResource.facilityType.STRONG_WIND} /><label htmlFor="hscsType18">강풍</label></li>);
		}
		if (props.useSensorTypes?.UseBlackOut === true) {
			sensorTypeUI.push(<li><input type="radio" name="hscsType" id="hscsType17" onChange={() => onClickFacilityType(SdmsResource.facilityType.BLACKOUT)} checked={facilityType === SdmsResource.facilityType.BLACKOUT} /><label htmlFor="hscsType17">정전</label></li>);
		}

		return sensorTypeUI;
	}

	/*
	const onClickRecentlybox = () => {
		const element = document.getElementById('recentlyCheckbox');
		const elementBox = document.getElementById('recentlyBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}

	const onClickCheckbox = () => {
		const element = document.getElementById('activeCheckbox');
		const elementBox = document.getElementById('activeBoxArea');

		element.classList.toggle('on');
		elementBox.classList.toggle('on');
	}
	*/

	const [buildingGroupUI, buildingUI, zoneUI] = getSpatailUI();
	const pageIndexUI = getPageIndexUI();
	const [gridUI, chartUI, allChecked] = getGridData();
	const sensorTypeUI = getSensorTypeUI();

	return (
		<SensorDetectAnalysisComponent>
			<div>
				<div className={'hsScr'}>
					<div id={'hsCont'}>
						<span className={'hsContTitle'}>센서 탐지 분석</span>
						<form action="">
							<div className={'hscSch'}>
								<dl>
									<dt>센서유형</dt>
									<dd>
										<ul className={'hscsRdo'}>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => onClickFacilityType(-1)} checked={facilityType === -1} /> <label htmlFor="hscsTypeAll">전체</label></li>
											{/* <li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => onClickFacilityType(-1)} checked={facilityType === -1} /> <label htmlFor="hscsTypeAll">대기오염</label></li>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => onClickFacilityType(-1)} checked={facilityType === -1} /> <label htmlFor="hscsTypeAll">저감설비</label></li>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => onClickFacilityType(-1)} checked={facilityType === -1} /> <label htmlFor="hscsTypeAll">배출설비</label></li> */}
											{sensorTypeUI}
										</ul>
									</dd>
								</dl>
								<dl>
									<dt>위치</dt>
									<dd>
										<ul className={'hscsLoc'}>
											<li>
												<select name="" id="" onChange={(e) => onChangeBuildingGroup(e.target)} className={'selWh'}>
													{buildingGroupUI}
												</select>
											</li>
											<li>
												<select name="" id="" onChange={(e) => onChangeBuilding(e.target)} className={'selWh'}>
													{buildingUI}
												</select>
											</li>
											<li>
												<select name="" id="" onChange={(e) => onChangeZone(e.target)} className={'selWh'}>
													{zoneUI}
												</select>
											</li>
										</ul>
									</dd>
								</dl>
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
													<img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={onClickDatepicker01} />
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
													<img src={btnCalendarBk} alt="" className={'btnCalendarBk'} onClick={onClickDatepicker02} /> 
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
										<a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
										:
										<a onClick={display} className={'hscsSbmt'}><span><span>검색</span></span></a>
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
									<li><a onClick={() => onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
									<li><a onClick={() => onClickDownload(true)} className={'exl'}>선택 다운로드</a></li>
								</ul>
						}

						<p className={'hscWng'}>
							<span>{selectedDate}</span> 동안 <span>{searchZoneName}</span>의 센서 탐지 횟수는 <span>{allDetectCount}</span>회 이며 오작동률은 <span>{allMalfunctionRate}%</span> 입니다.
									가장 많은 오작동을 일으킨 센서는 <span>{(maxCountSensorName && maxCountSensorName.length > 0) ? maxCountSensorName : '-'}</span> 입니다.
							</p>

						<div className={'hscCht'} id='chart_analysis'>
							{chartUI}
						</div>

						<div className={'hscTb'}>
							<div className={'scrAnalysisTb'}>
								<table>
									<colgroup>
										<col style={{ width: '5%' }} />
										<col style={{ width: '5%' }} />
										<col style={{ width: '10%' }} />
										<col style={{ width: '24%' }} />
										<col style={{ width: '10%' }} />
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
											<th>센서유형</th>
											<th>센서명</th>
											<th>위치</th>
											<th>탐지횟수</th>
											<th>오작동</th>
											<th>현장 복구</th>
											<th>사용자 복구</th>
											<th>오작동률(%)</th>
										</tr>
									</thead>
									<tbody>
										{gridUI}
									</tbody>
								</table>
							</div>

							{
								(dataSource && dataSource.length > 0) ?
									<div className={'hscNav'}>
										{
											(havePrevPage) ?
												<>
													<a className={'first'} onClick={() => onClickPrevSearch(true)} /* onClick={() => setPageIndex(1)} */>맨 앞</a>
													<a className={'prev'} onClick={() => onClickPrevSearch(false)} /* onClick={() => setPageIndex(pageIndex - 1)} */>이전</a>
												</>
												:
												<>
													<a className={'firstDisable'}>맨 앞</a>
													<a className={'prevDisable'}>이전</a>
												</>
										}
										<ul>
											{pageIndexUI}
										</ul>
										{
											(haveAfterPage) ?
											<>
												<a className={'next'} onClick={() => onClickAfterSearch(false)} /* onClick={() => setPageIndex(pageIndex + 1)} */>다음</a>
												<a className={'last'} onClick={() => onClickAfterSearch(true)} /* onClick={() => setPageIndex(maxPageIndex)} */>맨 뒤</a>
											</>
											:
											<>
												<a className={'nextDisable'}>다음</a>
												<a className={'lastDisable'}>맨 뒤</a>
											</>
										}
									</div>
									: <> </>
							}
						</div>
					</div>
				</div>
			</div>
		</SensorDetectAnalysisComponent>
	);
} export default SensorDetectHistory;