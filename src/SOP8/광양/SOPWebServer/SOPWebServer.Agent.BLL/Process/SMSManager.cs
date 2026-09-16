using System.Collections.Generic;
using dnsSMS;

namespace SOPWebServer.Agent.BLL.Process
{
    class SMSManager
    {
        public static bool SendSMS(string strSendPhoneNumber, List<string> receivePhoneNumbers, string strMessage, out string strErrorMessage)
        {
            if (strSendPhoneNumber == null || strSendPhoneNumber.Length == 0)
            {
                strErrorMessage = "보내는 전화번호가 지정되지 않았습니다.";
                return false;
            }

            if (strMessage == null || strMessage.Length == 0)
            {
                strErrorMessage = "전송할 메시지가 비어 있습니다.";
                return false;
            }

            if (receivePhoneNumbers == null || receivePhoneNumbers.Count == 0)
            {
                strErrorMessage = null;
                return true;
            }

            IMessageClient client = MessageClientFactory.CreateMessageClient();

            MessageContent content = new MessageContent();
            content.Caller = strSendPhoneNumber;
            content.PhoneNumbers.AddRange(receivePhoneNumbers);
            content.Message = strMessage;

            if (client.SendSMS(content) == false)
            {
                strErrorMessage = client.GetErrorMessage();
                return false;
            }

            strErrorMessage = null;
            return true;
        }
    }
}
