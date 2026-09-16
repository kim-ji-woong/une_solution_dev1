using System;
using System.Collections;
using System.Collections.Generic;
using Base.Model.History;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Alarm;
using dnsData.CommonCode;
using Base.Model.Common.Team;
using dnsDapperDBUtil;
using Base.DAL;
using Base.Model.Spatial;
using SOPWebServer.IBLL.Interface;

namespace SOPWebServer.BLL.Process
{
    class NotifyManager
    {
        public static bool NotifyAlarm(INotifyManager notifyManager, IDataManager dataManager, SensorZone sensorZoneHistory, int detectType, out string strErrorMessage)
        {
            if (notifyManager == null)
            {
                strErrorMessage = null;//dnsData.CommonCode.SdmsSensor.DetectType.Detect
                return true;
            }

            string strSubTypeNos = GetSensorSubTypes(dataManager, sensorZoneHistory, out strErrorMessage);

            if (strSubTypeNos == null)
                return false;

            string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5}",
                NotificationMessage.Fields.sensor_ty_code, sensorZoneHistory.sensor_ty_code,
                NotificationMessage.Fields.detct_ty_code, detectType,
                NotificationMessage.Fields.acti, CustomManager.GetBoolValue(dataManager, true));

            string strPrevCondition = strCondition;

            if (strSubTypeNos.Length == 0)
                strCondition += string.Format(" and {0} is null", NotificationMessage.Fields.sensor_sub_ty_no);
            else
                strCondition += string.Format(" and {0} in ({1})", NotificationMessage.Fields.sensor_sub_ty_no, strSubTypeNos);

            IEnumerable<NotificationMessage> messages = dataManager.GetSelect().Select<NotificationMessage>(strCondition, out strErrorMessage);

            if (messages == null)
                return false;

            if (IsEmpty(messages) && strSubTypeNos.Length > 0)
            {
                // SensorSubType까지 만족하는 담당자 정보가 없을 경우 SensorType으로만 다시 담당자를 조회하도록 한다.
                messages = dataManager.GetSelect().Select<NotificationMessage>(strPrevCondition, out strErrorMessage);
            }

            Zone zone = null;
            Building building = null;
            Dictionary<int, bool> dicMessageTypes = new Dictionary<int, bool>();
            bool useSMS = IsOptionEnabled(dataManager, sensorZoneHistory.site_sn, "SOP/UseSMS", true, out strErrorMessage);
            bool useEmail = IsOptionEnabled(dataManager, sensorZoneHistory.site_sn, "SOP/UseEmail", true, out strErrorMessage);

            if (strErrorMessage != null)
                return false;

