using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Account;
using Base.Account.IBLL;
using Base.Account.IBLL.Interface;
using Base.Model.Common.Team;
using dnsDapperDBUtil;
using dnsSMS;
using System.Collections.Generic;
using dnsEmail;
//using System.Net;
//using System.Net.Mail;

namespace Agent.Soulbrain
{
    public class PasswordManager
    {
        // 신규계정의 비밀번호를 생성하고 생성된 비밀번호를 사용자에게 문자메시지로 전달한다.
        public bool SetDefaultPasswordSMS(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, int userNo, string strUserID, int? regularMemberNo, string strSalt, out string strErrorMessage)
        {
            string strPhoneNumber = GetPhoneNumber(dataManager, regularMemberNo, out strErrorMessage);

            if (strPhoneNumber == null)
                return false;

            string strPassword = processManager.MakeRandomPassword(passwordPolicy, userNo, strUserID, ref strSalt, out strErrorMessage);

            if (strPassword == null)
                return false;

            string strMessage = "[스마트 재난관리 시스템]\r\n임시 비밀번호 발급 : " + strPassword;
            return SendSMS(strPhoneNumber, strMessage, out strErrorMessage);
        }

        // 신규계정의 비밀번호를 생성하고 생성된 비밀번호를 사용자에게 이메일로 전달한다.
        public bool SetDefaultPasswordEmail(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, int userNo, string strUserID, string strSalt, string strEmail, out string strErrorMessage)
        {
            string strPassword = processManager.MakeRandomPassword(passwordPolicy, userNo, strUserID, ref strSalt, out strErrorMessage);

            if (strPassword == null)
                return false;

            string strMessage = "[스마트 재난관리 시스템]\r\n임시 비밀번호가 발급되었습니다.\r\n" + strPassword;
            return SendEmail(strEmail, strMessage, out strErrorMessage);
        }

        // 계정 소유자의 이름과 전화번호를 이용하여 임시 비밀번호를 만들어 전달한다.
        public bool MakeTemporaryPasswordSMS(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, string strUserName, string strPhoneNumber, out string strErrorMessage)
        {
            if (strPhoneNumber == null || strPhoneNumber.Length == 0)
            {
                strErrorMessage = "휴대폰 번호가 비어있습니다.";
                return false;
            }

            string strEncrypt = AES256Cipher.AES_encrypt(strPhoneNumber);

            string strCondition = string.Format("{0} = '{1}' and {2} = '{3}'",
                RegularMember.Fields.memb_name, strUserName,
                RegularMember.Fields.telno, strEncrypt);

            RegularMember member = dataManager.GetSelect().SelectFirst<RegularMember>(strCondition, out strErrorMessage);

            if (member == null)
            {
                if (strErrorMessage == null)
                {
                    strErrorMessage = "주어진 조건에 맞는 직원 정보를 찾을수 없습니다.";
                    return false;
                }
                else
                    return false;
            }

            strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
            IEnumerable<User> users = dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

            if (users == null)
                return false;

            foreach (User user in users)
            {
                return SetDefaultPasswordSMS(processManager, dataManager, passwordPolicy, user.user_sn, user.user_id, user.rgl_memb_sn, user.password_salt, out strErrorMessage);
            }

            strErrorMessage = "주어진 조건에 맞는 사용자 계정을 찾을수 없습니다.";
            return false;
        }

        // 계정 소유자의 이름과 이메일을 이용하여 임시 비밀번호를 만들어 전달한다.
        public bool MakeTemporaryPasswordEmail(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, string strUserName, string strEmail, out string strErrorMessage)
        {
            if (strEmail == null || strEmail.Length == 0)
            {
                strErrorMessage = "이메일 주소가 비어있습니다.";
                return false;
            }

            string strCondition = string.Format("{0} = '{1}' and {2} = '{3}'",
                RegularMember.Fields.memb_name, strUserName,
                RegularMember.Fields.email, strEmail);

            RegularMember member = dataManager.GetSelect().SelectFirst<RegularMember>(strCondition, out strErrorMessage);

            if (member == null)
            {
                if (strErrorMessage == null)
                {
                    strErrorMessage = "주어진 조건에 맞는 직원 정보를 찾을수 없습니다.";
                    return false;
                }
                else
                    return false;
            }

            strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
            IEnumerable<User> users = dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

            if (users == null)
                return false;

            foreach (User user in users)
            {
                return SetDefaultPasswordEmail(processManager, dataManager, passwordPolicy, user.user_sn, user.user_id, user.password_salt, strEmail, out strErrorMessage);
            }

            strErrorMessage = "주어진 조건에 맞는 사용자 계정을 찾을수 없습니다.";
            return false;
        }

        private bool SendEmail(string strEmail, string strMessage, out string strErrorMessage)
        {
            string strSender = "noreply@unes.co.kr";
            string strSystemCode = "gtuihesanxagonxe";
            string strSubject = "임시 비밀번호가 발급되었습니다.";
            return SendEmail(strSender, strSystemCode, strEmail, strSubject, strMessage, out strErrorMessage);
        }

        private bool SendEmail(string strSystemMail, string strSystemCode, string strEmail, string strSubject, string strMessage, out string strErrorMessage)
        {
            strErrorMessage = null;

            EmailContent content = new EmailContent();
            content.Message = strMessage;
            content.EmailList.Add(strEmail);
            content.Subject = strSubject;

            IEmailClient client = EmailClientFactory.CreateMailClient();
            return client.SendEmail(content, ref strErrorMessage);
        }

        private bool SendSMS(string strPhoneNumber, string strMessage, out string strErrorMessage)
        {
            IMessageClient client = MessageClientFactory.CreateMessageClient();

            if (client == null)
            {
                strErrorMessage = "문자메시지를 전송할 수 없습니다.";
                return false;
            }

            MessageContent content = new MessageContent();
            content.Caller = "027144133";
            content.PhoneNumbers.Add(strPhoneNumber);
            content.Message = strMessage;

            strErrorMessage = null;
            return client.SendSMS(content);
        }

        private string GetPhoneNumber(IDataManager dataManager, int? regularMemberNo, out string strErrorMessage)
        {
            if (regularMemberNo == null)
            {
                strErrorMessage = "사용자 계정에 직원정보가 연결되어 있지 않습니다.";
                return null;
            }

            string strCondition = string.Format("{0} = {1}", RegularMember.Fields.rgl_memb_sn, (int)regularMemberNo);
            RegularMember member = dataManager.GetSelect().SelectFirst<RegularMember>(strCondition, out strErrorMessage);

            if (member == null)
            {
                if (strErrorMessage == null)
                {
                    strErrorMessage = "사용자 계정에 연결된 직원정보를 찾을수 없습니다.";
                    return null;
                }
                else
                    return null;
            }

            if (member.telno == null || member.telno.Length == 0)
            {
                strErrorMessage = "휴대폰 정보가 입력되지 않은 사용자입니다.";
                return null;
            }

            string strPhoneNumber = AES256Cipher.AES_decrypt(member.telno);
            return strPhoneNumber;
        }
    }
}
