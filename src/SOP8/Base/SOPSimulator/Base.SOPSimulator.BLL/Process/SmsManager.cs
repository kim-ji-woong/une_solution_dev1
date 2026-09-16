using System.Collections.Generic;
using Base.SOPManager.IBLL.Models.Component;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Common.Team;
using dnsDapperDBUtil;
using Base.Model.Sop.Component;
using dnsSMS;
using Base.SOPSimulator.IBLL.Request;
using Base.SOPManager.IBLL.Models;
using Base.DAL;

namespace Base.SOPSimulator.BLL.Process
{
    class SmsManager
    {
        private const string UseSms = "SOP/UseSMS";

        public static bool SendSMS(IDataManager dataManager, TransmissionData transmissionData, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (transmissionData.Transmission == null || transmissionData.Transmission.mssage == null)
                return true;

            string strMessage = transmissionData.Transmission.mssage.Trim();

            if (strMessage.Length == 0)
                return true;

            List<string> phoneNumbers = GetPhoneNumbers(dataManager, transmissionData, out strErrorMessage);

            if (phoneNumbers == null)
                return false;

            SendSMS(phoneNumbers, strMessage);
            return true;
        }

        public static bool SendSMS(IDataManager dataManager, RequestSendMessage data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.UseSMS == false)
                return true;

            if (CheckOption(dataManager, UseSms, data.SiteNo, out strErrorMessage) == false)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "SOP 시스템 환경설정에서 문자 전송을 허용하지 않고 있습니다.\r\n옵션을 확인해 보세요.";

                return false;
            }

            if (data.Message == null || data.Message.Length == 0)
            {
                strErrorMessage = "전송할 내용이 존재하지 않습니다.";
                return false;
            }

            List<string> phoneNumbers = GetPhoneNumbers(dataManager, data.Receivers, out strErrorMessage);

            if (phoneNumbers == null)
                return false;

