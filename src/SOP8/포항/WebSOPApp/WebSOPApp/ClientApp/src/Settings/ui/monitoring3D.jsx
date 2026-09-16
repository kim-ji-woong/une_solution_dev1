import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';
import { AccountController } from '../../Account/services/accountController';
import ProjectResource from '../../Root/resource/id';
import SettingsStore from '../settingsStore';
import Store from '../../Root/store';
import {SDMSController} from "../../SDMS/services/sdmsController";
import {ExternalController} from "../../SDMS/services/externalController";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function Monitoring3D(props) {
    const [cameraIdleTime, setCameraIdleTime] = useState(null);
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);
    const [useAlarmSound, setUseAlarmSound] = useState(null);
    const [useReceiveAtmosphere, setUseReceiveAtmosphere] = useState(false);
    const [useReceiveWaterLevel, setUseReceiveWaterLevel] = useState(false);
    const [useReceiveRainfall, setUseReceiveRainfall] = useState(false);
    const [useReceiveOdor, setUseReceiveOdor] = useState(false);
    const [useReceiveAIOdor, setUseReceiveAIOdor] = useState(false);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        setCameraIdleTime(Number(props.settings.CameraIdleTime?.value));
        setMoveDisplayAlarm(Number(props.settings.MoveDisplayAlarm?.value));
        setUseAlarmSound(props.settings.UseAlarmSound?.value?.toLowerCase() === "true");
        setUseReceiveAtmosphere(props.settings.UseReceiveAtmosphere?.value?.toLowerCase() === "true");
        setUseReceiveWaterLevel(props.settings.UseReceiveWaterLevel?.value?.toLowerCase() === "true");
        setUseReceiveRainfall(props.settings.UseReceiveRainfall?.value?.toLowerCase() === "true");
        setUseReceiveOdor(props.settings.UseReceiveOdor?.value?.toLowerCase() === "true");
        setUseReceiveAIOdor(props.settings.UseReceiveAIOdor?.value?.toLowerCase() === "true");
    };

    const onChangeCameraIdleTime = (value) => {
        if (props.settings === null || props.settings === undefined)
			return;

        props.settings.CameraIdleTime.value = value.toString();
        setCameraIdleTime(value);
        props.onChangeNeedToSave();
    }

    const onChangeMoveDisplayAlarm = (value) => {
        if (props.settings === null || props.settings === undefined)
			return;

        props.settings.MoveDisplayAlarm.value = value.toString();
        setMoveDisplayAlarm(value);
        props.onChangeNeedToSave();
    }

    const setChecked = (target, type) => {
        if (props.settings === null || props.settings === undefined)
			return;

        if (type === 'useAlarmSound') {
            let value = target.checked.toString();
            props.settings.UseAlarmSound.value = value;
            setUseAlarmSound(!useAlarmSound);
            props.onChangeNeedToSave();
        } 
        else if (type === 'useReceiveAtmosphere') {
            let value = target.checked.toString();
            props.settings.UseReceiveAtmosphere.value = value;
            setUseReceiveAtmosphere(!useReceiveAtmosphere);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveWaterLevel') {
            let value = target.checked.toString();
            props.settings.UseReceiveWaterLevel.value = value;
            setUseReceiveWaterLevel(!useReceiveWaterLevel);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveRainfall') {
            let value = target.checked.toString();
            props.settings.UseReceiveRainfall.value = value;
            setUseReceiveRainfall(!useReceiveRainfall);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveOdor') {
            let value = target.checked.toString();
            props.settings.UseReceiveOdor.value = value;
            setUseReceiveOdor(!useReceiveOdor);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveAIOdor') {
            let value = target.checked.toString();
            props.settings.UseReceiveAIOdor.value = value;
            setUseReceiveAIOdor(!useReceiveAIOdor);
            props.onChangeNeedToSave();
        }
    }

    const onClickResetPopupState = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['팝업창 위치를 시스템 기본값으로 재설정하시겠습니까?'], ['확인'], doResetPopupState);
    }

    const doResetPopupState = async () => {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        const options = [{ 
            category: 'popup', 
            subCategory: null, 
            values: [] 
        }];

        const [result, message] = await AccountController.requestSaveOptions(
            userInfo.user_sn,
            options
        );

        if (!result) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            SettingsStore.dispatch({ type: 'RESET_POPUP', popupState: {} });
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['설정이 완료되었습니다.'], null, null);
        }
    }

