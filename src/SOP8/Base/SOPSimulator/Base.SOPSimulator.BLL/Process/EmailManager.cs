using Base.SOPSimulator.IBLL.Request;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SOPManager.IBLL.Models;
using Base.Model.Common.Team;
using dnsEmail;

namespace Base.SOPSimulator.BLL.Process
{
    class EmailManager
    {
        private const string UseEmail = "SOP/UseEmail";

        public static bool SendEmail(IDataManager dataManager, RequestSendMessage data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.UseEmail == false)
                return true;

            if (SmsManager.CheckOption(dataManager, UseEmail, data.SiteNo, out strErrorMessage) == false)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "SOP 시스템 환경설정에서 이메일 전송을 허용하지 않고 있습니다.\r\n옵션을 확인해 보세요.";

                return false;
            }

            if (data.Message == null || data.Message.Length == 0)
            {
                strErrorMessage = "전송할 내용이 존재하지 않습니다.";
                return false;
            }

            List<string> emails = GetEmails(dataManager, data.Receivers, out strErrorMessage);

            if (emails == null)
                return false;

            return SendEmail(emails, data.Message, data.Subject, ref strErrorMessage);
        }

        private static bool SendEmail(List<string> emails, string strMessage, string strSubject, ref string strErrorMessage)
        {
            if (emails == null || emails.Count == 0)
            {
                strErrorMessage = "수신할 이메일 목록이 존재하지 않습니다.";
                return false;
            }

            EmailContent content = new EmailContent();
            content.EmailList.AddRange(emails);
            content.Message = strMessage;
            content.Subject = strSubject;

            IEmailClient client = EmailClientFactory.CreateMailClient();
            return client.SendEmail(content, ref strErrorMessage);
        }

        private static List<string> GetEmails(IDataManager dataManager, List<Receiver> receivers, out string strErrorMessage)
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

            string strRegularMemberNos = SmsManager.ReadTemporaryInfo(dataManager, strTemporaryNos, ref strRegularNos, out strErrorMessage);

            if (strErrorMessage != null)
                return null;

            return GetEmails(dataManager, strRegularNos, strRegularMemberNos, out strErrorMessage);
        }

        private static List<string> GetEmails(IDataManager dataManager, string strRegularNos, string strRegularMemberNos, out string strErrorMessage)
        {
            string strCondition = "";

            if (strRegularNos.Length > 0)
            {
                if (strRegularMemberNos.Length > 0)
                    strCondition = string.Format("{0} in ({1}) or {2} in ({3})", RegularMember.Fields.rgl_sn, strRegularNos, RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
                else
                    strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
            }
            else
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);

            IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (regularMembers == null)
                return null;

            Dictionary<string, string> dicEmails = new Dictionary<string, string>();

            foreach (RegularMember regularMember in regularMembers)
            {
                if (regularMember.email != null && regularMember.email.Length > 0)
                    dicEmails[regularMember.email] = regularMember.email;
            }

            List<string> emails = new List<string>();
            emails.AddRange(dicEmails.Values);
            return emails;
        }
    }
}
