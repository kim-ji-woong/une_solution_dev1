namespace dnsData.CommonCode
{
    public enum CodeType
    {
        None = 0,
        SendType = 100100,          // 발송타입
        BroadcastStatus = 100200,   // 방송상태
        WeatherStatus = 100300,     // 날씨상태
        WindDirection = 100400,     // 풍향
        SopStatus = 200100,         // SOP 상태
        ComponentType = 200200,     // 컴포넌트 타입
        VariableType = 200300,  // 판단 변수타입
        SopRunStatus = 200400,      // SOP 실행상태
        ArrowPosition = 200500,     // 화살표 위치
        SensorStatus = 300100,      // 센서상태
        SensorLimitType = 300200,   // 센서임계치 타입
        SensorType = 300300,        // 센서타입
        DetectType = 300400,        // 탐지유형
        CCTVType = 300500,          // CCTV 타입
        SensorServerType = 300600,  // 센서서버 타입
        DetectStatus = 400100,      // 탐지상태
        ReactionType = 400200,      // 대응타입
        MoveDisplayAlarm = 400300,  // 알람시 화면이동
        NotificationType = 400400,  // 알림타입
        JobStatus = 500100,         // 직무상태
        JobLevel = 500200,          // 직급
        JobPosition = 500300,       // 직위
        Role = 500400               // 비상조직 멤버역할
        /*SensorStatus = 1,           // 센서상태
        SensorLimitType = 3,        // 센서임계치 타입
        SensorType = 4,             // 센서타입
        DetectType = 5,             // 탐지유형
        DetectStatus = 6,           // 탐지상태
        ReactionType = 7,           // 대응타입
        SendType = 8,               // 발송타입
        SopStatus = 9,              // SOP 상태
        ComponentType = 10,         // 컴포넌트 타입
        DecisionVariableType = 11,  // 판단 변수타입
        VariableType = 12,          // 변수타입
        SopRunStatus = 13,          // SOP 실행상태
        ArrowPosition = 14,         // 화살표 위치
        Role = 15,                  // 비상조직 멤버역할
        JobLevel = 16,              // 직급
        JobPosition = 17,           // 직위
        JobStatus = 18,             // 직무상태
        BroadcastStatus = 19,       // 방송상태
        MoveDisplayAlarm = 20,      // 알람시 화면이동
        CCTVType = 21,              // CCTV 타입
        SensorServerType = 22,      // 센서서버 타입
        WeatherStatus = 23,         // 날씨상태
        WindDirection = 24          // 풍향
            */
    }
}
