import React from 'react';
import ProjectResource from '../../Root/resource/id';

import { ConfirmDialogComponent } from '../styled/confirmDialogStyled';
import close_btn from '../images/close_btn_bk.png';

export default function ConfirmDialog({ type, messages, buttons, onClickButton, onCloseConfirmDialog }) {

    /*
    * 1. type
    * -> ERROR, WARNING, SUCCESS, INFO, QUESTION
    *
    * 2. 버튼 규칙
    * -> 확인 버튼은 항상 우측에 위치함.
    * -> 전달된 함수가 있다면 index에 따라 구분할 것.
    */

    let dialogColor = '#757575';
    if (type === ProjectResource.dialogTypes.ERROR) {
        dialogColor = '#D32F2F';
    } else if (type === ProjectResource.dialogTypes.WARNING) {
        dialogColor = '#F9A825';
    } else if (type === ProjectResource.dialogTypes.SUCCESS) {
        dialogColor = '#4CAF50';
    } else if (type === ProjectResource.dialogTypes.INFO || 
                type === ProjectResource.dialogTypes.QUESTION) {
        dialogColor = '#0091EA';
    }

    const getMessage = () => {
        const confirmMessages = [];

        messages.map((message, index) => 
            confirmMessages.push(<p key={"message_" + index}>{message}</p>
        ));

        return (
            <main>
                <div>{confirmMessages}</div>
            </main>
        );
    }

    const getButtons = () => {
        const confirmButtons = [];

        if (!buttons || buttons.length === 0) {
            confirmButtons.push(
                <button key={"button_0"} className={'confirmClose'} onClick={onCloseConfirmDialog}>확인</button>
            );
        }
        else {
            buttons.map((button, index) => {
                if (onClickButton) {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={() => onClickButton(index)}>{button}</button>
                    );
                }
                else {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={onCloseConfirmDialog}>{button}</button>
                    );
                }
            });
        }

        return (
            <footer>
                {confirmButtons}
            </footer>
        );
    }
    
    return (
        <ConfirmDialogComponent $dialogType={type} $dialogColor={dialogColor}>
            <section className='body'>
                {
                    getMessage()
                }
                {
                    getButtons()
                }
                <button className='closeBtn' onClick={onCloseConfirmDialog}>
                    <img src={close_btn} alt='닫기버튼' />
                </button>
            </section>
        </ConfirmDialogComponent>
    );
}
