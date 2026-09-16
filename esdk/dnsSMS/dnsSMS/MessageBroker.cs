using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.Manager;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.IO;
using System.Text.Json.Nodes;
using Newtonsoft.Json;
using dnsSMS.LogManager.YoungJin;

namespace dnsSMS
{
    internal class BaseMessageBroker
    {
        protected ILogger m_logger = null;
        protected string m_strErrorMessage = "";

        public string ErrorMessage
        {
            get { return m_strErrorMessage; }
        }

        public ILogger Logger
        {
            get { return m_logger; }
            set { m_logger = value; }
        }

        // strMessage에 작은 따옴표가 들어있는지 검사한다.
        protected string CheckQuotation(string strMessage)
        {
            return strMessage.Replace("'", "''");
        }

        protected string GetCurrentTime(DataManager dataManager)
        {
            return DBManager.GetCurrentTimeString(dataManager);
        }

        protected void WriteLog(string strLog, bool goNextLine = true, bool showTime = true)
        {
            if (m_logger == null)
                return;

            if (showTime)
            {
                if (goNextLine)
                    m_logger.TimeWriteLine(strLog);
                else
                    m_logger.TimeWrite(strLog);
            }
            else
            {
                if (goNextLine)
                    m_logger.WriteLine(strLog);
                else
                    m_logger.Write(strLog);
            }
        }
    }

#if UNE_MCS
    // KT 메시지 서비스 제공업체(모노커뮤니케이션즈)의 라이브러리 직접 사용하는 버전
    internal class MessageBrokerMCS : BaseMessageBroker
    {
        private string m_strDBName = "UNE_SMS";
        private string m_strDBHost = "192.168.0.10";
        private string m_strDbId = "sms";
        private string m_strDbPw = "sms";
        private WebDBManager.DBType m_dbType = WebDBManager.DBType.sqlserver;

        private DataManager m_dataManager = null;
        // 모노커뮤니케이션즈의 MCS 서비스는 사전에 등록된 전화번호만 발신번호로 사용할 수 있음
        private const string m_strCaller = "027144133";
        private const string m_strUserID = "une9966";
        

        public MessageBrokerMCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            if (dbType == null)
                dbType = (int)m_dbType;

            if (strDBName == null)
                strDBName = m_strDBName;

            if (strDBHost == null)
                strDBHost = m_strDBHost;

            if (strDbId == null)
                strDbId = m_strDbId;

            if (strDbPw == null)
                strDbPw = m_strDbPw;

            m_dataManager = new DataManager((int)dbType, strDBHost, strDBName, strDbId, strDbPw);
        }

        public bool SendSMSMessage(List<string> phoneNumberList, string strMessage, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_SMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, SMS_MSG, CALLBACK_URL, NOW_DATE, SEND_DATE, CALLBACK, DEST_TYPE, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, STD_ID) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', NULL, NULL, '{2}', '{3}', 0, {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendLMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', '{2}', '{2}', '{3}', {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, 0, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendMMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strContents = "";
            int nContentsCount = 0;

            foreach (KeyValuePair<MessageContentMMS.ContentType, string> content in contentDatas)
            {
                if (content.Key == MessageContentMMS.ContentType.Image)
                {
                    if (content.Value.Length > 0)
                    {
                        if (strContents.Length == 0)
                            strContents = content.Value + "^1^0";
                        else
                            strContents += "|" + content.Value + "^1^0";

                        nContentsCount++;
                    }
                }
            }

            if (strContents.Length == 0)
                strContents = "NULL";
            else
                strContents = "'" + strContents + "'";

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, '{1}', '{2}', '{3}', '{3}', '{4}', {5}, '{6}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, {7}, {8})",
                m_strUserID, strTitle, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo, nContentsCount, strContents);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        private string GetReceiverInfo(List<string> phoneNumberList, int nBeginIndex, int nEndIndex)
        {
            string strReceivers = "";

            for (int i=nBeginIndex;i<nEndIndex;i++)
            {
                if (strReceivers.Length == 0)
                    strReceivers = "a^" + phoneNumberList[i];
                else
                    strReceivers += "|a^" + phoneNumberList[i];
            }

            return strReceivers;
        }
    }
#endif

#if SKT_MCS
    // KT 메시지 서비스 제공업체(모노커뮤니케이션즈)의 라이브러리 직접 사용하는 버전
    internal class MessageBrokerSKT_MCS : BaseMessageBroker
    {
        private string m_strDBName = "UNE_SMS";
        private string m_strDBHost = "175.106.95.65";
        private string m_strDbId = "sms";
        private string m_strDbPw = "sms";
        private WebDBManager.DBType m_dbType = WebDBManager.DBType.sqlserver;
        private DataManager m_dataManager = null;
        // 모노커뮤니케이션즈의 MCS 서비스는 사전에 등록된 전화번호만 발신번호로 사용할 수 있음
        private const string m_strCaller = "027144133";
        private const string m_strUserID = "une4133";

        public MessageBrokerSKT_MCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            if (dbType == null)
                dbType = (int)m_dbType;

            if (strDBName == null)
                strDBName = m_strDBName;

            if (strDBHost == null)
                strDBHost = m_strDBHost;

            if (strDbId == null)
                strDbId = m_strDbId;

            if (strDbPw == null)
                strDbPw = m_strDbPw;

            m_dataManager = new DataManager((int)dbType, strDBHost, strDBName, strDbId, strDbPw);
        }

        public bool SendSMSMessage(List<string> phoneNumberList, string strMessage, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_SMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, SMS_MSG, CALLBACK_URL, NOW_DATE, SEND_DATE, CALLBACK, DEST_TYPE, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, STD_ID) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', NULL, NULL, '{2}', '{3}', 0, {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendLMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', '{2}', '{2}', '{3}', {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, 0, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendMMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strContents = "";
            int nContentsCount = 0;

            foreach (KeyValuePair<MessageContentMMS.ContentType, string> content in contentDatas)
            {
                if (content.Key == MessageContentMMS.ContentType.Image)
                {
                    if (content.Value.Length > 0)
                    {
                        if (strContents.Length == 0)
                            strContents = content.Value + "^1^0";
                        else
                            strContents += "|" + content.Value + "^1^0";

                        nContentsCount++;
                    }
                }
            }

            if (strContents.Length == 0)
                strContents = "NULL";
            else
                strContents = "'" + strContents + "'";

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, '{1}', '{2}', '{3}', '{3}', '{4}', {5}, '{6}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, {7}, {8})",
                m_strUserID, strTitle, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo, nContentsCount, strContents);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        private string GetReceiverInfo(List<string> phoneNumberList, int nBeginIndex, int nEndIndex)
        {
            string strReceivers = "";

            for (int i = nBeginIndex; i < nEndIndex; i++)
            {
                if (strReceivers.Length == 0)
                    strReceivers = "a^" + phoneNumberList[i];
                else
                    strReceivers += "|a^" + phoneNumberList[i];
            }

            return strReceivers;
        }
    }
#endif

