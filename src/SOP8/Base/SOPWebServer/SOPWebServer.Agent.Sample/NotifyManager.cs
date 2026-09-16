using SOPWebServer.IBLL.Interface;
using System.Collections.Generic;

namespace SOPWebServer.Agent.Sample
{
    using Process;

    public class NotifyManager : INotifyManager
    {
        public bool SendEmail(string strSendEmail, string strSubject, List<string> receiveEmails, string strMessage, out string strErrorMessage)
        {
            return EmailManager.SendEmail(strSendEmail, strSubject, receiveEmails, strMessage, out strErrorMessage);
        }

        public bool SendSMS(string strSendPhoneNumber, List<string> receivePhoneNumbers, string strMessage, out string strErrorMessage)
        {
            return SMSManager.SendSMS(strSendPhoneNumber, receivePhoneNumbers, strMessage, out strErrorMessage);
        }
    }
}
