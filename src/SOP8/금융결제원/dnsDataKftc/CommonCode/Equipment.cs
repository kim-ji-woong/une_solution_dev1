using System;
using System.Collections.Generic;
using System.Text;

namespace dnsDataKftc.CommonCode
{
    public class Equipment
    {
        public class EquipmentType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.EquipmentType; }
            }

            public const int Access = (int)CodeType.EquipmentType + 1;          // 출입통제
            public const int CCTV = (int)CodeType.EquipmentType + 2;            // CCTV
            public const int PoeSw = (int)CodeType.EquipmentType + 3;           // POE/SW
            public const int Server = (int)CodeType.EquipmentType + 4;          // Server
            public const int VideoWall = (int)CodeType.EquipmentType + 5;       // 비디오월
            public const int SpeedGate = (int)CodeType.EquipmentType + 6;       // 스피드게이트

            public EquipmentType()
            {
                m_collections.Add(Access);
                m_collections.Add(CCTV);
                m_collections.Add(PoeSw);
                m_collections.Add(Server);
                m_collections.Add(VideoWall);
                m_collections.Add(SpeedGate);
            }
        }
    }
}