#if Soulbrain_MCS
    // KT 메시지 서비스 제공업체(모노커뮤니케이션즈)의 라이브러리 직접 사용하는 버전
    internal class MessageBrokerSoulbrainMCS : BaseMessageBroker
    {
        private string m_strDBName = "Soulbrain_SMS";
        private WebDBManager.DBType m_dbType = WebDBManager.DBType.sqlserver;
        private string m_strDbId = "sms";
        private string m_strDbPw = "sms";
        private string m_strDBHost = "192.168.254.201";
        private DataManager m_dataManager = null;
        // 모노커뮤니케이션즈의 MCS 서비스는 사전에 등록된 전화번호만 발신번호로 사용할 수 있음
        private const string m_strCaller = "0418400911";
        private const string m_strUserID = "sbsmartesh1";
        // id : sbsmartesh1, pw : sbsmartesh1!

        public MessageBrokerSoulbrainMCS(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            if (dbType == null)
                dbType = (int)m_dbType;

            if (strDBName == null)
                strDBName = m_strDBName;

            if (strDBHost == null)
                strDBHost = m_strDBHost;

            if (strDbId == null)
                strDbId = m_strDbId;

            if (strDbPw == null)
                strDbPw = m_strDbPw;

            m_dataManager = new DataManager((int)dbType, strDBHost, strDBName, strDbId, strDbPw);
        }

        public bool SendSMSMessage(List<string> phoneNumberList, string strMessage, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_SMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, SMS_MSG, CALLBACK_URL, NOW_DATE, SEND_DATE, CALLBACK, DEST_TYPE, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, STD_ID) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', NULL, NULL, '{2}', '{3}', 0, {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendLMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, NULL, '{1}', '{2}', '{2}', '{3}', {4}, '{5}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, 0, NULL)",
                m_strUserID, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        public bool SendMMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas, int nBeginIndex, int nEndIndex)
        {
            m_strErrorMessage = "";

            string strTime = GetCurrentTime(m_dataManager);
            string strReceiverInfo = GetReceiverInfo(phoneNumberList, nBeginIndex, nEndIndex);
            strMessage = CheckQuotation(strMessage);

            string strContents = "";
            int nContentsCount = 0;

            foreach (KeyValuePair<MessageContentMMS.ContentType, string> content in contentDatas)
            {
                if (content.Key == MessageContentMMS.ContentType.Image)
                {
                    if (content.Value.Length > 0)
                    {
                        if (strContents.Length == 0)
                            strContents = content.Value + "^1^0";
                        else
                            strContents += "|" + content.Value + "^1^0";

                        nContentsCount++;
                    }
                }
            }

            if (strContents.Length == 0)
                strContents = "NULL";
            else
                strContents = "'" + strContents + "'";

            string strSQL = "Insert into SDK_MMS_SEND (USER_ID, SCHEDULE_TYPE, SUBJECT, MMS_MSG, NOW_DATE, SEND_DATE, CALLBACK, DEST_COUNT, DEST_INFO, KT_OFFICE_CODE, CDR_ID, RESERVED1, RESERVED2, RESERVED3, RESERVED4, RESERVED5, RESERVED6, RESERVED7, RESERVED8, RESERVED9, ";
            strSQL += "SEND_STATUS, SEND_COUNT, SEND_RESULT, SEND_PROC_TIME, MSG_TYPE, STD_ID, CONTENT_COUNT, CONTENT_DATA) ";
            strSQL += string.Format("values ('{0}', 0, '{1}', '{2}', '{3}', '{3}', '{4}', {5}, '{6}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, NULL, {7}, {8})",
                m_strUserID, strTitle, strMessage, strTime, m_strCaller, phoneNumberList.Count, strReceiverInfo, nContentsCount, strContents);

            return m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage);
        }

        private string GetReceiverInfo(List<string> phoneNumberList, int nBeginIndex, int nEndIndex)
        {
            string strReceivers = "";

            for (int i=nBeginIndex;i<nEndIndex;i++)
            {
                if (strReceivers.Length == 0)
                    strReceivers = "a^" + phoneNumberList[i];
                else
                    strReceivers += "|a^" + phoneNumberList[i];
            }

            return strReceivers;
        }
    }
#endif

