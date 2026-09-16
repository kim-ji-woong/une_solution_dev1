import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from 'styled-components';
import useToast from "../../hooks/useToast";
import Icon from "../Icon/Icon";

const ToastMessage = ({ status, message, index, isActive = true, timer = 3000, id, count, isHover }) => {
    const maxToastLength = 3; //표출되는 최대 taost 수량
    const iconSize = 20;

    const { onToastRemove, setIsChangeList } = useToast();

    const isCloseNow = useRef(false);

    const isTimeOut = useRef(false);

    // 삭제버튼 클릭 시, 즉시 삭제 (animation X)
    function onClickCloseButton() {
        isCloseNow.current = true;
        onToastRemove(id);
    }

    const selectIcon = (status) => {
        switch (status) {
            case "warning":
                return <Icon.Warning fill={"Warning_500"} size={iconSize} />;

            default:
                return "";
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onTimerFn = useCallback(onTimer, [timer]);

    function onTimer() {
        setTimeout(() => {
            onCloseTimeOut();
            isTimeOut.current = true;
        }, timer);
    }

    // 시간 초과 시, 자동 삭제 (시간 초과 전에 삭제버튼 클릭 시, 작동 X)
    function onCloseTimeOut() {
        if (!isCloseNow.current) {
            removeMsg();
        }
    }

    // 메시지 3개 이상 초과 시, 가장 첫번째 메시지 자동 삭제 (animation O)
    function removeFirstMsg() {
        isCloseNow.current = true;
        removeMsg();
    }

    // animation 작동 후, 최종적으로 메시지 삭제 (추가적으로 setTimeout 적용)
    function removeMsg() {
        setIsChangeList(true);
        setTimeout(() => {
            onToastRemove(id);
            setIsChangeList(false);
        }, 200);
    }

    useEffect(() => {
        if (isActive) {
            onTimerFn();
        }
    }, [isActive, onTimerFn]);

    useEffect(() => {
        if (count > maxToastLength && index === 0) {
            removeFirstMsg();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, index]);

    useEffect(() => {
        if (isHover && !isTimeOut.current) {
            isCloseNow.current = true;
        } else if (!isHover && isTimeOut.current) {
            setTimeout(() => {
                removeMsg();
            }, 300 * index);
        } else if (!isHover && !isTimeOut.current) {
            isCloseNow.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHover]);

    return isActive ? (
        <ToastMessageWrapper $index={index} $count={count}>
            <div>
                {/* {status && <Box>{selectIcon(status)}</Box>} */}
                <p>{message}</p>
            </div>
            <button className="btnClose" onClick={onClickCloseButton}>
                <Icon.Closer fill={"white"} size={16} />
            </button>
        </ToastMessageWrapper>
    ) : null;
};

const ToastMessageWrapper = styled.div`
    ${({ theme, $index, $count, $timer = 210 }) =>
        css`
            width: 480px;
            height: 48px;
            display: flex;
            justify-content: space-between;
            border-radius: 4px;
            align-items: center;
            padding: 0 20px;
            gap: 20px;
            transition: background-color ${$timer}ms, border ${$timer}ms;
            box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 6px 13px 0 rgba(0, 0, 0, 0.12);

            background-color: ${(() => {
                if ($count === 1) return theme.colors.grayscale.g500;
                if ($count === 2) {
                    return $index === 0
                    ? theme.colors.grayscale.g400
                    : theme.colors.grayscale.g500;
                }
                if ($count >= 3) {
                    return $index === 0
                    ? theme.colors.grayscale.g300
                    : $index === 1
                    ? theme.colors.grayscale.g400
                    : theme.colors.grayscale.g500;
                }
            })()};

            animation: fadeInUp 0.3s ease;

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            p {
                color: ${({ theme }) => theme.colors.white};
                font-size: 1rem;
                font-weight: 400;
                line-height: 172%;
                letter-spacing: -0.48px;
                word-break: break-all;
                white-space: pre-line;
            }

            .btnClose {
                display: flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
            }
        `}
`;

export default ToastMessage;
