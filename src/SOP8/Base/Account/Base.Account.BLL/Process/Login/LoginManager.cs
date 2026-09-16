using System;
using System.Collections.Generic;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Models;
using Base.Model.Account;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response.Resource;

namespace Base.Account.BLL.Process.Login
{
    using Resource;

    class LoginManager
    {
        // LoginFailLimit 이상 로그인 실패시(비밀번호 잘못 입력) 계정을 잠근다.(사용할수 없도록 한다.)
        private const int LoginFailLimit = 5;
        // 계정을 잠그는 시간
        private const int LockLoginMinutes = 30;

        private IDataManager m_dataManager = null;

        public LoginManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public LoginResult Login(string strUserID, string strPW, string strSessionKey, bool autoLogin)
        {
            Grade grade = null;
            string strErrorMessage = null;

            LoginResult result = new LoginResult();

            // ID 값으로 유저를 검색
            string strCondition = string.Format("{0} = '{1}'", User.Fields.user_id, strUserID);
            User user = m_dataManager.GetSelect().SelectFirst<User>(strCondition, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("unknownUser").Value();
                    return result;
                }
                else
                {
                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("invalidUserInfo").Value();
                    return result;
                }
            }

            if (CheckLoginFailCount(user, null, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            if (user.password != strPW)
            {
                if (SetLoginFailCount(user, out strErrorMessage))
                {
                    if (strErrorMessage == null)
                        strErrorMessage = ID.Get<ErrorMessage>("invalidUserInfo").Value();
                }

                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            if (UpdateSession(m_dataManager, user.user_sn, strSessionKey, autoLogin, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            strCondition = string.Format("{0} = {1}", Grade.Fields.grad_sn, user.grad_sn);
            grade = m_dataManager.GetSelect().SelectFirst<Grade>(strCondition, out strErrorMessage);

            if (grade == null)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("noneUserLevel").Value();
                return result;
            }

            // 로그인 성공 시 PasswordCode 초기화
            Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
            dicSets[User.Fields.password_key] = null;

            strCondition = string.Format("{0} = {1}", User.Fields.user_sn, user.user_sn);

            if (m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                result.Success = false;
                result.Message = ID.Get<ErrorMessage>("failToInitLoginFail").Value();
                return result;
            }

            result.User = ApplicationUser.MakeUser(user, grade, strSessionKey);
            result.Success = true;
            return result;
        }

        public static bool UpdateSession(IDataManager dataManager, int nUserNo, string strSessionKey, bool autoLogin, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 해당 계정 세션 유무 확인
            string strCondition = string.Format("{0} = {1}", Session.Fields.user_sn, nUserNo);
            Session session = dataManager.GetSelect().SelectFirst<Session>(strCondition, out strErrorMessage);

            if (session == null)
            {
                if (strErrorMessage != null)
                    return false;
            }
            else
            {
                // 있으면 삭제 후 생성, 없으면 생성
                strCondition = string.Format("{0} = {1}", Session.Fields.user_sn, nUserNo);

                if (dataManager.GetDelete().Delete<Session>(strCondition, out strErrorMessage) == false)
                    return false;
            }

            session = new Session();

            session.user_sn = nUserNo;
            session.session_key = strSessionKey;
            session.creat_de = DateTime.Now;
            session.updt_de = session.creat_de;
            session.atmc_login_yn = autoLogin;

            if (dataManager.GetCreate().Insert<Session>(session, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CheckLoginFailCount(User user, string strTarget, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (user.password_key == null)
                return true;

            int nIndex = user.password_key.IndexOf('_');

            if (nIndex <= 0)
                return true;

            if (strTarget == null)
                strTarget = "로그인";

            string strFailCount = user.password_key.Substring(0, nIndex).Trim();
            string strLastFailTime = user.password_key.Substring(nIndex + 1).Trim();

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
                        strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("lockFail").Value(), LoginFailLimit, minutes, strTarget);
                        return false;
                    }
                    else
                    {
                        // LockLoginMinutes를 지났을 경우 초기화한다.
                        user.password_key = null;


                        Dictionary<User.Fields, object> dicSets = new Dictionary<User.Fields, object>();
                        dicSets[User.Fields.password_key] = null;

                        string strCondition = string.Format("{0} = {1}", User.Fields.user_sn, user.user_sn);
                        
                        if (m_dataManager.GetUpdate().Update<User, User.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                        {
                            System.Diagnostics.Trace.WriteLine(strErrorMessage);
                            strErrorMessage = ID.Get<ErrorMessage>("failToInitLoginFail").Value();
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        private bool SetLoginFailCount(User user, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool changed = false;
            int nFailCount = 0;

            if (user.password_key != null)
            {
                int nIndex = user.password_key.IndexOf('_');

                if (nIndex > 0)
                {
                    string strFailCount = user.password_key.Substring(0, nIndex).Trim();

                    if (int.TryParse(strFailCount, out nFailCount))
                    {
                        nFailCount++;
                        DateTime dtNow = DateTime.Now;

                        user.password_key = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
                        changed = true;

                        if (nFailCount >= LoginFailLimit)
                            strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("lockLoginFail").Value(), LoginFailLimit, LockLoginMinutes);
                    }
                }
            }

            if (changed == false)
            {
                nFailCount = 1;
                DateTime dtNow = DateTime.Now;
                user.password_key = string.Format("{0}_{1}", nFailCount, dtNow.ToBinary());
            }

            if (nFailCount < LoginFailLimit)
            {
                strErrorMessage = string.Format(ID.Get<ErrorMessageFormat>("lockLoginFail2").Value(), nFailCount, LoginFailLimit, LockLoginMinutes);
            }

            if (m_dataManager.GetUpdate().Update<User>(user, null, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                strErrorMessage = ID.Get<ErrorMessage>("failToUpdateLoginFail").Value();
            }

            return strErrorMessage == null;
        }
    }
}
