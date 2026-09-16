import React, { useEffect, useRef, useState } from 'react';
import { ko } from 'date-fns/esm/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Icon from '../../../Common/components/Icon/Icon';

function ColDatePickerEquipment({
    value,
    isEditMode,
    onEnterEdit,
    onChange,
    onExitEdit,
    placeholder = '-',
}) {
    const ref = useRef(null);
    const datepickerRef = useRef(null);

    const toDate = (v) => (v ? new Date(v) : null);

    const [innerValue, setInnerValue] = useState(toDate(value));
    const prevValueRef = useRef(value);

    // 외부 value 변경 시 동기화
    useEffect(() => {
        setInnerValue(toDate(value));
        prevValueRef.current = value;
    }, [value]);

    // 외부 클릭 시 저장
    useEffect(() => {
        if (!isEditMode) return;

        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                handleSave();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [innerValue, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            // 렌더 후 열리도록 약간의 delay
            setTimeout(() => {
                datepickerRef.current?.setOpen(true);
            }, 0);
        }
    }, [isEditMode]);

    const handleSave = () => {
        const prev = prevValueRef.current;
        const currentISO = innerValue ? innerValue.toISOString() : null;

        if (prev !== currentISO) {
            onChange(currentISO);
        } else {
            onExitEdit();
        }
    };

    const onClickCalendar = () => {
        datepickerRef.current?.setOpen(true);
    };

    if (isEditMode) {
        return (
            <div ref={ref}
                style={{
                    overflow: 'visible'
                }}
            >
                <div className="datepicker">
                    <DatePicker
                        ref={datepickerRef}
                        selected={innerValue}
                        onChange={(date) => {
                            setInnerValue(date);

                            const formatted = date
                                ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
                                : null;

                            onChange(formatted);
                        }}
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        maxDate={new Date()}
                        placeholderText={placeholder}
                    />
                    <button
                        type="button"
                        className="btnCalendarBk"
                        onClick={onClickCalendar}
                    >
                        <Icon.Calendar />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div onClick={onEnterEdit}>
            <span>{value ? value.slice(0, 10) : placeholder}</span>
        </div>
    );
}

export default ColDatePickerEquipment;