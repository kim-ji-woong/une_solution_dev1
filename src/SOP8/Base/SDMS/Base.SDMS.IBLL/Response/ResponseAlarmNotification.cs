using System.Collections.Generic;
using Response;
using Base.Model.Common.Team;
using Base.Model.Alarm;

namespace Base.SDMS.IBLL.Response
{
    using Models;

    public class ResponseAlarmNotifications : MessageResult
    {
        private List<AlarmNotification> m_notifications = new List<AlarmNotification>();
        private int m_nTotalCount = 0;

        public List<AlarmNotification> Notifications
        {
            get { return m_notifications; }
            set { m_notifications = value; }
        }

        public int TotalCount
        {
            get { return m_nTotalCount; }
            set { m_nTotalCount = value; }
        }

        public ResponseAlarmNotifications()
            : base()
        {
        }

        public ResponseAlarmNotifications(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseAlarmNotifications(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }

    public class ResponseAlarmNotification : MessageResult
    {
        private AlarmNotification m_notification = null;

        public AlarmNotification Notification
        {
            get { return m_notification; }
            set { m_notification = value; }
        }

        public ResponseAlarmNotification()
            : base()
        {
        }

        public ResponseAlarmNotification(bool success, string message)
            : base(success, message)
        {
        }

        public ResponseAlarmNotification(bool success, string message, int errorCode)
            : base(success, message, errorCode)
        {
        }
    }

    public class AlarmNotification
    {
        private int m_nNotificationNo = -1;
        private string m_strNotifyMessage = "";
        private string m_strNotificationName = "";
        private bool m_isActive = true;
        private string m_strDetectType = "";
        private string m_strSensorTypeName = "";
        private int m_nSensorType = -1;
        private int? m_sensorSubType = null;
        private List<Regular> m_regulars = new List<Regular>();
        private List<RegularMemberEx> m_regularMembers = new List<RegularMemberEx>();
        private List<Temporary> m_temporaries = new List<Temporary>();
        private List<TemporaryMember> m_temporaryMembers = new List<TemporaryMember>();

        public int NotificationNo
        {
            get { return m_nNotificationNo; }
            set { m_nNotificationNo = value; }
        }

        public string NotifyMessage
        {
            get { return m_strNotifyMessage; }
            set { m_strNotifyMessage = value; }
        }

        public string NotificationName
        {
            get { return m_strNotificationName; }
            set { m_strNotificationName = value; }
        }

        public bool IsActive
        {
            get { return m_isActive; }
            set { m_isActive = value; }
        }

        public string DetectType
        {
            get { return m_strDetectType; }
            set { m_strDetectType = value; }
        }

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        public List<Regular> Regulars
        {
            get { return m_regulars; }
            set { m_regulars = value; }
        }

        public List<RegularMemberEx> RegularMembers
        {
            get { return m_regularMembers; }
            set { m_regularMembers = value; }
        }

        public List<Temporary> Temporaries
        {
            get { return m_temporaries; }
            set { m_temporaries = value; }
        }

        public List<TemporaryMember> TemporaryMembers
        {
            get { return m_temporaryMembers; }
            set { m_temporaryMembers = value; }
        }

        public AlarmNotification()
        {
        }

        public AlarmNotification(NotificationMessage message)
        {
            this.FromCopy(message);
        }

        public void FromCopy(NotificationMessage message)
        {
            this.NotificationNo = message.ntcn_sn;
            this.NotifyMessage = message.mssage;
            this.NotificationName = message.ntcn_name;
            this.IsActive = message.acti;
        }
    }
}