#if Kakao
    internal class MessageBrokerKakao : BaseMessageBroker
    {
        private string m_strFrontURL = "https://www.biztalk-api.com";
        private string m_strToken = "";
        private IKakaoHelper m_kakaoHelper = null;
        
        public MessageBrokerKakao(IKakaoHelper kakaoHelper)
        {
            m_kakaoHelper = kakaoHelper;
        }

        public bool SendSMSMessage(MessageContent message)
        {
            m_strErrorMessage = "";

            if (m_kakaoHelper == null)
            {
                m_strErrorMessage = "IKakaoHelper 객체가 정의되지 않았습니다.";
                return false;
            }

            IKakaoInfo info = m_kakaoHelper.GetKakaoInfo();

            if (info == null || info.CountryCode <= 0 || info.SenderKey.Length == 0 || info.BsID.Length == 0 || info.BsPasswd.Length == 0)
            {
                m_strErrorMessage = "메시지 만들 수 없음";
                return false;
            }

            string strTmpltCode = "";
            string strTitle = "";
            string strMessage = "";
            SetMessage(info, message.Message, ref strTmpltCode, ref strMessage);

            if (strTmpltCode.Length == 0 || strMessage.Length == 0)
            {
                m_strErrorMessage = "메시지 만들 수 없음";
                return false;
            }

            GetToken(info.BsID, info.BsPasswd);
            if (m_strToken.Length == 0)
            {
                m_strErrorMessage = "토큰 정보 없음";
                return false;
            }
            //string url = "/v2/kko/sendAlimTalk";    // 단일
            string url = "/v2/kko/sendAlimTalkBatch"; // Batch

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders["bt-token"] = m_strToken;

            try
            {
                AlimTalkParams paramList = new AlimTalkParams();
                paramList.msgList = new List<AlimTalkParam>();

                for (int i = 0; i < message.PhoneNumbers.Count; i++)
                {
                    AlimTalkParam param = new AlimTalkParam();
                    param.msgIdx = i.ToString();
                    param.countryCode = info.CountryCode.ToString();
                    param.resMethod = "PUSH";
                    param.senderKey = info.SenderKey;
                    param.tmpltCode = strTmpltCode;
                    param.message = strMessage;
                    param.recipient = message.PhoneNumbers[i];
                    param.title = strTitle;
                    paramList.msgList.Add(param);
                }

                string strParams = Newtonsoft.Json.JsonConvert.SerializeObject(paramList, Newtonsoft.Json.Formatting.None);
                strParams = strParams.Replace("\\\\r", "\\r").Replace("\\\\n", "\\n");

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_strFrontURL + url);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.Timeout = 5000;

                foreach (KeyValuePair<string, string> pair in dicHeaders)
                {
                    request.Headers.Add(pair.Key, pair.Value);
                }

                //POST할 데이타를 Request Stream에 쓴다
                byte[] bytes = Encoding.UTF8.GetBytes(strParams);
                request.ContentLength = bytes.Length;
                using (Stream reqStream = request.GetRequestStream())
                {
                    reqStream.Write(bytes, 0, bytes.Length);
                }

                try
                {
                    // Response 처리
                    string responseText = string.Empty;
                    using (WebResponse resp = request.GetResponse())
                    {
                        Stream respStream = resp.GetResponseStream();
                        using (StreamReader sr = new StreamReader(respStream))
                        {
                            responseText = sr.ReadToEnd();
                        }
                    }

                    System.Diagnostics.Trace.WriteLine("Response : " + responseText);
                }
                catch (Exception ex)
                {
                    m_strErrorMessage = "[dnsSMS]MessageBrokerMCS.SendSMSMessage Fail : " + ex.Message;
                    return false;
                }

    #region 결과
                //string resultUrl = "/v2/kko/getResultAll";
                //HttpWebRequest request2 = (HttpWebRequest)WebRequest.Create(m_strFrontURL + resultUrl);
                //request2.Method = "GET";
                //request2.ContentType = "application/json";
                //request2.Timeout = 5000;

                //foreach (KeyValuePair<string, string> pair in dicHeaders)
                //{
                //    request2.Headers.Add(pair.Key, pair.Value);
                //}

                //try
                //{
                //    // Response 처리
                //    string responseText = string.Empty;
                //    using (WebResponse resp = request2.GetResponse())
                //    {
                //        Stream respStream = resp.GetResponseStream();
                //        using (StreamReader sr = new StreamReader(respStream))
                //        {
                //            responseText = sr.ReadToEnd();
                //        }
                //    }

                //    System.Diagnostics.Trace.WriteLine("Response : " + responseText);
                //}
                //catch (Exception ex)
                //{
                //    m_strErrorMessage = "[dnsSMS]MessageBrokerMCS.SendSMSMessage Fail : " + ex.Message;
                //    return false;
                //}
    #endregion
            }
            catch (Exception ex)
            {
                m_strErrorMessage = "[dnsSMS]MessageBrokerMCS.SendSMSMessage Fail : " + ex.Message;
                return false;
            }

            return true;
        }

        public bool SendSMSMessage(List<string> phoneNumberList, int nSensorReactionHistoryID)
        {
            m_strErrorMessage = "";

            string strTmpltCode = "";
            string strTitle = "";
            string strMessage = m_kakaoHelper.MakeMessage(nSensorReactionHistoryID, ref strTmpltCode, ref strTitle);
            if (strTmpltCode.Length == 0 || strMessage.Length == 0)
            {
                m_strErrorMessage = "메시지 만들 수 없음";
                return false;
            }

            IKakaoInfo info = m_kakaoHelper.GetKakaoInfo();
            //KakaoInfo info = GetKakaoInfo();
            if (info == null || info.CountryCode <= 0 || info.SenderKey.Length == 0 || info.BsID.Length == 0 || info.BsPasswd.Length == 0)
            {
                m_strErrorMessage = "KakaoInfo Table 정보 없음";
                return false;
            }

            GetToken(info.BsID, info.BsPasswd);
            if (m_strToken.Length == 0)
            {
                m_strErrorMessage = "토큰 정보 없음";
                return false;
            }
            //string url = "/v2/kko/sendAlimTalk";    // 단일
            string url = "/v2/kko/sendAlimTalkBatch"; // Batch

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders["bt-token"] = m_strToken;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_strFrontURL + url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Timeout = 5000;

            foreach (KeyValuePair<string, string> pair in dicHeaders)
            {
                request.Headers.Add(pair.Key, pair.Value);
            }

            AlimTalkParams paramList = new AlimTalkParams();
            paramList.msgList = new List<AlimTalkParam>();

            for (int i = 0; i < phoneNumberList.Count; i++)
            {
                AlimTalkParam param = new AlimTalkParam();
                param.msgIdx = i.ToString();
                param.countryCode = info.CountryCode.ToString();
                param.resMethod = "PUSH";
                param.senderKey = info.SenderKey;
                param.tmpltCode = strTmpltCode;
                param.message = strMessage;
                param.recipient = phoneNumberList[i];
                param.title = strTitle;
                paramList.msgList.Add(param);
            }

            string strParams = Newtonsoft.Json.JsonConvert.SerializeObject(paramList, Newtonsoft.Json.Formatting.None);
            strParams = strParams.Replace("\\\\r", "\\r").Replace("\\\\n", "\\n");

            // POST할 데이타를 Request Stream에 쓴다
            byte[] bytes = Encoding.UTF8.GetBytes(strParams);
            request.ContentLength = bytes.Length; // 바이트수 지정
            using (Stream reqStream = request.GetRequestStream())
            {
                reqStream.Write(bytes, 0, bytes.Length);
            }

            try
            {
                // Response 처리
                string responseText = string.Empty;
                using (WebResponse resp = request.GetResponse())
                {
                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        responseText = sr.ReadToEnd();
                    }
                }

                System.Diagnostics.Trace.WriteLine("Response : " + responseText);
                return true;
            }
            catch (Exception ex)
            {
                m_strErrorMessage = "[dnsSMS]MessageBrokerMCS.SendSMSMessage Fail : " + ex.Message;
            }

            return false;
        }

        private void SetMessage(IKakaoInfo info, string strMessage, ref string strTmpltCode, ref string strReturnMessage)
        {            
            if (info.BsID == "une9966")
            {
                // 유엔이
                strReturnMessage = strMessage;
                strTmpltCode = "test_cleannara"; // 유엔이꺼 깨끗한 나라 탬플릿 코드
            }
            else if (info.BsID == "kleansafety")
            {
                // 깨끗한 나라
                strReturnMessage = strMessage;
                strTmpltCode = "1";

                // BS ID : kleansafety
                // BS명 : kleansafety
                // BS PWD : 2931cf88f515eb558fa09ca186e01689b68ca5a6
                // 채널 발신프로필키 : 2462d6ce747e7d4bde29a23ac41fe5711b5c9be6
                // 템플릿코드 : 1

                // 비즈톡 홈페이지 로그인 ID/PW : kleansafety/kleannara12#
            }
        }
        private void GetToken(string bsID, string passwd)
        {
            string url = "/v2/auth/getToken";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_strFrontURL + url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Timeout = 5000;

            Token token = new Token();
            token.bsid = bsID;
            token.passwd = passwd;

            string strToken = Newtonsoft.Json.JsonConvert.SerializeObject(token);

            // POST할 데이타를 Request Stream에 쓴다
            byte[] bytes = Encoding.UTF8.GetBytes(strToken);
            request.ContentLength = bytes.Length; // 바이트수 지정
            using (Stream reqStream = request.GetRequestStream())
            {
                reqStream.Write(bytes, 0, bytes.Length);
            }

            try
            {
                // Response 처리
                string responseText = string.Empty;
                using (WebResponse resp = request.GetResponse())
                {

                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        responseText = sr.ReadToEnd();
                    }
                }
                //"{\"responseCode\":\"1000\",\"token\":\"eyJhbGciOiJIUzI1NiJ9.eyJic2lkIjoidW5lOTk2NiIsImV4cCI6MTYwNTE3MDcxMywiaWF0IjoxNjA1MDg0MzEzLCJpcEFkZHIiOiIyMTguMTUyLjIwMC4xMjMifQ.w4VBw7_MXcL5wYNGIMKXy0dPXhi-Qquig0o6N_aSh-I\"}"
                System.Diagnostics.Trace.WriteLine("Response : " + responseText);

                TokenResponse tokenRes = Newtonsoft.Json.JsonConvert.DeserializeObject<TokenResponse>(responseText);
                if (tokenRes != null)
                {
                    if (tokenRes.responseCode == "1000")
                    {
                        m_strToken = tokenRes.token;
                    }
                    else
                    {
                        throw new ApplicationException("[Kakao GetToken Error] ResultCode : " + tokenRes.responseCode + ", msg : " + tokenRes.msg);
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
            }
        }

        /// <summary>
        /// 카카오톡은 템플릿 양식에 맞춰서 보내야 전송이 가능하다.
        /// </summary>
        /*private string MakeMessage(int nSensorReactionHistoryID, ref string strTmpltCode, ref string strTitle)
        {
            string returnMessage = "";
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.ReactionType in (0, 21, 50) And {0}.ID = {1}", SensorReactionHistory.TableName, nSensorReactionHistoryID);

            ArrayList arrResult = m_sdmsDataManager.GetSelectManager().JoinHistroysensorreactionSpatialequipmentzoneSensorZone(null,null, null, strCondition, out strErrorMessage);

            if (arrResult == null || arrResult.Count != 3)
                return "";

            SDMS.Model.History.SensorReactionHistory reactionHistory = arrResult[0] as SDMS.Model.History.SensorReactionHistory;
            SDMS.Model.Spatial.EquipmentZone equipmentZone = arrResult[1] as SDMS.Model.Spatial.EquipmentZone;
            SDMS.Model.Sensor.SensorZone sensorZone = arrResult[2] as SDMS.Model.Sensor.SensorZone;

            string varFacilityType = "";
            string varDateTime = reactionHistory.Time.ToString("yyyy-MM-dd HH:mm:ss");
            string varTest = reactionHistory.Message.Contains("[테스트]") ? "[테스트]" : "";
            string varBuilding = equipmentZone.ZoneName;

            if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR)
                varFacilityType = "화재";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
                varFacilityType = "누출";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT)
                varFacilityType = "정전";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND)
                varFacilityType = "강풍";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SUBMERGENCY)
                varFacilityType = "침수";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.TERROR)
                varFacilityType = "테러";
            else if (sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.Earthquake)
                varFacilityType = "지진";

            strTitle = varFacilityType + " 알람 ";

            if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.BEGIN_STATUS) // 알람 탐지
            {
                strTmpltCode = "alarm_detect";
                strTitle += "탐지";
                returnMessage = string.Format("SOP 시스템 {0} 알람 탐지\n{1}\n{2}[{3}]에서 {0} 신호가 탐지되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.MALFUNCTION) // 알람 오작동
            {
                strTmpltCode = "alarm_malfunction";
                strTitle += "오작동";
                returnMessage = string.Format("SOP 시스템 {0} 알람 오작동\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 오작동으로 신고되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }
            else if (reactionHistory.ReactionType == SDMS.Model.History.SensorReactionHistory.ReactionTypes.END_STATUS) // 알람 복구
            {
                strTmpltCode = "alarm_clear";
                strTitle += "복구";
                returnMessage = string.Format("SOP 시스템 {0} 알람 복구\n{1}\n{2}[{3}]에서 탐지된 {0} 신호가 복구되었습니다.", varFacilityType, varDateTime, varTest, varBuilding);
            }

            return returnMessage;
        }*/

        public bool SendLMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, int nBeginIndex, int nEndIndex)
        {            
            return false;
        }

        public bool SendMMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas, int nBeginIndex, int nEndIndex)
        {
            return false;
        }

        private class AlimTalkParams
        {
            public List<AlimTalkParam> msgList { get; set; }
        }

        private class AlimTalkParam
        {
            public string msgIdx { get; set; }
            public string countryCode { get; set; }
            public string resMethod { get; set; }
            public string senderKey { get; set; }
            public string tmpltCode { get; set; }
            public string message { get; set; }
            public string recipient { get; set; }
            public string title { get; set; }
        }

        private class Token
        {
            public string bsid { get; set; }
            public string passwd { get; set; }
        }
        private class TokenResponse
        {
            public string responseCode { get; set; }
            public string token { get; set; }
            public string msg { get; set; }
            public string expireDate { get; set; }
        }
    }
