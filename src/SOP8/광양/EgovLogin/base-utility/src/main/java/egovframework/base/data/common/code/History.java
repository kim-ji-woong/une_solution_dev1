package egovframework.base.data.common.code;

import java.util.Arrays;
import egovframework.base.data.common.code.CodeTypeData;
import egovframework.base.data.common.code.CodeType;

public class History {
	public static class DetectStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int Real = CodeType.DetectStatus.getValue() + 1;         // 실제신호
        public static final int Malfunction = CodeType.DetectStatus.getValue() + 2;  // 오동작
        public static final int Test = CodeType.DetectStatus.getValue() + 3;         // 테스트

        public DetectStatus() {
            collections.addAll(Arrays.asList(Real, Malfunction, Test));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.DetectStatus;
        }
    }

    public static class ReactionType extends CodeTypeData {
        public static final int None = -1;
        public static final int BeginStatus = CodeType.ReactionType.getValue() + 0;
        public static final int AlarmSignal = CodeType.ReactionType.getValue() + 1;
        public static final int ClearSignal = CodeType.ReactionType.getValue() + 2;
        public static final int RunBroadcast = CodeType.ReactionType.getValue() + 10;
        public static final int SendSMS = CodeType.ReactionType.getValue() + 11;
        public static final int Malfunction = CodeType.ReactionType.getValue() + 21;
        public static final int NotifySignal = CodeType.ReactionType.getValue() + 22;
        public static final int IgnoreSignal = CodeType.ReactionType.getValue() + 23;
        public static final int EndStatus = CodeType.ReactionType.getValue() + 50;
        public static final int ChangeAlarmDepth = CodeType.ReactionType.getValue() + 62;
        public static final int UserReset = CodeType.ReactionType.getValue() + 64;
        public static final int TimeOut = CodeType.ReactionType.getValue() + 99;

        public ReactionType() {
            collections.addAll(Arrays.asList(
                BeginStatus, AlarmSignal, ClearSignal, RunBroadcast, SendSMS,
                Malfunction, NotifySignal, IgnoreSignal, EndStatus,
                ChangeAlarmDepth, UserReset, TimeOut
            ));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.ReactionType;
        }
    }

    public static class SendType extends CodeTypeData {
        public static final int None = -1;
        public static final int Manual = CodeType.SendType.getValue() + 0;
        public static final int AutoFromAlarm = CodeType.SendType.getValue() + 1;
        public static final int SOP = CodeType.SendType.getValue() + 2;

        public SendType() {
            collections.addAll(Arrays.asList(Manual, AutoFromAlarm, SOP));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SendType;
        }
    }

    public static class SopStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int Ready = CodeType.SopStatus.getValue() + 0;
        public static final int RequestSOP = CodeType.SopStatus.getValue() + 1;
        public static final int RunningSOP = CodeType.SopStatus.getValue() + 2;
        public static final int FinishSOP = CodeType.SopStatus.getValue() + 3;

        public SopStatus() {
            collections.addAll(Arrays.asList(Ready, RequestSOP, RunningSOP, FinishSOP));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SopStatus;
        }
    }
}
