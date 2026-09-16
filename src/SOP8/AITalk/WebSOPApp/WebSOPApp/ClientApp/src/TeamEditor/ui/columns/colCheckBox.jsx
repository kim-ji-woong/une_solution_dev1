import React, { useEffect, useState } from 'react';

function ColCheckBox(props) {
    const [check, setCheck] = useState(false);

    useEffect(() => {
        setCheck(props.defaultChecked || "");
    }, [props.defaultChecked])

    const onChangeCheck = (e) => {
        setCheck(e.checked);
        props.onChange(e.checked, props.index);
        return;
    }

    return (
        <div>
            <input type="checkbox" checked={check} onChange={(e) => onChangeCheck(e.target)} />
        </div>
    );
}

export default ColCheckBox;