import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import IconButton from "../../../Common/components/iconButton";
import Icon from "../../../Common/components/Icon/Icon";
import navigation from "../../../Root/images/navigation.svg";
import SdmsResource from "../../resource/id";

const Toolbar3D = (props) => {
    const {
        showNavBar = false,
        handleNavBar,
        autoRotation,
        handleAutoRotation,
        onClickToolBtn,
    } = props;

    const [ready, setReady] = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const onToggleNavBar = () => {
        if (!touched) setTouched(true);
        if (typeof handleNavBar === "function") {
            handleNavBar();
        }
    };

    return (
        <Toolbar3DComponent $autoRotation={autoRotation} $disabled={props.isEditMode}>
            <button
                type="button"
                className="navigationBtn"
                onClick={onToggleNavBar}
                disabled={props.isEditMode}
            >
                <img src={navigation} alt="네비게이션 버튼" width={20} height={20} />
            </button>

            <ul
                id="navigationBtns"
                className={[
                    "item",
                    ready ? "ready" : "init",
                    touched ? "touched" : "untouched",
                    showNavBar ? "on" : "off",
                ].join(" ")}
            >
                <li>
                    <IconButton
                        variant="fill"
                        size="md"
                        icon={<Icon.HomeIcon size={"xxxs"} />}
                        onClick={() =>
                            onClickToolBtn &&
                            onClickToolBtn(SdmsResource.toolbar3DMenu.initScene)
                        }
                    >
                        초기화면 버튼
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        variant="fill"
                        size="md"
                        icon={<Icon.PlusIcon size={"xxxs"} />}
                        onClick={() =>
                            onClickToolBtn &&
                            onClickToolBtn(SdmsResource.toolbar3DMenu.zoomIn)
                        }
                    >
                        확대 버튼
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        variant="fill"
                        size="md"
                        icon={<Icon.MinusIcon size={"xxxs"} />}
                        onClick={() =>
                            onClickToolBtn &&
                            onClickToolBtn(SdmsResource.toolbar3DMenu.zoomOut)
                        }
                    >
                        축소 버튼
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        variant="fill"
                        size="md"
                        icon={<Icon.SaveHomeIcon size={"xxxs"} />}
                        onClick={() =>
                            onClickToolBtn &&
                            onClickToolBtn(SdmsResource.toolbar3DMenu.setInitScene)
                        }
                    >
                        초기화면으로 지정 버튼
                    </IconButton>
                </li>
                <li>
                    {autoRotation ? (
                        <IconButton
                            variant="fill"
                            size="md"
                            icon={<Icon.RotationOffIcon size={"xxs"} />}
                            onClick={(e) => handleAutoRotation && handleAutoRotation(e)}
                        >
                            즉시회전 OFF 버튼
                        </IconButton>
                    ) : (
                        <IconButton
                            variant="fill"
                            size="md"
                            icon={<Icon.RotationOnIcon size={"xxs"} />}
                            onClick={(e) => handleAutoRotation && handleAutoRotation(e)}
                        >
                            즉시회전 ON 버튼
                        </IconButton>
                    )}
                </li>
            </ul>
        </Toolbar3DComponent>
    );
};

/**********************************************************************/

const animation_on = keyframes`
    0%{
        opacity: 0;
        margin-top: -50px;
        visibility: hidden;
    }
    100%{
        opacity: 1;
        margin-top: 0;
        visibility: visible;
    }
`;

const animation_off = keyframes`
    0%{
        opacity: 1;
        margin-top: 0;
        visibility: visible;
    }
    100%{
        opacity: 0;
        margin-top: -50px;
        visibility: hidden;
    }
`;