#endif

#if Kakaowork
    internal class MessageBrokerKakaowork : BaseMessageBroker
    {
        private string m_strFrontURL = "https://api.kakaowork.com/v1/";
        private string m_strFindByEmailURL = "users.find_by_email";
        private string m_strConversationsOpenURL = "conversations.open";
        private string m_strMessageSendURL = "messages.send";

        private string m_strAppKey = "06e9c9e5.503c673b75ba435fa3249c5546799df3";//"47f89ebf.6e63d232301f49368ec9dc9a104e7a70";
        //private Common.IDAL.IDataManager m_commonDataManager = null;
        //private SDMS.IDAL.IDataManager m_sdmsDataManager = null;

        public MessageBrokerKakaowork(/*Common.IDAL.IDataManager commonDataManager, SDMS.IDAL.IDataManager sdmsDataManager*/)
        {
            //m_commonDataManager = commonDataManager;
            //m_sdmsDataManager = sdmsDataManager;
        }

        public bool SendSMSMessage(List<string> emails, string strMessage)
        {
            m_strErrorMessage = "";
                        
            try
            {
                foreach (string email in emails)
                {
                    string strUserID = "";
                    string strChatID = "";
                    if (GetUserID(email, ref strUserID))
                    {
                        if (strUserID.Length == 0)
                            continue;

                        if (GetChatID(strUserID, ref strChatID))
                        {
                            if (strChatID.Length == 0)
                                continue;

                            string url = m_strFrontURL + m_strMessageSendURL + "?conversation_id=" + strChatID + "&text=" + strMessage;

                            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                            request.Method = "POST";
                            request.ContentType = "application/json";
                            request.Timeout = 5000;
                            request.Headers.Add("Authorization", "Bearer " + m_strAppKey);
                            request.Headers.Add("Content-Type", "application/json");

                            // Response 처리
                            string responseText = string.Empty;
                            using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
                            {
                                Stream respStream = resp.GetResponseStream();
                                using (StreamReader sr = new StreamReader(respStream))
                                {
                                    responseText = sr.ReadToEnd();

                                    //JObject jobj = JObject.Parse(responseText);
                                    //if (jobj != null && jobj["conversation"] != null && jobj["conversation"]["id"] != null)
                                    //    m_strChatID = lblChatID.Text = jobj["conversation"]["id"].ToString();
                                    //else
                                    //    m_strChatID = lblChatID.Text = "";
                                }
                            }

                            System.Diagnostics.Trace.WriteLine("Response : " + responseText); 
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                m_strErrorMessage = "[dnsSMS]MessageBrokerMCS.SendSMSMessage Fail : " + ex.Message;
            }
            

            return false;
        }

        private bool GetUserID(string strEmail, ref string strUserID)
        {
            if (strEmail.Length == 0)
                return false;

            string url = m_strFrontURL + m_strFindByEmailURL + "?email=" + strEmail;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.ContentType = "application/json";
            request.Timeout = 5000;
            request.Headers.Add("Authorization", "Bearer " + m_strAppKey);
            request.Headers.Add("Content-Type", "application/json");

            try
            {
                // Response 처리
                string responseText = string.Empty;
                using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
                {
                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        responseText = sr.ReadToEnd();

                        JObject jobj = JObject.Parse(responseText);
                        if (Convert.ToBoolean(jobj["success"]))
                        {
                            if (jobj != null && jobj["user"] != null && jobj["user"]["id"] != null)
                                strUserID = jobj["user"]["id"].ToString();
                            else
                                return false;
                        }
                        else
                            return false;

                    }
                }

                //System.Diagnostics.Trace.WriteLine("Response : " + responseText);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                return false;
            }

            return true;
        }

        private bool GetChatID(string strUserID, ref string strChatID)
        {
            if (strUserID.Length == 0)
                return false;

            string url = m_strFrontURL + m_strConversationsOpenURL + "?user_id=" + strUserID;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Timeout = 5000;
            request.Headers.Add("Authorization", "Bearer " + m_strAppKey);
            request.Headers.Add("Content-Type", "application/json");

            try
            {
                // Response 처리
                string responseText = string.Empty;
                using (HttpWebResponse resp = (HttpWebResponse)request.GetResponse())
                {
                    Stream respStream = resp.GetResponseStream();
                    using (StreamReader sr = new StreamReader(respStream))
                    {
                        responseText = sr.ReadToEnd();

                        JObject jobj = JObject.Parse(responseText);
                        if (Convert.ToBoolean(jobj["success"]))
                        {
                            if (jobj != null && jobj["conversation"] != null && jobj["conversation"]["id"] != null)
                                strChatID = jobj["conversation"]["id"].ToString();
                            else
                                return false;
                        }
                        else
                            return false;
                    }
                }

                //System.Diagnostics.Trace.WriteLine("Response : " + responseText);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                return false;
            }

            return true;
        }

        public bool SendLMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, int nBeginIndex, int nEndIndex)
        {
            return false;
        }

        public bool SendMMSMessage(List<string> phoneNumberList, string strMessage, string strTitle, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas, int nBeginIndex, int nEndIndex)
        {
            return false;
        }
    }
#endif

#if External_UNE_MCS
    // 외부에서 UNE_MCS 사용하기 위한 버전
    internal class MessageBrokerExternal_MCS : BaseMessageBroker
    {
        public MessageBrokerExternal_MCS()
        {

        }

        public bool SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";
            string url = "http://221.147.100.161:8099";

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
            request.Method = strMethodType;

            if (dicHeaders != null)
            {
                request.ContentType = "application/json; charset=utf-8";

                // 요청 헤더 추가
                foreach (KeyValuePair<string, string> pair in dicHeaders)
                {
                    string key = pair.Key;
                    string value = pair.Value;
                    request.Headers.Add(key, value);
                }
            }

            string strResponse = "";

            try
            {
                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Status.ToString();
                m_strErrorMessage = strErrorMessage;
                return false;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return false;
            }

            strErrorMessage = "success";
            m_strErrorMessage = "success"; 
            return true;
        }

    }
