namespace SOPWebServer.BLL
{
    class ErrorMessage
    {
        public const int SUCCESS = 0;
        public const int SERVICE_IS_CLOSED = 1;
        public const int NULL_CLIENT_CONTEXT = 2;
        public const int UNKNOWN_CLIENT = 3;
        public const int UNKNOWN_HEADER = 4;
        public const int INVALID_MESSAGE = 5;
        public const int UNKNOWN_SENSOR_ID = 6;
        public const int DB_EXCEPTION = 7;
        public const int CAN_NOT_SEND_SMS = 8;
        public const int NO_SENSORZONE_HISTORY_ALARM = 9;
        public const int ALREADY_PROCESSED = 10;
        public const int INVALID_ID_OR_PASSWORD = 11;
        public const int ALREADY_USING_ID = 12;
        public const int UNKNOWN_CONFIG = 13;
        public const int NO_PERMISSION = 14;
        public const int NO_OTHER_CLIENTS = 15;
        public const int UNKNOWN_COMMAND = 16;
        public const int NO_SUCH_ALARM = 17;
        public const int NO_ACTIVATE_SENSOR = 18;
        public const int FAIL_BEGIN_TRANSACTION = 19;
        public const int NO_ALARM_STATUS = 20;
        public const int NO_MANUAL_REPORT_SENSOR = 21;
        public const int UNKNOWN_ZONE_ID = 22;
        public const int UNKNOWN_SENSOR_TYPE_ID = 23;
        public const int UNKNOWN_SENSOR_SUBTYPE_ID = 24;
        public const int UNKNOWN_SENSORZONE_HISTORY_ID = 25;
        public const int FAIL_COMMIT_TRANSACTION = 26;

        public static string ToMessage(int nErrorType)
        {
            switch (nErrorType)
            {
                case SUCCESS:
                    return "성공";

                case SERVICE_IS_CLOSED:
                    return "서비스가 종료되었습니다.";

                case NULL_CLIENT_CONTEXT:
                    return "Null Client Context";

                case UNKNOWN_CLIENT:
                    return "알려지지 않은 클라이언트 타입입니다.";

                case UNKNOWN_HEADER:
                    return "알려지지 않은 메시지 헤더입니다.";

                case INVALID_MESSAGE:
                    return "형식에 맞지않는 메시지입니다.";

                case UNKNOWN_SENSOR_ID:
                    return "알수없는 센서 번호 입니다.";

                case DB_EXCEPTION:
                    return "Database 예외가 발생하였습니다.";

                case CAN_NOT_SEND_SMS:
                    return "문자메시지를 발송할 수 없습니다.";

                case NO_SENSORZONE_HISTORY_ALARM:
                    return "SensorZoneHistory ID에 해당하는 알람이 존재하지 않습니다.";

                case ALREADY_PROCESSED:
                    return "이미 처리되었습니다.";

                case INVALID_ID_OR_PASSWORD:
                    return "잘못된 아이디 혹은 비밀번호입니다.";

                case ALREADY_USING_ID:
                    return "이미 사용중인 ID입니다.";

                case UNKNOWN_CONFIG:
                    return "알수없는 설정값입니다.";

                case NO_PERMISSION:
                    return "권한이 없습니다.";

                case NO_OTHER_CLIENTS:
                    return "다른 클라이언트가 존재하지 않습니다.";

                case UNKNOWN_COMMAND:
                    return "알려지지 않은 command 입니다.";

                case NO_ACTIVATE_SENSOR:
                    return "활성화되지 않은 센서입니다.";

                case FAIL_BEGIN_TRANSACTION:
                    return "트랜잭션을 시작할 수 없습니다.";

                case FAIL_COMMIT_TRANSACTION:
                    return "트랜잭션을 종료할 수 없습니다.";

                case NO_ALARM_STATUS:
                    return "알람 상태가 아닙니다.";

                case NO_MANUAL_REPORT_SENSOR:
                    return "시스템 데이터베이스에 수동신고를 위한 SensorData가 존재하지 않습니다.";

                case UNKNOWN_ZONE_ID:
                    return "알수없는 Zone 번호입니다.";

                case UNKNOWN_SENSOR_TYPE_ID:
                    return "알수없는 SensorType 입니다.";

                case UNKNOWN_SENSOR_SUBTYPE_ID:
                    return "알수없는 SensorSubType 입니다.";

                case UNKNOWN_SENSORZONE_HISTORY_ID:
                    return "알수없는 알람 번호입니다.";
            }

            return "";
        }
    }
}
