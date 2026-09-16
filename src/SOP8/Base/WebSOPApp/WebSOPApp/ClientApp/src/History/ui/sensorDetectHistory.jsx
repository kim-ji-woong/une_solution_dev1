import React, { useState, useEffect, useRef } from 'react';
import $, { data } from 'jquery';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/images/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/
import SensorDetectHistoryMemo from './popups/SensorDetectHistoryMemo';

import ProjectResource from '../../Root/resource/id';
import Pagination from '../../Common/ui/pagination';
import AutoContentTooltip from '../../Common/ui/autoContentTooltip';
import SopController from '../../SOPManager/services/sopController';
import { SensorDetectHistoryComponent } from '../styled/SensorDetectHistoryStyled';

function SensorDetectHistory(props) {
	const [disasterCategories, setDisasterCategories] = useState(null);
	const [dataSource, setDataSource] = useState(null);

	const [dateType, setDateType] = useState('today');
	const [beginDate, setBeginDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const [selectDisasterType, setSelectDisasterType] = useState('전체');	// 센서유형
    const [selectZoneName, setSelectZoneName] = useState('-');				// 위치

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

	const prevProps = useRef(null);
	
	const refDatepicker01 = useRef(null);
	const refDatepicker02 = useRef(null);
	const refIsFirst = useRef(true);

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
				const data = data;
	
				ui.push(
					<tr key={'dataSource_' + (data.rowNo)} className={'activeBackgroundTr clickArea' + (data.checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''}>
						<td className={'clickArea'}>
							<input 
								type="checkbox" 
								className='clickArea' 
								checked={data.checked || ''} 
								onChange={(e) => onCheckedRow(e.target.checked, i)} 
							/>
						</td>
						<td className={'clickArea'}>{data.sensorZoneHistoryID}</td>
						<td className={'clickArea'}>{data.time}</td>
						<td className={'clickArea'}>{data.endTime}</td>
						<td className={'clickArea'}>{data.type}</td>
						<td className={'clickArea'}><span onMouseEnter={(e) => handleTooltip(e, true)} onMouseLeave={(e) => handleTooltip(e, false)}>{data.sensorName}</span></td>
						<td className={'clickArea'}><span onMouseEnter={(e) => handleTooltip(e, true)} onMouseLeave={(e) => handleTooltip(e, false)}>{data.zoneName}</span></td>
						<td className={'clickArea'}>{data.detectInfo}</td>
						<td className={'clickArea'}>{data.alarmLevel}</td>
						<td className={sopLinkClassName + 'clickArea'} onClick={() => onLinkSOP(data.sensorZoneHistoryID, data.sopBeginTime)}>{(data.sopName.length > 0) ? data.sopName : '-'}</td>
						<td className={haveMemoClassName} onClick={() => setPopupMemo(true, data.sensorZoneHistoryID, data.memo)}><span className={haveMemoClassName + ' ' + 'content'}></span></td>
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

	const loadDisasterCategory = async () => {
		const [disasterCategories, message] = await SopController.disasterCategories(null, props.selectedSiteNo);
		setDisasterCategories(disasterCategories);
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

		setLoadingIndicator(true);

		let [dataSource, totalCount, message] = await HistoryController.requestSensorDetectHistory(beginYear, beginMonth, beginDay, endYear, endMonth, endDay);

		if (dataSource) {
			let datacount = dataSource.length;
	
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

				const checked = data.checked;
					if (isCheckedDownload && !checked) {
						continue;
					}

				const no = arrDatas.length + 1;
				const time = data.time;
				const endTime = data.endTime;
				const type = data.type;
				const sensorName = data.sensorName;
				const zoneName = data.zoneName;
				const realMode = data.realMode;
				const detectType = data.detectType;
				const detectInfo = data.detectInfo;
				const alarmLevel = data.alarmLevel;
				const sopName = data.sopName;

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

				const checked = data.checked;
				if (!checked) {
					continue;
				}

				const no = arrDatas.length + 1;
				const time = data.time;
				const endTime = data.endTime;
				const type = data.type;
				const sensorName = data.sensorName;
				const zoneName = data.zoneName;
				const realMode = data.realMode;
				const detectType = data.detectType;
				const detectInfo = data.detectInfo;
				const alarmLevel = data.alarmLevel;
				const sopName = data.sopName;

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
				updateddata.checked = checked;
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
					if (data.sensorZoneHistoryID === sensorZoneHistoryID) {
						data.memo = memoContent;
						break;
                    }
                }
			}
			
			setPopupMemoHistoryID(null);
			setPopupMemoContent(null);
		} 
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


	const getDisasterCategories = () => {
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

	const [buildingGroupUI, buildingUI, zoneUI] = getSpatailUI();
	const isAlarmMemo = useAlarmMemo();
	const sensorTypeUI = getSensorTypeUI();

	return (
		<SensorDetectHistoryComponent>
			<div>
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
										<select name="" id="" onChange={(e) => onChangeDisasterType(e.target.value)} className={'selWh'}>
											{getDisasterCategories()}
										</select>
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
	);
}

export default SensorDetectHistory;