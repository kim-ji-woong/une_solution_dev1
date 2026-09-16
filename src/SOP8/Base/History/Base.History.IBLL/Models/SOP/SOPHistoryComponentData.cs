using System.Collections.Generic;

namespace Base.History.IBLL.Models.SOP
{
    public class SOPHistoryComponentData
    {
        private int m_nActionStepHistoryNo = -1;
        private int m_nComponentHistoryNo = -1;
        private int m_nComponentNo = -1;
        private int m_nComponentType = -1;
        private string m_strTitle = "";
        private List<string> m_teamList = new List<string>();
        private string m_strTime = "";
        private string m_strStatus = "";
        private int? m_userNo = null;
        private string m_strUserName = "";
        private string m_strCompletion = "확인";
        private List<ComponentHistoryDetailData> m_missionDatas = new List<ComponentHistoryDetailData>();

        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }
        public int ComponentHistoryNo
        {
            get { return m_nComponentHistoryNo; }
            set { m_nComponentHistoryNo = value; }
        }
        public int ComponentNo
        {
            get { return m_nComponentNo; }
            set { m_nComponentNo = value; }
        }
        public int ComponentType
        {
            get { return m_nComponentType; }
            set { m_nComponentType = value; }
        }
        public string Title
        {
            get { return m_strTitle; }
            set { m_strTitle = value; }
        }
        public List<string> TeamList
        {
            get { return m_teamList; }
            set { m_teamList = value; }
        }
        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }
        public string Status
        {
            get { return m_strStatus; }
            set { m_strStatus = value; }
        }
        public int? UserNo
        {
            get { return m_userNo; }
            set { m_userNo = value; }
        }
        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
        public string Completion
        {
            get { return m_strCompletion; }
            set { m_strCompletion = value; }
        }
        public List<ComponentHistoryDetailData> MissionDatas
        {
            get { return m_missionDatas; }
            set { m_missionDatas = value; }
        }
    }

    public class ComponentHistoryDetailData
    {
        private int m_nDataIndex = -1;
        private string m_strSectionName = "";
        private string m_strMissionText = "";
        private string m_strTime = "";
        private string m_strCompletion = "미완료";

        public int DataIndex
        {
            get { return m_nDataIndex; }
            set { m_nDataIndex = value; }
        }
        public string SectionName
        {
            get { return m_strSectionName; }
            set { m_strSectionName = value; }
        }
        public string MissionText
        {
            get { return m_strMissionText; }
            set { m_strMissionText = value; }
        }
        public string Completion
        {
            get { return m_strCompletion; }
            set { m_strCompletion = value; }
        }
        public string Time
        {
            get { return m_strTime; }
            set { m_strTime = value; }
        }
    }
}