#endif

#if Wonikqnc
    // 원익 SMS, REST API 방식
    internal class MessageBrokerWonikqnc : BaseMessageBroker
    {
        public MessageBrokerWonikqnc()
        {

        }

        public bool SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";
            string strID = "paranoid";
            string strPw = "survive";
            //string url = "http://eai.wonikqnc.com:7801";
            //string url = "https://w-eai.wonikqnc.com/";       // 원익 URL 수정
            string url = "https://apihub.wonikqnc.com";         // 원익 HUB API 수정

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));

            // Authentication 설정
            //string encoded = System.Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1")
            //                   .GetBytes(strID + ":" + strPw));
            //request.Headers.Add("Authorization", "Basic " + encoded);


            request.Method = strMethodType;

            if (dicHeaders != null)
            {
                request.ContentType = "application/json; charset=utf-8";

                // 요청 헤더 추가
                foreach (KeyValuePair<string, string> pair in dicHeaders)
                {
                    string key = pair.Key;
                    string value = pair.Value;
                    request.Headers.Add(key, value);
                }
            }

            string strResponse = "";

            try
            {
                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Status.ToString();
                m_strErrorMessage = strErrorMessage;
                return false;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return false;
            }

            strErrorMessage = "success";
            m_strErrorMessage = "success"; 
            return true;
        }

    }
#endif

#if LGUplus
    internal class MessageBroker : BaseMessageBroker 
    {
        private string m_strDBName = "LgSMS";
        private string m_strDBHost = "127.0.0.1";
        private string m_strDbId = "sms";
        private string m_strDbPw = "sms";
        private WebDBManager.DBType m_dbType = WebDBManager.DBType.sqlserver;
        private DataManager m_dataManager = null;

        public MessageBroker(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            if (dbType == null)
                dbType = (int)m_dbType;

            if (strDBName == null)
                strDBName = m_strDBName;

            if (strDBHost == null)
                strDBHost = m_strDBHost;

            if (strDbId == null)
                strDbId = m_strDbId;

            if (strDbPw == null)
                strDbPw = m_strDbPw;

            m_dataManager = new DataManager((int)dbType, strDBHost, strDBName, strDbId, strDbPw);
        }

        public bool SendSMSMessage(string strCaller, List<string> phoneNumberList, string strMessage)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            foreach (string phoneNumber in phoneNumberList)
            {
                string strSQL = "INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)  ";
                strSQL += string.Format("VALUES ('{0}', '0', '0', '{1}', '{2}', '{3}')", strTime, phoneNumber, strCaller, strMessage);

                if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                {
                    m_strErrorMessage = "[libSMS]MessageBroker.SendSMSMessage Fail : " + m_strErrorMessage + "    / date : " + strTime;
                    WriteLog(m_strErrorMessage);
                    return false;
                }
            }

            return true;
        }

        // LMS (멀티미디어 컨텐츠 미첨부)
        public bool SendLMSMessage(string strCaller, List<string> phoneNumberList, string strTitle, string strMessage)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            foreach (string phoneNumber in phoneNumberList)
            {
                string strSQL = "INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE) ";
                strSQL += string.Format("VALUES ('{0}', '{1}', '{2}', '0', '{3}', '{4}', '0')",
                    strTitle, phoneNumber, strCaller, strTime, strMessage);

                if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                {
                    m_strErrorMessage = "[libSMS]MessageBroker.SendLMSMessage Fail : " + m_strErrorMessage;
                    return false;
                }
            }

            return true;
        }

        // MMS (멀티미디어 컨텐츠 첨부)
        public bool SendMMSMessage(string strCaller, List<string> phoneNumberList, string strTitle, string strMessage, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            if (contentDatas != null && contentDatas.Count > 0)
            {
                string path = contentDatas[0].Value;
                foreach (string phoneNumber in phoneNumberList)
                {
                    string strSQL = "INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, FILE_CNT, FILE_PATH1, TYPE)";
                    strSQL += string.Format("VALUES ('{0}', '{1}', '{2}', '0', '{3}', '{4}', '1', '{5}', '0')",
                        strTitle, phoneNumber, strCaller, strTime, strMessage, path);

                    if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                    {
                        m_strErrorMessage = "[libSMS]MessageBroker.SendMMSMessage Fail : " + m_strErrorMessage;
                        return false;
                    }
                }
            }

            return true;
        }
    }
