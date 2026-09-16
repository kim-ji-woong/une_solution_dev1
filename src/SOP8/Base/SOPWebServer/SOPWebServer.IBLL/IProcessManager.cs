using Response;
using SOPWebServer.IBLL.Models.Request;
using SOPWebServer.IBLL.Models.Response;

namespace SOPWebServer.IBLL
{
    public interface IProcessManager
    {
        // 1. 센서신호를 통한 알람전송 처리
        // 2. 센서신호를 통한 알람복구 처리
        ResponseSensorSignal ProcessSensorSignal(SensorSignal signal);

        // 1. 시스템을 통한 사용자 복구 처리
        // 2. Timeout 처리
        ResponseSensorSignal ProcessClearAlarm(ClearAlarm signal);
        // 1. 시스템을 통한 사용자 복구 처리
        // 2. Timeout 처리
        ResponseSensorSignalList ProcessClearAlarmList(ClearAlarmList signal);

        MessageResult ProcessClearAll(ClearAll signal);

        // 수동신고
        ResponseSensorSignal ProcessManualReport(ManualReport signal);

        // 1. 특정알람 해제
        // 2. 특정 알람을 실제상황으로 신고
        ResponseSensorSignal ProcessManualReport2(ManualReport2 signal);

        MessageResult BeginAlarmSop(RequestRunAlarmSop signal, Base.SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager);
        // 재난신고
        ResponseSensorSignal NotifyAlarm(NotifyAlarm signal);
        // 현재 활성화 상태인 알람에 대한 Timeout을 검사한다.
        // 24시간이 지난 알람은 종료 처리한다.
        MessageResult CheckTimeoutAlarm();
    }
}
