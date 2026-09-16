using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Models.Category
{
    public class VersionDisasterData
    {
        private string m_strDisasterName = "";
        // 버전별로 정렬된 Disaster들
        private List<DisasterData> m_disasterDatas = new List<DisasterData>();

        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }

        public List<DisasterData> DisasterDatas
        {
            get { return m_disasterDatas; }
        }
    }
}
