using Base.Model.History;

namespace Base.SOPSimulator.IBLL.Models
{
    public class ComponentHistory : Component
    {
        public int compn_code
        {
            get; set;
        }

        public ComponentHistory()
        {
        }

        public ComponentHistory(Component component, int componentType)
        {
            this.compn_hist_sn = component.compn_hist_sn;
            this.action_step_hist_sn = component.action_step_hist_sn;
            this.compn_sn = component.compn_sn;
            this.time = component.time;
            this.sop_sttus_optn_code = component.sop_sttus_optn_code;
            this.sop_sttus_code = component.sop_sttus_code;
            this.compt_cnt = component.compt_cnt;
            this.user_sn = component.user_sn;
            this.descp = component.descp;
            this.compn_code = componentType;
        }
    }
}
