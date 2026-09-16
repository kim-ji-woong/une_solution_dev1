using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using Base.Model.Alarm;
using System.Collections.Generic;
using Base.Model.Common.Team;
using Response;
using dnsData.CommonCode;
using Base.SDMS.IBLL.Models;
using Base.DAL;
using dnsDapperDBUtil;
using Newtonsoft.Json.Linq;

namespace Base.SDMS.BLL.Process
{
    class AlarmNotifyManager
    {
        private IDataManager m_dataManager = null;

        public AlarmNotifyManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAlarmNotifications RequestAlarmNotification(RequestAlarmNotification data)
        {
            if (data.SortType != null)
                return RequestAlarmNotificationBySort(data);

            string strErrorMessage;
            int totalCount;
            string strCondition = GetAlarmNotificationCondition(m_dataManager, data.SensorType, data.SensorSubType, data.MessageType, data.DetectType, data.ZoneNo, data.BuildingNo, data.BuildingGroupNo, data.IsActive);
            IEnumerable<NotificationMessage> notificationMessages = ReadNotificationMessages(data, strCondition, out totalCount, out strErrorMessage);
            //IEnumerable<NotificationMessage> notificationMessages = m_dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);

            if (notificationMessages == null)
            {
                if (strErrorMessage != null)
                    return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                else
                    return new ResponseAlarmNotifications(true, "");
            }

            string strNotificationNos = null;

            foreach (var notificationMessage in notificationMessages)
            {
                if (strNotificationNos == null)
                    strNotificationNos = notificationMessage.ntcn_sn.ToString();
                else
                    strNotificationNos += "," + notificationMessage.ntcn_sn.ToString();
            }

            if (strNotificationNos == null)
                return new ResponseAlarmNotifications(true, "");

            ResponseAlarmNotifications response = new ResponseAlarmNotifications(true, "");
            response.TotalCount = totalCount;

            Dictionary<int, NotificationMessage> dicNotificationMessages = GetReceivers(m_dataManager, strNotificationNos, notificationMessages, response.Notifications, data.SearchTextTypes?.DetectTypes, data.SensorTypeDatas, out strErrorMessage);

            if (dicNotificationMessages == null)
                return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (data.SearchTextTypes != null && data.SearchText != null && data.SearchText.Trim().Length > 0)
            {
                if (CheckSearchText(response, data, dicNotificationMessages, out totalCount, out strErrorMessage) == false)
                    return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

                response.TotalCount = totalCount;
            }

            return response;
        }

