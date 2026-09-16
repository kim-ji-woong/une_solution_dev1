import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextButton from '../components/textButton';
import IconButton from '../components/iconButton';
import Icon from '../components/Icon/Icon';

export const sliceArrayByLimit = (totalPage, limit) => {
    const totalPageArray = Array(totalPage)
        .fill()
        .map((_, i) => i);

    return Array(Math.ceil(totalPage / limit))
        .fill()
        .map(() => totalPageArray.splice(0, limit));
};

const Pagination = ({ totalPage, limit, page, setPage, bottom = "40px" }) => {

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
        <PaginationComponent $bottom={bottom}>
            <IconButton
                variant="unfill"
                size="xs"
                icon={<Icon.IconDoubleArrow direction="left" />}
                onClick={() => setPage(1)} 
                disabled={page === 1}
            >
                첫 페이지
            </IconButton>

            <IconButton
                variant="unfill"
                size="xs"
                icon={<Icon.Arrow direction="left" />}
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
            >
                이전 페이지
            </IconButton>

            <div>
                {currentPageArray?.map((i) => (
                    <TextButton
                        key={i + 1}
                        variant="unfill"
                        size='xxs'
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'selected' : null}
                    >
                        {i + 1}
                    </TextButton>
                ))}
            </div>

            <IconButton
                variant="unfill"
                size="xs"
                icon={<Icon.Arrow direction="right" />}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPage}
            >
                다음 페이지
            </IconButton>

            <IconButton
                variant="unfill"
                size="xs"
                icon={<Icon.IconDoubleArrow direction="right" />}
                onClick={() => setPage(totalPage)}
                disabled={page === totalPage}
            >
                마지막 페이지
            </IconButton>
        </PaginationComponent>
    );
};

export const PaginationComponent = styled.div`
    ${props => props.theme.mixins.flex('center', 'center')};
    gap: 5px;
    position: absolute;
    left: 50%;
    bottom: ${props => props.$bottom};
    transform: translate(-50%, 0);

    > div {
        ${props => props.theme.mixins.flex('center', 'center')};
        gap: 8px;
    }
`;

export default Pagination;