import React, { useEffect, useRef, useState } from 'react';

function ColComboBoxEquipment({
    value,
    isEditMode,
    onEnterEdit,
    onChange,
    onExitEdit,
    options = [],
    valueField = 'value',
    labelField = 'label',
    nullable = false,
}) {
    const [innerValue, setInnerValue] = useState(value);
    const ref = useRef(null);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    // 외부 클릭 시 editMode 종료
    useEffect(() => {
        if (!isEditMode) return;

        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onExitEdit();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditMode, onExitEdit]);

    if (isEditMode) {
        return (
            <div ref={ref}>
                <select
                    value={innerValue ?? ''}
                    autoFocus
                    onChange={(e) => {
                        const next = e.target.value
                            ? Number(e.target.value)
                            : null;

                        setInnerValue(next);
                        onChange(next);
                    }}
                >
                    {nullable
                        ? <option value="">선택 안 함</option>
                        : <option value="" disabled>선택</option>
                    }
                    {options.map((item) => (
                        <option
                            key={item[valueField]}
                            value={item[valueField]}
                        >
                            {item[labelField]}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    const label =
        options.find((o) => o[valueField] === value)?.[labelField] || '-';

    return (
        <div onClick={onEnterEdit}>
            <span>{label}</span>
        </div>
    );
}

export default ColComboBoxEquipment;