const onClickDownload = async () => {
    try {
        const sensorLink = await ExternalController.GetExternalSensorLinks();
        const sensorType = await ExternalController.GetExternalSensorTypes();
        
        if (!sensorLink || !sensorType) {
            return props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["센서 정보를 불러올 수 없습니다."], null, null);
        }
        
        sensorLink.sort((a, b) => a.sensor_name.localeCompare(b.sensor_name));
        sensorType.sort((a, b) => a.sensor_type_idx - b.sensor_type_idx);
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('센서목록현황');

        worksheet.pageSetup = {
            orientation: 'landscape',
            paperSize: 9, // A4
            margins: {
                left: 0.7,
                right: 0.7,
                top: 0.75,
                bottom: 0.75,
                header: 0.3,
                footer: 0.3
            }
        };

        worksheet.views = [
            {
                showGridLines: false
            }
        ];
        
        const reportTitle = "센서목록현황";
        const currentDate = new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        worksheet.mergeCells('A1:F1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = reportTitle;
        titleCell.font = {
            name: '맑은 고딕',
            size: 16,
            bold: true
        };
        titleCell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F3FF' }
        };
        titleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.addRow([]);
        worksheet.addRow([]);

        const dateCell = worksheet.getCell('F3');
        dateCell.value = `작성일: ${currentDate}`;
        dateCell.font = {
            name: '맑은 고딕',
            size: 8,
            bold: true
        };
        dateCell.alignment = {
            horizontal: 'center',
            vertical: 'bottom'
        };
        dateCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);

        sensorType.forEach((type, typeIndex) => {
            const sensorsOfType = sensorLink.filter(sensor => 
                sensor.sensor_type_idx === type.sensor_type_idx
            );

            if (sensorsOfType.length === 0) 
                return; 

            const categoryRow = worksheet.addRow([
                type.sensor_type_name,
                '', '', '', '', ''
            ]);
            
            const categoryRowNumber = categoryRow.number;
            worksheet.getRow(categoryRowNumber).height = 40;
            worksheet.mergeCells(`A${categoryRowNumber}:F${categoryRowNumber}`);
            const categoryCell = worksheet.getCell(`A${categoryRowNumber}`);
            categoryCell.font = {
                name: '맑은 고딕',
                size: 14,
                bold: true,
                color: { argb: 'FF333333' }
            };
            categoryCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8E8E8' }
            };
            categoryCell.alignment = {
                horizontal: 'center',
                vertical: 'middle'
            };
            categoryCell.border = {
                top: { style: 'thick' },
                left: { style: 'thick' },
                bottom: { style: 'thick' },
                right: { style: 'thick' }
            };

            const headerRow = worksheet.addRow(['번호', '센서명', '설치위치', '위도', '경도', '비고']);

            headerRow.eachCell((cell, colNumber) => {
                cell.font = {
                    name: '맑은 고딕',
                    size: 10,
                    bold: true,
                    color: { argb: 'FFFFFFFF' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4472C4' }
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            sensorsOfType.forEach((sensor, sensorIndex) => {
                const dataRow = worksheet.addRow([
                    sensorIndex + 1,
                    sensor.sensor_name || '',
                    sensor.location || '',
                    sensor.lat || '',
                    sensor.lon || '',
                    ''
                ]);

                dataRow.eachCell((cell, colNumber) => {
                    cell.font = {
                        name: '맑은 고딕',
                        size: 9
                    };
                    cell.alignment = {
                        horizontal: colNumber === 1 ? 'center' : 'left',
                        vertical: 'middle',
                        shrinkToFit: colNumber === 3
                    };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };

                    if (sensorIndex % 2 === 0) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF8F9FA' }
                        };
                    }
                });
            });

            if (typeIndex < sensorType.length - 1) {
                worksheet.addRow([]);
            }
        });

        worksheet.columns = [
            { width: 8 },   // 번호
            { width: 25 },  // 센서명
            { width: 30 },  // 설치위치
            { width: 12 },  // 위도
            { width: 12 },  // 경도
            { width: 18 }   // 비고
        ];

        worksheet.getRow(1).height = 30;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const fileName = `${reportTitle}_${currentDate.replace(/\./g, '')}.xlsx`;
        saveAs(blob, fileName);
        
    } catch (error) {
        console.error('Excel 다운로드 중 오류 발생:', error);
        props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [`Excel 파일 생성 중 오류가 발생했습니다: ${error.message}`], null, null);
    }
};


    return (
        <Monitoring3DComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>3D 회전 대기시간/자동회전 설정</p>
                        <select
                            value={cameraIdleTime || false}
                            onChange={(e) => onChangeCameraIdleTime(Number(e.target.value))}
                        >
                            <option value={900}>15분</option>
                            <option value={1800}>30분</option>
                            <option value={3600}>1시간</option>
                        </select>
                    </div>
                    <div id='tooltip' data-tooltip="3D 회전 대기시간 및 자동회전을 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서 유형별 이벤트 발생 표시 설정 </p>
                        <div>
                            <input 
                                type='checkbox' 
                                id='sensor_1'
                                onChange={(e) => setChecked(e.target, 'useReceiveAtmosphere')}
                                checked={useReceiveAtmosphere || ''}
                            />
                            <label htmlFor='sensor_1'>대기유해물질측정기</label>
                        </div>
                        <div>
                            <input
                                type='checkbox'
                                id='sensor_2'
                                onChange={(e) => setChecked(e.target, 'useReceiveWaterLevel')}
                                checked={useReceiveWaterLevel || ''}
                            />
                            <label htmlFor='sensor_2'>수위계 및 CCTV</label>
                        </div>
                        <div>
                            <input 
                                type='checkbox' 
                                id='sensor_3' 
                                onChange={(e) => setChecked(e.target, 'useReceiveRainfall')}
                                checked={useReceiveRainfall || ''}
                            />
                            <label htmlFor='sensor_3'>강우량계</label>
                        </div>
                        <div>
                            <input 
                                type='checkbox' 
                                id='sensor_4' 
                                onChange={(e) => setChecked(e.target, 'useReceiveOdor')}
                                checked={useReceiveOdor || ''}
                            />
                            <label htmlFor='sensor_4'>악취측정기</label>
                        </div>
                        <div>
                            <input 
                                type='checkbox' 
                                id='sensor_5' 
                                onChange={(e) => setChecked(e.target, 'useReceiveAIOdor')}
                                checked={useReceiveAIOdor || ''}
                            />
                            <label htmlFor='sensor_5'>초거대 AI 악취측정기</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="센서 유형별 이벤트 발생 표시를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 화면 자동전환 설정</p>
                        <div>
                            <input type='radio' name='eventView' id='current' checked={moveDisplayAlarm === 0} onChange={() => onChangeMoveDisplayAlarm(0)} />
                            <label htmlFor='current'>현재화면 유지</label>
                        </div>
                        <div>
                            <input type='radio' name='eventView' id='move' checked={moveDisplayAlarm === 2} onChange={() => onChangeMoveDisplayAlarm(2)} />
                            <label htmlFor='move'>이벤트 발생 위치로 화면이동</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 시 자동 화면 전환 여부를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 효과음 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useAlarmSound"
                            setChecked={setChecked}
                            isChecked={useAlarmSound}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 효과음 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>초기상황 전파관리</p>
                        <button onClick={() => props.setShowSpread(true)}>수신 설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="초기상황 전파관리를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서정보 다운로드</p>
                        <button onClick={() => onClickDownload()}>파일 다운로드</button>
                    </div>
                    <div id='tooltip' data-tooltip="센서정보를 엑셀 파일로 다운로드합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>팝업창 위치 초기화 설정</p>
                        <button onClick={() => onClickResetPopupState()}>시스템 기본값으로 재설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="팝업창 위치를 초기화합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </Monitoring3DComponent>
    );
}

export default withRouter(Monitoring3D);