using System.Collections.Generic;
using Base.Model.History;

namespace Base.SOPSimulator.IBLL.Models
{
    using Response;

    public class ActionStepHistoryData
    {
        private int m_nSiteNo = -1;
        private ActionStep m_actionStepHistory = null;
        private List<ComponentHistoryEx> m_componentHistories = new List<ComponentHistoryEx>();
        // LargeClass No / Middle Class No / Small Class No / SensorZoneHistory No(생략가능)
        private string m_strSopKey = "";
        private Base.Model.Sop.Category.ActionStep m_actionStep = null;
        private string m_strStepName = "";
        private bool m_isChanged = false;
        private bool m_confirmTimeoutCloseSOP = false;

        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        public ActionStep ActionStepHistory
        {
            get { return m_actionStepHistory; }
            set { m_actionStepHistory = value; }
        }

        public List<ComponentHistoryEx> ComponentHistories
        {
            get { return m_componentHistories; }
            set { m_componentHistories = value; }
        }

        // LargeClass No / Middle Class No / Small Class No / SensorZoneHistory No(생략가능)
        public string SopKey
        {
            get { return m_strSopKey; }
            set { m_strSopKey = value; }
        }

        public Base.Model.Sop.Category.ActionStep ActionStep
        {
            get { return m_actionStep; }
            set { m_actionStep = value; }
        }

        public string StepName
        {
            get { return m_strStepName; }
            set { m_strStepName = value; }
        }

        public bool IsChanged
        {
            get { return m_isChanged; }
            set { m_isChanged = value; }
        }

        public bool ConfirmTimeoutCloseSOP
        {
            get { return m_confirmTimeoutCloseSOP; }
            set { m_confirmTimeoutCloseSOP = value; }
        }

        public static string MakeSopKey(int largeClassNo, int middleClassNo, int smallClassNo, int? sensorZoneHistoryNo = null)
        {
            string strSopKey = string.Format("{0}/{1}/{2}", largeClassNo, middleClassNo, smallClassNo);

            if (sensorZoneHistoryNo != null)
                strSopKey += "/" + sensorZoneHistoryNo.ToString();

            return strSopKey;
        }
    }

    public class ActionStepHistoryDataEx
    {
        private List<ActionStepHistoryData> m_actionStepDatas = new List<ActionStepHistoryData>();

        public List<ActionStepHistoryData> ActionStepDatas
        {
            get { return m_actionStepDatas; }
            set { m_actionStepDatas = value; }
        }
    }
}
