using Base.Model.History;
using System.Collections.Generic;
using Response;

namespace Base.SOPSimulator.IBLL.Response
{
    using Models;

    public class ResponseComponentHistory : MessageResult
    {
        private List<ComponentHistoryEx> m_componentHistories = new List<ComponentHistoryEx>();

        public List<ComponentHistoryEx> ComponentHistories
        {
            get { return m_componentHistories; }
            set { m_componentHistories = value; }
        }

        public ResponseComponentHistory()
            : base()
        {
        }

        public ResponseComponentHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ComponentHistoryEx : ComponentHistory
    {
        private List<ComponentDetail> m_componentHistoryDetails = new List<ComponentDetail>();

        public List<ComponentDetail> ComponentHistoryDetails
        {
            get { return m_componentHistoryDetails; }
            set { m_componentHistoryDetails = value; }
        }

        public ComponentHistoryEx()
        {
        }

        public ComponentHistoryEx(Component component, int componentType)
        {
            this.action_step_hist_sn = component.action_step_hist_sn;
            this.compn_hist_sn = component.compn_hist_sn;
            this.compn_sn = component.compn_sn;
            this.compt_cnt = component.compt_cnt;
            this.descp = component.descp;
            this.sop_sttus_code = component.sop_sttus_code;
            this.sop_sttus_optn_code = component.sop_sttus_optn_code;
            this.time = component.time;
            this.user_sn = component.user_sn;
            this.compn_code = componentType;
        }
    }
}
