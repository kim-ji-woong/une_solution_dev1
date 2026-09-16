namespace dnsData.CommonCode
{
    public class SdmsSensor
    {
        public class SensorStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SensorStatus; }
            }

            public const int None = -1;
            public const int Normal = (int)CodeType.SensorStatus + 0;    // 정상
            public const int Interest = (int)CodeType.SensorStatus + 1;  // 관심
            public const int Caution = (int)CodeType.SensorStatus + 2;   // 주의
            public const int Boundary = (int)CodeType.SensorStatus + 3;  // 경계
            public const int Serious = (int)CodeType.SensorStatus + 4;   // 심각

            public SensorStatus()
            {
                m_collections.Add(Normal);
                m_collections.Add(Interest);
                m_collections.Add(Caution);
                m_collections.Add(Boundary);
                m_collections.Add(Serious);
            }
        }

        public class SensorLimitType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SensorLimitType; }
            }

            public const int None = -1;
            public const int Normal = (int)CodeType.SensorLimitType + 1;        // 일반형
            public const int OnOff = (int)CodeType.SensorLimitType + 2;         // OnOff형
            public const int Distribution = (int)CodeType.SensorLimitType + 3;  // 분포형
            public const int Range = (int)CodeType.SensorLimitType + 4;         // 범위형

            public SensorLimitType()
            {
                m_collections.Add(Normal);
                m_collections.Add(OnOff);
                m_collections.Add(Distribution);
                m_collections.Add(Range);
            }
        }

        public class SensorType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SensorType; }
            }

            public const int None = -1;
            public const int Fire = (int)CodeType.SensorType + 0;          // 화재
            public const int CCTV = (int)CodeType.SensorType + 3;          // CCTV
            public const int PSM = (int)CodeType.SensorType + 11;          // 누출
            public const int Earthquake = (int)CodeType.SensorType + 12;   // 지진
            public const int Security = (int)CodeType.SensorType + 13;     // 방범(보안)
            public const int Etc = (int)CodeType.SensorType + 21;          // 기타

            public SensorType()
            {
                m_collections.Add(Fire);
                m_collections.Add(CCTV);
                m_collections.Add(PSM);
                m_collections.Add(Earthquake);
                m_collections.Add(Security);
                m_collections.Add(Etc);
            }
        }

        public class DetectType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.DetectType; }
            }

            public const int None = -1;
            public const int Detect = (int)CodeType.DetectType + 0;    // 신호탐지
            public const int Report = (int)CodeType.DetectType + 1;    // 재난신고
            public const int Clear = (int)CodeType.DetectType + 2;     // 복구신호

            public DetectType()
            {
                m_collections.Add(Detect);
                m_collections.Add(Report);
                m_collections.Add(Clear);
            }
        }

        // 알람시 화면이동
        public class MoveDisplayAlarm : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.MoveDisplayAlarm; }
            }

            public const int None = -1;
            public const int Stay = (int)CodeType.MoveDisplayAlarm + 0;          // 현재 화면 유지
            public const int MoveToCurrent = (int)CodeType.MoveDisplayAlarm + 1; // 현재 알람화면으로 이동
            public const int MoveToFirst = (int)CodeType.MoveDisplayAlarm + 2;   // 첫번째 알람화면으로 이동
            public const int MoveToLast = (int)CodeType.MoveDisplayAlarm + 3;    // 마지막 알람화면으로 이동

            public MoveDisplayAlarm()
            {
                m_collections.Add(Stay);
                m_collections.Add(MoveToCurrent);
                m_collections.Add(MoveToFirst);
                m_collections.Add(MoveToLast);
            }
        }

        public class CCTVType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.CCTVType; }
            }

            public const int None = -1;
            public const int Normal = (int)CodeType.CCTVType + 0;    // 일반 카메라
            public const int Thermal = (int)CodeType.CCTVType + 1;   // 열화상 카메라

            public CCTVType()
            {
                m_collections.Add(Normal);
                m_collections.Add(Thermal);
            }
        }

        public class NotificationType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.NotificationType; }
            }

            public const int None = -1;
            public const int SMS = (int)CodeType.NotificationType + 0;  // 문자메시지
            public const int Email = (int)CodeType.NotificationType + 1;// 이메일

            public NotificationType()
            {
                m_collections.Add(SMS);
                m_collections.Add(Email);
            }
        }

        public class ServerType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SensorServerType; }
            }

            public const int None = (int)CodeType.SensorServerType + 0;
            public const int Fire_Johnson = (int)CodeType.SensorServerType + 1;     // 화재-동방
            public const int Fire_Siemens = (int)CodeType.SensorServerType + 2;     // 화재-지멘스
            public const int CCTV_S1_SVMS = (int)CodeType.SensorServerType + 3;     // CCTV-S1_SVMS
            public const int Soulbrain_Hancom = (int)CodeType.SensorServerType + 4; // 솔브레인 한컴
            public const int Soulbrain_HR = (int)CodeType.SensorServerType + 5; // 솔브레인 HR

            public ServerType()
            {
                m_collections.Add(Fire_Johnson);
                m_collections.Add(Fire_Siemens);
                m_collections.Add(CCTV_S1_SVMS);
                m_collections.Add(Soulbrain_Hancom);
                m_collections.Add(Soulbrain_HR);
            }

            public static string GetServerText(int serverType)
            {
                if (serverType == ServerType.Fire_Johnson)
                    return "화재-동방";
                else if (serverType == ServerType.Fire_Siemens)
                    return "화재-지멘스";
                else if (serverType == ServerType.CCTV_S1_SVMS)
                    return "CCTV_S1_SVMS";
                else if (serverType == ServerType.Soulbrain_Hancom)
                    return "솔브레인_한컴";
                else if (serverType == ServerType.Soulbrain_HR)
                    return "솔브레인_HR";

                return "";
            }
        }
    }
}
