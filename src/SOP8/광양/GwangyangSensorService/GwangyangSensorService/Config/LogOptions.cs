namespace GwangyangSensorService.Config
{
    public sealed class LogOptions
    {
        public string LogFolder { get; set; } = string.Empty;
        public int LogLifeTime { get; set; }
        public string LogFileTag { get; set; } = string.Empty;
        public bool UseChannelFolders { get; set; } = true;
        public int ArchiveAfterDays { get; set; } = 14;
        public int DeleteArchiveAfterDays { get; set; } = 365;
        public int MaxArchiveSizeGB { get; set; } = 30;
        public int MaxActiveFileSizeMB { get; set; } = 100;

        /// <summary>
        /// 글자 단위로 동일한 로그의 반복을 억제하는 창 길이(분). 0 이하면 억제하지 않는다.
        /// 창 안의 재발은 기록하지 않고 횟수만 집계했다가 요약 1줄로 내보낸다.
        /// </summary>
        public int DuplicateSuppressionMinutes { get; set; } = 60;

        /// <summary>
        /// 억제 대상으로 추적할 서로 다른 메시지의 최대 개수.
        /// 이 수를 넘으면 신규 메시지는 억제하지 않고 그대로 기록한다(사전 무한 증가 방지).
        /// </summary>
        public int DuplicateSuppressionMaxKeys { get; set; } = 2000;
    }
}
