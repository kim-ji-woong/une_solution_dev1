using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.Model.Account;
using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.IO;
using DCOP.DAL;
using System.Collections;

namespace DCOP.BLL
{
    using Models.Request;
    using Models.Response;
    using Models.Account;

    public class AccountManager
    {
        // LoginFailLimit 이상 로그인 실패시(비밀번호 잘못 입력) 계정을 잠근다.(사용할수 없도록 한다.)
        private const int LoginFailLimit = 5;
        // 계정을 잠그는 시간
        private const int LockLoginMinutes = 30;

        public const string LoginFailMessage = "ID 또는 비밀번호를 잘못 입력하였습니다.";

        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public AccountManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_processManager = processManager;
        }

        public LoginResult Login(string strUserID, string strPW, string strSessionKey, string strExternalLoginURL, bool autoLogin)
        {
            LoginResult result = null;
            User user = null;
            Level level = null;
            string strErrorMessage = null;

            if (strExternalLoginURL != null && strExternalLoginURL.Length > 0)
            {
                result = ExternalLogin(strUserID, strPW, strExternalLoginURL, strSessionKey, autoLogin, out user, out level);

                if (result.Success == false)
                    return result;
                else if (result.User == null)
                {
                    result.Success = false;
                    result.Message = LoginFailMessage;
                    //result.Message = "해당 ID를 가진 유저 정보를 찾을 수 없습니다.";
                }

                return result;
            }
            else
            {
                result = new LoginResult();

                // ID 값으로 유저를 검색
                string strCondition = string.Format("{0} = '{1}'", User.Fields.UserID, strUserID);
                user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

                if (user == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage == null ? LoginFailMessage : strErrorMessage;
                    return result;
                }
                
                if (CheckLoginFailCount(user, null, out strErrorMessage) == false)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }

                if (user.Password != strPW)
                {
                    if (SetLoginFailCount(user, out strErrorMessage))
                    {
                        strErrorMessage = LoginFailMessage;
                        //strErrorMessage = "비밀번호가 일치하지 않습니다.";
                    }

                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }

                /*UserData userData = m_dataManager.GetSelectManager().SelectAccountUserData(user.ID, out strErrorMessage);

                if (userData == null)
                    return new LoginResult(false, "계정에 대한 부가정보가 입력되지 않았습니다.");
                else if (userData.Activate == false)
                    return new LoginResult(false, "비활성화 상태인 계정입니다. 관리자에게 문의하세요.");*/
            }

