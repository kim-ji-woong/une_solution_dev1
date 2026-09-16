using System;
using System.Net;
using System.Net.Mail;

namespace dnsEmail
{
    internal class BaseEmailBroker
    {

    }

#if Soulbrain
    internal class EmailBrokerSoulbrain
    {
        // 서버 정보
        private const string m_strHost = "oasis.soulbrain.co.kr";
        private const int m_nClientPort = 587;
        private const bool m_bEnableSsl = false;
        private const bool m_bUseDefaultCredentials = false;
        private const SmtpDeliveryMethod m_DeliveryMethod = SmtpDeliveryMethod.Network;

        // 계정 정보
        private const string m_strAccountID = "Z51079";
        private const string m_strAccountPW = "iot1255!@";
        private const string m_strSystemMail = "esh@soulbrain.co.kr";

        private SmtpClient m_Client;

        public EmailBrokerSoulbrain()
        {
            // Credentials
            var credentials = new NetworkCredential(m_strAccountID, m_strAccountPW);

            // Smtp client
            m_Client = new SmtpClient()
            {
                Port = m_nClientPort,
                DeliveryMethod = m_DeliveryMethod,
                UseDefaultCredentials = m_bUseDefaultCredentials,
                Host = m_strHost,
                EnableSsl = m_bEnableSsl,
                Credentials = credentials
            };
        }

        public bool SendEmail(string strEmail, string strSubject, string strMessage, string strEmailTitle, DateTime? dtTime, ref string strResultMessage)
        {
            try
            {
                string strDate = "";

                if (dtTime != null)
                {
                    // 내용에 현재 시간 추가
                    string strYear = ((DateTime)dtTime).ToString("yyyy") + "년";
                    string strMonth = ((DateTime)dtTime).ToString("MM") + "월";
                    string strDay = ((DateTime)dtTime).ToString("dd") + "일";

                    string strHour = ((DateTime)dtTime).ToString("HH") + "시";
                    string strMinute = ((DateTime)dtTime).ToString("mm") + "분";
                    string strSecond = ((DateTime)dtTime).ToString("ss") + "초";

                    string date = strYear + " " + strMonth + " " + strDay + " " + strHour + " " + strMinute + " " + strSecond;
                }

                strMessage = strMessage + strDate;

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(m_strSystemMail),
                    Subject = strSubject,
                    Body = strMessage
                };

                mail.To.Add(new MailAddress(strEmail));

                // Send it...         
                m_Client.Send(mail);
            }
            catch (Exception ex)
            {
                strResultMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            if (strEmailTitle != null && strEmailTitle.Length > 0)
                strResultMessage = strEmailTitle + " 메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            else
                strResultMessage = "메일이 발송되었습니다.\r\n메일을 확인해 주세요.";

            return true;
        }
    }
#endif

#if UnEInternal
    internal class EmailBrokerUnEInternal
    {
        // 서버 정보
        private const string m_strHost = "smtp.gmail.com";
        private const int m_nClientPort = 587;
        private const bool m_bEnableSsl = true;
        private const bool m_bUseDefaultCredentials = false;
        private const SmtpDeliveryMethod m_DeliveryMethod = SmtpDeliveryMethod.Network;

        // 계정 정보
        private const string m_strSystemMail = "noreply@unes.co.kr";
        private const string m_strSystemCode = "gtuihesanxagonxe";

        private SmtpClient m_Client;

        public EmailBrokerUnEInternal()
        {
            // Credentials
            var credentials = new NetworkCredential(m_strSystemMail, m_strSystemCode);

            // Smtp client
            m_Client = new SmtpClient()
            {
                Port = m_nClientPort,
                DeliveryMethod = m_DeliveryMethod,
                UseDefaultCredentials = m_bUseDefaultCredentials,
                Host = m_strHost,
                EnableSsl = m_bEnableSsl,
                Credentials = credentials
            };
        }

        public bool SendEmail(string strEmail, string strSubject, string strMessage, string strEmailTitle, DateTime? dtTime, ref string strResultMessage)
        {
            try
            {
                string strDate = "";

                if (dtTime != null)
                {
                    // 내용에 현재 시간 추가
                    string strYear = ((DateTime)dtTime).ToString("yyyy") + "년";
                    string strMonth = ((DateTime)dtTime).ToString("MM") + "월";
                    string strDay = ((DateTime)dtTime).ToString("dd") + "일";

                    string strHour = ((DateTime)dtTime).ToString("HH") + "시";
                    string strMinute = ((DateTime)dtTime).ToString("mm") + "분";
                    string strSecond = ((DateTime)dtTime).ToString("ss") + "초";

                    strDate = "\n\n" + strYear + " " + strMonth + " " + strDay + " " + strHour + " " + strMinute + " " + strSecond;
                }

                strMessage = strMessage + strDate;

                // Mail message
                var mail = new MailMessage()
                {
                    From = new MailAddress(m_strSystemMail),
                    Subject = strSubject,
                    Body = strMessage
                };

                mail.To.Add(new MailAddress(strEmail));

                // Send it...         
                m_Client.Send(mail);
            }
            catch (Exception ex)
            {
                strResultMessage = "Error in sending email: " + ex.Message;
                return false;
            }

            if (strEmailTitle != null && strEmailTitle.Length > 0)
                strResultMessage = strEmailTitle + " 메일이 발송되었습니다.\r\n메일을 확인해 주세요.";
            else
                strResultMessage = "메일이 발송되었습니다.\r\n메일을 확인해 주세요.";

            return true;
        }
    }
#endif
}
