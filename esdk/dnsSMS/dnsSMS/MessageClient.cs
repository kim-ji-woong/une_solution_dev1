using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dnsSMS
{
    internal static class ClientHelper
    {
        public static bool IsSMSMessage(string strMsg, int nSMSLimit)
        {
            int nByteLength = 0;
            int nLen = strMsg.Length;

            for (int i = 0; i < nLen; i++)
            {
                if (strMsg.ElementAt(i) < 256)
                    nByteLength++;
                else
                    nByteLength += 2;
            }

            if (nByteLength <= nSMSLimit)
                return true;

            return false;
        }

        public static void CheckTitle(ref string strTitle, string strMessage)
        {
            if (strTitle.Length > 0)
                return;

            if (strMessage.Length <= 5)
                strTitle = strMessage;
            else
                strTitle = strMessage.Substring(0, 5);
        }
    }

    internal class MessageClientDummy : IMessageClient
    {
        internal MessageClientDummy()
        {
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            return true;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            return 140;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return false;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            return false;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            return false;
        }

        public string GetErrorMessage()
        {
            return "";
        }
    }

#if UNE_MCS
    // 모노 커뮤니케이션즈(KT 크로샷)
    internal class MessageClientMCS : IMessageClient
    {
        private int m_msgBufCount = 100;

        private int m_nSMSLimit = 90;
        private MessageBrokerMCS m_broker = null;

        public MessageClientMCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            m_broker = new MessageBrokerMCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                bool isSMS = ClientHelper.IsSMSMessage(message.Message, m_nSMSLimit);

                int nReceiverCount = message.PhoneNumbers.Count;

                for (int i = 0; i < nReceiverCount;)
                {
                    int nEndIndex = i + m_msgBufCount;

                    if (nEndIndex >= nReceiverCount)
                        nEndIndex = nReceiverCount;

                    if (isSMS)
                    {
                        if (m_broker.SendSMSMessage(message.PhoneNumbers, message.Message, i, nEndIndex) == false)
                            return false;
                    }
                    else
                    {
                        string strTitle = "";
                        ClientHelper.CheckTitle(ref strTitle, message.Message);

                        if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                            return false;
                    }

                    i = nEndIndex;
                }

                return true;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker == null || message == null)
                return false;

            int nReceiverCount = message.PhoneNumbers.Count;

            for (int i = 0; i < nReceiverCount;)
            {
                int nEndIndex = i + m_msgBufCount;

                if (nEndIndex >= nReceiverCount)
                    nEndIndex = nReceiverCount;

                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                {
                    if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendMMSMessage(message.PhoneNumbers, message.Message, strTitle, message.ContentsList, i, nEndIndex) == false)
                        return false;
                }

                i = nEndIndex;
            }

            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if SKT_MCS
    // 모노 커뮤니케이션즈(KT 크로샷)
    internal class MessageClientSKT_MCS : IMessageClient
    {
        private int m_msgBufCount = 100;

        private int m_nSMSLimit = 90;
        private MessageBrokerSKT_MCS m_broker = null;

        public MessageClientSKT_MCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            m_broker = new MessageBrokerSKT_MCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                bool isSMS = ClientHelper.IsSMSMessage(message.Message, m_nSMSLimit);

                int nReceiverCount = message.PhoneNumbers.Count;

                for (int i = 0; i < nReceiverCount;)
                {
                    int nEndIndex = i + m_msgBufCount;

                    if (nEndIndex >= nReceiverCount)
                        nEndIndex = nReceiverCount;

                    if (isSMS)
                    {
                        if (m_broker.SendSMSMessage(message.PhoneNumbers, message.Message, i, nEndIndex) == false)
                            return false;
                    }
                    else
                    {
                        string strTitle = "";
                        ClientHelper.CheckTitle(ref strTitle, message.Message);

                        if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                            return false;
                    }

                    i = nEndIndex;
                }

                return true;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker == null || message == null)
                return false;

            int nReceiverCount = message.PhoneNumbers.Count;

            for (int i = 0; i < nReceiverCount;)
            {
                int nEndIndex = i + m_msgBufCount;

                if (nEndIndex >= nReceiverCount)
                    nEndIndex = nReceiverCount;

                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                {
                    if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendMMSMessage(message.PhoneNumbers, message.Message, strTitle, message.ContentsList, i, nEndIndex) == false)
                        return false;
                }

                i = nEndIndex;
            }

            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if Soulbrain_MCS
    // 모노 커뮤니케이션즈(KT 크로샷)
    internal class MessageClientSoulbrainMCS : IMessageClient
    {
        private int m_msgBufCount = 100;

        private int m_nSMSLimit = 90;
        private MessageBrokerSoulbrainMCS m_broker = null;

        public MessageClientSoulbrainMCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            m_broker = new MessageBrokerSoulbrainMCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                bool isSMS = ClientHelper.IsSMSMessage(message.Message, m_nSMSLimit);

                int nReceiverCount = message.PhoneNumbers.Count;

                for (int i = 0; i < nReceiverCount;)
                {
                    int nEndIndex = i + m_msgBufCount;

                    if (nEndIndex >= nReceiverCount)
                        nEndIndex = nReceiverCount;

                    if (isSMS)
                    {
                        if (m_broker.SendSMSMessage(message.PhoneNumbers, message.Message, i, nEndIndex) == false)
                            return false;
                    }
                    else
                    {
                        string strTitle = "";
                        ClientHelper.CheckTitle(ref strTitle, message.Message);

                        if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                            return false;
                    }

                    i = nEndIndex;
                }

                return true;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker == null || message == null)
                return false;

            int nReceiverCount = message.PhoneNumbers.Count;

            for (int i = 0; i < nReceiverCount;)
            {
                int nEndIndex = i + m_msgBufCount;

                if (nEndIndex >= nReceiverCount)
                    nEndIndex = nReceiverCount;

                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                {
                    if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendMMSMessage(message.PhoneNumbers, message.Message, strTitle, message.ContentsList, i, nEndIndex) == false)
                        return false;
                }

                i = nEndIndex;
            }

            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if Kakao
    internal class MessageClientKakao : IMessageClient
    {
        private int m_msgBufCount = 100;

        private MessageBrokerKakao m_broker = null;

        public MessageClientKakao(IKakaoHelper kakaoHelper)
        {
            m_broker = new MessageBrokerKakao(kakaoHelper);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                if (message.SensorReactionHistoryID != null && message.SensorReactionHistoryID > 0)
                {
                    if (m_broker.SendSMSMessage(message.PhoneNumbers, (int)message.SensorReactionHistoryID) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendSMSMessage(message) == false)
                        return false;
                }

                return true;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker == null || message == null)
                return false;

            int nReceiverCount = message.PhoneNumbers.Count;

            for (int i = 0; i < nReceiverCount;)
            {
                int nEndIndex = i + m_msgBufCount;

                if (nEndIndex >= nReceiverCount)
                    nEndIndex = nReceiverCount;

                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                {
                    if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendMMSMessage(message.PhoneNumbers, message.Message, strTitle, message.ContentsList, i, nEndIndex) == false)
                        return false;
                }

                i = nEndIndex;
            }

            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if Kakaowork
    internal class MessageClientKakaowork : IMessageClient
    {
        private int m_msgBufCount = 100;

        private MessageBrokerKakaowork m_broker = null;

        public MessageClientKakaowork(/*Common.IDAL.IDataManager commonDataManager, SDMS.IDAL.IDataManager sdmsDataManager*/)
        {
            m_broker = new MessageBrokerKakaowork(/*commonDataManager, sdmsDataManager*/);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                if (m_broker.SendSMSMessage(message.EMails, message.Message) == false)
                    return false;

                return true;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker == null || message == null)
                return false;

            int nReceiverCount = message.PhoneNumbers.Count;

            for (int i = 0; i < nReceiverCount;)
            {
                int nEndIndex = i + m_msgBufCount;

                if (nEndIndex >= nReceiverCount)
                    nEndIndex = nReceiverCount;

                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                {
                    if (m_broker.SendLMSMessage(message.PhoneNumbers, message.Message, strTitle, i, nEndIndex) == false)
                        return false;
                }
                else
                {
                    if (m_broker.SendMMSMessage(message.PhoneNumbers, message.Message, strTitle, message.ContentsList, i, nEndIndex) == false)
                        return false;
                }

                i = nEndIndex;
            }

            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if External_UNE_MCS
    // 외부에서 UNE_MCS 사용하기 위한 버전 >> UNE 서버에 API를 사용하는 방식
    internal class MessageClientExternalMCS : IMessageClient
    {
        private int m_msgBufCount = 100;
        private int m_nSMSLimit = 90;
        private const string m_strCaller = "027144133";

        private MessageBrokerExternal_MCS m_broker = null;

        public MessageClientExternalMCS()
        {
            m_broker = new MessageBrokerExternal_MCS();
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                string strPhoneNumbers = "";
                string strMessage = message.Message;

                foreach (string phoneNumber in message.PhoneNumbers)
                {
                    if (strPhoneNumbers == "")
                        strPhoneNumbers = phoneNumber;
                    else
                        strPhoneNumbers += "," + phoneNumber;
                }

                strMessage = strMessage.Replace("\n", "\\n");
                strMessage = strMessage.Replace("\r", "\\r");

                // API를 이용하여 SMS를 보내는 방식
                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                string strJson = "{\"message\": \"" + strMessage + "\", \"caller\":\"" + m_strCaller + "\", \"phoneNumbers\":\"" + strPhoneNumbers + "\"}";
                string strURL = "/api/SMS";
                string strErrorMessage = "";

                bool bResult = m_broker.SendQuery(dicHeaders, strJson, strURL, out strErrorMessage, "POST");


                return bResult;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if Wonikqnc
    // 외부에서 UNE_MCS 사용하기 위한 버전 >> UNE 서버에 API를 사용하는 방식
    internal class MessageClientWonikqnc : IMessageClient
    {
        //private int m_msgBufCount = 100;
        //private int m_nSMSLimit = 90;
        //private const string m_strCaller = "027144133";

        private static string SYSTEM_ID = "SDMS";
        private static string ACCESS_TOKEN = "ccf8bf69-a92c@4426-8db9=5bd336b0ead2";

        private static string TEMPLATE_CODE = "024100000079";

        private static string URL_SMS = "/api/sms/v1.0/messages";
        private static string URL_KAKAO = "/api/kakao/v1.0/talks";

        private static string SUBJECT = "안전관리시스템 메시지";

        private MessageBrokerWonikqnc m_broker = null;

        public MessageClientWonikqnc()
        {
            m_broker = new MessageBrokerWonikqnc();
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                string strMessage = message.Message;

                //JObject jHTTP_REQUEST = new JObject();
                //jHTTP_REQUEST.Add("INF_ID", "3RD_MMS_001");
                //jHTTP_REQUEST.Add("EXEC_SYS", "SDMS");

                //JArray jREQUESTs = new JArray();
                //int cnt = 0;

                //foreach (string phoneNumber in message.PhoneNumbers)
                //{
                //    string strReceiver = "수신자" + cnt.ToString();
                //    if (message.EMails?.Count > cnt)                    
                //        strReceiver = message.EMails[cnt];                   

                //    var jREQUEST = new JObject();
                //    jREQUEST.Add("PARAM1", phoneNumber);
                //    jREQUEST.Add("PARAM2", strReceiver);
                //    jREQUEST.Add("PARAM3", strMessage);
                //    jREQUEST.Add("PARAM4", message.Caller);
                //    jREQUEST.Add("PARAM5", "SYSTEM");
                //    jREQUEST.Add("PARAM6", "");
                //    jREQUEST.Add("PARAM7", "");
                //    jREQUEST.Add("PARAM8", "");
                //    jREQUEST.Add("PARAM9", "");
                //    jREQUEST.Add("PARAM10", "");

                //    jREQUESTs.Add(jREQUEST);
                //    cnt++;
                //}

                //jHTTP_REQUEST.Add("REQUEST", jREQUESTs.ToString());

                //JObject jsonData = new JObject();
                //jsonData.Add("HTTP_REQUEST", jHTTP_REQUEST.ToString());


                int cnt = 0;
                JObject _jsonData = null;
                string strJson = null;
                string strErrorMessage = null;

                bool bResult = true;

                string strTag = null;
                if (message.Tag != null && message.Tag.GetType() == typeof(string) && (string)message.Tag == TEMPLATE_CODE)
                    strTag = (string)message.Tag;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders["System-Id"] = SYSTEM_ID;
                dicHeaders["Access-Token"] = ACCESS_TOKEN;


                foreach (string phoneNumber in message.PhoneNumbers)
                {
                    string strReceiver = "수신자" + (cnt + 1);
                    if (message.EMails?.Count > cnt)
                        strReceiver = message.EMails[cnt];

                    _jsonData = new JObject();

                    string strCaller = message.Caller;
                    if (strCaller == null || strCaller == "")
                        strCaller = "안전관리시스템";

                    // HUB_API 방식
                    if (strTag == TEMPLATE_CODE)
                    {   // 카카오톡 방식
                        _jsonData.Add("templateCode", strTag);
                        _jsonData.Add("senderName", strCaller);
                        _jsonData.Add("content", strMessage);
                        _jsonData.Add("receiverNum", phoneNumber);
                        _jsonData.Add("receiverName", strReceiver);
   
                        strJson = _jsonData.ToString();

                        bool _bResult = m_broker.SendQuery(dicHeaders, strJson, URL_SMS, out strErrorMessage, "POST");
                        bResult = bResult & _bResult;
                    }
                    else
                    {   // SMS 방식                        
                        _jsonData.Add("senderName", strCaller);
                        _jsonData.Add("subject", SUBJECT);
                        _jsonData.Add("content", strMessage);
                        _jsonData.Add("receiverNum", phoneNumber);
                        _jsonData.Add("receiverName", strReceiver);

                        strJson = _jsonData.ToString();

                        bool _bResult = m_broker.SendQuery(dicHeaders, strJson, URL_SMS, out strErrorMessage, "POST");
                        bResult = bResult & _bResult;
                    }

                }

                return bResult;
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            return true;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if LGUplus
    public class MessageClientLGUplus : IMessageClient
    {
        private int m_msgBufCount = 10;

        //private string m_strCaller = "028607000"; // 발신번호 고정
        private string m_strCaller = "0616592784";
        private int m_nSMSLimit = 90;
        private MessageBroker m_broker = null;


        public MessageClientLGUplus(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            m_broker = new MessageBroker(dbType, strDBName, strDBHost, strDbId, strDbPw);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                bool isSMS = ClientHelper.IsSMSMessage(message.Message, m_nSMSLimit);

                if (isSMS)
                {
                    bool suc = m_broker.SendSMSMessage(m_strCaller, message.PhoneNumbers, message.Message);
                    return suc;
                }
                else
                {
                    string strTitle = "";
                    ClientHelper.CheckTitle(ref strTitle, message.Message);

                    bool suc = m_broker.SendLMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message);
                    return suc;
                }
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                string strErrorMessage = null;
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker != null && message != null)
            {
                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                    return m_broker.SendLMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message);
                else
                    return m_broker.SendMMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message, message.ContentsList);
            }

            return false;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif

#if LGUplus_TLB
    public class MessageClientLGUplus_TLB : IMessageClient
    {
        private int m_msgBufCount = 10;

        private string m_strCaller = "0616592784";  // 발신번호 고정
        private int m_nSMSLimit = 90;
        private MessageBroker_TLB m_broker = null;


        public MessageClientLGUplus_TLB(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            m_broker = new MessageBroker_TLB(dbType, strDBName, strDBHost, strDbId, strDbPw);
        }

        public void Dispose()
        {

        }

        public bool SendSMS(MessageContent message)
        {
            if (m_broker != null && message != null)
            {
                bool isSMS = ClientHelper.IsSMSMessage(message.Message, m_nSMSLimit);

                if (isSMS)
                {
                    bool suc = m_broker.SendSMSMessage(m_strCaller, message.PhoneNumbers, message.Message);
                    return suc;
                }
                else
                {
                    string strTitle = "";
                    ClientHelper.CheckTitle(ref strTitle, message.Message);

                    bool suc = m_broker.SendLMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message);
                    return suc;
                }
            }

            return false;
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                string strErrorMessage = null;
                if (SendSMS(message) == false)
                    return false;
            }

            return true;
        }

        // strContentPath : 외부 컨텐츠 파일의 경로
        public bool SendMMS(MessageContentMMS message)
        {
            if (m_broker != null && message != null)
            {
                string strTitle = message.Title;
                ClientHelper.CheckTitle(ref strTitle, message.Message);

                if (message.ContentsList.Count == 0)
                    return m_broker.SendLMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message);
                else
                    return m_broker.SendMMSMessage(m_strCaller, message.PhoneNumbers, strTitle, message.Message, message.ContentsList);
            }

            return false;
        }

        public bool SendMMS(List<MessageContentMMS> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContentMMS message in messages)
            {
                if (SendMMS(message) == false)
                    return false;
            }

            return true;
        }

        // 메시지의 길이제한 바이트 수
        public int GetMessageLength()
        {
            // MMS의 최대길이
            return 4000;
        }

        // 이미지, 동영상등을 포함한 MMS를 보낼수 있는가?
        public bool CanUseMMS()
        {
            return true;
        }

        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";

            return m_broker.ErrorMessage;
        }
    }
