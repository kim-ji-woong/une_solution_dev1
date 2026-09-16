import React, { useState, useEffect, useRef } from 'react';
import $, { data } from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import Pagination from '../../Common/ui/pagination';
import AutoContentTooltip from '../../Common/ui/autoContentTooltip';

function SensorDetectHistory(props) {
	const [dataSource, setDataSource] = useState(null);

	// 현재 조회 데이터에 적용된 필터
    const [minID, setMinID] = useState(0);
    const [maxID, setMaxID] = useState(0);
    const [currentLastID, setCurrentLastID] = useState(0);
    const [searchBeginDate, setSearchBeginDate] = useState(new Date());
    const [searchEndDate, setSearchEndDate] = useState(new Date());
    const [searchFacilityType, setSearchFacilityType] = useState(-1);
    const [searchBuildingGroupID, setSearchBuildingGroupID] = useState(-1);
    const [searchBuildingID, setSearchBuildingID] = useState(-1);
    const [searchZoneID, setSearchZoneID] = useState(-1);

    const [searchZoneName, setSearchZoneName] = useState('-');

    const [selectedBuildingGroupID, setSelectedBuildingGroupID] = useState(-1);
    const [selectedBuildingID, setSelectedBuildingID] = useState(-1);
    const [selectedZoneID, setSelectedZoneID] = useState(-1);
    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [facilityType, setFacilityType] = useState(-1);

    const [maxRowCount, setMaxRowCount] = useState(18);		// 한 페이지에 보여줄 data row 수
    const [maxPageCount, setMaxPageCount] = useState(5);	// 한번에 보여줄 페이지 개수
    const [pageIndex, setPageIndex] = useState(1);			// 현재 페이지
    const [minPageIndex, setMinPageIndex] = useState(1);	// 최소 페이지 Index
    const [maxPageIndex, setMaxPageIndex] = useState(1);	// 최대 페이지 Index
    const [IsKnowPageIndex, setIsKnowPageIndex] = useState(true);	// 순서대로 조회할 경우 페이지 번호를 알 수 있지만 끝에서부터 조회하면 알 수 없다.

    const [havePrevPage, setHavePrevPage] = useState(false);	// 이전 데이터가 있나?
    const [haveAfterPage, setHaveAfterPage] = useState(false);	// 이후 데이터가 있나?
	
    const [loadingIndicator, setLoadingIndicator] = useState(false);	// 새로고침중인지 표시

    const [popupMemoHistoryID, setPopupMemoHistoryID] = useState(null);		// 메모 팝업에 표현할 SensorZoneHistoryID
    const [popupMemoContent, setPopupMemoContent] = useState(null);
    const [selectValue, setSelectValue] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [displayMemo, setDisplayMemo] = useState(props.popupMemoContent);

	const [autoContentTooltip, setAutoContentTooltip] = useState({
        show: false,
        target: null,
        parent: null
    });

	const prevProps = useRef(null);

    const refDatepicker01 = useRef();
    const refDatepicker02 = useRef();

	let currentPageMinID = -1;
	let currentPageMaxID = -1;


    useEffect(() => {
        if (props.selectedSiteNo) {
            onClickSearch();
        }
    }, []);

    useEffect(() => {
        if (prevProps.current?.selectedSiteNo !== props?.selectedSiteNo) {
			// onClickSearch();
        }

		prevProps.current = props;

    }, [props.selectedSiteNo]);

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

	const getMinMaxIndex = async (beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID) => {
		const [minID, maxID] = await HistoryController.GetMinMaxIndex(beginDate, endDate, facilityType, buildingGroupID, buildingID, zoneID);

		return [minID, maxID];
    }

	const onClickSearch = async () => {
		$("body").css("cursor", "wait");

		const beginDateValue = getMakeDateTime(beginDate) + ' 00:00:00';
		const endDateValue = getMakeDateTime(endDate) + ' 23:59:59';

		if (beginDateValue > endDateValue) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
			return;
		};

		setLoadingIndicator(true);
		
		const buildingGroupID = selectedBuildingGroupID;
		const buildingID = selectedBuildingID;
		const zoneID = selectedZoneID;

		const [minID, maxID] = await getMinMaxIndex(beginDateValue, endDateValue, facilityType, buildingGroupID, buildingID, zoneID);

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(beginDateValue, endDateValue, facilityType, buildingGroupID, buildingID, zoneID, -1, maxRowCount * maxPageCount, true, props.selectedSiteNo);

		if (dataSource === null && currentLastID === null) {
			$("body").css("cursor", "default");
			return;
		}

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

		let searchZoneName = '-';
		if (selectedBuildingGroupID === -1) {
			searchZoneName = '전체'
		}
		else {
			const buildingGroupLength = props.buildingGroupList.length;
			for (let i = 0; i < buildingGroupLength; i++) {
				const buildingGroup = props.buildingGroupList[i];

				if (selectedBuildingGroupID === buildingGroup.id) {
					searchZoneName = buildingGroup.displayText;

					if (selectedBuildingID === -1) {
						break;
					}

					const buildingLength = buildingGroup.buildingDatas.length;
					for (let j = 0; j < buildingLength; j++) {
						const building = buildingGroup.buildingDatas[j];
						if (selectedBuildingID === building.id) {
							searchZoneName += ' ' + building.displayText;
							if (selectedZoneID === -1) {
								break;
							}

							const zoneLength = building.zoneDatas.length;
							for (var k = 0; k < zoneLength; k++) {
								const zone = building.zoneDatas[k];
								if (selectedZoneID === zone.id) {
									searchZoneName += ' ' + zone.displayText;
									break;
								}
							}
						}
					}
				}
			}
		}

		$("body").css("cursor", "default");

		setDataSource(dataSource);
        setMaxPageIndex(maxPageIndex);
        setMinPageIndex(1);
        setPageIndex(1);
        setMinID(minID);
        setMaxID(maxID);
        setIsKnowPageIndex(true);
        setLoadingIndicator(false);
        setSearchBeginDate(beginDateValue);
        setSearchEndDate(endDateValue);
        setSearchFacilityType(facilityType);
        setSearchBuildingGroupID(buildingGroupID);
        setSearchBuildingID(buildingID);
        setSearchZoneID(zoneID);
        setSearchZoneName(searchZoneName);
        setCurrentLastID(currentLastID);
        setHavePrevPage(havePrevPage);
        setHaveAfterPage(haveAfterPage);
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
			isDesc = false; // 현재값보다 큰값으로 조회해야함
        }

		const [newDataSource, updateCurrentLastID] = await HistoryController.DisplaySensorDetectHistories(
			searchBeginDate, searchEndDate,
			searchFacilityType,
			searchBuildingGroupID, searchBuildingID, searchZoneID,
			searchLastID, searchRowCount, isDesc, props.selectedSiteNo
		);

		let havePrevPage = true;
		let haveAfterPage = false;		

		if (minID < updateCurrentLastID) {
			// 뒤에 데이터 더 있음
			haveAfterPage = true;
		}

		const datacount = newDataSource.length;
		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		let pageIndex = -1;
		let updateMinPageIndex = -1;

		let updateIsKnowPageIndex = true;

		if (bVery) { // 맨처음
			havePrevPage = false;
			pageIndex = 1;
			updateMinPageIndex = 1;
			updateIsKnowPageIndex = true;
		}
		else { // 이전
			if (!IsKnowPageIndex) {
				pageIndex = maxPageIndex;
				updateMinPageIndex = pageIndex;

				updateIsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				updateMinPageIndex = minPageIndex - maxPageCount;
				pageIndex = minPageIndex - 1;
				maxPageIndex = pageIndex;//maxPageIndex - maxPageIndex;
			}

			if (maxID <= newDataSource[0].sensorZoneHistoryID) {
				havePrevPage = false;
            }
		}

		setDataSource(newDataSource);
		setCurrentLastID(updateCurrentLastID);
		setPageIndex(pageIndex);
		setMinPageIndex(updateMinPageIndex);
		setMaxPageIndex(maxPageIndex);
		setHavePrevPage(havePrevPage);
		setHaveAfterPage(haveAfterPage);
		setIsKnowPageIndex(updateIsKnowPageIndex);
	}

	const onClickAfterSearch = async (bVery) => {
		let isDesc = true;
		let searchLastID = -1;
		let searchRowCount = maxRowCount * maxPageCount;
		let currentIsKnowPageIndex = IsKnowPageIndex;
		
		if (bVery) {
			searchLastID = minID - 1// maxID도 포함해서 조회해야 하기 때문에 +1한다([<=]가 아닌 [<] 필터임)
			isDesc = false;
			searchRowCount = maxRowCount; // 맨 끝으로 이동하므로 10개씩 구해옴
		}
		else {
			if (!currentIsKnowPageIndex) {
				searchRowCount = maxRowCount;
			}
			searchLastID = currentLastID; //currentPageMinID
			isDesc = true;
		}
		
		const [dataSource, updateCurrentLastID] = await HistoryController.DisplaySensorDetectHistories(
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
		let updateMaxPageIndex = value1 + ((value2 > 0) ? 1 : 0);
		
		let pageIndex = -1;
		
		let updateIsKnowPageIndex = true;
		if (bVery) { // 맨끝
			updateIsKnowPageIndex = false;

			pageIndex = updateMaxPageIndex;
		}
		else { // 다음
			if (!IsKnowPageIndex) {
				pageIndex = updateMaxPageIndex;

				updateIsKnowPageIndex = false; // 맨 끝에서부터 돌아왔기 때문에 페이지 계산 못함
			}
			else {
				pageIndex = maxPageIndex + 1;
				updateMaxPageIndex = updateMaxPageIndex + maxPageIndex;
			}

			if (minID < updateCurrentLastID) {
				// 뒤에 데이터 더 있음
				haveAfterPage = true;
			}
		}

		setDataSource(dataSource);
		setCurrentLastID(updateCurrentLastID);
		setPageIndex(pageIndex);
		setMinPageIndex(pageIndex);
		setMaxPageIndex(updateMaxPageIndex);
		setHavePrevPage(havePrevPage);
		setHaveAfterPage(haveAfterPage);
		setIsKnowPageIndex(updateIsKnowPageIndex);
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

	const handlePageIndex = async (index) => {
		if (pageIndex === index) {
			return;
		}
		if (maxPageIndex < index || index < 1) {
			return;
		}

		//const [dataSource, lastID] = await HistoryController.DisplaySensorDetectHistories(
		//	searchBeginDate, searchEndDate,
		//	searchFacilityType,
		//	searchBuildingGroupID, searchBuildingID, searchZoneID,
		//	currentLastID, maxRowCount
		//);
	    //setState({ dataSource, currentLastID: lastID, pageIndex: index });

		setPageIndex(index);
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

		let korFormat = year + "-" + month + "-" + day;

		setBeginDate(date);
		setEndDate(today);
		setDateType(dateType);

		//if (props.settings === null || props.settings === undefined)
		//	return;

		//props.settings.dashboardBegin = korFormat;
		//props.settings.dashboardEnd = korFormat;
	}

	const onClickFacilityType = (facilityType) => {
		setFacilityType(facilityType)
	}

	const onClickDownload = async (isCheckedDownload) => {
		const title = '센서 탐지 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:K2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const currentBeginDate = getMakeDateTime(beginDate);
		const currentEndDate = getMakeDateTime(endDate);
		worksheet.addRow(['조회 기간' + ' : ' + currentBeginDate + ' ~ ' + currentEndDate]);
		worksheet.addRow(['조회 범위' + ' : ' + searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '종료일시', '유형', '센서명', '위치', '실제/테스트', '탐지 유형', '탐지 정보', '위험경보 단계', '대응 SOP']);
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
			{ key: "time", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "type", width: 15 },
			{ key: "sensorName", width: 25 },
			{ key: "zoneName", width: 30 },
			{ key: "realMode", width: 15 },
			{ key: "detectType", width: 15 },
			{ key: "detectInfo", width: 15 },
			{ key: "alarmLevel", width: 15 },
			{ key: "sopName", width: 40 }
		];

		const [dataSource, currentLastID] = await HistoryController.DisplaySensorDetectHistories(
			searchBeginDate, searchEndDate, searchFacilityType
			, searchBuildingGroupID, searchBuildingID, searchZoneID,
			-1, -1, true, props.selectedSiteNo);

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
				const time = dataSource[i].time;
				const endTime = dataSource[i].endTime;
				const type = dataSource[i].type;
				const sensorName = dataSource[i].sensorName;
				const zoneName = dataSource[i].zoneName;
				const realMode = dataSource[i].realMode;
				const detectType = dataSource[i].detectType;
				const detectInfo = dataSource[i].detectInfo;
				const alarmLevel = dataSource[i].alarmLevel;
				const sopName = dataSource[i].sopName;

				data.no = no;
				data.time = time;
				data.endTime = endTime;
				data.type = type;
				data.sensorName = sensorName;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? '실제' : '테스트';
				data.detectType = detectType;
				data.detectInfo = detectInfo;
				data.alarmLevel = alarmLevel;
				data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					endTime: item.endTime,
					type: item.type,
					sensorName: item.sensorName,
					zoneName: item.zoneName,
					realMode: item.realMode,
					detectType: item.detectType,
					detectInfo: item.detectInfo,
					alarmLevel: item.alarmLevel,
					sopName: item.sopName
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

	const onClickSelectDownload = async () => {
		const title = '센서 탐지 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:K2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const currentBeginDate = getMakeDateTime(beginDate);
		const currentEndDate = getMakeDateTime(endDate);
		worksheet.addRow(['조회 기간' + ' : ' + currentBeginDate + ' ~ ' + currentEndDate]);
		worksheet.addRow(['조회 범위' + ' : ' + searchZoneName]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '종료일시', '유형', '센서명', '위치', '실제/테스트', '탐지 유형', '탐지 정보', '위험경보 단계', '대응 SOP']);
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
			{ key: "time", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "type", width: 15 },
			{ key: "sensorName", width: 25 },
			{ key: "zoneName", width: 30 },
			{ key: "realMode", width: 15 },
			{ key: "detectType", width: 15 },
			{ key: "detectInfo", width: 15 },
			{ key: "alarmLevel", width: 15 },
			{ key: "sopName", width: 40 }
		];

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const checked = dataSource[i].checked;
				if (!checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const time = dataSource[i].time;
				const endTime = dataSource[i].endTime;
				const type = dataSource[i].type;
				const sensorName = dataSource[i].sensorName;
				const zoneName = dataSource[i].zoneName;
				const realMode = dataSource[i].realMode;
				const detectType = dataSource[i].detectType;
				const detectInfo = dataSource[i].detectInfo;
				const alarmLevel = dataSource[i].alarmLevel;
				const sopName = dataSource[i].sopName;

				data.no = no;
				data.time = time;
				data.endTime = endTime;
				data.type = type;
				data.sensorName = sensorName;
				data.zoneName = zoneName;
				data.realMode = (realMode === '1') ? '실제' : '테스트';
				data.detectType = detectType;
				data.detectInfo = detectInfo;
				data.alarmLevel = alarmLevel;
				data.sopName = (sopName.length > 0) ? sopName : '-';

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					endTime: item.endTime,
					type: item.type,
					sensorName: item.sensorName,
					zoneName: item.zoneName,
					realMode: item.realMode,
					detectType: item.detectType,
					detectInfo: item.detectInfo,
					alarmLevel: item.alarmLevel,
					sopName: item.sopName
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

	const onCheckedRow = (checked, index) => {
		let updatedDataSource = [...dataSource];
		
		const datacount = dataSource.length;
		if (index === -1) {
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

	const onLinkSOP = (actionStepHistoryID, beginTime) => {
		if (!actionStepHistoryID || actionStepHistoryID === -1) {
			return;
		}

		const linkSOP = {
			beginTime: beginTime,
			actionStepHistoryID: actionStepHistoryID
		};

		props.changeContent(HistoryResource.menu.SOP_이력, linkSOP);
	}

	const setPopupMemo = (isOpen, sensorZoneHistoryID, memoContent) => {
		if (!isOpen) {
			const select = document.querySelector('.activeBackgroundTr');
			select.classList.remove('memoOn');
		}
		
		if (isOpen && sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
			// 메모 팝업 열기
			const select = document.querySelector('.activeBackgroundTr');
			select.classList.toggle('memoOn');

			setPopupMemoHistoryID(sensorZoneHistoryID);
			setPopupMemoContent(memoContent);
		}
		else {
			if (sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
				// 메모 저장 후
				const dataSource = [...dataSource];
				const dataLength = dataSource.length;
				for (let i = 0; i < dataLength; i++) {
					if (dataSource[i].sensorZoneHistoryID === sensorZoneHistoryID) {
						dataSource[i].memo = memoContent;
						break;
                    }
                }
			}
			
			setPopupMemoHistoryID(null);
			setPopupMemoContent(null);
		} 
	}
	
	const getGridData = () => {		
		let ui = [];
		if (!dataSource) {
			return [ui, false];
		}

		const isAlarmMemo = useAlarmMemo();	// 알람메모 옵션 여부 확인

		const datacount = dataSource.length;

		let rowCount = 0;
		let allChecked = true; // 전체 체크 여부

		// 데이터를 읽을 시작할 배열값
		let beginIndex = (pageIndex - minPageIndex) * maxRowCount;//0;

		for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			if (dataSource[i]) {
				if (i == beginIndex) {
					currentPageMaxID = dataSource[i].sensorZoneHistoryID;
				}
				if (i == beginIndex + maxRowCount - 1) {
					currentPageMinID = dataSource[i].sensorZoneHistoryID;
				}
	
				let sopLinkClassName = null;
				if (dataSource[i].sopName.length > 0) {
					sopLinkClassName = 'colTextLink';
				}
	
				let haveMemoClassName = 'HisMemoOff';
	
				if (dataSource[i].memo !== null && dataSource[i].memo.length > 0) {
					haveMemoClassName = 'HisMemoOn';
				}
	
				ui.push(
					<React.Fragment key={'dataSource_' + (i)}>
						<tr key={'dataSource_' + (i)} className={'activeBackgroundTr clickArea' + (dataSource[i].checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
							<td className={'clickArea'}>
								<input 
									type="checkbox" 
									className='clickArea' 
									checked={dataSource[i].checked || ''} 
									onChange={(e) => onCheckedRow(e.target.checked, i)} 
								/>
							</td>
							<td className={'clickArea'}>{dataSource[i].sensorZoneHistoryID}</td>
							<td className={'clickArea'}>{dataSource[i].time}</td>
							<td className={'clickArea'}>{dataSource[i].endTime}</td>
							<td className={'clickArea'}>{dataSource[i].type}</td>
							<td className={'clickArea'}><span onMouseEnter={(e) => handleTooltip(e, true)} onMouseLeave={(e) => handleTooltip(e, false)}>{dataSource[i].sensorName}</span></td>
							<td className={'clickArea'}><span onMouseEnter={(e) => handleTooltip(e, true)} onMouseLeave={(e) => handleTooltip(e, false)}>{dataSource[i].zoneName}</span></td>
							<td className={'clickArea'}>{dataSource[i].detectInfo}</td>
							<td className={'clickArea'}>{dataSource[i].alarmLevel}</td>
							<td className={sopLinkClassName + 'clickArea'} onClick={() => onLinkSOP(dataSource[i].sensorZoneHistoryID, dataSource[i].sopBeginTime)}>{(dataSource[i].sopName.length > 0) ? dataSource[i].sopName : '-'}</td>
							<td className={haveMemoClassName} onClick={() => setPopupMemo(true, dataSource[i].sensorZoneHistoryID, dataSource[i].memo)}><span className={haveMemoClassName + ' ' + 'content'}></span></td>
						</tr>
					</React.Fragment>
				);
	
				rowCount++;
				if (allChecked && !dataSource[i].checked) {
					allChecked = false;
				}
			}
		}

		if (rowCount === 0 && allChecked) {
			allChecked = false;
		}

		return [ui, allChecked];
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

	const useAlarmMemo = () => {
		const userInfo = ProjectResource.getUserInfo();

		if (userInfo?.options?.ui?.useAlarmMemo === true) {
			return true;
		}

		return false;
	}

	const getSensorTypeUI = () => {
		let sensorTypeUI = [];

		if (props.useSensorTypes?.UseFire === true) {
			sensorTypeUI.push(<li key='sensorType_fire'><input type="radio" name="hscsType" id="hscsType0" onChange={() => onClickFacilityType(0)} checked={facilityType === 0} /><label htmlFor="hscsType0">화재</label></li>);
		}
		if (props.useSensorTypes?.UsePSM === true) {
			sensorTypeUI.push(<li key='sensorType_psm'><input type="radio" name="hscsType" id="hscsType11" onChange={() => onClickFacilityType(11)} checked={facilityType === 11} /><label htmlFor="hscsType11">누출</label></li>);
		}
		if (props.useSensorTypes?.UseETC === true) {
			sensorTypeUI.push(<li key='sensorType_etc'><input type="radio" name="hscsType" id="hscsType21" onChange={() => onClickFacilityType(21)} checked={facilityType === 21} /><label htmlFor="hscsType21">기타</label></li>);
		}

		if (props.useSensorTypes?.UseEnvironment === true) {
			sensorTypeUI.push(<li key='sensorType_environment'><input type="radio" name="hscsType" id="hscsType117" onChange={() => onClickFacilityType(117)} checked={facilityType === 117} /><label htmlFor="hscsType117">환경설비</label></li>);
		}
		if (props.useSensorTypes?.UseManufacture === true) {
			sensorTypeUI.push(<li key='sensorType_manufacture'><input type="radio" name="hscsType" id="hscsType118" onChange={() => onClickFacilityType(118)} checked={facilityType === 118} /><label htmlFor="hscsType118">제조설비</label></li>);
		}

		if (props.useSensorTypes?.UseSVMS === true) {
			sensorTypeUI.push(<li key='sensorType_svms'><input type="radio" name="hscsType" id="hscsType900" onChange={() => onClickFacilityType(900)} checked={facilityType === 900} /><label htmlFor="hscsType900">SVMS</label></li>);
		}
		if (props.useSensorTypes?.UseEarthquake === true) {
			sensorTypeUI.push(<li key='sensorType_earthquake'><input type="radio" name="hscsType" id="hscsType50" onChange={() => onClickFacilityType(50)} checked={facilityType === 50} /><label htmlFor="hscsType50">지진</label></li>);
		}
		if (props.useSensorTypes?.UseStrongWind === true) {
			sensorTypeUI.push(<li key='sensorType_strongWind'><input type="radio" name="hscsType" id="hscsType18" onChange={() => onClickFacilityType(18)} checked={facilityType === 18} /><label htmlFor="hscsType18">강풍</label></li>);
		}
		if (props.useSensorTypes?.UseBlackOut === true) {
			sensorTypeUI.push(<li key='sensorType_blackout'><input type="radio" name="hscsType" id="hscsType17" onChange={() => onClickFacilityType(17)} checked={facilityType === 17} /><label htmlFor="hscsType17">정전</label></li>);
		}

		return sensorTypeUI;
	}


	const onChangeMemo = (e) => {
		setDisplayMemo(e.target.value);
	}

	const [buildingGroupUI, buildingUI, zoneUI] = getSpatailUI();
	const [gridUI, allChecked] = getGridData();
	const isAlarmMemo = useAlarmMemo();
	const sensorTypeUI = getSensorTypeUI();

	return (
		<>
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
						

						<span className={'hsContTitle'}>센서 탐지 이력</span>
						<form action="">
							<div className={'hscSch'}>
								<dl>
									<dt>센서유형</dt>
									<dd>
										<ul className={'hscsRdo'}>
											<li><input type="radio" name="hscsType" id="hscsTypeAll" onChange={() => onClickFacilityType(-1)} checked={facilityType === -1} /> <label htmlFor="hscsTypeAll">전체</label></li>
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
														onChange={date => onChangeBegin(date)}
														className={'datePickerCss'} />
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
											<li><input type="radio" name="hscsRdo" id="hscsRdo01" onChange={() => onClickDateType('today')} checked={dateType === 'today'} /><label htmlFor="hscsRdo01">오늘</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo02" onChange={() => onClickDateType('week')} checked={dateType === 'week'} /><label htmlFor="hscsRdo02">1주</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo03" onChange={() => onClickDateType('month')} checked={dateType === 'month'} /><label htmlFor="hscsRdo03">1개월</label></li>
											<li><input type="radio" name="hscsRdo" id="hscsRdo04" onChange={() => onClickDateType('year')} checked={dateType === 'year'} /><label htmlFor="hscsRdo04">1년</label></li>
										</ul>
									</dd>
								</dl>
								{
										loadingIndicator === true
										? <a className={'hscsSbmt'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner"/></span></span></a>
										: <a onClick={onClickSearch} className={'hscsSbmt'}><span><span className='searchBtn'>검색</span></span></a>
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
									<li><a onClick={() => onClickSelectDownload()} className={'exl'}>선택 다운로드</a></li>
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
											<th className={'clickArea'}>일시</th>
											<th className={'clickArea'}>종료 일시</th>
											<th className={'clickArea'}>센서유형</th>
											<th className={'clickArea'}>센서명</th>
											<th className={'clickArea'}>위치</th>
											<th className={'clickArea'}>탐지정보</th>
											<th className={'clickArea'}>단계</th>
                                            <th className={'clickArea'}>대응 SOP</th>
											<th className={'clickArea'}>메모</th>
										</tr>
									</thead>
									<tbody className={'clickArea'}>
										{gridUI}
									</tbody>
								</table>
							</div>

							<Pagination
								dataSource={dataSource}
								IsKnowPageIndex={IsKnowPageIndex}
								minPageIndex={minPageIndex}
								maxPageIndex={maxPageIndex}
								pageIndex={pageIndex}
								handlePageIndex={handlePageIndex}
								havePrevPage={havePrevPage}
								haveAfterPage={haveAfterPage}
								onClickPrevSearch={onClickPrevSearch}
								onClickAfterSearch={onClickAfterSearch}
							/>
						</div>
					</div>
				</div>
			</div>

			{
				(popupMemoHistoryID !== null && popupMemoHistoryID > 0) ?
					<SensorDetectHistoryMemo fromHistoryMenu={true} setPopupMemo={setPopupMemo} actionStepHistoryID={popupMemoHistoryID} popupMemoContent={popupMemoContent} />
					: null
			}
		</>
	);
}

export default SensorDetectHistory;