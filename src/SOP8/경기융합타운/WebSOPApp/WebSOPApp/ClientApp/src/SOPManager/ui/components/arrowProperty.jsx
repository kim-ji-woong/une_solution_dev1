import React, { useEffect, useRef, useState } from 'react';
import { ArrowPropertyComponent } from '../../../SOPManager/styled/componentsStyled';

function ArrowProperty(props) {
    const [arrowData, setArrowData] = useState(null);
    const [prevProps, setPrevProps] = useState(props);

    const refText = useRef();
    const canceled = useRef(false);

    useEffect(() => {
        if (props.arrowData) {
            setArrowData(props.arrowData.clone());
        }
    }, [])

    useEffect(() => {
        return () => {
            // 창이 닫히게 될 경우 편집한 내용을 저장한다.
            if (!canceled.current) {
                saveData(true);
            }
        };
    }, []);

    useEffect(() => {
        if (props.arrowData !== prevProps.arrowData && arrowData) {
            // 다른 Process를 선택하여 창이 바뀌게 될 경우 편집한 내용을 저장한다.
            saveData(true);
        }

        let arrowData = null;

        if (props.arrowData) {
            arrowData = props.arrowData.clone();
        }

        setPrevProps(props);

        refText.current.value = refText.current.text = arrowData.text;
    })

    const onChangeText = (event) => {
    }

    const onClickApply = (ok) => {
        if (ok) {
            saveData(true);
            // 확인 버튼을 누르면 강제로 초기화 시키도록 한다.
            props.onClickCancel();
        }
        else {
            setArrowData(null);

            canceled.current = true;
            props.onClickCancel();
        }
    }

    const saveData = (shouldUpdate) => {
        const newArrowData = { ...arrowData };
        newArrowData.text = refText.current.value;
        props.onApplyComponentProperty(newArrowData, props.actionStep, shouldUpdate);
    }

    return (
        <ArrowPropertyComponent>
            <div className={'sprCont'}>
                <div className={'sprmExp'}>
                    <div className={'arrowBox'}>
                        <h4>화살표 작성</h4>
                        {/* <div className={"scroll-wrapper " + ArrowProperty.cssStyles.sprmExTxt + " scrollbar-outer scroll-textarea"} id="pos_relative">
                            <div className="scroll-content" id="annotation_scrollContent"> */}
                        <div className={'scrollWrapperArrow'}>
                            <span className={'scrollContentArrow'}>
                                <textarea ref={refText} name="" id="" cols="30" rows="10" className={'sprmExTxt' + " " + 'scrollbarOuter'} defaultValue={arrowData?.text} onChange={onChangeText}></textarea>
                            </span>
                        {/* </div> */}
                        {/* </div> */}
                        </div>
                    </div>
                </div>
                <div className={'sprBot'}>
                    <a onClick={() => onClickApply(false)}>취소</a>
                    <a onClick={() => onClickApply(true)}>확인</a>
                </div>
            </div>
        </ArrowPropertyComponent>
    );
}

export default ArrowProperty;