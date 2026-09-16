package egovframework.base.data.common.code;

import java.util.Arrays;
import egovframework.base.data.common.code.CodeTypeData;
import egovframework.base.data.common.code.CodeType;

public class SdmsSensor {

    public static class SensorStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int Normal = CodeType.SensorStatus.getValue() + 0;    // 정상
        public static final int Interest = CodeType.SensorStatus.getValue() + 1;  // 관심
        public static final int Caution = CodeType.SensorStatus.getValue() + 2;   // 주의
        public static final int Boundary = CodeType.SensorStatus.getValue() + 3;  // 경계
        public static final int Serious = CodeType.SensorStatus.getValue() + 4;   // 심각

        public SensorStatus() {
            collections.addAll(Arrays.asList(Normal, Interest, Caution, Boundary, Serious));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SensorStatus;
        }
    }

    public static class SensorLimitType extends CodeTypeData {
        public static final int None = -1;
        public static final int Normal = CodeType.SensorLimitType.getValue() + 1;       // 일반형
        public static final int OnOff = CodeType.SensorLimitType.getValue() + 2;        // OnOff형
        public static final int Distribution = CodeType.SensorLimitType.getValue() + 3; // 분포형
        public static final int Range = CodeType.SensorLimitType.getValue() + 4;        // 범위형

        public SensorLimitType() {
            collections.addAll(Arrays.asList(Normal, OnOff, Distribution, Range));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SensorLimitType;
        }
    }

    public static class SensorType extends CodeTypeData {
        public static final int None = -1;
        public static final int Fire = CodeType.SensorType.getValue() + 0;         // 화재
        public static final int CCTV = CodeType.SensorType.getValue() + 3;         // CCTV
        public static final int PSM = CodeType.SensorType.getValue() + 11;         // 누출
        public static final int Earthquake = CodeType.SensorType.getValue() + 12;  // 지진
        public static final int Security = CodeType.SensorType.getValue() + 13;    // 방범(보안)
        public static final int Etc = CodeType.SensorType.getValue() + 21;         // 기타

        public SensorType() {
            collections.addAll(Arrays.asList(Fire, CCTV, PSM, Earthquake, Security, Etc));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SensorType;
        }
    }

    public static class DetectType extends CodeTypeData {
        public static final int None = -1;
        public static final int Detect = CodeType.DetectType.getValue() + 0;   // 신호탐지
        public static final int Report = CodeType.DetectType.getValue() + 1;   // 재난신고
        public static final int Clear = CodeType.DetectType.getValue() + 2;    // 복구신호

        public DetectType() {
            collections.addAll(Arrays.asList(Detect, Report, Clear));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.DetectType;
        }
    }

    public static class MoveDisplayAlarm extends CodeTypeData {
        public static final int None = -1;
        public static final int Stay = CodeType.MoveDisplayAlarm.getValue() + 0;         // 현재 화면 유지
        public static final int MoveToCurrent = CodeType.MoveDisplayAlarm.getValue() + 1;// 현재 알람화면으로 이동
        public static final int MoveToFirst = CodeType.MoveDisplayAlarm.getValue() + 2;  // 첫번째 알람화면으로 이동
        public static final int MoveToLast = CodeType.MoveDisplayAlarm.getValue() + 3;   // 마지막 알람화면으로 이동

        public MoveDisplayAlarm() {
            collections.addAll(Arrays.asList(Stay, MoveToCurrent, MoveToFirst, MoveToLast));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.MoveDisplayAlarm;
        }
    }

    public static class CCTVType extends CodeTypeData {
        public static final int None = -1;
        public static final int Normal = CodeType.CCTVType.getValue() + 0;   // 일반 카메라
        public static final int Thermal = CodeType.CCTVType.getValue() + 1;  // 열화상 카메라

        public CCTVType() {
            collections.addAll(Arrays.asList(Normal, Thermal));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.CCTVType;
        }
    }

    public static class NotificationType extends CodeTypeData {
        public static final int None = -1;
        public static final int SMS = CodeType.NotificationType.getValue() + 0;    // 문자메시지
        public static final int Email = CodeType.NotificationType.getValue() + 1;  // 이메일

        public NotificationType() {
            collections.addAll(Arrays.asList(SMS, Email));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.NotificationType;
        }
    }
}