            if (UpdateSession(user.AccountUserNo, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            string strCondition2 = string.Format("{0} = {1}", Level.Fields.AccountLevelNo, user.AccountLevelNo);
            level = m_dataManager.GetSelect().SelectFirst<Level>(strCondition2, out strErrorMessage);

            if (level == null)
            {
                result.Success = false;
                result.Message = strErrorMessage == null ? "사용자 계정등급을 확인할 수 없습니다." : strErrorMessage;
                return result;
            }

            // 로그인 성공 시 PasswordCode 초기화
            user.PasswordCode = null;
            if (m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = "PasswordCode 초기화 실패";
                return result;
            }

            /*ResponseAccountUserData userInfo = GetAccountUserData(user.ID);

            if (userInfo.Success == false)
            {
                result.Message = userInfo.Message;
                result.Success = false;
                return result;
            }*/

            result.User = ApplicationUser.MakeUser(user, level, /*userInfo.User.UserData, userInfo.User.DataCenters,*/ strSessionKey);

            /*LoginResult.LoginState loginState;
            Model.Site.Data siteData;

            if (CheckSiteLicense(userInfo.User.UserData.SiteID, out loginState, out siteData, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                result.State = (int)loginState;
                return result;
            }*/

            result.Success = true;
            //result.User.SiteData = siteData;
            //result.State = (int)loginState;

            //if (loginState != LoginResult.LoginState.Login)
            //    result.Message = strErrorMessage;

            return result;
        }

        private bool UpdateSession(int nUserNo, string strSessionKey, bool autoLogin, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 유저 세션 유무 확인
            string strCondition = string.Format("{0} = {1}", Session.Fields.AccountUserNo, nUserNo);

            IEnumerable<Session> sessions = m_dataManager.GetSelect().Select<Session>(strCondition, out strErrorMessage);
            if (sessions == null)
                return false;

            // 있으면 삭제 후 생성, 없으면 생성
            if (IsEmpty(sessions) == false)
            {
                strCondition = string.Format("{0} = {1}", Session.Fields.AccountUserNo, nUserNo);

                if (!m_dataManager.GetDelete().Delete<Session>(strCondition, out strErrorMessage))
                    return false;
            }

            DateTime dtNow = DateTime.Now;

            Session _session = new Session();
            _session.AccountUserNo = nUserNo;
            _session.CreateTime = dtNow;
            _session.SessionKey = strSessionKey;
            _session.UpdateTime = dtNow;

            return m_dataManager.GetCreate().Insert<Session>(_session, out strErrorMessage);
        }

        private bool IsEmpty<DataType>(IEnumerable<DataType> datas)
        {
            foreach (var data in datas)
            {
                return false;
            }

            return true;
        }

        private DataType GetFirst<DataType>(IEnumerable<DataType> datas) where DataType : class
        {
            foreach (var data in datas)
            {
                return data;
            }

            return null;
        }

        private bool SetLoginFailCount(User user, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool changed = false;
            int nFailCount = 0;

            if (user.PasswordCode != null)
            {
                int nIndex = user.PasswordCode.IndexOf('_');

                if (nIndex > 0)
                {
                    string strFailCount = user.PasswordCode.Substring(0, nIndex).Trim();

                    if (int.TryParse(strFailCount, out nFailCount))
                    {
                        nFailCount++;
                        DateTime dtNow = DateTime.Now;

                        user.PasswordCode = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
                        changed = true;

                        if (nFailCount >= LoginFailLimit)
                            strErrorMessage = string.Format("{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 로그인 할수 없습니다.", LoginFailLimit, LockLoginMinutes);
                    }
                }
            }

            if (changed == false)
            {
                nFailCount = 1;
                DateTime dtNow = DateTime.Now;
                user.PasswordCode = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
            }

            if (nFailCount < LoginFailLimit)
            {
                strErrorMessage = string.Format("ID 또는 비밀번호를 잘못 입력하였습니다. ({0}/{1}회)\r\n연속으로 {1}회 이상 로그인에 실패하면 {2}분동안 해당 계정으로 로그인 할 수 없습니다.", nFailCount, LoginFailLimit, LockLoginMinutes);
            }

            m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage);
            return strErrorMessage == null;
        }

        private bool CheckLoginFailCount(User user, string strTarget, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (user.PasswordCode == null)
                return true;

            int nIndex = user.PasswordCode.IndexOf('_');

            if (nIndex <= 0)
                return true;

            if (strTarget == null)
                strTarget = "로그인";

            string strFailCount = user.PasswordCode.Substring(0, nIndex).Trim();
            string strLastFailTime = user.PasswordCode.Substring(nIndex + 1).Trim();

            int nFailCount;
            long lastFailTime;

            if (int.TryParse(strFailCount, out nFailCount) && long.TryParse(strLastFailTime, out lastFailTime))
            {
                // 로그인 실패횟수가 허용치를 초과한 경우
                if (nFailCount >= LoginFailLimit)
                {
                    DateTime lastTime = DateTime.FromBinary(lastFailTime);
                    TimeSpan span = DateTime.Now - lastTime;

                    if (span.TotalMinutes <= LockLoginMinutes)
                    {
                        int minutes = (int)(LockLoginMinutes - span.TotalMinutes + 0.9999);
                        strErrorMessage = string.Format("{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 {2} 할수 없습니다.", LoginFailLimit, minutes, strTarget);
                        return false;
                    }
                    else
                    {
                        // LockLoginMinutes를 지났을 경우 초기화한다.
                        user.PasswordCode = null;
                        m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage);
                    }
                }
            }

