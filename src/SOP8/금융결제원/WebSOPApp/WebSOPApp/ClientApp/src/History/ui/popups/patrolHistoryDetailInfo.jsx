//import { Button } from '@amcharts/amcharts4/core';
import React, { Component, useEffect, useState } from 'react';
import HistoryController from '../../services/historyController';
import { PatrolHistoryDetailInfoComponent } from '../../styled/SensorDetectHistoryStyled';
import { ModalBackground } from '../../../Root/styled/theme';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';

function PatrolHistoryDetailInfo(props) {
    const getGridData = () => {
        let grid = [];

        if (!props.datas) {
            return grid;
        }

        const dataSource = props.datas;
        const datacount = dataSource.length;

        for (let j = 0; j < datacount; j++) {
            grid.push(
                <tr key={'grid_' + j}>
                    <td>{dataSource[j].courseName}</td>
                    <td>{dataSource[j].placeName}</td>
                    <td>{dataSource[j].workerName}</td>
                    <td>{props.formatIsoToDateTime(dataSource[j].patrolTime)}</td>
                </tr>
            );
        }

        return grid;
    }

    return (
        <ModalBackground>
            <PatrolHistoryDetailInfoComponent>
                <div id={'hsMmo'} className={'popup'}>
                    <div>
                        <div>
                            <div className={'hsmCont sop'}>
                                <div className={'hsmTitle'}>
                                    <h3>순찰 경로 상세정보</h3>
                                    <p className='count'>총 순찰 지점 수 <span>{props.datas?.length}</span>개</p>
                                    <IconButton
                                        className='hsmCls'
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.Closer size={"xs"} />}
                                        onClick={props.changeSubContent}
                                    >
                                        닫기
                                    </IconButton>
                                </div>
                                <div className={'scrollWrapper' + " " + 'hsmPrc' + " " + 'scrollBar'}>
                                    <table className={'hsmTb'}>
                                        <colgroup>
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                            <col style={{ width: '25%' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>순찰 코스</th>
                                                <th>순찰 지점</th>
                                                <th>순찰자</th>
                                                <th>순찰 일시</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getGridData()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PatrolHistoryDetailInfoComponent>
        </ModalBackground>
    );
}

export default PatrolHistoryDetailInfo;