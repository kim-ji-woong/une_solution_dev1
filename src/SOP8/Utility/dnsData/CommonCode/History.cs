namespace dnsData.CommonCode
{
    public class History
    {
        public class DetectStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.DetectStatus; }
            }

            public const int None = -1;
            public const int Real = (int)CodeType.DetectStatus + 1;          // 실제신호
            public const int Malfunction = (int)CodeType.DetectStatus + 2;   // 오동작
            public const int Test = (int)CodeType.DetectStatus + 3;          // 테스트

            public DetectStatus()
            {
                m_collections.Add(Real);
                m_collections.Add(Malfunction);
                m_collections.Add(Test);
            }
        }

        public class ReactionType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.ReactionType; }
            }

            public const int None = -1;
            public const int BeginStatus = (int)CodeType.ReactionType + 0;       // 상황시작
            public const int AlarmSignal = (int)CodeType.ReactionType + 1;       // 알람신호
            public const int ClearSignal = (int)CodeType.ReactionType + 2;       // 복구신호
            public const int RunBroadcast = (int)CodeType.ReactionType + 10;     // 방송 실시
            public const int SendSMS = (int)CodeType.ReactionType + 11;          // 문자메시지 발송
            public const int Malfunction = (int)CodeType.ReactionType + 21;      // 오작동 처리
            public const int NotifySignal = (int)CodeType.ReactionType + 22;     // 재난신고
            public const int IgnoreSignal = (int)CodeType.ReactionType + 23;     // 재난탐지신호 무시
            public const int EndStatus = (int)CodeType.ReactionType + 50;        // 상황종료
            public const int ChangeAlarmDepth = (int)CodeType.ReactionType + 62; // 알람 단계 변경
            public const int UserReset = (int)CodeType.ReactionType + 64;        // 사용자 복구
            public const int TimeOut = (int)CodeType.ReactionType + 99;          // 시간초과(알람시간)

            public ReactionType()
            {
                m_collections.Add(BeginStatus);
                m_collections.Add(AlarmSignal);
                m_collections.Add(ClearSignal);
                m_collections.Add(RunBroadcast);
                m_collections.Add(SendSMS);
                m_collections.Add(Malfunction);
                m_collections.Add(NotifySignal);
                m_collections.Add(IgnoreSignal);
                m_collections.Add(EndStatus);
                m_collections.Add(ChangeAlarmDepth);
                m_collections.Add(UserReset);
                m_collections.Add(TimeOut);
            }
        }

        // 문자메시지 또는 이메일의 전송 타입
        public class SendType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SendType; }
            }

            public const int None = -1;
            public const int Manual = (int)CodeType.SendType + 0;       // 수동 전송
            public const int AutoFromAlarm = (int)CodeType.SendType + 1;// 알람에 의한 자동 전송(SDMS)
            public const int SOP = (int)CodeType.SendType + 2;          // SOP 실행중 전송

            public SendType()
            {
                m_collections.Add(Manual);
                m_collections.Add(AutoFromAlarm);
                m_collections.Add(SOP);
            }
        }

        public class SopStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SopStatus; }
            }

            public const int None = -1;
            public const int Ready = (int)CodeType.SopStatus + 0;     // SOP 시작하기 전
            public const int RequestSOP = (int)CodeType.SopStatus + 1;// SOP 실행요청
            public const int RunningSOP = (int)CodeType.SopStatus + 2;// SOP 실행중
            public const int FinishSOP = (int)CodeType.SopStatus + 3; // SOP 종료

            public SopStatus()
            {
                m_collections.Add(Ready);
                m_collections.Add(RequestSOP);
                m_collections.Add(RunningSOP);
                m_collections.Add(FinishSOP);
            }
        }
    }
}
