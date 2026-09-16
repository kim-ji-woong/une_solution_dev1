import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Monitoring3DComponent} from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip_icon.svg';
import {AccountController} from '../../Account/services/accountController';
import ProjectResource from '../../Root/resource/id';
import SettingsStore from '../settingsStore';
import {ExternalController} from "../../SDMS/services/externalController";
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import BoxButton from '../../Common/components/boxButton';
import AccountResource from "../../Account/resource/id";

function Monitoring3D(props) {
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);
    const [useReceiveAtmosphere, setUseReceiveAtmosphere] = useState(false);
    const [useReceiveWater, setUseReceiveWater] = useState(false);
    const [useReceiveWaterDisaster, setUseReceiveWaterDisaster] = useState(false);
    
    const [optionsDisabled, setOptionsDisabled] = useState(false);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;
        
        const userInfo = ProjectResource.getUserInfo();
        if (userInfo.grad_sn !== AccountResource.accountLevelNo.master) {
            setOptionsDisabled(true);
        }

        setMoveDisplayAlarm(Number(props.settings.MoveDisplayAlarm?.value));
        setUseReceiveAtmosphere(props.settings.UseReceiveAtmosphere?.value?.toLowerCase() === "true");
        setUseReceiveWater(props.settings.UseReceiveWater?.value?.toLowerCase() === "true");
        setUseReceiveWaterDisaster(props.settings.UseReceiveWaterDisaster?.value?.toLowerCase() === "true");
    };

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

        if (type === 'useReceiveAtmosphere') {
            props.settings.UseReceiveAtmosphere.value = target.checked.toString();
            setUseReceiveAtmosphere(!useReceiveAtmosphere);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveWater') {
            props.settings.UseReceiveWater.value = target.checked.toString();
            setUseReceiveWater(!useReceiveWater);
            props.onChangeNeedToSave();
        }
        else if (type === 'useReceiveWaterDisaster') {
            props.settings.UseReceiveWaterDisaster.value = target.checked.toString();
            setUseReceiveWaterDisaster(!useReceiveWaterDisaster);
            props.onChangeNeedToSave();
        }
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
                        <p>유형별 이벤트 수신 설정</p>
                        <div>
                            <label htmlFor='sensor_1'>
                                <input 
                                    type='checkbox' 
                                    id='sensor_1'
                                    onChange={(e) => setChecked(e.target, 'useReceiveAtmosphere')}
                                    checked={useReceiveAtmosphere || ''}
                                    disabled={optionsDisabled}
                                />
                                대기유해물질측정기
                            </label>
                        </div>
                        <div>
                            <label htmlFor='sensor_2'>
                                <input
                                    type='checkbox'
                                    id='sensor_2'
                                    onChange={(e) => setChecked(e.target, 'useReceiveWater')}
                                    checked={useReceiveWater || ''}
                                    disabled={optionsDisabled}
                                />
                                수질측정기
                            </label>
                        </div>
                        <div>
                            <label htmlFor='sensor_3'>
                                <input 
                                    type='checkbox' 
                                    id='sensor_3' 
                                    onChange={(e) => setChecked(e.target, 'useReceiveWaterDisaster')}
                                    checked={useReceiveWaterDisaster || ''}
                                    disabled={optionsDisabled}
                                />
                                수해방지 모니터링 시스템
                            </label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 유형별 알람 수신을 설정할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 자동 화면 전환 설정</p>
                        <div>
                            <label htmlFor='current'>
                                <input type='radio' name='eventView' id='current' checked={moveDisplayAlarm === 0} onChange={() => onChangeMoveDisplayAlarm(0)} disabled={optionsDisabled}/>
                                현재화면 유지
                            </label>
                        </div>
                        <div>
                            <label htmlFor='move'>
                                <input type='radio' name='eventView' id='move' checked={moveDisplayAlarm === 2} onChange={() => onChangeMoveDisplayAlarm(2)} disabled={optionsDisabled}/>
                                이벤트 발생 위치로 화면이동
                            </label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 자동 화면 전환 설정을 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>

            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>초기 상황 전파 설정</p>
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={() => props.setShowSpread(true)}
                            disabled={optionsDisabled}
                        >
                            수신 설정
                        </BoxButton>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 설정한 유형에 따른 초기 상황 전파 설정을 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서 정보 다운로드</p>
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={() => onClickDownload()}
                        >
                            파일 다운로드
                        </BoxButton>
                    </div>
                    <div id='tooltip' data-tooltip="센서 정보를 엑셀 파일로 다운로드합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </Monitoring3DComponent>
    );
}

export default withRouter(Monitoring3D);