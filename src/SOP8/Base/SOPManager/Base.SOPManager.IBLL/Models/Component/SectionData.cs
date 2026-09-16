using System;
using System.Collections.Generic;
using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class SectionData : IComparable
    {
        //private Model.Sop.Component.Component m_section = null;
        private int? m_nSectionNumber = null;
        private Comment m_comment = null;
        private Decision m_decision = null;
        private Process m_process = null;
        private Transmission m_transmission = null;
        private Endpoint m_endpoint = null;

        private CommentData m_commentData = null;
        private DecisionData m_decisionData = null;
        private ProcessData m_processData = null;
        private TransmissionData m_transmissionData = null;
        private EndpointData m_endpointData = null;
        private bool? m_jsChecked = null; // sop-simulator에서 사용

        public Model.Sop.Component.Component Component
        {
            get
            {
                if (m_commentData != null)
                    return m_commentData;

                if (m_decisionData != null)
                    return m_decisionData;

                if (m_processData != null)
                    return m_processData;

                if (m_transmissionData != null)
                    return m_transmissionData;

                if (m_endpointData != null)
                    return m_endpointData;

                return null;
            }
        }

        /*public Model.Sop.Component.Component Component
        {
            get { return m_section; }
            set { m_section = value; }
        }*/

        public Model.Sop.Component.Comment Comment
        {
            get { return m_comment; }
            set { m_comment = value; }
        }

        public Decision Decision
        {
            get { return m_decision; }
            set { m_decision = value; }
        }

        public Process Process
        {
            get { return m_process; }
            set { m_process = value; }
        }

        public Transmission Transmission
        {
            get { return m_transmission; }
            set { m_transmission = value; }
        }

        public Endpoint Endpoint
        {
            get { return m_endpoint; }
            set { m_endpoint = value; }
        }

        public CommentData CommentData
        {
            get { return m_commentData; }
            set { m_commentData = value; }
        }

        public DecisionData DecisionData
        {
            get { return m_decisionData; }
            set { m_decisionData = value; }
        }

        public ProcessData ProcessData
        {
            get { return m_processData; }
            set { m_processData = value; }
        }

        public TransmissionData TransmissionData
        {
            get { return m_transmissionData; }
            set { m_transmissionData = value; }
        }

        public EndpointData EndpointData
        {
            get { return m_endpointData; }
            set { m_endpointData = value; }
        }

        public int? SectionNumber
        {
            get { return m_nSectionNumber; }
            set { m_nSectionNumber = value; }
        }

        public string Text
        {
            get
            {
                if (m_comment != null)
                    return m_comment.contents;
                else if (m_decision != null)
                    return m_decision.title;
                else if (m_process != null)
                    return m_process.title;
                else if (m_transmission != null)
                    return m_transmission.title;
                else if (m_endpoint != null)
                    return m_endpoint.title;

                return null;
            }
        }

        public bool? AutoRun
        {
            get
            {
                if (m_process != null)
                    return m_process.atmc_execut_yn;
                else if (m_transmission != null)
                    return m_transmission.atmc_execut_yn;

                return null;
            }
        }

        public bool? Checked
        {
            get { return m_jsChecked; }
            set { m_jsChecked = value; }
        }

        public SectionData(Model.Sop.Component.Component component = null)
        {
            SetComponent(component);
            //m_section = component;
        }

        public void SetComponent(Model.Sop.Component.Component component)
        {
            m_commentData = null;
            m_decisionData = null;
            m_processData = null;
            m_transmissionData = null;
            m_endpointData = null;

            if (component != null)
            {
                if (component is CommentData)
                    m_commentData = (CommentData)component;
                else if (component is DecisionData)
                    m_decisionData = (DecisionData)component;
                else if (component is ProcessData)
                    m_processData = (ProcessData)component;
                else if (component is TransmissionData)
                    m_transmissionData = (TransmissionData)component;
                else if (component is EndpointData)
                    m_endpointData = (EndpointData)component;
            }
        }

        public int CompareTo(object obj)
        {
            SectionData data1 = this;
            SectionData data2 = (SectionData)obj;

            if (data1.SectionNumber != null && data2.SectionNumber == null)
                return -1;
            else if (data1.SectionNumber == null && data2.SectionNumber != null)
                return 1;
            else if (data1.SectionNumber == null && data2.SectionNumber == null)
                return 0;

            if ((int)data1.SectionNumber < (int)data2.SectionNumber)
                return -1;
            else if ((int)data1.SectionNumber > (int)data2.SectionNumber)
                return 1;
            return 0;
        }
    }

    public class _SectionData
    {
        // Component
        public int compn_sn { get; set; }
        public int grid_sn { get; set; }
        public int column_no { get; set; }
        public int row_no { get; set; }
        public int ComponentTypeCodeTypeNo { get; set; }
        public int compn_code { get; set; }
        public int StepMemberNo { get; set; }

        // EndPoint
        //public int ComponentNo { get; set; }
        public string Title { get; set; }
        public bool begin_yn { get; set; }
        public int? SectionNumber { get; set; }

        // Decision
        private List<DecisionAutoScriptVariable> m_autoScriptVariables = new List<DecisionAutoScriptVariable>();
        public List<DecisionAutoScriptVariable> AutoScriptVariables
        {
            get { return m_autoScriptVariables; }
        }

        //public int ComponentNo { get; set; }
        //public string Title { get; set; }
        public string Description { get; set; }
        public string AutoRunScript { get; set; }
        //public int? SectionNumber { get; set; }

        // Annotation
        //public int ComponentNo { get; set; }
        public string Text { get; set; }

        // Process
        private List<ProcessMission> m_missions = new List<ProcessMission>();
        private List<ProcessRegular> m_regulars = new List<ProcessRegular>();
        private List<ProcessTemporaryEx> m_temporaries = new List<ProcessTemporaryEx>();

        public List<ProcessMission> Missions
        {
            get { return m_missions; }
            set { m_missions = value; }
        }

        public List<ProcessRegular> Regulars
        {
            get { return m_regulars; }
            set { m_regulars = value; }
        }

        public List<ProcessTemporaryEx> Temporaries
        {
            get { return m_temporaries; }
            set { m_temporaries = value; }
        }

        //public int ComponentNo { get; set; }
        //public string Title { get; set; }
        public bool? leadr_prvuse_yn { get; set; }
        public bool atmc_execut_yn { get; set; }
        //public int? SectionNumber { get; set; }

        // Transmission
        private List<TransmissionRegular> m_transmissionRegulars = new List<TransmissionRegular>();
        private List<TransmissionTemporaryEx> m_transmissionTemporaries = new List<TransmissionTemporaryEx>();

        public List<TransmissionRegular> TransmissionRegulars
        {
            get { return m_transmissionRegulars; }
            set { m_transmissionRegulars = value; }
        }

        public List<TransmissionTemporaryEx> TransmissionTemporaries
        {
            get { return m_transmissionTemporaries; }
            set { m_transmissionTemporaries = value; }
        }

        //public int ComponentNo { get; set; }
        //public string Title { get; set; }
        public bool sms_yn { get; set; }
        public bool email_yn { get; set; }
        public bool brdcst_yn { get; set; }
        public string mssage { get; set; }
        //public bool? OnlyTeamLeader { get; set; }
        //public bool AutoRun { get; set; }
        public bool? siren_yn { get; set; }
        //public int? SectionNumber { get; set; }
    }
}
