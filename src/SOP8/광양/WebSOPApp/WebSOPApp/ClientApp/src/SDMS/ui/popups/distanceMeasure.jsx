import React, { useState, useEffect } from 'react';

import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import { DistanceMeasureComponent } from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';
import socketStore from "../../webSocket/socketStore";

function DistanceMeasure(props) {
    const [start, setStart] = useState(false);
    const [totalDistance, setTotalDistance] = useState(null);
    const [totalArea, setTotalArea] = useState(null);
    
    useEffect(() => {
        const unsubscribe = socketStore.subscribe(() => {
            const data = socketStore.getState();

            if (data.actionType === 'MEASUREMENT_RESULT') {
                setTotalDistance(data.measurementResult?.totalDistance);
                setTotalArea(data.measurementResult?.totalArea);
                setStart(data.measurementResult?.status === 1);
            }
        })

        return () => {
            unsubscribe();
        }
    });
        
    const onClickClosePopup = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["거리측정 모드를 종료하시겠습니까?"], ["취소", "종료하기"], doClosePopup);
    }
    
    const doClosePopup = (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            return;
        }

        props.setChangeDistanceMeasure(false);
        props.handleToast("거리측정 모드가  종료되었습니다");
    }

    return (
        <DistanceMeasureComponent className={"UI_Section"}>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    <Icon.IconDistanceMeasure size='xs' />
                    거리측정
                </h5>
                <IconButton
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer />}
                    onClick={() => onClickClosePopup()}
                >
                    닫기
                </IconButton>
            </div>
            <div className='rangeContent'>
                <p className='range'>
                    {!start ?
                        `시작점을 선택하여\n거리를 측정해주세요.` :
                        `‘ESC’키를 눌러\n측정을 마칠 수 있습니다.`
                    }
                </p>
                <ul className='total'>
                    <li className={totalDistance ? 'on' : null}>
                        <p>총 거리</p>
                        <p>{totalDistance ? 
                            totalDistance + 'm' :
                            '-'
                        }</p>
                    </li>
                    <li className={totalArea ? 'on' : null}>
                        <p>총 면적</p>
                        <p>{totalArea ? 
                            totalArea + '㎡' :
                            '-'
                        }</p>
                    </li>
                </ul>
            </div>
        </DistanceMeasureComponent>
    );
} 

export default DistanceMeasure;