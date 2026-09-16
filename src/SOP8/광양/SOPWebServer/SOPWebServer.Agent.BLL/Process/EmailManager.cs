using System;
using System.Net;
using System.Net.Mail;
using System.Collections.Generic;

namespace SOPWebServer.Agent.BLL.Process
{
    class EmailManager
    {
        public static bool SendEmail(string strSendEmail, string strSubject, List<string> receiveEmails, string strMessage, out string strErrorMessage)
        {
            strErrorMessage = "Email 서비스가 지정되지 않았습니다.";
            return false;
        }

        public static bool SendEmail(string strSystemMail, string strSystemCode, string strEmail, string strSubject, string strMessage, out string strErrorMessage)
        {
            strErrorMessage = "Email 서비스가 지정되지 않았습니다.";
            return false;
        }
    }
}