        private ResponseAlarmNotifications RequestAlarmNotificationBySort(RequestAlarmNotification data)
        {
            string strErrorMessage;
            string strCondition = GetAlarmNotificationCondition(m_dataManager, data.SensorType, data.SensorSubType, data.MessageType, data.DetectType, data.ZoneNo, data.BuildingNo, data.BuildingGroupNo, data.IsActive);
            IEnumerable<NotificationMessage> notificationMessages = ReadNotificationMessagesAll(strCondition, out strErrorMessage);

            if (notificationMessages == null)
            {
                if (strErrorMessage != null)
                    return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                else
                    return new ResponseAlarmNotifications(true, "");
            }

            string strNotificationNos = null;

            foreach (var notificationMessage in notificationMessages)
            {
                if (strNotificationNos == null)
                    strNotificationNos = notificationMessage.ntcn_sn.ToString();
                else
                    strNotificationNos += "," + notificationMessage.ntcn_sn.ToString();
            }

            if (strNotificationNos == null)
                return new ResponseAlarmNotifications(true, "");

            ResponseAlarmNotifications response = new ResponseAlarmNotifications(true, "");
            Dictionary<int, NotificationMessage> dicNotificationMessages = GetReceivers(m_dataManager, strNotificationNos, notificationMessages, response.Notifications, data.SearchTextTypes?.DetectTypes, data.SensorTypeDatas, out strErrorMessage);

            if (dicNotificationMessages == null)
                return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            int totalCount = response.Notifications.Count;

            if (data.SearchTextTypes != null && data.SearchText != null && data.SearchText.Trim().Length > 0)
            {
                RequestAlarmNotification searchData = CreateSortSearchRequest(data);

                if (CheckSearchText(response, searchData, dicNotificationMessages, out totalCount, out strErrorMessage) == false)
                    return new ResponseAlarmNotifications(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            ApplyAlarmNotificationSort(response.Notifications, (int)data.SortType, data.SortMethod);
            ApplyPaging(response.Notifications, data.PageIndex, data.PageItemCount);
            response.TotalCount = totalCount;

            return response;
        }

        // 재난신고
        public ResponseNotifyAlarm NotifyAlarm(NotifyAlarm data, string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null || strSopWebServerUrl.Length == 0)
                return new ResponseNotifyAlarm(false, "알람을 전달할 URL이 지정되지 않았습니다.", ErrorCode.NoParameters);

            string strUrl = strSopWebServerUrl.EndsWith("/") ? strSopWebServerUrl + "api/Sensor/NotifyAlarm" : strSopWebServerUrl + "/api/Sensor/NotifyAlarm";

            string strErrorMessage, strProcessMessage;

            if (NotifyAlarm(data.SensorZoneHistoryNo, data.UserNo, data.TimeStamp, strUrl, out strProcessMessage, out strErrorMessage) == false)
                return new ResponseNotifyAlarm(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            ResponseNotifyAlarm response = new ResponseNotifyAlarm(true, "");
            response.SensorZoneHistoryNo = data.SensorZoneHistoryNo;
            response.ProcessMessage = strProcessMessage;
            return response;
        }

        private bool NotifyAlarm(int sensorZoneHistoryNo, int userNo, DateTime? timeStamp, string strUrl, out string strProcessMessage, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject json = new JObject();

            json.Add("sensorZoneHistoryNo", sensorZoneHistoryNo);
            json.Add("userNo", userNo);
            json.Add("timeStamp", timeStamp);

            Dictionary<string, string> dicResults = new Dictionary<string, string>();
            dicResults["processMessage"] = null;

            bool success = WebServiceManager.SendJsonData(json, strUrl, dicResults, out strErrorMessage);
            strProcessMessage = dicResults["processMessage"];
            return success;
        }

        private bool CheckSearchText(ResponseAlarmNotifications response, RequestAlarmNotification data, Dictionary<int, NotificationMessage> dicNotificationMessages, out int totalCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            totalCount = 0;

            RequestAlarmNotification.SearchTextType searchTextTypes = data.SearchTextTypes;
            string strSearchText = data.SearchText.Trim().ToLower();

            Dictionary<int, string> dicDetectTypes = GetDetectTypes(searchTextTypes);

            if (dicDetectTypes == null)
            {
                dicDetectTypes = ReadDetectTypes(m_dataManager, out strErrorMessage);

                if (dicDetectTypes == null)
                    return false;
            }

            List<AlarmNotification> results = new List<AlarmNotification>();

            NotificationMessage message;
            string strDetectType;

            string strActivateText = null, strInactivateText = null;

            if (searchTextTypes.UseActivate && searchTextTypes.ActivateText != null && searchTextTypes.InactivateText != null)
            {
                strActivateText = searchTextTypes.ActivateText.Trim().ToLower();
                strInactivateText = searchTextTypes.InactivateText.Trim().ToLower();
            }

            int beginIndex = 0;
            int? endIndex = null;

            if (data.PageIndex != null && data.PageItemCount != null)
            {
                beginIndex = (int)(data.PageIndex - 1) * (int)data.PageItemCount;
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            foreach (var notification in response.Notifications)
            {
                if (dicNotificationMessages.TryGetValue(notification.NotificationNo, out message))
                {
                    if (searchTextTypes.UseDetectType)
                    {
                        if (dicDetectTypes.TryGetValue(message.detct_ty_code, out strDetectType))
                        {
                            notification.DetectType = strDetectType;
                        }
                    }
                }

                if (searchTextTypes.UseDetectType)
                {
                    if (dicDetectTypes.TryGetValue(message.detct_ty_code, out strDetectType))
                    {
                        if (strDetectType.Contains(strSearchText))
                        {
                            if (CheckPageItemCount(notification, results, endIndex))
                                continue;
                            else
                                break;
                        }
                    }
                }

                if (searchTextTypes.UseNotificationName)
                {
                    if (notification.NotificationName != null && notification.NotificationName.ToLower().Contains(strSearchText))
                    {
                        if (CheckPageItemCount(notification, results, endIndex))
                            continue;
                        else
                            break;
                    }
                }

                if (searchTextTypes.UseSensorType)
                {
                    if (notification.SensorTypeName != null && notification.SensorTypeName.ToLower().Contains(strSearchText))
                    {
                        if (CheckPageItemCount(notification, results, endIndex))
                            continue;
                        else
                            break;
                    }
                }

                if (searchTextTypes.UseReceiver)
                {
                    if (CheckReceiverSearchText(notification, strSearchText))
                    {
                        if (CheckPageItemCount(notification, results, endIndex))
                            continue;
                        else
                            break;
                    }
                }

                if (strActivateText != null && strInactivateText != null)
                {
                    if ((strActivateText.Contains(strSearchText) && notification.IsActive) || (strInactivateText.Contains(strSearchText) && !notification.IsActive))
                    {
                        if (CheckPageItemCount(notification, results, endIndex))
                            continue;
                        else
                            break;
                    }
                }
            }

            totalCount = results.Count;

            if (beginIndex > 0)
            {
                if (endIndex != null)
                    RemoveItems(results, (int)endIndex, totalCount - (int)endIndex);

                results.RemoveRange(0, beginIndex);
            }
            else
            {
                if (endIndex != null)
                    RemoveItems(results, (int)endIndex, totalCount - (int)endIndex);
            }

            response.Notifications.Clear();
            response.Notifications.AddRange(results);
            return true;
        }

        private void RemoveItems<DataType>(List<DataType> items, int beginIndex, int removeCount)
        {
            int itemCount = items.Count;

            if (beginIndex < itemCount)
            {
                if (removeCount + beginIndex > itemCount)
                {
                    removeCount = itemCount - beginIndex;
                }

                items.RemoveRange(beginIndex, removeCount);
            }
        }

        private bool CheckPageItemCount<DataType>(DataType data, List<DataType> datas, int? endIndex)
        {
            datas.Add(data);

            // totalCount 때문에 일단 무조건 담는다.
            /*if (endIndex == null)
                return true;

            if (datas.Count >= (int)endIndex)
                return false;*/

            return true;
        }

                private void ApplyPaging<DataType>(List<DataType> datas, int? pageIndex, int? pageItemCount)
        {
            if (pageIndex == null || pageItemCount == null)
                return;

            int beginIndex = ((int)pageIndex - 1) * (int)pageItemCount;

            if (beginIndex >= datas.Count)
            {
                datas.Clear();
                return;
            }

            if (beginIndex > 0)
                datas.RemoveRange(0, beginIndex);

            if (datas.Count > pageItemCount)
                datas.RemoveRange((int)pageItemCount, datas.Count - (int)pageItemCount);
        }

        private void ApplyAlarmNotificationSort(List<AlarmNotification> notifications, int sortType, bool sortMethod)
        {
            notifications.Sort((left, right) =>
            {
                int result = CompareAlarmNotification(left, right, sortType);

                if (result == 0)
                    result = CompareInt(left.NotificationNo, right.NotificationNo);

                return sortMethod ? result : -result;
            });
        }

        private int CompareAlarmNotification(AlarmNotification left, AlarmNotification right, int sortType)
        {
            switch (sortType)
            {
                case Base.SDMS.IBLL.Request.RequestAlarmNotification.SortTypeCode.DetectType:
                    return CompareString(left.DetectType, right.DetectType);
                case Base.SDMS.IBLL.Request.RequestAlarmNotification.SortTypeCode.NotificationName:
                    return CompareString(left.NotificationName, right.NotificationName);
                case Base.SDMS.IBLL.Request.RequestAlarmNotification.SortTypeCode.SensorTypeName:
                    return CompareString(left.SensorTypeName, right.SensorTypeName);
                case Base.SDMS.IBLL.Request.RequestAlarmNotification.SortTypeCode.IsActive:
                    return CompareBool(left.IsActive, right.IsActive);
                case Base.SDMS.IBLL.Request.RequestAlarmNotification.SortTypeCode.NotificationNo:
                    return CompareInt(left.NotificationNo, right.NotificationNo);
            }

            return 0;
        }

        private int CompareString(string left, string right)
        {
            return string.Compare(left ?? "", right ?? "", StringComparison.OrdinalIgnoreCase);
        }

        private int CompareBool(bool left, bool right)
        {
            return left.CompareTo(right);
        }

        private int CompareInt(int left, int right)
        {
            return left.CompareTo(right);
        }

        private bool CheckReceiverSearchText(AlarmNotification notification, string strSearchText)
        {
            if (notification.Regulars != null)
            {
                foreach (var regular in notification.Regulars)
                {
                    if (regular.team_name.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (notification.RegularMembers != null)
            {
                foreach (var member in notification.RegularMembers)
                {
                    if (member.memb_name.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (notification.Temporaries != null)
            {
                foreach (var temoprary in notification.Temporaries)
                {
                    if (temoprary.team_name.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            if (notification.TemporaryMembers != null)
            {
                foreach (var member in notification.TemporaryMembers)
                {
                    if (member.disp_name != null && member.disp_name.ToLower().Contains(strSearchText))
                        return true;
                }
            }

            return false;
        }

        private IEnumerable<NotificationMessage> ReadNotificationMessages(RequestAlarmNotification data, string strCondition, out int totalCount, out string strErrorMessage)
        {
            totalCount = 0;
            IEnumerable<NotificationMessage> notifications = null;

            if (data.SearchTextTypes == null || data.SearchText == null || data.SearchText.Trim().Length == 0)
            {
                //if (data.PageIndex == null || data.PageItemCount == null)
                    notifications = m_dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);
                /*else
                {
                    string strSQL = CustomManager.MakePaginationQuery(m_dataManager, MakeNotificationMessageQuery(strCondition), (int)data.PageIndex, (int)data.PageItemCount + (int)data.PageIndex, NotificationMessage.Fields.ntcn_sn.ToString());
                    notifications = m_dataManager.GetDBManager().Query<NotificationMessage>(strSQL, out strErrorMessage);
                }*/
            }
            else
                notifications = m_dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);

            int beginIndex = 0;
            int? endIndex = null;

            if (data.PageIndex != null && data.PageItemCount != null)
            {
                beginIndex = (int)(data.PageIndex - 1) * (int)data.PageItemCount;
                endIndex = beginIndex + (int)data.PageItemCount;
            }

            List<NotificationMessage> messages = new List<NotificationMessage>();

            foreach (var notification in notifications)
            {
                if (endIndex != null)
                {
                    if (totalCount >= beginIndex && totalCount < (int)endIndex)
                        messages.Add(notification);
                }
                else
                    messages.Add(notification);

                totalCount++;
            }

            return messages;

            /*IEnumerable<NotificationMessage> messages = m_dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);

            if (messages == null)
                return null;

            Dictionary<int, string> dicDetectTypes = GetDetectTypes(data.SearchTextTypes);
            List<NotificationMessage> results = new List<NotificationMessage>();

            string strSearchText = data.SearchText.Trim().ToLower();
            string strDetectType;

            foreach (var message in messages)
            {
                if (data.SearchTextTypes.UseDetectType && results != null)
                {
                    if (dicDetectTypes.TryGetValue(message.detct_ty_code, out strDetectType))
                    {
                        if (strDetectType.Contains(strSearchText))
                        {
                            results.Add(message);
                            continue;
                        }
                    }
                }

                if (data.SearchTextTypes.UseNotificationName && message.ntcn_name != null)
                {
                    if (message.ntcn_name.Trim().ToLower().Contains(strSearchText))
                    {
                        results.Add(message);
                        continue;
                    }
                }
            }*/
        }

                private IEnumerable<NotificationMessage> ReadNotificationMessagesAll(string strCondition, out string strErrorMessage)
        {
            return m_dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);
        }

        private RequestAlarmNotification CreateSortSearchRequest(RequestAlarmNotification data)
        {
            return new RequestAlarmNotification()
            {
                SensorType = data.SensorType,
                SensorSubType = data.SensorSubType,
                BuildingGroupNo = data.BuildingGroupNo,
                BuildingNo = data.BuildingNo,
                ZoneNo = data.ZoneNo,
                MessageType = data.MessageType,
                DetectType = data.DetectType,
                IsActive = data.IsActive,
                SearchTextTypes = data.SearchTextTypes,
                SearchText = data.SearchText,
                PageIndex = null,
                PageItemCount = null,
                SensorTypeDatas = data.SensorTypeDatas,
                SortType = data.SortType,
                SortMethod = data.SortMethod,
            };
        }

        private Dictionary<int, string> GetDetectTypes(RequestAlarmNotification.SearchTextType searchTextType)
        {
            return GetDetectTypes(searchTextType.DetectTypes);
        }

        private Dictionary<int, string> GetDetectTypes(List<string> detectTypes)
        {
            if (detectTypes == null)
                return null;

            Dictionary<int, string> dicDetectTypes = new Dictionary<int, string>();

            foreach (string strType in detectTypes)
            {
                int index = strType.IndexOf('_');

                if (index > 0)
                {
                    string strNo = strType.Substring(0, index).Trim();
                    string strName = strType.Substring(index + 1).Trim();

                    int no;

                    if (int.TryParse(strNo, out no))
                    {
                        dicDetectTypes[no] = strName.ToLower();
                    }
                }
            }

            return dicDetectTypes;
        }

        private Dictionary<int, string> ReadDetectTypes(IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Model.Common.Codes.Fields.cl_code, (int)CodeType.DetectType);
            IEnumerable<Model.Common.Codes> codes = dataManager.GetSelect().Select<Model.Common.Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            Dictionary<int, string> dicDetectTypes = new Dictionary<int, string>();

            foreach (var code in codes)
            {
                dicDetectTypes[code.code] = code.code_name;
            }

            return dicDetectTypes;
        }

        private Dictionary<int, string> ReadSensorTypes(IDataManager dataManager, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Model.Common.Codes.Fields.cl_code, (int)CodeType.SensorType);
            IEnumerable<Model.Common.Codes> codes = dataManager.GetSelect().Select<Model.Common.Codes>(strCondition, out strErrorMessage);

            if (codes == null)
                return null;

            Dictionary<int, string> dicSensorTypes = new Dictionary<int, string>();

            foreach (var code in codes)
            {
                dicSensorTypes[code.code] = code.code_name;
            }

            return dicSensorTypes;
        }

        private string MakeNotificationMessageQuery(string strCondition)
        {
            string strSQL = string.Format("Select * from {0}", NotificationMessage.TableName);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " where " + strCondition;

            return strSQL;
        }

        private Dictionary<int, NotificationMessage> GetReceivers(IDataManager dataManager, string strNotificationNos, IEnumerable<NotificationMessage> notificationMessages, List<AlarmNotification> alarmNotifications, List<string> detectTypes, List<SensorTypeData> sensorTypeDatas, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in ({1})", NotificationMessageReceiver.Fields.ntcn_sn, strNotificationNos);
            IEnumerable<NotificationMessageReceiver> receivers = m_dataManager.GetSelect().Select<NotificationMessageReceiver>(strCondition, out strErrorMessage);

            if (receivers == null)
                return null;

            Dictionary<int, Regular> dicRegulars = new Dictionary<int, Regular>();
            Dictionary<int, RegularMember> dicRegularMembers = new Dictionary<int, RegularMember>();
            Dictionary<int, Temporary> dicTemporaries = new Dictionary<int, Temporary>();
            Dictionary<int, TemporaryMember> dicTemporaryMembers = new Dictionary<int, TemporaryMember>();

            string strRegularNos = null, strRegularMemberNos = null, strTemporaryNos = null, strTemporaryMemberNos = null;

            foreach (var receiver in receivers)
            {
                if (receiver.rgl_sn != null)
                    AddNos(ref strRegularNos, receiver.rgl_sn);
                else if (receiver.rgl_memb_sn != null)
                    AddNos(ref strRegularMemberNos, receiver.rgl_memb_sn);
                else if (receiver.tmpr_sn != null)
                    AddNos(ref strTemporaryNos, receiver.tmpr_sn);
                else if (receiver.tmpr_memb_sn != null)
                    AddNos(ref strTemporaryMemberNos, receiver.tmpr_memb_sn);
            }

            if (ReadRegularReceivers(strRegularNos, dicRegulars, out strErrorMessage) == false)
                return null;

            if (ReadRegularMemberReceivers(strRegularMemberNos, dicRegularMembers, out strErrorMessage) == false)
                return null;

            if (ReadTemporaryReceivers(strTemporaryNos, dicTemporaries, out strErrorMessage) == false)
                return null;

            if (ReadTemporaryMemberReceivers(strTemporaryMemberNos, dicTemporaryMembers, out strErrorMessage) == false)
                return null;

            Dictionary<int, string> dicDetectTypes = GetDetectTypes(detectTypes);

            if (dicDetectTypes == null)
            {
                dicDetectTypes = ReadDetectTypes(dataManager, out strErrorMessage);

                if (dicDetectTypes == null)
                    return null;
            }

            Dictionary<int, string> dicSensorTypes = ReadSensorTypes(dataManager, out strErrorMessage);

            if (dicSensorTypes == null)
                return null;

            string strDetectType, strSensorType;
            Dictionary<int, AlarmNotification> dicAlarmNotifications = new Dictionary<int, AlarmNotification>();
            Dictionary<int, NotificationMessage> dicNotifications = new Dictionary<int, NotificationMessage>();

            Dictionary<long, string> dicSensorTypeDatas = ToSensorTypeDataDictionary(sensorTypeDatas);

            foreach (var notificationMessage in notificationMessages)
            {
                AlarmNotification notification = new AlarmNotification();
                notification.NotificationNo = notificationMessage.ntcn_sn;
                notification.IsActive = notificationMessage.acti;
                notification.NotifyMessage = notificationMessage.mssage;
                notification.NotificationName = notificationMessage.ntcn_name;
                notification.SensorType = notificationMessage.sensor_ty_code;
                notification.SensorSubType = notificationMessage.sensor_sub_ty_no;

                if (dicDetectTypes.TryGetValue(notificationMessage.detct_ty_code, out strDetectType))
                    notification.DetectType = strDetectType;

                if (dicSensorTypes.TryGetValue(notificationMessage.sensor_ty_code, out strSensorType))
                {
                    string strSensorTypeName = GetSensorTypeName(dicSensorTypeDatas, notification.SensorType, notification.SensorSubType);

                    if (strSensorTypeName != null)
                        notification.SensorTypeName = strSensorTypeName;
                    else
                        notification.SensorTypeName = strSensorType;
                }

                dicAlarmNotifications[notificationMessage.ntcn_sn] = notification;
                alarmNotifications.Add(notification);
                dicNotifications[notificationMessage.ntcn_sn] = notificationMessage;
            }

            foreach (var receiver in receivers)
            {
                AlarmNotification notification;

                if (dicAlarmNotifications.TryGetValue(receiver.ntcn_sn, out notification))
                {
                    if (receiver.rgl_sn != null)
                    {
                        Regular regular;

                        if (dicRegulars.TryGetValue((int)receiver.rgl_sn, out regular))
                            notification.Regulars.Add(regular);
                    }

                    if (receiver.rgl_memb_sn != null)
                    {
                        RegularMember regularMember;

                        if (dicRegularMembers.TryGetValue((int)receiver.rgl_memb_sn, out regularMember))
                        {
                            Regular regular;

                            if (dicRegulars.TryGetValue(regularMember.rgl_sn, out regular))
                            {
                                RegularMemberEx memberEx = new RegularMemberEx(regularMember);
                                memberEx.TeamName = regular.team_name;
                                notification.RegularMembers.Add(memberEx);
                            }
                        }
                    }

                    if (receiver.tmpr_sn != null)
                    {
                        Temporary temporary;

                        if (dicTemporaries.TryGetValue((int)receiver.tmpr_sn, out temporary))
                            notification.Temporaries.Add(temporary);
                    }

                    if (receiver.tmpr_memb_sn != null)
                    {
                        TemporaryMember temporaryMember;

                        if (dicTemporaryMembers.TryGetValue((int)receiver.tmpr_memb_sn, out temporaryMember))
                            notification.TemporaryMembers.Add(temporaryMember);
                    }
                }
            }

            return dicNotifications;
        }

        private string GetSensorTypeName(Dictionary<long, string> dicSensorTypeDatas, int sensorType, int? sensorSubType)
        {
            if (dicSensorTypeDatas != null)
            {
                string strSensorTypeName = null;
                long key = SensorTypeData.MakeKey(sensorType, sensorSubType);

                if (dicSensorTypeDatas.TryGetValue(key, out strSensorTypeName))
                    return strSensorTypeName;
            }

            return null;
        }

        private Dictionary<long, string> ToSensorTypeDataDictionary(List<SensorTypeData> sensorTypeDatas)
        {
            Dictionary<long, string> dicSensorTypeDatas = null;

            if (sensorTypeDatas == null)
                return dicSensorTypeDatas;

            dicSensorTypeDatas = new Dictionary<long, string>();

            foreach (SensorTypeData data in sensorTypeDatas)
            {
                dicSensorTypeDatas[SensorTypeData.MakeKey(data.SensorTypeCode, data.SensorSubTypeNo)] = data.SensorTypeName;
            }

            return dicSensorTypeDatas;
        }

        private string GetAlarmNotificationCondition(IDataManager dataManager, int sensorType, int? sensorSubType, int messageType, int detectType, int? zoneNo, int? buildingNo, int? buildingGroupNo, bool? isActive)
        {
            string strCondition = null;

            if (sensorType != SdmsSensor.SensorType.None)
                strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.sensor_ty_code, sensorType);

            if (sensorSubType != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.sensor_sub_ty_no, (int)sensorSubType);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.sensor_sub_ty_no, (int)sensorSubType);
            }

            if (messageType != SdmsSensor.NotificationType.None)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.mssage_ty_code, messageType);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.mssage_ty_code, messageType);
            }

            if (detectType != SdmsSensor.DetectType.None)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.detct_ty_code, detectType);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.detct_ty_code, detectType);
            }

