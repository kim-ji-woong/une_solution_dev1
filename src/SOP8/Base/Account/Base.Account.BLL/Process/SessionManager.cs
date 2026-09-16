using System;
using System.Collections;
using Base.Account.IBLL.Response;
using Base.Account.IBLL.Models;
using Base.Model.Account;
using Base.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Response.Resource;

namespace Base.Account.BLL.Process
{
    using Resource;

    class SessionManager
    {
        private const int SessionSeconds = 300;

        public static LoginResult CheckLoginSession(IDataManager dataManager, int nUserNo, string strSessionKey)
        {
            LoginResult result = new LoginResult();

            try
            {
                string strErrorMessage;
                string strCondition = string.Format("a.{0} = {1}", Session.Fields.user_sn, nUserNo);

                JoinManager joinManager = new JoinManager(dataManager);
                ArrayList arrDatas = joinManager.JoinSessionUserGrade(strCondition, out strErrorMessage);

                if (arrDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);

                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("failToReadSession").Value();
                    return result;
                }
                else if (arrDatas.Count == 0)
                {
                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("noneSession").Value();
                    return result;
                }
                else
                {
                    int nDataCount = arrDatas.Count;

                    for (int i=0;i<nDataCount-2;i+=3)
                    {
                        if (arrDatas[i] is Session && arrDatas[i + 1] is User && arrDatas[i + 2] is Grade)
                        {
                            Session session = arrDatas[i] as Session;
                            User user = arrDatas[i + 1] as User;
                            Grade grade = arrDatas[i + 2] as Grade;

                            if (session.session_key == strSessionKey)
                            {
                                // 자동 로그인 확인 여부
                                if (session.atmc_login_yn == false)
                                {   // 자동 로그인이 아니라면
                                    // 마지막 Session 업데이트 시간 체크(현 시간으로부터 300초 이내인지)
                                    DateTime dtSession = session.updt_de;
                                    DateTime dtNow = DateTime.Now;

                                    TimeSpan diffTime = dtNow - dtSession;
                                    double dSecond = diffTime.TotalSeconds;

                                    if (dSecond > SessionSeconds)
                                    {
                                        result.Success = false;
                                        result.Message = ID.Get<ErrorMessage>("logoutSession").Value();
                                        return result;
                                    }
                                    else
                                    {
                                        session.updt_de = DateTime.Now;

                                        if (dataManager.GetUpdate().Update<Session>(session, null, out strErrorMessage) == false)
                                        {
                                            result.Success = false;
                                            result.Message = ID.Get<ErrorMessage>("failToUpdateSession").Value();
                                        }
                                    }
                                }

                                result.Success = true;
                                result.Message = ID.Get<ErrorMessage>("validSession").Value();
                                result.User = ApplicationUser.MakeUser(user, grade, session.session_key);

                                return result;
                            }
                            else
                            {
                                result.Success = false;
                                result.Message = ID.Get<ErrorMessage>("anotherOneLogin").Value();
                                return result;
                            }
                        }
                    }

                    result.Success = false;
                    result.Message = ID.Get<ErrorMessage>("noneSession").Value();
                }
            }
            catch (Exception e)
            {
                result.Success = false;
                result.Message = e.Message;
            }

            return result;
        }
    }
}
