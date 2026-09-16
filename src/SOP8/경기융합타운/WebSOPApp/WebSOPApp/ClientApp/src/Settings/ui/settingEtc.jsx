import React from 'react';
import { withRouter } from 'react-router-dom';
import { SettingEtcComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';

function SettingEtc(props) {

    return (
        <SettingEtcComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>시스템 버전 정보</p>
                        <span>V 1.0</span>
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>환경설정 초기화 설정</p>
                        <button>시스템 기본값으로 재설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="환경설정을 시스템 초기값으로 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>시스템 종료</p>
                        <button>시스템 종료</button>
                    </div>
                    <div id='tooltip' data-tooltip="시스템을 완전히 종료합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </SettingEtcComponent>
    );
}

export default withRouter(SettingEtc);