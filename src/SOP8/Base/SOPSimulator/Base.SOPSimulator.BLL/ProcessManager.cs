using Base.SOPSimulator.IBLL;
using Base.SOPSimulator.IBLL.Request;
using Base.SOPSimulator.IBLL.Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response;
using Base.Model.Sop.Config;
using Base.Model.Sop.Category;

namespace Base.SOPSimulator.BLL
{
    using Process;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;
        private SOPManager.IBLL.IProcessManager m_sopProcessManager = null;
        private SDMS.IBLL.IProcessManager m_sdmsProcessManager = null;

        public SOPManager.IBLL.IProcessManager SopManagerProcessManager
        {
            get { return m_sopProcessManager; }
            set { m_sopProcessManager = value; }
        }

        public SDMS.IBLL.IProcessManager SdmsProcessManager
        {
            get { return m_sdmsProcessManager; }
            set { m_sdmsProcessManager = value; }
        }

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCurrentHistory RequestCurrentSOPHistory(RequestCurrentHistory data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.RequestCurrentSOPHistory(data, m_sopProcessManager, m_sdmsProcessManager);
        }

        public ResponseExecuteSOP BeginSOP(RequestExecuteSOP data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.BeginSOP(data, m_sopProcessManager, null, true);
        }

        public MessageResult CloseSOPByUser(RequestCloseSOP data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.CloseSOPByUser(data);
        }

        /// <summary>
        /// 단계 격상
        /// </summary>
        public MessageResult NextActionStep(RequestNextActionStep data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.NextActionStep(data, m_sopProcessManager);
        }

        public MessageResult RunSection(RequestProgressSOP data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.RunSection(data, m_sopProcessManager);
        }

        public ResponseComponentHistory GetComponentHistory(RequestComponentHistory data)
        {
            return HistoryManager.GetComponentHistory(m_dataManager, data);
        }

        public MessageResult ProgressMission(RequestProgressMission data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.ProgressMission(data, m_sopProcessManager);
        }

        public MessageResult SendMessage(RequestSendMessage data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.SendMessage(data);
        }

        public string GetSOPRunStatus(int sopRunStatus)
        {
            return RunManager.GetSOPRunStatus(sopRunStatus);
        }

        public MessageResult SetCurrentSection(RequestProgressSOP data)
        {
            RunManager runManager = new RunManager(m_dataManager);
            return runManager.SetCurrentSection(data, m_sopProcessManager);
        }

        public LinkedSop GetLinkedSop(int? zoneNo, int sensorType, int? siteNo, out string strErrorMessage)
        {
            bool noUsableSop;
            SmallClass smallClass;
            LinkedSopManager linkedSopManager = new LinkedSopManager(m_dataManager);
            return linkedSopManager.GetLinkedSop(zoneNo, sensorType, siteNo, out smallClass, out strErrorMessage, out noUsableSop);
        }
    }
}
