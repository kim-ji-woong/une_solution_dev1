package egovframework.base.data.common.code;

import java.util.Arrays;
import egovframework.base.data.common.code.CodeTypeData;
import egovframework.base.data.common.code.CodeType;

public class Sop {

    public static class ComponentType extends CodeTypeData {
        public static final int None = -1;
        public static final int Process = CodeType.ComponentType.getValue() + 0;
        public static final int Decision = CodeType.ComponentType.getValue() + 1;
        public static final int Comment = CodeType.ComponentType.getValue() + 2;
        public static final int Endpoint = CodeType.ComponentType.getValue() + 3;
        public static final int Transmission = CodeType.ComponentType.getValue() + 4;

        public ComponentType() {
            collections.addAll(Arrays.asList(Process, Decision, Comment, Endpoint, Transmission));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.ComponentType;
        }

        public static String getComponentType(int componentType) {
            int base = CodeType.ComponentType.getValue();
            int relative = componentType - base;

            switch (relative) {
                case 0: return "Process";
                case 1: return "Decision";
                case 2: return "Comment";
                case 3: return "Endpoint";
                case 4: return "Transmission";
                default: return "";
            }
        }
    }

    public static class VariableType extends CodeTypeData {
        public static final int None = -1;
        public static final int Null = CodeType.VariableType.getValue() + 0;
        public static final int Boolean = CodeType.VariableType.getValue() + 1;
        public static final int Byte = CodeType.VariableType.getValue() + 2;
        public static final int Short = CodeType.VariableType.getValue() + 3;
        public static final int Integer = CodeType.VariableType.getValue() + 4;
        public static final int Long = CodeType.VariableType.getValue() + 5;
        public static final int Float = CodeType.VariableType.getValue() + 6;
        public static final int Double = CodeType.VariableType.getValue() + 7;
        public static final int String = CodeType.VariableType.getValue() + 8;
        public static final int Datetime = CodeType.VariableType.getValue() + 9;

        public VariableType() {
            collections.addAll(Arrays.asList(Null, Boolean, Byte, Short, Integer, Long, Float, Double, String, Datetime));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.VariableType;
        }
    }

    public static class SopRunStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int RequestStart = CodeType.SopRunStatus.getValue() + 0;
        public static final int Normal = CodeType.SopRunStatus.getValue() + 1;
        public static final int InProgress = CodeType.SopRunStatus.getValue() + 2;
        public static final int Complete = CodeType.SopRunStatus.getValue() + 3;
        public static final int Wait = CodeType.SopRunStatus.getValue() + 4;
        public static final int Skip = CodeType.SopRunStatus.getValue() + 5;

        public SopRunStatus() {
            collections.addAll(Arrays.asList(RequestStart, Normal, InProgress, Complete, Wait, Skip));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.SopRunStatus;
        }
    }

    public static class ArrowPosition extends CodeTypeData {
        public static final int Top = CodeType.ArrowPosition.getValue() + 0;
        public static final int Right = CodeType.ArrowPosition.getValue() + 1;
        public static final int Bottom = CodeType.ArrowPosition.getValue() + 2;
        public static final int Left = CodeType.ArrowPosition.getValue() + 3;
        public static final int Unknown = CodeType.ArrowPosition.getValue() + 4;

        public ArrowPosition() {
            collections.addAll(Arrays.asList(Top, Right, Bottom, Left, Unknown));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.ArrowPosition;
        }
    }

    public static class BroadcastStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int Wait = CodeType.BroadcastStatus.getValue() + 1;
        public static final int Run = CodeType.BroadcastStatus.getValue() + 2;
        public static final int Stop = CodeType.BroadcastStatus.getValue() + 3;
        public static final int Pause = CodeType.BroadcastStatus.getValue() + 4;
        public static final int Repeat = CodeType.BroadcastStatus.getValue() + 5;

        public BroadcastStatus() {
            collections.addAll(Arrays.asList(Wait, Run, Stop, Pause, Repeat));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.BroadcastStatus;
        }
    }
}
