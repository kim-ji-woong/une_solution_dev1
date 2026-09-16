using System;
using System.Collections.Generic;
using System.Linq;
using Base.DAL;
using Base.DAL.Models;
using System.Collections;
using Base.Account.IBLL.Models;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Interface;
using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Account;
using Base.Model.Common.Team;
using Response;

namespace Base.Account.BLL.Process
{
    class UserManager
    {
        private enum UserListSortType
        {
            MemberName = 0,
            UserID = 1,
            Grade = 2
        }
        private class AesHelper
        {
            private const int KeySize = 32;

            private static char[] BaseArr = MakeBaseArray();

            private static char[] MakeBaseArray()
            {
                char[] arr = new char[62];
                int i = 0;

                for (char ch = '0'; ch <= '9'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'a'; ch <= 'z'; ch++)
                {
                    arr[i++] = ch;
                }

                for (char ch = 'A'; ch <= 'Z'; ch++)
                {
                    arr[i++] = ch;
                }

                return arr;
            }

            public static string MakeRandomKey(long? num)
            {
                string strKey = "";
                int max = BaseArr.Length - 1;

                int seed = num == null ? DateTime.Now.GetHashCode() : (int)num;
                Random rand = new Random(seed);

                for (int i = 0; i < KeySize; i++)
                {
                    int nIndex = rand.Next(max);
                    strKey += BaseArr[nIndex];
                }

                return strKey;
            }

            /// <summary>  
            /// AES encryption algorithm  
            /// </summary>  
            /// <param name="input">plain string</param>  
            /// <param name="key">key (32 bit)</param>  

