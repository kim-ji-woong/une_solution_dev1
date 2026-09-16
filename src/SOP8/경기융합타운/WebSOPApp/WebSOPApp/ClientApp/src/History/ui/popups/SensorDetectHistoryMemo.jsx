//import { Button } from '@amcharts/amcharts4/core';
import React, { useState } from 'react';
//import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import SettingsStore from '../../../Settings/settingsStore';

import HistoryController from '../../services/historyController';
import { SensorDetectHistoryMemoComponent } from '../../styled/SensorDetectHistoryStyled';

function SensorDetectHistoryMemo(props) {
    const [displayMemo, setDisplayMemo] = useState(props.popupMemoContent);
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        title: "",
        messages: [""],
        buttons: ["확인"],
        //onClose: onCloseConfirmDialog,
        onClickButton: null
    });

	const onChangeMemo = (e) => {
        setDisplayMemo(e.target.value);
    }

	const onSave = async () => {
		const result = await HistoryController.UpdateAlarmMemo(props.actionStepHistoryID, displayMemo);
		if (result) {
			props.setPopupMemo(false, props.actionStepHistoryID, displayMemo);
		}
		else {
            showConfirmDialog('오류', ['메모를 저장할 수 없습니다'], null, null);
        }
	}

	const showConfirmDialog = (title, messages, buttons, onClickButton) => {
		const confirmMessage = { ...confirmMessage };
		confirmMessage.visible = true;
		confirmMessage.title = title;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;

		if (!messages) {
			confirmMessage.messages = [""];
		}
		else if (Array.isArray(messages)) {
			confirmMessage.messages = messages;
		}
		else {
			confirmMessage.messages = [messages];
		}

        setConfirmMessage(confirmMessage);
	}

    /*
	const onCloseConfirmDialog = () => {
        const confirmMessage = { ...confirmMessage };
		confirmMessage.visible = false;

		setConfirmMessage(confirmMessage);
	} */

    let hsMmoName = 'hsMmo';
    if (!props.fromHistoryMenu) {
        hsMmoName = null;
    }

    let hsMmoClassName = null;
    if (!props.fromHistoryMenu) {
        hsMmoClassName = 'viewDashboardBoxD' + ' ' + 'viewDashboardAlarmMemo';
    }

    return (
        <>
            <SensorDetectHistoryMemoComponent>
				<div id={"hsMmo"} className={'hsMemoBox'}>
                    <div>
                        <div>
                            <div className={'dslTopMemo' + " " + 'dslGrd'}>
                                <span className={'squareIcon'}></span>
                                <h5 className={'squareTitle'}>
                                    메모
                                </h5>
                                <a className={'dslX'} onClick={() => props.setPopupMemo(false)}></a>
                            </div>
                            <div className={'memoContents'}>
                                <textarea cols="30" rows="10" className={"scroll-wrapper" + 'memoTxt' + "scrollbar scroll-textareaCss"} onChange={(e) => onChangeMemo(e)}
                                    value={(displayMemo && displayMemo.length > 0) ? displayMemo : ''}>
                                </textarea>
                            </div>
                        </div>
                    </div>
				</div>
			</SensorDetectHistoryMemoComponent> 
            {
                /* alert창 대신 사용 */
                confirmMessage.visible &&
                <ConfirmDialog title={confirmMessage.title} messages={confirmMessage.messages} buttons={confirmMessage.buttons} /* onClose={confirmMessage.onClose} */ onClickButton={confirmMessage.onClickButton} />
            }
        </>
    );
}

export default SensorDetectHistoryMemo;