package egovframework.base.data.common.code;

import java.util.Arrays;
import egovframework.base.data.common.code.CodeTypeData;
import egovframework.base.data.common.code.CodeType;

public class Team {

    // 비상조직 멤버 역할
    public static class Role extends CodeTypeData {
        public static final int None = -1;
        public static final int Head = CodeType.Role.getValue() + 0;    // 정
        public static final int Deputy = CodeType.Role.getValue() + 1;  // 부
        public static final int Normal = CodeType.Role.getValue() + 2;  // 일반

        public Role() {
            collections.addAll(Arrays.asList(Head, Deputy, Normal));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.Role;
        }
    }

    // 직위
    public static class JobPosition extends CodeTypeData {
        public static final int None = -1;
        public static final int Member = CodeType.JobPosition.getValue() + 0;  // 팀원
        public static final int Leader = CodeType.JobPosition.getValue() + 1;  // 팀장

        public JobPosition() {
            collections.addAll(Arrays.asList(Member, Leader));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.JobPosition;
        }
    }

    // 직무 상태
    public static class JobStatus extends CodeTypeData {
        public static final int None = -1;
        public static final int Normal = CodeType.JobStatus.getValue() + 0;   // 정상근무
        public static final int Absence = CodeType.JobStatus.getValue() + 1;  // 휴직
        public static final int Leave = CodeType.JobStatus.getValue() + 2;    // 퇴사
        public static final int Etc = CodeType.JobStatus.getValue() + 3;      // 기타

        public JobStatus() {
            collections.addAll(Arrays.asList(Normal, Absence, Leave, Etc));
        }

        @Override
        public CodeType getCodeType() {
            return CodeType.JobStatus;
        }
    }
}
