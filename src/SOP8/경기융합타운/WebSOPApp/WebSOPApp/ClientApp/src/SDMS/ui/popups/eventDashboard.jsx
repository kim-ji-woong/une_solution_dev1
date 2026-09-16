import React, { useState } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';

function EventDashboard(props) {
    const [close, setClose] = useState('');

    const handlePopups = () => {
        setClose('closePopup');

        setTimeout(() => {
            props.handlePopups('eventDashboard', false);
        }, 200);
    }

    return (
        <EventDashboardComponent className={close}>
            <div>
                <p>[대표도서관]에서 알람이 발생했습니다. 이동하시겠습니까?</p>
                <div className='btnWrap'>
                    <button className='move'>이동</button>
                    <button className='dslX' onClick={handlePopups}>닫기</button>
                </div>
            </div>
        </EventDashboardComponent>
    );
}

export default EventDashboard;