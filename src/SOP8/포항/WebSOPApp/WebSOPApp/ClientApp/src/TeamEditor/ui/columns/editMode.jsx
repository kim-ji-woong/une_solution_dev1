import React, { useEffect, useState } from 'react';
import $ from 'jquery';

function EditMode(props) {
    const [value, setValue] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        setValue(props.value);
        setIsEditMode(props.isEditMode);
        hi();
    }, [])

    //정규식
    const onBlurCheck = (e) => {
        let target = e;

        if (props.validationCheck === 1) // phoneNumber
        {
            var re = /^\d{3}\d{3,4}\d{4}$/;

            const phoneValid = re.test(target.value);
            if (!phoneValid) {
                setValue('');
                return;
            }
        }

        props.onChange(target.value); // 포커스 잃을 경우에만 부모에게 값을 전달
        return;
    }

    const onChangeCheck = (e) => {
        let target = e;
        setValue(target.value);
        return;
    }


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onBlurCheck(e.target);
        }
    }

    //하이픈
    const hi = () => {
        $(document).ready(function () {
            $(function () {
                $('#' + 'mobileNo').keydown(function (event) {
                    var key = event.charCode || event.keyCode || 0;
                    var text = $(this);
                    if (key !== 8 && key !== 9) {
                        if (text.val().length === 3) {
                            text.val(text.val() + '-');
                        }
                        if (text.val().length === 8) {
                            text.val(text.val() + '-');
                        }
                    }
                    return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
                })
            });
        });
    }

    return (
        <td>
            {
                (isEditMode)
                    ?
                    <input type="text"
                        //id={id}
                        onChange={(e) => onChangeCheck(e.target)}
                        onBlur={(e) => onBlurCheck(e.target)}
                        onKeyPress={handleKeyPress}
                        value={value || ''}
                        name="mobileNo"
                        id="mobileNo" //id 중복
                        maxLength="13"
                    />
                    :
                    <span>{value}</span>
            }
        </td>
    );
}

export default EditMode;