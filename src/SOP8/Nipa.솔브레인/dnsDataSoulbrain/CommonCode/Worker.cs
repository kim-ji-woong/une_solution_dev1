namespace dnsDataSoulbrain.CommonCode
{
    public class Worker
    {
        public class WorkerType : CodeTypeData
        {
            public override CommonCode.CodeType CodeType
            {
                get { return CommonCode.CodeType.WorkerType; }
            }

            public const int None = -1;
            public const int CurrentWorker = (int)CodeType.WorkerType;          // 현재 근무자
            public const int CurrentVisitor = (int)CodeType.WorkerType + 1;     // 현재 내방객
            public const int YesterdayWorker = (int)CodeType.WorkerType + 2;    // 어제 근무자
            public const int ScheduledVisitor = (int)CodeType.WorkerType + 3;   // 예정 내방객

            public WorkerType()
            {
                m_collections.Add(CurrentWorker);
                m_collections.Add(CurrentVisitor);
                m_collections.Add(YesterdayWorker);
                m_collections.Add(ScheduledVisitor);
            }
        }
    }
}
