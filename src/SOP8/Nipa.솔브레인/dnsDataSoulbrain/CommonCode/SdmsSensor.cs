namespace dnsDataSoulbrain.CommonCode
{
    public class SdmsSensor
    {
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
            public const int FineDust = (int)CodeType.SensorType + 22;     // 미세먼지
            public const int MovingScaner = (int)CodeType.SensorType + 23;     // 비인가자
            public const int Submerge = (int)CodeType.SensorType + 24;     // 집수정
            public const int PredictAlarm = (int)CodeType.SensorType + 30; // AI 설비 예지보전
            public const int PeakPower = (int)CodeType.SensorType + 31;    // AI 전력분석

            public SensorType()
            {
                m_collections.Add(Fire);
                m_collections.Add(CCTV);
                m_collections.Add(PSM);
                m_collections.Add(Earthquake);
                m_collections.Add(Security);
                m_collections.Add(Etc);
                m_collections.Add(FineDust);
                m_collections.Add(MovingScaner);
                m_collections.Add(Submerge);
                m_collections.Add(PredictAlarm);
                m_collections.Add(PeakPower);
            }
        }
    }
}
