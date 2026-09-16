namespace dnsDataSoulbrain.CommonCode
{
    public class Facility
    {
        public class FacilityType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.FacilityType; }
            }

            public const int PreTreatment = (int)CodeType.FacilityType + 1;     // 초순수 전처리
            public const int PostTreatment = (int)CodeType.FacilityType + 2;    // 초순수 후처리
            public const int PowerMonitoring = (int)CodeType.FacilityType + 3;   // 전력 모니터링

            public FacilityType()
            {
                m_collections.Add(PreTreatment);
                m_collections.Add(PostTreatment);
                m_collections.Add(PowerMonitoring);
            }

            public static string GetServerText(int serverType)
            {
                if (serverType == FacilityType.PreTreatment)
                    return "초순수 전처리";
                else if (serverType == FacilityType.PostTreatment)
                    return "초순수 후처리";
                else if (serverType == FacilityType.PowerMonitoring)
                    return "전력 사용량";

                return "";
            }
        }
    }
}
