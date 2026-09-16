using System.Collections.Generic;

namespace Base.TeamEditor.IBLL.Request
{
    public class RequestRemoveTemporaryTeam
    {
        private List<int> m_teamNos = null;
        public List<int> TeamNos
        {
            get { return m_teamNos; }
            set { m_teamNos = value; }
        }
    }
}
