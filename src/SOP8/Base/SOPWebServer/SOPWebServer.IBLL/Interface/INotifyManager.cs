using System.Collections.Generic;

namespace SOPWebServer.IBLL.Interface
{
    public interface INotifyManager
    {
        public bool SendSMS(string strSendPhoneNumber, List<string> receivePhoneNumbers, string strMessage, out string strErrorMessage);
        public bool SendEmail(string strSendEmail, string strSubject, List<string> receiveEmails, string strMessage, out string strErrorMessage);
    }
}
