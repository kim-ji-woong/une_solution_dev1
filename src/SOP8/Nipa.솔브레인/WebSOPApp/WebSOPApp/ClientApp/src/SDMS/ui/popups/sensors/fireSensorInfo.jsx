export default function FireSensorInfo(props) {
    return (
        <ul>
            {
                props.sensorDetailInfo.datas?.length > 0 &&
                    props.sensorDetailInfo.datas.map((data, index) => (
                        <li key={`${data.propertyName ?? 'property'}_${data.propertyValue ?? 'value'}_${index}`}>
                            <span>{data.propertyName}</span>
                            <span>{data.propertyValue}</span>
                        </li>
                    ))
            }
        </ul>
    );
}
