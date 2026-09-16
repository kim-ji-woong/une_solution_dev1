import React from 'react';

import { BoardAgencyEventComponent } from '../styled/dashboardStyled';
import DoughnutChart from './chart/doughnutChart';

const BoardAgencyEvent = () => {
    const datas = [
        { index: 1, title: '도본청·도의회', data: 4 },
        { index: 2, title: '대표도서관', data: 2 },
        { index: 3, title: '신용보증재단', data: 1 },
        { index: 4, title: '교육청', data: 1 },
        { index: 5, title: '복합시설관', data: 1 },
        { index: 6, title: '주택도시공사 신사옥', data: 1 },
    ];

    return (
        <BoardAgencyEventComponent className='agency-event-area'>
            <h2>기관별 이벤트 발생 건수</h2>

            <div className='chartWrap'>
                <DoughnutChart chartData={datas} />
            </div>
            <div className='tableWrap'>
                <ul>
                    {
                        datas.map((data) => 
                            <li key={data.index}>
                                <p>{data.title}</p>
                                <div>
                                    <span>{data.data}</span>
                                    <span>건</span>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </BoardAgencyEventComponent>
    );
};

export default BoardAgencyEvent;