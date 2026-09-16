import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import $ from 'jquery';
import TeamEditorResource from '../resource/id';

import { SubContScheduleComponent } from '../../TeamEditor/styled/teamStyled';

function SchedulePage(props) {
	// 왼쪽 메뉴 높이 가져와 스크롤 높이 넣기
	let target = $('.pageMenu');
	//let menuHeight = target[0].clientHeight;

	if (props.scheduleType == TeamEditorResource.ID.textFixed) {
		return (
			<SubContScheduleComponent id={'subCont'} >
				<Scrollbars /* style={{ height: menuHeight }} */>
					<div className={'scWrap'}>
						<div className={'scCont'}>
							<div className={'scTop'}>
								<h4>고정 근무표 편집</h4>
								<div className={'sctRht'}>
										<select name="" id="" className={'sctrSel'}>
										<option value="">A조</option>
									</select>
									<a href="#">추가</a>
								</div>
							</div>
								<div className={'scSec'}>
									<div className={'scsLft'}>
										<div className={'scAtcl'}>
										<h5>제어실 근무표</h5>
											<table className={'scTb'}>
											<caption>번호, 소속팀, 이름, 직위, 직급, 휴대전화번호, 사번, 근무처 전화번호로 구성된 표</caption>
											<colgroup>
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
												<col style={{ width: '12.5%' }} />
											</colgroup>
											<thead>
												<tr>
													<th></th>
													<th>1호기</th>
													<th>2호기</th>
													<th>3호기</th>
													<th>4호기</th>
													<th>5호기</th>
													<th>6호기</th>
													<th>7호기</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>발전파트장</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
												</tr>
												<tr>
													<td>발전과장</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>SOB</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" value="홍길동" className={'mt50'} />
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" className={'mt50'}/>
													</td>
												</tr>
												<tr>
													<td>BTG-B</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>BTG-T</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>ATO</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>MBO</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>가스운전원<br />(DNO)</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>BTG-F</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>FGAO</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>CCO</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>CPP</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>기타</td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
													<td><span>&nbsp;</span></td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
									<div className={'scsRht'}>
										<div className={'scAtcl'}>
										<h5>통합방재센터 근무표</h5>
											<table className={'scTb'}>
											<caption>조장, 조원, 점검원으로 구성된 표</caption>
											<colgroup>
												<col style={{ width: '30%' }} />
												<col style={{ width: '70%' }} />
											</colgroup>
											<thead>
												<tr>
													<th></th>
													<th>통합방재센터</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>조장</td>
													<td>
															<div className={'sctEdt'}>
															<p>홍길동</p>
															<a href="#">편집</a>
														</div>
													</td>
												</tr>
												<tr>
													<td>조원</td>
													<td><span>&nbsp;</span></td>
												</tr>
												<tr>
													<td>점검원</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" value="홍길동" />
													</td>
												</tr>
											</tbody>
										</table>
									</div>
										<div className={'scAtcl mt60'}>
										<h5>당직실 근무표</h5>
											<table className={'scTb'}>
											<caption>책임자, 당직자로 구성된 표</caption>
											<colgroup>
												<col style={{ width: '30%' }} />
												<col style={{ width: '70%' }} />
											</colgroup>
											<thead>
												<tr>
													<th></th>
													<th>통합방재센터</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>책임자</td>
													<td>
														<input type="text" value="홍길동" />
														<input type="text" value="홍길동" className={'mt50'} />
													</td>
												</tr>
												<tr>
													<td><span>&nbsp;</span></td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className={'scCont mt20'}>
							<dl className={'sccInfo'}>
							<dt>
								<h5>근무자<br />변경방법</h5>
							</dt>
							<dd>
								<ul>
									<li>근무조를 선택세요.</li>
									<li>변경하고자 하는 근무조원을 마우스로 더블클릭 하세요.</li>
									<li>팝업되는 직원 검색창에서 변경하고자 하는 직원의 이름을 입력하고 검색하세요.</li>
									<li>변경하고자 하는 직원을 선택 후 ‘선택’ 버튼을 누르세요.</li>
									<li>지정한 직원을 지정해제하실 경우 변경하고자 하는 직원을 선택 후 ‘Delete’ 키를 누르세요.</li>
								</ul>
								<p>
									※ 영구적으로 변경시에는 ‘고정 근무조원 편집’을 눌러 편집하세요.<br />
									※ 대근자를 원래 근무자로 바꾸고자 할 경우 해당 근무자 위에서 [마우스 오른쪽 버튼] 클릭 → [정상근무조원으로 변경] 클릭
								</p>
								</dd>
							</dl>
						</div>
					</div>
				</Scrollbars>
			</SubContScheduleComponent>
		);
	} else if (props.scheduleType == TeamEditorResource.ID.textCurrent) {
		return null;
	} else {
		return null;
	}
}

export default SchedulePage;