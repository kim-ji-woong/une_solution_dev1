using System;
using System.Collections.Generic;
using System.Text;

namespace Base.Account.IBLL.Request
{
    public class RequestTemporaryPasswordWithSMS
    {
        private string m_strUserName = null;
        private string m_strPhoneNumber = null;

        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }
        
        public string PhoneNumber
        {
            get { return m_strPhoneNumber; }
            set { m_strPhoneNumber = value; }
        }
    }

    public class RequestTemporaryPasswordWithEmail
    {
        private string m_strUserName = null;
        private string m_strEmail = null;

        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }

        public string Email
        {
            get { return m_strEmail; }
            set { m_strEmail = value; }
        }
    }
}
