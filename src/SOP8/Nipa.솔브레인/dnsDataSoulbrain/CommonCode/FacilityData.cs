namespace dnsDataSoulbrain.CommonCode
{
    public class FacilityData
    {
        public class FacilityDataType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.FacilityDataType; }
            }

            public const int Measurement = (int)CodeType.FacilityDataType + 1;      // 계측 데이터
            public const int Prediction = (int)CodeType.FacilityDataType + 2;       // 예측 데이터

            public FacilityDataType()
            {
                m_collections.Add(Measurement);
                m_collections.Add(Prediction);
            }
        }
    }
}
