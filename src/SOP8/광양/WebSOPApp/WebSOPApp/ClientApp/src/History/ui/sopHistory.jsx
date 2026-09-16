import React, { useState, useEffect, useRef, useMemo } from 'react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko, enUS } from 'date-fns/esm/locale';
import HistoryController from '../services/historyController';
import SOPHistoryDetailInfo from './popups/SOPHistoryDetailInfo';

import ProjectResource from '../../Root/resource/id';
import SopManagerResource from '../../SOPManager/resource/id';
import SopController from '../../SOPManager/services/sopController';
import Pagination from '../../Common/ui/pagination';
import { SOPHistoryComponent } from '../styled/SensorDetectHistoryStyled';
import DropBox from '../../Common/components/dropBox';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';
import EmptyContent from '../../Common/components/emptyContent';
import InputBox from '../../Common/components/inputBox';
import IconButton from '../../Common/components/iconButton';


function SOPHistory(props) {
	const [openDropId, setOpenDropId] = useState(null);

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
						<td className={'clickArea'}>
							<IconButton
                                variant="unfill"
                                size="xxs"
                                icon={<Icon.IconTask />}
                                onClick={() => onDetailInfo(data)}
                            >
                                상세정보
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

	const getDisasterTypes = () => {
		let options = [];

		options.push({ value: '전체', label: '전체' });

		if (disasterCategories) {
			for (let i = 0; i < disasterCategories.length; i++) {
				options.push({ value: disasterCategories[i].disasterCategory.lclas_name, label: disasterCategories[i].disasterCategory.lclas_name });
            }
        }

		return options;
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
	
		let options = [];
		options.push({ value: '전체', label: '전체' });

		Object.entries(actionStepNames).forEach(([key, value], index) => {
			if (value) {
				options.push({ value: value, label: value });
			}
		});

		return options;
	};

	const setPage = (page) => {
		setPageIndex(page);
    }

	return (
		<SOPHistoryComponent>
			<div className='contents'>
				<p className='title'>SOP 이력</p>
				<ul className='searchWrap'>
					<li>
						<div className='sensorTypesWrap'>
							<p>재난유형</p>
							<DropBox
								size="xs"
								id="disaster"
								value={selectDisasterType}
								onChange={setSelectDisasterType}
								options={getDisasterTypes()}
								openId={openDropId}
								setOpenId={setOpenDropId}
							/>
						</div>
						<div className='dropWrap'>
							<p>SOP 단계</p>
							<DropBox
								size="xs"
								id="actionStep"
								value={selectActionStep}
								onChange={onChangeStep}
								options={getActionStepNames()}
								openId={openDropId}
								setOpenId={setOpenDropId}
							/>
						</div>
						<div className='inputWrap'>
							<p>실행자 명</p>
							<InputBox
								size="xs"
								value={selectUserName}
								onChange={setSelectUserName}
								// placeholder={"사용자 아이디를 작성하세요"}
								onClear={() => setSelectUserName("")}
							/>
						</div>
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
						onClick={() => display()}
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

				{displayContent && displayContent.length > 0 ?
					<div className={'hscTb'} id={'hscTb'}> 
						<div className={'scrTb'}>
							<table>
								<colgroup>
									<col style={{ width: '3%' }} />
									<col style={{ width: '3%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '11%' }} />
									<col style={{ width: '12%' }} />
									<col style={{ width: '12%' }} />
									<col style={{ width: '4%' }} />
								</colgroup>
								<thead>
									<tr>
										<th><input type="checkbox" checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></th>
										<th>NO</th>
										<th>재난유형</th>
										<th>SOP 이름</th>
										<th>SOP 단계</th>
										<th>센서 명</th>
										<th>위치</th>
										<th>일시</th>
										<th>종료일시</th>
										<th>실행자</th>
										<th>상세</th>
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
							title="선택한 조건에 해당하는 SOP 실행 이력이 존재하지 않습니다."
							description="조회 조건을 다시 설정하여 검색하세요"
						/>
					</div>
				}
			</div>
			{
				(subContent && subContent === '상세보기') ?
					<SOPHistoryDetailInfo changeSubContent={changeSubContent} selectedData={selectedData} />
					: <> </>
			}
		</SOPHistoryComponent>
	);

} export default SOPHistory;