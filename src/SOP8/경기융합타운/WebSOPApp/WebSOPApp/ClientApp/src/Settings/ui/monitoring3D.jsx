import React from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';

function Monitoring3D(props) {

    return (
        <Monitoring3DComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>3D 회전 대기시간/자동회전 설정</p>
                        <select>
                            <option>15분</option>
                            <option>30분</option>
                            <option>1시간</option>
                        </select>
                    </div>
                    <div id='tooltip' data-tooltip="3D 회전 대기시간 및 자동회전을 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서 유형별 이벤트 발생 표시 설정 </p>
                        <div>
                            <input type='checkbox' id='sensor_1' />
                            <label htmlFor='sensor_1'>화재센서</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_2' />
                            <label htmlFor='sensor_2'>비상벨</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_3' />
                            <label htmlFor='sensor_3'>전력</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_3' />
                            <label htmlFor='sensor_3'>침수</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_3' />
                            <label htmlFor='sensor_3'>지진</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="센서 유형별 이벤트 발생 표시를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 화면 자동전환 설정</p>
                        <div>
                            <input type='radio' name='eventView' id='current' />
                            <label htmlFor='current'>현재화면 유지</label>
                        </div>
                        <div>
                            <input type='radio' name='eventView' id='move' />
                            <label htmlFor='move'>이벤트 발생 위치로 화면이동</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 시 자동 화면 전환 여부를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>팝업창 위치 초기화 설정</p>
                        <button>시스템 기본값으로 재설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="팝업창 위치를 초기화합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </Monitoring3DComponent>
    );
}

export default withRouter(Monitoring3D);