            SendSMS(phoneNumbers, data.Message);
            return true;
        }

        public static bool CheckOption(IDataManager dataManager, string strOptionName, int siteNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}' and {2} = {3}", Model.Common.Option.Fields.prop_name, strOptionName, Model.Common.Option.Fields.site_sn, siteNo);
            Model.Common.Option option = dataManager.GetSelect().SelectFirst<Model.Common.Option>(strCondition, out strErrorMessage);

            if (option == null)
                return false;

            return option.prop_value != null && option.prop_value.Trim().ToLower() == "true";
        }

        private static void SendSMS(List<string> phoneNumbers, string strMessage)
        {
            IMessageClient client = MessageClientFactory.CreateMessageClient();

            MessageContentMMS mms = new MessageContentMMS();
            mms.Message = strMessage;
            mms.PhoneNumbers.AddRange(phoneNumbers);

            //client.SendMMS(mms);
            client.SendSMS(mms);
        }

        private static List<string> GetPhoneNumbers(IDataManager dataManager, List<Receiver> receivers, out string strErrorMessage)
        {
            string strRegularNos = "";
            string strTemporaryNos = "";

            foreach (Receiver receiver in receivers)
            {
                if (receiver.TeamType == (int)Receiver.TeamDataType.RegularTeam)
                {
                    if (strRegularNos.Length == 0)
                        strRegularNos = receiver.TeamNo.ToString();
                    else
                        strRegularNos += "," + receiver.TeamNo.ToString();
                }
                else if (receiver.TeamType == (int)Receiver.TeamDataType.TemporaryNormalTeam || receiver.TeamType == (int)Receiver.TeamDataType.TemporaryEmergencyTeam)
                {
                    if (strTemporaryNos.Length == 0)
                        strTemporaryNos = receiver.TeamNo.ToString();
                    else
                        strTemporaryNos += "," + receiver.TeamNo.ToString();
                }
            }

            string strRegularMemberNos = ReadTemporaryInfo(dataManager, strTemporaryNos, ref strRegularNos, out strErrorMessage);

            if (strErrorMessage != null)
                return null;

            return GetPhoneNumbers(dataManager, strRegularNos, strRegularMemberNos, out strErrorMessage);
        }

        private static List<string> GetPhoneNumbers(IDataManager dataManager, TransmissionData transmissionData, out string strErrorMessage)
        {
            string strRegularNos = GetRegularNos(transmissionData.Regulars);
            string strTemporaryNos = GetTemporaryNos(transmissionData.Temporaries);
            string strRegularMemberNos = ReadTemporaryInfo(dataManager, strTemporaryNos, ref strRegularNos, out strErrorMessage);

            if (strRegularNos.Length == 0 && strRegularMemberNos.Length == 0)
                return new List<string>();

            return GetPhoneNumbers(dataManager, strRegularNos, strRegularMemberNos, out strErrorMessage);
        }

        private static List<string> GetPhoneNumbers(IDataManager dataManager, string strRegularNos, string strRegularMemberNos, out string strErrorMessage)
        {
            string strCondition = "";

            if (strRegularNos.Length > 0)
            {
                if (strRegularMemberNos.Length > 0)
                    strCondition = string.Format("{0} in ({1}) or {2} in ({3})", RegularMember.Fields.rgl_sn, strRegularNos, RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
                else
                    strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
            }
            else if (strRegularMemberNos.Length > 0)
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

        private static string GetRegularNos(List<TransmissionRegular> regulars)
        {
            string strRegularNos = "";

            foreach (var data in regulars)
            {
                if (strRegularNos.Length == 0)
                    strRegularNos = data.rgl_sn.ToString();
                else
                    strRegularNos += "," + data.rgl_sn.ToString();
            }

            return strRegularNos;
        }

        private static string GetTemporaryNos(List<TransmissionTemporaryEx> temporaries)
        {
            string strTemporaryNos = "";

            foreach (var data in temporaries)
            {
                if (strTemporaryNos.Length == 0)
                    strTemporaryNos = data.tmpr_sn.ToString();
                else
                    strTemporaryNos += "," + data.tmpr_sn.ToString();
            }

            return strTemporaryNos;
        }

        public static string ReadTemporaryInfo(IDataManager dataManager, string strTemporaryNos, ref string strRegularNos, out string strErrorMessage)
        {
            Dictionary<int, int> dicRegularNos = ReadRegularNos(dataManager, strRegularNos, out strErrorMessage);

            if (dicRegularNos == null)
                return null;

            Dictionary<int, int> dicRegularMemberNos = new Dictionary<int, int>();
            //string strRegularMemberNos = "";

            if (strTemporaryNos.Length > 0)
            {
                string strCondition = string.Format("{0} in ({1})", Temporary.Fields.tmpr_sn, strTemporaryNos);

                // 하위팀까지 검색한다.
                ICollection<int> temporaryNos = CustomManager.GetRecursiveQuery(dataManager, Temporary.TableName, Temporary.Fields.tmpr_sn.ToString(), Temporary.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);

                if (temporaryNos == null)
                    return null;

                strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_sn, string.Join(",", temporaryNos));
                IEnumerable<TemporaryMember> temporaryMembers = dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

                if (temporaryMembers == null)
                    return null;

                foreach (var member in temporaryMembers)
                {
                    if (member.rgl_memb_sn != null)
                    {
                        dicRegularMemberNos[(int)member.rgl_memb_sn] = (int)member.rgl_memb_sn;
                        /*if (strRegularMemberNos.Length == 0)
                            strRegularMemberNos = member.rgl_memb_sn.ToString();
                        else
                            strRegularMemberNos += "," + member.rgl_memb_sn.ToString();*/
                    }
                    else if (member.rgl_sn != null)
                    {
                        dicRegularNos[(int)member.rgl_sn] = (int)member.rgl_sn;
                        /*if (strRegularNos.Length == 0)
                            strRegularNos = member.rgl_sn.ToString();
                        else
                            strRegularNos += "," + member.rgl_sn.ToString();*/
                    }
                }
            }

            strRegularNos = null;
            string strRegularMemberNos = null;

            foreach (KeyValuePair<int, int> pair in dicRegularNos)
            {
                if (strRegularNos == null)
                    strRegularNos = pair.Key.ToString();
                else
                    strRegularNos += "," + pair.Key.ToString();
            }

            foreach (KeyValuePair<int, int> pair in dicRegularMemberNos)
            {
                if (strRegularMemberNos == null)
                    strRegularMemberNos = pair.Key.ToString();
                else
                    strRegularMemberNos += "," + pair.Key.ToString();
            }

            if (strRegularNos == null)
                strRegularNos = "";

            if (strRegularMemberNos == null)
                strRegularMemberNos = "";

            strErrorMessage = null;
            return strRegularMemberNos;
        }

        // Result 값 : Key, Value => Regular No
        private static Dictionary<int, int> ReadRegularNos(IDataManager dataManager, string strRegularNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strRegularNos == null || strRegularNos.Length == 0)
                return new Dictionary<int, int>();

            string strCondition = string.Format("{0} in ({1})", Regular.Fields.rgl_sn, strRegularNos);

            // 하위팀까지 검색한다.
            ICollection<int> regularNos = CustomManager.GetRecursiveQuery(dataManager, Regular.TableName, Regular.Fields.rgl_sn.ToString(), Regular.Fields.parnts_sn.ToString(), strCondition, out strErrorMessage);

            if (regularNos == null)
                return null;

            Dictionary<int, int> dicRegularNos = new Dictionary<int, int>();

            foreach (int regularNo in regularNos)
            {
                dicRegularNos[regularNo] = regularNo;
            }

            return dicRegularNos;
        }
    }
}
