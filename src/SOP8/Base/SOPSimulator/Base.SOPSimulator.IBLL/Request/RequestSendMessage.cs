using System.Collections.Generic;
using Base.SOPManager.IBLL.Models;

namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestSendMessage
    {
        public int ActionStepHistoryNo { get; set; }
        public int ComponentNo { get; set; }
        public int ComponentType { get; set; }
        public int? AccessedUserNo { get; set; }

        private bool m_useSMS = false;
        public bool UseSMS
        {
            get { return m_useSMS; }
            set { m_useSMS = value; }
        }

        private bool m_useEmail = false;
        public bool UseEmail
        {
            get { return m_useEmail; }
            set { m_useEmail = value; }
        }

        private bool m_useBroadcast = false;
        public bool UseBroadcast
        {
            get { return m_useBroadcast; }
            set { m_useBroadcast = value; }
        }

        private bool m_useSiren = false;
        public bool UseSiren
        {
            get { return m_useSiren; }
            set { m_useSiren = value; }
        }

        public string Message { get; set; }

        private List<Receiver> m_receivers = new List<Receiver>();
        public List<Receiver> Receivers
        {
            get { return m_receivers; }
            set { m_receivers = value; }
        }

        public int SiteNo { get; set; }

        private string m_strSubject = "";
        public string Subject
        {
            get { return m_strSubject; }
            set { m_strSubject = value; }
        }
    }
}
