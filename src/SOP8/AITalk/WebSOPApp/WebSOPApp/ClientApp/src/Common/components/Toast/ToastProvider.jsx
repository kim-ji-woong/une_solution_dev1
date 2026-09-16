import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

let toastId = 0;

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastList, setToastList] = useState([]);
    const [isChangeList, setIsChangeList] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const ref = useRef(null);

    const handleMouseOver = useCallback(() => setIsHover(true), []);
    const handleMouseOut = useCallback(() => setIsHover(false), []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener("mouseover", handleMouseOver);
        el.addEventListener("mouseout", handleMouseOut);

        return () => {
            el.removeEventListener("mouseover", handleMouseOver);
            el.removeEventListener("mouseout", handleMouseOut);
        };
    }, [handleMouseOver, handleMouseOut]);

    const addToast = ({ message, status = "default", duration = 3000 }) => {
        const id = ++toastId;
        const toastItem = { id, message, status };

        setIsChangeList(true);
        setToastList((prev) => [...prev, toastItem]);

        if (duration !== Infinity) {
            setTimeout(() => {
                setToastList((prev) => {
                    if (isHover) return prev; // hover 중이면 유지
                    return prev.filter((t) => t.id !== id);
                });
            }, duration);
        }
    };

    const onShowToast = (message) => addToast({ message });
    const onErrorToast = (message) => addToast({ message, status: "warning" });
    const onToastRemove = (id) => {
        setToastList((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider
            value={{
                toastList,
                isHover,
                isChangeList,
                setIsChangeList,
                ref,
                onShowToast,
                onErrorToast,
                onToastRemove,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
