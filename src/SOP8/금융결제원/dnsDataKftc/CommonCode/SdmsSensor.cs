using System;
using System.Collections.Generic;
using System.Text;

namespace dnsDataKftc.CommonCode
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
            public const int Fire = (int)CodeType.SensorType + 0;           // 화재
            public const int CCTV = (int)CodeType.SensorType + 3;           // CCTV
            public const int Door = (int)CodeType.SensorType + 16;          // 출입문
            public const int EmergencyBell = (int)CodeType.SensorType + 19; // 비상벨
            public const int Intrusion = (int)CodeType.SensorType + 20;     // 침입

            public SensorType()
            {
                m_collections.Add(Fire);
                m_collections.Add(CCTV);
                m_collections.Add(Door);
                m_collections.Add(EmergencyBell);
                m_collections.Add(Intrusion);
            }
        }
    }
}
