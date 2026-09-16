import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../../../Common/components/Icon/Icon";
import IconButton from "../../../../Common/components/iconButton";
import Button from "../../../../Common/components/button";
import ProjectResource from "../../../../Root/resource/id";
import SdmsResource from "../../../resource/id";

// 누출 확산 시뮬레이션 모드로 이동 가능한 공장동 목록
const ALLOWED_BUILDING_CODES = ["T5-1", "T6-2", "T6-3", "T10-1"];

export default function PSMSensorInfo(props) {
    const [open, setOpen] = useState(false);
    const helpWrapRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!helpWrapRef.current) return;
            if (!helpWrapRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const getAlarmDepth = (depth) => {
        switch (depth) {
            case 0:
                return <Icon.riskNormal />;
            case 1:
                return <Icon.risk1st />;
            case 2:
                return <Icon.risk2nd />;
            case 3:
                return <Icon.risk3rd />;
            case 4:
                return <Icon.risk4th />;
            default:
                return <Icon.riskNormal />;
        }
    };

    const shouldShowLeakSimBtn = useMemo(() => {
        const zoneSn = props?.sensorDetailInfo?.sensor?.zone_sn;
        const buildingsObj = props?.spatialManager?.buildings;

        if (!zoneSn || !buildingsObj) return false;

        const buildings = Object.values(buildingsObj);

        // zone_sn을 포함하는 빌딩 찾기
        const hostBuilding = buildings.find(
            (b) =>
                Array.isArray(b?.zoneDatas) &&
                b.zoneDatas.some((z) => z?.zoneNo === zoneSn)
        );

        if (!hostBuilding?.buildingCode) return false;

        // 허용된 빌딩 코드인지 확인
        return ALLOWED_BUILDING_CODES.includes(hostBuilding.buildingCode);
    }, [props?.sensorDetailInfo?.sensor?.zone_sn, props?.spatialManager?.buildings]);

    const handleMoveSimulation = (index) => {
        if (index > 0) {
            props.handleControlMode(SdmsResource.controlMode.simulation, true);
        }
    };

    return (
        <>
            <ul className="head">
                <li>
                    <div>항목</div>
                    <div>수치</div>
                    <div className="risk">
                        위험도
                        <div ref={helpWrapRef}>
                            <IconButton
                                className={`closeBtn ${open && `selected`}`}
                                variant="unfill"
                                size="xxs"
                                aria-haspopup="dialog"
                                aria-expanded={open}
                                aria-controls="riskTooltip"
                                onClick={() => setOpen((v) => !v)}
                                icon={<Icon.InfoCircleIcon size={"xxs"} />}
                            >
                                위험도 단계 도움말 보기
                            </IconButton>
                            {open && (
                                <div
                                    id="riskTooltip"
                                    role="dialog"
                                    aria-label="위험도 단계 도움말"
                                    className="riskTooltip"
                                >
                                    <p>위험도 단계</p>
                                    <ul>
                                        <li><Icon.riskNormal />정상</li>
                                        <li><Icon.risk1st />관심</li>
                                        <li><Icon.risk2nd />주의</li>
                                        <li><Icon.risk3rd />경계</li>
                                        <li><Icon.risk4th />심각</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </li>
            </ul>

            <ul className="body">
                {props.sensorDetailInfo?.datas?.length > 0 &&
                    props.sensorDetailInfo.datas.map((data, idx) => (
                        <li key={idx}>
                            <div>{data.propertyName}</div>
                            <div>{data.propertyValue}</div>
                            <div className="chart">{getAlarmDepth(data.alarmDepth)}</div>
                        </li>
                    ))}
            </ul>

            {/* 누출 확산 시뮬레이션 대상 구역 누출 센서 클릭시에만 표출 */}
            {/* (대상지 : T5-1, T6-2, T6-3, T10-1) */}
            {shouldShowLeakSimBtn && (
                <div className="moveBtn">
                    <Button
                        variant="unfill_light"
                        size="xxs"
                        rightIcon={<Icon.Arrow size={"xxs"} direction={"right"} />}
                        onClick={() => props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['누출 확산 시뮬레이션 화면으로 이동하시겠습니까?'], ['취소', '이동하기'], handleMoveSimulation)}
                    >
                        누출 확산 시뮬레이션 바로가기
                    </Button>
                </div>
            )}
        </>
    );
}