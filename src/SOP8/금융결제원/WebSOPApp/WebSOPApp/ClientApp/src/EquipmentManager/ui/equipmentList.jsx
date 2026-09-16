import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProjectResource from '../../Root/resource/id';
import { EquipmentListComponent } from '../styled/equipmentManagerStyled';
import EmptyContent from '../../Common/components/emptyContent';
import Icon from '../../Common/components/Icon/Icon';
import FilterDropdown from '../../Common/components/filterDropdown';
import { EquipmentController } from '../services/equipmentController';
import ColTextEquipment from './columns/colTextEquipment';
import ColComboBoxEquipment from './columns/colComboBoxEquipment';
import ColDatePickerEquipment from './columns/colDatePickerEquipment';
import EquipmentResource from '../resource/id';
import ColTextareaEquipment from './columns/colTextAreaEquipment';
import { parentColumns, childColumns } from "../config/equipmentColumns";

function EquipmentList({ equipmentList = [], equipmentTypes = [], tpsList = [], parentList = [], ...props }) {

    const columns = useMemo(() => {
        return props.menu === EquipmentResource.menu.상위_장비_목록
            ? parentColumns
            : childColumns;
    }, [props.menu]);

    const api = useMemo(() => {
        if (props.menu === EquipmentResource.menu.상위_장비_목록) {
            return {
                insert: EquipmentController.requestInsertParentEquipment,
                update: EquipmentController.requestUpdateParentEquipment,
                delete: EquipmentController.requestDeleteParentEquipment,
            };
        }

        return {
            insert: EquipmentController.requestInsertEquipment,
            update: EquipmentController.requestUpdateEquipment,
            delete: EquipmentController.requestDeleteEquipment,
        };
    }, [props.menu]);

    const [addIndex, setAddIndex] = useState(-1);

    const [search, setSearch] = useState('');
    const [checkedMap, setCheckedMap] = useState({});
    const [allChecked, setAllChecked] = useState(false);
    const [openFilterKey, setOpenFilterKey] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null); 

    const [sort, setSort] = useState({
        key: null,
        direction: 'asc', // asc | desc
    });

    const checkedItemsRef = useRef([]);
    const bodyRef = useRef(null);

    const optionsMap = useMemo(() => ({
        equipmentTypes,
        tpsList,
        parentList: parentList.filter(p => p.parentName),
    }), [equipmentTypes, tpsList, parentList]);

    const filteredAndSortedList = useMemo(() => {
        let list = [...equipmentList];

        // 장비 타입 필터
        if (typeFilter) {
            list = list.filter(item => item.typeName === typeFilter);
        }

        // 검색 (장비식별정보, 교체일자 제외)
        if (search) {
            const excludeKeys = new Set(['equipmentIdenti', 'exchangeTime']);
            const searchKeys = columns
                .filter(col => !excludeKeys.has(col.key))
                .map(col => {
                    if (col.type !== 'comboType') return col.key;
                    // comboType은 No(숫자)가 아닌 Name(텍스트) 필드로 검색
                    const key = col.key;
                    return key.endsWith('No') ? key.replace(/No$/, 'Name') : key;
                });
            const keyword = search.toLowerCase();
            list = list.filter(item =>
                searchKeys.some(key => {
                    const val = item[key];
                    return val != null && String(val).toLowerCase().includes(keyword);
                })
            );
        }

        // 정렬
        if (sort.key) {
            list.sort((a, b) => {
                const aVal = a[sort.key] ?? '';
                const bVal = b[sort.key] ?? '';

                if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return list;
    }, [equipmentList, columns, search, sort, typeFilter]);

    // 체크된 리스트가 하나라도 존재할 때에만 삭제 버튼 활성화
    const visibleChecked = useMemo(() => {
        return filteredAndSortedList.some(
            item => checkedMap[item.equipmentNo]
        );
    }, [filteredAndSortedList, checkedMap]);

    // 메뉴 바뀌면 필터/정렬 전체 초기화
    useEffect(() => {
        setSearch('');
        setTypeFilter(null);
        setSort({ key: null, direction: 'asc' });
        setOpenFilterKey(null);
        setCheckedMap({});
        setAllChecked(false);
    }, [props.menu]);

    // 필터 바뀌면 체크 초기화
    useEffect(() => {
        setCheckedMap({});
        setAllChecked(false);
    }, [typeFilter, search]);

    // 필터, 정렬 변경 시 편집모드 종료
    useEffect(() => {
        props.setEquipmentList(prev =>
            prev.map(item => ({
                ...item,
                isEditMode: false,
                editField: null,
            }))
        );
    }, [search, typeFilter, sort]);

    const onClickSort = (key) => {
        setSort(prev => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortDirection = (key) => {
        if (sort.key !== key) return null;
        return sort.direction;
    };

    const onCheckedAll = (checked) => {
        const newMap = {};
        filteredAndSortedList.forEach(item => {
            newMap[item.equipmentNo] = checked;
        });
        setCheckedMap(newMap);
        setAllChecked(checked);
    };

    const onCheckedOne = (no, checked) => {
        setCheckedMap(prev => {
            const next = { ...prev, [no]: checked };
            setAllChecked(
                filteredAndSortedList.length > 0 &&
                filteredAndSortedList.every(item => next[item.equipmentNo])
            );
            return next;
        });
    };

    const onClickSearch = () => {
        setSearch(document.getElementById('search').value);
    };

    const onKeyPressSearch = (e) => {
        if (e.key === 'Enter') onClickSearch();
    };

    const onClickAddEquipment = () => {
        const index = addIndex;
        onAddEquipment(index);
        setAddIndex(index - 1);

        // row가 추가되면 장비타입 선택 필터 전체로 변경, 스크롤 최상단으로 이동
        setTypeFilter(null);

        setTimeout(() => {
            if (bodyRef.current) {
                bodyRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 0);
    }

    const onClickDeleteEquipment = () => {
        // 체크된 장비 분류
        const checkedItems = equipmentList.filter(
            item => checkedMap[item.equipmentNo]
        );

        checkedItemsRef.current = checkedItems;

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["선택한 목록을 삭제하시겠습니까?", "삭제 시 되돌릴 수 없습니다."], ["취소", "삭제하기"], onDeleteEquipment);
    }

    const onDeleteEquipment = async (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            return;
        } 

        const checkedItems = checkedItemsRef.current;

        const [success, message] = await api.delete(checkedItems);

        if (success) {
            props.onCloseConfirmDialog();
            // 화면에서도 제거
            props.setEquipmentList(prev =>
                prev.filter(item => !checkedMap[item.equipmentNo])
            );

            // 체크 상태 초기화
            setCheckedMap({});
            setAllChecked(false);

            props.handleToast("선택한 목록이 삭제되었습니다");
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onAddEquipment = (addIndex) => {
        const isParent = props.menu === EquipmentResource.menu.상위_장비_목록;

        const equipment = isParent
            ? {
                equipmentNo: addIndex,
                typeNo: 300901,
                typeName: "출입통제",
                tpsNo: 385,
                tpsName: "지하 4층 TPS",
                childCount: 0,
                equipmentIdenti: "",
                equipmentName: "",
                modelName: "",
                makerName: "",
                standard: "",
                ip: "",
                location: null,
                exchangeTime: null,
                memo: null,
                isEditMode: false,
                editField: null,
            }
            : {
                equipmentNo: addIndex,
                typeNo: 300901,
                typeName: "출입통제",
                parentNo: null,
                parentName: null,
                equipmentIdenti: "",
                equipmentName: "",
                modelName: "",
                makerName: "",
                standard: "",
                ip: "",
                location: "",
                zoneName: "",
                exchangeTime: null,
                memo: "",
                isEditMode: false,
                editField: null,
            };

        props.setEquipmentList(prev => [equipment, ...prev]);

        insertEquipment(equipment);
    };

    const insertEquipment = async (target) => {
        const tempEquipmentNo = target.equipmentNo;

        const [success, equipment, message] = await api.insert(target);

        if (!success) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        props.setEquipmentList(prev =>
            prev.map(item =>
                item.equipmentNo === tempEquipmentNo
                    ? {
                        ...equipment,
                        isEditMode: false,
                        editField: null,
                    }
                    : item
            )
        );
    };

    const setEdit = (equipmentNo, field) => {
        props.setEquipmentList(prev =>
            prev.map(item => {
                if (item.equipmentNo === equipmentNo) {
                    return {
                        ...item,
                        isEditMode: true,
                        editField: field,
                    };
                }

                return {
                    ...item,
                    isEditMode: false,
                    editField: null,
                };
            })
        );
    };

    // Cell 수정 (text, select)
    const updateEquipment = async (equipmentNo, patch) => {
        const current = equipmentList.find(
            item => item.equipmentNo === equipmentNo
        );

        if (!current) return;

        const hasDiff = Object.keys(patch).some(
            key => current[key] !== patch[key]
        );

        if (!hasDiff) {
            props.setEquipmentList(prev =>
                prev.map(item =>
                    item.equipmentNo === equipmentNo
                        ? { ...item, isEditMode: false, editField: null }
                        : item
                )
            );
            return;
        }

        const target = {
            ...current,
            ...patch,
            isEditMode: false,
            editField: null,
        };

        const [success, message, updatedEquipment] = await api.update(target);

        if (!success) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        // 성공 후 상태 반영 (하위 장비는 서버 반환값으로 갱신하여 zoneName 등 서버 계산 값 반영)
        const next = updatedEquipment
            ? { ...updatedEquipment, isEditMode: false, editField: null }
            : target;

        props.setEquipmentList(prev =>
            prev.map(item =>
                item.equipmentNo === equipmentNo ? next : item
            )
        );

        // 상위 장비의 식별번호가 변경되면 parentList 갱신
        if (
            props.menu === EquipmentResource.menu.상위_장비_목록 &&
            'equipmentIdenti' in patch
        ) {
            props.onRefreshParentList();
        }
    };

    const exitEdit = (equipmentNo) => {
        props.setEquipmentList(prev =>
            prev.map(item =>
                item.equipmentNo === equipmentNo
                    ? { ...item, isEditMode: false, editField: null }
                    : item
            )
        );
    };

    const renderHeader = (col) => {

        if (col.headerType === "typeFilter") {
            return (
                <div key={col.key}>
                    <span>{col.label}</span>

                    <FilterDropdown
                        size="sm"
                        filterKey="typeName"
                        openKey={openFilterKey}
                        setOpenKey={setOpenFilterKey}
                        activeValue={typeFilter}
                        items={equipmentTypes.map(type => ({
                            label: type.equipmentTypName,
                            value: type.equipmentTypName,
                            onClick: () =>
                            setTypeFilter(prev =>
                                prev === type.equipmentTypName ? null : type.equipmentTypName
                            ),
                        }))}
                    />
                </div>
            );
        }

        return (
            <div key={col.key}>
                <span>{col.label}</span>

                {col.sortable && (
                    <button onClick={() => onClickSort(col.key)}>
                        <Icon.SortIcon
                            size="xxxxs"
                            direction={getSortDirection(col.key)}
                        />
                    </button>
                )}
            </div>
        );
    };

    const userInfo = ProjectResource.getUserInfo();

    return (
        <EquipmentListComponent $userLevel={userInfo?.grad_sn}>
            <div className='titleWrap'>
                <p>{props.menu === EquipmentResource.menu.상위_장비_목록 ? EquipmentResource.menu.상위_장비_목록 : EquipmentResource.menu.하위_장비_목록}</p>
                <div className='sctRht'>
                    <div className='searchWrap'>
                        <input
                            id="search"
                            placeholder="검색어를 입력하세요"
                            onKeyUp={onKeyPressSearch}
                        />
                        <button onClick={onClickSearch}>검색</button>
                    </div>
                    <button
                        className="sctBtn"
                        onClick={onClickAddEquipment}
                    >
                        추가
                    </button>
                    <button
                        className="sctBtn"
                        disabled={!visibleChecked}
                        onClick={onClickDeleteEquipment}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className='listWrap'>
                <div className='tableScrollX'>
                    {filteredAndSortedList.length > 0 ? 
                        <ul className='list'>
                            <li className="head">
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={(e) => onCheckedAll(e.target.checked)}
                                    />
                                </div>
                                <div>NO</div>
                                {columns.map(renderHeader)}
                            </li>
                            <li className='body' ref={bodyRef}>
                                <ul>
                                    {filteredAndSortedList.map((item, index) => (
                                        <li key={item.equipmentNo} className={checkedMap[item.equipmentNo] ? 'colorOn' : ''}>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    checked={!!checkedMap[item.equipmentNo]}
                                                    onChange={(e) =>
                                                        onCheckedOne(item.equipmentNo, e.target.checked)
                                                    }
                                                />
                                            </div>
                                            <div><span>{index + 1}</span></div>

                                            {columns.map(col => {
                                                const field = col.key;

                                                switch (col.type) {
                                                    case "text":
                                                        return (
                                                            <div key={field}>
                                                                <span>{item[field]}</span>
                                                            </div>
                                                        );

                                                    case "textEdit":
                                                        return (
                                                            <ColTextEquipment
                                                                key={field}
                                                                value={item[field]}
                                                                isEditMode={item.isEditMode && item.editField === field}
                                                                onEnterEdit={() => setEdit(item.equipmentNo, field)}
                                                                onChange={(v) => updateEquipment(item.equipmentNo, { [field]: v })}
                                                                onExitEdit={() => exitEdit(item.equipmentNo)}
                                                            />
                                                        );

                                                    case "textarea":
                                                        return (
                                                            <ColTextareaEquipment
                                                                key={field}
                                                                value={item[field]}
                                                                isEditMode={item.isEditMode && item.editField === field}
                                                                onEnterEdit={() => setEdit(item.equipmentNo, field)}
                                                                onChange={(v) => updateEquipment(item.equipmentNo, { [field]: v })}
                                                                onExitEdit={() => exitEdit(item.equipmentNo)}
                                                            />
                                                        );

                                                    case "comboType": {
                                                        const cfg = col.comboConfig;
                                                        const options = optionsMap[cfg.optionsSource] ?? [];
                                                        return (
                                                            <ColComboBoxEquipment
                                                                key={field}
                                                                value={item[cfg.valueKey]}
                                                                isEditMode={item.isEditMode && item.editField === field}
                                                                onEnterEdit={() => setEdit(item.equipmentNo, field)}
                                                                nullable={cfg.nullable}
                                                                onChange={(val) => {
                                                                    if (val === null && cfg.nullable) {
                                                                        updateEquipment(item.equipmentNo, cfg.nullPatch);
                                                                        return;
                                                                    }
                                                                    const selected = options.find(o => o[cfg.valueField] === val);
                                                                    if (!selected) return;
                                                                    updateEquipment(item.equipmentNo, cfg.buildPatch(selected));
                                                                }}
                                                                options={options}
                                                                valueField={cfg.valueField}
                                                                labelField={cfg.labelField}
                                                                onExitEdit={() => exitEdit(item.equipmentNo)}
                                                            />
                                                        );
                                                    }

                                                    case "date":
                                                        return (
                                                            <ColDatePickerEquipment
                                                                key={field}
                                                                value={item[field]}
                                                                isEditMode={item.isEditMode && item.editField === field}
                                                                onEnterEdit={() => setEdit(item.equipmentNo, field)}
                                                                onChange={(v) =>
                                                                    updateEquipment(item.equipmentNo, { [field]: v })
                                                                }
                                                                onExitEdit={() => exitEdit(item.equipmentNo)}
                                                            />
                                                        );

                                                    default:
                                                        return null;
                                                }
                                            })}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul> :
                        <EmptyContent
                            layout="list"
                            title="장비 목록이 없습니다"
                            description="추가하기 버튼을 이용해 목록을 추가하세요"
                        />
                }
                </div>
            </div>
        </EquipmentListComponent>
    );
}

export default EquipmentList;