            public static string Encrypt(string input, string key)
            {
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream())
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, encryptor, System.Security.Cryptography.CryptoStreamMode.Write))
                        {
                            using (System.IO.StreamWriter swEncrypt = new System.IO.StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(input);
                            }
                            byte[] bytes = msEncrypt.ToArray();
                            return ByteArrayToHexString(bytes);
                        }
                    }
                }
            }

            /// <summary>  
            /// AES decryption  
            /// </summary>  
            /// <param name="input"> ciphertext byte array</param>  
            /// <param name="key">key (32 bit)</param>  
            /// <returns> returns the decrypted string</returns>  
            public static string Decrypt(string input, string key)
            {
                byte[] inputBytes = HexStringToByteArray(input);
                byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 32));
                using (System.Security.Cryptography.AesCryptoServiceProvider aesAlg = new System.Security.Cryptography.AesCryptoServiceProvider())
                {
                    aesAlg.Key = keyBytes;
                    aesAlg.IV = System.Text.Encoding.UTF8.GetBytes(key.Substring(0, 16));

                    System.Security.Cryptography.ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (System.IO.MemoryStream msEncrypt = new System.IO.MemoryStream(inputBytes))
                    {
                        using (System.Security.Cryptography.CryptoStream csEncrypt = new System.Security.Cryptography.CryptoStream(msEncrypt, decryptor, System.Security.Cryptography.CryptoStreamMode.Read))
                        {
                            using (System.IO.StreamReader srEncrypt = new System.IO.StreamReader(csEncrypt))
                            {
                                return srEncrypt.ReadToEnd();
                            }
                        }
                    }
                }
            }

            public static string GetHashCode(string input)
            {
                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);
                byte[] hashed = System.Security.Cryptography.SHA256.Create().ComputeHash(bytes);

                string strHashed = "";

                foreach (byte b in hashed)
                {
                    strHashed += string.Format("{0:x2}", b);
                }

                return strHashed;
            }

            /// <summary>
            /// Convert the specified hex string to a byte array
            /// </summary>
            /// <param name="s">hexadecimal string (eg "7F 2C 4A" or "7F2C4A")</param>
            /// <returns>byte array corresponding to hexadecimal string</returns>
            public static byte[] HexStringToByteArray(string s)
            {
                s = s.Replace(" ", "");
                byte[] buffer = new byte[s.Length / 2];
                for (int i = 0; i < s.Length; i += 2)
                    buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
                return buffer;
            }

            /// <summary>
            /// Convert a byte array into a formatted hex string
            /// </summary>
            /// <param name="data">byte array</param>
            /// <returns> formatted hexadecimal string</returns>
            public static string ByteArrayToHexString(byte[] data)
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder(data.Length * 3);
                foreach (byte b in data)
                {
                    //hexadecimal number
                    sb.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                    //16 digits separated by spaces
                    //sb.Append(Convert.ToString(b, 16).PadLeft(2, '0').PadRight(3, ' '));
                }
                return sb.ToString().ToUpper();
            }
        }

        private IDataManager m_dataManager = null;

        public UserManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseUserList GetUserList(RequestUserList data)
        {
            string strErrorMessage;
            Dictionary<int, Grade> dicGrades = ReadGrades(out strErrorMessage);

            if (dicGrades == null)
                return new ResponseUserList(false, strErrorMessage);

            if (data.UseTeamName == false)
            {
                if (data.UseMemberName == false && data.UseJobLevel == false && data.UseJobPosition == false && data.UsePhoneNumber == false && data.UseEmail == false)
                    return GetUserListNoTeamNoMember(data, dicGrades);
                else
                    return GetUserListNoTeam(data, dicGrades);
            }

            JoinManager joinManager = new JoinManager(m_dataManager);

            ResponseUserList response = new ResponseUserList(true, "");
            int? beginIndex = data.GetBeginIndex();
            int? pageRowCount = data.PageRowCount;

            if (beginIndex == null)
            {
                beginIndex = 1;
                pageRowCount = null;
            }

            string strOrderBy = GetUserListOrderBy(data, true);
            string strCondition = null;

            if (data.SiteNo != null)
            {
                strCondition = string.Format("a.{0} = {1}", User.Fields.site_sn, (int)data.SiteNo);

                // 정규조직원이 반드시 연결되어야만 하는가?
                if (data.LinkRegularMember)
                    strCondition += string.Format(" and a.{0} is not null", User.Fields.rgl_memb_sn);
            }
            else if (data.LinkRegularMember)
            {
                strCondition += string.Format("a.{0} is not null", User.Fields.rgl_memb_sn);
            }

            //string strCondition = data.SiteNo == null ? null : string.Format("a.{0} = {1}", User.Fields.site_sn, (int)data.SiteNo);
            ArrayList arrDatas = joinManager.JoinUserRegularMemberRegular(strCondition, (int)beginIndex, pageRowCount, strOrderBy, out strErrorMessage);

            response = MakeUserList(arrDatas, data, dicGrades, strErrorMessage);

            if (arrDatas != null && arrDatas.Count == 0 && (int)beginIndex > 1)
            {
                arrDatas = joinManager.JoinUserRegularMemberRegular(strCondition, 1, pageRowCount, strOrderBy, out strErrorMessage);

                if (arrDatas.Count > 0 && arrDatas[0] is Pagination)
                {
                    Pagination pagination = (Pagination)arrDatas[0];
                    response.TotalCount = pagination.TotalCount;
                }
            }

            return response;
        }

        private Dictionary<int, Grade> ReadGrades(out string strErrorMessage)
        {
            IEnumerable<Grade> grades = m_dataManager.GetSelect().Select<Grade>(null, out strErrorMessage);

            if (grades == null)
                return null;

            Dictionary<int, Grade> dicGrades = new Dictionary<int, Grade>();

            foreach (Grade grade in grades)
            {
                dicGrades[grade.grad_sn] = grade;
            }

            return dicGrades;
        }

        public ResponseUserList GetUserListNoTeam(RequestUserList data, Dictionary<int, Grade> dicGrades)
        {
            JoinManager joinManager = new JoinManager(m_dataManager);

            ResponseUserList response = new ResponseUserList(true, "");
            int? beginIndex = data.GetBeginIndex();
            int? pageRowCount = data.PageRowCount;

            if (beginIndex == null)
            {
                beginIndex = 1;
                pageRowCount = null;
            }

            string strOrderBy = GetUserListOrderBy(data, true);
            string strErrorMessage;

            string strCondition = data.SiteNo == null ? null : string.Format("a.{0} = {1}", User.Fields.site_sn, (int)data.SiteNo);
            ArrayList arrDatas = joinManager.JoinUserRegularMember(strCondition, (int)beginIndex, pageRowCount, strOrderBy, out strErrorMessage);

            response = MakeUserList2(arrDatas, data, dicGrades, strErrorMessage);

            if (arrDatas != null && arrDatas.Count == 0 && (int)beginIndex > 1)
            {
                arrDatas = joinManager.JoinUserRegularMember(strCondition, 1, pageRowCount, strOrderBy, out strErrorMessage);

                if (arrDatas.Count > 0 && arrDatas[0] is Pagination)
                {
                    Pagination pagination = (Pagination)arrDatas[0];
                    response.TotalCount = pagination.TotalCount;
                }
            }

            return response;
        }

        public ResponseUserList GetUserListNoTeamNoMember(RequestUserList data, Dictionary<int, Grade> dicGrades)
        {
            string strErrorMessage;
            string strCondition = data.SiteNo == null ? null : string.Format("{0} = {1}", User.Fields.site_sn, (int)data.SiteNo);
            IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

            if (users == null)
                return new ResponseUserList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = null;
            Dictionary<int, string> dicJobPositions = null;

            ResponseUserList response = new ResponseUserList(true, "");
            string strSearchText = data.SearchText != null && data.SearchText.Trim().Length > 0 ? data.SearchText.ToLower().Trim() : null;

            foreach (User user in users)
            {
                AccountUser accountUser = MakeAccountUser(user, null, null, data, dicGrades, ref dicJobLevels, ref dicJobPositions, out strErrorMessage);

                if (accountUser == null)
                    return new ResponseUserList(false, strErrorMessage);

                if (CheckSearchText(accountUser, data, strSearchText))
                {
                    response.Users.Add(accountUser);
                }
            }

            response.Users = ApplyUserSort(response.Users, data);
            CheckPagination(response, data);
            return GetFilterUserList(response, data, strSearchText);
        }

        private string GetUserListOrderBy(RequestUserList data, bool useMemberName)
        {
            string strSortField = string.Format("a.{0}", User.Fields.user_sn);
            bool useDefaultField = true;

            if (data.SortType != null)
            {
                UserListSortType sortType = (UserListSortType)(int)data.SortType;

                switch (sortType)
                {
                    case UserListSortType.MemberName:
                        if (useMemberName)
                        {
                            strSortField = string.Format("b.{0}", RegularMember.Fields.memb_name);
                            useDefaultField = false;
                        }
                        break;
                    case UserListSortType.UserID:
                        strSortField = string.Format("a.{0}", User.Fields.user_id);
                        useDefaultField = false;
                        break;
                    case UserListSortType.Grade:
                        strSortField = string.Format("a.{0}", User.Fields.grad_sn);
                        useDefaultField = false;
                        break;
                }
            }

            string strSortMethod = data.SortMethod ? "asc" : "desc";

            if (useDefaultField)
                return string.Format("{0} {1}", strSortField, strSortMethod);

            return string.Format("{0} {1}, a.{2} asc", strSortField, strSortMethod, User.Fields.user_sn);
        }

        private List<AccountUser> ApplyUserSort(List<AccountUser> users, RequestUserList data)
        {
            if (users == null || users.Count == 0)
                return users;

            if (data.SortType != null)
            {
                UserListSortType sortType = (UserListSortType)(int)data.SortType;

                switch (sortType)
                {
                    case UserListSortType.UserID:
                        return data.SortMethod
                            ? users.OrderBy(item => NormalizeSortText(item.UserID)).ThenBy(item => item.UserNo).ToList()
                            : users.OrderByDescending(item => NormalizeSortText(item.UserID)).ThenBy(item => item.UserNo).ToList();
                    case UserListSortType.Grade:
                        return data.SortMethod
                            ? users.OrderBy(item => NormalizeSortText(item.Grade)).ThenBy(item => item.UserNo).ToList()
                            : users.OrderByDescending(item => NormalizeSortText(item.Grade)).ThenBy(item => item.UserNo).ToList();
                }
            }

            return data.SortMethod
                ? users.OrderBy(item => item.UserNo).ToList()
                : users.OrderByDescending(item => item.UserNo).ToList();
        }

        private string NormalizeSortText(string value)
        {
            return value == null ? string.Empty : value.ToLowerInvariant();
        }
        private void CheckPagination(ResponseUserList response, RequestUserList data)
        {
            if (data.PageRowCount != null && data.PageRowCount > 0)
            {
                int userCount = response.Users.Count;
                response.TotalCount = userCount;

                List<AccountUser> users = new List<AccountUser>();

                int beginIndex = (data.PageNo - 1) * (int)data.PageRowCount;
                int endIndex = beginIndex + (int)data.PageRowCount;

                if (endIndex > userCount)
                    endIndex = userCount;

                for (int i = beginIndex; i < endIndex; i++)
                {
                    users.Add(response.Users[i]);
                }

                response.Users.Clear();
                response.Users.AddRange(users);
            }
            else
                response.TotalCount = response.Users.Count;
        }

        private ResponseUserList MakeUserList(ArrayList arrDatas, RequestUserList data, Dictionary<int, Grade> dicGrades, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseUserList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = null;
            Dictionary<int, string> dicJobPositions = null;

            ResponseUserList response = new ResponseUserList(true, "");
            int nDataCount = arrDatas.Count;

            string strSearchText = data.SearchText != null && data.SearchText.Trim().Length > 0 ? data.SearchText.ToLower().Trim() : null;

            for (int i = 0; i < nDataCount - 3; i += 4)
            {
                if (arrDatas[i] is Pagination && arrDatas[i + 1] is User && (arrDatas[i + 2] is RegularMember || arrDatas[i + 2] == null) && (arrDatas[i + 3] is Regular || arrDatas[i + 3] == null))
                {
                    Pagination pagination = (Pagination)arrDatas[i];
                    User user = (User)arrDatas[i + 1];
                    RegularMember member = (RegularMember)arrDatas[i + 2];
                    Regular regular = (Regular)arrDatas[i + 3];

                    AccountUser accountUser = MakeAccountUser(user, member, regular, data, dicGrades, ref dicJobLevels, ref dicJobPositions, out strErrorMessage);

                    if (accountUser == null)
                        return new ResponseUserList(false, strErrorMessage);

                    if (CheckSearchText(accountUser, data, strSearchText))
                    {
                        response.Users.Add(accountUser);
                        response.TotalCount = pagination.TotalCount;
                    }
                }
            }

            return GetFilterUserList(response, data, strSearchText);
        }

        private ResponseUserList MakeUserList2(ArrayList arrDatas, RequestUserList data, Dictionary<int, Grade> dicGrades, string strErrorMessage)
        {
            if (arrDatas == null)
                return new ResponseUserList(false, strErrorMessage);

            Dictionary<int, string> dicJobLevels = null;
            Dictionary<int, string> dicJobPositions = null;

            ResponseUserList response = new ResponseUserList(true, "");
            int nDataCount = arrDatas.Count;

            string strSearchText = data.SearchText != null && data.SearchText.Trim().Length > 0 ? data.SearchText.ToLower().Trim() : null;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is Pagination && arrDatas[i + 1] is User && (arrDatas[i + 2] is RegularMember || arrDatas[i + 2] == null))
                {
                    Pagination pagination = (Pagination)arrDatas[i];
                    User user = (User)arrDatas[i + 1];
                    RegularMember member = (RegularMember)arrDatas[i + 2];

                    AccountUser accountUser = MakeAccountUser(user, member, null, data, dicGrades, ref dicJobLevels, ref dicJobPositions, out strErrorMessage);

                    if (accountUser == null)
                        return new ResponseUserList(false, strErrorMessage);

                    if (CheckSearchText(accountUser, data, strSearchText))
                    {
                        response.Users.Add(accountUser);
                        response.TotalCount = pagination.TotalCount;
                    }
                }
            }

            return GetFilterUserList(response, data, strSearchText);
        }

        private ResponseUserList GetFilterUserList(ResponseUserList response, RequestUserList data, string strSearchText)
        {
            if (strSearchText == null)
                return response;

            int userCount = response.Users.Count;

            if (data.PageRowCount != null && data.PageRowCount > 0)
            {
                int beginIndex = (data.PageNo - 1) * (int)data.PageRowCount;

                List<AccountUser> users = new List<AccountUser>();
                int endIndex = beginIndex + (int)data.PageRowCount;

                if (endIndex > userCount)
                    endIndex = userCount;

                for (int i = beginIndex; i < endIndex; i++)
                {
                    users.Add(response.Users[i]);
                }

                response.Users.Clear();
                response.Users.AddRange(users);
                response.TotalCount = userCount;
            }
            else
            {
                response.TotalCount = userCount;
            }

            return response;
        }

        private bool CheckSearchText(AccountUser user, RequestUserList data, string strSearchText)
        {
            if (strSearchText == null)
                return true;

            if (user.UserID != null && user.UserID.ToLower().Contains(strSearchText))
                return true;

            if (data.UseTeamName && user.TeamName != null)
            {
                if (user.TeamName.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UseMemberName && user.MemberName != null)
            {
                if (user.MemberName.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UseNickName && user.NickName != null)
            {
                if (user.NickName.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UseJobLevel && user.JobLevel != null)
            {
                if (user.JobLevel.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UseJobPosition && user.JobPosition != null)
            {
                if (user.JobPosition.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UseGrade && user.Grade != null)
            {
                if (user.Grade.ToLower().Contains(strSearchText))
                    return true;
            }

            if (data.UsePhoneNumber && user.PhoneNumber != null)
            {
                if (user.PhoneNumber.Contains(strSearchText))
                    return true;
            }

            if (data.UseEmail && user.Email != null)
            {
                if (user.Email.Contains(strSearchText))
                    return true;
            }

            return false;
        }

        private AccountUser MakeAccountUser(User user, RegularMember member, Regular regular, RequestUserList data, Dictionary<int, Grade> dicGrades, ref Dictionary<int, string> dicJobLevels, ref Dictionary<int, string> dicJobPositions, out string strErrorMessage)
        {
            AccountUser accountUser = new AccountUser();

            accountUser.UserNo = user.user_sn;
            accountUser.UserID = user.user_id;
            accountUser.SiteNo = user.site_sn;
            accountUser.Memo = user.memo;

            if (data.UseTeamName && regular != null)
            {
                accountUser.TeamNo = regular.rgl_sn;
                accountUser.TeamName = regular.team_name;
            }

            if (data.UseMemberName && member != null)
            {
                accountUser.MemberNo = member.rgl_memb_sn;
                accountUser.MemberName = member.memb_name;
            }

            if (data.UseNickName)
            {
                accountUser.NickName = user.user_name;
            }

            if (data.UseJobLevel && member != null && member.clsf_no != null)
            {
                if (dicJobLevels == null || dicJobPositions == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return null;
                }

                string strJobLevel;

                if (dicJobLevels.TryGetValue((int)member.clsf_no, out strJobLevel))
                {
                    accountUser.JobLevelNo = (int)member.clsf_no;
                    accountUser.JobLevel = strJobLevel;
                }
            }

            if (data.UseJobPosition && member != null && member.ofcps_no != null)
            {
                if (dicJobLevels == null || dicJobPositions == null)
                {
                    if (ReadTeamOptions(ref dicJobLevels, ref dicJobPositions, out strErrorMessage) == false)
                        return null;
                }

                string strJobPosition;

                if (dicJobPositions.TryGetValue((int)member.ofcps_no, out strJobPosition))
                {
                    accountUser.JobPositionNo = (int)member.ofcps_no;
                    accountUser.JobPosition = strJobPosition;
                }
            }

            if (data.UseGrade)
            {
                Grade grade;

                if (dicGrades.TryGetValue(user.grad_sn, out grade))
                {
                    accountUser.GradeNo = grade.grad_sn;
                    accountUser.Grade = grade.grad_name;
                }
            }

            if (data.UsePhoneNumber && member != null && member.telno != null && member.telno.Length > 0)
            {
                accountUser.PhoneNumber = dnsDapperDBUtil.AES256Cipher.AES_decrypt(member.telno);
            }

            if (data.UseEmail && member != null && member.email != null && member.email.Length > 0)
            {
                accountUser.Email = member.email;
            }

            strErrorMessage = null;
            return accountUser;
        }

        private bool ReadTeamOptions(ref Dictionary<int, string> dicJobLevels, ref Dictionary<int, string> dicJobPositions, out string strErrorMessage)
        {
            var options = m_dataManager.GetSelect().Select<Model.Common.Team.Option>(null, out strErrorMessage);

            if (options == null)
                return false;

            foreach (var option in options)
            {
                if (option.team_optn_ty_no == (int)CodeType.JobLevel)
                {
                    if (dicJobLevels == null)
                        dicJobLevels = new Dictionary<int, string>();

                    dicJobLevels[option.team_optn_no] = option.team_optn_name;
                }
                else if (option.team_optn_ty_no == (int)CodeType.JobPosition)
                {
                    if (dicJobPositions == null)
                        dicJobPositions = new Dictionary<int, string>();

                    dicJobPositions[option.team_optn_no] = option.team_optn_name;
                }
            }

            return true;
        }

        public MessageResult UpdateUserInfo(RequestUpdateUserInfo data)
        {
            if (data.Grade == null && data.Memo == null && data.NickName == null)
                return new MessageResult(true, "");

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, data.UserNo);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage != null)
                    return new MessageResult(false, strErrorMessage);
                else
                    return new MessageResult(false, "존재하지 않는 사용자 계정입니다.");
            }

            Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();

            if (data.Grade != null)
                dicSets[User.Fields.grad_sn] = (int)data.Grade;

            if (data.Memo != null)
                dicSets[User.Fields.memo] = data.Memo;

            if (data.NickName != null)
                dicSets[User.Fields.user_name] = data.NickName;

            if (m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        public MessageResult DeleteUser(RequestDeleteUser data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.");

            string strCondition = string.Format("{0} = {1}", Model.Account.Option.Fields.user_sn, data.UserNo);

            if (dataManager.GetDelete().Delete<Model.Account.Option>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            strCondition = string.Format("{0} = {1}", Session.Fields.user_sn, data.UserNo);

            if (dataManager.GetDelete().Delete<Session>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            strCondition = string.Format("{0} = {1}", User.Fields.user_sn, data.UserNo);

            if (dataManager.GetDelete().Delete<User>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, "데이터베이스의 트랜잭션을 정상적으로 종료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }

        public ResponseAccountUser AddNewUser(RequestNewUser data, ProcessManager processManager, IUserCreator userCreator, IPasswordPolicy passwordPolicy)
        {
            string strErrorMessage;
            Dictionary<int, Grade> dicGrades = ReadGrades(out strErrorMessage);

            if (dicGrades == null)
                return new ResponseAccountUser(false, strErrorMessage);

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new ResponseAccountUser(false, "데이터베이스의 트랜잭션을 시작할 수 없습니다.");

            User user = new User();

            user.grad_sn = data.Grade;
            user.memo = data.Memo;
            user.password = "";
            user.password_salt = LoadManager.MakeSalt();
            user.rgl_memb_sn = data.RegularMemberNo;
            user.site_sn = data.SiteNo;
            user.user_id = data.UserID;
            user.user_name = data.NickName;

            int no;

            if (dataManager.GetCreate().Insert<User>(user, out no, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAccountUser(false, strErrorMessage);
            }

            JoinManager joinManager = new JoinManager(dataManager);

            string strCondition = string.Format("a.{0} = {1}", User.Fields.user_sn, no);
            ArrayList arrDatas = joinManager.JoinUserRegularMemberRegular(strCondition, 1, null, out strErrorMessage);

            if (arrDatas == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAccountUser(false, strErrorMessage);
            }

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-3;i+=4)
            {
                if (arrDatas[i + 1] is User && (arrDatas[i + 2] == null || arrDatas[i + 2] is RegularMember) && (arrDatas[i + 3] == null || arrDatas[i + 3] is Regular))
                {
                    User _user = (User)arrDatas[i + 1];
                    RegularMember member = (RegularMember)arrDatas[i + 2];
                    Regular regular = (Regular)arrDatas[i + 3];

                    Dictionary<int, string> dicJobLevels = null;
                    Dictionary<int, string> dicJobPositions = null;
                    RequestUserList request = new RequestUserList(null, 1, null, data.SiteNo, true, true, true, true, true, true, true, true);

                    AccountUser accountUser = MakeAccountUser(_user, member, regular, request, dicGrades, ref dicJobLevels, ref dicJobPositions, out strErrorMessage);

                    if (accountUser == null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new ResponseAccountUser(false, strErrorMessage);
                    }

                    if (dataManager.BatchCommit(out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new ResponseAccountUser(false, "데이터베이스의 트랜잭션이 정상적으로 종료되지 못하였습니다.");
                    }

                    if (userCreator != null && passwordPolicy != null)
                    {
                        if (userCreator.SetDefaultPassword(processManager, dataManager, passwordPolicy, _user.user_sn, _user.user_id, _user.rgl_memb_sn, _user.password_salt, out strErrorMessage) == false)
                            return new ResponseAccountUser(false, strErrorMessage);
                    }

                    ResponseAccountUser response = new ResponseAccountUser(true, "");
                    response.User = accountUser;
                    return response;
                }
            }

            string temp;
            dataManager.BatchRollback(out temp);
            return new ResponseAccountUser(false, "데이터베이스에 사용자 정보가 정상적으로 입력되지 못하였습니다.");
        }

        public MessageResult ChangePassword(RequestChangePassword data)
        {
            MessageResult result = null;

            if (data.Value != "" || data.Key != "")
            {
                try
                {
                    string str = AesHelper.Decrypt(data.Value, data.Key);

                    int nIndex1 = str.IndexOf('|');
                    int nIndex2 = str.IndexOf('|', nIndex1 + 1);

                    if (nIndex1 > 0 && nIndex2 > 0)
                    {
                        string strUserNo = str.Substring(0, nIndex1).Trim();
                        string strPW = str.Substring(nIndex1 + 1, nIndex2 - nIndex1 - 1).Trim();
                        string strNewPW = str.Substring(nIndex2 + 1).Trim();
                        int nUserNo = -1;

                        if (!int.TryParse(strUserNo, out nUserNo))
                        {
                            result = new MessageResult();
                            result.Success = false;
                        }

                        result = ChangePassword(nUserNo, strPW, strNewPW);
                    }
                    else
                    {
                        result = new MessageResult(false, "잘못된 Parameter 입니다.");
                    }
                }
                catch (Exception e)
                {
                    result = new MessageResult(false, e.Message);
                }
            }
            else
            {
                result = new MessageResult(false, "잘못된 Parameter 호출입니다.");
            }

            return result;
        }

        private MessageResult ChangePassword(int userNo, string strPW, string strNewPW)
        {
            MessageResult result = new MessageResult();

            string strErrorMessage = null;
            string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, userNo);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (user.password != strPW)
            {
                result.Success = false;
                result.Message = "기존 비밀번호가 맞지 않습니다. 확인바랍니다.";
                return result;
            }

            user.password = strNewPW;
            user.password_key = null;

            if (m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage))
            {
                result.Success = true;
                return result;
            }

            result.Success = false;
            strErrorMessage = "비밀번호 업데이트를 실패하였습니다.";
            return result;
        }

        public string MakeRandomPassword(IPasswordPolicy passwordPolicy, int userNo, string strID, ref string strSalt, out string strErrorMessage)
        {
            string strPassword = MakeRandomPassword(passwordPolicy, out strErrorMessage);

            if (strPassword == null)
                return null;

            string strEncrypted = MakePassword(strID, strPassword, ref strSalt);

            if (UpdatePassword(userNo, strEncrypted, strSalt, out strErrorMessage) == false)
                return null;

            return strPassword;
        }

        private bool UpdatePassword(int userNo, string strPassword, string strSalt, out string strErrorMessage)
        {
            Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
            dicSets[User.Fields.password] = strPassword;
            dicSets[User.Fields.password_salt] = strSalt;

            string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, userNo);
            return m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strCondition, out strErrorMessage);
        }

        public MessageResult MakeTemporaryPasswordWithSMS(ProcessManager processManager, IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strPhoneNumber)
        {
            if (passwordPolicy == null)
                return new MessageResult(false, "비밀번호 정책이 지정되지 않았습니다.");
            else if (userCreator == null)
                return new MessageResult(false, "비밀번호 생성 모듈이 연결되지 않았습니다.");

            string strErrorMessage;

            if (userCreator.MakeTemporaryPasswordWithSMS(processManager, m_dataManager, passwordPolicy, strUserName, CheckValidPhoneNumber(strPhoneNumber), out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        // 전화번호에 '-'와 같은 숫자 이외의 정보가 있으면 모두 없애고 숫자만 남긴다.
        private string CheckValidPhoneNumber(string strPhoneNumber)
        {
            if (strPhoneNumber == null)
                return null;

            string phoneNumber = "";
            int len = strPhoneNumber.Length;

            for (int i=0;i<len;i++)
            {
                char ch = strPhoneNumber[i];

                if (ch >= '0' && ch <= '9')
                    phoneNumber += ch;
            }

            return phoneNumber;
        }

        public MessageResult MakeTemporaryPasswordWithEmail(ProcessManager processManager, IUserCreator userCreator, IPasswordPolicy passwordPolicy, string strUserName, string strEmail)
        {
            if (passwordPolicy == null)
                return new MessageResult(false, "비밀번호 정책이 지정되지 않았습니다.");
            else if (userCreator == null)
                return new MessageResult(false, "비밀번호 생성 모듈이 연결되지 않았습니다.");

            string strErrorMessage;

            if (userCreator.MakeTemporaryPasswordWithEmail(processManager, m_dataManager, passwordPolicy, strUserName, strEmail, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            return new MessageResult(true, "");
        }

        private string MakeRandomPassword(IPasswordPolicy passwordPolicy, out string strErrorMessage)
        {
            string strPassword = "";
            int len = 0;

            if (passwordPolicy.MinimumLength != null && passwordPolicy.MaximumLength != null)
                len = ((int)passwordPolicy.MinimumLength + (int)passwordPolicy.MaximumLength) / 2;
            else if (passwordPolicy.MinimumLength != null)
                len = (int)passwordPolicy.MinimumLength;
            else if (passwordPolicy.MaximumLength != null)
                len = (int)passwordPolicy.MaximumLength;
            else
                len = 12;

            int upperCase = 0;
            int lowerCase = 1;
            int number = 2;
            int charactor = 3;
            int typeCount = 4;

            if (CheckPasswordPolicyCount(passwordPolicy, ref charactor, ref typeCount, ref len, out strErrorMessage) == false)
                return null;

            const string strLower = "abcdefghijklmnopqrstuvwxyz";
            const string strUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string strNumber = "0123456789";
            int charactorCount = passwordPolicy.AllowCharacters.Count;

            int index;
            Random rand = new Random((int)DateTime.Now.Ticks);

            for (int i=0;i<len;i++)
            {
                if (i < typeCount)
                    index = i;
                else
                    index = rand.Next() % typeCount;

                if (index == upperCase)
                    strPassword += GetRandom(rand, strUpper, 26);
                else if (index == lowerCase)
                    strPassword += GetRandom(rand, strLower, 26);
                else if (index == number)
                    strPassword += GetRandom(rand, strNumber, 10);
                else if (index == charactor)
                    strPassword += GetRandom(rand, passwordPolicy.AllowCharacters, charactorCount);
            }

            return strPassword;
        }

        private bool CheckPasswordPolicyCount(IPasswordPolicy passwordPolicy, ref int charactor, ref int typeCount, ref int len, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (passwordPolicy.AllowCharacters.Count == 0)
            {
                charactor = -1;
                typeCount--;
            }

            if (typeCount == 0)
            {
                strErrorMessage = "잘못된 비밀번호 정책입니다.";
                return false;
            }

            if (typeCount > len)
            {
                if (passwordPolicy.MaximumLength == null)
                    len = typeCount;
                else if ((int)passwordPolicy.MaximumLength < typeCount)
                {
                    strErrorMessage = "잘못된 비밀번호 정책입니다. 허용 가능한 최대 길이가 정책과 맞지 않습니다.";
                    return false;
                }
                else
                    len = typeCount;
            }

            return true;
        }

        private char GetRandom(Random rand, List<char> src, int count)
        {
            int index = rand.Next() % count;
            return src[index];
        }

        private char GetRandom(Random rand, string strSrc, int count)
        {
            int index = rand.Next() % count;
            return strSrc[index];
        }

        private string MakePassword(string strID, string strPW, ref string strSalt)
        {
            if (strSalt == null || strSalt.Length == 0)
                strSalt = LoadManager.MakeSalt();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strPW + strSalt);
            byte[] hashed = System.Security.Cryptography.SHA256.Create().ComputeHash(bytes);

            string strHashed = "";

            foreach (byte b in hashed)
            {
                strHashed += string.Format("{0:x2}", b);
            }

            return strHashed;
        }
    }
}
