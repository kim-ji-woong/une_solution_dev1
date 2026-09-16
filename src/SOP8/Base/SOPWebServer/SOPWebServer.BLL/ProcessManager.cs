using Response;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;
using SOPWebServer.IBLL;
using SOPWebServer.IBLL.Interface;

namespace SOPWebServer.BLL
{
    using Server;

    public class ProcessManager : IProcessManager
    {
        private IDataManager m_dataManager = null;
        private IAgentManager m_agentManager = null;

        public ProcessManager(IDataManager dataManager, IAgentManager agentManager)
        {
            m_dataManager = dataManager;
            m_agentManager = agentManager;
        }

        // 1. 센서신호를 통한 알람전송 처리
        // 2. 센서신호를 통한 알람복구 처리
        public ResponseSensorSignal ProcessSensorSignal(SensorSignal signal)
        {
            return SensorServer.ProcessSensorSignal(signal, m_dataManager, m_agentManager);
        }

        // 1. 시스템을 통한 사용자 복구 처리
        // 2. Timeout 처리
        public ResponseSensorSignal ProcessClearAlarm(ClearAlarm signal)
        {
            return SensorServer.ProcessClearAlarm(signal, m_dataManager, m_agentManager);
        }

        // 1. 시스템을 통한 사용자 복구 처리
        // 2. Timeout 처리
        public ResponseSensorSignalList ProcessClearAlarmList(ClearAlarmList signal)
        {
            return SensorServer.ProcessClearAlarmList(signal, m_dataManager, m_agentManager);
        }

        public MessageResult ProcessClearAll(ClearAll signal)
        {
            return SensorServer.ProcessClearAll(signal, m_dataManager, m_agentManager);
        }

        // 수동신고
        public ResponseSensorSignal ProcessManualReport(ManualReport signal)
        {
            return SensorServer.ProcessManualReport(signal, m_dataManager, m_agentManager);
        }

        // 1. 특정알람 해제
        // 2. 특정 알람을 실제상황으로 신고
        public ResponseSensorSignal ProcessManualReport2(ManualReport2 signal)
        {
            return SensorServer.ProcessManualReport2(signal, m_dataManager, m_agentManager);
        }

        public MessageResult BeginAlarmSop(RequestRunAlarmSop signal, Base.SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager)
        {
            SopServer sopServer = new SopServer(m_dataManager);
            return sopServer.BeginAlarmSop(signal, sopSimulatorProcessManager);
        }

        public ResponseSensorSignal NotifyAlarm(NotifyAlarm signal)
        {
            return SensorServer.NotifyAlarm(signal, m_dataManager, m_agentManager);
        }

        // 현재 활성화 상태인 알람에 대한 Timeout을 검사한다.
        // 24시간이 지난 알람은 종료 처리한다.
        public MessageResult CheckTimeoutAlarm()
        {
            return SensorServer.CheckTimeoutAlarm(m_dataManager, m_agentManager);
        }
    }
}
