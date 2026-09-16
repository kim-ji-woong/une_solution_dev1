import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import paging_first from '../images/paging_first.svg';
import paging_last from '../images/paging_last.svg';
import paging_next from '../images/paging_next.svg';
import paging_prev from '../images/paging_prev.svg';
import paging_first_disabled from '../images/paging_first_disabled.svg';
import paging_prev_disabled from '../images/paging_prev_disabled.svg';
import paging_next_disabled from '../images/paging_next_disabled.svg';
import paging_last_disabled from '../images/paging_last_disabled.svg';

export const sliceArrayByLimit = (totalPage, limit) => {
    const totalPageArray = Array(totalPage)
        .fill()
        .map((_, i) => i);

    return Array(Math.ceil(totalPage / limit))
        .fill()
        .map(() => totalPageArray.splice(0, limit));
};

const Pagination = ({ totalPage, limit, page, setPage }) => {

    // 총 페이지 갯수에 따라 Pagination 갯수 정하기, limit 단위로 페이지 리스트 넘기기
    const [currentPageArray, setCurrentPageArray] = useState([]);
    const [totalPageArray, setTotalPageArray] = useState([]);
    
    useEffect(() => {
        if (page === totalPage) {
            if (page % limit === 0) {
                setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
            }
            else {
                setCurrentPageArray(totalPageArray[Math.floor(page / limit)]);
            }
        }
        else {
            if (page % limit === 1) {
                setCurrentPageArray(totalPageArray[Math.floor(page / limit)]);
            } else if (page % limit === 0) {
                setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
            }
        }
    }, [page]);

    useEffect(() => {
        const slicedPageArray = sliceArrayByLimit(totalPage, limit);
        setTotalPageArray(slicedPageArray);
        setCurrentPageArray(slicedPageArray[0]);
    }, [totalPage]);

    return (
        <PaginationComponent>
            <button 
                className='first' 
                onClick={() => setPage(1)} 
                disabled={page === 1}
            />
            <button 
                className='prev' 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
            />

            <div>
                {currentPageArray?.map((i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        aria-current={page === i + 1 ? 'page' : null}
                    >
                    {i + 1}
                    </button>
                ))}
            </div>

            <button
                className='next' 
                onClick={() => setPage(page + 1)}
                disabled={page === totalPage}
            />
            <button
                className='last' 
                onClick={() => setPage(totalPage)}
                disabled={page === totalPage}
            />
        </PaginationComponent>
    );
};

export const PaginationComponent = styled.div`
    ${({ theme }) => theme.mixins.flex('center', 'center')}
    gap: 5px;
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translate(-50%, 0);

    > div {
        ${({ theme }) => theme.mixins.flex('center', 'center')}
        gap: 5px;
    }

    button {
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        width: 30px;
        height: 30px;
        border-radius: 2px;
        border: 1px solid #2A3344;
        
        &.first {
            background: url(${paging_first}) no-repeat center center;

            &:disabled {
                background: url(${paging_first_disabled}) no-repeat center center;
                background-color: transparent !important;
                cursor: default;
            }
        }
        
        &.prev {
            background: url(${paging_prev}) no-repeat center center;

            &:disabled {
                background: url(${paging_prev_disabled}) no-repeat center center;
                background-color: transparent !important;
                cursor: default;
            }
        }
        
        &.next {
            background: url(${paging_next}) no-repeat center center;

            &:disabled {
                background: url(${paging_next_disabled}) no-repeat center center;
                background-color: transparent !important;
                cursor: default;
            }
        }
        
        &.last {
            background: url(${paging_last}) no-repeat center center;

            &:disabled {
                background: url(${paging_last_disabled}) no-repeat center center;
                background-color: transparent !important;
                cursor: default;
            }
        }
    }

    [aria-current] {
        background: ${({ theme }) => theme.colors.primary} !important;
        color: ${({ theme }) => theme.colors.text.primary} !important;
    }
`;

export default Pagination;