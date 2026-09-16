using System;

namespace dnsEmail
{
    public interface IEmailClient : IDisposable
    {
        bool SendEmail(EmailContent message, ref string strResultMsg);
    }
}
