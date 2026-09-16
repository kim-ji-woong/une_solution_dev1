using Response;
using Base.Model.Sop.Config;

namespace Base.SOPSimulator.IBLL
{
    using Response;
    using Request;

    public interface IProcessManager
    {
        Base.SOPManager.IBLL.IProcessManager SopManagerProcessManager { get; set; }
        Base.SDMS.IBLL.IProcessManager SdmsProcessManager { get; set; }
        ResponseCurrentHistory RequestCurrentSOPHistory(RequestCurrentHistory data);
        ResponseExecuteSOP BeginSOP(RequestExecuteSOP data);
        MessageResult CloseSOPByUser(RequestCloseSOP data);
        /// <summary>
        /// 단계 격상
        /// </summary>
        MessageResult NextActionStep(RequestNextActionStep data);
        MessageResult RunSection(RequestProgressSOP data);
        ResponseComponentHistory GetComponentHistory(RequestComponentHistory data);
        MessageResult ProgressMission(RequestProgressMission data);
        MessageResult SendMessage(RequestSendMessage data);
        string GetSOPRunStatus(int sopRunStatus);
        MessageResult SetCurrentSection(RequestProgressSOP data);

        LinkedSop GetLinkedSop(int? zoneNo, int sensorType, int? siteNo, out string strErrorMessage);
    }
}
