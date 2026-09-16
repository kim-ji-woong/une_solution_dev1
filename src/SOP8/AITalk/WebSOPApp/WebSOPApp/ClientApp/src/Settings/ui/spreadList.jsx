import React, { useState, useEffect } from 'react';

import { SpreadListComponent } from '../styled/settingsStyled';
import Pagination from '../../Common/ui/pagination';

function SpreadList(props) {
    const [displayContent, setDisplayContent] = useState([]);

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
                        <div>{item.notificationName}</div>
                        <div>{item.sensorTypeName}</div>
                        <div>{spreadMembersText}</div>
                        {
                            item.isActive ?
                                <div className='yes'>YES</div> :
                                <div className='no'>NO</div>
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

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            search();
        }
    }

    const search = () => {
        const text = document.getElementById('txtSearch').value;
        props.setSearchText(text);
        props.setPageIndex(1);
    }

    return (
        <SpreadListComponent>
            <div className='searchWrap'>
                <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.' onKeyUp={searchEnterKey} />
                <button onClick={search}>검색</button>
            </div>
            <div className='listWrap'>
                <ul className='initSitMgrList'>
                    <li className='head'>
                        <div>NO</div>
                        <div>전파관리 명</div>
                        <div>이벤트 유형</div>
                        <div>지정된 사용자</div>
                        <div>활성화 여부</div>
                    </li>
                    <li className='body'>
                        <ul>
                        {
                            displayContent
                        }
                        </ul>
                    </li>
                </ul>
                {
                    (props.listCount > 0) &&
                    <Pagination
                        totalPage={props.totalCount}
                        limit={props.pageItemCount}
                        page={props.pageIndex}
                        setPage={props.setPage}
                    />
                }
            </div>
        </SpreadListComponent>
    );
}

export default SpreadList;