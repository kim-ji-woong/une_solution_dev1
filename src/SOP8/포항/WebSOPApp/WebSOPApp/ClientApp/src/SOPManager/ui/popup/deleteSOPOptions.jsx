import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import SopManagerResource from '../../resource/id';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
//import '../../../TeamEditor/ui/utility/css/style.css'; /* 사용중인것, 지우지마세요 */

import { DeleteSOPOptionsComponent } from '../../../SOPManager/styled/popupStyled.js';
import ProjectResource from '../../../Root/resource/id.js';


const DeleteSOPOptions = forwardRef((props, ref) => {
	// 부모 컴포넌트에서 사용할 함수 설정
	useImperativeHandle(ref, () => ({
		// 부모 컴포넌트에서 사용할 함수를 선언
		postDeleteMethod
	}))

	const [disasterCategories, setDisasterCategories] = useState([]);
    const [isNormal, setIsNormal] = useState(true);
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(SopManagerResource.ID.messages.loadingData);

    const refCheckBoxHeader = useRef(null);
    const refTBody = useRef(null);

	let deleteVersionIDs = [];

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
		if (selectedDisaster !== disasterData) {
			if (refCheckBoxHeader.current) {
				refCheckBoxHeader.current.checked = false;
				onChangeCheckHeader(refCheckBoxHeader.current);
			}

			setSelectedDisaster(disasterData);
		}
	}

	const getCheckedVersions = () => {
		const children = refTBody.current.children;
		const childCount = children.length;

		const versionIDs = [];

		for (let i = 0; i < childCount; i++) {
			const tr = children[i];

			if (tr.tagName === "TR") {
				if (tr.children.length > 0) {
					const td = tr.children[0];

					if (td.tagName !== "TD") {
						continue;
					}

					if (td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName !== "INPUT") {
							continue;
						}

						if (input.checked) {
							const versionID = parseInt(tr.dataset.versionid);

							if (isNaN(versionID) === false && versionID !== undefined && versionID !== null) {
								versionIDs.push(versionID);
							}
                        }
					}
				}
			}
		}

		return versionIDs;
    }

	const onClickDelete = (event) => {
		const versionIDs = getCheckedVersions();

		if (versionIDs.length > 0) {
			if (checkCurrentVersion(versionIDs)) {
				props.content(SopManagerResource.menu.delete, [versionIDs, this, isNormal]);
			}
        }
		else {
			props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['삭제할 SOP를 선택해주세요.'], null, null);
		}
	}

	const checkCurrentVersion = (versionIDs) => {
		const sopData = props.sopData;

		if (sopData?.disaster) {
			const disaster = { ...sopData.disaster };

			for (const versionID of versionIDs) {
				if (versionID === disaster.ver_sn) {
					deleteVersionIDs = versionIDs;
					props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["현재 화면에서 편집중인 버전을 삭제하려고 합니다.", "계속 진행할까요? 이 작업은 돌이킬수 없습니다."], ["취소", "확인"], onConfirmDelete);
					return false;
                }
            }
		}

		return true;
	}

	const onConfirmDelete = (index) => {
		if (index === 1) {
			props.content(SopManagerResource.menu.delete, [deleteVersionIDs, this, isNormal]);
		}

		props.onCloseConfirmDialog();
    }

	const postDeleteMethod = (obj, isNormal) => {
		onChangeSopMode(isNormal);
    }

	const tbRdo = (event, version) => {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++)
		{
			const row = tr.parentElement.children[i];

			if (row === tr) {
				if (row.children.length > 0) {
					const td = row.children[0];

					if (td.tagName === "TD" && td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName === "INPUT") {
							input.checked = input.checked ? false : true;
						}
					}
				}

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
				<tr key={"version_" + versionCount} data-versionid={disaster.version.ver_sn} onClick={(event) => tbRdo(event, disaster.version)}>
					<td>
					   <input type="checkbox" /* className={styles.deleteCheckbox} */ />
					</td>
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
				<table className={'scTb'}>
					<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
					<colgroup>
						<col className={'col5Pro'} />
						<col className={'col12Pro'} />
						<col className={'col12Pro'} />
						<col className={'col25Pro'} />
						<col className={'col25Pro'} />
						<col className={'col40Pro'} />
					</colgroup>
					<thead>
						<tr>
							<th>
								<span className={'labelInput'}>
								    <input ref={refCheckBoxHeader} type="checkbox" onChange={(e) => onChangeCheckHeader(e.target)} />
								</span>
						    </th>
							<th>버전명</th>
							<th>작성자</th>
							<th>생성일자</th>
							<th>수정일자</th>
							<th>부가설명</th>
						</tr>
					</thead>
					<tbody ref={refTBody}>
						{
							disasterData.disasterDatas && (
								disasterData.disasterDatas.map(disaster => (getDisasterVersion(disaster)))
							)
						}
					</tbody>
				</table>
			);
		}

		return <></>
	}

	const onChangeCheckHeader = (target) => {
		if (!refTBody.current) {
			return;
		}

		const children = refTBody.current.children;
		const childCount = children.length;
		const checked = target.checked;

		for (let i = 0; i < childCount; i++) {
			const child = children[i];

			if (child.tagName === "TR") {
				if (child.children.length > 0) {
					const td = child.children[0];

					if (td.tagName !== "TD") {
						continue;
					}

					if (td.children.length > 0) {
						const input = td.children[0];

						if (input.tagName !== "INPUT") {
							continue;
						}

						input.checked = checked;
                    }
                }
            }
        }
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
		<DeleteSOPOptionsComponent>
			<div className={'sopPop'}>
				<div>
					<div>
						<div className={'spPop'}>
							<div className={'sppTop'}>
								<h4>SOP삭제</h4>
								<a onClick={() => onClickClose()}>닫기</a>
							</div>
							<div className={'sppSel'}>
								{/* <h5>전체 SOP</h5> */}
								<label className={'labelInputRadio'}>
									<input type="radio" name="sppSel" checked={isNormal} onChange={() => onChangeSopMode(true)} />
										{SopManagerResource.ID.sopMode.normal}
								</label>
								<label className={'labelInputRadio'}>
									<input type="radio" name="sppSel" checked={!isNormal} onChange={() => onChangeSopMode(false)} />
										{SopManagerResource.ID.sopMode.abnormal}
								</label>
							</div>
							<div className={'sppCont'}>
								<div className={'sppLft'}>
									<div className={'scrollbarOuter'}>
										<ul className={'sarTree' + ' treeview'}>
										{
											disasterCategories && (
												disasterCategories.map(disasterCategoryData => (getDisasterCategoryContents(disasterCategoryData)))
											)
										}
										</ul>
									</div>
								</div>
								<div className={'sppRhtDelete'}>
									<div className={'scrollbarOuter'}>
										<span className={'spprCont'}>
										{
											getDisasterVersions(selectedDisaster)
										}
										</span>
									</div>
									<div className={'spprBot'}>
										<a className={'blu'} onClick={onClickDelete}>SOP 삭제</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DeleteSOPOptionsComponent>
	);
})

export default DeleteSOPOptions;