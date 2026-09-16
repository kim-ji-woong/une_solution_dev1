namespace SOPWebServer.IBLL.Models.Request
{
    public class Header
    {
        // 탐지신호
        public const int SENSOR_DATA = 100;
        // 탐지신호(테스트)
        public const int SENSOR_DATA_TEST = 101;
        // 오동작처리
        public const int SENSOR_MALFUNCTION = 102;
        // 신호복구
        public const int SENSOR_USER_RESET = 103;
        // 재난신고
        public const int MANUAL_REPORT = 104;
        // 재난신고 해제
        public const int CLEAR_MANUAL_REPORT = 105;
        // 모든 신호 해제
        public const int CLEAR_DETECT_ALL = 109;
        // 하루 경과한 알람 복구
        public const int TIMEOUT = 110;

        // 수동신고를 위한 Zone ID
        // ex) ManualReportDefaultID + CommonCode.SdmsSensor.SensorType
        //     화재 : ManualReportDefaultID + CommonCode.SdmsSensor.SensorType.Fire = 1000000
        //     누출 : ManualReportDefaultID + CommonCode.SdmsSensor.SensorType.PSM  = 1000011
        public const int ManualReportDefaultID = 1000000;
    }
}
