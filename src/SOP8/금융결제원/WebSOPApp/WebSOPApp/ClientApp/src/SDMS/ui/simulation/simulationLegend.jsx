import React from 'react';
import { SimulationLegendComponent } from '../../styled/sdmsPopupsStyled';

function SimulationLegend({ simulationLegendInfo }) {
    if (!simulationLegendInfo) return null;

    const { scenarioCondition, materialRanges } = simulationLegendInfo;

    const { lkg_hol, lkg_tm, all_lkg_value, air_inhl_rate } = scenarioCondition || {};

    return (
        <SimulationLegendComponent className='UI_Section simulationLegend' $resize={false}>
            <div className='dslTop'>
                <h5 className='dslTitle'>누출조건</h5>
            </div>

            <div className='content'>
                <ul>
                    <li>
                        <p>누출공</p>
                        <p>{lkg_hol ? `${lkg_hol} mm` : '-'}</p>
                    </li>
                    <li>
                        <p>누출시간</p>
                        <p>{lkg_tm ? `${lkg_tm} sec` : '-'}</p>
                    </li>
                    <li>
                        <p>총 누출량</p>
                        <p>{all_lkg_value ? `${all_lkg_value.toFixed(2)} kg` : '-'}</p>
                    </li>
                    <li>
                        <p>대기흡입률</p>
                        <p>{air_inhl_rate ? `${air_inhl_rate.toFixed(2)} kg/sec` : '-'}</p>
                    </li>
                </ul>

                <div className='legendWrap'>
                    <p># 누출 확산 시뮬레이션 범례</p>
                    <ul>
                        {materialRanges?.map((range, idx) => (
                            <li key={idx}>
                                {range.max_value
                                    ? `${range.min_value}ppm ~ ${range.max_value}ppm`
                                    : `${range.min_value}ppm ~`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </SimulationLegendComponent>
    );
}

export default SimulationLegend;