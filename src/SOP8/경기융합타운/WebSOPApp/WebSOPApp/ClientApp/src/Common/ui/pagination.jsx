import React from 'react';

const Pagination = (props) => {

    // 페이지 index 만들기
	const getPageIndexUI = () => {
		let ui = [];
		if (!props.dataSource) {
			return ui;
		}

		if (props.IsKnowPageIndex) {
			for (let i = props.minPageIndex; i <= props.maxPageIndex; i++) {
				if (i === props.pageIndex) {
					ui.push(<li key={'pageIndex_' + (i)} className={'on'}><a>{i}</a></li>);
				}
				else {
					ui.push(<li key={'pageIndex_' + (i)}><a onClick={() => props.handlePageIndex(i)}>{i}</a></li>);
				}
			}
		}
		else {
			ui.push(<li key={'pageIndex_'} className={'on'}><a>...</a></li>);
        }

		return ui;
	}

    return (
        <div className={'hscNav'}>
        {
            (props.havePrevPage) ?
                <>
                    <a className={'first'} onClick={() => props.onClickPrevSearch(true)}>맨 앞</a>
                    <a className={'prev'} onClick={() => props.onClickPrevSearch(false)}>이전</a>
                </>
                :
                <>
                    <a className={'firstDisable'}>맨 앞</a>
                    <a className={'prevDisable'}>이전</a>
                </>
        }
        <ul>
            {getPageIndexUI()}
        </ul>
        {
            (props.haveAfterPage) ?
                <>
                    <a className={'next'} onClick={() => props.onClickAfterSearch(false)}>다음</a>
                    <a className={'last'} onClick={() => props.onClickAfterSearch(true)}>맨 뒤</a>
                </>
                :
                <>
                    <a className={'nextDisable'}>다음</a>
                    <a className={'lastDisable'}>맨 뒤</a>
                </>
        }
        </div>
    );
};

export default Pagination;