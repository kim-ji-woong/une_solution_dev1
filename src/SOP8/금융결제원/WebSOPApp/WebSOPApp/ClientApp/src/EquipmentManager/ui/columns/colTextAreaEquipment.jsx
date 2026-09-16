import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ColTextareaEquipment({
    value,
    isEditMode,
    onEnterEdit,
    onChange,
    onExitEdit
}) {
    const triggerRef = useRef(null);
    const textareaRef = useRef(null);

    const [innerValue, setInnerValue] = useState(value);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    useEffect(() => {
        if (!isEditMode) return;

        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
        });
    }, [isEditMode]);

    const handleSave = () => {
        if (innerValue !== value) {
            onChange(innerValue);
        } else {
            onExitEdit();
        }
    };

    const textarea = isEditMode
        ? createPortal(
            <textarea
                ref={textareaRef}
                autoFocus
                style={{
                    position: "absolute",
                    top: position.top - 36,
                    left: position.left + 4,
                    width: position.width - 8,
                    height: "120px",
                    zIndex: 9999,
                    borderRadius: "8px",
                    padding: "4px 8px",
                    background: "#131D24",
                    color: "white",
                    border: "1px solid #444A57",
                    fontSize: "14px",
                    letterSpacing: "-0.42px",
                    lineHeight: "172%"
                }}
                value={innerValue || ""}
                onChange={(e) => setInnerValue(e.target.value)}
                onBlur={handleSave}
            />,
            document.body
        )
        : null;

    return (
        <>
            <div ref={triggerRef} onClick={onEnterEdit}>
                <span>{value || "-"}</span>
            </div>
            {textarea}
        </>
    );
}

export default ColTextareaEquipment;