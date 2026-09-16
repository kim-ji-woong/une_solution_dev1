namespace Base.SDMS.IBLL.Request
{
    public class RequestDeleteAlarmNotification
    {
        private int m_nNotificationNo = -1;

        public int NotificationNo
        {
            get { return m_nNotificationNo; }
            set { m_nNotificationNo = value; }
        }
    }
}
