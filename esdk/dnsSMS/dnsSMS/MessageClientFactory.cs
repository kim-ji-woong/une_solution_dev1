using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dnsSMS
{
    public class MessageClientFactory
    {
        public static IMessageClient CreateMessageClient(int? dbType = null, string strDBName = null, string strDBHost = null, string strDbId = null, string strDbPw = null, object param = null)
        {
#if UNE_MCS
            return new MessageClientMCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
#elif SKT_MCS
            return new MessageClientSKT_MCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
#elif Soulbrain_MCS
            return new MessageClientSoulbrainMCS(dbType, strDBName, strDBHost, strDbId, strDbPw);
#elif Kakao
            return new MessageClientKakao((IKakaoHelper)param);
#elif Kakaowork
            return new MessageClientKakaowork(/*(Common.IDAL.IDataManager)param1, (SDMS.IDAL.IDataManager)param2*/);
#elif External_UNE_MCS
            return new MessageClientExternalMCS();
#elif Wonikqnc
            return new MessageClientWonikqnc();
#elif LGUplus
            return new MessageClientLGUplus(dbType, strDBName, strDBHost, strDbId, strDbPw);
#elif LGUplus_TLB
            return new MessageClientLGUplus_TLB(dbType, strDBName, strDBHost, strDbId, strDbPw);
#elif YoungJin_API
            return new MessageClientYoungJin_API();
#else
            return new MessageClientDummy();
#endif
        }
    }

    public class MessageContent
    {
        private string m_szMsg = "";
        public string Message
        {
            get { return m_szMsg; }
            set { m_szMsg = value; }
        }

        private string m_szCaller = "";
        public string Caller
        {
            get { return m_szCaller; }
            set { m_szCaller = value; }
        }

        // 수신자 리스트
        private List<string> m_phoneNumberList = new List<string>();
        public List<string> PhoneNumbers
        {
            get { return m_phoneNumberList; }
        }

        // 수신자 리스트 (알림봇)
        private List<string> m_emailList = new List<string>();
        public List<string> EMails
        {
            get { return m_emailList; }
        }

        private object m_tag = null;
        public object Tag
        {
            get { return m_tag; }
            set { m_tag = value; }
        }

        private int? m_nSensorReactionHistoryID = -1;
        public int? SensorReactionHistoryID
        {
            get { return m_nSensorReactionHistoryID; }
            set { m_nSensorReactionHistoryID = value; }
        }
    }

    public class MessageContentMMS : MessageContent
    {
        public enum ContentType { None = 0, Image, Audio, Video };

        private string m_strTitle = "";
        public string Title
        {
            get { return m_strTitle; }
            set { m_strTitle = value; }
        }

        // Value : 외부 컨텐츠의 파일 경로
        private List<KeyValuePair<ContentType, string>> m_contentsList = new List<KeyValuePair<ContentType, string>>();
        public List<KeyValuePair<ContentType, string>> ContentsList
        {
            get { return m_contentsList; }
        }
    }

    public interface IKakaoInfo
    {
        int ID { get; set; }

        int CountryCode { get; set; }

        string SenderKey { get; set; }

        string BsID { get; set; }

        string BsPasswd { get; set; }
    }

    public interface IKakaoHelper
    {
        IKakaoInfo GetKakaoInfo();
        string MakeMessage(int nSensorReactionHistoryID, ref string strTmpltCode, ref string strTitle);
    }
}
