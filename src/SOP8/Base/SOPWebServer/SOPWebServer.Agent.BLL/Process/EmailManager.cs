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
            if (strSendEmail == null || strSendEmail.Length == 0)
            {
                strErrorMessage = "보내는 이메일 주소가 지정되지 않았습니다.";
                return false;
            }

            if (strMessage == null || strMessage.Length == 0)
            {
                strErrorMessage = "전송할 메시지가 비어 있습니다.";
                return false;
            }

            foreach (string strEmail in receiveEmails)
            {
                if (SendEmail(strSendEmail, "gtuihesanxagonxe", strEmail, strSubject, strMessage, out strErrorMessage) == false)
                    return false;
            }

            strErrorMessage = null;
            return true;
        }

        public static bool SendEmail(string strSystemMail, string strSystemCode, string strEmail, string strSubject, string strMessage, out string strErrorMessage)
        {
            try
            {
                // Credentials
                var credentials = new NetworkCredential(strSystemMail, strSystemCode);

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(strSystemMail),
                    Subject = strSubject,
                    Body = strMessage
                };

                mail.To.Add(new MailAddress(strEmail));

                // Smtp client
                var client = new SmtpClient()
                {
                    Port = 587,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Host = "smtp.gmail.com",
                    EnableSsl = true,
                    Credentials = credentials
                };

                // Send it...         
                client.Send(mail);
            }
            catch (Exception ex)
            {
                strErrorMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            strErrorMessage = null;
            return true;
        }
    }
}
