using System;
using System.Collections.Generic;

namespace dnsEmail
{
    internal class MessageClientDummy : IEmailClient
    {
        public void Dispose()
        {

        }

        bool IEmailClient.SendEmail(EmailContent message, ref string strResultMsg)
        {
            return true;
        }
    }

#if Soulbrain
    internal class EmailClientSoulbrain : IEmailClient
    {
        private EmailBrokerSoulbrain m_broker = null;

        public EmailClientSoulbrain()
        {
            m_broker = new EmailBrokerSoulbrain();
        }

        public void Dispose()
        {

        }

        public bool SendEmail(EmailContent message, ref string strResultMsg)
        {
            if (m_broker != null && message != null && message.EmailList.Count > 0)
            {
                foreach (string strEmail in message.EmailList)
                {
                    if (m_broker.SendEmail(strEmail, message.Subject, message.Message, message.Title, message.TimeStamp, ref strResultMsg) == false)
                        return false;
                }
                
                return true;
            }

            return false;
        }
    }
#endif

#if UnEInternal
    internal class EmailClientUnEInternal : IEmailClient
    {
        private EmailBrokerUnEInternal m_broker = null;

        public EmailClientUnEInternal()
        {
            m_broker = new EmailBrokerUnEInternal();
        }

        void IDisposable.Dispose()
        {
            
        }

        public bool SendEmail(EmailContent message, ref string strResultMsg)
        {
            if (m_broker != null && message != null && message.EmailList.Count > 0)
            {
                foreach (string strEmail in message.EmailList)
                {
                    if (m_broker.SendEmail(strEmail, message.Subject, message.Message, message.Title, message.TimeStamp, ref strResultMsg) == false)
                        return false;
                }

                return true;
            }

            return false;
        }
    }

#endif
}
