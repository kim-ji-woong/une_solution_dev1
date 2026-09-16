import React, { Component } from 'react';
import { Assets3DInfoComponent } from '../styled/mainStyled';
import Main from './main';
import { ModalBackground } from '../../Root/styled/theme';
import MainResource from '../resource/id';
import { MainController } from '../services/mainController';
import Pagination from '../../Dashboard/ui/pagination';
import ProjectResource from '../../Root/resource/id';

class Assets3DInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            selectedOption: null,

            rackList: [],        // 테이블에 표출될 리스트
            itemList: [],        // 테이블에 표출될 리스트

            section: MainResource.section.rack,
            companyNo: null,
            rackType: null,
            unit: null,
            equipmentType: null,
            
            searchText: null,

            pageItemCount: 10,
            pageIndex: 1,
            totalCount: 0,
            listCount: 0
        }

        this.refSearch = React.createRef();
        this.wrapperRef = React.createRef();

        this.getAssets3DDatas();
        this.getFilterList();

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ selectedOption: null });
        }
    }

    setPage = (page) => {
        this.setState({ pageIndex: page }, () => {
            this.getAssets3DDatas();
        });
    }

    getAssets3DDatas = async () => {
        const { section, companyNo, rackType, unit, searchText, pageItemCount, pageIndex, equipmentType } = this.state;

        if (section === MainResource.section.rack) {
            const [rackTypes, totalCount, message] = await MainController.requestRackTypeList(companyNo, rackType, unit, searchText, pageIndex - 1, pageItemCount);

            if (rackTypes === null) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
            else {
                const newTotalCount = Math.ceil(totalCount / this.state.pageItemCount);
                this.setState({ rackList: rackTypes, totalCount: newTotalCount, listCount: totalCount });
            }
        }
        else if (section === MainResource.section.item) {
            const [itemTypes, totalCount, message] = await MainController.requestItemTypeList(null, equipmentType, companyNo, rackType, unit, searchText, pageIndex - 1, pageItemCount);

            if (itemTypes === null) {
                this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            }
            else {
                const newTotalCount = Math.ceil(totalCount / this.state.pageItemCount);
                this.setState({ itemList: itemTypes, totalCount: newTotalCount, listCount: totalCount });
            }
        }
    }

    getCompanyNameByCompanyNo = (companyNo) => {
        const { itemFilterList } = this.state;
    
        if (!itemFilterList || !itemFilterList.companies || itemFilterList.companies.length === 0) {
            return '';
        }
    
        const normalizedCompanyNo = Number(companyNo);
        const company = itemFilterList.companies.find(x => x.companyNo === normalizedCompanyNo);
    
        return company ? company.companyName : '';
    }

    getOptionName = (type) => {
        let { companyNo, rackType, unit, equipmentType } = this.state;

        if (type === 'companyName') {
            if (companyNo === null) {
                return '전체';
            }
            else {
                const companyName = this.getCompanyNameByCompanyNo(companyNo);
                return companyName;
            }
        }

        else if (type === 'type') {
            if (rackType === null) {
                return '전체';
            }
            else {
                return rackType;
            }
        }

        else if (type === 'unit') {
            if (unit === null) {
                return '전체';
            }
            else {
                return `${unit} U`;
            }
        }

        else if (type === 'equipmentType') {
            if (equipmentType === null) {
                return '전체';
            }
            else {
                return equipmentType;
            }
        }
    }

    onChangeSection = (e) => {
        let { value } = e.target;

        this.refSearch.current.value = '';

        this.setState({ section: value, pageIndex: 1, selectedOption: null, companyNo: null, rackType: null, unit: null, equipmentType: null, searchText: null }, () => {
            this.getAssets3DDatas();
        });
    }

    onChangeCompanyType = (e) => {
        let { value } = e.target;

        if (value === "-1")
            value = null;

        this.setState({ companyNo: value, pageIndex: 1, selectedOption: null }, () => {
            this.getAssets3DDatas();
        });
    } 

    onChangeRackType = (e) => {
        let { value } = e.target;

        if (value === "-1")
            value = null;

        this.setState({ rackType: value, pageIndex: 1, selectedOption: null }, () => {
            this.getAssets3DDatas();
        });
    } 

    onChangeUnitType = (e) => {
        let { value } = e.target;

        if (value === "-1")
            value = null;

        this.setState({ unit: value, pageIndex: 1, selectedOption: null }, () => {
            this.getAssets3DDatas();
        });
    } 

    onChangeEquipmentType = (e) => {
        let { value } = e.target;

        if (value === "-1")
            value = null;

        this.setState({ equipmentType: value, pageIndex: 1, selectedOption: null }, () => {
            this.getAssets3DDatas();
        });
    } 

    setSelectedOption = (option) => {
        this.setState({ selectedOption: option === this.state.selectedOption ? null : option });
    }

    searchEnterKey = () => {
        if (window.event.keyCode == 13) {
            this.search();
        }
    }

    search = () => {
        const text = this.refSearch.current.value;
        let newText = text.trim();

        if (newText.length === 0) {
            newText = null;
        }

        this.setState({ searchText: newText, pageIndex: 1 }, () => {
            this.getAssets3DDatas();
        });
    }

    getFilterList = async () => {
        const [[rackFilterList, rackMessage], [itemFilterList, itemMessage]] = await Promise.all([
            MainController.requestRackFilterList(),
            MainController.requestItemFilterList(),
        ]);

        if (rackFilterList === null) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [rackMessage], null, null);
            
        }

        if (itemFilterList === null) {
            this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [itemMessage], null, null);
        }

        this.setState({ rackFilterList, itemFilterList });
    };

    displayFilterUI = () => {
        let displayFilterUI = [];
        const { section, rackFilterList, itemFilterList, selectedOption } = this.state;
        
        if (section === MainResource.section.rack && rackFilterList) {
            const { companies, rackTypes, units } = rackFilterList;

            let companiesList = [];
            let rackTypesList = [];
            let unitsList = [];

            companiesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeCompanyType(e)}>전체</button></li>
            );

            for (let company of companies) {
                companiesList.push(
                    <li key={company.companyNo}><button type="button" value={company.companyNo} onClick={(e) => this.onChangeCompanyType(e)}>{company.companyName}</button></li>
                );
            }

            rackTypesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeRackType(e)}>전체</button></li>
            );

            for (let rackType of rackTypes) {
                rackTypesList.push(
                    <li key={rackType}><button type="button" value={rackType} onClick={(e) => this.onChangeRackType(e)}>{rackType}</button></li>
                );
            }

            unitsList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeUnitType(e)}>전체</button></li>
            );

            for (let unit of units) {
                unitsList.push(
                    <li key={unit}><button type="button" value={unit} onClick={(e) => this.onChangeUnitType(e)}>{unit} U</button></li>
                );
            }

            displayFilterUI.push(
                <div className={'assetsOptionArea'} ref={this.wrapperRef} key='rackFilters'>
                    <div>
                        <span>구분</span>
                        <button className={selectedOption === 'section' ? 'on' : null} onClick={() => this.setSelectedOption('section')}>{section}</button>
                        <ul className={selectedOption === 'section' ? 'on' : null}>
                            <li><button type="button" value={'Rack'} onClick={(e) => this.onChangeSection(e)}>Rack</button></li>
                            <li><button type="button" value={'통신장비'} onClick={(e) => this.onChangeSection(e)}>통신장비</button></li>
                            <li><button type="button" value={'전원환경설비'} onClick={(e) => this.onChangeSection(e)}>전원환경설비</button></li>
                        </ul>
                    </div>
                    <div>
                        <span>제조사</span>
                        <button className={selectedOption === 'companyName' ? 'on' : null} onClick={() => this.setSelectedOption('companyName')}>{this.getOptionName('companyName')}</button>
                        <ul className={selectedOption === 'companyName' ? 'on' : null}>
                            {companiesList}
                        </ul>
                    </div>
                    <div>
                        <span>종류</span>
                        <button className={selectedOption === 'type' ? 'on' : null} onClick={() => this.setSelectedOption('type')}>{this.getOptionName('type')}</button>
                        <ul className={selectedOption === 'type' ? 'on' : null}>
                            {rackTypesList}
                        </ul>
                    </div>
                    <div>
                        <span>Unit</span>
                        <button className={selectedOption === 'unit' ? 'on' : null} onClick={() => this.setSelectedOption('unit')}>{this.getOptionName('unit')}</button>
                        <ul className={selectedOption === 'unit' ? 'on' : null}>
                            {unitsList}
                        </ul>
                    </div>
                </div>
            );
        }
        else if (section === MainResource.section.item && itemFilterList) {
            const { companies, itemTypes, units, equipmentTypeNames } = itemFilterList;

            let companiesList = [];
            let itemTypesList = [];
            let unitsList = [];
            let equipmentTypesList = [];

            companiesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeCompanyType(e)}>전체</button></li>
            );

            for (let company of companies) {
                companiesList.push(
                    <li key={company.companyNo}><button type="button" value={company.companyNo} onClick={(e) => this.onChangeCompanyType(e)}>{company.companyName}</button></li>
                );
            }

            itemTypesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeRackType(e)}>전체</button></li>
            );

            for (let itemType of itemTypes) {
                itemTypesList.push(
                    <li key={itemType}><button type="button" value={itemType} onClick={(e) => this.onChangeRackType(e)}>{itemType}</button></li>
                );
            }

            unitsList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeUnitType(e)}>전체</button></li>
            );

            for (let unit of units) {
                unitsList.push(
                    <li key={unit}><button type="button" value={unit} onClick={(e) => this.onChangeUnitType(e)}>{unit} U</button></li>
                );
            }

            equipmentTypesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeEquipmentType(e)}>전체</button></li>
            );

            for (let equipmentType of equipmentTypeNames) {
                equipmentTypesList.push(
                    <li key={equipmentType}><button type="button" value={equipmentType} onClick={(e) => this.onChangeEquipmentType(e)}>{equipmentType}</button></li>
                );
            }

            displayFilterUI.push(
                <div className={'assetsOptionArea'} ref={this.wrapperRef} key='itemFilters'>
                    <div>
                        <span>구분</span>
                        <button className={selectedOption === 'section' ? 'on' : null} onClick={() => this.setSelectedOption('section')}>{section}</button>
                        <ul className={selectedOption === 'section' ? 'on' : null}>
                            <li><button type="button" value={'Rack'} onClick={(e) => this.onChangeSection(e)}>Rack</button></li>
                            <li><button type="button" value={'통신장비'} onClick={(e) => this.onChangeSection(e)}>통신장비</button></li>
                            <li><button type="button" value={'전원환경설비'} onClick={(e) => this.onChangeSection(e)}>전원환경설비</button></li>
                        </ul>
                    </div>
                    <div>
                        <span>카테고리</span>
                        <button className={selectedOption === 'equipmentType' ? 'on' : null} onClick={() => this.setSelectedOption('equipmentType')}>{this.getOptionName('equipmentType')}</button>
                        <ul className={selectedOption === 'equipmentType' ? 'on' : null}>
                            {equipmentTypesList}
                        </ul>
                    </div>
                    <div>
                        <span>제조사</span>
                        <button className={selectedOption === 'companyName' ? 'on' : null} onClick={() => this.setSelectedOption('companyName')}>{this.getOptionName('companyName')}</button>
                        <ul className={selectedOption === 'companyName' ? 'on' : null}>
                            {companiesList}
                        </ul>
                    </div>
                    <div>
                        <span>종류</span>
                        <button className={selectedOption === 'type' ? 'on' : null} onClick={() => this.setSelectedOption('type')}>{this.getOptionName('type')}</button>
                        <ul className={selectedOption === 'type' ? 'on' : null}>
                            {itemTypesList}
                        </ul>
                    </div>
                    <div>
                        <span>Unit</span>
                        <button className={selectedOption === 'unit' ? 'on' : null} onClick={() => this.setSelectedOption('unit')}>{this.getOptionName('unit')}</button>
                        <ul className={selectedOption === 'unit' ? 'on' : null}>
                            {unitsList}
                        </ul>
                    </div>
                </div>
            );
        }
        else if (section === MainResource.section.powerEquipment) {
            let companiesList = [];
            let rackTypesList = [];
            let unitsList = [];

            companiesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeCompanyType(e)}>전체</button></li>
            );

            rackTypesList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeRackType(e)}>전체</button></li>
            );

            unitsList.push(
                <li key='-1'><button type="button" value={-1} onClick={(e) => this.onChangeUnitType(e)}>전체</button></li>
            );

            displayFilterUI.push(
                <div className={'assetsOptionArea'} ref={this.wrapperRef} key='rackFilters'>
                    <div>
                        <span>구분</span>
                        <button className={selectedOption === 'section' ? 'on' : null} onClick={() => this.setSelectedOption('section')}>{section}</button>
                        <ul className={selectedOption === 'section' ? 'on' : null}>
                            <li><button type="button" value={'Rack'} onClick={(e) => this.onChangeSection(e)}>Rack</button></li>
                            <li><button type="button" value={'통신장비'} onClick={(e) => this.onChangeSection(e)}>통신장비</button></li>
                            <li><button type="button" value={'전원환경설비'} onClick={(e) => this.onChangeSection(e)}>전원환경설비</button></li>
                        </ul>
                    </div>
                    <div>
                        <span>제조사</span>
                        <button className={selectedOption === 'companyName' ? 'on' : null} onClick={() => this.setSelectedOption('companyName')}>{this.getOptionName('companyName')}</button>
                        <ul className={selectedOption === 'companyName' ? 'on' : null}>
                            {companiesList}
                        </ul>
                    </div>
                    <div>
                        <span>종류</span>
                        <button className={selectedOption === 'type' ? 'on' : null} onClick={() => this.setSelectedOption('type')}>{this.getOptionName('type')}</button>
                        <ul className={selectedOption === 'type' ? 'on' : null}>
                            {rackTypesList}
                        </ul>
                    </div>
                    <div>
                        <span>Unit</span>
                        <button className={selectedOption === 'unit' ? 'on' : null} onClick={() => this.setSelectedOption('unit')}>{this.getOptionName('unit')}</button>
                        <ul className={selectedOption === 'unit' ? 'on' : null}>
                            {unitsList}
                        </ul>
                    </div>
                </div>
            )
        }

        return displayFilterUI;
    }

    displayTableUI = () => {
        let displayTableUI = [];
        const { rackList, itemList, pageIndex, pageItemCount, section } = this.state;

        let index = 1;

        if (pageIndex > 1) {
            index = pageIndex * pageItemCount - (pageItemCount - 1);
        }

        if (section === MainResource.section.rack && rackList.length > 0) {
            for(let rack of rackList){
                displayTableUI.push(
                    <tr key={rack.rackTypeNo}>
                        <td>{index}</td>
                        <td>{MainResource.section.rack}</td>
                        <td>{rack.modelName}</td>
                        <td>{rack.company.companyName}</td>
                        <td>{`${rack.width ? rack.width : '-'} x ${rack.depth ? rack.depth : '-'} x ${rack.height ? rack.height : '-'}`}</td>
                        <td>{`${rack.unit} U`}</td>
                        <td>{rack.type}</td>
                        <td>{rack.regTime.slice(0, 10)}</td>
                    </tr>
                );

                index++;
            }
        }
        else if (section === MainResource.section.item && itemList.length > 0) {
            for(let item of itemList){
                displayTableUI.push(
                    <tr key={item.itemTypeNo}>
                        <td>{index}</td>
                        <td>{MainResource.section.item}</td>
                        <td>{item.equipmentTypeName}</td>
                        <td>{item.modelName}</td>
                        <td>{item.company.companyName}</td>
                        <td>{`${item.width ? item.width : '-'} x ${item.depth ? item.depth : '-'} x ${item.height ? item.height : '-'}`}</td>
                        <td>{`${item.unit} U`}</td>
                        <td>{item.type ? item.type : '-'}</td>
                        <td>{item.regTime.slice(0, 10)}</td>
                    </tr>
                );

                index++;
            }
        }

        return displayTableUI;
    }

    render(){
        const displayTableUI = this.displayTableUI();
        const displayFilterUI = this.displayFilterUI();

        const { section } = this.state;

        const commonCols = (
            <>
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
            </>
        );

        const extraCol = <col style={{ width: '11%' }} />;

        return (
            <ModalBackground className='UI_Section'>
                <Assets3DInfoComponent $section={section}>
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.assets3DInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.handleModalPopup('assetsInfo', false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div> 

                    <div className='body'>
                        {displayFilterUI}
                        <div className={'assetsSearch'}>
                            <input ref={this.refSearch} type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='모델명으로 검색하세요' />
                            <button onClick={this.search}>검색</button>
                        </div>

                        {
                            section !== MainResource.section.powerEquipment ?
                                <table className={'assetsTable'}>
                                    <colgroup>
                                        {commonCols}
                                        {section !== MainResource.section.rack && extraCol}
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>구분</th>
                                            {
                                                section === MainResource.section.item &&
                                                    <th>카테고리</th>
                                            }
                                            <th>모델명</th>
                                            <th>제조사</th>
                                            <th>크기(W x D x H mm)</th>
                                            <th>Unit</th>
                                            <th>종류</th>
                                            <th>등록일자</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayTableUI}
                                    </tbody>
                                </table> :
                                <div className='nopowerEquipmentInfo'>
                                    <p>전원환경설비 정보가 존재하지 않습니다</p>
                                </div>
                        }
                        {
                            (section !== MainResource.section.powerEquipment && this.state.listCount > this.state.pageItemCount) &&
                                <Pagination
                                    totalPage={this.state.totalCount}
                                    limit={5}
                                    page={this.state.pageIndex}
                                    setPage={this.setPage}
                                />
                        }
                    </div>
                </Assets3DInfoComponent>
            </ModalBackground>
        );
    }
}

export default Assets3DInfo;