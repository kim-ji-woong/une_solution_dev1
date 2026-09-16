//import { Button } from '@amcharts/amcharts4/core';
import React, { Component, useEffect, useState } from 'react';
import HistoryController from '../../services/historyController';
import $ from 'jquery';

import * as ExcelJS from 'exceljs'; /*excel 만들기*/
import { saveAs } from 'file-saver'; /*excel 다운로드*/

import { SOPHistoryDetailInfoComponent } from '../../styled/SensorDetectHistoryStyled';

function SOPHistoryDetailInfo(props) {

	const [dataSource, setDataSource] = useState(null);
	const [selectComponentHistoryID, setSelectComponentHistoryID] = useState(null);

	useEffect(() => {
		display();
	}, [])

	const display = async () => {
		const dataSource = await HistoryController.DisplaySOPComponentHistories(props.selectedData.actionStepHistoryID);

		if (dataSource && dataSource.length > 0) {			
			setDataSource(dataSource);
			setSelectComponentHistoryID(dataSource[0].componentHistoryID);
		}
		else {
			setDataSource(dataSource);
        }
	}

	const onClose = () => {
		props.changeSubContent(null);
    }

	const onClickhsmDtl = (num, componentHistoryID) => {
		//$('.' + newStyles.hsmDtl).hide();
		//$('#' + newStyles.hsmDtl + num).show();

		setSelectComponentHistoryID(componentHistoryID);
	}

	const onClickAllDownload = async () => {		
		const title = i18n.t('history.menu.SOP 상세이력');

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet(title); // sheet 이름

		// title		
		let titleRow = worksheet.getCell('A1');
		titleRow.value = title;

		titleRow.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
		worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

		worksheet.mergeCells('A1:E2');
		worksheet.getCell('A1:E2').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		}

		worksheet.addRow([i18n.t('history.historyDetail.시간') + ' : ' + props.selectedData.beginTime]);
		worksheet.addRow([i18n.t('history.historyDetail.SOP유형') + ' : ' + props.selectedData.disasterName ]);
		worksheet.addRow([i18n.t('history.historyDetail.위기경보단계') + ' : ' + props.selectedData.actionStepName]);
		worksheet.addRow([i18n.t('history.historyDetail.SOP모드') + ' : ' + props.selectedData.realMode]);
		worksheet.addRow([]);

		// column
		let columnRow = worksheet.addRow(['No', i18n.t('history.historyDetail.프로세스 제목'), i18n.t('history.historyDetail.전파대상자/전파메시지'), i18n.t('history.historyDetail.시간'), i18n.t('history.historyDetail.완료여부')]);
		columnRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '#0595D5' }
			};
			cell.font = { name: '맑은 고딕', family: 4, size: 20, bold: true };
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
			{ key: "sectionName", width: 15 },
			{ key: "msg", width: 40 },
			{ key: "time", width: 20 },
			{ key: "status", width: 13 }
		];

		if (dataSource) {
			let arrDatas = [];
			const dataLength = dataSource.length;
			for (let i = 0; i < dataLength; i++) {
				const data = [];

				const no = i + 1;
				const sectionName = dataSource[i].sectionName;
				const msg = dataSource[i].teamList.join(', ');
				const time = dataSource[i].time;
				const status = dataSource[i].strStatus;

				data.no = no;
				data.sectionName = sectionName;
				data.msg = msg;
				data.time = time;
				data.status = status;

				arrDatas.push(data);

				// 세부
				const missionDatas = dataSource[i].missionDatas;
				const missionCount = missionDatas.length;

				if (missionCount > 0) {
					for (let j = 0; j < missionCount; j++) {
						const data2 = [];

						const noDetail = (i + 1) + '-' + (j + 1);
						const sectionNameDetail = dataSource[i].missionDatas[j].sectionName;
						const msgDetail = dataSource[i].missionDatas[j].missionText;
						const timeDetail = dataSource[i].missionDatas[j].time;
						const statusDetail = dataSource[i].missionDatas[j].completion;

						data2.no = noDetail;
						data2.sectionName = sectionNameDetail;
						data2.msg = msgDetail;
						data2.time = timeDetail;
						data2.status = statusDetail;

						arrDatas.push(data2);
                    }
                }
			}

			arrDatas.forEach(function (item, index) {
				worksheet.addRow({
					no: item.no,
					sectionName: item.sectionName,
					msg: item.msg,
					time: item.time,
					status: item.status
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

	const getGridData = () => {
		let grid1 = [];
		let grid2 = [];

		if (!dataSource) {
			return [grid1, grid2];
		}

		//const dataSource = dataSource;
		const datacount = dataSource.length;

		for (let j = 0; j < datacount; j++) {
			grid1.push(
				<tr onClick={() => onClickhsmDtl(j + 1, dataSource[j].componentHistoryID)} key={'grid1_' + j}>
					<td>{j + 1}</td>
					<td>{dataSource[j].sectionName}</td>
					<td>{dataSource[j].teamList.join(', ')}</td>
					<td>{dataSource[j].time}</td>
					<td>{dataSource[j].strStatus}</td>
				</tr>
			);

			if (selectComponentHistoryID === dataSource[j].componentHistoryID) {
				const missionDatas = dataSource[j].missionDatas;
				const missionCount = missionDatas.length;

				for (let i = 0; i < missionCount; i++) {
					grid2.push(
						<tr key={'grid2_' + i}>
							<td>{i + 1}</td>
							<td>{missionDatas[i].sectionName}</td>
							<td>
								<div className={"scroll-wrapper" + " " + 'hsmScr' + " " + "scroll-bar"}>
									{missionDatas[i].missionText}
								</div>
							</td>
							<td>{missionDatas[i].time}</td>
							<td>{missionDatas[i].completion}</td>
						</tr>
					);
                }
            }
        }

		return [grid1, grid2];
    }

	const [grid1, grid2] = getGridData();

	return (
		<>
			<SOPHistoryDetailInfoComponent>
				<div id={'hsMmo'} className={'popup'}>
					<div>
						<div>
							<div className={'hsmCont sop'}>
								<div className={'hsmTitle'}>
									<h3>SOP 상세정보</h3>
									<a onClick={onClickAllDownload} className={'hsmExl'}>엑셀 다운로드</a>
									<a onClick={onClose} className={'hsmCls'}>닫기</a>
								</div>
								<div className={'scrollWrapper' + " " + 'hsmPrc' + " " + 'scrollBar'}>
									<table className={'hsmTb'}>
										<colgroup>
											<col style={{ width: '5%' }} />
											<col style={{ width: '20%' }} />
											<col style={{ width: '40%' }} />
											<col style={{ width: '20%' }} />
											<col style={{ width: '15%' }} />
										</colgroup>
										<thead>
											<tr>
												<th>No.</th>
												<th>프로세스 제목</th>
												<th>전파대상자</th>
												<th>시간</th>
												<th>완료여부</th>
											</tr>
										</thead>
										<tbody>
											{grid1}
										</tbody>
									</table>
								</div>
								<div className={'scrollWrapper' + " " + 'hsmDtl' + " " + 'scrollBar'} id={'hsmDtl' + "1"}>
									<table className={'hsmTb'}>
										<colgroup>
											<col style={{ width: '5%' }} />
											<col style={{ width: '20%' }} />
											<col style={{ width: '40%' }} />
											<col style={{ width: '20%' }} />
											<col style={{ width: '15%' }} />
										</colgroup>
										<thead>
											<tr>
												<th>No.</th>
												<th>프로세스 제목</th>
												<th>세부 임무/전파 메세지</th>
												<th>시간</th>
												<th>완료여부</th>
											</tr>
										</thead>
										<tbody>
											{grid2}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>  {/* hsMmo */}
			</SOPHistoryDetailInfoComponent>
		</>
	);
}

export default SOPHistoryDetailInfo;