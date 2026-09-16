import React, { useState, useEffect, useRef } from 'react';
import SopController from '../../services/sopController';

import fire_icon from '../../image/fire.png';
import etc_icon from '../../image/etc.png';
import explosion_icon from '../../image/explosion.png';
import natureDisaster_icon from '../../image/natureDisaster.png';
import pollution_icon from '../../image/pollution.png';
import security_icon from '../../image/security.png';
import terror_icon from '../../image/terror.png';
import lifesaving_icon from '../../image/lifesaving.png';
import earthquake_icon from '../../image/earthquake.png';
import strongwind_icon from '../../image/strongwind.png';
import blackout_icon from '../../image/blackout.png';
import SopManagerResource from '../../resource/id';
import SopManager from '../sopManager';

import { NewSOPOptionsComponent } from '../../../SOPManager/styled/newSopStyled';
import ProjectResource from '../../../Root/resource/id';


function NewSOPOptions(props) {
	const [isNormal, setIsNormal] = useState(true);
    const [normalDisasterCategories, setNormalDisasterCategories] = useState([]);
    const [abnormalDisasterCategories, setAbnormalDisasterCategories] = useState([]);
    const [disasterCategories, setDisasterCategories] = useState([]);
    const [subDisasterCategories, setSubDisasterCategories] = useState([]);
    const [disasterDatas, setDisasterDatas] = useState([]);
    const [selectedDisasterCategory, setSelectedDisasterCategory] = useState(null);
    const [selectedSubDisasterCategory, setSelectedSubDisasterCategory] = useState(null);
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [newSubDisasterCategory, setNewSubDisasterCategory] = useState(null);
    const [newDisaster, setNewDisaster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(SopManagerResource.ID.messages.loadingData);

    const refNewSDC = useRef();
    const refNewSDCRadio = useRef();
    const refNewDisaster = useRef();
    const refNewDisasterRadio = useRef();

	useEffect(() => {
		onSelectSopMode(null, isNormal);
	}, [])

	const getDisasterCategories = async (isNormal) => {
		const [disasterCategories, message] = await SopController.disasterCategories(isNormal, props.selectedSiteNo);

		if (disasterCategories) {
			if (isNormal) {
				setLoading(false);
				setIsNormal(isNormal);
				setNormalDisasterCategories(disasterCategories);
				setDisasterCategories(disasterCategories);
			}
			else {
				setLoading(false);
				setIsNormal(isNormal);
				setAbnormalDisasterCategories(disasterCategories);
				setDisasterCategories(disasterCategories);
            }
		}
		else {
			setLoadingMessage(message);
			setIsNormal(isNormal);
        }
	}

	const onSelectSopMode = (event, isNormal) => {
		if (event) {
			const childCount = event.target.parentNode.children.length;
			let inputCount = 0;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					inputCount++;

					if (isNormal === false && inputCount === 1) {
						continue;
					}

					child.checked = true;
					break;
				}
			}
		}

		// 항상 DB를 읽어오는 방식으로 바꾼다.
		getDisasterCategories(isNormal);
		if (isNormal) {
			if (normalDisasterCategories && normalDisasterCategories.length > 0) {
				setIsNormal(isNormal);
				setDisasterCategories(normalDisasterCategories);
			}
			else {
				getDisasterCategories(isNormal);
			}
		}
		else {
			if (abnormalDisasterCategories && abnormalDisasterCategories.length > 0) {
				setIsNormal(isNormal);
				setDisasterCategories(abnormalDisasterCategories);
			}
			else {
				getDisasterCategories(isNormal);
			}
        }
	}

	const onSelectDisasterCategory = (disasterCategoryData) => {
		refNewDisaster.current.value = '';
		refNewDisasterRadio.current.checked = false;

		setSelectedDisasterCategory(disasterCategoryData);
		setSelectedSubDisasterCategory(null);
		setSelectedDisaster(null);
		setSubDisasterCategories(disasterCategoryData.subDisasterCategories);
		setDisasterDatas([]);
		setNewSubDisasterCategory(null);
		setNewDisaster(null);
	}

	const onSelectSubDisasterCategory = (event, subDisasterCategoryData) => {
		if (event) {
			const childCount = event.target.parentNode.children.length;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					child.checked = true;
					break;
                }
            }
		}

		refNewDisaster.current.value = '';
		refNewDisasterRadio.current.checked = false;

		setSelectedSubDisasterCategory(subDisasterCategoryData);
		setSelectedDisaster(null);
		setDisasterDatas(subDisasterCategoryData.disasterDatas);
		setNewDisaster(null);
	}

	const onSelectNewSubDisasterCategory = () => {
		const sdc = {
			subDisasterCategory:
			{
				id: -1,
				disasterCategoryID: selectedDisasterCategory ? selectedDisasterCategory.id : -1,
				subCategoryName: ''
			},
			disasterDatas: []
		};

		refNewDisaster.current.value = '';
		refNewDisasterRadio.current.checked = false;

		setSelectedSubDisasterCategory(sdc);
		setSelectedDisaster(null);
		setNewSubDisasterCategory(sdc);
		setNewDisaster(null);
		setDisasterDatas(sdc.disasterDatas);
	}

	const onSelectDisaster = (event, disasterData) => {
		if (event) {
			const childCount = event.target.parentNode.children.length;

			for (let i = 0; i < childCount; i++) {
				const child = event.target.parentNode.children[i];
				if (child.tagName === "INPUT") {
					child.checked = true;
					break;
				}
			}
		}

		setSelectedDisaster(disasterData)
	}

	const onSelectNewDisaster = () => {
		const newDisaster = {
			disaster:
			{
				id: -1,
				disasterName: "",
				subDisasterCategoryID: selectedSubDisasterCategory?.subDisasterCategory?.id,
				versionID: -1,
				userLevelIDs: null,
				description: null
			},
			actionSteps: [],
			version:
			{
				id: -1,
				isNormal: isNormal,
				createTime: null,
				lastAccessTime: null,
				versionName: "",
				ownerID: -1,
				description: -1
            }
		};

		setSelectedDisaster(newDisaster);
		setNewDisaster(newDisaster);
	}

	const getLastDisaster = (disasterDatas) => {
		if (disasterDatas) {
			const count = disasterDatas.length;

			for (let i = count-1; i >= 0; i--) {
				const disasterData = { ...disasterDatas[i] };

				if (disasterData.version) {
					disasterData.version = { ...disasterData.version };
					disasterData.version.isNormal = isNormal;
				}

				return disasterData;
            }
		}

		return null;
	}

	const getSOPData = () => {
		if (selectedSubDisasterCategory === newSubDisasterCategory) {
			const sdcName = refNewSDC.current.value.trim();

			if (sdcName.length === 0) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.inputDisasterType], null, null);
				return null;
			}

			selectedSubDisasterCategory.subDisasterCategory.subCategoryName = sdcName;
		}

		let disasterData = selectedDisaster;

		if (disasterData === newDisaster) {
			const disasterName = refNewDisaster.current.value.trim();

			if (disasterName.length === 0) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.inputSOPName], null, null);
				return null;
			}

			disasterData.disaster.disasterName = disasterName;
			disasterData = {
				disasterName: disasterName,
				disasterDatas: [disasterData]
			};
		}

		const disaster = getLastDisaster(disasterData.disasterDatas);

		if (disaster === null) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.unknownSOPName], null, null);
			return;
		}

		disaster.version.owner = disaster.owner;

		const sopData = {
			disasterCategory: selectedDisasterCategory,
			subDisasterCategory: selectedSubDisasterCategory,
			disaster: disaster.disaster,
			version: disaster.version,
			actionStepDatas: disaster.actionSteps
		};

		return sopData;
	}

	const onClickCancel = () => {
		// 원래 상태 그대로 돌려준다.
		props.content(SopManagerResource.menu.editSOP, props.sopData);
    }

	const onClickApply = () => {
		if (!selectedDisasterCategory) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectDisasterCategory], null, null);
			return;
		}
		else if (!selectedSubDisasterCategory) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectSubDisasterCategory], null, null);
			return;
		}
		else if (!selectedDisaster) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectSOPName], null, null);
			return;
		}

		const sopData = getSOPData();

		if (sopData?.actionStepDatas && sopData.actionStepDatas.length > 0) {
			_checkStepMembers(sopData);
			//props.content(SopManagerResource.menu.editSOP, sopData);
		}
		else {
			addActionStepDatas(sopData);
        }
	}

	const addActionStepDatas = async (sopData) => {
		const [actionStepDatas, message] = await SopController.requestDefaultActionStepDatas();

		if (actionStepDatas === null) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
		}
		else {
			sopData.actionStepDatas = actionStepDatas;
			await checkStepMembers(sopData);
			props.content(SopManagerResource.menu.editSOP, sopData);
        }
	}

	const _checkStepMembers = async (sopData) => {
		await checkStepMembers(sopData);
		props.content(SopManagerResource.menu.editSOP, sopData);
    }

	const checkStepMembers = async (sopData) => {
		if (sopData) {
			const actionStepCount = sopData.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = sopData.actionStepDatas[i];

				if (actionStepData.stepMemberDatas.length === 0) {
					const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStepData, props.selectedSiteNo);

					if (!stepMemberData) {
						props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
						break;
					}
				}
			}
		}
	}

	const getDisasterCategoryImage = (disasterCategoryData) => {
		const dcType = SopManagerResource.getDisasterCategoryType(disasterCategoryData.disasterCategory.categoryName);

		if (dcType === SopManagerResource.disasterCategoryType.fire) {
			return fire_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.natureDisaster) {
			return natureDisaster_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.explosion) {
			return explosion_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.pollution) {
			return pollution_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.security) {
			return security_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.terror) {
			return terror_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.lifesaving) {
			return lifesaving_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.earthquake) {
			return earthquake_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.strongwind) {
			return strongwind_icon;
		}
		else if (dcType === SopManagerResource.disasterCategoryType.blackout) {
			return blackout_icon;
		}

		return etc_icon;
	}

	const onChangeSubDisasterCategoryText = () => {
		if (refNewSDC.current) {
			const value = refNewSDC.current.value;

			if (value && value.length > 0) {
				if (refNewSDCRadio.current) {
					refNewSDCRadio.current.checked = true;
					onSelectNewSubDisasterCategory();
				}
			}
        }
	}

	const onChangeDisasterText = () => {
		if (refNewDisaster.current) {
			const value = refNewDisaster.current.value;

			if (value && value.length > 0) {
				if (refNewDisasterRadio.current) {
					refNewDisasterRadio.current.checked = true;
					onSelectNewDisaster();
				}
			}
        }
    }

	if (loading) {
		return <h2>{loadingMessage}</h2>
	}

	const sdcClassName = selectedDisasterCategory ? "on" : "";
	const disasterClassName = selectedSubDisasterCategory ? "on" : "";
	
	return (
		<NewSOPOptionsComponent>
			{/* <div className={'speWrap'}> */}
				<div className={'speTop'}>
					<h3>{SopManagerResource.ID.menu.newSOP}</h3>
					<div className={'labelInputRadio'}>
						<input type="radio" name="speTop" /* id={NewSOPOptions.cssStyles.speTop01} */ checked={isNormal} onChange={() => onSelectSopMode(null, true)} /><label onClick={(event) => onSelectSopMode(event, true)}>평일/주간 모드</label>
					</div>
					<div className={'labelInputRadio'}>
						<input type="radio" name="speTop" /* id={NewSOPOptions.cssStyles.speTop02} */ checked={!isNormal} onChange={() => onSelectSopMode(null, false)} /><label onClick={(event) => onSelectSopMode(event, false)}>휴일/야간 모드</label>
					</div>
				</div>

				<div className={'speRow'}>
					<div className={'speContFirst'}>
						<div>
							<div>
								<h4 className={'on'}>{SopManagerResource.ID.category.disasterCategory}</h4>
								<div className={'speChk'}></div>
								<div className={'scrollWrapper' + " " + 'scrollbarOuter'}>
									<div className={'speScr'}>
										<div className={'speGry'}>
											{
												disasterCategories.map(disasterCategoryData => (
													<li key={"dc_" + disasterCategoryData.disasterCategory.categoryName}>
														<label htmlFor={'speGry01'}>
															<span>
																<input type="radio" name="speGry" id={'speGry01'} onChange={() => onSelectDisasterCategory(disasterCategoryData)} />
															</span>
															<span>{disasterCategoryData.disasterCategory.categoryName}</span>
														</label>
													</li>
													))
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<span className={'nextStageIcon'}></span>
					<div className={'speContSecond'}>
						<div>
							<div>
								<h4 className={sdcClassName}>{SopManagerResource.ID.category.subDisasterCategory}</h4>
								<div className={'scrollWrapper'}>
									<div className={'speScr'}>
										<div className={'speLst'}>
											{
												subDisasterCategories.map(sdc => (
													<li key={"sdc_" + sdc.subDisasterCategory.subCategoryName}>
														<span className={'labelInputRadio'}>
															<input type="radio" name="speType" id={'speType01'} disabled={selectedDisasterCategory === null} onChange={() => onSelectSubDisasterCategory(null, sdc)} />
														<label onClick={(event) => onSelectSubDisasterCategory(event, sdc)}>{sdc.subDisasterCategory.subCategoryName}</label>
														</span>
													</li>
												))
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<span className={'nextStageIcon'}></span>
					<div className={'speContThird'}>
						<div>
							<div>
								<h4 className={disasterClassName}>{SopManagerResource.ID.category.disaster}</h4>
								<div className={'scrollWrapper'}>
									<div className={'speScr'}>
										<div className={'speIpt'}>
											{
												disasterDatas.map(disasterData => (
													<li key={"disaster_" + disasterData.disasterName}>
														<span className={'labelInputRadio'}>
															<input type="radio" name="speIpt" id={'speIpt01'} disabled={selectedSubDisasterCategory === null} onChange={() => onSelectDisaster(null, disasterData)}/>
															<label onClick={(event) => onSelectDisaster(event, disasterData)}>{disasterData.disasterName}</label>
														</span>
													</li>
													))
											}
											<li>
											<span className={'labelInputRadio'}>
												<input ref={refNewDisasterRadio} type="radio" name="speIpt" id={'speIpt01'} disabled={selectedSubDisasterCategory === null} onChange={() => onSelectNewDisaster()} />
											</span>
											<span className={'labelInputTextBlack'}>
												<input ref={refNewDisaster} type="text" /* className={bodyStyles.fullText} */ disabled={selectedSubDisasterCategory === null} placeholder={SopManagerResource.ID.placeHolders.newSOP} onChange={() => onChangeDisasterText()} />
											</span>
											</li>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={'speBot'}>
					<a onClick={() => onClickCancel()}>{SopManagerResource.ID.common.cancel}</a>
					&nbsp;&nbsp;
					<a onClick={() => onClickApply()}>{SopManagerResource.ID.common.make}</a>
				</div>

			{/* </div> */}
		</NewSOPOptionsComponent>
	);
}

export default NewSOPOptions;