const Toolbar3DComponent = styled.div`
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translate(0, -50%);
    z-index: 99;

    > button {
        width: 36px;
        height: 36px;
        border-radius: 0.5rem;
        ${({ theme }) => theme.mixins.flex('center', 'center')};

        ${({ $disabled }) =>
            $disabled &&
            css`
                cursor: not-allowed;
                pointer-events: none;
                filter: invert(47%) sepia(14%) saturate(531%) hue-rotate(176deg) brightness(51%) contrast(94%);
                
                &:hover,
                &:active {
                    background: transparent !important;
                    filter: invert(47%) sepia(14%) saturate(531%) hue-rotate(176deg) brightness(51%) contrast(94%);
                }
        `};
    }

    > button:hover {
        background: ${({ theme }) => theme.colors.primary.p600};
    }

    > button:active {
        background: ${({ theme }) => theme.colors.primary.p800};
    }

    .item {
        ${({ theme }) => theme.mixins.flex()};
        gap: 8px;
        position: absolute;
        left: 50%;
        top: 50px;
        transform: translate(-50%, 0);
    }

    /* ⛔ 초기 렌더: 완전 숨김 (애니메이션 금지) */
    .item.init {
        display: none;
    }
    .item.init li {
        opacity: 0;
        visibility: hidden;
        margin-top: -50px;
        animation: none !important;
    }

    /* ⛔ 아직 상호작용 전 + off: 완전 숨김 (첫 노출 깜빡임 방지) */
    .item.ready.untouched.off {
        display: none;
    }
    .item.ready.untouched.off li {
        opacity: 0;
        visibility: hidden;
        margin-top: -50px;
        animation: none !important;
    }

    /* ✅ 마운트 이후 + 상호작용 이후부터 애니메이션 적용 */
    .item.ready.touched.off li {
        opacity: 1;
        margin-top: 0;
        visibility: visible;
        animation: ${animation_off} 0.5s forwards;

        &:nth-child(1) { animation-delay: 0.3s; }
        &:nth-child(2) { animation-delay: 0.25s; }
        &:nth-child(3) { animation-delay: 0.2s; }
        &:nth-child(4) { animation-delay: 0.15s; }
        &:nth-child(5) { animation-delay: 0.1s; }
    }

    .item.ready.touched.on li {
        opacity: 0;
        margin-top: -50px;
        visibility: hidden;
        animation: ${animation_on} 0.5s forwards;

        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.05s; }
        &:nth-child(3) { animation-delay: 0.1s; }
        &:nth-child(4) { animation-delay: 0.15s; }
        &:nth-child(5) { animation-delay: 0.2s; }
    }

    /* 공통 li 기본값 */
    .item li {
        visibility: hidden;
        ${({ theme }) => theme.mixins.flex()};
        position: relative;
    }

    /* 툴팁 */
    .item li button::before {
        display: block;
        background: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.grayscale.g700};
        opacity: 0;
        transition: all 0.3s;
        font-size: 0.75rem;
        line-height: 170%; /* 20.4px */
        letter-spacing: -0.36px;
        position: absolute;
        left: 50%;
        top: 47%;
        transform: translate(-50%, 0%);
        margin-top: 27px;
        padding: 4px 8px;
        white-space: nowrap;
        border-radius: 8px;
        content: '';
    }

    .item li button::after {
        content: '';
        display: block;
        opacity: 0;
        transition: all 0.3s;
        position: absolute;
        left: 50%;
        bottom: -8px;
        transform: translate(-50%, 0%);
        border-bottom: 5px solid ${({ theme }) => theme.colors.white};
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
    }

    .item li button:hover::before,
    .item li button:hover::after {
        opacity: 1;
        z-index: 2;
    }

    .item li:nth-child(1) button::before { content: "홈"; }
    .item li:nth-child(2) button::before { content: "확대"; }
    .item li:nth-child(3) button::before { content: "축소"; }
    .item li:nth-child(4) button::before { content: "초기화면 지정"; }
    .item li:nth-child(5) button::before {
        content: '${(props) => (props.$autoRotation ? "즉시회전 OFF" : "즉시회전 ON")}';
    }
`;

export default Toolbar3D;