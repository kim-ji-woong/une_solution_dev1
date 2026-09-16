using System;
using System.Collections.Generic;
using System.Text;

namespace DCOP.BLL.Models.Response
{
    public class MessageResult
    {
        private bool m_result = false;
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }
}
