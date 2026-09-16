import { useState } from "react";
import TabMenu from "../../../../Common/components/tabMenu";
import IconButton from "../../../../Common/components/iconButton";
import Icon from "../../../../Common/components/Icon/Icon";

export default function MobileScannerInfo({ sensorDetailInfo }) {
    const [menuType, setMenuType] = useState("authorized");
    const [index, setIndex] = useState(0);

    const scannerCurrentTagInfos =
        sensorDetailInfo?.datas?.scannerCurrentTagInfos ?? [];

    // 인가자 / 비인가자 분리
    const authorizedData = scannerCurrentTagInfos.filter(
        (item) => item.prmisn_yn === true
    );
    const unauthorizedData = scannerCurrentTagInfos.filter(
        (item) => item.prmisn_yn === false
    );

    const tabs = [
        { key: "authorized", label: "인가자", count: authorizedData.length },
        { key: "unauthorized", label: "비인가자", count: unauthorizedData.length },
    ];

    const onChangeMenuType = (menu) => {
        setMenuType(menu);
        setIndex(0); // 탭 변경 시 index 초기화
    };

    const goPrev = () => setIndex((prev) => Math.max(prev - 1, 0));

    const goNext = () => {
        const dataLength =
            menuType === "authorized"
                ? authorizedData.length
                : unauthorizedData.length;

        setIndex((prev) => Math.min(prev + 1, dataLength - 1));
    };

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size="xs" fill={"grayscale.g500"} />
            <p>현재 태그된 작업자가 없어요</p>
        </div>
    );

    const formatBirth = (birth) => {
        if (!birth || birth.length !== 8) return birth;
        const y = birth.substring(0, 4);
        const m = birth.substring(4, 6);
        const d = birth.substring(6, 8);
        return `${y}.${m}.${d}`;
    };

    const renderInfo = () => {
        const currentData =
            menuType === "authorized"
                ? authorizedData[index]
                : unauthorizedData[index];

        // 데이터가 하나도 없으면 NoData UI 출력
        if (!currentData) return getNodataUI();

        return (
            <ul>
                <li>
                    <span>이름</span>
                    <span>{currentData.tag_user_name}</span>
                </li>
                <li>
                    <span>생년월일</span>
                    <span>{formatBirth(currentData.tag_user_brthdy)}</span>
                </li>
                <li>
                    <span>휴대전화</span>
                    <span>{currentData.tag_user_telno}</span>
                </li>
                <li>
                    <span>방문목적</span>
                    <span>{currentData.purps}</span>
                </li>
                <li>
                    <span>담당관리자</span>
                    <span>{currentData.charger_name}</span>
                </li>
            </ul>
        );
    };

    const dataLength =
        menuType === "authorized"
            ? authorizedData.length
            : unauthorizedData.length;

    return (
        <>
            <TabMenu
                tabs={tabs}
                activeKey={menuType}
                onChange={onChangeMenuType}
                className="menuTypeWrap"
            />

            <div className="infoWrap">{renderInfo()}</div>

            {dataLength > 0 && (
                <div className="btnWrap">
                    <IconButton
                        type="button"
                        variant="unfill_white"
                        size="xs"
                        icon={<Icon.Arrow direction="left" />}
                        aria-label="이전"
                        onClick={goPrev}
                        disabled={index <= 0}
                        shape="circle"
                    >
                        이전
                    </IconButton>
                    <IconButton
                        type="button"
                        variant="unfill_white"
                        size="xs"
                        icon={<Icon.Arrow direction="right" />}
                        aria-label="다음"
                        onClick={goNext}
                        disabled={index >= dataLength - 1}
                        shape="circle"
                    >
                        다음
                    </IconButton>
                </div>
            )}
        </>
    );
}