using System;
using Base.Account.IBLL.Request;
using Base.Account.IBLL.Response;
using System.Collections.Generic;
using Base.Model.Account;
using Base.Model.Common.Team;
using Base.Model.Common;
using Response.Resource;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace Base.Account.BLL.Process
{
    using Resource;
    using Login;

    class LoadManager
    {
        private const int KeySize = 32;
        private static char[] BaseArr = null;

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

        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseLoginKey GetLoginKey(RequestLoginKey data, bool isExternalLogin)
        {
            ResponseLoginKey result = new ResponseLoginKey();

            string strErrorMessage = null;
            string strSalt = isExternalLogin ? "abc" : GetSalt(data, out strErrorMessage);

            if (strSalt == null || strSalt.Length == 0)
            {
                result.Success = false;
                result.Salt = "";
                result.ExternalLogin = isExternalLogin;

                if (strErrorMessage != null)
                    result.Message = strErrorMessage;
                else
                    result.Message = ID.Get<ErrorMessage>("unknownUser").Value();
            }
            else
            {
                result.Success = true;
                result.Salt = strSalt;
                result.LoginKey = GetLoginKey(data.Num);
                result.ExternalLogin = isExternalLogin;
                result.Message = "";
            }

            return result;
        }

        public static string GetLoginKey(long? num)
        {
            string strKey = MakeRandomKey(num);
            return strKey;
        }

        public LoginResult Login(RequestLogin data, string strExternalLoginUrl, bool autoLogin)
        {
            LoginResult result = null;

            if (data.Value != "" || data.Key != "")
            {
                try
                {
                    string str = Decrypt(data.Value, data.Key);

                    int nIndex = str.IndexOf('|');

                    if (nIndex > 0)
                    {
                        string strID = str.Substring(0, nIndex).Trim();
                        string strPW = str.Substring(nIndex + 1).Trim();

                        result = Login(strID, strPW, data.Key, strExternalLoginUrl, autoLogin);

                        if (result.Success)
                        {
                            result.Message = ID.Get<ErrorMessage>("successToLogin").Value();
                        }
                    }
                    else
                    {
                        result = new LoginResult();
                        result.Success = false;
                    }
                }
                catch (Exception e)
                {
                    result = new LoginResult();
                    result.Message = e.Message;
                    result.Success = false;
                }
            }
            else
            {
                result = new LoginResult();
                result.Success = false;
            }

            return result;
        }

        private LoginResult Login(string strUserID, string strPW, string strSessionKey, string strExternalLoginURL, bool autoLogin)
        {
            LoginResult result = null;

            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0)
            {
                User user;
                Grade grade;
                ExternalLoginManager externalLoginManager = new ExternalLoginManager(m_dataManager);
                result = externalLoginManager.ExternalLogin(strUserID, strPW, strExternalLoginURL, strSessionKey, autoLogin, out user, out grade);

                if (result.Success == false)
                    return result;
                else if (result.User == null)
                {
                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("invalidUserInfo").Value();
                }

                return result;
            }
            else
            {
                LoginManager loginManager = new LoginManager(m_dataManager);
                result = loginManager.Login(strUserID, strPW, strSessionKey, autoLogin);
            }

            return result;
        }

        public ResponseSite GetAllSites()
        {
            string strErrorMessage;
            IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(null, out strErrorMessage);

            if (sites == null)
                return new ResponseSite(false, strErrorMessage);

            ResponseSite response = new ResponseSite(true, "");
            response.Sites.AddRange(sites);

            if (response.Sites.Count == 0)
                return new ResponseSite(false, "Site 정보가 없습니다.");
            else if (response.Sites.Count > 1)
                response.UseMultiSite = true;

            return response;
        }

        public static string MakeSalt()
        {
            int length = 50;
            string strChars = "0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

            int charLength = strChars.Length;
            string strData = "";

            Random rand = new Random((int)DateTime.Now.ToBinary());

            for (int i = 0; i < length; i++)
            {
                int index = rand.Next(0, charLength - 1);
                strData += strChars[index];
            }

            return strData;
        }

        private static string MakeRandomKey(long? num)
        {
            string strKey = "";

            if (BaseArr == null)
                BaseArr = MakeBaseArray();

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

        private string GetSalt(RequestLoginKey data, out string strErrorMessage)
        {
            string strCondition = "";
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();

            if (data.UserID != null)
                strCondition = string.Format("{0} = '{1}'", User.Fields.user_id, data.UserID);
            else if (data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.Email)
            {
                RegularMember member = GetRegularMember(data.Name, data.Data, null, out strErrorMessage);

                if (member == null)
                    return null;
                else
                    strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
            }
            else if (data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.PhoneNumber)
            {
                RegularMember member = GetRegularMember(data.Name, null, EncryptString(data.Data), out strErrorMessage);

                if (member == null)
                    return null;
                else
                    strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
            }
            else
            {
                strErrorMessage = ID.Get<ErrorMessage>("moreParameter").Value();
                return null;
            }

            IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

            if (users == null)
                return null;

            foreach (User user in users)
            {
                return user.password_salt;
            }

            strErrorMessage = ID.Get<ErrorMessage>("unknownUser").Value();
            return null;
        }

        private RegularMember GetRegularMember(string strName, string strEmail, string strPhoneNumber, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strCondition = string.Format("{0} = '{1}'", RegularMember.Fields.memb_name, strName);

            if (strEmail != null)
                strCondition += string.Format(" and {0} = '{1}'", RegularMember.Fields.email, strEmail);
            else if (strPhoneNumber != null)
                strCondition += string.Format(" and {0} = '{1}'", RegularMember.Fields.telno, strPhoneNumber);
            else
            {
                strEmail = ID.Get<ErrorMessage>("moreParameter").Value();
                return null;
            }

            IEnumerable<RegularMember> members = m_dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (members == null)
                return null;

            foreach (RegularMember member in members)
            {
                return member;
            }

            strErrorMessage = ID.Get<ErrorMessage>("unknownID").Value();
            return null;
        }

        public ResponseGradeList GetGradeList()
        {
            string strErrorMessage;
            IEnumerable<Grade> grades = m_dataManager.GetSelect().Select<Grade>(null, out strErrorMessage);

            if (grades == null)
                return new ResponseGradeList(false, strErrorMessage);

            ResponseGradeList response = new ResponseGradeList(true, "");

            foreach (Grade grade in grades)
            {
                response.Grades.Add(grade);
            }

            return response;
        }

        public static string EncryptString(string str)
        {
            if (str == null)
                return null;

            return dnsDapperDBUtil.AES256Cipher.AES_encrypt(str);
        }

        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return dnsDapperDBUtil.AES256Cipher.AES_decrypt(str);
        }

        private static string Decrypt(string input, string key)
        {
            byte[] inputBytes = HexStringToByteArray(input);
            byte[] keyBytes = Encoding.UTF8.GetBytes(key.Substring(0, 32));
            using (AesCryptoServiceProvider aesAlg = new AesCryptoServiceProvider())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = Encoding.UTF8.GetBytes(key.Substring(0, 16));

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (MemoryStream msEncrypt = new MemoryStream(inputBytes))
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srEncrypt = new StreamReader(csEncrypt))
                        {
                            return srEncrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        private static byte[] HexStringToByteArray(string s)
        {
            s = s.Replace(" ", "");
            byte[] buffer = new byte[s.Length / 2];
            for (int i = 0; i < s.Length; i += 2)
                buffer[i / 2] = (byte)Convert.ToByte(s.Substring(i, 2), 16);
            return buffer;
        }
    }
}