            foreach (var message in messages)
            {
                if (message.mssage_ty_code == SdmsSensor.NotificationType.SMS && useSMS == false)
                    continue;
                else if (message.mssage_ty_code == SdmsSensor.NotificationType.Email && useEmail == false)
                    continue;

                if (sensorZoneHistory.zone_sn != null && sensorZoneHistory.zone_sn == message.zone_sn && message.mssage.Length > 0)
                {
                    if (dicMessageTypes.ContainsKey(message.mssage_ty_code))
                        continue;
                    else
                    {
                        dicMessageTypes[message.mssage_ty_code] = true;
                        return NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, message, out strErrorMessage);
                    }
                }
                else if (sensorZoneHistory.zone_sn != null && message.buld_sn != null && message.mssage.Length > 0)
                {
                    if (dicMessageTypes.ContainsKey(message.mssage_ty_code))
                        continue;
                    else
                    {
                        if (CheckBuilding(dataManager, ref zone, (int)sensorZoneHistory.zone_sn, (int)message.buld_sn, out strErrorMessage))
                        {
                            dicMessageTypes[message.mssage_ty_code] = true;
                            return NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, message, out strErrorMessage);
                        }
                        else if (strErrorMessage != null)
                            return false;
                    }
                }
                else if (sensorZoneHistory.zone_sn != null && message.buld_group_sn != null && message.mssage.Length > 0)
                {
                    if (dicMessageTypes.ContainsKey(message.mssage_ty_code))
                        continue;
                    else
                    {
                        if (CheckBuildingGroup(dataManager, ref zone, ref building, (int)sensorZoneHistory.zone_sn, (int)message.buld_group_sn, out strErrorMessage))
                        {
                            dicMessageTypes[message.mssage_ty_code] = true;
                            return NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, message, out strErrorMessage);
                        }
                        else if (strErrorMessage != null)
                            return false;
                    }
                }
                // 공간정보에 등록이 아닌 sensor_ty_code에 등록된 메시지 발송
                else if (sensorZoneHistory.zone_sn != null && message.zone_sn == null && message.buld_sn == null && message.buld_group_sn == null && message.mssage.Length > 0)
                {
                    if (dicMessageTypes.ContainsKey(message.mssage_ty_code))
                        continue;
                    else if (sensorZoneHistory.sensor_ty_code == message.sensor_ty_code)
                    {
                        dicMessageTypes[message.mssage_ty_code] = true;
                        return NotifyAlarm(notifyManager, dataManager, sensorZoneHistory, message, out strErrorMessage);
                    }
                }
            }

            return true;
        }

        private static bool IsEmpty<DataType>(IEnumerable<DataType> datas)
        {
            foreach (DataType data in datas)
            {
                return false;
            }

            return true;
        }

        // SensorSubType No 리스트를 반환한다.(중복 제외)
        private static string GetSensorSubTypes(IDataManager dataManager, SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("a.{0} = {1}", SensorZone.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn);
            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetailSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;
            Dictionary<int, int> dicSubTypes = new Dictionary<int, int>();

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i + 2] is Base.Model.Sensor.SensorZone)
                {
                    Base.Model.Sensor.SensorZone sensorZone = (Base.Model.Sensor.SensorZone)arrDatas[i + 2];

                    if (sensorZone.sensor_sub_ty_no != null)
                    {
                        dicSubTypes[(int)sensorZone.sensor_sub_ty_no] = (int)sensorZone.sensor_sub_ty_no;
                    }
                }
            }

            string strSubTypeNos = "";

            foreach (KeyValuePair<int, int> pair in dicSubTypes)
            {
                if (strSubTypeNos.Length == 0)
                    strSubTypeNos = pair.Key.ToString();
                else
                    strSubTypeNos += "," + pair.Key.ToString();
            }

            return strSubTypeNos;
        }

        private static bool CheckBuildingGroup(IDataManager dataManager, ref Zone zone, ref Building building, int zoneNo, int buildingGroupNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (zone != null)
            {
                if (zone.buld_sn == null)
                    return false;
            }
            else
            {
                string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)zoneNo);
                zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

                if (zone == null || zone.buld_sn == null)
                    return false;
            }

            if (building == null)
            {
                string strCondition = string.Format("{0} = {1}", Building.Fields.buld_sn, (int)zone.buld_sn);
                building = dataManager.GetSelect().SelectFirst<Building>(strCondition, out strErrorMessage);

                if (building == null)
                    return false;
            }

            return building.buld_group_sn == buildingGroupNo;
        }

        private static bool CheckBuilding(IDataManager dataManager, ref Zone zone, int zoneNo, int buildingNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (zone != null)
            {
                if (zone.buld_sn == null)
                    return false;

                return (int)zone.buld_sn == buildingNo;
            }

            string strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)zoneNo);
            zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null || zone.buld_sn == null)
                return false;

            return (int)zone.buld_sn == buildingNo;
        }

        private static bool NotifyAlarm(INotifyManager notifyManager, IDataManager dataManager, SensorZone sensorZoneHistory, NotificationMessage message, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", NotificationMessageReceiver.Fields.ntcn_sn, message.ntcn_sn);
            IEnumerable<NotificationMessageReceiver> receivers = dataManager.GetSelect().Select<NotificationMessageReceiver>(strCondition, out strErrorMessage);

            if (receivers == null)
                return false;

            if (message.mssage_ty_code == SdmsSensor.NotificationType.SMS)
                return NotifySMS(notifyManager, dataManager, sensorZoneHistory, message, receivers, out strErrorMessage);
            else if (message.mssage_ty_code == SdmsSensor.NotificationType.Email)
                return NotifyEmail(notifyManager, dataManager, sensorZoneHistory, message, receivers, out strErrorMessage);

            return true;
        }

        private static bool NotifyEmail(INotifyManager notifyManager, IDataManager dataManager, SensorZone sensorZoneHistory, NotificationMessage message, IEnumerable<NotificationMessageReceiver> receivers, out string strErrorMessage)
        {
            bool useEmail = IsOptionEnabled(dataManager, sensorZoneHistory.site_sn, "SOP/UseEmail", true, out strErrorMessage);

            if (strErrorMessage != null)
                return false;
            else if (useEmail == false)
            {
                strErrorMessage = null;
                return true;
            }

            string strMessage = MakeNotifyMessage(dataManager, sensorZoneHistory, message, out strErrorMessage);

            if (strMessage == null)
                return false;

            string strSendEmail = GetSendEmail(dataManager, sensorZoneHistory, out strErrorMessage);

            if (strErrorMessage != null)
                return false;
            else if (strSendEmail == null || strSendEmail.Length == 0)
                return true;

            List<string> emails = GetReceiverEmails(dataManager, receivers, out strErrorMessage);

            if (emails == null)
                return false;
            else if (emails.Count == 0)
                return true;

            string strSubject = "";

            return notifyManager.SendEmail(strSendEmail, strSubject, emails, strMessage, out strErrorMessage);
        }

        private static bool NotifySMS(INotifyManager notifyManager, IDataManager dataManager, SensorZone sensorZoneHistory, NotificationMessage message, IEnumerable<NotificationMessageReceiver> receivers, out string strErrorMessage)
        {
            bool useSMS = IsOptionEnabled(dataManager, sensorZoneHistory.site_sn, "SOP/UseSMS", true, out strErrorMessage);

            if (strErrorMessage != null)
                return false;
            else if (useSMS == false)
            {
                strErrorMessage = null;
                return true;
            }

            string strMessage = MakeNotifyMessage(dataManager, sensorZoneHistory, message, out strErrorMessage);

            if (strMessage == null)
                return false;

            string strSendPhoneNumber = GetSendPhoneNumber(dataManager, sensorZoneHistory, out strErrorMessage);

            if (strErrorMessage != null)
                return false;
            else if (strSendPhoneNumber == null || strSendPhoneNumber.Length == 0)
                return true;

            List<string> phoneNumbers = GetReceiverPhoneNumbers(dataManager, receivers, out strErrorMessage);

            if (phoneNumbers == null)
                return false;
            else if (phoneNumbers.Count == 0)
                return true;

            return notifyManager.SendSMS(strSendPhoneNumber, phoneNumbers, strMessage, out strErrorMessage);
        }

        private static List<string> GetReceiverPhoneNumbers(IDataManager dataManager, IEnumerable<NotificationMessageReceiver> receivers, out string strErrorMessage)
        {
            string strRegularNos = null, strRegularMemberNos = null;

            if (GetReceiverInfo(dataManager, receivers, ref strRegularNos, ref strRegularMemberNos, out strErrorMessage) == false)
                return null;

            return GetPhoneNumbers(dataManager, strRegularNos, strRegularMemberNos, out strErrorMessage);
        }

        private static List<string> GetReceiverEmails(IDataManager dataManager, IEnumerable<NotificationMessageReceiver> receivers, out string strErrorMessage)
        {
            string strRegularNos = null, strRegularMemberNos = null;

            if (GetReceiverInfo(dataManager, receivers, ref strRegularNos, ref strRegularMemberNos, out strErrorMessage) == false)
                return null;

            return GetEmails(dataManager, strRegularNos, strRegularMemberNos, out strErrorMessage);
        }

        private static bool GetReceiverInfo(IDataManager dataManager, IEnumerable<NotificationMessageReceiver> receivers, ref string strRegularNos, ref string strRegularMemberNos, out string strErrorMessage)
        {
            string strTemporaryNos = null, strTemporaryMemberNos = null;

            foreach (var receiver in receivers)
            {
                if (receiver.tmpr_sn != null)
                {
                    if (strTemporaryNos == null)
                        strTemporaryNos = ((int)receiver.tmpr_sn).ToString();
                    else
                        strTemporaryNos += "," + ((int)receiver.tmpr_sn).ToString();
                }
                else if (receiver.tmpr_memb_sn != null)
                {
                    if (strTemporaryMemberNos == null)
                        strTemporaryMemberNos = ((int)receiver.tmpr_memb_sn).ToString();
                    else
                        strTemporaryMemberNos += "," + ((int)receiver.tmpr_memb_sn).ToString();
                }
                else if (receiver.rgl_sn != null)
                {
                    if (strRegularNos == null)
                        strRegularNos = ((int)receiver.rgl_sn).ToString();
                    else
                        strRegularNos += "," + ((int)receiver.rgl_sn).ToString();
                }
                else if (receiver.rgl_memb_sn != null)
                {
                    if (strRegularMemberNos == null)
                        strRegularMemberNos = ((int)receiver.rgl_memb_sn).ToString();
                    else
                        strRegularMemberNos += "," + ((int)receiver.rgl_memb_sn).ToString();
                }
            }

            if (ReadTemporaryInfo(dataManager, strTemporaryNos, strTemporaryMemberNos, ref strRegularNos, ref strRegularMemberNos, out strErrorMessage) == false)
                return false;

            return true;
        }

        private static string GetSendEmail(IDataManager dataManager, SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = 'Notify/SendEmail' and {1} = {2}", Base.Model.Common.Option.Fields.prop_name, Base.Model.Common.Option.Fields.site_sn, sensorZoneHistory.site_sn);
            var options = dataManager.GetSelect().Select<Base.Model.Common.Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            foreach (var option in options)
            {
                return option.prop_value;
            }

            return "";
        }

        private static bool IsOptionEnabled(IDataManager dataManager, int siteNo, string strOptionName, bool defaultValue, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strCondition = string.Format("{0} = '{1}' and {2} = {3}",
                Base.Model.Common.Option.Fields.prop_name, strOptionName,
                Base.Model.Common.Option.Fields.site_sn, siteNo);

            Base.Model.Common.Option option = dataManager.GetSelect().SelectFirst<Base.Model.Common.Option>(strCondition, out strErrorMessage);

            if (strErrorMessage != null)
                return defaultValue;
            else if (option == null || option.prop_value == null)
                return defaultValue;

            string strValue = option.prop_value.Trim().ToLower();

            if (strValue == "false" || strValue == "0")
                return false;
            else if (strValue == "true" || strValue == "1")
                return true;

            return defaultValue;
        }

        private static string GetSendPhoneNumber(IDataManager dataManager, SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = 'Notify/SendPhoneNumber' and {1} = {2}", Base.Model.Common.Option.Fields.prop_name, Base.Model.Common.Option.Fields.site_sn, sensorZoneHistory.site_sn);
            var options = dataManager.GetSelect().Select<Base.Model.Common.Option>(strCondition, out strErrorMessage);

            if (options == null)
                return null;

            foreach (var option in options)
            {
                return option.prop_value;
            }

            return "";
        }

        private static string MakeNotifyMessage(IDataManager dataManager, SensorZone sensorZoneHistory, NotificationMessage message, out string strErrorMessage)
        {
            string strMessage = message.mssage.Trim();
            string strLower = strMessage.ToLower();

            string strAlarmPosition = null;
            string strAlarmTime = null;

            int index = 0;
            bool keepGoing = true;
            
            while (keepGoing)
            {
                keepGoing = CheckAlarmPosition(dataManager, ref strMessage, ref strLower, ref index, "{location}", sensorZoneHistory, ref strAlarmPosition, out strErrorMessage);

                if (keepGoing == false && strErrorMessage != null)
                    return null;
            }

            index = 0;
            keepGoing = true;

            while (keepGoing)
            {
                keepGoing = CheckAlarmTime(dataManager, ref strMessage, ref strLower, ref index, "{time}", sensorZoneHistory, ref strAlarmTime, out strErrorMessage);

                if (keepGoing == false && strErrorMessage != null)
                    return null;
            }

            strErrorMessage = null;
            return strMessage;
        }

        private static bool CheckAlarmTime(IDataManager dataManager, ref string strMessage, ref string strLower, ref int index, string strTarget, SensorZone sensorZoneHistory, ref string strAlarmTime, out string strErrorMessage)
        {
            strErrorMessage = null;
            index = strLower.IndexOf(strTarget, index);

            if (index >= 0)
            {
                if (strAlarmTime == null)
                {
                    strAlarmTime = GetAlarmTime(sensorZoneHistory);

                    if (strAlarmTime == null)
                        return false;
                }

                int len = strTarget.Length;
                strMessage = strMessage.Substring(0, index) + strAlarmTime + strMessage.Substring(index + len);
                strLower = strLower.Substring(0, index) + strAlarmTime + strLower.Substring(index + len);
                index = index + 1;
                return true;
            }

            return false;
        }

        private static string GetAlarmTime(SensorZone sensorZoneHistory)
        {
            DateTime timeStamp = sensorZoneHistory.tm;
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", timeStamp.Year, timeStamp.Month, timeStamp.Day, timeStamp.Hour, timeStamp.Minute, timeStamp.Second);
        }

        private static bool CheckAlarmPosition(IDataManager dataManager, ref string strMessage, ref string strLower, ref int index, string strTarget, SensorZone sensorZoneHistory, ref string strAlarmPosition, out string strErrorMessage)
        {
            strErrorMessage = null;
            index = strLower.IndexOf(strTarget, index);

            if (index >= 0)
            {
                if (strAlarmPosition == null)
                {
                    strAlarmPosition = GetAlarmPosition(dataManager, sensorZoneHistory, out strErrorMessage);

                    if (strAlarmPosition == null)
                        return false;
                }

                int len = strTarget.Length;
                strMessage = strMessage.Substring(0, index) + strAlarmPosition + strMessage.Substring(index + len);
                strLower = strLower.Substring(0, index) + strAlarmPosition + strLower.Substring(index + len);
                index = index + 1;
                return true;
            }
            
            return false;
        }

        private static string GetAlarmPosition(IDataManager dataManager, SensorZone sensorZoneHistory, out string strErrorMessage)
        {
            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("a.{0} = {1}", SensorZone.Fields.sensor_zone_hist_sn, sensorZoneHistory.sensor_zone_hist_sn);
            ArrayList arrDatas = joinManager.JoinSensorZoneHistorySensorZoneHistoryDetailSensorZoneEquipmentZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i + 3] != null && arrDatas[i + 3] is EquipmentZone)
                {
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i + 3];
                    return equipZone.disp_text;
                }
            }

            if (sensorZoneHistory.zone_sn == null)
                return "";

            strCondition = string.Format("{0} = {1}", Zone.Fields.zone_sn, (int)sensorZoneHistory.zone_sn);
            Zone zone = dataManager.GetSelect().SelectFirst<Zone>(strCondition, out strErrorMessage);

            if (zone == null)
                return "";

            return zone.disp_text;
        }

        private static bool ReadTemporaryInfo(IDataManager dataManager, string strTemporaryNos, string strTemporaryMemberNos, ref string strRegularNos, ref string strRegularMemberNos, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = null;

            if (strTemporaryNos != null)
            {
                if (strTemporaryMemberNos == null)
                    strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_sn, strTemporaryNos);
                else
                    strCondition = string.Format("{0} in ({1}) or {2} in ({3})", TemporaryMember.Fields.tmpr_sn, strTemporaryNos, TemporaryMember.Fields.tmpr_memb_sn, strTemporaryMemberNos);
            }
            else if (strTemporaryMemberNos != null)
                strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_memb_sn, strTemporaryMemberNos);
            else
                return true;

            IEnumerable<TemporaryMember> temporaryMembers = dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

            if (temporaryMembers == null)
                return false;

            foreach (var member in temporaryMembers)
            {
                if (member.rgl_memb_sn != null)
                {
                    if (strRegularMemberNos != null)
                        strRegularMemberNos = member.rgl_memb_sn.ToString();
                    else
                        strRegularMemberNos += "," + member.rgl_memb_sn.ToString();
                }
                else if (member.rgl_sn != null)
                {
                    if (strRegularNos != null)
                        strRegularNos = member.rgl_sn.ToString();
                    else
                        strRegularNos += "," + member.rgl_sn.ToString();
                }
            }

            strErrorMessage = null;
            return true;
        }

        private static List<string> GetEmails(IDataManager dataManager, string strRegularNos, string strRegularMemberNos, out string strErrorMessage)
        {
            string strCondition = "";

            if (strRegularNos != null)
            {
                if (strRegularMemberNos != null)
                    strCondition = string.Format("{0} in ({1}) or {2} in ({3})", RegularMember.Fields.rgl_sn, strRegularNos, RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
                else
                    strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
            }
            else if (strRegularMemberNos != null)
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
            else
            {
                strErrorMessage = null;
                return new List<string>();
            }

            IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (regularMembers == null)
                return null;

            Dictionary<string, string> dicEmails = new Dictionary<string, string>();

            foreach (RegularMember regularMember in regularMembers)
            {
                if (regularMember.email != null && regularMember.email.Length > 0)
                {
                    dicEmails[regularMember.email] = regularMember.email;
                }
            }

            List<string> emails = new List<string>();
            emails.AddRange(dicEmails.Values);
            return emails;
        }

        private static List<string> GetPhoneNumbers(IDataManager dataManager, string strRegularNos, string strRegularMemberNos, out string strErrorMessage)
        {
            string strCondition = "";

            if (strRegularNos != null)
            {
                if (strRegularMemberNos != null)
                    strCondition = string.Format("{0} in ({1}) or {2} in ({3})", RegularMember.Fields.rgl_sn, strRegularNos, RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
                else
                    strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
            }
            else if (strRegularMemberNos != null)
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
            else
            {
                strErrorMessage = null;
                return new List<string>();
            }

            IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (regularMembers == null)
                return null;

            Dictionary<string, string> dicPhoneNumbers = new Dictionary<string, string>();

            foreach (RegularMember regularMember in regularMembers)
            {
                if (regularMember.telno != null && regularMember.telno.Length > 0)
                {
                    string strPhoneNumber = AES256Cipher.AES_decrypt(regularMember.telno);
                    dicPhoneNumbers[strPhoneNumber] = strPhoneNumber;
                }
            }

            List<string> phoneNumbers = new List<string>();
            phoneNumbers.AddRange(dicPhoneNumbers.Values);
            return phoneNumbers;
        }
    }
}
