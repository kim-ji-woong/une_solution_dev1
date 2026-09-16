export default function FireSensorInfo(props) {
    return (
        <ul>
            {
                props.sensorDetailInfo.datas?.length > 0 &&
                    props.sensorDetailInfo.datas.map((data) => (
                        <li>
                            <span>{data.propertyName}</span>
                            <span>{data.propertyValue}</span>
                        </li>
                    ))
            }
        </ul>
    );
}
