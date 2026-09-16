import React from 'react';
import { withRouter } from 'react-router-dom';
import { SettingEtcComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';
import { SettingController } from '../services/settingController';
import { AccountController } from '../../Account/services/accountController';
import SettingsStore from '../settingsStore';

function SettingEtc(props) {

    const onClickResetPopupState = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['팝업창 위치를 시스템 기본값으로 재설정하시겠습니까?'], ['확인'], doResetPopupState);
    }

    const doResetPopupState = async () => {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        const options = [{ 
            category: 'popup', 
            subCategory: null, 
            values: [] 
        }];

        const [result, message] = await AccountController.requestSaveOptions(
            userInfo.user_sn,
            options
        );

        if (!result) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: {} });
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['설정이 완료되었습니다.'], null, null);
        }
    }

    const doInitializeSettings = async (index) => {
        if (index === 1) {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return;

            const [success, message] = await SettingController.requestInitialize(userInfo.site_sn);

            if (success) {
                props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['환경설정이 시스템 기본값으로 재설정되었습니다.'], ['확인'], props.closePopup);
                return;
            }
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
        else if (index === 0) {
            props.onCloseConfirmDialog();
        }
    }

    return (
        <SettingEtcComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>시스템 버전 정보</p>
                        <span>{props.settings.SystemVersion.value}</span>
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>환경설정 초기화</p>
                        <button onClick={() => onClickResetPopupState()}>시스템 기본값으로 재설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="환경설정을 시스템 초기값으로 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                {/* <li className='item'>
                    <div>
                        <p>시스템 종료</p>
                        <button>시스템 종료</button>
                    </div>
                    <div id='tooltip' data-tooltip="시스템을 완전히 종료합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li> */}
            </ul>
        </SettingEtcComponent>
    );
}

export default withRouter(SettingEtc);