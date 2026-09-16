import React from 'react';

import { ModalBackground } from '../../../Root/styled/theme';
import { FireAlarmModalComponent } from '../../styled/sdmsPopupsStyled';
import Button from '../../../Common/components/button';
import sirenImg from '../../images/fireAlarmSiren.svg';

// 발생 위치 / 이벤트 유형은 화재 알람 기준 고정값
const LOCATION = '금융결제원';
const EVENT_TYPE = '화재';

// 발생 일시 표출 (yyyy.mm.dd hh:mm:ss)
// 백엔드가 내려주는 strDateTime을 우선 사용해 이벤트 팝업 등 다른 화면과 표기를 일치시킨다.
// strDateTime이 없을 때만 dtTime(ISO)으로부터 직접 포맷팅한다.
const formatDateTime = (alarm) => {
    if (!alarm) return '';

    if (alarm.strDateTime) {
        return alarm.strDateTime;
    }

    if (!alarm.dtTime) return '';

    const date = new Date(alarm.dtTime);
    const pad = (n) => String(n).padStart(2, '0');

    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

function FireAlarmModal({ alarm, onClose }) {
    if (!alarm) return null;

    // isManual === true면 수동신고, 아니면 센서탐지
    const isManual = alarm.isManual === true;

    return (
        <ModalBackground>
            <FireAlarmModalComponent>
                <div className='infoWrap'>
                    <div className='headerWrap'>
                        <img
                            className='sirenIcon'
                            src={sirenImg}
                            alt='화재 경보'
                        />
                        <p className='title'>[화재 경보 발생]</p>
                    </div>

                    <div className='metaWrap'>
                        <div className='typeRow'>
                            <p className={`detectType ${isManual ? 'manual' : 'sensor'}`}>
                                {isManual ? '수동신고' : '센서탐지'}
                            </p>
                            <span className='dot' />
                            <p className='dateTime'>{formatDateTime(alarm)}</p>
                        </div>

                        <div className='messageRow'>
                            <span className='keyword'>[{LOCATION}]</span>
                            <span className='text'>에서</span>
                            <span className='keyword'>[{EVENT_TYPE}]</span>
                            <span className='text'>알람이 발생했습니다.</span>
                        </div>
                    </div>
                </div>

                <Button variant='unfill_light' size='xxs' onClick={onClose}>
                    확인
                </Button>
            </FireAlarmModalComponent>
        </ModalBackground>
    );
}

export default FireAlarmModal;
