using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Request
{
    public class RequestDelete
    {
        // 버전별로 지울경우 사용(주간, 야간 모두 삭제)
        private List<int> m_versionNos = null;
        // SOP별로 지울경우 사용(주간 또는 야간 모드를 선택하여 삭제)
        private List<int> m_disasterNos = null;

        // 버전별로 지울경우 사용(주간, 야간 모두 삭제)
        public List<int> VersionNos
        {
            get { return m_versionNos; }
            set { m_versionNos = value; }
        }

        // SOP별로 지울경우 사용(주간 또는 야간 모드를 선택하여 삭제)
        public List<int> DisasterNos
        {
            get { return m_disasterNos; }
            set { m_disasterNos = value; }
        }
    }
}