            if (isActive != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.acti, CustomManager.GetBoolValue(dataManager, (bool)isActive));
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.acti, CustomManager.GetBoolValue(dataManager, (bool)isActive));
            }

            if (zoneNo != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.zone_sn, (int)zoneNo);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.zone_sn, (int)zoneNo);
            }
            else if (buildingNo != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.buld_sn, (int)buildingNo);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.buld_sn, (int)buildingNo);
            }
            else if (buildingGroupNo != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(" and {0} = {1}", NotificationMessage.Fields.buld_group_sn, (int)buildingGroupNo);
                else
                    strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.buld_group_sn, (int)buildingGroupNo);
            }

            return strCondition;
        }

        public ResponseAlarmNotification SaveAlarmNotification(RequestSaveAlarmNotification data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseAlarmNotification(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            string strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.ntcn_sn, data.NotificationNo);
            NotificationMessage notificationMessage = m_dataManager.GetSelect().SelectFirst<NotificationMessage>(strCondition, out strErrorMessage);

            if (notificationMessage == null)
            {
                if (strErrorMessage != null)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                }
                else
                {
                    notificationMessage = CreateNotification(dataManager, data, out strErrorMessage);

                    if (notificationMessage == null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
                    }
                }
            }
            
            if (UpdateNotification(dataManager, notificationMessage.ntcn_sn, data.NotifyMessage, data.NotificationName, data.IsActive, data.DetectType, data.SensorType, data.SensorSubType, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            if (DeleteNotificationReceivers(dataManager, notificationMessage.ntcn_sn, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            if (InsertNotificationReceivers(dataManager, notificationMessage.ntcn_sn, data, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            ResponseAlarmNotification response = new ResponseAlarmNotification(true, "");
            //response.Notification = new AlarmNotification(notificationMessage);

            string strNotificationNos = notificationMessage.ntcn_sn.ToString();

            List<NotificationMessage> notificationMessages = new List<NotificationMessage>();
            notificationMessages.Add(notificationMessage);

            List<AlarmNotification> notifications = new List<AlarmNotification>();
            Dictionary<int, NotificationMessage> dicNotifications = GetReceivers(dataManager, strNotificationNos, notificationMessages, notifications, null, null, out strErrorMessage);

            if (dicNotifications == null)
                return new ResponseAlarmNotification(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            foreach (var notification in notifications)
            {
                notification.FromCopy(notificationMessage);
                response.Notification = notification;
            }

            return new ResponseAlarmNotification(true, "");
        }

        public MessageResult DeleteAlarmNotification(RequestDeleteAlarmNotification data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            string strCondition = string.Format("{0} = {1}", NotificationMessageReceiver.Fields.ntcn_sn, data.NotificationNo);
            
            if (dataManager.GetDelete().Delete<NotificationMessageReceiver>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage, ErrorCode.UnknownError);
            }

            strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.ntcn_sn, data.NotificationNo);

            if (dataManager.GetDelete().Delete<NotificationMessage>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage, ErrorCode.UnknownError);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        private bool InsertNotificationReceivers(IDataManager dataManager, int messageNo, RequestSaveAlarmNotification data, out string strErrorMessage)
        {
            foreach (int regularNo in data.RegularNos)
            {
                if (InsertNotificationReceiver(dataManager, messageNo, regularNo, null, null, null, out strErrorMessage) == false)
                    return false;
            }

            foreach (int regularMemberNo in data.RegularMemberNos)
            {
                if (InsertNotificationReceiver(dataManager, messageNo, null, regularMemberNo, null, null, out strErrorMessage) == false)
                    return false;
            }

            foreach (int temporaryNo in data.TemporaryNos)
            {
                if (InsertNotificationReceiver(dataManager, messageNo, null, null, temporaryNo, null, out strErrorMessage) == false)
                    return false;
            }

            foreach (int temporaryMemberNo in data.TemporaryMemberNos)
            {
                if (InsertNotificationReceiver(dataManager, messageNo, null, null, null, temporaryMemberNo, out strErrorMessage) == false)
                    return false;
            }

            strErrorMessage = null;
            return true;
        }

        private bool InsertNotificationReceiver(IDataManager dataManager, int messageNo, int? regularNo, int? regularMemberNo, int? temporaryNo, int? temporaryMemberNo, out string strErrorMessage)
        {
            NotificationMessageReceiver receiver = new NotificationMessageReceiver();

            receiver.ntcn_sn = messageNo;
            receiver.rgl_sn = regularNo;
            receiver.rgl_memb_sn = regularMemberNo;
            receiver.tmpr_sn = temporaryNo;
            receiver.tmpr_memb_sn = temporaryMemberNo;

            return dataManager.GetCreate().Insert<NotificationMessageReceiver>(receiver, out strErrorMessage);
        }

        private bool DeleteNotificationReceivers(IDataManager dataManager, int messageNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", NotificationMessageReceiver.Fields.ntcn_sn, messageNo);
            return dataManager.GetDelete().Delete<NotificationMessageReceiver>(strCondition, out strErrorMessage);
        }

        private bool UpdateNotification(IDataManager dataManager, int messageNo, string strNotifyMessage, string strNotificationName, bool isActive, int detectType, int sensorType, int? sensorSubType, out string strErrorMessage)
        {
            Dictionary<NotificationMessage.Fields, object> dicSets = new Dictionary<NotificationMessage.Fields, object>();
            dicSets[NotificationMessage.Fields.mssage] = strNotifyMessage;
            dicSets[NotificationMessage.Fields.ntcn_name] = strNotificationName;
            dicSets[NotificationMessage.Fields.acti] = isActive;
            dicSets[NotificationMessage.Fields.detct_ty_code] = detectType;
            dicSets[NotificationMessage.Fields.sensor_ty_code] = sensorType;
            dicSets[NotificationMessage.Fields.sensor_sub_ty_no] = sensorSubType;

            string strCondition = string.Format("{0} = {1}", NotificationMessage.Fields.ntcn_sn, messageNo);
            return dataManager.GetUpdate().Update<NotificationMessage, NotificationMessage.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        private NotificationMessage CreateNotification(IDataManager dataManager, RequestSaveAlarmNotification data, out string strErrorMessage)
        {
            NotificationMessage message = new NotificationMessage();

            message.buld_group_sn = data.BuildingGroupNo;
            message.buld_sn = data.BuildingNo;
            message.mssage = data.NotifyMessage;
            message.mssage_ty_code = data.MessageType;
            message.mssage_ty_optn_code = (int)CodeType.NotificationType;
            message.sensor_ty_code = data.SensorType;
            message.sensor_ty_optn_code = (int)CodeType.SensorType;
            message.sensor_sub_ty_no = data.SensorSubType;
            message.zone_sn = data.ZoneNo;
            message.detct_ty_code = data.DetectType;
            message.detct_ty_optn_code = (int)CodeType.DetectType;
            message.ntcn_name = data.NotificationName;

            int messageNo;

            if (dataManager.GetCreate().Insert<NotificationMessage>(message, out messageNo, out strErrorMessage) == false)
                return null;

            message.ntcn_sn = messageNo;
            return message;
        }

        private bool ReadRegularReceivers(/*ResponseAlarmNotification response, */string strRegularNos, Dictionary<int, Regular> dicRegulars, out string strErrorMessage)
        {
            /*if (strRegularNos == null)
            {
                strErrorMessage = null;
                return true;
            }*/

            // Regular는 RegularMember에서도 정보가 필요하기 때문에 strRegularNos에 담긴것 뿐만 아니라 그냥 전체를 모두 읽는다.
            // Regular는 RegularMember에 비해 데이터가 그리 크지 않기 때문에 전체를 읽어도 별 무리가 없다.
            string strCondition = null;
            //string strCondition = string.Format("{0} in ({1})", Regular.Fields.rgl_sn, strRegularNos);
            IEnumerable<Regular> regulars = m_dataManager.GetSelect().Select<Regular>(strCondition, out strErrorMessage);

            if (regulars == null)
                return false;

            foreach (Regular regular in regulars)
            {
                dicRegulars[regular.rgl_sn] = regular;
            }

            //response.Regulars.AddRange(regulars);
            return true;
        }

        private bool ReadRegularMemberReceivers(/*ResponseAlarmNotification response, */string strRegularMemberNos, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            if (strRegularMemberNos == null)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
            IEnumerable<RegularMember> members = m_dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            foreach (RegularMember member in members)
            {
                if (member.telno != null)
                    member.telno = AES256Cipher.AES_decrypt(member.telno);

                dicRegularMembers[member.rgl_memb_sn] = member;
            }

            //response.RegularMembers.AddRange(members);
            return true;
        }

        private bool ReadTemporaryReceivers(/*ResponseAlarmNotification response, */string strTemporaryNos, Dictionary<int, Temporary> dicTemporaries, out string strErrorMessage)
        {
            if (strTemporaryNos == null)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} in ({1})", Temporary.Fields.tmpr_sn, strTemporaryNos);
            IEnumerable<Temporary> temporaries = m_dataManager.GetSelect().Select<Temporary>(strCondition, out strErrorMessage);

            if (temporaries == null)
                return false;

            foreach (Temporary temporary in temporaries)
            {
                dicTemporaries[temporary.tmpr_sn] = temporary;
            }

            //response.Temporaries.AddRange(temporaries);
            return true;
        }

        private bool ReadTemporaryMemberReceivers(/*ResponseAlarmNotification response, */string strTemporaryMemberNos, Dictionary<int, TemporaryMember> dicTemporaryMembers, out string strErrorMessage)
        {
            if (strTemporaryMemberNos == null)
            {
                strErrorMessage = null;
                return true;
            }

            string strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_memb_sn, strTemporaryMemberNos);
            IEnumerable<TemporaryMember> members = m_dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

            if (members == null)
                return false;

            foreach (TemporaryMember member in members)
            {
                dicTemporaryMembers[member.tmpr_memb_sn] = member;
            }

            //response.TemporaryMembers.AddRange(members);
            return true;
        }

        private void AddNos(ref string strNos, int? value)
        {
            if (value != null)
            {
                if (strNos == null)
                    strNos = ((int)value).ToString();
                else
                    strNos += "," + ((int)value).ToString();
            }
        }

        private string GetNullableString(int? value)
        {
            if (value == null)
                return "is null";

            return string.Format("= {0}", (int)value);
        }
    }
}
