using System.Collections.Generic;
using Base.Model.Sensor.CCTV;

namespace Base.SDMS.IBLL.Request
{
    public class SaveEquipZoneCCTVList
    {
        private List<EquipZoneCCTV> m_equipZoneCCTVs = new List<EquipZoneCCTV>();

        public List<EquipZoneCCTV> EquipZoneCCTVs
        {
            get { return m_equipZoneCCTVs; }
            set { m_equipZoneCCTVs = value; }
        }
    }
}