#endif
    
#if YoungJin_API
    public class MessageClientYoungJin_API : IMessageClient
    {
        //private string strApiUrl = "http://43.200.45.232:5217/api/"; // 외부망 테스트용
        private string strApiUrl = "http://192.168.1.161:9090/api/"; // 운영 내부망
        // YoungJin sender is fixed for now. If this becomes configurable later,
        // normalize it to digits-only before sending, same as receiver handling.
        private string strSender = "0315080041";
        private MessageBroker_YoungJin_API m_broker = null;
        
        public MessageClientYoungJin_API()
        {
            m_broker = new MessageBroker_YoungJin_API();
        }

        public bool SendSMS(MessageContent message)
        {
            return m_broker.SendSMS(message.Message, message.PhoneNumbers, strApiUrl, strSender);
        }

        public bool SendSMS(List<MessageContent> messages)
        {
            if (messages == null || m_broker == null)
                return false;

            foreach (MessageContent message in messages)
            {
                if (SendSMS(message) == false)
                    return false;
            }
            
            return true;
        }
        
        public bool SendMMS(MessageContentMMS message)
        {
            return m_broker.SendSMS(message.Message, message.PhoneNumbers, strApiUrl, strSender);
        }
        
        public bool SendMMS(List<MessageContentMMS> messages)
        {
            return true;
        }

        public void Dispose()
        {
            
        }
        
        public string GetErrorMessage()
        {
            if (m_broker == null)
                return "";
            
            return m_broker.ErrorMessage;
        }
        
        public int GetMessageLength()
        {
            return 140;
        }
        
        public bool CanUseMMS()
        {
            return false;
        }

    }
#endif
}
