using System.Collections.Generic;
using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class ProcessData : Base.Model.Sop.Component.Component
    {
        private List<ProcessMissionEx> m_missions = new List<ProcessMissionEx>();
        private List<ProcessRegular> m_regulars = new List<ProcessRegular>();
        private List<ProcessTemporaryEx> m_temporaries = new List<ProcessTemporaryEx>();
        private Process m_process = null;

        public List<ProcessMissionEx> Missions
        {
            get { return m_missions; }
        }

        public List<ProcessRegular> Regulars
        {
            get { return m_regulars; }
        }

        public List<ProcessTemporaryEx> Temporaries
        {
            get { return m_temporaries; }
        }

        public Process Process
        {
            get { return m_process; }
            set { m_process = value; }
        }
    }

    public class ProcessTemporaryEx : ProcessTemporary
    {
        private bool? m_nor_yn = null;

        public bool? nor_yn
        {
            get { return m_nor_yn; }
            set { m_nor_yn = value; }
        }

        public ProcessTemporaryEx()
        {
        }

        public ProcessTemporaryEx(int compn_sn, int tmpr_sn, bool? nor_yn = null)
        {
            this.compn_sn = compn_sn;
            this.tmpr_sn = tmpr_sn;
            this.nor_yn = nor_yn;
        }
    }

    public class ProcessMissionEx : ProcessMission
    {
        public enum MissionTypes { NormalType = 0, ExternalType };
        private bool? m_checked = null;
        private int m_missionType = (int)MissionTypes.NormalType;

        public bool? Checked
        {
            get { return m_checked; }
            set { m_checked = value; }
        }

        public int MissionType
        {
            get { return m_missionType; }
            set { m_missionType = value; }
        }

        public ProcessMissionEx()
        {
        }

        public ProcessMissionEx(ProcessMission mission)
        {
            this.misn_contents = mission.misn_contents;
            this.misn_sn = mission.misn_sn;
            this.compn_sn = mission.compn_sn;
        }
    }
}
