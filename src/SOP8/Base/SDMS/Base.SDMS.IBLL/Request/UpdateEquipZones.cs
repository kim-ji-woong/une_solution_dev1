using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    public class UpdateEquipZones
    {
        private List<UpdateEquipZoneData> m_datas = new List<UpdateEquipZoneData>();

        public List<UpdateEquipZoneData> UpdateDatas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }
    }

    public class UpdateEquipZoneData
    {
        private int m_nEquipZoneNo = -1;
        // null이 아니면 이름을 수정한다.
        private string m_strName = null;
        // x, y, z가 모두 null이 아니면 위치를 수정한다.
        private double? x = null;
        private double? y = null;
        private double? z = null;
        
        public int EquipZoneNo
        {
            get { return m_nEquipZoneNo; }
            set { m_nEquipZoneNo = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public double? X
        {
            get { return x; }
            set { x = value; }
        }

        public double? Y
        {
            get { return y; }
            set { y = value; }
        }

        public double? Z
        {
            get { return z; }
            set { z = value; }
        }
    }
}
