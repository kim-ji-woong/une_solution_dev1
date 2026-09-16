using System.Collections.Generic;
using Base.Model.Sop.Category;

namespace Base.SOPManager.IBLL.Models.Category
{
    using Component;

    public class ActionStepData
    {
        private string m_strStepName = "";
        private ActionStep m_actionStep = null;
        private List<StepMemberData> m_stepMemberDatas = new List<StepMemberData>();

        public string StepName
        {
            get { return m_strStepName; }
            set { m_strStepName = value; }
        }

        public ActionStep ActionStep
        {
            get { return m_actionStep; }
            set { m_actionStep = value; }
        }

        public List<StepMemberData> StepMemberDatas
        {
            get { return m_stepMemberDatas; }
            set { m_stepMemberDatas = value; }
        }
    }
}
