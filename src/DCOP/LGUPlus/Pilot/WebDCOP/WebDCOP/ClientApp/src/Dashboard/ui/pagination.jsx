import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import page_last_on from '../images/page_last_on.png';
import page_next_on from '../images/page_next_on.png';
import page_prev_on from '../images/page_prev_on.png';
import page_first_on from '../images/page_first_on.png';
import page_last_off from '../images/page_last_off.png';
import page_next_off from '../images/page_next_off.png';
import page_prev_off from '../images/page_prev_off.png';
import page_first_off from '../images/page_first_off.png';

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
    ${props => props.theme.flex('center', 'center')};
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);

    button {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        padding: 10px;
        
        &.first {
            background: url(${page_first_on}) no-repeat center center;

            &:disabled {
                background: url(${page_first_off}) no-repeat center center;
                background-color: transparent !important;
            }
        }
        
        &.prev {
            background: url(${page_prev_on}) no-repeat center center;

            &:disabled {
                background: url(${page_prev_off}) no-repeat center center;
                background-color: transparent !important;
            }
        }
        
        &.next {
            background: url(${page_next_on}) no-repeat center center;

            &:disabled {
                background: url(${page_next_off}) no-repeat center center;
                background-color: transparent !important;
            }
        }
        
        &.last {
            background: url(${page_last_on}) no-repeat center center;

            &:disabled {
                background: url(${page_last_off}) no-repeat center center;
                background-color: transparent !important;
            }
        }
    }

    [aria-current] {
        color: #4BE5DD !important;
    }
`;

export default Pagination;