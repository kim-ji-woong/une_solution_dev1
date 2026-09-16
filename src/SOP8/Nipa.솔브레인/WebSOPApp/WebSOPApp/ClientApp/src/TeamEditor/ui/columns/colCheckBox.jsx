import React from 'react';

function ColCheckBox({ checked, onChange }) {

    const handleChange = (e) => {
        onChange(e.target.checked);
    };

    return (
        <div>
            <input
                type="checkbox"
                checked={!!checked}
                onChange={handleChange}
            />
        </div>
    );
}

export default ColCheckBox;