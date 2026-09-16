import React, { useState, useEffect, useRef } from 'react';
import SopManagerResource from '../../resource/id';
import SopController from '../../services/sopController';
import SopManager from '../sopManager';
import $ from 'jquery';
import '../../../Common/js/treeview.js';
//import '../../../TeamEditor/ui/utility/css/style.css'; /* 사용중인것, 지우지마세요 */
import SopDataManager from '../../services/sopDataManager';

import { SaveSOPOptionsComponent } from '../../../SOPManager/styled/popupStyled';
import ProjectResource from '../../../Root/resource/id.js';


function SaveSOPOptions(props) {
	const getSOPMode = (sopData) => {
		if (sopData?.version) {
			return sopData.version.isNormal;
		}

		return true;
	}

	const [sopData, setSopData] = useState(props.sopData);
    const [isNormal, setIsNormal] = useState(getSOPMode(props.sopData));
    const [versions, setVersions] = useState([]);
    const [currentVersion, setCurrentVersion] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [saveNewVersion, setSaveNewVersion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("버전 정보를 얻어오고 있습니다.");
    const prevProps = useRef(props);

    const refTextNewVersionName = useRef();
    const refTextNewVersionDescription = useRef();
    const refCheckNewVersion = useRef();

	useEffect(() => {
		getVersions(sopData);
	}, [])

    useEffect(() => {
        prevProps.current = props;
    }, [props]);

	const getVersions = async (sopData) => {
		if (!sopData) {
			return;
		}

		const [disasterVersions, message] = await SopController.requestDisasterVersions(sopData);

		if (disasterVersions === null) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], ['확인'], onClickCancle);
			setLoading(false);
		}
		else {
			setVersions(disasterVersions.versions);
			setCurrentVersion(disasterVersions.currentVersion);
			setLoading(false);
		}
	}

	const onClickCancle = () => {
		onClickApply(false);
		props.onCloseConfirmDialog();
	}

	const onCheckNewVersion = (event) => {
		setSaveNewVersion(event.target.checked);
	}

	const onClickClose = () => {
		props.content(SopManagerResource.menu.editSOP, sopData);
	}

	const onClickApply = (ok) => {
		if (ok) {
			if (refCheckNewVersion.current.checked) {
				const newVersionName = refTextNewVersionName.current.value.toString().trim();
	
				if (newVersionName.length === 0) {
					props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.inputSOPVersionName], null, null);
					return;
				}
	
				sopData.version = SopDataManager.makeNewVersion(isNormal, newVersionName, props.loginUser ? props.loginUser.user_sn : -1, refTextNewVersionDescription.current.value.toString().trim());
				props.content(SopManagerResource.menu.save, sopData);
				return;
			}
	
			if (selectedVersion) {
				sopData.version.ver_sn = selectedVersion.ver_sn;
				sopData.version.isNormal = selectedVersion.isNormal;
				props.content(SopManagerResource.menu.save, sopData);
			} else {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [SopManagerResource.ID.messages.selectSOPVersion], null, null);
			}
		} else {
			props.content(SopManagerResource.menu.editSOP, sopData);
		}
	}

	const tbRdo = (event, version) => {
		const tr = event.target.parentElement;

		for (let i = 0; i < tr.parentElement.children.length; i++) {
			const row = tr.parentElement.children[i];

			if (row === tr) {
				continue;
			}
			else {
				row.classList.remove("on");
			}
		}

		tr.classList.add("on");
		const saveNewVersion = version === null || version === undefined;

		setSelectedVersion(version);
        setSaveNewVersion(saveNewVersion);
	};

	const onChangeSopMode = (isNormal) => {
		getDisasterVersions(isNormal);
	}

	const getDisasterVersions = async (isNormal) => {
		const [disasterVersions, message] = await SopController.requestDisasterVersions(sopData);

		if (disasterVersions === null) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		setVersions(disasterVersions.versions);
        setCurrentVersion(disasterVersions.currentVersion);
        setIsNormal(isNormal);
    }

	const getUserName = () => {
		if (props.loginUser) {
			/*if (props.loginUser.nickName.length > 0) {
				return props.loginUser.nickName;
			}
			else {*/
				return props.loginUser.user_id;
            //}
		}

		return "-";
    }

	if (loading) {
		return <h2>{loadingMessage}</h2>
	}

	const _currentVersion = currentVersion?.name ? currentVersion : currentVersion?.version;
	const userName = getUserName();

	return (
		<SaveSOPOptionsComponent>
			<div className={'sopPop'}>
				<div>
					<div>
						<div className={'spPop'}>
							<div className={'sppTop'}>
								<h4>DB 저장</h4>
								<a onClick={() => onClickClose()}>닫기</a>
							</div>
							<div className={'spprCont2'}>
								<div className={'scrollWrapper' + " " + 'scrollbarOuter'} id="pos_relative">
									<div className={'scrollbarOuter' + " " + 'scrollContent'} id="saveSOP_scrollContent">
										<div className={'spprCont'}>
											<table className={'scTb'}>
												<caption>버전명, 작성자, 생성일자, 수정일자, 부가설명으로 구성된 표</caption>
												<colgroup>
													<col className={'width_10Pro'} />
													<col className={'width_10Pro'} />
													<col className={'width_20Pro'} />
													<col className={'width_20Pro'} />
													<col className={'width_35Pro'} />
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
														_currentVersion && (
															<tr onClick={(event) => tbRdo(event, _currentVersion)}>
																<td>{_currentVersion.name}</td>
																<td>{currentVersion.owner}</td>
																<td>{_currentVersion.creat_de.replace('T', ' ')}</td>
																<td>{_currentVersion.last_acces_de.replace('T', ' ')}</td>
																<td>{_currentVersion.descp}</td>
															</tr>
														)
													}
													<tr onClick={(event) => tbRdo(event, null)}>
														<td><input ref={refTextNewVersionName} type="text" /></td>
														<td>{userName}</td>
														<td>-</td>
														<td>-</td>
														<td><input ref={refTextNewVersionDescription} type="text" /></td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className={'spprBotSave'}>
									<label style={{ display: "none" }} >
										<input ref={refCheckNewVersion} type="checkbox" className={'labelInput'} name="" id="popChk" checked={saveNewVersion || currentVersion === null} onChange={onCheckNewVersion} />
										새 버전으로 저장
									</label>
									<a className={'cancel'} onClick={() => onClickApply(false)}>취소</a>
									<a className={'save'} onClick={() => onClickApply(true)}>저장</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SaveSOPOptionsComponent>
	);
}

export default SaveSOPOptions;