#endif

#if LGUplus_TLB
    internal class MessageBroker_TLB : BaseMessageBroker
    {
        private string m_strDBName = "LgSMS";
        private string m_strDBHost = "127.0.0.1";
        private string m_strDbId = "sms";
        private string m_strDbPw = "sms";
        private WebDBManager.DBType m_dbType = WebDBManager.DBType.mysql;
        private DataManager m_dataManager = null;

        public MessageBroker_TLB(int? dbType, string strDBName, string strDBHost, string strDbId, string strDbPw)
        {
            if (dbType == null)
                dbType = (int)m_dbType;

            if (strDBName == null)
                strDBName = m_strDBName;

            if (strDBHost == null)
                strDBHost = m_strDBHost;

            if (strDbId == null)
                strDbId = m_strDbId;

            if (strDbPw == null)
                strDbPw = m_strDbPw;

            m_dataManager = new DataManager((int)dbType, strDBHost, strDBName, strDbId, strDbPw);
        }

        public bool SendSMSMessage(string strCaller, List<string> phoneNumberList, string strMessage)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            foreach (string phoneNumber in phoneNumberList)
            {
                string strSQL = "INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)  ";
                strSQL += string.Format("VALUES ('{0}', '0', '0', '{1}', '{2}', '{3}')", strTime, phoneNumber, strCaller, strMessage);

                if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                {
                    m_strErrorMessage = "[libSMS]MessageBroker.SendSMSMessage Fail : " + m_strErrorMessage + "    / date : " + strTime;
                    WriteLog(m_strErrorMessage);
                    return false;
                }
            }

            return true;
        }

        // LMS (멀티미디어 컨텐츠 미첨부)
        public bool SendLMSMessage(string strCaller, List<string> phoneNumberList, string strTitle, string strMessage)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            foreach (string phoneNumber in phoneNumberList)
            {
                string strSQL = "INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE) ";
                strSQL += string.Format("VALUES ('{0}', '{1}', '{2}', '0', '{3}', '{4}', '0')",
                    strTitle, phoneNumber, strCaller, strTime, strMessage);

                if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                {
                    m_strErrorMessage = "[libSMS]MessageBroker.SendLMSMessage Fail : " + m_strErrorMessage;
                    return false;
                }
            }

            return true;
        }

        // MMS (멀티미디어 컨텐츠 첨부)
        public bool SendMMSMessage(string strCaller, List<string> phoneNumberList, string strTitle, string strMessage, List<KeyValuePair<MessageContentMMS.ContentType, string>> contentDatas)
        {
            string strTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            strMessage = CheckQuotation(strMessage);

            m_strErrorMessage = "";

            if (contentDatas != null && contentDatas.Count > 0)
            {
                string path = contentDatas[0].Value;
                foreach (string phoneNumber in phoneNumberList)
                {
                    string strSQL = "INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, FILE_CNT, FILE_PATH1, TYPE)";
                    strSQL += string.Format("VALUES ('{0}', '{1}', '{2}', '0', '{3}', '{4}', '1', '{5}', '0')",
                        strTitle, phoneNumber, strCaller, strTime, strMessage, path);

                    if (m_dataManager.GetCreate().Insert(strSQL, out m_strErrorMessage) == false)
                    {
                        m_strErrorMessage = "[libSMS]MessageBroker.SendMMSMessage Fail : " + m_strErrorMessage;
                        return false;
                    }
                }
            }

            return true;
        }
    }
#endif

