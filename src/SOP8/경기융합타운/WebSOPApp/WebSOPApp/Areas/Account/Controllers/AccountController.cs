using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SOPManager.BLL;
using SOPManager.BLL.Models;
using SOPManager.BLL.Models.Request;
using SOPManager.BLL.Models.Response;
using System;
using System.Collections.Generic;
using System.Web;

namespace WebSOPApp.Areas.Account.Controllers
{
    [Area("Account")]
    public class AccountController : ControllerBase
    {
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

        private global::SOPManager.BLL.ProcessManager m_processManager = null;
        public AccountController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SDMS.IDAL.IDataManager sdmsDataManager)
        {
            m_processManager = new global::SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
        }

        // GET Account/Account/GetLoginKey
        [HttpGet]
        public string GetLoginKey(long num)
        {
            string strKey = AesHelper.MakeRandomKey(num);
            //SessionManager.SetData(HttpContext.Session, LoginKey, strKey);
            //byte[] bytes = Encoding.UTF8.GetBytes(strKey);
            //HttpContext.Session.Set(LoginKey, bytes);
            return strKey;
        }

        // POST Account/Account/RequestData
        [HttpPost]
        public IActionResult RequestData([FromBody] AccountData data)
        {
            if (data.Login != null)
                return Login(data.Login);
            else if (data.AutoLogin != null)
                return AutoLogin(data.AutoLogin);
            else if (data.GetAccountLevels != null)
                return GetAccountLevels();
            else if (data.GetAccountUsers != null)
                return GetAccountUsers(data.GetAccountUsers);
            else if (data.UpdateAccountUsers != null)
                return UpdateAccountUsers(data.UpdateAccountUsers);
            else if (data.UpdateAccountUsers2 != null)
                return UpdateAccountUsers2(data.UpdateAccountUsers2);
            else if (data.RemoveAccountUsers != null)
                return RemoveAccountUsers(data.RemoveAccountUsers);
            else if (data.ReRegisterAccountUsers != null)
                return ReRegisterAccountUsers(data.ReRegisterAccountUsers);
            else if (data.ChangePassword != null)
                return ChangePassword(data.ChangePassword);
            else if (data.CheckParamsCode != null)
                return CheckParamsCode(data.CheckParamsCode);
            else if (data.SetPassword != null)
                return SetPassword(data.SetPassword);
            else if (data.CheckLoginSession != null)
                return CheckLoginSession(data.CheckLoginSession);
            else if (data.RequestLoginKey != null)
                return RequestLoginKey(data.RequestLoginKey);

            return BadRequest();
        }

        private IActionResult RequestLoginKey(RequestLoginKey data)
        {
            ResponseLoginKey result = new ResponseLoginKey();
            bool isExternalLogin = IsExternalLogin();

            string strErrorMessage = null;
            string strSalt = isExternalLogin ? "abc" : m_processManager.GetAccountManager().RequestSalt(data, out strErrorMessage);

            if (strSalt == null || strSalt.Length == 0)
            {
                result.Success = false;
                result.Salt = "";
                result.ExternalLogin = isExternalLogin;

                if (strErrorMessage != null)
                    result.Message = strErrorMessage;
                else
                    result.Message = AccountManager.LoginFailMessage;
            }
            else
            {
                result.Success = true;
                result.Salt = strSalt;
                result.LoginKey = GetLoginKey((int)data.Num);
                result.ExternalLogin = isExternalLogin;
                result.Message = "";
            }

            return Ok(result);
        }

        private bool IsExternalLogin()
        {
            var siteOption = Startup.ConfigManager.Site;

            if (siteOption != null)
            {
                if (siteOption.ExternalLoginUrl != null && siteOption.ExternalLoginUrl.Length > 0)
                    return true;
            }

            return false;
        }

