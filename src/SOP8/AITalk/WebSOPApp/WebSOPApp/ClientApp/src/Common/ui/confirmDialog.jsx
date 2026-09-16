import React, { useState } from 'react';
import styled, { keyframes } from "styled-components";
import ProjectResource from '../../Root/resource/id';

import dialog_error from '../images/dialog_error.svg';
import dialog_warning from '../images/dialog_warning.svg';
import dialog_success from '../images/dialog_success.svg';
import dialog_info from '../images/dialog_info.svg';
import dialog_question from '../images/dialog_question.svg';

export default function ConfirmDialog({ type, messages, buttons, onClickButton, onCloseConfirmDialog }) {
    const [isMalfunction, setIsMalfunction] = useState(false);

    /*
    * 1. type
    * -> ERROR, WARNING, SUCCESS, INFO, QUESTION
    *
    * 2. 버튼 규칙
    * -> 확인 버튼은 항상 우측에 위치함.
    * -> 전달된 함수가 있다면 index에 따라 구분할 것.
    */

    const dialogColors = {
        ERROR: '#D32F2F',
        WARNING: '#F9A825',
        SUCCESS: '#4CAF50',
        INFO: '#0091EA',
        QUESTION: '#0091EA',
        MALFUNCTION: '#0091EA',
    };

    const dialogColor = dialogColors[type] || '#757575';

    const getMessage = () => (
        <main>
            <div>
                {messages.map((message, index) => (
                    <p key={"message_" + index}>{message}</p>
                ))}
            </div>
        </main>
    );

    const onChangeMalfunction = (e) => {
        setIsMalfunction(e.target.checked);
    }

    const getButtons = () => {
        if (!Array.isArray(buttons) || buttons.length === 0) {
            return (
                <footer>
                    <button className="confirmBtn confirm_0" onClick={onCloseConfirmDialog}>
                        확인
                    </button>
                </footer>
            );
        }

        return (
            <footer>
                {type === ProjectResource.dialogTypes.MALFUNCTION && (
                    <div key="checkbox" className="malfunctionWrap">
                        <input
                            type="checkbox"
                            id="malfunctionCheck"
                            onChange={(e) => onChangeMalfunction(e)}
                        />
                        <label htmlFor="malfunctionCheck">오작동 처리하기</label>
                    </div>
                )}

                {buttons.map((button, index) => (
                    <button
                        key={`button_${index}`}
                        className={`confirmBtn confirm_${index}`}
                        onClick={() => onClickButton?.(index, isMalfunction) ?? onCloseConfirmDialog()}
                    >
                        {button}
                    </button>
                ))}
            </footer>
        );
    };
    
    return (
        <ConfirmDialogComponent $dialogType={type} $dialogColor={dialogColor}>
            <section className='body'>
                {
                    getMessage()
                }
                {
                    getButtons()
                }
            </section>
        </ConfirmDialogComponent>
    );
}


// 알림창 animation
const dialogShow = keyframes`
    from {
        opacity: 0;
        margin-top: -50px;
        display: none;
    }

    to {
        opacity: 1;
        margin-top: 0;
        display: block;
    }
`

export const ConfirmDialogComponent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    border-left: 12px solid ${(props) => props.$dialogColor};
    animation: ${dialogShow} 0.5s;

    user-select: none;

    .body {
        width: 480px;
        height: 170px;
        background: #FFF;
        box-shadow: 0px 12px 21px 0px rgba(0, 0, 0, 0.12);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        font-size: 1.125rem;

        main {
            width: 100%;
            height: 113px;
            padding: 28px 20px 20px 20px;
            font-weight: 500;
            ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

            background: ${(props) => {
                if(props.$dialogType === ProjectResource.dialogTypes.ERROR)
                    return `url(${dialog_error})`
                else if(props.$dialogType === ProjectResource.dialogTypes.WARNING)
                    return `url(${dialog_warning})`
                else if(props.$dialogType === ProjectResource.dialogTypes.SUCCESS)
                    return `url(${dialog_success})`
                else if(props.$dialogType === ProjectResource.dialogTypes.INFO)
                    return `url(${dialog_info})`
                else if(props.$dialogType === ProjectResource.dialogTypes.QUESTION)
                    return `url(${dialog_question})`
            }} no-repeat center right;
            background-size: 113px;
            background-position-y: 0;
            overflow: hidden;

            div {
                padding-right: 30px;

                p {
                    color: ${({ theme }) => theme.colors.black};
                    font-size: 1.125rem;
                    font-weight: 500;
                    line-height: 169%;
                    letter-spacing: -0.54px;
                }

                p:not(:first-child) {
                    font-size: 0.75rem;
                    font-weight: 400;
                    color: ${({ theme }) => theme.colors.grayscale.g400};
                    line-height: 170%;
                    letter-spacing: -0.36px;
                    margin-top: 4px;
                }
            }
        }

        footer {
            width: 100%;
            height: 57px;
            border-top: 1px solid #E0E0E0;
            padding: 12px 20px;
            text-align: right;

            .malfunctionWrap {
                position: absolute;
                bottom: 16px;
                left: 18px;
                ${({ theme }) => theme.mixins.flex('flex-start', 'center')};

                > label {
                    color: ${({ theme }) => theme.colors.grayscale.g600};
                    line-height: 172%;
                    letter-spacing: -0.42px;
                }
            }

            .confirmBtn {
                font-size: 0.875rem;
                line-height: 172%;
                letter-spacing: -0.42px;
                border-radius: 4px;
                padding: 4px 6px;
                color: ${({ theme }) => theme.colors.grayscale.g500};

                &:hover {
                    background: ${({ theme }) => theme.colors.grayscale.g25};
                }

                &:active {
                    color: ${({ theme }) => theme.colors.primary.p800};
                    background: ${({ theme }) => theme.colors.grayscale.g50};
                }
            }

            .confirm_1, .confirm_2 {
                color: ${({ theme }) => theme.colors.primary.p500};

                &:active {
                    color: ${({ theme }) => theme.colors.primary.p800};
                }
            }

            button:not(:last-child) {
                margin-right: 16px;
            }
        }
    }
`;