import React, { useState, useRef, useMemo, useEffect } from 'react';
import { EditParentEquipComponent } from '../../styled/sdmsPopupsStyled';
import Button from '../../../Common/components/button';
import { EquipmentController } from '../../../EquipmentManager/services/equipmentController';
import { ModalBackground } from '../../../Root/styled/theme';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import 'react-datepicker/dist/react-datepicker.css';
import Icon from '../../../Common/components/Icon/Icon';
import ProjectResource from '../../../Root/resource/id';

function EditParentEquip(props) {
    const { selectedParent, equipmentTypes, tpsList, onSave, onClose } = props;

    const [editForm, setEditForm] = useState({});
    const initialFormRef = useRef({});
    const datepickerRef = useRef(null);

    useEffect(() => {
        if (!selectedParent) return;
        const form = {
            equipmentNo: selectedParent.equipmentNo,
            typeNo: selectedParent.typeNo,
            tpsNo: selectedParent.tpsNo,
            childCount: selectedParent.childCount ?? 0,
            equipmentName: selectedParent.equipmentName ?? '',
            modelName: selectedParent.modelName ?? '',
            equipmentIdenti: selectedParent.equipmentIdenti ?? '',
            ip: selectedParent.ip ?? '',
            standard: selectedParent.standard ?? '',
            location: selectedParent.location ?? '',
            exchangeTime: selectedParent.exchangeTime ? selectedParent.exchangeTime.substring(0, 10) : '',
            memo: selectedParent.memo ?? '',
        };
        initialFormRef.current = { ...form };
        setEditForm(form);
    }, [selectedParent]);

    const onEditFormChange = (key, value) => {
        setEditForm(prev => ({ ...prev, [key]: value }));
    };

    const isEditFormChanged = useMemo(() => {
        const initial = initialFormRef.current;
        return Object.keys(initial).some(key => String(editForm[key] ?? '') !== String(initial[key] ?? ''));
    }, [editForm]);

    const onClickSave = async () => {
        const equipment = {
            equipmentNo: editForm.equipmentNo,
            typeNo: editForm.typeNo,
            tpsNo: editForm.tpsNo,
            equipmentName: editForm.equipmentName,
            modelName: editForm.modelName,
            equipmentIdenti: editForm.equipmentIdenti,
            ip: editForm.ip,
            standard: editForm.standard,
            location: editForm.location,
            exchangeTime: editForm.exchangeTime || null,
            memo: editForm.memo,
        };

        const [success, message] = await EquipmentController.requestUpdateParentEquipment(equipment);

        if (success) {
            onSave(editForm.equipmentNo);
            props.handleToast("저장되었습니다");
        } else {
            console.log(message);
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    const onClickCancel = () => {
        if (isEditFormChanged) {
            props.showConfirmDialog(
                ProjectResource.dialogTypes.QUESTION,
                ["변경한 내용을 저장하시겠습니까?", "취소 버튼 클릭 시 변경사항은 저장되지않습니다"],
                ["취소", "저장하기"],
                async (index) => {
                    if (index === 0) {
                        props.onCloseConfirmDialog();
                        onClose();
                    } else {
                        props.onCloseConfirmDialog();
                        await onClickSave();
                    }
                }
            );
        } else {
            onClose();
        }
    };

    return (
        <ModalBackground>
            <EditParentEquipComponent>
                <header>
                    <h2>상위 장비 정보 편집하기</h2>
                </header>
                <section>
                    <ul>
                        <li>
                            <div>장비 타입</div>
                            <div>
                                <select
                                    value={String(editForm.typeNo ?? '')}
                                    onChange={(e) => onEditFormChange('typeNo', Number(e.target.value))}
                                >
                                    {equipmentTypes.map(type => (
                                        <option key={type.equipmentTypNo} value={String(type.equipmentTypNo)}>
                                            {type.equipmentTypName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li>
                            <div>TPS실</div>
                            <div>
                                <select
                                    value={String(editForm.tpsNo ?? '')}
                                    onChange={(e) => onEditFormChange('tpsNo', Number(e.target.value))}
                                >
                                    {tpsList.map(tps => (
                                        <option key={tps.tpsNo} value={String(tps.tpsNo)}>
                                            {tps.tpsName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li>
                            <div>하위 장비 수</div>
                            <div>
                                <p>{editForm.childCount}</p>
                            </div>
                        </li>
                        <li>
                            <div>자재명</div>
                            <div>
                                <input
                                    type="text"
                                    value={editForm.equipmentName}
                                    onChange={(e) => onEditFormChange('equipmentName', e.target.value)}
                                    placeholder="자재명"
                                />
                            </div>
                        </li>
                        <li>
                            <div>모델명</div>
                            <div>
                                <input
                                    type="text"
                                    value={editForm.modelName}
                                    onChange={(e) => onEditFormChange('modelName', e.target.value)}
                                    placeholder="모델명"
                                />
                            </div>
                        </li>
                        <li>
                            <div>장비식별정보</div>
                            <div>
                                <input
                                    type="text"
                                    value={editForm.equipmentIdenti}
                                    onChange={(e) => onEditFormChange('equipmentIdenti', e.target.value)}
                                    placeholder="장비식별정보"
                                />
                            </div>
                        </li>
                        <li>
                            <div>IP</div>
                            <div>
                                <input
                                    type="text"
                                    value={editForm.ip}
                                    onChange={(e) => onEditFormChange('ip', e.target.value)}
                                    placeholder="IP"
                                />
                            </div>
                        </li>
                        <li>
                            <div>규격</div>
                            <div>
                                <textarea
                                    value={editForm.standard}
                                    onChange={(e) => onEditFormChange('standard', e.target.value)}
                                    placeholder="규격"
                                />
                            </div>
                        </li>
                        <li>
                            <div>위치</div>
                            <div>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => onEditFormChange('location', e.target.value)}
                                    placeholder="위치"
                                />
                            </div>
                        </li>
                        <li>
                            <div>교체일자</div>
                            <div className="datepicker">
                                <DatePicker
                                    ref={datepickerRef}
                                    selected={editForm.exchangeTime ? new Date(editForm.exchangeTime) : null}
                                    onChange={(date) => {
                                        const formatted = date
                                            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                                            : '';
                                        onEditFormChange('exchangeTime', formatted);
                                    }}
                                    dateFormat="yyyy-MM-dd"
                                    locale={ko}
                                    maxDate={new Date()}
                                    placeholderText="교체일자"
                                    popperPlacement="top"
                                />
                                <button
                                    type="button"
                                    className="btnCalendarBk"
                                    onClick={() => datepickerRef.current?.setOpen(true)}
                                >
                                    <Icon.Calendar />
                                </button>
                            </div>
                        </li>
                        <li>
                            <div>비고</div>
                            <div>
                                <textarea
                                    value={editForm.memo}
                                    onChange={(e) => onEditFormChange('memo', e.target.value)}
                                    placeholder="작성 내용"
                                />
                            </div>
                        </li>
                    </ul>
                </section>
                <div className='btnWrap'>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={onClickCancel}
                    >
                        취소
                    </Button>
                    <Button
                        variant="fill"
                        size="xs"
                        disabled={!isEditFormChanged}
                        onClick={onClickSave}
                    >
                        저장하기
                    </Button>
                </div>
            </EditParentEquipComponent>
        </ModalBackground>
    );
}

export default EditParentEquip;
