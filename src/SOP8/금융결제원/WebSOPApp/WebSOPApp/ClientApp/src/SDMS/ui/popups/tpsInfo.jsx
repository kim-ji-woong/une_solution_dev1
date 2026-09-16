import React, { useState, useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom';
import { ModalBackground } from '../../../Root/styled/theme';
import { TpsInfoComponent } from '../../styled/sdmsPopupsStyled';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import SdmsResource from '../../resource/id';
import SearchInputBox from '../../../Common/components/searchInputBox';
import EmptyContent from '../../../Common/components/emptyContent';
import FilterDropdown from '../../../Common/components/filterDropdown';
import ProjectResource from '../../../Root/resource/id';
import { SDMSController } from '../../services/sdmsController';
import { EquipmentController } from '../../../EquipmentManager/services/equipmentController';
import EditParentEquip from './editParentEquip';
import EditChildEquip from './editChildEquip';

const tooltipStyle = {
    position: 'fixed',
    padding: '4px 8px',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#555',
    fontSize: '0.75rem',
    lineHeight: '170%',
    letterSpacing: '-0.0225rem',
    textAlign: 'center',
    zIndex: 99999,
    pointerEvents: 'none',
    boxSizing: 'border-box',
};

const arrowStyle = {
    position: 'fixed',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #FFFFFF',
    zIndex: 99999,
    pointerEvents: 'none',
};

function TooltipCell({ value }) {
    const spanRef = useRef(null);
    const divRef = useRef(null);
    const [pos, setPos] = useState(null);

    const onMouseEnter = () => {
        const spanEl = spanRef.current;
        const divEl = divRef.current;
        if (spanEl && divEl && spanEl.scrollWidth > spanEl.clientWidth) {
            const rect = divEl.getBoundingClientRect();
            setPos(rect);
        }
    };

    return (
        <div ref={divRef} onMouseEnter={onMouseEnter} onMouseLeave={() => setPos(null)}>
            <span ref={spanRef}>{value}</span>
            {pos && ReactDOM.createPortal(
                <>
                    <div style={{
                        ...tooltipStyle,
                        left: pos.left,
                        width: pos.width,
                        bottom: window.innerHeight - pos.top + 7,
                    }}>{value}</div>
                    <div style={{
                        ...arrowStyle,
                        left: pos.left + pos.width / 2 - 5,
                        bottom: window.innerHeight - pos.top + 2,
                    }} />
                </>,
                document.body
            )}
        </div>
    );
}

function TpsInfo(props) {
    const [searchText, setSearchText] = useState("");
    const [parentEquipments, setParentEquipments] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [childEquipments, setChildEquipments] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null);
    const [openFilterKey, setOpenFilterKey] = useState(null);
    const [sort, setSort] = useState({ key: null, direction: 'asc' });
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [tpsList, setTpsList] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChildEditModal, setShowChildEditModal] = useState(false);
    const [parentItemList, setParentItemList] = useState([]);
    const [tpsName, setTpsName] = useState('');
    const childListBodyRef = useRef(null);

    useEffect(() => {
        const fetchEquipmentTypes = async () => {
            const [types] = await EquipmentController.requestEquipmentType();
            if (types) {
                setEquipmentTypes(types);
            }
        };

        const fetchTpsList = async () => {
            const [list] = await EquipmentController.requestTpsList();
            if (list) {
                setTpsList(list);
            }
        };

        const fetchParentItemList = async () => {
            const [list] = await EquipmentController.requestParentItemList();
            if (list) {
                setParentItemList(list);
            }
        };

        fetchEquipmentTypes();
        fetchTpsList();
        fetchParentItemList();
    }, []);

    useEffect(() => {
        const fetchParentEquipments = async () => {
            if (props.tpsNo == null) return;

            const [list, tpsName, message] = await SDMSController.requestTpsParentEquipments(props.tpsNo);

            setTpsName(tpsName);
            
            if (list) {
                setParentEquipments(list);
                if (list.length > 0) {
                    setSelectedParent(list[0]);
                }
            } else {
                console.log(message);
            }
        };

        fetchParentEquipments();
    }, [props.tpsNo]);

    useEffect(() => {
        const fetchChildEquipments = async () => {
            if (selectedParent?.equipmentNo == null) {
                setChildEquipments([]);
                return;
            }

            setSelectedChild(null);
            setTypeFilter(null);
            setSort({ key: null, direction: 'asc' });
            setSearchText("");
            if (childListBodyRef.current) {
                childListBodyRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
            const [data, message] = await SDMSController.requestTpsEquipments(selectedParent.equipmentNo);
            if (data) {
                setChildEquipments(data.childEquipment ?? []);
                setTpsName(data.tpsName ?? '');
            } else {
                setChildEquipments([]);
                setTpsName('');
                console.log(message);
            }
        };

        fetchChildEquipments();
    }, [selectedParent]);


    const filteredChildList = useMemo(() => {
        let list = [...childEquipments];

        if (typeFilter) {
            list = list.filter(item => item.typeName === typeFilter);
        }

        if (searchText) {
            const searchKeys = ['typeName', 'parentName', 'zoneName', 'equipmentName', 'modelName', 'equipmentIdenti', 'standard', 'ip', 'location', 'memo'];
            const keyword = searchText.toLowerCase();
            list = list.filter(item =>
                searchKeys.some(key => (item[key] ?? '').toString().toLowerCase().includes(keyword))
            );
        }

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
    }, [childEquipments, typeFilter, searchText, sort]);

    const onClickSort = (key) => {
        setSort(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortDirection = (key) => {
        if (sort.key !== key) return null;
        return sort.direction;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return dateStr.substring(0, 10);
    };

    const v = (value) => value || '-';

    const childColumns = [
        { key: 'typeName', label: '장비 타입', headerType: 'typeFilter' },
        { key: 'parentName', label: '상위 장비', sortable: true },
        { key: 'zoneName', label: '층', sortable: true },
        { key: 'equipmentName', label: '자재명', sortable: true },
        { key: 'modelName', label: '모델명', sortable: true },
        { key: 'equipmentIdenti', label: '장비식별정보', sortable: true },
        { key: 'standard', label: '규격', sortable: true },
        { key: 'ip', label: 'IP', sortable: true },
        { key: 'location', label: '위치', sortable: true },
        { key: 'exchangeTime', label: '교체일자', sortable: true },
        { key: 'memo', label: '비고', sortable: true },
    ];

    const renderHeader = (col) => {
        if (col.headerType === 'typeFilter') {
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
                            onClick: () => setTypeFilter(prev => prev === type.equipmentTypName ? null : type.equipmentTypName),
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
                        <Icon.SortIcon size="xxxxs" direction={getSortDirection(col.key)} />
                    </button>
                )}
            </div>
        );
    };

    const onEditSave = async (equipmentNo) => {
        setShowEditModal(false);
        const [list] = await SDMSController.requestTpsParentEquipments(props.tpsNo);
        if (list) {
            setParentEquipments(list);
            const updated = list.find(e => e.equipmentNo === equipmentNo);
            if (updated) {
                setSelectedParent(updated);
            }
        }
    };

    const onChildEditSave = async () => {
        setShowChildEditModal(false);
        setSelectedChild(null);
        const [data] = await SDMSController.requestTpsEquipments(selectedParent.equipmentNo);
        if (data) {
            setChildEquipments(data.childEquipment ?? []);
        }
    };

    const getSelectedChildData = () => {
        return childEquipments.find(c => c.equipmentNo === selectedChild) ?? null;
    };

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
        setSelectedChild(null);
    };

    return (
        <ModalBackground>
            <TpsInfoComponent>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.tpsInfo}
                    </h5>
                    <div>
                        <p>{tpsName}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.tpsInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className={'content'}>
                    {parentEquipments.length === 0 ? (
                        <EmptyContent
                            title="상위 장비가 없습니다"
                            description="장비관리 메뉴에서 장비를 추가하세요"
                            action={{
                                label: '이동하기',
                                onClick: () => props.history.push(ProjectResource.path.equipmentManager),
                            }}
                        />
                    ) : (
                        <>
                            <section className='parentList'>
                                <ul>
                                    {parentEquipments.map((equip) => (
                                        <li key={equip.equipmentNo}>
                                            <button
                                                className={selectedParent?.equipmentNo === equip.equipmentNo ? 'selected' : ''}
                                                onClick={() => setSelectedParent(equip)}
                                            >
                                                {equip.equipmentIdenti || '-'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className='infoWrap'>
                                <div className='parentInfo'>
                                    <div className='header'>
                                        <p>{selectedParent?.equipmentIdenti || '-'}</p>
                                        <IconButton
                                            variant="unfill_white"
                                            size="xs"
                                            icon={<Icon.PencilIcon size={"sm"} />}
                                            onClick={() => setShowEditModal(true)}
                                            className={showEditModal ? 'selected' : ''}
                                        >
                                            상위장비 수정하기
                                        </IconButton>
                                    </div>
                                    <div className='infoTable'>
                                        <table>
                                            <colgroup>
                                                <col style={{ width: '120px' }} />
                                                <col />
                                                <col style={{ width: '120px' }} />
                                                <col />
                                                <col style={{ width: '120px' }} />
                                                <col />
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <th>장비 타입</th>
                                                    <td>{v(selectedParent?.typeName)}</td>
                                                    <th>모델명</th>
                                                    <td>{v(selectedParent?.modelName)}</td>
                                                    <th>위치</th>
                                                    <td>{v(selectedParent?.location)}</td>
                                                </tr>
                                                <tr>
                                                    <th>TPS실</th>
                                                    <td>{v(selectedParent?.tpsName)}</td>
                                                    <th>IP</th>
                                                    <td>{v(selectedParent?.ip)}</td>
                                                    <th>교체일자</th>
                                                    <td>{formatDate(selectedParent?.exchangeTime)}</td>
                                                </tr>
                                                <tr>
                                                    <th>하위 장비 수</th>
                                                    <td>{selectedParent?.childCount ?? '-'}</td>
                                                    <th rowSpan={2}>규격</th>
                                                    <td rowSpan={2} className='multiline'><span>{v(selectedParent?.standard)}</span></td>
                                                    <th rowSpan={2}>비고</th>
                                                    <td rowSpan={2} className='multiline'><span>{v(selectedParent?.memo)}</span></td>
                                                </tr>
                                                <tr>
                                                    <th>자재명</th>
                                                    <td>{v(selectedParent?.equipmentName)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='childList'>
                                    <div className='head'>
                                        <div>
                                            <p>하위 장비 목록 ({filteredChildList.length})</p>
                                            {childEquipments.length > 0 && (
                                                <SearchInputBox
                                                    value={searchText}
                                                    onChange={(value) => { setSearchText(value); setSelectedChild(null); }}
                                                    placeholder={"검색하세요"}
                                                    onSubmit={handleSubmit}
                                                    onClear={() => { setSearchText(""); setSelectedChild(null); }}
                                                    fullWidth={false}
                                                />
                                            )}
                                        </div>
                                        {childEquipments.length > 0 && (
                                            <IconButton
                                                variant="unfill_white"
                                                size="xs"
                                                icon={<Icon.PencilIcon size={"sm"} />}
                                                disabled={selectedChild == null}
                                                onClick={() => setShowChildEditModal(true)}
                                                className={showChildEditModal ? 'selected' : ''}
                                            >
                                                하위장비 수정하기
                                            </IconButton>
                                        )}
                                    </div>
                                    <div className='body'>
                                        {childEquipments.length === 0 ? (
                                            <EmptyContent
                                                layout="plain"
                                                title="하위 장비가 없습니다"
                                                description="장비관리 메뉴에서 장비를 추가하거나 매핑하세요"
                                            />
                                        ) : (
                                            <div className='tableScrollX' ref={childListBodyRef}>
                                                <ul className='list'>
                                                    <li className='listHead'>
                                                        <div></div>
                                                        <div>NO</div>
                                                        {childColumns.map(renderHeader)}
                                                    </li>
                                                    <li className='listBody'>
                                                        <ul>
                                                            {filteredChildList.map((child, i) => (
                                                                <li key={child.equipmentNo}>
                                                                    <div><input type='radio' name='childEquip' checked={selectedChild === child.equipmentNo} onChange={() => setSelectedChild(child.equipmentNo)} /></div>
                                                                    <div><span>{i + 1}</span></div>
                                                                    <TooltipCell value={v(child.typeName)} />
                                                                    <TooltipCell value={v(child.parentName)} />
                                                                    <TooltipCell value={v(child.zoneName)} />
                                                                    <TooltipCell value={v(child.equipmentName)} />
                                                                    <TooltipCell value={v(child.modelName)} />
                                                                    <TooltipCell value={v(child.equipmentIdenti)} />
                                                                    <TooltipCell value={v(child.standard)} />
                                                                    <TooltipCell value={v(child.ip)} />
                                                                    <TooltipCell value={v(child.location)} />
                                                                    <TooltipCell value={formatDate(child.exchangeTime)} />
                                                                    <TooltipCell value={v(child.memo)} />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </TpsInfoComponent>
            {showChildEditModal && (
                <EditChildEquip
                    selectedChild={getSelectedChildData()}
                    equipmentTypes={equipmentTypes}
                    parentItemList={parentItemList}
                    onSave={onChildEditSave}
                    onClose={() => setShowChildEditModal(false)}
                    showConfirmDialog={props.showConfirmDialog}
                    onCloseConfirmDialog={props.onCloseConfirmDialog}
                    handleToast={props.handleToast}
                />
            )}
            {showEditModal && (
                <EditParentEquip
                    selectedParent={selectedParent}
                    equipmentTypes={equipmentTypes}
                    tpsList={tpsList}
                    onSave={onEditSave}
                    onClose={() => setShowEditModal(false)}
                    showConfirmDialog={props.showConfirmDialog}
                    onCloseConfirmDialog={props.onCloseConfirmDialog}
                    handleToast={props.handleToast}
                />
            )}
        </ModalBackground>
    )
}

export default withRouter(TpsInfo);
