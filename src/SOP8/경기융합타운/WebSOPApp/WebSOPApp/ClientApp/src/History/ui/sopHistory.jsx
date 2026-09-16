import $, { data } from 'jquery';
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import HistoryResource from "../resource/id";
import HistoryController from '../services/historyController';
import SOPHistoryDetailInfo from './popups/SOPHistoryDetailInfo';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import ProjectResource from '../../Root/resource/id';

import { SOPHistoryComponent, SOPHistoryDetailBoxs } from '../styled/SensorDetectHistoryStyled';
import SopManagerResource from '../../SOPManager/resource/id';
import SopController from '../../SOPManager/services/sopController';


function SOPHistory(props) {
	const [subContent, setSubContent] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const [disasterCategories, setDisasterCategories] = useState(null);
    const [dataSource, setDataSource] = useState(null);
    const [viewDataSource, setViewDataSource] = useState(null);
    const [maxRowCount, setMaxRowCount] = useState(19);		// 한 페이지에 보여줄 data row 수
    const [maxPageCount, setMaxPageCount] = useState(5);	// 한번에 보여줄 페이지 개수
    const [pageIndex, setPageIndex] = useState(1);			// 현재 페이지
	const [minPageIndex, setMinPageIndex] = useState(1);
    const [maxPageIndex, setMaxPageIndex] = useState(1);	// 최대 페이지 Index
    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [selectDisasterType, setSelectDisasterType] = useState('전체');
    const [selectActionStep, setSelectActionStep] = useState('전체');
    const [selectRealMode, setSelectRealMode] = useState('전체');
    const [selectUserName, setSelectUserName] = useState('');

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [linkSOP, setLinkSOP] = useState(null);
    
	const prevProps = useRef(null);

    const refDatepicker01 = useRef(null);
    const refDatepicker02 = useRef(null);

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
        if (prevProps.current?.linkSOP !== linkSOP) {
            if (prevProps.current?.linkSOP && prevProps.current.linkSOP.beginTime) {
                setBeginDate(new Date(prevProps.current.linkSOP.beginTime));
                setEndDate(new Date(prevProps.current.linkSOP.beginTime));
                setLinkSOP(prevProps.current.linkSOP);
                display();
            }
        }

        if (prevProps.current?.selectedSiteNo !== props.selectedSiteNo) {
            loadDisasterCategory();

            if (prevProps.current?.linkSOP === linkSOP)
                display();
        }

		prevProps.current = props;

    }, [props.selectedSiteNo, prevProps.linkSOP]);

	const loadActionStepNames = async () => {
		// 각 사이트별 단계배열 및 단계명 초기화
		//await SopController.loadActionStepNames();
	}

	const loadDisasterCategory = async () => {
		const disasterCategories = await HistoryController.LoadDisasterCategories(props.selectedSiteNo);
		setDisasterCategories(disasterCategories);
    }

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

		let dataSource = await HistoryController.DisplaySOPHistories(beginDateValue, endDateValue, props.selectedSiteNo);
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

		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % (maxRowCount); // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		$("body").css("cursor", "default");

		setDataSource(dataSource);
        setMaxPageIndex(maxPageIndex);
        setPageIndex(1);
        setLoadingIndicator(false);        
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

	const onChangeRealMode = (value) => {
		setSelectRealMode(value);
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

	const onCheckedRow = (checked, i) => {
		//const dataSource = dataSource;
		const newDataSource = [...dataSource];

		const datacount = dataSource.length;
		if (i === -1) {
			const beginIndex = (pageIndex - minPageIndex) * maxRowCount;

			for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {
				if (datacount < i + 1) {
					break;
				}
				newDataSource[i].checked = checked;
			}			
		}
		else {		
			newDataSource[i].checked = checked;
			props.setLastClickRow(checked ? i : null);
		}

		setDataSource(newDataSource);
	}

	//newDataSource[i].checked = checked;
	//props.setLastClickRow(checked ? i : null);
	//setDataSource(newDataSource);


	const onClickDownload = async (isCheckedDownload) => {
		const title = 'history.menu.SOP 이력';

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:J2');
		worksheet.getCell('A1:H2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		const beginDate = getMakeDateTime(beginDate);
		const endDate = getMakeDateTime(endDate);
		worksheet.addRow(['조회 기간' + ' : ' + beginDate + ' ~ ' + endDate]);
		worksheet.addRow(['재난 타입' + ' : ' + selectDisasterType]);
		worksheet.addRow(['위기경보 단계' + ' : ' + selectActionStep]);
		worksheet.addRow(['모드' + ' : ' + selectRealMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', 'SOP 유형', 'SOP 이름', '위기경보 단계', 'SOP모드', '센서명', '위치', '시작 시간', '종료 시간', '이름']);
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
			{ key: "disasterName", width: 20 },
			{ key: "sopName", width: 15 },
			{ key: "actionStepName", width: 15 },
			{ key: "realMode", width: 15 },
			{ key: "sensorName", width: 30 },
			{ key: "position", width: 25 },			
			{ key: "beginTime", width: 20 },
			{ key: "endTime", width: 20 },
			{ key: "userName", width: 15 }
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
				const disasterName = dataSource[i].disasterName;
				const sopName = dataSource[i].sopName;
				const actionStepName = dataSource[i].actionStepName;
				const realMode = dataSource[i].realMode;
				const sensorName = dataSource[i].sensorName;
				const position = dataSource[i].position;				
				const beginTime = dataSource[i].beginTime;
				const endTime = dataSource[i].endTime;
				const userName = dataSource[i].userName;

				data.no = no;
				data.disasterName = disasterName;
				data.sopName = sopName;
				data.actionStepName = actionStepName;
				data.realMode = realMode;
				data.sensorName = (!sensorName || sensorName.length === 0) ? '-' : sensorName;
				data.position = position;				
				data.beginTime = beginTime;
				data.endTime = endTime;
				data.userName = userName;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					disasterName: item.disasterName,
					sopName: item.sopName,
					actionStepName: item.actionStepName,
					realMode: item.realMode,
					sensorName: item.sensorName,
					position: item.position,
					beginTime: item.beginTime,
					endTime: item.endTime,
					userName: item.userName
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

	// 하단 페이지 index 만들기
	const getPageIndexUI = () => {
		let ui = [];
		if (!dataSource) {
			return ui;
		}

		const pageArr = new Array();

		let index = pageIndex;
		// 이전 페이지 넣기
		while (true) {
			index--;
			if (index < 1) {
				break;
			}
			if (pageIndex - 2 > index) {
				break;
			}

			pageArr.push(index);
		}
		index = pageIndex;
		pageArr.push(index);

		// 다음 페이지 넣기
		while (true) {
			if (pageArr.length === maxPageCount) {
				break;
			}

			index++;
			if (index > maxPageIndex) {
				break;
			}

			pageArr.push(index);
		}

		//정렬
		pageArr.sort(function (a, b) { if (a > b) return 1; if (a === b) return 0; if (a < b) return -1; });

		for (let i = 0; i < pageArr.length; i++) {
			let pageIndex = pageArr[i];
			if (pageIndex === pageIndex) {
				ui.push(<li key={'pageIndex_' + (pageIndex)} className={'on'}><a onClick={() => handlePageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
			else {
				ui.push(<li key={'pageIndex_' + (pageIndex)}><a onClick={() => handlePageIndex(pageIndex)}>{pageIndex}</a></li>);
			}
		}

		return ui;
	} 

	const onClickCheckbox = (sensorZoneHistoryID) => {
        const activeTr = document.getElementById('hsTbTr' + sensorZoneHistoryID);
        const checkedTr = document.querySelector('.lineOn');
        //console.log(checkedTr);

		if(checkedTr){
			checkedTr.classList.replace('lineOn', 'colorOn');
		}
		activeTr.classList.toggle('lineOn');
	}

	const getGridData = () => {
		let ui = [];
		if (!dataSource) {
			return ui;
		}

		const datacount = dataSource.length;

		let rowCount = 0;
		let allChecked = true; 

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (pageIndex > 1) {
			beginIndex = (pageIndex - 1)* maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			// 재난타입
			if (dataSource[i].disasterName === selectDisasterType || selectDisasterType === '전체') {
				// 위기단계
				if (dataSource[i].actionStepName === selectActionStep || selectActionStep === '전체') {
					// 모드
					if (dataSource[i].realMode === selectRealMode || selectRealMode === '전체') {
						let trClassName = null;
						if (linkSOP && linkSOP.actionStepHistoryID && linkSOP.actionStepHistoryID === dataSource[i].actionStepHistoryID) {
							trClassName = 'selectedTr';
                        }

						//console.log(dataSource[i]);
						ui.push(<tr key={'dataSource_' + (i)} className={trClassName + " " + 'activeBgSOPTr clickArea' + (dataSource[i].checked ? ' colorOn' : '')} id={i === props.lastClickRow ? 'lineOn' : ''} /* id={'hsTbTr' + dataSource[i].sensorZoneHistoryID} */>
									<td className={'clickArea'}><input type="checkbox" className='clickArea' checked={dataSource[i].checked} /* onClick={(event) => onClickCheckbox(dataSource[i].sensorZoneHistoryID, event)} */ onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
									<td className={'clickArea'}>{i + 1}</td>
									<td className={'clickArea'}>{dataSource[i].disasterName}</td>
									<td className={'clickArea'}>{dataSource[i].sopName}</td>
									<td className={'clickArea'}>{dataSource[i].actionStepName}</td>
									<td className={'clickArea'}>{dataSource[i].realMode}</td>
									<td className={'clickArea'}>{(!dataSource[i].sensorName || dataSource[i].sensorName.length === 0) ? '-' : dataSource[i].sensorName}</td>
									<td className={'clickArea'}>{dataSource[i].position}</td>
									<td className={'clickArea'}>{dataSource[i].beginTime}</td>
									<td className={'clickArea'}>{dataSource[i].endTime}</td>
									<td className={'clickArea'}>{dataSource[i].userName}</td>
							        <td className={'clickArea'}><a onClick={() => onDetailInfo(dataSource[i])}>상세정보</a></td>
								</tr>
						);

						rowCount++;
						if (allChecked && !dataSource[i].checked) {
							allChecked = false;
						}
                    }
                }
            }
		}
		if (rowCount === 0 && allChecked) {
			allChecked = false;
		}
		return [ui, allChecked];
	}

	const getDisasterCategories = () => {
		let ui = [];
		ui.push(<option key={'disaster_all'} value={'전체'}>전체</option>);

		if (disasterCategories) {
			for (let i = 0; i < disasterCategories.length; i++) {
				if (selectDisasterType === disasterCategories[i].categoryName) {
					ui.push(<option key={'disaster_' + i} value={disasterCategories[i].categoryName} selected>{disasterCategories[i].categoryName}</option>);
				}
				else {
					ui.push(<option key={'disaster_' + i} value={disasterCategories[i].categoryName}>{disasterCategories[i].categoryName}</option>);
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

	/* getActionStepNames() {
		const actionStepNames = SopManagerResource.actionStep;
		if (actionStepNames === null) {
			return <>
				<option value={'전체'}>전체</option>
				<option value={'관심'}>관심</option>
				<option value={'주의'}>주의</option>
				<option value={'경계'}>경계</option>
				<option value={'심각'}>심각</option>
			</>
		}
		else {
			const ui = [];
			ui.push(<option value={'전체'}>전체</option>);
			const arrNames = Object.keys(actionStepNames);
			for (let i = 0; i < arrNames.length; i++) {
				if (i === 0) {
					ui.push(<option value={actionStepNames._1st}>{actionStepNames._1st}</option>)
				} else if (i === 1) {
					ui.push(<option value={actionStepNames._2nd}>{actionStepNames._2nd}</option>)
				} else if (i === 2) {
					ui.push(<option value={actionStepNames._3rd}>{actionStepNames._3rd}</option>)
				} else if (i === 3) {
					ui.push(<option value={actionStepNames._4th}>{actionStepNames._4th}</option>)
                }
			}

			return ui;
		}
	} */

	const onClose = () => {
		changeSubContent(null);
	}

	/* const onClickRecentlybox = () => {
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
	} */

	const categories = getDisasterCategories();
	const pageIndexUI = getPageIndexUI();
	const [gridUI, allChecked] = getGridData();
	//const actionStepNamesUI = getActionStepNames();
	//const sopHistoryDetailBox = getSopHistoryDetailBox();

	return (
		<div id={'hsty'}>
			<div className={'hsScr'}>
				<div id={'hsCont'}>
					<span className={'hsContTitle'}>SOP 이력</span>
					<form action="">
						<div className={'hscSch'}>
							<ul className={'hscsHalf'}>
								<li>
									<dl>
										<dt>센서유형</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeDisasterType(e.target.value)} className={'selWh'}>
												{categories}
											</select>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>위기단계</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeStep(e.target.value)} className={'selWh'}>
												{/* {actionStepNamesUI} */}
											</select>
										</dd>
									</dl>
								</li>
								{/* <li>
									<dl>
										<dt>모드</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeRealMode(e.target.value)} className={'selWh'}>
												<option value={'전체'}>전체</option>
												<option value={'훈련'}>훈련</option>
												<option value={'실제'}>실제</option>
											</select>
										</dd>
									</dl>
								</li> */}
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
							{/*<a onClick={sopHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
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
									<col style={{ width: '8%' }} />
								</colgroup>
								<thead>
									<tr>
										<th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
										<th>NO</th>
										<th>센서유형</th>
										<th>SOP 이름</th>
										<th>위기경보 단계</th>
										<th>SOP 단계</th>
										<th>센서명</th>
										<th>위치</th>
										<th>일시</th>
										<th>종료일시</th>
										<th>실행자</th>
										<th>상세대응이력</th>
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
									<a className={'first'} onClick={() => setPageIndex(1)}>맨 앞</a>
									<a className={'prev'} onClick={() => setPageIndex(pageIndex - 1)}>이전</a>
									<ul>
										{pageIndexUI}
									</ul>
									<a className={'next'} onClick={() => setPageIndex(pageIndex + 1)}>다음</a>
									<a className={'last'} onClick={() => setPageIndex(maxPageIndex)}>맨 뒤</a>
								</div>
								: <> </>
						} 
					</div>
				</div>
			</div>
			{
				(subContent && subContent === '상세보기') ?
					<SOPHistoryDetailInfo changeSubContent={changeSubContent} selectedData={selectedData} />
					: <> </>
			}
			{/* {sopHistoryDetailBox} */}
		</div>
	);

} export default SOPHistory;