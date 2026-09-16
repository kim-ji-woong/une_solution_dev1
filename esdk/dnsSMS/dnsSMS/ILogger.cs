namespace dnsSMS
{
    public interface ILogger
    {
        // strLog만 표시
        void Write(string strLog);
        // strLog 표시후 한줄 바꿈
        void WriteLine(string strLog);
        // [현재시간] : strLog 표시
        void TimeWrite(string strLog);
        // [현재시간] : strLog 표시후 한줄 바꿈
        void TimeWriteLine(string strLog);
    }
}