#if YoungJin_API
    internal class MessageBroker_YoungJin_API : BaseMessageBroker
    {
        private const int RequestTimeoutMs = 3000;
        private const string SuccessRegistered = "SUCCESS_REGISTERED";
        private const string SuccessAcceptedNoIndex = "SUCCESS_ACCEPTED_NO_INDEX";
        private const string ResponseShapeSpecNested = "spec_nested";
        private const string ResponseShapeTopLevel = "top_level";
        private readonly YoungJinLogManager m_logManager;

        private class YoungJinRegisterResponse
        {
            public string ResultMessage { get; set; }
            public string SmsIndex { get; set; }
            public string ResultCode { get; set; }
            public string ResponseShape { get; set; }
            public string ParseWarning { get; set; }
        }

        private string CreateBatchId()
        {
            return $"YJ-{DateTime.Now:yyyyMMdd-HHmmssfff}-{Guid.NewGuid().ToString("N").Substring(0, 8)}";
        }
        
        public MessageBroker_YoungJin_API()
        {
            string logRootPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "UNE", "Logs", "Sms");
            m_logManager = new YoungJinLogManager(logRootPath);
        }

        private string ReadResponseText(WebResponse response)
        {
            if (response == null)
                return "";

            using (var stream = response.GetResponseStream())
            {
                if (stream == null)
                    return "";

                using (var streamReader = new StreamReader(stream, Encoding.UTF8))
                {
                    return streamReader.ReadToEnd();
                }
            }
        }

        private bool TryParseRegisterResponse(string responseText, string expectedSender, string expectedReceiver, string expectedMessage, string expectedAlarmType, out YoungJinRegisterResponse registerResponse, out string strError)
        {
            registerResponse = null;
            strError = null;

            if (string.IsNullOrWhiteSpace(responseText))
            {
                strError = "response body is empty";
                return false;
            }

            try
            {
                JObject json = JObject.Parse(responseText);
                string message = json["message"]?.ToString();
                JToken dataToken = json["data"];
                string nestedSmsIndex = dataToken?["sms_idx"]?.ToString();
                string nestedSender = dataToken?["sender"]?.ToString();
                string nestedReceiver = dataToken?["receiver"]?.ToString();
                string nestedMessage = dataToken?["sms_txt"]?.ToString();
                string nestedAlarmType = dataToken?["alarm_type"]?.ToString();

                string topLevelSmsIndex = json["sms_idx"]?.ToString();
                string topLevelSender = json["sender"]?.ToString();
                string topLevelReceiver = json["receiver"]?.ToString();
                string topLevelMessage = json["sms_txt"]?.ToString();
                string topLevelAlarmType = json["alarm_type"]?.ToString();

                if (string.IsNullOrWhiteSpace(message) == false &&
                    string.Equals(message, "insert success", StringComparison.OrdinalIgnoreCase) == false)
                {
                    strError = $"unexpected response.message: {message}";
                    return false;
                }

                if (TryBuildRegisteredResponse(message, nestedSmsIndex, ResponseShapeSpecNested, out registerResponse))
                {
                    return true;
                }

                if (TryBuildRegisteredResponse(message, topLevelSmsIndex, ResponseShapeTopLevel, out registerResponse))
                {
                    return true;
                }

                if (TryBuildAcceptedResponse(
                    message,
                    nestedSmsIndex,
                    nestedSender,
                    nestedReceiver,
                    nestedMessage,
                    nestedAlarmType,
                    expectedSender,
                    expectedReceiver,
                    expectedMessage,
                    expectedAlarmType,
                    ResponseShapeSpecNested,
                    out registerResponse))
                {
                    return true;
                }

                if (TryBuildAcceptedResponse(
                    message,
                    topLevelSmsIndex,
                    topLevelSender,
                    topLevelReceiver,
                    topLevelMessage,
                    topLevelAlarmType,
                    expectedSender,
                    expectedReceiver,
                    expectedMessage,
                    expectedAlarmType,
                    ResponseShapeTopLevel,
                    out registerResponse))
                {
                    return true;
                }

                if (dataToken != null)
                {
                    strError = BuildResponseMismatchError(
                        ResponseShapeSpecNested,
                        expectedSender,
                        expectedReceiver,
                        expectedMessage,
                        expectedAlarmType,
                        nestedSender,
                        nestedReceiver,
                        nestedMessage,
                        nestedAlarmType,
                        message,
                        nestedSmsIndex);
                }
                else
                {
                    strError = BuildResponseMismatchError(
                        ResponseShapeTopLevel,
                        expectedSender,
                        expectedReceiver,
                        expectedMessage,
                        expectedAlarmType,
                        topLevelSender,
                        topLevelReceiver,
                        topLevelMessage,
                        topLevelAlarmType,
                        message,
                        topLevelSmsIndex);
                }

                return false;
            }
            catch (Exception ex)
            {
                strError = "response parse failed: " + ex.Message;
                return false;
            }
        }

        private bool TryBuildRegisteredResponse(string responseMessage, string smsIndex, string responseShape, out YoungJinRegisterResponse registerResponse)
        {
            registerResponse = null;

            if (string.IsNullOrWhiteSpace(smsIndex))
                return false;

            registerResponse = new YoungJinRegisterResponse
            {
                ResultCode = SuccessRegistered,
                ResultMessage = responseMessage,
                SmsIndex = smsIndex,
                ResponseShape = responseShape,
                ParseWarning = BuildParseWarning(responseMessage, smsIndex)
            };

            return true;
        }

        private bool TryBuildAcceptedResponse(
            string responseMessage,
            string smsIndex,
            string sender,
            string receiver,
            string messageText,
            string alarmType,
            string expectedSender,
            string expectedReceiver,
            string expectedMessage,
            string expectedAlarmType,
            string responseShape,
            out YoungJinRegisterResponse registerResponse)
        {
            registerResponse = null;

            if (string.IsNullOrWhiteSpace(smsIndex) == false)
                return false;

            if (ResponseMatchesRequestEcho(expectedSender, expectedReceiver, expectedMessage, expectedAlarmType, sender, receiver, messageText, alarmType) == false)
                return false;

            registerResponse = new YoungJinRegisterResponse
            {
                ResultCode = SuccessAcceptedNoIndex,
                ResultMessage = responseMessage,
                SmsIndex = "",
                ResponseShape = responseShape,
                ParseWarning = BuildParseWarning(responseMessage, smsIndex)
            };

            return true;
        }

        private bool ResponseMatchesRequestEcho(
            string expectedSender,
            string expectedReceiver,
            string expectedMessage,
            string expectedAlarmType,
            string responseSender,
            string responseReceiver,
            string responseMessage,
            string responseAlarmType)
        {
            return ValuesEqual(expectedSender, responseSender) &&
                   ValuesEqual(NormalizeReceiverText(expectedReceiver), NormalizeReceiverText(responseReceiver)) &&
                   ValuesEqual(expectedMessage, responseMessage) &&
                   ValuesEqual(expectedAlarmType, responseAlarmType);
        }

        private string BuildResponseMismatchError(
            string responseShape,
            string expectedSender,
            string expectedReceiver,
            string expectedMessage,
            string expectedAlarmType,
            string responseSender,
            string responseReceiver,
            string responseMessage,
            string responseAlarmType,
            string resultMessage,
            string smsIndex)
        {
            if (string.IsNullOrWhiteSpace(resultMessage))
                return $"{responseShape} response.message is empty";

            return $"{responseShape} response mismatch: expected sender={expectedSender}, receiver={expectedReceiver}, alarm_type={expectedAlarmType}; actual sender={responseSender}, receiver={responseReceiver}, alarm_type={responseAlarmType}, sms_idx={smsIndex}, message={resultMessage}, sms_txt={responseMessage}";
        }

        private string BuildParseWarning(string responseMessage, string smsIndex)
        {
            var warnings = new List<string>();

            if (string.IsNullOrWhiteSpace(responseMessage))
                warnings.Add("missing_message");

            if (string.IsNullOrWhiteSpace(smsIndex))
                warnings.Add("missing_sms_idx");

            return string.Join(",", warnings);
        }

        private bool ValuesEqual(string left, string right)
        {
            return string.Equals((left ?? "").Trim(), (right ?? "").Trim(), StringComparison.Ordinal);
        }

        private string NormalizeReceiverText(string receiverText)
        {
            if (string.IsNullOrWhiteSpace(receiverText))
                return "";

            string[] parts = receiverText.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            var normalized = new List<string>();

            foreach (string part in parts)
            {
                string value = (part ?? "").Trim().Replace("-", "");
                if (value.Length > 0)
                    normalized.Add(value);
            }

            return string.Join(",", normalized);
        }

        private List<string> NormalizeReceivers(List<string> phoneNumberList)
        {
            var receivers = new List<string>();

            if (phoneNumberList == null)
                return receivers;

            foreach (string phoneNumber in phoneNumberList)
            {
                if (string.IsNullOrWhiteSpace(phoneNumber))
                    continue;

                string[] splitReceivers = phoneNumber.Split(',');
                foreach (string receiver in splitReceivers)
                {
                    string normalizedReceiver = receiver == null ? "" : receiver.Trim().Replace("-", "");
                    if (normalizedReceiver.Length == 0)
                        continue;

                    receivers.Add(normalizedReceiver);
                }
            }

            return receivers;
        }

        public bool SendSMS(string strMessage, List<string> phoneNumberList, string apiUrl, string strSender)
        {
            if (phoneNumberList == null || phoneNumberList.Count == 0)
            {
                m_strErrorMessage = "phoneNumberList is null or empty";
                return false;
            }
            if (string.IsNullOrEmpty(strSender))
            {
                m_strErrorMessage = "Sender is null or empty";
                return false;
            }
            if (string.IsNullOrEmpty(apiUrl))
            {
                m_strErrorMessage = "ApiUrl is null or empty";
                return false;
            }
            if (string.IsNullOrEmpty(strMessage))
            {
                m_strErrorMessage = "Message is null or empty";
                return false;
            }

            var endpoint = $"{apiUrl.TrimEnd('/')}/sms/content";

            try
            {
                string batchId = CreateBatchId();
                List<string> normalizedReceivers = NormalizeReceivers(phoneNumberList);
                int totalReceiverCount = normalizedReceivers.Count;
                int validReceiverCount = normalizedReceivers.Count;
                int successCount = 0;
                int failCount = 0;
                bool hasFailure = false;
                var batchWatch = System.Diagnostics.Stopwatch.StartNew();

                m_logManager.LogBatchStart(batchId, endpoint, strSender, totalReceiverCount, RequestTimeoutMs);

                if (validReceiverCount == 0)
                {
                    m_strErrorMessage = "phoneNumberList does not contain a valid receiver";
                    m_logManager.LogBatchEnd(batchId, "FAIL_INPUT", totalReceiverCount, validReceiverCount, successCount, failCount, batchWatch.ElapsedMilliseconds, m_strErrorMessage);
                    return false;
                }

                string receiverText = string.Join(",", normalizedReceivers);
                var smsData = new
                {
                    sender = strSender,
                    receiver = receiverText,
                    sms_txt = strMessage,
                    alarm_type = "0"
                };

                var jsonBody = JsonConvert.SerializeObject(smsData);
                var data = Encoding.UTF8.GetBytes(jsonBody);

                var request = (HttpWebRequest)WebRequest.Create(endpoint);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.ContentLength = data.Length;
                request.Timeout = RequestTimeoutMs;
                request.ReadWriteTimeout = RequestTimeoutMs;
                var requestWatch = System.Diagnostics.Stopwatch.StartNew();

                try
                {
                    using (var stream = request.GetRequestStream())
                    {
                        stream.Write(data, 0, data.Length);
                    }

                    using (var response = (HttpWebResponse)request.GetResponse())
                    {
                        var responseText = ReadResponseText(response);

                        if (response.StatusCode != HttpStatusCode.OK && response.StatusCode != HttpStatusCode.Created)
                        {
                            hasFailure = true;
                            failCount = validReceiverCount;
                            m_strErrorMessage = $"receiver={receiverText}, HTTP Error {(int)response.StatusCode} ({response.StatusCode}), response={responseText}";
                            YoungJinAuditWriteResult auditResult = m_logManager.WriteFailureAudit("FAIL_HTTP", batchId, endpoint, strSender, receiverText, jsonBody, responseText, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, validReceiverCount, m_strErrorMessage);
                            m_logManager.LogRecipientHttpFailure(batchId, receiverText, strSender, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, responseText, auditResult);
                        }
                        else if (TryParseRegisterResponse(responseText, strSender, receiverText, strMessage, "0", out YoungJinRegisterResponse registerResponse, out string parseError) == false)
                        {
                            hasFailure = true;
                            failCount = validReceiverCount;
                            m_strErrorMessage = $"receiver={receiverText}, parseError={parseError}, response={responseText}";
                            YoungJinAuditWriteResult auditResult = m_logManager.WriteFailureAudit("FAIL_PARSE", batchId, endpoint, strSender, receiverText, jsonBody, responseText, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, validReceiverCount, m_strErrorMessage);
                            m_logManager.LogRecipientParseFailure(batchId, receiverText, strSender, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, parseError, responseText, auditResult);
                        }
                        else
                        {
                            successCount = validReceiverCount;
                            YoungJinAuditWriteResult auditResult = m_logManager.WriteSuccessAudit(batchId, endpoint, strSender, receiverText, jsonBody, responseText, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, validReceiverCount, registerResponse.SmsIndex, registerResponse.ResultCode, registerResponse.ResultMessage, registerResponse.ResponseShape, registerResponse.ParseWarning);
                            m_logManager.LogRecipientSuccess(batchId, receiverText, strSender, ((int)response.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, registerResponse.SmsIndex, registerResponse.ResultMessage, registerResponse.ResultCode, registerResponse.ResponseShape, registerResponse.ParseWarning, auditResult);
                            System.Diagnostics.Trace.WriteLine($"YoungJin SMS registered for {receiverText}, sms_idx={registerResponse.SmsIndex}");
                        }
                    }
                }
                catch (WebException ex)
                {
                    hasFailure = true;
                    failCount = validReceiverCount;
                    string responseText = ReadResponseText(ex.Response);
                    string statusText = ex.Status.ToString();

                    if (ex.Status == WebExceptionStatus.Timeout)
                    {
                        m_strErrorMessage = $"receiver={receiverText}, timeout={RequestTimeoutMs}ms, response={responseText}";
                        YoungJinAuditWriteResult auditResult = m_logManager.WriteFailureAudit("FAIL_TIMEOUT", batchId, endpoint, strSender, receiverText, jsonBody, responseText, "", requestWatch.ElapsedMilliseconds, validReceiverCount, m_strErrorMessage);
                        m_logManager.LogRecipientTimeout(batchId, receiverText, strSender, requestWatch.ElapsedMilliseconds, RequestTimeoutMs, responseText, auditResult);
                    }
                    else
                    {
                        HttpWebResponse httpResponse = ex.Response as HttpWebResponse;
                        if (httpResponse != null)
                            m_strErrorMessage = $"receiver={receiverText}, webExceptionStatus={statusText}, HTTP Error {(int)httpResponse.StatusCode} ({httpResponse.StatusCode}), response={responseText}";
                        else
                            m_strErrorMessage = $"receiver={receiverText}, webExceptionStatus={statusText}, response={responseText}";

                        YoungJinAuditWriteResult auditResult = m_logManager.WriteFailureAudit("FAIL_HTTP", batchId, endpoint, strSender, receiverText, jsonBody, responseText, httpResponse == null ? "" : ((int)httpResponse.StatusCode).ToString(), requestWatch.ElapsedMilliseconds, validReceiverCount, m_strErrorMessage);
                        m_logManager.LogRecipientException(batchId, receiverText, strSender, requestWatch.ElapsedMilliseconds, "FAIL_HTTP", statusText, httpResponse == null ? "" : ((int)httpResponse.StatusCode).ToString(), responseText, auditResult);
                    }
                }
                catch (Exception ex)
                {
                    hasFailure = true;
                    failCount = validReceiverCount;
                    m_strErrorMessage = $"receiver={receiverText}, exception={ex.Message}";
                    YoungJinAuditWriteResult auditResult = m_logManager.WriteFailureAudit("FAIL_EXCEPTION", batchId, endpoint, strSender, receiverText, jsonBody, "", "", requestWatch.ElapsedMilliseconds, validReceiverCount, m_strErrorMessage);
                    m_logManager.LogRecipientException(batchId, receiverText, strSender, requestWatch.ElapsedMilliseconds, "FAIL_EXCEPTION", ex.Message, "", "", auditResult);
                }

                m_logManager.LogBatchEnd(batchId, hasFailure ? "FAIL" : "SUCCESS", totalReceiverCount, validReceiverCount, successCount, failCount, batchWatch.ElapsedMilliseconds);

                return hasFailure == false;
            }
            catch (Exception ex)
            {
                m_strErrorMessage = ex.Message;
                m_logManager.LogError(ex.Message);
                return false;
            }
            
        }
    }
#endif

}
