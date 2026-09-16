import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';

import $ from 'jquery';

class PopupDraggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popupMinWidth: 320, // 팝업 최소 너비
            popupMinHeight: 160, // 팝업 최소  높이
            topSize: 30,        // 타이틀바 사이즈
        }

        this.props = props;

        this.initPopupState = this.initPopupState.bind(this);

        this.initSize();
    }

    initSize() {
        if (this.props.topSize !== undefined && this.props.topSize !== null)
            this.state.topSize = this.props.topSize;
        if (this.props.popupMinWidth !== null && this.props.popupMinWidth !== undefined)
            this.state.popupMinWidth = this.props.popupMinWidth;
        if (this.props.popupMinHeight !== null && this.props.popupMinHeight !== undefined)
            this.state.popupMinHeight = this.props.popupMinHeight;
    }

    componentDidMount() {
        const top = '#' + this.props.id + ' > .' + content.popupSizingAreaTop;

        $(top).css('height', this.state.topSize + 'px');

        

        this.initPopupState();
        this.props.setActiveDragPopup(this.props.id);
    }

    componentDidUpdate(prevProps, prevState) {
        // 환경설정 > 팝업창 위치 초기화 설정 시 모든 inline style을 제거함 
        if (prevProps.popupState !== this.props.popupState && this.props.popupState === undefined) {
            const popup = document.getElementById(this.props.id);

            if (popup) {
                popup.removeAttribute("style");
            }
        }
    }

    initPopupState() {
        let popup = document.getElementById(this.props.id);

        if (!popup)
            return;

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    // 팝업 마우스 드래그 이벤트 리스너
    popupDragMouseMove = (event) => {
        let mousePosition = {
            x: event.clientX,
            y: event.clientY
        }

        //움직여야할 좌표
        let moveX = mousePosition.x + this.state.dragOffsetX;
        let perMoveX = ((moveX / this.state.maxScreenWidth) * 100);

        let moveY = mousePosition.y + this.state.dragOffsetY;
        let perMoveY = ((moveY / this.state.maxScreenHeight) * 100);

        // 팝업 너비
        let width = this.state.popup.clientWidth;
        let left = this.state.popup.offsetLeft;

        // 팝업 높이
        let height = this.state.popup.clientHeight;
        let top = this.state.popup.offsetTop;

        let popupRightPos = width + left;   // 현재 위치에서 오른쪽 끝 절대 좌표
        let popupBottomPos = height + top;  // 현재 위치에서 아래쪽 끝 절대 좌표

        // 팝업이 화면밖으로 안나가도록 처리
        if (moveX > 68 && moveX + width < this.state.maxScreenWidth) {
            this.state.popup.style.left = perMoveX + '%';
        } else if (moveX + width > this.state.maxScreenWidth) {
            // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 끝지점이 우측 화면 밖을 벗어나게 될 때
            if (popupRightPos < this.state.maxScreenWidth) {
                // 팝업을 우측 변에 고정
                let lim = ((this.state.maxScreenWidth - width) / this.state.maxScreenWidth) * 100;
                this.state.popup.style.left = lim + '%';
            } else if (this.state.preMousePosition.x > mousePosition.x) {
                // 화면 오른쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.left = perMoveX + '%';
            }
        } else if (moveX <= 68) {
            // 드래그 도중 좌측 끝지점이 68px 이하로 넘어가게 될 때
            if (left > 68) {
                // 팝업을 좌측 68px에 고정
                let lim = (68 / this.state.maxScreenWidth) * 100;
                this.state.popup.style.left = lim + '%';
            } else if (this.state.preMousePosition.x < mousePosition.x) {
                // 화면 왼쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.left = perMoveX + '%';
            }
        }

        if (moveY > 50 && moveY + height < this.state.maxScreenHeight) {
            this.state.popup.style.top = perMoveY + '%';
        } else if (moveY + height > this.state.maxScreenHeight) {
            // 드래그 도중 이동할 마우스 포지션 지점부터 팝업 하단 끝지점이 화면 밖을 벗어나게 될 때
            if (popupBottomPos < this.state.maxScreenHeight) {
                // 팝업을 아랫 변에 고정
                let lim = ((this.state.maxScreenHeight - height) / this.state.maxScreenHeight) * 100;
                this.state.popup.style.top = lim + '%';
            } else if (this.state.preMousePosition.y > mousePosition.y) {
                // 화면 아래쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.top = perMoveY + '%';
            }
        } else if (moveY <= 50) {
            // 드래그 도중 상단 끝지점이 화면 밖을 벗어나게 될 때
            if (top > 50) {
                // 팝업을 윗 변에 고정
                //상단 툴바는 항상 높이 60 고정이기 때문에 현재 화면 사이즈에서 50px의 비율을 계산한다.
                let lim = (50 / this.state.maxScreenHeight) * 100;
                this.state.popup.style.top = lim + '%';
            } else if (this.state.preMousePosition.y < mousePosition.y) {
                //화면 위쪽으로 팝업이 이미 벗어나 있을 때
                this.state.popup.style.top = perMoveY + '%';
            }
        }

        // 부모에게 이벤트 전달
        if (this.props.popupDragMouseMove !== null && this.props.popupDragMouseMove !== undefined) {
            this.props.popupDragMouseMove(event);
        }
    }

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeX = 0;
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수평

            case 'd-rb': // 오른쪽 하단 대각
                sizeX = event.pageX - this.state.popup.getBoundingClientRect().left;
                sizeY = event.pageY - this.state.popup.getBoundingClientRect().top;

                if (event.pageX > 0 && event.pageX < this.state.maxScreenWidth && sizeX > this.state.popupMinWidth) {
                    this.state.popup.style.width = sizeX + 'px';
                }

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    this.state.popup.style.height = sizeY + 'px';
                }
                break;
            default:
        }

        // 부모에게 이벤트 전달
        if (this.props.popupResizeMouseMove !== null && this.props.popupResizeMouseMove !== undefined) {
            this.props.popupResizeMouseMove(event);
        }
    }

    // 팝업 리사이징(누르고 있을 때)
    popupResizeMousePress(event, resizeType) {
        /* resizeType
         * d-rb     우측 하단 대각
        */

        const element = document.getElementById(this.props.id);

        if (!element)
            return;

        const rect = this.state.popup.getBoundingClientRect();

        console.log('popupResizeMousePress');
        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: element.clientWidth,
            originalHeight: element.clientHeight,
            originalX: rect.left,
            originalY: rect.top
        });

        document.addEventListener('mousemove', this.popupResizeMouseMove);
        document.addEventListener('mouseup', this.popupResizeMouseUp);

        // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
        this.props.setActiveDragPopup(this.props.id);

        // 부모에게 이벤트 전달
        if (this.props.popupResizeMousePress !== null && this.props.popupResizeMousePress !== undefined) {
            this.props.popupResizeMousePress(event, resizeType);
        }
    }

    popupResizeMouseUp = (event) => {
        console.log('popup resize false');
        document.removeEventListener('mousemove', this.popupResizeMouseMove);
        document.removeEventListener('mouseup', this.popupResizeMouseUp);
        this.setState({ resizeType: null });
        this.setPopupState();

        // 부모에게 이벤트 전달
        if (this.props.popupResizeMouseUp !== null && this.props.popupResizeMouseUp !== undefined) {
            this.props.popupResizeMouseUp(event);
        }
    }

    // 팝업 드래그 시작(팝업을 누르고 있을 때)
    popupDragMousePress(event) {
        if (event.button === 0) {
            if (this.state.popup) {
                //마우스 조작중에 브라우저의 크기를 조절할 수 없으므로
                // 이 시점에 도큐먼트 전체 크기를 호출한다.
                this.setState({
                    maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
                    maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
                    dragOffsetX: this.state.popup.offsetLeft - event.clientX,
                    dragOffsetY: this.state.popup.offsetTop - event.clientY,
                    preMousePosition: {
                        x: event.clientX,
                        y: event.clientY
                    }
                });

                document.addEventListener('mousemove', this.popupDragMouseMove);
                document.addEventListener('mouseup', this.popupDragMouseUp);

                // z-index 조정, 1 이 다른 팝업보다 앞에 배치됨
                this.props.setActiveDragPopup(this.props.id);
            }
        }

        // 부모에게 이벤트 전달
        if (this.props.popupDragMousePress !== null && this.props.popupDragMousePress !== undefined) {
            this.props.popupDragMousePress(event);
        }
    }

    // 팝업 드래그 종료(mouse up)
    popupDragMouseUp = (event) => {
        console.log('popup drag false')
        document.removeEventListener('mousemove', this.popupDragMouseMove);
        document.removeEventListener('mouseup', this.popupDragMouseUp);
        // 팝업 정보 DB 작성
        this.setPopupState();

        // 부모에게 이벤트 전달
        if (this.props.popupDragMouseUp !== null && this.props.popupDragMouseUp !== undefined) {
            this.props.popupDragMouseUp(event);
        }
    }

    setPopupState() {
        // 팝업 정보 DB 작성
        let perX = ((this.state.popup.offsetLeft / this.state.maxScreenWidth) * 100);
        let perY = ((this.state.popup.offsetTop) / this.state.maxScreenHeight * 100);
        let width = this.state.popup.offsetWidth;
        let height = this.state.popup.offsetHeight;

        //팝업 비활성화 될 때 컴포넌트가 사라져 계산식이 0으로 되는 현상이 발생함. 이때 DB 등록되는것을 방지
        if (perX > 0 && perY > 0 && width > 0 && height > 0) {
            let popupState = {
                x: perX + '%',
                y: perY + '%',
                height: height + 'px',
                width: width + 'px'
            }
            this.props.setPopupState(this.props.id, popupState);
        }
    }

    

    render() {
        let popupSizingAreaUI = null;

        if (this.props.usePopupResize === false) {
            // 사이즈 변경을 하지 않을 경우
            popupSizingAreaUI = <React.Fragment>
                                    <div className={content.popupUnSizingAreaRight} ></div>
                                    <div className={content.popupUnSizingAreaLeft} ></div>
                                    <div className={content.popupUnSizingAreaBottom} ></div>
                                    <div className={content.popupUnSizingAreaRightTopPoint} ></div>
                                    <div className={content.popupUnSizingAreaRightBottomPoint} ></div>
                                    <div className={content.popupUnSizingAreaLeftTopPoint} ></div>
                                    <div className={content.popupUnSizingAreaLeftBottomPoint} ></div>
                                </React.Fragment>;

        } else {
            popupSizingAreaUI = <React.Fragment>
                                    <div className={content.popupUnSizingAreaRight} ></div>
                                    <div className={content.popupUnSizingAreaLeft} ></div>
                                    <div className={content.popupUnSizingAreaBottom} ></div>
                                    <div className={content.popupUnSizingAreaRightTopPoint} ></div>
                                    <div className={content.popupSizingAreaRightBottomPoint} onMouseDown={(e) => this.popupResizeMousePress(e, 'd-rb')}></div>
                                    <div className={content.popupUnSizingAreaLeftTopPoint} ></div>
                                    <div className={content.popupUnSizingAreaLeftBottomPoint} ></div>
                                </React.Fragment>;
        }
            
        return (
            <React.Fragment>
                <div className={content.popupSizingAreaTop} onMouseDown={(e) => this.popupDragMousePress(e)}></div>

                {popupSizingAreaUI}

                {this.props.children}

            </React.Fragment>
        );
    }
    
}

export default PopupDraggable;