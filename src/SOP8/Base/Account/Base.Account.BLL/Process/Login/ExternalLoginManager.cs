using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Account;
using Base.Account.IBLL.Models;
using Base.Account.IBLL.Response;
using Newtonsoft.Json.Linq;
using System.IO;
using Response.Resource;

namespace Base.Account.BLL.Process.Login
{
    using Resource;

    class ExternalLoginManager
    {
        private IDataManager m_dataManager = null;

        public ExternalLoginManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public LoginResult ExternalLogin(string strUserID, string strPW, string strExternalLoginURL, string strSessionKey, bool autoLogin, out User user, out Grade grade)
        {
            user = null;
            grade = null;

            JObject json = new JObject();
            json.Add("account", strUserID);
            json.Add("password", strPW);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strExternalLoginURL));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";
            string strErrorMessage = null;
            LoginResult result = new LoginResult();

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                return GetExternalLoginResult(strResult, strUserID, strSessionKey, autoLogin);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            result.Success = false;
            result.Message = strErrorMessage;
            return result;
        }

        private LoginResult GetExternalLoginResult(string strResult, string strUserID, string strSessionKey, bool autoLogin = false)
        {
            string strErrorMessage;
            string strUserName, strTeamName;
            bool success = GetJsonResult(JObject.Parse(strResult), out strUserName, out strTeamName, out strErrorMessage);

            if (success == false)
                return new LoginResult(false, strErrorMessage);

            LoginResult result = new LoginResult();

            IEnumerable<Grade> grades = m_dataManager.GetSelect().Select<Grade>(null, out strErrorMessage);

            if (grades == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            Grade grade = null;

            foreach (Grade _grade in grades)
            {
                grade = _grade;
                break;
            }

            if (grade == null)
            {
                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("noneUserLevel").Value();
                return result;
            }

            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.user_id] = strUserID;

            string strCondition = string.Format("{0} = '{1}'", User.Fields.user_id, strUserID);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return new LoginResult(false, ID.Get<ErrorMessage>("unknownUser").Value());
                }
                else
                {
                    // 없으면 새로 생성
                    user = new User();

                    user.grad_sn = grade.grad_sn;
                    user.password = "";
                    user.user_id = strUserID;
                    user.user_name = strUserName;
                    user.password_salt = LoadManager.MakeSalt();
                    user.site_sn = GetFirstSiteNo();

                    int addedID;

                    if (m_dataManager.GetCreate().Insert<User>(user, out addedID, out strErrorMessage) == false)
                    {
                        System.Diagnostics.Trace.WriteLine(strErrorMessage);

                        result.Success = false;
                        result.Message = ID.Get<ErrorMessage>("failToCreateUser").Value();
                        return result;
                    }

                    user.user_sn = addedID;
                }
            }

            grade = null;

            foreach (Grade _grade in grades)
            {
                if (user.grad_sn < 0)
                {
                    grade = _grade;
                    break;
                }
                else
                {
                    if (_grade.grad_sn == user.grad_sn)
                    {
                        grade = _grade;
                        break;
                    }
                }
            }

            if (grade == null)
            {
                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("noneUserLevel").Value();
                return result;
            }

            if (LoginManager.UpdateSession(m_dataManager, user.user_sn, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);

                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("failToSession").Value();
                return result;
            }

            ApplicationUser loginUser = new ApplicationUser();
            loginUser.user_sn = user.user_sn;
            loginUser.grad_name = grade.grad_name;
            loginUser.grad_sn = grade.grad_sn;
            loginUser.user_name = strUserName;
            loginUser.user_id = strUserID;
            loginUser.session_key = strSessionKey;
            loginUser.site_sn = user.site_sn;
            loginUser.RegularMemberNo = user.rgl_memb_sn;

            result.Success = true;
            result.Message = "";
            result.User = loginUser;
            return result;
        }

        private int? GetFirstSiteNo()
        {
            string strErrorMessage;
            IEnumerable<Model.Common.Site> sites = m_dataManager.GetSelect().Select<Model.Common.Site>(null, out strErrorMessage);

            if (sites == null)
            {
                System.Diagnostics.Trace.WriteLine("GetFirstSiteNo Fail : " + strErrorMessage);
                return null;
            }

            foreach (var site in sites)
            {
                return site.site_sn;
            }

            return null;
        }

        private bool GetJsonResult(JObject json, out string strUserName, out string strTeamName, out string strErrorMessage)
        {
            strUserName = strTeamName = null;
            strErrorMessage = null;

            if (json == null)
                return false;

            JToken tokenUser = json.GetValue("user");

            JToken tokenName = ((JObject)tokenUser).GetValue("user_name");
            JToken tokenTeamName = ((JObject)tokenUser).GetValue("user_division");
            JToken tokenSuccess = json.GetValue("success");

            if (tokenName == null || tokenTeamName == null)
                return false;

            strUserName = tokenName.Value<string>();

            if (tokenTeamName != null)
                strTeamName = tokenTeamName.Value<string>();

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                    return true;
            }

            strErrorMessage = "ID 또는 비밀번호를 확인하세요.";
            return false;
        }
    }
}
