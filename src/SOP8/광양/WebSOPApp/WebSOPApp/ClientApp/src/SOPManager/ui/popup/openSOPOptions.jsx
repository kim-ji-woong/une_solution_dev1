import React, { useState, useEffect } from 'react';
import SopManagerResource from '../../resource/id';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
//import '../../../TeamEditor/ui/utility/css/style.css';

import { OpenSOPOptionsComponent } from '../../../SOPManager/styled/popupStyled';
import ProjectResource from '../../../Root/resource/id.js';

function OpenSOPOptions(props) {
	const [disasterCategories, setDisasterCategories] = useState([]);
    const [isNormal, setIsNormal] = useState(true);
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(SopManagerResource.ID.messages.loadingData);

	let dcCount = 0;
	let sdcCount = 0;
	let disasterCount = 0;
	let versionCount = 0;

    useEffect(() => {
        onChangeSopMode(isNormal);
        $(document).ready(function () {
            $('.treeview').hummingbird();
        });
    }, [isNormal]);

	const onChangeSopMode = (isNormal) => {
		getDisasterCategories(isNormal);
	}

	const getDisasterCategories = async (isNormal) => {
		const [disasterCategories, message] = await SopController.disasterCategories(isNormal, props.selectedSiteNo);

		if (disasterCategories) {
			if (isNormal) {
				setLoading(false);
				setIsNormal(isNormal);
				setSelectedDisaster(null);
				setDisasterCategories(disasterCategories);
			}
			else {
				setLoading(false);
				setIsNormal(isNormal);
				setSelectedDisaster(null);
				setDisasterCategories(disasterCategories);
			}
		}
		else {
			setLoading(true);
			setLoadingMessage(message);
			setIsNormal(isNormal);
			setSelectedDisaster(null);
		}
	}

	const onClickClose = () => {
		// 원래 상태 그대로 돌려준다.
		props.content(SopManagerResource.menu.editSOP, props.sopData);
	}

	const onClickTreeNode = (event) => {
		//if (event.target.classList.contains("fa-minus")) {
		//	event.target.classList.remove("fa-minus");
		//	event.target.classList.add("fa-plus");
		//}
		//else if (event.target.classList.contains("fa-plus")) {
		//	event.target.classList.remove("fa-plus");
		//	event.target.classList.add("fa-minus");
		//}

		//setState({ loading: false });
	}

	const onClickDisaster = (disasterData) => {
		setSelectedDisaster(disasterData);
	}

	const onClickOpen = (event) => {
		if (selectedDisaster) {
			if (!selectedVersion) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectSOPVersion], null, null);
				return;
			}
			
			props.content(SopManagerResource.menu.open, getDisasterNo(selectedDisaster, selectedVersion.ver_sn));
		}
		else {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectSOPVersion], null, null);
        }
	}

	const getDisasterNo = (disaster, ver_sn) => {
		for (const disasterData of disaster.disasterDatas) {
			if (disasterData.disaster && disasterData.disaster.ver_sn === ver_sn) {
				return disasterData.disaster.sclas_sn;
            }
		}

		return null;
    }

	const tbRdo = (event, version) => {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++)
		{
			const row = tr.parentElement.children[i];

			if (row === tr) {
				continue;
			}
			else {
				row.classList.remove("on");
            }
        }

		tr.classList.add("on");
		setSelectedVersion(version);
	};

	const getDisasterVersion = (disaster) => {
		if (disaster?.version) {
			versionCount = versionCount + 1;

			return (
				<tr key={"version_" + versionCount} onClick={(event) => tbRdo(event, disaster.version)}>
					<td>
						<span
							onMouseOver={(e) => props.handleTooltip(e, disaster.version.name)}
							onMouseLeave={() => props.removeTooltip()}
						>
							{disaster.version.name}
						</span>
					</td>
					<td>{disaster.owner}</td>
					<td>{disaster.version.creat_de.toString().replace('T', ' ')}</td>
					<td>{disaster.version.last_acces_de.toString().replace('T', ' ')}</td>
					<td className={'tal'}>
						<span
							onMouseOver={(e) => props.handleTooltip(e, disaster.version.descp)}
							onMouseLeave={() => props.removeTooltip()}
						>
							{disaster.version.descp}
						</span>
					</td>
				</tr>
			);
		}

		return <></>
    }

	const getDisasterVersions = (disasterData) => {
		versionCount = 0;

		if (disasterData) {
			return (
				<>
					<table className={'scTb'}>
						<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
						<colgroup>
							<col className={'col10Pro'} />
							<col className={'col10Pro'} />
							<col className={'col30Pro'} />
							<col className={'col30Pro'} />
							<col className={'col30Pro'} />
						</colgroup>
						<thead>
							<tr>
								<th>버전명</th>
								<th>작성자</th>
								<th>생성일자</th>
								<th>수정일자</th>
								<th>부가설명</th>
							</tr>
						</thead>
						<tbody>
							{
								disasterData.disasterDatas && (
									disasterData.disasterDatas.map(disaster => (getDisasterVersion(disaster)))
								)
							}
						</tbody>
					</table>
			    </>
			);
		}

		return <></>
    }

	const getDisasterContents = (disasterData) => {
		disasterCount = disasterCount + 1;
		const className = disasterData === selectedDisaster ? "treeviewLastItem " + " " + "selectedTreeNode" : "treeviewLastItem ";

		return (
			<li key={"disaster_" + disasterCount} className={className} onClick={() => onClickDisaster(disasterData)}>{disasterData.disasterName}</li>
		);
	}

	const getSubDisasterCategoryContents = (subDisasterCategoryData) => {
		if (!subDisasterCategoryData.subDisasterCategory) {
			return <></>
		}

		sdcCount = sdcCount + 1;

		if (subDisasterCategoryData.disasterDatas && subDisasterCategoryData.disasterDatas.length > 0) {
			return (
				<li key={"sdc_" + sdcCount}>
					<i className="fa-minus" onClick={onClickTreeNode}>더보기</i><h5>{subDisasterCategoryData.subDisasterCategory.mclas_name}</h5>
					{
						subDisasterCategoryData.disasterDatas && (
							<ul>
								{
									subDisasterCategoryData.disasterDatas.map(disasterData => getDisasterContents(disasterData))
								}
							</ul>
						)
					}
				</li>
			);
		}

		return (
			<li key={"sdc_" + sdcCount} className={"treeviewLastItem " + " " + 'grayText'}>{subDisasterCategoryData.subDisasterCategory.mclas_name}</li>
		);
	}

	const getDisasterCategoryContents = (disasterCategoryData) => {
		if (!disasterCategoryData.disasterCategory) {
			return <></>
		}

		dcCount = dcCount + 1;

		return (
			<li key={"dc_" + dcCount}>
				<i className="fa-minus" onClick={onClickTreeNode}>더보기</i><h5>{disasterCategoryData.disasterCategory.lclas_name}</h5>
				{
					disasterCategoryData.subDisasterCategories && (
					<ul>
					{
							disasterCategoryData.subDisasterCategories.map(subDisasterCategoryData => getSubDisasterCategoryContents(subDisasterCategoryData))
					}
					</ul>
					)
				}
			</li>
		);
    }

	return (
		<OpenSOPOptionsComponent>
			<div className={'sopPop'}>
				<div>
					<div>
						<div className={'spPop'}>
							<div className={'sppTop'}>
								<h4>목록열기</h4>
							</div>
							<div className={'sppSel'}>
								<label>
									<input type="radio" name="sppSel" checked={isNormal} onChange={() => onChangeSopMode(true)} />
									{SopManagerResource.ID.sopMode.normal}
								</label>
								<label>
									<input type="radio" name="sppSel" checked={!isNormal} onChange={() => onChangeSopMode(false)} />
									{SopManagerResource.ID.sopMode.abnormal}
								</label>
							</div>
							<div className={'sppCont'}>
								<div className={'sppLft'}>
									<div className={'scrollbarOuter'}>
										<ul className={'sarTree' + " " + ' treeview'}>
										{
											disasterCategories && (
												disasterCategories.map(disasterCategoryData => (getDisasterCategoryContents(disasterCategoryData)))
											)
										}
										</ul>
									</div>
								</div>
								<div className={'sppRht'}>
									<div className={'scrollbarOuter'}>
										<div className={'spprCont'}>
										{
											getDisasterVersions(selectedDisaster)
										}
										</div>
									</div>
								</div>
								<div className={'spprBot'}>
									<a onClick={onClickClose}>취소</a>
									<a className={'blu'} onClick={onClickOpen}>열기</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</OpenSOPOptionsComponent>
	);
}

export default OpenSOPOptions;