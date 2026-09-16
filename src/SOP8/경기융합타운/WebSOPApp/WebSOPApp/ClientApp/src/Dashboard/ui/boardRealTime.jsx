import React from 'react';
import { BoardRealTimeComponent } from '../styled/dashboardStyled';

const BoardRealTime = () => {
    return (
        <BoardRealTimeComponent className='real-time-area'>
            <h2>실시간 이벤트 현황</h2>
            <div className='btnWrap'>
                <p>* 최신 이벤트 최대 4개까지 표출됩니다.</p>
                <button>더보기</button>
            </div>
            <div className='tableWrap'>
                <ul>
                    <li className='head'>
                        <span>발생일시</span>
                        <span>유형</span>
                        <span>단계</span>
                        <span>기관</span>
                        <span>위치</span>
                        <span>알람</span>
                        <span>SOP</span>
                    </li>

                    {
                        Array.from(Array(4), x =>
                            <li className='body'>
                                <span>2024.01.09<br />12:43:00</span>
                                <span>화재</span>
                                <span>주의</span>
                                <span>도본청</span>
                                <span>16층</span>
                                <span>발생</span>
                                <span>대기</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </BoardRealTimeComponent>
    );
};

export default BoardRealTime;