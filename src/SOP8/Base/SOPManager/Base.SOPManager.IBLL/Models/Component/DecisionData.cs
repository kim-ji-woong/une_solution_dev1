using System.Collections.Generic;
using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class DecisionData : Base.Model.Sop.Component.Component
    {
        private Decision m_decision = null;
        private List<DecisionAutoScriptVariable> m_autoScriptVariables = new List<DecisionAutoScriptVariable>();

        public Decision Decision
        {
            get { return m_decision; }
            set { m_decision = value; }
        }

        public List<DecisionAutoScriptVariable> AutoScriptVariables
        {
            get { return m_autoScriptVariables; }
        }
    }
}
