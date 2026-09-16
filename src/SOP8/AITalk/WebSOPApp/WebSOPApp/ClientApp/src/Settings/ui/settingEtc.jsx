import React from 'react';
import { withRouter } from 'react-router-dom';
import { SettingEtcComponent } from '../styled/settingsStyled';

function SettingEtc(props) {
    return (
        <SettingEtcComponent>
            <ul className='menuTypeWrap'>
                <li className='on'>
                    일반 정보
                </li>
            </ul>
            <ul className='contents'>
                <li className='item first'>
                    <div>
                        <p>버전 정보</p>
                        <span>{props.settings.SystemVersion.value}</span>
                    </div>
                </li>
                <li className='item last'>
                    <div>
                        <p>유지보수 정보</p>
                        <span>{props.settings.AfterService.value}</span>
                    </div>
                </li>
                <li className='item first margin'>
                    <div>
                        <p>제품 공급자 정보</p>
                        <span>{props.settings.Provider.value}</span>
                    </div>
                </li>
                <li className='item last'>
                    <div>
                        <p>고객지원센터</p>
                        <span>{props.settings.CallCenter.value}</span>
                    </div>
                </li>
            </ul>
        </SettingEtcComponent>
    );
}

export default withRouter(SettingEtc);