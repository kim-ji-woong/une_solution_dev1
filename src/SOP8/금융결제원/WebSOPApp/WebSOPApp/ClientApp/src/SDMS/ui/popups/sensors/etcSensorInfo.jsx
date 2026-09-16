import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../../../Common/components/Icon/Icon";
import IconButton from "../../../../Common/components/iconButton";

export default function ETCSensorInfo(props) {
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
        </>
    );
}