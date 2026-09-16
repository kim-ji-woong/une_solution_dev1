import React, { useEffect, useRef, useState } from 'react';

function ColTextEquipment({
    value,
    isEditMode,
    onEnterEdit,
    onChange,
    onExitEdit,
    placeholder = '-',
}) {
    const [innerValue, setInnerValue] = useState(value);
    const prevValueRef = useRef(value);
    const ref = useRef(null);

    useEffect(() => {
        setInnerValue(value);
        prevValueRef.current = value;
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                handleSave();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [innerValue]);

    const handleSave = () => {
        if (innerValue !== prevValueRef.current) {
            onChange(innerValue);
        } else {
            onExitEdit(); // 값 동일해도 edit 종료
        }
    };

    if (isEditMode) {
        return (
            <div ref={ref}>
                <input
                    type='text'
                    autoFocus
                    value={innerValue || ''}
                    placeholder={placeholder}
                    onChange={(e) => setInnerValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.target.blur(); // onBlur 저장
                        }

                        if (e.key === 'Escape') {
                            setInnerValue(prevValueRef.current);
                            e.target.blur(); // 값 동일 > 저장 안 됨
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div onClick={onEnterEdit}>
            <span>{value || '-'}</span>
        </div>
    );
}

export default ColTextEquipment;