            return true;
        }

        private LoginResult ExternalLogin(string strUserID, string strPW, string strExternalLoginURL, string strSessionKey, bool autoLogin, out User user, out Level level)
        {
            user = null;
            level = null;

            JObject jsonData = new JObject();

            jsonData.Add("userID", strUserID);
            jsonData.Add("hashCode", strPW);

            JObject json = new JObject();
            json.Add("externalLogin", jsonData);

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

                return GetExternalLoginResult(strResult, strSessionKey, autoLogin);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            result.Success = false;
            result.Message = strErrorMessage;
            return result;
        }

        private static string MakeSalt()
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

        private LoginResult GetExternalLoginResult(string strResult, string strSessionKey, bool autoLogin = false)
        {
            string strErrorMessage;
            string strUserID, strUserName, strTeamName;
            bool success = GetJsonResult(JObject.Parse(strResult), out strUserID, out strUserName, out strTeamName, out strErrorMessage);

            if (success == false)
                return new LoginResult(false, strErrorMessage);

            LoginResult result = new LoginResult();

            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(null, out strErrorMessage);

            if (levels == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            Level level = GetFirst(levels);

            if (level == null)
            {
                result.Success = false;
                result.Message = "Account Level이 존재하지 않습니다.";
                return result;
            }

            // ID 조회 
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.UserID] = strUserID;

            string strCondition = string.Format("{0} = '{1}'", User.Fields.UserID, strUserID);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null && strErrorMessage != null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }
            else if (user == null)
            {   // 없으면 새로 생성
                User _user = new User();
                _user.NickName = strUserName;
                _user.Password = "";
                _user.Salt = MakeSalt();
                _user.AccountLevelNo = level.AccountLevelNo;
                _user.UserID = strUserID;

                int no;

                if (m_dataManager.GetCreate().Insert<User>(_user, out no, out strErrorMessage) == false)
                {
                    result.Success = false;
                    result.Message = "External 계정 생성 실패";
                    return result;
                }
                else
                {
                    user = _user;
                    user.AccountUserNo = no;
                }
            }

            strCondition = string.Format("{0} = {1}", Level.Fields.AccountLevelNo, user.AccountLevelNo);
            level = m_dataManager.GetSelect().SelectFirst<Level>(strCondition, out strErrorMessage);

            if (level == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            if (UpdateSession(user.AccountUserNo, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            ApplicationUser loginUser = new ApplicationUser();
            loginUser.No = user.AccountUserNo;
            loginUser.LevelNo = level.AccountLevelNo;
            loginUser.NickName = strUserName;
            loginUser.UserID = strUserID;
            loginUser.SessionKey = strSessionKey;
            loginUser.UserLevel = level;

            result.Success = true;
            result.Message = "";
            result.User = loginUser;
            return result;
        }

        private bool GetJsonResult(JObject json, out string strUserID, out string strUserName, out string strTeamName, out string strErrorMessage)
        {
            strUserID = strUserName = strTeamName = null;
            strErrorMessage = null;

            if (json == null)
                return false;

            JToken tokenName = json.GetValue("name");
            JToken tokenUserID = json.GetValue("userID");
            JToken tokenTeamName = json.GetValue("teamName");
            JToken tokenMessage = json.GetValue("message");
            JToken tokenSuccess = json.GetValue("success");

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();

            if (tokenName == null || tokenUserID == null)
                return false;

            strUserID = tokenUserID.Value<string>();
            strUserName = tokenName.Value<string>();

            if (tokenTeamName != null)
                strTeamName = tokenTeamName.Value<string>();

            if (tokenSuccess != null)
            {
                string strSuccess = tokenSuccess.Value<string>().ToLower();

                if (strSuccess == "true")
                    return true;
            }

            return false;
        }

        public string RequestSalt(RequestLoginKey data, out string strErrorMessage)
        {
            string strCondition = "";

            if (data.Num != null && data.UserID != null)
                strCondition = string.Format("{0} = '{1}'", User.Fields.UserID, data.UserID);
            else
            {
                strErrorMessage = "Parameter가 부족합니다.";
                return null;
            }

            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null && strErrorMessage != null)
                return null;
            else if (user == null)
            {
                return MakeSalt();
            }

            return user.Salt;
        }

        public LoginResult CheckLoginSession(int nUserNo, string strSessionKey)
        {
            LoginResult result = new LoginResult();

            try
            {
                Dictionary<Session.Fields, object> dicConditions = new Dictionary<Session.Fields, object>();
                dicConditions[Session.Fields.AccountUserNo] = nUserNo;

                string strErrorMessage = null;
                string strAdditionalConditions = string.Format("a.{0} = {1}", Session.Fields.AccountUserNo, nUserNo);
                ArrayList arrResult = JoinManager.JoinSessionUserLevel(m_dataManager, strAdditionalConditions, out strErrorMessage);

                if (arrResult == null)
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
                else if (arrResult.Count == 0)
                {
                    result.Success = false;
                    result.Message = "해당 유저 Session은 존재하지 않습니다.";
                    return result;
                }
                else
                {
                    if (arrResult[0] is Session &&
                        arrResult[1] is User &&
                        arrResult[2] is Level)
                    {
                        Session session = arrResult[0] as Session;
                        User user = arrResult[1] as User;
                        Level level = arrResult[2] as Level;
                        
                        if (session.SessionKey == strSessionKey)
                        {
                            // 마지막 Session 업데이트 시간 체크(현 시간으로부터 300초 이내인지)
                            DateTime dtSession = session.UpdateTime;
                            DateTime dtNow = DateTime.Now;

                            TimeSpan diffTime = dtNow - dtSession;
                            double dSecond = diffTime.TotalSeconds;

                            if (dSecond > 300)
                            {
                                result.Success = false;
                                result.Message = "로그아웃 되었습니다.";
                                return result;
                            }
                            else
                            {
                                session.UpdateTime = dtNow;
                                m_dataManager.GetUpdate().Update<Session>(session, null, out strErrorMessage);
                            }

                            result.Success = true;
                            result.Message = "해당 Session은 유효합니다.";
                            result.User = ApplicationUser.MakeUser(user, level, session.SessionKey);

                            return result;
                        }
                        else
                        {
                            result.Success = false;
                            result.Message = "다른 곳에서 로그인하였습니다.";
                            return result;
                        }
                    }
                    else
                    {
                        result.Success = false;
                        result.Message = "해당 유저 Session은 존재하지 않습니다.";
                        return result;
                    }
                }
            }
            catch (Exception e)
            {
                result.Success = false;
                result.Message = e.Message;
            }

            return result;
        }

        public ResponseAccountLevels GetAccountLevels(RequestAccountLevels data)
        {
            string strErrorMessage;
            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountLevels(false, strErrorMessage);

            ResponseAccountLevels response = new ResponseAccountLevels(true, "");

            if (data.UserNo != null)
            {
                string strCondition = string.Format("{0} = {1}", User.Fields.AccountUserNo, (int)data.UserNo);
                User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

                if (user == null)
                {
                    if (strErrorMessage != null)
                        return new ResponseAccountLevels(false, strErrorMessage);
                    else
                        return new ResponseAccountLevels(false, "사용자 계정정보를 조회할 수 없습니다.");
                }

                foreach (Level level in levels)
                {
                    if (level.AccountLevelNo >= user.AccountLevelNo)
                        response.Levels.Add(level);
                }
            }

            response.Levels.AddRange(levels);
            return response;
        }

        public ResponseAccountLevels GetAccountLevels2(RequestAccountLevels2 data)
        {
            string strErrorMessage;
            IEnumerable<Level> levels = m_dataManager.GetSelect().Select<Level>(null, out strErrorMessage);

            if (levels == null)
                return new ResponseAccountLevels(false, strErrorMessage);

            string strCondition = string.Format("{0} = {1}", User.Fields.AccountUserNo, data.UserNo);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage != null)
                    return new ResponseAccountLevels(false, strErrorMessage);
                else
                    return new ResponseAccountLevels(false, "사용자 계정정보를 조회할 수 없습니다.");
            }

            ResponseAccountLevels response = new ResponseAccountLevels(true, "");

            if (user.AccountUserNo <= 2)
            {
                if (user.AccountLevelNo == 2)
                {
                    foreach (Level level in levels)
                    {
                        if (level.AccountLevelNo > user.AccountLevelNo)
                            response.Levels.Add(level);
                    }
                }
                else
                    response.Levels.AddRange(levels);
            }

            return response;
        }
    }
}
