namespace dnsData.CommonCode
{
    public class Team
    {
        // 비상조직 멤버역할
        public class Role : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.Role; }
            }

            public const int None = -1;
            public const int Head = (int)CodeType.Role + 0;      // 정
            public const int Deputy = (int)CodeType.Role + 1;    // 부
            public const int Normal = (int)CodeType.Role + 2;    // 일반

            public Role()
            {
                m_collections.Add(Head);
                m_collections.Add(Deputy);
                m_collections.Add(Normal);
            }
        }

        // 직위
        public class JobPosition : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.JobPosition; }
            }

            public const int None = -1;
            public const int Member = (int)CodeType.JobPosition + 0;    // 팀원
            public const int Leader = (int)CodeType.JobPosition + 1;    // 팀장

            public JobPosition()
            {
                m_collections.Add(Member);
                m_collections.Add(Leader);
            }
        }

        // 직무상태
        public class JobStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.JobStatus; }
            }

            public const int None = -1;
            public const int Normal = (int)CodeType.JobStatus + 0;    // 정상근무
            public const int Absence = (int)CodeType.JobStatus + 1;   // 휴직
            public const int Leave = (int)CodeType.JobStatus + 2;     // 퇴사
            public const int Etc = (int)CodeType.JobStatus + 3;       // 기타

            public JobStatus()
            {
                m_collections.Add(Normal);
                m_collections.Add(Absence);
                m_collections.Add(Leave);
                m_collections.Add(Etc);
            }
        }
    }
}
