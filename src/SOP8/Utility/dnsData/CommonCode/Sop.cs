namespace dnsData.CommonCode
{
    public class Sop
    {
        public class ComponentType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.ComponentType; }
            }

            public const int None = -1;
            public const int Process = (int)CodeType.ComponentType + 0;       // 임무
            public const int Decision = (int)CodeType.ComponentType + 1;      // 판단
            public const int Comment = (int)CodeType.ComponentType + 2;       // 설명
            public const int Endpoint = (int)CodeType.ComponentType + 3;      // 시작/종료
            public const int Transmission = (int)CodeType.ComponentType + 4;  // 상황전파

            public ComponentType()
            {
                m_collections.Add(Process);
                m_collections.Add(Decision);
                m_collections.Add(Comment);
                m_collections.Add(Endpoint);
                m_collections.Add(Transmission);
            }

            public static string GetComponentType(int componentType)
            {
                if (componentType == ComponentType.Process || componentType == ComponentType.Process - (int)CodeType.ComponentType)
                    return "Process";
                else if (componentType == ComponentType.Decision || componentType == ComponentType.Decision - (int)CodeType.ComponentType)
                    return "Decision";
                else if (componentType == ComponentType.Comment || componentType == ComponentType.Comment - (int)CodeType.ComponentType)
                    return "Comment";
                else if (componentType == ComponentType.Endpoint || componentType == ComponentType.Endpoint - (int)CodeType.ComponentType)
                    return "Endpoint";
                else if (componentType == ComponentType.Transmission || componentType == ComponentType.Transmission - (int)CodeType.ComponentType)
                    return "Transmission";

                return "";
            }
        }

        public class VariableType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.VariableType; }
            }

            public const int None = -1;
            public const int Null = (int)CodeType.VariableType + 0;
            public const int Boolean = (int)CodeType.VariableType + 1;
            public const int Byte = (int)CodeType.VariableType + 2;
            public const int Short = (int)CodeType.VariableType + 3;
            public const int Integer = (int)CodeType.VariableType + 4;
            public const int Long = (int)CodeType.VariableType + 5;
            public const int Float = (int)CodeType.VariableType + 6;
            public const int Double = (int)CodeType.VariableType + 7;
            public const int String = (int)CodeType.VariableType + 8;
            public const int Datetime = (int)CodeType.VariableType + 9;

            public VariableType()
            {
                m_collections.Add(Null);
                m_collections.Add(Boolean);
                m_collections.Add(Byte);
                m_collections.Add(Short);
                m_collections.Add(Integer);
                m_collections.Add(Long);
                m_collections.Add(Float);
                m_collections.Add(Double);
                m_collections.Add(String);
                m_collections.Add(Datetime);
            }
        }

        public class SopRunStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.SopRunStatus; }
            }

            public const int None = -1;
            public const int RequestStart = (int)CodeType.SopRunStatus + 0; // 실행요청
            public const int Normal = (int)CodeType.SopRunStatus + 1;       // 대기상태
            public const int InProgress = (int)CodeType.SopRunStatus + 2;   // 실행중
            public const int Complete = (int)CodeType.SopRunStatus + 3;     // 완료
            public const int Wait = (int)CodeType.SopRunStatus + 4;         // 입력대기
            public const int Skip = (int)CodeType.SopRunStatus + 5;         // 건너뜀

            public SopRunStatus()
            {
                m_collections.Add(RequestStart);
                m_collections.Add(Normal);
                m_collections.Add(InProgress);
                m_collections.Add(Complete);
                m_collections.Add(Wait);
                m_collections.Add(Skip);
            }
        }

        public class ArrowPosition : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.ArrowPosition; }
            }

            public const int Top = (int)CodeType.ArrowPosition + 0;       // 위
            public const int Right = (int)CodeType.ArrowPosition + 1;     // 오른쪽
            public const int Bottom = (int)CodeType.ArrowPosition + 2;    // 아래
            public const int Left = (int)CodeType.ArrowPosition + 3;      // 왼쪽
            public const int Unknown = (int)CodeType.ArrowPosition + 4;

            public ArrowPosition()
            {
                m_collections.Add(Top);
                m_collections.Add(Right);
                m_collections.Add(Bottom);
                m_collections.Add(Left);
                m_collections.Add(Unknown);
            }
        }

        // 방송상태
        public class BroadcastStatus : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.BroadcastStatus; }
            }

            public const int None = -1;
            public const int Wait = (int)CodeType.BroadcastStatus + 1;  // 대기상태
            public const int Run = (int)CodeType.BroadcastStatus + 2;   // 방송실행
            public const int Stop = (int)CodeType.BroadcastStatus + 3;  // 방송중지
            public const int Pause = (int)CodeType.BroadcastStatus + 4; // 일시정지
            public const int Repeat = (int)CodeType.BroadcastStatus + 5;// 반복실행

            public BroadcastStatus()
            {
                m_collections.Add(Wait);
                m_collections.Add(Run);
                m_collections.Add(Stop);
                m_collections.Add(Pause);
                m_collections.Add(Repeat);
            }
        }
    }
}
