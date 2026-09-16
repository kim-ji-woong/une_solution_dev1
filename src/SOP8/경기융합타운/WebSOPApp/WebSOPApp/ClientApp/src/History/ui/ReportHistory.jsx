import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import HistoryController from '../services/historyController';
import DatePicker from 'react-datepicker';
import { ko, enUS } from 'date-fns/esm/locale';
import btnCalendarBk from '../../Common/img/sub/dashboard_calendar_blue.png';

import CircularProgress from '@material-ui/core/CircularProgress';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/


function ReportHistory(props) {

	const [dataSource, setDataSource] = useState(null);
    const [maxRowCount, setMaxRowCount] = useState(13);		// 한 페이지에 보여줄 data row 수
    const [maxPageCount, setMaxPageCount] = useState(9);	// 한번에 보여줄 페이지 개수
    const [pageIndex, setPageIndex] = useState(1);			// 현재 페이지
    const [maxPageIndex, setMaxPageIndex] = useState(1);	// 최대 페이지 Index	
    const [dateType, setDateType] = useState('today');
    const [beginDate, setBeginDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [filterType, setFilterType] = useState(1);
    const [filterContent, setFilterContent] = useState('');

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [selectValue, setSelectValue] = useState([]);

    const prevProps = useRef(null);

    const refDatepicker01 = useRef();
    const refDatepicker02 = useRef();

    useEffect(() => {
        $('html, body').css({ 'display': 'block', 'height': '100%', 'overflow': 'hidden' });
    }, []);

    useEffect(() => {
        if (prevProps.current?.selectedSiteNo !== props?.selectedSiteNo) {
            display();
        }

        prevProps.current = props;

    }, [props.selectedSiteNo]); 

	const display = async () => {
		$("body").css("cursor", "wait");

		const beginDateValue = getMakeDateTime(beginDate) + ' 00:00:00';
		const endDateValue = getMakeDateTime(endDate) + ' 23:59:59';

		if (beginDateValue > endDateValue) {
			$("body").css("cursor", "default");
			alert('조회 기간을 다시 선택하세요');
			return;
		}

		await setState({ loadingIndicator: true })

		let dataSource = await HistoryController.DisplayUserHistories(beginDateValue, endDateValue, props.selectedSiteNo);
		let datacount = dataSource.length;

		if (filterContent.length > 0) {
			let realDataSource = [];
			for (let i = 0; i < datacount; i++) {
				if (filterType === 1) {
					if (dataSource[i].name.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (filterType === 2) {
					if (dataSource[i].level.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (filterType === 3) {
					if (dataSource[i].teamName.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (filterType === 4) {
					if (dataSource[i].targetType.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (filterType === 5) {
					if (dataSource[i].actionType.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
				else if (filterType === 6) {
					if (dataSource[i].historyContent.indexOf(filterContent) >= 0) {
						realDataSource.push(dataSource[i]);
					}
				}
			}

			dataSource = realDataSource;
			datacount = dataSource.length;
		}

		const value1 = parseInt(datacount / maxRowCount);
		const value2 = datacount % maxRowCount; // 나머지가 있는 경우 페이지 하나를 추가한다.
		let maxPageIndex = value1 + ((value2 > 0) ? 1 : 0);

		$("body").css("cursor", "default");

		setState({ dataSource, maxPageIndex, pageIndex: 1, loadingIndicator: false });
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

		setState({ pageIndex: index });
	}

	const onChangeBegin = (date) => {
		setState({ beginDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		setState({ dateType: 'select' });
	}

	const onChangeEnd = (date) => {
		setState({ endDate: date });
		$("input:radio[name='stgDate']").prop('checked', false);

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let korFormat = year + "-" + month + "-" + day;

		setState({ dateType: 'select' });
	}

	const onClickDateType = (type) => {
		let dateType = '';

		if (type === 'select') {
			dateType = 'select';
			setState({ dateType: dateType });
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

		setState({ beginDate: date, endDate: today, dateType: dateType });
	}

	const onChangeFilterType = (value) => {
		setState({ filterType: Number(value) });
	}

	const onChangeFilterContent = (value) => {
		setState({ filterContent: value });
	}

	const searchEnterKey = () => {
		if (window.event && window.event.keyCode === 13) {
			display();
		}
	}

	const onCheckedRow = (checked, i) => {
		const dataSource = dataSource;
		const dataLength = dataSource.length;
		dataSource[i].checked = checked;

		setState({ dataSource });
	}

	const onClickDownload = async (isCheckedDownload) => {
		const title = '데이터 수정 이력';

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

		// 빈칸
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', '일시', '이름', '권한', '소속', '수정 데이터', '수정 유형', '내용']);
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
			{ key: "name", width: 10 },
			{ key: "level", width: 15 },
			{ key: "teamName", width: 15 },
			{ key: "targetType", width: 15 },
			{ key: "actionType", width: 15 },
			{ key: "historyContent", width: 50 }
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
				const time = dataSource[i].time;
				const name = dataSource[i].name;
				const level = dataSource[i].level;
				const teamName = dataSource[i].teamName;
				const targetType = dataSource[i].targetType;
				const actionType = dataSource[i].actionType;
				const historyContent = dataSource[i].historyContent;

				data.no = no;
				data.time = time;
				data.name = name;
				data.level = level;
				data.teamName = teamName;
				data.targetType = targetType;
				data.actionType = actionType;
				data.historyContent = historyContent;

				arrDatas.push(data);
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					time: item.time,
					name: item.name,
					level: item.level,
					teamName: item.teamName,
					targetType: item.targetType,
					actionType: item.actionType,
					historyContent: item.historyContent
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

		// 정렬
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

	const getGridData = () => {
		let ui = [];
		if (!dataSource) {
			return ui;
		}

		const datacount = dataSource.length;

		// 데이터를 읽을 시작할 배열값
		let beginIndex = 0;
		if (pageIndex > 1) {
			beginIndex = (pageIndex - 1) * maxRowCount;
		}

		for (let i = beginIndex; i < beginIndex + maxRowCount; i++) {
			if (datacount < i + 1) {
				break;
			}

			ui.push(<tr key={'dataSource_' + (i)}>
				<td><input type="checkbox" checked={dataSource[i].checked} onChange={(e) => onCheckedRow(e.target.checked, i)} /></td>
				<td>{i + 1}</td>
				<td>{dataSource[i].time}</td>
				<td>{dataSource[i].name}</td>
				<td>{dataSource[i].level}</td>
				<td>{dataSource[i].teamName}</td>
				<td>{dataSource[i].targetType}</td>
				<td >{dataSource[i].actionType}</td>
				<td style={{ textAlign: 'left' }}>{dataSource[i].historyContent}</td>
			</tr>);
		}

		return ui;
	}

	const onClickDatepicker01 = () => {
		refDatepicker01.current.setOpen(true);
	}

	const onClickDatepicker02 = () => {
		refDatepicker02.current.setOpen(true);
	}

	const handleSelectValue = (target) => {
		const value = target.textContent;
		let selectValue = selectValue;

		if (selectValue.length === 3) {
			let newValue = [];
			newValue.push(value);
			setState({ selectValue: newValue });
		}
		else {
			selectValue.push(value);
			setState({ selectValue: selectValue });
		}
	}

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

	const pageIndexUI = getPageIndexUI();
	const gridUI = getGridData();
	//const userHistoryTbodyUI = getUserHistoryTbodyUI();
	//const sensorDetectHistoryOptionUI = getSensorDetectHistoryOptionUI();

	return (
		<div id={'hsty'}>
			<div className={'hsScr'}>
				<div id={'hsCont'}>
					<span className={'hsContTitle'}>보고서</span>
					<form action="">
						<div className={'hscSch'}>
							<ul className={'hscsHalf'}>
								<li>
									<dl>
										<dt>재난타입</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeDisasterType(e.target.value)} className={'selWh'}>
												{/* {categories} */}
											</select>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>위치</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeStep(e.target.value)} className={'selWh'}>
												{/* {actionStepNamesUI} */}
											</select>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>측정값</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeStep(e.target.value)} className={'selWh'}>
												{/* {actionStepNamesUI} */}
											</select>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>집계방식</dt>
										<dd>
											<select name="" id="" onChange={(e) => onChangeStep(e.target.value)} className={'selWh'}>
												{/* {actionStepNamesUI} */}
											</select>
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
									? <a className={'hscsSbmtSOP'} id={'hscsSbmting'}><span><span><CircularProgress className="spinner" /></span></span></a>
									: <a onClick={display} className={'hscsSbmtSOP'}><span><span>검색</span></span></a>
							}
							{/*<a onClick={userHistoryTbodyhandleClick} className={'hscsSbmt'}><span><span>{i18n.t('history.formText.검색')}</span></span></a>*/}
						</div>
					</form>

					{
						loadingIndicator === true ?
							<ul className={'hscExl'}>
								<li><a className={'all'} id={'hscsSbmting'}>전체 다운로드</a></li>
								<li><a className={'all'} id={'hscsSbmting'}>선택 다운로드</a></li>
							</ul>
							:
							<ul className={'hscExl'}>
								<li><a onClick={() => onClickDownload(false)} className={'all'}>전체 다운로드</a></li>
								<li><a onClick={() => onClickDownload(true)} className={'all'}>선택 다운로드</a></li>
							</ul>
					}

					<div className={'hscTb2'}>
						<div className={'hsTbFlex'}>
							<div className={'hsTbConts'}>
								<table>
									<colgroup>
										<col style={{ width: '15%' }} />
										<col style={{ width: '15%' }} />
										<col style={{ width: '70%' }} />
									</colgroup>
									<thead>
										<tr>
											<th><input type="checkbox" /></th>
											<th>NO</th>
											<th>위치</th>
										</tr>
									</thead>
									<tbody>
										{gridUI}
										{/* <tr id={"recentlyBoxArea"} className={'recentlyBoxArea'}>
											<td><input type="checkbox" id={"recentlyCheckbox"} className={'recentlyCheckbox'} onClick={() => onClickRecentlybox()} /></td>
											<td>1</td>
											<td>대경</td>
										</tr>
										<tr id={"activeBoxArea"} className={'activeBoxArea'}>
											<td><input type="checkbox" id={"activeCheckbox"} className={'activeCheckbox'} onClick={() => onClickCheckbox()} /></td>
											<td>2</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>3</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>4</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>5</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>6</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>7</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>8</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>9</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>10</td>
											<td>대경</td>
										</tr>
										<tr className={'checkDisable'}>
											<td><input type="checkbox" /></td>
											<td>11</td>
											<td>대경</td>
										</tr>
										<tr className={'checkDisable'}>
											<td><input type="checkbox" /></td>
											<td>12</td>
											<td>대경</td>
										</tr>
										<tr className={'checkDisable'}>
											<td><input type="checkbox" /></td>
											<td>13</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>14</td>
											<td>대경</td>
										</tr>
										<tr>
											<td><input type="checkbox" /></td>
											<td>15</td>
											<td>대경</td>
										</tr> */}
									</tbody>
								</table>
							</div>
							
							<div className={'hsTbContsNum'}>
								<ul className={'hsTbContList'}>
									<li className={'hsTbContListHead'}>
										<div><span className={'listText'}>측정일시</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>온도</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>습도</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>풍향</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>풍속</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>먼지</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>미세먼지</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>황하수소</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>암모니아</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>총휘발성유</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>이산화황</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>이산화질소</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>456</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>이산화황</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>이산화질소</span><span className={'listIcon'}></span></div>
										<div><span className={'listText'}>456</span><span className={'listIcon'}></span></div>
									</li>
									<li className={'hsTbContListBody'}>
										{gridUI}
										{/* <ul>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
										    </li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
											<li>
												<div><p>2023-12-27 00:00:00</p></div>
												<div>9.66</div>
												<div>9.66</div>
												<div>남동풍</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
												<div>9.66</div>
											</li>
										</ul> */}
									</li>
								</ul>
							</div>

						{/* <div className={'hsTbContsNone'}>
							<span></span>
							<div>
								선택된 목록이 없습니다.
							</div>
						</div> */}
						</div> {/* flex */}

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
		</div>
	);
}

export default ReportHistory;