import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import ToastMessage from "./toastMessage";
import { useToast } from "./ToastProvider";

const Toast = () => {
    const {
        ref,
        isHover,
        toastList,
        onToastRemove,
    } = useToast();

    if (!document.getElementById("root")) return null;

    return createPortal(
        <ToastWrapper
            ref={ref}
            $isActive={toastList.length > 0}
        >
            {toastList.map((item, idx) => (
                <ToastMessage
                    key={item.id}
                    {...item}
                    index={idx}
                    count={toastList.length}
                    isHover={isHover}
                    onRemove={() => onToastRemove(item.id)}
                />
            ))}
        </ToastWrapper>,
        document.getElementById("root")
    );
};

const ToastWrapper = styled.aside`
    ${({ $isActive }) =>
        css`
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            & > *:not(:last-child) {
                margin-bottom: 12px;
            }

            opacity: ${$isActive ? 1 : 0};
            visibility: ${$isActive ? "visible" : "hidden"};
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 9999;
        `}
`;

export default Toast;
