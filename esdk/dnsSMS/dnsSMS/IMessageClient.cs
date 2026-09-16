using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dnsSMS
{
    public interface IMessageClient : IDisposable
    {
        bool SendSMS(MessageContent message);
        bool SendSMS(List<MessageContent> messages);

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        bool CanUseMMS();
        // strContentPath : 외부 컨텐츠 파일의 경로
        bool SendMMS(MessageContentMMS message);
        bool SendMMS(List<MessageContentMMS> messages);

        // 메시지의 길이제한 바이트 수
        int GetMessageLength();

        string GetErrorMessage();
    }
}
