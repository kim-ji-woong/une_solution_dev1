import React, { useState, useEffect } from 'react';

import { SpreadListComponent } from '../styled/settingsStyled';
import Pagination from '../../Common/ui/pagination';
import InputBox from '../../Common/components/inputBox';
import Icon from '../../Common/components/Icon/Icon';

function SpreadList(props) {
    const [displayContent, setDisplayContent] = useState([]);

    const getSortText = (targetSortType) => {
        if (props.sortType !== targetSortType) {
            return '';
        }

        return props.sortMethod ? ' ASC' : ' DESC';
    };

    useEffect(() => {
        let ui = [];

        if (props.spreadList && props.spreadList.length > 0) {
            let index = 1;

            if (props.pageIndex > 1) {
                index = props.pageIndex * props.pageItemCount - (props.pageItemCount - 1);
            }

            for (const item of props.spreadList) {
                const spreadMembersText = props.getSpreadMembersText(item.regularMembers);

                ui.push(
                    <li 
                        key={`spread_${index}`} 
                        onClick={(e) => props.handleUpdateSpreadPopup(e, item)}
                    >
                        <div>{index}</div>
                        <div>{item.detectType}</div>
                        <div>{item.notificationName}</div>
                        <div>{item.sensorTypeName}</div>
                        <div>{spreadMembersText}</div>
                        {item.isActive ?
                                <div className='yes'>
                                    <Icon.Check size='xxs' fill='#37B44A' />
                                    활성화
                                </div> :
                                <div className='no'>
                                    <Icon.IconCancel size='xxs' fill='#FB5454' />
                                    비활성화
                                </div>
                        }
                    </li>
                );
                index++;
            }
            setDisplayContent(ui);
        }
        else {
            setDisplayContent([]);
        }
    }, [props.spreadList]);

    const handleSubmit = (value) => {
        const text = (value ?? '').trim();
        props.setSearchText(text);
        props.setPageIndex(1);
    };

    return (
        <SpreadListComponent>
            <div className='searchWrap'>
                <InputBox
                    size="sm"
                    value={props.searchText}
                    onChange={(value) => {
                        props.setSearchText(value);
                        props.setPageIndex(1);
                    }}
                    placeholder={"검색"}
                    onSubmit={handleSubmit}
                    onClear={() => props.setSearchText('')}
                    fullWidth={true}
                    leftIcon={<Icon.Search size={"xxs"} />}
                />
            </div>
            <div className='listWrap'>
                <ul className='initSitMgrList'>
                    <li className='head'>
                        <div onClick={() => props.onClickSortSpreadList(props.sortTypes.notificationNo)}>NO</div>
                        <div onClick={() => props.onClickSortSpreadList(props.sortTypes.detectType)}>전파구분{getSortText(props.sortTypes.detectType)}</div>
                        <div onClick={() => props.onClickSortSpreadList(props.sortTypes.notificationName)}>전파관리명{getSortText(props.sortTypes.notificationName)}</div>
                        <div onClick={() => props.onClickSortSpreadList(props.sortTypes.sensorTypeName)}>센서유형{getSortText(props.sortTypes.sensorTypeName)}</div>
                        <div>전파대상자</div>
                        <div onClick={() => props.onClickSortSpreadList(props.sortTypes.isActive)}>활성화 여부{getSortText(props.sortTypes.isActive)}</div>
                    </li>
                    <li className='body'>
                        <ul>
                            {displayContent} 
                        </ul>
                    </li>
                </ul>
                {(props.listCount > 0) &&
                    <Pagination
                        totalPage={props.totalCount}
                        limit={props.pageItemCount}
                        page={props.pageIndex}
                        setPage={props.setPage}
                        bottom={"28px"}
                    />
                }
            </div>
        </SpreadListComponent>
    );
}

export default SpreadList;