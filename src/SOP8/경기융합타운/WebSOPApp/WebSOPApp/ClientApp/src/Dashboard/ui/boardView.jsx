import React from 'react';
import { BoardViewComponent } from '../styled/dashboardStyled';

const BoardView = () => {
    return (
        <BoardViewComponent className='board-view-area'>
            <section>
                <div className="campusS on">
                    <div className={"campus-img" + " campus-a"} />
                    <p className='title'>도본청·도의회</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="campusS">
                    <div className={"campus-img" + " campus-b"} />
                    <p className='title'>대표도서관</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="campusS">
                    <div className={"campus-img" + " campus-c"} />
                    <p className='title'>신용보증재단</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="campusS">
                    <div className={"campus-img" + " campus-e"} />
                    <p className='title'>교육청</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="campusS">
                    <div className={"campus-img" + " campus-d"} />
                    <p className='title'>복합시설관</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="campusS">
                    <div className={"campus-img" + " campus-f"} />
                    <p className='title'>주택도시공사 신사옥</p>
                    <div className='board-data-wrap'>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>화재</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>119</span>
                                <span>119</span>
                                <span>119</span>
                            </div>
                        </div>
                        <div className={"board-data"}>
                            <div className='board-data-title'>
                                <p>CCTV</p>
                            </div>
                            <div className='board-data-detail'>
                                <span>0</span>
                                <span>0</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </BoardViewComponent>
    );
};

export default BoardView;