        private IActionResult Login(LoginData data)
        {
            LoginResult result = null;

            if (data.Value != "" || data.Key != "")
            {
                try
                {
                    string str = AesHelper.Decrypt(data.Value, data.Key);

                    int nIndex = str.IndexOf('|');

                    if (nIndex > 0)
                    {
                        string strID = str.Substring(0, nIndex).Trim();
                        string strPW = str.Substring(nIndex + 1).Trim();

                        // TODO: Config 파일에서 자동로그인 여부 확인 (추후에 로그인 페이지에 자동로그인 체크박스 값을 이용)
                        bool autoLogin = true;
                        var siteOption = Startup.ConfigManager.Site;

                        if (siteOption.AutoLogin != null &&
                            siteOption.AutoLogin == false)
                            autoLogin = false;

                        result = m_processManager.GetAccountManager().Login(strID, strPW, data.Key, data.IsFullVersion, siteOption.ExternalLoginUrl, autoLogin, null);
						

                        if (result.Success)
                        {
                            result.Message = "로그인에 성공하였습니다.";

                            /*if (result.User != null)
                                result.User.Options = Startup.ConfigManager.LoginOption;*/
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

            return Ok(result);
        }

        private IActionResult AutoLogin(AutoLoginData data)
        {
            LoginResult result = m_processManager.GetAccountManager().AutoLogin(data.BeginCode, Startup.ConfigManager.Site.ExternalLoginUrl, data.Key);

            /*if (result.Success && result.User != null)
                result.User.Options = Startup.ConfigManager.LoginOption;*/

            return Ok(result);
        }

        private IActionResult GetAccountLevels()
        {
            ResponseAccountLevels result = null;

            result = m_processManager.GetAccountManager().GetAccountLevels();

            return Ok(result);
        }

        private IActionResult GetAccountUsers(GetAccountUsers data)
        {
            ResponseAccountUsers result = null;

            result = m_processManager.GetAccountManager().GetAccountUsers(data.SiteID);

            return Ok(result);
        }

        private IActionResult UpdateAccountUsers(RequestAccountUser requestData)
        {
            MessageResult result = null;

            result = m_processManager.GetAccountManager().UpdateAccountUsers(requestData);

            return Ok(result);
        }

        private IActionResult UpdateAccountUsers2(RequestAccountUser requestData)
        {
            MessageResult result = null;

            result = m_processManager.GetAccountManager().UpdateAccountUsers2(requestData);

            return Ok(result);
        }

        private IActionResult RemoveAccountUsers(List<AccountUser> removeAccountUsers)
        {
            MessageResult result = null;

            result = m_processManager.GetAccountManager().RemoveAccountUsers(removeAccountUsers);

            return Ok(result);
        }

        private IActionResult ReRegisterAccountUsers(List<AccountUser> reRegisterAccountUsers)
        {
            MessageResult result = null;

            result = m_processManager.GetAccountManager().ReRegisterAccountUsers(reRegisterAccountUsers);

            return Ok(result);
        }

        private IActionResult ChangePassword(ChangePassword data)
        {
            MessageResult result = null;

            if (data.Value != "" || data.Key != "")
            {
                string str = AesHelper.Decrypt(data.Value, data.Key);
                int nIndex = str.IndexOf('|');

                if (nIndex > 0)
                {
                    string strPW = str.Substring(0, nIndex).Trim();
                    string strPwHash = str.Substring(nIndex + 1).Trim();

                    result = m_processManager.GetAccountManager().ChangePassword(data.Name, data.Data, strPW, strPwHash, data.Mode);

                }
                else
                {
                    result = new MessageResult();
                    result.Success = false;
                    result.Message = "전송된 데이터가 잘못 되었습니다.";
                }
            }
            else
            {
                result = new MessageResult();
                result.Success = false;
                result.Message = "전송된 데이터가 잘못 되었습니다.";
            }
                
            return Ok(result);
        }

        private IActionResult CheckParamsCode(CheckParamsCode data)
        {
            string strCode = HttpUtility.UrlDecode(data.Code);
            string strUserName, strUserID, strErrorMessage;
            int nID = -1;

            bool success = m_processManager.GetAccountManager().CheckParamsCode(strCode, out nID, out strUserName, out strUserID, out strErrorMessage);
            
            ResponseCheckParamsCode response = new ResponseCheckParamsCode();
            response.Success = success;
            response.Message = strErrorMessage;
            response.ID = nID;
            response.UserName = strUserName;
            response.UserID = strUserID;


            return Ok(response);
        }

        private IActionResult SetPassword(SetPassword data)
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
                        string strID = str.Substring(0, nIndex1).Trim();
                        string strPW = str.Substring(nIndex1 + 1, nIndex2 - nIndex1 -1).Trim();
                        string strNewPW = str.Substring(nIndex2 + 1).Trim();
                        int nID = -1;
                        
                        if (!int.TryParse(strID, out nID))
                        {
                            result = new MessageResult();
                            result.Success = false;
                        }

                        result = m_processManager.GetAccountManager().SetPassword(nID, strPW, strNewPW);
                    }
                    else
                    {
                        result = new MessageResult();
                        result.Success = false;
                    }
                }
                catch (Exception e)
                {
                    result = new MessageResult();
                    result.Message = e.Message;
                    result.Success = false;
                }
            }
            else
            {
                result = new MessageResult();
                result.Success = false;
            }

            return Ok(result);
        }

        private IActionResult CheckLoginSession(CheckLoginSession data)
        {
            //string strErrorMessage = "";
            //MessageResult result = new MessageResult();

            //bool success = m_processManager.GetAccountManager().CheckLoginSession(data.UserID, data.SessionKey, out strErrorMessage);
            //result.Success = success;
            //result.Message = strErrorMessage;
            LoginResult result = m_processManager.GetAccountManager().CheckLoginSession(data.UserID, data.SessionKey);

            /*if (result.User != null)
                result.User.Options = Startup.ConfigManager.LoginOption;*/

            return Ok(result);
        }
    }
}
